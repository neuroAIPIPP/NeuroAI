'use client';

import AdminEngagementChart from '@/components/admin/AdminEngagementChart';
import AdminNavbar from '@/components/admin/AdminNavbar';
import InfoCard from '@/components/dashboard/InfoCard';
import StatCard from '@/components/dashboard/StatCard';
import { Activity, Clock, Server, Target, Users } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-blue-100/30 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-yellow-100/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

      <AdminNavbar />

      <div className="pt-28 pb-12 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen flex flex-col relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-[2.75rem] font-bold text-[#2A3441] tracking-tight">
              Admin Overview Dashboard
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Monitor system performance, user engagement, and neural analytics
              platform-wide.
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          {/* Top Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Active Users"
              value={
                <>
                  142
                  <span className="text-[1.75rem] ml-1 tracking-normal">
                    users
                  </span>
                </>
              }
              subtitle={
                <>
                  <span className="text-green-600 font-bold">+12%</span> vs last
                  week
                </>
              }
              icon={Users}
            />
            <StatCard
              title="Platform Focus Avg."
              value={
                <>
                  81.5
                  <span className="text-[1.75rem] ml-1 tracking-normal">%</span>
                </>
              }
              subtitle="Aggregated from all active sessions"
              icon={Target}
            />
            <StatCard
              title="Total Session Time"
              value={
                <>
                  482
                  <span className="text-[1.75rem] ml-1 tracking-normal">
                    hrs
                  </span>
                </>
              }
              subtitle="This Month"
              icon={Clock}
            />
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[300px]">
            {/* Chart takes up 2 columns on large screens */}
            <div className="lg:col-span-2">
              <AdminEngagementChart />
            </div>

            {/* Info Cards take up 1 column, stacked */}
            <div className="grid grid-cols-1 gap-6">
              <InfoCard
                title="NeuroAI Services Status"
                items={[
                  { label: 'EEG Server', value: 'Healthy & Connected' },
                  { label: 'Face API', value: 'Active (Latency: 45ms)' },
                  {
                    label: 'Eye Tracking API',
                    value: 'Active (Latency: 28ms)',
                  },
                  { label: 'Database', value: 'Synced' },
                ]}
              />
              <InfoCard
                title="Live Active Sessions"
                items={[
                  {
                    label: 'Active Sessions',
                    value: '4 users currently study',
                  },
                  { label: 'EEG Headsets', value: '3 devices active' },
                  { label: 'Camera Streams', value: '4 feeds streaming' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
