'use client';

import Navbar from '@/components/Navbar';
import CourseList from '@/components/session/CourseList';
import React from 'react';

export default function SessionCoursesPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-transparent">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-blue-100/30 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-yellow-100/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

      <Navbar />

      <div className="pt-28 pb-12 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen flex flex-col relative z-10">
        <div className="mb-10">
          <h1 className="text-[2.75rem] font-bold text-[#2A3441] tracking-tight mb-2">
            Select Course
          </h1>
          <p className="text-[15px] font-medium text-[#64748B]">
            Please select a course to join the session.
          </p>
        </div>

        <CourseList />
      </div>
    </main>
  );
}
