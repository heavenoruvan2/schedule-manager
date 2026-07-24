import React from 'react';
import { 
  Award, 
  Flame, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Brain, 
  BarChart2,
  Calendar as CalendarIcon,
  Plus
} from 'lucide-react';
import { ProductivityStats, HabitItem, AchievementBadge } from '../types';
import { DEFAULT_BADGES } from '../data/categoriesAndIcons';
import { DynamicIcon } from './DynamicIcon';

interface ProductivityViewProps {
  stats: ProductivityStats;
  habits: HabitItem[];
  onToggleHabit: (id: string) => void;
  todayDateStr: string;
}

export const ProductivityView: React.FC<ProductivityViewProps> = ({
  stats,
  habits,
  onToggleHabit,
  todayDateStr,
}) => {
  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bento-card p-6 bg-gradient-to-br from-[#1E1F22] via-[#23252A] to-[#2B2C31] text-white border border-[#7FAF8E]/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white font-extrabold text-xs mb-2 border border-white/10">
            <Award className="w-3.5 h-3.5 text-[#C8B6E2]" />
            <span>Productivity Analytics & Achievements</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Habits, Streaks & Badges</h1>
          <p className="text-xs sm:text-sm text-slate-300/80 mt-1 max-w-lg font-medium">
            Track daily consistency, celebrate focus milestones, and earn achievement badges as you level up your routines.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Longest Streak</div>
            <div className="text-xl font-black text-[#7FAF8E] flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-[#7FAF8E]" />
              <span>{stats.longestStreak} Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Habits & Streaks Section */}
      <div className="bento-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#7FAF8E]/15 text-[#7FAF8E] flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-[#2F3A45] dark:text-white">
              Habit Tracker & Consistency
            </h2>
          </div>
          <span className="bento-pill bg-[#7FAF8E]/15 text-[#639272] dark:text-[#7FAF8E] text-xs">
            {habits.filter((h) => h.completedDates.includes(todayDateStr)).length}/{habits.length} Done Today
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {habits.map((h) => {
            const isDone = h.completedDates.includes(todayDateStr);
            return (
              <div
                key={h.id}
                onClick={() => onToggleHabit(h.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                  isDone
                    ? 'bg-[#7FAF8E]/15 border-[#7FAF8E]/40 shadow-xs'
                    : 'bg-slate-50/80 dark:bg-white/5 border-slate-200/80 dark:border-white/5 hover:border-[#7FAF8E]/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <DynamicIcon name={h.icon} className="w-5 h-5" style={{ color: h.color }} />
                  <div
                    className={`w-6 h-6 rounded-xl flex items-center justify-center transition-all ${
                      isDone ? 'bg-[#7FAF8E] text-white shadow-xs' : 'border-2 border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isDone && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>

                <div className={`text-xs font-extrabold ${isDone ? 'line-through text-[#9CA3AF]' : 'text-[#2F3A45] dark:text-white'}`}>
                  {h.title}
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-[#7FAF8E] font-extrabold mt-2">
                  <Flame className="w-3.5 h-3.5 fill-[#7FAF8E]" />
                  <span>{h.streak} Day Streak</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Badges Grid */}
      <div className="bento-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
              Achievement Badges
            </h2>
          </div>
          <span className="text-xs text-indigo-500 font-bold">
            {DEFAULT_BADGES.filter((b) => b.unlocked).length}/{DEFAULT_BADGES.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {DEFAULT_BADGES.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border transition-all ${
                b.unlocked
                  ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/30'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    b.unlocked
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                  }`}
                >
                  <DynamicIcon name={b.icon} className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{b.title}</h4>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider ${
                      b.unlocked ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                    }`}
                  >
                    {b.unlocked ? 'Unlocked' : 'In Progress'}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{b.description}</p>

              {!b.unlocked && (
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                    <span>Progress</span>
                    <span>{b.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full"
                      style={{ width: `${b.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
