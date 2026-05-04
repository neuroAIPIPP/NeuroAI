'use client';

import React from 'react';
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';

const data = [
  { value: 65 },
  { value: 68 },
  { value: 75 },
  { value: 82 },
  { value: 78 },
  { value: 85 },
  { value: 82 },
  { value: 88 },
  { value: 92 },
  { value: 85 },
  { value: 82 },
  { value: 84 },
];

export default function FocusStatusChart() {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8EACCD" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8EACCD" stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={[0, 100]} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8EACCD"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorValue)"
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
