'use client';

import { RefreshCw } from 'lucide-react';
import React from 'react';

interface FaceCameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  isActive?: boolean;
}

export default function FaceCameraPreview({
  videoRef,
  stream,
  isActive = true,
}: FaceCameraPreviewProps) {
  return (
    <div className="relative bg-[#2A3441] rounded-2xl overflow-hidden aspect-video mb-6 flex items-center justify-center border border-gray-200 shadow-inner">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
      />
      {!stream ? (
        <div className="flex flex-col items-center gap-3 text-white/70 z-10">
          <RefreshCw className="w-8 h-8 animate-spin text-[#8EACCD]" />
          <p className="font-medium text-sm">Meminta akses kamera...</p>
        </div>
      ) : (
        <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-black/40 backdrop-blur-md text-white text-[10px] font-bold z-10 border border-white/10">
          <span
            className={`w-1.5 h-1.5 rounded-full ${stream.active && isActive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}
          />
          Live Video
        </div>
      )}
    </div>
  );
}
