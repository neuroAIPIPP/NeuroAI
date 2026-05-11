'use client';

import Navbar from '@/components/Navbar';
import AIInsights from '@/components/analytics/AIInsights';
import BetaWaveTrends from '@/components/analytics/BetaWaveTrends';
import EngagementScoreCard from '@/components/analytics/EngagementScoreCard';
import FocusDistractionCard from '@/components/analytics/FocusDistractionCard';
import NeuralStateDistribution from '@/components/analytics/NeuralStateDistribution';
import { CheckCircle2, Download, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AnalyticsPage() {
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'info';
  } | null>(null);
  const [isResyncing, setIsResyncing] = useState(false);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleExport = () => {
    // Simulate export
    setNotification({ message: 'Export berhasil!', type: 'success' });
  };

  const handleResync = () => {
    setIsResyncing(true);
    setNotification({ message: 'Syncing data...', type: 'info' });

    // Simulate refresh/resync
    setTimeout(() => {
      setIsResyncing(false);
      setNotification({
        message: 'Data berhasil diperbarui!',
        type: 'success',
      });
      // In a real app, we might call router.refresh() or refetch data
    }, 1500);
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
              notification.type === 'success'
                ? 'bg-white border-green-100 text-green-800'
                : 'bg-white border-blue-100 text-blue-800'
            }`}
          >
            <CheckCircle2
              className={`w-5 h-5 ${notification.type === 'success' ? 'text-green-500' : 'text-blue-500'}`}
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
          <h1 className="text-[2.75rem] font-bold text-[#2A3441] tracking-tight">
            Analytics
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#3B526A] text-white text-sm font-bold rounded-full hover:bg-[#2C3F53] transition-all shadow-md border-none"
            >
              <Download className="w-4 h-4" />
              Export PDF
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
              {isResyncing ? 'Syncing...' : 'Re-Sync Data'}
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Left: Engagement Score (2 columns) */}
          <div className="lg:col-span-2">
            <EngagementScoreCard />
          </div>

          {/* Top Right: Neural State Distribution (1 column) */}
          <div className="lg:col-span-1">
            <NeuralStateDistribution />
          </div>

          {/* Middle Left: Beta-Wave Trends (2 columns) */}
          <div className="lg:col-span-2">
            <BetaWaveTrends />
          </div>

          {/* Middle Right: AI Insights (1 column) */}
          <div className="lg:col-span-1">
            <AIInsights />
          </div>

          {/* Bottom Left: Focus vs. Distraction (2 columns) */}
          <div className="lg:col-span-2">
            <FocusDistractionCard />
          </div>
        </div>
      </div>
    </main>
  );
}
