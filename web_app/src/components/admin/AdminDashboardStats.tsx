import StatCard from '@/components/dashboard/StatCard';
import { AdminDashboardData } from '@/lib/services/adminService';
import { Clock, Target, Users } from 'lucide-react';
import React from 'react';

export default function AdminDashboardStats({
  data,
}: {
  data: AdminDashboardData;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Total Active Users"
        value={
          <>
            {data.totalUsers}
            <span className="text-[1.75rem] ml-1 tracking-normal">users</span>
          </>
        }
        subtitle="Registered on platform"
        icon={Users}
      />
      <StatCard
        title="Platform Focus Avg."
        value={
          <>
            {data.avgFocus}
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
            {data.totalSessionHours}
            <span className="text-[1.75rem] ml-1 tracking-normal">hrs</span>
          </>
        }
        subtitle="Recorded across all users"
        icon={Clock}
      />
    </div>
  );
}
