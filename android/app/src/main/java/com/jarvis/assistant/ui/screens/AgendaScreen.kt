package com.jarvis.assistant.ui.screens

import androidx.compose.foundation.background
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
fun AgendaScreen() {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(JarvisDarkBg)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text("Today's Agenda & Schedule", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Text("July 25, 2026 • Sunny 28°C", fontSize = 13.sp, color = JarvisTextSecondary)
        }

        // "What should I do next?" Card
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = JarvisSurface),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(JarvisCyan.copy(alpha = 0.2f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.HelpOutline, contentDescription = null, tint = JarvisCyan)
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text("What should I do next?", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        Text("Prepare notes for 11:00 AM Architecture Review meeting with team.", fontSize = 13.sp, color = JarvisTextSecondary)
                    }
                }
            }
        }

        // Priority Items Section
        item {
            Text("Schedule & Reminders", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Spacer(modifier = Modifier.height(8.dp))

            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                ScheduleItem("09:30 AM", "Morning Sync & Daily Standup", "Google Meet", "High Priority")
                ScheduleItem("11:00 AM", "Architecture Review (Android Hilt/Room)", "Conference Room 3", "Meeting")
                ScheduleItem("02:00 PM", "Call Mumbai Logistics Contact", "Phone Call", "Follow-up")
                ScheduleItem("05:30 PM", "Review Weekly Sprint Backlog", "Jira / GitHub", "Task")
            }
        }
    }
}

@Composable
fun ScheduleItem(time: String, title: String, location: String, tag: String) {
    Card(
        colors = CardDefaults.cardColors(containerColor = JarvisSurface),
        shape = RoundedCornerShape(14.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.width(70.dp)) {
                Text(time, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = JarvisCyan)
            }
            Divider(modifier = Modifier.height(30.dp).width(1.dp), color = JarvisSurfaceVariant)
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(title, fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color.White)
                Text(location, fontSize = 12.sp, color = JarvisTextSecondary)
            }
            Surface(
                color = JarvisSurfaceVariant,
                shape = RoundedCornerShape(8.dp)
            ) {
                Text(
                    text = tag,
                    fontSize = 10.sp,
                    color = JarvisCyan,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                )
            }
        }
    }
}
