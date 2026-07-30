'use client';

import { AnalysisData, MOCK_ADMIN_ANALYSES } from '@/components/admin/mockData';
import {
  AnalysisData as CsvAnalysisData,
  downloadCsv,
  generateBulkAnalysisCsv,
  generateSingleAnalysisCsv,
} from '@/utils/csvExport';
import { CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import AdminAnalyticsGrid from './AdminAnalyticsGrid';
import AdminAnalyticsHeader from './AdminAnalyticsHeader';
import AdminAnalyticsStates from './AdminAnalyticsStates';

export default function AdminAnalyticsPanel() {
  const searchParams = useSearchParams();
  const sessionIdParam = searchParams.get('sessionId');

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'info' | 'error';
  } | null>(null);
  const [isResyncing, setIsResyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analyses, setAnalyses] = useState<AnalysisData[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisData | null>(
    null,
  );
  const [stats, setStats] = useState<{
    totalSessions: number;
    avgConcentration: number;
  }>({ totalSessions: 0, avgConcentration: 0 });

  const [focusTimeline, setFocusTimeline] = useState<
    { video_time: number; focus_ratio: number }[]
  >([]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchAnalyses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/analytics');
      if (response.ok) {
        const data = await response.json();

        const dbAnalyses =
          data.status === 'success' && data.analyses ? data.analyses : [];

        if (dbAnalyses.length > 0) {
          const updatedAnalyses: AnalysisData[] = dbAnalyses.map(
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
              avgConcentration: 0,
            },
          );

          const matched = updatedAnalyses.find(
            (a) => a.sessionId === sessionIdParam,
          );
          setSelectedAnalysis(matched || updatedAnalyses[0]);
        } else {
          // Fallback to MOCK_ADMIN_ANALYSES mapped with sessionId mock-1, mock-2...
          const mockAnalyses = MOCK_ADMIN_ANALYSES.map((a, idx) => ({
            ...a,
            sessionId: `mock-${idx + 1}`,
          }));

          setAnalyses(mockAnalyses);
          setStats({
            totalSessions: mockAnalyses.length,
            avgConcentration: 84.9,
          });

          const matched = mockAnalyses.find(
            (a) => a.sessionId === sessionIdParam || a.id === sessionIdParam,
          );
          setSelectedAnalysis(matched || mockAnalyses[0]);
        }
      }
    } catch (error) {
      console.error('[Admin Analytics] Error fetching analyses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionIdParam]);

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  useEffect(() => {
    if (analyses.length > 0 && sessionIdParam) {
      const matched = analyses.find((a) => a.sessionId === sessionIdParam);
      if (matched && selectedAnalysis?.sessionId !== sessionIdParam) {
        setSelectedAnalysis(matched);
      }
    }
  }, [sessionIdParam, analyses, selectedAnalysis]);

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
      // Cast type as any to bypass minor interface differences if any
      const csv = generateSingleAnalysisCsv(
        selectedAnalysis as unknown as CsvAnalysisData,
      );
      const dateStr = new Date(selectedAnalysis.createdAt)
        .toISOString()
        .slice(0, 10);
      downloadCsv(csv, `neuroai-analisis-${dateStr}.csv`);
      setNotification({ message: 'Export CSV berhasil!', type: 'success' });
    } else {
      setNotification({
        message: 'Tidak ada data untuk di-export',
        type: 'error',
      });
    }
  };

  const handleExportAll = () => {
    if (analyses.length > 0) {
      const csv = generateBulkAnalysisCsv(
        analyses as unknown as CsvAnalysisData[],
      );
      const dateStr = new Date().toISOString().slice(0, 10);
      downloadCsv(csv, `neuroai-semua-analisis-${dateStr}.csv`);
      setNotification({
        message: `${analyses.length} data berhasil diexport ke CSV!`,
        type: 'success',
      });
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
        onExportAll={handleExportAll}
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
