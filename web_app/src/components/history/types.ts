import { Prisma } from '@/app/generated/prisma/client';

export interface HistorySession {
  id: string;
  user: string;
  name: string;
  lead: string;
  duration: string;
  focusScore: number;
  date: string;
}

export type StudySessionWithRelations = Prisma.StudySessionGetPayload<{
  include: {
    user: true;
    analyses: true;
  };
}>;
