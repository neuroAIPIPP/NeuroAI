import { Prisma } from '@/app/generated/prisma/client';
import AdminHistoryPanel from '@/components/admin/AdminHistoryPanel';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { MOCK_ADMIN_SESSIONS } from '@/components/admin/mockData';
import { HistorySession } from '@/components/history/types';
import prisma from '@/lib/prisma';

type StudySessionWithRelations = Prisma.StudySessionGetPayload<{
  include: {
    user: true;
    analyses: true;
  };
}>;

export default async function AdminHistoryPage() {
  let dbSessions: StudySessionWithRelations[] = [];

  try {
    dbSessions = await prisma.studySession.findMany({
      include: {
        user: true,
        analyses: true,
      },
      orderBy: { startTime: 'desc' },
      take: 50,
    });
  } catch (error) {
    console.warn(
      '[Admin History] DB query failed or not initialized, using mock data:',
      error,
    );
  }

  // Calculate statistics
  let totalFocusScore = 0;
  let sessionsWithFocus = 0;

  const formattedSessions: HistorySession[] =
    dbSessions.length > 0
      ? dbSessions.map((s) => {
          const durationMs = s.endTime
            ? s.endTime.getTime() - s.startTime.getTime()
            : 0;
          const hours = Math.floor(durationMs / (1000 * 60 * 60));
          const minutes = Math.floor(
            (durationMs % (1000 * 60 * 60)) / (1000 * 60),
          );
          const durationStr =
            hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

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
            user: s.user?.name || 'Unknown User',
            name:
              s.analyses && s.analyses.length > 0 && s.analyses[0].videoTitle
                ? s.analyses[0].videoTitle
                : 'General Study Session',
            lead: 'Self Study',
            duration: durationStr || '0m',
            focusScore,
            date: s.startTime.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
          };
        })
      : MOCK_ADMIN_SESSIONS;

  if (dbSessions.length === 0) {
    formattedSessions.forEach((s) => {
      totalFocusScore += s.focusScore;
      sessionsWithFocus++;
    });
  }

  const avgFocus =
    sessionsWithFocus > 0
      ? (totalFocusScore / sessionsWithFocus).toFixed(1)
      : '0';
  const totalSessions =
    dbSessions.length > 0 ? dbSessions.length : formattedSessions.length;

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-blue-100/30 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-yellow-100/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

      <AdminNavbar />
      <AdminHistoryPanel
        initialSessions={formattedSessions}
        avgFocus={avgFocus}
        totalSessions={totalSessions}
      />
    </main>
  );
}
