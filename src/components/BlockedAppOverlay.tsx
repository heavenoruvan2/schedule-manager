import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Lock, Clock, Sparkles, ArrowLeft, AlertCircle, X, Flame } from 'lucide-react';
import { BlockedApp, EventItem, FocusSession } from '../types';
import { MOTIVATIONAL_QUOTES } from '../data/categoriesAndIcons';

interface BlockedAppOverlayProps {
  app: BlockedApp | null;
  onClose: () => void;
  onConfirmEmergencyExit: () => void;
  session: FocusSession;
  activeTask?: EventItem;
}

export const BlockedAppOverlay: React.FC<BlockedAppOverlayProps> = ({
  app,
  onClose,
  onConfirmEmergencyExit,
  session,
  activeTask,
}) => {
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  if (!app) return null;

  // Select random motivational quote
  const quote = MOTIVATIONAL_QUOTES[app.name.length % MOTIVATIONAL_QUOTES.length];

  const totalSecs = session.durationMinutes * 60;
  const remSecs = Math.max(0, totalSecs - session.elapsedSeconds);
  const displayMins = Math.floor(remSecs / 60);
  const displaySecs = remSecs % 60;

  return (
    <AnimatePresence>
      {app && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl text-white flex flex-col items-center justify-center p-6"
        >
          <div className="max-w-md w-full text-center space-y-6 my-auto">
        {/* Shield Icon Header */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-red-600 via-purple-600 to-indigo-600 p-0.5 shadow-2xl mx-auto flex items-center justify-center animate-pulse">
          <div className="w-full h-full bg-slate-950 rounded-3xl flex items-center justify-center">
            <Lock className="w-9 h-9 text-red-500" />
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 font-extrabold text-xs mb-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Focus Shield Active</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {app.name} is Blocked!
          </h2>
          {app.urlPattern && (
            <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-amber-300 font-mono text-[11px] font-bold">
              <span>Blocked Link: {app.urlPattern}</span>
            </div>
          )}
          <p className="text-xs text-slate-400 mt-1">
            Attempt #{app.attemptCount + 1} to access social media / website during focus time.
          </p>
        </div>

        {/* Motivational Quote Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs italic text-indigo-200 leading-relaxed">
          {quote}
        </div>

        {/* Active Task & Remaining Time */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 text-left space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Current Task:
            </span>
            <span className="text-indigo-300 font-extrabold">
              {activeTask ? activeTask.title : 'Deep Work Session'}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-2 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Remaining Focus Time:
            </span>
            <span className="font-mono text-base font-extrabold text-amber-400">
              {String(displayMins).padStart(2, '0')}:{String(displaySecs).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Question & Actions */}
        {!showExitConfirm ? (
          <div className="space-y-3 pt-2">
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Focus Session</span>
            </button>

            <button
              onClick={() => setShowExitConfirm(true)}
              className="text-xs text-slate-500 hover:text-red-400 font-medium underline"
            >
              Do you really want to quit your focus session?
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-red-400 font-extrabold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Are you sure? This will break your streak!</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirmEmergencyExit();
                  onClose();
                }}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold"
              >
                Emergency Exit
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )}
</AnimatePresence>
  );
};
