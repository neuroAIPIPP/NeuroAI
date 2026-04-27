import { LucideIcon } from 'lucide-react';
import React from 'react';

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  subtitle: React.ReactNode;
  icon: LucideIcon;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <Icon className="w-5 h-5 text-slate-500 stroke-[1.5]" />
      </div>
      <div>
        <div className="text-[2.5rem] leading-none font-bold text-[#2A3441] mb-2 tracking-tight">
          {value}
        </div>
        <div className="text-[13px] text-gray-500 font-medium">{subtitle}</div>
      </div>
    </div>
  );
}
