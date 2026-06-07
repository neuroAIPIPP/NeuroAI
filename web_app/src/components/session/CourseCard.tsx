'use client';

import { Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface CourseCardProps {
  id: string;
  title: string;
  code?: string;
}

export default function CourseCard({ id, title, code }: CourseCardProps) {
  return (
    <Link href={`/session/course/${id}`}>
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col relative overflow-hidden h-full hover:shadow-lg transition-shadow cursor-pointer border border-transparent hover:border-gray-100 group">
        {/* Placeholder Image Area */}
        <div className="w-full h-40 bg-gradient-to-br from-[#E2E8F0] to-[#F8FAFC] flex flex-col items-center justify-center text-[#94A3B8] relative overflow-hidden">
          <ImageIcon className="w-12 h-12 mb-2 opacity-50 group-hover:scale-110 transition-transform duration-500" />
          <span className="text-xs font-bold uppercase tracking-wider opacity-70">
            Course Thumbnail
          </span>
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
        </div>

        {/* Content Area */}
        <div className="p-6 flex flex-col flex-1">
          {code && (
            <div className="text-[11px] font-bold text-[#64748B] tracking-wider mb-2 uppercase">
              {code}
            </div>
          )}
          <h3 className="text-lg font-bold text-[#2A3441] leading-tight line-clamp-2">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
