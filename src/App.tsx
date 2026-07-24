import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Zap, 
  Sparkles, 
  Award, 
  Smartphone, 
  Plus, 
  Search, 
  Database,
  Flame,
  ShieldAlert,
  Bell
} from 'lucide-react';
import { 
  EventItem, 
  HabitItem, 
  ProductivityStats, 
  ThemeMode, 
  BlockedApp, 
  FocusSession 
} from './types';
import { INITIAL_EVENTS, INITIAL_HABITS, INITIAL_STATS, getRelativeDateStr } from './data/sampleData';
import { DEFAULT_BLOCKED_APPS } from './data/categoriesAndIcons';
import { TopNavbar } from './components/TopNavbar';
import { DashboardView } from './components/DashboardView';
import { CalendarView } from './components/CalendarView';
import { FocusModeView } from './components/FocusModeView';
import { AISmartSchedulerView } from './components/AISmartSchedulerView';
import { ProductivityView } from './components/ProductivityView';
import { WidgetsView } from './components/WidgetsView';
import { EventModal } from './components/EventModal';
import { QuickAddAIModal } from './components/QuickAddAIModal';
import { BlockedAppOverlay } from './components/BlockedAppOverlay';
import { FullAlarmModal } from './components/FullAlarmModal';
import { ExportSyncModal } from './components/ExportSyncModal';
import { AndroidDownloadModal } from './components/AndroidDownloadModal';
import { AutoThemeSettingsModal } from './components/AutoThemeSettingsModal';
import { BackgroundImageModal, BackgroundConfig } from './components/BackgroundImageModal';
import { SettingsModal } from './components/SettingsModal';
import { AutoThemeConfig, evaluateAutoTheme } from './utils/autoTheme';

export default function App() {
  const todayStr = getRelativeDateStr(0);

  // Persistent States
  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('ff_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [habits, setHabits] = useState<HabitItem[]>(() => {
    const saved = localStorage.getItem('ff_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [stats, setStats] = useState<ProductivityStats>(() => {
    const saved = localStorage.getItem('ff_stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('ff_theme');
    return (saved as ThemeMode) || 'dark';
  });

  const [bgConfig, setBgConfig] = useState<BackgroundConfig>(() => {
    const saved = localStorage.getItem('ff_bg_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      enabled: true,
      imageUrl: 'https://images.unsplash.com/photo-1511497584788-876761c11969?auto=format&fit=crop&w=1920&q=80',
      opacity: 0.35,
      blur: 2,
      overlayDim: 0.2,
      presetName: 'Misty Pine Forest',
    };
  });

  const [isBgImageModalOpen, setIsBgImageModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('ff_bg_config', JSON.stringify(bgConfig));
  }, [bgConfig]);

  const [autoThemeConfig, setAutoThemeConfig] = useState<AutoThemeConfig>(() => {
    const saved = localStorage.getItem('ff_auto_theme');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      autoEnabled: true,
      mode: 'sunset',
      dayStartHour: 6,
      nightStartHour: 18,
      manualOverrideTheme: null,
      useAmoledForNight: false,
      userCoords: null,
    };
  });

  const [isAutoThemeModalOpen, setIsAutoThemeModalOpen] = useState(false);

  // Compute currently active effective theme
  const evaluatedResult = evaluateAutoTheme(autoThemeConfig);
  const activeTheme: ThemeMode = autoThemeConfig.autoEnabled
    ? (autoThemeConfig.manualOverrideTheme || evaluatedResult.theme)
    : theme;

  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'focus' | 'ai_scheduler' | 'productivity' | 'widgets'>('dashboard');

  // Blocked Social Apps & Focus Session
  const [blockedApps, setBlockedApps] = useState<BlockedApp[]>(DEFAULT_BLOCKED_APPS);
  const [focusSession, setFocusSession] = useState<FocusSession>({
    id: 'fcs-1',
    durationMinutes: 25,
    elapsedSeconds: 0,
    status: 'idle',
    blockedApps: ['Instagram', 'TikTok', 'YouTube', 'X (Twitter)'],
    attemptsCount: 0,
    mode: 'pomodoro',
    ambientSound: 'none',
  });

  // Modal States
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAndroidDownloadOpen, setIsAndroidDownloadOpen] = useState(false);
  const [simulatedBlockedApp, setSimulatedBlockedApp] = useState<BlockedApp | null>(null);
  const [alarmEvent, setAlarmEvent] = useState<EventItem | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('ff_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('ff_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('ff_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('ff_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('ff_auto_theme', JSON.stringify(autoThemeConfig));
  }, [autoThemeConfig]);

  // Apply Theme Classes to HTML root based on activeTheme
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'amoled');
    if (activeTheme === 'dark') {
      root.classList.add('dark');
    } else if (activeTheme === 'amoled') {
      root.classList.add('dark', 'amoled');
    }
  }, [activeTheme]);

  // Re-evaluate auto theme schedule periodically
  useEffect(() => {
    if (!autoThemeConfig.autoEnabled) return;
    const interval = setInterval(() => {
      const res = evaluateAutoTheme(autoThemeConfig);
      if (!autoThemeConfig.manualOverrideTheme && res.theme !== theme) {
        setTheme(res.theme);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [autoThemeConfig, theme]);

  // Handle manual theme override setting
  const handleSetTheme = (newTheme: ThemeMode) => {
    if (autoThemeConfig.autoEnabled) {
      setAutoThemeConfig((prev) => ({
        ...prev,
        manualOverrideTheme: newTheme,
      }));
    } else {
      setTheme(newTheme);
    }
  };

  const handleClearOverride = () => {
    setAutoThemeConfig((prev) => ({
      ...prev,
      manualOverrideTheme: null,
    }));
  };

  // Toggle Event Completion & trigger confetti
  const handleToggleEventComplete = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const nextState = !e.completed;
          if (nextState) {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 },
            });
          }
          return { ...e, completed: nextState };
        }
        return e;
      })
    );

    // Update Stats
    setStats((prev) => ({
      ...prev,
      totalTasksCompleted: events.filter((e) => e.completed).length + 1,
    }));
  };

  // Toggle Habit Completion
  const handleToggleHabit = (habitId: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const isDone = h.completedDates.includes(todayStr);
          const newDates = isDone
            ? h.completedDates.filter((d) => d !== todayStr)
            : [...h.completedDates, todayStr];
          
          if (!isDone) {
            confetti({ particleCount: 30, spread: 40 });
          }

          return {
            ...h,
            completedDates: newDates,
            streak: !isDone ? h.streak + 1 : Math.max(0, h.streak - 1),
          };
        }
        return h;
      })
    );
  };

  // Save or Edit Event
  const handleSaveEvent = (savedEvent: EventItem) => {
    setEvents((prev) => {
      const exists = prev.some((e) => e.id === savedEvent.id);
      if (exists) {
        return prev.map((e) => (e.id === savedEvent.id ? savedEvent : e));
      }
      return [savedEvent, ...prev];
    });
    setEditingEvent(null);
  };

  // Delete Event
  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // Search Filtered Events
  const filteredEvents = events.filter((e) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.notes.toLowerCase().includes(q)
    );
  });

  // Simulate Blocked App Launch during Focus Mode
  const handleSimulateAppLaunch = (app: BlockedApp) => {
    setBlockedApps((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, attemptCount: a.attemptCount + 1 } : a))
    );
    setFocusSession((prev) => ({ ...prev, attemptsCount: prev.attemptsCount + 1 }));
    setSimulatedBlockedApp(app);
  };

  // Reset sample data
  const handleResetSampleData = () => {
    setEvents(INITIAL_EVENTS);
    setHabits(INITIAL_HABITS);
    setStats(INITIAL_STATS);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans overflow-x-hidden relative ${
        activeTheme === 'light'
          ? 'bg-[#FAFAF8] text-[#2F3A45]'
          : activeTheme === 'amoled'
          ? 'bg-[#121315] text-[#F3F4F6]'
          : 'bg-[#1E1F22] text-[#F3F4F6]'
      }`}
    >
      {/* Background Wallpaper Layer */}
      {bgConfig.enabled && bgConfig.imageUrl && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-500"
            style={{
              backgroundImage: `url("${bgConfig.imageUrl}")`,
              opacity: bgConfig.opacity,
              filter: `blur(${bgConfig.blur}px)`,
            }}
          />
          <div
            className="absolute inset-0 bg-black transition-opacity duration-500"
            style={{ opacity: bgConfig.overlayDim }}
          />
        </div>
      )}

      {/* Outer Container or Android Mobile Frame Simulator Wrapper */}
      <div className={isMobileFrame ? 'p-2 sm:p-5 flex justify-center items-center min-h-screen bg-[#1A1C1E] overflow-x-hidden' : 'w-full overflow-x-hidden'}>
        <div
          className={
            isMobileFrame
              ? 'w-full max-w-[420px] h-[860px] bg-[#FAFAF8] dark:bg-[#1E1F22] amoled:bg-[#121315] rounded-[44px] border-[10px] border-[#2B2C31] shadow-2xl overflow-hidden flex flex-col relative max-w-full'
              : 'w-full min-h-screen flex flex-col max-w-full'
          }
        >
          {/* Simulated Mobile Notch / Camera Bar */}
          {isMobileFrame && (
            <div className="w-full bg-[#1E1F22] text-slate-300 px-5 py-1.5 flex items-center justify-between text-[11px] font-bold shrink-0 z-40 select-none border-b border-white/5">
              <span>9:41 AM</span>
              <div className="w-16 h-3 bg-black/60 rounded-full mx-auto my-0.5" />
              <div className="flex items-center gap-1">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Top Navbar */}
          <TopNavbar
            theme={activeTheme}
            setTheme={handleSetTheme}
            isMobileFrame={isMobileFrame}
            setIsMobileFrame={setIsMobileFrame}
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            onOpenNewEvent={() => {
              setEditingEvent(null);
              setIsEventModalOpen(true);
            }}
            onOpenAndroidDownload={() => setIsAndroidDownloadOpen(true)}
            onOpenBgImageModal={() => setIsBgImageModalOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            events={events}
            habits={habits}
            onSelectEvent={(e) => {
              setEditingEvent(e);
              setIsEventModalOpen(true);
            }}
            onToggleEventComplete={handleToggleEventComplete}
            onToggleHabitComplete={handleToggleHabit}
            onTriggerTestAlarm={(e) => setAlarmEvent(e || events[0] || null)}
            autoThemeConfig={autoThemeConfig}
            onOpenAutoThemeSettings={() => setIsAutoThemeModalOpen(true)}
            onToggleAutoTheme={() => setAutoThemeConfig((prev) => ({ ...prev, autoEnabled: !prev.autoEnabled }))}
            onClearOverride={handleClearOverride}
          />

          {/* Main App Body View */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden px-3 sm:px-[21px] pt-[21px] pb-24 max-w-7xl mx-auto w-full box-border">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-full overflow-hidden"
              >
                {activeTab === 'dashboard' && (
                  <DashboardView
                    events={filteredEvents}
                    habits={habits}
                    stats={stats}
                    onToggleEventComplete={handleToggleEventComplete}
                    onToggleHabitComplete={handleToggleHabit}
                    onOpenEventModal={(event) => {
                      setEditingEvent(event || null);
                      setIsEventModalOpen(true);
                    }}
                    onOpenQuickAdd={() => setIsQuickAddOpen(true)}
                    onNavigateToFocus={() => setActiveTab('focus')}
                    onNavigateToAIScheduler={() => setActiveTab('ai_scheduler')}
                    onOpenAndroidDownload={() => setIsAndroidDownloadOpen(true)}
                    todayDateStr={todayStr}
                  />
                )}

                {activeTab === 'calendar' && (
                  <CalendarView
                    events={filteredEvents}
                    onToggleEventComplete={handleToggleEventComplete}
                    onOpenEventModal={(event) => {
                      setEditingEvent(event || null);
                      setIsEventModalOpen(true);
                    }}
                    selectedCategoryFilter={selectedCategoryFilter}
                    setSelectedCategoryFilter={setSelectedCategoryFilter}
                  />
                )}

                {activeTab === 'focus' && (
                  <FocusModeView
                    session={focusSession}
                    setSession={setFocusSession}
                    blockedApps={blockedApps}
                    setBlockedApps={setBlockedApps}
                    onSimulateAppLaunch={handleSimulateAppLaunch}
                    activeTask={events.find((e) => !e.completed)}
                    events={events}
                    stats={stats}
                  />
                )}

                {activeTab === 'ai_scheduler' && (
                  <AISmartSchedulerView
                    events={events}
                    setEvents={setEvents}
                    onOpenQuickAdd={() => setIsQuickAddOpen(true)}
                  />
                )}

                {activeTab === 'productivity' && (
                  <ProductivityView
                    stats={stats}
                    habits={habits}
                    onToggleHabit={handleToggleHabit}
                    todayDateStr={todayStr}
                  />
                )}

                {activeTab === 'widgets' && (
                  <WidgetsView
                    events={events}
                    onOpenQuickAdd={() => setIsQuickAddOpen(true)}
                    todayDateStr={todayStr}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Floating Action Buttons inside Mobile Frame / View */}
          <div className="absolute bottom-16 right-3 sm:right-4 z-40 flex flex-col gap-2 pointer-events-auto">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsQuickAddOpen(true)}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#7FAF8E] text-white font-bold shadow-xl shadow-[#7FAF8E]/30 flex items-center justify-center cursor-pointer"
              title="AI Natural Language Quick Add"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                setEditingEvent(null);
                setIsEventModalOpen(true);
              }}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#2F3A45] dark:bg-white text-white dark:text-[#2F3A45] font-bold shadow-xl flex items-center justify-center cursor-pointer"
              title="Create New Event"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
            </motion.button>
          </div>

          {/* Bottom Navigation Bar */}
          <nav className="sticky bottom-0 z-30 bg-[#FAFAF8]/95 dark:bg-[#1E1F22]/95 amoled:bg-[#121315]/95 backdrop-blur-xl border-t border-slate-200/60 dark:border-white/10 px-1.5 py-1.5 shrink-0 w-full overflow-x-auto no-scrollbar">
            <div className="max-w-md mx-auto flex items-center justify-between min-w-0">
              {[
                { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
                { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
                { id: 'focus', label: 'Focus', icon: Zap, badge: focusSession.status === 'running' },
                { id: 'ai_scheduler', label: 'AI Sync', icon: Sparkles },
                { id: 'productivity', label: 'Habits', icon: Award },
                { id: 'widgets', label: 'Widgets', icon: Smartphone },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex flex-col items-center justify-center gap-0.5 px-1.5 py-1 rounded-2xl transition-colors duration-200 relative cursor-pointer min-w-[44px] shrink-0 ${
                      isActive
                        ? 'text-[#7FAF8E] dark:text-[#7FAF8E] font-bold'
                        : 'text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-slate-200'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="bottomNavActivePill"
                        className="absolute inset-0 bg-[#7FAF8E]/15 rounded-2xl"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <Icon className={`w-4 h-4 z-10 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                    <span className="text-[9px] sm:text-[10px] tracking-tight font-semibold z-10 whitespace-nowrap">{tab.label}</span>
                    {tab.badge && (
                      <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#7FAF8E] animate-ping z-10" />
                    )}
                  </motion.button>
                );
              })}

              {/* Data Export Trigger Button */}
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="p-1.5 text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-slate-200 rounded-2xl transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 min-w-[36px] flex items-center justify-center shrink-0"
                title="Backup & Sync"
              >
                <Database className="w-4 h-4" />
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Modals & Overlays */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        initialEvent={editingEvent}
      />

      <QuickAddAIModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddEvent={(e) => {
          handleSaveEvent(e);
          confetti({ particleCount: 40, spread: 50 });
        }}
      />

      <BlockedAppOverlay
        app={simulatedBlockedApp}
        onClose={() => setSimulatedBlockedApp(null)}
        onConfirmEmergencyExit={() => {
          setFocusSession((prev) => ({ ...prev, status: 'cancelled' }));
          setSimulatedBlockedApp(null);
        }}
        session={focusSession}
        activeTask={events.find((e) => !e.completed)}
      />

      <FullAlarmModal
        event={alarmEvent}
        onClose={() => setAlarmEvent(null)}
        onSnooze={() => setAlarmEvent(null)}
        onComplete={() => {
          if (alarmEvent) handleToggleEventComplete(alarmEvent.id);
          setAlarmEvent(null);
        }}
        onStartFocus={() => {
          setAlarmEvent(null);
          setActiveTab('focus');
        }}
      />

      <ExportSyncModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        events={events}
        onImportEvents={(imported) => setEvents(imported)}
        onResetSampleData={handleResetSampleData}
      />

      <AndroidDownloadModal
        isOpen={isAndroidDownloadOpen}
        onClose={() => setIsAndroidDownloadOpen(false)}
      />

      <AutoThemeSettingsModal
        isOpen={isAutoThemeModalOpen}
        onClose={() => setIsAutoThemeModalOpen(false)}
        config={autoThemeConfig}
        onChangeConfig={(newCfg) => setAutoThemeConfig(newCfg)}
        currentActiveTheme={activeTheme}
        onSetManualTheme={handleSetTheme}
        onClearOverride={handleClearOverride}
      />

      <BackgroundImageModal
        isOpen={isBgImageModalOpen}
        onClose={() => setIsBgImageModalOpen(false)}
        config={bgConfig}
        onChangeConfig={(newCfg) => setBgConfig(newCfg)}
        onOpenAndroidGuide={() => {
          setIsBgImageModalOpen(false);
          setIsAndroidDownloadOpen(true);
        }}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        theme={activeTheme}
        onSelectTheme={handleSetTheme}
        bgConfig={bgConfig}
        onChangeBgConfig={(newCfg) => setBgConfig(newCfg)}
        autoThemeConfig={autoThemeConfig}
        onToggleAutoTheme={() => {
          setAutoThemeConfig({ ...autoThemeConfig, autoEnabled: !autoThemeConfig.autoEnabled });
        }}
        onOpenAutoThemeModal={() => {
          setIsSettingsModalOpen(false);
          setIsAutoThemeModalOpen(true);
        }}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
        onOpenAndroidGuide={() => {
          setIsSettingsModalOpen(false);
          setIsAndroidDownloadOpen(true);
        }}
        onOpenExportSync={() => {
          setIsSettingsModalOpen(false);
          setIsExportModalOpen(true);
        }}
        onTriggerTestAlarm={() => setAlarmEvent(events[0] || null)}
        onResetData={handleResetSampleData}
      />
    </div>
  );
}
