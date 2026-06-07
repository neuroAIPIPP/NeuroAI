import { Brain } from 'lucide-react';
import React from 'react';

interface AuthHeaderProps {
  title: string;
}

export default function AuthHeader({ title }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="bg-[#8eaccd] text-white p-3.5 rounded-2xl mb-3 shadow-sm">
        <Brain size={32} />
      </div>
      <h2 className="text-[#8eaccd] font-semibold text-lg mb-1">
        NeuroLearn AI
      </h2>
      <h1 className="text-4xl font-bold text-gray-800">{title}</h1>
    </div>
  );
}
