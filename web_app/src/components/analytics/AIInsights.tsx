'use client';

import { AlertCircle, Lightbulb, Sparkles } from 'lucide-react';
import React from 'react';

const insights = [
  {
    title: 'Efficiency Peak',
    description:
      'Focus peak detected during complex problem solving at the 45-minute mark. Beta-wave synchronization was exceptional.',
    icon: Lightbulb,
    color: '#E3F2FD',
    iconColor: '#1E88E5',
  },
  {
    title: 'Neural Habit',
    description:
      'Early-session performance is 14% higher than afternoon sessions. Consider scheduling heavy logic tasks before 11:00 AM.',
    icon: Sparkles,
    color: '#FFF3E0',
    iconColor: '#FB8C00',
  },
  {
    title: 'Recovery Alert',
    description:
      'Distraction spikes increased toward the end of Phase 3. A 5-minute pre-emptive break could mitigate this fatigue.',
    icon: AlertCircle,
    color: '#FBE9E7',
    iconColor: '#F4511E',
  },
];

export default function AIInsights() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <Sparkles className="w-5 h-5 text-[#2A3441]" />
        <h3 className="text-lg font-bold text-[#2A3441]">AI Insights</h3>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.title}
            className="p-5 rounded-2xl border border-[#F1F3F6] hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div
                className="p-2 rounded-xl"
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
    </div>
  );
}
