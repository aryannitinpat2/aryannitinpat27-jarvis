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
fun JournalScreen() {
    var searchQuery by remember { mutableStateOf("") }
    var noteText by remember { mutableStateOf("") }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(JarvisDarkBg)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text("Private E-Diary & Voice Journal", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Text("Encrypted on-device notes and daily reflections", fontSize = 13.sp, color = JarvisTextSecondary)
        }

        // Search Bar
        item {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("Search journal, tags, or memory...", color = JarvisTextSecondary) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = JarvisCyan) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = JarvisCyan,
                    unfocusedBorderColor = JarvisSurfaceVariant,
                    focusedContainerColor = JarvisSurface,
                    unfocusedContainerColor = JarvisSurface
                )
            )
        }

        // New Voice Note Editor
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = JarvisSurface),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("New Journal Entry", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = JarvisCyan)
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = noteText,
                        onValueChange = { noteText = it },
                        placeholder = { Text("Speak or write your daily thoughts...", color = JarvisTextSecondary) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(100.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Color.Transparent,
                            unfocusedBorderColor = Color.Transparent,
                            focusedContainerColor = JarvisSurfaceVariant,
                            unfocusedContainerColor = JarvisSurfaceVariant
                        ),
                        shape = RoundedCornerShape(12.dp)
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            IconButton(onClick = {}) {
                                Icon(Icons.Default.Mic, contentDescription = "Voice Input", tint = JarvisCyan)
                            }
                            IconButton(onClick = {}) {
                                Icon(Icons.Default.Tag, contentDescription = "Add Tag", tint = JarvisTextSecondary)
                            }
                        }
                        Button(
                            onClick = { noteText = "" },
                            colors = ButtonDefaults.buttonColors(containerColor = JarvisCyan),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text("Save Entry", color = Color.Black, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        // Daily Auto Summary
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = JarvisSurfaceVariant),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = JarvisCyan)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Jarvis AI Daily Summary", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        "\"Focused productively on native Android architecture refactoring today. Completed 2 gym sessions this week and kept up with Hindi and Marathi translation practice.\"",
                        fontSize = 13.sp,
                        color = JarvisTextSecondary
                    )
                }
            }
        }

        // Past Entries
        item {
            Text("Past Entries", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Spacer(modifier = Modifier.height(8.dp))

            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                JournalEntryCard(
                    date = "July 24, 2026",
                    title = "Android Hilt & Room Integration",
                    snippet = "Configured clean architecture and local encrypted persistence for Jarvis database.",
                    tags = "#Android #Coding #Architecture",
                    mood = "Productive"
                )
                JournalEntryCard(
                    date = "July 23, 2026",
                    title = "Voice Activity Detection Tuning",
                    snippet = "Tested low-power PCM audio buffer streaming for 'Hey Jarvis' hotword detection.",
                    tags = "#AI #Voice #Jarvis",
                    mood = "Focused"
                )
            }
        }
    }
}

@Composable
fun JournalEntryCard(date: String, title: String, snippet: String, tags: String, mood: String) {
    Card(
        colors = CardDefaults.cardColors(containerColor = JarvisSurface),
        shape = RoundedCornerShape(14.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(date, fontSize = 11.sp, color = JarvisCyan)
                Surface(color = JarvisSurfaceVariant, shape = RoundedCornerShape(6.dp)) {
                    Text(mood, fontSize = 10.sp, color = Color.White, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                }
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(title, fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Spacer(modifier = Modifier.height(4.dp))
            Text(snippet, fontSize = 13.sp, color = JarvisTextSecondary)
            Spacer(modifier = Modifier.height(8.dp))
            Text(tags, fontSize = 11.sp, color = JarvisCyan.copy(alpha = 0.8f))
        }
    }
}
