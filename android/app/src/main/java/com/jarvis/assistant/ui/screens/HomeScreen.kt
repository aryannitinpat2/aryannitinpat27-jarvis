package com.jarvis.assistant.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.jarvis.assistant.ui.theme.*

@Composable
fun HomeScreen(
    onStartVoiceSession: () -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(JarvisDarkBg)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Header Briefing Card
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = JarvisSurface),
                shape = RoundedCornerShape(20.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, JarvisCyan.copy(alpha = 0.3f), RoundedCornerShape(20.dp))
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(12.dp)
                                    .clip(CircleShape)
                                    .background(JarvisCyan)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "WAKE-WORD ACTIVE (\"Hey Jarvis\")",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = JarvisCyan
                            )
                        }
                        IconButton(onClick = onStartVoiceSession) {
                            Icon(Icons.Default.Mic, contentDescription = "Mic", tint = JarvisCyan)
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "Good day, Sir. I am online and operational.",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Daily Brief: You have 3 schedule meetings, 2 urgent emails requiring replies, and 4 fitness habits logged.",
                        fontSize = 14.sp,
                        color = JarvisTextSecondary
                    )
                }
            }
        }

        // Smart Cards Grid
        item {
            Text("Smart Assistant Cards", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Spacer(modifier = Modifier.height(8.dp))

            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                SmartCardItem(
                    icon = Icons.Default.Email,
                    title = "Unread Email Summary",
                    subtitle = "2 high-priority messages from Product Lead",
                    badge = "Gmail",
                    color = Color(0xFFEA4335)
                )
                SmartCardItem(
                    icon = Icons.Default.Event,
                    title = "Upcoming Meeting",
                    subtitle = "Architecture Review in 45 minutes (11:00 AM)",
                    badge = "Calendar",
                    color = Color(0xFF4285F4)
                )
                SmartCardItem(
                    icon = Icons.Default.Notifications,
                    title = "Pending Reminder",
                    subtitle = "Call Mumbai supplier regarding batch status",
                    badge = "Reminders",
                    color = Color(0xFFFBBC05)
                )
                SmartCardItem(
                    icon = Icons.Default.PhoneCallback,
                    title = "Call Follow-up",
                    subtitle = "Draft summary ready for yesterday's 15m client sync",
                    badge = "Call AI",
                    color = Color(0xFF34A853)
                )
            }
        }

        // Quick Assistant Actions
        item {
            Text("Quick Actions", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                QuickActionButton(
                    modifier = Modifier.weight(1f),
                    label = "Draft Email",
                    icon = Icons.Default.Edit
                )
                QuickActionButton(
                    modifier = Modifier.weight(1f),
                    label = "New Reminder",
                    icon = Icons.Default.AddAlarm
                )
                QuickActionButton(
                    modifier = Modifier.weight(1f),
                    label = "Translate",
                    icon = Icons.Default.Translate
                )
            }
        }

        // Suggested Next Actions
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = JarvisSurfaceVariant),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Suggested Next Action", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = JarvisCyan)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        "\"Shall I prepare your LinkedIn update summarizing your weekly development highlights in English and Hindi?\"",
                        fontSize = 13.sp,
                        color = Color.White
                    )
                }
            }
        }
    }
}

@Composable
fun SmartCardItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    subtitle: String,
    badge: String,
    color: Color
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = JarvisSurface),
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .background(color.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = null, tint = color, modifier = Modifier.size(24.dp))
            }

            Spacer(modifier = Modifier.width(16.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(title, fontSize = 15.sp, fontWeight = FontWeight.SemiBold, color = Color.White)
                    Surface(
                        color = color.copy(alpha = 0.2f),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(
                            text = badge,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = color,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                        )
                    }
                }
                Spacer(modifier = Modifier.height(2.dp))
                Text(subtitle, fontSize = 13.sp, color = JarvisTextSecondary)
            }
        }
    }
}

@Composable
fun QuickActionButton(
    modifier: Modifier = Modifier,
    label: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector
) {
    Button(
        onClick = {},
        modifier = modifier,
        colors = ButtonDefaults.buttonColors(containerColor = JarvisSurface),
        shape = RoundedCornerShape(14.dp),
        contentPadding = PaddingValues(12.dp)
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(icon, contentDescription = null, tint = JarvisCyan, modifier = Modifier.size(20.dp))
            Spacer(modifier = Modifier.height(4.dp))
            Text(label, fontSize = 12.sp, color = Color.White)
        }
    }
}
