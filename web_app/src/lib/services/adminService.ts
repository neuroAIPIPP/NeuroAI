import prisma from '@/lib/prisma';

export type ChartDataPoint = {
  name: string;
  activeUsers: number;
  avgFocus: number;
};

export type AdminDashboardData = {
  totalUsers: number;
  avgFocus: number;
  totalSessionHours: number;
  liveSessions: number;
  chartData: ChartDataPoint[];
};

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const totalUsers = await prisma.user.count();

  const analyses = await prisma.concentrationAnalysis.findMany({
    select: {
      concentrationScore: true,
      createdAt: true,
      session: { select: { userId: true } },
    },
  });

  const totalFocus = analyses.reduce((sum, a) => sum + a.concentrationScore, 0);
  const avgFocus = analyses.length > 0 ? totalFocus / analyses.length : 0;

  const sessions = await prisma.studySession.findMany({
    select: { startTime: true, endTime: true, status: true },
  });

  const liveSessions = sessions.filter(
    (s) => s.status === 'active' || !s.endTime,
  ).length;

  let totalMs = 0;
  sessions.forEach((s) => {
    if (s.endTime) {
      totalMs += s.endTime.getTime() - s.startTime.getTime();
    }
  });
  const totalSessionHours = Math.round(totalMs / (1000 * 60 * 60));

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const chartData: ChartDataPoint[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayName = days[d.getDay()];

    const dayAnalyses = analyses.filter(
      (a) => new Date(a.createdAt).toDateString() === d.toDateString(),
    );
    const uniqueUsers = new Set(dayAnalyses.map((a) => a.session.userId)).size;
    const dayAvgFocus =
      dayAnalyses.length > 0
        ? dayAnalyses.reduce((s, a) => s + a.concentrationScore, 0) /
          dayAnalyses.length
        : 0;

    chartData.push({
      name: dayName,
      activeUsers: uniqueUsers,
      avgFocus: Math.round(dayAvgFocus),
    });
  }

  return {
    totalUsers,
    avgFocus: Math.round(avgFocus * 10) / 10,
    totalSessionHours,
    liveSessions,
    chartData,
  };
}
