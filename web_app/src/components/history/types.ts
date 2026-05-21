import { LucideIcon } from 'lucide-react';

export interface HistorySession {
  id: string;
  user: string;
  name: string;
  lead: string;
  duration: string;
  focusScore: number;
  date: string;
  icon: LucideIcon;
  iconColor: 'blue' | 'green' | 'red' | 'yellow';
}
