'use client';

import { TrackingData } from '@/hooks/useEyeTracking';
import React from 'react';

interface SessionWebcamSectionProps {
  webcamVideoRef: React.RefObject<HTMLVideoElement | null>;
  isActive: boolean;
  trackingData: TrackingData | null;
}

export default function SessionWebcamSection({
  webcamVideoRef,
  isActive,
  trackingData,
}: SessionWebcamSectionProps) {
  return (
    <div className="relative aspect-video bg-[#2A3441] rounded-3xl overflow-hidden shadow-lg border border-gray-200">
      <video
        ref={webcamVideoRef}
        className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
        muted
        playsInline
        autoPlay
      />
      <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-2 py-1 rounded bg-black/40 backdrop-blur-md text-white text-[10px] font-bold z-10">
        <span
          className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}
        />
        Tracking Active
      </div>

      {/* Mock Gaze Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="w-32 h-32 border border-[#8EACCD]/30 rounded-full flex items-center justify-center">
          <div className="w-1 h-1 bg-[#8EACCD] rounded-full shadow-[0_0_10px_#8EACCD]" />
        </div>
      </div>

      <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/10 z-10 pointer-events-none">
        <p className="text-[8px] font-bold text-white/60 uppercase tracking-widest mb-1">
          Eye Gaze Vector
        </p>
        <div className="flex gap-4">
          <span className="text-[10px] font-mono text-[#8EACCD]">
            X:{' '}
            {trackingData?.screenX && typeof window !== 'undefined'
              ? (trackingData.screenX / window.innerWidth).toFixed(3)
              : '0.000'}
          </span>
          <span className="text-[10px] font-mono text-[#8EACCD]">
            Y:{' '}
            {trackingData?.screenY && typeof window !== 'undefined'
              ? (trackingData.screenY / window.innerHeight).toFixed(3)
              : '0.000'}
          </span>
        </div>
      </div>
    </div>
  );
}
