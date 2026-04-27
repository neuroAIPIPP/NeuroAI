import React from 'react';

interface InfoCardProps {
  title: string;
  items: { label: string; value: string }[];
}

export default function InfoCard({ title, items }: InfoCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col justify-center h-full">
      <h3 className="text-[13px] font-bold text-gray-600 mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="text-[13px] font-medium flex items-center"
          >
            <span className="text-gray-500 w-24">{item.label}:</span>
            <span className="text-[#2A3441]">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
