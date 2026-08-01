package com.jarvis.assistant.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "journal_entries")
data class JournalEntryEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val title: String,
    val content: String,
    val timestamp: Long,
    val tags: String, // Comma separated
    val mood: String, // Neutral, Productive, Focused, Calm
    val isVoiceGenerated: Boolean = false
)

@Entity(tableName = "habits")
data class HabitEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val title: String,
    val category: String, // Water, Gym, Run, Mindfulness, Reading
    val targetFrequency: String, // Daily, Monthly
    val currentStreak: Int,
    val isCompletedToday: Boolean,
    val completionHistoryJson: String // Serialized dates
)

@Entity(tableName = "reminders")
data class ReminderEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val title: String,
    val dueTimestamp: Long,
    val category: String, // Task, Meeting, CallFollowUp
    val isCompleted: Boolean = false,
    val priority: String = "Normal" // High, Normal, Low
)

@Entity(tableName = "connectors")
data class ConnectorEntity(
    @PrimaryKey val serviceId: String, // gmail, calendar, linkedin, notes
    val serviceName: String,
    val isConnected: Boolean,
    val accountEmail: String?,
    val lastSyncTimestamp: Long,
    val scopesGranted: String
)

@Entity(tableName = "call_logs")
data class CallLogEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val contactName: String,
    val phoneNumber: String,
    val timestamp: Long,
    val durationSeconds: Int,
    val summaryText: String?,
    val actionItems: String?
)
