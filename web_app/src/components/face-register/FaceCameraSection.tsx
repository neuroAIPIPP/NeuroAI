'use client';

import React from 'react';

import FaceCameraPreview from './FaceCameraPreview';
import FaceRegisterForm from './FaceRegisterForm';

interface FaceCameraSectionProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  displayName: string;
  isRegistering: boolean;
  backendAvailable: boolean;
  statusMsg: {
    type: 'success' | 'error' | '';
    text: string;
  };
  onRegister: () => void;
}

export default function FaceCameraSection({
  videoRef,
  stream,
  displayName,
  isRegistering,
  backendAvailable,
  statusMsg,
  onRegister,
}: FaceCameraSectionProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col relative overflow-hidden h-full">
      {/* Decorative top right corner element */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full translate-x-1/2 -translate-y-1/2"></div>

      <div className="relative z-10 flex flex-col h-full">
        <h2 className="text-2xl font-bold text-[#2A3441] mb-6">Live Camera</h2>

        <FaceCameraPreview videoRef={videoRef} stream={stream} />

        <div className="mt-4">
          <FaceRegisterForm
            displayName={displayName}
            isRegistering={isRegistering}
            backendAvailable={backendAvailable}
            stream={stream}
            statusMsg={statusMsg}
            onRegister={onRegister}
          />
        </div>
      </div>
    </div>
  );
}
