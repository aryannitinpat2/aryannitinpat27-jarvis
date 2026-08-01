package com.jarvis.assistant.speech

import android.content.Context
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import android.util.Log
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlin.math.abs

/**
 * On-Device Low-Power Wake-Word Listener for "Hey Jarvis"
 * Uses Android AudioRecord PCM streaming with acoustic energy threshold & VAD triggers.
 */
class WakeWordEngine(private val context: Context) {

    private var audioRecord: AudioRecord? = null
    private var isListening = false
    private var listenerJob: Job? = null
    private val scope = CoroutineScope(Dispatchers.Default + SupervisorJob())

    private val _wakeState = MutableStateFlow<WakeState>(WakeState.Idle)
    val wakeState: StateFlow<WakeState> = _wakeState

    var onWakeWordDetected: (() -> Unit)? = null

    sealed class WakeState {
        object Idle : WakeState()
        object ListeningForWakeWord : WakeState()
        object Triggered : WakeState()
        data class Error(val message: String) : WakeState()
    }

    fun startListening() {
        if (isListening) return
        isListening = true
        _wakeState.value = WakeState.ListeningForWakeWord

        listenerJob = scope.launch {
            val sampleRate = 16000
            val channelConfig = AudioFormat.CHANNEL_IN_MONO
            val audioFormat = AudioFormat.ENCODING_PCM_16BIT
            val minBufferSize = AudioRecord.getMinBufferSize(sampleRate, channelConfig, audioFormat)

            try {
                audioRecord = AudioRecord(
                    MediaRecorder.AudioSource.MIC,
                    sampleRate,
                    channelConfig,
                    audioFormat,
                    minBufferSize * 2
                )

                if (audioRecord?.state != AudioRecord.STATE_INITIALIZED) {
                    _wakeState.value = WakeState.Error("AudioRecord initialization failed")
                    isListening = false
                    return@launch
                }

                audioRecord?.startRecording()
                val buffer = ShortArray(1024)

                while (isListening && isActive) {
                    val readSize = audioRecord?.read(buffer, 0, buffer.size) ?: 0
                    if (readSize > 0) {
                        val amplitude = calculateRMS(buffer, readSize)
                        // Trigger on acoustic spike (Voice Activity Detection simulation for wake word)
                        if (amplitude > 3500) {
                            Log.d("WakeWordEngine", "Hotword acoustic peak detected: amplitude $amplitude")
                            _wakeState.value = WakeState.Triggered
                            withContext(Dispatchers.Main) {
                                onWakeWordDetected?.invoke()
                            }
                            // Pause wake-word engine during active speech session
                            delay(1500)
                        }
                    }
                    delay(50)
                }
            } catch (e: Exception) {
                Log.e("WakeWordEngine", "Error in wake word loop", e)
                _wakeState.value = WakeState.Error(e.localizedMessage ?: "Recording error")
            } finally {
                stopInternal()
            }
        }
    }

    fun stopListening() {
        isListening = false
        listenerJob?.cancel()
        stopInternal()
        _wakeState.value = WakeState.Idle
    }

    private fun stopInternal() {
        try {
            audioRecord?.stop()
            audioRecord?.release()
            audioRecord = null
        } catch (e: Exception) {
            Log.e("WakeWordEngine", "Failed to release AudioRecord", e)
        }
    }

    private fun calculateRMS(buffer: ShortArray, readSize: Int): Double {
        var sum = 0.0
        for (i in 0 until readSize) {
            sum += buffer[i] * buffer[i]
        }
        return Math.sqrt(sum / readSize)
    }
}
