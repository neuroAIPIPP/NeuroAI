'use client';

import { Sparkles } from 'lucide-react';
import React from 'react';

interface SessionFinishedScreenProps {
  onGoToDashboard: () => void;
}

export default function SessionFinishedScreen({
  onGoToDashboard,
}: SessionFinishedScreenProps) {
  return (
    <main className="min-h-screen relative overflow-hidden bg-transparent flex items-center justify-center">
      <div className="text-center z-10 bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 max-w-lg mx-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-[#2A3441] mb-4">
          Terima Kasih!
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Anda telah menyelesaikan semua materi sesi hari ini. Data fokus Anda
          telah berhasil direkam untuk analisis lebih lanjut.
        </p>
        <button
          onClick={onGoToDashboard}
          className="px-8 py-3 bg-[#3B526A] text-white font-bold rounded-full hover:bg-[#2C3F53] transition-all shadow-lg"
        >
          Kembali ke Dashboard
        </button>
      </div>
    </main>
  );
}
