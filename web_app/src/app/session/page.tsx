'use client';

import Navbar from '@/components/Navbar';
import FocusStatusChart from '@/components/session/FocusStatusChart';
import SessionStatCard from '@/components/session/SessionStatCard';
import { Pause, Play, Sparkles, Square } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function SessionPage() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const isCalibrated = localStorage.getItem('isCalibrated') === 'true';
    if (!isCalibrated) {
      router.push('/session/calibration');
    }
  }, [router]);

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#F8F9FA]">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-blue-100/30 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-yellow-100/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

      <Navbar />

      <div className="pt-28 pb-12 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen flex flex-col relative z-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#2A3441] tracking-tight mb-2">
              Session
            </h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsActive(!isActive)}
              className="px-6 py-2.5 rounded-full bg-[#E2E8D5] text-[#4D5E3A] text-sm font-bold flex items-center gap-2 hover:bg-[#D5DCC6] transition-colors"
            >
              {isActive ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isActive ? 'Pause Session' : 'Resume Session'}
            </button>
            <button className="px-6 py-2.5 rounded-full bg-[#3B526A] text-white text-sm font-bold flex items-center gap-2 hover:bg-[#2C3F53] transition-colors">
              <Square className="w-3.5 h-3.5 fill-current" />
              End Session
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Video Section */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="relative aspect-video bg-gray-200 rounded-3xl overflow-hidden shadow-2xl group">
              {/* Mock Video Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                <div className="flex items-center gap-3 text-white mb-2">
                  <div className="px-2 py-0.5 rounded bg-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                    Live
                  </div>
                  <h2 className="text-xl font-bold">
                    Advanced Neural Architectures - Module 4
                  </h2>
                </div>
                <div className="flex justify-between items-center text-white/80 text-sm">
                  <span>How to improve your handwriting skills</span>
                  <span className="font-mono">14:22 / 45:00</span>
                </div>
              </div>

              {/* Playback Progress */}
              <div
                className="absolute bottom-0 left-0 h-1 bg-[#8EACCD] transition-all"
                style={{ width: '32%' }}
              />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <div>
                  <p className="text-sm font-bold text-[#2A3441]">
                    Session Active
                  </p>
                  <p className="text-[12px] text-gray-500 font-medium">
                    Tracking biometric responses
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-mono font-bold text-[#2A3441]">
                  14:22
                </p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Elapsed Time
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar / Metrics Section */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Webcam Feed Placeholder */}
            <div className="relative aspect-video bg-[#2A3441] rounded-3xl overflow-hidden shadow-lg">
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-2 py-1 rounded bg-black/40 backdrop-blur-md text-white text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Tracking Active
              </div>

              {/* Mock Gaze Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border border-[#8EACCD]/30 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-[#8EACCD] rounded-full shadow-[0_0_10px_#8EACCD]" />
                </div>
              </div>

              <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/10">
                <p className="text-[8px] font-bold text-white/60 uppercase tracking-widest mb-1">
                  Eye Gaze Vector
                </p>
                <div className="flex gap-4">
                  <span className="text-[10px] font-mono text-[#8EACCD]">
                    X: 0.242
                  </span>
                  <span className="text-[10px] font-mono text-[#8EACCD]">
                    Y: -0.118
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <SessionStatCard label="Attention" value="High" status="high" />
              <SessionStatCard
                label="Cognitive Load"
                value="Optimal"
                status="optimal"
              />
              <SessionStatCard label="Blink Rate" value="12 bpm" />
              <SessionStatCard label="Alertness" value="94%" status="optimal" />
            </div>

            {/* Focus Chart Card */}
            <div className="bg-[#E9EDF2] rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-[#2A3441]">
                  Focus Status
                </span>
                <span className="text-lg font-bold text-[#2A3441]">
                  82%{' '}
                  <span className="text-xs font-medium text-gray-500">
                    Focused
                  </span>
                </span>
              </div>
              <div className="h-24">
                <FocusStatusChart />
              </div>
            </div>

            {/* AI Insights Card */}
            <div className="bg-[#FFF9E5] border border-yellow-200/50 rounded-2xl p-5 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-yellow-800 leading-snug">
                  Good concentration detected. Your patterns suggest you&apos;re
                  in a <span className="font-bold">Flow State</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
