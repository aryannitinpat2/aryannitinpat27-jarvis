import React, { useState, useEffect, useRef } from "react";
import { auth, googleProvider, signInWithGoogle, signOutUser, onAuthStateChanged, db, collection, addDoc, getDocs, query, orderBy, User, uploadAttachmentToFirebase } from "./lib/firebase";
import {
  Smartphone,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Battery,
  Wifi,
  Signal,
  Zap,
  ZapOff,
  Mail,
  Calendar,
  CloudSun,
  Clock,
  Music,
  Search,
  Settings,
  Terminal,
  ArrowLeft,
  Check,
  Plus,
  Compass,
  BookOpen,
  Cpu,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Trash2,
  RefreshCw,
  Power,
  ChevronRight,
  Sparkles,
  Volume1,
  ShieldCheck,
  Dumbbell,
  ListTodo,
  Sun,
  Moon,
  X,
  Eye,
  Maximize2,
  Minimize2,
  Heart,
  AlertTriangle,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  FileText,
  Image,
  Languages,
  Palette,
  Fingerprint,
  Network,
  Boxes,
  Workflow,
  KeyRound,
  Unlock,
  Sliders,
  Radio,
  PhoneCall,
  PhoneOff,
  Bot,
  BrainCircuit,
  MapPin,
  AudioWaveform,
  Download,
  Archive,
  Activity,
  Layers,
  Camera,
  Video,
  Folder,
  Clipboard,
  Phone,
  MessageSquare,
  Brain,
  User as UserIcon,
  Home,
  Globe,
  HardDrive
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleWorkspacePanel } from "./components/GoogleWorkspacePanel";

import {
  AndroidIntent,
  IntentData,
  Message,
  FrameworkLog,
  ActiveApp,
  DeviceState,
  AssistantLifecycleState
} from "./types";
import {
  JARVIS_SPEC_PART_1,
  JARVIS_SPEC_PART_2,
  JARVIS_SPEC_PART_3,
  JARVIS_SPEC_PART_4,
  JARVIS_SPEC_PART_5,
  JARVIS_SPEC_PART_6,
  JARVIS_SPEC_PART_7,
  JARVIS_SPEC_PART_8,
  JARVIS_SPEC_PART_9,
  JARVIS_SPEC_PART_10,
  JARVIS_SPEC_PART_11,
  JARVIS_SPEC_PART_12,
  JARVIS_SPEC_PART_13,
  JARVIS_SPEC_PART_14,
  KOTLIN_PROJECT_BLUEPRINT,
  INITIAL_LOGS,
  DEMO_PROMPTS,
  DemoPrompt
} from "./data";

export default function App() {
  // Device System State
  const [deviceState, setDeviceState] = useState<DeviceState>({
    batteryLevel: 88,
    isCharging: false,
    flashlightOn: false,
    networkConnected: true,
    systemTime: "",
    microphoneGranted: true, // defaults to true for smooth simulator start
    wakeWordActive: true,
    cpuLoad: 12,
    memoryUsage: "2.8 GB / 8.0 GB",
    assistantOpen: false,
    isListening: false,
    isProcessing: false,
    speechMuted: false,
    lifecycleState: "WAKE_LISTENING"
  });

  // Navigation & Screens
  const [activeScreen, setActiveScreen] = useState<ActiveApp>("homescreen");
  const [logs, setLogs] = useState<FrameworkLog[]>(INITIAL_LOGS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [activeTab, setActiveTab] = useState<"logs" | "architecture">("logs");
  const [architectureSubTab, setArchitectureSubTab] = useState<string>("part1");
  const [selectedKotlinFile, setSelectedKotlinFile] = useState<number>(0);

  // Part 13 & 14 Custom States
  const [isDILoading, setIsDILoading] = useState<boolean>(false);
  const [diValidationLog, setDiValidationLog] = useState<string>("All Hilt components registered in active classpath. Waiting for manual validation.");
  const [isQAChecking, setIsQAChecking] = useState<boolean>(false);
  const [qaStatus, setQaStatus] = useState<string>("Tap 'Run Autonomous QA Review' to inspect live performance budgets.");
  const [checkedQaItems, setCheckedQaItems] = useState<string[]>([
    "compile", "no_placeholders", "no_leak", "opt_in", "secure_keystore", "accessibility"
  ]);
  const [simulatedCpuLoad, setSimulatedCpuLoad] = useState<number>(4.2);
  const [simulatedWarmBoot, setSimulatedWarmBoot] = useState<number>(310);

  // Part 4 State Machine Simulator States
  const [simState, setSimState] = useState<AssistantLifecycleState>("WAKE_LISTENING");
  const [simFeedback, setSimFeedback] = useState<string>("Awaiting wake phrase 'Hey Jarvis' or click individual pipeline nodes.");
  const [followUpTimer, setFollowUpTimer] = useState<number>(0);
  const [wakeSensitivity, setWakeSensitivity] = useState<number>(0.85);
  const [followUpTimeout, setFollowUpTimeout] = useState<number>(5);
  const [activationSoundEnabled, setActivationSoundEnabled] = useState<boolean>(true);
  const [activeSpeechText, setActiveSpeechText] = useState<string>("");

  // Part 5 Conversational Brain Simulator States
  const [part5Provider, setPart5Provider] = useState<"Gemini" | "OpenAI" | "Anthropic" | "Local">("Gemini");
  const [part5LanguageMode, setPart5LanguageMode] = useState<"Auto" | "English" | "Hindi" | "Marathi">("Auto");
  const [part5DetectedLanguage, setPart5DetectedLanguage] = useState<string>("English");
  const [part5ActivePipelineStep, setPart5ActivePipelineStep] = useState<number>(-1);
  const [part5SessionTurns, setPart5SessionTurns] = useState<Array<{ sender: "user" | "jarvis"; text: string; lang?: string }>>([
    { sender: "jarvis", text: "Hello! Speak Hindi, Marathi, or English. I'll automatically adapt.", lang: "en" }
  ]);
  const [part5IsInterrupted, setPart5IsInterrupted] = useState<boolean>(false);
  const [part5ConfirmationPending, setPart5ConfirmationPending] = useState<boolean>(false);
  const [part5ConfirmationPendingAction, setPart5ConfirmationPendingAction] = useState<string>("");
  const [part5ReasoningChecklist, setPart5ReasoningChecklist] = useState({
    isConversation: false,
    isDeviceCommand: false,
    isAutomation: false,
    isConnector: false,
    clarificationNeeded: false,
    confirmationRequired: false,
    canUseOfflineApi: false
  });

  const part5IsInterruptedRef = useRef(false);
  const part5ConfirmationPendingRef = useRef(false);
  const part5UserConfirmedRef = useRef<boolean | null>(null);

  // Part 6 Dashboard & Assistant UI States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [jarvisTab, setJarvisTab] = useState<"home" | "chat" | "memory" | "automations" | "profile">("home");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        addFrameworkLog("info", "FirebaseAuth", `User authenticated securely: ${user.email || user.uid}`);
      } else {
        addFrameworkLog("info", "FirebaseAuth", "User session unauthenticated / guest mode.");
      }
    });
    return () => unsubscribe();
  }, []);
  const [appTheme, setAppTheme] = useState<"dark" | "light" | "high-contrast">("dark");
  const [isOverlayMinimized, setIsOverlayMinimized] = useState<boolean>(false);
  const [jarvisAppLaunched, setJarvisAppLaunched] = useState<boolean>(true);

  // AI Model Selector Mode & Live API Voice Conversation States
  const [aiModelMode, setAiModelMode] = useState<"default" | "live" | "thinking" | "fast" | "search" | "maps" | "vision">("live");
  const [showLiveVoiceCallModal, setShowLiveVoiceCallModal] = useState<boolean>(false);
  const [isLiveVoiceListening, setIsLiveVoiceListening] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [liveModelSpeaking, setLiveModelSpeaking] = useState<boolean>(false);
  const [liveVoiceMuted, setLiveVoiceMuted] = useState<boolean>(false);
  const liveRecognitionRef = useRef<any>(null);

  // Gemini API Connection State & Initialization Layer
  type GeminiStatusCode =
    | "CHECKING"
    | "CONNECTED"
    | "MISSING_KEY"
    | "INVALID_KEY"
    | "KEY_NOT_LOADED"
    | "NETWORK_UNAVAILABLE"
    | "TEMPORARY_SERVICE_ERROR"
    | "QUOTA_EXCEEDED";

  interface GeminiApiConnectionState {
    status: GeminiStatusCode;
    connected: boolean;
    keyLoaded: boolean;
    message: string;
    userAction?: string;
    maskedKey?: string;
    model?: string;
    lastChecked: string | null;
  }

  const [geminiStatus, setGeminiStatus] = useState<GeminiApiConnectionState>({
    status: "CHECKING",
    connected: false,
    keyLoaded: false,
    message: "Initializing Gemini API connection check...",
    lastChecked: null,
  });
  const [showGeminiSetupModal, setShowGeminiSetupModal] = useState<boolean>(false);

  const checkGeminiConnection = async (silent = false) => {
    if (!silent) {
      setGeminiStatus((prev) => ({ ...prev, status: "CHECKING", message: "Testing Gemini API connection..." }));
    }
    try {
      const res = await fetch("/api/gemini/status");
      if (!res.ok) {
        setGeminiStatus({
          status: "NETWORK_UNAVAILABLE",
          connected: false,
          keyLoaded: false,
          message: "Unable to reach Jarvis server status endpoint.",
          userAction: "Verify local dev server status on port 3000.",
          lastChecked: new Date().toLocaleTimeString(),
        });
        addFrameworkLog("error", "GeminiAPI", `Server route /api/gemini/status returned HTTP ${res.status}`);
        return;
      }

      const data = await res.json();
      const status: GeminiStatusCode = data.status || (data.connected ? "CONNECTED" : "MISSING_KEY");
      setGeminiStatus({
        status,
        connected: !!data.connected,
        keyLoaded: !!data.keyLoaded,
        maskedKey: data.maskedKey,
        model: data.model || "gemini-3.6-flash",
        message: data.message || "Gemini status updated",
        userAction: data.userAction,
        lastChecked: new Date().toLocaleTimeString(),
      });

      if (data.connected) {
        addFrameworkLog("info", "GeminiAPI", `Gemini API initialized (${data.maskedKey || "Key Active"}, Model: ${data.model || "gemini-3.6-flash"}).`);
      } else {
        addFrameworkLog("error", "GeminiAPI", `Gemini API Status: ${status} - ${data.message}`);
      }
    } catch (err: any) {
      setGeminiStatus({
        status: "NETWORK_UNAVAILABLE",
        connected: false,
        keyLoaded: false,
        message: "Network connection offline or server unreachable.",
        userAction: "Check device internet connection or server availability.",
        lastChecked: new Date().toLocaleTimeString(),
      });
      addFrameworkLog("error", "GeminiAPI", `Failed connection check: ${err.message}`);
    }
  };

  useEffect(() => {
    checkGeminiConnection();
  }, []);

  // Gemini 3.5 Flash Audio Transcription States & Refs
  const [isRecordingAudioForTranscribe, setIsRecordingAudioForTranscribe] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Agenda State
  const [agendaTasks, setAgendaTasks] = useState<Array<{ id: string; time: string; title: string; category: string; completed: boolean }>>([
    { id: "a1", time: "09:00 AM", title: "Daily Sync Meeting with Product Team", category: "work", completed: false },
    { id: "a2", time: "11:30 AM", title: "Review Jarvis Mobile Design Guidelines", category: "work", completed: true },
    { id: "a3", time: "02:00 PM", title: "Review Android 14 Foreground SDKs", category: "research", completed: false },
    { id: "a4", time: "04:30 PM", title: "Deploy beta application packages", category: "ops", completed: false },
    { id: "a5", time: "06:00 PM", title: "Evening running session (3km)", category: "fitness", completed: false }
  ]);
  const [newAgendaTask, setNewAgendaTask] = useState("");
  const [newAgendaTime, setNewAgendaTime] = useState("10:00 AM");

  // Journal State
  const [journalEntries, setJournalEntries] = useState<Array<{ id: string; date: string; title: string; content: string; mood: string; tags: string[]; isVoice: boolean }>>([
    {
      id: "j1",
      date: "Jul 20, 2026",
      title: "Designing Jarvis Butler Personality",
      content: "Spent the morning defining conversational guidelines for Jarvis. We want him to sound polite yet secure, resembling an efficient and highly trustworthy digital butler. The auto-confirm logic for high-impact intents feels incredibly solid.",
      mood: "Excited",
      tags: ["design", "personality"],
      isVoice: false
    },
    {
      id: "j2",
      date: "Jul 19, 2026",
      title: "Audio recording system testing",
      content: "Successfully initiated on-device voice recording with simulated low-power wake locks. Battery drain indexes look promising. Auto language detection is working smoothly for English and Hindi voice files.",
      mood: "Satisfied",
      tags: ["android", "audio"],
      isVoice: true
    }
  ]);
  const [journalSearch, setJournalSearch] = useState("");
  const [newJournalTitle, setNewJournalTitle] = useState("");
  const [newJournalContent, setNewJournalContent] = useState("");
  const [newJournalMood, setNewJournalMood] = useState("Balanced");
  const [newJournalTags, setNewJournalTags] = useState("");

  // Fitness State
  const [habits, setHabits] = useState<Array<{ id: string; name: string; completedDays: number[]; streak: number; target: number }>>([
    { id: "h1", name: "Drink 3L Water Daily", completedDays: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20], streak: 4, target: 20 },
    { id: "h2", name: "Morning Exercise (20m)", completedDays: [1, 3, 4, 6, 7, 8, 10, 11, 14, 15, 18, 20], streak: 1, target: 15 },
    { id: "h3", name: "Write daily journal notes", completedDays: [1, 2, 5, 6, 7, 8, 11, 12, 13, 14, 19, 20], streak: 2, target: 12 },
    { id: "h4", name: "Keep daily device backups", completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], streak: 20, target: 20 }
  ]);
  const [waterIntake, setWaterIntake] = useState(1250); // in ml
  const [workoutMin, setWorkoutMin] = useState(45);
  
  // Connectors State
  const [connectorsList, setConnectorsList] = useState<Array<{ id: string; name: string; icon: string; account: string; connected: boolean; lastSync: string; permissions: string[] }>>([
    { id: "c1", name: "Google Calendar", icon: "Calendar", account: "aryannitinpat27@gmail.com", connected: true, lastSync: "10 mins ago", permissions: ["Read Calendar", "Write Calendar"] },
    { id: "c2", name: "Gmail API", icon: "Mail", account: "aryannitinpat27@gmail.com", connected: true, lastSync: "25 mins ago", permissions: ["Send Drafts", "Read Inbox Headers"] },
    { id: "c3", name: "LinkedIn Integration", icon: "Linkedin", account: "Aryan Patwadhan", connected: false, lastSync: "Never", permissions: ["Profile Info", "Post Updates"] },
    { id: "c4", name: "Spotify Connect", icon: "Music", account: "Aryan Premium", connected: true, lastSync: "1 hr ago", permissions: ["Playback Control", "User Top Tracks"] }
  ]);

  // Part 7 Command Engine & Device Control States
  const [p7Query, setP7Query] = useState("Draft an email to Sarah about lunch tomorrow at 12 PM");
  const [p7IsAnalyzing, setP7IsAnalyzing] = useState(false);
  const [p7PipelineStep, setP7PipelineStep] = useState<number>(-1);
  const [p7Intent, setP7Intent] = useState<string>("NONE");
  const [p7Entities, setP7Entities] = useState<Record<string, string>>({});
  const [p7SimulateError, setP7SimulateError] = useState(false);
  
  const [p7CallContact, setP7CallContact] = useState("Rahul Sharma");
  const [p7CallStatus, setP7CallStatus] = useState<"idle" | "awaiting_confirm" | "calling" | "failed" | "completed">("idle");
  const [p7CallLog, setP7CallLog] = useState<string>("");
  
  const [p7SmsRecipient, setP7SmsRecipient] = useState("Rahul Sharma");
  const [p7SmsText, setP7SmsText] = useState("Hi Rahul, let's meet tomorrow.");
  const [p7SmsStatus, setP7SmsStatus] = useState<"idle" | "awaiting_confirm" | "sending" | "sent" | "failed">("idle");
  
  const [p7EmailRecipient, setP7EmailRecipient] = useState("sarah.jones@workspace.com");
  const [p7EmailSubject, setP7EmailSubject] = useState("Lunch Meeting");
  const [p7EmailBody, setP7EmailBody] = useState("Hi Sarah, proposing lunch tomorrow at 12 PM.");
  const [p7EmailStatus, setP7EmailStatus] = useState<"idle" | "awaiting_confirm" | "sending" | "sent" | "failed">("idle");
  
  const [p7RemindersList, setP7RemindersList] = useState<Array<{ id: string; title: string; trigger: string; priority: "High" | "Medium" | "Low"; category: string }>>([
    { id: "rem_1", title: "Call Rahul Sharma", trigger: "Tomorrow at 9:00 AM", priority: "High", category: "Calls" },
    { id: "rem_2", title: "Water plants", trigger: "Every Monday at 10:00 AM", priority: "Medium", category: "Home" }
  ]);
  const [p7NewReminderTitle, setP7NewReminderTitle] = useState("");
  const [p7NewReminderTrigger, setP7NewReminderTrigger] = useState("Today at 5:00 PM");
  const [p7NewReminderPriority, setP7NewReminderPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [p7NewReminderCategory, setP7NewReminderCategory] = useState("General");
  
  const [p7HistoryList, setP7HistoryList] = useState<Array<{ id: string; time: string; query: string; status: "success" | "failed" | "cancelled"; details: string }>>([
    { id: "h_1", time: "09:12 AM", query: "Toggle flashlight", status: "success", details: "Flashlight successfully toggled ON" },
    { id: "h_2", time: "09:05 AM", query: "Call unknown number 9876543210", status: "cancelled", details: "User rejected safety confirmation gate" },
    { id: "h_3", time: "08:45 AM", query: "Check security patch", status: "success", details: "Reported: Security Patch level 2026-07-01" }
  ]);
  
  const [p7ImageOCR, setP7ImageOCR] = useState<string>("");
  const [p7ImageUploaded, setP7ImageUploaded] = useState<boolean>(false);
  const [p7TranslationInput, setP7TranslationInput] = useState("Hello, how are you today?");
  const [p7TranslationOutput, setP7TranslationOutput] = useState("नमस्ते, आज आप कैसे हैं?");
  const [p7TranslationLang, setP7TranslationLang] = useState<"hi" | "mr">("hi");

  // ==========================================
  // Part 8: AI Brain & Long-Term Memory States
  // ==========================================
  interface MemoryItem {
    id: string;
    title: string;
    content: string;
    category: string;
    importance: number;
    confidence: number;
    createdDate: string;
    lastUsed: string;
    accessCount: number;
  }

  interface KnowledgeEdge {
    source: string;
    relation: string;
    target: string;
  }

  const [p8Memories, setP8Memories] = useState<MemoryItem[]>([
    {
      id: "mem_1",
      title: "Favorite Music style",
      content: "Aryan loves listening to Chill Lo-Fi Beats and Classic Indian Instrumental Ragas during late-night study sessions.",
      category: "UserPreference",
      importance: 4,
      confidence: 0.95,
      createdDate: "2026-07-15 10:24",
      lastUsed: "2026-07-20 08:45",
      accessCount: 14
    },
    {
      id: "mem_2",
      title: "Best Friend",
      content: "Rahul Sharma is Aryan's best friend from junior college; he is also studying computer applications.",
      category: "Social",
      importance: 5,
      confidence: 0.99,
      createdDate: "2026-07-16 11:15",
      lastUsed: "2026-07-20 09:12",
      accessCount: 8
    },
    {
      id: "mem_3",
      title: "Morning Wakeup Habit",
      content: "Aryan wakes up around 7:15 AM and always asks Jarvis for a weather update and briefing first thing.",
      category: "Habit",
      importance: 3,
      confidence: 0.88,
      createdDate: "2026-07-18 07:30",
      lastUsed: "2026-07-20 07:15",
      accessCount: 5
    },
    {
      id: "mem_4",
      title: "Project Goal",
      content: "Currently developing JARVIS, an Android core system service built with clean architecture, Hilt, and Kotlin.",
      category: "Work",
      importance: 5,
      confidence: 0.98,
      createdDate: "2026-07-14 09:00",
      lastUsed: "2026-07-20 09:30",
      accessCount: 22
    },
    {
      id: "mem_5",
      title: "Coding Preference",
      content: "Aryan prefers highly modular, decoupled packages and clean dependency injection over monolithic files.",
      category: "UserPreference",
      importance: 4,
      confidence: 0.92,
      createdDate: "2026-07-15 14:10",
      lastUsed: "2026-07-19 18:22",
      accessCount: 11
    }
  ]);

  const [p8SearchQuery, setP8SearchQuery] = useState("");
  const [p8SearchResults, setP8SearchResults] = useState<MemoryItem[]>([]);
  const [p8ShowForm, setP8ShowForm] = useState(false);
  const [p8NewMemTitle, setP8NewMemTitle] = useState("");
  const [p8NewMemContent, setP8NewMemContent] = useState("");
  const [p8NewMemCategory, setP8NewMemCategory] = useState("UserPreference");
  const [p8NewMemImportance, setP8NewMemImportance] = useState<number>(3);

  const [p8ConfirmationPending, setP8ConfirmationPending] = useState(false);
  const [p8PendingMemory, setP8PendingMemory] = useState<MemoryItem | null>(null);

  const [p8SelectedProfile, setP8SelectedProfile] = useState({
    name: "Aryan",
    languages: ["English", "Marathi", "Hindi"],
    favoriteApps: ["WhatsApp", "YouTube", "Chrome"],
    wakeTime: "07:15 AM",
    sleepTime: "11:30 PM",
    workPattern: "Student",
    preferredVoice: "Warm Male",
    conversationStyle: "Friendly & Contextual",
    humourLevel: "Medium",
    explanationStyle: "Detailed & Grounded"
  });

  const [p8KnowledgeGraph, setP8KnowledgeGraph] = useState<KnowledgeEdge[]>([
    { source: "Aryan", relation: "Works On", target: "Jarvis Project" },
    { source: "Jarvis Project", relation: "Uses", target: "Android Studio" },
    { source: "Android Studio", relation: "Compiles", target: "Kotlin Bytecode" },
    { source: "Aryan", relation: "Speaks", target: "Marathi" },
    { source: "Aryan", relation: "Speaks", target: "Hindi" },
    { source: "Aryan", relation: "Has Friend", target: "Rahul Sharma" }
  ]);

  const [p8GraphSearch, setP8GraphSearch] = useState("");

  const [p8HabitInsights, setP8HabitInsights] = useState<string[]>([
    "Morning weather and calendar briefs requested consistently around 7:15 AM.",
    "Launches study-related coding playlists after computer app lectures at 6:00 PM.",
    "Toggles 'Do Not Disturb' focus mode and plays chill lo-fi beats every Friday evening."
  ]);

  const [p8ActiveSuggestions, setP8ActiveSuggestions] = useState([
    { id: "sug_1", text: "Your battery is at 15%. Would you like to activate on-device Battery Saver?", status: "pending", category: "Power" },
    { id: "sug_2", text: "Rahul Sharma's birthday is tomorrow. Would you like me to draft a reminder and email invite?", status: "pending", category: "Social" },
    { id: "sug_3", text: "Heavier-than-usual Friday evening traffic detected. Consider departing 15 minutes earlier.", status: "pending", category: "Navigation" }
  ]);

  const [p8LocationEnabled, setP8LocationEnabled] = useState(true);
  const [p8CurrentApp, setP8CurrentApp] = useState("com.android.studio");
  const [p8BatteryLevel, setP8BatteryLevel] = useState(82);
  const [p8IsCompilingContext, setP8IsCompilingContext] = useState(false);
  const [p8CompiledPayload, setP8CompiledPayload] = useState<string>("");

  const [p8ChatHistory, setP8ChatHistory] = useState<Array<{ sender: "user" | "jarvis"; text: string; timestamp: string }>>([
    { sender: "jarvis", text: "Greetings, Aryan. Your cognitive memory system is online. I remember our ongoing coding projects and preferences.", timestamp: "09:30 AM" }
  ]);
  const [p8ChatQuery, setP8ChatQuery] = useState("");

  // ==========================================
  // Part 9: Automation Engine & Skills States
  // ==========================================
  const [p9Skills] = useState<Array<{
    name: string;
    description: string;
    requiredPermissions: string[];
    inputParams: string[];
    output: string;
    errorHandling: string;
    confirmationRules: string;
    executionLogic: string;
    isSensitive: boolean;
  }>>([
    {
      name: "CallSkill",
      description: "Places a hands-free voice call to an active contact using the Telephony subsystem.",
      requiredPermissions: ["android.permission.CALL_PHONE", "android.permission.READ_CONTACTS"],
      inputParams: ["contactName: String", "phoneType: String"],
      output: "Intent.ACTION_CALL dispatched",
      errorHandling: "If contact is missing, prompts with matched similarity list. If dialer fails, initiates fallback audio logging.",
      confirmationRules: "Requires user confirmation if dialing an international number or if user profile limits calling.",
      executionLogic: "val intent = Intent(Intent.ACTION_CALL, Uri.parse('tel:' + phoneNumber))",
      isSensitive: true
    },
    {
      name: "SmsSkill",
      description: "Composes and dispatches a text message (SMS) to a designated recipient on-device.",
      requiredPermissions: ["android.permission.SEND_SMS", "android.permission.READ_CONTACTS"],
      inputParams: ["recipient: String", "messageBody: String"],
      output: "SmsManager SMS dispatched confirmation",
      errorHandling: "If carrier is unavailable, caches draft local and prompts for retry when cellular connection restores.",
      confirmationRules: "ALWAYS requires explicit user validation before actual transmission to prevent background charges.",
      executionLogic: "val smsManager = context.getSystemService(SmsManager::class.java)\nsmsManager.sendTextMessage(recipient, null, body, null, null)",
      isSensitive: true
    },
    {
      name: "EmailSkill",
      description: "Drafts and sends emails using background SMTP or intent redirect to active mail apps.",
      requiredPermissions: ["android.permission.INTERNET", "android.permission.GET_ACCOUNTS"],
      inputParams: ["toEmail: String", "subject: String", "body: String"],
      output: "Background email delivered or Intent.ACTION_SEND sent",
      errorHandling: "Retries 3 times on socket timeouts; logs trace and notifies client of failure.",
      confirmationRules: "Requires confirmation if content contains critical corporate or billing tokens.",
      executionLogic: "val intent = Intent(Intent.ACTION_SENDTO, Uri.parse('mailto:'))",
      isSensitive: true
    },
    {
      name: "CalendarSkill",
      description: "Reads, inserts, or updates scheduled items within the system Calendar Provider.",
      requiredPermissions: ["android.permission.READ_CALENDAR", "android.permission.WRITE_CALENDAR"],
      inputParams: ["title: String", "startTime: Long", "durationMinutes: Int"],
      output: "ContentResolver insert URI returned",
      errorHandling: "Resolves conflicting events, suggests alternative free time ranges automatically.",
      confirmationRules: "Requires consent if writing over existing events in the same hour block.",
      executionLogic: "val values = ContentValues().apply { put(CalendarContract.Events.TITLE, title) }",
      isSensitive: false
    },
    {
      name: "ReminderSkill",
      description: "Registers local alerts or notifications using WorkManager or AlarmManager persistent workers.",
      requiredPermissions: ["android.permission.POST_NOTIFICATIONS"],
      inputParams: ["taskTitle: String", "alertTimeMs: Long"],
      output: "Scheduled work UID registered",
      errorHandling: "Logs error and shifts to exact AlarmManager clock firing if system mutes worker processes.",
      confirmationRules: "Runs silently without confirmation.",
      executionLogic: "val request = OneTimeWorkRequestBuilder<ReminderWorker>().build()",
      isSensitive: false
    },
    {
      name: "AlarmSkill",
      description: "Schedules immediate or recurring physical device alarms using Android AlarmManager.",
      requiredPermissions: ["android.permission.SET_ALARM"],
      inputParams: ["hour: Int", "minute: Int", "label: String"],
      output: "AlarmClock intent fired successfully",
      errorHandling: "If label matches a redundant alarm, updates the timestamp of the existing alarm instead.",
      confirmationRules: "No confirmation needed.",
      executionLogic: "val intent = Intent(AlarmClock.ACTION_SET_ALARM).apply { putExtra(...) }",
      isSensitive: false
    },
    {
      name: "MusicSkill",
      description: "Controls ambient playback streams or opens localized system player utilities.",
      requiredPermissions: ["android.permission.MEDIA_CONTENT_CONTROL"],
      inputParams: ["trackName: String", "action: String"],
      output: "Audio focus requested and media stream active",
      errorHandling: "Falls back to public royalty-free acoustic buffers if default stream returns null.",
      confirmationRules: "No confirmation required.",
      executionLogic: "mediaController.transportControls.play()",
      isSensitive: false
    },
    {
      name: "YouTubeSkill",
      description: "launches designated video queries or channels directly inside official YouTube player app.",
      requiredPermissions: ["android.permission.INTERNET"],
      inputParams: ["searchQuery: String", "autoPlay: Boolean"],
      output: "YouTube package intent started successfully",
      errorHandling: "If native YouTube application is absent, falls back to loading in default web browser.",
      confirmationRules: "No confirmation required.",
      executionLogic: "val intent = Intent(Intent.ACTION_VIEW, Uri.parse('vnd.youtube:' + id))",
      isSensitive: false
    },
    {
      name: "MapsSkill",
      description: "Launches geocoded navigation lines or searches points of interest using maps framework.",
      requiredPermissions: ["android.permission.ACCESS_FINE_LOCATION", "android.permission.INTERNET"],
      inputParams: ["destination: String", "transportMode: String"],
      output: "Google Maps directions intent opened",
      errorHandling: "If fine GPS is disabled, prompts to run via cell-tower coarse coordinates.",
      confirmationRules: "No confirmation needed.",
      executionLogic: "val gmmIntentUri = Uri.parse('google.navigation:q=' + destination)",
      isSensitive: false
    },
    {
      name: "WeatherSkill",
      description: "Polls current localized environmental forecasts using location providers and weather REST APIs.",
      requiredPermissions: ["android.permission.ACCESS_COARSE_LOCATION", "android.permission.INTERNET"],
      inputParams: ["city: String"],
      output: "JSON forecast mapping successfully completed",
      errorHandling: "Caches persistent data offline; returns stale offline forecast if network connection is missing.",
      confirmationRules: "No confirmation required.",
      executionLogic: "val result = weatherApi.getForecast(city)",
      isSensitive: false
    },
    {
      name: "CalculatorSkill",
      description: "Performs accurate dynamic math, algebra or unit conversions locally.",
      requiredPermissions: [],
      inputParams: ["expression: String"],
      output: "Calculated float result",
      errorHandling: "Catches DivisionByZero and SyntaxError, suggesting correct brackets or terms.",
      confirmationRules: "No confirmation needed.",
      executionLogic: "val result = ExpressionEvaluator.eval(expression)",
      isSensitive: false
    },
    {
      name: "NotesSkill",
      description: "Stores snippets or scratchpad drafts in secure localized system files.",
      requiredPermissions: ["android.permission.WRITE_EXTERNAL_STORAGE"],
      inputParams: ["title: String", "content: String"],
      output: "Raw file persisted locally",
      errorHandling: "Saves backup in temporary cache if filesystem write exception is captured.",
      confirmationRules: "Silent action.",
      executionLogic: "context.openFileOutput(fileName, Context.MODE_PRIVATE).use { ... }",
      isSensitive: false
    },
    {
      name: "SearchSkill",
      description: "Searches public web indices using default system engine.",
      requiredPermissions: ["android.permission.INTERNET"],
      inputParams: ["query: String"],
      output: "Web browser search query executed",
      errorHandling: "Falls back to offline dictionary query search if network timeout occurs.",
      confirmationRules: "No confirmation needed.",
      executionLogic: "val intent = Intent(Intent.ACTION_WEB_SEARCH).apply { putExtra(...) }",
      isSensitive: false
    },
    {
      name: "TranslateSkill",
      description: "Translates text tokens across multiple languages locally or via network.",
      requiredPermissions: ["android.permission.INTERNET"],
      inputParams: ["text: String", "targetLanguage: String"],
      output: "Translated string returned",
      errorHandling: "Loads offline basic language translation dictionaries if translation service is unreachable.",
      confirmationRules: "No confirmation needed.",
      executionLogic: "val translation = translator.translate(text, targetLanguage)",
      isSensitive: false
    },
    {
      name: "CameraSkill",
      description: "Launches hardware camera feed to take a photo or capture a high-definition video.",
      requiredPermissions: ["android.permission.CAMERA"],
      inputParams: ["mode: String", "useFlash: Boolean"],
      output: "Image captured and written to local media store",
      errorHandling: "Safely releases hardware lock if capture fails; resets interface.",
      confirmationRules: "Requires user tap to save to the shared photo library.",
      executionLogic: "val cameraIntent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)",
      isSensitive: true
    },
    {
      name: "FlashlightSkill",
      description: "Toggles on-device hardware camera flash module directly.",
      requiredPermissions: ["android.permission.CAMERA"],
      inputParams: ["state: Boolean"],
      output: "Camera flash state set",
      errorHandling: "Safely handles missing flash hardware; falls back to screen-dimming overlay.",
      confirmationRules: "No confirmation needed.",
      executionLogic: "cameraManager.setTorchMode(cameraId, state)",
      isSensitive: false
    },
    {
      name: "BluetoothSkill",
      description: "Modulates on-device Bluetooth adapter state or pairs/connects to accessories.",
      requiredPermissions: ["android.permission.BLUETOOTH_CONNECT", "android.permission.BLUETOOTH_ADMIN"],
      inputParams: ["state: Boolean", "targetDeviceName: String"],
      output: "Bluetooth state changed",
      errorHandling: "Returns error if adapter is hardware disabled.",
      confirmationRules: "No confirmation needed.",
      executionLogic: "bluetoothAdapter.enable() or bluetoothAdapter.disable()",
      isSensitive: false
    },
    {
      name: "WiFiSkill",
      description: "Modulates on-device Wi-Fi network hardware toggles.",
      requiredPermissions: ["android.permission.CHANGE_WIFI_STATE", "android.permission.ACCESS_WIFI_STATE"],
      inputParams: ["state: Boolean"],
      output: "WiFi state updated successfully",
      errorHandling: "Throws error if Airplane mode blocks Wi-Fi changes; suggests disabling Airplane Mode.",
      confirmationRules: "No confirmation needed.",
      executionLogic: "wifiManager.isWifiEnabled = state",
      isSensitive: false
    },
    {
      name: "VolumeSkill",
      description: "Controls media, notification or ring system audio volumes.",
      requiredPermissions: ["android.permission.MODIFY_AUDIO_SETTINGS"],
      inputParams: ["volumePercent: Int", "streamType: String"],
      output: "AudioManager volume adjusted",
      errorHandling: "Enforces Do-Not-Disturb volume overrides if system-level lock is present.",
      confirmationRules: "No confirmation needed.",
      executionLogic: "audioManager.setStreamVolume(streamType, index, 0)",
      isSensitive: false
    },
    {
      name: "SettingsSkill",
      description: "Toggles advanced Android settings like Brightness, Sleep timeout, or auto-rotate.",
      requiredPermissions: ["android.permission.WRITE_SETTINGS"],
      inputParams: ["settingName: String", "value: Any"],
      output: "System setting written",
      errorHandling: "Reverts to original configuration and logs error if system rejects settings write intent.",
      confirmationRules: "Requires permission check confirmation for dangerous settings toggles.",
      executionLogic: "Settings.System.putInt(contentResolver, settingName, value)",
      isSensitive: false
    },
    {
      name: "BrowserSkill",
      description: "Launches dynamic secure URLs inside default web browser.",
      requiredPermissions: ["android.permission.INTERNET"],
      inputParams: ["url: String"],
      output: "Intent.ACTION_VIEW web intent completed",
      errorHandling: "Auto-inserts protocols if input URL is missing schema header.",
      confirmationRules: "No confirmation needed.",
      executionLogic: "val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))",
      isSensitive: false
    },
    {
      name: "PlayStoreSkill",
      description: "Queries or launches designated applications inside Google Play Store.",
      requiredPermissions: ["android.permission.INTERNET"],
      inputParams: ["packageName: String"],
      output: "Play Store intent dispatched",
      errorHandling: "Falls back to web-based search if Google Play Store app is frozen or inactive.",
      confirmationRules: "Requires user confirmation before initiating download to avoid storage use.",
      isSensitive: false,
      executionLogic: "val intent = Intent(Intent.ACTION_VIEW, Uri.parse('market://details?id=' + packageName))"
    },
    {
      name: "FileSkill",
      description: "Manipulates or shares local user data files.",
      requiredPermissions: ["android.permission.READ_EXTERNAL_STORAGE", "android.permission.WRITE_EXTERNAL_STORAGE"],
      inputParams: ["filePath: String", "action: String"],
      output: "File action completed successfully",
      errorHandling: "Throws exception if file is locked or missing; locks active worker thread to avoid app freeze.",
      confirmationRules: "Deleting files ALWAYS requires explicit user confirmation to prevent accidental data loss.",
      executionLogic: "val file = File(filePath)\nfile.delete()",
      isSensitive: true
    },
    {
      name: "FocusModeSkill",
      description: "Toggles Focus Mode setting to lock notifications and muffle background alerts.",
      requiredPermissions: ["android.permission.WRITE_SETTINGS"],
      inputParams: ["state: Boolean"],
      output: "Focus Mode configuration updated",
      errorHandling: "Toggles custom alert muter filter if default settings API throws security access errors.",
      confirmationRules: "No confirmation needed.",
      executionLogic: "notificationManager.setInterruptionFilter(...) ",
      isSensitive: false
    },
    {
      name: "NotificationSkill",
      description: "Dynamically modulates notification channels or silences specific high-vibration applications.",
      requiredPermissions: ["android.permission.ACCESS_NOTIFICATION_POLICY"],
      inputParams: ["muteState: Boolean", "channelName: String"],
      output: "Notification settings updated",
      errorHandling: "Falls back to master volume reduction if policy update fails.",
      confirmationRules: "No confirmation required.",
      executionLogic: "notificationManager.setNotificationPolicy(...)",
      isSensitive: false
    }
  ]);

  const [p9SelectedSkill, setP9SelectedSkill] = useState<string>("CallSkill");
  const [p9CommandInput, setP9CommandInput] = useState("");
  const [p9IsRunning, setP9IsRunning] = useState(false);
  const [p9ActiveTask, setP9ActiveTask] = useState<{
    id: string;
    command: string;
    status: "PENDING" | "PLANNING" | "EXECUTING" | "WAITING_CONFIRMATION" | "SUCCESS" | "FAILED";
    steps: Array<{
      skillName: string;
      params: Record<string, any>;
      state: "pending" | "running" | "success" | "failed" | "confirmation_needed";
      log: string;
    }>;
  } | null>(null);

  const [p9History, setP9History] = useState<Array<{
    id: string;
    command: string;
    time: string;
    result: string;
    duration: number;
    permissions: string[];
    deviceState: string;
  }>>([
    {
      id: "hist_1",
      command: "Call Mom immediately",
      time: "09:32 AM",
      result: "SUCCESS",
      duration: 180,
      permissions: ["CALL_PHONE"],
      deviceState: "Battery: 82%, WiFi: On"
    },
    {
      id: "hist_2",
      command: "Open YouTube and reduce brightness to 40%",
      time: "09:15 AM",
      result: "SUCCESS",
      duration: 250,
      permissions: ["WRITE_SETTINGS", "INTERNET"],
      deviceState: "Battery: 85%, WiFi: On"
    }
  ]);

  const [p9Routines, setP9Routines] = useState<Array<{
    name: string;
    description: string;
    commands: string[];
  }>>([
    {
      name: "Good Morning",
      description: "Morning brief containing weather updates, calendar schedules and top news headlines.",
      commands: ["Get current weather info", "List calendar events for today", "Read top news headlines"]
    },
    {
      name: "Good Night",
      description: "Night mode: triggers Do Not Disturb, registers 7:15 AM alarm and disables WiFi adapter.",
      commands: ["Enable Do Not Disturb", "Set alarm for 7:15 AM", "Turn off Wi-Fi"]
    },
    {
      name: "Study Routine",
      description: "Turns on Lo-Fi coding beats, dims screen and mutes dynamic app notifications.",
      commands: ["Open YouTube and play chill Lo-Fi beats", "Dim screen brightness to 40%", "Toggle Focus Mode on"]
    }
  ]);

  const [p9Schedules, setP9Schedules] = useState<Array<{
    id: string;
    title: string;
    triggerType: string;
    triggerValue: string;
    command: string;
    isEnabled: boolean;
  }>>([
    { id: "sch_1", title: "Morning Briefing", triggerType: "Daily", triggerValue: "07:15 AM", command: "Execute Good Morning routine", isEnabled: true },
    { id: "sch_2", title: "Low Battery Saver", triggerType: "Battery Trigger", triggerValue: "15%", command: "Dim screen to 30% and enable Battery Saver", isEnabled: true },
    { id: "sch_3", title: "Headphones Connected", triggerType: "Headphone Connected", triggerValue: "3.5mm jack", command: "Open Spotify and set volume to 50%", isEnabled: false }
  ]);

  const [p9CustomShortcuts, setP9CustomShortcuts] = useState<Array<{
    trigger: string;
    command: string;
  }>>([
    { trigger: "Movie Mode", command: "Enable Do Not Disturb, dim screen to 15%, and open Netflix" },
    { trigger: "Travel Mode", command: "Open Maps, enable Bluetooth, and increase volume to 100%" }
  ]);

  const [p9SmartRecs, setP9SmartRecs] = useState<Array<{
    id: string;
    message: string;
    routineName: string;
    type: "habit" | "calendar";
  }>>([
    { id: "rec_1", message: "You usually study at 6:00 PM. Launch Study Routine now?", routineName: "Study Routine", type: "habit" },
    { id: "rec_2", message: "Sunday morning call with parents: 'Would you like to dial Mom now?'", routineName: "Good Morning", type: "calendar" }
  ]);

  const [p9HistorySearch, setP9HistorySearch] = useState("");
  const [p9HistoryFilter, setP9HistoryFilter] = useState<"ALL" | "SUCCESS" | "FAILED">("ALL");
  const [p9LogTracer, setP9LogTracer] = useState<string[]>([]);
  const [p9VoiceFeedback, setP9VoiceFeedback] = useState("Done. Automation Engine initialized.");
  const [p9WiFiEnabled, setP9WiFiEnabled] = useState(false); // Used to demonstrate recovery flow!

  // ==========================================
  // Part 8: AI Brain & Memory Helper Functions
  // ==========================================
  
  // 1. Search Memories
  const runP8MemorySearch = (query: string) => {
    setP8SearchQuery(query);
    if (!query.trim()) {
      setP8SearchResults([]);
      return;
    }
    const lowerQ = query.toLowerCase();
    const filtered = p8Memories.filter(
      (m) => m.title.toLowerCase().includes(lowerQ) || m.content.toLowerCase().includes(lowerQ)
    );
    setP8SearchResults(filtered);
    addFrameworkLog("info", "MemoryEngine", `Vector similarity search executed for: "${query}". Found ${filtered.length} relevant entries.`);
  };

  // 2. Save Memory (with dynamic safety permission gate)
  const saveP8Memory = (title: string, content: string, category: string, importance: number) => {
    if (!title.trim() || !content.trim()) return;

    const newMem: MemoryItem = {
      id: "mem_" + Date.now(),
      title,
      content,
      category,
      importance,
      confidence: 0.96,
      createdDate: new Date().toISOString().substring(0, 16).replace("T", " "),
      lastUsed: new Date().toISOString().substring(0, 16).replace("T", " "),
      accessCount: 1
    };

    // Explicit security gate for sensitive categories or high importance
    if (category === "Social" || category === "Location" || importance >= 5) {
      setP8PendingMemory(newMem);
      setP8ConfirmationPending(true);
      addFrameworkLog("perm", "MemoryGuard", `Explicit Security Gate triggered for sensitive memory save: "${title}" (Category: ${category}).`);
    } else {
      setP8Memories((prev) => [newMem, ...prev]);
      setP8NewMemTitle("");
      setP8NewMemContent("");
      setP8ShowForm(false);
      addFrameworkLog("broadcast", "MemoryDatabase", `Memory saved successfully: "${title}" into SQLite table.`);
    }
  };

  // 3. Confirm Memory Save
  const handleP8Confirmation = (confirmed: boolean) => {
    if (confirmed && p8PendingMemory) {
      setP8Memories((prev) => [p8PendingMemory, ...prev]);
      addFrameworkLog("broadcast", "MemoryDatabase", `User APPROVED security gate. Persisted "${p8PendingMemory.title}" to Room DB.`);
    } else {
      addFrameworkLog("info", "MemoryGuard", `User REJECTED memory write transaction. Rollback performed.`);
    }
    setP8ConfirmationPending(false);
    setP8PendingMemory(null);
    setP8NewMemTitle("");
    setP8NewMemContent("");
    setP8ShowForm(false);
  };

  // 4. Delete Memory
  const deleteP8Memory = (id: string) => {
    const mem = p8Memories.find((m) => m.id === id);
    setP8Memories((prev) => prev.filter((m) => m.id !== id));
    if (mem) {
      addFrameworkLog("info", "MemoryDatabase", `Deleted memory node: "${mem.title}".`);
    }
  };

  // 5. Clear All Memories
  const clearAllP8Memories = () => {
    setP8Memories([]);
    addFrameworkLog("power", "MemoryDatabase", "Cleared all SQLite memory nodes. System memory reset.");
  };

  // 6. Export/Import simulator
  const exportP8Memories = () => {
    const serialized = JSON.stringify(p8Memories, null, 2);
    addFrameworkLog("info", "MemoryBackup", "Generated secure SQLite backup package. Ready to write to local storage.");
    alert("On-Device Memory Exported successfully! Check logs to inspect backup stream payload.");
    console.log(serialized);
  };

  const importP8BackupSim = () => {
    const mockBackup: MemoryItem[] = [
      {
        id: "mem_backup_1",
        title: "Office Location",
        content: "Aryan's college workspace lab is in Room 402, IT Block.",
        category: "Location",
        importance: 4,
        confidence: 0.98,
        createdDate: "2026-07-10 12:00",
        lastUsed: "2026-07-20 09:00",
        accessCount: 4
      }
    ];
    setP8Memories((prev) => [...mockBackup, ...prev]);
    addFrameworkLog("broadcast", "MemoryDatabase", "Imported 1 memory node from secure JSON backup package.");
  };

  // 7. Context Package Aggregator & Compiler
  const compileP8Context = () => {
    setP8IsCompilingContext(true);
    addFrameworkLog("info", "ContextEngine", "Querying on-device telemetries (Battery, App, Location, Calendar, NotificationManager)...");
    
    setTimeout(() => {
      const packageData = {
        time: new Date().toLocaleTimeString(),
        batteryLevel: p8BatteryLevel + "%",
        location: p8LocationEnabled ? "Mumbai, India" : "NOT_PERMITTED",
        activeApp: p8CurrentApp,
        calendar: [
          "Review Jarvis mobile blueprints (10:00 AM)",
          "Daily Product sync session (11:30 AM)"
        ],
        notifications: [
          "Gmail (Sarah): 'Reviewing design specs today'",
          "WhatsApp (Rahul): 'Ready for gym tonight?'"
        ],
        recentCommands: [
          "Set alarm morgen 9 am",
          "Toggle torch"
        ],
        relevantMemories: p8Memories.slice(0, 2).map((m) => ({ title: m.title, content: m.content, importance: m.importance }))
      };

      const payload = {
        system_instructions: `You are JARVIS, an elegant, calm, on-device digital butler assistant. You are dedicated to assisting ${p8SelectedProfile.name}. Speak in a ${p8SelectedProfile.conversationStyle} style, with a ${p8SelectedProfile.preferredVoice} voice tone. Present answers in a ${p8SelectedProfile.explanationStyle} format.`,
        current_context: packageData,
        retrieved_long_term_memories: p8Memories.slice(0, 3),
        dialog_history: p8ChatHistory.slice(-5)
      };

      setP8CompiledPayload(JSON.stringify(payload, null, 2));
      setP8IsCompilingContext(false);
      addFrameworkLog("broadcast", "ContextEngine", "Context package compiled. Serialized LLM prompt payload generated successfully.");
    }, 850);
  };

  // 8. Multi-turn chat & pronoun context tracker
  const sendP8ChatQuery = () => {
    if (!p8ChatQuery.trim()) return;

    const userText = p8ChatQuery;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Append user query
    setP8ChatHistory((prev) => [...prev, { sender: "user", text: userText, timestamp: nowTime }]);
    setP8ChatQuery("");

    addFrameworkLog("info", "BrainEngine", `User uttered: "${userText}". Commencing contextual inference...`);

    // Check query for pronoun references & memory links
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let jarvisReply = "";

      // Context pronoun resolution
      const hasHe = lower.includes("he ") || lower.includes("him") || lower.includes("his");
      const hasMusic = lower.includes("music") || lower.includes("song") || lower.includes("lo-fi") || lower.includes("raga");
      const hasFriend = lower.includes("friend") || lower.includes("rahul");
      const hasProject = lower.includes("project") || lower.includes("goal") || lower.includes("work");
      const hasCreator = lower.includes("creator") || lower.includes("who are you") || lower.includes("who is aryan");

      if (hasCreator) {
        jarvisReply = `I am JARVIS, an advanced AI Butler designed specifically to assist you, Aryan. My cognitive framework is written in clean Kotlin following Clean Architecture principles, running completely local on your device.`;
      } else if (hasFriend) {
        const mem = p8Memories.find((m) => m.category === "Social" || m.title.toLowerCase().includes("friend"));
        jarvisReply = mem 
          ? `Based on our long-term memories, your best friend is ${mem.content.replace("Aryan's", "your")}.`
          : `I recall your friend is Rahul Sharma, whom you've known since junior college; he studies computer applications alongside you.`;
      } else if (hasHe) {
        // Resolve pronouns contextually back to Rahul Sharma or Creator
        jarvisReply = `Resolving pronoun "he/his" back to Rahul Sharma from our recent social contexts. He is currently studying computer applications with you and is your best friend from junior college.`;
      } else if (hasMusic) {
        const mem = p8Memories.find((m) => m.title.toLowerCase().includes("music") || m.content.toLowerCase().includes("music"));
        jarvisReply = mem
          ? `I've checked our database! ${mem.content}`
          : `I remember you love listening to Chill Lo-Fi beats and Classic Indian Instrumental Ragas during late-night study sessions.`;
      } else if (hasProject) {
        const mem = p8Memories.find((m) => m.title.toLowerCase().includes("project") || m.content.toLowerCase().includes("project"));
        jarvisReply = mem
          ? `Regarding our goals: ${mem.content}`
          : `We are currently building JARVIS, your custom AI Butler. We've structured the system with Hilt, MVVM, and Room, and we are working on Part 8 of our 20-part master blueprint.`;
      } else if (lower.includes("habit") || lower.includes("routine") || lower.includes("wake up")) {
        jarvisReply = `Checking on-device habit logs. You typically wake up around 7:15 AM, request a weather brief, and during Friday evenings, you toggle Focus Do-Not-Disturb to code while listening to lo-fi beats.`;
      } else {
        jarvisReply = `I've parsed your request, Aryan. I am maintaining our session-level short term turns, and I can query our local SQLite database for more details. Let me know if you would like me to compile a full system context package.`;
      }

      setP8ChatHistory((prev) => [...prev, { sender: "jarvis", text: jarvisReply, timestamp: nowTime }]);
      addFrameworkLog("broadcast", "BrainEngine", `Formulated response with ${p8SelectedProfile.conversationStyle} tone model.`);
    }, 1000);
  };

  // 9. Handle Smart proactive suggestions
  const handleP8SuggestionAction = (id: string, approved: boolean) => {
    setP8ActiveSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: approved ? "approved" : "rejected" } : s))
    );
    const sug = p8ActiveSuggestions.find((s) => s.id === id);
    if (!sug) return;

    if (approved) {
      addFrameworkLog("power", "ProactiveEngine", `User APPROVED proactive action: "${sug.text}". Dispatching background task.`);
    } else {
      addFrameworkLog("info", "ProactiveEngine", `User REJECTED proactive suggestion: "${sug.text}".`);
    }
  };

  // Part 7 Command Pipeline Analysis Engine
  const runP7CommandPipeline = (queryText: string) => {
    if (!queryText.trim()) return;
    setP7IsAnalyzing(true);
    setP7PipelineStep(0);
    
    // Dynamic Intent & Entity parsing based on keyword heuristics
    let resolvedIntent = "CONVERSATION_GENERAL";
    let resolvedEntities: Record<string, string> = {};
    
    const lowerText = queryText.toLowerCase();
    if (lowerText.includes("email") || lowerText.includes("mail") || lowerText.includes("sarah")) {
      resolvedIntent = "COMMUNICATION_EMAIL";
      resolvedEntities = {
        recipient: "sarah.jones@workspace.com",
        subject: "Lunch Meeting",
        body: "Hi Sarah, proposing lunch tomorrow at 12 PM.",
        verified: "Yes"
      };
      // Prefill SMS / Email compositions for visual cohesiveness
      setP7EmailRecipient("sarah.jones@workspace.com");
      setP7EmailSubject("Lunch Meeting");
      setP7EmailBody("Hi Sarah, proposing lunch tomorrow at 12 PM.");
    } else if (lowerText.includes("call") || lowerText.includes("rahul") || lowerText.includes("phone")) {
      resolvedIntent = "COMMUNICATION_CALL";
      resolvedEntities = {
        contactName: "Rahul Sharma",
        phoneNumber: "+91 98765 43210",
        state: "Awaiting Confirmation Gate"
      };
      setP7CallContact("Rahul Sharma");
    } else if (lowerText.includes("sms") || lowerText.includes("message") || lowerText.includes("text")) {
      resolvedIntent = "COMMUNICATION_SMS";
      resolvedEntities = {
        recipient: "Rahul Sharma",
        message: "Hi Rahul, let's meet tomorrow.",
        type: "Standard SMS"
      };
      setP7SmsRecipient("Rahul Sharma");
      setP7SmsText("Hi Rahul, let's meet tomorrow.");
    } else if (lowerText.includes("flashlight") || lowerText.includes("torch") || lowerText.includes("light")) {
      resolvedIntent = "DEVICE_CONTROL_FLASHLIGHT";
      resolvedEntities = {
        action: "Toggle",
        target: "LED Torch",
        intensity: "Max"
      };
    } else if (lowerText.includes("music") || lowerText.includes("play") || lowerText.includes("song")) {
      resolvedIntent = "MEDIA_CONTROL_PLAY";
      resolvedEntities = {
        title: "Sunset Chill Vibes",
        artist: "Simulated Artist",
        provider: "Spotify API Connect"
      };
    } else if (lowerText.includes("reminder") || lowerText.includes("remind")) {
      resolvedIntent = "PRODUCTIVITY_REMINDER";
      resolvedEntities = {
        title: "Call Rahul Sharma",
        trigger: "Tomorrow at 9:00 AM",
        category: "Work"
      };
    } else if (lowerText.includes("weather") || lowerText.includes("temp") || lowerText.includes("rain")) {
      resolvedIntent = "INFORMATION_WEATHER";
      resolvedEntities = {
        city: "Mumbai, India",
        unit: "Celsius",
        queryType: "Current Forecast"
      };
    } else if (lowerText.includes("system") || lowerText.includes("battery") || lowerText.includes("storage")) {
      resolvedIntent = "INFORMATION_SYSTEM_STATUS";
      resolvedEntities = {
        battery: `${deviceState.batteryLevel}%`,
        charging: deviceState.isCharging ? "Yes" : "No",
        cpu: `${deviceState.cpuLoad}%`
      };
    } else if (lowerText.includes("calendar") || lowerText.includes("meeting") || lowerText.includes("schedule")) {
      resolvedIntent = "PRODUCTIVITY_CALENDAR";
      resolvedEntities = {
        subject: "Project Review Meeting",
        time: "Tomorrow at 2:00 PM",
        guests: "sarah.jones@workspace.com"
      };
    } else {
      resolvedIntent = "CONVERSATION_Q_A";
      resolvedEntities = {
        topic: queryText,
        engine: "Gemini 3.5 Flash"
      };
    }
    
    setP7Intent(resolvedIntent);
    setP7Entities(resolvedEntities);
    addFrameworkLog("intent", "CommandEngine", `Received input command request: "${queryText}"`);

    // Sequential simulation of pipeline step-by-step
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setP7PipelineStep(currentStep);
      
      if (currentStep === 11) {
        clearInterval(interval);
        setP7IsAnalyzing(false);
        
        // Finalize execution or prompt safety confirmation based on Intent & Toggles
        if (p7SimulateError) {
          addFrameworkLog("error", "CommandEngine", `Pipeline Execution failed at step 10: Simulated Hardware/Intent failure.`);
          setP7HistoryList(prev => [
            { id: "h_" + Date.now(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), query: queryText, status: "failed", details: "Simulated hardware fault: microphone stream or API timeout." },
            ...prev
          ]);
          return;
        }

        // Execute actual side-effects!
        if (resolvedIntent === "DEVICE_CONTROL_FLASHLIGHT") {
          setDeviceState(prev => ({ ...prev, flashlightOn: !prev.flashlightOn }));
          addFrameworkLog("broadcast", "HardwareController", `Command executed: Flashlight/Torch state toggled to ${!deviceState.flashlightOn ? "ON" : "OFF"}`);
          setP7HistoryList(prev => [
            { id: "h_" + Date.now(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), query: queryText, status: "success", details: `Flashlight state updated: ${!deviceState.flashlightOn ? "ON" : "OFF"}` },
            ...prev
          ]);
        } else if (resolvedIntent === "COMMUNICATION_CALL") {
          setP7CallStatus("awaiting_confirm");
          addFrameworkLog("intent", "SafetyGate", "Calling intent matched. Awaiting explicit user confirmation before dialer launch.");
        } else if (resolvedIntent === "COMMUNICATION_SMS") {
          setP7SmsStatus("awaiting_confirm");
          addFrameworkLog("intent", "SafetyGate", "SMS composition matched. Awaiting explicit user confirmation.");
        } else if (resolvedIntent === "COMMUNICATION_EMAIL") {
          setP7EmailStatus("awaiting_confirm");
          addFrameworkLog("intent", "SafetyGate", "Email drafting matched. Awaiting user confirmation to dispatch via Gmail Connector.");
        } else if (resolvedIntent === "MEDIA_CONTROL_PLAY") {
          setMusicPlaying(prev => ({ ...prev, playing: true, title: "Sunset Chill Vibes", artist: "Simulated Artist" }));
          addFrameworkLog("broadcast", "MediaSessionService", "Command executed: Playback initiated via Spotify API Connect.");
          setP7HistoryList(prev => [
            { id: "h_" + Date.now(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), query: queryText, status: "success", details: "Initiated Spotify playback: 'Sunset Chill Vibes'" },
            ...prev
          ]);
        } else if (resolvedIntent === "PRODUCTIVITY_REMINDER") {
          const newR = {
            id: "rem_" + Date.now(),
            title: resolvedEntities.title || "Voice Reminder",
            trigger: resolvedEntities.trigger || "Today at 6:00 PM",
            priority: "Medium" as const,
            category: "Voice"
          };
          setP7RemindersList(prev => [newR, ...prev]);
          addFrameworkLog("broadcast", "AlarmManager", `Command executed: Voice reminder saved: "${newR.title}"`);
          setP7HistoryList(prev => [
            { id: "h_" + Date.now(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), query: queryText, status: "success", details: `Saved reminder: "${newR.title}"` },
            ...prev
          ]);
        } else {
          addFrameworkLog("intent", "CommandRouter", `Conversation response generated successfully: "I've handled that general request for you."`);
          setP7HistoryList(prev => [
            { id: "h_" + Date.now(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), query: queryText, status: "success", details: `Direct conversational answer generated.` },
            ...prev
          ]);
        }
      }
    }, 150);
  };


  // ==========================================
  // Part 9: Automation Engine & Skills Helpers
  // ==========================================

  const runP9Automation = (cmd: string) => {
    if (!cmd.trim()) return;
    setP9CommandInput(cmd);
    setP9IsRunning(true);
    setP9LogTracer([]);
    setP9VoiceFeedback("Received command. Initiating Automation Engine...");

    const normalized = cmd.toLowerCase();
    let steps: Array<{
      skillName: string;
      params: Record<string, any>;
      state: "pending" | "running" | "success" | "failed" | "confirmation_needed";
      log: string;
    }> = [];

    // Parse commands into plans (Intent Detection & Action Planner)
    if (normalized.includes("youtube") && (normalized.includes("brightness") || normalized.includes("dim"))) {
      steps = [
        {
          skillName: "YouTubeSkill",
          params: { searchQuery: "chill Lo-Fi beats", autoPlay: true },
          state: "pending",
          log: "Pending launch of official YouTube application."
        },
        {
          skillName: "SettingsSkill",
          params: { settingName: "screen_brightness", value: 40 },
          state: "pending",
          log: "Pending system settings brightness adjustment."
        }
      ];
    } else if (normalized.includes("call") || normalized.includes("phone")) {
      steps = [
        {
          skillName: "CallSkill",
          params: { contactName: "Mom", phoneType: "Mobile" },
          state: "pending",
          log: "Telephony dial intent creation pending."
        }
      ];
    } else if (normalized.includes("sms") || normalized.includes("text")) {
      steps = [
        {
          skillName: "SmsSkill",
          params: { recipient: "Mom", messageBody: "On my way home!" },
          state: "pending",
          log: "SMS body assembly and destination resolving pending."
        }
      ];
    } else if (normalized.includes("wi-fi") || normalized.includes("wifi")) {
      steps = [
        {
          skillName: "WiFiSkill",
          params: { state: true },
          state: "pending",
          log: "Awaiting Wi-Fi hardware state validation."
        },
        {
          skillName: "BrowserSkill",
          params: { url: "https://google.com" },
          state: "pending",
          log: "Web view browser intent compilation pending."
        }
      ];
    } else if (normalized.includes("good morning") || normalized.includes("morning briefing")) {
      steps = [
        { skillName: "WeatherSkill", params: { city: "Mumbai" }, state: "pending", log: "Weather REST request formulation." },
        { skillName: "CalendarSkill", params: { title: "Daily Briefing" }, state: "pending", log: "Reading Calendar content provider." }
      ];
    } else if (normalized.includes("good night")) {
      steps = [
        { skillName: "FocusModeSkill", params: { state: true }, state: "pending", log: "Focus state toggle request." },
        { skillName: "AlarmSkill", params: { hour: 7, minute: 15, label: "Morning" }, state: "pending", log: "AlarmManager registration." }
      ];
    } else if (normalized.includes("study")) {
      steps = [
        { skillName: "YouTubeSkill", params: { searchQuery: "lo-fi coding music" }, state: "pending", log: "Play stream request." },
        { skillName: "VolumeSkill", params: { volumePercent: 30 }, state: "pending", log: "AudioManager adjust level." }
      ];
    } else {
      // Default fallback settings skill
      steps = [
        {
          skillName: "SettingsSkill",
          params: { settingName: "system_command", raw: cmd },
          state: "pending",
          log: "Evaluating custom action parameter logic."
        }
      ];
    }

    const newTask = {
      id: "task_" + Date.now(),
      command: cmd,
      status: "PENDING" as const,
      steps: steps
    };

    setP9ActiveTask(newTask);

    // 1. PENDING phase (Wake word & Speech Recognition matches)
    setTimeout(() => {
      setP9LogTracer(prev => [...prev, `[Wake Word/VAD] Match confirmed. Received command "${cmd}".`]);
      setP9LogTracer(prev => [...prev, `[Intent Classifier] Matched commands. Intent confidence score: 0.99`]);
      setP9ActiveTask(prev => prev ? { ...prev, status: "PLANNING" as const } : null);
      setP9VoiceFeedback("Planning your actions...");

      // 2. PLANNING phase (Action Planner decomposes into sequential DAG)
      setTimeout(() => {
        setP9LogTracer(prev => [...prev, `[Action Planner] Built DAG with ${steps.length} sequential operations in 180ms.`]);
        steps.forEach((st, i) => {
          setP9LogTracer(prev => [...prev, `  ├─ Step ${i + 1}: Executing ${st.skillName} with params ${JSON.stringify(st.params)}`]);
        });
        setP9ActiveTask(prev => prev ? { ...prev, status: "EXECUTING" as const } : null);
        setP9VoiceFeedback("Executing plan...");

        // Start executing steps sequentially
        executeP9Steps(newTask.id, steps, 0);
      }, 700);
    }, 450);
  };

  const executeP9Steps = (taskId: string, currentSteps: any[], index: number) => {
    if (index >= currentSteps.length) {
      // Finished all steps successfully!
      setP9ActiveTask(prev => {
        if (!prev) return null;
        return { ...prev, status: "SUCCESS" as const };
      });
      setP9VoiceFeedback("All tasks completed successfully.");
      setP9LogTracer(prev => [...prev, `[Task Executor] Pipeline completed with 100% success. Verified results. Returning view.`]);

      // Add to history
      const newHist = {
        id: "hist_" + Date.now(),
        command: p9CommandInput || currentSteps.map(s => s.skillName).join(" & "),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        result: "SUCCESS",
        duration: 320 + (currentSteps.length * 150),
        permissions: Array.from(new Set(currentSteps.flatMap(s => p9Skills.find(sk => sk.name === s.skillName)?.requiredPermissions || []))),
        deviceState: "Battery: 82%, WiFi: On"
      };
      setP9History(prev => [newHist, ...prev]);
      setP9IsRunning(false);
      return;
    }

    const step = currentSteps[index];
    const skillDetail = p9Skills.find(s => s.name === step.skillName);

    setP9ActiveTask(prev => {
      if (!prev) return null;
      const updated = [...prev.steps];
      updated[index] = { ...updated[index], state: "running" as const };
      return { ...prev, steps: updated };
    });

    setP9LogTracer(prev => [...prev, `[Task Executor] Launching step ${index + 1}: ${step.skillName}...`]);
    setP9LogTracer(prev => [...prev, `[Permission Validator] Checking required permissions: [${skillDetail?.requiredPermissions.join(", ") || "None"}]`]);

    // Check if sensitive - requires explicit User Confirmation Gate!
    if (skillDetail?.isSensitive) {
      setP9ActiveTask(prev => {
        if (!prev) return null;
        const updated = [...prev.steps];
        updated[index] = { ...updated[index], state: "confirmation_needed" as const };
        return { ...prev, status: "WAITING_CONFIRMATION" as const, steps: updated };
      });
      setP9LogTracer(prev => [...prev, `[Safety Gate] SEVERE WARNING: ${step.skillName} is flagged SENSITIVE. Holding pipeline execution for explicit confirmation.`]);
      setP9VoiceFeedback(`Please confirm: Shall I execute ${step.skillName}?`);
      return; // Stop execution here until handleP9Confirmation gets called!
    }

    // Check for failure/recovery scenario (e.g. WiFi is disabled)
    if (step.skillName === "WiFiSkill" && !p9WiFiEnabled) {
      setP9ActiveTask(prev => {
        if (!prev) return null;
        const updated = [...prev.steps];
        updated[index] = { ...updated[index], state: "failed" as const };
        return { ...prev, status: "FAILED" as const, steps: updated };
      });
      setP9LogTracer(prev => [...prev, `[Result Validator] ERROR: Wi-Fi controller returned failure code (STATE_DISABLED). Auto-recovery option matched.`]);
      setP9VoiceFeedback("Wi-Fi is currently disabled. Would you like me to enable it first?");
      return; // Stop here for recovery flow
    }

    // Simulate standard execution delay
    setTimeout(() => {
      setP9ActiveTask(prev => {
        if (!prev) return null;
        const updated = [...prev.steps];
        updated[index] = { ...updated[index], state: "success" as const, log: skillDetail?.output || "Success" };
        return { ...prev, steps: updated };
      });
      setP9LogTracer(prev => [...prev, `[Result Validator] Success. ${step.skillName} output: "${skillDetail?.output || "SUCCESS_OK"}"`]);

      // Move to next step
      executeP9Steps(taskId, currentSteps, index + 1);
    }, 800);
  };

  const handleP9Confirmation = (approved: boolean) => {
    if (!p9ActiveTask) return;
    const currentSteps = p9ActiveTask.steps;
    const currentIdx = currentSteps.findIndex(s => s.state === "confirmation_needed");
    if (currentIdx === -1) return;

    if (approved) {
      setP9LogTracer(prev => [...prev, `[Safety Gate] User explicitly CONFIRMED sensitive action. Resuming execution...`]);
      setP9ActiveTask(prev => {
        if (!prev) return null;
        const updated = [...prev.steps];
        updated[currentIdx] = { ...updated[currentIdx], state: "success" as const, log: "User Confirmed & Executed" };
        return { ...prev, status: "EXECUTING" as const, steps: updated };
      });

      const nextSteps = [...currentSteps];
      nextSteps[currentIdx] = { ...nextSteps[currentIdx], state: "success" as const };

      setTimeout(() => {
        executeP9Steps(p9ActiveTask.id, nextSteps, currentIdx + 1);
      }, 600);
    } else {
      setP9LogTracer(prev => [...prev, `[Safety Gate] User REJECTED sensitive action. Aborting pipeline immediately.`]);
      setP9ActiveTask(prev => {
        if (!prev) return null;
        const updated = [...prev.steps];
        updated[currentIdx] = { ...updated[currentIdx], state: "failed" as const, log: "Aborted by user request" };
        return { ...prev, status: "FAILED" as const, steps: updated };
      });
      setP9VoiceFeedback("Action aborted.");
      setP9IsRunning(false);

      // Add to history
      const newHist = {
        id: "hist_" + Date.now(),
        command: p9CommandInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        result: "FAILED",
        duration: 450,
        permissions: [],
        deviceState: "Battery: 82%, WiFi: On"
      };
      setP9History(prev => [newHist, ...prev]);
    }
  };

  const handleP9RecoveryAction = (approved: boolean) => {
    if (!p9ActiveTask) return;
    const currentSteps = p9ActiveTask.steps;
    const currentIdx = currentSteps.findIndex(s => s.state === "failed");
    if (currentIdx === -1) return;

    if (approved) {
      setP9WiFiEnabled(true);
      setP9LogTracer(prev => [...prev, `[Auto-Recovery] Executed automatic correction: Enabled Wi-Fi radio adaptor state (WIFI_RADIO_ON).`]);
      setP9LogTracer(prev => [...prev, `[Auto-Recovery] Retrying failed step ${currentIdx + 1}: WiFiSkill...`]);
      
      setP9ActiveTask(prev => {
        if (!prev) return null;
        const updated = [...prev.steps];
        updated[currentIdx] = { ...updated[currentIdx], state: "success" as const, log: "WiFi enabled via auto-recovery" };
        return { ...prev, status: "EXECUTING" as const, steps: updated };
      });

      const nextSteps = [...currentSteps];
      nextSteps[currentIdx] = { ...nextSteps[currentIdx], state: "success" as const };

      setTimeout(() => {
        executeP9Steps(p9ActiveTask.id, nextSteps, currentIdx + 1);
      }, 650);
    } else {
      setP9LogTracer(prev => [...prev, `[Auto-Recovery] User skipped recovery. Continuing sequence with skipped step.`]);
      setP9ActiveTask(prev => {
        if (!prev) return null;
        const updated = [...prev.steps];
        updated[currentIdx] = { ...updated[currentIdx], state: "failed" as const, log: "Skipped by user" };
        return { ...prev, status: "EXECUTING" as const, steps: updated };
      });

      const nextSteps = [...currentSteps];
      nextSteps[currentIdx] = { ...nextSteps[currentIdx], state: "failed" as const };

      setTimeout(() => {
        executeP9Steps(p9ActiveTask.id, nextSteps, currentIdx + 1);
      }, 500);
    }
  };

  const toggleP9Schedule = (id: string) => {
    setP9Schedules(prev =>
      prev.map(s => (s.id === id ? { ...s, isEnabled: !s.isEnabled } : s))
    );
    const target = p9Schedules.find(s => s.id === id);
    if (target) {
      addFrameworkLog("info", "Scheduler", `Trigger for scheduled automation "${target.title}" set to ${!target.isEnabled ? "ENABLED" : "DISABLED"}`);
    }
  };

  const deleteP9HistoryItem = (id: string) => {
    setP9History(prev => prev.filter(h => h.id !== id));
    addFrameworkLog("info", "AutomationHistory", `Cleared history item [${id}]`);
  };

  const exportP9History = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(p9History, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `jarvis_automation_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addFrameworkLog("broadcast", "AutomationHistory", "Successfully generated and downloaded automation logs package.");
  };

  const addP9CustomShortcut = (trigger: string, command: string) => {
    if (!trigger.trim() || !command.trim()) return;
    setP9CustomShortcuts(prev => [{ trigger, command }, ...prev]);
    addFrameworkLog("info", "ShortcutsManager", `Added custom voice shortcut trigger: "${trigger}" -> "${command}"`);
  };



  // Part 4 State Machine Countdown effect
  useEffect(() => {
    if (followUpTimer <= 0) return;
    const interval = setInterval(() => {
      setFollowUpTimer((prev) => {
        if (prev <= 1) {
          setSimState("RETURNING_TO_STANDBY");
          setSimFeedback("Follow-up timeout exceeded. Re-acquiring partial WakeLock & local VAD...");
          setTimeout(() => {
            setSimState("WAKE_LISTENING");
            setSimFeedback("Awaiting local 'Hey Jarvis' voice trigger.");
          }, 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [followUpTimer]);

  // Part 5 Effects and pipeline controller
  useEffect(() => {
    part5IsInterruptedRef.current = part5IsInterrupted;
  }, [part5IsInterrupted]);

  useEffect(() => {
    part5ConfirmationPendingRef.current = part5ConfirmationPending;
  }, [part5ConfirmationPending]);

  const handlePart5Interruption = () => {
    setPart5IsInterrupted(true);
    part5IsInterruptedRef.current = true;
    addFrameworkLog("broadcast", "AiBrainOrchestrator", "Speech interruption signal fired by user tap!");
  };

  const handlePart5Confirmation = (confirmed: boolean) => {
    part5UserConfirmedRef.current = confirmed;
    setPart5ConfirmationPending(false);
    part5ConfirmationPendingRef.current = false;
    addFrameworkLog("perm", "SafetyController", `User confirmation result: ${confirmed ? "APPROVED" : "REJECTED"}`);
  };

  const runPart5ConversationPipeline = async (phrase: string) => {
    setPart5IsInterrupted(false);
    part5IsInterruptedRef.current = false;
    setPart5ConfirmationPending(false);
    part5ConfirmationPendingRef.current = false;
    part5UserConfirmedRef.current = null;
    
    // Auto detect language
    let lang = "English";
    if (part5LanguageMode === "Auto") {
      const hasDevanagari = /[\u0900-\u097F]/.test(phrase);
      if (hasDevanagari) {
        if (phrase.includes("आहे") || phrase.includes("करा") || phrase.includes("करू") || phrase.includes("लाव") || phrase.includes("टॉर्च")) {
          lang = "Marathi";
        } else {
          lang = "Hindi";
        }
      } else {
        lang = "English";
      }
    } else {
      lang = part5LanguageMode;
    }
    setPart5DetectedLanguage(lang);

    // AI Reasoning Pre-evaluation setup
    let isConv = false;
    let isCmd = false;
    let isAuto = false;
    let isConn = false;
    let clarNeeded = false;
    let confReq = false;
    let offlineApi = false;
    let actionLabel = "";
    let systemResponse = "";

    const lower = phrase.toLowerCase();
    if (lower.includes("alarm") || lower.includes("अलार्म") || lower.includes("reminder") || lower.includes("remind") || lower.includes("लाव")) {
      isCmd = true;
      confReq = true;
      offlineApi = true;
      actionLabel = "Create Alarm/Reminder";
      systemResponse = lang === "Hindi" 
        ? "मैंने आपके लिए कल सुबह ९ बजे का अलार्म लगा दिया है।" 
        : lang === "Marathi"
        ? "मी उद्या सकाळी ९ वाजताचा अलार्म सेट केला आहे."
        : "I have created the reminder for tomorrow at 9 AM.";
    } else if (lower.includes("flashlight") || lower.includes("torch") || lower.includes("टॉर्च") || lower.includes("प्रकाश")) {
      isCmd = true;
      confReq = false;
      offlineApi = true;
      actionLabel = "Toggle Flashlight";
      systemResponse = lang === "Hindi"
        ? "फ़्लैशलाइट चालू कर दी गई है।"
        : lang === "Marathi"
        ? "टॉर्च चालू करण्यात आली आहे."
        : "Flashlight turned on successfully.";
    } else if (lower.includes("gmail") || lower.includes("email") || lower.includes("draft") || lower.includes("ईमेल")) {
      isAuto = true;
      confReq = true;
      actionLabel = "Draft Gmail to Sarah";
      systemResponse = lang === "Hindi"
        ? "मैंने साराह के लिए ईमेल ड्राफ्ट तैयार कर लिया है।"
        : lang === "Marathi"
        ? "मी सारासाठी ईमेल मसुदा तयार केला आहे."
        : "I've prepared the email draft for Sarah asking about the 5 PM meeting.";
    } else if (lower.includes("calendar") || lower.includes("schedule") || lower.includes("meeting") || lower.includes("कैलेंडर")) {
      isAuto = true;
      confReq = true;
      actionLabel = "Create Calendar Event";
      systemResponse = lang === "Hindi"
        ? "मैंने कल सुबह १० बजे की टीम मीटिंग शेड्यूल कर दी है।"
        : lang === "Marathi"
        ? "मी उद्या सकाळी १० वाजता टीम मीटिंग शेड्यूल केली आहे."
        : "I have successfully scheduled the team standup tomorrow at 10 AM.";
    } else if (lower.includes("weather") || lower.includes("तापमान") || lower.includes("हवामान")) {
      isConn = true;
      offlineApi = false;
      systemResponse = lang === "Hindi"
        ? "नई दिल्ली में आज आंशिक रूप से बादल छाए हुए हैं और तापमान २४ डिग्री सेल्सियस है।"
        : lang === "Marathi"
        ? "मुंबईत आज अंशतः ढगाळ हवामान असून तापमान २८ अंश सेल्सिअस आहे."
        : "The weather in New York is currently 68°F and Partly Cloudy.";
    } else {
      isConv = true;
      systemResponse = lang === "Hindi"
        ? `नमस्ते! मैं जार्विस हूँ। मैंने आपका अनुरोध सुना: "${phrase}". मैं आपकी क्या मदद कर सकता हूँ?`
        : lang === "Marathi"
        ? `नमस्कार! मी जार्विस आहे. मी तुमची विनंती ऐकली: "${phrase}". मी तुम्हाला कशी मदत करू?`
        : `I've received your request: "${phrase}". Let me know how I can help you further!`;
    }

    setPart5ReasoningChecklist({
      isConversation: isConv,
      isDeviceCommand: isCmd,
      isAutomation: isAuto,
      isConnector: isConn,
      clarificationNeeded: clarNeeded,
      confirmationRequired: confReq,
      canUseOfflineApi: offlineApi
    });

    setPart5SessionTurns(prev => [...prev, { sender: "user", text: phrase, lang }]);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const pipelineSteps = [
      "Wake Word Detected",
      "Assistant Activated",
      "Speech-to-Text (STT)",
      "Language Detection",
      "Intent Detection",
      "Context Retrieval",
      "Memory Retrieval",
      "AI Reasoning",
      "Action Planning",
      "Safety & Permission Check",
      "Task Execution (if applicable)",
      "Response Generation",
      "Text-to-Speech (TTS)",
      "Follow-up Listening"
    ];

    addFrameworkLog("info", "AiBrainOrchestrator", `Executing Voice Conversation Pipeline. Active AI Provider: [${part5Provider}]`);

    for (let i = 0; i <= 13; i++) {
      if (part5IsInterruptedRef.current) {
        addFrameworkLog("broadcast", "AiBrainOrchestrator", "Voice Conversation Pipeline aborted due to speech interrupt.");
        setPart5ActivePipelineStep(-1);
        return;
      }

      setPart5ActivePipelineStep(i);

      if (i === 0) {
        setSimState("WAKE_DETECTED");
        if (activationSoundEnabled) {
          try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.setValueAtTime(880, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            osc.start(); osc.stop(audioCtx.currentTime + 0.15);
          } catch(e){}
        }
        setSimFeedback("Pipeline State: Wake word detected. Transitioning resource lock states...");
        await delay(600);
      } else if (i === 1) {
        setSimState("OVERLAY_OPENING");
        setSimFeedback("Pipeline State: Assistant activated. Drawing floating visual waveforms overlay.");
        await delay(500);
      } else if (i === 2) {
        setSimState("COMMAND_LISTENING");
        setSimFeedback(`Pipeline State: STT is transcribing raw vocal audio buffer...`);
        await delay(600);
      } else if (i === 3) {
        setSimFeedback(`Pipeline State: Language Detection identified dialect context as [${lang}].`);
        await delay(500);
      } else if (i === 4) {
        setSimFeedback(`Pipeline State: Decoupled intent detection analyzing semantic parse trees...`);
        await delay(500);
      } else if (i === 5) {
        setSimFeedback(`Pipeline State: Restoring turn history. Merging context nodes with session data.`);
        await delay(450);
      } else if (i === 6) {
        setSimFeedback(`Pipeline State: Deep memory retrieval reading custom contacts map and favorite presets.`);
        await delay(450);
      } else if (i === 7) {
        setSimState("PROCESSING");
        setSimFeedback(`Pipeline State: AI Brain Orchestrator evaluating query via provider [${part5Provider}].`);
        await delay(800);
      } else if (i === 8) {
        setSimFeedback(`Pipeline State: Formulating execution blueprint for target intent actions...`);
        await delay(500);
      } else if (i === 9) {
        if (confReq) {
          setPart5ConfirmationPending(true);
          setPart5ConfirmationPendingAction(actionLabel);
          setSimFeedback(`Pipeline State: Safety controller engaged. Awaiting user explicit confirmation click...`);
          
          while (part5ConfirmationPendingRef.current) {
            await delay(100);
            if (part5IsInterruptedRef.current) {
              setPart5ActivePipelineStep(-1);
              return;
            }
          }
          
          if (part5UserConfirmedRef.current === false) {
            addFrameworkLog("perm", "SafetyController", "Action execution rejected by the user. Pipeline cancelled.");
            setSimFeedback("Execution cancelled by user safety rejection. Returning to standby...");
            setPart5ActivePipelineStep(-1);
            setSimState("WAKE_LISTENING");
            return;
          }
        } else {
          setSimFeedback("Pipeline State: Safety lock passed automatically (passive observation request).");
          await delay(400);
        }
      } else if (i === 10) {
        if (actionLabel) {
          setSimFeedback(`Pipeline State: Committing intents to local Android APIs for: [${actionLabel}].`);
          if (actionLabel === "Toggle Flashlight") {
            setDeviceState(prev => ({ ...prev, flashlightOn: !prev.flashlightOn }));
          } else if (actionLabel === "Create Alarm/Reminder") {
            setReminders(prev => [...prev, { id: "rem_" + Date.now(), time: "9:00 AM", text: "Scheduled voice reminder" }]);
          } else if (actionLabel === "Create Calendar Event") {
            setCalendarEvents(prev => [...prev, { id: "cal_" + Date.now(), time: "10:00 AM", text: "Team standup tomorrow", date: "Tomorrow" } as any]);
          } else if (actionLabel === "Draft Gmail to Sarah") {
            setGmailDraft({
              recipient: "Sarah (sarah@example.com)",
              subject: "Meeting Confirmation",
              body: "Hi Sarah, are we still meeting at 5 PM? Let me know.",
              extraInfo: "Pre-filled by AI Brain Orchestrator Voice Pipeline"
            });
            setActiveScreen("gmail");
          }
        } else {
          setSimFeedback("Pipeline State: Pure conversation. Skipping native intent Dispatch service.");
        }
        await delay(700);
      } else if (i === 11) {
        setSimFeedback("Pipeline State: Formatting response buffers and tokenizing output stream...");
        await delay(450);
      } else if (i === 12) {
        setSimState("SPEAKING");
        setSimFeedback(`Pipeline State: Vocally outputting spoken response (TTS): "${systemResponse}"`);
        
        for (let s = 0; s < 15; s++) {
          await delay(150);
          if (part5IsInterruptedRef.current) {
            addFrameworkLog("broadcast", "TextToSpeech", "Playback interrupted immediately! Muting audio stream.");
            setPart5ActivePipelineStep(-1);
            setSimState("WAKE_LISTENING");
            return;
          }
        }
      } else if (i === 13) {
        setSimState("WAITING_FOR_FOLLOW_UP");
        setSimFeedback("Pipeline State: Follow-up VAD listening window active. Awaiting multi-turn speech...");
        setFollowUpTimer(followUpTimeout);
        await delay(400);
      }
    }
    
    setPart5ActivePipelineStep(-1);
  };

  const simulateWakeWordDetected = () => {
    if (simState === "DISABLED" || simState === "PAUSED") {
      setSimFeedback("Wake-word engine is currently inactive. Toggle Always-on Listening or resume the assistant.");
      return;
    }
    setFollowUpTimer(0);
    setSimState("WAKE_DETECTED");
    setSimFeedback("Acoustic classification hit confidence 0.94! Triggering audio chime tone...");
    
    // Play subtle synthetic beep audio
    if (activationSoundEnabled) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // high pure beep
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } catch (e) {
        console.warn("Audio Context beep failed", e);
      }
    }

    addFrameworkLog("info", "HotwordEngine", "Local wake-phrase classification triggered 'Hey Jarvis' at 94% confidence.");

    // Transition chain
    setTimeout(() => {
      setSimState("OVERLAY_OPENING");
      setSimFeedback("Initializing WindowManager application overlay TYPE_APPLICATION_OVERLAY...");
      addFrameworkLog("bind", "WindowManager", "Inflated system dialog layer. Overlay sliding in from bottom.");
      
      setTimeout(() => {
        setSimState("COMMAND_LISTENING");
        setSimFeedback("Waiting for user command. Waveform animating, STT pipeline active.");
        addFrameworkLog("info", "VoiceInteraction", "Continuous speech-to-text pipeline started. Recording PCM buffer...");
      }, 1000);
    }, 800);
  };

  const simulateSendCommand = (phrase: string) => {
    if (simState !== "COMMAND_LISTENING" && simState !== "WAITING_FOR_FOLLOW_UP") {
      setSimFeedback("Must be in COMMAND_LISTENING or WAITING_FOR_FOLLOW_UP state to process spoken input.");
      return;
    }
    setFollowUpTimer(0);
    setSimState("PROCESSING");
    setSimFeedback(`Vocal input transcribed: "${phrase}". Consulting Gemini LLM provider...`);
    addFrameworkLog("info", "AutomatedSpeechRecognition", `Transcribed: "${phrase}"`);
    addFrameworkLog("power", "PowerManager", "CPU frequency bumped to MAX. LLM request active.");

    setTimeout(() => {
      setSimState("SPEAKING");
      const simulatedResponse = `I have processed that request: "${phrase}". Setting options accordingly.`;
      setSimFeedback(`Jarvis speaking response out loud (TTS): "${simulatedResponse}"`);
      addFrameworkLog("info", "TextToSpeech", "Synthesizing output buffer.");

      // Optional sound response
      if (activationSoundEnabled) {
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = "triangle";
          osc.frequency.setValueAtTime(440, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.2);
        } catch (e) {}
      }

      setTimeout(() => {
        setSimState("WAITING_FOR_FOLLOW_UP");
        setSimFeedback(`Standing by for multi-turn follow-up command. Timeout ticking down...`);
        setFollowUpTimer(followUpTimeout);
        addFrameworkLog("info", "VoiceInteraction", `Entering conversational follow-up loop. Cooldown timer set to ${followUpTimeout}s.`);
      }, 2500);
    }, 1800);
  };

  // Simulated active app details (for intent execution)
  const [gmailDraft, setGmailDraft] = useState<IntentData | null>(null);
  const [reminders, setReminders] = useState<{ id: string; time: string; text: string }[]>([
    { id: "r1", time: "6:00 PM", text: "Water the plants" },
    { id: "r2", time: "9:00 PM", text: "Read spec files" }
  ]);
  const [calendarEvents, setCalendarEvents] = useState<{ id: string; time: string; subject: string; date: string }[]>([
    { id: "c1", time: "2:00 PM", text: "Standup with Android Team" } as any // custom events
  ]);
  const [weatherData, setWeatherData] = useState<{ temp: string; condition: string; city: string }>({
    temp: "68°F",
    condition: "Partly Cloudy",
    city: "San Francisco"
  });
  const [musicPlaying, setMusicPlaying] = useState({
    title: "Intro (Identity)",
    artist: "The Jarvis Project",
    playing: false,
    progress: 35
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);

  // Premium Voice Engine States
  const [premiumVoiceEnabled, setPremiumVoiceEnabled] = useState<boolean>(() => {
    return localStorage.getItem("jarvis_premium_voice_enabled") !== "false";
  });
  const [selectedPremiumVoice, setSelectedPremiumVoice] = useState<string>(() => {
    return localStorage.getItem("jarvis_selected_premium_voice") || "Zephyr";
  });
  const [voiceSpeed, setVoiceSpeed] = useState<number>(() => {
    return parseFloat(localStorage.getItem("jarvis_voice_speed") || "1.0");
  });
  const [voicePitch, setVoicePitch] = useState<number>(() => {
    return parseFloat(localStorage.getItem("jarvis_voice_pitch") || "1.0");
  });

  // Multimodal Attachment State (Supports name, mimeType, base64 data, size, previewUrl, storageUrl, and isUploading)
  const [attachments, setAttachments] = useState<Array<{ name: string; mimeType: string; data: string; size?: number; previewUrl?: string; storageUrl?: string; isUploading?: boolean }>>([]);
  const [showAttachmentSheet, setShowAttachmentSheet] = useState<boolean>(false);
  const [showCameraModal, setShowCameraModal] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Hidden File Input Refs for Android SAF / Storage Access
  const fileInputGalleryRef = useRef<HTMLInputElement>(null);
  const fileInputDocsRef = useRef<HTMLInputElement>(null);
  const fileInputVideoRef = useRef<HTMLInputElement>(null);
  const fileInputAudioRef = useRef<HTMLInputElement>(null);
  const fileInputAnyRef = useRef<HTMLInputElement>(null);
  const fileInputCameraRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  // Helper to format file size in human-readable units
  const formatFileSize = (bytes?: number): string => {
    if (bytes === undefined || bytes === null || isNaN(bytes)) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Generic File Reader Handler for selected files with 10MB size limit check
  const MAX_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const filesArray = Array.from(fileList);
    
    filesArray.forEach((file) => {
      // Size validation check: alert user if attachment exceeds 10MB limit
      if (file.size > MAX_ATTACHMENT_SIZE_BYTES) {
        const warningMessage = `Attachment "${file.name}" (${formatFileSize(file.size)}) exceeds the 10MB size limit. Please select a smaller file.`;
        alert(warningMessage);
        addFrameworkLog("error", "AttachmentManager", `File rejected: "${file.name}" (${formatFileSize(file.size)}) exceeds 10MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        let result = reader.result as string;
        let rawBase64 = result;
        if (result.includes(";base64,")) {
          rawBase64 = result.split(";base64,").pop() || "";
        }
        const mimeType = file.type || "application/octet-stream";
        const isImage = mimeType.startsWith("image/");

        setAttachments((prev) => [
          ...prev,
          {
            name: file.name,
            mimeType,
            data: rawBase64,
            size: file.size,
            previewUrl: isImage ? result : undefined,
            isUploading: true
          }
        ]);
        addFrameworkLog("info", "AttachmentManager", `Uploading attached file to Firebase Storage: ${file.name}...`);

        try {
          const storageUrl = await uploadAttachmentToFirebase(file, file.name);
          setAttachments((prev) =>
            prev.map((att) =>
              att.name === file.name && att.isUploading
                ? { ...att, storageUrl, isUploading: false }
                : att
            )
          );
          addFrameworkLog("info", "AttachmentManager", `Firebase Storage upload complete for "${file.name}". Persistent URL: ${storageUrl}`);
        } catch (err: any) {
          addFrameworkLog("error", "AttachmentManager", `Firebase Storage upload failed: ${err.message}`);
          setAttachments((prev) =>
            prev.map((att) =>
              att.name === file.name ? { ...att, isUploading: false } : att
            )
          );
        }
      };
      reader.readAsDataURL(file);
    });
    setShowAttachmentSheet(false);
  };

  // Trigger Camera Viewfinder Modal or Camera Input
  const handleTriggerCamera = async () => {
    setShowAttachmentSheet(false);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        setCameraStream(stream);
        setShowCameraModal(true);
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
        }
        addFrameworkLog("info", "CameraService", "Camera viewfinder opened with live video stream.");
      } else {
        fileInputCameraRef.current?.click();
      }
    } catch (err: any) {
      addFrameworkLog("info", "CameraService", "Camera viewfinder unavailable. Opening native camera file picker.");
      fileInputCameraRef.current?.click();
    }
  };

  const handleCapturePhotoFromCamera = () => {
    if (!videoPreviewRef.current) return;
    const video = videoPreviewRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      const rawBase64 = dataUrl.split(";base64,").pop() || "";
      const photoName = `camera_snap_${Date.now()}.png`;
      const sizeEstimate = Math.round((rawBase64.length * 3) / 4);

      setAttachments((prev) => [
        ...prev,
        {
          name: photoName,
          mimeType: "image/png",
          data: rawBase64,
          size: sizeEstimate,
          previewUrl: dataUrl,
          isUploading: true
        }
      ]);
      addFrameworkLog("info", "AttachmentManager", `Captured photo: ${photoName} (${formatFileSize(sizeEstimate)}). Uploading to Firebase Storage...`);

      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            const storageUrl = await uploadAttachmentToFirebase(blob, photoName);
            setAttachments((prev) =>
              prev.map((att) =>
                att.name === photoName && att.isUploading
                  ? { ...att, storageUrl, isUploading: false }
                  : att
              )
            );
            addFrameworkLog("info", "AttachmentManager", `Camera snap uploaded to Firebase Storage: ${storageUrl}`);
          } catch (err: any) {
            addFrameworkLog("error", "AttachmentManager", `Firebase Storage camera snapshot upload error: ${err.message}`);
            setAttachments((prev) =>
              prev.map((att) =>
                att.name === photoName ? { ...att, isUploading: false } : att
              )
            );
          }
        }
      }, "image/png");
    }

    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
  };

  const handleCloseCameraModal = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
  };

  // Clipboard Reader Handler
  const handleClipboardPaste = async () => {
    setShowAttachmentSheet(false);
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const items = await navigator.clipboard.read();
        let imagePasted = false;
        for (const item of items) {
          for (const type of item.types) {
            if (type.startsWith("image/")) {
              const blob = await item.getType(type);
              if (blob.size > MAX_ATTACHMENT_SIZE_BYTES) {
                alert(`Pasted clipboard image (${formatFileSize(blob.size)}) exceeds the maximum allowed limit of 10MB.`);
                addFrameworkLog("error", "AttachmentManager", `Clipboard image rejected: ${formatFileSize(blob.size)} exceeds 10MB limit.`);
                break;
              }
              const reader = new FileReader();
              reader.onload = async () => {
                const result = reader.result as string;
                const rawBase64 = result.includes(";base64,") ? result.split(";base64,").pop() || "" : result;
                const clipName = `clipboard_image_${Date.now()}.png`;
                setAttachments((prev) => [
                  ...prev,
                  {
                    name: clipName,
                    mimeType: type,
                    data: rawBase64,
                    size: blob.size,
                    previewUrl: result,
                    isUploading: true
                  }
                ]);
                addFrameworkLog("info", "AttachmentManager", `Uploading pasted clipboard image (${formatFileSize(blob.size)}) to Firebase Storage...`);

                try {
                  const storageUrl = await uploadAttachmentToFirebase(blob, clipName);
                  setAttachments((prev) =>
                    prev.map((att) =>
                      att.name === clipName && att.isUploading
                        ? { ...att, storageUrl, isUploading: false }
                        : att
                    )
                  );
                  addFrameworkLog("info", "AttachmentManager", `Clipboard image uploaded to Firebase Storage: ${storageUrl}`);
                } catch (err: any) {
                  addFrameworkLog("error", "AttachmentManager", `Firebase Storage upload for clipboard image failed: ${err.message}`);
                  setAttachments((prev) =>
                    prev.map((att) =>
                      att.name === clipName ? { ...att, isUploading: false } : att
                    )
                  );
                }
              };
              reader.readAsDataURL(blob);
              imagePasted = true;
              break;
            }
          }
        }
        if (!imagePasted) {
          const text = await navigator.clipboard.readText();
          if (text) {
            setInputVal((prev) => (prev ? prev + " " + text : text));
            addFrameworkLog("info", "AttachmentManager", `Pasted text snippet from clipboard into prompt.`);
            setVoiceNotice(`Pasted text from clipboard!`);
            setTimeout(() => setVoiceNotice(null), 3000);
          } else {
            setVoiceNotice("Clipboard is empty or no compatible item found.");
            setTimeout(() => setVoiceNotice(null), 3000);
          }
        }
      } else if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputVal((prev) => (prev ? prev + " " + text : text));
          addFrameworkLog("info", "AttachmentManager", `Pasted text snippet from clipboard.`);
          setVoiceNotice(`Pasted text from clipboard!`);
          setTimeout(() => setVoiceNotice(null), 3000);
        } else {
          setVoiceNotice("Clipboard is empty.");
          setTimeout(() => setVoiceNotice(null), 3000);
        }
      }
    } catch (err: any) {
      addFrameworkLog("info", "AttachmentManager", "Clipboard access notice: Clipboard permission pending in frame sandbox.");
      setVoiceNotice("Clipboard notice: Select a file or image from options.");
      setTimeout(() => setVoiceNotice(null), 4000);
    }
  };

  // Part 10 Simulator Local States
  const [p10ManualText, setP10ManualText] = useState<string>("Analyze this attached document");
  const [p10SelectedTheme, setP10SelectedTheme] = useState<"cyber" | "oled" | "brass" | "nebula" | "default">("default");
  const [p10VisionResponse, setP10VisionResponse] = useState<string>("");
  const [p10ActiveScenario, setP10ActiveScenario] = useState<string>("idle");

  // Part 11: Security, Privacy, Cloud Sync States
  const [authLockEnabled, setAuthLockEnabled] = useState<boolean>(true);
  const [isAuthed, setIsAuthed] = useState<boolean>(false);
  const [secureStorageEnabled, setSecureStorageEnabled] = useState<boolean>(true);
  const [networkSecurityLevel, setNetworkSecurityLevel] = useState<"standard" | "strict">("strict");
  const [privacyMemoryEnabled, setPrivacyMemoryEnabled] = useState<boolean>(true);
  const [privacyAnalyticsEnabled, setPrivacyAnalyticsEnabled] = useState<boolean>(false);
  const [cloudSyncEnabled, setCloudSyncEnabled] = useState<boolean>(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<"IDLE" | "SYNCING" | "SUCCESS" | "PAUSED" | "FAILED">("IDLE");
  const [syncConflictPolicy, setSyncConflictPolicy] = useState<"MERGE" | "LOCAL_WINS" | "SERVER_WINS">("MERGE");
  const [backupSchedule, setBackupSchedule] = useState<"DAILY" | "WEEKLY" | "MONTHLY" | "MANUAL">("DAILY");
  const [devMetricsVisible, setDevMetricsVisible] = useState<boolean>(true);
  
  // Permission management simulators
  const [permissionCamera, setPermissionCamera] = useState<boolean>(true);
  const [permissionMicrophone, setPermissionMicrophone] = useState<boolean>(true);
  const [permissionLocation, setPermissionLocation] = useState<boolean>(false);
  const [permissionBackground, setPermissionBackground] = useState<boolean>(false);

  // AES Crypto Simulator State
  const [cryptoInput, setCryptoInput] = useState<string>("User biometric session payload token: standard_2026_jarvis_e2ee");
  const [cryptoCipher, setCryptoCipher] = useState<string>("U2FsdGVkX18H4k5zN9gU7cR+q8NnVx6F...");
  const [cryptoAlgorithm, setCryptoAlgorithm] = useState<string>("AES-256-GCM / PBKDF2 Key Derivation");

  // Phase 12: Future Expansion, AI Agents & Jarvis Ultimate Vision States
  const [installedAgents, setInstalledAgents] = useState([
    { id: "agent_assistant", name: "Personal Assistant Agent", description: "Handles day-to-day briefings, emails and general summaries.", capabilities: ["briefing", "summarization"], permissions: ["Read Calendar", "Read Contacts"], enabled: true, installed: true },
    { id: "agent_productivity", name: "Productivity Agent", description: "Automates schedules, lists, focus alerts and reminders.", capabilities: ["reminder", "alarms"], permissions: ["Post Notifications"], enabled: true, installed: true },
    { id: "agent_research", name: "Research Agent", description: "Researches terms, web documentation, and queries papers.", capabilities: ["web_research", "summarization"], permissions: ["Internet Access"], enabled: true, installed: true },
    { id: "agent_travel", name: "Travel Coordinator", description: "Formulates flight plans, schedules itineraries and maps routes.", capabilities: ["route_planning", "bookings"], permissions: ["GPS Location", "Read Calendar"], enabled: false, installed: false },
    { id: "agent_finance", name: "Finance Tracker Agent", description: "Monitors personal budgets, tracks receipts, warns on spikes.", capabilities: ["budgeting", "analysis"], permissions: ["Read Files"], enabled: false, installed: false },
    { id: "agent_fitness", name: "Health & Fitness Planner", description: "Wellness summaries, hydration logs, and step tracking.", capabilities: ["hydration_tracking", "workouts"], permissions: ["Physical Activity"], enabled: true, installed: true },
    { id: "agent_learning", name: "Learning Assistant", description: "Offers personalized dynamic quiz challenges and guides studies.", capabilities: ["study_quiz", "flashcards"], permissions: [], enabled: false, installed: false }
  ]);
  const [modelProvider, setModelProvider] = useState<"CLOUD" | "LOCAL" | "OFFLINE">("CLOUD");
  const [planningGoal, setPlanningGoal] = useState<string>("weekend_trip");
  const [planningSteps, setPlanningSteps] = useState<Array<{ id: string; name: string; desc: string; agent: string; status: "pending" | "running" | "completed" | "failed" }>>([
    { id: "step1", name: "Fetch Weekend Forecast", desc: "Consult weather APIs for target city", agent: "Personal Assistant Agent", status: "pending" },
    { id: "step2", name: "Formulate Map Route", desc: "Analyze optimal GPS roads & transit", agent: "Travel Coordinator", status: "pending" },
    { id: "step3", name: "Budget Review", desc: "Check current weekly expenses ledger", agent: "Finance Tracker Agent", status: "pending" },
    { id: "step4", name: "Synchronize Calendar", desc: "Insert trip placeholder timeline", agent: "Productivity Agent", status: "pending" }
  ]);
  const [isPlanningRunning, setIsPlanningRunning] = useState<boolean>(false);
  const [planningConsoleOutput, setPlanningConsoleOutput] = useState<string>("Standing by. Select a collaborative prompt template below to watch Multi-Agent Planning in real-time.");
  const [isDeveloperModeTab, setIsDeveloperModeTab] = useState<boolean>(false);
  const [devLogsCount, setDevLogsCount] = useState<number>(INITIAL_LOGS.length);

  // Refs for Premium Sound & Speech engines
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Sync memory states to local storage
  useEffect(() => {
    localStorage.setItem("jarvis_premium_voice_enabled", String(premiumVoiceEnabled));
  }, [premiumVoiceEnabled]);

  useEffect(() => {
    localStorage.setItem("jarvis_selected_premium_voice", selectedPremiumVoice);
  }, [selectedPremiumVoice]);

  useEffect(() => {
    localStorage.setItem("jarvis_voice_speed", String(voiceSpeed));
  }, [voiceSpeed]);

  useEffect(() => {
    localStorage.setItem("jarvis_voice_pitch", String(voicePitch));
  }, [voicePitch]);

  // Part 2 Behavior & Memory States
  const [humorMode, setHumorMode] = useState<boolean>(() => {
    return localStorage.getItem("jarvis_humor_mode") === "true";
  });
  const [preferredLanguage, setPreferredLanguage] = useState<string>(() => {
    return localStorage.getItem("jarvis_preferred_language") || "auto";
  });
  const [favoriteContact, setFavoriteContact] = useState<string>(() => {
    return localStorage.getItem("jarvis_favorite_contact") || "Rahul Sharma (Work)";
  });
  const [favoriteMusicService, setFavoriteMusicService] = useState<string>(() => {
    return localStorage.getItem("jarvis_favorite_music_service") || "Spotify";
  });
  const [activeListening, setActiveListening] = useState<boolean>(true);
  const [pendingAction, setPendingAction] = useState<{
    intent: AndroidIntent;
    data: IntentData | undefined;
    label: string;
    spokenResponse: string;
  } | null>(null);

  // Sync memory states with secure local preferences
  useEffect(() => {
    localStorage.setItem("jarvis_humor_mode", String(humorMode));
  }, [humorMode]);

  useEffect(() => {
    localStorage.setItem("jarvis_preferred_language", preferredLanguage);
  }, [preferredLanguage]);

  useEffect(() => {
    localStorage.setItem("jarvis_favorite_contact", favoriteContact);
  }, [favoriteContact]);

  useEffect(() => {
    localStorage.setItem("jarvis_favorite_music_service", favoriteMusicService);
  }, [favoriteMusicService]);

  // Web Speech API interfaces
  const [speechSupported, setSpeechSupported] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [speechPermissionState, setSpeechPermissionState] = useState<PermissionState | "unknown">("unknown");
  const recognitionRef = useRef<any>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Time Sync Tick
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDeviceState((prev) => ({
        ...prev,
        systemTime: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // CPU Fluctuations for hyper-realism
  useEffect(() => {
    const interval = setInterval(() => {
      setDeviceState((prev) => {
        let delta = Math.floor(Math.random() * 8) - 4;
        let base = prev.isProcessing ? 45 : prev.isListening ? 25 : 12;
        let nextCpu = Math.max(5, Math.min(95, base + delta));
        return { ...prev, cpuLoad: nextCpu };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Initialize Speech Recognition & Synthesis
  useEffect(() => {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-US";

        rec.onstart = () => {
          setDeviceState((prev) => ({ ...prev, isListening: true }));
          addFrameworkLog("info", "HotwordEngine", "Microphone session opened. Automated Speech Recognition active.");
        };

        rec.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          addFrameworkLog("info", "AutomatedSpeechRecognition", `Transcribed audio: "${text}"`);
          handleSendMessage(text);
        };

        rec.onerror = (e: any) => {
          addFrameworkLog("info", "SpeechRecognition", `Microphone session notification: ${e.error || "ended"}`);
          setDeviceState((prev) => ({ ...prev, isListening: false }));
        };

        rec.onend = () => {
          setDeviceState((prev) => ({ ...prev, isListening: false }));
        };

        recognitionRef.current = rec;
      } else {
        setSpeechSupported(false);
        addFrameworkLog("info", "SpeechRecognition", "Browser speech recognition API is unavailable in this environment. Voice input automatically disabled; using text input fallback.");
      }
    } catch (err: any) {
      setSpeechSupported(false);
      addFrameworkLog("info", "SpeechRecognition", "Speech recognition API check skipped in this browser environment.");
    }

    // Try checking microphone permission
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: "microphone" as any }).then((permissionStatus) => {
        setSpeechPermissionState(permissionStatus.state);
        if (permissionStatus.state === "granted") {
          setDeviceState((prev) => ({ ...prev, microphoneGranted: true }));
        }
        permissionStatus.onchange = () => {
          setSpeechPermissionState(permissionStatus.state);
          setDeviceState((prev) => ({
            ...prev,
            microphoneGranted: permissionStatus.state === "granted"
          }));
          addFrameworkLog("perm", "PermissionsProvider", `Microphone state changed to: ${permissionStatus.state}`);
        };
      }).catch(() => {
        // Permission query is not supported or blocked in iframe sandbox
      });
    }
  }, []);

  // Speak Response out loud (TTS) with Premium Voice synthesis support
  const speakJarvisResponse = async (text: string) => {
    if (deviceState.speechMuted) return;

    // Support interruption / barge-in: stop any active premium audio playback
    if (activeAudioSourceRef.current) {
      try {
        activeAudioSourceRef.current.stop();
        addFrameworkLog("broadcast", "PremiumTTS", "Interrupted current spoken output (barge-in event).");
      } catch (e) {}
      activeAudioSourceRef.current = null;
    }

    if (premiumVoiceEnabled) {
      addFrameworkLog("power", "PremiumTTS", `Formulating premium vocal synthesis stream. [Voice: ${selectedPremiumVoice}, Speed: ${voiceSpeed}x, Pitch: ${voicePitch}x]`);
      try {
        // Cancel standard speech synthesis if speaking
        window.speechSynthesis.cancel();

        const response = await fetch("/api/gemini/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: text,
            voiceName: selectedPremiumVoice
          })
        });

        if (!response.ok) {
          throw new Error("Premium TTS fetch response error");
        }

        const data = await response.json();
        if (data.audio) {
          const binaryString = window.atob(data.audio);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          }
          const audioCtx = audioContextRef.current;

          if (audioCtx.state === "suspended") {
            await audioCtx.resume();
          }

          const audioBuffer = await audioCtx.decodeAudioData(bytes.buffer);
          const source = audioCtx.createBufferSource();
          source.buffer = audioBuffer;

          // Pitch and speed modulation
          source.playbackRate.setValueAtTime(voiceSpeed * voicePitch, audioCtx.currentTime);

          source.connect(audioCtx.destination);
          activeAudioSourceRef.current = source;

          setSimState("SPEAKING");
          addFrameworkLog("broadcast", "PremiumTTS", "Dispatched high-definition audio buffer to hardware speaker.");

          source.start(0);

          source.onended = () => {
            if (activeAudioSourceRef.current === source) {
              activeAudioSourceRef.current = null;
              setSimState("WAITING_FOR_FOLLOW_UP");
              if (activeListening && !deviceState.isListening) {
                addFrameworkLog("info", "HotwordEngine", "Multi-turn voice session continued. Standing by for user response.");
                setTimeout(() => {
                  toggleVoiceListening();
                }, 300);
              }
            }
          };
          return;
        }
      } catch (err: any) {
        addFrameworkLog("error", "PremiumTTS", `Premium TTS failed: ${err.message}. Falling back to standard on-device synthesis.`);
      }
    }

    // Standard Fallback Web Speech Synthesis
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      const voice =
        voices.find((v) => v.lang.startsWith("en-") && v.name.includes("Google")) ||
        voices.find((v) => v.lang.startsWith("en-") && v.name.toLowerCase().includes("natural")) ||
        voices.find((v) => v.lang.startsWith("en-")) ||
        voices[0];

      if (voice) {
        utterance.voice = voice;
      }
      utterance.rate = voiceSpeed;
      utterance.pitch = voicePitch;
      
      utterance.onend = () => {
        if (activeListening && !deviceState.isListening) {
          addFrameworkLog("info", "HotwordEngine", "Multi-turn voice session continued. Standing by for user response.");
          setTimeout(() => {
            toggleVoiceListening();
          }, 300);
        }
      };

      window.speechSynthesis.speak(utterance);
      addFrameworkLog("info", "TextToSpeech", `Synthesizing vocal response using voice model: ${voice ? voice.name : "Default"}`);
    } catch (e) {
      console.error("TTS failed", e);
    }
  };

  // Helper to add custom, highly detailed log items
  const addFrameworkLog = (
    type: "info" | "intent" | "bind" | "power" | "perm" | "error" | "broadcast",
    tag: string,
    message: string,
    details?: string
  ) => {
    const now = new Date();
    const timestamp =
      now.toTimeString().split(" ")[0] +
      "." +
      String(now.getMilliseconds()).padStart(3, "0");
    const newLog: FrameworkLog = {
      id: "log_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      type,
      tag,
      message,
      timestamp,
      details
    };
    setLogs((prev) => [...prev, newLog]);
  };

  // Scroll logs to bottom
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, deviceState.isListening, deviceState.isProcessing]);

  // Handle Voice Recording trigger
  const toggleVoiceListening = () => {
    if (!speechSupported) {
      addFrameworkLog("info", "SpeechRecognition", "Voice input is unavailable in this browser environment. Switched to text input fallback.");
      setVoiceNotice("Voice input is unavailable in this browser preview environment. Please use text input below.");
      setTimeout(() => setVoiceNotice(null), 4000);
      return;
    }

    // Check permission
    if (recognitionRef.current) {
      if (deviceState.isListening) {
        recognitionRef.current.stop();
        addFrameworkLog("info", "SpeechRecognition", "Recording manually stopped by user.");
      } else {
        try {
          recognitionRef.current.start();
          addFrameworkLog("power", "PowerManager", "WakeLock [RECORD_AUDIO_LOCK] requested. Raising clock frequencies.");
        } catch (e: any) {
          addFrameworkLog("info", "SpeechRecognition", `Microphone session start notice: ${e.message}`);
          setVoiceNotice("Voice input could not be started in this browser session. Please type your message below.");
          setTimeout(() => setVoiceNotice(null), 4000);
        }
      }
    }
  };

  // Handle Message sending (Chat trigger)
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message to state
    const userMsg: Message = {
      id: "msg_" + Date.now(),
      role: "user",
      content: text,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");

    setDeviceState((prev) => ({
      ...prev,
      assistantOpen: true,
      isProcessing: true
    }));

    addFrameworkLog("info", "JarvisCore", `Parsing command: "${text}"`);
    addFrameworkLog("power", "PowerManager", "CPU WakeLock acquired (SCREEN_BRIGHT_LOCK | VOICE_PROCESSING)");

    try {
      // Build previous context history
      const historyContext = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content
      }));

      // Multimodal parts formulation if attachments are active
      let parts: any[] = [];
      if (attachments && attachments.length > 0) {
        parts.push({ text: text });
        attachments.forEach((att) => {
          parts.push({
            inlineData: {
              mimeType: att.mimeType,
              data: att.data
            },
            storageUrl: att.storageUrl
          });
        });
        addFrameworkLog("info", "MultimodalCortex", `Injecting ${attachments.length} attachments (with Firebase Storage URLs) into Gemini multimodal buffer.`);
      }

      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: historyContext,
          currentTime: new Date().toISOString(),
          preferredLanguage,
          humorMode,
          mode: aiModelMode,
          parts: parts.length > 0 ? parts : undefined,
          memory: {
            favoriteContact,
            favoriteMusicService,
            preferredLanguage,
            humorMode
          }
        })
      });

      // Clear any pending attachments after draft submission
      setAttachments([]);

      if (!res.ok) {
        let errData: any = {};
        try {
          errData = await res.json();
        } catch (e) {
          errData = { error: `Server HTTP error ${res.status}` };
        }

        const errCode: GeminiStatusCode = errData.code || "UNKNOWN_ERROR";
        const errMsg = errData.error || "Gemini service request failed.";

        setGeminiStatus((prev) => ({
          ...prev,
          status: errCode,
          connected: false,
          message: errMsg,
          userAction: errData.userAction,
          lastChecked: new Date().toLocaleTimeString(),
        }));

        let userFacingText = errMsg;
        if (errCode === "QUOTA_EXCEEDED") {
          userFacingText = "Gemini API rate limit or quota exceeded (429). Please wait a moment before trying again.";
        } else if (errCode === "TEMPORARY_SERVICE_ERROR") {
          userFacingText = "Gemini API service is temporarily overloaded (503). Retrying shortly...";
        } else if (errCode === "INVALID_KEY") {
          userFacingText = "Gemini API key is invalid or rejected by Google servers. Please update GEMINI_API_KEY in the Secrets panel.";
          setShowGeminiSetupModal(true);
        } else if (errCode === "MISSING_KEY") {
          userFacingText = "Gemini API key is missing. Please configure GEMINI_API_KEY in the Secrets panel.";
          setShowGeminiSetupModal(true);
        } else if (errCode === "NETWORK_UNAVAILABLE") {
          userFacingText = "Network connection offline or server unreachable.";
        }

        throw new Error(userFacingText);
      }

      // Successful response resets status to CONNECTED if it wasn't
      if (!geminiStatus.connected) {
        setGeminiStatus((prev) => ({
          ...prev,
          status: "CONNECTED",
          connected: true,
          message: "Gemini API connected successfully.",
          lastChecked: new Date().toLocaleTimeString(),
        }));
      }

      const data = await res.json();
      
      const jarvisMsg: Message = {
        id: "msg_" + Date.now() + "_res",
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        intent: data.intent,
        intentData: data.intentData
      };

      setMessages((prev) => [...prev, jarvisMsg]);
      setDeviceState((prev) => ({ ...prev, isProcessing: false }));

      // Trigger actual screen changes and behaviors based on intent!
      executeSimulatedIntent(data.intent, data.intentData, data.response);

    } catch (err: any) {
      addFrameworkLog("error", "JarvisCore", `Error fetching Gemini response: ${err.message}`);
      
      const errorMsg: Message = {
        id: "msg_err_" + Date.now(),
        role: "assistant",
        content: err.message || "An error occurred while communicating with Gemini API.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
      setDeviceState((prev) => ({ ...prev, isProcessing: false }));
      speakJarvisResponse(errorMsg.content);
    }
  };

  const liveWsRef = useRef<WebSocket | null>(null);

  // Real-Time Live API Voice Conversation Handlers
  const startLiveVoiceSession = () => {
    setShowLiveVoiceCallModal(true);
    setIsLiveVoiceListening(true);
    setLiveTranscript("");
    addFrameworkLog("info", "LiveAPI", "Initiated real-time voice conversation session with model gemini-3.1-flash-live-preview.");

    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      liveWsRef.current = ws;

      ws.onopen = () => {
        addFrameworkLog("info", "LiveAPI", "WebSocket connection established with Gemini Live API endpoint /live.");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.text) {
            setLiveTranscript((prev) => (prev ? `${prev} ${data.text}` : data.text));
          }
          if (data.audio) {
            setLiveModelSpeaking(true);
          }
          if (data.interrupted) {
            setLiveModelSpeaking(false);
          }
        } catch (e) {
          console.warn("[LiveAPI] Error parsing websocket message:", e);
        }
      };

      ws.onerror = (err) => {
        console.warn("[LiveAPI] WebSocket error:", err);
        addFrameworkLog("error", "LiveAPI", "WebSocket error in Live API session. Fallback REST channel remains active.");
      };

      ws.onclose = () => {
        addFrameworkLog("info", "LiveAPI", "Live API WebSocket session closed.");
      };
    } catch (err: any) {
      console.warn("[LiveAPI] WebSocket initialization error:", err);
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = preferredLanguage === "Hindi" ? "hi-IN" : "en-US";

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setLiveTranscript(currentTranscript);
        };

        recognition.onerror = (e: any) => {
          console.warn("Live API Speech Recognition error:", e);
        };

        recognition.onend = () => {
          if (isLiveVoiceListening && liveRecognitionRef.current) {
            try { liveRecognitionRef.current.start(); } catch (err) {}
          }
        };

        recognition.start();
        liveRecognitionRef.current = recognition;
      } catch (err) {
        console.warn("Could not start Web Speech Recognition:", err);
      }
    }
  };

  const endLiveVoiceSession = () => {
    setIsLiveVoiceListening(false);
    setShowLiveVoiceCallModal(false);
    if (liveWsRef.current) {
      try { liveWsRef.current.close(); } catch (err) {}
      liveWsRef.current = null;
    }
    if (liveRecognitionRef.current) {
      try { liveRecognitionRef.current.stop(); } catch (err) {}
      liveRecognitionRef.current = null;
    }
    addFrameworkLog("info", "LiveAPI", "Ended Live API voice session.");
  };

  const handleSendLiveVoiceQuery = async (spokenText: string) => {
    if (!spokenText.trim()) return;
    setLiveModelSpeaking(true);
    addFrameworkLog("info", "LiveAPI", `Streaming voice query to gemini-3.1-flash-live-preview: "${spokenText}"`);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: spokenText,
          mode: "live",
          history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
          currentTime: new Date().toISOString(),
          preferredLanguage,
          humorMode
        })
      });

      if (!res.ok) throw new Error("Live API request failed");
      const data = await res.json();

      const userMsg: Message = { id: "msg_" + Date.now(), role: "user", content: spokenText, timestamp: new Date() };
      const assistantMsg: Message = {
        id: "msg_" + Date.now() + "_live",
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        intent: data.intent,
        intentData: data.intentData
      };

      setMessages(prev => [...prev, userMsg, assistantMsg]);
      setLiveTranscript("");

      // Voice synthesis output
      if (!liveVoiceMuted && window.speechSynthesis) {
        const synth = window.speechSynthesis;
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(data.response);
        utterance.rate = 1.0;
        utterance.onend = () => setLiveModelSpeaking(false);
        utterance.onerror = () => setLiveModelSpeaking(false);
        synth.speak(utterance);
      } else {
        setTimeout(() => setLiveModelSpeaking(false), 2000);
      }

      executeSimulatedIntent(data.intent, data.intentData, data.response);
    } catch (err: any) {
      addFrameworkLog("error", "LiveAPI", `Live API conversation error: ${err.message}`);
      setLiveModelSpeaking(false);
    }
  };

  // Microphone Audio Transcription powered by model gemini-3.6-flash
  const startAudioTranscriptionRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(",")[1];
          setIsTranscribing(true);
          addFrameworkLog("info", "GeminiTranscribe", "Transcribing microphone audio using model gemini-3.6-flash...");
          try {
            const res = await fetch("/api/gemini/transcribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ audioBase64: base64Audio, mimeType: "audio/webm" }),
            });
            const data = await res.json();
            if (data.transcription) {
              setInputVal((prev) => (prev ? `${prev} ${data.transcription}` : data.transcription));
              addFrameworkLog("info", "GeminiTranscribe", `Audio transcribed successfully via gemini-3.6-flash: "${data.transcription}"`);
            } else if (data.error) {
              addFrameworkLog("error", "GeminiTranscribe", `Transcription error: ${data.error}`);
            }
          } catch (err: any) {
            addFrameworkLog("error", "GeminiTranscribe", `Transcription request failed: ${err.message}`);
          } finally {
            setIsTranscribing(false);
          }
        };
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecordingAudioForTranscribe(true);
      addFrameworkLog("info", "GeminiTranscribe", "Microphone recording started for gemini-3.6-flash audio transcription.");
    } catch (err: any) {
      addFrameworkLog("error", "GeminiTranscribe", `Microphone recording error: ${err.message}`);
    }
  };

  const stopAudioTranscriptionRecording = () => {
    if (mediaRecorderRef.current && isRecordingAudioForTranscribe) {
      mediaRecorderRef.current.stop();
      setIsRecordingAudioForTranscribe(false);
    }
  };

  // Execute Direct (after human approval / safety confirmation)
  const executeIntentDirect = (intent: AndroidIntent, data: IntentData | undefined) => {
    addFrameworkLog("bind", "SafetyGate", "Human approval signature validated. Executing intent safely.");
    switch (intent) {
      case "OPEN_GMAIL":
        setActiveScreen("gmail");
        if (data) {
          setGmailDraft({
            recipient: data.recipient || "sarah@example.com",
            subject: data.subject || "Standup Meeting Reminder",
            body: data.body || "Hi, are we still meeting today at 5 PM? Let me know. Best, User."
          });
          addFrameworkLog("bind", "GmailService", "Binding draft provider to Gmail client content view.");
        }
        break;

      case "OPEN_CALENDAR":
        setActiveScreen("calendar");
        if (data) {
          const newEvent = {
            id: "evt_" + Date.now(),
            time: data.time || "10:00 AM",
            subject: data.subject || "Team Standup",
            date: "Tuesday, July 21"
          };
          setCalendarEvents((prev) => [newEvent, ...prev]);
          addFrameworkLog("info", "CalendarProvider", `Inserted record in Calendar Contract: "${newEvent.subject}" at ${newEvent.time}`);
        }
        break;

      default:
        break;
    }
  };

  const approvePendingAction = () => {
    if (!pendingAction) return;
    addFrameworkLog("perm", "PermissionsProvider", "Manual intent confirmation RECEIVED.");
    executeIntentDirect(pendingAction.intent, pendingAction.data);
    setPendingAction(null);
  };

  const declinePendingAction = () => {
    if (!pendingAction) return;
    addFrameworkLog("error", "PermissionsProvider", "Manual intent confirmation REJECTED by user.");
    setPendingAction(null);
  };

  // Execute Simulated Intent in the Emulator UI
  const executeSimulatedIntent = (intent: AndroidIntent, data: IntentData | undefined, spokenResponse: string) => {
    // Intercept high impact intents
    const isHighImpact = intent === "OPEN_GMAIL" || intent === "OPEN_CALENDAR";
    
    if (isHighImpact) {
      addFrameworkLog("intent", "IntentResolver", `Intercepted action 'com.android.jarvis.intent.action.${intent}' (HIGH-IMPACT). HOLDING FOR MANUAL CONFIRMATION.`);
      setPendingAction({
        intent,
        data,
        label: intent === "OPEN_GMAIL" ? "Draft Gmail Message" : "Create Calendar Appointment",
        spokenResponse
      });
      // Speak the response preparing the user
      speakJarvisResponse(spokenResponse);
      return;
    }

    addFrameworkLog("intent", "IntentResolver", `Dispatched Intent: com.android.jarvis.intent.action.${intent || "NONE"}`);
    
    if (data && Object.keys(data).length > 0) {
      addFrameworkLog("broadcast", "IntentResolver", `Intent extras: ${JSON.stringify(data)}`);
    }

    // Playback speech synthesis
    speakJarvisResponse(spokenResponse);

    switch (intent) {
      case "SET_REMINDER":
        setActiveScreen("clock");
        if (data && (data.time || data.body)) {
          const newReminder = {
            id: "rem_" + Date.now(),
            time: data.time || "3:30 PM",
            text: data.body || "Take cake out of oven"
          };
          setReminders((prev) => [newReminder, ...prev]);
          addFrameworkLog("info", "AlarmManager", `Scheduled exact alarm for ${newReminder.time} via AlarmClock API.`);
        }
        break;

      case "TOGGLE_FLASHLIGHT":
        const targetStatus = data?.status === "on" || spokenResponse.toLowerCase().includes("on");
        setDeviceState((prev) => ({ ...prev, flashlightOn: targetStatus }));
        addFrameworkLog("info", "CameraService", `Flashlight hardware state set: ${targetStatus ? "ON (Intensity: 100%)" : "OFF"}`);
        break;

      case "SHOW_WEATHER":
        setActiveScreen("weather");
        if (data && data.query) {
          const matchedCity = data.query;
          const randomTemp = Math.floor(Math.random() * 25) + 55; // 55 to 80
          const conditions = ["Sunny", "Rainy", "Partly Cloudy", "Foggy", "Clear Skies"];
          const randomCond = conditions[Math.floor(Math.random() * conditions.length)];
          setWeatherData({
            temp: `${randomTemp}°F`,
            condition: randomCond,
            city: matchedCity
          });
          addFrameworkLog("info", "WeatherWidget", `Atmospheric data pulled successfully for ${matchedCity}.`);
        }
        break;

      case "SEARCH_WEB":
        setActiveScreen("search");
        if (data && data.query) {
          setSearchQuery(data.query);
          addFrameworkLog("info", "BrowserSearchIntent", `Executing web lookup query: "${data.query}"`);
          
          // Generate mock search results instantly
          setSearchResults([
            `About ${data.query} - Wikipedia overview and standard dictionary definitions.`,
            `${data.query} - Latest news updates, press releases, and articles on social media platforms.`,
            `Official Guide to ${data.query} - Interactive tutorials, documentation, and expert columns.`
          ]);
        }
        break;

      case "PLAY_MUSIC":
        setActiveScreen("music");
        if (data && data.query) {
          setMusicPlaying({
            title: data.query,
            artist: "Gemini Synthesized Artist",
            playing: true,
            progress: 1
          });
          addFrameworkLog("bind", "MediaSessionService", `Binding audio output stream to hardware driver for stream: "${data.query}"`);
        } else {
          setMusicPlaying((prev) => ({ ...prev, playing: true }));
        }
        break;

      case "NONE":
      default:
        // No specific screen change, keep active screen or keep assistant active
        break;
    }
  };

  // Clear system logs
  const clearLogs = () => {
    setLogs([
      {
        id: "l_clear",
        type: "info",
        tag: "SystemLog",
        message: "Framework terminal log buffer cleared.",
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  // Pre-configured trigger simulation
  const handleQuickTrigger = (prompt: string) => {
    setInputVal(prompt);
    handleSendMessage(prompt);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Main Navigation/Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-5 h-5 text-slate-150 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-display font-semibold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Jarvis AI Assistant
            </h1>
            <p className="text-xs text-slate-400">Android System Integration & Visual Simulator</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Quick Stats */}
          <div className="hidden md:flex items-center space-x-3 text-xs bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/60">
            <div className="flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-400">CPU Load:</span>
              <span className="font-mono text-indigo-300 font-semibold">{deviceState.cpuLoad}%</span>
            </div>
            <div className="h-3 w-px bg-slate-700" />
            <div className="flex items-center space-x-1">
              <span className="text-slate-400">RAM:</span>
              <span className="font-mono text-slate-300">{deviceState.memoryUsage}</span>
            </div>
          </div>

          <button
            onClick={() => setDeviceState(prev => ({ ...prev, speechMuted: !prev.speechMuted }))}
            className={`p-2 rounded-lg border transition-all ${
              deviceState.speechMuted
                ? "bg-rose-950/20 border-rose-900/40 text-rose-400 hover:bg-rose-900/30"
                : "bg-slate-800/40 border-slate-700 text-slate-300 hover:bg-slate-700/60"
            }`}
            title={deviceState.speechMuted ? "Unmute Jarvis voice (TTS)" : "Mute Jarvis voice (TTS)"}
          >
            {deviceState.speechMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 lg:p-6">
        
        {/* Left Side: Dynamic Android Smartphone Emulator (4 Cols) */}
        <div className="lg:col-span-5 xl:col-span-4 flex items-center justify-center p-2 relative">
          
          {/* Glowing background halo under phone */}
          <div className="absolute w-72 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Device Bezel */}
          <div className="w-full max-w-[360px] h-[720px] bg-slate-900 rounded-[50px] p-3.5 border-4 border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col relative transition-all ring-1 ring-slate-700/40">
            
            {/* Top Ear Speaker & Punch Hole Camera */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full flex justify-center items-center h-10 pointer-events-none z-50">
              <div className="w-32 h-1 bg-slate-950 rounded-b-md mb-2" /> {/* Speaker */}
              <div className="absolute top-4 w-4.5 h-4.5 bg-slate-950 rounded-full border-2 border-slate-900 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-indigo-950 rounded-full" /> {/* Camera lens reflection */}
              </div>
            </div>

            {/* Simulated Flashlight Beam Indicator (Renders on bezel top) */}
            {deviceState.flashlightOn && (
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-32 h-16 bg-yellow-400/20 blur-md rounded-t-full flex justify-center pointer-events-none z-10 transition-all duration-300 animate-pulse">
                <div className="w-12 h-12 bg-yellow-300/30 blur-sm rounded-full mt-6" />
              </div>
            )}

            {/* Smartphone screen contents */}
            <div className="flex-1 w-full h-full bg-slate-950 rounded-[38px] overflow-hidden flex flex-col relative border border-slate-950">
              
              {/* Wallpaper Canvas Background */}
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-950 to-slate-900 opacity-90 z-0" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_40%)] z-0" />

              {/* Status Bar */}
              <div className="h-10 px-6 flex items-center justify-between text-xs text-slate-300 font-medium tracking-wide z-20 select-none bg-slate-950/20 backdrop-blur-sm shrink-0">
                <span>{deviceState.systemTime || "12:00 PM"}</span>
                <div className="flex items-center space-x-2">
                  <Signal className="w-3.5 h-3.5" />
                  <Wifi className="w-3.5 h-3.5 text-indigo-400" />
                  <div className="flex items-center space-x-1">
                    <Battery className="w-4 h-4 text-emerald-400" />
                    <span>{deviceState.batteryLevel}%</span>
                  </div>
                </div>
              </div>

              {/* Screen Body Viewport */}
              <div className="flex-1 overflow-y-auto relative z-10 flex flex-col pt-1">
                <AnimatePresence mode="wait">
                  
                  {/* SCREEN: Homescreen */}
                  {activeScreen === "homescreen" && (
                    <motion.div
                      key="homescreen"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex flex-col justify-between"
                    >
                      {jarvisAppLaunched ? (
                        /* PREMIUM FIVE-TAB JARVIS HUB APPLICATION */
                        <div className="flex-1 flex flex-col justify-between h-full">
                          
                          {/* Jarvis OS Premium Header & AI Status Pill */}
                          <div className={`p-3.5 pb-2.5 border-b flex justify-between items-center shrink-0 z-20 backdrop-blur-xl ${
                            appTheme === "dark" ? "bg-slate-950/80 border-white/10 text-white" :
                            appTheme === "light" ? "bg-white/95 border-slate-200 text-slate-900" :
                            "bg-black border-b border-white text-white"
                          }`}>
                            {/* AI Status Pill */}
                            <div className="flex items-center space-x-2 bg-slate-900/80 border border-white/10 rounded-full px-2.5 py-1 shadow-sm">
                              <div className="relative flex items-center justify-center">
                                <span className={`w-2 h-2 rounded-full ${
                                  deviceState.isListening ? "bg-amber-400 animate-ping" :
                                  deviceState.isProcessing ? "bg-purple-400 animate-pulse" :
                                  liveModelSpeaking ? "bg-cyan-400 animate-pulse" :
                                  "bg-emerald-400"
                                }`} />
                                <span className={`absolute w-2 h-2 rounded-full ${
                                  deviceState.isListening ? "bg-amber-400" :
                                  deviceState.isProcessing ? "bg-purple-400" :
                                  liveModelSpeaking ? "bg-cyan-400" :
                                  "bg-emerald-400"
                                }`} />
                              </div>
                              <span className="text-[9.5px] font-semibold tracking-wide font-mono text-slate-200">
                                {deviceState.isListening ? "Listening..." :
                                 deviceState.isProcessing ? "Thinking..." :
                                 liveModelSpeaking ? "Speaking..." :
                                 "Jarvis Ready"}
                              </span>
                            </div>

                            <div className="flex items-center space-x-1.5">
                              {/* Gemini API Status Badge */}
                              <button
                                type="button"
                                onClick={() => {
                                  checkGeminiConnection(false);
                                  setShowGeminiSetupModal(true);
                                }}
                                className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-[8.5px] font-mono font-bold border transition-all active:scale-95 ${
                                  geminiStatus.connected
                                    ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900"
                                    : geminiStatus.status === "QUOTA_EXCEEDED"
                                    ? "bg-amber-950/80 border-amber-500/40 text-amber-300 hover:bg-amber-900"
                                    : geminiStatus.status === "CHECKING"
                                    ? "bg-indigo-950/80 border-indigo-500/40 text-indigo-300"
                                    : "bg-rose-950/80 border-rose-500/40 text-rose-300 hover:bg-rose-900 animate-pulse"
                                }`}
                                title="Click to view Gemini API status and configuration"
                              >
                                {geminiStatus.connected ? (
                                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                                ) : geminiStatus.status === "CHECKING" ? (
                                  <RefreshCw className="w-2.5 h-2.5 text-indigo-400 animate-spin" />
                                ) : (
                                  <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
                                )}
                                <span>
                                  {geminiStatus.connected
                                    ? "Gemini API"
                                    : geminiStatus.status === "MISSING_KEY"
                                    ? "Key Missing"
                                    : geminiStatus.status === "INVALID_KEY"
                                    ? "Invalid Key"
                                    : geminiStatus.status === "QUOTA_EXCEEDED"
                                    ? "Quota Limit"
                                    : geminiStatus.status === "CHECKING"
                                    ? "Checking..."
                                    : "Disconnected"}
                                </span>
                              </button>

                              {/* Theme Toggler Button */}
                              <button
                                onClick={() => {
                                  const nextTheme = appTheme === "dark" ? "light" : appTheme === "light" ? "high-contrast" : "dark";
                                  setAppTheme(nextTheme);
                                  addFrameworkLog("info", "ThemeEngine", `Theme changed to: ${nextTheme.toUpperCase()}`);
                                }}
                                className={`p-1.5 rounded-full transition-all border ${
                                  appTheme === "dark" ? "bg-slate-900 border-white/10 text-indigo-400 hover:border-indigo-500/40" :
                                  appTheme === "light" ? "bg-slate-100 border-slate-200 text-indigo-600 hover:bg-slate-200" :
                                  "border-white text-yellow-400"
                                }`}
                                title="Toggle Theme"
                              >
                                {appTheme === "dark" && <Sun className="w-3 h-3" />}
                                {appTheme === "light" && <Eye className="w-3 h-3" />}
                                {appTheme === "high-contrast" && <Moon className="w-3 h-3" />}
                              </button>

                              {/* Minimize to launcher */}
                              <button
                                onClick={() => {
                                  setJarvisAppLaunched(false);
                                  addFrameworkLog("info", "ActivityManager", "Jarvis Hub minimized. Returning to Android system launcher.");
                                }}
                                className={`p-1.5 rounded-full transition-all border ${
                                  appTheme === "dark" ? "bg-slate-900 border-white/10 text-slate-400 hover:text-white" :
                                  appTheme === "light" ? "bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800" :
                                  "border-white text-white"
                                }`}
                                title="Minimize"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Jarvis Tab Contents */}
                          <div className={`flex-1 overflow-y-auto p-4 space-y-4 relative ${
                            appTheme === "dark" ? "bg-slate-950 text-slate-100" :
                            appTheme === "light" ? "bg-slate-50/80 text-slate-900" :
                            "bg-black text-white"
                          }`}>
                            {/* TAB 1: HOME */}
                            {jarvisTab === "home" && (
                              <div className="space-y-4">
                                {/* Top Greeting Header */}
                                <div className="flex flex-col space-y-0.5 pt-1 select-none">
                                  <span className="text-[10px] font-mono font-semibold text-indigo-400/90 uppercase tracking-widest">
                                    {(() => {
                                      const h = new Date().getHours();
                                      return h < 12 ? "Good Morning" : h < 18 ? "Good Afternoon" : "Good Evening";
                                    })()}, {currentUser?.displayName?.split(" ")[0] || "AryanPatel"}
                                  </span>
                                  <h1 className="text-base font-display font-bold tracking-tight text-slate-100 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
                                    How can I help you today?
                                  </h1>
                                </div>

                                {/* Floating Assistant Orb Centerpiece */}
                                <div className="relative flex flex-col items-center justify-center my-2 py-3 select-none group">
                                  {/* Multi-layered soft glow halos */}
                                  <div className={`absolute w-28 h-28 rounded-full blur-2xl transition-all duration-700 ${
                                    deviceState.isListening ? "bg-amber-500/30 scale-125" :
                                    deviceState.isProcessing ? "bg-purple-500/30 scale-110" :
                                    "bg-indigo-600/25 group-hover:bg-indigo-500/35"
                                  }`} />
                                  
                                  {/* Outer ripple rings */}
                                  <div className={`absolute w-24 h-24 rounded-full border border-indigo-500/20 ${
                                    deviceState.isListening ? "animate-ping opacity-40 border-amber-400" : "animate-pulse opacity-30"
                                  }`} />

                                  {/* Assistant Core Sphere */}
                                  <button
                                    type="button"
                                    onClick={toggleVoiceListening}
                                    className={`relative w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-[0_0_40px_rgba(99,102,241,0.4)] active:scale-95 transition-all duration-300 flex items-center justify-center ${
                                      deviceState.isListening ? "ring-4 ring-amber-400/50 scale-105" : ""
                                    }`}
                                  >
                                    <div className="w-full h-full rounded-full bg-slate-950/80 backdrop-blur-md flex items-center justify-center relative overflow-hidden">
                                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-transparent to-purple-500/20 animate-spin-slow" />
                                      <Sparkles className={`w-8 h-8 ${
                                        deviceState.isListening ? "text-amber-400 animate-bounce" :
                                        deviceState.isProcessing ? "text-purple-400 animate-spin" :
                                        "text-indigo-300 group-hover:scale-110 transition-transform"
                                      }`} />
                                    </div>
                                  </button>

                                  {/* Status subtitle below orb */}
                                  <span className="text-[9.5px] font-mono text-slate-400 mt-2.5 flex items-center space-x-1">
                                    <Sparkles className="w-3 h-3 text-indigo-400" />
                                    <span>{deviceState.isListening ? "Listening... Tap to stop" : "Tap orb or say 'Hey Jarvis'"}</span>
                                  </span>
                                </div>

                                {/* Rounded Action Chips */}
                                <div className="space-y-1.5 select-none">
                                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider px-1">QUICK ACTIONS</span>
                                  <div className="flex items-center space-x-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none scroll-smooth">
                                    <button
                                      onClick={startLiveVoiceSession}
                                      className="flex items-center space-x-1.5 bg-slate-900/80 hover:bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 rounded-full px-3 py-1.5 text-[10px] font-medium shrink-0 active:scale-95 transition-all shadow-sm"
                                    >
                                      <Phone className="w-3 h-3 text-emerald-400" />
                                      <span>📞 Call</span>
                                    </button>
                                    <button
                                      onClick={() => setJarvisTab("chat")}
                                      className="flex items-center space-x-1.5 bg-slate-900/80 hover:bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 rounded-full px-3 py-1.5 text-[10px] font-medium shrink-0 active:scale-95 transition-all shadow-sm"
                                    >
                                      <MessageSquare className="w-3 h-3 text-indigo-400" />
                                      <span>💬 Message</span>
                                    </button>
                                    <button
                                      onClick={() => setJarvisTab("automations")}
                                      className="flex items-center space-x-1.5 bg-slate-900/80 hover:bg-purple-950/40 border border-purple-500/30 text-purple-300 rounded-full px-3 py-1.5 text-[10px] font-medium shrink-0 active:scale-95 transition-all shadow-sm"
                                    >
                                      <Calendar className="w-3 h-3 text-purple-400" />
                                      <span>📅 Reminder</span>
                                    </button>
                                    <button
                                      onClick={() => setJarvisTab("memory")}
                                      className="flex items-center space-x-1.5 bg-slate-900/80 hover:bg-sky-950/40 border border-sky-500/30 text-sky-300 rounded-full px-3 py-1.5 text-[10px] font-medium shrink-0 active:scale-95 transition-all shadow-sm"
                                    >
                                      <BookOpen className="w-3 h-3 text-sky-400" />
                                      <span>📝 Notes</span>
                                    </button>
                                    <button
                                      onClick={() => handleSendMessage("What is the current weather?")}
                                      className="flex items-center space-x-1.5 bg-slate-900/80 hover:bg-amber-950/40 border border-amber-500/30 text-amber-300 rounded-full px-3 py-1.5 text-[10px] font-medium shrink-0 active:scale-95 transition-all shadow-sm"
                                    >
                                      <CloudSun className="w-3 h-3 text-amber-400" />
                                      <span>🌤 Weather</span>
                                    </button>
                                    <button
                                      onClick={() => handleSendMessage("Play my focus study playlist")}
                                      className="flex items-center space-x-1.5 bg-slate-900/80 hover:bg-fuchsia-950/40 border border-fuchsia-500/30 text-fuchsia-300 rounded-full px-3 py-1.5 text-[10px] font-medium shrink-0 active:scale-95 transition-all shadow-sm"
                                    >
                                      <Music className="w-3 h-3 text-fuchsia-400" />
                                      <span>🎵 Music</span>
                                    </button>
                                    <button
                                      onClick={() => handleSendMessage("Translate 'Hello, how are you?' to Spanish")}
                                      className="flex items-center space-x-1.5 bg-slate-900/80 hover:bg-teal-950/40 border border-teal-500/30 text-teal-300 rounded-full px-3 py-1.5 text-[10px] font-medium shrink-0 active:scale-95 transition-all shadow-sm"
                                    >
                                      <Globe className="w-3 h-3 text-teal-400" />
                                      <span>🌍 Translate</span>
                                    </button>
                                    <button
                                      onClick={handleTriggerCamera}
                                      className="flex items-center space-x-1.5 bg-slate-900/80 hover:bg-rose-950/40 border border-rose-500/30 text-rose-300 rounded-full px-3 py-1.5 text-[10px] font-medium shrink-0 active:scale-95 transition-all shadow-sm"
                                    >
                                      <Camera className="w-3 h-3 text-rose-400" />
                                      <span>📷 Camera</span>
                                    </button>
                                    <button
                                      onClick={() => fileInputDocsRef.current?.click()}
                                      className="flex items-center space-x-1.5 bg-slate-900/80 hover:bg-blue-950/40 border border-blue-500/30 text-blue-300 rounded-full px-3 py-1.5 text-[10px] font-medium shrink-0 active:scale-95 transition-all shadow-sm"
                                    >
                                      <FileText className="w-3 h-3 text-blue-400" />
                                      <span>📄 Scan PDF</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setAiModelMode("search");
                                        setJarvisTab("chat");
                                      }}
                                      className="flex items-center space-x-1.5 bg-slate-900/80 hover:bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 rounded-full px-3 py-1.5 text-[10px] font-medium shrink-0 active:scale-95 transition-all shadow-sm"
                                    >
                                      <Search className="w-3 h-3 text-cyan-400" />
                                      <span>🔍 Search</span>
                                    </button>
                                  </div>
                                </div>

                                {/* Personalized Context & Memory Cards Deck */}
                                <div className="space-y-2 select-none">
                                  <div className="flex justify-between items-center px-1">
                                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">PERSONALIZED INSIGHTS</span>
                                    <span className="text-[8px] font-mono text-indigo-400">Adaptive Context Engine</span>
                                  </div>

                                  <div className="space-y-2">
                                    {/* Card 1: Schedule / Meeting */}
                                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-indigo-950/30 border border-white/10 hover:border-indigo-500/30 transition-all shadow-lg flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shrink-0">
                                          <Calendar className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-[11px] font-semibold text-slate-100">You have 1 meeting today</span>
                                          <span className="text-[9px] text-slate-400 mt-0.5">Review Android Foreground SDKs @ 02:00 PM</span>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => setJarvisTab("automations")}
                                        className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 underline shrink-0 ml-2"
                                      >
                                        View
                                      </button>
                                    </div>

                                    {/* Card 2: Sleep & Health */}
                                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-purple-950/30 border border-white/10 hover:border-purple-500/30 transition-all shadow-lg flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 shrink-0">
                                          <Moon className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-[11px] font-semibold text-slate-100">You slept 7h 45m</span>
                                          <span className="text-[9px] text-slate-400 mt-0.5">Optimal recovery index 88% • Ready for deep work</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Card 3: Battery & System Status */}
                                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-emerald-950/30 border border-white/10 hover:border-emerald-500/30 transition-all shadow-lg flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
                                          <Battery className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-[11px] font-semibold text-slate-100">Battery: 82%</span>
                                          <span className="text-[9px] text-slate-400 mt-0.5">On-device neural engine standby mode</span>
                                        </div>
                                      </div>
                                      <span className="px-2 py-0.5 rounded-full text-[8px] font-mono font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                                        Healthy
                                      </span>
                                    </div>

                                    {/* Card 4: Hydration Tracker */}
                                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-blue-950/30 border border-white/10 hover:border-blue-500/30 transition-all shadow-lg flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 shrink-0">
                                          <Dumbbell className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-[11px] font-semibold text-slate-100">Remember to drink water</span>
                                          <span className="text-[9px] text-slate-400 mt-0.5">{waterIntake}ml / 3000ml consumed today</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-1 shrink-0 ml-2">
                                        <button
                                          onClick={() => setWaterIntake((prev) => Math.max(0, prev - 250))}
                                          className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-700 flex items-center justify-center active:scale-95"
                                        >
                                          -
                                        </button>
                                        <button
                                          onClick={() => setWaterIntake((prev) => prev + 250)}
                                          className="w-6 h-6 rounded-lg bg-blue-600 border border-blue-500 text-white text-xs font-bold hover:bg-blue-500 flex items-center justify-center active:scale-95"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>

                                    {/* Card 5: Study Routine Alert */}
                                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-amber-950/30 border border-white/10 hover:border-amber-500/30 transition-all shadow-lg flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
                                          <Clock className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-[11px] font-semibold text-slate-100">Forex study starts in 40 minutes</span>
                                          <span className="text-[9px] text-slate-400 mt-0.5">Automated study routine trigger loaded</span>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => handleSendMessage("Execute Forex study routine")}
                                        className="px-2.5 py-1 rounded-full bg-amber-600/80 hover:bg-amber-500 text-white text-[8.5px] font-bold shadow-sm"
                                      >
                                        Start
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Quick Interaction Prompts */}
                                <div className="space-y-1.5 select-none pt-1">
                                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider px-1">INTELLIGENCE SUGGESTIONS</span>
                                  <div className="grid grid-cols-2 gap-2">
                                    <button
                                      onClick={() => handleSendMessage("What should I do next based on my schedule?")}
                                      className="p-2.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 text-left text-[9.5px] font-medium text-slate-200 transition-all active:scale-95"
                                    >
                                      "What is my next priority?"
                                    </button>
                                    <button
                                      onClick={() => handleSendMessage("Draft a Gmail to Sarah confirming our 5 PM meeting.")}
                                      className="p-2.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 text-left text-[9.5px] font-medium text-slate-200 transition-all active:scale-95"
                                    >
                                      "Draft Gmail to Sarah"
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {jarvisTab === "agenda" && (
                              <div className="space-y-4">
                                {/* Next Priority Recommendation */}
                                <div className={`p-3.5 rounded-2xl border relative overflow-hidden transition-all ${
                                  appTheme === "dark" ? "bg-slate-900/40 border-slate-800 text-slate-100" :
                                  appTheme === "light" ? "bg-indigo-50/20 border-indigo-100 text-slate-800 shadow-sm" :
                                  "bg-black border-2 border-white text-white"
                                }`}>
                                  <div className="flex items-center space-x-1.5 mb-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                    <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider font-display">
                                      AI NEXT-PRIORITY RECOMMENDATION
                                    </h3>
                                  </div>
                                  <p className="text-[10px] leading-relaxed opacity-90 font-sans">
                                    "Your highest impact task is <span className="text-indigo-400 font-semibold">Review Android 14 Foreground SDKs</span> scheduled at 02:00 PM. This is critical before drafting Part 4 wake locks."
                                  </p>
                                </div>

                                {/* TIMELINE LIST */}
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center px-1">
                                    <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">TODAY'S TIMELINE</h4>
                                    <span className="text-[8px] font-mono text-slate-500">July 20, 2026</span>
                                  </div>

                                  <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-0.5">
                                    {agendaTasks.map((task) => (
                                      <div
                                        key={task.id}
                                        onClick={() => {
                                          setAgendaTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
                                          addFrameworkLog("info", "AgendaService", `Toggle task completed state: ${task.title}`);
                                        }}
                                        className={`p-2.5 rounded-xl border flex items-center justify-between text-[10px] cursor-pointer hover:bg-slate-900/30 active:scale-[0.99] transition-all ${
                                          task.completed
                                            ? "bg-slate-900/20 border-slate-900/60 opacity-50"
                                            : appTheme === "dark" ? "bg-slate-900/40 border-slate-800" :
                                              appTheme === "light" ? "bg-white border-slate-150" :
                                              "bg-black border-2 border-white"
                                        }`}
                                      >
                                        <div className="flex items-center space-x-2.5">
                                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                                            task.completed
                                              ? "bg-indigo-600 border-indigo-500 text-white"
                                              : "border-slate-600 hover:border-indigo-400"
                                          }`}>
                                            {task.completed && <Check className="w-3 h-3" />}
                                          </div>
                                          <div className="flex flex-col">
                                            <span className={`font-medium ${task.completed ? "line-through text-slate-500" : ""}`}>{task.title}</span>
                                            <span className="text-[8px] opacity-60 font-mono mt-0.5">{task.time}</span>
                                          </div>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-[7px] font-bold tracking-wide uppercase ${
                                          task.category === "work" ? "bg-indigo-950/40 border border-indigo-900/40 text-indigo-300" :
                                          task.category === "fitness" ? "bg-emerald-950/40 border border-emerald-900/40 text-emerald-300" :
                                          task.category === "research" ? "bg-sky-950/40 border border-sky-900/40 text-sky-300" :
                                          "bg-slate-950/40 border border-slate-900 text-slate-300"
                                        }`}>
                                          {task.category}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* QUICK ADD FORM */}
                                <form
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    if (!newAgendaTask.trim()) return;
                                    const item = {
                                      id: "a_" + Date.now(),
                                      time: newAgendaTime,
                                      title: newAgendaTask,
                                      category: "custom",
                                      completed: false
                                    };
                                    setAgendaTasks(prev => [item, ...prev]);
                                    addFrameworkLog("broadcast", "CalendarProvider", `Simulated agenda item added: ${newAgendaTask}`);
                                    setNewAgendaTask("");
                                  }}
                                  className="flex space-x-1 border-t border-slate-900/85 pt-3"
                                >
                                  <input
                                    type="text"
                                    value={newAgendaTask}
                                    onChange={(e) => setNewAgendaTask(e.target.value)}
                                    placeholder="Add schedule event..."
                                    className="flex-1 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-[10px] focus:outline-none focus:border-indigo-500 text-slate-100"
                                  />
                                  <input
                                    type="text"
                                    value={newAgendaTime}
                                    onChange={(e) => setNewAgendaTime(e.target.value)}
                                    placeholder="05:00 PM"
                                    className="w-16 bg-slate-900 border border-slate-800 px-1.5 py-1.5 rounded-lg text-[10px] font-mono text-center focus:outline-none focus:border-indigo-500 text-slate-100"
                                  />
                                  <button
                                    type="submit"
                                    disabled={!newAgendaTask.trim()}
                                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white text-[10px] font-bold px-2.5 rounded-lg transition-all shrink-0"
                                  >
                                    Add
                                  </button>
                                </form>
                              </div>
                            )}

                            {jarvisTab === "journal" && (
                              <div className="space-y-4">
                                {/* Voice journal indicator */}
                                <div className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                                  appTheme === "dark" ? "bg-slate-900/40 border-slate-800" :
                                  appTheme === "light" ? "bg-white border-slate-200 shadow-sm" :
                                  "bg-black border-2 border-white"
                                }`}>
                                  <div>
                                    <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider font-display">
                                      Voice Journal Engine
                                    </h4>
                                    <p className="text-[9px] opacity-75 mt-0.5 max-w-[190px]">
                                      Tap to simulate an automated on-device voice reflection dictation.
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const entryText = "Reflecting on Part 6. Building this dashboard was incredibly rewarding. The responsive sub-panels, custom habit counters, and connected service states provide a magnificent preview layer.";
                                      const entry = {
                                        id: "j_" + Date.now(),
                                        date: "Jul 20, 2026",
                                        title: "Voice Reflection: Premium UI Design",
                                        content: entryText,
                                        mood: "Inspired",
                                        tags: ["voice-log", "ui-polish"],
                                        isVoice: true
                                      };
                                      setJournalEntries(prev => [entry, ...prev]);
                                      addFrameworkLog("broadcast", "VoiceInteractionService", "Simulating on-device recording save. Creating journal entry...");
                                      alert("Simulated voice entry added successfully!");
                                    }}
                                    className="bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:scale-105 text-white p-2 rounded-full transition-all shadow-md active:scale-95 shrink-0"
                                    title="Dictate reflection"
                                  >
                                    <Mic className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* JOURNAL LIST */}
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center px-1">
                                    <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">YOUR JOURNAL NOTES</h4>
                                    <input
                                      type="text"
                                      placeholder="Search..."
                                      value={journalSearch}
                                      onChange={(e) => setJournalSearch(e.target.value)}
                                      className="bg-slate-900/60 border border-slate-850 px-2 py-0.5 rounded-md text-[8px] max-w-[80px] focus:outline-none focus:border-indigo-500 text-slate-300"
                                    />
                                  </div>

                                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-0.5">
                                    {journalEntries
                                      .filter(e => e.title.toLowerCase().includes(journalSearch.toLowerCase()) || e.content.toLowerCase().includes(journalSearch.toLowerCase()))
                                      .map((entry) => (
                                        <div
                                          key={entry.id}
                                          className={`p-2.5 rounded-xl border text-[9px] ${
                                            appTheme === "dark" ? "bg-slate-900/40 border-slate-800" :
                                            appTheme === "light" ? "bg-white border-slate-150" :
                                            "bg-black border-2 border-white"
                                          }`}
                                        >
                                          <div className="flex justify-between items-center border-b border-slate-800/40 pb-1.5 mb-1.5">
                                            <div className="flex items-center space-x-1">
                                              {entry.isVoice ? <Mic className="w-2.5 h-2.5 text-indigo-400" /> : <BookOpen className="w-2.5 h-2.5 text-slate-400" />}
                                              <span className="font-semibold text-slate-200">{entry.title}</span>
                                            </div>
                                            <span className="text-[7px] font-mono text-slate-500">{entry.date}</span>
                                          </div>
                                          <p className="text-slate-300 leading-normal line-clamp-3">{entry.content}</p>
                                          <div className="mt-2 flex justify-between items-center select-none">
                                            <div className="flex space-x-1">
                                              {entry.tags.map((t, idx) => (
                                                <span key={idx} className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-[7px] text-slate-400">
                                                  #{t}
                                                </span>
                                              ))}
                                            </div>
                                            <span className="px-1.5 py-0.5 rounded bg-indigo-950/30 text-indigo-300 text-[7px] font-bold uppercase border border-indigo-900/30">
                                              Mood: {entry.mood}
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </div>

                                {/* WRITE CARD */}
                                <div className={`p-3 rounded-xl border ${
                                  appTheme === "dark" ? "bg-slate-900/40 border-slate-800" :
                                  appTheme === "light" ? "bg-white border-slate-200 shadow-sm" :
                                  "bg-black border-2 border-white"
                                }`}>
                                  <div className="grid grid-cols-2 gap-2 mb-2">
                                    <input
                                      type="text"
                                      placeholder="Title..."
                                      value={newJournalTitle}
                                      onChange={(e) => setNewJournalTitle(e.target.value)}
                                      className="bg-slate-950 border border-slate-850 rounded p-1 text-[9px] text-slate-200 focus:outline-none focus:border-indigo-500"
                                    />
                                    <select
                                      value={newJournalMood}
                                      onChange={(e) => setNewJournalMood(e.target.value)}
                                      className="bg-slate-950 border border-slate-850 rounded p-1 text-[9px] text-slate-400 focus:outline-none focus:border-indigo-500"
                                    >
                                      <option value="Excited">Excited</option>
                                      <option value="Inspired">Inspired</option>
                                      <option value="Satisfied">Satisfied</option>
                                      <option value="Balanced">Balanced</option>
                                      <option value="Tired">Tired</option>
                                    </select>
                                  </div>
                                  <textarea
                                    rows={2}
                                    placeholder="Write daily reflection details..."
                                    value={newJournalContent}
                                    onChange={(e) => setNewJournalContent(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-850 rounded p-1.5 text-[9px] text-slate-200 focus:outline-none focus:border-indigo-500 mb-2"
                                  />
                                  <div className="flex justify-between items-center">
                                    <input
                                      type="text"
                                      placeholder="Tags (comma separated)..."
                                      value={newJournalTags}
                                      onChange={(e) => setNewJournalTags(e.target.value)}
                                      className="bg-slate-950 border border-slate-850 rounded px-1.5 py-1 text-[8px] text-slate-300 focus:outline-none focus:border-indigo-500 flex-1 max-w-[120px]"
                                    />
                                    <button
                                      type="button"
                                      disabled={!newJournalTitle.trim() || !newJournalContent.trim()}
                                      onClick={() => {
                                        const entry = {
                                          id: "j_" + Date.now(),
                                          date: "Jul 20, 2026",
                                          title: newJournalTitle,
                                          content: newJournalContent,
                                          mood: newJournalMood,
                                          tags: newJournalTags.split(",").map(s => s.trim()).filter(Boolean),
                                          isVoice: false
                                        };
                                        setJournalEntries(prev => [entry, ...prev]);
                                        addFrameworkLog("broadcast", "JournalService", "New text reflection entry stored in SQL companion schema.");
                                        setNewJournalTitle("");
                                        setNewJournalContent("");
                                        setNewJournalTags("");
                                      }}
                                      className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white font-bold text-[9px] px-3 py-1.5 rounded-lg transition-all"
                                    >
                                      Save Note
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {jarvisTab === "fitness" && (
                              <div className="space-y-4">
                                {/* WATER TRACKER PANEL (Interactive) */}
                                <div className={`p-3.5 rounded-2xl border transition-all ${
                                  appTheme === "dark" ? "bg-slate-900/40 border-slate-800" :
                                  appTheme === "light" ? "bg-white border-slate-200 shadow-sm" :
                                  "bg-black border-2 border-white"
                                }`}>
                                  <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider font-display">
                                      Hydration Tracker (Water Logs)
                                    </h4>
                                    <span className="text-[10px] font-mono font-semibold">{waterIntake}ml / 3000ml</span>
                                  </div>

                                  <div className="w-full bg-slate-950/60 border border-slate-900 h-3 rounded-full overflow-hidden relative">
                                    <div
                                      className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full transition-all duration-500"
                                      style={{ width: `${Math.min(100, (waterIntake / 3000) * 100)}%` }}
                                    />
                                  </div>

                                  <div className="mt-3 flex items-center justify-between">
                                    <span className="text-[9px] text-slate-400">Click to record or remove water cups.</span>
                                    <div className="flex space-x-1">
                                      <button
                                        onClick={() => {
                                          setWaterIntake(prev => Math.max(0, prev - 250));
                                          addFrameworkLog("info", "FitnessTracker", "Logged removal of 250ml water");
                                        }}
                                        className="w-7 h-7 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400 hover:text-white flex items-center justify-center font-bold active:scale-95 transition-all"
                                      >
                                        -
                                      </button>
                                      <button
                                        onClick={() => {
                                          setWaterIntake(prev => prev + 250);
                                          addFrameworkLog("info", "FitnessTracker", "Logged 250ml water consumption (+1 cup)");
                                        }}
                                        className="w-7 h-7 rounded bg-indigo-600 border border-indigo-500 text-[11px] text-white hover:bg-indigo-500 flex items-center justify-center font-bold active:scale-95 transition-all"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* HABIT TRACKING GRID */}
                                <div className="space-y-2">
                                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-1">DAILY HABIT STREAKS</h4>
                                  
                                  <div className="grid grid-cols-2 gap-2 select-none">
                                    {habits.map((h) => {
                                      const completedToday = h.completedDays.includes(20);
                                      return (
                                        <div
                                          key={h.id}
                                          onClick={() => {
                                            setHabits(prev => prev.map(hab => {
                                              if (hab.id === h.id) {
                                                const hasToday = hab.completedDays.includes(20);
                                                const list = hasToday
                                                  ? hab.completedDays.filter(d => d !== 20)
                                                  : [...hab.completedDays, 20];
                                                const nextStreak = hasToday ? Math.max(0, hab.streak - 1) : hab.streak + 1;
                                                return { ...hab, completedDays: list, streak: nextStreak };
                                              }
                                              return hab;
                                            }));
                                            addFrameworkLog("info", "HabitService", `Toggled habit state: ${h.name}`);
                                          }}
                                          className={`p-2.5 rounded-xl border cursor-pointer hover:bg-slate-900/20 active:scale-[0.98] transition-all flex flex-col justify-between text-[9px] ${
                                            completedToday
                                              ? "bg-slate-900/30 border-indigo-500/20 opacity-90"
                                              : "bg-slate-900/10 border-slate-850"
                                          }`}
                                        >
                                          <div className="flex justify-between items-start">
                                            <span className="font-semibold text-slate-200 truncate max-w-[100px]">{h.name}</span>
                                            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                                              completedToday ? "bg-indigo-600 border-indigo-500 text-white" : "border-slate-600"
                                            }`}>
                                              {completedToday && <Check className="w-2.5 h-2.5" />}
                                            </div>
                                          </div>
                                          
                                          <div className="flex justify-between items-center mt-2 pt-1 border-t border-slate-900/40 text-[8px] text-slate-400 font-mono">
                                            <span>Streak: <strong className="text-indigo-400">{h.streak}d</strong></span>
                                            <span>{h.completedDays.length}/{h.target} completed</span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* FITNESS PERFORMANCE SVG GRAPH */}
                                <div className={`p-3 rounded-2xl border ${
                                  appTheme === "dark" ? "bg-slate-900/40 border-slate-800" :
                                  appTheme === "light" ? "bg-white border-slate-200 shadow-sm" :
                                  "bg-black border-2 border-white"
                                }`}>
                                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                    Activity Performance (Habit completion rates)
                                  </h4>
                                  
                                  {/* Custom Responsive SVG Chart */}
                                  <div className="w-full h-20 bg-slate-950/40 rounded-lg p-1.5 flex items-end justify-between border border-slate-900/80">
                                    {[
                                      { day: "Mon", rate: 25 },
                                      { day: "Tue", rate: 50 },
                                      { day: "Wed", rate: 75 },
                                      { day: "Thu", rate: 60 },
                                      { day: "Fri", rate: 90 },
                                      { day: "Sat", rate: 40 },
                                      { day: "Sun", rate: 100 }
                                    ].map((pt, i) => (
                                      <div key={i} className="flex flex-col items-center flex-1 space-y-1 group">
                                        <span className="text-[6px] text-slate-500 opacity-0 group-hover:opacity-100 font-mono transition-opacity">{pt.rate}%</span>
                                        <div className="w-4 bg-slate-900/80 hover:bg-slate-850 rounded-t h-12 flex items-end">
                                          <div
                                            className="bg-indigo-500 rounded-t w-full hover:bg-indigo-400 transition-all duration-500"
                                            style={{ height: `${pt.rate}%` }}
                                          />
                                        </div>
                                        <span className="text-[7px] text-slate-500 font-mono">{pt.day}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {jarvisTab === "connectors" && (
                              <div className="space-y-4">
                                {/* Google workspace sync state */}
                                <div className={`p-3 rounded-2xl border transition-all ${
                                  appTheme === "dark" ? "bg-slate-900/40 border-slate-800" :
                                  appTheme === "light" ? "bg-white border-slate-200 shadow-sm" :
                                  "bg-black border-2 border-white"
                                }`}>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <span className="text-[8px] font-bold text-emerald-400 tracking-wider uppercase font-mono">WORKSPACE SECURE</span>
                                      <h4 className="text-[11px] font-bold text-slate-200 mt-0.5">Google OAuth Synchronization</h4>
                                      <p className="text-[9px] text-slate-400 leading-normal mt-1">
                                        Real-time connection with personal mail accounts and daily schedulers.
                                      </p>
                                    </div>
                                    <div className="p-2 bg-emerald-950/30 border border-emerald-900/40 rounded-xl text-emerald-400 animate-pulse shrink-0">
                                      <ShieldCheck className="w-5 h-5" />
                                    </div>
                                  </div>
                                </div>

                                {/* CONNECTOR SERVICES CARDS */}
                                <div className="space-y-2 select-none">
                                  {connectorsList.map((conn) => (
                                    <div
                                      key={conn.id}
                                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                                        appTheme === "dark" ? "bg-slate-900/40 border-slate-800" :
                                        appTheme === "light" ? "bg-white border-slate-150" :
                                        "bg-black border-2 border-white"
                                      }`}
                                    >
                                      <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-xl border shrink-0 ${
                                          conn.connected
                                            ? "bg-indigo-950/20 border-indigo-900/40 text-indigo-400"
                                            : "bg-slate-900 border-slate-850 text-slate-500"
                                        }`}>
                                          {conn.icon === "Calendar" && <Calendar className="w-4 h-4" />}
                                          {conn.icon === "Mail" && <Mail className="w-4 h-4" />}
                                          {conn.icon === "Linkedin" && <Cpu className="w-4 h-4" />}
                                          {conn.icon === "Music" && <Music className="w-4 h-4" />}
                                        </div>
                                        
                                        <div className="flex flex-col">
                                          <span className="text-[10px] font-semibold text-slate-200">{conn.name}</span>
                                          <span className="text-[8px] text-slate-400 mt-0.5 font-mono truncate max-w-[140px]">
                                            {conn.connected ? conn.account : "Disconnected"}
                                          </span>
                                          <span className="text-[7px] text-slate-500 mt-1">
                                            Last sync: <strong className="font-mono">{conn.lastSync}</strong>
                                          </span>
                                        </div>
                                      </div>

                                      <div className="flex flex-col items-end space-y-1.5 shrink-0">
                                        <span className={`px-2 py-0.5 rounded-full text-[7px] font-bold tracking-wide uppercase ${
                                          conn.connected
                                            ? "bg-emerald-950/40 border border-emerald-900/40 text-emerald-300"
                                            : "bg-rose-950/40 border border-rose-900/40 text-rose-300"
                                        }`}>
                                          {conn.connected ? "Active" : "Off"}
                                        </span>
                                        
                                        <button
                                          onClick={() => {
                                            setConnectorsList(prev => prev.map(c => {
                                              if (c.id === conn.id) {
                                                const nextConnected = !c.connected;
                                                return {
                                                  ...c,
                                                  connected: nextConnected,
                                                  lastSync: nextConnected ? "Just now" : "Never"
                                                };
                                              }
                                              return c;
                                            }));
                                            addFrameworkLog("broadcast", "ConnectorManager", `Toggled status for ${conn.name}: ${!conn.connected ? "CONNECTED" : "DISCONNECTED"}`);
                                          }}
                                          className={`px-2 py-1 rounded-md text-[8px] font-bold transition-all border ${
                                            conn.connected
                                              ? "hover:bg-rose-950/20 border-slate-800 text-slate-400 hover:text-rose-400"
                                              : "bg-indigo-600 border-indigo-500 hover:bg-indigo-500 text-white"
                                          }`}
                                        >
                                          {conn.connected ? "Disconnect" : "Connect"}
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Material 3 Floating Navigation Bar (Home, Chat, Memory, Automations, Profile) */}
                          <div className={`mx-3 mb-2 px-2 py-1.5 rounded-full border flex items-center justify-around shrink-0 select-none z-20 backdrop-blur-xl shadow-2xl ${
                            appTheme === "dark" ? "bg-slate-900/90 border-white/10 text-white" :
                            appTheme === "light" ? "bg-white/90 border-slate-200 text-slate-900 shadow-lg" :
                            "bg-black border border-white text-white"
                          }`}>
                            <button
                              type="button"
                              onClick={() => {
                                setJarvisTab("home");
                                addFrameworkLog("info", "TabNavigator", "Active navigation: HOME");
                              }}
                              className={`flex-1 py-1 flex flex-col items-center justify-center space-y-0.5 rounded-full transition-all ${
                                jarvisTab === "home" ? "text-indigo-400 bg-indigo-500/10 font-bold" : "text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              <Home className="w-4 h-4" />
                              <span className="text-[8px] font-mono tracking-tight">Home</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setJarvisTab("chat");
                                addFrameworkLog("info", "TabNavigator", "Active navigation: CHAT");
                              }}
                              className={`flex-1 py-1 flex flex-col items-center justify-center space-y-0.5 rounded-full transition-all ${
                                jarvisTab === "chat" ? "text-indigo-400 bg-indigo-500/10 font-bold" : "text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span className="text-[8px] font-mono tracking-tight">Chat</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setJarvisTab("memory");
                                addFrameworkLog("info", "TabNavigator", "Active navigation: MEMORY");
                              }}
                              className={`flex-1 py-1 flex flex-col items-center justify-center space-y-0.5 rounded-full transition-all ${
                                jarvisTab === "memory" ? "text-indigo-400 bg-indigo-500/10 font-bold" : "text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              <Brain className="w-4 h-4" />
                              <span className="text-[8px] font-mono tracking-tight">Memory</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setJarvisTab("automations");
                                addFrameworkLog("info", "TabNavigator", "Active navigation: AUTOMATIONS");
                              }}
                              className={`flex-1 py-1 flex flex-col items-center justify-center space-y-0.5 rounded-full transition-all ${
                                jarvisTab === "automations" ? "text-indigo-400 bg-indigo-500/10 font-bold" : "text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              <Calendar className="w-4 h-4" />
                              <span className="text-[8px] font-mono tracking-tight">Automation</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setJarvisTab("profile");
                                addFrameworkLog("info", "TabNavigator", "Active navigation: PROFILE");
                              }}
                              className={`flex-1 py-1 flex flex-col items-center justify-center space-y-0.5 rounded-full transition-all ${
                                jarvisTab === "profile" ? "text-indigo-400 bg-indigo-500/10 font-bold" : "text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              <UserIcon className="w-4 h-4" />
                              <span className="text-[8px] font-mono tracking-tight">Profile</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* STANDALONE ANDROID SYSTEM LAUNCHER */
                        <div className="flex-1 flex flex-col justify-between p-5 h-full">
                          {/* Big Digital Clock */}
                          <div className="text-center mt-6 select-none shrink-0">
                            <h2 className="text-4xl font-display font-light text-white tracking-tight">
                              {deviceState.systemTime || "12:00 PM"}
                            </h2>
                            <p className="text-xs text-slate-400 mt-1">Monday, July 20, 2026</p>
                          </div>

                          {/* Jarvis Companion Widget Card */}
                          <div
                            onClick={() => {
                              setJarvisAppLaunched(true);
                              addFrameworkLog("info", "ActivityManager", "Launching Jarvis Companion Hub from Widget trigger.");
                            }}
                            className="mt-6 p-4 rounded-2xl bg-gradient-to-tr from-indigo-900/60 to-slate-900/80 border border-indigo-500/20 text-left cursor-pointer hover:border-indigo-500/45 hover:scale-[1.02] active:scale-95 transition-all shadow-lg select-none"
                          >
                            <div className="flex items-center space-x-1.5 mb-1.5">
                              <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center animate-pulse">
                                <Sparkles className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-wider font-display">JARVIS CORE HEALTH</span>
                            </div>
                            <p className="text-[10px] text-slate-200 leading-normal">
                              Always-On voice activation standby is <span className="text-emerald-400 font-semibold">Active</span>. 
                              Click here to enter the main interactive Jarvis assistant dashboards.
                            </p>
                          </div>

                          {/* Apps Grid */}
                          <div className="grid grid-cols-4 gap-y-6 gap-x-2 mt-8 px-2 select-none">
                            {/* Jarvis App launcher icon */}
                            <button
                              onClick={() => {
                                setJarvisAppLaunched(true);
                                addFrameworkLog("info", "ActivityManager", "Starting Jarvis Hub companion application.");
                              }}
                              className="flex flex-col items-center group"
                            >
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-800 border border-indigo-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform relative">
                                <Sparkles className="w-5 h-5 text-white animate-pulse" />
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-950 animate-pulse" />
                              </div>
                              <span className="text-[10px] text-slate-300 mt-1.5 truncate w-full text-center font-semibold">Jarvis Hub</span>
                            </button>

                            {/* Gmail Icon */}
                            <button
                              onClick={() => {
                                setActiveScreen("gmail");
                                addFrameworkLog("info", "ActivityManager", "Starting activity: Gmail client UI");
                              }}
                              className="flex flex-col items-center group"
                            >
                              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                <Mail className="w-5 h-5 text-rose-400" />
                              </div>
                              <span className="text-[10px] text-slate-300 mt-1.5 truncate w-full text-center">Gmail</span>
                            </button>

                            {/* Calendar Icon */}
                            <button
                              onClick={() => {
                                setActiveScreen("calendar");
                                addFrameworkLog("info", "ActivityManager", "Starting activity: Calendar view UI");
                              }}
                              className="flex flex-col items-center group"
                            >
                              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                <Calendar className="w-5 h-5 text-sky-400" />
                              </div>
                              <span className="text-[10px] text-slate-300 mt-1.5 truncate w-full text-center">Calendar</span>
                            </button>

                            {/* Weather Icon */}
                            <button
                              onClick={() => {
                                setActiveScreen("weather");
                                addFrameworkLog("info", "ActivityManager", "Starting activity: Weather forecasting widget");
                              }}
                              className="flex flex-col items-center group"
                            >
                              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                <CloudSun className="w-5 h-5 text-amber-400" />
                              </div>
                              <span className="text-[10px] text-slate-300 mt-1.5 truncate w-full text-center">Weather</span>
                            </button>

                            {/* Alarms Icon */}
                            <button
                              onClick={() => {
                                setActiveScreen("clock");
                                addFrameworkLog("info", "ActivityManager", "Starting activity: System Clock / Alarms");
                              }}
                              className="flex flex-col items-center group"
                            >
                              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                <Clock className="w-5 h-5 text-teal-400" />
                              </div>
                              <span className="text-[10px] text-slate-300 mt-1.5 truncate w-full text-center">Clock</span>
                            </button>

                            {/* Music Icon */}
                            <button
                              onClick={() => {
                                setActiveScreen("music");
                                addFrameworkLog("info", "ActivityManager", "Starting activity: Media session client");
                              }}
                              className="flex flex-col items-center group"
                            >
                              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                <Music className="w-5 h-5 text-indigo-400" />
                              </div>
                              <span className="text-[10px] text-slate-300 mt-1.5 truncate w-full text-center">Music</span>
                            </button>

                            {/* Flashlight Widget */}
                            <button
                              onClick={() => {
                                const nextState = !deviceState.flashlightOn;
                                setDeviceState((prev) => ({ ...prev, flashlightOn: nextState }));
                                addFrameworkLog("info", "CameraService", `Simulated power button toggle flashlight: ${nextState ? "ON" : "OFF"}`);
                              }}
                              className="flex flex-col items-center group"
                            >
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                                deviceState.flashlightOn
                                  ? "bg-yellow-400/20 border border-yellow-300 text-yellow-300 scale-105 animate-pulse"
                                  : "bg-slate-800/40 border border-slate-700/60 text-slate-400 hover:border-slate-600"
                              }`}>
                                <Zap className="w-5 h-5" />
                              </div>
                              <span className="text-[10px] text-slate-300 mt-1.5 truncate w-full text-center">Flashlight</span>
                            </button>

                            {/* Search Icon */}
                            <button
                              onClick={() => {
                                setActiveScreen("search");
                                addFrameworkLog("info", "ActivityManager", "Starting activity: Browser search query client");
                              }}
                              className="flex flex-col items-center group"
                            >
                              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                <Search className="w-5 h-5 text-emerald-400" />
                              </div>
                              <span className="text-[10px] text-slate-300 mt-1.5 truncate w-full text-center">Search</span>
                            </button>

                            {/* Settings Icon */}
                            <button
                              onClick={() => {
                                setActiveScreen("settings");
                                addFrameworkLog("info", "ActivityManager", "Starting Activity: com.android.settings.JARVIS_PREFERENCES");
                              }}
                              className="flex flex-col items-center group"
                            >
                              <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                <Settings className="w-5 h-5 text-slate-400" />
                              </div>
                              <span className="text-[10px] text-slate-300 mt-1.5 truncate w-full text-center">Settings</span>
                            </button>

                            {/* Google Workspace Icon */}
                            <button
                              onClick={() => {
                                setActiveScreen("workspace");
                                addFrameworkLog("info", "ActivityManager", "Starting Activity: com.google.android.apps.workspace.MAIN");
                              }}
                              className="flex flex-col items-center group"
                            >
                              <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                <HardDrive className="w-5 h-5 text-indigo-400" />
                              </div>
                              <span className="text-[10px] text-slate-300 mt-1.5 truncate w-full text-center font-medium">Workspace</span>
                            </button>
                          </div>

                          {/* Google Quick Search Bar */}
                          <div className="mt-auto mb-16">
                            <div
                              onClick={() => setActiveScreen("search")}
                              className="w-full bg-slate-900/60 border border-slate-800 hover:bg-slate-900 px-4 py-2.5 rounded-full flex items-center justify-between text-slate-400 text-xs cursor-pointer shadow-md select-none transition-all"
                            >
                              <span className="flex items-center space-x-2">
                                <Search className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Ask Google / Search...</span>
                              </span>
                              <Mic className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* SCREEN: Simulated Gmail App */}
                  {activeScreen === "gmail" && (
                    <motion.div
                      key="gmail"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-1 flex flex-col bg-slate-950 p-4"
                    >
                      <div className="flex items-center space-x-2 mb-4 shrink-0">
                        <button onClick={() => setActiveScreen("homescreen")} className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white">
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <Mail className="w-4 h-4 text-rose-400" />
                        <h3 className="text-sm font-semibold text-slate-200">Gmail Compose</h3>
                      </div>

                      {/* Gmail mock content */}
                      <div className="flex-1 flex flex-col justify-between bg-slate-900/50 rounded-2xl p-4 border border-slate-800">
                        {gmailDraft ? (
                          <div className="space-y-3 flex-1 flex flex-col justify-between">
                            <div className="space-y-2.5 text-xs">
                              <div className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-slate-400">To:</span>
                                <span className="text-slate-200 font-medium font-mono">{gmailDraft.recipient}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-slate-400">Subject:</span>
                                <span className="text-slate-200 font-medium">{gmailDraft.subject}</span>
                              </div>
                              <div className="mt-2 text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg min-h-[140px] whitespace-pre-wrap font-sans">
                                {gmailDraft.body}
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setGmailDraft(null);
                                addFrameworkLog("broadcast", "GmailService", "Intent SENT. Broadcasting com.android.mail.DRAFT_SAVED");
                                alert("Simulated Email Draft saved inside GMail client successfully!");
                              }}
                              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs py-2 rounded-xl flex items-center justify-center space-x-1 shadow-lg shadow-rose-600/20 active:scale-[0.98] transition-all"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Save Email Draft</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center py-12 flex-1">
                            <div className="p-3 bg-slate-800/40 rounded-full mb-3 text-slate-500">
                              <Mail className="w-6 h-6" />
                            </div>
                            <h4 className="text-xs font-medium text-slate-300">No active draft</h4>
                            <p className="text-[10px] text-slate-500 max-w-[200px] mt-1 leading-normal">
                              Speak to Jarvis: e.g. "Draft a Gmail to Sarah asking if we are still on for 5 PM."
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* SCREEN: Simulated Weather Widget */}
                  {activeScreen === "weather" && (
                    <motion.div
                      key="weather"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-1 flex flex-col bg-gradient-to-b from-sky-950 to-slate-950 p-4"
                    >
                      <div className="flex items-center space-x-2 mb-4 shrink-0">
                        <button onClick={() => setActiveScreen("homescreen")} className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white">
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <CloudSun className="w-4 h-4 text-amber-400" />
                        <h3 className="text-sm font-semibold text-slate-200">System Weather Feed</h3>
                      </div>

                      <div className="flex-1 bg-slate-900/60 rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between text-center">
                        <div className="my-auto space-y-3">
                          <p className="text-xs text-indigo-300 font-semibold tracking-wider uppercase">{weatherData.city}</p>
                          <h4 className="text-6xl font-display font-bold text-white tracking-tighter my-2">
                            {weatherData.temp}
                          </h4>
                          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-300 text-xs">
                            <CloudSun className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                            <span>{weatherData.condition}</span>
                          </div>
                        </div>

                        <div className="border-t border-slate-800/80 pt-4 grid grid-cols-3 gap-2 text-[10px]">
                          <div className="p-2 bg-slate-950/40 rounded-lg">
                            <span className="text-slate-400 block mb-0.5">Humid</span>
                            <span className="text-slate-200 font-semibold">44%</span>
                          </div>
                          <div className="p-2 bg-slate-950/40 rounded-lg">
                            <span className="text-slate-400 block mb-0.5">Wind</span>
                            <span className="text-slate-200 font-semibold">9 mph</span>
                          </div>
                          <div className="p-2 bg-slate-950/40 rounded-lg">
                            <span className="text-slate-400 block mb-0.5">AQI</span>
                            <span className="text-slate-200 font-semibold">12 (Good)</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* SCREEN: Simulated Calendar */}
                  {activeScreen === "calendar" && (
                    <motion.div
                      key="calendar"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-1 flex flex-col bg-slate-950 p-4"
                    >
                      <div className="flex items-center space-x-2 mb-4 shrink-0">
                        <button onClick={() => setActiveScreen("homescreen")} className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white">
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <Calendar className="w-4 h-4 text-sky-400" />
                        <h3 className="text-sm font-semibold text-slate-200">Calendar Provider</h3>
                      </div>

                      <div className="flex-1 flex flex-col bg-slate-900/40 rounded-2xl p-4 border border-slate-800 overflow-y-auto">
                        <div className="flex justify-between items-center mb-3 text-xs">
                          <span className="text-slate-400">Month</span>
                          <span className="text-indigo-400 font-semibold">July 2026</span>
                        </div>

                        {/* Calendar visual grid */}
                        <div className="grid grid-cols-7 gap-1 text-[9px] text-center mb-4 select-none">
                          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                            <span key={i} className="text-slate-500 font-semibold py-1">{d}</span>
                          ))}
                          {Array.from({ length: 31 }).map((_, idx) => {
                            const day = idx + 1;
                            const isSelected = day === 20; // 20th July 2026
                            return (
                              <span
                                key={idx}
                                className={`py-1.5 rounded-md font-medium ${
                                  isSelected
                                    ? "bg-indigo-600 text-white font-bold"
                                    : "text-slate-400 hover:bg-slate-800"
                                }`}
                              >
                                {day}
                              </span>
                            );
                          })}
                        </div>

                        {/* Event blocks */}
                        <h4 className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mb-2">
                          Upcoming Events
                        </h4>

                        <div className="space-y-2 flex-1">
                          {calendarEvents.map((evt) => (
                            <div key={evt.id} className="p-2.5 bg-indigo-950/40 border border-indigo-900/30 rounded-xl flex items-start space-x-2 text-xs">
                              <div className="w-1.5 h-8 bg-indigo-500 rounded-full" />
                              <div className="flex-1 min-w-0">
                                <p className="text-slate-200 font-medium truncate">{evt.subject || "Standup Meeting"}</p>
                                <p className="text-[10px] text-indigo-300 mt-0.5">{evt.time || "10:00 AM"}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* SCREEN: Simulated Clock/Reminders App */}
                  {activeScreen === "clock" && (
                    <motion.div
                      key="clock"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-1 flex flex-col bg-slate-950 p-4"
                    >
                      <div className="flex items-center space-x-2 mb-4 shrink-0">
                        <button onClick={() => setActiveScreen("homescreen")} className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white">
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <Clock className="w-4 h-4 text-teal-400" />
                        <h3 className="text-sm font-semibold text-slate-200">Clock Alarms</h3>
                      </div>

                      <div className="flex-1 flex flex-col bg-slate-900/40 rounded-2xl p-4 border border-slate-800 overflow-y-auto">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Active Reminders</span>
                          <button
                            onClick={() => {
                              const hrs = Math.floor(Math.random() * 12) + 1;
                              const mins = String(Math.floor(Math.random() * 60)).padStart(2, "0");
                              const p = Math.random() > 0.5 ? "PM" : "AM";
                              const textList = ["Read documentation", "Drink some water", "Inspect container port", "Git commit code"];
                              const randomTxt = textList[Math.floor(Math.random() * textList.length)];
                              const newRem = {
                                id: "r_" + Date.now(),
                                time: `${hrs}:${mins} ${p}`,
                                text: randomTxt
                              };
                              setReminders((prev) => [newRem, ...prev]);
                              addFrameworkLog("info", "AlarmManager", `Manual alarm set for ${newRem.time} via AlarmClock API.`);
                            }}
                            className="text-[10px] text-teal-400 flex items-center space-x-0.5 hover:underline"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Quick Add</span>
                          </button>
                        </div>

                        <div className="space-y-2 flex-1">
                          {reminders.map((rem) => (
                            <div key={rem.id} className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl flex items-center justify-between">
                              <div>
                                <span className="font-mono text-slate-200 font-semibold block text-sm">{rem.time}</span>
                                <span className="text-[10px] text-slate-400">{rem.text}</span>
                              </div>
                              <Clock className="w-4 h-4 text-teal-400/60" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* SCREEN: Simulated Music Player */}
                  {activeScreen === "music" && (
                    <motion.div
                      key="music"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-1 flex flex-col bg-slate-950 p-4"
                    >
                      <div className="flex items-center space-x-2 mb-4 shrink-0">
                        <button onClick={() => setActiveScreen("homescreen")} className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white">
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <Music className="w-4 h-4 text-indigo-400" />
                        <h3 className="text-sm font-semibold text-slate-200">System Media Player</h3>
                      </div>

                      <div className="flex-1 bg-slate-900/60 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between items-center text-center">
                        <div className="my-auto space-y-4">
                          {/* Animated Vinyl Disc */}
                          <div className="relative">
                            <div className={`w-28 h-28 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 rounded-full border-4 border-slate-800/80 shadow-2xl flex items-center justify-center ${
                              musicPlaying.playing ? "animate-[spin_6s_linear_infinite]" : ""
                            }`}>
                              <div className="w-10 h-10 bg-indigo-900/40 rounded-full border border-slate-700 flex items-center justify-center">
                                <div className="w-3.5 h-3.5 bg-slate-950 rounded-full" />
                              </div>
                            </div>
                            <div className="absolute -top-1 -right-1 p-1 bg-indigo-600 rounded-full">
                              <Music className="w-3 h-3 text-white" />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-xs font-semibold text-slate-100 max-w-[180px] truncate mx-auto">
                              {musicPlaying.title}
                            </h4>
                            <p className="text-[10px] text-indigo-300">{musicPlaying.artist}</p>
                          </div>
                        </div>

                        {/* Music Playback Timeline */}
                        <div className="w-full space-y-1 mt-2">
                          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 transition-all duration-300"
                              style={{ width: `${musicPlaying.progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                            <span>0:45</span>
                            <span>3:12</span>
                          </div>
                        </div>

                        {/* Play/Pause controls */}
                        <div className="flex items-center space-x-5 mt-2">
                          <button
                            onClick={() => {
                              setMusicPlaying((prev) => ({ ...prev, progress: Math.max(0, prev.progress - 10) }));
                            }}
                            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400"
                          >
                            <SkipBack className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setMusicPlaying((prev) => ({ ...prev, playing: !prev.playing }));
                              addFrameworkLog("info", "MediaSessionService", `Media button input: ${!musicPlaying.playing ? "PLAY" : "PAUSE"}`);
                            }}
                            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg hover:shadow-indigo-600/20 shadow-indigo-600/10 active:scale-[0.95]"
                          >
                            {musicPlaying.playing ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white translate-x-0.5" />}
                          </button>
                          <button
                            onClick={() => {
                              setMusicPlaying((prev) => ({ ...prev, progress: Math.min(100, prev.progress + 15) }));
                            }}
                            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400"
                          >
                            <SkipForward className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* SCREEN: Simulated Search Widget */}
                  {activeScreen === "search" && (
                    <motion.div
                      key="search"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-1 flex flex-col bg-slate-950 p-4"
                    >
                      <div className="flex items-center space-x-2 mb-4 shrink-0">
                        <button onClick={() => setActiveScreen("homescreen")} className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white">
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <Search className="w-4 h-4 text-emerald-400" />
                        <h3 className="text-sm font-semibold text-slate-200">System Browser</h3>
                      </div>

                      <div className="flex-1 flex flex-col bg-slate-900/40 rounded-2xl p-3 border border-slate-800 text-xs overflow-y-auto">
                        <div className="flex items-center space-x-1.5 bg-slate-950/60 p-2 rounded-xl mb-3 border border-slate-800">
                          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <input
                            type="text"
                            placeholder="Type Google search query..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                addFrameworkLog("info", "BrowserSearchIntent", `User typed search lookup: "${searchQuery}"`);
                                setSearchResults([
                                  `About ${searchQuery} - Wikipedia overview and standard dictionary definitions.`,
                                  `${searchQuery} - Latest news updates, press releases, and articles on social media platforms.`,
                                  `Official Guide to ${searchQuery} - Interactive tutorials, documentation, and expert columns.`
                                ]);
                              }
                            }}
                            className="bg-transparent border-none text-slate-200 placeholder-slate-500 focus:outline-none w-full text-xs"
                          />
                        </div>

                        {searchResults.length > 0 ? (
                          <div className="space-y-2">
                            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold block mb-1">
                              Search Results for "{searchQuery}"
                            </span>
                            {searchResults.map((result, idx) => (
                              <div key={idx} className="p-2 bg-slate-950/30 border border-slate-800/80 rounded-lg">
                                <div className="text-emerald-400 font-medium hover:underline cursor-pointer flex items-center space-x-1">
                                  <span>Result {idx + 1} Link</span>
                                </div>
                                <p className="text-[10px] text-slate-300 mt-1 leading-normal">{result}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center py-16 text-slate-500">
                            <Compass className="w-6 h-6 mb-2 text-slate-600 animate-spin" style={{ animationDuration: "12s" }} />
                            <span>Browser state ready.</span>
                            <span className="text-[10px] text-slate-600 mt-1 max-w-[150px] mx-auto leading-normal">
                              Type a query above or let Jarvis run search grounding.
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* SCREEN: Simulated Settings */}
                  {activeScreen === "settings" && (
                    <motion.div
                      key="settings"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-1 flex flex-col bg-slate-950 p-4"
                    >
                      <div className="flex items-center space-x-2 mb-4 shrink-0">
                        <button onClick={() => setActiveScreen("homescreen")} className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white">
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <Settings className="w-4 h-4 text-indigo-400" />
                        <h3 className="text-sm font-semibold text-slate-200 font-display">Preferences</h3>
                      </div>

                      <div className="flex-1 overflow-y-auto pr-0.5 space-y-4 text-xs">
                        {/* Gemini API Diagnostics & Status Card */}
                        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 p-4 rounded-2xl border border-indigo-500/30 shadow-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Sparkles className="w-4 h-4 text-indigo-400" />
                              <span className="text-[11px] font-bold text-slate-100 uppercase font-mono tracking-wider">
                                Gemini AI Engine
                              </span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-bold border ${
                              geminiStatus.connected
                                ? "bg-emerald-950 text-emerald-400 border-emerald-500/30"
                                : "bg-rose-950 text-rose-400 border-rose-500/30"
                            }`}>
                              {geminiStatus.status}
                            </span>
                          </div>

                          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5 text-left">
                            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                              <span>Key Mask: <strong className="text-slate-200">{geminiStatus.maskedKey || "Not loaded"}</strong></span>
                              <span>Model: <strong className="text-indigo-300">{geminiStatus.model || "gemini-3.6-flash"}</strong></span>
                            </div>
                            <p className="text-[10px] text-slate-300 leading-normal">
                              {geminiStatus.message}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              checkGeminiConnection(false);
                              setShowGeminiSetupModal(true);
                            }}
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10.5px] rounded-xl flex items-center justify-center space-x-1.5 transition-all active:scale-95 shadow-md shadow-indigo-900/30"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>Configure & Test Gemini Connection</span>
                          </button>
                        </div>

                        {/* Firebase User Authentication Card */}
                        <div className="bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 p-4 rounded-2xl border border-indigo-500/30 shadow-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <ShieldCheck className="w-4 h-4 text-emerald-400" />
                              <span className="text-[11px] font-bold text-slate-100 uppercase font-mono tracking-wider">
                                Firebase Identity & Auth
                              </span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[8px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                              {currentUser ? "AUTHENTICATED" : "GUEST MODE"}
                            </span>
                          </div>

                          {currentUser ? (
                            <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                              <div className="flex items-center space-x-3 overflow-hidden">
                                {currentUser.photoURL ? (
                                  <img src={currentUser.photoURL} alt="User Avatar" className="w-8 h-8 rounded-full border border-indigo-500/40" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                                    {currentUser.email?.charAt(0).toUpperCase() || "U"}
                                  </div>
                                )}
                                <div className="overflow-hidden text-left">
                                  <span className="text-[11px] font-semibold text-slate-100 block truncate">
                                    {currentUser.displayName || currentUser.email || "Authenticated User"}
                                  </span>
                                  <span className="text-[9px] text-slate-400 block truncate font-mono">
                                    {currentUser.email}
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={async () => {
                                  try {
                                    await signOutUser();
                                    addFrameworkLog("info", "FirebaseAuth", "User signed out successfully.");
                                  } catch (err: any) {
                                    addFrameworkLog("error", "FirebaseAuth", `Sign out error: ${err.message}`);
                                  }
                                }}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-rose-950/50 hover:text-rose-300 text-slate-300 text-[9.5px] font-bold rounded-lg border border-slate-700 transition-all shrink-0"
                              >
                                Sign Out
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-2 text-left">
                              <p className="text-[10px] text-slate-300 leading-normal">
                                Connect your Google Account via Firebase Auth to securely save your Jarvis memory logs and personal preferences to Firestore.
                              </p>
                              <button
                                type="button"
                                disabled={isSigningIn}
                                onClick={async () => {
                                  setIsSigningIn(true);
                                  try {
                                    const user = await signInWithGoogle();
                                    addFrameworkLog("info", "FirebaseAuth", `Google Sign-In successful for ${user.email}`);
                                  } catch (err: any) {
                                    addFrameworkLog("error", "FirebaseAuth", `Sign-In failed: ${err.message}`);
                                  } finally {
                                    setIsSigningIn(false);
                                  }
                                }}
                                className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-[11px] rounded-xl flex items-center justify-center space-x-2 shadow-md shadow-indigo-900/30 transition-all active:scale-95 disabled:opacity-50"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                                <span>{isSigningIn ? "Signing in..." : "Sign in with Google (Firebase)"}</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Preferred Language */}
                        <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-850">
                          <label className="text-slate-400 block font-semibold mb-1.5 tracking-wide">Language Settings</label>
                          <select
                            value={preferredLanguage}
                            onChange={(e) => {
                              setPreferredLanguage(e.target.value);
                              addFrameworkLog("info", "SettingsManager", `Preferred language set to: ${e.target.value.toUpperCase()}`);
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-indigo-500/50"
                          >
                            <option value="auto">Auto-Detect Language</option>
                            <option value="en">English (US)</option>
                            <option value="hi">हिंदी (Hindi)</option>
                            <option value="mr">मराठी (Marathi)</option>
                          </select>
                        </div>

                        {/* Humor Mode Toggle */}
                        <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-850 flex items-center justify-between">
                          <div>
                            <label className="text-slate-200 font-semibold block tracking-wide">Butler Humor Mode</label>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Enables subtle, respectful butler sarcasm</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setHumorMode(prev => !prev);
                              addFrameworkLog("info", "SettingsManager", `Humor mode toggled: ${!humorMode ? "ENABLED" : "DISABLED"}`);
                            }}
                            className={`w-10 h-6 rounded-full p-1 transition-colors shrink-0 ${humorMode ? "bg-indigo-600" : "bg-slate-800"}`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${humorMode ? "translate-x-4" : "translate-x-0"}`} />
                          </button>
                        </div>

                        {/* Active Listening Toggle */}
                        <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-850 flex items-center justify-between">
                          <div>
                            <label className="text-slate-200 font-semibold block tracking-wide">Active Listening</label>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Keep session active for hands-free conversations</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveListening(prev => !prev);
                              addFrameworkLog("info", "SettingsManager", `Active Listening toggled: ${!activeListening ? "ENABLED" : "DISABLED"}`);
                            }}
                            className={`w-10 h-6 rounded-full p-1 transition-colors shrink-0 ${activeListening ? "bg-indigo-600" : "bg-slate-800"}`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${activeListening ? "translate-x-4" : "translate-x-0"}`} />
                          </button>
                        </div>

                        {/* Favorite Contact Selection */}
                        <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-850">
                          <label className="text-slate-400 block font-semibold mb-1.5 tracking-wide">Favorite Work Contact</label>
                          <input
                            type="text"
                            value={favoriteContact}
                            onChange={(e) => {
                              setFavoriteContact(e.target.value);
                            }}
                            onBlur={() => {
                              addFrameworkLog("info", "SettingsManager", `Favorite contact updated: "${favoriteContact}"`);
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500/50"
                          />
                        </div>

                        {/* Favorite Music Service Selection */}
                        <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-850">
                          <label className="text-slate-400 block font-semibold mb-1.5 tracking-wide">Primary Music Client</label>
                          <select
                            value={favoriteMusicService}
                            onChange={(e) => {
                              setFavoriteMusicService(e.target.value);
                              addFrameworkLog("info", "SettingsManager", `Preferred music provider set to: ${e.target.value}`);
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-indigo-500/50"
                          >
                            <option value="Spotify">Spotify</option>
                            <option value="YouTube Music">YouTube Music</option>
                            <option value="Apple Music">Apple Music</option>
                          </select>
                        </div>

                        {/* Clear Stored State */}
                        <button
                          type="button"
                          onClick={() => {
                            localStorage.clear();
                            setHumorMode(false);
                            setPreferredLanguage("auto");
                            setFavoriteContact("Rahul Sharma (Work)");
                            setFavoriteMusicService("Spotify");
                            addFrameworkLog("info", "SettingsManager", "Cleared all stored preferences. Reverting memory registry to default template.");
                          }}
                          className="w-full text-slate-400 hover:text-slate-300 border border-slate-800 hover:bg-slate-900 py-2 rounded-xl font-medium transition-all"
                        >
                          Reset Stored Memory Registry
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* SCREEN: Google Workspace Core */}
                  {activeScreen === "workspace" && (
                    <motion.div
                      key="workspace"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-1 flex flex-col bg-slate-950 p-2 overflow-hidden"
                    >
                      <div className="flex items-center space-x-2 mb-2 px-2 pt-2 shrink-0">
                        <button onClick={() => setActiveScreen("homescreen")} className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white">
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <HardDrive className="w-4 h-4 text-indigo-400" />
                        <h3 className="text-sm font-semibold text-slate-200 font-display">Google Workspace Core</h3>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <GoogleWorkspacePanel />
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>

                {/* Manual Safety Confirmation Gate Portal */}
                {pendingAction && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-x-0 bottom-14 top-0 bg-slate-950/95 z-50 flex flex-col justify-between p-5 text-xs border-t border-indigo-500/20"
                  >
                    <div className="my-auto space-y-4">
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400 animate-pulse">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      
                      <div className="space-y-1 text-center">
                        <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase font-mono block">
                          Safety-Gate Verification
                        </span>
                        <h4 className="text-sm font-semibold text-slate-100">
                          Authorize High-Impact Action
                        </h4>
                        <p className="text-[10px] text-slate-400 leading-normal max-w-[240px] mx-auto">
                          Jarvis has prepared an intent dispatch that requires explicit user confirmation to execute.
                        </p>
                      </div>

                      <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-850 text-left space-y-2 max-w-[260px] mx-auto w-full">
                        <div className="flex justify-between border-b border-slate-800/60 pb-1.5 text-[10px]">
                          <span className="text-slate-400 font-mono">INTENT ACTION</span>
                          <span className="text-amber-400 font-semibold uppercase font-mono">{pendingAction.intent}</span>
                        </div>
                        
                        {pendingAction.data?.recipient && (
                          <div className="flex justify-between border-b border-slate-800/60 pb-1.5 text-[10px]">
                            <span className="text-slate-400 font-mono">RECIPIENT</span>
                            <span className="text-slate-300 font-medium truncate max-w-[150px]">{pendingAction.data.recipient}</span>
                          </div>
                        )}

                        {pendingAction.data?.subject && (
                          <div className="flex justify-between border-b border-slate-800/60 pb-1.5 text-[10px]">
                            <span className="text-slate-400 font-mono">SUBJECT</span>
                            <span className="text-slate-200 font-medium truncate max-w-[150px]">{pendingAction.data.subject}</span>
                          </div>
                        )}

                        {pendingAction.data?.time && (
                          <div className="flex justify-between border-b border-slate-800/60 pb-1.5 text-[10px]">
                            <span className="text-slate-400 font-mono">TIME</span>
                            <span className="text-indigo-400 font-mono font-medium">{pendingAction.data.time}</span>
                          </div>
                        )}

                        {pendingAction.data?.body && (
                          <div className="text-[10px] text-slate-300 mt-1 leading-normal bg-slate-950/80 p-2 rounded-xl break-words max-h-[80px] overflow-y-auto">
                            {pendingAction.data.body}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 shrink-0 max-w-[260px] mx-auto w-full">
                      <button
                        onClick={approvePendingAction}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-amber-600/15 active:scale-[0.98] transition-all flex items-center justify-center space-x-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Authorize Action</span>
                      </button>
                      <button
                        onClick={declinePendingAction}
                        className="w-full bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-300 py-2 rounded-xl text-xs transition-all border border-slate-850"
                      >
                        Decline & Abort
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* SCREEN BOTTOM: Floating Assistant Console Drawer (Sits above the navigation pill) */}
              <div className="mt-auto relative z-30 select-none">
                
                {/* Simulated Assistant Overlay */}
                {deviceState.assistantOpen && (
                  <AnimatePresence>
                    {isOverlayMinimized ? (
                      /* MINIMIZED FLOATING ASSISTANT ORB */
                      <motion.div
                        key="assistant-minimized-orb"
                        initial={{ scale: 0.8, opacity: 0, y: 100 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 100 }}
                        onClick={() => {
                          setIsOverlayMinimized(false);
                          addFrameworkLog("info", "JarvisCore", "Expanded voice assistant overlay.");
                        }}
                        className="absolute bottom-16 right-5 w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 shadow-[0_4px_20px_rgba(99,102,241,0.5)] border border-indigo-400/30 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all z-50 group"
                        title="Expand Jarvis assistant"
                      >
                        {/* Audio pulse ripples inside the minimized orb */}
                        <span className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping group-hover:bg-indigo-500/30" />
                        <div className="flex items-center space-x-0.5 h-3">
                          <span className="w-0.5 bg-white rounded-full h-2 animate-pulse" />
                          <span className="w-0.5 bg-white rounded-full h-3 animate-pulse" style={{ animationDelay: "150ms" }} />
                          <span className="w-0.5 bg-white rounded-full h-1.5 animate-pulse" style={{ animationDelay: "300ms" }} />
                        </div>
                      </motion.div>
                    ) : (
                      /* EXPANDED RICH VOICE CONVERSATION SHEET */
                      <motion.div
                        key="assistant-expanded-sheet"
                        initial={{ y: 220, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 220, opacity: 0 }}
                        className="absolute bottom-0 inset-x-0 bg-slate-950/98 border-t border-indigo-500/20 backdrop-blur-md rounded-t-[28px] max-h-[350px] flex flex-col shadow-[0_-15px_30px_-5px_rgba(99,102,241,0.35)] z-40"
                      >
                        {/* Header bar / drag handle */}
                        <div className="flex justify-between items-center px-4 py-2 bg-slate-900/60 border-b border-slate-900/80 shrink-0 select-none">
                          <div className="flex items-center space-x-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse relative">
                              <span className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-75" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-300 tracking-wider uppercase font-display">
                              Jarvis Assistant Engine
                            </span>
                            <span className="text-[7px] bg-slate-800 border border-slate-700/60 px-1 py-0.2 rounded font-mono text-slate-400">
                              State: {simState}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            {/* Minimize Button */}
                            <button
                              onClick={() => {
                                setIsOverlayMinimized(true);
                                addFrameworkLog("info", "JarvisCore", "Minimized assistant session into floating orb standby.");
                              }}
                              className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800/60"
                              title="Minimize to Orb"
                            >
                              <Minimize2 className="w-3 h-3" />
                            </button>
                            {/* Dismiss/Close Button */}
                            <button
                              onClick={() => {
                                setDeviceState((prev) => ({ ...prev, assistantOpen: false }));
                                addFrameworkLog("info", "JarvisCore", "Assistant session dismissed by user.");
                              }}
                              className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800/60"
                              title="Dismiss assistant"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Scrolling conversation panel */}
                        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-none">
                          {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-8 space-y-2">
                              <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                <Sparkles className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
                              </div>
                              <span className="text-slate-200 block text-xs font-semibold">"Always-On Jarvis Core Standby"</span>
                              <span className="text-[9px] text-slate-400 leading-normal max-w-[210px]">
                                Ask to draft emails, log hydration cups, view your schedule, or play tunes.
                              </span>
                            </div>
                          ) : (
                            messages.map((m) => (
                              <div
                                key={m.id}
                                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                              >
                                <div
                                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 leading-relaxed ${
                                    m.role === "user"
                                      ? "bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/10"
                                      : "bg-slate-900 border border-slate-850 text-slate-100 rounded-bl-none"
                                  }`}
                                >
                                  <p className="text-[10px] whitespace-pre-wrap">{m.content}</p>
                                  {m.intent && m.intent !== "NONE" && (
                                    <div className="mt-1.5 pt-1.5 border-t border-slate-800/60 flex items-center space-x-1 text-[8px] text-indigo-300 uppercase font-mono font-bold select-none">
                                      <Sparkles className="w-2.5 h-2.5" />
                                      <span>Intent Dispatch: {m.intent}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          )}

                          {deviceState.isProcessing && (
                            <div className="flex justify-start">
                              <div className="bg-slate-900 border border-slate-850 text-slate-100 rounded-2xl rounded-bl-none px-3.5 py-2.5 flex items-center space-x-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                              </div>
                            </div>
                          )}

                          <div ref={chatEndRef} />
                        </div>

                        {/* REACTIVE SPEECH GRAPHICS & STATUS */}
                        <div className="px-4 py-2 border-t border-slate-900/80 bg-slate-950 shrink-0 select-none">
                          {/* Active State Waveform visualizer */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {/* Glowing state beacon */}
                              <div className="relative flex items-center justify-center">
                                <span className={`absolute w-3 h-3 rounded-full opacity-60 ${
                                  deviceState.isListening ? "bg-amber-500 animate-ping" :
                                  deviceState.isProcessing ? "bg-cyan-500 animate-spin" :
                                  simState === "SPEAKING" ? "bg-emerald-500 animate-ping" :
                                  "bg-indigo-500"
                                }`} />
                                <span className={`w-2 h-2 rounded-full ${
                                  deviceState.isListening ? "bg-amber-400" :
                                  deviceState.isProcessing ? "bg-cyan-400" :
                                  simState === "SPEAKING" ? "bg-emerald-400" :
                                  "bg-indigo-500"
                                }`} />
                              </div>
                              
                              <span className="text-[9px] font-semibold tracking-wider font-mono uppercase text-slate-300">
                                {deviceState.isListening ? "Porcupine STT listening..." :
                                 deviceState.isProcessing ? "Cortex reasoning..." :
                                 simState === "SPEAKING" ? "Jarvis speaking (TTS)..." :
                                 simState === "WAITING_FOR_FOLLOW_UP" ? "Awaiting follow-up..." :
                                 "Always-on wake ready"}
                              </span>
                            </div>

                            {/* Dynamic Waveform Lines */}
                            <div className="flex items-center space-x-0.5 h-4 pr-1">
                              {[1, 2, 3, 4, 5, 6, 7].map((bar) => {
                                let heightClass = "h-1";
                                let animClass = "";
                                if (deviceState.isListening) {
                                  heightClass = "h-3";
                                  animClass = "animate-pulse";
                                } else if (deviceState.isProcessing) {
                                  heightClass = "h-2.5";
                                  animClass = "animate-bounce";
                                } else if (simState === "SPEAKING") {
                                  heightClass = "h-3.5";
                                  animClass = "animate-pulse";
                                }
                                return (
                                  <span
                                    key={bar}
                                    className={`w-0.5 rounded-full transition-all duration-300 ${heightClass} ${animClass} ${
                                      deviceState.isListening ? "bg-amber-400" :
                                      deviceState.isProcessing ? "bg-cyan-400" :
                                      simState === "SPEAKING" ? "bg-emerald-400" :
                                      "bg-indigo-500"
                                    }`}
                                    style={{
                                      animationDelay: `${bar * 100}ms`
                                    }}
                                  />
                                );
                              })}
                            </div>
                          </div>

                          {/* Suggested Action Chips */}
                          <div className="mt-2.5 flex space-x-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
                            <button
                              onClick={() => handleSendMessage("What should I do next?")}
                              className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[8px] font-semibold text-slate-300 hover:text-white shrink-0 active:scale-95 transition-all"
                            >
                              "What's my schedule?"
                            </button>
                            <button
                              onClick={() => handleSendMessage("Draft a email to Sarah")}
                              className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[8px] font-semibold text-slate-300 hover:text-white shrink-0 active:scale-95 transition-all"
                            >
                              "Draft Gmail to Sarah"
                            </button>
                            <button
                              onClick={() => handleSendMessage("Add 250ml water")}
                              className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[8px] font-semibold text-slate-300 hover:text-white shrink-0 active:scale-95 transition-all"
                            >
                              "Log Water Cup"
                            </button>
                            <button
                              onClick={() => {
                                setJarvisTab("connectors");
                                addFrameworkLog("info", "ActivityManager", "Navigated to Connectors view.");
                              }}
                              className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[8px] font-semibold text-slate-300 hover:text-white shrink-0 active:scale-95 transition-all"
                            >
                              "Check connected APIs"
                            </button>
                          </div>
                        </div>

                        {/* Selected Attachments Preview Cards Row */}
                        {attachments && attachments.length > 0 && (
                          <div className="px-3 py-2 bg-slate-950/95 border-t border-slate-900 flex items-center space-x-2 overflow-x-auto shrink-0 select-none scrollbar-none">
                            {attachments.map((att, index) => {
                              const isImg = att.mimeType.startsWith("image/");
                              const isPdf = att.mimeType.includes("pdf");
                              const isAudio = att.mimeType.startsWith("audio/");
                              const isVideo = att.mimeType.startsWith("video/");

                              return (
                                <div
                                  key={index}
                                  className="group relative flex items-center space-x-2 bg-slate-900 border border-indigo-500/30 rounded-xl px-2.5 py-1.5 text-slate-200 shrink-0 shadow-md transition-all hover:border-indigo-400/60"
                                >
                                  {isImg ? (
                                    <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700 flex items-center justify-center">
                                      {att.previewUrl || att.data ? (
                                        <img
                                          src={att.previewUrl || `data:${att.mimeType};base64,${att.data}`}
                                          alt={att.name}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <Image className="w-3.5 h-3.5 text-purple-400" />
                                      )}
                                    </div>
                                  ) : (
                                    <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center border ${
                                      isPdf ? "bg-rose-950/50 border-rose-500/30 text-rose-400" :
                                      isAudio ? "bg-emerald-950/50 border-emerald-500/30 text-emerald-400" :
                                      isVideo ? "bg-amber-950/50 border-amber-500/30 text-amber-400" :
                                      "bg-blue-950/50 border-blue-500/30 text-blue-400"
                                    }`}>
                                      {isPdf ? <FileText className="w-3 h-3" /> :
                                       isAudio ? <Music className="w-3 h-3" /> :
                                       isVideo ? <Video className="w-3 h-3" /> :
                                       <FileText className="w-3 h-3" />}
                                    </div>
                                  )}

                                  <div className="flex flex-col min-w-[65px] max-w-[110px]">
                                    <span className="text-[9.5px] font-medium text-slate-100 truncate font-mono leading-tight">{att.name}</span>
                                    <span className="text-[8px] text-indigo-300/80 font-mono flex items-center space-x-1">
                                      <span>{att.mimeType.split("/")[1] || att.mimeType}</span>
                                      {att.size && <span>• {formatFileSize(att.size)}</span>}
                                    </span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== index))}
                                    className="w-4 h-4 rounded-full bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 transition-all flex items-center justify-center text-[9px] ml-1 shrink-0"
                                    title="Remove attachment"
                                  >
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Notice Banner for Speech Recognition Status */}
                        {voiceNotice && (
                          <div className="px-3 py-1.5 bg-amber-950/60 border-t border-amber-500/20 text-amber-300 text-[10px] flex items-center justify-between shrink-0">
                            <div className="flex items-center space-x-1.5">
                              <MicOff className="w-3 h-3 text-amber-400 shrink-0" />
                              <span>{voiceNotice}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setVoiceNotice(null)}
                              className="text-amber-400 hover:text-amber-200 text-[9px] font-bold uppercase ml-2"
                            >
                              Dismiss
                            </button>
                          </div>
                        )}

                        {/* Model Mode Selector & Live API Voice Launcher Bar */}
                        <div className="px-2.5 py-1.5 bg-slate-950/95 border-t border-slate-900 flex items-center justify-between shrink-0 overflow-x-auto scrollbar-none select-none">
                          <div className="flex items-center space-x-1">
                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider pr-1">Model:</span>
                            <button
                              type="button"
                              onClick={() => setAiModelMode("live")}
                              className={`px-2 py-0.5 rounded-full text-[8.5px] font-semibold transition-all flex items-center space-x-1 border ${
                                aiModelMode === "live"
                                  ? "bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-sm shadow-emerald-500/20"
                                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                              }`}
                              title="gemini-3.1-flash-live-preview (Live API Real-Time Voice)"
                            >
                              <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                              <span>Live API</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setAiModelMode("thinking")}
                              className={`px-2 py-0.5 rounded-full text-[8.5px] font-semibold transition-all flex items-center space-x-1 border ${
                                aiModelMode === "thinking"
                                  ? "bg-purple-950/80 border-purple-500/60 text-purple-300 shadow-sm shadow-purple-500/20"
                                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                              }`}
                              title="gemini-3.1-pro-preview (Thinking Level HIGH)"
                            >
                              <BrainCircuit className="w-2.5 h-2.5 text-purple-400" />
                              <span>Thinking</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setAiModelMode("search")}
                              className={`px-2 py-0.5 rounded-full text-[8.5px] font-semibold transition-all flex items-center space-x-1 border ${
                                aiModelMode === "search"
                                  ? "bg-blue-950/80 border-blue-500/60 text-blue-300 shadow-sm shadow-blue-500/20"
                                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                              }`}
                              title="gemini-3.6-flash (Google Search Grounding)"
                            >
                              <Search className="w-2.5 h-2.5 text-blue-400" />
                              <span>Search</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setAiModelMode("maps")}
                              className={`px-2 py-0.5 rounded-full text-[8.5px] font-semibold transition-all flex items-center space-x-1 border ${
                                aiModelMode === "maps"
                                  ? "bg-teal-950/80 border-teal-500/60 text-teal-300 shadow-sm shadow-teal-500/20"
                                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                              }`}
                              title="gemini-3.6-flash (Google Maps Grounding)"
                            >
                              <MapPin className="w-2.5 h-2.5 text-teal-400" />
                              <span>Maps</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setAiModelMode("vision")}
                              className={`px-2 py-0.5 rounded-full text-[8.5px] font-semibold transition-all flex items-center space-x-1 border ${
                                aiModelMode === "vision"
                                  ? "bg-fuchsia-950/80 border-fuchsia-500/60 text-fuchsia-300 shadow-sm shadow-fuchsia-500/20"
                                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                              }`}
                              title="gemini-3.1-pro-preview (Image Understanding)"
                            >
                              <Image className="w-2.5 h-2.5 text-fuchsia-400" />
                              <span>Vision</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setAiModelMode("fast")}
                              className={`px-2 py-0.5 rounded-full text-[8.5px] font-semibold transition-all flex items-center space-x-1 border ${
                                aiModelMode === "fast"
                                  ? "bg-amber-950/80 border-amber-500/60 text-amber-300 shadow-sm shadow-amber-500/20"
                                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                              }`}
                              title="gemini-3.1-flash-lite (Low Latency)"
                            >
                              <Zap className="w-2.5 h-2.5 text-amber-400" />
                              <span>Fast Lite</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={startLiveVoiceSession}
                            className="px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full text-[9px] font-bold flex items-center space-x-1 shadow-md shadow-emerald-900/30 active:scale-95 transition-all shrink-0 ml-1.5"
                            title="Start Real-Time Voice Conversation with gemini-3.1-flash-live-preview"
                          >
                            <PhoneCall className="w-3 h-3 animate-pulse" />
                            <span>Voice Call</span>
                          </button>
                        </div>

                        {/* Active Attachments Queue Preview Strip */}
                        {attachments.length > 0 && (
                          <div className="px-2.5 py-1.5 bg-slate-950/90 border-t border-slate-900 flex items-center space-x-1.5 overflow-x-auto shrink-0 scrollbar-none">
                            {attachments.map((att, idx) => (
                              <div
                                key={idx}
                                className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 rounded-full px-2.5 py-1 text-[8.5px] text-slate-200 shrink-0 shadow-sm"
                              >
                                {att.mimeType.startsWith("image/") ? (
                                  <Image className="w-3 h-3 text-indigo-400 shrink-0" />
                                ) : (
                                  <FileText className="w-3 h-3 text-indigo-400 shrink-0" />
                                )}
                                <span className="truncate max-w-[110px] font-medium">{att.name}</span>
                                {att.isUploading ? (
                                  <span className="text-[7.5px] text-amber-400 font-mono animate-pulse">Uploading...</span>
                                ) : att.storageUrl ? (
                                  <span className="text-[7.5px] text-emerald-400 font-mono font-bold" title={att.storageUrl}>
                                    ✓ Firebase Storage
                                  </span>
                                ) : null}
                                <button
                                  type="button"
                                  onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                                  className="text-slate-400 hover:text-rose-400 font-bold ml-1 text-[11px]"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Message composer input bar */}
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!inputVal.trim() && attachments.length === 0) return;
                            handleSendMessage(inputVal || `Analyzing attached files: ${attachments.map(a => a.name).join(", ")}`);
                          }}
                          className="p-2 border-t border-slate-900 bg-slate-950 flex items-center space-x-2 shrink-0 relative"
                        >
                          {/* "+" Attachment Button */}
                          <button
                            type="button"
                            onClick={() => setShowAttachmentSheet(true)}
                            className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-indigo-400 hover:border-indigo-500/40 hover:bg-indigo-950/30 transition-all shrink-0 flex items-center justify-center active:scale-95"
                            title="Add Attachment (Camera, Gallery, Documents, Video, Audio, Clipboard)"
                          >
                            <Plus className="w-4 h-4" />
                          </button>

                          <input
                            type="text"
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            placeholder={attachments.length > 0 ? "Send query with attached files..." : deviceState.isListening ? "Listening..." : "Message Jarvis..."}
                            disabled={deviceState.isListening || deviceState.isProcessing}
                            className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500/50 px-3.5 py-1.5 rounded-full text-[11px] text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                          />
                          
                          {/* Gemini 3.5 Flash Audio Transcription Microphone Button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (isRecordingAudioForTranscribe) {
                                stopAudioTranscriptionRecording();
                              } else {
                                startAudioTranscriptionRecording();
                              }
                            }}
                            disabled={isTranscribing}
                            className={`p-2 rounded-full transition-all shrink-0 border flex items-center justify-center ${
                              isRecordingAudioForTranscribe
                                ? "bg-rose-600 border-rose-400 text-white animate-pulse"
                                : isTranscribing
                                ? "bg-emerald-950 border-emerald-500/50 text-emerald-300"
                                : "bg-slate-900 border-slate-800 text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/40"
                            }`}
                            title={
                              isRecordingAudioForTranscribe
                                ? "Recording audio... Click to transcribe with gemini-3.6-flash"
                                : isTranscribing
                                ? "Transcribing audio using gemini-3.6-flash..."
                                : "Transcribe microphone audio using model gemini-3.6-flash"
                            }
                          >
                            <AudioWaveform className={`w-3.5 h-3.5 ${isRecordingAudioForTranscribe ? "animate-bounce" : isTranscribing ? "animate-spin" : ""}`} />
                          </button>

                          {/* Voice Input Trigger */}
                          <button
                            type="button"
                            onClick={toggleVoiceListening}
                            className={`p-2 rounded-full transition-all shrink-0 border flex items-center justify-center ${
                              deviceState.isListening
                                ? "bg-amber-600 border-amber-500 text-white hover:bg-amber-500"
                                : !speechSupported
                                ? "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400"
                                : "bg-slate-900 border-slate-800 text-indigo-400 hover:text-indigo-300"
                            }`}
                            title={speechSupported ? "Toggle Voice Recognition" : "Voice recognition is unavailable in this environment (Text fallback active)"}
                          >
                            {speechSupported ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            type="submit"
                            disabled={(!inputVal.trim() && attachments.length === 0) || deviceState.isProcessing}
                            className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white rounded-full transition-all flex items-center justify-center shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </form>

                        {/* Material 3 ChatGPT-Style Attachment Bottom Sheet Drawer */}
                        <AnimatePresence>
                          {showAttachmentSheet && (
                            <div className="absolute inset-0 z-50 flex items-end justify-center pointer-events-auto">
                              {/* Backdrop */}
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowAttachmentSheet(false)}
                                className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
                              />

                              {/* Material 3 Sheet Panel */}
                              <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                                className="relative w-full bg-slate-900 border-t border-slate-800 rounded-t-3xl shadow-2xl p-3.5 overflow-hidden z-10 max-h-[85%]"
                              >
                                {/* Drag handle indicator */}
                                <div className="w-9 h-1 bg-slate-700/60 rounded-full mx-auto mb-2.5" />

                                {/* Header */}
                                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-800/80 px-1">
                                  <div className="flex items-center space-x-2">
                                    <Paperclip className="w-4 h-4 text-indigo-400" />
                                    <h3 className="text-xs font-semibold text-slate-100 uppercase tracking-wider">Add Attachment</h3>
                                  </div>
                                  <button
                                    onClick={() => setShowAttachmentSheet(false)}
                                    className="p-1 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>

                                {/* 7 Option Tiles Grid */}
                                <div className="grid grid-cols-4 gap-2 mb-3">
                                  {/* Camera */}
                                  <button
                                    type="button"
                                    onClick={handleTriggerCamera}
                                    className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-950/70 border border-rose-500/20 hover:border-rose-500/50 hover:bg-rose-950/30 transition-all group"
                                  >
                                    <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                                      <Camera className="w-4 h-4" />
                                    </div>
                                    <span className="text-[9.5px] font-medium text-slate-200 leading-tight">Camera</span>
                                    <span className="text-[7.5px] text-slate-500">Capture</span>
                                  </button>

                                  {/* Gallery */}
                                  <button
                                    type="button"
                                    onClick={() => fileInputGalleryRef.current?.click()}
                                    className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-950/70 border border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-950/30 transition-all group"
                                  >
                                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                                      <Image className="w-4 h-4" />
                                    </div>
                                    <span className="text-[9.5px] font-medium text-slate-200 leading-tight">Gallery</span>
                                    <span className="text-[7.5px] text-slate-500">Photos</span>
                                  </button>

                                  {/* Documents */}
                                  <button
                                    type="button"
                                    onClick={() => fileInputDocsRef.current?.click()}
                                    className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-950/70 border border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-950/30 transition-all group"
                                  >
                                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                                      <FileText className="w-4 h-4" />
                                    </div>
                                    <span className="text-[9.5px] font-medium text-slate-200 leading-tight">Documents</span>
                                    <span className="text-[7.5px] text-slate-500">PDF, Docs</span>
                                  </button>

                                  {/* Videos */}
                                  <button
                                    type="button"
                                    onClick={() => fileInputVideoRef.current?.click()}
                                    className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-950/70 border border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-950/30 transition-all group"
                                  >
                                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                                      <Video className="w-4 h-4" />
                                    </div>
                                    <span className="text-[9.5px] font-medium text-slate-200 leading-tight">Videos</span>
                                    <span className="text-[7.5px] text-slate-500">MP4, MOV</span>
                                  </button>

                                  {/* Audio */}
                                  <button
                                    type="button"
                                    onClick={() => fileInputAudioRef.current?.click()}
                                    className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-950/70 border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-950/30 transition-all group"
                                  >
                                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                                      <Music className="w-4 h-4" />
                                    </div>
                                    <span className="text-[9.5px] font-medium text-slate-200 leading-tight">Audio</span>
                                    <span className="text-[7.5px] text-slate-500">Voice, MP3</span>
                                  </button>

                                  {/* Any File */}
                                  <button
                                    type="button"
                                    onClick={() => fileInputAnyRef.current?.click()}
                                    className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-950/70 border border-indigo-500/20 hover:border-indigo-500/50 hover:bg-indigo-950/30 transition-all group"
                                  >
                                    <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                                      <Folder className="w-4 h-4" />
                                    </div>
                                    <span className="text-[9.5px] font-medium text-slate-200 leading-tight">Any File</span>
                                    <span className="text-[7.5px] text-slate-500">Storage</span>
                                  </button>

                                  {/* Clipboard */}
                                  <button
                                    type="button"
                                    onClick={handleClipboardPaste}
                                    className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-950/70 border border-teal-500/20 hover:border-teal-500/50 hover:bg-teal-950/30 transition-all group"
                                  >
                                    <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                                      <Clipboard className="w-4 h-4" />
                                    </div>
                                    <span className="text-[9.5px] font-medium text-slate-200 leading-tight">Clipboard</span>
                                    <span className="text-[7.5px] text-slate-500">Paste</span>
                                  </button>
                                </div>

                                {/* Quick Sample Files Presets */}
                                <div className="pt-2 border-t border-slate-800/60">
                                  <span className="text-[8.5px] uppercase tracking-wider font-mono text-slate-400 block mb-1 px-1 font-semibold">
                                    Quick Sample Attachments
                                  </span>
                                  <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const pick = { name: "college_id.png", mimeType: "image/png", data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVOR5CYII=", size: 2048 };
                                        setAttachments((prev) => [...prev, pick]);
                                        addFrameworkLog("info", "AttachmentManager", "Attached sample College ID image.");
                                        setShowAttachmentSheet(false);
                                      }}
                                      className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-[8.5px] text-slate-300 shrink-0 flex items-center space-x-1"
                                    >
                                      <Image className="w-2.5 h-2.5 text-purple-400" />
                                      <span>College ID (PNG)</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const pick = { name: "aws_invoice.pdf", mimeType: "application/pdf", data: "JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDAKL1R5cGUgL1BhZ2VzCi9Db3VudCAxCi9LaWRzIFsgMyAwIFIgXQo+PgplbmRvYmoKMyAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDIgMCBSCi9NZWRpYUJveCBbIDAgMCA2MTIgNzg0IF0KPj4KZW5kb2JqCnhyZWYKMCA0CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDYyIDAwMDAwIG4gCjAwMDAwMDAxMzEgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA0Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgoyMTEKJSVFT0Y=", size: 14336 };
                                        setAttachments((prev) => [...prev, pick]);
                                        addFrameworkLog("info", "AttachmentManager", "Attached sample AWS Invoice PDF.");
                                        setShowAttachmentSheet(false);
                                      }}
                                      className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-[8.5px] text-slate-300 shrink-0 flex items-center space-x-1"
                                    >
                                      <FileText className="w-2.5 h-2.5 text-rose-400" />
                                      <span>AWS Invoice (PDF)</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const pick = { name: "server_log.csv", mimeType: "text/csv", data: "dGltZSxsZXZlbCxtZXNzYWdlCjIwMjYtMDctMTUsSU5GTyxTeXN0ZW0gc3RhcnRlZA==", size: 512 };
                                        setAttachments((prev) => [...prev, pick]);
                                        addFrameworkLog("info", "AttachmentManager", "Attached sample Server Log CSV.");
                                        setShowAttachmentSheet(false);
                                      }}
                                      className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-[8.5px] text-slate-300 shrink-0 flex items-center space-x-1"
                                    >
                                      <FileText className="w-2.5 h-2.5 text-blue-400" />
                                      <span>Server Logs (CSV)</span>
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            </div>
                          )}
                        </AnimatePresence>

                        {/* GEMINI API CONNECTION SETUP & DIAGNOSTICS MODAL */}
                        <AnimatePresence>
                          {showGeminiSetupModal && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/90 backdrop-blur-md">
                              <motion.div
                                initial={{ opacity: 0, scale: 0.92 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.92 }}
                                className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl space-y-3.5 text-slate-100 overflow-y-auto max-h-[90%]"
                              >
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                                  <div className="flex items-center space-x-2">
                                    <div className={`p-1.5 rounded-xl ${
                                      geminiStatus.connected ? "bg-emerald-950/80 border border-emerald-500/30 text-emerald-400" :
                                      geminiStatus.status === "QUOTA_EXCEEDED" ? "bg-amber-950/80 border border-amber-500/30 text-amber-400" :
                                      "bg-rose-950/80 border border-rose-500/30 text-rose-400"
                                    }`}>
                                      <KeyRound className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                      <h3 className="text-xs font-bold font-display text-slate-100">
                                        Gemini API Diagnostics
                                      </h3>
                                      <span className="text-[9px] text-slate-400 font-mono block">
                                        Model: {geminiStatus.model || "gemini-3.6-flash"} • {geminiStatus.lastChecked || "Just now"}
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => setShowGeminiSetupModal(false)}
                                    className="p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Status Banner */}
                                <div className={`p-3 rounded-2xl border flex flex-col space-y-1.5 text-left ${
                                  geminiStatus.connected
                                    ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-200"
                                    : geminiStatus.status === "QUOTA_EXCEEDED"
                                    ? "bg-amber-950/40 border-amber-500/30 text-amber-200"
                                    : geminiStatus.status === "TEMPORARY_SERVICE_ERROR"
                                    ? "bg-orange-950/40 border-orange-500/30 text-orange-200"
                                    : geminiStatus.status === "NETWORK_UNAVAILABLE"
                                    ? "bg-slate-950 border-slate-800 text-slate-300"
                                    : "bg-rose-950/40 border-rose-500/30 text-rose-200"
                                }`}>
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold font-mono uppercase tracking-wider">
                                      {geminiStatus.status.replace(/_/g, " ")}
                                    </span>
                                    <span className={`px-1.5 py-0.2 text-[8px] font-mono font-bold rounded-full border ${
                                      geminiStatus.connected ? "bg-emerald-950 text-emerald-300 border-emerald-500/40" : "bg-rose-950 text-rose-300 border-rose-500/40"
                                    }`}>
                                      {geminiStatus.connected ? "CONNECTED" : "ACTION REQUIRED"}
                                    </span>
                                  </div>

                                  <p className="text-[10.5px] font-medium leading-relaxed">
                                    {geminiStatus.message}
                                  </p>

                                  {geminiStatus.userAction && (
                                    <div className="pt-1.5 border-t border-white/10 flex items-start space-x-1.5 text-[9.5px]">
                                      <AlertCircle className="w-3 h-3 shrink-0 mt-0.5 text-amber-400" />
                                      <span className="text-slate-300">
                                        <strong className="text-amber-300 font-semibold">Recommended Fix: </strong>
                                        {geminiStatus.userAction}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-left">
                                  <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800">
                                    <span className="text-[8px] text-slate-500 block uppercase font-bold">API Key Loaded</span>
                                    <span className={geminiStatus.keyLoaded ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>
                                      {geminiStatus.keyLoaded ? `Yes (${geminiStatus.maskedKey || "Active"})` : "No (Missing)"}
                                    </span>
                                  </div>
                                  <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800">
                                    <span className="text-[8px] text-slate-500 block uppercase font-bold">Server Endpoint</span>
                                    <span className="text-indigo-300 font-semibold">/api/gemini/status</span>
                                  </div>
                                </div>

                                {/* Step-by-Step Setup Guide if key is missing/invalid */}
                                {(!geminiStatus.connected || geminiStatus.status === "MISSING_KEY" || geminiStatus.status === "INVALID_KEY") && (
                                  <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2 text-[10px] text-left">
                                    <h4 className="font-bold text-slate-200 flex items-center space-x-1">
                                      <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                                      <span>How to Setup GEMINI_API_KEY</span>
                                    </h4>
                                    <ol className="list-decimal list-inside space-y-1 text-slate-300 leading-normal">
                                      <li>
                                        Get a key from <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline inline-flex items-center"><span>AI Studio</span><ExternalLink className="w-2.5 h-2.5 ml-0.5" /></a>.
                                      </li>
                                      <li>
                                        Open the <strong>Secrets / Environment Variables</strong> panel in the platform Settings menu.
                                      </li>
                                      <li>
                                        Set variable key <code className="bg-slate-800 px-1 py-0.2 rounded text-indigo-300 font-mono">GEMINI_API_KEY</code>.
                                      </li>
                                      <li>
                                        Click <strong>Re-test Connection</strong> below.
                                      </li>
                                    </ol>
                                  </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex items-center space-x-2 pt-1">
                                  <button
                                    onClick={() => checkGeminiConnection(false)}
                                    disabled={geminiStatus.status === "CHECKING"}
                                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold rounded-xl text-[10.5px] flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all"
                                  >
                                    <RefreshCw className={`w-3 h-3 ${geminiStatus.status === "CHECKING" ? "animate-spin" : ""}`} />
                                    <span>{geminiStatus.status === "CHECKING" ? "Testing..." : "Re-test Connection"}</span>
                                  </button>

                                  <button
                                    onClick={() => setShowGeminiSetupModal(false)}
                                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold rounded-xl text-[10.5px] transition-all"
                                  >
                                    Close
                                  </button>
                                </div>
                              </motion.div>
                            </div>
                          )}
                        </AnimatePresence>

                        {/* Camera Viewfinder Modal */}
                        <AnimatePresence>
                          {showCameraModal && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md">
                              <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
                              >
                                <div className="p-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <Camera className="w-3.5 h-3.5 text-rose-400" />
                                    <span className="text-[11px] font-semibold text-slate-100">Jarvis Camera Viewfinder</span>
                                  </div>
                                  <button
                                    onClick={handleCloseCameraModal}
                                    className="p-1 rounded-full text-slate-400 hover:text-white"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                                  <video
                                    ref={videoPreviewRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 border border-white/20 rounded-xl pointer-events-none m-2" />
                                </div>

                                <div className="p-3 bg-slate-950 flex items-center justify-center space-x-3">
                                  <button
                                    type="button"
                                    onClick={handleCloseCameraModal}
                                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-full text-[10px] font-medium border border-slate-800"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleCapturePhotoFromCamera}
                                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full text-[10px] font-semibold shadow-lg flex items-center space-x-1 active:scale-95 transition-all"
                                  >
                                    <Camera className="w-3.5 h-3.5" />
                                    <span>Snap Photo</span>
                                  </button>
                                </div>
                              </motion.div>
                            </div>
                          )}
                        </AnimatePresence>

                        {/* Live API Voice Conversation Overlay Modal */}
                        <AnimatePresence>
                          {showLiveVoiceCallModal && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/95 backdrop-blur-xl">
                              <motion.div
                                initial={{ scale: 0.85, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.85, opacity: 0 }}
                                className="w-full max-w-sm bg-slate-900/90 border border-emerald-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.25)] flex flex-col relative"
                              >
                                {/* Header bar */}
                                <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse relative">
                                      <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                                    </div>
                                    <span className="text-[11px] font-bold text-emerald-300 font-mono">
                                      gemini-3.1-flash-live-preview
                                    </span>
                                  </div>
                                  <button
                                    onClick={endLiveVoiceSession}
                                    className="p-1 rounded-full text-slate-400 hover:text-white bg-slate-800/60"
                                    title="Close Live Voice Call"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Main Orb & Voice Animation Container */}
                                <div className="p-6 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
                                  {/* Concentric Pulsing Audio Waves */}
                                  <div className="relative flex items-center justify-center my-4">
                                    <div className={`absolute w-36 h-36 rounded-full border transition-all duration-700 ${
                                      liveModelSpeaking ? "border-emerald-400/40 animate-ping" : "border-indigo-500/20"
                                    }`} />
                                    <div className={`absolute w-28 h-28 rounded-full border transition-all duration-500 ${
                                      liveModelSpeaking ? "border-teal-400/50 animate-pulse" : "border-indigo-500/30"
                                    }`} />
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 relative z-10 ${
                                      liveModelSpeaking
                                        ? "bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/50 scale-110"
                                        : "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-indigo-500/40"
                                    }`}>
                                      {liveModelSpeaking ? (
                                        <Volume2 className="w-9 h-9 animate-bounce" />
                                      ) : (
                                        <Mic className="w-9 h-9 animate-pulse" />
                                      )}
                                    </div>
                                  </div>

                                  <div className="space-y-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block font-mono">
                                      {liveModelSpeaking ? "Jarvis Speaking..." : isLiveVoiceListening ? "Listening to your voice..." : "Voice Stream Ready"}
                                    </span>
                                    <p className="text-[9px] text-slate-400 max-w-[220px]">
                                      Real-time bidirectional conversation powered by Live API model.
                                    </p>
                                  </div>

                                  {/* Live Transcript Box */}
                                  <div className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 min-h-[60px] max-h-[100px] overflow-y-auto text-left flex flex-col justify-between">
                                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Live Transcript Buffer:</span>
                                    <p className="text-[10.5px] text-slate-200 font-mono italic">
                                      {liveTranscript || (liveModelSpeaking ? "Processing audio synthesis..." : "Speak now... transcript will stream here in real-time.")}
                                    </p>
                                    {liveTranscript && (
                                      <button
                                        onClick={() => handleSendLiveVoiceQuery(liveTranscript)}
                                        className="mt-2 self-end px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-bold rounded-lg flex items-center space-x-1 shadow-md"
                                      >
                                        <Send className="w-2.5 h-2.5" />
                                        <span>Send Voice Query</span>
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Controls Bar */}
                                <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-around">
                                  <button
                                    onClick={() => setLiveVoiceMuted(!liveVoiceMuted)}
                                    className={`p-2.5 rounded-full transition-all border ${
                                      liveVoiceMuted
                                        ? "bg-rose-950/60 border-rose-500/40 text-rose-400"
                                        : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
                                    }`}
                                    title={liveVoiceMuted ? "Unmute Audio Output" : "Mute Audio Output"}
                                  >
                                    {liveVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                  </button>

                                  <button
                                    onClick={() => {
                                      if (isLiveVoiceListening) {
                                        setIsLiveVoiceListening(false);
                                        if (liveRecognitionRef.current) try { liveRecognitionRef.current.stop(); } catch(e){}
                                      } else {
                                        startLiveVoiceSession();
                                      }
                                    }}
                                    className={`p-3 rounded-full transition-all border shadow-lg ${
                                      isLiveVoiceListening
                                        ? "bg-emerald-600 border-emerald-400 text-white animate-pulse"
                                        : "bg-slate-800 border-slate-700 text-slate-300"
                                    }`}
                                    title={isLiveVoiceListening ? "Pause Mic Listening" : "Start Mic Listening"}
                                  >
                                    {isLiveVoiceListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                                  </button>

                                  <button
                                    onClick={endLiveVoiceSession}
                                    className="p-2.5 rounded-full bg-rose-600 hover:bg-rose-500 border border-rose-400 text-white transition-all shadow-md active:scale-95"
                                    title="End Voice Call"
                                  >
                                    <PhoneOff className="w-4 h-4" />
                                  </button>
                                </div>
                              </motion.div>
                            </div>
                          )}
                        </AnimatePresence>

                        {/* Hidden Storage Access Framework File Inputs */}
                        <input
                          ref={fileInputGalleryRef}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleFilesSelected(e.target.files)}
                        />
                        <input
                          ref={fileInputDocsRef}
                          type="file"
                          accept=".pdf,.docx,.doc,.txt,.pptx,.xlsx,.csv,.md,.zip,.json,.xml,application/pdf,text/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleFilesSelected(e.target.files)}
                        />
                        <input
                          ref={fileInputVideoRef}
                          type="file"
                          accept="video/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleFilesSelected(e.target.files)}
                        />
                        <input
                          ref={fileInputAudioRef}
                          type="file"
                          accept="audio/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleFilesSelected(e.target.files)}
                        />
                        <input
                          ref={fileInputAnyRef}
                          type="file"
                          accept="*/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleFilesSelected(e.target.files)}
                        />
                        <input
                          ref={fileInputCameraRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) => handleFilesSelected(e.target.files)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {/* Simulated Android Navigation Drawer Pill (Standard Bottom Rail) */}
                <div className="h-16 bg-slate-950/90 border-t border-slate-900 backdrop-blur-md px-6 flex items-center justify-between shrink-0 relative">
                  
                  {/* Left Side: Settings/System Switch & Quick Add (+) Button */}
                  <div className="flex flex-col items-center justify-center space-y-0.5">
                    <button
                      onClick={() => {
                        setDeviceState((prev) => ({
                          ...prev,
                          assistantOpen: !prev.assistantOpen
                        }));
                        addFrameworkLog("info", "JarvisCore", `Toggle assistant panel: ${!deviceState.assistantOpen}`);
                      }}
                      className={`flex items-center space-x-1 px-1.5 py-0.5 rounded-lg transition-all ${
                        deviceState.assistantOpen
                          ? "text-indigo-400 bg-indigo-950/20"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                      title="Toggle Jarvis Assistant Panel"
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span className="text-[8.5px] font-semibold uppercase">Assist</span>
                    </button>

                    {/* '+' button placed below the assist icon */}
                    <button
                      type="button"
                      onClick={() => setShowAttachmentSheet(true)}
                      className="w-5 h-5 rounded-full bg-slate-900 hover:bg-indigo-950/50 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-300 transition-all flex items-center justify-center active:scale-95 shadow-sm"
                      title="Add Attachment (+)"
                    >
                      <Plus className="w-3 h-3 text-indigo-400" />
                    </button>
                  </div>

                  {/* Center Mic Activation Orb */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-3.5">
                    <button
                      onClick={toggleVoiceListening}
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                        deviceState.isListening
                          ? "bg-indigo-500 text-white ring-8 ring-indigo-500/20 scale-105 animate-pulse-ring"
                          : "bg-gradient-to-tr from-slate-900 to-indigo-950 text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 active:scale-95 shadow-lg"
                      }`}
                      title={deviceState.isListening ? "Stop listening" : "Say 'Hey Jarvis' or click to speak"}
                    >
                      {deviceState.isListening ? (
                        <Mic className="w-5 h-5 animate-bounce" />
                      ) : (
                        <Mic className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Right Side: Back/Home trigger */}
                  <button
                    onClick={() => {
                      setActiveScreen("homescreen");
                      addFrameworkLog("info", "ActivityManager", "Returning to home screen activity");
                    }}
                    className="text-slate-400 hover:text-slate-200 flex flex-col items-center p-1.5 rounded-lg"
                  >
                    <div className="w-4.5 h-4.5 rounded-full border-2 border-slate-400" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Side: Log Feed, Spec & Core Architecture Docs (8 Cols) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden min-h-[500px]">
          
          {/* Tabs header */}
          <div className="bg-slate-900/80 px-6 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("logs")}
                className={`px-4 py-1.5 rounded-xl font-medium text-xs tracking-tight transition-all flex items-center space-x-2 ${
                  activeTab === "logs"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Android System Console Logs</span>
              </button>
              <button
                onClick={() => setActiveTab("architecture")}
                className={`px-4 py-1.5 rounded-xl font-medium text-xs tracking-tight transition-all flex items-center space-x-2 ${
                  activeTab === "architecture"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Product Blueprints</span>
              </button>
            </div>

            {activeTab === "logs" && (
              <button
                onClick={clearLogs}
                className="text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 p-1.5 rounded-lg border border-slate-800 flex items-center space-x-1"
                title="Clear terminal log feed"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Console</span>
              </button>
            )}
          </div>

          {/* Tab contents viewport */}
          <div className="flex-1 overflow-hidden p-6 relative flex flex-col">
            
            {/* TAB: Logs Feed */}
            {activeTab === "logs" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800/60 p-4 font-mono text-[11px] leading-relaxed overflow-y-auto shadow-inner flex flex-col">
                  <div className="text-slate-500 pb-2 mb-2 border-b border-slate-900 flex justify-between items-center select-none text-[10px]">
                    <span>SYSTEM SHELL: com.android.jarvis / terminal_v1.0.3</span>
                    <span className="text-emerald-500 font-semibold flex items-center space-x-1">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                      <span>ONLINE</span>
                    </span>
                  </div>

                  <div className="flex-1 space-y-2.5 overflow-y-auto">
                    {logs.map((log) => {
                      let tagColor = "text-indigo-400";
                      let logClass = "text-slate-300";
                      if (log.type === "intent") {
                        tagColor = "text-amber-400 font-semibold";
                        logClass = "text-amber-200/90";
                      } else if (log.type === "perm") {
                        tagColor = "text-sky-400";
                        logClass = "text-sky-200";
                      } else if (log.type === "power") {
                        tagColor = "text-rose-400";
                        logClass = "text-rose-200";
                      } else if (log.type === "error") {
                        tagColor = "text-red-400 font-bold";
                        logClass = "text-red-300";
                      } else if (log.type === "broadcast") {
                        tagColor = "text-teal-400";
                        logClass = "text-teal-200";
                      }

                      return (
                        <div key={log.id} className="hover:bg-slate-900/30 p-1 rounded transition-colors group">
                          <div className="flex flex-wrap items-baseline text-[10.5px]">
                            <span className="text-slate-500 font-normal select-none mr-2">{log.timestamp}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[8.5px] uppercase font-bold mr-2 tracking-wide font-sans shrink-0 select-none ${
                              log.type === "intent"
                                ? "bg-amber-950/55 text-amber-300 border border-amber-800/20"
                                : log.type === "power"
                                ? "bg-rose-950/55 text-rose-300 border border-rose-800/20"
                                : log.type === "perm"
                                ? "bg-sky-950/55 text-sky-300 border border-sky-800/20"
                                : log.type === "error"
                                ? "bg-red-950/55 text-red-300 border border-red-800/20"
                                : log.type === "broadcast"
                                ? "bg-teal-950/55 text-teal-300 border border-teal-800/20"
                                : "bg-indigo-950/55 text-indigo-300 border border-indigo-800/20"
                            }`}>
                              {log.type}
                            </span>
                            <span className={`font-semibold mr-1.5 ${tagColor}`}>[{log.tag}]</span>
                            <span className={logClass}>{log.message}</span>
                          </div>
                          {log.details && (
                            <div className="pl-24 text-[10px] text-slate-400/80 mt-0.5 border-l-2 border-slate-800 font-sans leading-normal">
                              {log.details}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div ref={logsEndRef} />
                  </div>
                </div>

                {/* Preconfigured prompt simulation board */}
                <div className="mt-4 bg-slate-900/30 border border-slate-800/60 p-4 rounded-2xl select-none">
                  <h4 className="text-xs font-semibold text-slate-300 mb-3 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                    <span>Quick Interactive Demos (Fires actual Intents to device)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                    {DEMO_PROMPTS.map((dp, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickTrigger(dp.prompt)}
                        className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-950 hover:border-indigo-500/30 transition-all text-left flex flex-col justify-between group active:scale-[0.98]"
                      >
                        <span className="font-semibold text-slate-200 text-xs flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full group-hover:scale-125 transition-transform" />
                          <span>{dp.label}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          "{dp.prompt}"
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Architecture Document */}
            {activeTab === "architecture" && (
              <div className="flex-1 overflow-y-auto bg-slate-950 rounded-2xl border border-slate-800/60 p-6 shadow-inner space-y-6 flex flex-col">
                
                {/* Sub tab toggles */}
                <div className="flex space-x-2 border-b border-slate-900 pb-3 shrink-0 flex-wrap gap-y-2">
                  <button
                    onClick={() => setArchitectureSubTab("part1")}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all ${
                      architectureSubTab === "part1"
                        ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                        : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    Part 1: Identity & Vision
                  </button>
                  <button
                    onClick={() => setArchitectureSubTab("part2")}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all ${
                      architectureSubTab === "part2"
                        ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                        : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    Part 2: Personality & Trust
                  </button>
                  <button
                    onClick={() => setArchitectureSubTab("part3")}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all ${
                      architectureSubTab === "part3"
                        ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                        : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    Part 3: Clean Architecture
                  </button>
                  <button
                    onClick={() => setArchitectureSubTab("part4")}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all ${
                      architectureSubTab === "part4"
                        ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                        : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    Part 4: Voice & Lifecycle
                  </button>
                  <button
                    onClick={() => setArchitectureSubTab("part5")}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all ${
                      architectureSubTab === "part5"
                        ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                        : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    Part 5: Brain & Multilingual
                  </button>
                  <button
                    onClick={() => setArchitectureSubTab("part6")}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all ${
                      architectureSubTab === "part6"
                        ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                        : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    Part 6: UI & Dashboard
                  </button>
                  <button
                    onClick={() => setArchitectureSubTab("part7")}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all ${
                      architectureSubTab === "part7"
                        ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                        : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    Part 7: Command Engine
                  </button>
                  <button
                    onClick={() => setArchitectureSubTab("part8")}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all ${
                      architectureSubTab === "part8"
                        ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                        : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    Part 8: AI Brain & Memory
                  </button>
                  <button
                    onClick={() => setArchitectureSubTab("part9")}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all ${
                      architectureSubTab === "part9"
                        ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                        : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    Part 9: Automation Engine
                  </button>
                  <button
                    onClick={() => setArchitectureSubTab("part10")}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all ${
                      architectureSubTab === "part10"
                        ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                        : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    Part 10: Premium Layer
                  </button>
                  <button
                    onClick={() => setArchitectureSubTab("part11")}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all ${
                      architectureSubTab === "part11"
                        ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                        : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    Part 11: Security & Sync
                  </button>
                  <button
                    onClick={() => setArchitectureSubTab("part12")}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all ${
                      architectureSubTab === "part12"
                        ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                        : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    Part 12: Vision & Agents
                  </button>
                  <button
                    onClick={() => setArchitectureSubTab("part13")}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all ${
                      architectureSubTab === "part13"
                        ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                        : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    Part 13: Master Integration
                  </button>
                  <button
                    onClick={() => setArchitectureSubTab("part14")}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all ${
                      architectureSubTab === "part14"
                        ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                        : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    Part 14: Self-Review & QA
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-6 pr-1">
                  {/* Header branding */}
                  <div className="border-b border-slate-900 pb-4">
                    <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase font-mono block mb-1">
                      ENGINEERING BLUEPRINT
                    </span>
                    <h3 className="text-xl font-display font-bold text-white tracking-tight">
                      {architectureSubTab === "part1"
                        ? JARVIS_SPEC_PART_1.title
                        : architectureSubTab === "part2"
                        ? JARVIS_SPEC_PART_2.title
                        : architectureSubTab === "part3"
                        ? JARVIS_SPEC_PART_3.title
                        : architectureSubTab === "part4"
                        ? JARVIS_SPEC_PART_4.title
                        : architectureSubTab === "part5"
                        ? JARVIS_SPEC_PART_5.title
                        : architectureSubTab === "part6"
                        ? JARVIS_SPEC_PART_6.title
                        : architectureSubTab === "part7"
                        ? JARVIS_SPEC_PART_7.title
                        : architectureSubTab === "part8"
                        ? JARVIS_SPEC_PART_8.title
                        : architectureSubTab === "part9"
                        ? JARVIS_SPEC_PART_9.title
                        : architectureSubTab === "part10"
                        ? JARVIS_SPEC_PART_10.title
                        : architectureSubTab === "part11"
                        ? JARVIS_SPEC_PART_11.title
                        : architectureSubTab === "part12"
                        ? JARVIS_SPEC_PART_12.title
                        : architectureSubTab === "part13"
                        ? JARVIS_SPEC_PART_13.title
                        : JARVIS_SPEC_PART_14.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {architectureSubTab === "part1"
                        ? JARVIS_SPEC_PART_1.subtitle
                        : architectureSubTab === "part2"
                        ? JARVIS_SPEC_PART_2.subtitle
                        : architectureSubTab === "part3"
                        ? JARVIS_SPEC_PART_3.subtitle
                        : architectureSubTab === "part4"
                        ? JARVIS_SPEC_PART_4.subtitle
                        : architectureSubTab === "part5"
                        ? JARVIS_SPEC_PART_5.subtitle
                        : architectureSubTab === "part6"
                        ? JARVIS_SPEC_PART_6.subtitle
                        : architectureSubTab === "part7"
                        ? JARVIS_SPEC_PART_7.subtitle
                        : architectureSubTab === "part8"
                        ? JARVIS_SPEC_PART_8.subtitle
                        : architectureSubTab === "part9"
                        ? JARVIS_SPEC_PART_9.subtitle
                        : architectureSubTab === "part10"
                        ? JARVIS_SPEC_PART_10.subtitle
                        : architectureSubTab === "part11"
                        ? JARVIS_SPEC_PART_11.subtitle
                        : architectureSubTab === "part12"
                        ? JARVIS_SPEC_PART_12.subtitle
                        : architectureSubTab === "part13"
                        ? JARVIS_SPEC_PART_13.subtitle
                        : JARVIS_SPEC_PART_14.subtitle}
                    </p>
                  </div>

                  {/* Document Body blocks */}
                  <div className="space-y-6">
                    {(architectureSubTab === "part1"
                      ? JARVIS_SPEC_PART_1
                      : architectureSubTab === "part2"
                      ? JARVIS_SPEC_PART_2
                      : architectureSubTab === "part3"
                      ? JARVIS_SPEC_PART_3
                      : architectureSubTab === "part4"
                      ? JARVIS_SPEC_PART_4
                      : architectureSubTab === "part5"
                      ? JARVIS_SPEC_PART_5
                      : architectureSubTab === "part6"
                      ? JARVIS_SPEC_PART_6
                      : architectureSubTab === "part7"
                      ? JARVIS_SPEC_PART_7
                      : architectureSubTab === "part8"
                      ? JARVIS_SPEC_PART_8
                      : architectureSubTab === "part9"
                      ? JARVIS_SPEC_PART_9
                      : architectureSubTab === "part10"
                      ? JARVIS_SPEC_PART_10
                      : architectureSubTab === "part11"
                      ? JARVIS_SPEC_PART_11
                      : architectureSubTab === "part12"
                      ? JARVIS_SPEC_PART_12
                      : architectureSubTab === "part13"
                      ? JARVIS_SPEC_PART_13
                      : JARVIS_SPEC_PART_14
                    ).sections.map((sec, idx) => (
                      <div key={idx} className="space-y-2">
                        <h4 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider font-display flex items-center space-x-1.5">
                          <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{sec.heading}</span>
                        </h4>
                        {sec.content.map((p, pIdx) => (
                          <p key={pIdx} className="text-slate-300 text-xs leading-relaxed pl-5 font-sans">
                            {p}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Interactive Kotlin Module Code Explorer (rendered when Part 3, 4, 5, 8, 9, 10, 11 or 12 is active) */}
                  {(architectureSubTab === "part3" || architectureSubTab === "part4" || architectureSubTab === "part5" || architectureSubTab === "part8" || architectureSubTab === "part9" || architectureSubTab === "part10" || architectureSubTab === "part11" || architectureSubTab === "part12" || architectureSubTab === "part13" || architectureSubTab === "part14") && (
                    <div className="mt-8 pt-6 border-t border-slate-900/80 space-y-4">
                      <div>
                        <span className="text-[10px] font-bold text-teal-400 tracking-wider uppercase font-mono block mb-1">
                          BUILD SYSTEM CODEBLUEPRINTS
                        </span>
                        <h4 className="text-sm font-semibold text-slate-100 font-display">
                          Kotlin Clean Architecture Explorer
                        </h4>
                        <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                          Click below to examine the production Kotlin modules, DI provider configurations, foreground audio recorders, and ViewModels.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        {/* File Selector */}
                        <div className="lg:col-span-5 flex flex-col space-y-1.5 bg-slate-900/30 p-2.5 rounded-2xl border border-slate-900 max-h-[300px] overflow-y-auto">
                          <div className="text-[9px] font-bold text-slate-500 px-2.5 py-1 tracking-wider uppercase font-mono mb-1">
                            MODULE SOURCES (com.jarvis.*)
                          </div>
                          {KOTLIN_PROJECT_BLUEPRINT.map((file, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedKotlinFile(idx)}
                              className={`w-full text-left px-3 py-2 rounded-xl transition-all flex flex-col space-y-0.5 border ${
                                selectedKotlinFile === idx
                                  ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-200"
                                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                              }`}
                            >
                              <span className="text-[10px] font-mono font-semibold truncate flex items-center space-x-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${selectedKotlinFile === idx ? "bg-indigo-400" : "bg-slate-700"}`} />
                                <span>{file.path.split("/").pop()}</span>
                              </span>
                              <span className="text-[9px] text-slate-500 pl-3 truncate">
                                {file.layer}
                              </span>
                            </button>
                          ))}
                        </div>

                        {/* Code Box */}
                        <div className="lg:col-span-7 flex flex-col bg-slate-950 rounded-2xl border border-slate-900 overflow-hidden h-[300px]">
                          <div className="flex items-center justify-between px-3 py-2 bg-slate-900/40 border-b border-slate-900 text-[10px] shrink-0">
                            <div className="flex items-center space-x-1.5 font-mono text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                              <span className="truncate max-w-[180px] lg:max-w-none text-[9px] text-slate-400">
                                {KOTLIN_PROJECT_BLUEPRINT[selectedKotlinFile].path}
                              </span>
                            </div>
                            <span className="font-mono text-[9px] text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-505/5 border border-indigo-500/10 shrink-0">
                              KOTLIN
                            </span>
                          </div>
                          <div className="flex-1 overflow-auto p-3.5 font-mono text-[9px] text-slate-300 leading-relaxed bg-slate-950/60 scrollbar-thin select-all">
                            <pre className="whitespace-pre">{KOTLIN_PROJECT_BLUEPRINT[selectedKotlinFile].code}</pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Interactive State Machine Simulator for Part 4 */}
                  {architectureSubTab === "part4" && (
                    <div className="mt-8 pt-6 border-t border-slate-900/80 space-y-5">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase font-mono block mb-1">
                          LIFECYCLE SIMULATOR
                        </span>
                        <h4 className="text-sm font-semibold text-slate-100 font-display">
                          Assistant State Machine & Voice Activation Simulator
                        </h4>
                        <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                          Experience the full lifecycle of Jarvis voice activation. Interact with the states or trigger "Hey Jarvis" to witness real-time transitions, power optimizations, and system overlays.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                        {/* Interactive States Loop */}
                        <div className="xl:col-span-7 flex flex-col space-y-3">
                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                            ACTIVE SYSTEM STATE PIPELINE
                          </span>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {[
                              { id: "DISABLED", label: "Disabled", desc: "Service dormant, zero CPU usage.", color: "border-rose-900/30 text-rose-500", activeBg: "bg-rose-500/10 border-rose-500 text-rose-200" },
                              { id: "INITIALIZING", label: "Initializing", desc: "Loading acoustic model.", color: "border-sky-900/30 text-sky-500", activeBg: "bg-sky-500/10 border-sky-500 text-sky-200" },
                              { id: "WAKE_LISTENING", label: "Wake Listening", desc: "Low-power VAD active.", color: "border-emerald-900/30 text-emerald-500", activeBg: "bg-emerald-500/10 border-emerald-500 text-emerald-200" },
                              { id: "WAKE_DETECTED", label: "Wake Detected", desc: "Hey Jarvis recognized.", color: "border-violet-900/30 text-violet-500", activeBg: "bg-violet-500/10 border-violet-500 text-violet-200" },
                              { id: "OVERLAY_OPENING", label: "Overlay Opening", desc: "System overlay inflated.", color: "border-purple-900/30 text-purple-500", activeBg: "bg-purple-500/10 border-purple-500 text-purple-200" },
                              { id: "COMMAND_LISTENING", label: "Command Listening", desc: "Continuous STT stream.", color: "border-amber-900/30 text-amber-500", activeBg: "bg-amber-500/10 border-amber-500 text-amber-200" },
                              { id: "PROCESSING", label: "Processing", desc: "Consulting Gemini AI.", color: "border-cyan-900/30 text-cyan-500", activeBg: "bg-cyan-500/10 border-cyan-500 text-cyan-200" },
                              { id: "SPEAKING", label: "Speaking", desc: "Vocalizing response.", color: "border-pink-900/30 text-pink-500", activeBg: "bg-pink-500/10 border-pink-500 text-pink-200" },
                              { id: "WAITING_FOR_FOLLOW_UP", label: "Waiting Followup", desc: "Listening for followups.", color: "border-indigo-900/30 text-indigo-500", activeBg: "bg-indigo-500/10 border-indigo-500 text-indigo-200" },
                              { id: "RETURNING_TO_STANDBY", label: "Standby Return", desc: "Releasing resources.", color: "border-yellow-900/30 text-yellow-500", activeBg: "bg-yellow-500/10 border-yellow-500 text-yellow-200" },
                              { id: "ERROR", label: "Error", desc: "Hardware conflict/failure.", color: "border-red-900/30 text-red-500", activeBg: "bg-red-500/10 border-red-500 text-red-200" },
                              { id: "PAUSED", label: "Paused", desc: "Service temporarily on hold.", color: "border-orange-900/30 text-orange-500", activeBg: "bg-orange-500/10 border-orange-500 text-orange-200" }
                            ].map((st) => {
                              const isActive = simState === st.id;
                              return (
                                <button
                                  key={st.id}
                                  onClick={() => {
                                    setSimState(st.id as any);
                                    setFollowUpTimer(0);
                                    if (st.id === "WAKE_LISTENING") setSimFeedback("Awaiting local 'Hey Jarvis' voice trigger.");
                                    else if (st.id === "DISABLED") setSimFeedback("Always-On voice engine deactivated. Microphones fully released.");
                                    else if (st.id === "PAUSED") setSimFeedback("Wake-word classification temporarily paused.");
                                    else if (st.id === "ERROR") setSimFeedback("Simulated microphone resource contention error. Yielding audio record stream.");
                                    else setSimFeedback(`Manually transitioned to system state: ${st.id}.`);
                                  }}
                                  className={`p-2 rounded-xl text-left border text-[10px] transition-all duration-300 relative overflow-hidden select-none active:scale-[0.98] ${
                                    isActive
                                      ? `${st.activeBg} shadow-[0_0_15px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/30`
                                      : `${st.color} bg-slate-900/20 hover:bg-slate-900/40 hover:border-slate-800`
                                  }`}
                                >
                                  {isActive && (
                                    <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                    </span>
                                  )}
                                  <span className="font-bold block mb-0.5 truncate">{st.label}</span>
                                  <span className="text-[8px] text-slate-500 leading-tight block line-clamp-2">{st.desc}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Controls & Configuration */}
                        <div className="xl:col-span-5 flex flex-col space-y-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-900">
                          <div>
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                              SIMULATION TRIGGERS
                            </span>
                            
                            <div className="mt-2 space-y-2">
                              {/* Wake Trigger button */}
                              <button
                                onClick={simulateWakeWordDetected}
                                disabled={simState === "DISABLED" || simState === "PAUSED"}
                                className={`w-full py-2.5 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center space-x-2 shadow-sm ${
                                  simState === "DISABLED" || simState === "PAUSED"
                                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-500 text-white active:scale-[0.98]"
                                }`}
                              >
                                <Mic className="w-3.5 h-3.5" />
                                <span>Say: "Hey Jarvis" 🗣️</span>
                              </button>

                              {/* Spoken command presets */}
                              <div className="space-y-1 pt-1.5">
                                <span className="text-[9px] font-mono text-slate-500 block">
                                  COMMAND INCOMING BUFFER
                                </span>
                                <div className="grid grid-cols-1 gap-1">
                                  {[
                                    "Set meeting tomorrow at 2 PM",
                                    "Open Gmail draft to Sarah",
                                    "Play some relax music"
                                  ].map((phrase, pIdx) => {
                                    const disabled = simState !== "COMMAND_LISTENING" && simState !== "WAITING_FOR_FOLLOW_UP";
                                    return (
                                      <button
                                        key={pIdx}
                                        disabled={disabled}
                                        onClick={() => {
                                          setActiveSpeechText(phrase);
                                          simulateSendCommand(phrase);
                                        }}
                                        className={`w-full text-left p-1.5 px-2.5 rounded-lg border text-[9px] transition-all truncate font-mono ${
                                          disabled
                                            ? "border-slate-900/40 text-slate-600 cursor-not-allowed"
                                            : "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-amber-500/30 hover:text-white"
                                        }`}
                                      >
                                        "{phrase}"
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Hardware Configuration sliders */}
                          <div className="border-t border-slate-900 pt-3.5 space-y-3 text-[10px]">
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                              ACOUSTIC ENGINE HARDWARE PARAMS
                            </span>

                            {/* Sensitivity slider */}
                            <div className="space-y-1">
                              <div className="flex justify-between font-mono">
                                <span className="text-slate-400">Wake-word Sensitivity</span>
                                <span className="text-indigo-400 font-bold">{wakeSensitivity.toFixed(2)}</span>
                              </div>
                              <input
                                type="range"
                                min="0.50"
                                max="0.99"
                                step="0.05"
                                value={wakeSensitivity}
                                onChange={(e) => setWakeSensitivity(parseFloat(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                              />
                            </div>

                            {/* Follow up duration slider */}
                            <div className="space-y-1">
                              <div className="flex justify-between font-mono">
                                <span className="text-slate-400">Follow-up Timeout</span>
                                <span className="text-indigo-400 font-bold">{followUpTimeout}s</span>
                              </div>
                              <input
                                type="range"
                                min="3"
                                max="15"
                                step="1"
                                value={followUpTimeout}
                                onChange={(e) => setFollowUpTimeout(parseInt(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                              />
                            </div>

                            {/* Toggle Beep sound */}
                            <label className="flex items-center justify-between font-mono cursor-pointer pt-1">
                              <span className="text-slate-400">Enable Wake Tone Beep</span>
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={activationSoundEnabled}
                                  onChange={() => setActivationSoundEnabled(!activationSoundEnabled)}
                                  className="sr-only"
                                />
                                <div className={`w-8 h-4 rounded-full transition-colors ${activationSoundEnabled ? "bg-indigo-600" : "bg-slate-800"}`} />
                                <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${activationSoundEnabled ? "transform translate-x-4" : ""}`} />
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Live Framework Logs Monitor */}
                      <div className="bg-slate-950 rounded-2xl border border-slate-900 p-4 space-y-2.5 font-mono">
                        <div className="flex items-center justify-between text-[9px] text-slate-400">
                          <span className="flex items-center space-x-1.5 font-bold">
                            <Terminal className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                            <span className="text-slate-200 uppercase tracking-wider">HARDWARE LIFECYCLE MONITOR</span>
                          </span>
                          <span className="text-slate-500">TAG: AndroidHardwareService</span>
                        </div>

                        {/* Monitor Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-y border-slate-900 py-2 text-[9px] font-mono">
                          <div className="flex flex-col">
                            <span className="text-slate-500">POWER LOCK</span>
                            <span className="font-bold text-slate-300">
                              {simState === "DISABLED" ? "NONE" : simState === "WAKE_LISTENING" ? "PARTIAL_WAKE_LOCK" : "SCREEN_BRIGHT_LOCK"}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-slate-500">CPU LEVEL</span>
                            <span className={`font-bold ${simState === "PROCESSING" ? "text-rose-400" : simState === "COMMAND_LISTENING" ? "text-amber-400" : "text-emerald-400"}`}>
                              {simState === "DISABLED" ? "0.5%" : simState === "PROCESSING" ? "92%" : simState === "COMMAND_LISTENING" ? "28%" : "8%"}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-slate-500">MIC STATE</span>
                            <span className="font-bold text-slate-300">
                              {simState === "DISABLED" || simState === "ERROR" ? "RELEASED" : "RECORDING_ACTIVE"}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-slate-500">FOLLOWUP TIMER</span>
                            <span className="font-bold text-indigo-400">
                              {followUpTimer > 0 ? `${followUpTimer}s ACTIVE` : "DORMANT"}
                            </span>
                          </div>
                        </div>

                        {/* Feedback Banner */}
                        <div className="bg-indigo-950/20 rounded-xl border border-indigo-900/30 p-3 flex items-start space-x-2.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 mt-1 animate-pulse" />
                          <div className="flex-1 flex flex-col space-y-0.5">
                            <span className="text-[10px] font-bold text-indigo-300">SYSTEM RESPONSE STATE: {simState}</span>
                            <span className="text-[10px] text-slate-300 leading-normal">{simFeedback}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Interactive AI Brain & Multilingual Engine Simulator for Part 5 */}
                  {architectureSubTab === "part5" && (
                    <div className="mt-8 pt-6 border-t border-slate-900/80 space-y-5">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase font-mono block mb-1">
                          CONVERSATION CORE BRAIN SIMULATOR
                        </span>
                        <h4 className="text-sm font-semibold text-slate-100 font-display">
                          Voice Conversation Pipeline & Multilingual AI Brain Orchestration
                        </h4>
                        <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                          Trigger voice intents to witness on-device language identification (Hindi, Marathi, English) and step-by-step orchestrator pipelines passing through security checkpoints and memory filters.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                        {/* Column 1: Multi-Provider & Pipeline step viewer */}
                        <div className="xl:col-span-7 flex flex-col space-y-4">
                          
                          {/* Active Providers & Settings */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-900/30 border border-slate-900">
                            <div>
                              <label className="text-[9px] font-mono font-bold text-slate-500 uppercase block mb-1.5">
                                AI Provider Backend (Swappable)
                              </label>
                              <div className="flex space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                                {["Gemini", "OpenAI", "Anthropic", "Local"].map((prov) => (
                                  <button
                                    key={prov}
                                    onClick={() => {
                                      setPart5Provider(prov as any);
                                      addFrameworkLog("info", "AiBrainOrchestrator", `AI Model Provider set to ${prov}. Consistency preservation engine synced.`);
                                    }}
                                    className={`flex-1 py-1 rounded text-[10px] font-medium transition-all ${
                                      part5Provider === prov
                                        ? "bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 font-bold"
                                        : "text-slate-500 hover:text-slate-300 border border-transparent"
                                    }`}
                                  >
                                    {prov}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="text-[9px] font-mono font-bold text-slate-500 uppercase block mb-1.5">
                                Spoken Language Locale
                              </label>
                              <div className="flex space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                                {["Auto", "English", "Hindi", "Marathi"].map((l) => (
                                  <button
                                    key={l}
                                    onClick={() => {
                                      setPart5LanguageMode(l as any);
                                      addFrameworkLog("info", "LanguageDetector", `Microphone input locale set to: ${l}`);
                                    }}
                                    className={`flex-1 py-1 rounded text-[10px] font-medium transition-all ${
                                      part5LanguageMode === l
                                        ? "bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 font-bold"
                                        : "text-slate-500 hover:text-slate-300 border border-transparent"
                                    }`}
                                  >
                                    {l}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* 14-Step Pipeline Graph */}
                          <div className="flex flex-col space-y-2">
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                              CONVERSATION PIPELINE ENGINE (14 MODULAR STAGES)
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                              {[
                                "Wake word",
                                "Activation",
                                "Speech-to-Text",
                                "Lang Detection",
                                "Intent Classification",
                                "Context Restore",
                                "Memory Fetch",
                                "AI Reasoning",
                                "Action Planner",
                                "Safety Gate",
                                "Execution",
                                "Response Gen",
                                "TTS Speech",
                                "VAD Standby"
                              ].map((step, idx) => {
                                const isActive = part5ActivePipelineStep === idx;
                                const isPassed = part5ActivePipelineStep > idx;
                                return (
                                  <div
                                    key={idx}
                                    className={`p-1.5 px-2 rounded-lg border text-[9px] font-mono transition-all flex items-center space-x-1.5 ${
                                      isActive
                                        ? "bg-amber-500/10 border-amber-500 text-amber-200 font-bold shadow-[0_0_10px_rgba(245,158,11,0.1)] scale-[1.02]"
                                        : isPassed
                                        ? "bg-slate-900/40 border-slate-800 text-slate-400"
                                        : "bg-slate-950/20 border-slate-950/40 text-slate-600"
                                    }`}
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-amber-400 animate-ping" : isPassed ? "bg-emerald-500" : "bg-slate-800"}`} />
                                    <span className="truncate">{idx + 1}. {step}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* AI Brain Reasoning Pre-evaluation checklist */}
                          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900 space-y-3">
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block border-b border-slate-900 pb-1">
                              AI BRAIN REAL-TIME REASONING PARSE CHECKLIST
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[10px] font-mono">
                              <div className="flex items-center space-x-2">
                                <span className={`w-2.5 h-2.5 rounded-sm border ${part5ReasoningChecklist.isConversation ? "bg-indigo-600/20 border-indigo-500 text-indigo-400" : "border-slate-800"}`} />
                                <span className={part5ReasoningChecklist.isConversation ? "text-slate-200" : "text-slate-500"}>Is Conversation</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`w-2.5 h-2.5 rounded-sm border ${part5ReasoningChecklist.isDeviceCommand ? "bg-amber-600/20 border-amber-500 text-amber-400" : "border-slate-800"}`} />
                                <span className={part5ReasoningChecklist.isDeviceCommand ? "text-slate-200" : "text-slate-500"}>Device Command</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`w-2.5 h-2.5 rounded-sm border ${part5ReasoningChecklist.isAutomation ? "bg-teal-600/20 border-teal-500 text-teal-400" : "border-slate-800"}`} />
                                <span className={part5ReasoningChecklist.isAutomation ? "text-slate-200" : "text-slate-500"}>Is Automation</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`w-2.5 h-2.5 rounded-sm border ${part5ReasoningChecklist.isConnector ? "bg-emerald-600/20 border-emerald-500 text-emerald-400" : "border-slate-800"}`} />
                                <span className={part5ReasoningChecklist.isConnector ? "text-slate-200" : "text-slate-500"}>Is Connector</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`w-2.5 h-2.5 rounded-sm border ${part5ReasoningChecklist.confirmationRequired ? "bg-rose-600/20 border-rose-500 text-rose-400" : "border-slate-800"}`} />
                                <span className={part5ReasoningChecklist.confirmationRequired ? "text-slate-200" : "text-slate-500"}>Requires Confirm</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`w-2.5 h-2.5 rounded-sm border ${part5ReasoningChecklist.canUseOfflineApi ? "bg-sky-600/20 border-sky-500 text-sky-400" : "border-slate-800"}`} />
                                <span className={part5ReasoningChecklist.canUseOfflineApi ? "text-slate-200" : "text-slate-500"}>Offline-Safe API</span>
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* Column 2: Trigger phrases and active Session Logs */}
                        <div className="xl:col-span-5 flex flex-col space-y-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-900">
                          
                          {/* Vocal triggers */}
                          <div>
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                              SPEAK TEST PHRASES (MULTILINGUAL)
                            </span>
                            <div className="mt-2 space-y-2">
                              {/* English triggers */}
                              <div className="space-y-1">
                                <span className="text-[8px] font-mono text-slate-500 block">ENGLISH (US)</span>
                                <div className="grid grid-cols-1 gap-1">
                                  {["Set alarm for tomorrow morning", "Turn on the flashlight", "Send email to Sarah"].map((phrase) => (
                                    <button
                                      key={phrase}
                                      onClick={() => runPart5ConversationPipeline(phrase)}
                                      className="text-left p-1.5 px-2 rounded-lg border border-slate-800 bg-slate-950/60 text-[9px] font-mono text-slate-300 hover:border-indigo-500/30 hover:text-white"
                                    >
                                      🇺🇸 "{phrase}"
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Hindi triggers */}
                              <div className="space-y-1">
                                <span className="text-[8px] font-mono text-slate-500 block">HINDI (हिंदी)</span>
                                <div className="grid grid-cols-1 gap-1">
                                  {["कल सुबह का अलार्म लगाओ", "फ़्लैशलाइट चालू करो", "आज का मौसम कैसा है?"].map((phrase) => (
                                    <button
                                      key={phrase}
                                      onClick={() => runPart5ConversationPipeline(phrase)}
                                      className="text-left p-1.5 px-2 rounded-lg border border-slate-800 bg-slate-950/60 text-[9px] font-mono text-slate-300 hover:border-indigo-500/30 hover:text-white"
                                    >
                                      🇮🇳 "{phrase}"
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Marathi triggers */}
                              <div className="space-y-1">
                                <span className="text-[8px] font-mono text-slate-500 block">MARATHI (मराठी)</span>
                                <div className="grid grid-cols-1 gap-1">
                                  {["टॉर्च चालू करा", "उद्या सकाळी अलार्म लाव", "मुंबईचे हवामान काय आहे?"].map((phrase) => (
                                    <button
                                      key={phrase}
                                      onClick={() => runPart5ConversationPipeline(phrase)}
                                      className="text-left p-1.5 px-2 rounded-lg border border-slate-800 bg-slate-950/60 text-[9px] font-mono text-slate-300 hover:border-indigo-500/30 hover:text-white"
                                    >
                                      🇮🇳 (mr) "{phrase}"
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Interruption Controls */}
                          {simState === "SPEAKING" && (
                            <div className="border-t border-slate-900 pt-3">
                              <span className="text-[9px] font-mono font-bold text-rose-500 block mb-1.5">
                                ACTIVE VOICE BARGE-IN (INTERRUPTION)
                              </span>
                              <button
                                onClick={handlePart5Interruption}
                                className="w-full py-2 rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-300 text-xs font-semibold animate-pulse flex items-center justify-center space-x-1.5"
                              >
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                                <span>TAP TO INTERRUPT SPEAKING (BARGE-IN)</span>
                              </button>
                            </div>
                          )}

                          {/* Safety Confirmation overlay inside simulator */}
                          {part5ConfirmationPending && (
                            <div className="p-3 bg-amber-950/20 border border-amber-800/30 rounded-xl space-y-2 mt-2">
                              <div className="flex items-start space-x-2">
                                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                <div className="flex-1 text-[10px]">
                                  <span className="font-bold text-amber-400 block">EXPLICIT SECURITY GATE APPROVED?</span>
                                  <span className="text-slate-300">Jarvis requests approval to dispatch local intent for: <strong className="text-amber-300">"{part5ConfirmationPendingAction}"</strong></span>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handlePart5Confirmation(true)}
                                  className="flex-1 py-1 text-[9px] font-mono font-bold bg-amber-600 text-white rounded hover:bg-amber-500 active:scale-95"
                                >
                                  CONFIRM & ALLOW
                                </button>
                                <button
                                  onClick={() => handlePart5Confirmation(false)}
                                  className="flex-1 py-1 text-[9px] font-mono font-bold bg-slate-950 text-slate-400 border border-slate-800 rounded hover:text-slate-200 active:scale-95"
                                >
                                  REJECT
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Memory turns session display */}
                          <div className="border-t border-slate-900 pt-3 flex-1 flex flex-col min-h-[160px]">
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block mb-1.5">
                              DYNAMIC CONVERSATION SESSION MEMORY
                            </span>
                            <div className="flex-1 bg-slate-950 rounded-xl border border-slate-900 p-2 text-[9px] font-mono max-h-[180px] overflow-y-auto space-y-2">
                              {part5SessionTurns.map((turn, tIdx) => (
                                <div key={tIdx} className={`p-2 rounded-lg ${turn.sender === "user" ? "bg-indigo-950/10 text-indigo-300 text-right ml-6" : "bg-slate-900/40 text-slate-300 mr-6 text-left"}`}>
                                  <div className="text-[8px] text-slate-500 font-bold mb-0.5 uppercase tracking-wider">
                                    {turn.sender === "user" ? "USER UTTERANCE" : "JARVIS VOICE"} {turn.lang && `[${turn.lang.toUpperCase()}]`}
                                  </div>
                                  <span className="font-sans text-[10px] leading-relaxed block">{turn.text}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  )}

                  {/* Part 7: Command Engine & Device Control Simulator */}
                  {architectureSubTab === "part7" && (
                    <div className="mt-8 pt-6 border-t border-slate-900/80 space-y-6">
                      <div>
                        <span className="text-[10px] font-bold text-teal-400 tracking-wider uppercase font-mono block mb-1">
                          COMMAND ROUTING MODULE (PART 7 SIMULATOR)
                        </span>
                        <h4 className="text-sm font-semibold text-slate-100 font-display">
                          Interactive Command Pipeline & Safety Gate Console
                        </h4>
                        <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                          Analyze complex physical commands, test system permission checks, simulate hardware faults, and inspect on-device intent routing and safety confirmation blocks.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                        {/* Column 1: Pipeline & Intent Inspector */}
                        <div className="xl:col-span-7 flex flex-col space-y-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-900">
                          {/* Query input field & controls */}
                          <div className="space-y-2">
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">
                              SYSTEM DISPATCH QUEUE (NATURAL LANGUAGE COMMANDS)
                            </span>
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={p7Query}
                                onChange={(e) => setP7Query(e.target.value)}
                                placeholder="Type a physical command or query..."
                                className="flex-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500/50"
                              />
                              <button
                                onClick={() => runP7CommandPipeline(p7Query)}
                                disabled={p7IsAnalyzing}
                                className={`px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-xl transition-all flex items-center space-x-1.5 ${
                                  p7IsAnalyzing ? "opacity-55 cursor-not-allowed animate-pulse" : "active:scale-95"
                                }`}
                              >
                                {p7IsAnalyzing ? (
                                  <>
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    <span>ANALYZING...</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                    <span>DISPATCH</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Preset queries */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {[
                                "Set reminder to Call Rahul Sharma tomorrow morning",
                                "Turn on the flashlight",
                                "Send email to Sarah about lunch",
                                "Check system status",
                                "Play relaxing Sunset chill vibes music",
                                "Check weather forecast"
                              ].map((phrase, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setP7Query(phrase);
                                    runP7CommandPipeline(phrase);
                                  }}
                                  disabled={p7IsAnalyzing}
                                  className="text-[9px] font-mono border border-slate-800 bg-slate-950/60 hover:border-slate-700 text-slate-400 hover:text-slate-200 px-2 py-1 rounded-lg transition-all"
                                >
                                  "{phrase}"
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 11-Step Pipeline Flow graph */}
                          <div className="space-y-2 border-t border-slate-900 pt-3">
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                              COMMAND CONVERSION PIPELINE (11 SUCCESSIVE GATES)
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                              {[
                                { step: "Wake Word", sub: "WakeLock & local VAD" },
                                { step: "STT Transcription", sub: "PCM array converter" },
                                { step: "Language Detection", sub: "Locate target voice locale" },
                                { step: "Intent Classification", sub: "Heuristics & LLM mapping" },
                                { step: "Entity Extraction", sub: "Extract names/time slot" },
                                { step: "Memory Context", sub: "Inject chat history" },
                                { step: "Environment Check", sub: "Battery & power budget" },
                                { step: "Permission Gate", sub: "Check Android Manifest" },
                                { step: "Safety Verification", sub: "Auto-confirm analyzer" },
                                { step: "Command Dispatch", sub: "System intent broadcast" },
                                { step: "Response/Verify", sub: "Generate TTS reply" }
                              ].map((item, idx) => {
                                const isActive = p7PipelineStep === idx;
                                const isPassed = p7PipelineStep > idx;
                                return (
                                  <div
                                    key={idx}
                                    className={`p-2 rounded-xl border text-[10px] font-mono transition-all flex flex-col justify-between h-[52px] ${
                                      isActive
                                        ? "bg-indigo-600/10 border-indigo-500 text-indigo-200 font-bold shadow-[0_0_10px_rgba(99,102,241,0.15)] scale-[1.01]"
                                        : isPassed
                                        ? "bg-slate-950/40 border-slate-800 text-slate-400"
                                        : "bg-slate-950/10 border-slate-950/20 text-slate-600"
                                    }`}
                                  >
                                    <div className="flex items-center space-x-1">
                                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-indigo-400 animate-ping" : isPassed ? "bg-teal-500" : "bg-slate-800"}`} />
                                      <span className="truncate text-[9px]">{idx + 1}. {item.step}</span>
                                    </div>
                                    <span className="text-[8px] text-slate-500 font-sans truncate pl-2.5">{item.sub}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Intent Parse results */}
                          {p7PipelineStep >= 4 && (
                            <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl space-y-2">
                              <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                                <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase">
                                  SEMANTIC PARSE DATA
                                </span>
                                <span className="text-[9px] font-mono text-slate-500">
                                  confidence: <strong className="text-emerald-400">0.97</strong>
                                </span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                                <div>
                                  <span className="text-[9px] text-slate-500 block">CLASSIFIED INTENT</span>
                                  <span className="text-slate-200 font-bold tracking-wider">{p7Intent}</span>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-500 block">EXTRACTED PARAMS (ENTITIES)</span>
                                  <span className="text-indigo-300 font-medium text-[10px] block truncate">
                                    {JSON.stringify(p7Entities)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Historical logs tracking list */}
                          <div className="border-t border-slate-900 pt-3">
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block mb-2">
                              ON-DEVICE COMMAND DISPATCH LOGS
                            </span>
                            <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                              {p7HistoryList.map((log) => (
                                <div key={log.id} className="p-2 bg-slate-950/50 border border-slate-900/60 rounded-xl flex items-center justify-between text-[10px] font-mono">
                                  <div className="space-y-0.5">
                                    <div className="flex items-center space-x-1.5">
                                      <span className="text-[8px] text-slate-500">{log.time}</span>
                                      <span className="text-slate-300 truncate max-w-[200px]">"{log.query}"</span>
                                    </div>
                                    <p className="text-[9px] text-slate-400 font-sans">{log.details}</p>
                                  </div>
                                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                                    log.status === "success"
                                      ? "bg-emerald-500/15 text-emerald-400"
                                      : log.status === "cancelled"
                                      ? "bg-amber-500/15 text-amber-400"
                                      : "bg-rose-500/15 text-rose-400"
                                  }`}>
                                    {log.status.toUpperCase()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>

                        {/* Column 2: Safety Gate Subsystems & Android Controller */}
                        <div className="xl:col-span-5 flex flex-col space-y-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-900">
                          
                          {/* Hardware and fault simulators */}
                          <div className="space-y-3">
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">
                              ANDROID DEVICE SIMULATOR HARNESS
                            </span>
                            
                            {/* Device settings grid */}
                            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                              <div className="p-2 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between">
                                <div>
                                  <span className="text-[9px] text-slate-500 block">FLASHLIGHT LED</span>
                                  <span className={deviceState.flashlightOn ? "text-amber-400 font-bold" : "text-slate-400"}>
                                    {deviceState.flashlightOn ? "ON (BEAM ACTIVE)" : "OFF"}
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    setDeviceState(prev => ({ ...prev, flashlightOn: !prev.flashlightOn }));
                                    addFrameworkLog("info", "HardwareController", `Flashlight manually toggled via dev panel.`);
                                  }}
                                  className={`p-1.5 rounded-lg border transition-all ${
                                    deviceState.flashlightOn
                                      ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                                      : "bg-slate-900 border-slate-800 text-slate-500"
                                  }`}
                                >
                                  <Power className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="p-2 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between">
                                <div>
                                  <span className="text-[9px] text-slate-500 block">BATTERY & HEALTH</span>
                                  <span className="text-indigo-300 font-bold">{deviceState.batteryLevel}% {deviceState.isCharging && "(CHARGING)"}</span>
                                </div>
                                <button
                                  onClick={() => {
                                    setDeviceState(prev => ({ ...prev, isCharging: !prev.isCharging }));
                                    addFrameworkLog("info", "PowerService", `USB Charging state simulated.`);
                                  }}
                                  className={`p-1.5 rounded-lg border transition-all ${
                                    deviceState.isCharging
                                      ? "bg-teal-500/15 border-teal-500/30 text-teal-400 animate-pulse"
                                      : "bg-slate-900 border-slate-800 text-slate-500"
                                  }`}
                                >
                                  <Zap className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Flashlight beam graphic when flashlightOn is true */}
                            {deviceState.flashlightOn && (
                              <div className="relative h-12 rounded-xl overflow-hidden bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-transparent border border-amber-500/20 flex items-center px-3 space-x-2 animate-pulse">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                                <span className="text-[9px] font-mono text-amber-300 font-semibold uppercase">Flashlight LED Beam actively illuminating environment (100% duty)</span>
                              </div>
                            )}

                            {/* Battery slider adjustment */}
                            <div className="p-2.5 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1.5">
                              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                                <span>SIMULATE BATTERY LEVEL</span>
                                <span className="text-slate-300">{deviceState.batteryLevel}%</span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="100"
                                value={deviceState.batteryLevel}
                                onChange={(e) => setDeviceState(prev => ({ ...prev, batteryLevel: Number(e.target.value) }))}
                                className="w-full accent-indigo-500"
                              />
                            </div>

                            {/* Simulated hardware error toggle */}
                            <div className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-900 rounded-xl">
                              <div className="flex-1">
                                <span className="text-[9px] font-mono font-bold text-rose-500 block">SIMULATE HARDWARE FAULTS</span>
                                <span className="text-[10px] text-slate-400 font-sans">Forces intent dispatcher pipeline to handle crashes gracefully</span>
                              </div>
                              <button
                                onClick={() => {
                                  setP7SimulateError(!p7SimulateError);
                                  addFrameworkLog("info", "CommandEngine", `Simulated hardware error state toggled to ${!p7SimulateError}`);
                                }}
                                className={`px-2.5 py-1 text-[10px] font-mono rounded-lg border transition-all ${
                                  p7SimulateError
                                    ? "bg-rose-500/15 border-rose-500/30 text-rose-400 font-bold"
                                    : "bg-slate-950 border-slate-800 text-slate-500"
                                }`}
                              >
                                {p7SimulateError ? "ACTIVE" : "STANDBY"}
                              </button>
                            </div>
                          </div>

                          {/* SAFETY GATES SUBSYSTEMS (Explicit User Approvals) */}
                          <div className="space-y-3 border-t border-slate-900 pt-3">
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">
                              EXPLICIT PRIVACY & SAFETY CONFIRMATION GATES
                            </span>

                            {/* Phone Calling Gate */}
                            {p7CallStatus !== "idle" && (
                              <div className="p-3 bg-indigo-950/10 border border-indigo-900/30 rounded-xl space-y-2">
                                <div className="flex items-start space-x-2">
                                  <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                                  <div className="flex-1 text-[10px] font-sans">
                                    <span className="font-mono font-bold text-indigo-300 block">DIALER LAUNCH GATE</span>
                                    <span className="text-slate-300">
                                      Jarvis is requesting permission to open the dialer for: <strong className="text-indigo-200">"{p7CallContact}"</strong>.
                                    </span>
                                  </div>
                                </div>
                                
                                {p7CallStatus === "awaiting_confirm" ? (
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => {
                                        setP7CallStatus("calling");
                                        addFrameworkLog("broadcast", "SafetyController", `User verified Calling approval for ${p7CallContact}. Launching telephony...`);
                                        setTimeout(() => {
                                          setP7CallStatus("completed");
                                          addFrameworkLog("broadcast", "TelephonyService", `Simulated phone call to ${p7CallContact} succeeded.`);
                                          setP7HistoryList(prev => [
                                            { id: "h_" + Date.now(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), query: `Call ${p7CallContact}`, status: "success", details: `Dialed: ${p7CallContact}` },
                                            ...prev
                                          ]);
                                        }, 2000);
                                      }}
                                      className="flex-1 py-1.5 text-[9px] font-mono font-bold bg-indigo-600 text-white rounded hover:bg-indigo-500"
                                    >
                                      CONFIRM CALL
                                    </button>
                                    <button
                                      onClick={() => {
                                        setP7CallStatus("idle");
                                        addFrameworkLog("perm", "SafetyController", `User rejected calling authorization for ${p7CallContact}.`);
                                        setP7HistoryList(prev => [
                                          { id: "h_" + Date.now(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), query: `Call ${p7CallContact}`, status: "cancelled", details: "Telephony dial aborted by safety gate" },
                                          ...prev
                                        ]);
                                      }}
                                      className="flex-1 py-1.5 text-[9px] font-mono font-bold bg-slate-950 text-slate-400 border border-slate-800 rounded hover:text-slate-200"
                                    >
                                      REJECT
                                    </button>
                                  </div>
                                ) : p7CallStatus === "calling" ? (
                                  <div className="flex items-center space-x-2 text-[10px] text-indigo-400 animate-pulse font-mono">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                                    <span>DIALING {p7CallContact.toUpperCase()} NOW...</span>
                                  </div>
                                ) : p7CallStatus === "completed" ? (
                                  <div className="flex items-center justify-between text-[10px] text-emerald-400 font-mono">
                                    <span>✓ CALL CONCLUDED SUCCESSFULLY</span>
                                    <button onClick={() => setP7CallStatus("idle")} className="text-slate-500 hover:text-slate-300">DISMISS</button>
                                  </div>
                                ) : null}
                              </div>
                            )}

                            {/* SMS Compose & Safety Gate */}
                            {p7SmsStatus !== "idle" && (
                              <div className="p-3 bg-teal-950/10 border border-teal-900/30 rounded-xl space-y-2">
                                <div className="text-[10px] space-y-1">
                                  <span className="font-mono font-bold text-teal-300 block">SMS RECIPIENT: {p7SmsRecipient}</span>
                                  <p className="p-2 bg-slate-950 text-slate-300 rounded font-sans text-[11px] border border-slate-900">"{p7SmsText}"</p>
                                </div>
                                {p7SmsStatus === "awaiting_confirm" ? (
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => {
                                        setP7SmsStatus("sending");
                                        addFrameworkLog("broadcast", "SmsService", `SMS dispatch approved by safety gate. Transmitting payload...`);
                                        setTimeout(() => {
                                          setP7SmsStatus("sent");
                                          addFrameworkLog("broadcast", "SmsService", "SMS dispatched successfully over cellular network.");
                                          setP7HistoryList(prev => [
                                            { id: "h_" + Date.now(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), query: `Send SMS to ${p7SmsRecipient}`, status: "success", details: `SMS sent: "${p7SmsText}"` },
                                            ...prev
                                          ]);
                                        }, 1500);
                                      }}
                                      className="flex-1 py-1 text-[9px] font-mono font-bold bg-teal-600 text-white rounded hover:bg-teal-500"
                                    >
                                      APPROVE SEND
                                    </button>
                                    <button
                                      onClick={() => {
                                        setP7SmsStatus("idle");
                                        addFrameworkLog("perm", "SafetyController", "SMS transmitting rejected by user.");
                                        setP7HistoryList(prev => [
                                          { id: "h_" + Date.now(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), query: "Send SMS", status: "cancelled", details: "SMS canceled by safety gate" },
                                          ...prev
                                        ]);
                                      }}
                                      className="flex-1 py-1 text-[9px] font-mono font-bold bg-slate-950 text-slate-400 border border-slate-800 rounded hover:text-slate-200"
                                    >
                                      REJECT
                                    </button>
                                  </div>
                                ) : p7SmsStatus === "sending" ? (
                                  <span className="text-[9px] font-mono text-teal-400 animate-pulse block">TRANSMITTING CELLULAR PACKETS...</span>
                                ) : (
                                  <div className="flex items-center justify-between text-[9px] font-mono text-emerald-400">
                                    <span>✓ SMS TRANSMITTED SECURELY</span>
                                    <button onClick={() => setP7SmsStatus("idle")} className="text-slate-500 hover:text-slate-300">DISMISS</button>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Email Compose & Safety Gate */}
                            {p7EmailStatus !== "idle" && (
                              <div className="p-3 bg-purple-950/10 border border-purple-900/30 rounded-xl space-y-2">
                                <div className="text-[10px] font-mono space-y-1">
                                  <span className="font-bold text-purple-300 block">EMAIL RECIPIENT: {p7EmailRecipient}</span>
                                  <span className="text-slate-400 text-[9px] block">SUBJECT: {p7EmailSubject}</span>
                                  <p className="p-2 bg-slate-950 text-slate-300 rounded font-sans text-[11px] border border-slate-900">"{p7EmailBody}"</p>
                                </div>
                                {p7EmailStatus === "awaiting_confirm" ? (
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => {
                                        setP7EmailStatus("sending");
                                        addFrameworkLog("broadcast", "GmailConnector", `Dispatching email draft through Gmail API scope...`);
                                        setTimeout(() => {
                                          setP7EmailStatus("sent");
                                          addFrameworkLog("broadcast", "GmailConnector", "Email transmitted successfully.");
                                          setP7HistoryList(prev => [
                                            { id: "h_" + Date.now(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), query: `Send Email to ${p7EmailRecipient}`, status: "success", details: `Email Sent. Subject: ${p7EmailSubject}` },
                                            ...prev
                                          ]);
                                        }, 1500);
                                      }}
                                      className="flex-1 py-1 text-[9px] font-mono font-bold bg-purple-600 text-white rounded hover:bg-purple-500"
                                    >
                                      APPROVE SEND
                                    </button>
                                    <button
                                      onClick={() => {
                                        setP7EmailStatus("idle");
                                        addFrameworkLog("perm", "SafetyController", "Email transmission cancelled.");
                                        setP7HistoryList(prev => [
                                          { id: "h_" + Date.now(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), query: "Send Email", status: "cancelled", details: "Email canceled by safety gate" },
                                          ...prev
                                        ]);
                                      }}
                                      className="flex-1 py-1 text-[9px] font-mono font-bold bg-slate-950 text-slate-400 border border-slate-800 rounded hover:text-slate-200"
                                    >
                                      REJECT
                                    </button>
                                  </div>
                                ) : p7EmailStatus === "sending" ? (
                                  <span className="text-[9px] font-mono text-purple-400 animate-pulse block">SENDING VIA OAUTH CONNECTOR...</span>
                                ) : (
                                  <div className="flex items-center justify-between text-[9px] font-mono text-emerald-400">
                                    <span>✓ EMAIL TRANSMITTED SECURELY</span>
                                    <button onClick={() => setP7EmailStatus("idle")} className="text-slate-500 hover:text-slate-300">DISMISS</button>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Standard trigger list if nothing is active */}
                            {p7CallStatus === "idle" && p7SmsStatus === "idle" && p7EmailStatus === "idle" && (
                              <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between text-xs text-slate-400">
                                <div className="flex items-center space-x-1.5">
                                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                  <span>All safety gates operating in secure automated mode.</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Productivity Reminders List */}
                          <div className="space-y-2 border-t border-slate-900 pt-3">
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">
                              ON-DEVICE ALARMS & TIME-BASED REMINDERS
                            </span>
                            <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                              {p7RemindersList.map((rem) => (
                                <div key={rem.id} className="p-2 bg-slate-950/60 border border-slate-900/60 rounded-xl flex items-center justify-between text-[10px] font-mono">
                                  <div>
                                    <span className="text-slate-200 font-bold block">{rem.title}</span>
                                    <span className="text-[8px] text-slate-500">{rem.trigger} • {rem.category}</span>
                                  </div>
                                  <div className="flex items-center space-x-1.5">
                                    <span className={`px-1 py-0.5 rounded text-[7px] font-bold ${
                                      rem.priority === "High"
                                        ? "bg-rose-500/15 text-rose-400"
                                        : rem.priority === "Medium"
                                        ? "bg-amber-500/15 text-amber-400"
                                        : "bg-indigo-500/15 text-indigo-400"
                                    }`}>
                                      {rem.priority}
                                    </span>
                                    <button
                                      onClick={() => {
                                        setP7RemindersList(prev => prev.filter(r => r.id !== rem.id));
                                        addFrameworkLog("info", "AlarmManager", `Reminder "${rem.title}" deleted.`);
                                      }}
                                      className="p-1 hover:text-rose-400 transition-all text-slate-500"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Add reminder mini form */}
                            <div className="bg-slate-950 border border-slate-900 rounded-xl p-2.5 space-y-2">
                              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                                <input
                                  type="text"
                                  placeholder="Title (e.g. Call Boss)"
                                  value={p7NewReminderTitle}
                                  onChange={(e) => setP7NewReminderTitle(e.target.value)}
                                  className="bg-slate-900 border border-slate-800 text-[10px] rounded px-2 py-1 text-white"
                                />
                                <input
                                  type="text"
                                  placeholder="Time (e.g. Tomorrow 9 AM)"
                                  value={p7NewReminderTrigger}
                                  onChange={(e) => setP7NewReminderTrigger(e.target.value)}
                                  className="bg-slate-900 border border-slate-800 text-[10px] rounded px-2 py-1 text-white"
                                />
                              </div>
                              <div className="flex justify-between items-center text-[10px] font-mono">
                                <div className="flex space-x-1">
                                  {(["Low", "Medium", "High"] as const).map((pri) => (
                                    <button
                                      key={pri}
                                      onClick={() => setP7NewReminderPriority(pri)}
                                      className={`px-1.5 py-0.5 rounded text-[8px] border transition-all ${
                                        p7NewReminderPriority === pri
                                          ? "bg-indigo-600/10 border-indigo-500 text-indigo-400"
                                          : "bg-slate-900 border-slate-800 text-slate-500"
                                      }`}
                                    >
                                      {pri}
                                    </button>
                                  ))}
                                </div>
                                <button
                                  onClick={() => {
                                    if (!p7NewReminderTitle) return;
                                    const newR = {
                                      id: "rem_" + Date.now(),
                                      title: p7NewReminderTitle,
                                      trigger: p7NewReminderTrigger,
                                      priority: p7NewReminderPriority,
                                      category: p7NewReminderCategory || "General"
                                    };
                                    setP7RemindersList(prev => [...prev, newR]);
                                    setP7NewReminderTitle("");
                                    addFrameworkLog("broadcast", "AlarmManager", `Reminder "${newR.title}" created via local form.`);
                                  }}
                                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[9px] px-2.5 py-1 rounded transition-all"
                                >
                                  ADD REMINDER
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Image Understanding & OCR Simulator */}
                          <div className="space-y-2 border-t border-slate-900 pt-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">
                                IMAGE UNDERSTANDING & OCR (VISION COPROCESSOR)
                              </span>
                              {p7ImageUploaded && (
                                <button
                                  onClick={() => {
                                    setP7ImageUploaded(false);
                                    setP7ImageOCR("");
                                    addFrameworkLog("info", "VisionEngine", "Cleaned vision buffer.");
                                  }}
                                  className="text-[8px] font-mono text-rose-400 hover:underline"
                                >
                                  RESET
                                </button>
                              )}
                            </div>

                            {!p7ImageUploaded ? (
                              <div
                                onClick={() => {
                                  setP7ImageUploaded(true);
                                  setP7ImageOCR("Subject: Invoice #48529\nTotal: $124.50\nVendor: AWS Cloud Computing Services\nDate: 2026-07-15");
                                  addFrameworkLog("info", "VisionEngine", "Mock receipt image uploaded. Commencing OCR parse on Deconvolution processor...");
                                }}
                                className="border-2 border-dashed border-slate-800 hover:border-indigo-500/35 bg-slate-950/40 rounded-xl p-4 text-center cursor-pointer transition-all space-y-1"
                              >
                                <span className="text-[10px] font-mono text-indigo-400 font-bold block">SIMULATE IMAGE UPLOAD (CLICK ME)</span>
                                <span className="text-[8px] text-slate-500 block">Click to upload a mock invoice receipt image and run OCR analysis</span>
                              </div>
                            ) : (
                              <div className="bg-slate-950 border border-slate-900 rounded-xl p-2.5 space-y-2">
                                <div className="flex items-center space-x-2 text-[10px] font-mono text-indigo-300">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                  <span>OCR DECONVOLUTION RESOLVED SUCCESSFULLY</span>
                                </div>
                                <pre className="bg-slate-900 p-2 text-[9px] font-mono text-slate-300 rounded border border-slate-800/80 leading-normal">
                                  {p7ImageOCR}
                                </pre>
                              </div>
                            )}
                          </div>

                          {/* Multilingual Translation Module */}
                          <div className="space-y-2 border-t border-slate-900 pt-3">
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">
                              LOCAL COGNITIVE TRANSLATION PIPELINE
                            </span>
                            <div className="space-y-2 bg-slate-950 border border-slate-900 rounded-xl p-2.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[8px] font-mono text-slate-500">SOURCE: ENGLISH</span>
                                <div className="flex space-x-1">
                                  {(["hi", "mr"] as const).map((lang) => (
                                    <button
                                      key={lang}
                                      onClick={() => {
                                        setP7TranslationLang(lang);
                                        if (lang === "hi") {
                                          setP7TranslationOutput(p7TranslationInput.toLowerCase().includes("how are you") ? "नमस्ते, आज आप कैसे हैं?" : "कल सुबह 9 बजे अलार्म लगाएं");
                                        } else {
                                          setP7TranslationOutput(p7TranslationInput.toLowerCase().includes("how are you") ? "नमस्कार, आज तुम्ही कसे आहात?" : "उद्या सकाळी 9 वाजता अलार्म लाव");
                                        }
                                        addFrameworkLog("info", "TranslationEngine", `Language switched to ${lang.toUpperCase()}. Translated dynamically.`);
                                      }}
                                      className={`px-2 py-0.5 rounded text-[8px] font-mono border transition-all ${
                                        p7TranslationLang === lang
                                          ? "bg-indigo-600/10 border-indigo-500 text-indigo-400"
                                          : "bg-slate-900 border-slate-800 text-slate-500"
                                      }`}
                                    >
                                      {lang.toUpperCase()}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <input
                                type="text"
                                value={p7TranslationInput}
                                onChange={(e) => {
                                  setP7TranslationInput(e.target.value);
                                  const text = e.target.value;
                                  if (p7TranslationLang === "hi") {
                                    setP7TranslationOutput(text.toLowerCase().includes("how are you") ? "नमस्ते, आज आप कैसे हैं?" : "कल सुबह 9 बजे अलार्म लगाएं");
                                  } else {
                                    setP7TranslationOutput(text.toLowerCase().includes("how are you") ? "नमस्कार, आज तुम्ही कसे आहात?" : "उद्या सकाळी 9 वाजता अलार्म लाव");
                                  }
                                }}
                                placeholder="Enter text to translate..."
                                className="w-full bg-slate-900 border border-slate-800 text-[10px] rounded px-2 py-1.5 text-white"
                              />
                              <div className="border-t border-slate-900/80 pt-1.5 space-y-0.5">
                                <span className="text-[8px] font-mono text-slate-500 uppercase">TRANSLATED OUTPUT:</span>
                                <p className="text-[10px] text-teal-400 font-mono font-bold pl-1">{p7TranslationOutput}</p>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  )}

                  {/* Part 8: AI Brain, Long-Term Memory & Personalization Simulator */}
                  {architectureSubTab === "part8" && (
                    <div className="mt-8 pt-6 border-t border-slate-900/80 space-y-6">
                      <div>
                        <span className="text-[10px] font-bold text-teal-400 tracking-wider uppercase font-mono block mb-1">
                          COGNITIVE MEMORY & PERSONALIZATION ENGINE (PART 8 SIMULATOR)
                        </span>
                        <h4 className="text-sm font-semibold text-slate-100 font-display">
                          On-Device Cognitive Memory, Context Compiler & Personalization Board
                        </h4>
                        <p className="text-[11px] text-slate-400 leading-normal mt-0.5 font-sans">
                          Inspect on-device Room databases, trigger similarity-based vector memory lookups, compile serialized prompt context packages, test proactive habit workflows, and run multi-turn dialogue simulation.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                        {/* Column 1: Multi-Layer Memory Cache Explorer & Profile */}
                        <div className="xl:col-span-7 flex flex-col space-y-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/60">
                          
                          {/* Profile Card & Customizer */}
                          <div className="p-3 bg-slate-950/80 border border-slate-900 rounded-xl space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">
                                COGNITIVE USER PROFILE CONFIGURATION
                              </span>
                              <span className="text-[8px] font-mono text-indigo-400 font-semibold px-1.5 py-0.5 bg-indigo-950/20 rounded border border-indigo-900/30 font-sans">
                                OWNER: {p8SelectedProfile.name.toUpperCase()}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-[10px] font-sans">
                              <div>
                                <label className="text-[8.5px] font-mono text-slate-500 block mb-0.5">Conversation Style</label>
                                <select
                                  value={p8SelectedProfile.conversationStyle}
                                  onChange={(e) => setP8SelectedProfile({ ...p8SelectedProfile, conversationStyle: e.target.value })}
                                  className="w-full bg-slate-900 border border-slate-800 text-white rounded px-2 py-1 outline-none text-[10px]"
                                >
                                  <option value="Friendly & Contextual">Friendly & Contextual</option>
                                  <option value="Calm Digital Butler">Calm Digital Butler</option>
                                  <option value="Highly Professional & Brief">Highly Professional & Brief</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-[8.5px] font-mono text-slate-500 block mb-0.5">Humour Level</label>
                                <select
                                  value={p8SelectedProfile.humourLevel}
                                  onChange={(e) => setP8SelectedProfile({ ...p8SelectedProfile, humourLevel: e.target.value })}
                                  className="w-full bg-slate-900 border border-slate-800 text-white rounded px-2 py-1 outline-none text-[10px]"
                                >
                                  <option value="Low">Low</option>
                                  <option value="Medium">Medium</option>
                                  <option value="High">High</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-[8.5px] font-mono text-slate-500 block mb-0.5">Explanation Format</label>
                                <select
                                  value={p8SelectedProfile.explanationStyle}
                                  onChange={(e) => setP8SelectedProfile({ ...p8SelectedProfile, explanationStyle: e.target.value })}
                                  className="w-full bg-slate-900 border border-slate-800 text-white rounded px-2 py-1 outline-none text-[10px]"
                                >
                                  <option value="Detailed & Grounded">Detailed & Grounded</option>
                                  <option value="Short & Punchy">Short & Punchy</option>
                                  <option value="Deep Relational Steps">Deep Relational Steps</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-[8.5px] font-mono text-slate-500 block mb-0.5">Voice Tone</label>
                                <select
                                  value={p8SelectedProfile.preferredVoice}
                                  onChange={(e) => setP8SelectedProfile({ ...p8SelectedProfile, preferredVoice: e.target.value })}
                                  className="w-full bg-slate-900 border border-slate-800 text-white rounded px-2 py-1 outline-none text-[10px]"
                                >
                                  <option value="Warm Male">Warm Male</option>
                                  <option value="Calming Female">Calming Female</option>
                                  <option value="Synthetic Mono">Synthetic Mono</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* SQLite Memories Database Panel */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">
                                SQLite MEMORY DB EXPLORER (memories Table)
                              </span>
                              <div className="flex space-x-1">
                                <button
                                  onClick={exportP8Memories}
                                  className="text-[8px] font-mono px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded hover:text-white"
                                >
                                  EXPORT
                                </button>
                                <button
                                  onClick={importP8BackupSim}
                                  className="text-[8px] font-mono px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded hover:text-white"
                                >
                                  IMPORT
                                </button>
                                <button
                                  onClick={clearAllP8Memories}
                                  className="text-[8px] font-mono px-1.5 py-0.5 bg-rose-950/45 text-rose-400 hover:text-rose-300 rounded"
                                >
                                  RESET DB
                                </button>
                              </div>
                            </div>

                            {/* Search bar for Similarity Lookups */}
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={p8SearchQuery}
                                onChange={(e) => runP8MemorySearch(e.target.value)}
                                placeholder="Type to run SQLite similarity vector lookups..."
                                className="flex-1 bg-slate-950 border border-slate-850 text-[10px] text-white rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500/50 font-mono"
                              />
                              {p8SearchQuery && (
                                <button
                                  onClick={() => runP8MemorySearch("")}
                                  className="text-[9px] font-mono text-slate-500 hover:text-slate-300 px-1"
                                >
                                  CLEAR
                                </button>
                              )}
                            </div>

                            {/* Memory Entries List */}
                            <div className="bg-slate-950 rounded-xl border border-slate-900 p-2 max-h-[160px] overflow-y-auto space-y-1.5">
                              {(p8SearchQuery ? p8SearchResults : p8Memories).length === 0 ? (
                                <div className="p-4 text-center font-mono text-[9px] text-slate-600">
                                  No records found in local memories table.
                                </div>
                              ) : (
                                (p8SearchQuery ? p8SearchResults : p8Memories).map((m) => (
                                  <div key={m.id} className="p-2 bg-slate-900/40 rounded-lg border border-slate-900/60 flex justify-between items-start space-x-3 hover:border-slate-800 transition-colors">
                                    <div className="flex-1 space-y-1 text-[9px] font-mono">
                                      <div className="flex items-center space-x-1.5">
                                        <span className="font-bold text-indigo-400">{m.title}</span>
                                        <span className="text-[7.5px] text-slate-400 px-1 py-0.2 bg-slate-950 rounded border border-slate-800">
                                          {m.category}
                                        </span>
                                        <span className="text-[7.5px] text-amber-500 font-sans">
                                          ★ {m.importance}/5
                                        </span>
                                      </div>
                                      <p className="text-[10px] text-slate-300 leading-normal font-sans">{m.content}</p>
                                      <div className="text-[7.5px] text-slate-500 flex space-x-2">
                                        <span>Confidence: {(m.confidence * 100).toFixed(0)}%</span>
                                        <span>Accesses: {m.accessCount}</span>
                                        <span>Created: {m.createdDate}</span>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => deleteP8Memory(m.id)}
                                      className="text-slate-500 hover:text-rose-400 p-1"
                                      title="Delete Memory node"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>

                            {/* Add Memory Button & Form Toggle */}
                            {!p8ShowForm ? (
                              <button
                                onClick={() => setP8ShowForm(true)}
                                className="w-full py-1.5 border border-dashed border-slate-800 hover:border-indigo-500/30 text-[9px] font-mono font-bold text-indigo-400 rounded-lg hover:bg-slate-950/20"
                              >
                                + WRITE NEW MEMORY NODE INTO SQLITE
                              </button>
                            ) : (
                              <div className="p-3 bg-slate-950/90 border border-slate-850 rounded-xl space-y-2.5">
                                <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">NEW MEMORY TRANSACT FORM</span>
                                <div className="grid grid-cols-2 gap-2 font-mono text-[9px]">
                                  <input
                                    type="text"
                                    placeholder="Memory Title"
                                    value={p8NewMemTitle}
                                    onChange={(e) => setP8NewMemTitle(e.target.value)}
                                    className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white"
                                  />
                                  <select
                                    value={p8NewMemCategory}
                                    onChange={(e) => setP8NewMemCategory(e.target.value)}
                                    className="bg-slate-900 border border-slate-800 rounded px-1 py-1 text-white"
                                  >
                                    <option value="UserPreference">User Preference</option>
                                    <option value="Social">Social Connection</option>
                                    <option value="Location">Location Context</option>
                                    <option value="Habit">Habit Profile</option>
                                    <option value="Work">Work & Goals</option>
                                  </select>
                                </div>
                                <textarea
                                  placeholder="Memory Content Detail..."
                                  value={p8NewMemContent}
                                  onChange={(e) => setP8NewMemContent(e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white h-12 text-[10px] font-sans"
                                />
                                <div className="flex justify-between items-center text-[9px] font-mono">
                                  <div className="flex items-center space-x-1.5">
                                    <span className="text-slate-500">Importance:</span>
                                    <select
                                      value={p8NewMemImportance}
                                      onChange={(e) => setP8NewMemImportance(parseInt(e.target.value))}
                                      className="bg-slate-900 border border-slate-800 rounded px-1 text-white"
                                    >
                                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                  </div>
                                  <div className="flex space-x-1.5">
                                    <button
                                      onClick={() => setP8ShowForm(false)}
                                      className="px-2 py-1 bg-slate-900 text-slate-400 border border-slate-800 rounded hover:text-white"
                                    >
                                      CANCEL
                                    </button>
                                    <button
                                      onClick={() => saveP8Memory(p8NewMemTitle, p8NewMemContent, p8NewMemCategory, p8NewMemImportance)}
                                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold"
                                    >
                                      SAVE TO DB
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Safety Confirmation Overlay inside simulator */}
                            {p8ConfirmationPending && (
                              <div className="p-3 bg-amber-950/20 border border-amber-800/30 rounded-xl space-y-2 mt-2">
                                <div className="flex items-start space-x-2">
                                  <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                  <div className="flex-1 text-[10px]">
                                    <span className="font-bold text-amber-400 block">EXPLICIT SECURITY GATE FOR SENSITIVE MEMORY</span>
                                    <span className="text-slate-300">
                                      Jarvis requests user confirmation to persist sensitive data (Category: <strong className="text-amber-300">{p8PendingMemory?.category}</strong>, Importance: <strong className="text-amber-300">{p8PendingMemory?.importance}</strong>):
                                      <blockquote className="border-l border-amber-800/50 pl-2 mt-1 italic text-slate-400 font-sans">"{p8PendingMemory?.content}"</blockquote>
                                    </span>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleP8Confirmation(true)}
                                    className="flex-1 py-1 text-[9px] font-mono font-bold bg-amber-600 text-white rounded hover:bg-amber-500 active:scale-95"
                                  >
                                    APPROVE PERSISTENCE
                                  </button>
                                  <button
                                    onClick={() => handleP8Confirmation(false)}
                                    className="flex-1 py-1 text-[9px] font-mono font-bold bg-slate-950 text-slate-400 border border-slate-800 rounded hover:text-slate-200 active:scale-95"
                                  >
                                    REJECT & DISCARD
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Knowledge Graph Semantic Visualizer */}
                          <div className="space-y-2 border-t border-slate-900 pt-3 text-[9px] font-mono">
                            <span className="text-slate-500 font-bold uppercase block">
                              LOCAL COGNITIVE KNOWLEDGE GRAPH (memories RELATION LINKS)
                            </span>
                            <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 space-y-2">
                              <div className="flex justify-between items-center text-[8.5px] text-slate-500 mb-1.5">
                                <span>SIMULATED DIRECTIONAL SEMANTIC EDGES</span>
                                <span>NODE SEARCH GROUNDING</span>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 max-h-[85px] overflow-y-auto">
                                {p8KnowledgeGraph.map((edge, i) => (
                                  <div key={i} className="p-1.5 bg-slate-900/60 rounded border border-slate-900 flex flex-col space-y-0.5 text-center hover:border-slate-800 transition-all">
                                    <span className="text-slate-400 font-bold font-sans truncate">{edge.source}</span>
                                    <span className="text-[7px] text-indigo-400 uppercase tracking-wider">{edge.relation}</span>
                                    <span className="text-slate-400 font-bold font-sans truncate">{edge.target}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* Column 2: Context Packager Compiler & Proactive Suggestions */}
                        <div className="xl:col-span-5 flex flex-col space-y-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/60">
                          
                          {/* Context Engine Controller */}
                          <div className="space-y-2.5">
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">
                              ON-DEVICE CONTEXT AGGREGATOR
                            </span>
                            
                            <div className="bg-slate-950 border border-slate-900 p-3 rounded-xl space-y-2.5 text-[9.5px]">
                              {/* Location switch & foreground app slider */}
                              <div className="flex justify-between items-center border-b border-slate-900/80 pb-2">
                                <span className="font-mono text-slate-400">Location Permissions</span>
                                <button
                                  onClick={() => {
                                    setP8LocationEnabled(!p8LocationEnabled);
                                    addFrameworkLog("perm", "LocationProvider", `GPS context permissions: ${!p8LocationEnabled ? "GRANTED" : "REVOKED"}.`);
                                  }}
                                  className={`px-2 py-0.5 rounded text-[8.5px] font-mono border transition-all ${
                                    p8LocationEnabled
                                      ? "bg-indigo-600/10 border-indigo-500 text-indigo-400"
                                      : "bg-slate-900 border-slate-800 text-slate-500"
                                  }`}
                                >
                                  {p8LocationEnabled ? "GRANTED" : "REVOKED"}
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-[8.5px] font-mono">
                                <div>
                                  <span className="text-slate-500 block">FOREGROUND APP</span>
                                  <select
                                    value={p8CurrentApp}
                                    onChange={(e) => {
                                      setP8CurrentApp(e.target.value);
                                      addFrameworkLog("info", "ActivityManager", `Foreground activity updated to: ${e.target.value}`);
                                    }}
                                    className="bg-slate-900 text-slate-300 border border-slate-800 rounded px-1.5 py-0.5 outline-none w-full mt-0.5 text-[9px]"
                                  >
                                    <option value="com.android.studio">Android Studio</option>
                                    <option value="com.android.chrome">Chrome Browser</option>
                                    <option value="com.google.android.youtube">YouTube</option>
                                    <option value="com.whatsapp">WhatsApp</option>
                                  </select>
                                </div>
                                <div>
                                  <span className="text-slate-500 block">BATTERY LEVEL</span>
                                  <div className="flex items-center space-x-1.5 mt-0.5">
                                    <input
                                      type="range"
                                      min="5"
                                      max="100"
                                      value={p8BatteryLevel}
                                      onChange={(e) => setP8BatteryLevel(parseInt(e.target.value))}
                                      className="w-16 h-1 bg-slate-900 rounded cursor-pointer accent-indigo-500"
                                    />
                                    <span className="text-slate-300 font-bold">{p8BatteryLevel}%</span>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={compileP8Context}
                                disabled={p8IsCompilingContext}
                                className={`w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
                                  p8IsCompilingContext ? "opacity-60 cursor-wait animate-pulse" : "active:scale-[0.98]"
                                }`}
                              >
                                {p8IsCompilingContext ? (
                                  <>
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    <span>COMPILING TELEMETRY...</span>
                                  </>
                                ) : (
                                  <>
                                    <Cpu className="w-3.5 h-3.5" />
                                    <span>COMPILE & SERIALIZE SYSTEM CONTEXT</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Compiled Payload Output Area */}
                            {p8CompiledPayload && (
                              <div className="space-y-1.5">
                                <span className="text-[8.5px] font-mono text-slate-500 block">SERIALIZED PROMPT PACKAGE (SENT TO LLM)</span>
                                <div className="bg-slate-950 border border-slate-900 p-2 rounded-xl text-[8.5px] font-mono text-indigo-300 max-h-[140px] overflow-y-auto leading-tight select-all">
                                  <pre className="whitespace-pre-wrap">{p8CompiledPayload}</pre>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Multi-turn Chat & Pronoun Context Tracker Chatbot */}
                          <div className="space-y-2 border-t border-slate-900 pt-3">
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">
                              MULTI-TURN CONVERSATION CHAT (CONVERSATIONAL MEMORY)
                            </span>
                            
                            <div className="bg-slate-950 border border-slate-900 rounded-xl p-2.5 flex flex-col h-[200px]">
                              {/* Chat message thread */}
                              <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-2">
                                {p8ChatHistory.map((ch, i) => (
                                  <div key={i} className={`flex flex-col ${ch.sender === "user" ? "items-end" : "items-start"}`}>
                                    <div className={`p-2 rounded-xl text-[9.5px] leading-relaxed max-w-[85%] ${
                                      ch.sender === "user"
                                        ? "bg-indigo-600 text-white rounded-tr-none font-sans"
                                        : "bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none font-sans"
                                    }`}>
                                      {ch.text}
                                    </div>
                                    <span className="text-[7.5px] text-slate-500 font-mono mt-0.5 px-1">{ch.timestamp}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Input box */}
                              <div className="flex space-x-1 shrink-0">
                                <input
                                  type="text"
                                  value={p8ChatQuery}
                                  onChange={(e) => setP8ChatQuery(e.target.value)}
                                  onKeyDown={(e) => e.key === "Enter" && sendP8ChatQuery()}
                                  placeholder="Try: 'Who is Rahul?' or 'What is his focus?'"
                                  className="flex-1 bg-slate-900 border border-slate-850 text-[10px] text-white rounded-lg px-2 py-1 outline-none focus:border-indigo-500 font-sans"
                                />
                                <button
                                  onClick={sendP8ChatQuery}
                                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded-lg text-[9px] font-bold font-mono"
                                >
                                  SEND
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Personalization: Habits & Proactive Suggestions */}
                          <div className="space-y-2 border-t border-slate-900 pt-3 text-[9px] font-mono">
                            <span className="text-slate-500 font-bold uppercase block">
                              PERSONALIZATION & PROACTIVE WORKFLOW SUGGESTIONS
                            </span>
                            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900 space-y-2">
                              {p8ActiveSuggestions.map((sug) => (
                                <div key={sug.id} className="p-2 bg-slate-900/40 rounded-lg border border-slate-900 space-y-1.5">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[7.5px] font-bold text-indigo-400 uppercase tracking-wider">
                                      [{sug.category}] SUGGESTION
                                    </span>
                                    <span className={`text-[7.5px] font-bold ${
                                      sug.status === "approved" ? "text-emerald-400" : sug.status === "rejected" ? "text-slate-500" : "text-amber-400"
                                    }`}>
                                      {sug.status.toUpperCase()}
                                    </span>
                                  </div>
                                  <p className="text-[9.5px] text-slate-300 font-sans leading-normal">{sug.text}</p>
                                  
                                  {sug.status === "pending" && (
                                    <div className="flex space-x-2 pt-0.5">
                                      <button
                                        onClick={() => handleP8SuggestionAction(sug.id, true)}
                                        className="flex-1 py-0.5 bg-indigo-600/15 border border-indigo-500/25 text-indigo-400 rounded text-[8px] hover:bg-indigo-600 hover:text-white transition-all"
                                      >
                                        YES, EXECUTE
                                      </button>
                                      <button
                                        onClick={() => handleP8SuggestionAction(sug.id, false)}
                                        className="flex-1 py-0.5 bg-slate-900 border border-slate-850 text-slate-500 rounded text-[8px] hover:text-slate-300 transition-all"
                                      >
                                        DISMISS
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  )}

                  {/* Part 9: Automation Engine, Skills & Smart Actions Simulator */}
                  {architectureSubTab === "part9" && (
                    <div className="mt-8 pt-6 border-t border-slate-900/80 space-y-6">
                      <div>
                        <span className="text-[10px] font-bold text-teal-400 tracking-wider uppercase font-mono block mb-1">
                          AUTOMATION ENGINE & SMART ACTIONS (PART 9 SIMULATOR)
                        </span>
                        <h4 className="text-sm font-semibold text-slate-100 font-display">
                          On-Device Automation Engine, Skill Register, & Action Chains Pipeline
                        </h4>
                        <p className="text-[11px] text-slate-400 leading-normal mt-0.5 font-sans">
                          Inspect Jarvis's plug-in Skill Register (25 production Android system skills), build and simulate complex multi-step Action Chains, trigger custom macro-routines, set-up event-driven scheduled triggers, view security confirmation gates, and review system execution history logs.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                        {/* Column 1: Skill Registry (25 Skills) */}
                        <div className="xl:col-span-5 flex flex-col space-y-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/60 max-h-[850px] overflow-y-auto">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[9.5px] font-mono font-bold text-slate-500 uppercase block">
                                PLUG-IN SKILL REGISTRY (25 ON-DEVICE SKILLS)
                              </span>
                              <span className="text-[8px] font-mono text-teal-400 font-bold px-1.5 py-0.5 bg-teal-950/20 rounded border border-teal-900/30">
                                25 LOADED
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-sans leading-normal">
                              Each skill represents a discrete device capability, binding permissions, validation gates, and Android system Intents. Click to inspect source.
                            </p>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {p9Skills.map((sk) => {
                              const isSelected = p9SelectedSkill === sk.name;
                              return (
                                <button
                                  key={sk.name}
                                  onClick={() => setP9SelectedSkill(sk.name)}
                                  className={`p-2.5 rounded-xl border text-left transition-all relative ${
                                    isSelected
                                      ? "bg-indigo-600/10 border-indigo-500 text-white animate-pulse"
                                      : "bg-slate-950/70 border-slate-900 text-slate-300 hover:border-slate-800"
                                  }`}
                                >
                                  <div className="flex items-center space-x-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full ${sk.isSensitive ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                                    <span className="text-[9.5px] font-bold font-mono truncate">{sk.name}</span>
                                  </div>
                                  <span className="text-[7.5px] text-slate-500 block truncate mt-0.5 font-sans leading-tight">
                                    {sk.requiredPermissions.length > 0 ? `${sk.requiredPermissions.length} perms` : 'No perms'}
                                  </span>
                                  {sk.isSensitive && (
                                    <span className="absolute top-1 right-1 text-[7px] text-amber-500/70 bg-amber-500/5 px-1 rounded border border-amber-500/10 font-mono">
                                      GATE
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Selected Skill Detail Panel */}
                          {p9SelectedSkill && (() => {
                            const sk = p9Skills.find(s => s.name === p9SelectedSkill);
                            if (!sk) return null;
                            return (
                              <div className="p-3 bg-slate-950/90 border border-slate-900 rounded-xl space-y-3 mt-2 shrink-0">
                                <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${sk.isSensitive ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                                    <h5 className="text-[11px] font-mono font-bold text-slate-100">{sk.name}.kt</h5>
                                  </div>
                                  <span className={`text-[7.5px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                    sk.isSensitive ? 'bg-amber-950/30 text-amber-400 border border-amber-900/40' : 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/40'
                                  }`}>
                                    {sk.isSensitive ? 'SENSITIVE CONFIRMATION GATE' : 'STAND-ALONE EXECUTION'}
                                  </span>
                                </div>

                                <div className="space-y-2.5 text-[10px] font-sans">
                                  <div>
                                    <span className="text-[7.5px] font-mono text-slate-500 block uppercase">Description</span>
                                    <p className="text-slate-300 leading-normal text-[10.5px]">{sk.description}</p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 font-mono text-[9px]">
                                    <div>
                                      <span className="text-[7.5px] text-slate-500 block uppercase">Required Permissions</span>
                                      <div className="text-slate-300 mt-0.5 max-h-[44px] overflow-y-auto space-y-0.5">
                                        {sk.requiredPermissions.length > 0 ? (
                                          sk.requiredPermissions.map(p => (
                                            <div key={p} className="truncate text-indigo-400 bg-indigo-950/20 px-1 py-0.5 rounded border border-indigo-900/20 text-[8px]">
                                              {p.split('.').pop()}
                                            </div>
                                          ))
                                        ) : (
                                          <span className="text-slate-600">None</span>
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-[7.5px] text-slate-500 block uppercase">Input Parameters</span>
                                      <div className="text-slate-300 mt-0.5 space-y-0.5">
                                        {sk.inputParams.map(p => (
                                          <div key={p} className="truncate text-teal-400 bg-teal-950/20 px-1 py-0.5 rounded border border-teal-900/20 text-[8px]">
                                            {p}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 text-[9px]">
                                    <div>
                                      <span className="text-[7.5px] font-mono text-slate-500 block uppercase">Output Result</span>
                                      <p className="text-slate-300 font-mono leading-tight mt-0.5">{sk.output}</p>
                                    </div>
                                    <div>
                                      <span className="text-[7.5px] font-mono text-slate-500 block uppercase">Confirmation Rules</span>
                                      <p className="text-slate-300 font-sans leading-normal mt-0.5">{sk.confirmationRules}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <span className="text-[7.5px] font-mono text-slate-500 block uppercase">Error Handling / Fallbacks</span>
                                    <p className="text-slate-300 font-sans leading-normal text-[9.5px]">{sk.errorHandling}</p>
                                  </div>

                                  <div className="pt-2 border-t border-slate-900">
                                    <span className="text-[7.5px] font-mono text-slate-500 block uppercase mb-1">Android System Kotlin Implementation</span>
                                    <div className="bg-slate-950 border border-slate-900 p-2 rounded-lg text-[8.5px] font-mono text-indigo-300 max-h-[140px] overflow-y-auto leading-tight select-all">
                                      <pre className="whitespace-pre-wrap">{sk.executionLogic}</pre>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Column 2: Live Orchestrator & Multi-Step Action Chaining Simulator */}
                        <div className="xl:col-span-7 flex flex-col space-y-4">
                          
                          {/* Live Interactive Command Console */}
                          <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/60 space-y-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-[9px] font-mono font-bold text-indigo-400 tracking-wider uppercase block">
                                  LIVE AUTOMATION ENGINE PIPELINE
                                </span>
                                <h4 className="text-[12px] font-semibold text-slate-100 font-display">Command Execution & Action Chaining Board</h4>
                              </div>
                              <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full ${
                                p9IsRunning ? "bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 animate-pulse" : "bg-slate-950 border border-slate-900 text-slate-500"
                              }`}>
                                {p9IsRunning ? "PIPELINE RUNNING" : "PIPELINE STANDBY"}
                              </span>
                            </div>

                            {/* Spoken Feedback Banner */}
                            <div className="p-2.5 bg-slate-950 border border-slate-900 rounded-xl flex items-center space-x-2.5 shrink-0">
                              <Volume2 className="w-4 h-4 text-teal-400 animate-pulse" />
                              <div className="flex-1 min-w-0">
                                <span className="text-[7px] font-mono text-slate-500 block uppercase leading-none">Voice Feedback Stream</span>
                                <span className="text-[10px] font-bold text-teal-400 truncate block leading-normal mt-0.5">{p9VoiceFeedback}</span>
                              </div>
                            </div>

                            {/* Command input / templates */}
                            <div className="space-y-2">
                              <span className="text-[8.5px] font-mono text-slate-500 block">SUBMIT NATURAL LANGUAGE COMMANDS</span>
                              <div className="flex space-x-1.5">
                                <input
                                  type="text"
                                  value={p9CommandInput}
                                  onChange={(e) => setP9CommandInput(e.target.value)}
                                  onKeyDown={(e) => e.key === "Enter" && runP9Automation(p9CommandInput)}
                                  placeholder="e.g., Open YouTube and reduce brightness to 40%"
                                  disabled={p9IsRunning}
                                  className="flex-1 bg-slate-950 border border-slate-850 text-slate-100 text-[10.5px] px-3 py-1.5 rounded-xl outline-none focus:border-indigo-500 font-sans"
                                />
                                <button
                                  onClick={() => runP9Automation(p9CommandInput)}
                                  disabled={p9IsRunning || !p9CommandInput.trim()}
                                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-900 disabled:text-slate-500 text-white rounded-xl text-[10px] font-bold font-mono transition-all"
                                >
                                  EXECUTE
                                </button>
                              </div>

                              {/* Templates & Examples of Chaining */}
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                <button
                                  onClick={() => runP9Automation("Open YouTube and reduce brightness to 40%")}
                                  className="text-[8px] font-mono bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 text-indigo-400 px-2 py-1 rounded"
                                >
                                  [CHAIN] YouTube & Brightness
                                </button>
                                <button
                                  onClick={() => runP9Automation("Call Mom immediately")}
                                  className="text-[8px] font-mono bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 text-amber-400 px-2 py-1 rounded"
                                >
                                  [SENSITIVE] Call Mom
                                </button>
                                <button
                                  onClick={() => runP9Automation("Turn on Wi-Fi and open browser")}
                                  className="text-[8px] font-mono bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 text-emerald-400 px-2 py-1 rounded"
                                >
                                  [RECOVERY] Wi-Fi & Browser
                                </button>
                              </div>
                            </div>

                            {/* Active Task Sequential Stage Pipeline Flow */}
                            {p9ActiveTask && (
                              <div className="space-y-3 border-t border-slate-900 pt-3">
                                <div className="flex justify-between items-center text-[9px] font-mono">
                                  <span className="text-slate-500 font-bold uppercase">PIPELINE TASK EXECUTION CHART</span>
                                  <span className={`font-bold ${
                                    p9ActiveTask.status === "SUCCESS" ? "text-emerald-400" :
                                    p9ActiveTask.status === "FAILED" ? "text-rose-400" :
                                    p9ActiveTask.status === "WAITING_CONFIRMATION" ? "text-amber-400" : "text-indigo-400 animate-pulse"
                                  }`}>
                                    {p9ActiveTask.status}
                                  </span>
                                </div>

                                {/* Component Sequence Flow */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-[8.5px] font-mono shrink-0">
                                  <div className={`p-1.5 rounded border ${p9ActiveTask.status !== "PENDING" ? "bg-indigo-950/15 border-indigo-900 text-indigo-300" : "bg-slate-950 border-slate-900 text-slate-600"}`}>
                                    <div className="font-bold uppercase tracking-wider">Intent</div>
                                    <div className="text-[7.5px] text-slate-500 mt-0.5">Matched</div>
                                  </div>
                                  <div className={`p-1.5 rounded border ${p9ActiveTask.status !== "PENDING" && p9ActiveTask.status !== "PLANNING" ? "bg-indigo-950/15 border-indigo-900 text-indigo-300" : "bg-slate-950 border-slate-900 text-slate-600"}`}>
                                    <div className="font-bold uppercase tracking-wider">Planner</div>
                                    <div className="text-[7.5px] text-slate-500 mt-0.5">DAG Created</div>
                                  </div>
                                  <div className={`p-1.5 rounded border ${p9ActiveTask.status === "EXECUTING" || p9ActiveTask.status === "SUCCESS" || p9ActiveTask.status === "WAITING_CONFIRMATION" ? "bg-indigo-950/15 border-indigo-900 text-indigo-300 animate-pulse" : "bg-slate-950 border-slate-900 text-slate-600"}`}>
                                    <div className="font-bold uppercase tracking-wider">Validator</div>
                                    <div className="text-[7.5px] text-slate-500 mt-0.5">Checked</div>
                                  </div>
                                  <div className={`p-1.5 rounded border ${p9ActiveTask.status === "EXECUTING" || p9ActiveTask.status === "SUCCESS" ? "bg-indigo-950/15 border-indigo-900 text-indigo-300" : "bg-slate-950 border-slate-900 text-slate-600"}`}>
                                    <div className="font-bold uppercase tracking-wider">Executor</div>
                                    <div className="text-[7.5px] text-slate-500 mt-0.5">Fired</div>
                                  </div>
                                  <div className={`p-1.5 rounded border ${p9ActiveTask.status === "SUCCESS" ? "bg-teal-950/15 border-teal-900 text-teal-300" : "bg-slate-950 border-slate-900 text-slate-600"}`}>
                                    <div className="font-bold uppercase tracking-wider">Result</div>
                                    <div className="text-[7.5px] text-slate-500 mt-0.5">Verified</div>
                                  </div>
                                  <div className={`p-1.5 rounded border ${p9ActiveTask.status === "SUCCESS" ? "bg-teal-950/15 border-teal-900 text-teal-300" : "bg-slate-950 border-slate-900 text-slate-600"}`}>
                                    <div className="font-bold uppercase tracking-wider">Voice</div>
                                    <div className="text-[7.5px] text-slate-500 mt-0.5">Dispatched</div>
                                  </div>
                                </div>

                                {/* Sequential Steps execution status list */}
                                <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-900">
                                  {p9ActiveTask.steps.map((st: any, sIdx: number) => {
                                    return (
                                      <div key={sIdx} className="flex items-start justify-between text-[10px] font-mono py-1.5 border-b border-slate-900/65 last:border-0">
                                        <div className="space-y-0.5 text-left">
                                          <div className="flex items-center space-x-1.5">
                                            <span className="text-[8px] text-slate-500 font-bold">STEP {sIdx + 1}:</span>
                                            <span className="font-bold text-slate-200">{st.skillName}</span>
                                          </div>
                                          <p className="text-[9px] text-slate-400 font-sans leading-relaxed">{st.log}</p>
                                        </div>

                                        <div className="flex items-center space-x-2 shrink-0">
                                          <span className={`text-[8.5px] font-bold uppercase ${
                                            st.state === "success" ? "text-emerald-400" :
                                            st.state === "failed" ? "text-rose-400" :
                                            st.state === "running" ? "text-indigo-400 animate-pulse" :
                                            st.state === "confirmation_needed" ? "text-amber-400 animate-bounce" : "text-slate-600"
                                          }`}>
                                            {st.state}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Interactive Confirmation UI (Explicit Safety Gate) */}
                                {p9ActiveTask.status === "WAITING_CONFIRMATION" && (
                                  <div className="p-3 bg-amber-950/20 border border-amber-900/35 rounded-xl space-y-2 text-center animate-pulse">
                                    <AlertTriangle className="w-5 h-5 text-amber-400 mx-auto" />
                                    <div>
                                      <h6 className="text-[11px] font-bold text-amber-400 font-mono">EXPLICIT SECURITY CONFIRMATION REQUIRED</h6>
                                      <p className="text-[10px] text-slate-300 font-sans leading-normal max-w-[80%] mx-auto mt-0.5">
                                        You are attempting to execute a SENSITIVE device action that could trigger privacy leaks or carrier charges. Approve below?
                                      </p>
                                    </div>
                                    <div className="flex space-x-3 justify-center pt-1">
                                      <button
                                        onClick={() => handleP9Confirmation(true)}
                                        className="px-4 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-bold rounded-lg transition-all"
                                      >
                                        CONFIRM & EXECUTE
                                      </button>
                                      <button
                                        onClick={() => handleP9Confirmation(false)}
                                        className="px-4 py-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] font-bold rounded-lg border border-slate-800 transition-all"
                                      >
                                        DENY / CANCEL
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Interactive Failure Recovery UI */}
                                {p9ActiveTask.status === "FAILED" && p9ActiveTask.steps.some((s: any) => s.skillName === "WiFiSkill" && s.state === "failed") && (
                                  <div className="p-3 bg-rose-950/20 border border-rose-900/35 rounded-xl space-y-2 text-center">
                                    <RefreshCw className="w-5 h-5 text-rose-400 mx-auto animate-spin" />
                                    <div>
                                      <h6 className="text-[11px] font-bold text-rose-400 font-mono">AUTOMATED PIPELINE RECOVERY SOLVER AVAILABLE</h6>
                                      <p className="text-[10px] text-slate-300 font-sans leading-normal max-w-[80%] mx-auto mt-0.5">
                                        WiFiSkill failed because the physical Wi-Fi radio is currently disabled. Would you like the system to enable it automatically?
                                      </p>
                                    </div>
                                    <div className="flex space-x-3 justify-center pt-1">
                                      <button
                                        onClick={() => handleP9RecoveryAction(true)}
                                        className="px-4 py-1 bg-teal-600 hover:bg-teal-500 text-white text-[10px] font-bold rounded-lg transition-all"
                                      >
                                        YES, ENABLE & RESUME
                                      </button>
                                      <button
                                        onClick={() => handleP9RecoveryAction(false)}
                                        className="px-4 py-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] font-bold rounded-lg border border-slate-800 transition-all"
                                      >
                                        SKIP ACTION
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Live Execution Tracer Output */}
                            {p9LogTracer.length > 0 && (
                              <div className="space-y-1.5 border-t border-slate-900 pt-3 text-left">
                                <span className="text-[8.5px] font-mono text-slate-500 block">PIPELINE INTERNAL EXECUTION LOGS</span>
                                <div className="bg-slate-950 border border-slate-900 p-2.5 rounded-xl text-[8.5px] font-mono text-indigo-300 max-h-[140px] overflow-y-auto leading-tight select-all">
                                  {p9LogTracer.map((log, lIdx) => (
                                    <div key={lIdx} className="border-b border-slate-900/40 py-0.5 last:border-0">
                                      {log}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Routines, Shortcuts & Scheduled Triggers Tabs */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {/* Macro Routines Panel */}
                            <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/60 space-y-3">
                              <div className="text-left">
                                <span className="text-[9px] font-mono font-bold text-indigo-400 block uppercase font-mono">MACRO-ROUTINES WORKFLOWS</span>
                                <h5 className="text-[11.5px] font-bold text-slate-200">Pre-Configured Macro-Commands</h5>
                              </div>
                              <div className="space-y-2">
                                {p9Routines.map((r) => (
                                  <div key={r.name} className="p-2.5 bg-slate-950 border border-slate-900 rounded-lg flex justify-between items-start space-x-2 text-left">
                                    <div className="space-y-1 min-w-0">
                                      <span className="text-[10px] font-bold text-slate-200 block">{r.name}</span>
                                      <p className="text-[9px] text-slate-400 font-sans leading-normal">{r.description}</p>
                                      <div className="flex flex-wrap gap-1 pt-1">
                                        {r.commands.map((cmd, cIdx) => (
                                          <span key={cIdx} className="text-[7.5px] font-mono px-1.5 py-0.5 bg-slate-900 text-slate-500 rounded border border-slate-850 truncate max-w-[140px]">
                                            {cmd}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => runP9Automation(`Execute ${r.name} routine`)}
                                      disabled={p9IsRunning}
                                      className="p-1 bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/25 hover:text-white text-indigo-400 rounded transition-all shrink-0 cursor-pointer"
                                    >
                                      <Play className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Scheduled Automations & Triggers Panel */}
                            <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/60 space-y-3 text-left">
                              <div>
                                <span className="text-[9px] font-mono font-bold text-indigo-400 block uppercase font-mono">EVENT-DRIVEN TRIGGERS</span>
                                <h5 className="text-[11.5px] font-bold text-slate-200">Background Trigger Scheduler</h5>
                              </div>
                              <div className="space-y-2">
                                {p9Schedules.map((s) => (
                                  <div key={s.id} className="p-2.5 bg-slate-950 border border-slate-900 rounded-lg flex items-center justify-between space-x-2">
                                    <div className="space-y-0.5 min-w-0">
                                      <div className="flex items-center space-x-1.5">
                                        <span className="text-[9.5px] font-bold text-slate-200">{s.title}</span>
                                        <span className="text-[7.5px] font-mono px-1.5 py-0.2 bg-teal-950/20 text-teal-400 rounded border border-teal-900/20">
                                          {s.triggerType}
                                        </span>
                                      </div>
                                      <p className="text-[8.5px] text-slate-500 font-mono truncate">VAL: {s.triggerValue} | CMD: {s.command}</p>
                                    </div>
                                    
                                    {/* Toggle Switch */}
                                    <button
                                      onClick={() => toggleP9Schedule(s.id)}
                                      className={`w-7 h-4 rounded-full p-0.5 transition-all relative cursor-pointer ${
                                        s.isEnabled ? "bg-indigo-600" : "bg-slate-800"
                                      }`}
                                    >
                                      <div className={`w-3 h-3 bg-white rounded-full transition-all ${
                                        s.isEnabled ? "translate-x-3" : "translate-x-0"
                                      }`} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Proactive Recommendations Panel */}
                          <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/60 space-y-3 text-left">
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block font-mono">Proactive Habit Recommendations</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px]">
                              {p9SmartRecs.map((rec) => (
                                <div key={rec.id} className="p-2.5 bg-slate-950 border border-slate-900 rounded-lg flex items-start justify-between space-x-2">
                                  <div className="space-y-1">
                                    <span className="text-[7.5px] font-mono font-bold text-indigo-400 block">PROACTIVE RECOMMENDATION ({rec.type.toUpperCase()})</span>
                                    <p className="text-[9.5px] text-slate-300 font-sans leading-normal">{rec.message}</p>
                                  </div>
                                  <button
                                    onClick={() => runP9Automation(`Execute ${rec.routineName} routine`)}
                                    disabled={p9IsRunning}
                                    className="px-2 py-0.5 bg-indigo-600/10 border border-indigo-500/25 hover:bg-indigo-600 text-indigo-400 hover:text-white text-[8px] font-bold rounded cursor-pointer"
                                  >
                                    ACCEPT
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Historical Automation Logs database table view */}
                          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 space-y-3 text-left">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block font-mono">AUTOMATION_HISTORY SQLITE TABLE logs</span>
                                <h5 className="text-[11.5px] font-bold text-slate-200">Historical Automation Audits</h5>
                              </div>
                              <button
                                onClick={exportP9History}
                                className="text-[8.5px] font-mono font-bold px-2.5 py-1 bg-slate-950 hover:bg-slate-900 text-indigo-400 hover:text-indigo-300 rounded-lg border border-slate-850 transition-all flex items-center space-x-1 cursor-pointer"
                              >
                                <Cpu className="w-3 h-3" />
                                <span>EXPORT SQLITE DB</span>
                              </button>
                            </div>

                            {/* Table search / Filter */}
                            <div className="flex space-x-3">
                              <input
                                type="text"
                                value={p9HistorySearch}
                                onChange={(e) => setP9HistorySearch(e.target.value)}
                                placeholder="Search past logs..."
                                className="flex-1 bg-slate-950 border border-slate-850 text-white rounded-lg px-2.5 py-1 text-[10px] outline-none"
                              />
                              <select
                                value={p9HistoryFilter}
                                onChange={(e) => setP9HistoryFilter(e.target.value as any)}
                                className="bg-slate-950 border border-slate-850 text-slate-400 rounded-lg px-2 text-[10px]"
                              >
                                <option value="ALL">ALL STATUSES</option>
                                <option value="SUCCESS">SUCCESS ONLY</option>
                                <option value="FAILED">FAILED ONLY</option>
                              </select>
                            </div>

                            <div className="overflow-x-auto max-h-[220px] overflow-y-auto">
                              <table className="w-full text-[10px] text-left font-mono">
                                <thead>
                                  <tr className="border-b border-slate-900 text-slate-500 uppercase text-[8px]">
                                    <th className="py-2 pl-2">TIME</th>
                                    <th className="py-2">COMMAND</th>
                                    <th className="py-2">RESULT</th>
                                    <th className="py-2">DURATION</th>
                                    <th className="py-2 pr-2 text-right">ACTION</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {p9History
                                    .filter(h => {
                                      const matchQ = h.command.toLowerCase().includes(p9HistorySearch.toLowerCase());
                                      const matchStatus = p9HistoryFilter === "ALL" || h.result === p9HistoryFilter;
                                      return matchQ && matchStatus;
                                    })
                                    .map((h) => (
                                      <tr key={h.id} className="border-b border-slate-950/70 hover:bg-slate-950/30">
                                        <td className="py-2 pl-2 text-slate-400">{h.time}</td>
                                        <td className="py-2 font-sans font-medium text-slate-200">
                                          <div>{h.command}</div>
                                          <div className="text-[7.5px] text-slate-500 font-mono">PERMS: {h.permissions.length > 0 ? h.permissions.join(", ") : "NONE"}</div>
                                        </td>
                                        <td className="py-2">
                                          <span className={`text-[9px] font-bold ${h.result === "SUCCESS" ? "text-emerald-400" : "text-rose-400"}`}>
                                            {h.result}
                                          </span>
                                        </td>
                                        <td className="py-2 text-indigo-400">{h.duration} ms</td>
                                        <td className="py-2 pr-2 text-right">
                                          <button
                                            onClick={() => deleteP9HistoryItem(h.id)}
                                            className="text-rose-500 hover:text-rose-400 text-[8px] cursor-pointer"
                                          >
                                            DELETE
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  )}

                  {/* Part 10: Premium Layer Simulator */}
                  {architectureSubTab === "part10" && (
                    <div className="space-y-4">
                      {/* Premium Header */}
                      <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-xl">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-sm font-semibold text-white flex items-center space-x-1.5">
                              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                              <span>{JARVIS_SPEC_PART_10.title}</span>
                            </h3>
                            <p className="text-[10px] text-slate-400 mt-0.5">{JARVIS_SPEC_PART_10.subtitle}</p>
                          </div>
                          <span className="px-2 py-0.5 bg-indigo-950 border border-indigo-500/20 text-indigo-400 font-mono text-[8px] uppercase font-bold rounded-full">
                            PHASE 10 ACTIVE
                          </span>
                        </div>
                      </div>

                      {/* Main Two-Column Panel */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        
                        {/* LEFT COLUMN: Floating Assistant Core, Waveforms, Speech Settings (span 5) */}
                        <div className="lg:col-span-5 space-y-4">
                          {/* Liquid Voice Core Card */}
                          {(() => {
                            const themeStyles = {
                              default: {
                                card: "bg-slate-950/80 border-slate-900 shadow-indigo-500/5",
                                text: "text-indigo-400",
                                pulseOuter: "bg-indigo-500/10 border-indigo-500/20",
                                pulseInner: "bg-indigo-500/20 border-indigo-500/30",
                                coreOrb: "bg-gradient-to-tr from-indigo-600 to-indigo-400 shadow-indigo-500/40"
                              },
                              cyber: {
                                card: "bg-black border-cyan-500/40 shadow-cyan-500/10 border-dashed border-2",
                                text: "text-cyan-400 font-mono",
                                pulseOuter: "bg-cyan-500/5 border-cyan-500/10",
                                pulseInner: "bg-cyan-500/15 border-cyan-500/20",
                                coreOrb: "bg-gradient-to-tr from-cyan-600 to-cyan-300 shadow-cyan-400/40"
                              },
                              oled: {
                                card: "bg-black border-slate-800 shadow-none",
                                text: "text-slate-200",
                                pulseOuter: "bg-slate-800/20 border-slate-700/30",
                                pulseInner: "bg-slate-700/30 border-slate-600/40",
                                coreOrb: "bg-gradient-to-tr from-slate-600 to-slate-400 shadow-slate-500/10"
                              },
                              brass: {
                                card: "bg-slate-950 border-amber-600/30 shadow-amber-500/5",
                                text: "text-amber-400",
                                pulseOuter: "bg-amber-500/5 border-amber-500/10",
                                pulseInner: "bg-amber-500/10 border-amber-500/15",
                                coreOrb: "bg-gradient-to-tr from-amber-700 to-amber-500 shadow-amber-500/30"
                              },
                              nebula: {
                                card: "bg-slate-950 border-purple-500/30 shadow-purple-500/10",
                                text: "text-purple-400",
                                pulseOuter: "bg-purple-500/10 border-purple-500/20",
                                pulseInner: "bg-purple-500/20 border-purple-500/30",
                                coreOrb: "bg-gradient-to-tr from-purple-600 to-purple-400 shadow-purple-500/30"
                              }
                            };
                            const t = themeStyles[p10SelectedTheme] || themeStyles.default;

                            return (
                              <div className={`p-4 rounded-xl border transition-all duration-500 relative overflow-hidden flex flex-col items-center justify-center min-h-[220px] ${t.card}`}>
                                <div className="absolute top-2.5 left-3 flex items-center space-x-1">
                                  <span className={`w-1.5 h-1.5 rounded-full ${simState === "SPEAKING" ? "bg-emerald-400 animate-pulse" : "bg-indigo-400"}`} />
                                  <span className="text-[8px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                                    Floating Assistant Simulator
                                  </span>
                                </div>

                                <div className="absolute top-2 right-2 flex space-x-1.5">
                                  {(["default", "cyber", "oled", "brass", "nebula"] as const).map((themeName) => (
                                    <button
                                      key={themeName}
                                      onClick={() => {
                                        setP10SelectedTheme(themeName);
                                        addFrameworkLog("info", "ThemeSelector", `Premium identity theme changed to: ${themeName.toUpperCase()}`);
                                      }}
                                      className={`w-3.5 h-3.5 rounded-full border transition-all hover:scale-110 active:scale-95 ${
                                        themeName === "default" ? "bg-indigo-600 border-indigo-400" :
                                        themeName === "cyber" ? "bg-cyan-500 border-cyan-300" :
                                        themeName === "oled" ? "bg-slate-950 border-slate-700" :
                                        themeName === "brass" ? "bg-amber-600 border-amber-400" :
                                        "bg-purple-600 border-purple-400"
                                      } ${p10SelectedTheme === themeName ? "ring-2 ring-white scale-105" : "opacity-75"}`}
                                      title={`Switch to ${themeName} identity`}
                                    />
                                  ))}
                                </div>

                                {/* Floating Assistant Animated Liquid Orb */}
                                <div className="relative flex items-center justify-center my-6">
                                  {/* Concentric waves */}
                                  <div className={`absolute w-36 h-36 rounded-full border animate-ping transition-all duration-1000 ${t.pulseOuter}`} />
                                  <div className={`absolute w-28 h-28 rounded-full border animate-pulse transition-all duration-700 ${t.pulseInner}`} />
                                  
                                  {/* Fluid Liquid Orb core */}
                                  <div className={`w-16 h-16 rounded-full flex items-center justify-center relative z-10 shadow-lg ${t.coreOrb}`}>
                                    <Mic className="w-6 h-6 text-slate-950" />
                                  </div>
                                </div>

                                <span className={`text-[10px] font-semibold uppercase tracking-wider text-center mt-2 ${t.text}`}>
                                  {simState === "SPEAKING" ? "Jarvis vocal stream active..." :
                                   deviceState.isListening ? "Porcupine Wake/STT listening..." :
                                   deviceState.isProcessing ? "Gemini analyzing buffer..." :
                                   "Wake Engine Standby"}
                                </span>
                                <p className="text-[8px] text-slate-400 text-center mt-0.5 font-mono max-w-[240px]">
                                  Try: "Hey Jarvis, what's my agenda?" or click the interrupt console below.
                                </p>
                              </div>
                            );
                          })()}

                          {/* Full-Duplex Barge-In Test Console */}
                          <div className="p-4 bg-slate-950/85 border border-slate-900 rounded-xl space-y-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1">
                              <Fingerprint className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Duplex Interruption Testbed</span>
                            </span>

                            <div className="grid grid-cols-2 gap-2">
                              {/* Simulate Vocal Output Trigger */}
                              <button
                                onClick={async () => {
                                  setP10ActiveScenario("speaking");
                                  addFrameworkLog("power", "DuplexLoop", "Starting simulation: Jarvis reading continuous morning update.");
                                  await speakJarvisResponse("This is Jarvis. Your schedule today contains three meetings, starting with the Product Team Sync at 9:00 AM. Also, your smartwatch detected high-fidelity athletic recovery cycles last night, and your offline Android intent buffer is fully synchronized.");
                                }}
                                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[9px] font-semibold flex items-center justify-center space-x-1 active:scale-95 transition-all cursor-pointer"
                              >
                                <Play className="w-3 h-3" />
                                <span>Simulate Jarvis Speech</span>
                              </button>

                              {/* Barge-In Interrupt Trigger */}
                              <button
                                onClick={() => {
                                  // Stop playback
                                  if (activeAudioSourceRef.current) {
                                    try { activeAudioSourceRef.current.stop(); } catch(e) {}
                                    activeAudioSourceRef.current = null;
                                  }
                                  window.speechSynthesis.cancel();
                                  setSimState("WAKE_LISTENING");
                                  setP10ActiveScenario("interrupted");
                                  addFrameworkLog("broadcast", "BargeInController", "BARGE-IN DETECTED: Interrupted spoken stream with wake keyword 'Stop'. Listening reactivated.");
                                }}
                                disabled={simState !== "SPEAKING"}
                                className={`px-3 py-2 rounded-lg text-[9px] font-semibold flex items-center justify-center space-x-1 transition-all ${
                                  simState === "SPEAKING"
                                    ? "bg-amber-600 hover:bg-amber-500 text-white animate-pulse cursor-pointer shadow-lg shadow-amber-500/20"
                                    : "bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed"
                                }`}
                              >
                                <Pause className="w-3 h-3" />
                                <span>Barge-In (Stop)</span>
                              </button>
                            </div>

                            {/* Live status tracer */}
                            <div className="bg-slate-950 p-2.5 border border-slate-900 rounded-lg text-[8.5px] leading-relaxed text-slate-300 font-mono space-y-1">
                              <div className="flex items-center justify-between text-[7.5px] text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-1 mb-1">
                                <span>Pipeline Step</span>
                                <span>Status</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">1. Porcupine Hotword detection</span>
                                <span className="text-emerald-400 font-bold">READY</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">2. Duplex Echo Cancellation (AEC)</span>
                                <span className="text-emerald-400 font-bold">ARMED</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">3. Continuous barge-in listen</span>
                                <span className={simState === "SPEAKING" ? "text-amber-400 font-bold animate-pulse" : "text-slate-400"}>
                                  {simState === "SPEAKING" ? "ACTIVE" : "STANDBY"}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">4. Premium Vocal Synthesis</span>
                                <span className={simState === "SPEAKING" ? "text-emerald-400 font-bold" : "text-slate-500"}>
                                  {simState === "SPEAKING" ? "PLAYING" : "IDLE"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Premium TTS Customizer Settings */}
                          <div className="p-4 bg-slate-950/85 border border-slate-900 rounded-xl space-y-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                              <Settings className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Premium Voice Synthesizer Configuration</span>
                            </span>

                            <div className="space-y-2 text-[10px]">
                              {/* Premium Voice Switch */}
                              <div className="flex items-center justify-between p-2 bg-slate-950 border border-slate-900 rounded-lg">
                                <div>
                                  <span className="text-slate-200 block font-semibold">Enable High-Definition Gemini TTS</span>
                                  <span className="text-[8px] text-slate-500">Fetches neural speech buffers instead of local device TTS</span>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={premiumVoiceEnabled}
                                  onChange={(e) => {
                                    setPremiumVoiceEnabled(e.target.checked);
                                    addFrameworkLog("info", "PremiumTTS", `HD Speech synthesis: ${e.target.checked ? "ENABLED" : "DISABLED"}`);
                                  }}
                                  className="rounded border-slate-800 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 bg-slate-900 cursor-pointer"
                                />
                              </div>

                              {/* Voice Selection */}
                              <div className="space-y-1">
                                <label className="text-slate-400 font-medium">Select Voice Profile</label>
                                <select
                                  value={selectedPremiumVoice}
                                  onChange={(e) => {
                                    setSelectedPremiumVoice(e.target.value);
                                    addFrameworkLog("info", "PremiumTTS", `Voice profile configured to: ${e.target.value}`);
                                  }}
                                  className="w-full bg-slate-950 border border-slate-850 text-slate-300 rounded-lg px-2 py-1.5 text-[10px] outline-none"
                                >
                                  <option value="Zephyr">Zephyr (Warm Male - English)</option>
                                  <option value="Aoede">Aoede (Sleek Female - English)</option>
                                  <option value="Charon">Charon (Deep Resonant - Hindi)</option>
                                  <option value="Fenrir">Fenrir (Crisp Assertive - Marathi)</option>
                                  <option value="Kore">Kore (Balanced - Multi-lingual)</option>
                                  <option value="Puck">Puck (Playful - Multi-lingual)</option>
                                </select>
                              </div>

                              {/* Speed / Pitch Controls */}
                              <div className="grid grid-cols-2 gap-3.5 pt-1">
                                <div className="space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Speech Speed</span>
                                    <span className="text-indigo-400 font-mono">{voiceSpeed}x</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="0.5"
                                    max="2.0"
                                    step="0.1"
                                    value={voiceSpeed}
                                    onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                                    className="w-full accent-indigo-500 h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Speech Pitch</span>
                                    <span className="text-indigo-400 font-mono">{voicePitch}x</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="0.5"
                                    max="1.5"
                                    step="0.1"
                                    value={voicePitch}
                                    onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                                    className="w-full accent-indigo-500 h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT COLUMN: Multimodal Perception sandbox (span 7) */}
                        <div className="lg:col-span-7 space-y-4">
                          <div className="p-4 bg-slate-950/85 border border-slate-900 rounded-xl space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Multimodal Perception Core Sandbox</span>
                              </span>
                              <span className="text-[8px] font-mono text-slate-500">Gemini 3.5 Multimodal Stream</span>
                            </div>

                            {/* Preset attachment pickers */}
                            <div className="space-y-1.5">
                              <label className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold block">
                                Quick Simulation Attachments
                              </label>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                                <button
                                  onClick={() => {
                                    const pick = { name: "college_id.png", mimeType: "image/png", data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" };
                                    setAttachments(prev => [...prev, pick]);
                                    addFrameworkLog("info", "OCRBrain", "Attached simulated high-contrast College Student ID image.");
                                  }}
                                  className="p-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-[9px] text-slate-300 flex items-center space-x-1.5 transition-all cursor-pointer"
                                >
                                  <Image className="w-3 h-3 text-amber-400 shrink-0" />
                                  <span className="truncate">College_ID.png</span>
                                </button>
                                
                                <button
                                  onClick={() => {
                                    const pick = { name: "aws_invoice.pdf", mimeType: "application/pdf", data: "JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDAKL1R5cGUgL1BhZ2VzCi9Db3VudCAxCi9LaWRzIFsgMyAwIFIgXQo+PgplbmRvYmoKMyAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDIgMCBSCi9NZWRpYUJveCBbIDAgMCA2MTIgNzg0IF0KPj4KZW5kb2JqCnhyZWYKMCA0CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDYyIDAwMDAwIG4gCjAwMDAwMDAxMzEgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA0Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgoyMTEKJSVFT0Y=" };
                                    setAttachments(prev => [...prev, pick]);
                                    addFrameworkLog("info", "PDFParser", "Attached simulated AWS Server Hosting invoice PDF.");
                                  }}
                                  className="p-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-[9px] text-slate-300 flex items-center space-x-1.5 transition-all cursor-pointer"
                                >
                                  <FileText className="w-3 h-3 text-cyan-400 shrink-0" />
                                  <span className="truncate">aws_invoice.pdf</span>
                                </button>

                                <button
                                  onClick={() => {
                                    const pick = { name: "heart_rate.csv", mimeType: "text/csv", data: "dGltZSxyYXRlCjA4OjAwLDcyCjEyOjAwLDg1CjE4OjAwLDEyMA==" };
                                    setAttachments(prev => [...prev, pick]);
                                    addFrameworkLog("info", "CSVAnalyst", "Attached simulated daily athletic vitals csv report.");
                                  }}
                                  className="p-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-[9px] text-slate-300 flex items-center space-x-1.5 transition-all cursor-pointer"
                                >
                                  <FileText className="w-3 h-3 text-emerald-400 shrink-0" />
                                  <span className="truncate">heart_rate.csv</span>
                                </button>

                                <button
                                  onClick={() => {
                                    const pick = { name: "code_sketch.jpg", mimeType: "image/jpeg", data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" };
                                    setAttachments(prev => [...prev, pick]);
                                    addFrameworkLog("info", "OCRBrain", "Attached simulated white-board handwritten system architectural layout screenshot.");
                                  }}
                                  className="p-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-[9px] text-slate-300 flex items-center space-x-1.5 transition-all cursor-pointer"
                                >
                                  <Image className="w-3 h-3 text-purple-400 shrink-0" />
                                  <span className="truncate">code_sketch.jpg</span>
                                </button>
                              </div>
                            </div>

                            {/* Active Attachments Queue list */}
                            <div className="space-y-1.5 bg-slate-950 p-3 border border-slate-900 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                                  Current Multimodal Buffer ({attachments.length})
                                </span>
                                {attachments.length > 0 && (
                                  <button
                                    onClick={() => {
                                      setAttachments([]);
                                      addFrameworkLog("info", "AttachmentManager", "Cleared all attachments from active buffer.");
                                    }}
                                    className="text-[8px] text-rose-400 hover:text-rose-300 font-semibold"
                                  >
                                    Clear All
                                  </button>
                                )}
                              </div>

                              {attachments.length === 0 ? (
                                <div className="text-center py-4 border border-dashed border-slate-850 rounded-lg text-slate-500 text-[9px]">
                                  No files attached. Click simulated presets above or attach files inside the active Chat overlay.
                                </div>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  {attachments.map((att, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-[9px] text-slate-300"
                                    >
                                      {att.mimeType.startsWith("image/") ? (
                                        <Image className="w-3.5 h-3.5 text-indigo-400" />
                                      ) : (
                                        <FileText className="w-3.5 h-3.5 text-indigo-400" />
                                      )}
                                      <div className="flex flex-col">
                                        <span className="font-semibold text-slate-200">{att.name}</span>
                                        <div className="flex items-center space-x-1">
                                          <span className="text-[7.5px] text-slate-500 uppercase font-mono font-bold">{att.mimeType}</span>
                                          {att.isUploading ? (
                                            <span className="text-[7px] text-amber-400 font-mono font-semibold animate-pulse">● Uploading...</span>
                                          ) : att.storageUrl ? (
                                            <span className="text-[7px] text-emerald-400 font-mono font-semibold">✓ Storage</span>
                                          ) : null}
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => {
                                          setAttachments(prev => prev.filter((_, i) => i !== index));
                                          addFrameworkLog("info", "AttachmentManager", `Removed attached file: ${att.name}`);
                                        }}
                                        className="text-slate-400 hover:text-rose-400 font-bold ml-1.5 font-sans"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Direct Query Composer Input */}
                            <div className="space-y-1.5">
                              <label className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">
                                Multimodal Analysis Query
                              </label>
                              <div className="flex space-x-2">
                                <input
                                  type="text"
                                  value={p10ManualText}
                                  onChange={(e) => setP10ManualText(e.target.value)}
                                  placeholder="What should Jarvis perceive?"
                                  className="flex-1 bg-slate-950 border border-slate-850 text-white rounded-lg px-3 py-1.5 text-[10px] outline-none focus:border-indigo-500/50"
                                />
                                <button
                                  onClick={async () => {
                                    if (!p10ManualText.trim()) return;
                                    addFrameworkLog("info", "MultimodalCortex", `Dispatched perception query: "${p10ManualText}" with ${attachments.length} files.`);
                                    setP10VisionResponse("");
                                    setDeviceState(p => ({ ...p, isProcessing: true }));

                                    try {
                                      // Trigger standard message flow which uses actual API endpoint
                                      await handleSendMessage(p10ManualText);
                                      setP10VisionResponse("Analysis completed! Check the scrolling chat assistant overlay to see the fully formulated, context-aware AI text and vocalized outcome.");
                                    } catch (e: any) {
                                      setP10VisionResponse(`Error during perception analysis: ${e.message}`);
                                    } finally {
                                      setDeviceState(p => ({ ...p, isProcessing: false }));
                                    }
                                  }}
                                  disabled={deviceState.isProcessing}
                                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-[9px] font-semibold flex items-center space-x-1 transition-all shrink-0 cursor-pointer"
                                >
                                  <Sparkles className="w-3 h-3 animate-pulse" />
                                  <span>Analyze</span>
                                </button>
                              </div>
                            </div>

                            {/* Sandbox vision output console */}
                            {p10VisionResponse && (
                              <div className="p-3 bg-indigo-950/20 border border-indigo-500/10 rounded-lg text-[9px] text-slate-300 leading-relaxed font-sans space-y-1 animate-fade-in">
                                <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest font-mono block">
                                  Local Sandbox Status
                                </span>
                                <p>{p10VisionResponse}</p>
                              </div>
                            )}

                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Part 11: Security, Privacy, Cloud Sync Dashboard & Testing Simulator */}
                  {architectureSubTab === "part11" && (
                    <div className="space-y-4">
                      {/* Premium Security Header */}
                      <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-xl">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-sm font-semibold text-white flex items-center space-x-1.5">
                              <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
                              <span>{JARVIS_SPEC_PART_11.title}</span>
                            </h3>
                            <p className="text-[10px] text-slate-400 mt-0.5">{JARVIS_SPEC_PART_11.subtitle}</p>
                          </div>
                          <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-500/20 text-emerald-400 font-mono text-[8px] uppercase font-bold rounded-full">
                            SECURE CORE ON
                          </span>
                        </div>
                      </div>

                      {/* Main Layout Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        
                        {/* LEFT COLUMN: Security Gatekeeper, Biometric Scanner, AES Cryptography */}
                        <div className="lg:col-span-6 space-y-4">
                          
                          {/* Biometric Gatekeeper */}
                          <div className="p-4 bg-slate-950/85 border border-slate-900 rounded-xl space-y-3 relative overflow-hidden">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                                <Fingerprint className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Biometric Cryptographic Gatekeeper</span>
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono uppercase font-bold ${
                                isAuthed ? "bg-emerald-950 text-emerald-400 border border-emerald-500/20" : "bg-rose-950 text-rose-400 border border-rose-500/20"
                              }`}>
                                {isAuthed ? "Authenticated" : "Locked"}
                              </span>
                            </div>

                            <p className="text-[10px] text-slate-400 leading-normal">
                              Viewing sensitive user memories or updating core privacy models requires successful fingerprint or face unlock isolation through native Android biometric prompts.
                            </p>

                            <div className="flex space-x-2">
                              {/* Simulate Biometric Trigger */}
                              <button
                                onClick={() => {
                                  addFrameworkLog("info", "BiometricPrompt", "Spawning native BiometricPrompt overlay...");
                                  // Mock scan cycle
                                  const tempLogs = [
                                    "Initializing BiometricPrompt.Builder...",
                                    "Allowed authenticators: BIOMETRIC_STRONG or DEVICE_CREDENTIAL",
                                    "Waiting for hardware sensor callback...",
                                    "Fingerprint matches cryptographic credential key alias com.jarvis.security.secret_key",
                                    "Biometric authentication succeeded!"
                                  ];
                                  tempLogs.forEach((logText, index) => {
                                    setTimeout(() => {
                                      addFrameworkLog("bind", "BiometricSensor", logText);
                                      if (index === tempLogs.length - 1) {
                                        setIsAuthed(true);
                                      }
                                    }, (index + 1) * 350);
                                  });
                                }}
                                className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[9px] font-semibold flex items-center justify-center space-x-1 active:scale-95 transition-all cursor-pointer"
                              >
                                <Fingerprint className="w-3.5 h-3.5" />
                                <span>Verify Biometrics</span>
                              </button>

                              {/* Lock Session */}
                              <button
                                onClick={() => {
                                  setIsAuthed(false);
                                  addFrameworkLog("info", "SecuritySession", "User closed authenticated session. Secure content locked.");
                                }}
                                disabled={!isAuthed}
                                className={`px-3 py-2 rounded-lg text-[9px] font-semibold flex items-center justify-center space-x-1 transition-all ${
                                  isAuthed
                                    ? "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-850 cursor-pointer"
                                    : "bg-slate-950 border border-slate-900 text-slate-600 cursor-not-allowed"
                                }`}
                              >
                                <Lock className="w-3 h-3" />
                                <span>Lock Session</span>
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                              <div className="flex items-center justify-between p-2 bg-slate-950 border border-slate-900 rounded-lg">
                                <span className="text-slate-400">Lock Sensitive Memories</span>
                                <input
                                  type="checkbox"
                                  checked={authLockEnabled}
                                  onChange={(e) => {
                                    setAuthLockEnabled(e.target.checked);
                                    addFrameworkLog("info", "SecurityPolicy", `Require auth for memory viewer: ${e.target.checked ? "ENABLED" : "DISABLED"}`);
                                  }}
                                  className="rounded border-slate-800 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 bg-slate-900 cursor-pointer"
                                />
                              </div>

                              <div className="flex items-center justify-between p-2 bg-slate-950 border border-slate-900 rounded-lg">
                                <span className="text-slate-400">Secure Storage Keys</span>
                                <input
                                  type="checkbox"
                                  checked={secureStorageEnabled}
                                  onChange={(e) => {
                                    setSecureStorageEnabled(e.target.checked);
                                    addFrameworkLog("info", "CryptoKeystore", `AES storage encryption: ${e.target.checked ? "ARMED" : "DISABLED (PLAIN TEXT WARNING)"}`);
                                  }}
                                  className="rounded border-slate-800 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 bg-slate-900 cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>

                          {/* AES KeyStore Sandbox */}
                          <div className="p-4 bg-slate-950/85 border border-slate-900 rounded-xl space-y-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                              <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Keystore AES-256-GCM Crypter Simulator</span>
                            </span>

                            <div className="space-y-2 text-[10px]">
                              <div className="space-y-1">
                                <label className="text-slate-400 font-medium">Plaintext Memory Buffer</label>
                                <input
                                  type="text"
                                  value={cryptoInput}
                                  onChange={(e) => setCryptoInput(e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-850 text-slate-300 rounded-lg px-2.5 py-1.5 text-[10px] outline-none"
                                />
                              </div>

                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    if (!cryptoInput.trim()) return;
                                    addFrameworkLog("info", "CryptoManager", "Requesting hardware-backed secret key com.jarvis.security.secret_key");
                                    addFrameworkLog("info", "CryptoManager", "Performing AES-GCM 128-bit Tag encryption with random IV buffer.");
                                    
                                    // Generate mock hex hash for ciphertext
                                    let hash = "";
                                    for (let i = 0; i < 32; i++) {
                                      hash += Math.floor(Math.random() * 16).toString(16);
                                    }
                                    const mockCipher = `iv_gcm_` + Math.floor(Math.random() * 100000) + `::` + btoa(cryptoInput).substring(0, 18) + hash.toUpperCase();
                                    setCryptoCipher(mockCipher);
                                    addFrameworkLog("broadcast", "CryptoManager", `Encryption complete. Ciphertext size: ${mockCipher.length} bytes.`);
                                  }}
                                  className="flex-1 px-3 py-1.5 bg-indigo-600/15 text-indigo-400 hover:bg-indigo-600/25 border border-indigo-500/20 rounded-lg text-[9px] font-semibold flex items-center justify-center space-x-1 active:scale-95 transition-all cursor-pointer"
                                >
                                  <Lock className="w-3 h-3 text-indigo-400" />
                                  <span>AES Encrypt Payload</span>
                                </button>

                                <button
                                  onClick={() => {
                                    addFrameworkLog("info", "CryptoManager", "Loading initialization vector from memory payload...");
                                    addFrameworkLog("info", "CryptoManager", "Fires hardware decrypt block under isolated secure execution environment.");
                                    addFrameworkLog("broadcast", "CryptoManager", "Decryption success. Output plaintext buffer fully recovered.");
                                    setCryptoInput("User biometric session payload token: standard_2026_jarvis_e2ee");
                                  }}
                                  className="flex-1 px-3 py-1.5 bg-teal-600/15 text-teal-400 hover:bg-teal-600/25 border border-teal-500/20 rounded-lg text-[9px] font-semibold flex items-center justify-center space-x-1 active:scale-95 transition-all cursor-pointer"
                                >
                                  <Unlock className="w-3 h-3 text-teal-400" />
                                  <span>AES Decrypt Ciphertext</span>
                                </button>
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between items-center text-[8px] uppercase tracking-wider text-slate-500 font-mono">
                                  <span>Ciphertext Envelope (Base64)</span>
                                  <span>Secure Isolation Key: Armed</span>
                                </div>
                                <div className="w-full bg-slate-950 p-2 border border-slate-900 rounded-lg text-[8.5px] font-mono text-indigo-400 break-all select-all leading-normal">
                                  {cryptoCipher}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Network & Channel Security */}
                          <div className="p-4 bg-slate-950/85 border border-slate-900 rounded-xl space-y-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                              <Network className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Network Security & Endpoint Protection</span>
                            </span>

                            <div className="space-y-2 text-[10px]">
                              <div className="flex justify-between items-center p-2 bg-slate-950 border border-slate-900 rounded-lg">
                                <div>
                                  <span className="text-slate-200 font-semibold block">TLS 1.2+ & Certificate Pinning</span>
                                  <span className="text-[8px] text-slate-500">Bypasses default CA checks, verifies fingerprint directly</span>
                                </div>
                                <select
                                  value={networkSecurityLevel}
                                  onChange={(e: any) => {
                                    setNetworkSecurityLevel(e.target.value);
                                    addFrameworkLog("info", "NetworkChannel", `Endpoint pinning level updated to: ${e.target.value.toUpperCase()}`);
                                  }}
                                  className="bg-slate-950 border border-slate-850 text-slate-300 rounded px-2 py-1 text-[9px] outline-none"
                                >
                                  <option value="standard">Standard (HTTPS Default)</option>
                                  <option value="strict">Strict (Certificate Pinning)</option>
                                </select>
                              </div>

                              <div className="bg-slate-950 p-2.5 border border-slate-900 rounded-lg text-[8.5px] text-slate-400 font-mono space-y-1">
                                <div className="flex justify-between">
                                  <span>Pin Digest:</span>
                                  <span className="text-slate-300 font-bold">sha256/Y9m9S2786+v0gS...</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Retry Strategy:</span>
                                  <span className="text-slate-300">Exponential Backoff (max 3)</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Timeout:</span>
                                  <span className="text-slate-300">10,000ms Connect / Read</span>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* RIGHT COLUMN: Privacy dashboard, cloud synchronization, test runner */}
                        <div className="lg:col-span-6 space-y-4">
                          
                          {/* Privacy & System Permission Dashboard */}
                          <div className="p-4 bg-slate-950/85 border border-slate-900 rounded-xl space-y-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Universal Privacy Controls</span>
                            </span>

                            <div className="space-y-2 text-[10px]">
                              {/* Privacy Options */}
                              <div className="flex items-center justify-between p-2 bg-slate-950 border border-slate-900 rounded-lg">
                                <div>
                                  <span className="text-slate-200 block font-semibold">Enable Local Memory Storage</span>
                                  <span className="text-[8px] text-slate-500">Allows sqlite tables to cache behavior and prompts</span>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={privacyMemoryEnabled}
                                  onChange={(e) => {
                                    setPrivacyMemoryEnabled(e.target.checked);
                                    addFrameworkLog("info", "PrivacyManager", `Local memory caching: ${e.target.checked ? "GRANTED" : "DISABLED (STANDBY MODE ONLY)"}`);
                                  }}
                                  className="rounded border-slate-800 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 bg-slate-900 cursor-pointer"
                                />
                              </div>

                              <div className="flex items-center justify-between p-2 bg-slate-950 border border-slate-900 rounded-lg">
                                <div>
                                  <span className="text-slate-200 block font-semibold">Share Analytics & Diagnostics</span>
                                  <span className="text-[8px] text-slate-500">Transmits anonymized metrics to crashlytics channel</span>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={privacyAnalyticsEnabled}
                                  onChange={(e) => {
                                    setPrivacyAnalyticsEnabled(e.target.checked);
                                    addFrameworkLog("info", "PrivacyManager", `Anonymized analytics telemetry: ${e.target.checked ? "OPT-IN ACTIVE" : "DISABLED (COMPLIANT OVERRIDE)"}`);
                                  }}
                                  className="rounded border-slate-800 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 bg-slate-900 cursor-pointer"
                                />
                              </div>

                              {/* Runtime Permission Toggles */}
                              <div className="space-y-1.5 pt-1">
                                <span className="text-slate-400 text-[9px] uppercase tracking-wider font-semibold block">Runtime Permissions State</span>
                                <div className="grid grid-cols-2 gap-1.5">
                                  <button
                                    onClick={() => {
                                      setPermissionCamera(!permissionCamera);
                                      addFrameworkLog("perm", "PlayCompliance", `Camera (android.permission.CAMERA): ${!permissionCamera ? "GRANTED" : "REVOKED"}`);
                                    }}
                                    className={`p-1.5 border rounded-lg text-[9px] flex items-center justify-between transition-all cursor-pointer ${
                                      permissionCamera ? "bg-emerald-950/30 border-emerald-500/20 text-emerald-400" : "bg-slate-950 border-slate-900 text-slate-500"
                                    }`}
                                  >
                                    <span>Camera Access</span>
                                    <span className="text-[7.5px] uppercase font-mono font-bold">{permissionCamera ? "Active" : "Off"}</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setPermissionMicrophone(!permissionMicrophone);
                                      addFrameworkLog("perm", "PlayCompliance", `Microphone (android.permission.RECORD_AUDIO): ${!permissionMicrophone ? "GRANTED" : "REVOKED"}`);
                                    }}
                                    className={`p-1.5 border rounded-lg text-[9px] flex items-center justify-between transition-all cursor-pointer ${
                                      permissionMicrophone ? "bg-emerald-950/30 border-emerald-500/20 text-emerald-400" : "bg-slate-950 border-slate-900 text-slate-500"
                                    }`}
                                  >
                                    <span>Microphone Access</span>
                                    <span className="text-[7.5px] uppercase font-mono font-bold">{permissionMicrophone ? "Active" : "Off"}</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setPermissionLocation(!permissionLocation);
                                      addFrameworkLog("perm", "PlayCompliance", `Location (android.permission.ACCESS_FINE_LOCATION): ${!permissionLocation ? "GRANTED" : "REVOKED"}`);
                                    }}
                                    className={`p-1.5 border rounded-lg text-[9px] flex items-center justify-between transition-all cursor-pointer ${
                                      permissionLocation ? "bg-emerald-950/30 border-emerald-500/20 text-emerald-400" : "bg-slate-950 border-slate-900 text-slate-500"
                                    }`}
                                  >
                                    <span>Location Access</span>
                                    <span className="text-[7.5px] uppercase font-mono font-bold">{permissionLocation ? "Active" : "Off"}</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setPermissionBackground(!permissionBackground);
                                      addFrameworkLog("perm", "PlayCompliance", `Foreground Service Audio Record: ${!permissionBackground ? "GRANTED" : "REVOKED"}`);
                                    }}
                                    className={`p-1.5 border rounded-lg text-[9px] flex items-center justify-between transition-all cursor-pointer ${
                                      permissionBackground ? "bg-emerald-950/30 border-emerald-500/20 text-emerald-400" : "bg-slate-950 border-slate-900 text-slate-500"
                                    }`}
                                  >
                                    <span>Bg Wake Service</span>
                                    <span className="text-[7.5px] uppercase font-mono font-bold">{permissionBackground ? "Active" : "Off"}</span>
                                  </button>
                                </div>
                              </div>

                              {/* Dangerous Actions: Wipe & Export */}
                              <div className="pt-2 border-t border-slate-900 flex space-x-2">
                                <button
                                  onClick={() => {
                                    addFrameworkLog("info", "MemoryExporter", "Compiling user database schema to JSON archive...");
                                    const mockData = {
                                      owner: "A.N.P.",
                                      version: 11,
                                      memories: [
                                        { id: 1, title: "Favorite music: Chill Jazz", category: "preferences" },
                                        { id: 2, title: "Product Team Sync meeting schedule", category: "agenda" }
                                      ]
                                    };
                                    const blob = new Blob([JSON.stringify(mockData, null, 2)], { type: "application/json" });
                                    const url = URL.createObjectURL(blob);
                                    const link = document.createElement("a");
                                    link.href = url;
                                    link.download = "jarvis_secure_memories_backup.json";
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    addFrameworkLog("broadcast", "MemoryExporter", "Secure JSON memory archive successfully exported and downloaded.");
                                  }}
                                  className="flex-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 rounded-lg text-[9px] font-semibold flex items-center justify-center space-x-1 border border-slate-800 transition-all cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>Export JSON Data</span>
                                </button>

                                <button
                                  onClick={() => {
                                    if (!isAuthed) {
                                      addFrameworkLog("perm", "PrivacyDashboard", "CRITICAL REFUSED: Purging database requires successful biometric authentication validation.");
                                      alert("Security Refused: Please verify your Biometric Credentials on the left before performing a complete database wipe.");
                                      return;
                                    }
                                    if (confirm("Are you absolutely sure you want to perform a military-grade wipe of all memories, history logs, and system credentials? This action is IRREVERSIBLE.")) {
                                      addFrameworkLog("power", "PrivacyDashboard", "Wiping SQLite file structures (MemoryDatabase.db, JarvisDatabase.db)...");
                                      addFrameworkLog("power", "PrivacyDashboard", "All keys and records purged successfully. Standing by with empty local cache.");
                                      alert("Database purged! All cached memories and configuration logs have been securely deleted from the device.");
                                    }
                                  }}
                                  className="flex-1 px-3 py-1.5 bg-rose-600/15 hover:bg-rose-600/25 border border-rose-500/20 text-rose-400 rounded-lg text-[9px] font-semibold flex items-center justify-center space-x-1 transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                                  <span>Purge All Memories</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Cloud Sync & End-to-End Encryption */}
                          <div className="p-4 bg-slate-950/85 border border-slate-900 rounded-xl space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                                <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Zero-Knowledge Cloud Synchronization</span>
                              </span>
                              <span className={`text-[8px] font-mono font-bold uppercase flex items-center space-x-1 ${
                                cloudSyncStatus === "SYNCING" ? "text-amber-400 animate-pulse" :
                                cloudSyncStatus === "SUCCESS" ? "text-emerald-400" :
                                cloudSyncStatus === "PAUSED" ? "text-slate-500" : "text-slate-400"
                              }`}>
                                <span className={`w-1 h-1 rounded-full ${
                                  cloudSyncStatus === "SYNCING" ? "bg-amber-400 animate-ping" :
                                  cloudSyncStatus === "SUCCESS" ? "bg-emerald-400" :
                                  cloudSyncStatus === "PAUSED" ? "bg-slate-500" : "bg-slate-400"
                                }`} />
                                <span>{cloudSyncStatus}</span>
                              </span>
                            </div>

                            <div className="space-y-2 text-[10px]">
                              {/* Sync Switch */}
                              <div className="flex items-center justify-between p-2 bg-slate-950 border border-slate-900 rounded-lg">
                                <div>
                                  <span className="text-slate-200 block font-semibold">Enable Secure Syncing</span>
                                  <span className="text-[8px] text-slate-500">Syncs encrypted preferences, memories, routines, reminders</span>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={cloudSyncEnabled}
                                  onChange={(e) => {
                                    setCloudSyncEnabled(e.target.checked);
                                    if (e.target.checked) {
                                      setCloudSyncStatus("IDLE");
                                      addFrameworkLog("info", "SyncManager", "Opt-in cloud sync activated. Generating zero-knowledge E2EE keys...");
                                    } else {
                                      setCloudSyncStatus("PAUSED");
                                      addFrameworkLog("info", "SyncManager", "Cloud sync deactivated. Local isolation strictly maintained.");
                                    }
                                  }}
                                  className="rounded border-slate-800 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 bg-slate-900 cursor-pointer"
                                />
                              </div>

                              {/* Manual sync controls */}
                              {cloudSyncEnabled && (
                                <div className="p-2.5 bg-slate-900/30 border border-slate-900 rounded-lg space-y-2.5 animate-fade-in">
                                  <div className="flex justify-between items-center text-[9px]">
                                    <span className="text-slate-400">Sync Conflict Policy</span>
                                    <select
                                      value={syncConflictPolicy}
                                      onChange={(e: any) => setSyncConflictPolicy(e.target.value)}
                                      className="bg-slate-950 border border-slate-850 text-slate-300 rounded px-1.5 py-0.5 text-[9px]"
                                    >
                                      <option value="MERGE">Automated Smart Merge</option>
                                      <option value="LOCAL_WINS">Local Device Wins</option>
                                      <option value="SERVER_WINS">Cloud Server Wins</option>
                                    </select>
                                  </div>

                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => {
                                        setCloudSyncStatus("SYNCING");
                                        addFrameworkLog("info", "SyncAdapter", "Starting manual E2EE sync routine...");
                                        setTimeout(() => {
                                          addFrameworkLog("broadcast", "SyncAdapter", "Parsing local SQLite changes...");
                                          addFrameworkLog("broadcast", "SyncAdapter", "AES encryption phase complete. Transmitting data payload...");
                                        }, 400);
                                        setTimeout(() => {
                                          setCloudSyncStatus("SUCCESS");
                                          addFrameworkLog("broadcast", "SyncAdapter", "E2EE Cloud Synced successfully! Sync token: 0x93FF48");
                                        }, 1100);
                                      }}
                                      disabled={cloudSyncStatus === "SYNCING"}
                                      className="flex-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-[9px] font-semibold flex items-center justify-center space-x-1 active:scale-95 transition-all cursor-pointer font-display"
                                    >
                                      <RefreshCw className={`w-3.5 h-3.5 ${cloudSyncStatus === "SYNCING" ? "animate-spin" : ""}`} />
                                      <span>Trigger Sync Now</span>
                                    </button>

                                    <button
                                      onClick={() => {
                                        setCloudSyncStatus("PAUSED");
                                        addFrameworkLog("info", "SyncAdapter", "Cloud sync adapter paused by developer command.");
                                      }}
                                      className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-300 rounded-lg text-[9px] font-semibold flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                                    >
                                      Pause Sync
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Encrypted Backup & Restore */}
                          <div className="p-4 bg-slate-950/85 border border-slate-900 rounded-xl space-y-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                              <Archive className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Encrypted Local Backups</span>
                            </span>

                            <div className="grid grid-cols-2 gap-3 text-[10px]">
                              <div className="space-y-1">
                                <span className="text-slate-400 font-medium block">Backup Schedule</span>
                                <select
                                  value={backupSchedule}
                                  onChange={(e: any) => {
                                    setBackupSchedule(e.target.value);
                                    addFrameworkLog("info", "BackupScheduler", `Automated local encrypted backup interval set to: ${e.target.value}`);
                                  }}
                                  className="w-full bg-slate-950 border border-slate-850 text-slate-300 rounded px-2 py-1 text-[10px] outline-none"
                                >
                                  <option value="DAILY">Daily (At 03:00 AM)</option>
                                  <option value="WEEKLY">Weekly (Sunday Night)</option>
                                  <option value="MONTHLY">Monthly</option>
                                  <option value="MANUAL">Manual Only</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <span className="text-slate-400 font-medium block">Action Command</span>
                                <button
                                  onClick={() => {
                                    addFrameworkLog("info", "BackupEngine", "Starting background local backup job via WorkManager...");
                                    addFrameworkLog("info", "BackupEngine", "Signing backup zip with user device key alias...");
                                    addFrameworkLog("broadcast", "BackupEngine", "Local encrypted backup written: /storage/emulated/0/Jarvis/backups/bk_20260721.bin");
                                    alert("Local Encrypted Backup Job Triggered! WorkManager successfully compressed and signed database structures in isolated system directories.");
                                  }}
                                  className="w-full px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded text-[10px] transition-all cursor-pointer text-center"
                                >
                                  Run Backup Work
                                </button>
                              </div>
                            </div>
                          </div>

                        </div>

                      </div>

                      {/* Developer Mode: Real-time Performance Metrics & Play Compliance */}
                      <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                            <span>Developer mode: Performance Telemetries & Play Compliance</span>
                          </span>
                          <button
                            onClick={() => setDevMetricsVisible(!devMetricsVisible)}
                            className="text-[9px] text-indigo-400 font-bold hover:text-indigo-300 font-mono"
                          >
                            {devMetricsVisible ? "Collapse Logs" : "Expand Metrics"}
                          </button>
                        </div>

                        {devMetricsVisible && (
                          <div className="space-y-4 animate-fade-in">
                            {/* Flashing Metrics Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                              <div className="p-2.5 bg-slate-900/40 border border-slate-900 rounded-lg">
                                <span className="text-slate-400 text-[8px] font-mono uppercase tracking-wider block">App Startup Time</span>
                                <span className="text-sm font-bold text-emerald-400 font-mono">142 ms</span>
                                <div className="w-full bg-slate-950 h-1 rounded mt-1.5 overflow-hidden">
                                  <div className="bg-emerald-400 h-full w-[25%]" />
                                </div>
                              </div>
                              <div className="p-2.5 bg-slate-900/40 border border-slate-900 rounded-lg">
                                <span className="text-slate-400 text-[8px] font-mono uppercase tracking-wider block">Isolated RAM usage</span>
                                <span className="text-sm font-bold text-emerald-400 font-mono">48.4 MB</span>
                                <div className="w-full bg-slate-950 h-1 rounded mt-1.5 overflow-hidden">
                                  <div className="bg-emerald-400 h-full w-[38%]" />
                                </div>
                              </div>
                              <div className="p-2.5 bg-slate-900/40 border border-slate-900 rounded-lg">
                                <span className="text-slate-400 text-[8px] font-mono uppercase tracking-wider block">Battery Drain Override</span>
                                <span className="text-sm font-bold text-emerald-400 font-mono">0.12% /hr</span>
                                <div className="w-full bg-slate-950 h-1 rounded mt-1.5 overflow-hidden">
                                  <div className="bg-emerald-400 h-full w-[12%]" />
                                </div>
                              </div>
                              <div className="p-2.5 bg-slate-900/40 border border-slate-900 rounded-lg">
                                <span className="text-slate-400 text-[8px] font-mono uppercase tracking-wider block">STT Latency Buffer</span>
                                <span className="text-sm font-bold text-emerald-400 font-mono">85 ms</span>
                                <div className="w-full bg-slate-950 h-1 rounded mt-1.5 overflow-hidden">
                                  <div className="bg-emerald-400 h-full w-[18%]" />
                                </div>
                              </div>
                            </div>

                            {/* Build Configurations & Google Play compliance trackers */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                              {/* Build Configs */}
                              <div className="p-3 bg-slate-900/30 border border-slate-900 rounded-lg space-y-2">
                                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Build Environment Channels</span>
                                <div className="text-[8.5px] font-mono space-y-1.5 text-slate-300">
                                  <div className="flex justify-between items-center">
                                    <span>Production (com.jarvis.core)</span>
                                    <span className="text-emerald-400 font-semibold uppercase">TLS 1.3 PINNING</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span>Staging (com.jarvis.staging)</span>
                                    <span className="text-amber-400 font-semibold uppercase">MOCK CLOUD</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span>Testing Config (com.jarvis.test)</span>
                                    <span className="text-indigo-400 font-semibold uppercase">DEBUG GEMS</span>
                                  </div>
                                </div>
                              </div>

                              {/* Google Play Compliance */}
                              <div className="p-3 bg-slate-900/30 border border-slate-900 rounded-lg space-y-2">
                                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Google Play Compliance Check</span>
                                <div className="text-[8.5px] font-mono space-y-1 text-slate-300">
                                  <div className="flex justify-between items-center">
                                    <span>1. Foreground Service Type: AUDIO_RECORD</span>
                                    <span className="text-emerald-400 font-bold">COMPLIANT</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span>2. Persistent Notification Category</span>
                                    <span className="text-emerald-400 font-bold">COMPLIANT</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span>3. Runtime Permission Disclosures</span>
                                    <span className="text-emerald-400 font-bold">COMPLIANT</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* COMPREHENSIVE KOTLIN UNIT TESTING SANDBOX */}
                            <div className="bg-slate-950 p-4 border border-slate-900 rounded-xl space-y-2.5">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] uppercase tracking-wider text-slate-300 font-bold flex items-center space-x-1.5">
                                  <Terminal className="w-3.5 h-3.5 text-teal-400" />
                                  <span>Kotlin Clean Architecture Testing Sandbox</span>
                                </span>
                                <button
                                  onClick={() => {
                                    addFrameworkLog("info", "Testbed", "Starting Kotlin JUnit Test Runner...");
                                    const testLogs = [
                                      "[RUN] com.jarvis.testing.AssistantUnitTestSuite",
                                      "---------------------------------------------------------",
                                      "[PASSED] testContextAggregation (verify Battery & Wifi context caching)",
                                      "[PASSED] testSecurityIsolation (assert Keystore cryptography isolation)",
                                      "[PASSED] testBiometricFlowEligibility (verify available biometric check)",
                                      "[PASSED] testDatabaseE2EEncryptionKeys (verify AES key derivation cycles)",
                                      "[PASSED] testRoutineExecutionPipeline (verify chained command executions)",
                                      "[PASSED] testConflictResolutionAdapter (verify Merge/Local wins overrides)",
                                      "---------------------------------------------------------",
                                      "BUILD SUCCESSFUL. 6/6 test cases executed, 0 failed. Execution time: 34ms."
                                    ];
                                    testLogs.forEach((logText, index) => {
                                      setTimeout(() => {
                                        const isErr = logText.includes("failed");
                                        addFrameworkLog(isErr ? "power" : "broadcast", "JUnit", logText);
                                      }, (index + 1) * 200);
                                    });
                                  }}
                                  className="px-2 py-0.5 bg-teal-600 hover:bg-teal-500 text-slate-950 font-semibold rounded text-[8px] uppercase tracking-wide cursor-pointer"
                                >
                                  Execute Suite
                                </button>
                              </div>
                              <p className="text-[9px] text-slate-400 leading-normal">
                                Click 'Execute Suite' to run JUnit assertions on local ViewModels, repositories, and Keystore crypto drivers. Results print to the scrolling log on the bottom panel.
                              </p>
                            </div>

                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* Part 12: Future Expansion, AI Agents & Jarvis Ultimate Vision Simulator */}
                  {architectureSubTab === "part12" && (
                    <div className="space-y-4 animate-fade-in">
                      {/* Premium Phase 12 Header */}
                      <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-xl">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-sm font-semibold text-white flex items-center space-x-1.5">
                              <Cpu className="w-4 h-4 text-indigo-400 animate-pulse" />
                              <span>{JARVIS_SPEC_PART_12.title}</span>
                            </h3>
                            <p className="text-[10px] text-slate-400 mt-0.5">{JARVIS_SPEC_PART_12.subtitle}</p>
                          </div>
                          <span className="px-2 py-0.5 bg-indigo-950 border border-indigo-500/20 text-indigo-300 font-mono text-[8px] uppercase font-bold rounded-full">
                            AGENT ENGINE V2.0
                          </span>
                        </div>
                      </div>

                      {/* Main Grid Layout */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        
                        {/* LEFT COLUMN: Agent Directory & Model Switcher */}
                        <div className="lg:col-span-6 space-y-4">
                          
                          {/* AI Model Abstraction Provider */}
                          <div className="p-4 bg-slate-950/85 border border-slate-900 rounded-xl space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                                <Network className="w-3.5 h-3.5 text-indigo-400" />
                                <span>AI Model Provider Abstraction Interface</span>
                              </span>
                              <span className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[8px] rounded uppercase">
                                INTERCHANGEABLE
                              </span>
                            </div>

                            <p className="text-[10px] text-slate-400 leading-normal">
                              Jarvis decouples LLM generation through a Model Provider abstraction. Dynamically swap core backends at runtime to preserve battery, secure local data, or invoke cloud capabilities.
                            </p>

                            {/* Switcher Toggles */}
                            <div className="grid grid-cols-3 gap-2">
                              <button
                                onClick={() => {
                                  setModelProvider("CLOUD");
                                  addFrameworkLog("info", "ModelProvider", "Switched core LLM provider: CLOUD_GEMINI_3_5 (API 34 Cloud Channel).");
                                }}
                                className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                                  modelProvider === "CLOUD"
                                    ? "bg-indigo-600/10 border-indigo-500/40 text-indigo-300"
                                    : "bg-slate-900/30 border-slate-900 text-slate-500 hover:text-slate-300"
                                }`}
                              >
                                <div className="text-[10px] font-bold font-display">Cloud LLM</div>
                                <div className="text-[7.5px] font-mono text-slate-400 mt-0.5">Gemini 3.5 Flash</div>
                                <div className="text-[7px] font-mono text-emerald-400 mt-0.5">180ms latency</div>
                              </button>

                              <button
                                onClick={() => {
                                  setModelProvider("LOCAL");
                                  addFrameworkLog("info", "ModelProvider", "Switched core LLM provider: LOCAL_ON_DEVICE_LLM (Acoustic and Intent fallback).");
                                }}
                                className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                                  modelProvider === "LOCAL"
                                    ? "bg-indigo-600/10 border-indigo-500/40 text-indigo-300"
                                    : "bg-slate-900/30 border-slate-900 text-slate-500 hover:text-slate-300"
                                }`}
                              >
                                <div className="text-[10px] font-bold font-display">Local LLM</div>
                                <div className="text-[7.5px] font-mono text-slate-400 mt-0.5">Gemini Nano</div>
                                <div className="text-[7px] font-mono text-indigo-400 mt-0.5">95ms latency (E2EE)</div>
                              </button>

                              <button
                                onClick={() => {
                                  setModelProvider("OFFLINE");
                                  addFrameworkLog("info", "ModelProvider", "Switched core LLM provider: OFFLINE_OCR_INTENT (Zero Network Fallback).");
                                }}
                                className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                                  modelProvider === "OFFLINE"
                                    ? "bg-indigo-600/10 border-indigo-500/40 text-indigo-300"
                                    : "bg-slate-900/30 border-slate-900 text-slate-500 hover:text-slate-300"
                                }`}
                              >
                                <div className="text-[10px] font-bold font-display">Offline LLM</div>
                                <div className="text-[7.5px] font-mono text-slate-400 mt-0.5">Custom Embed</div>
                                <div className="text-[7px] font-mono text-amber-400 mt-0.5">28ms latency (100% Off)</div>
                              </button>
                            </div>

                            {/* Active Model Status Indicator */}
                            <div className="p-2.5 bg-slate-900/30 border border-slate-900 rounded-lg text-[9px] font-mono text-slate-400 flex justify-between items-center">
                              <span>Active Driver Signature:</span>
                              <span className="text-teal-400 font-bold uppercase">
                                {modelProvider === "CLOUD" ? "com.jarvis.ai.model.CloudModelProvider" :
                                 modelProvider === "LOCAL" ? "com.jarvis.ai.model.LocalOnDeviceModelProvider" :
                                 "com.jarvis.ai.model.OfflineIntentDetector"}
                              </span>
                            </div>
                          </div>

                          {/* Modular AI Agents Director */}
                          <div className="p-4 bg-slate-950/85 border border-slate-900 rounded-xl space-y-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                              <Boxes className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Modular AI Agents Lifecycle Manager</span>
                            </span>

                            <p className="text-[10px] text-slate-400 leading-normal">
                              Each agent is independently installable, removable, and can be activated or deactivated without rebuilding the core app. Toggle switches below to configure the available agent registry:
                            </p>

                            {/* List of Agents */}
                            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                              {installedAgents.map((agent) => (
                                <div
                                  key={agent.id}
                                  className={`p-3 rounded-lg border transition-all ${
                                    agent.installed
                                      ? "bg-slate-900/40 border-slate-850"
                                      : "bg-slate-950/40 border-slate-950 opacity-60"
                                  }`}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="space-y-1 pr-2">
                                      <div className="flex items-center space-x-2">
                                        <h4 className="text-[11px] font-bold text-white font-display">{agent.name}</h4>
                                        {agent.installed && agent.enabled && (
                                          <span className="px-1.5 py-0.2 bg-indigo-950 border border-indigo-500/20 text-[7px] text-indigo-400 font-mono uppercase rounded-full font-bold">
                                            ACTIVE
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-[9px] text-slate-400 leading-normal">{agent.description}</p>
                                      
                                      {/* Capabilities and Permissions badges */}
                                      <div className="flex flex-wrap gap-1 pt-1.5">
                                        {agent.capabilities.map((cap) => (
                                          <span key={cap} className="px-1.5 py-0.2 bg-slate-950 border border-slate-900 text-[8px] text-slate-500 font-mono rounded">
                                            {cap}
                                          </span>
                                        ))}
                                        {agent.permissions.map((perm) => (
                                          <span key={perm} className="px-1.5 py-0.2 bg-slate-950 border border-slate-900 text-[8px] text-amber-500/75 font-mono rounded">
                                            {perm}
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col items-end space-y-2">
                                      {agent.installed ? (
                                        <>
                                          <label className="flex items-center space-x-1.5 cursor-pointer">
                                            <span className="text-[8px] font-mono text-slate-500">Enable</span>
                                            <input
                                              type="checkbox"
                                              checked={agent.enabled}
                                              onChange={(e) => {
                                                const checked = e.target.checked;
                                                setInstalledAgents(prev =>
                                                  prev.map(a => a.id === agent.id ? { ...a, enabled: checked } : a)
                                                );
                                                addFrameworkLog("info", "AgentManager", `Agent '${agent.name}' is ${checked ? "ENABLED" : "DISABLED"}.`);
                                              }}
                                              className="rounded border-slate-800 text-indigo-600 focus:ring-indigo-500 h-3 w-3 bg-slate-900 cursor-pointer"
                                            />
                                          </label>
                                          <button
                                            onClick={() => {
                                              setInstalledAgents(prev =>
                                                prev.map(a => a.id === agent.id ? { ...a, installed: false, enabled: false } : a)
                                              );
                                              addFrameworkLog("power", "AgentManager", `De-installed AI Agent: ${agent.name}. Purged cached artifacts.`);
                                            }}
                                            className="px-1.5 py-0.5 hover:bg-rose-950/20 text-rose-400 font-bold border border-rose-950 text-[7px] uppercase rounded cursor-pointer"
                                          >
                                            Uninstall
                                          </button>
                                        </>
                                      ) : (
                                        <button
                                          onClick={() => {
                                            setInstalledAgents(prev =>
                                              prev.map(a => a.id === agent.id ? { ...a, installed: true, enabled: true } : a)
                                            );
                                            addFrameworkLog("info", "AgentManager", `Installed Agent package: ${agent.name}. Verified code signature SHA-256.`);
                                          }}
                                          className="px-2 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/20 text-[8px] uppercase rounded cursor-pointer"
                                        >
                                          Install
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>

                        {/* RIGHT COLUMN: Smart Planner & Observability */}
                        <div className="lg:col-span-6 space-y-4">
                          
                          {/* Smart Planning & Multi-Agent Collaboration Engine */}
                          <div className="p-4 bg-slate-950/85 border border-slate-900 rounded-xl space-y-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                              <Workflow className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Smart Planner & Orchestration Pipeline</span>
                            </span>

                            <p className="text-[10px] text-slate-400 leading-normal">
                              Jarvis breaks down complex prompts into a series of structured steps, executes them across eligible agents, resolves conflicts, and aggregates a single, unified response block.
                            </p>

                            {/* Prompt Goal Selector */}
                            <div className="bg-slate-900/30 p-3 border border-slate-900 rounded-lg space-y-2.5">
                              <span className="text-[8.5px] uppercase tracking-wider text-slate-400 font-bold block">
                                Collaborative Intent Scenario templates:
                              </span>

                              <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                  onClick={() => {
                                    setPlanningGoal("weekend_trip");
                                    setPlanningSteps([
                                      { id: "step1", name: "Fetch Weekend Forecast", desc: "Consult weather APIs for target city", agent: "Personal Assistant Agent", status: "pending" },
                                      { id: "step2", name: "Formulate Map Route", desc: "Analyze optimal GPS roads & transit", agent: "Travel Coordinator", status: "pending" },
                                      { id: "step3", name: "Budget Review", desc: "Check current weekly expenses ledger", agent: "Finance Tracker Agent", status: "pending" },
                                      { id: "step4", name: "Synchronize Calendar", desc: "Insert trip placeholder timeline", agent: "Productivity Agent", status: "pending" }
                                    ]);
                                    setPlanningConsoleOutput("Prompt: 'Plan my weekend trip.' Standing by. Ready for compilation...");
                                  }}
                                  className={`flex-1 p-2 border rounded-lg text-left transition-all cursor-pointer flex flex-col justify-between ${
                                    planningGoal === "weekend_trip"
                                      ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-200"
                                      : "bg-slate-900/10 border-transparent text-slate-400 hover:text-slate-200"
                                  }`}
                                >
                                  <span className="text-[10px] font-bold font-display">"Plan my weekend trip"</span>
                                  <span className="text-[8px] text-slate-500 mt-0.5">Cooperation: Travel + Weather + Budget + Calendar</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setPlanningGoal("interview_prep");
                                    setPlanningSteps([
                                      { id: "step1", name: "Research Company notes", desc: "Scan stored knowledge archives & files", agent: "Research Agent", status: "pending" },
                                      { id: "step2", name: "Create Preparatory Checklist", desc: "Compile critical list of deliverables", agent: "Productivity Agent", status: "pending" },
                                      { id: "step3", name: "Schedule Reminders", desc: "Trigger background alarm notification rules", agent: "Productivity Agent", status: "pending" },
                                      { id: "step4", name: "Conduct Mock Chat", desc: "Simulate interview interactive prompts", agent: "Personal Assistant Agent", status: "pending" }
                                    ]);
                                    setPlanningConsoleOutput("Prompt: 'Help me prepare for tomorrow's job interview.' Standing by. Ready for compilation...");
                                  }}
                                  className={`flex-1 p-2 border rounded-lg text-left transition-all cursor-pointer flex flex-col justify-between ${
                                    planningGoal === "interview_prep"
                                      ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-200"
                                      : "bg-slate-900/10 border-transparent text-slate-400 hover:text-slate-200"
                                  }`}
                                >
                                  <span className="text-[10px] font-bold font-display">"Prepare for interview"</span>
                                  <span className="text-[8px] text-slate-500 mt-0.5">Cooperation: Research + Productivity + Assistant</span>
                                </button>
                              </div>

                              {/* Play compilation button */}
                              <button
                                onClick={() => {
                                  if (isPlanningRunning) return;
                                  setIsPlanningRunning(true);
                                  addFrameworkLog("info", "SmartPlanner", `Initiated planner compiler for goal: ${planningGoal}`);
                                  
                                  // Sequentially advance steps
                                  setPlanningSteps(prev => prev.map(s => ({ ...s, status: "pending" })));
                                  
                                  const logsToPrint = planningGoal === "weekend_trip" ? [
                                    "[PLAN] Goal: Plan my weekend trip. Verifying registered modules...",
                                    "[PERM] Checking permissions for Weather Tool & GPS: GRANTED.",
                                    "[RUN] Personal Assistant Agent: Requesting weather data from local caching client...",
                                    "[SUCCESS] Personal Assistant Agent compiled forecast: 'Sunny, 24°C'",
                                    "[RUN] Travel Coordinator: Resolving map routes. GPS navigation data retrieved.",
                                    "[WARN] Travel Coordinator: 'GPS Location' agent is currently DISABLED in preferences. Fallback to Local SQLite locations.",
                                    "[RUN] Finance Tracker Agent: Parsing weekly expense limits...",
                                    "[SUCCESS] Finance Tracker: Budget verified. Allocated $200 for fuel and entries.",
                                    "[RUN] Productivity Agent: Invoking standard Calendar Tool to block Sunday afternoon...",
                                    "[SUCCESS] Productivity Agent successfully blocked Calendar event 'Weekend Trip'.",
                                    "[MERGE] Multi-Agent Orchestrator: Merging response elements into structured payload.",
                                    "PLAN COMPLETED SUCCESSFUL. Unified Travel Plan presented to user."
                                  ] : [
                                    "[PLAN] Goal: Help me prepare for tomorrow's interview. Compiling tasks...",
                                    "[PERM] Checking permissions for Storage Access: GRANTED.",
                                    "[RUN] Research Agent: Scanning SQLite MemoriesTable for 'Job Prep' metadata...",
                                    "[SUCCESS] Research Agent: Found matching records for 'Tech Interview guidelines'.",
                                    "[RUN] Productivity Agent: Chaining to construct list checklist items...",
                                    "[SUCCESS] Productivity Agent: Generated checklist 'Interview checklist v1'.",
                                    "[RUN] Productivity Agent: Scheduling reminder for 9:00 AM...",
                                    "[SUCCESS] Productivity Agent: WorkManager Job scheduled. Alarm set.",
                                    "[RUN] Personal Assistant Agent: Initiating mock interview dialogue module...",
                                    "[SUCCESS] Personal Assistant Agent: Prompt sequence initialized successfully.",
                                    "[MERGE] Multi-Agent Orchestrator: Formulated comprehensive preparatory strategy response.",
                                    "PLAN COMPLETED SUCCESSFUL. Unified Roadmap generated."
                                  ];

                                  let stepIndex = 0;
                                  
                                  const interval = setInterval(() => {
                                    if (stepIndex < 4) {
                                      // Set current running, previous completed
                                      setPlanningSteps(prev => prev.map((s, idx) => {
                                        if (idx === stepIndex) return { ...s, status: "running" };
                                        if (idx < stepIndex) return { ...s, status: "completed" };
                                        return s;
                                      }));
                                      
                                      // Print corresponding logging feedback
                                      setPlanningConsoleOutput(prev => prev + "\n" + logsToPrint[stepIndex * 2] + "\n" + logsToPrint[stepIndex * 2 + 1]);
                                      addFrameworkLog("broadcast", "MultiAgentOrchestrator", logsToPrint[stepIndex * 2]);
                                      
                                      stepIndex++;
                                    } else {
                                      // Final completed status
                                      setPlanningSteps(prev => prev.map(s => ({ ...s, status: "completed" })));
                                      setPlanningConsoleOutput(prev => prev + "\n" + logsToPrint[8] + "\n" + logsToPrint[9] + "\n" + logsToPrint[10] + "\n" + logsToPrint[11]);
                                      addFrameworkLog("info", "SmartPlanner", "ExecutionPlan execution completed with Success status.");
                                      setIsPlanningRunning(false);
                                      clearInterval(interval);
                                    }
                                  }, 1000);

                                }}
                                disabled={isPlanningRunning}
                                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-[10px] font-bold flex items-center justify-center space-x-1.5 active:scale-95 transition-all cursor-pointer font-display"
                              >
                                {isPlanningRunning ? (
                                  <>
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Orchestrating Agents...</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-3.5 h-3.5" />
                                    <span>Compile & Execute Chained Goal Plan</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Plan Chained steps visual progress checklist */}
                            <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                              {planningSteps.map((step) => (
                                <div key={step.id} className="p-2 bg-slate-900/40 border border-slate-900 rounded-lg flex items-center justify-between">
                                  <div className="space-y-0.5 truncate pr-1">
                                    <span className="text-slate-200 block font-bold truncate">{step.name}</span>
                                    <span className="text-[7.5px] text-slate-500 block truncate">Assign: {step.agent}</span>
                                  </div>
                                  <span className={`px-1 py-0.2 text-[7px] uppercase font-bold rounded ${
                                    step.status === "completed" ? "bg-emerald-950 text-emerald-400 border border-emerald-500/20" :
                                    step.status === "running" ? "bg-amber-950 text-amber-400 border border-amber-500/20 animate-pulse" :
                                    "bg-slate-900 text-slate-500 border border-slate-800"
                                  }`}>
                                    {step.status}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Planner Output scrolling logs */}
                            <div className="space-y-1">
                              <span className="text-[8.5px] uppercase tracking-wider text-slate-500 font-mono block">
                                Planning Compiler Console:
                              </span>
                              <pre className="p-2.5 bg-slate-950 border border-slate-900 rounded-lg text-[8.5px] font-mono text-slate-300 leading-normal max-h-[140px] overflow-y-auto whitespace-pre-wrap">
                                {planningConsoleOutput}
                              </pre>
                            </div>
                          </div>

                          {/* Observability Dashboard Drawer */}
                          <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 flex items-center space-x-1.5">
                                <Activity className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                                <span>Advanced Observability & Developer Inspector</span>
                              </span>
                              <button
                                onClick={() => setIsDeveloperModeTab(!isDeveloperModeTab)}
                                className="text-[9px] text-indigo-400 font-bold font-mono hover:text-indigo-300 animate-pulse"
                              >
                                {isDeveloperModeTab ? "Hide Inspector" : "Expand Inspector"}
                              </button>
                            </div>

                            {isDeveloperModeTab && (
                              <div className="space-y-3.5 animate-fade-in text-[10px]">
                                
                                {/* Metrics Column */}
                                <div className="grid grid-cols-2 gap-2 text-center text-slate-300">
                                  <div className="p-2 bg-slate-900/30 border border-slate-900 rounded-lg">
                                    <span className="text-slate-500 text-[8px] font-mono uppercase">Speech Accuracy</span>
                                    <span className="text-sm font-bold block text-teal-400 font-mono">98.4%</span>
                                  </div>
                                  <div className="p-2 bg-slate-900/30 border border-slate-900 rounded-lg">
                                    <span className="text-slate-500 text-[8px] font-mono uppercase">Wake-word accuracy</span>
                                    <span className="text-sm font-bold block text-teal-400 font-mono">99.1%</span>
                                  </div>
                                  <div className="p-2 bg-slate-900/30 border border-slate-900 rounded-lg">
                                    <span className="text-slate-500 text-[8px] font-mono uppercase">Avg AI Latency</span>
                                    <span className="text-sm font-bold block text-teal-400 font-mono">142 ms</span>
                                  </div>
                                  <div className="p-2 bg-slate-900/30 border border-slate-900 rounded-lg">
                                    <span className="text-slate-500 text-[8px] font-mono uppercase">Battery Overhead</span>
                                    <span className="text-sm font-bold block text-teal-400 font-mono">0.12% /hr</span>
                                  </div>
                                </div>

                                {/* SQLite Database Inspector */}
                                <div className="space-y-1.5 bg-slate-950 p-3 border border-slate-900 rounded-lg">
                                  <span className="text-[8.5px] uppercase tracking-wider text-slate-400 font-bold block">
                                    Active Database Browser (SQLite Inspector)
                                  </span>
                                  
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-left font-mono text-[8.5px] text-slate-300">
                                      <thead>
                                        <tr className="border-b border-slate-900 text-slate-500 uppercase text-[7.5px]">
                                          <th className="py-1">Table Name</th>
                                          <th className="py-1">Records</th>
                                          <th className="py-1">Last Transaction</th>
                                          <th className="py-1">Size</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="border-b border-slate-900/50">
                                          <td className="py-1 text-teal-400 font-bold">com.jarvis.memories</td>
                                          <td className="py-1">247 entries</td>
                                          <td className="py-1 text-slate-500">2026-07-21 09:42</td>
                                          <td className="py-1">1.2 MB</td>
                                        </tr>
                                        <tr className="border-b border-slate-900/50">
                                          <td className="py-1 text-teal-400 font-bold">com.jarvis.agents</td>
                                          <td className="py-1">7 micro-modules</td>
                                          <td className="py-1 text-slate-500">2026-07-21 09:50</td>
                                          <td className="py-1">64 KB</td>
                                        </tr>
                                        <tr className="border-b border-slate-900/50">
                                          <td className="py-1 text-teal-400 font-bold">com.jarvis.routines</td>
                                          <td className="py-1">12 routines</td>
                                          <td className="py-1 text-slate-500">2026-07-20 18:14</td>
                                          <td className="py-1">128 KB</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                {/* Dynamic Signature Extension registry */}
                                <div className="p-3 bg-slate-900/30 border border-slate-900 rounded-lg space-y-2">
                                  <span className="text-[8.5px] uppercase tracking-wider text-slate-400 font-bold block">
                                    Extension Framework Registry
                                  </span>

                                  <div className="space-y-1.5 font-mono text-[8.5px] text-slate-400">
                                    <div className="flex justify-between items-center bg-slate-950 p-1.5 rounded border border-slate-900">
                                      <div>
                                        <span className="text-slate-200 block font-bold">ext_smart_nest_hub.jar</span>
                                        <span className="text-[7.5px] text-slate-500 block">SHA-256: d83f...a231 | Min App: v2.1</span>
                                      </div>
                                      <span className="text-emerald-400 font-bold">VERIFIED</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-slate-950 p-1.5 rounded border border-slate-900">
                                      <div>
                                        <span className="text-slate-200 block font-bold">ext_philips_hue.jar</span>
                                        <span className="text-[7.5px] text-slate-500 block">SHA-256: 9e10...f822 | Min App: v2.0</span>
                                      </div>
                                      <span className="text-emerald-400 font-bold">VERIFIED</span>
                                    </div>
                                  </div>
                                </div>

                              </div>
                            )}
                          </div>

                        </div>

                      </div>
                    </div>
                  )}

                  {/* Part 13: Clean Architecture Master Integration Engine */}
                  {architectureSubTab === "part13" && (
                    <div className="space-y-4 animate-fade-in">
                      {/* Premium Phase 13 Header */}
                      <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-xl">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-sm font-semibold text-white flex items-center space-x-1.5">
                              <Boxes className="w-4 h-4 text-emerald-400" />
                              <span>{JARVIS_SPEC_PART_13.title}</span>
                            </h3>
                            <p className="text-[10px] text-slate-400 mt-0.5">{JARVIS_SPEC_PART_13.subtitle}</p>
                          </div>
                          <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-500/20 text-emerald-300 font-mono text-[8px] uppercase font-bold rounded-full">
                            COMPILER LEVEL 13
                          </span>
                        </div>
                      </div>

                      {/* Main Grid Layout */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        {/* LEFT COLUMN: Module Registry Tree */}
                        <div className="lg:col-span-7 bg-slate-950/40 border border-slate-900 rounded-xl p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center space-x-1.5">
                              <Network className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Module Integrity & Dependency Graph</span>
                            </h4>
                            <span className="text-[9px] text-emerald-400 font-mono bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/10">
                              STATUS: INTEGRATED
                            </span>
                          </div>

                          <div className="space-y-3 font-mono text-[10px]">
                            {/* Presentation Layer */}
                            <div className="p-2.5 bg-slate-900/30 border border-slate-900 rounded-lg space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-indigo-400 font-bold">1. PRESENTATION LAYER (:app, :ui-common)</span>
                                <span className="text-emerald-400 font-bold">COMPILE OK</span>
                              </div>
                              <p className="text-[9px] text-slate-400 font-sans leading-normal">
                                Jetpack Compose screens, MVVM ViewModels, Floating Voice Overlay, and Material 3 design tokens.
                              </p>
                              <div className="text-[8px] text-slate-500 pt-1 flex flex-wrap gap-1">
                                <span className="bg-slate-900 px-1 py-0.5 rounded">Imports: :domain</span>
                                <span className="bg-slate-900 px-1 py-0.5 rounded">Hilt: @AndroidEntryPoint</span>
                              </div>
                            </div>

                            {/* Arrow */}
                            <div className="flex justify-center -my-1 text-emerald-500/50">↓</div>

                            {/* Domain Layer */}
                            <div className="p-2.5 bg-slate-900/30 border border-slate-900 rounded-lg space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-teal-400 font-bold">2. DOMAIN LAYER (:domain)</span>
                                <span className="text-emerald-400 font-bold">COMPILE OK</span>
                              </div>
                              <p className="text-[9px] text-slate-400 font-sans leading-normal">
                                pure-Kotlin business logic. No Android framework bindings. Governs Use Cases, model entities, and abstract repository contracts.
                              </p>
                              <div className="text-[8px] text-slate-500 pt-1 flex flex-wrap gap-1">
                                <span className="bg-slate-900 px-1 py-0.5 rounded">Imports: none</span>
                                <span className="bg-slate-900 px-1 py-0.5 rounded">Threading: Flow & Coroutines</span>
                              </div>
                            </div>

                            {/* Arrow */}
                            <div className="flex justify-center -my-1 text-emerald-500/50">↓</div>

                            {/* Data Layer */}
                            <div className="p-2.5 bg-slate-900/30 border border-slate-900 rounded-lg space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-amber-400 font-bold">3. DATA LAYER (:data)</span>
                                <span className="text-emerald-400 font-bold">COMPILE OK</span>
                              </div>
                              <p className="text-[9px] text-slate-400 font-sans leading-normal">
                                Room databases, Retrofit API endpoints, local encrypted Datastore keys, and Repository implementations.
                              </p>
                              <div className="text-[8px] text-slate-500 pt-1 flex flex-wrap gap-1">
                                <span className="bg-slate-900 px-1 py-0.5 rounded">Imports: :domain</span>
                                <span className="bg-slate-900 px-1 py-0.5 rounded">DB: indexed SQLite SQLiteOpenHelper</span>
                              </div>
                            </div>

                            {/* Arrow */}
                            <div className="flex justify-center -my-1 text-emerald-500/50">↓</div>

                            {/* Framework Layer */}
                            <div className="p-2.5 bg-slate-900/30 border border-slate-900 rounded-lg space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-pink-400 font-bold">4. FRAMEWORK LAYER (:framework-speech, :framework-security)</span>
                                <span className="text-emerald-400 font-bold">COMPILE OK</span>
                              </div>
                              <p className="text-[9px] text-slate-400 font-sans leading-normal">
                                Low-level Android API drivers, SpeechRecognizer callbacks, Android Keystore encryption channels, and WorkManager task dispatchers.
                              </p>
                              <div className="text-[8px] text-slate-500 pt-1 flex flex-wrap gap-1">
                                <span className="bg-slate-900 px-1 py-0.5 rounded">Imports: :data, :domain</span>
                                <span className="bg-slate-900 px-1 py-0.5 rounded">Security: AES-256-GCM Keystore</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT COLUMN: Hilt Dependency & Validation Panel */}
                        <div className="lg:col-span-5 bg-slate-950/40 border border-slate-900 rounded-xl p-4 space-y-4 flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex items-center space-x-1.5">
                              <Workflow className="w-4 h-4 text-emerald-400" />
                              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                                Hilt Classpath & Injection Verification
                              </h4>
                            </div>

                            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                              Verify that Hilt dependency graphs are statically linked at compile time. No missing @Provides annotations or circular constructor dependencies.
                            </p>

                            {/* Live DI Console Panel */}
                            <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 space-y-2 font-mono text-[9px]">
                              <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 text-slate-400">
                                <span className="flex items-center space-x-1">
                                  <Terminal className="w-3 h-3 text-slate-500" />
                                  <span>DI GRAPH LOGS</span>
                                </span>
                                <span>v1.0-STABLE</span>
                              </div>
                              <p className="text-slate-300 leading-normal">{diValidationLog}</p>
                              {isDILoading && (
                                <div className="flex items-center space-x-2 text-emerald-400 pt-1.5">
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                  <span>Analyzing Hilt Module Tree...</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2 pt-4">
                            <button
                              onClick={() => {
                                setIsDILoading(true);
                                addFrameworkLog("info", "HiltLint", "Initiated recursive dependency injection integrity scan on classpath...");
                                setDiValidationLog("Reading provider descriptors: [CryptoManager, SmartPlanningEngine, VoiceCommandUseCaseTest]...");
                                setTimeout(() => {
                                  setIsDILoading(false);
                                  setDiValidationLog("Verification successful: 100% of bindings resolved. No circular scopes found. @Singleton scope allocated correctly.");
                                  addFrameworkLog("bind", "HiltDI", "Hilt validation complete. Statically verified 12 singleton providers successfully.", "Status: OK");
                                }, 1500);
                              }}
                              disabled={isDILoading}
                              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-bold text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Validate Dependency Graph</span>
                            </button>

                            <button
                              onClick={() => {
                                setIsDILoading(true);
                                addFrameworkLog("info", "DependencyGraph", "Starting circular path check on the multi-module project graph...");
                                setDiValidationLog("Traversing dependency links: Presentation -> Domain -> Data -> Framework...");
                                setTimeout(() => {
                                  setIsDILoading(false);
                                  setDiValidationLog("Completed traversal: Tree is acyclic. Graph compiles into safe, fast cold-start bytecode.");
                                  addFrameworkLog("info", "DependencyGraph", "Acyclic check passed. No circular paths detected.", "Duration: 420ms");
                                }, 1200);
                              }}
                              disabled={isDILoading}
                              className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium text-xs py-2 px-3 rounded-lg transition-colors border border-slate-800 flex items-center justify-center space-x-1.5 cursor-pointer"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Check Circular Paths</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Part 14: Quality Assurance & Launch Validation Dashboard */}
                  {architectureSubTab === "part14" && (
                    <div className="space-y-4 animate-fade-in">
                      {/* Premium Phase 14 Header */}
                      <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-xl">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-sm font-semibold text-white flex items-center space-x-1.5">
                              <ShieldCheck className="w-4 h-4 text-teal-400" />
                              <span>{JARVIS_SPEC_PART_14.title}</span>
                            </h3>
                            <p className="text-[10px] text-slate-400 mt-0.5">{JARVIS_SPEC_PART_14.subtitle}</p>
                          </div>
                          <span className="px-2 py-0.5 bg-teal-950 border border-teal-500/20 text-teal-300 font-mono text-[8px] uppercase font-bold rounded-full">
                            QA ENGINE ACTIVE
                          </span>
                        </div>
                      </div>

                      {/* Main Grid Layout */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        {/* LEFT COLUMN: QA Checklist and Run Panel */}
                        <div className="lg:col-span-6 bg-slate-950/40 border border-slate-900 rounded-xl p-4 space-y-4">
                          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center space-x-1.5">
                            <Settings className="w-3.5 h-3.5 text-teal-400" />
                            <span>Launch Readiness Review</span>
                          </h4>

                          <p className="text-[11px] text-slate-400 leading-normal font-sans">
                            Toggle checklist tasks to dynamically calculate our overall Launch Readiness score. Every criteria must be fulfilled for production.
                          </p>

                          {/* Dynamic checklist */}
                          <div className="space-y-2">
                            {[
                              { id: "compile", label: "Zero-Placeholder compilation & import scan" },
                              { id: "no_placeholders", label: "Remove active TODO stubs & empty handlers" },
                              { id: "no_leak", label: "Configure LeakCanary Heap Analyzer bounds" },
                              { id: "opt_in", label: "Verify explicit user data storage opt-in flow" },
                              { id: "secure_keystore", label: "Hardware-Backed AES-256 Keystore protection" },
                              { id: "accessibility", label: "Check screen readers, TalkBack, and RTL tags" }
                            ].map((item) => (
                              <label
                                key={item.id}
                                className="flex items-start space-x-3 p-2 bg-slate-900/20 border border-slate-900/50 rounded-lg hover:bg-slate-900/40 transition-colors cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={checkedQaItems.includes(item.id)}
                                  onChange={() => {
                                    if (checkedQaItems.includes(item.id)) {
                                      setCheckedQaItems((prev) => prev.filter((i) => i !== item.id));
                                    } else {
                                      setCheckedQaItems((prev) => [...prev, item.id]);
                                    }
                                  }}
                                  className="mt-0.5 rounded border-slate-800 text-teal-600 focus:ring-teal-500 bg-slate-950"
                                />
                                <span className="text-[10px] text-slate-300 leading-normal font-sans">{item.label}</span>
                              </label>
                            ))}
                          </div>

                          {/* Diagnostic Launch button */}
                          <div className="pt-2 border-t border-slate-900/80">
                            <button
                              onClick={() => {
                                setIsQAChecking(true);
                                addFrameworkLog("info", "QualityAssurance", "Starting automated Jarvis system diagnostics...");
                                setQaStatus("Analyzing memory models, security signatures, and performance budgets...");
                                setTimeout(() => {
                                  setIsQAChecking(false);
                                  setSimulatedCpuLoad(2.8 + Math.random() * 2);
                                  setSimulatedWarmBoot(240 + Math.floor(Math.random() * 120));
                                  setQaStatus("QA validation completed. CPU Load under idle: 3.1%. Warm boot latency: 280ms. Play Store safety rules strictly satisfied!");
                                  addFrameworkLog("power", "Telemetry", "Idle CPU Load optimized successfully to 3.1%. Warm transition latency minimized.", "Boot: 280ms");
                                }, 1800);
                              }}
                              disabled={isQAChecking}
                              className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-slate-950 font-bold text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                            >
                              {isQAChecking ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Activity className="w-3.5 h-3.5" />}
                              <span>Run Autonomous QA Review</span>
                            </button>
                          </div>
                        </div>

                        {/* RIGHT COLUMN: Performance & Metric Diagnostics */}
                        <div className="lg:col-span-6 bg-slate-950/40 border border-slate-900 rounded-xl p-4 space-y-4 flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex items-center space-x-1.5">
                              <Terminal className="w-4 h-4 text-teal-400" />
                              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                                Real-Time Diagnostic Telemetry
                              </h4>
                            </div>

                            {/* Gauge bar representing launch score */}
                            <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-900 space-y-2">
                              <div className="flex justify-between items-center text-[10px] text-slate-400">
                                <span>Overall Launch Readiness Score</span>
                                <span className="font-mono font-bold text-emerald-400">
                                  {Math.round((checkedQaItems.length / 6) * 100)}%
                                </span>
                              </div>
                              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
                                <div
                                  className="bg-emerald-500 h-full transition-all duration-500"
                                  style={{ width: `${(checkedQaItems.length / 6) * 100}%` }}
                                />
                              </div>
                            </div>

                            {/* Performance metrics sliders/inputs */}
                            <div className="space-y-3">
                              {/* CPU load */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono">
                                  <span className="text-slate-400">SIMULATED CPU IDLE LOAD</span>
                                  <span className="text-teal-400 font-bold">{simulatedCpuLoad.toFixed(1)}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="1.0"
                                  max="20.0"
                                  step="0.1"
                                  value={simulatedCpuLoad}
                                  onChange={(e) => setSimulatedCpuLoad(parseFloat(e.target.value))}
                                  className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-teal-500"
                                />
                              </div>

                              {/* Warm Boot */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono">
                                  <span className="text-slate-400">WARM TRANSITION TIME</span>
                                  <span className="text-teal-400 font-bold">{simulatedWarmBoot} ms</span>
                                </div>
                                <input
                                  type="range"
                                  min="100"
                                  max="1000"
                                  step="10"
                                  value={simulatedWarmBoot}
                                  onChange={(e) => setSimulatedWarmBoot(parseInt(e.target.value))}
                                  className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-teal-500"
                                />
                              </div>
                            </div>

                            {/* Console summary output */}
                            <div className="bg-slate-950 p-2.5 rounded border border-slate-900 text-[9px] font-mono text-slate-300 leading-normal">
                              <span className="text-teal-400 font-bold">[QA STATS] </span>
                              <span>{qaStatus}</span>
                            </div>
                          </div>

                          <div className="text-[8px] text-slate-500 font-mono text-center pt-2">
                            AOSP-Target-API: SDK 34 (Android 14) | Min SDK: 29 | Architecture: arm64-v8a
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Simulated Signal Pipeline Diagram */}
                  <div className="border border-slate-900 bg-slate-900/30 p-4 rounded-xl space-y-3 mt-4">
                    <h4 className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Signal Routing Pipeline (Android Framework Flow)</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[10px] text-center font-mono">
                      <div className="p-2.5 bg-slate-950 border border-slate-900 rounded-lg">
                        <span className="text-indigo-400 font-bold block mb-1">Voice Activation</span>
                        <p className="text-[9px] text-slate-400 leading-normal font-sans">VAD analyzes PCM buffer on phone. WakeLock acquired on 'Hey Jarvis'.</p>
                      </div>
                      <div className="p-2.5 bg-slate-950 border border-slate-900 rounded-lg">
                        <span className="text-amber-400 font-bold block mb-1">Gemini AI Engine</span>
                        <p className="text-[9px] text-slate-400 leading-normal font-sans font-display">Server-side flash model resolves intent parameters & preferred memory.</p>
                      </div>
                      <div className="p-2.5 bg-slate-950 border border-slate-900 rounded-lg">
                        <span className="text-teal-400 font-bold block mb-1">Android Intent</span>
                        <p className="text-[9px] text-slate-400 leading-normal font-sans">System Service fires target Intent broadcast after safety confirmation gate.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

      </main>
    </div>
  );
}
