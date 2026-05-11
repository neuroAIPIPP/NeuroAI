'use client';

import React from 'react';

const phases = [
  { name: 'Initial Phase', focus: 92 },
  { name: 'Complexity Peak', focus: 78 },
  { name: 'Mid-Session Lull', focus: 64 },
  { name: 'Final Sprint', focus: 96 },
];

export default function FocusDistractionCard() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full">
      <h3 className="text-lg font-bold text-[#2A3441] mb-8">
        Focus vs. Distraction
      </h3>

      <div className="space-y-6">
        {phases.map((phase) => (
          <div key={phase.name} className="space-y-2">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-[#2A3441]">{phase.name}</span>
              <span className="text-[#2A3441]">{phase.focus}% Focus</span>
            </div>
            <div className="h-2 w-full bg-[#FCE4EC] rounded-full overflow-hidden flex">
              <div
                className="h-full bg-[#2A3441] rounded-full"
                style={{ width: `${phase.focus}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2A3441]" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            Cognitive Focus
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FCE4EC]" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            Distraction Noise
          </span>
        </div>
      </div>
    </div>
  );
}
