import React, { useState } from 'react';
import { 
  Smartphone, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Zap, 
  Code, 
  Download, 
  Copy, 
  Check, 
  Calendar as CalendarIcon,
  Flame,
  Layers,
  Sparkles
} from 'lucide-react';
import { EventItem } from '../types';
import { DynamicIcon } from './DynamicIcon';

interface WidgetsViewProps {
  events: EventItem[];
  onOpenQuickAdd: () => void;
  todayDateStr: string;
}

export const WidgetsView: React.FC<WidgetsViewProps> = ({
  events,
  onOpenQuickAdd,
  todayDateStr,
}) => {
  const [activeTab, setActiveTab] = useState<'widgets' | 'flutter_code' | 'kotlin_code' | 'readme'>('widgets');
  const [copiedCode, setCopiedCode] = useState(false);

  const todayEvents = events.filter((e) => e.date === todayDateStr);
  const nextTask = todayEvents.find((e) => !e.completed) || todayEvents[0];

  const flutterSourceCode = `// lib/widgets/focus_flow_home_widget.dart
import 'package:flutter/material.dart';
import 'package:home_widget/home_widget.dart';

class FocusFlowSmallWidget extends StatelessWidget {
  final String nextTaskTitle;
  final String nextTaskTime;

  const FocusFlowSmallWidget({
    Key? key,
    required this.nextTaskTitle,
    required this.nextTaskTime,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceVariant,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.bolt, color: Colors.indigo, size: 18),
              SizedBox(width: 6),
              Text("FocusFlow", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
            ],
          ),
          Spacer(),
          Text(nextTaskTitle, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          SizedBox(height: 4),
          Text(nextTaskTime, style: TextStyle(color: Colors.grey, fontSize: 11)),
        ],
      ),
    );
  }
}`;

  const kotlinComposeCode = `// android/app/src/main/java/com/focusflow/app/widget/FocusFlowWidget.kt
package com.focusflow.app.widget

import androidx.compose.runtime.Composable
import androidx.glance.GlanceModifier
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.layout.*
import androidx.glance.text.Text

class FocusFlowWidget : GlanceAppWidget() {
    @Composable
    override fun Content() {
        Column(
            modifier = GlanceModifier.fillMaxSize().padding(16.dp)
        ) {
            Text(text = "FocusFlow Daily Schedule")
            // Material You Dynamic Colors
        }
    }
}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bento-card p-6 bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 text-white border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white font-extrabold text-xs mb-2 border border-white/10">
            <Smartphone className="w-3.5 h-3.5 text-purple-300" />
            <span>Android Home Screen Widgets & Flutter/Kotlin Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Android Home Screen Widgets & Native Code</h1>
          <p className="text-xs sm:text-sm text-purple-200/80 mt-1 max-w-lg font-medium">
            Interactive Material You home screen widgets preview, plus ready-to-export Flutter & Jetpack Compose Android source files.
          </p>
        </div>

        {/* Tab Switchers */}
        <div className="flex items-center gap-1 bg-white/10 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md text-xs shrink-0">
          {[
            { id: 'widgets', label: 'Widget Preview' },
            { id: 'flutter_code', label: 'Flutter Code' },
            { id: 'kotlin_code', label: 'Jetpack Compose' },
            { id: 'readme', label: 'Architecture Docs' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-xl font-extrabold transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-white text-indigo-950 shadow'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'widgets' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Small Widget */}
            <div className="bento-card p-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Small Widget (2x2)</span>
                <span className="text-[10px] bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded-full">Material You</span>
              </div>

              {/* Simulated Phone Widget Card */}
              <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 aspect-square flex flex-col justify-between shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-600 dark:text-indigo-400">
                    <Zap className="w-4 h-4 fill-current" />
                    <span>FocusFlow</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">Next Task</span>
                </div>

                {nextTask ? (
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-2">
                      {nextTask.title}
                    </h4>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                      <Clock className="w-3 h-3 text-indigo-500" />
                      <span>{nextTask.startTime} - {nextTask.endTime}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No pending tasks</p>
                )}

                <div className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>On Schedule</span>
                </div>
              </div>
            </div>

            {/* Medium Widget */}
            <div className="bento-card p-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Medium Widget (4x2)</span>
                <span className="text-[10px] bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded-full">Timeline</span>
              </div>

              {/* Medium Widget Card */}
              <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 aspect-[2/1] flex flex-col justify-between shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-600 dark:text-indigo-400">
                    <Zap className="w-4 h-4 fill-current" />
                    <span>FocusFlow Today</span>
                  </div>
                  <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-amber-500" />
                    <span>12 Days</span>
                  </span>
                </div>

                <div className="space-y-1.5 my-1">
                  {todayEvents.slice(0, 2).map((e) => (
                    <div key={e.id} className="p-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 text-[10px] flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[140px]">{e.title}</span>
                      <span className="text-slate-400">{e.startTime}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>{todayEvents.filter((e) => e.completed).length}/{todayEvents.length} Tasks Done</span>
                  <button onClick={onOpenQuickAdd} className="text-indigo-500 font-bold hover:underline cursor-pointer">+ Quick Add</button>
                </div>
              </div>
            </div>

            {/* Large Widget */}
            <div className="bento-card p-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Large Widget (4x4)</span>
                <span className="text-[10px] bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded-full">Full Schedule</span>
              </div>

              {/* Large Widget Card */}
              <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 space-y-2 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">Full Daily Schedule</span>
                  <span className="text-[10px] text-slate-400">July 24, 2026</span>
                </div>

                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {todayEvents.map((e) => (
                    <div key={e.id} className="p-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 text-[10px] flex items-center justify-between">
                      <span className="font-semibold text-slate-800 dark:text-slate-100 truncate">{e.title}</span>
                      <span className="text-slate-400 shrink-0">{e.startTime}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Flutter Code Tab */}
      {activeTab === 'flutter_code' && (
        <div className="p-5 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400">lib/widgets/focus_flow_home_widget.dart</span>
            <button
              onClick={() => copyToClipboard(flutterSourceCode)}
              className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied!' : 'Copy Flutter Code'}</span>
            </button>
          </div>
          <pre className="text-xs font-mono bg-slate-900 p-4 rounded-2xl overflow-x-auto text-slate-300 leading-relaxed">
            {flutterSourceCode}
          </pre>
        </div>
      )}

      {/* Jetpack Compose Kotlin Code Tab */}
      {activeTab === 'kotlin_code' && (
        <div className="p-5 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400">android/widget/FocusFlowWidget.kt</span>
            <button
              onClick={() => copyToClipboard(kotlinComposeCode)}
              className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied!' : 'Copy Kotlin Code'}</span>
            </button>
          </div>
          <pre className="text-xs font-mono bg-slate-900 p-4 rounded-2xl overflow-x-auto text-slate-300 leading-relaxed">
            {kotlinComposeCode}
          </pre>
        </div>
      )}

      {/* Architecture Docs Tab */}
      {activeTab === 'readme' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
            FocusFlow Native Android & Flutter Architecture
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>State Management:</strong> Riverpod / Bloc repository pattern with offline SQLite persistence.</li>
            <li><strong>Social Media Blocking Engine:</strong> Android Accessibility Service intercepts target app intents (`com.instagram.android`, `com.zhiliaoapp.musically`, `com.google.android.youtube`) during active focus sessions.</li>
            <li><strong>AI Scheduler Integration:</strong> Server-side Gemini 3.6 Flash API parses natural language requests and optimizes daily timeline conflicts.</li>
            <li><strong>Home Screen Widgets:</strong> Powered by `home_widget` package (Flutter) and Glance AppWidget API (Kotlin Jetpack Compose).</li>
          </ul>
        </div>
      )}
    </div>
  );
};
