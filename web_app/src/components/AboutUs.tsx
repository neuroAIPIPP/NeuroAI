import React from 'react';

const teamMembers = [
  {
    id: 1,
    name: 'Marchellin Chenika',
    npm: '140810230002',
    role: 'FRONTEND DEVELOPER',
    imageUrl:
      'https://media.unpad.ac.id/photo/mahasiswa/140810/2023/140810230002.JPG',
  },
  {
    id: 2,
    name: 'Muhammad Hafizh Fenaldi',
    npm: '140810230006',
    role: 'AI ENGINEER',
    imageUrl:
      'https://media.unpad.ac.id/photo/mahasiswa/140810/2023/140810230006.JPG',
  },
  {
    id: 3,
    name: 'Raymond Frans Dodi Situmorang',
    npm: '140810230030',
    role: 'BACKEND API DEVELOPER',
    imageUrl:
      'https://media.unpad.ac.id/photo/mahasiswa/140810/2023/140810230030.JPG',
  },
];

export default function AboutUs() {
  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-10 md:p-16">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-[#2A3441] tracking-tight">
          Meet the Team
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
          A multidisciplinary collective of neuroscientists, engineers, and
          ethicists dedicated to human potential.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex flex-col items-center">
            <div className="w-[85%] max-w-[240px] mt-4 aspect-[4/5] rounded-3xl bg-gray-200 mb-6 overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm relative group">
              <img
                src={member.imageUrl}
                alt={`Foto ${member.name}`}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            <h3 className="text-xl font-bold text-[#2A3441] mb-0.5 text-center">
              {member.name}
            </h3>
            <p className="text-sm font-medium text-gray-500 mb-2 text-center">
              {member.npm}
            </p>
            <p className="text-xs font-bold text-[#8EACCD] tracking-widest uppercase text-center">
              {member.role}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
