'use client';

import { AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import React from 'react';

interface FaceRegisterFormProps {
  name: string;
  setName: (name: string) => void;
  isRegistering: boolean;
  backendAvailable: boolean;
  stream: MediaStream | null;
  statusMsg: {
    type: 'success' | 'error' | '';
    text: string;
  };
  onRegister: () => void;
}

export default function FaceRegisterForm({
  name,
  setName,
  isRegistering,
  backendAvailable,
  stream,
  statusMsg,
  onRegister,
}: FaceRegisterFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">
          Nama Lengkap
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Masukkan nama Anda..."
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8EACCD] focus:border-transparent transition-all shadow-sm"
          disabled={isRegistering || !backendAvailable}
        />
      </div>

      {statusMsg.text && (
        <div
          className={`p-3.5 rounded-2xl flex items-center gap-2.5 text-sm font-semibold transition-all shadow-sm ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-100 text-emerald-700'
              : 'bg-rose-50 border border-rose-100 text-rose-700'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
          ) : (
            <AlertTriangle className="w-4.5 h-4.5 text-rose-500 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <button
        onClick={onRegister}
        disabled={isRegistering || !name.trim() || !stream || !backendAvailable}
        className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
          !(isRegistering || !name.trim() || !stream || !backendAvailable)
            ? 'bg-[#8EACCD] text-white hover:bg-[#7899BD] shadow-lg active:scale-[0.98]'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isRegistering ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            Mendaftarkan...
          </>
        ) : (
          'Capture & Register'
        )}
      </button>
    </div>
  );
}
