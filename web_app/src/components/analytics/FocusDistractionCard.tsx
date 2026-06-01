'use client';

import React from 'react';

interface FocusDistractionCardProps {
  focusPercentage?: number;
  gazeDistribution?: Record<string, number>;
  focusTimeline?: { video_time: number; focus_ratio: number }[];
}

export default function FocusDistractionCard({
  focusPercentage,
  gazeDistribution,
  focusTimeline,
}: FocusDistractionCardProps) {
  const hasData = focusPercentage !== undefined;

  // Build phases from focus timeline (split into quarters)
  const phases = React.useMemo(() => {
    if (!focusTimeline || focusTimeline.length === 0) {
      return [];
    }

    const total = focusTimeline.length;
    const quarterSize = Math.max(1, Math.floor(total / 4));
    const phaseNames = [
      'Fase Awal',
      'Fase Pertengahan',
      'Fase Lanjut',
      'Fase Akhir',
    ];

    return phaseNames.map((name, i) => {
      const start = i * quarterSize;
      const end = i === 3 ? total : (i + 1) * quarterSize;
      const slice = focusTimeline.slice(start, end);
      const avgFocus =
        slice.length > 0
          ? (slice.reduce((s, p) => s + p.focus_ratio, 0) / slice.length) * 100
          : 0;
      return { name, focus: Math.round(avgFocus) };
    });
  }, [focusTimeline]);

  // Build gaze direction display from gazeDistribution
  const gazeItems = React.useMemo(() => {
    if (!gazeDistribution) return [];
    return Object.entries(gazeDistribution)
      .sort((a, b) => b[1] - a[1])
      .map(([direction, pct]) => ({
        direction: direction.charAt(0).toUpperCase() + direction.slice(1),
        percentage: Math.round(pct),
      }));
  }, [gazeDistribution]);

  if (!hasData) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex items-center justify-center">
        <p className="text-gray-300 text-sm font-medium">
          Jalankan session untuk melihat data fokus
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full">
      <div className="flex justify-between items-start mb-8">
        <h3 className="text-lg font-bold text-[#2A3441]">
          Focus vs. Distraction
        </h3>
        <div className="text-right">
          <span className="text-2xl font-bold text-[#2A3441]">
            {Math.round(focusPercentage!)}%
          </span>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            Overall Focus
          </p>
        </div>
      </div>

      {/* Phase bars */}
      {phases.length > 0 && (
        <div className="space-y-6 mb-8">
          {phases.map((phase) => (
            <div key={phase.name} className="space-y-2">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-[#2A3441]">{phase.name}</span>
                <span className="text-[#2A3441]">{phase.focus}% Focus</span>
              </div>
              <div className="h-2 w-full bg-[#FCE4EC] rounded-full overflow-hidden flex">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    phase.focus >= 70
                      ? 'bg-[#2E7D32]'
                      : phase.focus >= 50
                        ? 'bg-[#2A3441]'
                        : 'bg-[#E53935]'
                  }`}
                  style={{ width: `${phase.focus}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gaze Distribution */}
      {gazeItems.length > 0 && (
        <div className="mb-6">
          <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
            Gaze Distribution
          </h4>
          <div className="flex flex-wrap gap-2">
            {gazeItems.map((item) => (
              <span
                key={item.direction}
                className="px-3 py-1.5 bg-[#F1F3F6] rounded-lg text-[11px] font-bold text-[#2A3441]"
              >
                {item.direction}: {item.percentage}%
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2A3441]" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            Cognitive Focus
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FCE4EC]" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            Distraction
          </span>
        </div>
      </div>
    </div>
  );
}
