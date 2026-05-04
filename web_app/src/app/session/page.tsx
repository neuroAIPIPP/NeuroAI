'use client';

import Navbar from '@/components/Navbar';
import { Pause, Play, Sparkles, Square } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

export default function SessionPage() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);

  // Video and Survey State
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyAnswered, setSurveyAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  // 10 real videos from public/Videos
  const videos = [
    {
      id: 1,
      title: 'Video 1',
      subtitle: 'Biologi Redominasi',
      src: '/Videos/Video Biologi Redominasi FIX.mp4',
    },
    {
      id: 2,
      title: 'Video 2',
      subtitle: 'FAPERTA Dasar Genetika',
      src: '/Videos/Video FAPERTA Dasar Genetika FIX.mp4',
    },
    {
      id: 3,
      title: 'Video 3',
      subtitle: 'FIKOM Analisis',
      src: '/Videos/Video FIKOM Analisis FIX.mp4',
    },
    {
      id: 4,
      title: 'Video 4',
      subtitle: 'FIKOM Gravity',
      src: '/Videos/Video FIKOM Gravity FIX.mp4',
    },
    {
      id: 5,
      title: 'Video 5',
      subtitle: 'FIKOM Model Komunikasi',
      src: '/Videos/Video FIKOM Model Komunikasi FIX.mp4',
    },
    {
      id: 6,
      title: 'Video 6',
      subtitle: 'Indonesia Core',
      src: '/Videos/Video Indonesia Core FIX.mp4',
    },
    {
      id: 7,
      title: 'Video 7',
      subtitle: 'Kucing',
      src: '/Videos/Video Kucing FIX.mp4',
    },
    {
      id: 8,
      title: 'Video 8',
      subtitle: 'Kucing Gemoy',
      src: '/Videos/Video Kucing Gemoy FIX.mp4',
    },
    {
      id: 9,
      title: 'Video 9',
      subtitle: 'MUKBANG',
      src: '/Videos/Video MUKBANG FIX.mp4',
    },
    {
      id: 10,
      title: 'Video 10',
      subtitle: 'Meme 1',
      src: '/Videos/Video Meme 1 FIX.mp4',
    },
  ];

  const currentVideo = videos[currentVideoIndex];
  const videoRef = useRef<HTMLVideoElement>(null);

  // Play/Pause effect based on isActive state
  useEffect(() => {
    if (videoRef.current) {
      if (isActive && !showSurvey && !isFinished) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((e) => {
            console.error('Play error:', e);
            // If browser blocks autoplay (e.g. direct page refresh), fallback to paused state
            if (e.name === 'NotAllowedError') {
              setIsActive(false);
            }
          });
        }
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, showSurvey, isFinished, currentVideoIndex]);

  useEffect(() => {
    const isCalibrated = localStorage.getItem('isCalibrated') === 'true';
    if (!isCalibrated) {
      router.push('/session/calibration');
    }
  }, [router]);

  // Elapsed time tracker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !showSurvey && !isFinished) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, showSurvey, isFinished]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVideoEnded = () => {
    // delay before showing survey
    setTimeout(() => {
      setShowSurvey(true);
    }, 2000);
  };

  const handleSurveySubmit = (answer: string) => {
    console.log(`User answered: ${answer}`);
    setSurveyAnswered(true);
  };

  const handleNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      setShowSurvey(false);
      setSurveyAnswered(false);
      setVideoProgress(0);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <main className="min-h-screen relative overflow-hidden bg-[#F8F9FA] flex items-center justify-center">
        <Navbar />
        <div className="text-center z-10 bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 max-w-lg mx-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-[#2A3441] mb-4">
            Terima Kasih!
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Anda telah menyelesaikan semua materi sesi hari ini. Data fokus Anda
            telah berhasil direkam untuk analisis lebih lanjut.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-8 py-3 bg-[#3B526A] text-white font-bold rounded-full hover:bg-[#2C3F53] transition-all shadow-lg"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </main>
    );
  }

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
            <button
              disabled={true}
              className="px-6 py-2.5 rounded-full bg-gray-300 text-gray-500 cursor-not-allowed text-sm font-bold flex items-center gap-2 transition-colors opacity-70"
              title="Harus menyelesaikan semua 10 video untuk mengakhiri sesi"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              End Session
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Video Section */}
          <div className="lg:col-span-8 flex flex-col gap-6">
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
                    onEnded={handleVideoEnded}
                    onTimeUpdate={(e) => {
                      const video = e.target as HTMLVideoElement;
                      setVideoProgress(
                        (video.currentTime / video.duration) * 100,
                      );
                    }}
                    controls={false}
                  />
                  {/* Overlay Info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 pointer-events-none">
                    <div className="flex items-center gap-3 text-white mb-2">
                      <div className="px-2 py-0.5 rounded bg-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                        Live
                      </div>
                      <h2 className="text-xl font-bold">
                        {currentVideo.title}
                      </h2>
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
                      Seberapa menarik materi yang disampaikan bagi Anda? (1 =
                      Sangat Membosankan, 5 = Sangat Menarik)
                    </p>

                    {!surveyAnswered ? (
                      <div className="flex gap-3 mb-6 justify-center">
                        {[1, 2, 3, 4, 5].map((score) => (
                          <button
                            key={score}
                            onClick={() => handleSurveySubmit(score.toString())}
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
                      disabled={!surveyAnswered}
                      onClick={handleNextVideo}
                      className={`w-full py-4 rounded-2xl font-bold transition-all ${
                        surveyAnswered
                          ? 'bg-[#8EACCD] text-white hover:bg-[#7899BD] shadow-lg'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {currentVideoIndex < videos.length - 1
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
          </div>

          {/* Sidebar / Metrics Section */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Webcam Feed Placeholder */}
            <div className="relative aspect-video bg-[#2A3441] rounded-3xl overflow-hidden shadow-lg">
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-2 py-1 rounded bg-black/40 backdrop-blur-md text-white text-[10px] font-bold">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}
                />
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

            {/* Session Status & Elapsed Time */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-3 h-3 rounded-full ${isActive && !showSurvey ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}
                />
                <div>
                  <p className="text-sm font-bold text-[#2A3441]">
                    {isActive && !showSurvey
                      ? 'Session Active'
                      : 'Session Paused'}
                  </p>
                  <p className="text-[12px] text-gray-500 font-medium">
                    Tracking biometric responses
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-mono font-bold text-[#2A3441]">
                  {formatTime(elapsedTime)}
                </p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Elapsed Time
                </p>
              </div>
            </div>

            {/* AI Insights Card */}
            <div className="bg-[#FFF9E5] border border-yellow-200/50 rounded-2xl p-5 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-yellow-800 leading-snug">
                  {isActive ? (
                    <>
                      Good concentration detected. Your patterns suggest
                      you&apos;re in a{' '}
                      <span className="font-bold">Flow State</span>.
                    </>
                  ) : (
                    'Session paused. Tracking will resume once you continue the video.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
