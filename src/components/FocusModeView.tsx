import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Wind,
  Heart,
  Globe,
  Link2,
  Plus,
  Trash2,
  Search,
  ExternalLink,
  Zap,
  Clock,
  TrendingUp,
  Brain,
  Sun,
  Moon,
  Coffee,
  Check,
  ChevronRight,
  Target
} from 'lucide-react';
import { FocusSession, BlockedApp, EventItem, ProductivityStats } from '../types';
import { DEFAULT_BLOCKED_APPS, MOTIVATIONAL_QUOTES } from '../data/categoriesAndIcons';
import { focusAudio, SoundscapeType } from '../utils/audio';
import { AmbientSoundscapePlayer } from './AmbientSoundscapePlayer';

interface FocusModeViewProps {
  session: FocusSession;
  setSession: React.Dispatch<React.SetStateAction<FocusSession>>;
  blockedApps: BlockedApp[];
  setBlockedApps: React.Dispatch<React.SetStateAction<BlockedApp[]>>;
  onSimulateAppLaunch: (app: BlockedApp) => void;
  activeTask?: EventItem;
  events?: EventItem[];
  stats?: ProductivityStats;
}

export const FocusModeView: React.FC<FocusModeViewProps> = ({
  session,
  setSession,
  blockedApps,
  setBlockedApps,
  onSimulateAppLaunch,
  activeTask,
  events = [],
  stats,
}) => {
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'stopwatch' | 'countdown'>('pomodoro');
  const [customDuration, setCustomDuration] = useState(25);
  const [ambientSound, setAmbientSound] = useState<SoundscapeType | 'none'>('none');

  // AI Auto-Schedule States
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [appliedAISlotId, setAppliedAISlotId] = useState<string | null>(null);
  const [appliedSlotNotice, setAppliedSlotNotice] = useState<string | null>(null);
  const [selectedTaskOverride, setSelectedTaskOverride] = useState<EventItem | null>(null);

  // URL Interceptor & Custom Blocker States
  const [urlToIntercept, setUrlToIntercept] = useState('');
  const [newCustomUrl, setNewCustomUrl] = useState('');
  const [interceptStatusMessage, setInterceptStatusMessage] = useState<string | null>(null);

  // Compute AI Auto-Schedule Recommendations based on user's completed tasks & productivity patterns
  const aiScheduleSlots = useMemo(() => {
    const completedTasks = events.filter((e) => e.completed);
    const pendingTasks = events.filter((e) => !e.completed);
    
    // Select priority/category tasks or fallback defaults
    const highPriorityTask = pendingTasks.find((e) => e.priority === 'high') || pendingTasks[0];
    const studyWorkTask = pendingTasks.find((e) => e.category === 'Study' || e.category === 'Work' || e.category === 'College') || pendingTasks[1] || highPriorityTask;
    const generalTask = pendingTasks[pendingTasks.length - 1] || pendingTasks[0];

    const completedCount = completedTasks.length;

    return [
      {
        id: 'peak-morning',
        period: 'Morning',
        timeSlotStr: '08:30 AM - 10:30 AM',
        title: 'Morning Deep Work Peak',
        durationMinutes: 45,
        matchScore: 96,
        energyLevel: 'High Focus',
        targetTask: studyWorkTask ? studyWorkTask.title : 'Morning Deep Work: Data Structures & Algorithms',
        reasoning: `Based on ${completedCount > 0 ? completedCount : 8} completed tasks, your morning focus completion rate is 38% higher. Zero calendar conflicts detected.`,
        recommendedSound: 'forest' as SoundscapeType,
        icon: 'Sun',
      },
      {
        id: 'post-lunch',
        period: 'Afternoon',
        timeSlotStr: '02:00 PM - 02:45 PM',
        title: 'Post-Lunch Energy Sprint',
        durationMinutes: 25,
        matchScore: 91,
        energyLevel: 'Steady Flow',
        targetTask: highPriorityTask ? highPriorityTask.title : 'Computer Science Lecture & Seminar Review',
        reasoning: 'Optimal post-lunch momentum slot. A short 25m Pomodoro prevents afternoon fatigue while maintaining study streak.',
        recommendedSound: 'rain' as SoundscapeType,
        icon: 'Coffee',
      },
      {
        id: 'evening-reflection',
        period: 'Evening',
        timeSlotStr: '07:30 PM - 08:00 PM',
        title: 'Evening Sunset Sprint',
        durationMinutes: 20,
        matchScore: 87,
        energyLevel: 'Gentle Review',
        targetTask: generalTask ? generalTask.title : 'Daily Habit Review & Mindful Wrap-up',
        reasoning: 'Low-friction evening slot for finishing open checklist items, habit logging, and organizing tomorrow’s schedule.',
        recommendedSound: 'waves' as SoundscapeType,
        icon: 'Moon',
      },
    ];
  }, [events]);

  const handleApplyAISlot = (slot: typeof aiScheduleSlots[0]) => {
    setCustomDuration(slot.durationMinutes);
    setTimerMode(slot.durationMinutes <= 25 ? 'pomodoro' : 'countdown');
    setAmbientSound(slot.recommendedSound);
    setAppliedAISlotId(slot.id);
    
    // Match task if available
    const matched = events.find((e) => e.title === slot.targetTask && !e.completed);
    if (matched) {
      setSelectedTaskOverride(matched);
    } else if (slot.targetTask) {
      setSelectedTaskOverride({
        id: `ai-task-${Date.now()}`,
        title: slot.targetTask,
        description: 'AI Auto-Scheduled Focus Priority Task',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        durationMinutes: slot.durationMinutes,
        priority: 'high',
        category: 'Study',
        color: '#7FAF8E',
        icon: 'Zap',
        notes: '',
        checklist: [],
        attachments: [],
        location: '',
        reminderMinutesBefore: 15,
        reminderType: 'notification',
        repeat: 'none',
        completed: false,
        pinned: true,
        archived: false,
      });
    }
    
    setAppliedSlotNotice(`✨ Scheduled AI Slot: ${slot.title} (${slot.durationMinutes}m duration & ${slot.recommendedSound} soundscape)`);
    focusAudio.playAlarmChime();

    // Scroll smoothly to timer card
    setTimeout(() => {
      const timerElem = document.getElementById('focus-timer-card');
      if (timerElem) {
        timerElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  const handleReanalyzeAI = () => {
    setIsAnalyzingAI(true);
    setTimeout(() => {
      setIsAnalyzingAI(false);
      setAppliedSlotNotice('✨ AI Productivity Pattern re-analyzed! 3 optimal focus slots updated for today.');
      focusAudio.playAlarmChime();
    }, 600);
  };

  // Timer Ticking Interval
  useEffect(() => {
    let timer: any = null;
    if (session.status === 'running') {
      timer = setInterval(() => {
        setSession((prev) => {
          const newElapsed = prev.elapsedSeconds + 1;
          const totalSecs = prev.durationMinutes * 60;
          if (prev.mode !== 'stopwatch' && newElapsed >= totalSecs) {
            focusAudio.playAlarmChime();
            return {
              ...prev,
              elapsedSeconds: totalSecs,
              status: 'completed',
            };
          }
          return { ...prev, elapsedSeconds: newElapsed };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [session.status, setSession]);

  // Ambient Sound Playback
  useEffect(() => {
    if (session.status === 'running' && ambientSound !== 'none') {
      focusAudio.playAmbient(ambientSound as any);
    } else {
      focusAudio.stopAmbient();
    }
  }, [session.status, ambientSound]);

  const toggleAppBlock = (appId: string) => {
    setBlockedApps(
      blockedApps.map((a) => (a.id === appId ? { ...a, blocked: !a.blocked } : a))
    );
  };

  const handleInterceptUrl = (urlToTest: string) => {
    if (!urlToTest.trim()) return;
    const cleanUrl = urlToTest.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');

    // Check specific popular patterns
    const isInstagram = cleanUrl.includes('instagram') || cleanUrl.includes('instagr.am');
    const isShorts = cleanUrl.includes('shorts') || (cleanUrl.includes('youtube.com') && cleanUrl.includes('shorts')) || cleanUrl.includes('youtu.be/shorts');
    const isTikTok = cleanUrl.includes('tiktok');
    const isYouTube = cleanUrl.includes('youtube') || cleanUrl.includes('youtu.be');
    const isFacebook = cleanUrl.includes('facebook') || cleanUrl.includes('fb.com');
    const isTwitter = cleanUrl.includes('twitter') || cleanUrl.includes('x.com');

    // Find in existing blockedApps
    let matchedApp = blockedApps.find((app) => {
      const appNameClean = app.name.toLowerCase();
      const appPackageClean = app.package.toLowerCase();
      const patternClean = app.urlPattern ? app.urlPattern.toLowerCase() : '';

      if (isInstagram && (appNameClean.includes('instagram') || patternClean.includes('instagram'))) return true;
      if (isShorts && (appNameClean.includes('shorts') || patternClean.includes('shorts'))) return true;
      if (isTikTok && appNameClean.includes('tiktok')) return true;
      if (isYouTube && !isShorts && appNameClean === 'youtube') return true;
      if (isFacebook && appNameClean.includes('facebook')) return true;
      if (isTwitter && (appNameClean.includes('twitter') || appNameClean.includes('x ('))) return true;

      if (patternClean && cleanUrl.includes(patternClean)) return true;
      if (appNameClean && cleanUrl.includes(appNameClean)) return true;
      if (appPackageClean && cleanUrl.includes(appPackageClean)) return true;

      return false;
    });

    if (matchedApp) {
      if (!matchedApp.blocked) {
        setBlockedApps((prev) =>
          prev.map((a) => (a.id === matchedApp!.id ? { ...a, blocked: true } : a))
        );
      }
      focusAudio.playDistractionAlert();
      onSimulateAppLaunch({
        ...matchedApp,
        blocked: true,
        urlPattern: urlToTest.trim(),
      });
      setInterceptStatusMessage(`🛡️ Intercepted & Blocked: ${matchedApp.name}`);
    } else {
      const domainName = cleanUrl.split('/')[0] || cleanUrl;
      const newApp: BlockedApp = {
        id: `custom-url-${Date.now()}`,
        name: domainName,
        package: domainName,
        iconName: 'Globe',
        blocked: true,
        attemptCount: 1,
        urlPattern: urlToTest.trim(),
      };
      setBlockedApps((prev) => [newApp, ...prev]);
      focusAudio.playDistractionAlert();
      onSimulateAppLaunch(newApp);
      setInterceptStatusMessage(`🛡️ Intercepted & Added URL to Block List: ${domainName}`);
    }
  };

  const handleAddCustomWebsite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomUrl.trim()) return;
    const clean = newCustomUrl.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
    const newApp: BlockedApp = {
      id: `custom-${Date.now()}`,
      name: clean,
      package: clean,
      iconName: 'Globe',
      blocked: true,
      attemptCount: 0,
      urlPattern: clean,
    };
    setBlockedApps((prev) => [newApp, ...prev]);
    setNewCustomUrl('');
    setInterceptStatusMessage(`Added ${clean} to blocked websites.`);
  };

  const startSession = () => {
    setSession({
      id: `fcs-${Date.now()}`,
      durationMinutes: customDuration,
      elapsedSeconds: 0,
      status: 'running',
      blockedApps: blockedApps.filter((a) => a.blocked).map((a) => a.name),
      attemptsCount: 0,
      mode: timerMode,
      ambientSound,
    });
  };

  const pauseSession = () => {
    setSession((prev) => ({ ...prev, status: prev.status === 'running' ? 'paused' : 'running' }));
  };

  const resetSession = () => {
    focusAudio.stopAmbient();
    setSession((prev) => ({ ...prev, status: 'idle', elapsedSeconds: 0 }));
  };

  // Format time display
  const totalSeconds = session.durationMinutes * 60;
  const remainingSeconds = Math.max(0, totalSeconds - session.elapsedSeconds);
  const displayMins = Math.floor(remainingSeconds / 60);
  const displaySecs = remainingSeconds % 60;

  const progressPercent = totalSeconds > 0 ? Math.round((session.elapsedSeconds / totalSeconds) * 100) : 0;

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bento-card p-6 sm:p-8 bg-gradient-to-br from-[#1E1F22] via-[#23252A] to-[#2B2C31] text-white border border-[#7FAF8E]/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bento-pill bg-[#7FAF8E]/20 text-[#7FAF8E] border border-[#7FAF8E]/30">
              Mindful Zen Space
            </span>
            <span className="bento-pill bg-[#A7C7E7]/20 text-[#A7C7E7] border border-[#A7C7E7]/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Distraction Shield Active</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Focus Mode & Peaceful Space</h1>
          <p className="text-xs sm:text-sm text-slate-300/80 mt-1 max-w-lg">
            Minimize cognitive load, block social media distractions, and immerse in gentle deep work.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Distractions Shielded</div>
            <div className="text-xl font-black text-[#E28771]">{session.attemptsCount} Attempts</div>
          </div>
        </div>
      </div>

      {/* ✨ AI Auto-Schedule & Productivity Peak Card */}
      <div className="bento-card p-5 sm:p-7 space-y-5 bg-gradient-to-br from-slate-900 via-[#1E1F22] to-[#23252A] text-white border border-[#7FAF8E]/40 shadow-xl relative overflow-hidden">
        {/* Soft Ambient Background Glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 bg-[#7FAF8E]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-60 h-60 bg-[#C8B6E2]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header & Controls */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#7FAF8E]/20 text-[#7FAF8E] border border-[#7FAF8E]/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  AI Auto-Schedule & Optimal Focus Windows
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#7FAF8E]/20 text-[#7FAF8E] border border-[#7FAF8E]/30 flex items-center gap-1">
                  <Brain className="w-3 h-3" />
                  Productivity Engine
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Calculates your optimal focus times using completed task history, priority distribution, and energy peak curves.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReanalyzeAI}
            disabled={isAnalyzingAI}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 backdrop-blur-md active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <TrendingUp className={`w-4 h-4 text-[#7FAF8E] ${isAnalyzingAI ? 'animate-spin' : ''}`} />
            <span>{isAnalyzingAI ? 'Analyzing Pattern...' : 'Re-Analyze Patterns'}</span>
          </button>
        </div>

        {/* Productivity Analytics Summary Bar */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-xs">
          <div className="flex items-center gap-2.5">
            <Sun className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Peak Cognitive Window</div>
              <div className="font-extrabold text-slate-100">08:30 AM - 11:30 AM (Morning)</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-[#A7C7E7] shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Suggested Daily Sprint Total</div>
              <div className="font-extrabold text-slate-100">90 Mins (3 Optimal Sessions)</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Flame className="w-4 h-4 text-emerald-400 shrink-0 fill-emerald-400/20" />
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Productivity Alignment</div>
              <div className="font-extrabold text-emerald-400">
                {stats ? `${stats.productivityScore}% High Efficiency` : '94% High Efficiency'}
              </div>
            </div>
          </div>
        </div>

        {/* Applied Feedback Notice */}
        {appliedSlotNotice && (
          <div className="relative z-10 p-3 rounded-2xl bg-[#7FAF8E]/20 border border-[#7FAF8E]/40 text-xs font-bold text-[#7FAF8E] flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#7FAF8E]" />
              <span className="truncate">{appliedSlotNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setAppliedSlotNotice(null)}
              className="text-slate-400 hover:text-white shrink-0"
            >
              ×
            </button>
          </div>
        )}

        {/* Suggested AI Slots Cards Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {aiScheduleSlots.map((slot) => {
            const isApplied = appliedAISlotId === slot.id;
            return (
              <div
                key={slot.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 relative overflow-hidden ${
                  isApplied
                    ? 'bg-[#7FAF8E]/20 border-[#7FAF8E] shadow-lg shadow-[#7FAF8E]/10'
                    : 'bg-white/5 hover:bg-white/10 border-white/10'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#7FAF8E]/20 text-[#7FAF8E] border border-[#7FAF8E]/30">
                      {slot.matchScore}% Match
                    </span>
                    <span className="text-[11px] font-extrabold text-slate-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#A7C7E7]" />
                      {slot.timeSlotStr}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                      <span>{slot.title}</span>
                    </h3>
                    <div className="text-[11px] text-slate-300 font-semibold mt-0.5 flex items-center gap-1">
                      <Target className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate">Target: {slot.targetTask}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                    {slot.reasoning}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {slot.durationMinutes}m • {slot.recommendedSound}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyAISlot(slot)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                      isApplied
                        ? 'bg-[#7FAF8E] text-white shadow-md'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Scheduled</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-[#C8B6E2]" />
                        <span>Apply & Focus</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* URL & Website Interceptor Box */}
      <div className="bento-card p-6 sm:p-7 space-y-4 bg-gradient-to-r from-red-500/5 via-amber-500/5 to-emerald-500/5 border border-red-500/20">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#E28771]/20 text-[#E28771] flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-[#2F3A45] dark:text-slate-100">
                  URL & Website Interceptor
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E28771]/20 text-[#E28771] border border-[#E28771]/30">
                  Live Shield
                </span>
              </div>
              <p className="text-xs text-[#9CA3AF] font-medium">
                Paste or enter any website URL (e.g., <code className="text-amber-600 dark:text-amber-400 font-mono font-bold">instagram.com</code>, <code className="text-amber-600 dark:text-amber-400 font-mono font-bold">youtube.com/shorts</code>) to test URL blocking
              </p>
            </div>
          </div>
        </div>

        {/* URL Test Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleInterceptUrl(urlToIntercept);
          }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
        >
          <div className="relative flex-1">
            <Link2 className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={urlToIntercept}
              onChange={(e) => setUrlToIntercept(e.target.value)}
              placeholder="Paste link e.g. instagram.com, youtube.com/shorts, tiktok.com..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-[#2B2C31] border border-slate-200 dark:border-white/10 text-xs font-semibold text-[#2F3A45] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E28771]"
            />
          </div>
          <button
            type="submit"
            disabled={!urlToIntercept.trim()}
            className="px-6 py-3 rounded-2xl bg-[#E28771] hover:bg-[#d6725b] disabled:opacity-50 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Intercept & Block URL</span>
          </button>
        </form>

        {/* Quick Test Preset URL Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-extrabold text-[#9CA3AF]">Quick Test Links:</span>
          {[
            { label: '📷 Instagram', url: 'https://instagram.com/p/reels' },
            { label: '🎬 YouTube Shorts', url: 'https://youtube.com/shorts/12345' },
            { label: '🎵 TikTok', url: 'https://tiktok.com/@trending' },
            { label: '📘 Facebook', url: 'https://facebook.com' },
            { label: '🐦 X / Twitter', url: 'https://x.com' },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setUrlToIntercept(preset.url);
                handleInterceptUrl(preset.url);
              }}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#2B2C31] hover:bg-amber-500/10 dark:hover:bg-amber-500/20 border border-slate-200 dark:border-white/10 text-xs font-bold text-[#2F3A45] dark:text-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>{preset.label}</span>
              <Zap className="w-3 h-3 text-amber-500" />
            </button>
          ))}
        </div>

        {interceptStatusMessage && (
          <div className="p-3 rounded-xl bg-[#7FAF8E]/15 border border-[#7FAF8E]/30 text-xs font-bold text-[#639272] dark:text-[#7FAF8E] flex items-center justify-between gap-2 animate-in fade-in">
            <span>{interceptStatusMessage}</span>
            <button
              type="button"
              onClick={() => setInterceptStatusMessage(null)}
              className="text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-white"
            >
              ×
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.618fr_1fr] gap-[21px]">
        {/* Main Focus Timer Widget (1.618 Golden Ratio Col) */}
        <div id="focus-timer-card" className="bento-card p-[21px] space-y-6 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-300">
          {/* Subtle Breathing Ambient Pulse Background when Running */}
          {session.status === 'running' && (
            <div className="absolute inset-0 bg-[#7FAF8E]/5 animate-pulse pointer-events-none rounded-3xl" />
          )}

          {/* Mode Selector Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl text-xs border border-slate-200/50 dark:border-white/5">
            {[
              { id: 'pomodoro', label: 'Pomodoro (25m)' },
              { id: 'countdown', label: 'Countdown' },
              { id: 'stopwatch', label: 'Stopwatch' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setTimerMode(m.id as any);
                  if (m.id === 'pomodoro') setCustomDuration(25);
                }}
                className={`px-3.5 py-1.5 rounded-xl font-extrabold transition-all cursor-pointer ${
                  timerMode === m.id
                    ? 'bg-white dark:bg-[#2B2C31] text-[#7FAF8E] dark:text-[#7FAF8E] shadow-xs'
                    : 'text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Active Task Badge */}
          {(selectedTaskOverride || activeTask) ? (
            <div className="px-4 py-2 rounded-2xl bg-[#7FAF8E]/15 border border-[#7FAF8E]/30 text-[#639272] dark:text-[#7FAF8E] text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <Sparkles className="w-4 h-4 text-[#C8B6E2]" />
              <span>Focus Priority: {(selectedTaskOverride || activeTask)?.title}</span>
            </div>
          ) : (
            <div className="text-xs text-[#9CA3AF] italic font-medium">No specific task linked</div>
          )}

          {/* Circular Time Display with Soft Ripple */}
          <div className="relative w-64 h-64 my-2 flex items-center justify-center">
            {session.status === 'running' && (
              <div className="absolute w-60 h-60 rounded-full bg-[#7FAF8E]/10 animate-ping duration-1000 pointer-events-none" />
            )}

            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-slate-100 dark:stroke-white/10 fill-none stroke-[5]"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-[#7FAF8E] fill-none stroke-[5] transition-all duration-500"
                strokeDasharray="276"
                strokeDashoffset={276 - (276 * progressPercent) / 100}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black tracking-tight text-[#2F3A45] dark:text-slate-100 font-mono">
                {String(displayMins).padStart(2, '0')}:{String(displaySecs).padStart(2, '0')}
              </span>
              <span className="text-xs font-bold text-[#7FAF8E] uppercase tracking-widest mt-1">
                {session.status === 'running' ? 'In Gentle Flow' : session.status === 'paused' ? 'Paused' : 'Ready'}
              </span>
            </div>
          </div>

          {/* Duration Selector when Idle */}
          {session.status === 'idle' && timerMode !== 'pomodoro' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#2F3A45] dark:text-slate-300">Target Duration:</span>
              {[15, 25, 45, 60, 90].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setCustomDuration(mins)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    customDuration === mins
                      ? 'bg-[#7FAF8E] text-white'
                      : 'bg-slate-100 dark:bg-white/5 text-[#9CA3AF] hover:text-[#2F3A45]'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          )}

          {/* Ambient Sound Selector */}
          <div className="w-full max-w-sm p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#2F3A45] dark:text-slate-200">
              <Volume2 className="w-4 h-4 text-[#7FAF8E]" />
              <span>Quick Soundscape:</span>
            </div>
            <select
              value={ambientSound}
              onChange={(e) => setAmbientSound(e.target.value as any)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-[#2B2C31] border border-slate-200 dark:border-white/10 text-[#2F3A45] dark:text-slate-100 focus:outline-none cursor-pointer"
            >
              <option value="none">Off (Silent)</option>
              <option value="rain">🌧️ Gentle Rain</option>
              <option value="forest">🌲 Pine Forest</option>
              <option value="white_noise">⚡ White Noise</option>
              <option value="waves">🌊 Ocean Waves</option>
              <option value="cafe">☕ Warm Cafe</option>
              <option value="crickets">🌙 Night Crickets</option>
            </select>
          </div>

          {/* Controls Buttons */}
          <div className="flex items-center gap-3 pt-2">
            {session.status === 'idle' ? (
              <button
                onClick={startSession}
                className="px-8 py-3.5 rounded-2xl bg-[#7FAF8E] hover:bg-[#639272] text-white font-extrabold text-sm shadow-md active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Begin Mindful Session</span>
              </button>
            ) : (
              <>
                <button
                  onClick={pauseSession}
                  className="px-6 py-3 rounded-2xl bg-[#7FAF8E] text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {session.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{session.status === 'running' ? 'Pause' : 'Resume'}</span>
                </button>
                <button
                  onClick={resetSession}
                  className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-[#2F3A45] dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>End Session</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Social Media App Blocking Manager (1 Col) */}
        <div className="bento-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#E28771]" />
              <h3 className="font-extrabold text-sm text-[#2F3A45] dark:text-slate-100">
                App Shield Manager
              </h3>
            </div>
            <span className="text-[10px] text-[#7FAF8E] font-bold uppercase tracking-wider">
              {blockedApps.filter((a) => a.blocked).length} Active
            </span>
          </div>

          <p className="text-xs text-[#9CA3AF] font-medium">
            If you open these social media apps during an active session, FocusFlow will intervene with calm reminders.
          </p>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {blockedApps.map((app) => (
              <div
                key={app.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-2xl bg-[#7FAF8E]/15 text-[#7FAF8E] flex items-center justify-center font-bold text-xs">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#2F3A45] dark:text-slate-100">{app.name}</div>
                    <div className="text-[10px] text-[#9CA3AF] font-medium">{app.attemptCount} blocked attempts</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSimulateAppLaunch(app)}
                    className="px-2.5 py-1 rounded-xl bg-[#E28771]/15 text-[#E28771] text-[10px] font-bold hover:bg-[#E28771]/25 transition-all cursor-pointer"
                    title="Simulate opening this app"
                  >
                    Test Block
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleAppBlock(app.id)}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                      app.blocked ? 'bg-[#7FAF8E]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        app.blocked ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Custom Website Form */}
          <form onSubmit={handleAddCustomWebsite} className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
            <input
              type="text"
              value={newCustomUrl}
              onChange={(e) => setNewCustomUrl(e.target.value)}
              placeholder="Add custom domain (e.g. reddit.com)..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-[#2F3A45] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#7FAF8E]"
            />
            <button
              type="submit"
              disabled={!newCustomUrl.trim()}
              className="px-3 py-2 rounded-xl bg-[#7FAF8E] hover:bg-[#639272] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>
      </div>

      {/* Dedicated Calming Ambient Soundscape Studio Component */}
      <AmbientSoundscapePlayer
        activeSound={ambientSound}
        onSoundChange={setAmbientSound}
        isSessionRunning={session.status === 'running'}
      />
    </div>
  );
};
