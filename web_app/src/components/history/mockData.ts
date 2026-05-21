import {
  Brain,
  Code,
  Cpu,
  Database,
  GitBranch,
  Globe,
  Layers,
  Network,
  Shield,
  Terminal,
} from 'lucide-react';

import { HistorySession } from './types';

// Updated templates with Course Names (Matakuliah) matching the university theme
const templates = [
  {
    name: 'Algoritma & Pemrograman (Alprog)',
    lead: 'Dr. Ir. Budi Santoso',
    duration: '1h 30m',
    icon: Code,
    iconColor: 'blue',
  },
  {
    name: 'Struktur Data (Strukdat)',
    lead: 'Prof. Ani Lestari',
    duration: '2h 00m',
    icon: Layers,
    iconColor: 'green',
  },
  {
    name: 'Sistem Basis Data',
    lead: 'Dr. Hendra Wijaya',
    duration: '1h 45m',
    icon: Database,
    iconColor: 'yellow',
  },
  {
    name: 'Pemrograman Web (Pemweb)',
    lead: 'Rian Putera, M.Cs.',
    duration: '1h 15m',
    icon: Globe,
    iconColor: 'blue',
  },
  {
    name: 'Kecerdasan Buatan (AI)',
    lead: 'Siti Rahma, M.T.',
    duration: '2h 15m',
    icon: Brain,
    iconColor: 'red',
  },
  {
    name: 'Arsitektur Komputer (Arkom)',
    lead: 'Dr. Ir. Budi Santoso',
    duration: '1h 00m',
    icon: Cpu,
    iconColor: 'yellow',
  },
  {
    name: 'Jaringan Komputer (Jarkom)',
    lead: 'Prof. Ani Lestari',
    duration: '1h 50m',
    icon: Network,
    iconColor: 'green',
  },
  {
    name: 'Keamanan Informasi',
    lead: 'Dr. Hendra Wijaya',
    duration: '2h 30m',
    icon: Shield,
    iconColor: 'red',
  },
  {
    name: 'Sistem Operasi (Sisop)',
    lead: 'Rian Putera, M.Cs.',
    duration: '2h 00m',
    icon: Terminal,
    iconColor: 'blue',
  },
  {
    name: 'Rekayasa Perangkat Lunak (RPL)',
    lead: 'Siti Rahma, M.T.',
    duration: '1h 40m',
    icon: GitBranch,
    iconColor: 'green',
  },
];

// Generate 25 mock sessions for pagination testing
export const generateMockSessions = (): HistorySession[] => {
  return Array.from({ length: 25 }).map((_, i) => {
    const template = templates[i % templates.length];
    const mockUsers = ['Andi', 'Budi', 'Citra', 'Dewi', 'Eka'];
    return {
      id: `${i + 1}`,
      user: mockUsers[i % mockUsers.length],
      name: template.name,
      lead: template.lead,
      duration: template.duration,
      focusScore: 40 + ((i * 17) % 55), // Deterministic value between 40 and 95
      date: `Oct ${24 - (i % 10)}, 2024`,
      icon: template.icon,
      iconColor: template.iconColor as 'blue' | 'green' | 'red' | 'yellow',
    };
  });
};

export const MOCK_SESSIONS = generateMockSessions();
export const ITEMS_PER_PAGE = 10;
export const FILTER_OPTIONS = [
  'Last 7 Days',
  'Last 30 Days',
  'This Year',
  'All Time',
];
