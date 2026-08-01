package com.jarvis.assistant.overlay

import android.content.Context
import android.graphics.PixelFormat
import android.os.Build
import android.provider.Settings
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.WindowManager
import android.widget.TextView
import com.jarvis.assistant.R

/**
 * WindowManager Overlay UI Manager
 * Displays draggable floating assistant UI when "Hey Jarvis" is triggered.
 */
class JarvisOverlayManager(private val context: Context) {

    private var windowManager: WindowManager? = null
    private var overlayView: View? = null
    private var isOverlayShowing = false

    fun showOverlayWindow() {
        if (!Settings.canDrawOverlays(context)) {
            return
        }

        if (isOverlayShowing) return

        windowManager = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager

        val layoutParams = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else
                @Suppress("DEPRECATION") WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL
            y = 100
        }

        // Programmatically generate overlay container
        val view = TextView(context).apply {
            text = "⚡ Jarvis Active — Listening..."
            textSize = 16f
            setTextColor(0xFF00F2FE.toInt())
            setBackgroundColor(0xEE0B0F19.toInt())
            setPadding(32, 24, 32, 24)
        }

        try {
            windowManager?.addView(view, layoutParams)
            overlayView = view
            isOverlayShowing = true
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun updateRecognizedText(text: String) {
        (overlayView as? TextView)?.text = "🎙️ \"$text\""
    }

    fun setThinkingState(isThinking: Boolean) {
        if (isThinking) {
            (overlayView as? TextView)?.text = "🧠 Jarvis is thinking..."
        }
    }

    fun removeOverlayWindow() {
        if (isOverlayShowing && overlayView != null) {
            try {
                windowManager?.removeView(overlayView)
            } catch (e: Exception) {
                e.printStackTrace()
            }
            overlayView = null
            isOverlayShowing = false
        }
    }
}
