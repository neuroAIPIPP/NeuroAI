'use client';

import { FaceListResponse } from '@/lib/api/faceApi';
import { Search, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

interface RegisteredFacesSectionProps {
  faces: FaceListResponse;
  onDelete: (name: string) => void;
}

export default function RegisteredFacesSection({
  faces,
  onDelete,
}: RegisteredFacesSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNames = faces.names.filter((name) =>
    name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col relative overflow-hidden min-h-[320px] h-auto">
      {/* Decorative top right corner element */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full translate-x-1/2 -translate-y-1/2"></div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h2 className="text-2xl font-bold text-[#2A3441]">
            Registered Faces
          </h2>
          <span className="self-start sm:self-auto px-3.5 py-1 bg-[#8EACCD]/10 text-[#5C7FA3] border border-[#8EACCD]/20 rounded-full text-xs font-bold">
            {faces.total_faces} Terdaftar
          </span>
        </div>

        {/* Search Input */}
        {faces.names.length > 0 && (
          <div className="relative mb-4">
            <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama wajah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8EACCD] focus:border-transparent transition-all text-sm"
            />
          </div>
        )}

        {/* List container: scrolls when exceeding 5 items (~380px max height) */}
        <div className="overflow-y-auto pr-1 custom-scrollbar max-h-[380px]">
          {filteredNames.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 min-h-[200px]">
              <p className="text-gray-500 font-semibold text-sm">
                {searchQuery
                  ? 'Tidak ada nama yang cocok.'
                  : 'Belum ada wajah yang terdaftar.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNames.map((n, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-white/40 hover:bg-white/80 rounded-2xl border border-gray-100 hover:border-[#8EACCD]/20 transition-all hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#8EACCD]/15 text-[#5C7FA3] rounded-full flex items-center justify-center font-bold text-base shadow-sm">
                      {n.charAt(0).toUpperCase()}
                    </div>
                    <p className="font-bold text-[#2A3441]">{n}</p>
                  </div>
                  <button
                    onClick={() => onDelete(n)}
                    className="p-2.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all active:scale-95"
                    title="Hapus wajah"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
