import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  Download, 
  CheckCircle2, 
  X, 
  ExternalLink, 
  Zap, 
  Share2, 
  MoreVertical, 
  PlusSquare, 
  Sparkles,
  ShieldCheck,
  HardDrive,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AndroidDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidDownloadModal: React.FC<AndroidDownloadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<'pwa' | 'apk_guide' | 'package'>('pwa');
  const [isDownloadingBundle, setIsDownloadingBundle] = useState<boolean>(false);

  // Listen for native PWA beforeinstallprompt event on Android
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback to step guide if browser didn't emit beforeinstallprompt yet
      setActiveStep('apk_guide');
    }
  };

  const handleDownloadAppBundle = () => {
    setIsDownloadingBundle(true);
    setTimeout(() => {
      // Trigger download of webapp json package & manifest bundle
      const bundleData = {
        name: "FocusFlow Android App",
        version: "2.4.0",
        pwa_url: window.location.href,
        manifest: "/manifest.json",
        created_at: new Date().toISOString(),
        description: "FocusFlow AI Productivity & Focus Assistant for Android"
      };
      const blob = new Blob([JSON.stringify(bundleData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'FocusFlow-Android-AppConfig.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsDownloadingBundle(false);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white dark:bg-[#23252A] amoled:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-auto p-5 sm:p-6 space-y-6"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#7FAF8E] text-white flex items-center justify-center font-bold shadow-md shadow-[#7FAF8E]/20">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-[#2F3A45] dark:text-white tracking-tight">
                      Install FocusFlow on Android
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Native App
                    </span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] font-medium">
                    Add to Android Home Screen, App Drawer & offline access
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

            {/* Quick Tab Switcher */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 text-xs font-extrabold">
              <button
                onClick={() => setActiveStep('pwa')}
                className={`py-2 px-3 rounded-xl transition-all cursor-pointer ${
                  activeStep === 'pwa'
                    ? 'bg-white dark:bg-[#2B2C31] text-[#7FAF8E] dark:text-[#7FAF8E] shadow-xs'
                    : 'text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-slate-200'
                }`}
              >
                1-Click Install
              </button>
              <button
                onClick={() => setActiveStep('apk_guide')}
                className={`py-2 px-3 rounded-xl transition-all cursor-pointer ${
                  activeStep === 'apk_guide'
                    ? 'bg-white dark:bg-[#2B2C31] text-[#7FAF8E] dark:text-[#7FAF8E] shadow-xs'
                    : 'text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-slate-200'
                }`}
              >
                Chrome Guide
              </button>
              <button
                onClick={() => setActiveStep('package')}
                className={`py-2 px-3 rounded-xl transition-all cursor-pointer ${
                  activeStep === 'package'
                    ? 'bg-white dark:bg-[#2B2C31] text-[#7FAF8E] dark:text-[#7FAF8E] shadow-xs'
                    : 'text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-slate-200'
                }`}
              >
                App Package
              </button>
            </div>

            {/* TAB 1: 1-CLICK PWA INSTALL */}
            {activeStep === 'pwa' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#7FAF8E]/10 border border-[#7FAF8E]/30 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#7FAF8E] text-white flex items-center justify-center mx-auto shadow-md">
                    <Zap className="w-6 h-6 fill-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#2F3A45] dark:text-white">
                      Instant Android Home Screen Installation
                    </h3>
                    <p className="text-xs text-[#9CA3AF] font-medium mt-1">
                      FocusFlow uses WebAPK technology to run natively on your Android device with zero app store delays.
                    </p>
                  </div>

                  {isInstalled ? (
                    <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>FocusFlow is installed on your Android device!</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleNativeInstall}
                      className="w-full py-3 px-4 rounded-2xl bg-[#7FAF8E] hover:bg-[#639272] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#7FAF8E]/30 active:scale-95 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{deferredPrompt ? 'Tap to Install FocusFlow App' : 'Add FocusFlow to Home Screen'}</span>
                    </button>
                  )}
                </div>

                {/* Feature Highlights Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#2F3A45] dark:text-slate-200">
                      <ShieldCheck className="w-4 h-4 text-[#7FAF8E]" />
                      <span>Offline Ready</span>
                    </div>
                    <p className="text-[11px] text-[#9CA3AF] font-medium">Works seamlessly without internet access</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#2F3A45] dark:text-slate-200">
                      <Layers className="w-4 h-4 text-[#7FAF8E]" />
                      <span>Full Screen</span>
                    </div>
                    <p className="text-[11px] text-[#9CA3AF] font-medium">Hides browser bar for immersive focus</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MANUAL CHROME STEP-BY-STEP */}
            {activeStep === 'apk_guide' && (
              <div className="space-y-4">
                <div className="text-xs text-[#2F3A45] dark:text-slate-200 font-bold">
                  Follow these 3 easy steps in Chrome on your Android phone:
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#7FAF8E] text-white shrink-0 font-extrabold text-xs flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <p className="font-extrabold text-[#2F3A45] dark:text-slate-100 flex items-center gap-1">
                        Tap Chrome Menu <MoreVertical className="w-3.5 h-3.5 text-[#7FAF8E]" />
                      </p>
                      <p className="text-[11px] text-[#9CA3AF] font-medium">
                        Open the three-dots menu in the top right corner of Chrome.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#7FAF8E] text-white shrink-0 font-extrabold text-xs flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <p className="font-extrabold text-[#2F3A45] dark:text-slate-100 flex items-center gap-1">
                        Select "Add to Home screen" <PlusSquare className="w-3.5 h-3.5 text-[#7FAF8E]" />
                      </p>
                      <p className="text-[11px] text-[#9CA3AF] font-medium">
                        Or select "Install app" if prompted by Chrome.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#7FAF8E] text-white shrink-0 font-extrabold text-xs flex items-center justify-center">
                      3
                    </div>
                    <div>
                      <p className="font-extrabold text-[#2F3A45] dark:text-slate-100 flex items-center gap-1">
                        Confirm Installation <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      </p>
                      <p className="text-[11px] text-[#9CA3AF] font-medium">
                        FocusFlow will appear directly in your Android phone home screen & app drawer!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: STANDALONE APP BUNDLE CONFIG */}
            {activeStep === 'package' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#2F3A45] dark:text-slate-100">
                    <HardDrive className="w-4 h-4 text-[#7FAF8E]" />
                    <span>Android Manifest & Configuration Bundle</span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] font-medium leading-relaxed">
                    Download the official FocusFlow WebAPK configuration file to build, bundle, or sideload onto Android development devices or Bubblewrap CLI tools.
                  </p>

                  <button
                    onClick={handleDownloadAppBundle}
                    disabled={isDownloadingBundle}
                    className="w-full py-2.5 px-4 rounded-2xl bg-[#2F3A45] dark:bg-white text-white dark:text-[#2F3A45] font-extrabold text-xs flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isDownloadingBundle ? 'Generating Package...' : 'Download Android App Config'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Footer Action */}
            <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#9CA3AF] font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#7FAF8E]" />
                <span>Optimized for Android 8.0+ & Chrome</span>
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-[#2F3A45] dark:text-slate-200 font-bold hover:bg-slate-200 transition-colors cursor-pointer"
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
