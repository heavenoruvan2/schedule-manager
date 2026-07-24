import { CategoryConfig, CategoryName, BlockedApp, AchievementBadge } from '../types';

export const CATEGORIES: Record<CategoryName, CategoryConfig> = {
  Study: {
    id: 'study',
    name: 'Study',
    color: '#3B82F6', // Blue
    bgClass: 'bg-blue-500/10 dark:bg-blue-500/20',
    textClass: 'text-blue-600 dark:text-blue-400',
    icon: 'BookOpen',
  },
  College: {
    id: 'college',
    name: 'College',
    color: '#10B981', // Green
    bgClass: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    icon: 'GraduationCap',
  },
  Work: {
    id: 'work',
    name: 'Work',
    color: '#8B5CF6', // Purple
    bgClass: 'bg-purple-500/10 dark:bg-purple-500/20',
    textClass: 'text-purple-600 dark:text-purple-400',
    icon: 'Briefcase',
  },
  Exercise: {
    id: 'exercise',
    name: 'Exercise',
    color: '#F97316', // Orange
    bgClass: 'bg-orange-500/10 dark:bg-orange-500/20',
    textClass: 'text-orange-600 dark:text-orange-400',
    icon: 'Dumbbell',
  },
  Meeting: {
    id: 'meeting',
    name: 'Meeting',
    color: '#06B6D4', // Cyan
    bgClass: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    textClass: 'text-cyan-600 dark:text-cyan-400',
    icon: 'Users',
  },
  Shopping: {
    id: 'shopping',
    name: 'Shopping',
    color: '#EAB308', // Yellow
    bgClass: 'bg-yellow-500/10 dark:bg-yellow-500/20',
    textClass: 'text-yellow-600 dark:text-yellow-400',
    icon: 'ShoppingCart',
  },
  Health: {
    id: 'health',
    name: 'Health',
    color: '#EF4444', // Red
    bgClass: 'bg-red-500/10 dark:bg-red-500/20',
    textClass: 'text-red-600 dark:text-red-400',
    icon: 'Heart',
  },
  Finance: {
    id: 'finance',
    name: 'Finance',
    color: '#059669', // Emerald
    bgClass: 'bg-teal-500/10 dark:bg-teal-500/20',
    textClass: 'text-teal-600 dark:text-teal-400',
    icon: 'DollarSign',
  },
  Travel: {
    id: 'travel',
    name: 'Travel',
    color: '#EC4899', // Pink
    bgClass: 'bg-pink-500/10 dark:bg-pink-500/20',
    textClass: 'text-pink-600 dark:text-pink-400',
    icon: 'Plane',
  },
  Personal: {
    id: 'personal',
    name: 'Personal',
    color: '#6B7280', // Gray
    bgClass: 'bg-slate-500/10 dark:bg-slate-500/20',
    textClass: 'text-slate-600 dark:text-slate-400',
    icon: 'User',
  },
};

export const ICON_LIBRARY: { group: string; icons: { name: string; label: string }[] }[] = [
  {
    group: 'Education & Knowledge',
    icons: [
      { name: 'BookOpen', label: 'Study 📚' },
      { name: 'GraduationCap', label: 'College 🏫' },
      { name: 'Code', label: 'Coding 💻' },
      { name: 'PenTool', label: 'Writing ✏️' },
      { name: 'Brain', label: 'Thinking 🧠' },
      { name: 'Calculator', label: 'Math 📐' },
      { name: 'FileText', label: 'Reading 📖' },
      { name: 'Presentation', label: 'Lecture 👨‍🏫' },
    ],
  },
  {
    group: 'Work & Business',
    icons: [
      { name: 'Briefcase', label: 'Work 💼' },
      { name: 'Users', label: 'Meeting 👥' },
      { name: 'PhoneCall', label: 'Call 📞' },
      { name: 'Mail', label: 'Email ✉️' },
      { name: 'Calendar', label: 'Deadline 📅' },
      { name: 'BarChart2', label: 'Analytics 📊' },
      { name: 'CheckSquare', label: 'Tasks 📑' },
      { name: 'Clock', label: 'Shift ⏰' },
    ],
  },
  {
    group: 'Health & Fitness',
    icons: [
      { name: 'Dumbbell', label: 'Gym 🏋️' },
      { name: 'Heart', label: 'Health ❤️' },
      { name: 'Smile', label: 'Meditation 🧘' },
      { name: 'Pill', label: 'Medicine 💊' },
      { name: 'Droplets', label: 'Water 🚰' },
      { name: 'Moon', label: 'Sleep 🌙' },
      { name: 'Apple', label: 'Diet 🍎' },
      { name: 'Footprints', label: 'Walk 👟' },
    ],
  },
  {
    group: 'Lifestyle & Leisure',
    icons: [
      { name: 'Gamepad2', label: 'Gaming 🎮' },
      { name: 'Utensils', label: 'Food 🍔' },
      { name: 'Coffee', label: 'Coffee ☕' },
      { name: 'Music', label: 'Music 🎵' },
      { name: 'Film', label: 'Movie 🎬' },
      { name: 'ShoppingCart', label: 'Shopping 🛒' },
      { name: 'Dog', label: 'Pets 🐶' },
      { name: 'Plane', label: 'Travel ✈️' },
      { name: 'DollarSign', label: 'Finance 💰' },
      { name: 'Sparkles', label: 'Rest ✨' },
    ],
  },
];

export const DEFAULT_BLOCKED_APPS: BlockedApp[] = [
  { id: '1', name: 'Instagram', package: 'com.instagram.android', iconName: 'Instagram', blocked: true, attemptCount: 4, urlPattern: 'instagram.com' },
  { id: '2', name: 'YouTube Shorts', package: 'com.google.android.youtube.shorts', iconName: 'Video', blocked: true, attemptCount: 6, urlPattern: 'youtube.com/shorts' },
  { id: '3', name: 'TikTok', package: 'com.zhiliaoapp.musically', iconName: 'Video', blocked: true, attemptCount: 7, urlPattern: 'tiktok.com' },
  { id: '4', name: 'YouTube', package: 'com.google.android.youtube', iconName: 'Youtube', blocked: true, attemptCount: 3, urlPattern: 'youtube.com' },
  { id: '5', name: 'Facebook', package: 'com.facebook.katana', iconName: 'Facebook', blocked: true, attemptCount: 1, urlPattern: 'facebook.com' },
  { id: '6', name: 'X (Twitter)', package: 'com.twitter.android', iconName: 'Twitter', blocked: true, attemptCount: 5, urlPattern: 'x.com' },
  { id: '7', name: 'Snapchat', package: 'com.snapchat.android', iconName: 'Camera', blocked: true, attemptCount: 2, urlPattern: 'snapchat.com' },
  { id: '8', name: 'Discord', package: 'com.discord', iconName: 'MessageSquare', blocked: false, attemptCount: 0, urlPattern: 'discord.com' },
];

export const MOTIVATIONAL_QUOTES = [
  "\"Your future self will thank you for pushing through this session.\"",
  "\"Discipline is choosing between what you want now and what you want most.\"",
  "\"The difference between ordinary and extraordinary is that little extra.\"",
  "\"Focus is a muscle. Every time you resist distraction, you build mental strength.\"",
  "\"Don't trade long-term success for short-term entertainment.\"",
  "\"Small daily habits compound into massive achievements over time.\""
];

export const DEFAULT_BADGES: AchievementBadge[] = [
  { id: 'b1', title: 'Deep Work Master', description: 'Complete 10 hours of focused study sessions.', icon: 'Brain', unlocked: true, progress: 100 },
  { id: 'b2', title: '7-Day Streak', description: 'Log tasks for 7 consecutive days.', icon: 'Flame', unlocked: true, progress: 100 },
  { id: 'b3', title: 'Early Bird', description: 'Complete 3 tasks before 9:00 AM.', icon: 'Sun', unlocked: true, progress: 100 },
  { id: 'b4', title: 'Distraction Shield', description: 'Block 20 app opening attempts during focus sessions.', icon: 'ShieldCheck', unlocked: true, progress: 100 },
  { id: 'b5', title: 'Planner Pro', description: 'Schedule 50 tasks using AI Smart Scheduler.', icon: 'Zap', unlocked: false, progress: 64 },
  { id: 'b6', title: 'Habit Architect', description: 'Maintain 3 habits with 80%+ consistency.', icon: 'Award', unlocked: false, progress: 75 },
];
