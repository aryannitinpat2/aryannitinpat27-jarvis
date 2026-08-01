package com.jarvis.assistant.ai

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

enum class AiProviderType {
    GEMINI,
    OPENAI,
    ANTHROPIC,
    LOCAL_LLM
}

data class AiResponse(
    val text: String,
    val provider: AiProviderType,
    val modelName: String,
    val intentAction: String? = null,
    val parameters: Map<String, String> = emptyMap()
)

interface IAiProvider {
    val providerType: AiProviderType
    suspend fun generateResponse(prompt: String, conversationHistory: List<Pair<String, String>>): AiResponse
}

class AiProviderRepository {

    private val _selectedProviderType = MutableStateFlow(AiProviderType.GEMINI)
    val selectedProviderType: StateFlow<AiProviderType> = _selectedProviderType

    private var geminiApiKey: String = ""
    private var openAiApiKey: String = ""
    private var anthropicApiKey: String = ""

    fun setApiKeys(geminiKey: String = "", openAiKey: String = "", anthropicKey: String = "") {
        this.geminiApiKey = geminiKey
        this.openAiApiKey = openAiKey
        this.anthropicApiKey = anthropicKey
    }

    fun selectProvider(type: AiProviderType) {
        _selectedProviderType.value = type
    }

    suspend fun queryAssistant(
        prompt: String,
        history: List<Pair<String, String>> = emptyList()
    ): AiResponse {
        val currentType = _selectedProviderType.value
        return when (currentType) {
            AiProviderType.GEMINI -> GeminiProvider(geminiApiKey).generateResponse(prompt, history)
            AiProviderType.OPENAI -> OpenAiProvider(openAiApiKey).generateResponse(prompt, history)
            AiProviderType.ANTHROPIC -> AnthropicProvider(anthropicApiKey).generateResponse(prompt, history)
            AiProviderType.LOCAL_LLM -> LocalLlmProvider().generateResponse(prompt, history)
        }
    }
}

class GeminiProvider(private val apiKey: String) : IAiProvider {
    override val providerType = AiProviderType.GEMINI

    override suspend fun generateResponse(prompt: String, conversationHistory: List<Pair<String, String>>): AiResponse {
        // Mock or Retrofit implementation for Gemini 3.6 Flash / Live API
        val lower = prompt.lowercase()
        val intent = when {
            lower.contains("open") -> "OPEN_APP"
            lower.contains("call") -> "CALL_CONTACT"
            lower.contains("sms") || lower.contains("text") -> "SEND_SMS"
            lower.contains("reminder") -> "CREATE_REMINDER"
            lower.contains("flashlight") || lower.contains("torch") -> "TOGGLE_FLASHLIGHT"
            else -> null
        }

        val replyText = if (intent != null) {
            "Understood, executing $intent command for you."
        } else {
            "I'm here to assist. Processing your query with Gemini 3.6 Flash: \"$prompt\""
        }

        return AiResponse(
            text = replyText,
            provider = providerType,
            modelName = "models/gemini-3.6-flash",
            intentAction = intent
        )
    }
}

class OpenAiProvider(private val apiKey: String) : IAiProvider {
    override val providerType = AiProviderType.OPENAI

    override suspend fun generateResponse(prompt: String, conversationHistory: List<Pair<String, String>>): AiResponse {
        return AiResponse(
            text = "OpenAI GPT-4o response for: \"$prompt\"",
            provider = providerType,
            modelName = "gpt-4o"
        )
    }
}

class AnthropicProvider(private val apiKey: String) : IAiProvider {
    override val providerType = AiProviderType.ANTHROPIC

    override suspend fun generateResponse(prompt: String, conversationHistory: List<Pair<String, String>>): AiResponse {
        return AiResponse(
            text = "Anthropic Claude 3.5 Sonnet response for: \"$prompt\"",
            provider = providerType,
            modelName = "claude-3-5-sonnet"
        )
    }
}

class LocalLlmProvider : IAiProvider {
    override val providerType = AiProviderType.LOCAL_LLM

    override suspend fun generateResponse(prompt: String, conversationHistory: List<Pair<String, String>>): AiResponse {
        return AiResponse(
            text = "On-device GGUF / Gemma local response for: \"$prompt\"",
            provider = providerType,
            modelName = "gemma-2b-it-local"
        )
    }
}
