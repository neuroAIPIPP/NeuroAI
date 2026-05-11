'use client';

import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

const data = [
  { time: '0m', value: 20 },
  { time: '10m', value: 25 },
  { time: '20m', value: 60 },
  { time: '30m', value: 30 },
  { time: '40m', value: 70 },
  { time: '45m', value: 85 },
  { time: '55m', value: 75 },
  { time: '65m', value: 78 },
  { time: '75m', value: 45 },
];

export default function BetaWaveTrends() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#2A3441] mb-1">
            EEG Beta-Wave Trends
          </h3>
          <p className="text-xs text-gray-400 font-medium">
            Real-time cortical excitement fluctuations over session duration.
          </p>
        </div>
        <div className="flex bg-[#F1F3F6] p-1 rounded-lg">
          <button className="px-4 py-1.5 bg-white text-[10px] font-bold text-[#2A3441] rounded-md shadow-sm">
            Real-time
          </button>
          <button className="px-4 py-1.5 text-[10px] font-bold text-gray-400 hover:text-gray-600">
            Normalized
          </button>
        </div>
      </div>

      <div className="flex-grow w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2A3441" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#2A3441" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#BDC5D0', fontWeight: 600 }}
              dy={15}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 8px 30px rgb(0,0,0,0.08)',
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#2A3441"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
              dot={{ r: 4, fill: '#2A3441', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#2A3441' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
