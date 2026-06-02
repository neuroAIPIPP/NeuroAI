'use client';

import { AlertTriangle, ScanFace } from 'lucide-react';
import React from 'react';

interface FaceRegisterHeaderProps {
  backendAvailable: boolean;
}

export default function FaceRegisterHeader({
  backendAvailable,
}: FaceRegisterHeaderProps) {
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-[2.75rem] font-bold text-[#2A3441] tracking-tight mb-2">
          Face Registration
        </h1>
        <p className="text-gray-600 mt-2">
          Daftarkan wajah Anda untuk verifikasi otomatis saat sesi belajar.
        </p>
      </div>

      {!backendAvailable && (
        <div className="self-start md:self-auto px-4 py-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 font-semibold text-sm shadow-sm animate-pulse">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          Backend Offline
        </div>
      )}
    </div>
  );
}
