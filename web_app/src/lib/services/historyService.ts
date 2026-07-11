import { AnalysisData } from '@/components/admin/mockData';
import {
  HistorySession,
  StudySessionWithRelations,
} from '@/components/history/types';

export function formatSessionData(dbSessions: StudySessionWithRelations[]): {
  formattedSessions: HistorySession[];
  avgFocus: string;
  totalSessions: number;
} {
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
      analysis:
        s.analyses && s.analyses.length > 0
          ? (s.analyses[0] as unknown as AnalysisData)
          : null,
    };
  });

  const avgFocus =
    sessionsWithFocus > 0
      ? (totalFocusScore / sessionsWithFocus).toFixed(1)
      : '0';
  const totalSessions = dbSessions.length;

  return { formattedSessions, avgFocus, totalSessions };
}
