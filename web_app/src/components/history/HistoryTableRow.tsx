import { LucideIcon } from 'lucide-react';
import React from 'react';

export interface HistorySession {
  id: string;
  name: string;
  lead: string;
  duration: string;
  focusScore: number;
  date: string;
  icon: LucideIcon;
  iconColor: 'blue' | 'green' | 'red' | 'yellow';
}

interface HistoryTableRowProps {
  session: HistorySession;
}

export default function HistoryTableRow({ session }: HistoryTableRowProps) {
  const Icon = session.icon;

  const getIconStyles = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 text-blue-500';
      case 'green':
        return 'bg-green-50 text-green-500';
      case 'red':
        return 'bg-red-50 text-red-500';
      case 'yellow':
        return 'bg-yellow-50 text-yellow-600';
      default:
        return 'bg-gray-50 text-gray-500';
    }
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-[#3B526A]';
    if (score >= 60) return 'bg-[#556b2f]'; // Olive/Greenish for medium
    return 'bg-[#993333]'; // Dark Red for low
  };

  return (
    <div className="flex items-center justify-between py-5 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-6 md:px-8 bg-white">
      {/* Session Name & Lead */}
      <div className="flex items-center gap-4 w-[30%]">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getIconStyles(session.iconColor)}`}
        >
          <Icon className="w-5 h-5" />
        </div>
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
      <div className="w-[15%] flex justify-end">
        <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#2A3441] text-[12px] font-bold rounded-lg transition-colors shadow-sm">
          View Details
        </button>
      </div>
    </div>
  );
}
