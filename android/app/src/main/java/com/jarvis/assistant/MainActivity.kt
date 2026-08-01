package com.jarvis.assistant

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.core.content.ContextCompat
import com.jarvis.assistant.service.JarvisForegroundService
import com.jarvis.assistant.ui.components.VoiceOverlayUI
import com.jarvis.assistant.ui.screens.*
import com.jarvis.assistant.ui.theme.JarvisCyan
import com.jarvis.assistant.ui.theme.JarvisDarkBg
import com.jarvis.assistant.ui.theme.JarvisSurface
import com.jarvis.assistant.ui.theme.JarvisTheme

enum class NavigationTab {
    HOME,
    AGENDA,
    JOURNAL,
    FITNESS,
    CONNECTORS,
    SETTINGS
}

class MainActivity : ComponentActivity() {

    private val permissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val micGranted = permissions[Manifest.permission.RECORD_AUDIO] ?: false
        if (micGranted) {
            startJarvisService()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate()
        checkAndRequestPermissions()

        setContent {
            JarvisTheme {
                var currentTab by remember { mutableStateOf(NavigationTab.HOME) }
                var showVoiceSessionOverlay by remember { mutableStateOf(false) }

                Scaffold(
                    bottomBar = {
                        NavigationBar(
                            containerColor = JarvisSurface,
                            contentColor = JarvisCyan
                        ) {
                            NavigationBarItem(
                                selected = currentTab == NavigationTab.HOME,
                                onClick = { currentTab = NavigationTab.HOME },
                                icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
                                label = { Text("Home", color = if (currentTab == NavigationTab.HOME) JarvisCyan else Color.Gray) }
                            )
                            NavigationBarItem(
                                selected = currentTab == NavigationTab.AGENDA,
                                onClick = { currentTab = NavigationTab.AGENDA },
                                icon = { Icon(Icons.Default.CalendarToday, contentDescription = "Agenda") },
                                label = { Text("Agenda", color = if (currentTab == NavigationTab.AGENDA) JarvisCyan else Color.Gray) }
                            )
                            NavigationBarItem(
                                selected = currentTab == NavigationTab.JOURNAL,
                                onClick = { currentTab = NavigationTab.JOURNAL },
                                icon = { Icon(Icons.Default.Book, contentDescription = "Journal") },
                                label = { Text("Journal", color = if (currentTab == NavigationTab.JOURNAL) JarvisCyan else Color.Gray) }
                            )
                            NavigationBarItem(
                                selected = currentTab == NavigationTab.FITNESS,
                                onClick = { currentTab = NavigationTab.FITNESS },
                                icon = { Icon(Icons.Default.FitnessCenter, contentDescription = "Fitness") },
                                label = { Text("Fitness", color = if (currentTab == NavigationTab.FITNESS) JarvisCyan else Color.Gray) }
                            )
                            NavigationBarItem(
                                selected = currentTab == NavigationTab.CONNECTORS,
                                onClick = { currentTab = NavigationTab.CONNECTORS },
                                icon = { Icon(Icons.Default.Link, contentDescription = "Connectors") },
                                label = { Text("Connectors", color = if (currentTab == NavigationTab.CONNECTORS) JarvisCyan else Color.Gray) }
                            )
                        }
                    },
                    topBar = {
                        SmallTopAppBar(
                            title = { Text("JARVIS ASSISTANT", color = JarvisCyan) },
                            colors = TopAppBarDefaults.smallTopAppBarColors(containerColor = JarvisSurface),
                            actions = {
                                IconButton(onClick = { currentTab = NavigationTab.SETTINGS }) {
                                    Icon(Icons.Default.Settings, contentDescription = "Settings", tint = Color.White)
                                }
                            }
                        )
                    }
                ) { innerPadding ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                            .background(JarvisDarkBg)
                    ) {
                        when (currentTab) {
                            NavigationTab.HOME -> HomeScreen(onStartVoiceSession = { showVoiceSessionOverlay = true })
                            NavigationTab.AGENDA -> AgendaScreen()
                            NavigationTab.JOURNAL -> JournalScreen()
                            NavigationTab.FITNESS -> FitnessScreen()
                            NavigationTab.CONNECTORS -> ConnectorsScreen()
                            NavigationTab.SETTINGS -> SettingsScreen()
                        }

                        if (showVoiceSessionOverlay) {
                            VoiceOverlayUI(
                                state = "Listening",
                                spokenText = "Hey Jarvis, prepare today's agenda",
                                onDismiss = { showVoiceSessionOverlay = false }
                            )
                        }
                    }
                }
            }
        }
    }

    private fun checkAndRequestPermissions() {
        val permissions = mutableListOf(
            Manifest.permission.RECORD_AUDIO,
            Manifest.permission.READ_CONTACTS,
            Manifest.permission.CALL_PHONE,
            Manifest.permission.SEND_SMS
        )

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            permissions.add(Manifest.permission.POST_NOTIFICATIONS)
        }

        val missing = permissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }

        if (missing.isNotEmpty()) {
            permissionLauncher.launch(missing.toTypedArray())
        } else {
            startJarvisService()
        }

        // Request overlay permission if missing
        if (!Settings.canDrawOverlays(this)) {
            val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION)
            startActivity(intent)
        }
    }

    private fun startJarvisService() {
        val intent = Intent(this, JarvisForegroundService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(intent)
        } else {
            startService(intent)
        }
    }
}
