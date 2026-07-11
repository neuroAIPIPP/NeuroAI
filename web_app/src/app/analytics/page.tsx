'use client';

import Navbar from '@/components/Navbar';
import { MOCK_ADMIN_ANALYSES } from '@/components/admin/mockData';
import AIInsights from '@/components/analytics/AIInsights';
import BetaWaveTrends from '@/components/analytics/BetaWaveTrends';
import EngagementScoreCard from '@/components/analytics/EngagementScoreCard';
import FocusDistractionCard from '@/components/analytics/FocusDistractionCard';
import NeuralStateDistribution from '@/components/analytics/NeuralStateDistribution';
import InfoTooltip from '@/components/ui/InfoTooltip';
import { GLOSSARY } from '@/config/glossary';
import {
  downloadCsv,
  generateBulkAnalysisCsv,
  generateSingleAnalysisCsv,
} from '@/utils/csvExport';
import {
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';

// Types for the analysis data
interface AnalysisData {
  id: string;
  sessionId: string;
  concentrationScore: number;
  eyeTrackingScore: number;
  eegScore: number;
  focusPercentage: number;
  gazeDistribution: Record<string, number>;
  pupilStability: number;
  attentionIndex: number | null;
  relaxationIndex: number | null;
  bandPowers: Record<string, number> | null;
  aiSummary: string | null;
  aiStrengths: string[] | null;
  aiImprovements: string[] | null;
  aiPatterns: string[] | null;
  aiTips: string[] | null;
  aiGenerated: boolean;
  videoTitle: string | null;
  eegMode: string | null;
  confidenceLevel: string;
  createdAt: string;
  session?: {
    id: string;
    startTime: string;
    endTime: string | null;
    status: string;
  };
}

function AnalyticsPageContent() {
  const searchParams = useSearchParams();
  const sessionIdParam = searchParams.get('sessionId');

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'info' | 'error';
  } | null>(null);
  const [isResyncing, setIsResyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [analyses, setAnalyses] = useState<AnalysisData[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisData | null>(
    null,
  );
  const [stats, setStats] = useState<{
    totalSessions: number;
    avgConcentration: number;
  }>({ totalSessions: 0, avgConcentration: 0 });

  // Focus timeline placeholder — would need full analysis data from backend
  const [focusTimeline, setFocusTimeline] = useState<
    { video_time: number; focus_ratio: number }[]
  >([]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Fetch analyses from API
  const fetchAnalyses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/session/analyze');
      if (!response.ok) {
        throw new Error('Failed to fetch analyses');
      }
      const data = await response.json();

      if (data.status === 'success') {
        const dbAnalyses = data.analyses || [];

        // Map database analyses, or fall back to mock analyses if empty
        const mockAnalyses = MOCK_ADMIN_ANALYSES.map((a, idx) => ({
          ...a,
          sessionId: String(idx + 1), // Aligns with MOCK_SESSIONS ids "1", "2", "3"...
          user: {
            name: 'Sample User',
            email: 'user@neuroai.id',
          },
        }));

        const allAnalyses: AnalysisData[] =
          dbAnalyses.length > 0 ? dbAnalyses : mockAnalyses;

        setAnalyses(allAnalyses);
        setStats(
          dbAnalyses.length > 0
            ? data.stats
            : { totalSessions: allAnalyses.length, avgConcentration: 84.9 },
        );

        // Find match in our active list
        const matched = allAnalyses.find(
          (a) => a.sessionId === sessionIdParam || a.id === sessionIdParam,
        );
        setSelectedAnalysis(matched || allAnalyses[0]);
      }
    } catch (error) {
      console.error('[Analytics] Error fetching analyses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionIdParam]);

  useEffect(() => {
    if (analyses.length > 0 && sessionIdParam) {
      const matched = analyses.find((a) => a.sessionId === sessionIdParam);
      if (matched && selectedAnalysis?.sessionId !== sessionIdParam) {
        setSelectedAnalysis(matched);
      }
    }
  }, [sessionIdParam, analyses, selectedAnalysis]);

  const handleExport = () => {
    if (selectedAnalysis) {
      const csv = generateSingleAnalysisCsv(selectedAnalysis);
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
      const csv = generateBulkAnalysisCsv(analyses);
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

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  // When selected analysis changes, try to get focus timeline from full analysis
  useEffect(() => {
    if (!selectedAnalysis) {
      setFocusTimeline([]);
      return;
    }

    // Try to get full analysis with timeline from session analyze API
    const fetchFullAnalysis = async () => {
      try {
        const response = await fetch(
          `/api/session/analyze?sessionId=${selectedAnalysis.sessionId}`,
        );
        if (response.ok) {
          const data = await response.json();
          // The focus timeline isn't stored in DB, so we generate a synthetic one
          // from the concentration score for visualization purposes
          if (data.analysis) {
            // Generate a synthetic timeline from the score
            const score = data.analysis.focusPercentage || 0;
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
          }
        }
      } catch {
        // Silent fail — timeline is optional
      }
    };

    fetchFullAnalysis();
  }, [selectedAnalysis]);

  const handleResync = async () => {
    setIsResyncing(true);
    setNotification({ message: 'Syncing data...', type: 'info' });
    await fetchAnalyses();
    setIsResyncing(false);
    setNotification({
      message: 'Data berhasil diperbarui!',
      type: 'success',
    });
  };

  // Previous session score for delta comparison
  const previousScore =
    analyses.length > 1 ? analyses[1].concentrationScore : undefined;

  return (
    <main className="min-h-screen relative overflow-hidden">
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

      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-blue-100/30 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-yellow-100/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

      <Navbar />

      <div className="pt-28 pb-12 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen flex flex-col relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-[2.75rem] font-bold text-[#2A3441] tracking-tight">
              Analytics
            </h1>
            {stats.totalSessions > 0 && (
              <p className="text-sm text-gray-400 font-medium mt-1">
                {stats.totalSessions} session dianalisis · Rata-rata konsentrasi{' '}
                {stats.avgConcentration.toFixed(1)}%
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* Session selector */}
            {analyses.length > 1 && (
              <select
                value={selectedAnalysis?.id || ''}
                onChange={(e) => {
                  const selected = analyses.find(
                    (a) => a.id === e.target.value,
                  );
                  setSelectedAnalysis(selected || null);
                }}
                className="px-4 py-2.5 bg-white border border-gray-200 text-sm font-bold text-[#2A3441] rounded-full focus:outline-none focus:ring-2 focus:ring-[#8EACCD] shadow-sm"
              >
                {analyses.map((a, i) => (
                  <option key={a.id} value={a.id}>
                    Session {analyses.length - i} —{' '}
                    {new Date(a.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {' · '}
                    {Math.round(a.concentrationScore)}%
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#3B526A] text-white text-sm font-bold rounded-full hover:bg-[#2C3F53] transition-all shadow-md border-none cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={handleExportAll}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#2A3441] text-white text-sm font-bold rounded-full hover:bg-[#1E2832] transition-all shadow-md border-none cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export All CSV
            </button>

            <button
              onClick={handleResync}
              disabled={isResyncing}
              className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-full transition-all shadow-md ${
                isResyncing
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#E2E8D5] text-[#4D5E3A] hover:bg-[#D5DCC6]'
              }`}
            >
              <RefreshCw
                className={`w-4 h-4 ${isResyncing ? 'animate-spin' : ''}`}
              />
              {isResyncing ? 'Syncing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex-grow flex flex-col items-center justify-center gap-4 min-h-[400px]">
            <Loader2 className="w-10 h-10 text-[#8EACCD] animate-spin" />
            <p className="text-sm font-bold text-gray-400">
              Memuat data analisis...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && analyses.length === 0 && (
          <div className="flex-grow flex flex-col items-center justify-center gap-6 min-h-[400px]">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-gray-300" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#2A3441] mb-2">
                Belum Ada Data Analisis
              </h2>
              <p className="text-gray-400 text-sm font-medium max-w-md">
                Jalankan session belajar terlebih dahulu. Setelah session
                selesai, analisis konsentrasi akan otomatis dijalankan.
              </p>
            </div>
          </div>
        )}

        {/* Main Content Grid — with real data */}
        {!isLoading && selectedAnalysis && (
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
                  selectedAnalysis.bandPowers as
                    | Record<string, number>
                    | undefined
                }
                eegQuality={
                  selectedAnalysis.eegMode === 'Mock' ? 'moderate' : 'good'
                }
                eegMode={selectedAnalysis.eegMode}
                attentionIndex={selectedAnalysis.attentionIndex ?? undefined}
              />
            </div>

            {/* Middle Left: Focus Timeline (2 columns) */}
            <div className="lg:col-span-2">
              <BetaWaveTrends
                focusTimeline={focusTimeline}
                bandPowers={
                  selectedAnalysis.bandPowers as
                    | Record<string, number>
                    | undefined
                }
              />
            </div>

            {/* Middle Right: AI Insights (1 column) */}
            <div className="lg:col-span-1">
              <AIInsights
                summary={selectedAnalysis.aiSummary ?? undefined}
                strengths={
                  (selectedAnalysis.aiStrengths as string[]) ?? undefined
                }
                improvements={
                  (selectedAnalysis.aiImprovements as string[]) ?? undefined
                }
                patterns={
                  (selectedAnalysis.aiPatterns as string[]) ?? undefined
                }
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
              <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col">
                <h3 className="text-lg font-bold text-[#2A3441] mb-6">
                  Session Details
                </h3>
                <div className="space-y-4 flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                      Eye Tracking
                      <InfoTooltip content={GLOSSARY.eyeTrackingScore} />
                    </span>
                    <span className="text-sm font-bold text-[#2A3441]">
                      {selectedAnalysis.eyeTrackingScore.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                      EEG Score
                      <InfoTooltip content={GLOSSARY.eegScore} />
                    </span>
                    <span className="text-sm font-bold text-[#2A3441]">
                      {selectedAnalysis.eegScore.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                      Pupil Stability
                      <InfoTooltip content={GLOSSARY.pupilStability} />
                    </span>
                    <span className="text-sm font-bold text-[#2A3441]">
                      {selectedAnalysis.pupilStability.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                      Confidence
                      <InfoTooltip content={GLOSSARY.confidenceLevel} />
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        selectedAnalysis.confidenceLevel === 'high'
                          ? 'text-green-600'
                          : selectedAnalysis.confidenceLevel === 'medium'
                            ? 'text-amber-600'
                            : 'text-gray-400'
                      }`}
                    >
                      {selectedAnalysis.confidenceLevel === 'high'
                        ? '● High'
                        : selectedAnalysis.confidenceLevel === 'medium'
                          ? '● Medium'
                          : '● Low'}
                    </span>
                  </div>
                  {selectedAnalysis.videoTitle && (
                    <div className="pt-4 border-t border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Materi
                      </span>
                      <p className="text-sm font-bold text-[#2A3441] mt-1">
                        {selectedAnalysis.videoTitle}
                      </p>
                    </div>
                  )}
                  <div className="pt-4 border-t border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Waktu Analisis
                    </span>
                    <p className="text-sm font-bold text-[#2A3441] mt-1">
                      {new Date(selectedAnalysis.createdAt).toLocaleString(
                        'id-ID',
                        {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        },
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-[#8EACCD] animate-spin" />
        </div>
      }
    >
      <AnalyticsPageContent />
    </Suspense>
  );
}
