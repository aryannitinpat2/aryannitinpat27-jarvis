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
fun FitnessScreen() {
    var waterIntakeLiters by remember { mutableFloatStateOf(2.5f) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(JarvisDarkBg)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text("Fitness & Habit Tracker", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Text("Monthly checklist, streaks, gym & hydration goals", fontSize = 13.sp, color = JarvisTextSecondary)
        }

        // Stats & Progress Banner
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = JarvisSurface),
                shape = RoundedCornerShape(18.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(20.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("Monthly Completion Rate", fontSize = 12.sp, color = JarvisTextSecondary)
                        Text("88%", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = JarvisCyan)
                        Text("🔥 14-day streak active", fontSize = 12.sp, color = Color(0xFFFF9800))
                    }
                    Box(
                        modifier = Modifier
                            .size(60.dp)
                            .clip(CircleShape)
                            .background(JarvisCyan.copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.FitnessCenter, contentDescription = null, tint = JarvisCyan, modifier = Modifier.size(32.dp))
                    }
                }
            }
        }

        // Water Intake Quick Tracker
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
                            Icon(Icons.Default.WaterDrop, contentDescription = null, tint = Color(0xFF2196F3))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Water Hydration", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        }
                        Text("${"%.1f".format(waterIntakeLiters)} / 3.0 L", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFF2196F3))
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                    LinearProgressIndicator(
                        progress = (waterIntakeLiters / 3.0f).coerceIn(0f, 1f),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(8.dp)
                            .clip(RoundedCornerShape(4.dp)),
                        color = Color(0xFF2196F3),
                        trackColor = JarvisSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Button(
                            onClick = { waterIntakeLiters = (waterIntakeLiters + 0.25f).coerceAtMost(5.0f) },
                            colors = ButtonDefaults.buttonColors(containerColor = JarvisSurfaceVariant),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text("+ 250 ml", color = Color.White, fontSize = 12.sp)
                        }
                        Button(
                            onClick = { waterIntakeLiters = (waterIntakeLiters + 0.5f).coerceAtMost(5.0f) },
                            colors = ButtonDefaults.buttonColors(containerColor = JarvisSurfaceVariant),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text("+ 500 ml", color = Color.White, fontSize = 12.sp)
                        }
                    }
                }
            }
        }

        // Habit Checklist
        item {
            Text("Today's Habits", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Spacer(modifier = Modifier.height(8.dp))

            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                HabitCheckItem("Morning Gym Workout", "45 mins strength", true, Icons.Default.FitnessCenter)
                HabitCheckItem("5km Evening Run", "Cadence & Cardio", false, Icons.Default.DirectionsRun)
                HabitCheckItem("Mindfulness & Meditation", "15 mins breathing", true, Icons.Default.SelfImprovement)
                HabitCheckItem("3.0L Water Goal", "Hydration", true, Icons.Default.WaterDrop)
            }
        }
    }
}

@Composable
fun HabitCheckItem(
    title: String,
    subtitle: String,
    initialChecked: Boolean,
    icon: androidx.compose.ui.graphics.vector.ImageVector
) {
    var checked by remember { mutableStateOf(initialChecked) }

    Card(
        colors = CardDefaults.cardColors(containerColor = JarvisSurface),
        shape = RoundedCornerShape(14.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = checked,
                onCheckedChange = { checked = it },
                colors = CheckboxDefaults.colors(
                    checkedColor = JarvisCyan,
                    uncheckedColor = JarvisTextSecondary
                )
            )
            Spacer(modifier = Modifier.width(12.dp))
            Icon(icon, contentDescription = null, tint = if (checked) JarvisCyan else JarvisTextSecondary)
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    title,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = if (checked) JarvisTextSecondary else Color.White
                )
                Text(subtitle, fontSize = 12.sp, color = JarvisTextSecondary)
            }
        }
    }
}
