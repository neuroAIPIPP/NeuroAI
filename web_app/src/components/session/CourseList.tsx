'use client';

import React from 'react';

import CourseCard from './CourseCard';

// Dummy data for courses
export const DUMMY_COURSES = [
  {
    id: 'imk',
    title: 'Interaksi Manusia & Komputer (B)',
  },
  {
    id: 'ppl1',
    title: 'Proyek Perangkat Lunak I (B)',
  },
  {
    id: 'ai',
    title: 'Kecerdasan Buatan (A)',
  },
  {
    id: 'jarkom',
    title: 'Jaringan Komputer (C)',
  },
];

export default function CourseList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {DUMMY_COURSES.map((course) => (
        <CourseCard key={course.id} id={course.id} title={course.title} />
      ))}
    </div>
  );
}
