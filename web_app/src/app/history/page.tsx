import Navbar from '@/components/Navbar';
import { MOCK_ADMIN_ANALYSES } from '@/components/admin/mockData';
import HistoryStats from '@/components/history/HistoryStats';
import HistoryTable from '@/components/history/HistoryTable';
import { MOCK_SESSIONS } from '@/components/history/mockData';
import {
  HistorySession,
  StudySessionWithRelations,
} from '@/components/history/types';
import BackgroundGlow from '@/components/ui/BackgroundGlow';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { formatSessionData } from '@/lib/services/historyService';
import { headers } from 'next/headers';

export default async function HistoryPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let dbSessions: StudySessionWithRelations[] = [];

  if (session?.user) {
    dbSessions = await prisma.studySession.findMany({
      where: { userId: session.user.id },
      include: {
        user: true,
        analyses: true,
      },
      orderBy: { startTime: 'desc' },
    });
  }

  let formattedSessions: HistorySession[] = [];
  let avgFocus = '0';
  let totalSessions = 0;

  if (dbSessions.length > 0) {
    const formatted = formatSessionData(dbSessions);
    formattedSessions = formatted.formattedSessions;
    avgFocus = formatted.avgFocus;
    totalSessions = formatted.totalSessions;
  } else {
    // Fallback to MOCK_SESSIONS and attach mock analyses
    formattedSessions = MOCK_SESSIONS.map((s, idx) => {
      const mockAnalysis =
        MOCK_ADMIN_ANALYSES[idx % MOCK_ADMIN_ANALYSES.length];
      return {
        ...s,
        analysis: {
          ...mockAnalysis,
          sessionId: s.id,
        },
      };
    });
    totalSessions = MOCK_SESSIONS.length;
    let sumFocus = 0;
    MOCK_SESSIONS.forEach((s) => (sumFocus += s.focusScore));
    avgFocus = (sumFocus / MOCK_SESSIONS.length).toFixed(1);
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <BackgroundGlow />

      <Navbar />

      <div className="pt-28 pb-12 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen flex flex-col relative z-10">
        <HistoryStats avgFocus={avgFocus} totalSessions={totalSessions} />
        <HistoryTable initialSessions={formattedSessions} />
      </div>
    </main>
  );
}
