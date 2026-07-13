'use client';

import React, { useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

const data = [
  { name: 'MON', value: 30 },
  { name: 'TUE', value: 45 },
  { name: 'WED', value: 38 },
  { name: 'THU', value: 65 },
  { name: 'FRI', value: 85 },
  { name: 'SAT', value: 40 },
  { name: 'SUN', value: 110 },
];

export default function EngagementChart() {
  const [activeWeek, setActiveWeek] = useState('W2');

  return (
    <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] h-full flex flex-col">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-base font-bold text-[#2A3441] mb-1">
            Weekly Engagement Trend
          </h3>
          <p className="text-[13px] text-gray-500 font-medium">
            Aggregated neural feedback response times
          </p>
        </div>
        <div className="flex space-x-2">
          {['W1', 'W2', 'W3'].map((week) => (
            <button
              key={week}
              onClick={() => setActiveWeek(week)}
              className={`px-3 py-1 text-[11px] font-bold rounded-md transition-colors ${
                activeWeek === week
                  ? 'bg-[#5C7A99] text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {week}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 600 }}
              dy={15}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)',
              }}
              itemStyle={{ color: '#2A3441', fontWeight: 600 }}
              labelStyle={{
                color: '#9CA3AF',
                fontSize: '12px',
                marginBottom: '4px',
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8EACCD"
              strokeWidth={3}
              dot={{ r: 4, fill: '#5C7A99', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#3B5977' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
