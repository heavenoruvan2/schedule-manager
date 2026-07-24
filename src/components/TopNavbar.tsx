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
  Download
} from 'lucide-react';
import { ThemeMode, EventItem } from '../types';
import { AutoThemeConfig, evaluateAutoTheme } from '../utils/autoTheme';

interface TopNavbarProps {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (v: boolean) => void;
  onOpenQuickAdd: () => void;
  onOpenNewEvent: () => void;
  onOpenAndroidDownload?: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  events: EventItem[];
  onSelectEvent: (e: EventItem) => void;
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
  searchQuery,
  setSearchQuery,
  events,
  onSelectEvent,
  autoThemeConfig,
  onOpenAutoThemeSettings,
  onToggleAutoTheme,
  onClearOverride,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const upcomingReminders = events.filter((e) => !e.completed).slice(0, 4);
  const autoEval = autoThemeConfig ? evaluateAutoTheme(autoThemeConfig) : null;

  return (
    <header className="sticky top-0 z-30 bg-[#FAFAF8]/85 dark:bg-[#1E1F22]/85 amoled:bg-[#121315]/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/10 transition-colors max-w-full overflow-hidden">
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

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowThemePicker(false);
              }}
              className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-[#2F3A45] dark:text-slate-300 relative transition-all cursor-pointer"
              title="Reminders & Notifications"
            >
              <Bell className="w-4 h-4" />
              {upcomingReminders.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E28771] text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {upcomingReminders.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-[#2B2C31] border border-slate-200/80 dark:border-white/10 rounded-3xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#2F3A45] dark:text-white">
                    <Bell className="w-3.5 h-3.5 text-[#7FAF8E]" />
                    <span>Upcoming Reminders</span>
                  </div>
                  <span className="text-[10px] text-[#9CA3AF] font-medium">Next 24 Hours</span>
                </div>
                {upcomingReminders.length === 0 ? (
                  <p className="text-xs text-[#9CA3AF] py-4 text-center font-medium">No pending reminders.</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {upcomingReminders.map((e) => (
                      <div
                        key={e.id}
                        onClick={() => {
                          onSelectEvent(e);
                          setShowNotifications(false);
                        }}
                        className="p-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-[#7FAF8E]/10 cursor-pointer border border-slate-100 dark:border-white/5 transition-all flex items-start gap-2.5"
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                          style={{ backgroundColor: e.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#2F3A45] dark:text-slate-100 truncate">
                            {e.title}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-[#9CA3AF] mt-0.5 font-medium">
                            <span className="flex items-center gap-0.5">
                              <Clock className="w-3 h-3 text-[#7FAF8E]" />
                              {e.startTime} - {e.endTime}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-200 dark:bg-white/10">
                              {e.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Theme Selector Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setShowThemePicker(!showThemePicker);
                setShowNotifications(false);
              }}
              className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-[#2F3A45] dark:text-slate-300 transition-all cursor-pointer"
              title="Appearance Theme"
            >
              {theme === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
              {theme === 'dark' && <Moon className="w-4 h-4 text-[#A7C7E7]" />}
              {theme === 'amoled' && <Moon className="w-4 h-4 text-[#C8B6E2]" />}
              {theme === 'material-you' && <Palette className="w-4 h-4 text-[#7FAF8E]" />}
            </button>

            {showThemePicker && (
              <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#2B2C31] border border-slate-200/80 dark:border-white/10 rounded-3xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200 space-y-1">
                <div className="text-[10px] font-extrabold text-[#9CA3AF] px-2.5 pt-1 uppercase tracking-wider flex items-center justify-between">
                  <span>Appearance</span>
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
                        <span>Auto Theme</span>
                      </div>
                      <button
                        onClick={onOpenAutoThemeSettings}
                        className="text-[10px] font-extrabold text-[#7FAF8E] hover:underline cursor-pointer"
                      >
                        Configure
                      </button>
                    </div>

                    <div className="text-[10px] text-[#9CA3AF] font-medium leading-tight">
                      {autoThemeConfig.manualOverrideTheme ? (
                        <div className="flex items-center justify-between gap-1 text-amber-600 dark:text-amber-400 font-bold">
                          <span>Overridden by user</span>
                          {onClearOverride && (
                            <button
                              onClick={onClearOverride}
                              className="text-[9px] underline hover:text-[#7FAF8E]"
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
                  Manual Themes
                </div>

                {[
                  { mode: 'light', label: 'Warm Light Mode', icon: Sun, color: 'text-amber-500' },
                  { mode: 'dark', label: 'Charcoal Dark', icon: Moon, color: 'text-[#A7C7E7]' },
                  { mode: 'amoled', label: 'AMOLED Pure Black', icon: Moon, color: 'text-[#C8B6E2]' },
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
                          ? 'bg-[#7FAF8E]/15 text-[#639272] dark:text-[#7FAF8E]'
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
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
