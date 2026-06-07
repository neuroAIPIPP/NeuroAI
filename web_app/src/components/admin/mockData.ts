import { HistorySession } from '@/components/history/types';

export interface AnalysisData {
  id: string;
  sessionId: string;
  concentrationScore: number;
  eyeTrackingScore: number;
  eegScore: number;
  focusPercentage: number;
  gazeDistribution: Record<string, number>;
  pupilStability: number;
  attentionIndex: number | null;
  relaxationIndex: number | null;
  bandPowers: Record<string, number> | null;
  aiSummary: string | null;
  aiStrengths: string[] | null;
  aiImprovements: string[] | null;
  aiPatterns: string[] | null;
  aiTips: string[] | null;
  aiGenerated: boolean;
  videoTitle: string | null;
  eegMode: string | null;
  confidenceLevel: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

export const MOCK_ADMIN_SESSIONS: HistorySession[] = [
  {
    id: 'mock-1',
    user: 'Ahmad Rafli',
    name: 'Introduction to NeuroAI and Deep Learning',
    lead: 'Self Study',
    duration: '1h 15m',
    focusScore: 84,
    date: 'Jun 7, 2026',
  },
  {
    id: 'mock-2',
    user: 'Siti Aminah',
    name: 'Advanced Signal Processing on EEG',
    lead: 'Self Study',
    duration: '45m',
    focusScore: 92,
    date: 'Jun 6, 2026',
  },
  {
    id: 'mock-3',
    user: 'Budi Santoso',
    name: 'Computer Vision Eye Tracking Calibration',
    lead: 'Self Study',
    duration: '1h 30m',
    focusScore: 78,
    date: 'Jun 6, 2026',
  },
  {
    id: 'mock-4',
    user: 'Ahmad Rafli',
    name: 'Neural Network Architectures',
    lead: 'Self Study',
    duration: '2h 10m',
    focusScore: 81,
    date: 'Jun 5, 2026',
  },
  {
    id: 'mock-5',
    user: 'Siti Aminah',
    name: 'Cognitive Science Foundations',
    lead: 'Self Study',
    duration: '55m',
    focusScore: 88,
    date: 'Jun 4, 2026',
  },
];

export const MOCK_ADMIN_ANALYSES: AnalysisData[] = [
  {
    id: 'analysis-1',
    sessionId: 'session-1',
    concentrationScore: 84.5,
    eyeTrackingScore: 82.1,
    eegScore: 86.9,
    focusPercentage: 84.5,
    gazeDistribution: { screen: 82, distracted: 18 },
    pupilStability: 85.0,
    attentionIndex: 0.82,
    relaxationIndex: 0.65,
    bandPowers: { alpha: 12, beta: 24, theta: 8, delta: 4 },
    aiSummary:
      'Ahmad Rafli menunjukkan tingkat fokus yang sangat stabil pada materi Introduction to NeuroAI. Pola kognitif sangat reseptif selama penjelasan visual.',
    aiStrengths: ['Fokus visual yang konsisten', 'Respons kognitif cepat'],
    aiImprovements: ['Kelelahan ringan di 10 menit terakhir'],
    aiPatterns: [
      'Beta wave stabil pada 15Hz',
      'Alpha wave meningkat saat istirahat slide',
    ],
    aiTips: ['Gunakan metode pomodoro', 'Istirahat visual sejenak'],
    aiGenerated: true,
    videoTitle: 'Introduction to NeuroAI and Deep Learning',
    eegMode: 'Real',
    confidenceLevel: 'high',
    createdAt: '2026-06-07T09:00:00.000Z',
    user: {
      name: 'Ahmad Rafli',
      email: 'rafli@neuroai.id',
    },
  },
  {
    id: 'analysis-2',
    sessionId: 'session-2',
    concentrationScore: 92.0,
    eyeTrackingScore: 90.5,
    eegScore: 93.5,
    focusPercentage: 92.0,
    gazeDistribution: { screen: 93, distracted: 7 },
    pupilStability: 89.0,
    attentionIndex: 0.91,
    relaxationIndex: 0.58,
    bandPowers: { alpha: 10, beta: 28, theta: 6, delta: 3 },
    aiSummary:
      'Siti Aminah berada dalam kondisi flow state selama belajar Advanced Signal Processing. Sangat sedikit distorsi sinyal neural.',
    aiStrengths: [
      'Flow state kognitif yang kuat',
      'Tingkat kedipan mata optimal',
    ],
    aiImprovements: ['Ketegangan fisik terdeteksi (otot leher)'],
    aiPatterns: ['Beta wave tinggi (22Hz)', 'Gaze terpusat pada center screen'],
    aiTips: ['Pertahankan postur tubuh ergonomis'],
    aiGenerated: true,
    videoTitle: 'Advanced Signal Processing on EEG',
    eegMode: 'Real',
    confidenceLevel: 'high',
    createdAt: '2026-06-06T15:30:00.000Z',
    user: {
      name: 'Siti Aminah',
      email: 'siti@neuroai.id',
    },
  },
  {
    id: 'analysis-3',
    sessionId: 'session-3',
    concentrationScore: 78.2,
    eyeTrackingScore: 76.0,
    eegScore: 80.4,
    focusPercentage: 78.2,
    gazeDistribution: { screen: 76, distracted: 24 },
    pupilStability: 79.5,
    attentionIndex: 0.76,
    relaxationIndex: 0.72,
    bandPowers: { alpha: 15, beta: 18, theta: 11, delta: 6 },
    aiSummary:
      'Budi Santoso mengalami fluktuasi perhatian ringan. Terlihat beberapa kali mengalihkan pandangan di luar layar.',
    aiStrengths: ['Mampu kembali fokus dengan cepat'],
    aiImprovements: ['Gangguan fokus visual berulang'],
    aiPatterns: ['Kenaikan theta wave menunjukkan kantuk ringan'],
    aiTips: [
      'Minum air putih sebelum sesi',
      'Kurangi pencahayaan latar belakang ruangan',
    ],
    aiGenerated: true,
    videoTitle: 'Computer Vision Eye Tracking Calibration',
    eegMode: 'Mock',
    confidenceLevel: 'medium',
    createdAt: '2026-06-06T10:15:00.000Z',
    user: {
      name: 'Budi Santoso',
      email: 'budi@neuroai.id',
    },
  },
];
