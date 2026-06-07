'use client';

import React from 'react';

import { AnalysisData } from './mockData';

interface AdminSessionDetailsCardProps {
  selectedAnalysis: AnalysisData;
}

export default function AdminSessionDetailsCard({
  selectedAnalysis,
}: AdminSessionDetailsCardProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col">
      <h3 className="text-lg font-bold text-[#2A3441] mb-6">
        Selected Session Details
      </h3>
      <div className="space-y-4 flex-grow">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            User
          </span>
          <span className="text-sm font-bold text-[#2A3441]">
            {selectedAnalysis.user?.name}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Email
          </span>
          <span className="text-sm text-gray-500 font-medium">
            {selectedAnalysis.user?.email}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Eye Tracking
          </span>
          <span className="text-sm font-bold text-[#2A3441]">
            {selectedAnalysis.eyeTrackingScore.toFixed(1)}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            EEG Score
          </span>
          <span className="text-sm font-bold text-[#2A3441]">
            {selectedAnalysis.eegScore.toFixed(1)}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Pupil Stability
          </span>
          <span className="text-sm font-bold text-[#2A3441]">
            {selectedAnalysis.pupilStability.toFixed(1)}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Confidence
          </span>
          <span
            className={`text-sm font-bold ${
              selectedAnalysis.confidenceLevel === 'high'
                ? 'text-green-600'
                : selectedAnalysis.confidenceLevel === 'medium'
                  ? 'text-amber-600'
                  : 'text-gray-400'
            }`}
          >
            {selectedAnalysis.confidenceLevel === 'high'
              ? '● High'
              : selectedAnalysis.confidenceLevel === 'medium'
                ? '● Medium'
                : '● Low'}
          </span>
        </div>
        {selectedAnalysis.videoTitle && (
          <div className="pt-4 border-t border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Materi
            </span>
            <p className="text-sm font-bold text-[#2A3441] mt-1">
              {selectedAnalysis.videoTitle}
            </p>
          </div>
        )}
        <div className="pt-4 border-t border-gray-100">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Waktu Analisis
          </span>
          <p className="text-sm font-bold text-[#2A3441] mt-1">
            {new Date(selectedAnalysis.createdAt).toLocaleString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
