import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Clock, CheckCircle2, Zap, X } from 'lucide-react';
import { EventItem } from '../types';
import { focusAudio } from '../utils/audio';

interface FullAlarmModalProps {
  event: EventItem | null;
  onClose: () => void;
  onSnooze: () => void;
  onComplete: () => void;
  onStartFocus: () => void;
}

export const FullAlarmModal: React.FC<FullAlarmModalProps> = ({
  event,
  onClose,
  onSnooze,
  onComplete,
  onStartFocus,
}) => {
  useEffect(() => {
    if (event) {
      focusAudio.playAlarmChime();
    }
  }, [event]);

  if (!event) return null;

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl text-white flex flex-col items-center justify-center p-6"
        >
          <div className="max-w-md w-full bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 text-center space-y-6 shadow-2xl my-auto">
        {/* Animated Bell Header */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-xl mx-auto flex items-center justify-center animate-bounce">
          <div className="w-full h-full bg-slate-900 rounded-3xl flex items-center justify-center">
            <Bell className="w-10 h-10 text-amber-400" />
          </div>
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-extrabold text-xs">
            {event.category} Reminder
          </span>
          <h2 className="text-2xl font-black mt-2 text-white">
            {event.title}
          </h2>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-1">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Scheduled for {event.startTime} - {event.endTime}</span>
          </div>
        </div>

        {event.description && (
          <p className="text-xs text-slate-300 bg-white/5 p-3 rounded-2xl border border-white/10">
            {event.description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={onStartFocus}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Start Focus Session Now</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={onSnooze}
              className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
            >
              Snooze 5m
            </button>
            <button
              onClick={onComplete}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Done</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
  );
};
