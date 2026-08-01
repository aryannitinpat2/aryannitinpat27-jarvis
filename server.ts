import express from "express";
import http from "http";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Modality, LiveServerMessage } from "@google/genai";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = 3000;

// Initialization helper for GoogleGenAI client
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "undefined" || apiKey === "null" || apiKey === "YOUR_API_KEY") {
    const err: any = new Error("GEMINI_API_KEY environment variable is missing or empty.");
    err.code = "MISSING_KEY";
    err.status = 500;
    throw err;
  }
  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export type GeminiErrorCode =
  | "CONNECTED"
  | "MISSING_KEY"
  | "INVALID_KEY"
  | "KEY_NOT_LOADED"
  | "QUOTA_EXCEEDED"
  | "TEMPORARY_SERVICE_ERROR"
  | "NETWORK_UNAVAILABLE"
  | "UNKNOWN_ERROR";

function classifyGeminiError(error: any): { code: GeminiErrorCode; statusCode: number; message: string; userAction?: string } {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "undefined" || apiKey === "null" || apiKey === "YOUR_API_KEY") {
    return {
      code: "MISSING_KEY",
      statusCode: 500,
      message: "GEMINI_API_KEY environment variable is missing or not configured.",
      userAction: "Provide GEMINI_API_KEY in environment variables or Settings > Secrets."
    };
  }

  const errorStr = String(error?.message || error?.stack || error || "");
  const status = error?.status || error?.statusCode || error?.response?.status;

  if (
    status === 401 ||
    status === 403 ||
    errorStr.includes("401") ||
    errorStr.includes("403") ||
    errorStr.includes("UNAUTHENTICATED") ||
    errorStr.includes("ACCESS_TOKEN_TYPE_UNSUPPORTED") ||
    errorStr.includes("PERMISSION_DENIED") ||
    errorStr.includes("invalid authentication credentials")
  ) {
    return {
      code: "INVALID_KEY",
      statusCode: 401,
      message: "Gemini API authentication failed (invalid key or unsupported credentials).",
      userAction: "Check that your GEMINI_API_KEY in Settings > Secrets is a valid Google AI Studio key."
    };
  }

  if (status === 400 && (errorStr.includes("API_KEY_INVALID") || errorStr.includes("API key not valid") || errorStr.includes("invalid key") || errorStr.includes("INVALID_ARGUMENT"))) {
    return {
      code: "INVALID_KEY",
      statusCode: 400,
      message: "The configured Gemini API key is invalid or unrecognized.",
      userAction: "Verify and replace your GEMINI_API_KEY with a valid Google AI Studio key."
    };
  }

  if (status === 429 || errorStr.includes("429") || errorStr.includes("RESOURCE_EXHAUSTED") || errorStr.includes("Quota exceeded")) {
    return {
      code: "QUOTA_EXCEEDED",
      statusCode: 429,
      message: "Gemini API rate limit or daily quota has been exceeded.",
      userAction: "Wait a few moments for the quota window to reset."
    };
  }

  if (status === 503 || status === 500 || errorStr.includes("503") || errorStr.includes("UNAVAILABLE") || errorStr.includes("OVERLOADED") || errorStr.includes("High load")) {
    return {
      code: "TEMPORARY_SERVICE_ERROR",
      statusCode: 503,
      message: "Gemini servers are currently experiencing high load or temporary service disruption.",
      userAction: "The system will automatically retry transient requests shortly."
    };
  }

  if (errorStr.includes("ENOTFOUND") || errorStr.includes("ECONNREFUSED") || errorStr.includes("fetch failed") || errorStr.includes("NetworkError") || errorStr.includes("ETIMEDOUT")) {
    return {
      code: "NETWORK_UNAVAILABLE",
      statusCode: 504,
      message: "Unable to reach Gemini API servers due to network connection issues.",
      userAction: "Check network connection or firewall settings."
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    statusCode: status || 500,
    message: error?.message || "An unexpected error occurred while communicating with Gemini API.",
    userAction: "Review server diagnostic details."
  };
}

// Robust retry helper with exponential backoff for Gemini API calls
async function callGeminiWithRetry<T>(fn: () => Promise<T>, retries = 2, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const errorStr = String(error?.message || error || "");
    const status = error?.status || error?.statusCode;

    // Do NOT retry non-transient errors (400 invalid key, 401/403 auth, 429 quota)
    if (status === 400 || status === 401 || status === 403 || status === 429 ||
        errorStr.includes("429") || errorStr.includes("RESOURCE_EXHAUSTED") ||
        errorStr.includes("API_KEY_INVALID") || errorStr.includes("PERMISSION_DENIED")) {
      throw error;
    }

    const isRetryable =
      status === 503 ||
      status === 504 ||
      errorStr.includes("503") ||
      errorStr.includes("UNAVAILABLE") ||
      errorStr.includes("ETIMEDOUT") ||
      errorStr.includes("fetch failed");

    if (retries > 0 && isRetryable) {
      console.warn(`[Gemini Retry] API call failed with retryable error (${status || 'transient'}). Retrying in ${delay}ms... (${retries} attempts left). Error: ${errorStr}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return callGeminiWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

// Helper to sanitize multimodal parts (e.g. inlineData base64 strings and persistent storage URLs)
function sanitizeParts(parts: any[]): any[] {
  if (!Array.isArray(parts)) return [];
  const result: any[] = [];

  parts.forEach((part) => {
    if (part.storageUrl || part.storage_url) {
      const url = part.storageUrl || part.storage_url;
      result.push({ text: `[Attachment Firebase Storage Persistent Upload URL: ${url}]` });
    }

    const inline = part.inlineData || part.inline_data;
    if (inline) {
      let mimeType = inline.mimeType || "image/png";
      let rawData = inline.data || "";

      if (typeof rawData === "string") {
        // Strip data URL scheme prefix if present
        if (rawData.includes(";base64,")) {
          rawData = rawData.split(";base64,").pop() || "";
        } else if (rawData.startsWith("data:")) {
          rawData = rawData.split(",").pop() || "";
        }

        // Clean out placeholder ellipses or whitespace
        rawData = rawData.replace(/\.\.\./g, "").trim();

        // Check if rawData is valid base64 or plain text (like CSV)
        const base64Regex = /^[A-Za-z0-9+/=]+$/;
        if (!base64Regex.test(rawData) || rawData.length % 4 !== 0) {
          // Convert plain text or invalid base64 to clean base64 string
          rawData = Buffer.from(rawData, "utf-8").toString("base64");
        }
      } else {
        rawData = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
      }

      result.push({
        inlineData: {
          mimeType,
          data: rawData,
        },
      });
    } else if (part.text) {
      result.push({ text: String(part.text) });
    } else {
      result.push(part);
    }
  });

  return result;
}

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Startup & Diagnostics status route for Gemini API initialization
app.get("/api/gemini/status", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return res.json({
      status: "MISSING_KEY",
      connected: false,
      keyLoaded: false,
      statusCode: 500,
      message: "Gemini API key is missing or empty in environment configuration.",
      userAction: "Provide GEMINI_API_KEY in environment variables or project secrets.",
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const client = getGeminiClient();
    // Lightweight validation check with minimal tokens
    await client.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: [{ parts: [{ text: "ping" }] }],
      config: { maxOutputTokens: 1 },
    });

    return res.json({
      status: "CONNECTED",
      connected: true,
      keyLoaded: true,
      statusCode: 200,
      maskedKey: apiKey.length > 8 ? `${apiKey.substring(0, 4)}...${apiKey.slice(-4)}` : "Set",
      model: "gemini-3.6-flash",
      message: "Gemini API connected and initialized successfully.",
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    const classified = classifyGeminiError(err);
    return res.json({
      status: classified.code,
      connected: false,
      keyLoaded: true,
      statusCode: classified.statusCode,
      message: classified.message,
      userAction: classified.userAction,
      details: err.message || String(err),
      timestamp: new Date().toISOString(),
    });
  }
});

// API route to chat with Jarvis
app.post("/api/gemini/chat", async (req, res) => {
  const { message, history, currentTime, preferredLanguage, humorMode, memory, parts, mode } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is not configured in the environment.",
      code: "MISSING_KEY",
      userAction: "Configure GEMINI_API_KEY in environment or AI Studio Secrets."
    });
  }

  try {
    // Format conversation history for Gemini
    const contents: any[] = [];
    
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        contents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        });
      });
    }

    // Append current user message with support for multimodal parts (text + attachments)
    if (parts && Array.isArray(parts) && parts.length > 0) {
      contents.push({
        role: "user",
        parts: sanitizeParts(parts),
      });
    } else {
      contents.push({
        role: "user",
        parts: [{ text: message || "Hello Jarvis" }],
      });
    }

    const parsedTime = currentTime ? new Date(currentTime) : new Date();
    const hours = parsedTime.getHours();
    let timePeriod = "day";
    if (hours >= 5 && hours < 12) timePeriod = "morning";
    else if (hours >= 12 && hours < 17) timePeriod = "afternoon";
    else if (hours >= 17 && hours < 21) timePeriod = "evening";
    else timePeriod = "night";

    const systemInstruction = `
      You are Jarvis, a permanent, voice-first digital assistant, productivity partner, and digital butler.
      You operate locally on the user's Android phone.
      
      YOUR PERSONALITY PROFILE:
      - Always calm, highly intelligent, respectful, professional, friendly, confident, efficient, patient, and reliable.
      - NEVER arrogant. Never sarcastic unless the Humor Mode configuration is enabled (current Humor Mode: ${humorMode ? "ENABLED - you may use subtle, dry wit or playful humor" : "DISABLED - speak purely with respectful professional butler tone"}).
      - Do not fabricate information. Clearly explain limitations.

      GREETING STYLE:
      - When greeted first or starting a conversational thread, greet naturally depending on context:
        - Morning: "Good morning. You have three meetings today." or "Good morning. I'm ready whenever you are."
        - Afternoon: "Good afternoon. Welcome back."
        - Evening/Night: "Good evening. I've prepared your daily summary." or "Good evening. Standing by for instructions."
      - If the user says "Hi Jarvis" or "Hey Jarvis", reply conversationally (e.g. "Hello. How can I help you today?", "Hi. What would you like to do?", "Good to see you. What's our first task?") rather than repeating the same phrase.

      CONVERSATION STYLE:
      - Speak like an experienced executive assistant: concise, informative, and polite.
      - AVOID robotic, cold confirmations.
        - Instead of: "Task completed." -> PREFER: "I've created the reminder for tomorrow at 9:00 AM." or "I've scheduled that for you."
        - Instead of: "Opening Gmail." -> PREFER: "Opening Gmail now."
        - Instead of: "Cannot perform action." -> PREFER: "I can't perform that automatically because Android requires your approval. I've prepared everything for you."

      ACTIVE LISTENING & SESSION CONTROLS:
      - Maintain conversational continuity. Encourage multi-turn dialogue where appropriate (e.g., asking clarifying details for reminders or meetings).
      - If the user says "Hey Jarvis" alone, answer "I'm listening." or "Yes. I'm ready." and wait for their next sentence.

      MULTILINGUAL BEHAVIOR:
      - Fully support English, Marathi (मराठी) and Hindi (हिंदी).
      - Automatically detect the language of the user's input (English, Marathi, or Hindi).
      - ALWAYS reply in the exact same language (and script) that the user used (unless preferredLanguage is explicitly specified).
      - Examples:
        - Hindi input: "कल सुबह का अलार्म लगाओ" -> Reply in Hindi script (हिंदी).
        - Marathi input: "टॉर्च चालू करा" -> Reply in Marathi script (मराठी).
      - Language transition must feel completely seamless and natural.

      CLARIFICATION STRATEGY:
      - Never guess if ambiguity could lead to unintended action.
      - If the user request is ambiguous or is a high-impact action (deleting data, making a purchase, sending emails to contacts, calling without a clear name), ask concise clarifying questions before proceeding.

      USER LONG-TERM MEMORY:
      - Respect user preferences stored in long-term memory.
      - Saved Memories: ${JSON.stringify(memory || {})}
      - Ensure you mention or respect these saved details where relevant.

      INTENTS ENGINE:
      You can trigger simulated Android intents by selecting the correct 'intent' string and filling the associated 'intentData' properties.
      
      Supported intents:
      - OPEN_GMAIL: When the user wants to email or draft an email. Put 'recipient', 'subject', and 'body' in 'intentData'.
      - SET_REMINDER: When the user wants to set a reminder or alarm. Put 'time' (e.g. "3:30 PM") and 'body' (the reminder text) in 'intentData'.
      - TOGGLE_FLASHLIGHT: When user asks to turn on or off the flashlight/torch. Put 'status' ("on" or "off") in 'intentData'.
      - OPEN_CALENDAR: When user wants to schedule an event or check calendar. Put 'time' and 'subject' in 'intentData'.
      - SHOW_WEATHER: When the user asks about the weather. Put 'query' (the location, e.g. "San Francisco, CA") in 'intentData'.
      - SEARCH_WEB: When the user asks general questions that require searching or web lookup. Put 'query' in 'intentData'.
      - PLAY_MUSIC: When user asks to play music or a song. Put 'query' (e.g., song name or artist) in 'intentData'.
      - NONE: For general conversations or when no clear system action is requested.

      Current system time: ${currentTime || new Date().toISOString()}
    `;

    // Check if attachments contain image data or if vision mode requested
    const hasImageAttachment = parts && Array.isArray(parts) && parts.some((p: any) => p.inlineData?.mimeType?.startsWith("image/"));

    // Determine target Gemini Model & Config based on requested mode & input types
    let targetModel = "gemini-3.6-flash";
    let extraConfig: any = {};

    if (hasImageAttachment || mode === "vision") {
      targetModel = "gemini-3.1-pro-preview";
    } else if (mode === "thinking") {
      targetModel = "gemini-3.1-pro-preview";
      extraConfig.thinkingConfig = { thinkingLevel: "HIGH" };
    } else if (mode === "fast") {
      targetModel = "gemini-3.1-flash-lite";
    } else if (mode === "search") {
      targetModel = "gemini-3.6-flash";
      extraConfig.tools = [{ googleSearch: {} }];
    } else if (mode === "maps") {
      targetModel = "gemini-3.6-flash";
      extraConfig.tools = [{ googleMaps: {} }];
    } else if (mode === "live") {
      targetModel = "gemini-3.6-flash";
    }

    const client = getGeminiClient();
    const fallbackModels = [targetModel, "gemini-3.1-flash-lite", "gemini-2.5-flash"].filter(
      (m, idx, self) => self.indexOf(m) === idx
    );

    let response: any = null;
    let usedModel = targetModel;
    let lastError: any = null;

    for (const currentModel of fallbackModels) {
      try {
        response = await callGeminiWithRetry(() =>
          client.models.generateContent({
            model: currentModel,
            contents,
            config: {
              systemInstruction,
              temperature: 0.7,
              responseMimeType: "application/json",
              ...extraConfig,
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  response: {
                    type: Type.STRING,
                    description: "The natural voice response spoken by Jarvis.",
                  },
                  intent: {
                    type: Type.STRING,
                    description: "The simulated Android intent to trigger.",
                    enum: [
                      "OPEN_GMAIL",
                      "SET_REMINDER",
                      "TOGGLE_FLASHLIGHT",
                      "OPEN_CALENDAR",
                      "SHOW_WEATHER",
                      "SEARCH_WEB",
                      "PLAY_MUSIC",
                      "NONE",
                    ],
                  },
                  intentData: {
                    type: Type.OBJECT,
                    description: "Optional payload properties depending on the intent.",
                    properties: {
                      recipient: { type: Type.STRING, description: "Email recipient or name" },
                      subject: { type: Type.STRING, description: "Email subject or calendar event subject" },
                      body: { type: Type.STRING, description: "Email body or reminder content" },
                      time: { type: Type.STRING, description: "Time of alarm, reminder, or meeting" },
                      query: { type: Type.STRING, description: "Weather location, search term, or song name" },
                      status: { type: Type.STRING, description: "Flashlight status ('on' or 'off')" },
                    },
                  },
                },
                required: ["response", "intent"],
              },
            },
          })
        );
        usedModel = currentModel;
        lastError = null;
        break;
      } catch (err: any) {
        lastError = err;
        const errStr = String(err?.message || err || "");
        const errStatus = err?.status || err?.statusCode;
        if (
          errStatus === 429 ||
          errStatus === 503 ||
          errStr.includes("429") ||
          errStr.includes("RESOURCE_EXHAUSTED") ||
          errStr.includes("Quota exceeded") ||
          errStr.includes("OVERLOADED")
        ) {
          console.warn(`[Gemini Fallback] Model ${currentModel} rate limited/quota exceeded. Trying fallback model...`);
          continue;
        }
        throw err;
      }
    }

    if (!response && lastError) {
      throw lastError;
    }

    const resultText = response.text || "{}";
    const parsedResult = JSON.parse(resultText.trim());

    // Extract grounding chunks if present (Search or Maps)
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks && Array.isArray(groundingChunks)) {
      parsedResult.groundingSources = groundingChunks
        .map((chunk: any) => chunk?.web?.uri || chunk?.web?.title || chunk?.maps?.uri || chunk?.maps?.title)
        .filter(Boolean);
    }
    
    parsedResult.usedModel = targetModel;
    res.json(parsedResult);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    const classified = classifyGeminiError(error);
    res.status(classified.statusCode).json({
      error: classified.message,
      code: classified.code,
      userAction: classified.userAction,
      details: error.message || String(error),
    });
  }
});

// Premium TTS Endpoint powered by gemini-3.1-flash-tts-preview
app.post("/api/gemini/tts", async (req, res) => {
  const { text, voiceName } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is not configured in the environment.",
    });
  }

  if (!text) {
    return res.status(400).json({ error: "Text is required for TTS." });
  }

  try {
    const client = getGeminiClient();

    const response = await callGeminiWithRetry(() =>
      client.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: text }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: voiceName || "Zephyr",
              },
            },
          },
        },
      })
    );

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.json({ audio: null, fallback: true, message: "No audio returned from cloud model. On-device fallback active." });
    }

    res.json({ audio: base64Audio });
  } catch (error: any) {
    const errorStr = String(error.message || error);
    console.info(`[Gemini TTS Notice] Cloud TTS unavailable (${errorStr.includes("429") || errorStr.includes("RESOURCE_EXHAUSTED") ? "Quota Limit" : "Service Notice"}). Activating on-device Web Speech synthesis fallback.`);
    return res.json({
      audio: null,
      fallback: true,
      message: "Cloud TTS quota limit reached; local on-device TTS synthesizer active.",
    });
  }
});

// Audio Transcription Endpoint powered by gemini-3.6-flash
app.post("/api/gemini/transcribe", async (req, res) => {
  const { audioBase64, mimeType } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is not configured in the environment.",
    });
  }

  if (!audioBase64) {
    return res.status(400).json({ error: "audioBase64 is required for transcription." });
  }

  try {
    const client = getGeminiClient();
    const fallbackModels = ["gemini-3.6-flash", "gemini-3.1-flash-lite", "gemini-2.5-flash"];
    let response: any = null;
    let usedModel = "gemini-3.6-flash";
    let lastError: any = null;

    for (const currentModel of fallbackModels) {
      try {
        response = await callGeminiWithRetry(() =>
          client.models.generateContent({
            model: currentModel,
            contents: [
              {
                parts: [
                  {
                    inlineData: {
                      mimeType: mimeType || "audio/webm",
                      data: audioBase64,
                    },
                  },
                  {
                    text: "Please transcribe this audio input accurately into plain text. Return only the transcribed text without extra formatting or preamble.",
                  },
                ],
              },
            ],
          })
        );
        usedModel = currentModel;
        lastError = null;
        break;
      } catch (err: any) {
        lastError = err;
        const errStr = String(err?.message || err || "");
        const errStatus = err?.status || err?.statusCode;
        if (
          errStatus === 429 ||
          errStatus === 503 ||
          errStr.includes("429") ||
          errStr.includes("RESOURCE_EXHAUSTED") ||
          errStr.includes("Quota exceeded")
        ) {
          console.warn(`[Gemini Transcribe Fallback] Model ${currentModel} rate limited. Trying fallback...`);
          continue;
        }
        throw err;
      }
    }

    if (!response && lastError) {
      throw lastError;
    }

    const text = response.text || "";
    res.json({ transcription: text.trim(), model: usedModel });
  } catch (error: any) {
    console.error("Gemini Transcription Error:", error);
    res.status(500).json({
      error: "Failed to transcribe audio.",
      details: error.message || error,
    });
  }
});

// WebSocket Server for Gemini Live API (gemini-3.1-flash-live-preview)
const wss = new WebSocketServer({ server, path: "/live" });

wss.on("connection", async (clientWs) => {
  console.log("[Live API] Client connected to real-time voice session");
  let session: any = null;

  try {
    const client = getGeminiClient();
    session = await client.live.connect({
      model: "gemini-3.1-flash-live-preview",
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
        },
        systemInstruction: "You are Jarvis, an intelligent voice-first digital assistant. Speak naturally, politely, and concisely.",
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          const text = message.serverContent?.modelTurn?.parts?.[0]?.text;
          if (audio || text) {
            clientWs.send(JSON.stringify({ audio, text }));
          }
          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ interrupted: true }));
          }
        },
        onerror: (err) => {
          console.error("[Live API Session Error]", err);
          try {
            clientWs.send(JSON.stringify({ error: err.message || "Live API session error" }));
          } catch (e) {}
        },
        onclose: () => {
          console.log("[Live API] Session closed");
        },
      },
    });

    clientWs.on("message", (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.audio && session) {
          session.sendRealtimeInput({
            audio: { data: parsed.audio, mimeType: "audio/pcm;rate=16000" },
          });
        } else if (parsed.text && session) {
          session.sendRealtimeInput({
            text: parsed.text,
          });
        }
      } catch (err) {
        console.error("[Live API WS Message Error]", err);
      }
    });

    clientWs.on("close", () => {
      if (session) {
        try { session.close(); } catch (err) {}
      }
    });
  } catch (err: any) {
    console.error("[Live API Connection Error]", err);
    try {
      clientWs.send(JSON.stringify({ error: err.message || "Failed to initialize Live API connection" }));
      clientWs.close();
    } catch (e) {}
  }
});

// Serve Vite in development / static assets in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Jarvis development server running on http://localhost:${PORT}`);
  });
}

startServer();
