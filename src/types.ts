/**
 * Shared Type Declarations for Jarvis Android Assistant Simulator
 */

export type AndroidIntent =
  | "OPEN_GMAIL"
  | "SET_REMINDER"
  | "TOGGLE_FLASHLIGHT"
  | "OPEN_CALENDAR"
  | "SHOW_WEATHER"
  | "SEARCH_WEB"
  | "PLAY_MUSIC"
  | "NONE";

export interface IntentData {
  recipient?: string;
  subject?: string;
  body?: string;
  time?: string;
  query?: string;
  status?: string; // "on" | "off"
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  intent?: AndroidIntent;
  intentData?: IntentData;
}

export type LogType = "info" | "intent" | "bind" | "power" | "perm" | "error" | "broadcast";

export interface FrameworkLog {
  id: string;
  type: LogType;
  tag: string; // e.g., "VoiceInteractionService", "IntentResolver"
  message: string;
  timestamp: string; // HH:mm:ss.SSS
  details?: string;
}

export type ActiveApp =
  | "homescreen"
  | "gmail"
  | "calendar"
  | "weather"
  | "clock"
  | "music"
  | "search"
  | "settings"
  | "workspace";

export type AssistantLifecycleState =
  | "DISABLED"
  | "INITIALIZING"
  | "IDLE"
  | "WAKE_LISTENING"
  | "WAKE_DETECTED"
  | "OVERLAY_OPENING"
  | "COMMAND_LISTENING"
  | "PROCESSING"
  | "SPEAKING"
  | "WAITING_FOR_FOLLOW_UP"
  | "RETURNING_TO_STANDBY"
  | "ERROR"
  | "PAUSED";

export interface DeviceState {
  batteryLevel: number;
  isCharging: boolean;
  flashlightOn: boolean;
  networkConnected: boolean;
  systemTime: string;
  microphoneGranted: boolean;
  wakeWordActive: boolean;
  cpuLoad: number;
  memoryUsage: string; // e.g., "2.4 GB / 8.0 GB"
  assistantOpen: boolean;
  isListening: boolean;
  isProcessing: boolean;
  speechMuted: boolean;
  lifecycleState?: AssistantLifecycleState;
}
