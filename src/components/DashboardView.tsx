import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  Flame, 
  Clock, 
  BookOpen, 
  Zap, 
  Plus, 
  Calendar, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Pin,
  Sun,
  CloudSun,
  Quote,
  Target,
  Sparkle,
  Smartphone,
  Download,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Trash2,
  Check,
  PenTool,
  Smile,
  Heart
} from 'lucide-react';
import { EventItem, HabitItem, ProductivityStats } from '../types';
import { DynamicIcon } from './DynamicIcon';

export interface DailyFocusGoal {
  id: string;
  title: string;
  completed: boolean;
  pinned: boolean;
  order: number;
}

interface DashboardViewProps {
  events: EventItem[];
  habits: HabitItem[];
  stats: ProductivityStats;
  onToggleEventComplete: (id: string) => void;
  onToggleHabitComplete: (habitId: string) => void;
  onOpenEventModal: (event?: EventItem) => void;
  onOpenQuickAdd: () => void;
  onNavigateToFocus: () => void;
  onNavigateToAIScheduler: () => void;
  onOpenAndroidDownload?: () => void;
  todayDateStr: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  events,
  habits,
  stats,
  onToggleEventComplete,
  onToggleHabitComplete,
  onOpenEventModal,
  onOpenQuickAdd,
  onNavigateToFocus,
  onNavigateToAIScheduler,
  onOpenAndroidDownload,
  todayDateStr,
}) => {
  // Daily Focus Goals State & LocalStorage Persistence
  const [focusGoals, setFocusGoals] = useState<DailyFocusGoal[]>(() => {
    try {
      const saved = localStorage.getItem('focusflow_daily_focus_goals');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [
      { id: '1', title: 'Complete high-priority project milestone', completed: false, pinned: true, order: 0 },
      { id: '2', title: '45-min uninterrupted Deep Focus session', completed: false, pinned: false, order: 1 },
      { id: '3', title: 'Clear & organize priority task inbox', completed: false, pinned: false, order: 2 },
    ];
  });

  const [newGoalInput, setNewGoalInput] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('focusflow_daily_focus_goals', JSON.stringify(focusGoals));
    } catch (e) {
      console.error(e);
    }
  }, [focusGoals]);

  const handleAddGoal = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newGoalInput.trim()) return;
    const maxOrder = focusGoals.length > 0 ? Math.max(...focusGoals.map((g) => g.order)) + 1 : 0;
    const newGoal: DailyFocusGoal = {
      id: Date.now().toString(),
      title: newGoalInput.trim(),
      completed: false,
      pinned: false,
      order: maxOrder,
    };
    setFocusGoals((prev) => [...prev, newGoal]);
    setNewGoalInput('');
  };

  const handleToggleGoal = (id: string) => {
    setFocusGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  const handleTogglePinGoal = (id: string) => {
    setFocusGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, pinned: !g.pinned } : g))
    );
  };

  const handleDeleteGoal = (id: string) => {
    setFocusGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const handleMoveGoal = (id: string, direction: 'up' | 'down') => {
    const sorted = [...focusGoals].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return a.order - b.order;
    });

    const index = sorted.findIndex((g) => g.id === id);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const currentItem = sorted[index];
    const targetItem = sorted[targetIndex];

    setFocusGoals((prev) =>
      prev.map((g) => {
        if (g.id === currentItem.id) return { ...g, order: targetItem.order };
        if (g.id === targetItem.id) return { ...g, order: currentItem.order };
        return g;
      })
    );
  };

  const sortedGoals = [...focusGoals].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return a.order - b.order;
  });

  const completedGoalsCount = focusGoals.filter((g) => g.completed).length;

  // Daily Reflection State & LocalStorage Persistence
  const [dailyReflection, setDailyReflection] = useState<string>(() => {
    try {
      return localStorage.getItem(`focusflow_reflection_${todayDateStr}`) || '';
    } catch (e) {
      return '';
    }
  });
  const [reflectionMood, setReflectionMood] = useState<string>(() => {
    try {
      return localStorage.getItem(`focusflow_reflection_mood_${todayDateStr}`) || '';
    } catch (e) {
      return '';
    }
  });
  const [reflectionSaved, setReflectionSaved] = useState(false);

  useEffect(() => {
    try {
      const savedText = localStorage.getItem(`focusflow_reflection_${todayDateStr}`) || '';
      const savedMood = localStorage.getItem(`focusflow_reflection_mood_${todayDateStr}`) || '';
      setDailyReflection(savedText);
      setReflectionMood(savedMood);
    } catch (e) {
      console.error(e);
    }
  }, [todayDateStr]);

  const handleSaveReflection = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      localStorage.setItem(`focusflow_reflection_${todayDateStr}`, dailyReflection);
      localStorage.setItem(`focusflow_reflection_mood_${todayDateStr}`, reflectionMood);
      setReflectionSaved(true);
      setTimeout(() => setReflectionSaved(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const todayEvents = events.filter((e) => e.date === todayDateStr);
  const completedToday = todayEvents.filter((e) => e.completed).length;
  const totalToday = todayEvents.length;
  const progressPercent = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  const isAllEventsCompleted = totalToday > 0 && completedToday === totalToday;
  const isAllGoalsCompleted = focusGoals.length > 0 && completedGoalsCount === focusGoals.length;
  const showDailyReflection = isAllEventsCompleted || isAllGoalsCompleted;

  const pinnedEvents = todayEvents.filter((e) => e.pinned);
  const regularEvents = todayEvents.filter((e) => !e.pinned);

  // Next upcoming uncompleted event
  const nextEvent = todayEvents.find((e) => !e.completed);

  // Time-of-day greeting
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  // Motivational quote
  const quote = "Simplicity is about subtracting the obvious and adding the meaningful.";

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      {/* Top Banner with Weather, Greeting & Calm Zen Art */}
      <div className="bento-card relative overflow-hidden bg-gradient-to-br from-[#EBF4EE] via-[#FAFAF8] to-[#F0F5FA] dark:from-[#1E1F22] dark:via-[#23252A] dark:to-[#2B2C31] text-[#2F3A45] dark:text-white p-4 sm:p-6 lg:p-8 border border-[#7FAF8E]/30 shadow-md max-w-full">
        {/* Soft Ambient Zen Glow Elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-[#7FAF8E]/20 dark:bg-[#7FAF8E]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-[#A7C7E7]/20 dark:bg-[#A7C7E7]/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Background Zen Illustration Accent */}
        <svg
          className="absolute right-4 bottom-2 w-48 h-48 opacity-15 dark:opacity-10 pointer-events-none text-[#7FAF8E]"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 20C60 20 20 60 20 100C20 140 60 180 100 180C140 180 180 140 180 100C180 60 140 20 100 20ZM100 160C66.8 160 40 133.2 40 100C40 66.8 66.8 40 100 40C133.2 40 160 66.8 160 100C160 133.2 133.2 160 100 160Z"
            fill="currentColor"
          />
          <circle cx="100" cy="100" r="35" fill="currentColor" opacity="0.5" />
          <path d="M100 40V160M40 100H160" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
        </svg>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 w-full max-w-full min-w-0">
          <div className="space-y-3 max-w-xl min-w-0 w-full">
            {/* Metadata Pills: Date, Weather, Streak */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 max-w-full">
              <span className="bento-pill bg-white/80 dark:bg-white/10 text-[#2F3A45] dark:text-slate-200 border border-slate-200/60 dark:border-white/10 backdrop-blur-md text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-[#7FAF8E] shrink-0" />
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              </span>
              
              <span className="bento-pill bg-[#A7C7E7]/20 text-[#2F3A45] dark:text-[#A7C7E7] border border-[#A7C7E7]/30 backdrop-blur-md font-medium text-[11px]">
                <CloudSun className="w-3.5 h-3.5 text-[#A7C7E7] shrink-0" />
                <span>70°F Calm & Clear</span>
              </span>

              <div className="bento-pill bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25 text-[11px]">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                <span>{stats.currentStreak} Day Zen Streak</span>
              </div>

              {onOpenAndroidDownload && (
                <button
                  onClick={onOpenAndroidDownload}
                  className="bento-pill bg-[#7FAF8E]/20 text-[#639272] dark:text-[#7FAF8E] hover:bg-[#7FAF8E]/30 border border-[#7FAF8E]/40 backdrop-blur-md font-bold transition-all cursor-pointer active:scale-95 text-[11px]"
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#7FAF8E] shrink-0" />
                  <span>Download for Android</span>
                </button>
              )}
            </div>

            {/* Greeting */}
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#2F3A45] dark:text-white truncate">
              {greeting}, Alex.
            </h1>

            {/* Quote Card */}
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-md flex items-start gap-2.5 text-xs text-[#2F3A45]/80 dark:text-slate-300 max-w-full">
              <Quote className="w-4 h-4 text-[#C8B6E2] shrink-0 mt-0.5" />
              <span className="italic font-medium leading-relaxed">"{quote}"</span>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex flex-col xs:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto shrink-0 max-w-full">
            <button
              onClick={onNavigateToFocus}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-[#7FAF8E] hover:bg-[#639272] text-white font-extrabold text-xs shadow-md shadow-[#7FAF8E]/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              <Zap className="w-4 h-4 fill-white shrink-0" />
              <span>Start Focus Mode</span>
            </button>
            <button
              onClick={onNavigateToAIScheduler}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-white/80 dark:bg-white/10 hover:bg-white text-[#2F3A45] dark:text-white font-bold text-xs border border-slate-200/80 dark:border-white/15 backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4 text-[#C8B6E2] shrink-0" />
              <span>AI Auto-Organize</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid: Circular Progress Ring & Core Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Focus & Circular Progress Ring */}
        <div className="bento-card bento-card-interactive p-5 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-wider">
              Today's Completion
            </span>
            <div className="text-xl font-black text-[#2F3A45] dark:text-white mt-1">
              {completedToday} of {totalToday} Done
            </div>
            <p className="text-[11px] text-[#9CA3AF] font-medium mt-1">
              {totalToday - completedToday === 0 ? 'All tasks complete!' : `${totalToday - completedToday} remaining`}
            </p>
          </div>

          {/* SVG Circular Progress Ring */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200 dark:text-slate-700"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#7FAF8E] transition-all duration-500 ease-out"
                strokeDasharray={`${progressPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-black text-[#2F3A45] dark:text-white">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Next Event Spotlight */}
        <div className="bento-card bento-card-interactive p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-wider">
              Next Up
            </span>
            <div className="w-8 h-8 rounded-2xl bg-[#A7C7E7]/20 text-[#2F3A45] dark:text-[#A7C7E7] flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            {nextEvent ? (
              <div>
                <div className="text-xs font-extrabold text-[#2F3A45] dark:text-white truncate">
                  {nextEvent.title}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF] font-medium mt-1">
                  <Clock className="w-3 h-3 text-[#7FAF8E]" />
                  <span>{nextEvent.startTime} - {nextEvent.endTime}</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#9CA3AF] font-medium italic">
                No more pending tasks today
              </div>
            )}
          </div>
        </div>

        {/* Focus Hours Metric */}
        <div className="bento-card bento-card-interactive p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-wider">
              Focus Hours
            </span>
            <div className="w-8 h-8 rounded-2xl bg-[#C8B6E2]/20 text-[#C8B6E2] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-[#2F3A45] dark:text-white">
              {stats.focusHoursToday} <span className="text-xs font-medium text-[#9CA3AF]">hrs</span>
            </div>
            <div className="text-[11px] text-[#9CA3AF] font-medium mt-0.5">Target: 4.0 hrs</div>
          </div>
        </div>

        {/* Mindful Productivity Score */}
        <div className="bento-card bento-card-interactive p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-wider">
              Zen Score
            </span>
            <div className="w-8 h-8 rounded-2xl bg-[#7FAF8E]/20 text-[#7FAF8E] flex items-center justify-center font-black text-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-[#2F3A45] dark:text-white">
              {stats.productivityScore}%
            </div>
            <div className="text-[11px] text-[#7FAF8E] font-bold mt-0.5">+5% vs yesterday</div>
          </div>
        </div>
      </div>

      {/* Daily Focus Goals Card with Reorder & Pin Buttons */}
      <div className="bento-card p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-[#2F3A45] dark:text-white">
                  Daily Focus Goals
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                  Top Priorities
                </span>
              </div>
              <p className="text-[11px] text-[#9CA3AF] font-medium">
                Pin top priorities or use up/down arrows to reorder
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bento-pill bg-slate-100 dark:bg-white/10 text-[#2F3A45] dark:text-slate-200 text-xs font-bold">
              {completedGoalsCount} / {focusGoals.length} Completed
            </span>
          </div>
        </div>

        {/* Input Form to add new focus goal */}
        <form onSubmit={handleAddGoal} className="flex items-center gap-2">
          <input
            type="text"
            value={newGoalInput}
            onChange={(e) => setNewGoalInput(e.target.value)}
            placeholder="Add a top priority goal for today..."
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-medium text-[#2F3A45] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#7FAF8E]"
          />
          <button
            type="submit"
            disabled={!newGoalInput.trim()}
            className="px-4 py-2.5 rounded-2xl bg-[#7FAF8E] hover:bg-[#639272] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>

        {/* Goals List with motion reorder animation */}
        <div className="space-y-2 pt-1">
          <AnimatePresence initial={false}>
            {sortedGoals.map((goal, idx) => (
              <motion.div
                key={goal.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className={`p-3.5 rounded-2xl border transition-colors flex items-center justify-between gap-3 group ${
                  goal.completed
                    ? 'bg-slate-50/60 dark:bg-white/5 border-slate-200/50 dark:border-white/5 opacity-70'
                    : goal.pinned
                    ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30'
                    : 'bg-white dark:bg-[#2B2C31] border-slate-200/80 dark:border-white/10 hover:border-[#7FAF8E]/30'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Reorder Buttons (Up / Down) */}
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveGoal(goal.id, 'up')}
                      className="p-1 rounded-md text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-20 cursor-pointer transition-colors"
                      title="Move Up in priority"
                    >
                      <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === sortedGoals.length - 1}
                      onClick={() => handleMoveGoal(goal.id, 'down')}
                      className="p-1 rounded-md text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-20 cursor-pointer transition-colors"
                      title="Move Down in priority"
                    >
                      <ArrowDown className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Completion Checkbox */}
                  <button
                    type="button"
                    onClick={() => handleToggleGoal(goal.id)}
                    className="text-[#9CA3AF] hover:text-[#7FAF8E] transition-colors shrink-0 cursor-pointer"
                  >
                    {goal.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-[#7FAF8E] fill-[#7FAF8E]/20 stroke-[2.5]" />
                    ) : (
                      <Circle className="w-5 h-5 stroke-[2]" />
                    )}
                  </button>

                  {/* Goal Text */}
                  <div className="min-w-0 flex-1">
                    <span
                      className={`text-xs font-extrabold block truncate ${
                        goal.completed
                          ? 'line-through text-[#9CA3AF]'
                          : 'text-[#2F3A45] dark:text-slate-100'
                      }`}
                    >
                      {goal.title}
                    </span>
                  </div>
                </div>

                {/* Right Action Controls: Pin & Delete */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Pin Button */}
                  <button
                    type="button"
                    onClick={() => handleTogglePinGoal(goal.id)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                      goal.pinned
                        ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                        : 'text-[#9CA3AF] hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-white/10'
                    }`}
                    title={goal.pinned ? 'Unpin goal' : 'Pin to top priorities'}
                  >
                    <Pin className={`w-3.5 h-3.5 ${goal.pinned ? 'fill-amber-500 text-amber-500' : ''}`} />
                    <span className="hidden sm:inline">{goal.pinned ? 'Pinned' : 'Pin'}</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-1.5 rounded-xl text-[#9CA3AF] hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Delete goal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {focusGoals.length === 0 && (
            <div className="p-6 text-center rounded-2xl bg-slate-50/50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10 text-xs text-[#9CA3AF] font-medium">
              No daily focus goals set yet. Add your top priority above!
            </div>
          )}
        </div>
      </div>

      {/* Daily Reflection Card - Appears after the last task of the day is completed */}
      <AnimatePresence>
        {showDailyReflection && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="bento-card p-6 bg-gradient-to-br from-[#EBF4EE] via-[#FAFAF8] to-[#F5F1FA] dark:from-[#23252A] dark:via-[#26282D] dark:to-[#1F2125] border-2 border-[#7FAF8E]/40 shadow-lg relative overflow-hidden space-y-4"
          >
            {/* Ambient Background Shimmer */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#7FAF8E]/20 dark:bg-[#7FAF8E]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#7FAF8E]/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#7FAF8E]/20 text-[#639272] dark:text-[#7FAF8E] flex items-center justify-center font-bold">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-extrabold text-[#2F3A45] dark:text-white">
                      Daily Reflection
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#7FAF8E] text-white shadow-xs">
                      🎉 All Tasks Complete!
                    </span>
                  </div>
                  <p className="text-[11px] text-[#9CA3AF] font-medium">
                    You finished your tasks for today! Take a quick moment to reflect on your progress.
                  </p>
                </div>
              </div>

              {/* Mood Tags */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { emoji: '🌟', label: 'Accomplished' },
                  { emoji: '🧘', label: 'Peaceful' },
                  { emoji: '⚡', label: 'Focused' },
                  { emoji: '🌱', label: 'Grateful' },
                ].map((mood) => (
                  <button
                    key={mood.label}
                    type="button"
                    onClick={() => {
                      setReflectionMood(mood.label);
                      if (!dailyReflection.includes(mood.emoji)) {
                        setDailyReflection((prev) => (prev ? `${prev} ${mood.emoji}` : mood.emoji));
                      }
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      reflectionMood === mood.label
                        ? 'bg-[#7FAF8E] text-white shadow-xs'
                        : 'bg-white/80 dark:bg-white/10 text-[#2F3A45] dark:text-slate-200 hover:bg-[#7FAF8E]/20'
                    }`}
                  >
                    <span>{mood.emoji}</span>
                    <span className="hidden sm:inline">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSaveReflection} className="space-y-3">
              <div className="relative">
                <textarea
                  value={dailyReflection}
                  onChange={(e) => setDailyReflection(e.target.value)}
                  placeholder="What went well today? What did you learn, or what are you grateful for?"
                  rows={2}
                  className="w-full px-4 py-3 rounded-2xl bg-white/90 dark:bg-[#1E2024] border border-slate-200 dark:border-white/10 text-xs font-medium text-[#2F3A45] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#7FAF8E] resize-none shadow-inner"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-[#9CA3AF] font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Saved automatically to your daily reflection journal</span>
                </span>

                <button
                  type="submit"
                  disabled={!dailyReflection.trim()}
                  className="px-5 py-2 rounded-2xl bg-[#7FAF8E] hover:bg-[#639272] disabled:opacity-50 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  {reflectionSaved ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[2]" />
                      <span>Save Reflection</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Layout: Schedule + Habits Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.618fr_1fr] gap-[21px]">
        {/* Today's Schedule Section (1.618 Golden Ratio Col) */}
        <div className="bento-card p-[21px] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8.5 h-8.5 rounded-2xl bg-[#7FAF8E]/15 text-[#639272] dark:text-[#7FAF8E] flex items-center justify-center font-bold">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#2F3A45] dark:text-white">
                  Today's Timeline
                </h2>
                <p className="text-[11px] text-[#9CA3AF] font-medium">
                  {todayEvents.length} events planned for today
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenQuickAdd}
                className="px-3 py-1.5 rounded-2xl bg-[#7FAF8E]/15 hover:bg-[#7FAF8E]/25 text-[#639272] dark:text-[#7FAF8E] font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>AI Add</span>
              </button>
              <button
                onClick={() => onOpenEventModal()}
                className="px-3 py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-[#2F3A45] dark:text-slate-200 font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            </div>
          </div>

          {todayEvents.length === 0 ? (
            <div className="p-10 rounded-3xl bg-[#FAFAF8] dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#7FAF8E]/15 text-[#7FAF8E] mx-auto flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-[#2F3A45] dark:text-slate-200 text-sm">No events scheduled for today</h3>
              <p className="text-xs text-[#9CA3AF] max-w-sm mx-auto font-medium">
                Use AI Quick Add to schedule study sessions, workouts, or quiet reading time!
              </p>
              <button
                onClick={onOpenQuickAdd}
                className="px-4.5 py-2 rounded-2xl bg-[#7FAF8E] hover:bg-[#639272] text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Quick Add Event</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Pinned Events First */}
              {pinnedEvents.length > 0 && (
                <div className="space-y-2 mb-4">
                  <div className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
                    <Pin className="w-3.5 h-3.5 fill-amber-500" />
                    <span>Pinned Priority Tasks</span>
                  </div>
                  {pinnedEvents.map((e) => (
                    <EventCard
                      key={e.id}
                      event={e}
                      onToggleComplete={() => onToggleEventComplete(e.id)}
                      onClick={() => onOpenEventModal(e)}
                    />
                  ))}
                </div>
              )}

              {/* Regular Events */}
              {regularEvents.map((e) => (
                <EventCard
                  key={e.id}
                  event={e}
                  onToggleComplete={() => onToggleEventComplete(e.id)}
                  onClick={() => onOpenEventModal(e)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar Bento Cells: Habits & AI Advice */}
        <div className="space-y-6">
          {/* Daily Habits Bento Cell */}
          <div className="bento-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-2xl bg-[#7FAF8E]/15 text-[#7FAF8E] flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-[#2F3A45] dark:text-white">
                  Zen Habits
                </h3>
              </div>
              <span className="bento-pill bg-[#7FAF8E]/15 text-[#639272] dark:text-[#7FAF8E] text-[10px]">Today</span>
            </div>

            <div className="space-y-2.5">
              {habits.map((h) => {
                const isDone = h.completedDates.includes(todayDateStr);
                return (
                  <div
                    key={h.id}
                    onClick={() => onToggleHabitComplete(h.id)}
                    className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-white/5 hover:bg-[#7FAF8E]/10 cursor-pointer border border-slate-100 dark:border-white/5 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-xl flex items-center justify-center transition-all ${
                          isDone ? 'bg-[#7FAF8E] text-white shadow-xs' : 'border-2 border-slate-300 dark:border-slate-600 group-hover:border-[#7FAF8E]'
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                      </div>
                      <div>
                        <div className={`text-xs font-extrabold ${isDone ? 'line-through text-[#9CA3AF]' : 'text-[#2F3A45] dark:text-slate-100'}`}>
                          {h.title}
                        </div>
                        <div className="text-[10px] text-[#9CA3AF] font-medium flex items-center gap-1 mt-0.5">
                          <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>{h.streak} Day Streak</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Advice Bento Cell */}
          <div className="bento-card p-6 bg-gradient-to-br from-[#EBF4EE] via-[#FAFAF8] to-[#F5F1FA] dark:from-[#23252A] dark:to-[#2B2C31] border border-[#7FAF8E]/30 space-y-3">
            <div className="flex items-center gap-2 text-[#639272] dark:text-[#7FAF8E] font-extrabold text-xs">
              <Sparkles className="w-4 h-4 text-[#C8B6E2]" />
              <span>Mindful AI Insight</span>
            </div>
            <p className="text-xs text-[#2F3A45]/80 dark:text-slate-300 leading-relaxed font-medium">
              "Your focus peak occurs between 9:00 AM and 11:30 AM. Schedule your deep work or study blocks in this peaceful window."
            </p>
            <button
              onClick={onNavigateToAIScheduler}
              className="text-xs font-extrabold text-[#7FAF8E] hover:text-[#639272] flex items-center gap-1 pt-1 transition-colors cursor-pointer"
            >
              <span>Ask Focus Coach</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Event Card Sub-component
interface EventCardProps {
  event: EventItem;
  onToggleComplete: () => void;
  onClick: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onToggleComplete, onClick }) => {
  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 group ${
        event.completed
          ? 'bg-slate-50/60 dark:bg-white/5 border-slate-200/50 dark:border-white/5 opacity-70'
          : 'bg-white dark:bg-[#2B2C31] border-slate-200/80 dark:border-white/10 hover:border-[#7FAF8E]/40 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Complete Checkbox */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete();
          }}
          className="text-[#9CA3AF] hover:text-[#7FAF8E] transition-colors shrink-0 cursor-pointer"
        >
          {event.completed ? (
            <CheckCircle2 className="w-5 h-5 text-[#7FAF8E] fill-[#7FAF8E]/20 stroke-[2.5]" />
          ) : (
            <Circle className="w-5 h-5 stroke-[2]" />
          )}
        </button>

        {/* Category Color Indicator */}
        <div
          className="w-1.5 h-10 rounded-full shrink-0"
          style={{ backgroundColor: event.color || '#7FAF8E' }}
        />

        {/* Event Icon */}
        <div
          className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border border-black/5 dark:border-white/10"
          style={{ backgroundColor: `${event.color || '#7FAF8E'}15`, color: event.color || '#7FAF8E' }}
        >
          <DynamicIcon name={event.icon} className="w-4 h-4" />
        </div>

        {/* Content Details */}
        <div className="min-w-0 flex-1 cursor-pointer" onClick={onClick}>
          <div className="flex items-center gap-2">
            <h4
              className={`text-xs font-bold truncate ${
                event.completed
                  ? 'line-through text-[#7FAF8E] font-semibold'
                  : 'text-[#2F3A45] dark:text-slate-100'
              }`}
            >
              {event.title}
            </h4>
            {event.aiSuggested && (
              <span className="px-1.5 py-0.5 text-[9px] bg-[#C8B6E2]/20 text-[#2F3A45] dark:text-[#C8B6E2] rounded-full font-bold border border-[#C8B6E2]/30 shrink-0">
                AI
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#9CA3AF] mt-1">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3 text-[#7FAF8E]" />
              {event.startTime} - {event.endTime} ({event.durationMinutes}m)
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span
              className="px-2 py-0.5 rounded-full font-bold text-[9px] border border-black/5 dark:border-white/10"
              style={{ backgroundColor: `${event.color || '#7FAF8E'}20`, color: event.color || '#7FAF8E' }}
            >
              {event.category}
            </span>
            {event.checklist && event.checklist.length > 0 && (
              <span className="text-[10px] text-[#9CA3AF] font-medium">
                • {event.checklist.filter((c) => c.completed).length}/{event.checklist.length} subtasks
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Priority Badge */}
      <div className="shrink-0">
        <span
          className={`bento-pill text-[9px] uppercase font-bold tracking-wider ${
            event.priority === 'high'
              ? 'bg-[#E28771]/15 text-[#E28771] border border-[#E28771]/30'
              : event.priority === 'medium'
              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
              : 'bg-[#7FAF8E]/15 text-[#639272] dark:text-[#7FAF8E] border border-[#7FAF8E]/30'
          }`}
        >
          {event.priority}
        </span>
      </div>
    </div>
  );
};
