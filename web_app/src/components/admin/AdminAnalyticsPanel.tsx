'use client';

import { AnalysisData, MOCK_ADMIN_ANALYSES } from '@/components/admin/mockData';
import { CheckCircle2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import AdminAnalyticsGrid from './AdminAnalyticsGrid';
import AdminAnalyticsHeader from './AdminAnalyticsHeader';
import AdminAnalyticsStates from './AdminAnalyticsStates';

export default function AdminAnalyticsPanel() {
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'info' | 'error';
  } | null>(null);
  const [isResyncing, setIsResyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analyses, setAnalyses] = useState<AnalysisData[]>(MOCK_ADMIN_ANALYSES);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisData | null>(
    MOCK_ADMIN_ANALYSES[0],
  );
  const [stats, setStats] = useState<{
    totalSessions: number;
    avgConcentration: number;
  }>({ totalSessions: 3, avgConcentration: 84.9 });

  const [focusTimeline, setFocusTimeline] = useState<
    { video_time: number; focus_ratio: number }[]
  >([]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Fetch analyses from API (optional Admin analytics endpoint if implemented, fallback to mock data)
  const fetchAnalyses = useCallback(async () => {
    setIsLoading(true);
    try {
      // Admin dashboard can query user sessions
      const response = await fetch('/api/session/analyze');
      if (response.ok) {
        const data = await response.json();
        if (
          data.status === 'success' &&
          data.analyses &&
          data.analyses.length > 0
        ) {
          const updatedAnalyses = data.analyses.map(
            (
              a: Omit<AnalysisData, 'user'> & {
                session?: {
                  user?: { name?: string | null; email: string } | null;
                };
              },
            ) => ({
              ...a,
              user: a.session?.user
                ? {
                    name: a.session.user.name || 'Platform User',
                    email: a.session.user.email,
                  }
                : { name: 'Platform User', email: 'user@neuroai.id' },
            }),
          );
          setAnalyses(updatedAnalyses);
          setStats(
            data.stats || {
              totalSessions: updatedAnalyses.length,
              avgConcentration: 84.9,
            },
          );
          setSelectedAnalysis(updatedAnalyses[0]);
        }
      }
    } catch (error) {
      console.error('[Admin Analytics] Error fetching analyses:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Generate synthetic timeline when selectedAnalysis changes
    if (!selectedAnalysis) {
      setFocusTimeline([]);
      return;
    }

    const score = selectedAnalysis.focusPercentage || 0;
    const duration = 300; // Assume 5-minute video
    const syntheticTimeline = [];
    for (let t = 0; t < duration; t += 5) {
      const noise = (Math.random() - 0.5) * 0.3;
      const ratio = Math.max(0, Math.min(1, score / 100 + noise));
      syntheticTimeline.push({
        video_time: t,
        focus_ratio: ratio,
      });
    }
    setFocusTimeline(syntheticTimeline);
  }, [selectedAnalysis]);

  const handleExport = () => {
    if (selectedAnalysis) {
      const blob = new Blob([JSON.stringify(selectedAnalysis, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `neuroai-admin-analysis-${selectedAnalysis.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setNotification({ message: 'Export data berhasil!', type: 'success' });
    } else {
      setNotification({
        message: 'Tidak ada data untuk di-export',
        type: 'error',
      });
    }
  };

  const handleResync = async () => {
    setIsResyncing(true);
    setNotification({ message: 'Sinkronisasi data platform...', type: 'info' });
    await fetchAnalyses();
    setIsResyncing(false);
    setNotification({
      message: 'Data analisis diperbarui!',
      type: 'success',
    });
  };

  // Previous session score for delta comparison
  const previousScore =
    analyses.length > 1 ? analyses[1].concentrationScore : undefined;

  return (
    <div className="pt-28 pb-12 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen flex flex-col relative z-10">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
              notification.type === 'success'
                ? 'bg-white border-green-100 text-green-800'
                : notification.type === 'error'
                  ? 'bg-white border-red-100 text-red-800'
                  : 'bg-white border-blue-100 text-blue-800'
            }`}
          >
            <CheckCircle2
              className={`w-5 h-5 ${
                notification.type === 'success'
                  ? 'text-green-500'
                  : notification.type === 'error'
                    ? 'text-red-500'
                    : 'text-blue-500'
              }`}
            />
            <span className="font-bold text-sm">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header / Dropdown Selector & Action Buttons */}
      <AdminAnalyticsHeader
        totalSessions={stats.totalSessions}
        avgConcentration={stats.avgConcentration}
        analyses={analyses}
        selectedAnalysis={selectedAnalysis}
        onSelectAnalysis={setSelectedAnalysis}
        onExport={handleExport}
        onResync={handleResync}
        isResyncing={isResyncing}
      />

      {/* Loading & Empty State Views */}
      <AdminAnalyticsStates
        isLoading={isLoading}
        hasData={analyses.length > 0}
      />

      {/* Analytics Charts Grid Display */}
      {!isLoading && selectedAnalysis && (
        <AdminAnalyticsGrid
          selectedAnalysis={selectedAnalysis}
          previousScore={previousScore}
          focusTimeline={focusTimeline}
        />
      )}
    </div>
  );
}
