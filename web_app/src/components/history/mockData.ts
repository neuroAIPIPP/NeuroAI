import { HistorySession } from './types';

// Updated templates with Course Names (Matakuliah) matching the university theme
const templates = [
  {
    name: 'Algoritma & Pemrograman (Alprog)',
    lead: 'Dr. Ir. Budi Santoso',
    duration: '1h 30m',
  },
  {
    name: 'Struktur Data (Strukdat)',
    lead: 'Prof. Ani Lestari',
    duration: '2h 00m',
  },
  {
    name: 'Sistem Basis Data',
    lead: 'Dr. Hendra Wijaya',
    duration: '1h 45m',
  },
  {
    name: 'Pemrograman Web (Pemweb)',
    lead: 'Rian Putera, M.Cs.',
    duration: '1h 15m',
  },
  {
    name: 'Kecerdasan Buatan (AI)',
    lead: 'Siti Rahma, M.T.',
    duration: '2h 15m',
  },
  {
    name: 'Arsitektur Komputer (Arkom)',
    lead: 'Dr. Ir. Budi Santoso',
    duration: '1h 00m',
  },
  {
    name: 'Jaringan Komputer (Jarkom)',
    lead: 'Prof. Ani Lestari',
    duration: '1h 50m',
  },
  {
    name: 'Keamanan Informasi',
    lead: 'Dr. Hendra Wijaya',
    duration: '2h 30m',
  },
  {
    name: 'Sistem Operasi (Sisop)',
    lead: 'Rian Putera, M.Cs.',
    duration: '2h 00m',
  },
  {
    name: 'Rekayasa Perangkat Lunak (RPL)',
    lead: 'Siti Rahma, M.T.',
    duration: '1h 40m',
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
