import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface HistoryPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

export default function HistoryPagination({
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  endIndex,
  totalItems,
}: HistoryPaginationProps) {
  return (
    <div className="flex items-center justify-between py-6 px-6 md:px-8 border-t border-gray-100 bg-white/50">
      <p className="text-[13px] font-medium text-gray-500">
        Showing {totalItems === 0 ? 0 : startIndex + 1} to{' '}
        {Math.min(endIndex, totalItems)} of {totalItems} sessions
      </p>

      {totalPages > 0 && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNumber = idx + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-[13px] font-bold transition-colors cursor-pointer ${
                  currentPage === pageNumber
                    ? 'bg-[#3B526A] text-white shadow-md hover:bg-[#2C3F53]'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
