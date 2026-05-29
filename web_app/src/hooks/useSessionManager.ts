'use client';

import { useEyeTracking } from '@/hooks/useEyeTracking';
import { eegApi } from '@/lib/api/eegApi';
import { EyeTrackingDataPoint, eyeTrackingApi } from '@/lib/api/eyeTrackingApi';
import { faceApi } from '@/lib/api/faceApi';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

// ============================================================
// Types
// ============================================================

type EtSessionEntry = {
  videoTitle: string;
  mode: string;
  sessionId: string;
  filePath?: string;
  totalDataPoints?: number;
  startTime?: string;
  endTime?: string;
};

export interface VideoItem {
  id: number;
  title: string;
  subtitle: string;
  src: string;
}

// ============================================================
// Video List (configurable)
// ============================================================

export const SESSION_VIDEOS: VideoItem[] = [
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

// ============================================================
// Hook
// ============================================================

export function useSessionManager() {
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

  // Eye tracking sessions
  const [, setEyeTrackingSessionsList] = useState<EtSessionEntry[]>([]);
  const etSessionsRef = useRef<EtSessionEntry[]>([]);
  const eegFileRef = useRef('');

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

  const videos = SESSION_VIDEOS;
  const currentVideo = videos[currentVideoIndex];
  const videoRef = useRef<HTMLVideoElement>(null);

  // ============================================================
  // Play/Pause effect
  // ============================================================
  useEffect(() => {
    if (videoRef.current) {
      if (isActive && !showSurvey && !isFinished) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((e) => {
            console.error('Play error:', e);
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

  const flushEtBuffer = useCallback(async () => {
    if (etBufferRef.current.length > 0 && etSessionId) {
      const batch = [...etBufferRef.current];
      etBufferRef.current = [];
      await eyeTrackingApi.sendBatch(etSessionId, batch);
    }
  }, [etSessionId]);

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

  const startAIModules = async () => {
    const eegResult = await eegApi.startSession();
    if (
      eegResult.status === 'started' ||
      eegResult.status === 'already_running'
    ) {
      setEegRecording(true);
      setEegFile(eegResult.file);
      eegFileRef.current = eegResult.file;
    }

    const currentVid = videos[currentVideoIndex];
    const etResult = await eyeTrackingApi.startSession(
      currentVid.subtitle || currentVid.title,
    );
    if (etResult.status === 'started') {
      setEtSessionId(etResult.session_id);
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

    startTracking(webcamVideoRef.current);
    setTimeout(() => verifyUserFace(), 2000);

    etBufferTimerRef.current = setInterval(async () => {
      flushEtBuffer();
      verifyUserFace();
      const eegStatus = await eegApi.getStatus();
      setEegMode(eegStatus.recording_mode);
    }, 5000);
  };

  const stopAIModules = async () => {
    await flushEtBuffer();

    if (etBufferTimerRef.current) {
      clearInterval(etBufferTimerRef.current);
      etBufferTimerRef.current = null;
    }

    let finalEegFile = eegFileRef.current;
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

    if (etSessionId) {
      const stoppingSessionId = etSessionId;
      const etResult = await eyeTrackingApi.stopSession(stoppingSessionId);
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

    stopTracking();

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

  // Record eye tracking data to buffer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !showSurvey && !isFinished && isTracking) {
      interval = setInterval(() => {
        if (trackingData) {
          const videoTime = videoRef.current ? videoRef.current.currentTime : 0;
          const dataPoint: EyeTrackingDataPoint = {
            timestamp: Date.now(),
            video_time: videoTime,
            left_pupil_x: trackingData.leftPupilX ?? null,
            left_pupil_y: trackingData.leftPupilY ?? null,
            right_pupil_x: trackingData.rightPupilX ?? null,
            right_pupil_y: trackingData.rightPupilY ?? null,
            is_focused: trackingData.isFocused,
            gaze_direction: trackingData.gazeDirection,
            screen_x: trackingData.screenX ?? null,
            screen_y: trackingData.screenY ?? null,
            screen_region: trackingData.screenRegion ?? null,
          };
          etBufferRef.current.push(dataPoint);
          console.log('[Eye Tracking] Data buffered:', dataPoint);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, showSurvey, isFinished, isTracking, trackingData]);

  // Calibration check
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

  // ============================================================
  // Helpers & Handlers
  // ============================================================

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVideoEnded = async () => {
    await eegApi.setMarker(`Video_${currentVideoIndex + 1}_End`);
    setTimeout(() => {
      setShowSurvey(true);
      eegApi.setMarker('Survey_Start');
    }, 2000);
  };

  const handleSurveySubmit = async (answer: string) => {
    console.log(`User answered: ${answer}`);
    await eegApi.setMarker(`Survey_Answer_${answer}`);
    setSurveyAnswered(true);

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
      const stopResult = await stopAIModules();
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

  const handleRecalibrate = () => {
    localStorage.removeItem('isCalibrated');
    router.push('/session/calibration');
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  // ============================================================
  // Return public API
  // ============================================================
  return {
    // Session state
    isActive,
    setIsActive,
    isFinished,
    isSaving,
    elapsedTime,
    formatTime,

    // Video state
    videos,
    currentVideo,
    currentVideoIndex,
    videoRef,
    videoProgress,
    setVideoProgress,
    showSurvey,
    surveyAnswered,

    // AI module state
    eegRecording,
    eegMode,
    isTracking,
    trackingData,
    error,
    faceVerified,
    faceVerifyResult,
    webcamVideoRef,

    // Handlers
    handleVideoEnded,
    handleSurveySubmit,
    handleNextVideo,
    handleRecalibrate,
    handleGoToDashboard,
    saveSessionData,
  };
}
