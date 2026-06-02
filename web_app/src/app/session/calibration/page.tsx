'use client';

import Navbar from '@/components/Navbar';
import CalibrationStatusBadge from '@/components/session/CalibrationStatusBadge';
import { CalibrationStatus } from '@/components/session/CalibrationStatusBadge';
import CalibrationVisual from '@/components/session/CalibrationVisual';
import CalibrationWarningModal from '@/components/session/CalibrationWarningModal';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function CalibrationPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
  const meetingId = searchParams.get('meetingId');

  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<CalibrationStatus>('checking');
  const [errorMsg, setErrorMsg] = useState('');
  const [showWarning, setShowWarning] = useState(true);

  useEffect(() => {
    localStorage.removeItem('isCalibrated');
  }, []);

  useEffect(() => {
    if (showWarning) return;
    // Simulate Hardware Check
    const checkHardware = setTimeout(() => {
      // For demonstration, let's say there's a 10% chance of a "Lens Covered" error
      const isLensCovered = Math.random() < 0.1;

      if (isLensCovered) {
        setStatus('error');
        setErrorMsg(
          'Camera Lens Obstructed. Please ensure the lens is clean and uncovered.',
        );
      } else {
        setStatus('ready');
      }
    }, 2000);

    return () => clearTimeout(checkHardware);
  }, [showWarning]);

  useEffect(() => {
    if (status !== 'calibrating') return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          localStorage.setItem('isCalibrated', 'true');
          setTimeout(() => {
            let url = '/session/play';
            if (courseId && meetingId) {
              url += `?courseId=${courseId}&meetingId=${meetingId}`;
            }
            router.push(url);
          }, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [router, status, courseId, meetingId]);

  return (
    <main className="min-h-screen relative overflow-hidden bg-transparent">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-blue-100/30 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-yellow-100/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

      <Navbar />

      {/* Warning Modal */}
      {showWarning && (
        <CalibrationWarningModal onConfirm={() => setShowWarning(false)} />
      )}

      <div className="pt-32 flex flex-col items-center justify-center min-h-screen px-6 relative z-10">
        <CalibrationStatusBadge status={status} progress={progress} />

        <CalibrationVisual
          status={status}
          errorMsg={errorMsg}
          onRetry={() => setStatus('checking')}
          onStartCalibration={() => setStatus('calibrating')}
        />

        {status !== 'error' && (
          <p className="mt-16 text-[#64748B] text-sm font-medium text-center max-w-sm leading-relaxed">
            {status === 'checking'
              ? 'Please wait while we verify your camera connection...'
              : 'Please maintain a steady gaze at the center point to calibrate the synaptic vision engine.'}
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(-160px);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(160px);
            opacity: 0;
          }
        }
      `}</style>
    </main>
  );
}

export default function CalibrationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500 font-medium">Loading calibration...</p>
        </div>
      }
    >
      <CalibrationPageContent />
    </Suspense>
  );
}
