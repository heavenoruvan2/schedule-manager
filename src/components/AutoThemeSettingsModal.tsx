import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, 
  Moon, 
  Clock, 
  MapPin, 
  SlidersHorizontal, 
  Sparkles, 
  Check, 
  RotateCcw, 
  X, 
  Smartphone,
  Info,
  Palette,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { AutoThemeConfig, evaluateAutoTheme } from '../utils/autoTheme';
import { ThemeMode } from '../types';

interface AutoThemeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AutoThemeConfig;
  onChangeConfig: (newConfig: AutoThemeConfig) => void;
  currentActiveTheme: ThemeMode;
  onSetManualTheme: (theme: ThemeMode) => void;
  onClearOverride: () => void;
}

export const AutoThemeSettingsModal: React.FC<AutoThemeSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
  currentActiveTheme,
  onSetManualTheme,
  onClearOverride,
}) => {
  const [geoStatus, setGeoStatus] = useState<'idle' | 'locating' | 'success' | 'denied'>('idle');

  const evaluation = evaluateAutoTheme(config);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('denied');
      return;
    }
    setGeoStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChangeConfig({
          ...config,
          userCoords: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
        });
        setGeoStatus('success');
      },
      () => {
        setGeoStatus('denied');
      },
      { timeout: 8000 }
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg bg-white dark:bg-[#2B2C31] amoled:bg-[#121315] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#7FAF8E]/20 text-[#639272] dark:text-[#7FAF8E] flex items-center justify-center font-bold">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#2F3A45] dark:text-white">
                  Auto Theme & Lighting
                </h2>
                <p className="text-[11px] text-[#9CA3AF] font-medium">
                  Dynamic light/dark switching based on time & sun position
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-2xl text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5 overflow-y-auto">
            {/* Live Status Banner */}
            <div
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                evaluation.isDaylight
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-200'
                  : 'bg-indigo-950/40 border-indigo-500/20 text-indigo-200'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  evaluation.isDaylight ? 'bg-amber-500 text-white' : 'bg-indigo-600 text-white'
                }`}
              >
                {evaluation.isDaylight ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black uppercase tracking-wider">
                    {evaluation.isDaylight ? 'Daytime Active' : 'Nighttime Active'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20 dark:bg-black/30 backdrop-blur-xs">
                    Theme: {currentActiveTheme.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs font-semibold mt-0.5 opacity-90">{evaluation.reason}</p>
                <div className="flex items-center gap-1.5 text-[11px] font-medium mt-1.5 opacity-80">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Next transition: {evaluation.nextTransitionText}</span>
                </div>
              </div>
            </div>

            {/* Master Auto Toggle */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
              <div>
                <span className="text-sm font-extrabold text-[#2F3A45] dark:text-white block">
                  Automatic Theme Switching
                </span>
                <span className="text-xs text-[#9CA3AF] font-medium">
                  Automatically change theme without manual intervention
                </span>
              </div>
              <button
                onClick={() =>
                  onChangeConfig({
                    ...config,
                    autoEnabled: !config.autoEnabled,
                  })
                }
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 ${
                  config.autoEnabled ? 'bg-[#7FAF8E]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    config.autoEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Mode Selection */}
            {config.autoEnabled && (
              <div className="space-y-3">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#9CA3AF] block">
                  Switching Trigger Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    {
                      id: 'sunset',
                      title: 'Sunrise / Sunset',
                      desc: 'Calculated local sun position',
                      icon: Sun,
                    },
                    {
                      id: 'time',
                      title: 'Fixed Time',
                      desc: 'Custom schedule hours',
                      icon: Clock,
                    },
                    {
                      id: 'system',
                      title: 'OS Preference',
                      desc: 'Sync with phone/PC OS',
                      icon: Smartphone,
                    },
                  ].map((mode) => {
                    const Icon = mode.icon;
                    const isSelected = config.mode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() =>
                          onChangeConfig({
                            ...config,
                            mode: mode.id as any,
                          })
                        }
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[90px] ${
                          isSelected
                            ? 'bg-[#7FAF8E]/15 border-[#7FAF8E] text-[#639272] dark:text-[#7FAF8E] shadow-2xs'
                            : 'bg-slate-50/50 dark:bg-white/5 border-slate-200/60 dark:border-white/10 text-[#2F3A45] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <Icon className="w-4 h-4 text-[#7FAF8E]" />
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#7FAF8E]" />}
                        </div>
                        <div>
                          <p className="text-xs font-extrabold">{mode.title}</p>
                          <p className="text-[10px] text-[#9CA3AF] font-medium leading-tight mt-0.5">
                            {mode.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Sub-options based on mode */}
                {config.mode === 'sunset' && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-[#2F3A45] dark:text-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-[#7FAF8E]" />
                        <span>Geolocation Sun Calculation</span>
                      </div>
                      <button
                        onClick={handleDetectLocation}
                        disabled={geoStatus === 'locating'}
                        className="px-2.5 py-1 rounded-xl bg-[#7FAF8E]/20 text-[#639272] dark:text-[#7FAF8E] text-[11px] font-bold hover:bg-[#7FAF8E]/30 transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Compass className="w-3 h-3" />
                        <span>{geoStatus === 'locating' ? 'Locating...' : 'Update Location'}</span>
                      </button>
                    </div>
                    {config.userCoords ? (
                      <p className="text-[11px] text-[#7FAF8E] font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Using coordinates ({config.userCoords.latitude.toFixed(2)}°, {config.userCoords.longitude.toFixed(2)}°) • Sunrise: {evaluation.sunriseStr}, Sunset: {evaluation.sunsetStr}
                      </p>
                    ) : (
                      <p className="text-[11px] text-[#9CA3AF] font-medium">
                        Using estimated location ({evaluation.sunriseStr} sunrise, {evaluation.sunsetStr} sunset).
                      </p>
                    )}
                  </div>
                )}

                {config.mode === 'time' && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-extrabold text-[#2F3A45] dark:text-slate-300 block mb-1">
                          Day Start Hour
                        </label>
                        <select
                          value={config.dayStartHour}
                          onChange={(e) =>
                            onChangeConfig({
                              ...config,
                              dayStartHour: parseInt(e.target.value, 10),
                            })
                          }
                          className="w-full p-2 text-xs rounded-xl bg-white dark:bg-[#2B2C31] border border-slate-200 dark:border-white/10 font-bold text-[#2F3A45] dark:text-white"
                        >
                          {Array.from({ length: 12 }, (_, i) => i + 4).map((h) => (
                            <option key={h} value={h}>
                              {h === 12 ? '12:00 PM' : h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-extrabold text-[#2F3A45] dark:text-slate-300 block mb-1">
                          Night Start Hour
                        </label>
                        <select
                          value={config.nightStartHour}
                          onChange={(e) =>
                            onChangeConfig({
                              ...config,
                              nightStartHour: parseInt(e.target.value, 10),
                            })
                          }
                          className="w-full p-2 text-xs rounded-xl bg-white dark:bg-[#2B2C31] border border-slate-200 dark:border-white/10 font-bold text-[#2F3A45] dark:text-white"
                        >
                          {Array.from({ length: 12 }, (_, i) => i + 13).map((h) => (
                            <option key={h} value={h}>
                              {h === 24 ? '12:00 AM' : `${h - 12}:00 PM`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Amoled Night Toggle Option */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-[#C8B6E2]" />
                    <div>
                      <span className="text-xs font-bold text-[#2F3A45] dark:text-white block">
                        Use AMOLED Pure Black for Night Mode
                      </span>
                      <span className="text-[10px] text-[#9CA3AF] font-medium">
                        Deep OLED black canvas during nighttime hours
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.useAmoledForNight}
                    onChange={(e) =>
                      onChangeConfig({
                        ...config,
                        useAmoledForNight: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-[#7FAF8E] rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Manual Theme Override & Manual Selection */}
            <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#9CA3AF] block">
                    Manual Theme Override
                  </span>
                  <p className="text-[11px] text-[#9CA3AF] font-medium">
                    Pick a static theme to override auto-theming schedule
                  </p>
                </div>
                {config.manualOverrideTheme && (
                  <button
                    onClick={onClearOverride}
                    className="px-2.5 py-1 rounded-xl bg-[#7FAF8E]/20 text-[#639272] dark:text-[#7FAF8E] text-[11px] font-extrabold flex items-center gap-1 hover:bg-[#7FAF8E]/30 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Resume Auto Theme</span>
                  </button>
                )}
              </div>

              {config.manualOverrideTheme && (
                <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0 text-amber-500" />
                  <span>
                    Auto Theme is currently overridden by user preference ({config.manualOverrideTheme.toUpperCase()}).
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { mode: 'light', label: 'Warm Light', icon: Sun, color: 'text-amber-500' },
                  { mode: 'dark', label: 'Charcoal Dark', icon: Moon, color: 'text-[#A7C7E7]' },
                  { mode: 'amoled', label: 'AMOLED Black', icon: Moon, color: 'text-[#C8B6E2]' },
                  { mode: 'material-you', label: 'Sage Zen', icon: Palette, color: 'text-[#7FAF8E]' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = currentActiveTheme === item.mode;
                  return (
                    <button
                      key={item.mode}
                      onClick={() => onSetManualTheme(item.mode as ThemeMode)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#7FAF8E]/20 border-[#7FAF8E] text-[#639272] dark:text-[#7FAF8E] font-black shadow-2xs'
                          : 'bg-slate-50/50 dark:bg-white/5 border-slate-200/60 dark:border-white/10 text-[#2F3A45] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 font-bold'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${item.color}`} />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-[#7FAF8E] hover:bg-[#639272] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              Done & Save
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
