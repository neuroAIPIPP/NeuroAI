import { LucideIcon } from 'lucide-react';
import React from 'react';

interface Metric {
  label: string;
  value: string;
  icon: LucideIcon;
}

interface DeviceCardProps {
  deviceNumber: string;
  deviceName: string;
  metrics: Metric[];
}

export default function DeviceCard({
  deviceNumber,
  deviceName,
  metrics,
}: DeviceCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col relative overflow-hidden">
      {/* Decorative top right corner element */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full translate-x-1/2 -translate-y-1/2"></div>

      <div className="mb-6 relative z-10">
        <div className="text-[11px] font-bold text-[#64748B] tracking-wider mb-1 uppercase">
          {deviceNumber}
        </div>
        <h2 className="text-2xl font-bold text-[#2A3441]">{deviceName}</h2>
      </div>

      <div className="space-y-3 relative z-10">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-4 bg-[#F8FAFC] rounded-xl p-3"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                <Icon className="w-4 h-4 text-[#475569]" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#64748B]">
                  {metric.label}
                </span>
                <span className="text-[15px] font-bold text-[#1E293B] leading-tight">
                  {metric.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
