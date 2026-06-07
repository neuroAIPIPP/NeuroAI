'use client';

import { ChevronRight, FileText } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface MeetingCardProps {
  id: string;
  courseId: string;
  title: string;
}

export default function MeetingCard({ id, courseId, title }: MeetingCardProps) {
  return (
    <Link href={`/session/calibration?meetingId=${id}&courseId=${courseId}`}>
      <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-[#8EACCD]/30 group">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F1F5F9] group-hover:bg-[#8EACCD]/10 flex items-center justify-center transition-colors">
            <FileText className="w-6 h-6 text-[#64748B] group-hover:text-[#8EACCD] transition-colors" />
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-[#2A3441] group-hover:text-[#8EACCD] transition-colors">
              {title}
            </h4>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-transparent group-hover:bg-[#F8FAFC] flex items-center justify-center transition-colors">
          <ChevronRight className="w-5 h-5 text-[#CBD5E1] group-hover:text-[#8EACCD]" />
        </div>
      </div>
    </Link>
  );
}
