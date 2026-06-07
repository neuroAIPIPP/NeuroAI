import { Layers, TrendingUp } from 'lucide-react';
import React from 'react';

interface HistoryStatsProps {
  avgFocus: string;
  totalSessions: number;
}

export default function HistoryStats({
  avgFocus,
  totalSessions,
}: HistoryStatsProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
      <h1 className="text-[2.75rem] font-bold text-[#2A3441] tracking-tight">
        Session History
      </h1>

      <div className="flex items-center gap-4">
        {/* Avg Focus Stat */}
        <div className="bg-[#E2F0DD] px-5 py-3 rounded-2xl flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-[#4D5E3A]" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#4D5E3A] uppercase tracking-widest leading-none mb-1">
              Avg. Focus
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
              Sessions
            </span>
            <span className="text-xl font-bold text-[#2A3441] leading-none">
              {totalSessions}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
