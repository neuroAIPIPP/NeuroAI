'use client';

import {
  AlertCircle,
  Lightbulb,
  Loader2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import React from 'react';

interface AIInsightsProps {
  summary?: string;
  strengths?: string[];
  improvements?: string[];
  patterns?: string[];
  tips?: string[];
  aiGenerated?: boolean;
  isLoading?: boolean;
}

export default function AIInsights({
  summary,
  strengths,
  improvements,
  patterns,
  tips,
  aiGenerated,
  isLoading,
}: AIInsightsProps) {
  const hasData = summary || (strengths && strengths.length > 0);

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 text-[#8EACCD] animate-spin mb-4" />
        <p className="text-sm font-bold text-gray-400">
          Generating AI Insights...
        </p>
        <p className="text-[11px] text-gray-300 mt-1">
          Menganalisis data konsentrasi Anda
        </p>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center min-h-[300px]">
        <Sparkles className="w-8 h-8 text-gray-200 mb-4" />
        <p className="text-sm font-bold text-gray-400">Belum Ada Insight</p>
        <p className="text-[11px] text-gray-300 mt-1 text-center">
          Jalankan session terlebih dahulu untuk mendapatkan AI insights
        </p>
      </div>
    );
  }

  // Build insight cards from real data
  const insightCards: {
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    iconColor: string;
  }[] = [];

  // Summary as the first card
  if (summary) {
    insightCards.push({
      title: 'Ringkasan Analisis',
      description: summary,
      icon: Sparkles,
      color: '#FFF3E0',
      iconColor: '#FB8C00',
    });
  }

  // Strengths
  if (strengths && strengths.length > 0) {
    insightCards.push({
      title: 'Kekuatan',
      description: strengths.join(' • '),
      icon: TrendingUp,
      color: '#E8F5E9',
      iconColor: '#2E7D32',
    });
  }

  // Improvements
  if (improvements && improvements.length > 0) {
    insightCards.push({
      title: 'Saran Perbaikan',
      description: improvements.join(' • '),
      icon: Lightbulb,
      color: '#E3F2FD',
      iconColor: '#1E88E5',
    });
  }

  // Patterns
  if (patterns && patterns.length > 0) {
    insightCards.push({
      title: 'Pola Terdeteksi',
      description: patterns.join(' • '),
      icon: AlertCircle,
      color: '#FBE9E7',
      iconColor: '#F4511E',
    });
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-[#2A3441]" />
        <h3 className="text-lg font-bold text-[#2A3441]">AI Insights</h3>
      </div>
      {aiGenerated !== undefined && (
        <p className="text-[10px] text-gray-400 font-medium mb-6">
          {aiGenerated ? '✨ Powered by Gemini AI' : '📊 Basic Analysis'}
        </p>
      )}

      <div className="space-y-4">
        {insightCards.map((insight) => (
          <div
            key={insight.title}
            className="p-5 rounded-2xl border border-[#F1F3F6] hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div
                className="p-2 rounded-xl shrink-0"
                style={{ backgroundColor: insight.color }}
              >
                <insight.icon
                  className="w-4 h-4"
                  style={{ color: insight.iconColor }}
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#2A3441] mb-1">
                  {insight.title}
                </h4>
                <p className="text-[12px] text-gray-500 leading-relaxed font-medium">
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tips section */}
      {tips && tips.length > 0 && (
        <div className="mt-6 p-4 bg-[#FFF9E5] rounded-2xl border border-yellow-200/50">
          <h4 className="text-[11px] font-bold text-yellow-800 uppercase tracking-wider mb-2">
            💡 Tips untuk Session Berikutnya
          </h4>
          <ul className="space-y-1.5">
            {tips.map((tip, i) => (
              <li
                key={i}
                className="text-[12px] text-yellow-700 font-medium flex items-start gap-2"
              >
                <span className="text-yellow-500 mt-0.5">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
