'use client';

import Navbar from '@/components/Navbar';
import { DUMMY_COURSES } from '@/components/session/CourseList';
import MeetingList from '@/components/session/MeetingList';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';

export default function CourseMeetingsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  // Unwrap the params promise using React.use (Next.js 15+ requirement)
  const resolvedParams = React.use(params);
  const course = DUMMY_COURSES.find((c) => c.id === resolvedParams.courseId);

  if (!course) {
    notFound();
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-transparent">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-blue-100/30 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-yellow-100/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

      <Navbar />

      <div className="pt-28 pb-12 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen flex flex-col relative z-10">
        <div className="mb-8">
          <Link
            href="/session"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-bold text-[#64748B] hover:text-[#2A3441] hover:shadow-sm transition-all mb-6 border border-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Course List
          </Link>

          <h1 className="text-[2rem] font-bold text-[#2A3441] tracking-tight mb-2">
            {course.title}
          </h1>
          <p className="text-[15px] font-medium text-[#64748B]">
            Select a meeting or material to study today.
          </p>
        </div>

        <MeetingList courseId={course.id} />
      </div>
    </main>
  );
}
