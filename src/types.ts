export type Priority = 'high' | 'medium' | 'low';

export type CategoryName = 
  | 'Study' 
  | 'College' 
  | 'Work' 
  | 'Exercise' 
  | 'Meeting' 
  | 'Shopping' 
  | 'Health' 
  | 'Finance' 
  | 'Travel' 
  | 'Personal';

export type ReminderType = 'notification' | 'voice' | 'fullscreen' | 'alarm' | 'persistent';

export type RepeatOption = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface AttachmentItem {
  id: string;
  name: string;
  url?: string;
  type: 'photo' | 'voice' | 'file';
  size?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationMinutes: number;
  priority: Priority;
  category: CategoryName;
  color: string;
  icon: string;
  notes: string;
  checklist: ChecklistItem[];
  attachments: AttachmentItem[];
  location: string;
  reminderMinutesBefore: number;
  reminderType: ReminderType;
  repeat: RepeatOption;
  completed: boolean;
  pinned: boolean;
  archived: boolean;
  deadline?: string;
  aiSuggested?: boolean;
}

export interface CategoryConfig {
  id: string;
  name: CategoryName;
  color: string; // Hex color
  bgClass: string;
  textClass: string;
  icon: string;
}

export interface BlockedApp {
  id: string;
  name: string;
  package: string;
  iconName: string;
  blocked: boolean;
  attemptCount: number;
  urlPattern?: string;
}

export interface FocusSession {
  id: string;
  durationMinutes: number;
  elapsedSeconds: number;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'cancelled';
  blockedApps: string[];
  attemptsCount: number;
  startTime?: string;
  mode: 'pomodoro' | 'stopwatch' | 'countdown';
  ambientSound: 'none' | 'rain' | 'forest' | 'cafe' | 'lofi' | 'white_noise';
}

export interface HabitItem {
  id: string;
  title: string;
  category: CategoryName;
  streak: number;
  targetDaysPerWeek: number;
  completedDates: string[]; // YYYY-MM-DD strings
  color: string;
  icon: string;
}

export interface ProductivityStats {
  productivityScore: number; // 0-100
  focusHoursToday: number;
  studyHoursToday: number;
  currentStreak: number;
  longestStreak: number;
  totalTasksCompleted: number;
  totalTasksCount: number;
  distractionAttemptsToday: number;
}

export type ThemeMode = 'light' | 'dark' | 'amoled' | 'material-you';

export type CalendarViewMode = 'day' | 'week' | 'month' | 'timeline' | 'agenda' | 'year' | 'heatmap';

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number; // 0-100
}
