'use client';

import React from 'react';

interface SessionStatusCardProps {
  isActive: boolean;
  showSurvey: boolean;
  elapsedTime: number;
  formatTime: (seconds: number) => string;
}

export default function SessionStatusCard({
  isActive,
  showSurvey,
  elapsedTime,
  formatTime,
}: SessionStatusCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div
          className={`w-3 h-3 rounded-full ${isActive && !showSurvey ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}
        />
        <div>
          <p className="text-sm font-bold text-[#2A3441]">
            {isActive && !showSurvey ? 'Session Active' : 'Session Paused'}
          </p>
          <p className="text-[12px] text-gray-500 font-medium">
            Tracking biometric responses
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-mono font-bold text-[#2A3441]">
          {formatTime(elapsedTime)}
        </p>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Elapsed Time
        </p>
      </div>
    </div>
  );
}
