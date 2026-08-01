package com.jarvis.assistant.speech

import android.content.Context
import android.speech.tts.TextToSpeech
import android.speech.tts.Voice
import android.util.Log
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import java.util.Locale

/**
 * Text-To-Speech Engine with Deep Male Voice Preset and Multi-lingual Support (EN, MR, HI)
 */
class TextToSpeechEngine(private val context: Context) : TextToSpeech.OnInitListener {

    private var tts: TextToSpeech? = TextToSpeech(context, this)
    private var isInitialized = false

    private val _isSpeaking = MutableStateFlow(false)
    val isSpeaking: StateFlow<Boolean> = _isSpeaking

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            isInitialized = true
            tts?.language = Locale.ENGLISH
            configureDeepMaleVoice()
        } else {
            Log.e("TTS", "TextToSpeech initialization failed")
        }
    }

    private fun configureDeepMaleVoice() {
        try {
            // Pitch 0.85f for deeper male butler voice tone, pitch rate 1.0f
            tts?.setPitch(0.85f)
            tts?.setSpeechRate(1.0f)

            val voices = tts?.voices
            if (!voices.isNullOrEmpty()) {
                val maleVoice = voices.firstOrNull { voice ->
                    voice.name.contains("male", ignoreCase = true) ||
                    voice.name.contains("en-us-x-sfg", ignoreCase = true) ||
                    voice.name.contains("en-in-x-mdf", ignoreCase = true)
                }
                if (maleVoice != null) {
                    tts?.voice = maleVoice
                }
            }
        } catch (e: Exception) {
            Log.e("TTS", "Voice configuration failed", e)
        }
    }

    fun speak(text: String, languageCode: String = "en-US", onComplete: (() -> Unit)? = null) {
        if (!isInitialized) return

        val locale = when (languageCode.lowercase()) {
            "hi", "hi-in", "hindi" -> Locale("hi", "IN")
            "mr", "mr-in", "marathi" -> Locale("mr", "IN")
            else -> Locale.US
        }

        tts?.language = locale
        _isSpeaking.value = true

        val utteranceId = "jarvis_tts_${System.currentTimeMillis()}"
        tts?.setOnUtteranceProgressListener(object : android.speech.tts.UtteranceProgressListener() {
            override fun onStart(utteranceId: String?) {
                _isSpeaking.value = true
            }

            override fun onDone(utteranceId: String?) {
                _isSpeaking.value = false
                onComplete?.invoke()
            }

            override fun onError(utteranceId: String?) {
                _isSpeaking.value = false
            }
        })

        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, utteranceId)
    }

    fun stop() {
        if (isInitialized) {
            tts?.stop()
            _isSpeaking.value = false
        }
    }

    fun shutdown() {
        tts?.stop()
        tts?.shutdown()
        tts = null
    }
}
