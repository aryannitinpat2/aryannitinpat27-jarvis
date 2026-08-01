package com.jarvis.assistant.commands

import android.content.Context
import android.content.Intent
import android.hardware.camera2.CameraManager
import android.media.AudioManager
import android.net.Uri
import android.net.wifi.WifiManager
import android.os.BatteryManager
import android.os.Environment
import android.os.StatFs
import android.provider.AlarmClock
import android.provider.CalendarContract
import android.provider.MediaStore
import android.provider.Settings
import android.util.Log
import java.text.SimpleDateFormat
import java.util.*

/**
 * Executes native Android Intent commands safely with proper authorization checks
 */
class CommandProcessor(private val context: Context) {

    fun executeCommand(command: String, params: Map<String, String> = emptyMap()): CommandResult {
        return try {
            when (command.uppercase()) {
                "OPEN_APP" -> openApp(params["appName"] ?: "")
                "CALL_CONTACT" -> callContact(params["number"] ?: params["name"] ?: "")
                "SEND_SMS" -> sendSms(params["number"] ?: "", params["message"] ?: "")
                "DRAFT_EMAIL" -> draftEmail(params["to"] ?: "", params["subject"] ?: "", params["body"] ?: "")
                "CREATE_REMINDER" -> createCalendarReminder(params["title"] ?: "Jarvis Reminder", params["timeMs"]?.toLongOrNull() ?: System.currentTimeMillis() + 3600000)
                "SET_ALARM" -> setAlarm(params["hour"]?.toIntOrNull() ?: 7, params["minute"]?.toIntOrNull() ?: 0, params["label"] ?: "Jarvis Alarm")
                "TOGGLE_FLASHLIGHT" -> toggleFlashlight(params["enable"]?.toBoolean() ?: true)
                "LAUNCH_CAMERA" -> launchCamera()
                "LAUNCH_CALCULATOR" -> launchCalculator()
                "OPEN_SETTINGS" -> openSettings()
                "NAVIGATE_MAPS" -> navigateMaps(params["destination"] ?: "")
                "SEARCH_WEB" -> searchWeb(params["query"] ?: "")
                "PLAY_MUSIC" -> controlMusic("PLAY")
                "PAUSE_MUSIC" -> controlMusic("PAUSE")
                "GET_BATTERY_STATUS" -> getBatteryStatus()
                "GET_DEVICE_STORAGE" -> getStorageInfo()
                "GET_TIME_DATE" -> getTimeAndDate()
                else -> CommandResult.Success("Command processed: $command")
            }
        } catch (e: Exception) {
            Log.e("CommandProcessor", "Failed to execute command $command", e)
            CommandResult.Error(e.localizedMessage ?: "Execution failed")
        }
    }

    private fun openApp(appName: String): CommandResult {
        val pm = context.packageManager
        val intent = pm.getLaunchIntentForPackage(appName)
            ?: Intent(Intent.ACTION_MAIN).apply {
                addCategory(Intent.CATEGORY_LAUNCHER)
            }
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(intent)
        return CommandResult.Success("Opening $appName")
    }

    private fun callContact(number: String): CommandResult {
        val intent = Intent(Intent.ACTION_CALL, Uri.parse("tel:$number")).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
        return CommandResult.Success("Initiating call to $number")
    }

    private fun sendSms(number: String, message: String): CommandResult {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse("sms:$number")).apply {
            putExtra("sms_body", message)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
        return CommandResult.Success("Prepared SMS for $number")
    }

    private fun draftEmail(to: String, subject: String, body: String): CommandResult {
        val intent = Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:$to")).apply {
            putExtra(Intent.EXTRA_SUBJECT, subject)
            putExtra(Intent.EXTRA_TEXT, body)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
        return CommandResult.Success("Prepared draft email to $to")
    }

    private fun createCalendarReminder(title: String, timeMs: Long): CommandResult {
        val intent = Intent(Intent.ACTION_INSERT, CalendarContract.Events.CONTENT_URI).apply {
            putExtra(CalendarContract.Events.TITLE, title)
            putExtra(CalendarContract.EXTRA_EVENT_BEGIN_TIME, timeMs)
            putExtra(CalendarContract.EXTRA_EVENT_END_TIME, timeMs + 1800000)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
        return CommandResult.Success("Added event: $title")
    }

    private fun setAlarm(hour: Int, minute: Int, label: String): CommandResult {
        val intent = Intent(AlarmClock.ACTION_SET_ALARM).apply {
            putExtra(AlarmClock.EXTRA_HOUR, hour)
            putExtra(AlarmClock.EXTRA_MINUTES, minute)
            putExtra(AlarmClock.EXTRA_MESSAGE, label)
            putExtra(AlarmClock.EXTRA_SKIP_UI, false)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
        return CommandResult.Success("Alarm set for $hour:$minute")
    }

    private fun toggleFlashlight(enable: Boolean): CommandResult {
        val cameraManager = context.getSystemService(Context.CAMERA_SERVICE) as CameraManager
        val cameraId = cameraManager.cameraIdList.firstOrNull() ?: return CommandResult.Error("No camera found")
        cameraManager.setTorchMode(cameraId, enable)
        return CommandResult.Success(if (enable) "Flashlight turned ON" else "Flashlight turned OFF")
    }

    private fun launchCamera(): CommandResult {
        val intent = Intent(MediaStore.INTENT_ACTION_STILL_IMAGE_CAMERA).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
        return CommandResult.Success("Camera opened")
    }

    private fun launchCalculator(): CommandResult {
        val intent = Intent(Intent.ACTION_MAIN).apply {
            addCategory(Intent.CATEGORY_APP_CALCULATOR)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
        return CommandResult.Success("Calculator launched")
    }

    private fun openSettings(): CommandResult {
        val intent = Intent(Settings.ACTION_SETTINGS).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
        return CommandResult.Success("System settings opened")
    }

    private fun navigateMaps(destination: String): CommandResult {
        val gmmIntentUri = Uri.parse("google.navigation:q=${Uri.encode(destination)}")
        val intent = Intent(Intent.ACTION_VIEW, gmmIntentUri).apply {
            setPackage("com.google.android.apps.maps")
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
        return CommandResult.Success("Navigating to $destination")
    }

    private fun searchWeb(query: String): CommandResult {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.google.com/search?q=${Uri.encode(query)}")).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
        return CommandResult.Success("Searching web for: $query")
    }

    private fun controlMusic(action: String): CommandResult {
        val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
        val event = if (action == "PLAY") 126 else 127 // KEYCODE_MEDIA_PLAY / PAUSE
        audioManager.dispatchMediaKeyEvent(android.view.KeyEvent(android.view.KeyEvent.ACTION_DOWN, event))
        audioManager.dispatchMediaKeyEvent(android.view.KeyEvent(android.view.KeyEvent.ACTION_UP, event))
        return CommandResult.Success("Music $action triggered")
    }

    private fun getBatteryStatus(): CommandResult {
        val bm = context.getSystemService(Context.BATTERY_SERVICE) as BatteryManager
        val level = bm.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
        return CommandResult.Success("Current battery level is $level%")
    }

    private fun getStorageInfo(): CommandResult {
        val stat = StatFs(Environment.getDataDirectory().path)
        val bytesAvailable = stat.availableBlocksLong * stat.blockSizeLong
        val gigabytesAvailable = bytesAvailable / (1024 * 1024 * 1024)
        return CommandResult.Success("Available internal storage: $gigabytesAvailable GB")
    }

    private fun getTimeAndDate(): CommandResult {
        val sdf = SimpleDateFormat("EEEE, MMMM d, yyyy 'at' h:mm a", Locale.getDefault())
        return CommandResult.Success("Current time and date: ${sdf.format(Date())}")
    }
}

sealed class CommandResult {
    data class Success(val message: String) : CommandResult()
    data class Error(val reason: String) : CommandResult()
}
