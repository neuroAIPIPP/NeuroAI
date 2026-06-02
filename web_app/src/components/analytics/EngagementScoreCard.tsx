'use client';

import React from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer } from 'recharts';

interface EngagementScoreCardProps {
  concentrationScore?: number;
  previousScore?: number;
  perVideoScores?: { videoTitle: string; score: number }[];
}

export default function EngagementScoreCard({
  concentrationScore,
  previousScore,
  perVideoScores,
}: EngagementScoreCardProps) {
  const score = concentrationScore ?? 0;
  const hasData = concentrationScore !== undefined;

  // Build bar chart data from per-video scores or fallback
  const chartData = perVideoScores?.length
    ? perVideoScores.map((v) => ({ name: v.videoTitle, value: v.score }))
    : [{ name: '-', value: 0 }];

  // Calculate delta vs previous
  const delta = previousScore !== undefined ? score - previousScore : null;
  const deltaText =
    delta !== null
      ? `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}% vs Previous`
      : null;

  // Determine level label
  const getLevel = (s: number) => {
    if (s >= 80) return 'Excellent Focus';
    if (s >= 60) return 'Good Focus';
    if (s >= 40) return 'Moderate Focus';
    return 'Needs Improvement';
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] mb-2 uppercase">
          Concentration Score
        </span>
        <div className="flex items-baseline gap-2 mb-1">
          <h2 className="text-[5rem] font-bold text-[#2A3441] leading-none">
            {hasData ? `${Math.round(score)}%` : '--'}
          </h2>
        </div>
        <h3 className="text-xl font-bold text-[#2A3441] mb-4">
          {hasData ? getLevel(score) : 'No Data Yet'}
        </h3>
        <div className="flex items-center gap-3">
          {deltaText && (
            <span
              className={`px-3 py-1 text-[11px] font-bold rounded-full flex items-center gap-1 ${
                delta! >= 0
                  ? 'bg-[#E8F5E9] text-[#2E7D32]'
                  : 'bg-[#FFEBEE] text-[#C62828]'
              }`}
            >
              <svg
                className={`w-3 h-3 ${delta! < 0 ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              {deltaText}
            </span>
          )}
          {hasData && (
            <span className="text-xs text-gray-400 font-medium italic">
              {getLevel(score)}
            </span>
          )}
        </div>
      </div>

      <div className="w-full md:w-[60%] h-[160px]">
        {hasData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.value >= 80
                        ? '#2E7D32'
                        : entry.value >= 60
                          ? '#3B526A'
                          : entry.value >= 40
                            ? '#FB8C00'
                            : '#E53935'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm font-medium">
            Jalankan session untuk melihat data
          </div>
        )}
      </div>
    </div>
  );
}
