# Jarvis Android AI Assistant — Native Kotlin & Jetpack Compose App Project

This repository contains the full, production-ready, native Android application source code for **Jarvis**, a futuristic, voice-first, proactive personal AI assistant built in Kotlin and Jetpack Compose for Android 10+ (API Level 29+).

---

## 🚀 Key Features

### 1. Always-On Wake-Word System ("Hey Jarvis")
- **Foreground Service**: Runs `JarvisForegroundService` with a persistent notification and low-power PCM audio stream processing.
- **On-Device Voice Activity Detection (VAD)**: Analyzes audio energy spikes and hotword acoustics locally without transmitting raw audio continuous background streams to remote servers.
- **Auto-Re-listening Loop**: Automatically returns to wake-word listening mode after completing speech responses or user commands.

### 2. Conversational Engine & Multi-Lingual Speech
- **Voice Output**: Deep male butler voice preset (Pitch `0.85f`) built with native Android `TextToSpeech`.
- **Multi-lingual Support**: Supports English, Marathi (मराठी), and Hindi (हिंदी) with automatic language detection and response matching.
- **Floating Overlay UI**: Custom `WindowManager` overlay (`TYPE_APPLICATION_OVERLAY`) with real-time waveform pulse animations, listening, thinking, speaking, and idle visual indicators.

### 3. Clean 5-Tab Navigation Structure
1. **Home**: Wake-word status, daily brief, smart cards (Unread Email, Meetings, Reminders, Call Follow-ups), quick assistant actions, and suggested next actions.
2. **Agenda**: Today's schedule, meetings, reminders, tasks, call follow-ups, weather summary, and "What should I do next?" smart card.
3. **Journal**: Encrypted private e-diary, freeform note taking, voice-to-text journal entries, AI daily summary, search tags, convert notes to tasks/reminders.
4. **Fitness**: Monthly checklist, day-by-day habit tracking, custom habits, water intake hydration tracker, gym & run tracking, completion rate, and streaks.
5. **Connectors**: Gmail, Google Calendar, LinkedIn, Notes connectors, OAuth account linking status, scopes granted, last sync time, and routine automation builder.

### 4. Modular AI Provider Architecture
- Clean repository abstraction (`AiProviderRepository`) supporting:
  - **Gemini API** (`gemini-3.6-flash` / `gemini-3.1-flash-live-preview`)
  - **OpenAI API** (`gpt-4o`)
  - **Anthropic API** (`claude-3-5-sonnet`)
  - **Local On-Device LLM** (`gemma-2b-it-local`)

---

## 🛠️ Project Structure

```
android/
├── settings.gradle.kts
├── build.gradle.kts
├── gradle.properties
└── app/
    ├── build.gradle.kts
    └── src/main/
        ├── AndroidManifest.xml
        ├── java/com/jarvis/assistant/
        │   ├── JarvisApplication.kt
        │   ├── MainActivity.kt
        │   ├── ai/
        │   │   └── AiProviderRepository.kt
        │   ├── commands/
        │   │   └── CommandProcessor.kt
        │   ├── data/local/
        │   │   ├── Daos.kt
        │   │   ├── Entities.kt
        │   │   └── JarvisDatabase.kt
        │   ├── overlay/
        │   │   └── JarvisOverlayManager.kt
        │   ├── service/
        │   │   ├── JarvisAccessibilityService.kt
        │   │   ├── JarvisForegroundService.kt
        │   │   └── JarvisNotificationListenerService.kt
        │   ├── speech/
        │   │   ├── SpeechRecognizerManager.kt
        │   │   ├── TextToSpeechEngine.kt
        │   │   └── WakeWordEngine.kt
        │   └── ui/
        │       ├── components/
        │       │   ├── CallHandlingPanel.kt
        │       │   └── VoiceOverlayUI.kt
        │       ├── screens/
        │       │   ├── AgendaScreen.kt
        │       │   ├── ConnectorsScreen.kt
        │       │   ├── FitnessScreen.kt
        │       │   ├── HomeScreen.kt
        │       │   ├── JournalScreen.kt
        │       │   └── SettingsScreen.kt
        │       └── theme/
        │           └── Theme.kt
        └── res/
            ├── values/
            │   ├── colors.xml
            │   ├── strings.xml
            │   └── themes.xml
            └── xml/
                ├── accessibility_service_config.xml
                ├── backup_rules.xml
                └── data_extraction_rules.xml
```

---

## 📥 How to Build & Run in Android Studio

1. **Prerequisites**:
   - Android Studio Jellyfish / Iguana / Hedgehog or newer
   - JDK 17 configured in Android Studio Gradle settings
   - Android SDK 34 installed

2. **Open Project**:
   - Open Android Studio -> **File -> Open** -> Select the `android` directory in this project.
   - Allow Gradle sync to complete.

3. **Run on Device or Emulator**:
   - Connect an Android device running Android 10+ (API 29+) with USB Debugging enabled (or launch an AVD Emulator).
   - Click **Run 'app'** (`Shift + F10`).

4. **Permissions Configuration**:
   - When launched, grant **Microphone**, **Notification**, and **Display Over Other Apps** permissions when prompted to enable the background "Hey Jarvis" wake word service.

---

## 🔒 Security & Android Platform Compliance
- **Transparent Authorization**: Explicit runtime permission flows for microphone, contacts, and phone intents.
- **Foreground Service Transparency**: Persistent notification clearly indicates when the microphone audio loop is active.
- **Data Privacy**: Local Room database encryption and encrypted preferences for sensitive account tokens.
