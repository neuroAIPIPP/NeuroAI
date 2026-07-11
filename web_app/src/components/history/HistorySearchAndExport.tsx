'use client';

import { FileSpreadsheet } from 'lucide-react';
import React from 'react';

import HistorySearchFilter from './HistorySearchFilter';

interface HistorySearchAndExportProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  filterOptions: string[];
  hasFilteredSessions: boolean;
  onExportFiltered: () => void;
}

export default function HistorySearchAndExport({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  filterOptions,
  hasFilteredSessions,
  onExportFiltered,
}: HistorySearchAndExportProps) {
  return (
    <div className="relative flex flex-col md:flex-row justify-center items-center gap-4 w-full">
      <div className="w-full max-w-[600px] mx-auto">
        <HistorySearchFilter
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          selectedFilter={selectedFilter}
          onFilterChange={onFilterChange}
          filterOptions={filterOptions}
        />
      </div>
      {hasFilteredSessions && (
        <div className="md:absolute md:right-0">
          <button
            onClick={onExportFiltered}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#3B526A] text-white text-sm font-bold rounded-full hover:bg-[#2C3F53] transition-all shadow-md cursor-pointer shrink-0 border-none"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export Filtered CSV
          </button>
        </div>
      )}
    </div>
  );
}
