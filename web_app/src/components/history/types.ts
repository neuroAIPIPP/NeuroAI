import { Prisma } from '@/app/generated/prisma/client';

import { AnalysisData } from '../admin/mockData';

export interface HistorySession {
  id: string;
  user: string;
  name: string;
  lead: string;
  duration: string;
  focusScore: number;
  date: string;
  analysis?: AnalysisData | null;
}

export type StudySessionWithRelations = Prisma.StudySessionGetPayload<{
  include: {
    user: true;
    analyses: true;
  };
}>;
