import React from 'react';

export default function HistoryTableHeader() {
  return (
    <div className="flex items-center justify-between py-4 px-6 md:px-8 bg-slate-100/80 border-b border-slate-200/60">
      <div className="w-[15%]">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          User
        </span>
      </div>
      <div className="w-[25%]">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Session Name
        </span>
      </div>
      <div className="w-[15%]">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Duration
        </span>
      </div>
      <div className="w-[20%]">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Avg. Focus Score
        </span>
      </div>
      <div className="w-[15%]">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Date
        </span>
      </div>
      <div className="w-[10%] text-right">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Actions
        </span>
      </div>
    </div>
  );
}
