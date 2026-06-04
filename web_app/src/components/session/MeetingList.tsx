'use client';

import React from 'react';

import MeetingCard from './MeetingCard';

export const DUMMY_MEETINGS = [
  { id: 'm1', title: 'Pertemuan 1: Pengumuman Akademik & Silabus' },
  { id: 'm2', title: 'Pertemuan 2: Penilaian dan Feedback Project' },
  { id: 'm3', title: 'Pertemuan 3: Kantong Pengumpulan Sertifikat' },
  { id: 'm4', title: 'Pertemuan 4: Review Materi Tengah Semester' },
];

interface MeetingListProps {
  courseId: string;
}

export default function MeetingList({ courseId }: MeetingListProps) {
  return (
    <div className="flex flex-col gap-4">
      {DUMMY_MEETINGS.map((meeting) => (
        <MeetingCard
          key={meeting.id}
          id={meeting.id}
          courseId={courseId}
          title={meeting.title}
        />
      ))}
    </div>
  );
}
