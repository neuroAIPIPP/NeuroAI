'use client';

import Navbar from '@/components/Navbar';
import { TrackingData, useEyeTracking } from '@/hooks/useEyeTracking';
import { eegApi } from '@/lib/api/eegApi';
import { EyeTrackingDataPoint, eyeTrackingApi } from '@/lib/api/eyeTrackingApi';
import { faceApi } from '@/lib/api/faceApi';
import { authClient } from '@/lib/auth-client';
import {
  Brain,
  Eye,
  Loader2,
  Pause,
  Play,
  RotateCw,
  ScanFace,
  Sparkles,
  Square,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';

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

  // AI Module States
  const [eegRecording, setEegRecording] = useState(false);
  const [eegMode, setEegMode] = useState<string | null>(null);
  const [, setEegFile] = useState('');
  const [etSessionId, setEtSessionId] = useState('');
  const etSessionIdRef = useRef('');
  const etBufferRef = useRef<EyeTrackingDataPoint[]>([]);
  const etBufferTimerRef = useRef<NodeJS.Timeout | null>(null);
  const webcamVideoRef = useRef<HTMLVideoElement>(null);

  // Session Save States
  authClient.useSession();
  const [videoRatings, setVideoRatings] = useState<
    { videoTitle: string; rating: number; timestamp?: string }[]
  >([]);

  // Face Verification State
  const [faceVerified, setFaceVerified] = useState(false);
  const [faceVerifyResult, setFaceVerifyResult] = useState<{
    name: string;
    confidence: number;
  } | null>(null);
  const faceVerificationsRef = useRef<
    {
      timestamp: string;
      personName: string;
      confidence: number;
      isVerified: boolean;
    }[]
  >([]);

  // Eye tracking sessions: state for UI rendering, ref for reliable reads in async functions
  type EtSessionEntry = {
    videoTitle: string;
    mode: string;
    sessionId: string;
    filePath?: string;
    totalDataPoints?: number;
    startTime?: string;
    endTime?: string;
  };
  const [, setEyeTrackingSessionsList] = useState<EtSessionEntry[]>([]);
  const etSessionsRef = useRef<EtSessionEntry[]>([]);
  const eegFileRef = useRef('');

  // Helper: update both state and ref for ET sessions
  const updateEtSessions = useCallback(
    (updater: (prev: EtSessionEntry[]) => EtSessionEntry[]) => {
      setEyeTrackingSessionsList((prev) => {
        const next = updater(prev);
        etSessionsRef.current = next;
        return next;
      });
    },
    [],
  );

  const [isSaving, setIsSaving] = useState(false);
  const [sessionStartTime] = useState(() => new Date().toISOString());

  // Eye Tracking (client-side)
  const { isTracking, trackingData, error, startTracking, stopTracking } =
    useEyeTracking('combined');
  const trackingDataRef = useRef<TrackingData | null>(null);
  useEffect(() => {
    trackingDataRef.current = trackingData;
  }, [trackingData]);

  const videos = [
    {
      id: 1,
      title: 'Video 1',
      subtitle: 'Biologi Redominasi',
      src: '/Videos/Video Biologi Redominasi FIX.mp4',
    },
    // {
    //   id: 2,
    //   title: 'Video 2',
    //   subtitle: 'FAPERTA Dasar Genetika',
    //   src: '/Videos/Video FAPERTA Dasar Genetika FIX.mp4',
    // },
    // {
    //   id: 3,
    //   title: 'Video 3',
    //   subtitle: 'FIKOM Analisis',
    //   src: '/Videos/Video FIKOM Analisis FIX.mp4',
    // },
    // {
    //   id: 4,
    //   title: 'Video 4',
    //   subtitle: 'FIKOM Gravity',
    //   src: '/Videos/Video FIKOM Gravity FIX.mp4',
    // },
    // {
    //   id: 5,
    //   title: 'Video 5',
    //   subtitle: 'FIKOM Model Komunikasi',
    //   src: '/Videos/Video FIKOM Model Komunikasi FIX.mp4',
    // },
    // {
    //   id: 6,
    //   title: 'Video 6',
    //   subtitle: 'Indonesia Core',
    //   src: '/Videos/Video Indonesia Core FIX.mp4',
    // },
    // {
    //   id: 7,
    //   title: 'Video 7',
    //   subtitle: 'Kucing',
    //   src: '/Videos/Video Kucing FIX.mp4',
    // },
    // {
    //   id: 8,
    //   title: 'Video 8',
    //   subtitle: 'Kucing Gemoy',
    //   src: '/Videos/Video Kucing Gemoy FIX.mp4',
    // },
    // {
    //   id: 9,
    //   title: 'Video 9',
    //   subtitle: 'MUKBANG',
    //   src: '/Videos/Video MUKBANG FIX.mp4',
    // },
    // {
    //   id: 10,
    //   title: 'Video 10',
    //   subtitle: 'Meme 1',
    //   src: '/Videos/Video Meme 1 FIX.mp4',
    // },
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

  // ============================================================
  // AI Module Integration
  // ============================================================

  // Flush eye tracking buffer to backend
  const flushEtBuffer = useCallback(async () => {
    const currentId = etSessionIdRef.current;
    if (etBufferRef.current.length > 0 && currentId) {
      const batch = [...etBufferRef.current];
      etBufferRef.current = [];
      await eyeTrackingApi.sendBatch(currentId, batch);
    }
  }, []);

  // Verify face using webcam
  const verifyUserFace = useCallback(async () => {
    if (webcamVideoRef.current && webcamVideoRef.current.readyState === 4) {
      const base64 = faceApi.captureFrameAsBase64(webcamVideoRef.current);
      if (base64) {
        const result = await faceApi.verifyFace(base64);
        const timestamp = new Date().toISOString();
        if (result.is_verified && result.recognized_faces.length > 0) {
          const face = result.recognized_faces[0];
          setFaceVerified(true);
          setFaceVerifyResult({ name: face.name, confidence: face.confidence });
          faceVerificationsRef.current.push({
            timestamp,
            personName: face.name,
            confidence: face.confidence,
            isVerified: true,
          });
        } else {
          setFaceVerified(false);
          setFaceVerifyResult(null);
          faceVerificationsRef.current.push({
            timestamp,
            personName: 'Unknown',
            confidence: 0,
            isVerified: false,
          });
        }
      }
    }
  }, []);

  // Start all AI modules
  const startAIModules = async () => {
    // 1. Start EEG recording
    const eegResult = await eegApi.startSession();
    if (
      eegResult.status === 'started' ||
      eegResult.status === 'already_running'
    ) {
      setEegRecording(true);
      setEegFile(eegResult.file);
      eegFileRef.current = eegResult.file;
    }

    // 2. Start Eye Tracking backend session
    const currentVid = videos[currentVideoIndex];
    const etResult = await eyeTrackingApi.startSession(
      currentVid.subtitle || currentVid.title,
    );
    if (etResult.status === 'started') {
      setEtSessionId(etResult.session_id);
      etSessionIdRef.current = etResult.session_id;

      // Tambahkan ke tracking list (state + ref)
      updateEtSessions((prev) => {
        if (prev.some((s) => s.sessionId === etResult.session_id)) return prev;
        return [
          ...prev,
          {
            videoTitle: currentVid.subtitle || currentVid.title,
            mode: 'combined',
            sessionId: etResult.session_id,
            startTime: new Date().toISOString(),
          },
        ];
      });
    }

    // 3. Start client-side eye tracking
    startTracking(webcamVideoRef.current);

    // 4. Initial Face Verification & Start Interval for EEG & Face
    // Wait a bit for webcam to initialize
    setTimeout(() => verifyUserFace(), 2000);

    etBufferTimerRef.current = setInterval(async () => {
      flushEtBuffer();
      verifyUserFace();

      // Update EEG Mode Status
      const eegStatus = await eegApi.getStatus();
      setEegMode(eegStatus.recording_mode);
    }, 5000); // Check every 5 seconds for ET flush, Face Verify, and EEG mode
  };

  // Stop all AI modules
  const stopAIModules = async () => {
    // Flush remaining eye tracking data
    await flushEtBuffer();

    // Stop buffer timer
    if (etBufferTimerRef.current) {
      clearInterval(etBufferTimerRef.current);
      etBufferTimerRef.current = null;
    }

    let finalEegFile = eegFileRef.current;
    // Stop EEG
    if (eegRecording) {
      const eegResult = await eegApi.stopSession();
      setEegRecording(false);
      setEegMode(null);
      if (eegResult.file) {
        finalEegFile = eegResult.file;
        setEegFile(eegResult.file);
        eegFileRef.current = eegResult.file;
      }
    }

    // Stop Eye Tracking backend session
    if (etSessionId) {
      const stoppingSessionId = etSessionId; // capture before clearing
      const etResult = await eyeTrackingApi.stopSession(stoppingSessionId);

      // Update both state AND ref synchronously
      updateEtSessions((prev) =>
        prev.map((s) => {
          if (s.sessionId === stoppingSessionId) {
            return {
              ...s,
              filePath: etResult.file_path,
              totalDataPoints: etResult.total_data_points,
              endTime: new Date().toISOString(),
            };
          }
          return s;
        }),
      );
      setEtSessionId('');
    }

    // Stop client-side tracking
    stopTracking();

    // Return data from refs (always up-to-date)
    return {
      eegFile: finalEegFile,
      eyeTrackingSessions: etSessionsRef.current,
      faceVerifications: faceVerificationsRef.current,
    };
  };

  // Sync AI Tracking with Session State
  useEffect(() => {
    if (isActive && !showSurvey && !isFinished) {
      startAIModules();
    } else {
      stopAIModules();
    }
    return () => {
      if (etBufferTimerRef.current) {
        clearInterval(etBufferTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, showSurvey, isFinished]);

  // Record eye tracking data to buffer on interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !showSurvey && !isFinished && isTracking) {
      interval = setInterval(() => {
        const currentData = trackingDataRef.current;
        if (currentData) {
          const videoTime = videoRef.current ? videoRef.current.currentTime : 0;
          const dataPoint: EyeTrackingDataPoint = {
            timestamp: Date.now(),
            video_time: videoTime,
            left_pupil_x: currentData.leftPupilX ?? null,
            left_pupil_y: currentData.leftPupilY ?? null,
            right_pupil_x: currentData.rightPupilX ?? null,
            right_pupil_y: currentData.rightPupilY ?? null,
            is_focused: currentData.isFocused,
            gaze_direction: currentData.gazeDirection,
            screen_x: currentData.screenX ?? null,
            screen_y: currentData.screenY ?? null,
            screen_region: currentData.screenRegion ?? null,
          };
          etBufferRef.current.push(dataPoint);
          console.log('[Eye Tracking] Data buffered:', dataPoint);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, showSurvey, isFinished, isTracking]);

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

  const handleVideoEnded = async () => {
    // Set EEG marker for video end
    await eegApi.setMarker(`Video_${currentVideoIndex + 1}_End`);

    // delay before showing survey
    setTimeout(() => {
      setShowSurvey(true);
      eegApi.setMarker('Survey_Start');
    }, 2000);
  };

  const handleSurveySubmit = async (answer: string) => {
    console.log(`User answered: ${answer}`);
    await eegApi.setMarker(`Survey_Answer_${answer}`);
    setSurveyAnswered(true);

    // Simpan rating ke state videoRatings
    const currentVid = videos[currentVideoIndex];
    setVideoRatings((prev) => [
      ...prev.filter(
        (r) => r.videoTitle !== (currentVid.subtitle || currentVid.title),
      ),
      {
        videoTitle: currentVid.subtitle || currentVid.title,
        rating: parseInt(answer, 10),
      },
    ]);
  };

  const saveSessionData = async (isCompleted: boolean) => {
    setIsSaving(true);
    try {
      // 1. Hentikan modul AI dan ambil data langsung dari return value
      const stopResult = await stopAIModules();

      // 2. Gunakan ref (selalu up-to-date) bukan state (bisa stale karena React batching)
      const finalEegFile = stopResult.eegFile || eegFileRef.current;
      const finalEtSessions = stopResult.eyeTrackingSessions;

      console.log('[Session Save] ET sessions from ref:', finalEtSessions);
      console.log('[Session Save] EEG file:', finalEegFile);

      const payload = {
        startTime: sessionStartTime,
        endTime: new Date().toISOString(),
        status: isCompleted ? 'completed' : 'cancelled',
        eegRecording: finalEegFile
          ? {
              filePath: finalEegFile,
              startTime: sessionStartTime,
              endTime: new Date().toISOString(),
            }
          : null,
        eyeTrackingSessions: finalEtSessions.map((s) => ({
          videoTitle: s.videoTitle,
          mode: s.mode,
          filePath: s.filePath,
          totalDataPoints: s.totalDataPoints || 0,
          startTime: s.startTime,
          endTime: s.endTime || new Date().toISOString(),
        })),
        videoRatings: videoRatings,
        faceVerifications: stopResult.faceVerifications || [],
      };

      console.log('[Session Save] Sending payload:', payload);

      const response = await fetch('/api/session/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Gagal menyimpan sesi');
      }

      console.log('[Session Save] Success:', resData);

      // Trigger AI concentration analysis in background (non-blocking)
      if (resData.sessionId) {
        fetch('/api/session/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: resData.sessionId }),
        })
          .then((res) => res.json())
          .then((analysisResult) => {
            console.log(
              '[Session Save] AI Analysis completed:',
              analysisResult,
            );
          })
          .catch((err) => {
            console.warn(
              '[Session Save] AI Analysis failed (non-critical):',
              err,
            );
          });
      }

      setIsFinished(true);
    } catch (e: unknown) {
      console.error('[Session Save] Error saving session to database:', e);
      alert(
        `Gagal menyimpan data ke database: ${e instanceof Error ? e.message : String(e)}`,
      );
      setIsFinished(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNextVideo = async () => {
    if (currentVideoIndex < videos.length - 1) {
      await eegApi.setMarker(`Video_${currentVideoIndex + 2}_Start`);
      setCurrentVideoIndex(currentVideoIndex + 1);
      setShowSurvey(false);
      setSurveyAnswered(false);
      setVideoProgress(0);
    } else {
      await eegApi.setMarker('Session_End');
      await saveSessionData(true);
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
            <h1 className="text-[2.75rem] font-bold text-[#2A3441] tracking-tight mb-2">
              Session
            </h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                localStorage.removeItem('isCalibrated');
                router.push('/session/calibration');
              }}
              className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
              title="Ulangi Kalibrasi Eye Tracking"
            >
              <RotateCw className="w-4 h-4 text-gray-500" />
              Recalibrate
            </button>
            <button
              onClick={() => setIsActive(!isActive)}
              className="px-6 py-2.5 rounded-full bg-[#E2E8D5] text-[#4D5E3A] text-sm font-bold flex items-center gap-2 hover:bg-[#D5DCC6] transition-colors"
            >
              {isActive ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isActive
                ? 'Pause Session'
                : elapsedTime === 0
                  ? 'Start Session'
                  : 'Resume Session'}
            </button>
            <button
              disabled={
                currentVideoIndex < videos.length - 1 ||
                !surveyAnswered ||
                isSaving
              }
              onClick={() => saveSessionData(true)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${
                currentVideoIndex < videos.length - 1 ||
                !surveyAnswered ||
                isSaving
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-70'
                  : 'bg-[#3B526A] text-white hover:bg-[#2C3F53] shadow-md'
              }`}
              title={
                currentVideoIndex < videos.length - 1 || !surveyAnswered
                  ? 'Harus menyelesaikan semua video dan survey untuk mengakhiri sesi'
                  : 'Akhiri sesi dan simpan data'
              }
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Square className="w-3.5 h-3.5 fill-current" />
              )}
              {isSaving ? 'Saving...' : 'End Session'}
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
                      disabled={!surveyAnswered || isSaving}
                      onClick={handleNextVideo}
                      className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                        surveyAnswered && !isSaving
                          ? 'bg-[#8EACCD] text-white hover:bg-[#7899BD] shadow-lg'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isSaving && <Loader2 className="w-5 h-5 animate-spin" />}
                      {isSaving
                        ? 'Menyimpan Sesi...'
                        : currentVideoIndex < videos.length - 1
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
            {/* Webcam Feed */}
            <div className="relative aspect-video bg-[#2A3441] rounded-3xl overflow-hidden shadow-lg border border-gray-200">
              <video
                ref={webcamVideoRef}
                className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
                muted
                playsInline
                autoPlay
              />
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-2 py-1 rounded bg-black/40 backdrop-blur-md text-white text-[10px] font-bold z-10">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}
                />
                Tracking Active
              </div>

              {/* Mock Gaze Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-32 h-32 border border-[#8EACCD]/30 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-[#8EACCD] rounded-full shadow-[0_0_10px_#8EACCD]" />
                </div>
              </div>

              <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/10 z-10 pointer-events-none">
                <p className="text-[8px] font-bold text-white/60 uppercase tracking-widest mb-1">
                  Eye Gaze Vector
                </p>
                <div className="flex gap-4">
                  <span className="text-[10px] font-mono text-[#8EACCD]">
                    X:{' '}
                    {trackingData?.screenX
                      ? (trackingData.screenX / window.innerWidth).toFixed(3)
                      : '0.000'}
                  </span>
                  <span className="text-[10px] font-mono text-[#8EACCD]">
                    Y:{' '}
                    {trackingData?.screenY
                      ? (trackingData.screenY / window.innerHeight).toFixed(3)
                      : '0.000'}
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

            {/* AI Modules Status Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-[#2A3441] mb-3 uppercase tracking-wider">
                AI Modules
              </h3>
              <div className="space-y-3">
                {/* EEG Status */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${eegRecording ? 'bg-green-100' : 'bg-gray-100'}`}
                  >
                    <Brain
                      className={`w-4 h-4 ${eegRecording ? 'text-green-600' : 'text-gray-400'}`}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2A3441]">
                      EEG Recording
                    </p>
                    <p
                      className={`text-[10px] ${eegRecording ? (eegMode === 'Real' ? 'text-green-600' : 'text-amber-500') : 'text-gray-400'}`}
                    >
                      {eegRecording
                        ? `● Recording (${eegMode || 'Checking...'})`
                        : '○ Inactive'}
                    </p>
                  </div>
                </div>

                {/* Eye Tracking Status */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${isTracking ? 'bg-blue-100' : error ? 'bg-red-100' : 'bg-gray-100'}`}
                  >
                    <Eye
                      className={`w-4 h-4 ${isTracking ? 'text-blue-600' : error ? 'text-red-500' : 'text-gray-400'}`}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2A3441]">
                      Eye Tracking
                    </p>
                    <p
                      className={`text-[10px] ${isTracking ? 'text-blue-600' : error ? 'text-red-500 font-medium' : 'text-gray-400'}`}
                    >
                      {isTracking
                        ? `● Tracking (${trackingData?.gazeDirection || 'center'})`
                        : error
                          ? `⚠️ Error: ${error}`
                          : '○ Inactive'}
                    </p>
                  </div>
                </div>

                {/* Face Recognition Status */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${faceVerified ? 'bg-emerald-100' : faceVerifyResult === null && eegRecording ? 'bg-gray-100' : 'bg-rose-100'}`}
                  >
                    <ScanFace
                      className={`w-4 h-4 ${faceVerified ? 'text-emerald-600' : faceVerifyResult === null && eegRecording ? 'text-gray-400' : 'text-rose-500'}`}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2A3441]">
                      Face Recognition
                    </p>
                    <p
                      className={`text-[10px] ${faceVerified ? 'text-emerald-600 font-medium' : faceVerifyResult === null && eegRecording ? 'text-gray-400' : eegRecording ? 'text-rose-500 font-medium' : 'text-gray-400'}`}
                    >
                      {!eegRecording
                        ? '○ Standby'
                        : faceVerified
                          ? `● Verified (${faceVerifyResult?.name})`
                          : '⚠️ Not Recognized'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights Card */}
            <div className="bg-[#FFF9E5] border border-yellow-200/50 rounded-2xl p-5 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-yellow-800 leading-snug">
                  {isTracking ? (
                    trackingData?.isFocused ? (
                      <>
                        Good concentration detected. Your patterns suggest
                        you&apos;re in a{' '}
                        <span className="font-bold">Flow State</span>.
                      </>
                    ) : (
                      <>
                        Distraction detected. Try to refocus on the video
                        content.
                      </>
                    )
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
