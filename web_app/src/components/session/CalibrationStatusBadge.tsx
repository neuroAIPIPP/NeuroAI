'use client';

import { AlertTriangle, Loader2 } from 'lucide-react';
import React from 'react';

export type CalibrationStatus = 'checking' | 'ready' | 'error' | 'calibrating';

interface CalibrationStatusBadgeProps {
  status: CalibrationStatus;
  progress: number;
}

export default function CalibrationStatusBadge({
  status,
  progress,
}: CalibrationStatusBadgeProps) {
  return (
    <div className="mb-12 flex flex-col items-center text-center max-w-md">
      {status === 'checking' && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold mb-4">
          <Loader2 className="w-3 h-3 animate-spin" />
          Verifying Hardware...
        </div>
      )}

      {status === 'error' && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-[11px] font-bold mb-4">
          <AlertTriangle className="w-3 h-3" />
          Hardware Error
        </div>
      )}

      {(status === 'ready' || status === 'calibrating') && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-[11px] font-bold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          {status === 'calibrating' ? 'Calibrating...' : 'Hardware Ready'}
        </div>
      )}

      <h1 className="text-4xl font-bold text-[#2A3441] mb-4">
        {status === 'error' ? 'Calibration Blocked' : 'Visual Synchrony'}
      </h1>

      {status === 'calibrating' && (
        <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-[#8EACCD] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
