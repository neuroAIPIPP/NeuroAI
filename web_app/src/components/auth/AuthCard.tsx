import React from 'react';

interface AuthCardProps {
  children: React.ReactNode;
}

export default function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-[420px] p-8 md:p-10 mx-4">
      {children}
    </div>
  );
}
