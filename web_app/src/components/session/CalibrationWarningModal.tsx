'use client';

import { AlertTriangle } from 'lucide-react';
import React from 'react';

interface CalibrationWarningModalProps {
  onConfirm: () => void;
}

export default function CalibrationWarningModal({
  onConfirm,
}: CalibrationWarningModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[60] bg-[#2A3441]/80 backdrop-blur-md px-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
        <div className="bg-yellow-50 text-yellow-500 p-5 rounded-full mb-6 shadow-sm border border-yellow-100">
          <AlertTriangle size={48} />
        </div>
        <h3 className="text-2xl font-bold text-[#2A3441] mb-4">
          Persiapan Sesi
        </h3>
        <p className="text-gray-500 mb-8 leading-relaxed text-[15px]">
          Anda akan segera memasuki sesi kalibrasi dan pembelajaran.{' '}
          <strong>Mohon persiapkan diri Anda sebaik mungkin.</strong>
          <br />
          <br />
          Selama sesi berlangsung, Anda <strong>
            tidak diperkenankan
          </strong>{' '}
          meninggalkan perangkat atau melakukan aktivitas lain di luar layar ini
          agar data biometrik dapat direkam secara maksimal.
        </p>
        <button
          onClick={onConfirm}
          className="w-full py-4 bg-[#8EACCD] text-white rounded-2xl font-bold hover:bg-[#7A9BBF] transition-all shadow-lg text-lg"
        >
          Saya Mengerti & Lanjut
        </button>
      </div>
    </div>
  );
}
