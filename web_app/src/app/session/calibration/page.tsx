'use client';

import Navbar from '@/components/Navbar';
import { AlertTriangle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CalibrationPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<
    'checking' | 'ready' | 'error' | 'calibrating'
  >('checking');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (status !== 'calibrating') return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          localStorage.setItem('isCalibrated', 'true');
          setTimeout(() => {
            router.push('/session');
          }, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [router, status]);

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#F8F9FA]">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-blue-100/30 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-yellow-100/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

      <Navbar />

      <div className="pt-32 flex flex-col items-center justify-center min-h-screen px-6 relative z-10">
        <div className="mb-12 flex flex-col items-center text-center max-w-md">
          {status === 'checking' && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold mb-4">
              <Loader2 className="w-3 h-3 animate-spin" />
              Verifying Hardware...
            </div>
          )}

          {status === 'error' && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-[11px] font-bold mb-4">
              <AlertTriangle className="w-3 h-3" />
              Hardware Error
            </div>
          )}

          {(status === 'ready' || status === 'calibrating') && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-[11px] font-bold mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              {status === 'calibrating' ? 'Calibrating...' : 'Hardware Ready'}
            </div>
          )}

          <h1 className="text-4xl font-bold text-[#2A3441] mb-4">
            {status === 'error' ? 'Calibration Blocked' : 'Visual Synchrony'}
          </h1>

          {status === 'calibrating' && (
            <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden mb-8">
              <div
                className="h-full bg-[#8EACCD] transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Dynamic Content Based on Status */}
        {status === 'error' ? (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center mb-8">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <p className="text-[#64748B] text-center mb-8 font-medium">
              {errorMsg}
            </p>
            <button
              onClick={() => setStatus('checking')}
              className="px-8 py-3 bg-[#3B526A] text-white rounded-full font-bold flex items-center gap-2 hover:bg-[#2C3F53] transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        ) : status === 'ready' ? (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mb-8">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <p className="text-[#64748B] text-center mb-8 font-medium">
              All systems operational. Click below to start visual calibration.
            </p>
            <button
              onClick={() => setStatus('calibrating')}
              className="px-8 py-3 bg-[#8EACCD] text-white rounded-full font-bold hover:bg-[#7A9BBF] transition-all shadow-lg"
            >
              Start Calibration
            </button>
          </div>
        ) : (
          (status === 'calibrating' || status === 'checking') && (
            <div
              className={`relative flex items-center justify-center w-80 h-80 transition-opacity duration-500 ${status === 'checking' ? 'opacity-30 grayscale' : 'opacity-100'}`}
            >
              {/* Outer Ring */}
              <div className="absolute inset-0 border-2 border-[#8EACCD]/30 rounded-full animate-[pulse_3s_infinite]" />

              {/* Inner Circle */}
              <div className="w-64 h-64 border-2 border-[#8EACCD] rounded-full flex items-center justify-center bg-white/50 backdrop-blur-sm shadow-xl">
                {/* Center Point */}
                <div className="w-4 h-4 bg-[#2A3441] rounded-full shadow-[0_0_15px_rgba(42,52,65,0.4)]" />
              </div>

              {status === 'calibrating' && (
                <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-[#8EACCD] to-transparent top-1/2 -translate-y-1/2 animate-[scan_4s_linear_infinite]" />
              )}
            </div>
          )
        )}

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
