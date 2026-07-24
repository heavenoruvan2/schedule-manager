import React, { useState } from 'react';
import { 
  Zap, 
  Search, 
  Bell, 
  Smartphone, 
  Monitor, 
  Moon, 
  Sun, 
  Palette, 
  SlidersHorizontal,
  X,
  CheckCircle2,
  Clock,
  Plus,
  Download,
  Image as ImageIcon,
  Settings
} from 'lucide-react';
import { ThemeMode, EventItem, HabitItem } from '../types';
import { AutoThemeConfig, evaluateAutoTheme } from '../utils/autoTheme';

interface TopNavbarProps {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (v: boolean) => void;
  onOpenQuickAdd: () => void;
  onOpenNewEvent: () => void;
  onOpenAndroidDownload?: () => void;
  onOpenBgImageModal?: () => void;
  onOpenSettings?: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  events: EventItem[];
  habits?: HabitItem[];
  onSelectEvent: (e: EventItem) => void;
  onToggleEventComplete?: (id: string) => void;
  onToggleHabitComplete?: (id: string) => void;
  onTriggerTestAlarm?: (e?: EventItem) => void;
  autoThemeConfig?: AutoThemeConfig;
  onOpenAutoThemeSettings?: () => void;
  onToggleAutoTheme?: () => void;
  onClearOverride?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  theme,
  setTheme,
  isMobileFrame,
  setIsMobileFrame,
  onOpenQuickAdd,
  onOpenNewEvent,
  onOpenAndroidDownload,
  onOpenBgImageModal,
  onOpenSettings,
  searchQuery,
  setSearchQuery,
  events,
  habits = [],
  onSelectEvent,
  onToggleEventComplete,
  onToggleHabitComplete,
  onTriggerTestAlarm,
  autoThemeConfig,
  onOpenAutoThemeSettings,
  onToggleAutoTheme,
  onClearOverride,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [notificationTab, setNotificationTab] = useState<'all' | 'events' | 'habits'>('all');

  const upcomingReminders = events.filter((e) => !e.completed);
  const todayStr = new Date().toISOString().split('T')[0];
  const pendingHabits = habits.filter((h) => !h.completedDates.includes(todayStr));
  
  const totalNotifications = upcomingReminders.length + pendingHabits.length;
  const autoEval = autoThemeConfig ? evaluateAutoTheme(autoThemeConfig) : null;

  const handleQuickThemeToggle = () => {
    // If currently dark or amoled, switch to light; otherwise switch to dark
    if (theme === 'dark' || theme === 'amoled') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAFAF8]/90 dark:bg-[#1E1F22]/90 amoled:bg-[#121315]/95 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/10 transition-colors max-w-full">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 max-w-full">
        {/* Left Brand & App Title */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-[#7FAF8E] flex items-center justify-center text-white shadow-xs font-bold shrink-0">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-[#2F3A45] dark:text-white truncate">
                FocusFlow
              </h1>
              <span className="hidden xs:inline-block px-2 py-0.5 text-[9px] sm:text-[10px] font-bold bg-[#7FAF8E]/15 text-[#639272] dark:text-[#7FAF8E] rounded-full border border-[#7FAF8E]/25 shrink-0">
                Zen Edition
              </span>
            </div>
            <p className="text-[11px] text-[#9CA3AF] hidden md:block font-medium truncate">
              Mindful Scheduling & Focus
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, tags, notes, or categories..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-transparent focus:border-[#7FAF8E]/50 focus:bg-white dark:focus:bg-[#2B2C31] text-[#2F3A45] dark:text-slate-100 placeholder-[#9CA3AF] transition-all outline-none font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* AI Quick Add Button */}
          <button
            onClick={onOpenQuickAdd}
            className="p-2 sm:px-3.5 sm:py-2 rounded-2xl bg-[#7FAF8E] hover:bg-[#639272] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
            title="Natural Language AI Quick Add"
          >
            <Zap className="w-3.5 h-3.5 fill-current shrink-0" />
            <span className="hidden sm:inline">AI Quick Add</span>
          </button>

          {/* Android App Download / PWA Install Button */}
          {onOpenAndroidDownload && (
            <button
              onClick={onOpenAndroidDownload}
              className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-[#7FAF8E]/15 hover:bg-[#7FAF8E]/25 text-[#639272] dark:text-[#7FAF8E] border border-[#7FAF8E]/30 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
              title="Install FocusFlow on Android Phone or Web"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
              <span className="hidden md:inline">Get App</span>
            </button>
          )}

          {/* New Event Button */}
          <button
            onClick={onOpenNewEvent}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-[#2F3A45] dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shrink-0"
            title="Manual New Event"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline">New Event</span>
          </button>

          {/* Device Frame View Switcher */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className={`p-2 rounded-2xl transition-all text-xs flex items-center justify-center gap-1 cursor-pointer shrink-0 ${
              isMobileFrame
                ? 'bg-[#7FAF8E]/20 text-[#639272] dark:text-[#7FAF8E] border border-[#7FAF8E]/30'
                : 'bg-slate-100 dark:bg-white/5 text-[#2F3A45] dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
            title={isMobileFrame ? 'Switch to Expanded Desktop Layout' : 'Switch to Android Phone Preview Frame'}
          >
            {isMobileFrame ? <Smartphone className="w-4 h-4 shrink-0" /> : <Monitor className="w-4 h-4 shrink-0" />}
            <span className="text-[11px] font-bold hidden lg:inline">
              {isMobileFrame ? 'Phone View' : 'Desktop View'}
            </span>
          </button>

          {/* Background Wallpaper Button */}
          {onOpenBgImageModal && (
            <button
              onClick={onOpenBgImageModal}
              className="p-2 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-[#2F3A45] dark:text-slate-300 transition-all text-xs flex items-center justify-center gap-1 cursor-pointer shrink-0"
              title="Customize Background Wallpaper & Opacity"
            >
              <ImageIcon className="w-4 h-4 text-[#7FAF8E] shrink-0" />
              <span className="text-[11px] font-bold hidden xl:inline">Wallpaper</span>
            </button>
          )}

          {/* Settings Button */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-[#2F3A45] dark:text-slate-300 transition-all text-xs flex items-center justify-center gap-1 cursor-pointer shrink-0"
              title="Settings & Preferences"
            >
              <Settings className="w-4 h-4 text-[#7FAF8E] shrink-0" />
              <span className="text-[11px] font-bold hidden xl:inline">Settings</span>
            </button>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowThemePicker(false);
              }}
              className={`p-2 rounded-2xl relative transition-all cursor-pointer ${
                showNotifications
                  ? 'bg-[#7FAF8E]/20 text-[#7FAF8E] border border-[#7FAF8E]/30'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-[#2F3A45] dark:text-slate-300'
              }`}
              title="Reminders & Notifications Center"
            >
              <Bell className="w-4 h-4" />
              {totalNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E28771] text-white rounded-full text-[10px] font-extrabold flex items-center justify-center shadow-xs animate-pulse">
                  {totalNotifications}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white dark:bg-[#2B2C31] amoled:bg-[#1E1F22] border border-slate-200/80 dark:border-white/10 rounded-3xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-200 space-y-2.5">
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#2F3A45] dark:text-white">
                    <Bell className="w-4 h-4 text-[#7FAF8E]" />
                    <span>Notifications Center</span>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#7FAF8E]/15 text-[#639272] dark:text-[#7FAF8E]">
                    {totalNotifications} Active
                  </span>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/5 text-[11px] font-extrabold">
                  <button
                    onClick={() => setNotificationTab('all')}
                    className={`flex-1 py-1 rounded-lg transition-all cursor-pointer text-center ${
                      notificationTab === 'all'
                        ? 'bg-white dark:bg-[#3A3B40] text-[#2F3A45] dark:text-white shadow-xs'
                        : 'text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-white'
                    }`}
                  >
                    All ({totalNotifications})
                  </button>
                  <button
                    onClick={() => setNotificationTab('events')}
                    className={`flex-1 py-1 rounded-lg transition-all cursor-pointer text-center ${
                      notificationTab === 'events'
                        ? 'bg-white dark:bg-[#3A3B40] text-[#2F3A45] dark:text-white shadow-xs'
                        : 'text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-white'
                    }`}
                  >
                    Tasks ({upcomingReminders.length})
                  </button>
                  <button
                    onClick={() => setNotificationTab('habits')}
                    className={`flex-1 py-1 rounded-lg transition-all cursor-pointer text-center ${
                      notificationTab === 'habits'
                        ? 'bg-white dark:bg-[#3A3B40] text-[#2F3A45] dark:text-white shadow-xs'
                        : 'text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-white'
                    }`}
                  >
                    Habits ({pendingHabits.length})
                  </button>
                </div>

                {/* Notification Items List */}
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                  {/* Task Reminders */}
                  {(notificationTab === 'all' || notificationTab === 'events') &&
                    upcomingReminders.map((e) => (
                      <div
                        key={e.id}
                        className="p-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-[#7FAF8E]/10 border border-slate-100 dark:border-white/5 transition-all flex items-start justify-between gap-2 group"
                      >
                        <div
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => {
                            onSelectEvent(e);
                            setShowNotifications(false);
                          }}
                        >
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: e.color }}
                            />
                            <p className="text-xs font-bold text-[#2F3A45] dark:text-slate-100 truncate">
                              {e.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-[#9CA3AF] mt-1 font-medium">
                            <span className="flex items-center gap-0.5">
                              <Clock className="w-3 h-3 text-[#7FAF8E]" />
                              {e.startTime} - {e.endTime}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-200 dark:bg-white/10 font-bold">
                              {e.category}
                            </span>
                          </div>
                        </div>

                        {onToggleEventComplete && (
                          <button
                            onClick={() => onToggleEventComplete(e.id)}
                            className="p-1.5 rounded-xl text-[#9CA3AF] hover:text-[#7FAF8E] hover:bg-white dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                            title="Mark Completed"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}

                  {/* Habit Reminders */}
                  {(notificationTab === 'all' || notificationTab === 'habits') &&
                    pendingHabits.map((h) => (
                      <div
                        key={h.id}
                        className="p-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-[#7FAF8E]/10 border border-slate-100 dark:border-white/5 transition-all flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#2F3A45] dark:text-slate-100 truncate">
                            {h.title}
                          </p>
                          <p className="text-[10px] text-[#9CA3AF] font-medium mt-0.5">
                            Habit streak waiting ({h.streak} days)
                          </p>
                        </div>
                        {onToggleHabitComplete && (
                          <button
                            onClick={() => onToggleHabitComplete(h.id)}
                            className="px-2.5 py-1 rounded-xl bg-[#7FAF8E] hover:bg-[#639272] text-white text-[10px] font-extrabold cursor-pointer shrink-0"
                          >
                            Check Off
                          </button>
                        )}
                      </div>
                    ))}

                  {totalNotifications === 0 && (
                    <div className="p-6 text-center space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-[#7FAF8E] mx-auto opacity-80" />
                      <p className="text-xs font-bold text-[#2F3A45] dark:text-slate-200">
                        All caught up!
                      </p>
                      <p className="text-[11px] text-[#9CA3AF]">
                        No pending tasks or habits right now.
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  {onTriggerTestAlarm && (
                    <button
                      onClick={() => {
                        const firstEvent = upcomingReminders[0] || events[0];
                        onTriggerTestAlarm(firstEvent);
                        setShowNotifications(false);
                      }}
                      className="text-[10px] font-extrabold text-[#7FAF8E] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3 fill-current" />
                      <span>Test Full Alarm Notification</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[10px] font-extrabold text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-white cursor-pointer ml-auto"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Direct Dark Mode Quick Switch + Appearance Menu Button */}
          <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-white/5 rounded-2xl p-0.5 border border-slate-200/50 dark:border-white/10">
            {/* Quick 1-Click Dark/Light Mode Switch */}
            <button
              onClick={handleQuickThemeToggle}
              className="p-1.5 sm:px-2 sm:py-1.5 rounded-xl hover:bg-white dark:hover:bg-white/10 text-[#2F3A45] dark:text-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
              title={
                theme === 'dark' || theme === 'amoled'
                  ? 'Switch to Light Mode'
                  : 'Switch to Dark Mode'
              }
            >
              {theme === 'light' && <Sun className="w-4 h-4 text-amber-500 shrink-0" />}
              {(theme === 'dark' || theme === 'amoled') && <Moon className="w-4 h-4 text-[#A7C7E7] shrink-0" />}
              {theme === 'material-you' && <Palette className="w-4 h-4 text-[#7FAF8E] shrink-0" />}
              <span className="text-[11px] font-extrabold hidden sm:inline">
                {theme === 'light' ? 'Light' : theme === 'amoled' ? 'AMOLED' : theme === 'material-you' ? 'Sage' : 'Dark'}
              </span>
            </button>

            {/* Dropdown Options Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowThemePicker(!showThemePicker);
                  setShowNotifications(false);
                }}
                className={`p-1.5 rounded-xl hover:bg-white dark:hover:bg-white/10 text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-slate-200 transition-all cursor-pointer ${
                  showThemePicker ? 'bg-white dark:bg-white/15 text-[#7FAF8E]' : ''
                }`}
                title="Open All Appearance Themes"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>

              {showThemePicker && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#2B2C31] amoled:bg-[#1E1F22] border border-slate-200/80 dark:border-white/10 rounded-3xl shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-200 space-y-1.5">
                  <div className="text-[10px] font-extrabold text-[#9CA3AF] px-2.5 pt-1 uppercase tracking-wider flex items-center justify-between">
                    <span>Appearance Themes</span>
                    {autoThemeConfig?.autoEnabled && (
                      <span className="text-[9px] text-[#7FAF8E] font-bold bg-[#7FAF8E]/15 px-1.5 py-0.5 rounded-full">
                        AUTO ACTIVE
                      </span>
                    )}
                  </div>

                  {/* Auto Theme Quick Config Item */}
                  {autoThemeConfig && (
                    <div className="p-2 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#2F3A45] dark:text-slate-100">
                          {autoEval?.isDaylight ? (
                            <Sun className="w-3.5 h-3.5 text-amber-500" />
                          ) : (
                            <Moon className="w-3.5 h-3.5 text-[#C8B6E2]" />
                          )}
                          <span>Auto Theme Schedule</span>
                        </div>
                        {onOpenAutoThemeSettings && (
                          <button
                            onClick={() => {
                              onOpenAutoThemeSettings();
                              setShowThemePicker(false);
                            }}
                            className="text-[10px] font-extrabold text-[#7FAF8E] hover:underline cursor-pointer"
                          >
                            Settings
                          </button>
                        )}
                      </div>

                      <div className="text-[10px] text-[#9CA3AF] font-medium leading-tight">
                        {autoThemeConfig.manualOverrideTheme ? (
                          <div className="flex items-center justify-between gap-1 text-amber-600 dark:text-amber-400 font-bold">
                            <span>User manual override active</span>
                            {onClearOverride && (
                              <button
                                onClick={onClearOverride}
                                className="text-[9px] underline hover:text-[#7FAF8E] cursor-pointer"
                              >
                                Reset Auto
                              </button>
                            )}
                          </div>
                        ) : (
                          <span>{autoEval?.nextTransitionText || 'Active based on schedule'}</span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="text-[10px] font-extrabold text-[#9CA3AF] px-2.5 pt-1 uppercase tracking-wider">
                    Select Theme
                  </div>

                  {[
                    { mode: 'dark', label: 'Charcoal Dark', icon: Moon, color: 'text-[#A7C7E7]' },
                    { mode: 'amoled', label: 'AMOLED Pure Black', icon: Moon, color: 'text-[#C8B6E2]' },
                    { mode: 'light', label: 'Warm Light Mode', icon: Sun, color: 'text-amber-500' },
                    { mode: 'material-you', label: 'Sage Zen Theme', icon: Palette, color: 'text-[#7FAF8E]' },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isCurrent = theme === item.mode;
                    return (
                      <button
                        key={item.mode}
                        onClick={() => {
                          setTheme(item.mode as ThemeMode);
                          setShowThemePicker(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-2xl text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-[#7FAF8E]/20 text-[#639272] dark:text-[#7FAF8E] border border-[#7FAF8E]/30'
                            : 'hover:bg-slate-100 dark:hover:bg-white/5 text-[#2F3A45] dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                          <span>{item.label}</span>
                        </div>
                        {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-[#7FAF8E]" />}
                      </button>
                    );
                  })}

                  {onOpenBgImageModal && (
                    <button
                      onClick={() => {
                        onOpenBgImageModal();
                        setShowThemePicker(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-2xl text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer bg-[#7FAF8E]/10 hover:bg-[#7FAF8E]/20 text-[#639272] dark:text-[#7FAF8E] border border-[#7FAF8E]/20 mt-1"
                    >
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-3.5 h-3.5 text-[#7FAF8E]" />
                        <span>Background Wallpaper</span>
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
