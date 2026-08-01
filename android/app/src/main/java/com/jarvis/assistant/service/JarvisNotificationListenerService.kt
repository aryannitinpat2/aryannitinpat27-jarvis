package com.jarvis.assistant.service

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log

/**
 * Notification Listener Service for Smart Summaries & Action Extractions
 */
class JarvisNotificationListenerService : NotificationListenerService() {

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        super.onNotificationPosted(sbn)
        sbn?.let {
            val packageName = it.packageName
            val title = it.notification.extras.getString("android.title") ?: ""
            val text = it.notification.extras.getCharSequence("android.text")?.toString() ?: ""

            if (packageName.contains("gm") || packageName.contains("whatsapp") || packageName.contains("messaging")) {
                Log.d("JarvisNotification", "Extracted notification from $packageName: $title - $text")
                // Store summary in local Room database for Home tab smart cards
            }
        }
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification?) {
        super.onNotificationRemoved(sbn)
    }
}
