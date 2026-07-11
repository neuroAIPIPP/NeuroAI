'use client';

import { Download, FileSpreadsheet, RefreshCw } from 'lucide-react';
import React from 'react';

import { AnalysisData } from './mockData';

interface AdminAnalyticsHeaderProps {
  totalSessions: number;
  avgConcentration: number;
  analyses: AnalysisData[];
  selectedAnalysis: AnalysisData | null;
  onSelectAnalysis: (analysis: AnalysisData | null) => void;
  onExport: () => void;
  onExportAll: () => void;
  onResync: () => void;
  isResyncing: boolean;
}

export default function AdminAnalyticsHeader({
  totalSessions,
  avgConcentration,
  analyses,
  selectedAnalysis,
  onSelectAnalysis,
  onExport,
  onExportAll,
  onResync,
  isResyncing,
}: AdminAnalyticsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
      <div>
        <h1 className="text-[2.75rem] font-bold text-[#2A3441] tracking-tight">
          User Neural Analytics
        </h1>
        {totalSessions > 0 && (
          <p className="text-sm text-gray-400 font-medium mt-1">
            {totalSessions} sesi teranalisis · Platform Avg. Focus{' '}
            {avgConcentration.toFixed(1)}%
          </p>
        )}
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        {/* Session selector */}
        {analyses.length > 0 && (
          <select
            value={selectedAnalysis?.id || ''}
            onChange={(e) => {
              const selected = analyses.find((a) => a.id === e.target.value);
              onSelectAnalysis(selected || null);
            }}
            className="px-4 py-2.5 bg-white border border-gray-200 text-sm font-bold text-[#2A3441] rounded-full focus:outline-none focus:ring-2 focus:ring-[#8EACCD] shadow-sm cursor-pointer"
          >
            {analyses.map((a) => (
              <option key={a.id} value={a.id}>
                {a.user?.name || 'Unknown'} —{' '}
                {a.videoTitle
                  ? a.videoTitle.substring(0, 25) + '...'
                  : 'Session'}{' '}
                ({Math.round(a.concentrationScore)}%)
              </option>
            ))}
          </select>
        )}

        <button
          onClick={onExport}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#3B526A] text-white text-sm font-bold rounded-full hover:bg-[#2C3F53] transition-all shadow-md border-none cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
        <button
          onClick={onExportAll}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#2A3441] text-white text-sm font-bold rounded-full hover:bg-[#1E2832] transition-all shadow-md border-none cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export All CSV
        </button>
        <button
          onClick={onResync}
          disabled={isResyncing}
          className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-full transition-all shadow-md cursor-pointer ${
            isResyncing
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-[#E2E8D5] text-[#4D5E3A] hover:bg-[#D5DCC6]'
          }`}
        >
          <RefreshCw
            className={`w-4 h-4 ${isResyncing ? 'animate-spin' : ''}`}
          />
          {isResyncing ? 'Syncing...' : 'Refresh'}
        </button>
      </div>
    </div>
  );
}
