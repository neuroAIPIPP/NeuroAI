'use client';

import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

interface BetaWaveTrendsProps {
  focusTimeline?: { video_time: number; focus_ratio: number }[];
  bandPowers?: {
    delta?: number;
    theta?: number;
    alpha?: number;
    beta?: number;
    gamma?: number;
  };
}

export default function BetaWaveTrends({
  focusTimeline,
  bandPowers,
}: BetaWaveTrendsProps) {
  const hasData = focusTimeline && focusTimeline.length > 0;

  // Transform focus timeline into chart data
  const chartData = React.useMemo(() => {
    if (!focusTimeline || focusTimeline.length === 0) return [];

    return focusTimeline.map((point) => {
      const minutes = Math.floor(point.video_time / 60);
      const seconds = Math.floor(point.video_time % 60);
      return {
        time: `${minutes}:${seconds.toString().padStart(2, '0')}`,
        value: Math.round(point.focus_ratio * 100),
      };
    });
  }, [focusTimeline]);

  // Calculate beta dominance percentage for subtitle
  const betaInfo = React.useMemo(() => {
    if (!bandPowers || !bandPowers.beta) return null;
    return `Beta Power: ${Math.round(bandPowers.beta * 100)}%`;
  }, [bandPowers]);

  if (!hasData) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col items-center justify-center min-h-[300px]">
        <h3 className="text-xl font-bold text-[#2A3441] mb-4">
          Focus Timeline
        </h3>
        <p className="text-gray-300 text-sm font-medium">
          Data timeline belum tersedia
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#2A3441] mb-1">
            Focus Timeline
          </h3>
          <p className="text-xs text-gray-400 font-medium">
            {betaInfo
              ? `Persentase fokus sepanjang session. ${betaInfo}`
              : 'Persentase fokus sepanjang session berdasarkan eye tracking.'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2A3441]" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Focus %
            </span>
          </div>
        </div>
      </div>

      <div className="flex-grow w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2A3441" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2A3441" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#BDC5D0', fontWeight: 600 }}
              dy={15}
              interval={Math.max(0, Math.floor(chartData.length / 8))}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 8px 30px rgb(0,0,0,0.08)',
                fontSize: '12px',
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`${value}%`, 'Focus']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#2A3441"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorFocus)"
              dot={
                chartData.length <= 20
                  ? { r: 3, fill: '#2A3441', strokeWidth: 0 }
                  : false
              }
              activeDot={{ r: 5, fill: '#2A3441' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
