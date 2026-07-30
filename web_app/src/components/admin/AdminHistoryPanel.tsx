'use client';

import HistoryTable from '@/components/history/HistoryTable';
import { HistorySession } from '@/components/history/types';
import { Layers, TrendingUp } from 'lucide-react';
import React from 'react';

interface AdminHistoryPanelProps {
  initialSessions: HistorySession[];
  avgFocus: string;
  totalSessions: number;
}

export default function AdminHistoryPanel({
  initialSessions,
  avgFocus,
  totalSessions,
}: AdminHistoryPanelProps) {
  return (
    <div className="pt-28 pb-12 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen flex flex-col relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-[2.75rem] font-bold text-[#2A3441] tracking-tight">
            All User Sessions
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            View and filter study session history across all platform users.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Avg Focus Stat */}
          <div className="bg-[#E2F0DD] px-5 py-3 rounded-2xl flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-[#4D5E3A]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#4D5E3A] uppercase tracking-widest leading-none mb-1">
                Platform Avg. Focus
              </span>
              <span className="text-xl font-bold text-[#2A3441] leading-none">
                {avgFocus}%
              </span>
            </div>
          </div>

          {/* Sessions Stat */}
          <div className="bg-[#D0E2FF] px-5 py-3 rounded-2xl flex items-center gap-3">
            <Layers className="w-5 h-5 text-[#2A5298]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#2A5298] uppercase tracking-widest leading-none mb-1">
                Total Sessions
              </span>
              <span className="text-xl font-bold text-[#2A3441] leading-none">
                {totalSessions}
              </span>
            </div>
          </div>
        </div>
      </div>

      <HistoryTable initialSessions={initialSessions} isAdmin={true} />
    </div>
  );
}
