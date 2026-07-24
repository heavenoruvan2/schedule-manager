import React, { useState, useEffect } from 'react';
import { 
  CloudRain, 
  CloudLightning,
  Music,
  Trees, 
  Zap, 
  Waves, 
  Coffee, 
  Moon, 
  Flame,
  Radio,
  Volume2, 
  VolumeX, 
  Volume1, 
  Play, 
  Pause, 
  Headphones, 
  Sparkles,
  Sliders,
  Check,
  Plus,
  X,
  Layers
} from 'lucide-react';
import { focusAudio, SoundscapeType } from '../utils/audio';

export interface SoundscapeOption {
  id: SoundscapeType;
  title: string;
  description: string;
  badge: string;
  icon: React.ElementType;
  gradient: string;
  accentColor: string;
}

const SOUNDSCAPES: SoundscapeOption[] = [
  {
    id: 'lofi',
    title: 'Lofi Focus Beats',
    description: 'Chilled rhodes chords, vinyl crackle & soft lofi rhythm',
    badge: '🎵 Lofi Beats',
    icon: Music,
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    accentColor: '#E28771',
  },
  {
    id: 'thunderstorm',
    title: 'Thunderstorm',
    description: 'Heavy rainfall with periodic deep thunder rumbles & lightning strikes',
    badge: '⛈️ Thunder',
    icon: CloudLightning,
    gradient: 'from-purple-900/30 via-indigo-900/20 to-transparent',
    accentColor: '#A855F7',
  },
  {
    id: 'rain',
    title: 'Gentle Rain',
    description: 'Rhythmic rainfall and soft water drops for calm focus',
    badge: '🌧️ Rain',
    icon: CloudRain,
    gradient: 'from-blue-500/20 via-sky-500/10 to-transparent',
    accentColor: '#7FAF8E',
  },
  {
    id: 'binaural',
    title: 'Alpha Waves 10Hz',
    description: '432Hz stereo binaural frequencies for deep brainwave flow',
    badge: '🧠 Brain Sync',
    icon: Radio,
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    accentColor: '#10B981',
  },
  {
    id: 'campfire',
    title: 'Campfire Crackle',
    description: 'Warm crackling wood embers and snapping sparks',
    badge: '🔥 Warm',
    icon: Flame,
    gradient: 'from-red-500/20 via-orange-500/10 to-transparent',
    accentColor: '#F97316',
  },
  {
    id: 'forest',
    title: 'Pine Forest',
    description: 'Rustling leaves, gentle wind breezes, and acoustic woods',
    badge: '🌲 Woods',
    icon: Trees,
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    accentColor: '#639272',
  },
  {
    id: 'waves',
    title: 'Ocean Waves',
    description: 'Slow, soothing swell of ocean tides and coastal air',
    badge: '🌊 Waves',
    icon: Waves,
    gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    accentColor: '#A7C7E7',
  },
  {
    id: 'cafe',
    title: 'Warm Cafe',
    description: 'Cozy background murmur and warm coffeehouse ambiance',
    badge: '☕ Cafe',
    icon: Coffee,
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    accentColor: '#D97706',
  },
  {
    id: 'crickets',
    title: 'Night Crickets',
    description: 'Serene evening crickets under a quiet starlit sky',
    badge: '🌙 Night',
    icon: Moon,
    gradient: 'from-indigo-500/20 via-slate-500/10 to-transparent',
    accentColor: '#8C9EFF',
  },
  {
    id: 'white_noise',
    title: 'White Noise',
    description: 'Flat frequency spectrum to mask background chatter & office noise',
    badge: '⚡ Masking',
    icon: Zap,
    gradient: 'from-purple-500/20 via-indigo-500/10 to-transparent',
    accentColor: '#C8B6E2',
  },
];

const PRESET_MIXES = [
  {
    name: '☕ Cozy Rainy Lofi',
    desc: 'Lofi Beats + Thunderstorm + Gentle Rain',
    sounds: ['lofi', 'thunderstorm', 'rain'] as SoundscapeType[],
  },
  {
    name: '🧠 Deep Study Flow',
    desc: 'Alpha Waves + Gentle Rain + Pine Forest',
    sounds: ['binaural', 'rain', 'forest'] as SoundscapeType[],
  },
  {
    name: '🔥 Midnight Campfire',
    desc: 'Campfire Crackle + Night Crickets + Thunderstorm',
    sounds: ['campfire', 'crickets', 'thunderstorm'] as SoundscapeType[],
  },
  {
    name: '☕ Coffeehouse Sanctuary',
    desc: 'Warm Cafe + Lofi Beats + Gentle Rain',
    sounds: ['cafe', 'lofi', 'rain'] as SoundscapeType[],
  },
];

interface AmbientSoundscapePlayerProps {
  activeSound: SoundscapeType | 'none';
  onSoundChange: (sound: SoundscapeType | 'none') => void;
  isSessionRunning?: boolean;
}

export const AmbientSoundscapePlayer: React.FC<AmbientSoundscapePlayerProps> = ({
  activeSound,
  onSoundChange,
  isSessionRunning = false,
}) => {
  const [activeSoundsMap, setActiveSoundsMap] = useState<Record<string, number>>({
    lofi: 0.7,
    rain: 0.6,
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [masterVolume, setMasterVolume] = useState<number>(60);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [autoSyncSession, setAutoSyncSession] = useState<boolean>(true);
  const [showMixer, setShowMixer] = useState<boolean>(true);

  // Sync state with audio engine
  useEffect(() => {
    if (isPlaying) {
      focusAudio.setVolume(isMuted ? 0 : masterVolume / 100);
      Object.entries(activeSoundsMap).forEach(([snd, vol]) => {
        focusAudio.playSound(snd as SoundscapeType, Number(vol));
      });
    } else {
      focusAudio.stopAmbient();
    }
  }, [isPlaying, activeSoundsMap, masterVolume, isMuted]);

  // Sync with session start
  useEffect(() => {
    if (isSessionRunning && autoSyncSession && !isPlaying) {
      setIsPlaying(true);
    }
  }, [isSessionRunning, autoSyncSession]);

  const toggleSound = (soundId: SoundscapeType) => {
    setActiveSoundsMap((prev) => {
      const copy = { ...prev };
      if (copy[soundId] !== undefined) {
        delete copy[soundId];
        focusAudio.stopSound(soundId);
      } else {
        copy[soundId] = 0.7;
        if (isPlaying) {
          focusAudio.playSound(soundId, 0.7);
        }
      }
      return copy;
    });
    if (!isPlaying) {
      setIsPlaying(true);
    }
    onSoundChange(soundId);
  };

  const handleChannelVolumeChange = (soundId: SoundscapeType, vol: number) => {
    const normVol = vol / 100;
    setActiveSoundsMap((prev) => ({
      ...prev,
      [soundId]: normVol,
    }));
    focusAudio.setChannelVolume(soundId, normVol);
  };

  const handleApplyPreset = (presetSounds: SoundscapeType[]) => {
    focusAudio.stopAmbient();
    const newMap: Record<string, number> = {};
    presetSounds.forEach((s) => {
      newMap[s] = 0.7;
    });
    setActiveSoundsMap(newMap);
    setIsPlaying(true);
    if (presetSounds.length > 0) {
      onSoundChange(presetSounds[0]);
    }
  };

  const handleMasterTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      focusAudio.stopAmbient();
    } else {
      if (Object.keys(activeSoundsMap).length === 0) {
        setActiveSoundsMap({ lofi: 0.7, rain: 0.6 });
      }
      setIsPlaying(true);
    }
  };

  const handleMasterVolumeChange = (newVol: number) => {
    setMasterVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
    focusAudio.setVolume(isMuted ? 0 : newVol / 100);
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    focusAudio.setVolume(nextMute ? 0 : masterVolume / 100);
  };

  const activeSoundKeys = Object.keys(activeSoundsMap) as SoundscapeType[];

  return (
    <div className="bento-card p-[21px] space-y-[21px] relative overflow-hidden border border-[#7FAF8E]/30 bg-gradient-to-br from-white via-slate-50/50 to-slate-100/50 dark:from-[#23252A] dark:via-[#1E1F22] dark:to-[#2B2C31]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#7FAF8E]/15 text-[#7FAF8E] dark:text-[#7FAF8E] flex items-center justify-center font-bold shadow-xs">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-[#2F3A45] dark:text-white tracking-tight">
                Multi-Layer Soundscape Studio
              </h2>
              {isPlaying && activeSoundKeys.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#7FAF8E]/20 text-[#639272] dark:text-[#7FAF8E] text-[10px] font-extrabold animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7FAF8E]" />
                  Mixing {activeSoundKeys.length} Sounds
                </span>
              )}
            </div>
            <p className="text-xs text-[#9CA3AF] font-medium">
              Combine Lofi Beats, Thunderstorms, Rain & White Noise together with custom volume controls
            </p>
          </div>
        </div>

        {/* Master Controller */}
        <div className="flex items-center gap-3 bg-white dark:bg-white/5 p-2 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs">
          <button
            type="button"
            onClick={handleMasterTogglePlay}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
              isPlaying
                ? 'bg-[#7FAF8E] text-white hover:bg-[#639272]'
                : 'bg-slate-100 dark:bg-white/10 text-[#2F3A45] dark:text-slate-200 hover:bg-slate-200'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-white" />
                <span>Pause Mixer</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Mixed Ambient</span>
              </>
            )}
          </button>

          {/* Master Volume Slider */}
          <div className="flex items-center gap-2 px-2">
            <button
              type="button"
              onClick={toggleMute}
              className="text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-slate-200 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || masterVolume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : masterVolume < 50 ? (
                <Volume1 className="w-4 h-4 text-[#7FAF8E]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#7FAF8E]" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : masterVolume}
              onChange={(e) => handleMasterVolumeChange(Number(e.target.value))}
              className="w-20 sm:w-24 h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#7FAF8E]"
            />
            <span className="text-[10px] font-mono font-bold text-[#9CA3AF] w-7">
              {isMuted ? '0%' : `${masterVolume}%`}
            </span>
          </div>
        </div>
      </div>

      {/* Preset Mix Shortcuts */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-extrabold text-[#2F3A45] dark:text-slate-200">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Preset Sound Mixes</span>
          </span>
          <span className="text-[11px] text-[#9CA3AF] font-medium">Click to instantly load combination</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESET_MIXES.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleApplyPreset(preset.sounds)}
              className="p-3 rounded-2xl bg-white dark:bg-[#2B2C31] border border-slate-200/80 dark:border-white/10 hover:border-[#7FAF8E]/60 text-left transition-all hover:shadow-sm cursor-pointer group"
            >
              <div className="text-xs font-extrabold text-[#2F3A45] dark:text-white group-hover:text-[#639272] dark:group-hover:text-[#7FAF8E] transition-colors">
                {preset.name}
              </div>
              <div className="text-[10px] text-[#9CA3AF] font-medium mt-0.5 truncate">
                {preset.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Sound Layers Volume Mixer Console */}
      {activeSoundKeys.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#7FAF8E]/10 border border-[#7FAF8E]/30 space-y-3">
          <div className="flex items-center justify-between border-b border-[#7FAF8E]/20 pb-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#2F3A45] dark:text-slate-100">
              <Layers className="w-4 h-4 text-[#7FAF8E]" />
              <span>Active Layer Volume Console ({activeSoundKeys.length} Active)</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setActiveSoundsMap({});
                focusAudio.stopAmbient();
              }}
              className="text-[11px] font-bold text-slate-500 hover:text-rose-500 transition-colors px-2 py-0.5 rounded-md hover:bg-rose-500/10 cursor-pointer"
            >
              Clear All Layers
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeSoundKeys.map((sndId) => {
              const option = SOUNDSCAPES.find((s) => s.id === sndId);
              if (!option) return null;
              const Icon = option.icon;
              const currentVol = Math.round((activeSoundsMap[sndId] ?? 0.7) * 100);

              return (
                <div
                  key={sndId}
                  className="p-3 rounded-xl bg-white/80 dark:bg-[#2B2C31] border border-[#7FAF8E]/20 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#7FAF8E]/20 text-[#639272] dark:text-[#7FAF8E] flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-[#2F3A45] dark:text-white truncate">
                      {option.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={currentVol}
                      onChange={(e) => handleChannelVolumeChange(sndId, Number(e.target.value))}
                      className="w-16 sm:w-20 h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#7FAF8E]"
                    />
                    <span className="text-[10px] font-mono font-bold text-[#9CA3AF] w-6">
                      {currentVol}%
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleSound(sndId)}
                      className="p-1 rounded-md text-[#9CA3AF] hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                      title="Remove sound from mix"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Soundscape Options Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {SOUNDSCAPES.map((s) => {
          const Icon = s.icon;
          const isSelected = activeSoundsMap[s.id] !== undefined;
          const isSelectedAndPlaying = isSelected && isPlaying;

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => toggleSound(s.id)}
              className={`p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer relative overflow-hidden group border ${
                isSelectedAndPlaying
                  ? 'bg-white dark:bg-[#2B2C31] border-[#7FAF8E] shadow-md ring-2 ring-[#7FAF8E]/30 scale-[1.01]'
                  : isSelected
                  ? 'bg-white dark:bg-[#2B2C31] border-[#7FAF8E]/60 shadow-sm'
                  : 'bg-white/60 dark:bg-white/5 border-slate-200/80 dark:border-white/5 hover:border-[#7FAF8E]/40 hover:bg-white dark:hover:bg-white/10'
              }`}
            >
              {/* Overlay Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />

              <div className="flex items-start justify-between gap-2 mb-3 relative z-10">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold transition-all ${
                    isSelected
                      ? 'bg-[#7FAF8E] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 group-hover:bg-[#7FAF8E]/20 group-hover:text-[#7FAF8E]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border transition-colors ${
                    isSelected
                      ? 'bg-[#7FAF8E]/20 text-[#639272] dark:text-[#7FAF8E] border-[#7FAF8E]/30'
                      : 'bg-slate-100 dark:bg-white/5 text-[#9CA3AF] border-slate-200 dark:border-white/10'
                  }`}
                >
                  {s.badge}
                </span>
              </div>

              <div className="relative z-10 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-[#2F3A45] dark:text-white">
                    {s.title}
                  </h3>
                  {isSelectedAndPlaying ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#7FAF8E] animate-ping" />
                  ) : isSelected ? (
                    <Check className="w-3.5 h-3.5 text-[#7FAF8E]" />
                  ) : (
                    <Plus className="w-3.5 h-3.5 text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
                <p className="text-[11px] text-[#9CA3AF] font-medium leading-relaxed line-clamp-2">
                  {s.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Option Bar / Sync Settings */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200/60 dark:border-white/5 text-xs">
        <label className="flex items-center gap-2 cursor-pointer select-none text-[#2F3A45] dark:text-slate-300 font-semibold">
          <input
            type="checkbox"
            checked={autoSyncSession}
            onChange={(e) => setAutoSyncSession(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-[#7FAF8E] focus:ring-[#7FAF8E] accent-[#7FAF8E]"
          />
          <span>Auto-start soundscape mix when focus timer begins</span>
        </label>

        <div className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF] font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#C8B6E2]" />
          <span>Real-time Web Audio API multi-channel audio synthesis</span>
        </div>
      </div>
    </div>
  );
};
