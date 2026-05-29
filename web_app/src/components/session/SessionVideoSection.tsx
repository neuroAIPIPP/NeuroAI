'use client';

import { Loader2, Sparkles } from 'lucide-react';
import React from 'react';

interface SessionVideoSectionProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  currentVideo: { title: string; subtitle: string; src: string };
  isActive: boolean;
  showSurvey: boolean;
  surveyAnswered: boolean;
  videoProgress: number;
  onVideoEnded: () => void;
  onTimeUpdate: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  onSurveySubmit: (answer: string) => void;
  onNextVideo: () => void;
  isSaving: boolean;
  currentVideoIndex: number;
  totalVideos: number;
}

export default function SessionVideoSection({
  videoRef,
  currentVideo,
  isActive,
  showSurvey,
  surveyAnswered,
  videoProgress,
  onVideoEnded,
  onTimeUpdate,
  onSurveySubmit,
  onNextVideo,
  isSaving,
  currentVideoIndex,
  totalVideos,
}: SessionVideoSectionProps) {
  return (
    <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl group">
      {!showSurvey ? (
        <>
          <video
            ref={videoRef}
            key={currentVideo.src}
            src={currentVideo.src}
            className="w-full h-full object-cover"
            autoPlay={isActive}
            playsInline
            onEnded={onVideoEnded}
            onTimeUpdate={onTimeUpdate}
            controls={false}
          />
          {/* Overlay Info */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 pointer-events-none">
            <div className="flex items-center gap-3 text-white mb-2">
              <div className="px-2 py-0.5 rounded bg-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                Live
              </div>
              <h2 className="text-xl font-bold">{currentVideo.title}</h2>
            </div>
            <div className="flex justify-between items-center text-white/80 text-sm">
              <span>{currentVideo.subtitle}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 bg-[#2A3441]/95 backdrop-blur-sm flex items-center justify-center p-8 text-center">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl transform animate-in fade-in zoom-in duration-300">
            <h3 className="text-2xl font-bold text-[#2A3441] mb-4">
              Bagaimana videonya?
            </h3>
            <p className="text-gray-500 mb-8">
              Seberapa menarik materi yang disampaikan bagi Anda? (1 = Sangat
              Membosankan, 5 = Sangat Menarik)
            </p>

            {!surveyAnswered ? (
              <div className="flex gap-3 mb-6 justify-center">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    onClick={() => onSurveySubmit(score.toString())}
                    className="w-14 h-14 rounded-full border-2 border-[#8EACCD] bg-white hover:bg-[#8EACCD] hover:text-white transition-all text-xl font-bold text-[#8EACCD] hover:scale-110 shadow-sm"
                  >
                    {score}
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-green-50 text-green-700 p-4 rounded-2xl mb-8 flex items-center justify-center gap-2 font-bold">
                <Sparkles className="w-5 h-5" />
                Terima kasih atas masukannya!
              </div>
            )}

            <button
              disabled={!surveyAnswered || isSaving}
              onClick={onNextVideo}
              className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                surveyAnswered && !isSaving
                  ? 'bg-[#8EACCD] text-white hover:bg-[#7899BD] shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSaving && <Loader2 className="w-5 h-5 animate-spin" />}
              {isSaving
                ? 'Menyimpan Sesi...'
                : currentVideoIndex < totalVideos - 1
                  ? 'Lanjutkan ke Video Berikutnya'
                  : 'Selesaikan Sesi'}
            </button>
          </div>
        </div>
      )}

      {/* Playback Progress */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-[#8EACCD] transition-all z-20"
        style={{ width: `${videoProgress}%` }}
      />
    </div>
  );
}
