'use client';

import { useState } from 'react';

import HistoryPagination from './HistoryPagination';
import HistorySearchFilter from './HistorySearchFilter';
import HistoryTableHeader from './HistoryTableHeader';
import HistoryTableRow from './HistoryTableRow';
import { FILTER_OPTIONS, ITEMS_PER_PAGE, MOCK_SESSIONS } from './mockData';

export default function HistoryTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(FILTER_OPTIONS[1]); // 'Last 30 Days'

  // Filter sessions based on search query
  const filteredSessions = MOCK_SESSIONS.filter((session) => {
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

  return (
    <div className="flex flex-col gap-6 w-full mx-auto">
      {/* Search and Filter */}
      <HistorySearchFilter
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
        filterOptions={FILTER_OPTIONS}
      />

      {/* Table Card */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden shadow-sm border border-white/50 w-full">
        {/* Table Header */}
        <HistoryTableHeader />

        {/* Table Rows */}
        <div className="flex flex-col min-h-[400px]">
          {paginatedSessions.length > 0 ? (
            paginatedSessions.map((session) => (
              <HistoryTableRow key={session.id} session={session} />
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
