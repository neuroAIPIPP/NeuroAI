import { downloadCsv, generateSingleAnalysisCsv } from '@/utils/csvExport';
import { Download } from 'lucide-react';
import Link from 'next/link';

import { HistorySession } from './types';

interface HistoryTableRowProps {
  session: HistorySession;
  isAdmin?: boolean;
}

export default function HistoryTableRow({
  session,
  isAdmin,
}: HistoryTableRowProps) {
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-[#3B526A]';
    if (score >= 60) return 'bg-[#556b2f]'; // Olive/Greenish for medium
    return 'bg-[#993333]'; // Dark Red for low
  };

  const handleExportRow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session.analysis) {
      alert('Sesi ini belum memiliki data analisis.');
      return;
    }
    const exportData = {
      ...session.analysis,
      user: {
        name: session.user,
        email: '',
      },
    };
    const csv = generateSingleAnalysisCsv(exportData);
    const dateStr = session.date.replace(/,/g, '').replace(/\s+/g, '-');
    downloadCsv(csv, `neuroai-${session.user}-${dateStr}.csv`);
  };

  return (
    <div className="flex items-center justify-between py-5 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-6 md:px-8 bg-white">
      {/* User */}
      <div className="w-[15%]">
        <span className="text-[14px] font-bold text-[#2A3441]">
          {session.user}
        </span>
      </div>

      {/* Session Name & Lead */}
      <div className="flex items-center gap-4 w-[25%]">
        <div>
          <h4 className="text-[15px] font-bold text-[#2A3441] leading-tight">
            {session.name}
          </h4>
          <p className="text-[13px] font-medium text-gray-500">
            Lead: {session.lead}
          </p>
        </div>
      </div>

      {/* Duration */}
      <div className="w-[15%]">
        <span className="text-[14px] font-medium text-gray-600">
          {session.duration}
        </span>
      </div>

      {/* Avg Focus Score */}
      <div className="w-[20%] flex items-center gap-4">
        <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${getProgressColor(session.focusScore)}`}
            style={{ width: `${session.focusScore}%` }}
          />
        </div>
        <span className="text-[14px] font-bold text-[#2A3441] w-8">
          {session.focusScore}%
        </span>
      </div>

      {/* Date */}
      <div className="w-[12%]">
        <span className="text-[14px] font-medium text-gray-600">
          {session.date}
        </span>
      </div>

      {/* Actions */}
      <div className="w-[13%] flex justify-end items-center gap-2">
        <button
          onClick={handleExportRow}
          disabled={!session.analysis}
          title={session.analysis ? 'Export CSV' : 'Analisis belum tersedia'}
          className={`p-2 border rounded-lg transition-colors shadow-sm cursor-pointer ${
            session.analysis
              ? 'bg-white hover:bg-gray-50 border-gray-200 text-[#3B526A]'
              : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
        </button>
        <Link
          href={
            isAdmin
              ? `/admin/analytics?sessionId=${session.id}`
              : `/analytics?sessionId=${session.id}`
          }
        >
          <button className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#2A3441] text-[12px] font-bold rounded-lg transition-colors shadow-sm cursor-pointer">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}
