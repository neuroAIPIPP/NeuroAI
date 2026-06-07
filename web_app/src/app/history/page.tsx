import Navbar from '@/components/Navbar';
import HistoryStats from '@/components/history/HistoryStats';
import HistoryTable from '@/components/history/HistoryTable';
import { StudySessionWithRelations } from '@/components/history/types';
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

  const { formattedSessions, avgFocus, totalSessions } =
    formatSessionData(dbSessions);

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
