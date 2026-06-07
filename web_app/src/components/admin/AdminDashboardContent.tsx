import AdminEngagementChart from '@/components/admin/AdminEngagementChart';
import InfoCard from '@/components/dashboard/InfoCard';
import { AdminDashboardData } from '@/lib/services/adminService';
import React from 'react';

import AdminDashboardStats from './AdminDashboardStats';

export default function AdminDashboardContent({
  data,
}: {
  data: AdminDashboardData;
}) {
  return (
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
        <AdminDashboardStats data={data} />

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[300px]">
          {/* Chart takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <AdminEngagementChart chartData={data.chartData} />
          </div>

          {/* Info Cards take up 1 column, stacked */}
          <div className="grid grid-cols-1 gap-6">
            <InfoCard
              title="NeuroAI Services Status"
              items={[
                { label: 'EEG Server', value: 'Healthy & Connected' },
                { label: 'Face API', value: 'Active (Latency: 45ms)' },
                { label: 'Eye Tracking API', value: 'Active (Latency: 28ms)' },
                { label: 'Database', value: 'Synced' },
              ]}
            />
            <InfoCard
              title="Live Active Sessions"
              items={[
                {
                  label: 'Active Sessions',
                  value: `${data.liveSessions} users currently studying`,
                },
                { label: 'EEG Headsets', value: 'Monitoring' },
                { label: 'System Load', value: 'Normal' },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
