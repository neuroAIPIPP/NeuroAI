'use client';

import { AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import React from 'react';

import { CalibrationStatus } from './CalibrationStatusBadge';

interface CalibrationVisualProps {
  status: CalibrationStatus;
  errorMsg: string;
  onRetry: () => void;
  onStartCalibration: () => void;
}

export default function CalibrationVisual({
  status,
  errorMsg,
  onRetry,
  onStartCalibration,
}: CalibrationVisualProps) {
  if (status === 'error') {
    return (
      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
        <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center mb-8">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        <p className="text-[#64748B] text-center mb-8 font-medium">
          {errorMsg}
        </p>
        <button
          onClick={onRetry}
          className="px-8 py-3 bg-[#3B526A] text-white rounded-full font-bold flex items-center gap-2 hover:bg-[#2C3F53] transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  if (status === 'ready') {
    return (
      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
        <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mb-8">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <p className="text-[#64748B] text-center mb-8 font-medium">
          All systems operational. Click below to start visual calibration.
        </p>
        <button
          onClick={onStartCalibration}
          className="px-8 py-3 bg-[#8EACCD] text-white rounded-full font-bold hover:bg-[#7A9BBF] transition-all shadow-lg"
        >
          Start Calibration
        </button>
      </div>
    );
  }

  if (status === 'calibrating' || status === 'checking') {
    return (
      <div
        className={`relative flex items-center justify-center w-80 h-80 transition-opacity duration-500 ${status === 'checking' ? 'opacity-30 grayscale' : 'opacity-100'}`}
      >
        {/* Outer Ring */}
        <div className="absolute inset-0 border-2 border-[#8EACCD]/30 rounded-full animate-[pulse_3s_infinite]" />

        {/* Inner Circle */}
        <div className="w-64 h-64 border-2 border-[#8EACCD] rounded-full flex items-center justify-center bg-white/50 backdrop-blur-sm shadow-xl">
          {/* Center Point */}
          <div className="w-4 h-4 bg-[#2A3441] rounded-full shadow-[0_0_15px_rgba(42,52,65,0.4)]" />
        </div>

        {status === 'calibrating' && (
          <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-[#8EACCD] to-transparent top-1/2 -translate-y-1/2 animate-[scan_4s_linear_infinite]" />
        )}
      </div>
    );
  }

  return null;
}
