import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  X, 
  Moon, 
  Sun, 
  Smartphone, 
  Image as ImageIcon, 
  Download, 
  Database, 
  Bell, 
  SlidersHorizontal, 
  Sparkles, 
  ShieldCheck, 
  Trash2, 
  Check, 
  Code2, 
  Eye, 
  RotateCcw,
  Volume2,
  Clock,
  Layers
} from 'lucide-react';
import { ThemeMode } from '../types';
import { BackgroundConfig, ZEN_PRESETS } from './BackgroundImageModal';
import { AutoThemeConfig } from '../utils/autoTheme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Theme & Appearance
  theme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
  bgConfig: BackgroundConfig;
  onChangeBgConfig: (newConfig: BackgroundConfig) => void;
  autoThemeConfig: AutoThemeConfig;
  onToggleAutoTheme: () => void;
  onOpenAutoThemeModal: () => void;
  // Mobile Frame
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  // Android & Export
  onOpenAndroidGuide: () => void;
  onOpenExportSync: () => void;
  // Test Alarm / Sound
  onTriggerTestAlarm?: () => void;
  // Reset Data
  onResetData?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onSelectTheme,
  bgConfig,
  onChangeBgConfig,
  autoThemeConfig,
  onToggleAutoTheme,
  onOpenAutoThemeModal,
  isMobileFrame,
  onToggleMobileFrame,
  onOpenAndroidGuide,
  onOpenExportSync,
  onTriggerTestAlarm,
  onResetData,
}) => {
  const [activeTab, setActiveTab] = useState<'appearance' | 'android' | 'data' | 'preferences'>('appearance');
  const [resetConfirmed, setResetConfirmed] = useState(false);

  const handleReset = () => {
    if (onResetData) {
      onResetData();
      setResetConfirmed(true);
      setTimeout(() => setResetConfirmed(false), 2500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white dark:bg-[#23252A] amoled:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto p-5 sm:p-6 space-y-5 max-h-[90vh] flex flex-col"
          >
            {/* Settings Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#7FAF8E] text-white flex items-center justify-center font-bold shadow-md shadow-[#7FAF8E]/20">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-[#2F3A45] dark:text-white tracking-tight">
                      Preferences & Settings
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#7FAF8E]/15 text-[#639272] dark:text-[#7FAF8E]">
                      FocusFlow v2.4
                    </span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] font-medium">
                    Customize themes, background wallpapers, Android Studio builds & data
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 text-xs font-extrabold shrink-0">
              <button
                onClick={() => setActiveTab('appearance')}
                className={`py-2 px-2 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                  activeTab === 'appearance'
                    ? 'bg-white dark:bg-[#2B2C31] text-[#7FAF8E] shadow-xs'
                    : 'text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-slate-200'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Appearance</span>
              </button>
              <button
                onClick={() => setActiveTab('android')}
                className={`py-2 px-2 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                  activeTab === 'android'
                    ? 'bg-white dark:bg-[#2B2C31] text-[#7FAF8E] shadow-xs'
                    : 'text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android App</span>
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className={`py-2 px-2 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                  activeTab === 'data'
                    ? 'bg-white dark:bg-[#2B2C31] text-[#7FAF8E] shadow-xs'
                    : 'text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-slate-200'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Data & Backup</span>
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`py-2 px-2 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                  activeTab === 'preferences'
                    ? 'bg-white dark:bg-[#2B2C31] text-[#7FAF8E] shadow-xs'
                    : 'text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-slate-200'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Alerts & Sound</span>
              </button>
            </div>

            {/* TAB CONTENT AREA */}
            <div className="overflow-y-auto space-y-4 pr-1 scrollbar-thin flex-1 text-xs">
              {/* TAB 1: APPEARANCE & WALLPAPERS */}
              {activeTab === 'appearance' && (
                <div className="space-y-4">
                  {/* Color Theme Mode */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-3">
                    <div className="flex items-center justify-between font-extrabold text-[#2F3A45] dark:text-slate-100">
                      <span className="flex items-center gap-1.5">
                        <Sun className="w-4 h-4 text-[#7FAF8E]" />
                        <span>Color Theme Mode</span>
                      </span>
                      <span className="text-[10px] text-[#9CA3AF] capitalize">Current: {theme}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => onSelectTheme('light')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold ${
                          theme === 'light'
                            ? 'bg-[#7FAF8E] text-white border-[#7FAF8E] shadow-sm'
                            : 'bg-white dark:bg-white/10 text-[#2F3A45] dark:text-slate-200 border-slate-200 dark:border-white/10 hover:bg-slate-100'
                        }`}
                      >
                        ☀️ Soft Light
                      </button>
                      <button
                        onClick={() => onSelectTheme('dark')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold ${
                          theme === 'dark'
                            ? 'bg-[#7FAF8E] text-white border-[#7FAF8E] shadow-sm'
                            : 'bg-white dark:bg-white/10 text-[#2F3A45] dark:text-slate-200 border-slate-200 dark:border-white/10 hover:bg-slate-100'
                        }`}
                      >
                        🌙 Slate Dark
                      </button>
                      <button
                        onClick={() => onSelectTheme('amoled')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold ${
                          theme === 'amoled'
                            ? 'bg-[#7FAF8E] text-white border-[#7FAF8E] shadow-sm'
                            : 'bg-white dark:bg-white/10 text-[#2F3A45] dark:text-slate-200 border-slate-200 dark:border-white/10 hover:bg-slate-100'
                        }`}
                      >
                        🖤 Pure AMOLED
                      </button>
                    </div>
                  </div>

                  {/* Background Wallpaper Quick Config */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-3">
                    <div className="flex items-center justify-between font-extrabold text-[#2F3A45] dark:text-slate-100">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-[#7FAF8E]" />
                        <span>Background Wallpaper</span>
                      </span>
                      <button
                        onClick={() => onChangeBgConfig({ ...bgConfig, enabled: !bgConfig.enabled })}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                          bgConfig.enabled ? 'bg-[#7FAF8E]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            bgConfig.enabled ? 'translate-x-4.5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {bgConfig.enabled && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-[11px] font-medium text-[#9CA3AF]">
                          <span>Active Preset: <strong className="text-[#2F3A45] dark:text-slate-100">{bgConfig.presetName}</strong></span>
                          <span>Opacity: <strong>{Math.round(bgConfig.opacity * 100)}%</strong></span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          {ZEN_PRESETS.slice(0, 3).map((p) => (
                            <button
                              key={p.id}
                              onClick={() =>
                                onChangeBgConfig({
                                  ...bgConfig,
                                  enabled: true,
                                  imageUrl: p.url,
                                  presetName: p.name,
                                })
                              }
                              className={`h-12 rounded-xl overflow-hidden relative border-2 transition-all cursor-pointer ${
                                bgConfig.imageUrl === p.url ? 'border-[#7FAF8E]' : 'border-transparent'
                              }`}
                            >
                              <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url("${p.url}")` }}
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] font-extrabold text-white">
                                {p.name.split(' ')[0]}
                              </div>
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-[#9CA3AF]">Wallpaper Opacity:</span>
                          <input
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.05"
                            value={bgConfig.opacity}
                            onChange={(e) =>
                              onChangeBgConfig({ ...bgConfig, opacity: parseFloat(e.target.value) })
                            }
                            className="w-36 accent-[#7FAF8E] cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Auto-Theme Schedule */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-[#2F3A45] dark:text-slate-100 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#7FAF8E]" />
                        <span>Auto-Theme Sunset Schedule</span>
                      </p>
                      <p className="text-[11px] text-[#9CA3AF] font-medium mt-0.5">
                        Automatically switches to dark theme after 19:00 sunset
                      </p>
                    </div>
                    <button
                      onClick={onOpenAutoThemeModal}
                      className="px-3 py-1.5 rounded-xl bg-[#7FAF8E]/15 text-[#639272] dark:text-[#7FAF8E] font-extrabold text-xs hover:bg-[#7FAF8E]/25 transition-all cursor-pointer"
                    >
                      Configure
                    </button>
                  </div>

                  {/* Mobile Frame Simulator Toggle */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-[#2F3A45] dark:text-slate-100 flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-[#7FAF8E]" />
                        <span>Android Phone Frame Simulator</span>
                      </p>
                      <p className="text-[11px] text-[#9CA3AF] font-medium mt-0.5">
                        Preview app inside a realistic Android device screen frame
                      </p>
                    </div>
                    <button
                      onClick={onToggleMobileFrame}
                      className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                        isMobileFrame
                          ? 'bg-[#7FAF8E] text-white shadow-xs'
                          : 'bg-slate-200 dark:bg-white/10 text-[#2F3A45] dark:text-slate-200 hover:bg-slate-300'
                      }`}
                    >
                      {isMobileFrame ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: ANDROID STUDIO & MOBILE */}
              {activeTab === 'android' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-3">
                    <div className="flex items-center justify-between font-black text-[#2F3A45] dark:text-slate-100">
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <Code2 className="w-4 h-4" />
                        <span>Android Studio Jetpack Compose Integration</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                        Ready
                      </span>
                    </div>
                    <p className="text-[#9CA3AF] font-medium leading-relaxed">
                      Export FocusFlow directly into Android Studio using Kotlin, WebView, and Jetpack Compose with custom background image wallpapers (`res/drawable/bg_wallpaper.jpg`).
                    </p>

                    <div className="pt-1 flex gap-2">
                      <button
                        onClick={() => {
                          onClose();
                          onOpenAndroidGuide();
                        }}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>Open Android Studio Guide</span>
                      </button>
                    </div>
                  </div>

                  {/* Android Manifest & Build Info */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-2">
                    <p className="font-extrabold text-[#2F3A45] dark:text-slate-100">
                      Build Details
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-[#9CA3AF]">
                      <div className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5">
                        <span className="block text-[#2F3A45] dark:text-slate-200 font-bold">Package Name</span>
                        <code>com.example.focusflow</code>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5">
                        <span className="block text-[#2F3A45] dark:text-slate-200 font-bold">Target Android Version</span>
                        <span>API 34 (Android 14)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DATA & BACKUP */}
              {activeTab === 'data' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-3">
                    <div className="flex items-center gap-2 font-extrabold text-[#2F3A45] dark:text-slate-100">
                      <Database className="w-4 h-4 text-[#7FAF8E]" />
                      <span>Data Backup & Cloud Export</span>
                    </div>
                    <p className="text-[#9CA3AF] font-medium leading-relaxed">
                      Export your habits, calendar events, focus sessions, and wallpapers to a JSON backup file or restore previously saved data.
                    </p>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenExportSync();
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#7FAF8E] hover:bg-[#639272] text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      <span>Open Export & Sync Hub</span>
                    </button>
                  </div>

                  {/* Reset App Data */}
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 space-y-2">
                    <div className="flex items-center gap-2 font-extrabold text-red-600 dark:text-red-400">
                      <Trash2 className="w-4 h-4" />
                      <span>Reset Application Cache</span>
                    </div>
                    <p className="text-[#9CA3AF] font-medium">
                      Resets events and habits back to default demo state.
                    </p>
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs cursor-pointer flex items-center gap-1.5"
                    >
                      {resetConfirmed ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Data Reset Successfully!</span>
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-4 h-4" />
                          <span>Reset Demo Events</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: ALERTS & PREFERENCES */}
              {activeTab === 'preferences' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-3">
                    <div className="flex items-center gap-2 font-extrabold text-[#2F3A45] dark:text-slate-100">
                      <Bell className="w-4 h-4 text-[#7FAF8E]" />
                      <span>Notification Sound & Alarm Testing</span>
                    </div>
                    <p className="text-[#9CA3AF] font-medium leading-relaxed">
                      Test audio alarm notifications and focus session alerts to ensure web audio plays correctly on mobile and desktop.
                    </p>

                    {onTriggerTestAlarm && (
                      <button
                        onClick={onTriggerTestAlarm}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#2F3A45] dark:bg-white text-white dark:text-[#2F3A45] font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Trigger Test Alarm & Sound</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs shrink-0">
              <span className="text-[11px] text-[#9CA3AF] font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#7FAF8E]" />
                <span>All preferences saved locally in browser</span>
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#2F3A45] dark:bg-white text-white dark:text-[#2F3A45] font-extrabold text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
