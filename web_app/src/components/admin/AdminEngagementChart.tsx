'use client';

import React, { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const data = [
  { name: 'Mon', activeUsers: 42, avgFocus: 78 },
  { name: 'Tue', activeUsers: 55, avgFocus: 82 },
  { name: 'Wed', activeUsers: 68, avgFocus: 85 },
  { name: 'Thu', activeUsers: 80, avgFocus: 81 },
  { name: 'Fri', activeUsers: 74, avgFocus: 79 },
  { name: 'Sat', activeUsers: 30, avgFocus: 88 },
  { name: 'Sun', activeUsers: 25, avgFocus: 86 },
];

export default function AdminEngagementChart() {
  const [activeTab, setActiveTab] = useState<'users' | 'focus'>('users');

  return (
    <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] h-full flex flex-col">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-base font-bold text-[#2A3441] mb-1">
            Platform Activity & Engagement
          </h3>
          <p className="text-[13px] text-gray-500 font-medium">
            Daily statistics for active users and focus performance
          </p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-colors ${
              activeTab === 'users'
                ? 'bg-[#5C7A99] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Active Users
          </button>
          <button
            onClick={() => setActiveTab('focus')}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-colors ${
              activeTab === 'focus'
                ? 'bg-[#5C7A99] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Avg Focus Score
          </button>
        </div>
      </div>

      <div className="flex-grow w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F3F4F6"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 600 }}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)',
              }}
              cursor={{ fill: '#f3f4f6', opacity: 0.5 }}
            />
            <Bar
              dataKey={activeTab === 'users' ? 'activeUsers' : 'avgFocus'}
              fill={activeTab === 'users' ? '#8EACCD' : '#A5C0DD'}
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
