'use client';

import React from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { value: 40 },
  { value: 65 },
  { value: 45 },
  { value: 75 },
  { value: 60 },
  { value: 90 },
  { value: 85 },
  { value: 50 },
];

export default function EngagementScoreCard() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] mb-2 uppercase">
          Primary KPI
        </span>
        <div className="flex items-baseline gap-2 mb-1">
          <h2 className="text-[5rem] font-bold text-[#2A3441] leading-none">
            88%
          </h2>
        </div>
        <h3 className="text-xl font-bold text-[#2A3441] mb-4">
          Engagement Score
        </h3>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] text-[11px] font-bold rounded-full flex items-center gap-1">
            <svg
              className="w-3 h-3"
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
            +12% vs Baseline
          </span>
          <span className="text-xs text-gray-400 font-medium italic">
            Optimal Alpha State
          </span>
        </div>
      </div>

      <div className="w-full md:w-[60%] h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <Bar dataKey="value" radius={[4, 4, 4, 4]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 5 ? '#3B526A' : '#BDC5D0'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
