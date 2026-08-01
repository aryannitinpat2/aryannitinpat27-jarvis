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
fun ConnectorsScreen() {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(JarvisDarkBg)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text("Connectors & Integrations", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Text("OAuth account linking, automated sync & permissions", fontSize = 13.sp, color = JarvisTextSecondary)
        }

        // Active Connectors
        item {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                ConnectorItemCard(
                    name = "Gmail",
                    email = "aryannitinpat27@gmail.com",
                    isConnected = true,
                    lastSync = "Synced 5 mins ago",
                    scopes = "read_only_inbox, draft_reply",
                    icon = Icons.Default.Email,
                    color = Color(0xFFEA4335)
                )

                ConnectorItemCard(
                    name = "Google Calendar",
                    email = "aryannitinpat27@gmail.com",
                    isConnected = true,
                    lastSync = "Synced 10 mins ago",
                    scopes = "read_events, create_event",
                    icon = Icons.Default.Event,
                    color = Color(0xFF4285F4)
                )

                ConnectorItemCard(
                    name = "LinkedIn",
                    email = "aryan-patil@linkedin",
                    isConnected = true,
                    lastSync = "Synced 1 hr ago",
                    scopes = "w_member_social",
                    icon = Icons.Default.Share,
                    color = Color(0xFF0A66C2)
                )

                ConnectorItemCard(
                    name = "Notes & Reminders",
                    email = "On-Device Storage",
                    isConnected = true,
                    lastSync = "Realtime local sync",
                    scopes = "room_database",
                    icon = Icons.Default.NoteAlt,
                    color = JarvisCyan
                )
            }
        }

        // Automation Builder Card
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = JarvisSurface),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Build, contentDescription = null, tint = JarvisCyan)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Routine Automation Builder", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        "When 08:00 AM arrives -> Summarize Gmail inbox -> Create calendar task -> Notify via 'Hey Jarvis' voice briefing.",
                        fontSize = 13.sp,
                        color = JarvisTextSecondary
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Button(
                        onClick = {},
                        colors = ButtonDefaults.buttonColors(containerColor = JarvisSurfaceVariant),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text("Configure Routine Rule", color = JarvisCyan)
                    }
                }
            }
        }
    }
}

@Composable
fun ConnectorItemCard(
    name: String,
    email: String,
    isConnected: Boolean,
    lastSync: String,
    scopes: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    color: Color
) {
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
                    Icon(icon, contentDescription = null, tint = color)
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(name, fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color.White)
                }
                Switch(
                    checked = isConnected,
                    onCheckedChange = {},
                    colors = SwitchDefaults.colors(checkedThumbColor = JarvisCyan, checkedTrackColor = JarvisSurfaceVariant)
                )
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text("Account: $email", fontSize = 12.sp, color = JarvisTextSecondary)
            Text("Scopes: $scopes", fontSize = 11.sp, color = JarvisTextSecondary)
            Spacer(modifier = Modifier.height(6.dp))
            Text(lastSync, fontSize = 11.sp, color = JarvisCyan)
        }
    }
}
