package com.jarvis.assistant.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.jarvis.assistant.ui.theme.*

@Composable
fun SettingsScreen() {
    var wakeWordEnabled by remember { mutableStateOf(true) }
    var selectedLanguage by remember { mutableStateOf("English (Automatic Detection)") }
    var selectedVoice by remember { mutableStateOf("Deep Male Butler (Zephyr Pitch 0.85)") }
    var selectedProvider by remember { mutableStateOf("Gemini 3.6 Flash / Live API") }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(JarvisDarkBg)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text("Jarvis System Settings", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Text("Voice triggers, AI models, languages, permissions & privacy", fontSize = 13.sp, color = JarvisTextSecondary)
        }

        // Always-On Wake Word Section
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = JarvisSurface),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Mic, contentDescription = null, tint = JarvisCyan)
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text("\"Hey Jarvis\" Wake Word", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                Text("Foreground service background listener", fontSize = 12.sp, color = JarvisTextSecondary)
                            }
                        }
                        Switch(
                            checked = wakeWordEnabled,
                            onCheckedChange = { wakeWordEnabled = it },
                            colors = SwitchDefaults.colors(checkedThumbColor = JarvisCyan, checkedTrackColor = JarvisSurfaceVariant)
                        )
                    }
                }
            }
        }

        // Voice & Language Selection
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = JarvisSurface),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text("Voice & Language Configuration", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = JarvisCyan)

                    Column {
                        Text("Active Voice Engine", fontSize = 12.sp, color = JarvisTextSecondary)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(selectedVoice, fontSize = 14.sp, color = Color.White)
                    }

                    Divider(color = JarvisSurfaceVariant)

                    Column {
                        Text("Supported Languages", fontSize = 12.sp, color = JarvisTextSecondary)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text("English, Marathi (मराठी), Hindi (हिंदी)", fontSize = 14.sp, color = Color.White)
                    }
                }
            }
        }

        // AI Provider Abstraction
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = JarvisSurface),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text("AI Provider Engine", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = JarvisCyan)

                    Column {
                        Text("Active Backend Model", fontSize = 12.sp, color = JarvisTextSecondary)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(selectedProvider, fontSize = 14.sp, color = Color.White)
                    }

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        FilterChip(selected = true, onClick = {}, label = { Text("Gemini") })
                        FilterChip(selected = false, onClick = {}, label = { Text("OpenAI") })
                        FilterChip(selected = false, onClick = {}, label = { Text("Anthropic") })
                        FilterChip(selected = false, onClick = {}, label = { Text("Local LLM") })
                    }
                }
            }
        }

        // Privacy & Permissions
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = JarvisSurface),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("Privacy & Permission Center", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = JarvisCyan)
                    PermissionRow("Microphone Access", true)
                    PermissionRow("Overlay Window (SYSTEM_ALERT_WINDOW)", true)
                    PermissionRow("Notification Listener", true)
                    PermissionRow("Contacts & Phone Intents", true)
                }
            }
        }
    }
}

@Composable
fun PermissionRow(name: String, granted: Boolean) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(name, fontSize = 13.sp, color = Color.White)
        Surface(
            color = if (granted) Color(0xFF34A853).copy(alpha = 0.2f) else Color.Red.copy(alpha = 0.2f),
            shape = RoundedCornerShape(6.dp)
        ) {
            Text(
                text = if (granted) "Granted" else "Required",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = if (granted) Color(0xFF34A853) else Color.Red,
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
            )
        }
    }
}
