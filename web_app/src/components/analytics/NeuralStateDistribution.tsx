'use client';

import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Deep Flow', value: 45, color: '#2A3441' },
  { name: 'Active Recall', value: 30, color: '#5C7A99' },
  { name: 'Passive Analysis', value: 25, color: '#BDC5D0' },
];

export default function NeuralStateDistribution() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col">
      <h3 className="text-lg font-bold text-[#2A3441] mb-8 text-center">
        Neural State Distribution
      </h3>

      <div className="relative h-[200px] mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-[#2A3441]">Stable</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            82m Total
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-bold text-[#2A3441]">
                {item.name}
              </span>
            </div>
            <span className="text-xs font-bold text-[#2A3441]">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
