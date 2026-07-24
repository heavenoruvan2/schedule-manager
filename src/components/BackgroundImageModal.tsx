import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Image as ImageIcon, 
  X, 
  Check, 
  Sparkles, 
  Sliders, 
  Upload, 
  Trash2, 
  Eye, 
  Layers, 
  Smartphone,
  Info
} from 'lucide-react';

export interface BackgroundConfig {
  enabled: boolean;
  imageUrl: string;
  opacity: number; // 0.1 to 1.0
  blur: number; // 0 to 20
  overlayDim: number; // 0 to 0.8
  presetName: string;
}

export const ZEN_PRESETS = [
  {
    id: 'misty_forest',
    name: 'Misty Pine Forest',
    url: 'https://images.unsplash.com/photo-1511497584788-876761c11969?auto=format&fit=crop&w=1920&q=80',
    category: 'Nature',
  },
  {
    id: 'zen_mountains',
    name: 'Minimal Mountains',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
    category: 'Landscape',
  },
  {
    id: 'calm_sunset',
    name: 'Sunset Zen Lake',
    url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1920&q=80',
    category: 'Atmosphere',
  },
  {
    id: 'cosmic_night',
    name: 'Starry Cosmic Sky',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
    category: 'Dark',
  },
  {
    id: 'soft_waves',
    name: 'Soft Zen Gradient',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1920&q=80',
    category: 'Minimal',
  },
  {
    id: 'bamboo_grove',
    name: 'Bamboo Sanctuary',
    url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1920&q=80',
    category: 'Nature',
  },
];

interface BackgroundImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BackgroundConfig;
  onChangeConfig: (newConfig: BackgroundConfig) => void;
  onOpenAndroidGuide?: () => void;
}

export const BackgroundImageModal: React.FC<BackgroundImageModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
  onOpenAndroidGuide,
}) => {
  const [customUrl, setCustomUrl] = useState('');
  const [urlError, setUrlError] = useState(false);

  const handleSelectPreset = (preset: typeof ZEN_PRESETS[0]) => {
    onChangeConfig({
      ...config,
      enabled: true,
      imageUrl: preset.url,
      presetName: preset.name,
    });
  };

  const handleApplyCustomUrl = () => {
    if (!customUrl.trim()) return;
    try {
      new URL(customUrl);
      setUrlError(false);
      onChangeConfig({
        ...config,
        enabled: true,
        imageUrl: customUrl.trim(),
        presetName: 'Custom URL Wallpaper',
      });
      setCustomUrl('');
    } catch (e) {
      setUrlError(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChangeConfig({
            ...config,
            enabled: true,
            imageUrl: event.target.result as string,
            presetName: `Custom (${file.name})`,
          });
        }
      };
      reader.readAsDataURL(file);
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
            className="bg-white dark:bg-[#23252A] amoled:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden my-auto p-5 sm:p-6 space-y-5"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#7FAF8E] text-white flex items-center justify-center font-bold shadow-md shadow-[#7FAF8E]/20">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-[#2F3A45] dark:text-white tracking-tight">
                      Background Image Wallpaper
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#7FAF8E]/15 text-[#639272] dark:text-[#7FAF8E]">
                      Custom Theme
                    </span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] font-medium">
                    Customize background wallpaper, opacity, blur & Android Studio layout
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

            {/* Toggle Enable Background Image */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${config.enabled ? 'bg-[#7FAF8E] text-white' : 'bg-slate-200 dark:bg-white/10 text-[#9CA3AF]'}`}>
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#2F3A45] dark:text-slate-100">
                    Enable Background Image
                  </p>
                  <p className="text-[11px] text-[#9CA3AF] font-medium">
                    {config.enabled ? `Active: ${config.presetName}` : 'Currently disabled (Solid theme color)'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onChangeConfig({ ...config, enabled: !config.enabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  config.enabled ? 'bg-[#7FAF8E]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Active Wallpaper Preview & Sliders */}
            {config.enabled && (
              <div className="space-y-4">
                {/* Visual Wallpaper Card Preview */}
                <div className="relative h-28 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-inner group">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                    style={{
                      backgroundImage: `url("${config.imageUrl}")`,
                      opacity: config.opacity,
                      filter: `blur(${config.blur}px)`,
                    }}
                  />
                  <div
                    className="absolute inset-0 bg-black transition-opacity"
                    style={{ opacity: config.overlayDim }}
                  />
                  <div className="relative z-10 h-full p-3 flex flex-col justify-between text-white drop-shadow-md">
                    <div className="flex items-center justify-between text-[11px] font-extrabold">
                      <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md">
                        Preview: {config.presetName}
                      </span>
                      <button
                        onClick={() => onChangeConfig({ ...config, enabled: false })}
                        className="px-2 py-0.5 rounded-full bg-red-500/80 hover:bg-red-600 text-white cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                    <p className="text-xs font-bold text-white/90">
                      Sample text rendered over custom background wallpaper
                    </p>
                  </div>
                </div>

                {/* Adjustments: Opacity, Blur, Overlay Dim */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-3 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#2F3A45] dark:text-slate-200">
                    <Sliders className="w-3.5 h-3.5 text-[#7FAF8E]" />
                    <span>Wallpaper Appearance Controls</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Opacity Slider */}
                    <div>
                      <div className="flex justify-between text-[11px] font-medium text-[#9CA3AF] mb-1">
                        <span>Opacity</span>
                        <span className="font-bold text-[#2F3A45] dark:text-slate-200">{Math.round(config.opacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={config.opacity}
                        onChange={(e) => onChangeConfig({ ...config, opacity: parseFloat(e.target.value) })}
                        className="w-full accent-[#7FAF8E] cursor-pointer"
                      />
                    </div>

                    {/* Blur Slider */}
                    <div>
                      <div className="flex justify-between text-[11px] font-medium text-[#9CA3AF] mb-1">
                        <span>Soft Blur</span>
                        <span className="font-bold text-[#2F3A45] dark:text-slate-200">{config.blur}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        step="1"
                        value={config.blur}
                        onChange={(e) => onChangeConfig({ ...config, blur: parseInt(e.target.value) })}
                        className="w-full accent-[#7FAF8E] cursor-pointer"
                      />
                    </div>

                    {/* Overlay Dim Slider */}
                    <div>
                      <div className="flex justify-between text-[11px] font-medium text-[#9CA3AF] mb-1">
                        <span>Dark Dimming</span>
                        <span className="font-bold text-[#2F3A45] dark:text-slate-200">{Math.round(config.overlayDim * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="0.8"
                        step="0.05"
                        value={config.overlayDim}
                        onChange={(e) => onChangeConfig({ ...config, overlayDim: parseFloat(e.target.value) })}
                        className="w-full accent-[#7FAF8E] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Presets Gallery */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-[#2F3A45] dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#7FAF8E]" />
                  <span>Curated Zen Wallpapers</span>
                </span>
                <span className="text-[10px] text-[#9CA3AF]">Tap to apply</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ZEN_PRESETS.map((preset) => {
                  const isSelected = config.enabled && config.imageUrl === preset.url;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`group relative h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#7FAF8E] ring-2 ring-[#7FAF8E]/30 scale-[0.98]'
                          : 'border-transparent hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                        style={{ backgroundImage: `url("${preset.url}")` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-1.5 left-2 right-2 text-left flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-black text-white truncate drop-shadow-xs">
                            {preset.name}
                          </p>
                          <p className="text-[9px] text-slate-300 font-medium">
                            {preset.category}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[#7FAF8E] text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom URL or Local File Upload */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-2 text-xs">
              <span className="font-extrabold text-[#2F3A45] dark:text-slate-200 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-[#7FAF8E]" />
                <span>Custom Image URL or File Upload</span>
              </span>

              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/wallpaper.jpg"
                  value={customUrl}
                  onChange={(e) => {
                    setCustomUrl(e.target.value);
                    setUrlError(false);
                  }}
                  className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-[#1E1F22] border border-slate-200 dark:border-white/10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#7FAF8E]"
                />
                <button
                  onClick={handleApplyCustomUrl}
                  className="px-3 py-2 rounded-xl bg-[#7FAF8E] hover:bg-[#639272] text-white font-extrabold text-xs cursor-pointer"
                >
                  Apply
                </button>
                <label className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-white/10 text-[#2F3A45] dark:text-slate-200 font-bold text-xs hover:bg-slate-300 cursor-pointer flex items-center gap-1 shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {urlError && (
                <p className="text-[10px] text-red-500 font-bold">Please enter a valid image URL (e.g. https://...)</p>
              )}
            </div>

            {/* Android Studio Banner Integration Prompt */}
            {onOpenAndroidGuide && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-bold text-[#2F3A45] dark:text-slate-200">
                    Want to implement background images in Android Studio?
                  </span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAndroidGuide();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] cursor-pointer shrink-0"
                >
                  Android Studio Guide
                </button>
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-[#9CA3AF] font-medium flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-[#7FAF8E]" />
                <span>Wallpaper persists in local browser storage</span>
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
