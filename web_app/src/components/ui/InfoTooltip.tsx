'use client';

import { Info } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface InfoTooltipProps {
  content: string;
  position?: 'top' | 'bottom';
  className?: string;
}

export default function InfoTooltip({
  content,
  position = 'top',
  className = '',
}: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 200); // 200ms delay to prevent accidental triggers
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <span
      className={`relative inline-flex items-center ml-1.5 cursor-help ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Info className="w-3.5 h-3.5 text-gray-400 hover:text-[#3B526A] transition-colors" />

      {isVisible && (
        <span
          className={`absolute z-[9999] w-64 p-3 bg-white border border-gray-100 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),_0_8px_10px_-6px_rgba(0,0,0,0.1)] text-left normal-case tracking-normal transition-all duration-200 select-none pointer-events-none text-[11px] leading-relaxed font-semibold text-gray-500
            ${position === 'top' ? 'bottom-full left-1/2 -translate-x-1/2 mb-2' : 'top-full left-1/2 -translate-x-1/2 mt-2'}
          `}
        >
          {content}
          {/* Caret/Arrow */}
          <span
            className={`absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-l border-t border-gray-100 rotate-45
              ${position === 'top' ? 'top-full -translate-y-1/2 border-l-0 border-t-0 border-r border-b' : 'bottom-full translate-y-1/2'}
            `}
          />
        </span>
      )}
    </span>
  );
}
