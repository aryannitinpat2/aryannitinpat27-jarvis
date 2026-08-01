import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  User 
} from 'firebase/auth';
import { auth } from './firebase';

export const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/tasks',
  'https://www.googleapis.com/auth/tasks.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/spreadsheets.readonly'
];

let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const googleProvider = new GoogleAuthProvider();
WORKSPACE_SCOPES.forEach((scope) => {
  googleProvider.addScope(scope);
});

export const initWorkspaceAuth = (
  onSuccess?: (user: User, token: string) => void,
  onFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      if (cachedAccessToken) {
        if (onSuccess) onSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Try getting token or prompt sign in
        if (onFailure) onFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onFailure) onFailure();
    }
  });
};

export const signInWithWorkspace = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google Workspace OAuth access token.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (err: any) {
    console.error('Workspace Sign-In Error:', err);
    throw err;
  } finally {
    isSigningIn = false;
  }
};

export const getWorkspaceAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const workspaceSignOut = async () => {
  await firebaseSignOut(auth);
  cachedAccessToken = null;
};

// ============================================================================
// GOOGLE DRIVE API HELPERS
// ============================================================================
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  createdTime?: string;
  modifiedTime?: string;
  size?: string;
}

export async function listDriveFiles(accessToken: string, pageSize = 20): Promise<DriveFile[]> {
  const url = `https://www.googleapis.com/drive/v3/files?pageSize=${pageSize}&fields=files(id,name,mimeType,webViewLink,iconLink,thumbnailLink,createdTime,modifiedTime,size)&q=trashed=false`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Drive API error: ${res.statusText}`);
  }
  const data = await res.json();
  return data.files || [];
}

export async function deleteDriveFile(accessToken: string, fileId: string): Promise<void> {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to delete Drive file: ${res.statusText}`);
  }
}

// ============================================================================
// GMAIL API HELPERS
// ============================================================================
export interface GmailMessageHeader {
  name: string;
  value: string;
}

export interface GmailMessage {
  id: string;
  threadId: string;
  snippet?: string;
  subject?: string;
  from?: string;
  date?: string;
  bodyText?: string;
}

export async function listGmailMessages(accessToken: string, maxResults = 15): Promise<GmailMessage[]> {
  const listUrl = `https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`;
  const res = await fetch(listUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gmail API list error: ${res.statusText}`);
  }
  const data = await res.json();
  const rawMsgs = data.messages || [];

  const detailedMsgs: GmailMessage[] = [];
  for (const item of rawMsgs.slice(0, maxResults)) {
    try {
      const msgUrl = `https://www.googleapis.com/gmail/v1/users/me/messages/${item.id}?format=full`;
      const msgRes = await fetch(msgUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        const headers: GmailMessageHeader[] = msgData.payload?.headers || [];
        const subject = headers.find(h => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
        const from = headers.find(h => h.name.toLowerCase() === 'from')?.value || 'Unknown Sender';
        const date = headers.find(h => h.name.toLowerCase() === 'date')?.value || '';
        
        detailedMsgs.push({
          id: msgData.id,
          threadId: msgData.threadId,
          snippet: msgData.snippet,
          subject,
          from,
          date
        });
      }
    } catch (e) {
      console.warn('Failed to fetch details for message', item.id, e);
    }
  }

  return detailedMsgs;
}

export async function sendGmailEmail(accessToken: string, to: string, subject: string, body: string): Promise<void> {
  const emailLines = [
    `To: ${to}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    body
  ];
  const email = emailLines.join('\r\n');
  const encodedEmail = btoa(unescape(encodeURIComponent(email)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: encodedEmail }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to send email: ${res.statusText}`);
  }
}

export async function trashGmailMessage(accessToken: string, messageId: string): Promise<void> {
  const url = `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/trash`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to trash email: ${res.statusText}`);
  }
}

// ============================================================================
// GOOGLE CALENDAR API HELPERS
// ============================================================================
export interface CalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  location?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  htmlLink?: string;
}

export async function listCalendarEvents(accessToken: string, maxResults = 25): Promise<CalendarEvent[]> {
  const now = new Date().toISOString();
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(now)}&maxResults=${maxResults}&orderBy=startTime&singleEvents=true`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Calendar API error: ${res.statusText}`);
  }
  const data = await res.json();
  return data.items || [];
}

export async function createCalendarEvent(
  accessToken: string, 
  summary: string, 
  startIso: string, 
  endIso: string, 
  description?: string
): Promise<CalendarEvent> {
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      summary,
      description,
      start: { dateTime: startIso },
      end: { dateTime: endIso },
    }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to create Calendar event: ${res.statusText}`);
  }
  return await res.json();
}

export async function deleteCalendarEvent(accessToken: string, eventId: string): Promise<void> {
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to delete Calendar event: ${res.statusText}`);
  }
}

// ============================================================================
// GOOGLE TASKS API HELPERS
// ============================================================================
export interface GoogleTask {
  id: string;
  title: string;
  notes?: string;
  status?: string; // 'needsAction' | 'completed'
  due?: string;
  updated?: string;
}

export async function listGoogleTasks(accessToken: string): Promise<GoogleTask[]> {
  const url = `https://tasks.googleapis.com/tasks/v1/lists/@default/tasks?showCompleted=true`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Tasks API error: ${res.statusText}`);
  }
  const data = await res.json();
  return data.items || [];
}

export async function createGoogleTask(accessToken: string, title: string, notes?: string, dueIso?: string): Promise<GoogleTask> {
  const url = `https://tasks.googleapis.com/tasks/v1/lists/@default/tasks`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      notes,
      due: dueIso,
    }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to create Task: ${res.statusText}`);
  }
  return await res.json();
}

export async function updateTaskStatus(accessToken: string, taskId: string, completed: boolean): Promise<GoogleTask> {
  const url = `https://tasks.googleapis.com/tasks/v1/lists/@default/tasks/${taskId}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: completed ? 'completed' : 'needsAction',
    }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to update Task status: ${res.statusText}`);
  }
  return await res.json();
}

export async function deleteGoogleTask(accessToken: string, taskId: string): Promise<void> {
  const url = `https://tasks.googleapis.com/tasks/v1/lists/@default/tasks/${taskId}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to delete Task: ${res.statusText}`);
  }
}

// ============================================================================
// GOOGLE SHEETS API HELPERS
// ============================================================================
export interface SheetMetadata {
  spreadsheetId: string;
  properties?: { title?: string };
  sheets?: Array<{
    properties?: { sheetId?: number; title?: string };
  }>;
}

export async function getSpreadsheetDetails(accessToken: string, spreadsheetId: string): Promise<SheetMetadata> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Sheets API error: ${res.statusText}`);
  }
  return await res.json();
}

export async function getSpreadsheetValues(accessToken: string, spreadsheetId: string, range: string): Promise<any[][]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Sheets API values error: ${res.statusText}`);
  }
  const data = await res.json();
  return data.values || [];
}

export async function appendSpreadsheetValues(accessToken: string, spreadsheetId: string, range: string, values: any[][]): Promise<any> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to append values to Sheet: ${res.statusText}`);
  }
  return await res.json();
}
