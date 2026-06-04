'use client';

import { TrackingData } from '@/hooks/useEyeTracking';
import { Sparkles } from 'lucide-react';
import React from 'react';

interface SessionAIInsightsCardProps {
  isTracking: boolean;
  trackingData: TrackingData | null;
}

export default function SessionAIInsightsCard({
  isTracking,
  trackingData,
}: SessionAIInsightsCardProps) {
  return (
    <div className="bg-[#FFF9E5] border border-yellow-200/50 rounded-2xl p-5 flex gap-4">
      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
        <Sparkles className="w-5 h-5 text-yellow-600" />
      </div>
      <div>
        <p className="text-[13px] font-medium text-yellow-800 leading-snug">
          {isTracking ? (
            trackingData?.isFocused ? (
              <>
                Good concentration detected. Your patterns suggest you&apos;re
                in a <span className="font-bold">Flow State</span>.
              </>
            ) : (
              <>Distraction detected. Try to refocus on the video content.</>
            )
          ) : (
            'Session paused. Tracking will resume once you continue the video.'
          )}
        </p>
      </div>
    </div>
  );
}
