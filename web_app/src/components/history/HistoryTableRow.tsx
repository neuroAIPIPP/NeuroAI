import { LucideIcon } from 'lucide-react';
import React from 'react';

import { HistorySession } from './types';

interface HistoryTableRowProps {
  session: HistorySession;
}

export default function HistoryTableRow({ session }: HistoryTableRowProps) {
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-[#3B526A]';
    if (score >= 60) return 'bg-[#556b2f]'; // Olive/Greenish for medium
    return 'bg-[#993333]'; // Dark Red for low
  };

  return (
    <div className="flex items-center justify-between py-5 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-6 md:px-8 bg-white">
      {/* User */}
      <div className="w-[15%]">
        <span className="text-[14px] font-bold text-[#2A3441]">
          {session.user}
        </span>
      </div>

      {/* Session Name & Lead */}
      <div className="flex items-center gap-4 w-[25%]">
        <div>
          <h4 className="text-[15px] font-bold text-[#2A3441] leading-tight">
            {session.name}
          </h4>
          <p className="text-[13px] font-medium text-gray-500">
            Lead: {session.lead}
          </p>
        </div>
      </div>

      {/* Duration */}
      <div className="w-[15%]">
        <span className="text-[14px] font-medium text-gray-600">
          {session.duration}
        </span>
      </div>

      {/* Avg Focus Score */}
      <div className="w-[20%] flex items-center gap-4">
        <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${getProgressColor(session.focusScore)}`}
            style={{ width: `${session.focusScore}%` }}
          />
        </div>
        <span className="text-[14px] font-bold text-[#2A3441] w-8">
          {session.focusScore}%
        </span>
      </div>

      {/* Date */}
      <div className="w-[15%]">
        <span className="text-[14px] font-medium text-gray-600">
          {session.date}
        </span>
      </div>

      {/* Actions */}
      <div className="w-[10%] flex justify-end">
        <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#2A3441] text-[12px] font-bold rounded-lg transition-colors shadow-sm">
          View Details
        </button>
      </div>
    </div>
  );
}
