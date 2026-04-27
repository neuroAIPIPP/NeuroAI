import { ArrowRight, BadgeCheck } from 'lucide-react';
import React from 'react';

export default function SystemStatusBar() {
  return (
    <div className="bg-[#EEF2E6] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[#E2E8D5] flex items-center justify-center shrink-0">
          <BadgeCheck className="w-5 h-5 text-[#4D5E3A]" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span className="text-[15px] font-bold text-[#2A3441] leading-tight">
            System Status
          </span>
          <span className="text-[13px] font-medium text-[#64748B]">
            All devices are ready for session
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <button className="flex-1 md:flex-none px-6 py-3 rounded-full bg-[#E2E8D5] text-[#4D5E3A] text-sm font-bold hover:bg-[#D5DCC6] transition-colors">
          Recalibrate
        </button>
        <button className="flex-1 md:flex-none px-6 py-3 rounded-full bg-[#3B526A] text-white text-sm font-bold hover:bg-[#2C3F53] transition-colors flex items-center justify-center gap-2 group">
          Start Session
          <ArrowRight
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            strokeWidth={2.5}
          />
        </button>
      </div>
    </div>
  );
}
