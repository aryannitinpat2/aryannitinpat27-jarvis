package com.jarvis.assistant.service

import android.app.Notification
import android.app.PendingIntent
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.lifecycle.LifecycleService
import com.jarvis.assistant.JarvisApplication
import com.jarvis.assistant.MainActivity
import com.jarvis.assistant.R
import com.jarvis.assistant.overlay.JarvisOverlayManager
import com.jarvis.assistant.speech.SpeechRecognizerManager
import com.jarvis.assistant.speech.TextToSpeechEngine
import com.jarvis.assistant.speech.WakeWordEngine

/**
 * Always-On Foreground Service for Hey Jarvis Wake-Word Detection & Window Overlay
 */
class JarvisForegroundService : LifecycleService() {

    private lateinit var wakeWordEngine: WakeWordEngine
    private lateinit var speechRecognizer: SpeechRecognizerManager
    private lateinit var ttsEngine: TextToSpeechEngine
    private lateinit var overlayManager: JarvisOverlayManager

    override fun onCreate() {
        super.onCreate()

        wakeWordEngine = WakeWordEngine(this)
        speechRecognizer = SpeechRecognizerManager(this)
        ttsEngine = TextToSpeechEngine(this)
        overlayManager = JarvisOverlayManager(this)

        setupWakeWordListener()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        super.onStartCommand(intent, flags, startId)

        val notification = createServiceNotification()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            startForeground(
                NOTIFICATION_ID,
                notification,
                ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE
            )
        } else {
            startForeground(NOTIFICATION_ID, notification)
        }

        wakeWordEngine.startListening()
        return START_STICKY
    }

    private fun setupWakeWordListener() {
        wakeWordEngine.onWakeWordDetected = {
            Log.d("JarvisService", "Hey Jarvis Wake-Word Activated!")
            // Show overlay UI instantly
            overlayManager.showOverlayWindow()
            ttsEngine.speak("Yes? How can I help you?") {
                // Return to listening mode after speaking prompt
                speechRecognizer.startListening()
            }
        }

        speechRecognizer.onSpeechResult = { query ->
            overlayManager.updateRecognizedText(query)
            overlayManager.setThinkingState(true)
            // Process query
            ttsEngine.speak("Processing $query...") {
                overlayManager.setThinkingState(false)
                // Resume wake word listening loop
                wakeWordEngine.startListening()
            }
        }
    }

    private fun createServiceNotification(): Notification {
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        return NotificationCompat.Builder(this, JarvisApplication.CHANNEL_ID)
            .setContentTitle("Jarvis Assistant Active")
            .setContentText("Listening for \"Hey Jarvis\"...")
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }

    override fun onDestroy() {
        wakeWordEngine.stopListening()
        speechRecognizer.stopListening()
        ttsEngine.shutdown()
        overlayManager.removeOverlayWindow()
        super.onDestroy()
    }

    override fun onBind(intent: Intent): IBinder? {
        super.onBind(intent)
        return null
    }

    companion object {
        const val NOTIFICATION_ID = 1001
    }
}
