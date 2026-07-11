'use client';

import { downloadCsv, generateBulkAnalysisCsv } from '@/utils/csvExport';
import { FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';

import { AnalysisData } from '../admin/mockData';
import HistoryPagination from './HistoryPagination';
import HistorySearchFilter from './HistorySearchFilter';
import HistoryTableHeader from './HistoryTableHeader';
import HistoryTableRow from './HistoryTableRow';
import { FILTER_OPTIONS, ITEMS_PER_PAGE } from './mockData';
import { HistorySession } from './types';

interface HistoryTableProps {
  initialSessions: HistorySession[];
  isAdmin?: boolean;
}

export default function HistoryTable({
  initialSessions,
  isAdmin,
}: HistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(FILTER_OPTIONS[1]); // 'Last 30 Days'

  // Filter sessions based on search query
  const filteredSessions = initialSessions.filter((session) => {
    const query = searchQuery.toLowerCase();
    return (
      session.name.toLowerCase().includes(query) ||
      session.lead.toLowerCase().includes(query) ||
      session.user.toLowerCase().includes(query) ||
      session.date.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredSessions.length / ITEMS_PER_PAGE);

  // Safety check if current page exceeds total pages due to filtering
  const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
  const safeStartIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;

  const paginatedSessions = filteredSessions.slice(
    safeStartIndex,
    safeStartIndex + ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    setCurrentPage(1); // Reset to first page on filter
  };

  const handleExportFiltered = () => {
    const validAnalyses = filteredSessions
      .map((s) => {
        if (!s.analysis) return null;
        return {
          ...s.analysis,
          user: {
            name: s.user,
            email: '',
          },
        };
      })
      .filter(
        (a): a is NonNullable<typeof a> => a !== null,
      ) as unknown as AnalysisData[];

    if (validAnalyses.length === 0) {
      alert(
        'Tidak ada data analisis yang bisa diekport untuk sesi terfilter ini.',
      );
      return;
    }

    const csv = generateBulkAnalysisCsv(validAnalyses);
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadCsv(csv, `neuroai-history-filtered-${dateStr}.csv`);
  };

  return (
    <div className="flex flex-col gap-6 w-full mx-auto">
      {/* Search, Filter and Export */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
        <div className="w-full max-w-[600px] mx-auto md:mx-0">
          <HistorySearchFilter
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            selectedFilter={selectedFilter}
            onFilterChange={handleFilterChange}
            filterOptions={FILTER_OPTIONS}
          />
        </div>
        {filteredSessions.length > 0 && (
          <button
            onClick={handleExportFiltered}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#3B526A] text-white text-sm font-bold rounded-full hover:bg-[#2C3F53] transition-all shadow-md cursor-pointer shrink-0 border-none"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export Filtered CSV
          </button>
        )}
      </div>

      {/* Table Card */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden shadow-sm border border-white/50 w-full">
        {/* Table Header */}
        <HistoryTableHeader />

        {/* Table Rows */}
        <div className="flex flex-col min-h-[400px]">
          {paginatedSessions.length > 0 ? (
            paginatedSessions.map((session) => (
              <HistoryTableRow
                key={session.id}
                session={session}
                isAdmin={isAdmin}
              />
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 font-medium">
              No sessions found.
            </div>
          )}
        </div>

        {/* Pagination */}
        <HistoryPagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          startIndex={safeStartIndex}
          endIndex={safeStartIndex + ITEMS_PER_PAGE}
          totalItems={filteredSessions.length}
        />
      </div>
    </div>
  );
}
