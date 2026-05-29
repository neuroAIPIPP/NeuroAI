'use client';

import { Loader2, Pause, Play, RotateCw, Square } from 'lucide-react';
import React from 'react';

interface SessionHeaderProps {
  isActive: boolean;
  onToggleActive: () => void;
  elapsedTime: number;
  formatTime: (seconds: number) => string;
  onRecalibrate: () => void;
  onSaveSession: () => void;
  isSaving: boolean;
  canEndSession: boolean;
}

export default function SessionHeader({
  isActive,
  onToggleActive,
  elapsedTime,
  formatTime,
  onRecalibrate,
  onSaveSession,
  isSaving,
  canEndSession,
}: SessionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
      <div>
        <h1 className="text-[2.75rem] font-bold text-[#2A3441] tracking-tight mb-2">
          Session
        </h1>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onRecalibrate}
          className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
          title="Ulangi Kalibrasi Eye Tracking"
        >
          <RotateCw className="w-4 h-4 text-gray-500" />
          Recalibrate
        </button>
        <button
          onClick={onToggleActive}
          className="px-6 py-2.5 rounded-full bg-[#E2E8D5] text-[#4D5E3A] text-sm font-bold flex items-center gap-2 hover:bg-[#D5DCC6] transition-colors"
        >
          {isActive ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {isActive
            ? 'Pause Session'
            : elapsedTime === 0
              ? 'Start Session'
              : 'Resume Session'}
        </button>
        <button
          disabled={!canEndSession || isSaving}
          onClick={onSaveSession}
          className={`px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${
            !canEndSession || isSaving
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-70'
              : 'bg-[#3B526A] text-white hover:bg-[#2C3F53] shadow-md'
          }`}
          title={
            !canEndSession
              ? 'Harus menyelesaikan semua video dan survey untuk mengakhiri sesi'
              : 'Akhiri sesi dan simpan data'
          }
        >
          {isSaving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Square className="w-3.5 h-3.5 fill-current" />
          )}
          {isSaving ? 'Saving...' : 'End Session'}
        </button>
      </div>
    </div>
  );
}
