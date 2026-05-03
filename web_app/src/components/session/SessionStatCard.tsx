import React from 'react';

interface SessionStatCardProps {
  label: string;
  value: string;
  status?: 'optimal' | 'high' | 'warning' | 'normal';
}

export default function SessionStatCard({
  label,
  value,
  status = 'normal',
}: SessionStatCardProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'optimal':
        return 'bg-green-50 text-green-700';
      case 'high':
        return 'bg-blue-50 text-blue-700';
      case 'warning':
        return 'bg-yellow-50 text-yellow-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
        {label}
      </span>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-[#2A3441]">{value}</span>
        {status !== 'normal' && (
          <span
            className={`text-[9px] px-2 py-0.5 rounded-full font-bold capitalize ${getStatusStyles()}`}
          >
            {status}
          </span>
        )}
      </div>
    </div>
  );
}
