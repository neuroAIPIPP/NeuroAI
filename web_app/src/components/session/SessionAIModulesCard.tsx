'use client';

import { TrackingData } from '@/hooks/useEyeTracking';
import { Brain, Eye, ScanFace } from 'lucide-react';
import React from 'react';

interface SessionAIModulesCardProps {
  eegRecording: boolean;
  eegMode: string | null;
  isTracking: boolean;
  error: string | null;
  trackingData: TrackingData | null;
  faceVerified: boolean;
  faceVerifyResult: { name: string } | null;
}

export default function SessionAIModulesCard({
  eegRecording,
  eegMode,
  isTracking,
  error,
  trackingData,
  faceVerified,
  faceVerifyResult,
}: SessionAIModulesCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-sm font-bold text-[#2A3441] mb-3 uppercase tracking-wider">
        AI Modules
      </h3>
      <div className="space-y-3">
        {/* EEG Status */}
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${eegRecording ? 'bg-green-100' : 'bg-gray-100'}`}
          >
            <Brain
              className={`w-4 h-4 ${eegRecording ? 'text-green-600' : 'text-gray-400'}`}
            />
          </div>
          <div>
            <p className="text-xs font-bold text-[#2A3441]">EEG Recording</p>
            <p
              className={`text-[10px] ${eegRecording ? (eegMode === 'Real' ? 'text-green-600' : 'text-amber-500') : 'text-gray-400'}`}
            >
              {eegRecording
                ? `● Recording (${eegMode || 'Checking...'})`
                : '○ Inactive'}
            </p>
          </div>
        </div>

        {/* Eye Tracking Status */}
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${isTracking ? 'bg-blue-100' : error ? 'bg-red-100' : 'bg-gray-100'}`}
          >
            <Eye
              className={`w-4 h-4 ${isTracking ? 'text-blue-600' : error ? 'text-red-500' : 'text-gray-400'}`}
            />
          </div>
          <div>
            <p className="text-xs font-bold text-[#2A3441]">Eye Tracking</p>
            <p
              className={`text-[10px] ${isTracking ? 'text-blue-600' : error ? 'text-red-500 font-medium' : 'text-gray-400'}`}
            >
              {isTracking
                ? `● Tracking (${trackingData?.gazeDirection || 'center'})`
                : error
                  ? `⚠️ Error: ${error}`
                  : '○ Inactive'}
            </p>
          </div>
        </div>

        {/* Face Recognition Status */}
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${faceVerified ? 'bg-emerald-100' : faceVerifyResult === null && eegRecording ? 'bg-gray-100' : 'bg-rose-100'}`}
          >
            <ScanFace
              className={`w-4 h-4 ${faceVerified ? 'text-emerald-600' : faceVerifyResult === null && eegRecording ? 'text-gray-400' : 'text-rose-500'}`}
            />
          </div>
          <div>
            <p className="text-xs font-bold text-[#2A3441]">Face Recognition</p>
            <p
              className={`text-[10px] ${faceVerified ? 'text-emerald-600 font-medium' : faceVerifyResult === null && eegRecording ? 'text-gray-400' : eegRecording ? 'text-rose-500 font-medium' : 'text-gray-400'}`}
            >
              {!eegRecording
                ? '○ Standby'
                : faceVerified
                  ? `● Verified (${faceVerifyResult?.name})`
                  : '⚠️ Not Recognized'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
