import { Prisma } from '@/app/generated/prisma/client';
import Navbar from '@/components/Navbar';
import HistoryTable from '@/components/history/HistoryTable';
import { HistorySession } from '@/components/history/types';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Layers, TrendingUp } from 'lucide-react';
import { headers } from 'next/headers';

type StudySessionWithRelations = Prisma.StudySessionGetPayload<{
  include: {
    user: true;
    analyses: true;
  };
}>;

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

  // Calculate statistics
  let totalFocusScore = 0;
  let sessionsWithFocus = 0;

  const formattedSessions: HistorySession[] = dbSessions.map((s) => {
    // Calculate duration
    const durationMs = s.endTime
      ? s.endTime.getTime() - s.startTime.getTime()
      : 0;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const durationStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    // Focus Score
    const focusScore =
      s.analyses && s.analyses.length > 0
        ? Math.round(s.analyses[0].concentrationScore)
        : 0;

    if (focusScore > 0) {
      totalFocusScore += focusScore;
      sessionsWithFocus++;
    }

    return {
      id: s.id,
      user: s.user.name || 'Unknown',
      name:
        s.analyses && s.analyses.length > 0 && s.analyses[0].videoTitle
          ? s.analyses[0].videoTitle
          : 'General Study Session',
      lead: 'Self Study', // Hardcoded as there's no lead in the DB schema
      duration: durationStr || '0m',
      focusScore,
      date: s.startTime.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };
  });

  const avgFocus =
    sessionsWithFocus > 0
      ? (totalFocusScore / sessionsWithFocus).toFixed(1)
      : '0';
  const totalSessions = dbSessions.length;

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-blue-100/30 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-yellow-100/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

      <Navbar />

      <div className="pt-28 pb-12 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen flex flex-col relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <h1 className="text-[2.75rem] font-bold text-[#2A3441] tracking-tight">
            Session History
          </h1>

          <div className="flex items-center gap-4">
            {/* Avg Focus Stat */}
            <div className="bg-[#E2F0DD] px-5 py-3 rounded-2xl flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-[#4D5E3A]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#4D5E3A] uppercase tracking-widest leading-none mb-1">
                  Avg. Focus
                </span>
                <span className="text-xl font-bold text-[#2A3441] leading-none">
                  {avgFocus}%
                </span>
              </div>
            </div>

            {/* Sessions Stat */}
            <div className="bg-[#D0E2FF] px-5 py-3 rounded-2xl flex items-center gap-3">
              <Layers className="w-5 h-5 text-[#2A5298]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#2A5298] uppercase tracking-widest leading-none mb-1">
                  Sessions
                </span>
                <span className="text-xl font-bold text-[#2A3441] leading-none">
                  {totalSessions}
                </span>
              </div>
            </div>
          </div>
        </div>

        <HistoryTable initialSessions={formattedSessions} />
      </div>
    </main>
  );
}
