'use client';

import {
  Activity,
  Beaker,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Moon,
  Search,
  Settings,
  Zap,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import HistoryTableRow, { HistorySession } from './HistoryTableRow';

// Generate 25 mock sessions for pagination testing
const generateMockSessions = (): HistorySession[] => {
  const templates = [
    {
      name: 'Alpha Wave Synchronization',
      lead: 'Dr. Aris Thorne',
      duration: '42m 15s',
      icon: Activity,
      iconColor: 'blue',
    },
    {
      name: 'Sleep Cycle Phase II',
      lead: 'Sarah Chen',
      duration: '6h 12m',
      icon: Moon,
      iconColor: 'green',
    },
    {
      name: 'Stress Response Baseline',
      lead: 'Marcus Vane',
      duration: '18m 40s',
      icon: Zap,
      iconColor: 'red',
    },
    {
      name: 'Associative Recall Test',
      lead: 'Dr. Aris Thorne',
      duration: '55m 02s',
      icon: Settings,
      iconColor: 'yellow',
    },
    {
      name: 'Post-Stimulus Calibration',
      lead: 'Sarah Chen',
      duration: '1h 05m',
      icon: Beaker,
      iconColor: 'blue',
    },
  ];

  return Array.from({ length: 25 }).map((_, i) => {
    const template = templates[i % templates.length];
    return {
      id: `${i + 1}`,
      name: template.name,
      lead: template.lead,
      duration: template.duration,
      focusScore: Math.floor(Math.random() * (95 - 40 + 1)) + 40,
      date: `Oct ${24 - (i % 10)}, 2024`,
      icon: template.icon,
      iconColor: template.iconColor as 'blue' | 'green' | 'red' | 'yellow',
    };
  });
};

const MOCK_SESSIONS = generateMockSessions();
const ITEMS_PER_PAGE = 10;
const FILTER_OPTIONS = ['Last 7 Days', 'Last 30 Days', 'This Year', 'All Time'];

export default function HistoryTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Last 30 Days');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalPages = Math.ceil(MOCK_SESSIONS.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSessions = MOCK_SESSIONS.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full mx-auto">
      {/* Search and Filter */}
      <div className="relative z-30 flex items-center gap-4 bg-white/60 backdrop-blur-sm p-2 rounded-2xl border border-white/50 shadow-sm mx-auto w-full max-w-[600px]">
        <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full text-sm font-medium outline-none text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-sm border border-gray-100 text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Calendar className="w-4 h-4 text-gray-400" />
            {selectedFilter}
            <ChevronDown
              className={`w-4 h-4 text-gray-400 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20 animate-in fade-in zoom-in duration-200">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelectedFilter(option);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors ${selectedFilter === option ? 'text-[#3B526A] font-bold bg-blue-50/50' : 'text-gray-600'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table Card */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden shadow-sm border border-white/50 w-full">
        {/* Table Header */}
        <div className="flex items-center justify-between py-4 px-6 md:px-8 bg-slate-100/80 border-b border-slate-200/60">
          <div className="w-[30%]">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Session Name
            </span>
          </div>
          <div className="w-[15%]">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Duration
            </span>
          </div>
          <div className="w-[20%]">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Avg. Focus Score
            </span>
          </div>
          <div className="w-[15%]">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Date
            </span>
          </div>
          <div className="w-[15%] text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Actions
            </span>
          </div>
        </div>

        {/* Table Rows */}
        <div className="flex flex-col min-h-[400px]">
          {paginatedSessions.map((session) => (
            <HistoryTableRow key={session.id} session={session} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between py-6 px-6 md:px-8 border-t border-gray-100 bg-white/50">
          <p className="text-[13px] font-medium text-gray-500">
            Showing {startIndex + 1} to{' '}
            {Math.min(startIndex + ITEMS_PER_PAGE, MOCK_SESSIONS.length)} of{' '}
            {MOCK_SESSIONS.length} sessions
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNumber = idx + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-[13px] font-bold transition-colors ${
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
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
