import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Loader2, 
  Bot, 
  User, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Brain, 
  Zap, 
  AlertCircle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { EventItem } from '../types';

interface AISmartSchedulerViewProps {
  events: EventItem[];
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>;
  onOpenQuickAdd: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const AISmartSchedulerView: React.FC<AISmartSchedulerViewProps> = ({
  events,
  setEvents,
  onOpenQuickAdd,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      content: "Hello! I'm FocusFlow AI, your smart scheduling assistant. I can auto-rearrange your daily schedule to eliminate conflicts, insert rest breaks, predict task completion times, and suggest optimal study routines. How can I help you today?",
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const [optimizing, setOptimizing] = useState(false);
  const [optimizationAdvice, setOptimizationAdvice] = useState<string | null>(null);

  // Send message to AI Coach
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: chatInput.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          currentEvents: events,
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setMessages((prev) => [
          ...prev,
          { id: `a-${Date.now()}`, role: 'assistant', content: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: `a-${Date.now()}`, role: 'assistant', content: 'Sorry, I ran into an error generating advice.' },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: 'assistant', content: 'Connection issue. Please try again.' },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Run AI Schedule Optimization
  const handleRunOptimizer = async () => {
    setOptimizing(true);
    setOptimizationAdvice(null);

    try {
      const res = await fetch('/api/ai/optimize-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events,
          userPreferences: { peakHours: 'morning' },
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        setOptimizationAdvice(data.result.advice);
        if (data.result.optimizedEvents && Array.isArray(data.result.optimizedEvents)) {
          // Merge adjusted times back into events
          const updated = events.map((orig) => {
            const match = data.result.optimizedEvents.find((opt: any) => opt.id === orig.id || opt.title === orig.title);
            if (match) {
              return {
                ...orig,
                startTime: match.startTime || orig.startTime,
                endTime: match.endTime || orig.endTime,
                aiSuggested: true,
              };
            }
            return orig;
          });
          setEvents(updated);
        }
      }
    } catch (err) {
      setOptimizationAdvice('Failed to optimize schedule. Check network connection.');
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bento-card p-6 bg-gradient-to-br from-[#1E1F22] via-[#23252A] to-[#2B2C31] text-white border border-[#7FAF8E]/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white font-extrabold text-xs mb-2 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#C8B6E2]" />
            <span>AI Smart Scheduler & Zen Optimizer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">AI Schedule Auto-Organizer</h1>
          <p className="text-xs sm:text-sm text-slate-300/80 mt-1 max-w-lg font-medium">
            Let Gemini AI analyze your workload, resolve conflicting time slots, insert rest breaks, and suggest high-focus routines.
          </p>
        </div>

        <button
          onClick={handleRunOptimizer}
          disabled={optimizing}
          className="px-5 py-3 rounded-2xl bg-[#7FAF8E] hover:bg-[#639272] disabled:opacity-50 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          {optimizing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4 fill-white" />
          )}
          <span>{optimizing ? 'Optimizing Day...' : 'Optimize My Schedule'}</span>
        </button>
      </div>

      {/* Optimization Result Advice Card */}
      {optimizationAdvice && (
        <div className="bento-card p-5 bg-[#7FAF8E]/10 border border-[#7FAF8E]/30 text-xs space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-[#639272] dark:text-[#7FAF8E] font-extrabold text-sm">
            <Lightbulb className="w-4 h-4 text-[#7FAF8E]" />
            <span>AI Optimization Results & Recommendations</span>
          </div>
          <div className="text-[#2F3A45] dark:text-slate-300 leading-relaxed whitespace-pre-wrap pl-6 font-medium">
            {optimizationAdvice}
          </div>
        </div>
      )}

      {/* Grid: AI Chat Assistant + Routine Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.618fr_1fr] gap-[21px]">
        {/* Chat Assistant (1.618 Golden Ratio Col) */}
        <div className="bento-card p-[21px] flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#7FAF8E]/15 text-[#7FAF8E] flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#2F3A45] dark:text-white">
                  FocusFlow AI Productivity Coach
                </h3>
                <p className="text-[10px] text-[#9CA3AF] font-medium">Ask for routine tips, study plans, or procrastination fixes</p>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-[#7FAF8E] animate-pulse" title="AI Online" />
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-[#7FAF8E]/15 text-[#7FAF8E] flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#7FAF8E] text-white font-medium'
                      : 'bg-slate-100 dark:bg-white/5 text-[#2F3A45] dark:text-slate-200'
                  }`}
                >
                  {m.content}
                </div>
                {m.role === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-[#C8B6E2]/20 text-[#C8B6E2] flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {chatLoading && (
              <div className="flex items-center gap-2 text-[#9CA3AF] text-xs italic">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7FAF8E]" />
                <span>FocusFlow AI is reflecting...</span>
              </div>
            )}
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 dark:border-white/5 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="e.g. How do I structure my study breaks before exam week?"
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[#2F3A45] dark:text-slate-100 focus:outline-none focus:border-[#7FAF8E]"
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="px-4 py-2 rounded-xl bg-[#7FAF8E] hover:bg-[#639272] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Procrastination & Routine Insights Sidebar (1 Col) */}
        <div className="space-y-4">
          <div className="bento-card p-6 space-y-3">
            <div className="flex items-center gap-2 text-[#7FAF8E] font-extrabold text-xs">
              <Brain className="w-4 h-4 text-[#7FAF8E]" />
              <span>Procrastination Risk Analysis</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#9CA3AF] font-medium">Procrastination Score:</span>
              <span className="font-extrabold text-[#7FAF8E]">Low (12%)</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-2">
              <div className="bg-[#7FAF8E] h-2 rounded-full w-[12%]" />
            </div>
            <p className="text-[11px] text-[#9CA3AF] font-medium">
              You complete 85% of tasks within 15 minutes of scheduled start time. Excellent discipline!
            </p>
          </div>

          {/* Quick AI Prompt Actions */}
          <div className="bento-card p-6 space-y-3">
            <h4 className="font-extrabold text-xs text-[#2F3A45] dark:text-white">Quick AI Actions</h4>
            {[
              "Suggest optimal study routine for my exams",
              "How to stop procrastinating on low-priority tasks?",
              "Recommend break slots for my 4-hour work block",
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => setChatInput(q)}
                className="w-full text-left p-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-[#7FAF8E]/10 text-xs font-semibold text-[#2F3A45] dark:text-slate-300 border border-slate-100 dark:border-white/5 transition-all flex items-center justify-between group cursor-pointer"
              >
                <span className="truncate mr-2">{q}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#7FAF8E] group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
