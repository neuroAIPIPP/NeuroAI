'use client';

import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

interface NeuralStateDistributionProps {
  bandPowers?: {
    delta?: number;
    theta?: number;
    alpha?: number;
    beta?: number;
    gamma?: number;
  };
  eegQuality?: string;
  eegMode?: string | null;
  attentionIndex?: number;
}

const BAND_LABELS: Record<string, { label: string; color: string }> = {
  beta: { label: 'Beta (Focus)', color: '#2A3441' },
  alpha: { label: 'Alpha (Relax)', color: '#5C7A99' },
  theta: { label: 'Theta (Drowsy)', color: '#8EACCD' },
  delta: { label: 'Delta (Deep)', color: '#BDC5D0' },
  gamma: { label: 'Gamma (High)', color: '#E8B86D' },
};

export default function NeuralStateDistribution({
  bandPowers,
  eegQuality,
  eegMode,
  attentionIndex,
}: NeuralStateDistributionProps) {
  const hasData =
    bandPowers && Object.values(bandPowers).some((v) => v && v > 0);

  // Build pie chart data from band powers
  const chartData = React.useMemo(() => {
    if (!bandPowers) return [];

    return Object.entries(bandPowers)
      .filter(([, value]) => value && value > 0)
      .map(([band, value]) => ({
        name: BAND_LABELS[band]?.label || band,
        value: Math.round((value || 0) * 100),
        color: BAND_LABELS[band]?.color || '#BDC5D0',
      }))
      .sort((a, b) => b.value - a.value);
  }, [bandPowers]);

  // Determine center label
  const centerLabel = React.useMemo(() => {
    if (!hasData) return { main: '--', sub: 'No Data' };
    if (attentionIndex !== undefined && attentionIndex !== null) {
      if (attentionIndex >= 70)
        return { main: 'Fokus', sub: `${Math.round(attentionIndex)}%` };
      if (attentionIndex >= 40)
        return { main: 'Normal', sub: `${Math.round(attentionIndex)}%` };
      return { main: 'Relaks', sub: `${Math.round(attentionIndex)}%` };
    }
    return { main: 'Stable', sub: '' };
  }, [hasData, attentionIndex]);

  if (!hasData) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col items-center justify-center">
        <h3 className="text-lg font-bold text-[#2A3441] mb-4 text-center">
          Neural State Distribution
        </h3>
        <p className="text-gray-300 text-sm font-medium text-center">
          Data EEG belum tersedia
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-[#2A3441] text-center w-full">
          Neural State Distribution
        </h3>
      </div>

      {/* EEG Mode badge */}
      {eegMode && (
        <div className="flex justify-center mb-4">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold ${
              eegMode === 'Real'
                ? 'bg-green-100 text-green-700'
                : eegMode === 'Mock'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-500'
            }`}
          >
            {eegMode === 'Real'
              ? '🧠 Real EEG'
              : eegMode === 'Mock'
                ? '🔄 Simulated EEG'
                : eegMode}
          </span>
        </div>
      )}

      <div className="relative h-[200px] mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-[#2A3441]">
            {centerLabel.main}
          </span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            {centerLabel.sub}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {chartData.map((item) => (
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

      {/* EEG Quality */}
      {eegQuality && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <span>Signal Quality</span>
            <span
              className={
                eegQuality === 'good'
                  ? 'text-green-600'
                  : eegQuality === 'moderate'
                    ? 'text-amber-600'
                    : 'text-red-500'
              }
            >
              {eegQuality === 'good'
                ? '● Good'
                : eegQuality === 'moderate'
                  ? '● Moderate'
                  : '● Poor'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
