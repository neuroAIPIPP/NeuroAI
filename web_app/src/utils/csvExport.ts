export interface AnalysisData {
  id: string;
  sessionId: string;
  concentrationScore: number;
  eyeTrackingScore: number;
  eegScore: number;
  focusPercentage: number;
  gazeDistribution: Record<string, number> | null;
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
  } | null;
}

function escapeCsv(val: unknown): string {
  if (val === null || val === undefined) {
    return '""';
  }

  let str = '';
  if (Array.isArray(val)) {
    str = val.join('; ');
  } else if (typeof val === 'object') {
    str = Object.entries(val)
      .map(([k, v]) => `${k}:${v}`)
      .join('; ');
  } else {
    str = String(val);
  }

  // Escape double quotes by doubling them
  const escaped = str.replace(/"/g, '""');

  // Wrap in double quotes if there are commas, double quotes, or newlines
  if (
    escaped.includes(',') ||
    escaped.includes('\n') ||
    escaped.includes('\r') ||
    escaped.includes('"')
  ) {
    return `"${escaped}"`;
  }

  return `"${escaped}"`;
}

export function generateSingleAnalysisCsv(analysis: AnalysisData): string {
  const headers = [
    'nama_user',
    'email_user',
    'session_id',
    'tanggal',
    'materi_video',
    'skor_konsentrasi',
    'skor_eye_tracking',
    'skor_eeg',
    'persentase_fokus',
    'stabilitas_pupil',
    'attention_index',
    'relaxation_index',
    'mode_eeg',
    'confidence_level',
    'delta_power',
    'theta_power',
    'alpha_power',
    'beta_power',
    'gamma_power',
    'distribusi_pandangan',
    'ai_generated',
    'ai_ringkasan',
    'ai_kekuatan',
    'ai_perbaikan',
  ];

  const row = [
    escapeCsv(analysis.user?.name),
    escapeCsv(analysis.user?.email),
    escapeCsv(analysis.sessionId),
    escapeCsv(new Date(analysis.createdAt).toLocaleString('id-ID')),
    escapeCsv(analysis.videoTitle),
    escapeCsv(analysis.concentrationScore.toFixed(2)),
    escapeCsv(analysis.eyeTrackingScore.toFixed(2)),
    escapeCsv(analysis.eegScore.toFixed(2)),
    escapeCsv(analysis.focusPercentage.toFixed(2)),
    escapeCsv(analysis.pupilStability.toFixed(2)),
    escapeCsv(
      analysis.attentionIndex !== null
        ? (analysis.attentionIndex * 100).toFixed(2) + '%'
        : null,
    ),
    escapeCsv(
      analysis.relaxationIndex !== null
        ? (analysis.relaxationIndex * 100).toFixed(2) + '%'
        : null,
    ),
    escapeCsv(analysis.eegMode),
    escapeCsv(analysis.confidenceLevel),
    escapeCsv(analysis.bandPowers?.delta),
    escapeCsv(analysis.bandPowers?.theta),
    escapeCsv(analysis.bandPowers?.alpha),
    escapeCsv(analysis.bandPowers?.beta),
    escapeCsv(analysis.bandPowers?.gamma),
    escapeCsv(analysis.gazeDistribution),
    escapeCsv(analysis.aiGenerated),
    escapeCsv(analysis.aiSummary),
    escapeCsv(analysis.aiStrengths),
    escapeCsv(analysis.aiImprovements),
  ];

  return [headers.join(','), row.join(',')].join('\n');
}

export function generateBulkAnalysisCsv(analyses: AnalysisData[]): string {
  const headers = [
    'nama_user',
    'email_user',
    'session_id',
    'tanggal',
    'materi_video',
    'skor_konsentrasi',
    'skor_eye_tracking',
    'skor_eeg',
    'persentase_fokus',
    'stabilitas_pupil',
    'attention_index',
    'relaxation_index',
    'mode_eeg',
    'confidence_level',
    'delta_power',
    'theta_power',
    'alpha_power',
    'beta_power',
    'gamma_power',
    'distribusi_pandangan',
    'ai_generated',
    'ai_ringkasan',
    'ai_kekuatan',
    'ai_perbaikan',
  ];

  const rows = analyses.map((analysis) => {
    return [
      escapeCsv(analysis.user?.name),
      escapeCsv(analysis.user?.email),
      escapeCsv(analysis.sessionId),
      escapeCsv(new Date(analysis.createdAt).toLocaleString('id-ID')),
      escapeCsv(analysis.videoTitle),
      escapeCsv(analysis.concentrationScore.toFixed(2)),
      escapeCsv(analysis.eyeTrackingScore.toFixed(2)),
      escapeCsv(analysis.eegScore.toFixed(2)),
      escapeCsv(analysis.focusPercentage.toFixed(2)),
      escapeCsv(analysis.pupilStability.toFixed(2)),
      escapeCsv(
        analysis.attentionIndex !== null
          ? (analysis.attentionIndex * 100).toFixed(2) + '%'
          : null,
      ),
      escapeCsv(
        analysis.relaxationIndex !== null
          ? (analysis.relaxationIndex * 100).toFixed(2) + '%'
          : null,
      ),
      escapeCsv(analysis.eegMode),
      escapeCsv(analysis.confidenceLevel),
      escapeCsv(analysis.bandPowers?.delta),
      escapeCsv(analysis.bandPowers?.theta),
      escapeCsv(analysis.bandPowers?.alpha),
      escapeCsv(analysis.bandPowers?.beta),
      escapeCsv(analysis.bandPowers?.gamma),
      escapeCsv(analysis.gazeDistribution),
      escapeCsv(analysis.aiGenerated),
      escapeCsv(analysis.aiSummary),
      escapeCsv(analysis.aiStrengths),
      escapeCsv(analysis.aiImprovements),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

export function downloadCsv(csvContent: string, filename: string): void {
  // UTF-8 BOM to ensure proper character rendering in Excel
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
