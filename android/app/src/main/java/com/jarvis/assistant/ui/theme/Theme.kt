package com.jarvis.assistant.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val JarvisCyan = Color(0xFF00F2FE)
val JarvisBlue = Color(0xFF4FACFE)
val JarvisDarkBg = Color(0xFF0B0F19)
val JarvisSurface = Color(0xFF131B2E)
val JarvisSurfaceVariant = Color(0xFF1E293B)
val JarvisTextPrimary = Color(0xFFF1F5F9)
val JarvisTextSecondary = Color(0xFF94A3B8)

private val DarkColorScheme = darkColorScheme(
    primary = JarvisCyan,
    secondary = JarvisBlue,
    background = JarvisDarkBg,
    surface = JarvisSurface,
    surfaceVariant = JarvisSurfaceVariant,
    onPrimary = Color.Black,
    onBackground = JarvisTextPrimary,
    onSurface = JarvisTextPrimary,
    onSurfaceVariant = JarvisTextSecondary
)

@Composable
fun JarvisTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
