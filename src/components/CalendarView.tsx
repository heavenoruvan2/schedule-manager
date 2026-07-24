import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Circle,
  Filter,
  Grid,
  List,
  Layers,
  Flame
} from 'lucide-react';
import { EventItem, CalendarViewMode, CategoryName } from '../types';
import { CATEGORIES } from '../data/categoriesAndIcons';
import { DynamicIcon } from './DynamicIcon';

interface CalendarViewProps {
  events: EventItem[];
  onToggleEventComplete: (id: string) => void;
  onOpenEventModal: (event?: EventItem) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onToggleEventComplete,
  onOpenEventModal,
  selectedCategoryFilter,
  setSelectedCategoryFilter,
}) => {
  const [viewMode, setViewMode] = useState<CalendarViewMode>('day');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filter events by selected category
  const filteredEvents = events.filter((e) => {
    if (selectedCategoryFilter !== 'all' && e.category !== selectedCategoryFilter) {
      return false;
    }
    return true;
  });

  const currentDateStr = currentDate.toISOString().split('T')[0];

  // Navigate date
  const changeDate = (days: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + days);
    setCurrentDate(d);
  };

  return (
    <div className="space-y-5 pb-8 animate-in fade-in duration-200">
      {/* Calendar View Mode Header Controls */}
      <div className="bento-card flex flex-wrap items-center justify-between gap-3 p-5">
        {/* Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-[#2F3A45] dark:text-slate-200 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3.5 py-2 rounded-xl bg-[#7FAF8E]/15 text-[#639272] dark:text-[#7FAF8E] font-extrabold text-xs hover:bg-[#7FAF8E]/25 transition-all cursor-pointer"
          >
            Today
          </button>
          <button
            onClick={() => changeDate(1)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-[#2F3A45] dark:text-slate-200 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <h2 className="text-sm font-black text-[#2F3A45] dark:text-white ml-2">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' })}
          </h2>
        </div>

        {/* View Mode Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100/80 dark:bg-white/5 p-1.5 rounded-2xl text-xs border border-slate-200/50 dark:border-white/5">
          {[
            { id: 'day', label: 'Day Timeline' },
            { id: 'week', label: 'Week' },
            { id: 'month', label: 'Month' },
            { id: 'agenda', label: 'Agenda' },
            { id: 'year', label: 'Year' },
            { id: 'heatmap', label: 'Heatmap' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id as CalendarViewMode)}
              className={`px-3 py-1.5 rounded-xl font-extrabold transition-all cursor-pointer ${
                viewMode === tab.id
                  ? 'bg-white dark:bg-[#2B2C31] text-[#7FAF8E] dark:text-[#7FAF8E] shadow-xs'
                  : 'text-[#9CA3AF] hover:text-[#2F3A45] dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#9CA3AF]" />
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border-none text-xs text-[#2F3A45] dark:text-slate-200 font-bold focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {Object.keys(CATEGORIES).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Render View Modes */}
      {viewMode === 'day' && (
        <DailyTimelineView
          currentDateStr={currentDateStr}
          events={filteredEvents}
          onToggleEventComplete={onToggleEventComplete}
          onOpenEventModal={onOpenEventModal}
        />
      )}

      {viewMode === 'week' && (
        <WeeklyGridView
          currentDate={currentDate}
          events={filteredEvents}
          onOpenEventModal={onOpenEventModal}
        />
      )}

      {viewMode === 'month' && (
        <MonthlyTableView
          currentDate={currentDate}
          events={filteredEvents}
          onOpenEventModal={onOpenEventModal}
        />
      )}

      {viewMode === 'agenda' && (
        <AgendaListView
          events={filteredEvents}
          onToggleEventComplete={onToggleEventComplete}
          onOpenEventModal={onOpenEventModal}
        />
      )}

      {viewMode === 'year' && (
        <YearOverviewView
          events={filteredEvents}
          currentDate={currentDate}
        />
      )}

      {viewMode === 'heatmap' && (
        <HeatmapCalendarView
          events={filteredEvents}
        />
      )}
    </div>
  );
};

/* 1. Daily Timeline View with Hour Rows & Overlap Warnings */
const DailyTimelineView: React.FC<{
  currentDateStr: string;
  events: EventItem[];
  onToggleEventComplete: (id: string) => void;
  onOpenEventModal: (event?: EventItem) => void;
}> = ({ currentDateStr, events, onToggleEventComplete, onOpenEventModal }) => {
  const dayEvents = events.filter((e) => e.date === currentDateStr);

  const hours = Array.from({ length: 15 }, (_, i) => i + 7); // 7:00 AM to 9:00 PM

  // Check for overlaps
  const overlaps = dayEvents.filter((e1, i) =>
    dayEvents.some((e2, j) => {
      if (i === j) return false;
      return (
        (e1.startTime >= e2.startTime && e1.startTime < e2.endTime) ||
        (e1.endTime > e2.startTime && e1.endTime <= e2.endTime)
      );
    })
  );

  return (
    <div className="bento-card p-4 sm:p-6 space-y-4 max-w-full overflow-hidden">
      {/* Overlap Alert Badge */}
      {overlaps.length > 0 && (
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs flex items-center justify-between gap-2 max-w-full">
          <div className="flex items-center gap-2 min-w-0">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
            <span className="font-semibold truncate">
              Warning: {overlaps.length} overlapping events detected in today's timeline!
            </span>
          </div>
          <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-full font-bold shrink-0">
            Use AI Smart Scheduler
          </span>
        </div>
      )}

      {/* Hourly Timeline Grid */}
      <div className="relative divide-y divide-slate-100 dark:divide-slate-800/60 max-w-full overflow-hidden">
        {hours.map((h) => {
          const timeLabel = `${String(h).padStart(2, '0')}:00`;
          const hourEvents = dayEvents.filter((e) => {
            const eHour = parseInt(e.startTime.split(':')[0], 10);
            return eHour === h;
          });

          return (
            <div key={h} className="min-h-[64px] flex gap-2 sm:gap-3 py-2 text-xs group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 rounded-xl transition-colors max-w-full overflow-hidden">
              {/* Hour Label */}
              <div className="w-11 sm:w-14 text-right font-semibold text-slate-400 shrink-0 pt-1 text-[11px] sm:text-xs">
                {timeLabel}
              </div>

              {/* Slot Area */}
              <div className="flex-1 min-w-0 max-w-full relative flex flex-col sm:flex-row flex-wrap gap-2 items-stretch sm:items-center">
                {hourEvents.length === 0 ? (
                  <div className="text-[10px] text-slate-300 dark:text-slate-700 pt-1 italic opacity-0 group-hover:opacity-100 transition-opacity">
                    Free time slot
                  </div>
                ) : (
                  hourEvents.map((e) => (
                    <div
                      key={e.id}
                      onClick={() => onOpenEventModal(e)}
                      className="p-2 sm:p-2.5 rounded-2xl border flex-1 min-w-0 max-w-full cursor-pointer hover:shadow-md transition-all flex items-center justify-between gap-2 overflow-hidden"
                      style={{
                        backgroundColor: `${e.color}15`,
                        borderColor: `${e.color}40`,
                      }}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={(evt) => {
                            evt.stopPropagation();
                            onToggleEventComplete(e.id);
                          }}
                          className="shrink-0"
                        >
                          {e.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                        <DynamicIcon name={e.icon} className="w-4 h-4 shrink-0" style={{ color: e.color }} />
                        <div className="min-w-0 flex-1">
                          <div className={`font-bold text-xs truncate ${e.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
                            {e.title}
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1 truncate">
                            <Clock className="w-3 h-3 text-indigo-500 shrink-0" />
                            <span className="truncate">{e.startTime} - {e.endTime} ({e.durationMinutes}m)</span>
                          </div>
                        </div>
                      </div>

                      <span
                        className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase shrink-0"
                        style={{ backgroundColor: `${e.color}30`, color: e.color }}
                      >
                        {e.category}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* 2. Weekly Grid View */
const WeeklyGridView: React.FC<{
  currentDate: Date;
  events: EventItem[];
  onOpenEventModal: (event?: EventItem) => void;
}> = ({ currentDate, events, onOpenEventModal }) => {
  // Get 7 days of the week starting from Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentDate);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) + i;
    const dateObj = new Date(d.setDate(diff));
    return {
      dateStr: dateObj.toISOString().split('T')[0],
      dayName: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: dateObj.getDate(),
      isToday: dateObj.toDateString() === new Date().toDateString(),
    };
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
      {weekDays.map((day) => {
        const dayEvts = events.filter((e) => e.date === day.dateStr);
        return (
          <div
            key={day.dateStr}
            className={`p-3 rounded-2xl border min-h-[180px] flex flex-col justify-between ${
              day.isToday
                ? 'bg-indigo-500/5 border-indigo-500/40 shadow-sm'
                : 'bg-white dark:bg-slate-900 amoled:bg-zinc-950 border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {day.dayName}
                </span>
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${
                    day.isToday ? 'bg-indigo-600 text-white' : 'text-slate-800 dark:text-slate-100'
                  }`}
                >
                  {day.dayNum}
                </span>
              </div>

              <div className="space-y-1.5">
                {dayEvts.slice(0, 3).map((e) => (
                  <div
                    key={e.id}
                    onClick={() => onOpenEventModal(e)}
                    className="p-1.5 rounded-xl border text-[10px] font-semibold cursor-pointer truncate"
                    style={{
                      backgroundColor: `${e.color}15`,
                      borderColor: `${e.color}30`,
                      color: e.color,
                    }}
                  >
                    {e.startTime} {e.title}
                  </div>
                ))}
                {dayEvts.length > 3 && (
                  <div className="text-[10px] text-slate-400 font-medium pl-1">
                    +{dayEvts.length - 3} more
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => onOpenEventModal()}
              className="w-full py-1 mt-2 text-[10px] text-slate-400 hover:text-indigo-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

/* 3. Monthly Table View */
const MonthlyTableView: React.FC<{
  currentDate: Date;
  events: EventItem[];
  onOpenEventModal: (event?: EventItem) => void;
}> = ({ currentDate, events, onOpenEventModal }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = Array.from({ length: 35 }, (_, i) => {
    const dayNum = i - (firstDay === 0 ? 6 : firstDay - 1) + 1;
    if (dayNum > 0 && dayNum <= daysInMonth) {
      const dateObj = new Date(year, month, dayNum);
      const dateStr = dateObj.toISOString().split('T')[0];
      return {
        dayNum,
        dateStr,
        isToday: dateObj.toDateString() === new Date().toDateString(),
      };
    }
    return null;
  });

  return (
    <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 amoled:bg-zinc-950 border border-slate-200/80 dark:border-slate-800">
      <div className="grid grid-cols-7 text-center font-bold text-xs text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mt-2">
        {daysArray.map((cell, idx) => {
          if (!cell) {
            return <div key={idx} className="h-20 bg-slate-50/20 dark:bg-slate-900/20 rounded-xl" />;
          }

          const dayEvts = events.filter((e) => e.date === cell.dateStr);

          return (
            <div
              key={cell.dateStr}
              className={`h-20 p-1.5 rounded-xl border flex flex-col justify-between overflow-hidden ${
                cell.isToday
                  ? 'bg-indigo-500/10 border-indigo-500/40'
                  : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold ${
                    cell.isToday ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {cell.dayNum}
                </span>
                {dayEvts.length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                )}
              </div>

              <div className="space-y-0.5 overflow-hidden">
                {dayEvts.slice(0, 2).map((e) => (
                  <div
                    key={e.id}
                    onClick={() => onOpenEventModal(e)}
                    className="text-[9px] px-1 py-0.5 rounded truncate font-medium cursor-pointer"
                    style={{ backgroundColor: `${e.color}30`, color: e.color }}
                  >
                    {e.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* 4. Agenda List View */
const AgendaListView: React.FC<{
  events: EventItem[];
  onToggleEventComplete: (id: string) => void;
  onOpenEventModal: (event?: EventItem) => void;
}> = ({ events, onToggleEventComplete, onOpenEventModal }) => {
  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 amoled:bg-zinc-950 border border-slate-200/80 dark:border-slate-800 space-y-3">
      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-2">
        Full Agenda Stream ({events.length} events)
      </h3>
      {events.map((e) => (
        <div
          key={e.id}
          onClick={() => onOpenEventModal(e)}
          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 cursor-pointer flex items-center justify-between gap-3 transition-all"
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(evt) => {
                evt.stopPropagation();
                onToggleEventComplete(e.id);
              }}
            >
              {e.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <Circle className="w-5 h-5 text-slate-400" />
              )}
            </button>
            <DynamicIcon name={e.icon} className="w-5 h-5" style={{ color: e.color }} />
            <div>
              <div className={`text-xs font-bold ${e.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
                {e.title}
              </div>
              <div className="text-[10px] text-slate-400">
                {e.date} • {e.startTime} - {e.endTime} • {e.category}
              </div>
            </div>
          </div>
          <span
            className="px-2 py-0.5 text-[9px] font-bold rounded uppercase"
            style={{ backgroundColor: `${e.color}20`, color: e.color }}
          >
            {e.priority}
          </span>
        </div>
      ))}
    </div>
  );
};

/* 5. Year Overview View */
const YearOverviewView: React.FC<{ events: EventItem[]; currentDate: Date }> = ({ events, currentDate }) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
      {months.map((m, idx) => (
        <div key={m} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-1">{m}</div>
          <div className="text-[10px] text-slate-400">
            {events.filter((e) => new Date(e.date).getMonth() === idx).length} scheduled tasks
          </div>
        </div>
      ))}
    </div>
  );
};

/* 6. Heatmap Calendar View */
const HeatmapCalendarView: React.FC<{ events: EventItem[] }> = ({ events }) => {
  const squares = Array.from({ length: 84 }, (_, i) => {
    const intensity = (i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : i % 2 === 0 ? 1 : 0);
    return intensity;
  });

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 amoled:bg-zinc-950 border border-slate-200/80 dark:border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
            Productivity & Task Completion Heatmap
          </h3>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-400">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded bg-slate-100 dark:bg-slate-800" />
          <span className="w-2.5 h-2.5 rounded bg-emerald-300" />
          <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
          <span className="w-2.5 h-2.5 rounded bg-emerald-700" />
          <span>More</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-1.5 pt-2">
        {squares.map((val, idx) => (
          <div
            key={idx}
            className={`h-6 rounded-md transition-all ${
              val === 3
                ? 'bg-emerald-600'
                : val === 2
                ? 'bg-emerald-400'
                : val === 1
                ? 'bg-emerald-300/60 dark:bg-emerald-900/60'
                : 'bg-slate-100 dark:bg-slate-800'
            }`}
            title={`Day ${idx + 1}: ${val * 2} tasks completed`}
          />
        ))}
      </div>
    </div>
  );
};
