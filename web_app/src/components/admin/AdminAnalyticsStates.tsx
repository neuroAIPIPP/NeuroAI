'use client';

import { Loader2, Sparkles } from 'lucide-react';
import React from 'react';

interface AdminAnalyticsStatesProps {
  isLoading: boolean;
  hasData: boolean;
}

export default function AdminAnalyticsStates({
  isLoading,
  hasData,
}: AdminAnalyticsStatesProps) {
  if (isLoading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center gap-4 min-h-[400px]">
        <Loader2 className="w-10 h-10 text-[#8EACCD] animate-spin" />
        <p className="text-sm font-bold text-gray-400">
          Memuat data analisis platform...
        </p>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center gap-6 min-h-[400px]">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-gray-300" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#2A3441] mb-2">
            Belum Ada Data Analisis Platform
          </h2>
          <p className="text-gray-400 text-sm font-medium max-w-md">
            Jalankan session belajar oleh user terlebih dahulu untuk
            mengumpulkan metrik kognitif.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
