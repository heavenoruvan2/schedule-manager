import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Upload, RefreshCw, Calendar as CalendarIcon, Check, X, FileText, Database } from 'lucide-react';
import { EventItem } from '../types';

interface ExportSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: EventItem[];
  onImportEvents: (imported: EventItem[]) => void;
  onResetSampleData: () => void;
}

export const ExportSyncModal: React.FC<ExportSyncModalProps> = ({
  isOpen,
  onClose,
  events,
  onImportEvents,
  onResetSampleData,
}) => {
  const [googleCalendarSynced, setGoogleCalendarSynced] = useState(true);
  const [copiedStatus, setCopiedStatus] = useState(false);

  if (!isOpen) return null;

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(events, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `focusflow_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    const headers = ["Title", "Date", "Start Time", "End Time", "Category", "Priority", "Completed"];
    const rows = events.map(e => [
      `"${e.title}"`,
      e.date,
      e.startTime,
      e.endTime,
      e.category,
      e.priority,
      e.completed ? "Yes" : "No"
    ].join(","));
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", encodeURI(csvContent));
    downloadAnchor.setAttribute("download", `focusflow_schedule_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportEvents(parsed);
          alert("Successfully imported events backup!");
          onClose();
        }
      } catch (err) {
        alert("Invalid JSON file format.");
      }
    };
    reader.readAsText(file);
  };

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
            className="bg-white dark:bg-[#23252A] amoled:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-5"
          >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
              Data Sync, Backup & Export
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Google Calendar Sync */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-5 h-5 text-indigo-500" />
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Google Calendar Sync</div>
              <div className="text-[10px] text-slate-400">Bidirectional event synchronization</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setGoogleCalendarSynced(!googleCalendarSynced)}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              googleCalendarSynced ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              googleCalendarSynced ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Export Buttons */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-600 dark:text-slate-300">Export Schedule Data</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={exportJSON}
              className="py-2.5 px-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center gap-1.5 border border-indigo-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON Backup</span>
            </button>
            <button
              onClick={exportCSV}
              className="py-2.5 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold text-xs flex items-center justify-center gap-1.5 border border-purple-500/20"
            >
              <FileText className="w-4 h-4" />
              <span>Export CSV File</span>
            </button>
          </div>
        </div>

        {/* Import Backup */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-600 dark:text-slate-300">Restore from Backup</div>
          <label className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Upload Backup .JSON File</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Re-seed Sample Data */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              onResetSampleData();
              onClose();
            }}
            className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Sample Schedule</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
};
