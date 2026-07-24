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
  ArrowRight,
  Code2,
  Copy,
  Check,
  Image as ImageIcon,
  FolderArchive
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
  const [activeStep, setActiveStep] = useState<'pwa' | 'apk_guide' | 'android_studio' | 'package'>('pwa');
  const [isDownloadingBundle, setIsDownloadingBundle] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

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
      setActiveStep('apk_guide');
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const handleDownloadAndroidStudioBundle = () => {
    setIsDownloadingBundle(true);
    setTimeout(() => {
      const mainActivityCode = `package com.example.focusflow

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.WebSettings
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.viewinterop.AndroidView

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            FocusFlowAppWithBackgroundImage()
        }
    }
}

@Composable
fun FocusFlowAppWithBackgroundImage() {
    Box(modifier = Modifier.fillMaxSize()) {
        // 1. Background Wallpaper Image
        Image(
            painter = painterResource(id = R.drawable.app_background),
            contentDescription = "Background Wallpaper",
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )

        // 2. Translucent WebView Layer loading FocusFlow
        AndroidView(
            factory = { context ->
                WebView(context).apply {
                    webViewClient = WebViewClient()
                    settings.javaScriptEnabled = true
                    settings.domStorageEnabled = true
                    settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                    setBackgroundColor(0) // Transparent background
                    loadUrl("${window.location.href}")
                }
            },
            modifier = Modifier.fillMaxSize()
        )
    }
}`;

      const manifestCode = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.focusflow">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="FocusFlow"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>`;

      const projectConfig = {
        projectName: "FocusFlow-AndroidStudio",
        version: "2.4.0",
        url: window.location.href,
        files: {
          "app/src/main/java/com/example/focusflow/MainActivity.kt": mainActivityCode,
          "app/src/main/AndroidManifest.xml": manifestCode,
          "app/src/main/res/drawable/app_background.jpg": "Place your background wallpaper image here",
          "README.md": "# FocusFlow Android Studio Project Setup\n\n1. Open Android Studio.\n2. Choose 'File -> New -> Import Project'.\n3. Copy MainActivity.kt and AndroidManifest.xml into your project.\n4. Add your custom background image as 'app_background.jpg' inside app/src/main/res/drawable/\n5. Build and Run on Android Device or Emulator!"
        }
      };

      const blob = new Blob([JSON.stringify(projectConfig, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'FocusFlow-AndroidStudio-ProjectBundle.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsDownloadingBundle(false);
    }, 1000);
  };

  const sampleKotlinCode = `// MainActivity.kt - Android Studio Jetpack Compose
package com.example.focusflow

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.viewinterop.AndroidView

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            Box(modifier = Modifier.fillMaxSize()) {
                // Background Image in res/drawable/bg_wallpaper.jpg
                Image(
                    painter = painterResource(id = R.drawable.bg_wallpaper),
                    contentDescription = "App Background",
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )

                // Translucent WebView overlay
                AndroidView(
                    factory = { ctx ->
                        WebView(ctx).apply {
                            webViewClient = WebViewClient()
                            settings.javaScriptEnabled = true
                            settings.domStorageEnabled = true
                            setBackgroundColor(0) // Transparent
                            loadUrl("${window.location.href}")
                        }
                    },
                    modifier = Modifier.fillMaxSize()
                )
            }
        }
    }
}`;

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
            className="bg-white dark:bg-[#23252A] amoled:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden my-auto p-5 sm:p-6 space-y-5 max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#7FAF8E] text-white flex items-center justify-center font-bold shadow-md shadow-[#7FAF8E]/20">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-[#2F3A45] dark:text-white tracking-tight">
                      Android Studio & App Setup
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Kotlin & Compose
                    </span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] font-medium">
                    Build with Android Studio, background images, PWA or WebAPK
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 text-xs font-extrabold shrink-0">
              <button
                onClick={() => setActiveStep('pwa')}
                className={`py-2 px-2 rounded-xl transition-all cursor-pointer text-center ${
                  activeStep === 'pwa'
                    ? 'bg-white dark:bg-[#2B2C31] text-[#7FAF8E] dark:text-[#7FAF8E] shadow-xs'
                    : 'text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-slate-200'
                }`}
              >
                1-Click Install
              </button>
              <button
                onClick={() => setActiveStep('android_studio')}
                className={`py-2 px-2 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                  activeStep === 'android_studio'
                    ? 'bg-white dark:bg-[#2B2C31] text-[#7FAF8E] dark:text-[#7FAF8E] shadow-xs'
                    : 'text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Android Studio</span>
              </button>
              <button
                onClick={() => setActiveStep('apk_guide')}
                className={`py-2 px-2 rounded-xl transition-all cursor-pointer text-center ${
                  activeStep === 'apk_guide'
                    ? 'bg-white dark:bg-[#2B2C31] text-[#7FAF8E] dark:text-[#7FAF8E] shadow-xs'
                    : 'text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-slate-200'
                }`}
              >
                Chrome Guide
              </button>
              <button
                onClick={() => setActiveStep('package')}
                className={`py-2 px-2 rounded-xl transition-all cursor-pointer text-center ${
                  activeStep === 'package'
                    ? 'bg-white dark:bg-[#2B2C31] text-[#7FAF8E] dark:text-[#7FAF8E] shadow-xs'
                    : 'text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-slate-200'
                }`}
              >
                Config Package
              </button>
            </div>

            {/* TAB CONTENT AREA */}
            <div className="overflow-y-auto space-y-4 pr-1 scrollbar-thin flex-1">
              {/* TAB: ANDROID STUDIO SETUP & BACKGROUND IMAGE */}
              {activeStep === 'android_studio' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-2">
                    <div className="flex items-center justify-between font-extrabold text-[#2F3A45] dark:text-slate-100">
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <Code2 className="w-4 h-4" />
                        <span>Android Studio Project Setup with Background Image</span>
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                        Jetpack Compose
                      </span>
                    </div>
                    <p className="text-[#9CA3AF] font-medium leading-relaxed">
                      Build a native Android app in Android Studio using Kotlin, Jetpack Compose, and custom background images (`res/drawable/bg_wallpaper.jpg`).
                    </p>
                  </div>

                  {/* Step 1: Add Image to res/drawable */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-extrabold text-[#2F3A45] dark:text-slate-100">
                      <div className="w-5 h-5 rounded-full bg-[#7FAF8E] text-white flex items-center justify-center text-[11px]">
                        1
                      </div>
                      <ImageIcon className="w-4 h-4 text-[#7FAF8E]" />
                      <span>Add Background Image in Android Studio</span>
                    </div>
                    <p className="text-[#9CA3AF] font-medium leading-relaxed pl-7">
                      In Android Studio, copy your background image file into the directory:
                      <code className="block mt-1 p-1.5 rounded-lg bg-slate-200 dark:bg-white/10 font-mono text-[11px] text-[#2F3A45] dark:text-emerald-300">
                        app/src/main/res/drawable/bg_wallpaper.jpg
                      </code>
                    </p>
                  </div>

                  {/* Step 2: MainActivity.kt Code Snippet */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-extrabold text-[#2F3A45] dark:text-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#7FAF8E] text-white flex items-center justify-center text-[11px]">
                          2
                        </div>
                        <span>MainActivity.kt (Kotlin & Compose)</span>
                      </div>
                      <button
                        onClick={() => handleCopyCode(sampleKotlinCode, 'kotlin')}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-[10px] font-bold hover:bg-slate-100 dark:hover:bg-white/15 cursor-pointer flex items-center gap-1"
                      >
                        {copiedSnippet === 'kotlin' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[10px] overflow-x-auto max-h-48 leading-relaxed scrollbar-thin">
                      {sampleKotlinCode}
                    </pre>
                  </div>

                  {/* Step 3: AndroidManifest.xml Code */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-extrabold text-[#2F3A45] dark:text-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#7FAF8E] text-white flex items-center justify-center text-[11px]">
                          3
                        </div>
                        <span>AndroidManifest.xml (Permissions)</span>
                      </div>
                      <button
                        onClick={() =>
                          handleCopyCode(
                            `<uses-permission android:name="android.permission.INTERNET" />\n<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />`,
                            'manifest'
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-[10px] font-bold hover:bg-slate-100 cursor-pointer flex items-center gap-1"
                      >
                        {copiedSnippet === 'manifest' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Permission</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-2.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[10px] overflow-x-auto">
                      {`<uses-permission android:name="android.permission.INTERNET" />\n<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />`}
                    </pre>
                  </div>

                  {/* Download Project Bundle */}
                  <div className="p-4 rounded-2xl bg-[#7FAF8E]/10 border border-[#7FAF8E]/30 text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 font-black text-[#2F3A45] dark:text-white text-xs">
                      <FolderArchive className="w-4 h-4 text-[#7FAF8E]" />
                      <span>Download Android Studio Source Bundle</span>
                    </div>
                    <p className="text-[11px] text-[#9CA3AF] font-medium">
                      Downloads pre-configured Android Studio Kotlin files, Manifest, and Background layout instructions.
                    </p>
                    <button
                      onClick={handleDownloadAndroidStudioBundle}
                      disabled={isDownloadingBundle}
                      className="w-full py-2.5 px-4 rounded-2xl bg-[#7FAF8E] hover:bg-[#639272] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isDownloadingBundle ? 'Generating Source Files...' : 'Download Android Studio Source Package'}</span>
                    </button>
                  </div>
                </div>
              )}

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
                      onClick={handleDownloadAndroidStudioBundle}
                      disabled={isDownloadingBundle}
                      className="w-full py-2.5 px-4 rounded-2xl bg-[#2F3A45] dark:bg-white text-white dark:text-[#2F3A45] font-extrabold text-xs flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isDownloadingBundle ? 'Generating Package...' : 'Download Android App Config'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Action */}
            <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs shrink-0">
              <span className="text-[11px] text-[#9CA3AF] font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#7FAF8E]" />
                <span>Optimized for Android Studio & Android 8.0+</span>
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
