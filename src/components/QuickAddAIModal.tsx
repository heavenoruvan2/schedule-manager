import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, X, Sparkles, Loader2, Calendar, Clock, Tag, AlertCircle, Check } from 'lucide-react';
import { EventItem, CategoryName, Priority } from '../types';
import { CATEGORIES } from '../data/categoriesAndIcons';

interface QuickAddAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (event: EventItem) => void;
}

export const QuickAddAIModal: React.FC<QuickAddAIModalProps> = ({
  isOpen,
  onClose,
  onAddEvent,
}) => {
  const [promptText, setPromptText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [parsedPreview, setParsedPreview] = useState<Partial<EventItem> | null>(null);

  if (!isOpen) return null;

  const handleParse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setParsedPreview(null);

    try {
      const res = await fetch('/api/ai/parse-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          referenceDate: new Date().toISOString().split('T')[0],
        }),
      });

      const data = await res.json();
      if (data.success && data.event) {
        setParsedPreview(data.event);
      } else {
        setErrorMsg(data.message || 'Could not parse text. Try: "Tomorrow 3pm Gym 1 hour"');
      }
    } catch (err: any) {
      setErrorMsg('Failed to connect to AI server.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAdd = () => {
    if (!parsedPreview) return;

    const catName = (parsedPreview.category as CategoryName) || 'Study';
    const catConfig = CATEGORIES[catName] || CATEGORIES['Study'];

    const newEvent: EventItem = {
      id: `evt-ai-${Date.now()}`,
      title: parsedPreview.title || promptText,
      description: parsedPreview.description || 'Created via AI Natural Language Scheduling',
      date: parsedPreview.date || new Date().toISOString().split('T')[0],
      startTime: parsedPreview.startTime || '12:00',
      endTime: parsedPreview.endTime || '13:00',
      durationMinutes: parsedPreview.durationMinutes || 60,
      priority: (parsedPreview.priority as Priority) || 'medium',
      category: catName,
      color: catConfig.color,
      icon: parsedPreview.icon || catConfig.icon,
      notes: parsedPreview.notes || '',
      checklist: [],
      attachments: [],
      location: parsedPreview.location || '',
      reminderMinutesBefore: parsedPreview.reminderMinutesBefore || 15,
      reminderType: 'notification',
      repeat: 'none',
      completed: false,
      pinned: false,
      archived: false,
      aiSuggested: true,
    };

    onAddEvent(newEvent);
    setPromptText('');
    setParsedPreview(null);
    onClose();
  };

  const samplePrompts = [
    "Tomorrow 3 PM Gym 1 hour priority high",
    "Study Data Structures next Monday at 10am for 2 hours",
    "Doctor Appointment Friday 4pm at Health Clinic",
    "Team Sync meeting tomorrow 2pm category Meeting",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white dark:bg-[#23252A] amoled:bg-zinc-950 border border-slate-200 dark:border-white/10 amoled:border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden p-5 sm:p-6"
          >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white">
              <Zap className="w-4 h-4 fill-white text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                AI Natural Language Scheduler
              </h2>
              <p className="text-xs text-slate-400">Type naturally to create events instantly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleParse} className="space-y-3">
          <div>
            <div className="relative">
              <input
                type="text"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder='e.g. "Tomorrow 3 PM Gym for 1 hour priority high"'
                className="w-full pl-3 pr-20 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={loading || !promptText.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Parse</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Prompt Suggestions */}
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Try Example Inputs
            </span>
            <div className="flex flex-wrap gap-1.5">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPromptText(p)}
                  className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] text-slate-600 dark:text-slate-300 text-left transition-all"
                >
                  "{p}"
                </button>
              ))}
            </div>
          </div>
        </form>

        {errorMsg && (
          <div className="mt-3 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Parsed Preview Card */}
        {parsedPreview && (
          <div className="mt-4 p-3.5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                AI Parsed Preview
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-semibold uppercase">
                {parsedPreview.priority || 'medium'} priority
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">
              {parsedPreview.title || 'Untitled Event'}
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 mb-3">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>{parsedPreview.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>{parsedPreview.startTime} - {parsedPreview.endTime} ({parsedPreview.durationMinutes}m)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                <span>Category: {parsedPreview.category}</span>
              </div>
            </div>

            <button
              onClick={handleConfirmAdd}
              className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Confirm & Add to Schedule</span>
            </button>
          </div>
        )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
