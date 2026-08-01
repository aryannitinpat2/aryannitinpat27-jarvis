import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Calendar, 
  CheckSquare, 
  HardDrive, 
  Table, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Send, 
  ExternalLink, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  LogOut,
  X,
  FileText,
  Search
} from 'lucide-react';
import { 
  signInWithWorkspace, 
  getWorkspaceAccessToken, 
  workspaceSignOut,
  initWorkspaceAuth,
  listDriveFiles,
  deleteDriveFile,
  listGmailMessages,
  sendGmailEmail,
  trashGmailMessage,
  listCalendarEvents,
  createCalendarEvent,
  deleteCalendarEvent,
  listGoogleTasks,
  createGoogleTask,
  updateTaskStatus,
  deleteGoogleTask,
  getSpreadsheetDetails,
  getSpreadsheetValues,
  appendSpreadsheetValues,
  DriveFile,
  GmailMessage,
  CalendarEvent,
  GoogleTask
} from '../lib/googleWorkspace';
import { User } from 'firebase/auth';

type WorkspaceTab = 'drive' | 'gmail' | 'calendar' | 'tasks' | 'sheets';

export const GoogleWorkspacePanel: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('drive');

  // Confirmation dialog state for destructive/mutating operations
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionLabel: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    description: '',
    actionLabel: 'Confirm',
    onConfirm: async () => {},
  });

  // Data States
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [driveSearch, setDriveSearch] = useState<string>('');
  
  const [gmailMessages, setGmailMessages] = useState<GmailMessage[]>([]);
  const [showEmailComposer, setShowEmailComposer] = useState<boolean>(false);
  const [emailTo, setEmailTo] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [showEventModal, setShowEventModal] = useState<boolean>(false);
  const [eventSummary, setEventSummary] = useState<string>('');
  const [eventStart, setEventStart] = useState<string>('');
  const [eventEnd, setEventEnd] = useState<string>('');

  const [tasks, setTasks] = useState<GoogleTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [showTaskInput, setShowTaskInput] = useState<boolean>(false);

  const [sheetId, setSheetId] = useState<string>('');
  const [sheetTitle, setSheetTitle] = useState<string>('');
  const [sheetRange, setSheetRange] = useState<string>('Sheet1!A1:E10');
  const [sheetRows, setSheetRows] = useState<any[][]>([]);
  const [newRowValues, setNewRowValues] = useState<string>('');

  useEffect(() => {
    const unsubscribe = initWorkspaceAuth(
      (u, t) => {
        setUser(u);
        setToken(t);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await signInWithWorkspace();
      setUser(res.user);
      setToken(res.accessToken);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google Workspace');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await workspaceSignOut();
      setUser(null);
      setToken(null);
      setDriveFiles([]);
      setGmailMessages([]);
      setCalendarEvents([]);
      setTasks([]);
      setSheetRows([]);
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
    }
  };

  // Fetch Data based on active tab
  useEffect(() => {
    if (!token) return;
    fetchTabData();
  }, [token, activeTab]);

  const fetchTabData = async () => {
    const currentToken = token || getWorkspaceAccessToken();
    if (!currentToken) return;

    setIsLoading(true);
    setError(null);
    try {
      if (activeTab === 'drive') {
        const files = await listDriveFiles(currentToken);
        setDriveFiles(files);
      } else if (activeTab === 'gmail') {
        const msgs = await listGmailMessages(currentToken);
        setGmailMessages(msgs);
      } else if (activeTab === 'calendar') {
        const events = await listCalendarEvents(currentToken);
        setCalendarEvents(events);
      } else if (activeTab === 'tasks') {
        const taskList = await listGoogleTasks(currentToken);
        setTasks(taskList);
      }
    } catch (err: any) {
      setError(err.message || `Failed to fetch data for ${activeTab}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Prompt explicit user confirmation for destructive actions
  const triggerConfirmation = (
    title: string,
    description: string,
    actionLabel: string,
    onConfirm: () => Promise<void>
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      description,
      actionLabel,
      onConfirm,
    });
  };

  // DRIVE ACTIONS
  const handleDeleteDriveFile = (file: DriveFile) => {
    triggerConfirmation(
      'Delete Drive File',
      `Are you sure you want to permanently delete "${file.name}" from your Google Drive?`,
      'Delete File',
      async () => {
        const t = token || getWorkspaceAccessToken();
        if (!t) return;
        await deleteDriveFile(t, file.id);
        setDriveFiles((prev) => prev.filter((f) => f.id !== file.id));
      }
    );
  };

  // GMAIL ACTIONS
  const handleSendEmail = async () => {
    if (!emailTo.trim() || !emailSubject.trim()) {
      setError('Please provide a recipient email and subject.');
      return;
    }

    triggerConfirmation(
      'Send Email via Gmail',
      `Are you sure you want to send this email to "${emailTo}" with subject "${emailSubject}"?`,
      'Send Email',
      async () => {
        const t = token || getWorkspaceAccessToken();
        if (!t) return;
        await sendGmailEmail(t, emailTo, emailSubject, emailBody);
        setShowEmailComposer(false);
        setEmailTo('');
        setEmailSubject('');
        setEmailBody('');
        fetchTabData();
      }
    );
  };

  const handleTrashGmail = (msg: GmailMessage) => {
    triggerConfirmation(
      'Move Email to Trash',
      `Are you sure you want to move the message "${msg.subject || 'No Subject'}" to trash?`,
      'Move to Trash',
      async () => {
        const t = token || getWorkspaceAccessToken();
        if (!t) return;
        await trashGmailMessage(t, msg.id);
        setGmailMessages((prev) => prev.filter((m) => m.id !== msg.id));
      }
    );
  };

  // CALENDAR ACTIONS
  const handleCreateEvent = async () => {
    if (!eventSummary.trim() || !eventStart || !eventEnd) {
      setError('Please fill out event summary, start time, and end time.');
      return;
    }

    triggerConfirmation(
      'Add Google Calendar Event',
      `Create event "${eventSummary}" scheduled from ${new Date(eventStart).toLocaleString()} to ${new Date(eventEnd).toLocaleString()}?`,
      'Create Event',
      async () => {
        const t = token || getWorkspaceAccessToken();
        if (!t) return;
        await createCalendarEvent(t, eventSummary, new Date(eventStart).toISOString(), new Date(eventEnd).toISOString());
        setShowEventModal(false);
        setEventSummary('');
        setEventStart('');
        setEventEnd('');
        fetchTabData();
      }
    );
  };

  const handleDeleteEvent = (event: CalendarEvent) => {
    triggerConfirmation(
      'Delete Calendar Event',
      `Are you sure you want to delete event "${event.summary || 'Untitled Event'}" from your Google Calendar?`,
      'Delete Event',
      async () => {
        const t = token || getWorkspaceAccessToken();
        if (!t) return;
        await deleteCalendarEvent(t, event.id);
        setCalendarEvents((prev) => prev.filter((e) => e.id !== event.id));
      }
    );
  };

  // TASKS ACTIONS
  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;
    const t = token || getWorkspaceAccessToken();
    if (!t) return;

    try {
      setIsLoading(true);
      await createGoogleTask(t, newTaskTitle.trim());
      setNewTaskTitle('');
      setShowTaskInput(false);
      fetchTabData();
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTask = async (task: GoogleTask) => {
    const t = token || getWorkspaceAccessToken();
    if (!t) return;
    const isCompleted = task.status === 'completed';

    try {
      await updateTaskStatus(t, task.id, !isCompleted);
      setTasks((prev) =>
        prev.map((item) =>
          item.id === task.id ? { ...item, status: isCompleted ? 'needsAction' : 'completed' } : item
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update task status');
    }
  };

  const handleDeleteTask = (task: GoogleTask) => {
    triggerConfirmation(
      'Delete Google Task',
      `Are you sure you want to delete task "${task.title}"?`,
      'Delete Task',
      async () => {
        const t = token || getWorkspaceAccessToken();
        if (!t) return;
        await deleteGoogleTask(t, task.id);
        setTasks((prev) => prev.filter((item) => item.id !== task.id));
      }
    );
  };

  // SHEETS ACTIONS
  const handleLoadSheet = async () => {
    if (!sheetId.trim()) {
      setError('Please enter a Google Spreadsheet ID or URL.');
      return;
    }
    const cleanId = sheetId.includes('/d/') 
      ? sheetId.split('/d/')[1].split('/')[0] 
      : sheetId.trim();

    const t = token || getWorkspaceAccessToken();
    if (!t) return;

    setIsLoading(true);
    setError(null);
    try {
      const meta = await getSpreadsheetDetails(t, cleanId);
      setSheetTitle(meta.properties?.title || 'Google Sheet');
      const values = await getSpreadsheetValues(t, cleanId, sheetRange);
      setSheetRows(values);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch spreadsheet data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppendSheetRow = async () => {
    if (!newRowValues.trim() || !sheetId.trim()) return;
    const cleanId = sheetId.includes('/d/') 
      ? sheetId.split('/d/')[1].split('/')[0] 
      : sheetId.trim();

    const rowArray = newRowValues.split(',').map((cell) => cell.trim());

    triggerConfirmation(
      'Append Row to Google Sheet',
      `Append row with values [${rowArray.join(', ')}] to "${sheetTitle || 'Spreadsheet'}"?`,
      'Append Row',
      async () => {
        const t = token || getWorkspaceAccessToken();
        if (!t) return;
        await appendSpreadsheetValues(t, cleanId, sheetRange.split('!')[0] || 'Sheet1', [rowArray]);
        setNewRowValues('');
        handleLoadSheet();
      }
    );
  };

  // Filtered Drive Files
  const filteredDriveFiles = driveFiles.filter((f) =>
    f.name.toLowerCase().includes(driveSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden font-sans">
      {/* Panel Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-indigo-950/80 rounded-xl border border-indigo-500/30 text-indigo-400">
            <HardDrive className="w-4 h-4" />
          </div>
          <div className="text-left">
            <h2 className="text-xs font-bold text-slate-100 font-display">Google Workspace Core</h2>
            <span className="text-[9.5px] text-slate-400 font-mono block">
              {user ? `Connected: ${user.email}` : 'Authorization Required'}
            </span>
          </div>
        </div>

        {user ? (
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-1 px-2.5 py-1 bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 rounded-xl text-[10px] font-semibold border border-slate-700 hover:border-rose-500/40 transition-all active:scale-95"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        ) : (
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10.5px] font-bold shadow-md shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Connecting...' : 'Connect Google Workspace'}</span>
          </button>
        )}
      </div>

      {/* Auth Banner if not signed in */}
      {!user && (
        <div className="p-4 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border-b border-indigo-500/20 text-left space-y-3">
          <div className="flex items-center space-x-2 text-indigo-300 font-bold text-xs">
            <Lock className="w-4 h-4" />
            <span>Sign in to enable Drive, Gmail, Calendar, Tasks & Sheets</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Click below to authorize Jarvis to manage Google Drive files, Gmail inbox, Calendar schedule, Google Tasks, and Google Sheets directly.
          </p>
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            </svg>
            <span>Sign in with Google Workspace</span>
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-1 p-1.5 bg-slate-900/90 border-b border-slate-800 overflow-x-auto shrink-0">
        <button
          onClick={() => setActiveTab('drive')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[10.5px] font-bold transition-all shrink-0 ${
            activeTab === 'drive'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <HardDrive className="w-3.5 h-3.5" />
          <span>Drive</span>
        </button>

        <button
          onClick={() => setActiveTab('gmail')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[10.5px] font-bold transition-all shrink-0 ${
            activeTab === 'gmail'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Gmail</span>
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[10.5px] font-bold transition-all shrink-0 ${
            activeTab === 'calendar'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Calendar</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[10.5px] font-bold transition-all shrink-0 ${
            activeTab === 'tasks'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Tasks</span>
        </button>

        <button
          onClick={() => setActiveTab('sheets')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[10.5px] font-bold transition-all shrink-0 ${
            activeTab === 'sheets'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>Sheets</span>
        </button>
      </div>

      {/* Error Bar */}
      {error && (
        <div className="p-2.5 bg-rose-950/80 border-b border-rose-500/30 text-rose-300 text-[10.5px] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left">
        {/* DRIVE TAB */}
        {activeTab === 'drive' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search Google Drive files..."
                  value={driveSearch}
                  onChange={(e) => setDriveSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                onClick={fetchTabData}
                disabled={isLoading || !user}
                className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-300 transition-all active:scale-95 disabled:opacity-50"
                title="Refresh Files"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
              </button>
            </div>

            {filteredDriveFiles.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {filteredDriveFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 rounded-2xl flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
                        <FileText className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="overflow-hidden text-left">
                        <h4 className="text-xs font-semibold text-slate-200 truncate">{file.name}</h4>
                        <span className="text-[9.5px] text-slate-400 font-mono block">
                          {file.mimeType.split('.').pop()} • {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : 'Drive File'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      {file.webViewLink && (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-800 transition-all"
                          title="Open in Drive"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDeleteDriveFile(file)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-all"
                        title="Delete File"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 space-y-1">
                <HardDrive className="w-8 h-8 mx-auto text-slate-700" />
                <p className="text-xs">{user ? 'No Drive files found or search returned 0 results.' : 'Connect Google Workspace to view files.'}</p>
              </div>
            )}
          </div>
        )}

        {/* GMAIL TAB */}
        {activeTab === 'gmail' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Recent Emails ({gmailMessages.length})
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowEmailComposer(true)}
                  disabled={!user}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </button>
                <button
                  onClick={fetchTabData}
                  disabled={isLoading || !user}
                  className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-300 transition-all active:scale-95 disabled:opacity-50"
                  title="Refresh Gmail"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* Email Composer Modal */}
            {showEmailComposer && (
              <div className="p-3 bg-slate-900 rounded-2xl border border-indigo-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 flex items-center space-x-1">
                    <Send className="w-3.5 h-3.5" />
                    <span>Compose Email</span>
                  </span>
                  <button onClick={() => setShowEmailComposer(false)} className="text-slate-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="email"
                  placeholder="Recipient Email (to@example.com)"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <textarea
                  placeholder="Email message body..."
                  rows={3}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleSendEmail}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-600/20 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </button>
              </div>
            )}

            {gmailMessages.length > 0 ? (
              <div className="space-y-2">
                {gmailMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3 bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 rounded-2xl flex items-start justify-between transition-all"
                  >
                    <div className="space-y-1 overflow-hidden pr-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-bold text-indigo-300 truncate">{msg.from}</span>
                        <span className="text-[9px] text-slate-500 font-mono shrink-0">{msg.date ? new Date(msg.date).toLocaleDateString() : ''}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-200 leading-snug">{msg.subject}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-normal">{msg.snippet}</p>
                    </div>

                    <button
                      onClick={() => handleTrashGmail(msg)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-all shrink-0"
                      title="Move to Trash"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 space-y-1">
                <Mail className="w-8 h-8 mx-auto text-slate-700" />
                <p className="text-xs">{user ? 'No messages loaded in inbox.' : 'Connect Google Workspace to view Gmail messages.'}</p>
              </div>
            )}
          </div>
        )}

        {/* CALENDAR TAB */}
        {activeTab === 'calendar' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Upcoming Events ({calendarEvents.length})
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowEventModal(true)}
                  disabled={!user}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Event</span>
                </button>
                <button
                  onClick={fetchTabData}
                  disabled={isLoading || !user}
                  className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-300 transition-all active:scale-95 disabled:opacity-50"
                  title="Refresh Calendar"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* Event Modal */}
            {showEventModal && (
              <div className="p-3 bg-slate-900 rounded-2xl border border-indigo-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Create Calendar Event</span>
                  </span>
                  <button onClick={() => setShowEventModal(false)} className="text-slate-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Event Summary / Title"
                  value={eventSummary}
                  onChange={(e) => setEventSummary(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <label className="block text-slate-400 mb-1">Start Date & Time</label>
                    <input
                      type="datetime-local"
                      value={eventStart}
                      onChange={(e) => setEventStart(e.target.value)}
                      className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">End Date & Time</label>
                    <input
                      type="datetime-local"
                      value={eventEnd}
                      onChange={(e) => setEventEnd(e.target.value)}
                      className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <button
                  onClick={handleCreateEvent}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-600/20 active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save Event</span>
                </button>
              </div>
            )}

            {calendarEvents.length > 0 ? (
              <div className="space-y-2">
                {calendarEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 rounded-2xl flex items-center justify-between transition-all"
                  >
                    <div className="space-y-0.5 overflow-hidden text-left">
                      <h4 className="text-xs font-semibold text-slate-200">{evt.summary || 'Untitled Event'}</h4>
                      <span className="text-[9.5px] text-indigo-400 font-mono block">
                        {evt.start?.dateTime ? new Date(evt.start.dateTime).toLocaleString() : evt.start?.date || 'All Day'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      {evt.htmlLink && (
                        <a
                          href={evt.htmlLink}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-800 transition-all"
                          title="Open in Google Calendar"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDeleteEvent(evt)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-all"
                        title="Delete Event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 space-y-1">
                <Calendar className="w-8 h-8 mx-auto text-slate-700" />
                <p className="text-xs">{user ? 'No upcoming events found.' : 'Connect Google Workspace to view Google Calendar.'}</p>
              </div>
            )}
          </div>
        )}

        {/* TASKS TAB */}
        {activeTab === 'tasks' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Task List ({tasks.length})
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowTaskInput(true)}
                  disabled={!user}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Task</span>
                </button>
                <button
                  onClick={fetchTabData}
                  disabled={isLoading || !user}
                  className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-300 transition-all active:scale-95 disabled:opacity-50"
                  title="Refresh Tasks"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* Quick Task Input */}
            {showTaskInput && (
              <div className="flex items-center space-x-2 p-2 bg-slate-900 rounded-2xl border border-indigo-500/30">
                <input
                  type="text"
                  placeholder="Task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateTask()}
                  className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleCreateTask}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl active:scale-95"
                >
                  Save
                </button>
              </div>
            )}

            {tasks.length > 0 ? (
              <div className="space-y-2">
                {tasks.map((task) => {
                  const isDone = task.status === 'completed';
                  return (
                    <div
                      key={task.id}
                      className="p-3 bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 rounded-2xl flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center space-x-3 overflow-hidden text-left">
                        <button
                          onClick={() => handleToggleTask(task)}
                          className={`p-1 rounded-lg border transition-all ${
                            isDone
                              ? 'bg-emerald-950 border-emerald-500/40 text-emerald-400'
                              : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <span className={`text-xs font-medium ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {task.title}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteTask(task)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-all shrink-0"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 space-y-1">
                <CheckSquare className="w-8 h-8 mx-auto text-slate-700" />
                <p className="text-xs">{user ? 'No Google Tasks found.' : 'Connect Google Workspace to view Google Tasks.'}</p>
              </div>
            )}
          </div>
        )}

        {/* SHEETS TAB */}
        {activeTab === 'sheets' && (
          <div className="space-y-3">
            <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2.5">
              <span className="text-xs font-bold text-slate-300 uppercase font-mono block">
                Google Sheets Connector
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Paste Google Sheet ID or URL..."
                  value={sheetId}
                  onChange={(e) => setSheetId(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleLoadSheet}
                  disabled={isLoading || !user}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
                >
                  Load Sheet
                </button>
              </div>
            </div>

            {sheetRows.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 font-display">
                    {sheetTitle} ({sheetRows.length} rows loaded)
                  </span>
                </div>

                <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl">
                  <table className="w-full text-left text-[11px]">
                    <tbody className="divide-y divide-slate-800">
                      {sheetRows.map((row, rIdx) => (
                        <tr key={rIdx} className={rIdx === 0 ? 'bg-slate-950 font-bold text-indigo-300' : 'hover:bg-slate-800/50'}>
                          {row.map((cell: any, cIdx: number) => (
                            <td key={cIdx} className="px-3 py-2 whitespace-nowrap border-r border-slate-800/50 last:border-r-0">
                              {String(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Append Row Bar */}
                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-[10.5px] font-bold text-slate-400 uppercase font-mono block">
                    Append New Row (comma separated values)
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Value1, Value2, Value3"
                      value={newRowValues}
                      onChange={(e) => setNewRowValues(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={handleAppendSheetRow}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl active:scale-95"
                    >
                      Append
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MANDATORY USER CONFIRMATION MODAL FOR DESTRUCTIVE / MUTATING OPERATIONS */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl space-y-3 text-slate-100 text-left">
            <div className="flex items-center space-x-2 text-amber-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <h3 className="text-xs font-bold font-display">{confirmModal.title}</h3>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {confirmModal.description}
            </p>
            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={async () => {
                  try {
                    await confirmModal.onConfirm();
                  } catch (e: any) {
                    setError(e.message || 'Operation failed');
                  } finally {
                    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                  }
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                {confirmModal.actionLabel}
              </button>
              <button
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
