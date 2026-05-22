import { Calendar, ChevronDown, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface HistorySearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  filterOptions: string[];
}

export default function HistorySearchFilter({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  filterOptions,
}: HistorySearchFilterProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  return (
    <div className="relative z-30 flex items-center gap-4 bg-white/60 backdrop-blur-sm p-2 rounded-2xl border border-white/50 shadow-sm mx-auto w-full max-w-[600px]">
      {/* Search Input */}
      <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
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
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onFilterChange(option);
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors ${
                  selectedFilter === option
                    ? 'text-[#3B526A] font-bold bg-blue-50/50'
                    : 'text-gray-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
