'use client';

import AdminSessionDetailsCard from '@/components/admin/AdminSessionDetailsCard';
import AIInsights from '@/components/analytics/AIInsights';
import BetaWaveTrends from '@/components/analytics/BetaWaveTrends';
import EngagementScoreCard from '@/components/analytics/EngagementScoreCard';
import FocusDistractionCard from '@/components/analytics/FocusDistractionCard';
import NeuralStateDistribution from '@/components/analytics/NeuralStateDistribution';
import React from 'react';

import { AnalysisData } from './mockData';

interface AdminAnalyticsGridProps {
  selectedAnalysis: AnalysisData;
  previousScore?: number;
  focusTimeline: { video_time: number; focus_ratio: number }[];
}

export default function AdminAnalyticsGrid({
  selectedAnalysis,
  previousScore,
  focusTimeline,
}: AdminAnalyticsGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Top Left: Engagement Score (2 columns) */}
      <div className="lg:col-span-2">
        <EngagementScoreCard
          concentrationScore={selectedAnalysis.concentrationScore}
          previousScore={previousScore}
          perVideoScores={
            selectedAnalysis.videoTitle
              ? selectedAnalysis.videoTitle.split(', ').map((title) => ({
                  videoTitle: title,
                  score: selectedAnalysis.concentrationScore,
                }))
              : undefined
          }
        />
      </div>

      {/* Top Right: Neural State Distribution (1 column) */}
      <div className="lg:col-span-1">
        <NeuralStateDistribution
          bandPowers={
            selectedAnalysis.bandPowers as Record<string, number> | undefined
          }
          eegQuality={selectedAnalysis.eegMode === 'Mock' ? 'moderate' : 'good'}
          eegMode={selectedAnalysis.eegMode}
          attentionIndex={selectedAnalysis.attentionIndex ?? undefined}
        />
      </div>

      {/* Middle Left: Focus Timeline (2 columns) */}
      <div className="lg:col-span-2">
        <BetaWaveTrends
          focusTimeline={focusTimeline}
          bandPowers={
            selectedAnalysis.bandPowers as Record<string, number> | undefined
          }
        />
      </div>

      {/* Middle Right: AI Insights (1 column) */}
      <div className="lg:col-span-1">
        <AIInsights
          summary={selectedAnalysis.aiSummary ?? undefined}
          strengths={(selectedAnalysis.aiStrengths as string[]) ?? undefined}
          improvements={
            (selectedAnalysis.aiImprovements as string[]) ?? undefined
          }
          patterns={(selectedAnalysis.aiPatterns as string[]) ?? undefined}
          tips={(selectedAnalysis.aiTips as string[]) ?? undefined}
          aiGenerated={selectedAnalysis.aiGenerated}
        />
      </div>

      {/* Bottom Left: Focus vs. Distraction (2 columns) */}
      <div className="lg:col-span-2">
        <FocusDistractionCard
          focusPercentage={selectedAnalysis.focusPercentage}
          gazeDistribution={
            selectedAnalysis.gazeDistribution as Record<string, number>
          }
          focusTimeline={focusTimeline}
        />
      </div>

      {/* Bottom Right: Session Meta Info */}
      <div className="lg:col-span-1">
        <AdminSessionDetailsCard selectedAnalysis={selectedAnalysis} />
      </div>
    </div>
  );
}
