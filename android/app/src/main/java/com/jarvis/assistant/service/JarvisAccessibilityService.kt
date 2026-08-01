package com.jarvis.assistant.service

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent

/**
 * Optional Accessibility Service for Assisted Automation Actions
 */
class JarvisAccessibilityService : AccessibilityService() {

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        // Safe context capture if explicitly user-enabled
    }

    override fun onInterrupt() {}
}
