'use client';

import Navbar from '@/components/Navbar';
import EngagementChart from '@/components/dashboard/EngagementChart';
import InfoCard from '@/components/dashboard/InfoCard';
import StatCard from '@/components/dashboard/StatCard';
import { useCameraDetection } from '@/hooks/hardware/useCameraDetection';
import { useEEGHeadset } from '@/hooks/hardware/useEEGHeadset';
import { ArrowRight, BarChart2, Clock, Target } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { cameraStatus, lensVisibility } = useCameraDetection();
  const { eegStatus } = useEEGHeadset();

  // Helper to format camera display status
  const getCameraDisplayStatus = () => {
    if (cameraStatus.status !== 'Connected') return cameraStatus.status;
    if (lensVisibility === 'Clear') return 'Active';
    if (lensVisibility === 'Blocked / Covered') return 'Blocked';
    return lensVisibility; // 'Verifying...' or 'Not Checked'
  };
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-blue-100/30 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-yellow-100/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

      <Navbar />

      <div className="pt-28 pb-12 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen flex flex-col relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <h1 className="text-[2.75rem] font-bold text-[#2A3441] tracking-tight">
            Personal Focus Dashboard
          </h1>
          <Link href="/session">
            <button className="px-6 py-3 rounded-full bg-[#3B526A] text-white text-sm font-bold hover:bg-[#2C3F53] transition-colors flex items-center justify-center gap-2 group shadow-lg">
              Go to Session
              <ArrowRight
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                strokeWidth={2.5}
              />
            </button>
          </Link>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          {/* Top Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Average Focus"
              value={
                <>
                  84.2
                  <span className="text-[1.75rem] ml-1 tracking-normal">%</span>
                </>
              }
              subtitle={
                <>
                  <span className="text-gray-900 font-bold">+2.4%</span> vs last
                  month
                </>
              }
              icon={Target}
            />
            <StatCard
              title="Session Duration"
              value={
                <>
                  4h 15
                  <span className="text-[1.75rem] ml-1 tracking-normal">m</span>
                </>
              }
              subtitle="Today"
              icon={Clock}
            />
            <StatCard
              title="Number of Sessions"
              value="5"
              subtitle="This Week"
              icon={BarChart2}
            />
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[300px]">
            {/* Chart takes up 2 columns on large screens */}
            <div className="lg:col-span-2">
              <EngagementChart />
            </div>

            {/* Info Cards take up 1 column, stacked */}
            <div className="grid grid-cols-1 gap-6">
              <InfoCard
                title="Device Status"
                items={[
                  { label: 'EEG', value: eegStatus.status },
                  { label: 'Camera', value: getCameraDisplayStatus() },
                ]}
              />
              <InfoCard
                title="Last Session Summary"
                items={[
                  { label: 'Focus Score', value: '88%' },
                  { label: 'Duration', value: '1h 30m' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
