import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Clock, 
  Calendar, 
  MapPin, 
  Bell, 
  Repeat, 
  Paperclip, 
  Mic, 
  CheckSquare, 
  Plus, 
  Trash2, 
  Check, 
  Tag, 
  AlertCircle,
  Pin,
  Sparkles
} from 'lucide-react';
import { EventItem, CategoryName, Priority, ReminderType, RepeatOption } from '../types';
import { CATEGORIES, ICON_LIBRARY } from '../data/categoriesAndIcons';
import { DynamicIcon } from './DynamicIcon';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: EventItem) => void;
  onDelete?: (id: string) => void;
  initialEvent?: EventItem | null;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialEvent,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<CategoryName>('Study');
  const [icon, setIcon] = useState('BookOpen');
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('');
  const [reminderMinutes, setReminderMinutes] = useState(15);
  const [reminderType, setReminderType] = useState<ReminderType>('notification');
  const [repeat, setRepeat] = useState<RepeatOption>('none');
  const [pinned, setPinned] = useState(false);
  const [checklist, setChecklist] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [attachments, setAttachments] = useState<{ id: string; name: string; type: 'photo' | 'voice' | 'file' }[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title || '');
      setDescription(initialEvent.description || '');
      setDate(initialEvent.date || new Date().toISOString().split('T')[0]);
      setStartTime(initialEvent.startTime || '09:00');
      setEndTime(initialEvent.endTime || '10:00');
      setPriority(initialEvent.priority || 'medium');
      setCategory(initialEvent.category || 'Study');
      setIcon(initialEvent.icon || 'BookOpen');
      setNotes(initialEvent.notes || '');
      setLocation(initialEvent.location || '');
      setReminderMinutes(initialEvent.reminderMinutesBefore ?? 15);
      setReminderType(initialEvent.reminderType || 'notification');
      setRepeat(initialEvent.repeat || 'none');
      setPinned(initialEvent.pinned || false);
      setChecklist(initialEvent.checklist || []);
      setAttachments(initialEvent.attachments || []);
    } else {
      // Default blank event
      setTitle('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setStartTime('10:00');
      setEndTime('11:00');
      setPriority('medium');
      setCategory('Study');
      setIcon('BookOpen');
      setNotes('');
      setLocation('');
      setReminderMinutes(15);
      setReminderType('notification');
      setRepeat('none');
      setPinned(false);
      setChecklist([]);
      setAttachments([]);
    }
  }, [initialEvent, isOpen]);

  if (!isOpen) return null;

  // Calculate duration in minutes
  const calcDuration = () => {
    const [sH, sM] = startTime.split(':').map(Number);
    const [eH, eM] = endTime.split(':').map(Number);
    const startMins = sH * 60 + sM;
    const endMins = eH * 60 + eM;
    const diff = endMins - startMins;
    return diff > 0 ? diff : 60;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const catConfig = CATEGORIES[category] || CATEGORIES['Study'];

    const eventToSave: EventItem = {
      id: initialEvent?.id || `evt-${Date.now()}`,
      title: title.trim(),
      description,
      date,
      startTime,
      endTime,
      durationMinutes: calcDuration(),
      priority,
      category,
      color: catConfig.color,
      icon,
      notes,
      checklist,
      attachments,
      location,
      reminderMinutesBefore: Number(reminderMinutes),
      reminderType,
      repeat,
      completed: initialEvent?.completed || false,
      pinned,
      archived: initialEvent?.archived || false,
    };

    onSave(eventToSave);
    onClose();
  };

  const addChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    setChecklist([
      ...checklist,
      { id: `c-${Date.now()}`, text: newChecklistText.trim(), completed: false },
    ]);
    setNewChecklistText('');
  };

  const toggleChecklist = (id: string) => {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const removeChecklist = (id: string) => {
    setChecklist(checklist.filter((item) => item.id !== id));
  };

  const toggleVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setAttachments([
        ...attachments,
        { id: `att-${Date.now()}`, name: `Voice Note (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`, type: 'voice' },
      ]);
    } else {
      setIsRecording(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white dark:bg-[#23252A] amoled:bg-zinc-950 border border-slate-200 dark:border-white/10 amoled:border-zinc-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto"
          >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowIconPicker(!showIconPicker)}
              className="p-2.5 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 transition-all border border-indigo-500/20 flex items-center gap-1.5"
              title="Click to change icon"
            >
              <DynamicIcon name={icon} className="w-5 h-5" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500">
                Icon
              </span>
            </button>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                {initialEvent ? 'Edit Event' : 'Create New Event'}
              </h2>
              <p className="text-xs text-slate-400">Configure schedule, reminders, and category</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPinned(!pinned)}
              className={`p-2 rounded-xl transition-all ${
                pinned
                  ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600'
              }`}
              title={pinned ? 'Pinned Event' : 'Pin to Top'}
            >
              <Pin className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Icon Selector Overlay Grid */}
          {showIconPicker && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-indigo-500/20 mb-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Select Event Icon
                </span>
                <button
                  type="button"
                  onClick={() => setShowIconPicker(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  Close
                </button>
              </div>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {ICON_LIBRARY.map((grp) => (
                  <div key={grp.group}>
                    <div className="text-[10px] font-semibold text-slate-400 mb-1.5">{grp.group}</div>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {grp.icons.map((ic) => (
                        <button
                          key={ic.name}
                          type="button"
                          onClick={() => {
                            setIcon(ic.name);
                            setShowIconPicker(false);
                          }}
                          className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${
                            icon === ic.name
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <DynamicIcon name={ic.name} className="w-4 h-4" />
                          <span className="text-[9px] truncate max-w-full">{ic.label.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Event Title */}
          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CS201 Machine Learning Lecture"
              className="w-full px-3 py-2 text-sm font-medium rounded-xl bg-slate-50 dark:bg-slate-800/80 amoled:bg-zinc-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary or goals for this event..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 amoled:bg-zinc-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Category Selector */}
            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const catName = e.target.value as CategoryName;
                  setCategory(catName);
                  if (CATEGORIES[catName]?.icon) {
                    setIcon(CATEGORIES[catName].icon);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 amoled:bg-zinc-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                {Object.keys(CATEGORIES).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Selector */}
            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-indigo-500" />
                Priority
              </label>
              <div className="flex items-center gap-1.5">
                {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-2 rounded-xl capitalize font-semibold border transition-all ${
                      priority === p
                        ? p === 'high'
                          ? 'bg-red-500 text-white border-red-500'
                          : p === 'medium'
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Date, Start Time, End Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 amoled:bg-zinc-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                Start Time
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 amoled:bg-zinc-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                End Time
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 amoled:bg-zinc-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Location & Reminders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Room 302 / Zoom link"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 amoled:bg-zinc-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <Bell className="w-3.5 h-3.5 text-indigo-500" />
                Reminder
              </label>
              <div className="flex gap-2">
                <select
                  value={reminderMinutes}
                  onChange={(e) => setReminderMinutes(Number(e.target.value))}
                  className="w-1/2 px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 amoled:bg-zinc-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                >
                  <option value={1}>1 min before</option>
                  <option value={5}>5 mins before</option>
                  <option value={10}>10 mins before</option>
                  <option value={15}>15 mins before</option>
                  <option value={30}>30 mins before</option>
                  <option value={60}>1 hour before</option>
                </select>
                <select
                  value={reminderType}
                  onChange={(e) => setReminderType(e.target.value as ReminderType)}
                  className="w-1/2 px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 amoled:bg-zinc-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                >
                  <option value="notification">Notification</option>
                  <option value="voice">Voice Reminder</option>
                  <option value="fullscreen">Full Screen</option>
                  <option value="alarm">Alarm Sound</option>
                  <option value="persistent">Persistent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Repeat Schedule */}
          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1 flex items-center gap-1">
              <Repeat className="w-3.5 h-3.5 text-indigo-500" />
              Repeat Schedule
            </label>
            <div className="flex gap-2">
              {(['none', 'daily', 'weekly', 'monthly', 'custom'] as RepeatOption[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRepeat(r)}
                  className={`flex-1 py-1.5 rounded-xl capitalize font-medium border text-[11px] transition-all ${
                    repeat === r
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Checklist Subtasks */}
          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
                Subtask Checklist ({checklist.filter((c) => c.completed).length}/{checklist.length})
              </span>
            </label>
            <div className="space-y-1.5 mb-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80"
                >
                  <button
                    type="button"
                    onClick={() => toggleChecklist(item.id)}
                    className="flex items-center gap-2 flex-1 text-left"
                  >
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        item.completed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-xs ${
                        item.completed
                          ? 'line-through text-slate-400'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {item.text}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeChecklist(item.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addChecklistItem();
                  }
                }}
                placeholder="Add subtask step..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={addChecklistItem}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Voice Memo & Attachments */}
          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Paperclip className="w-3.5 h-3.5 text-indigo-500" />
                Attachments & Voice Memos
              </span>
            </label>
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  isRecording
                    ? 'bg-red-500 text-white border-red-500 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isRecording ? 'Recording... (Click Stop)' : 'Record Voice Memo'}</span>
              </button>
            </div>
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="px-2.5 py-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-medium flex items-center gap-1.5 border border-indigo-500/20"
                  >
                    <Mic className="w-3 h-3" />
                    <span>{att.name}</span>
                    <button
                      type="button"
                      onClick={() => setAttachments(attachments.filter((a) => a.id !== att.id))}
                      className="hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
              Notes & Key Details
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detailed notes, links, passwords, or preparation steps..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-900/50">
          {initialEvent && onDelete ? (
            <button
              type="button"
              onClick={() => {
                onDelete(initialEvent.id);
                onClose();
              }}
              className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-medium text-xs flex items-center gap-1 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{initialEvent ? 'Update Event' : 'Save Event'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
};
