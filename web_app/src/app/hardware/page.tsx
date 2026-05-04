'use client';

import Navbar from '@/components/Navbar';
import DeviceCard from '@/components/hardware/DeviceCard';
import SystemStatusBar from '@/components/hardware/SystemStatusBar';
import { useCameraDetection } from '@/hooks/hardware/useCameraDetection';
import { useEEGHeadset } from '@/hooks/hardware/useEEGHeadset';
import {
  AlertCircle,
  BarChart2,
  Camera,
  Check,
  Clock,
  Cpu,
  Eye,
  RefreshCw,
  Unplug,
  Video,
  VideoOff,
} from 'lucide-react';
import { useState } from 'react';

export default function HardwarePage() {
  const {
    cameraStatus,
    isPreviewing,
    lensVisibility,
    setLensVisibility,
    videoRef,
    canvasRef,
    detectCamera,
    togglePreview,
  } = useCameraDetection();

  const { eegStatus, isRefreshingEEG, detectEEG, handleEegAction } =
    useEEGHeadset();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setLensVisibility('Not Checked');
    await Promise.all([detectCamera(), detectEEG()]);
    // Simulate a bit of processing for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsRefreshing(false);
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-blue-100/30 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-yellow-100/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

      <Navbar />

      <div className="pt-28 pb-12 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen flex flex-col relative z-10">
        <div className="mb-10">
          <h1 className="text-[2.75rem] font-bold text-[#2A3441] tracking-tight mb-2">
            Hardware Setup
          </h1>
          <p className="text-[15px] font-medium text-[#64748B]">
            Ensure your devices are ready before starting a session
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <DeviceCard
              deviceNumber="DEVICE 01"
              deviceName="EEG Headset"
              metrics={[
                {
                  label: 'Status',
                  value: eegStatus.status,
                  icon: eegStatus.status === 'Connected' ? Check : AlertCircle,
                },
                { label: 'Device Name', value: eegStatus.name, icon: Cpu },
                {
                  label: 'Signal Quality',
                  value: eegStatus.signal,
                  icon: BarChart2,
                },
                { label: 'Latency', value: eegStatus.latency, icon: Clock },
              ]}
            >
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleEegAction}
                  disabled={isRefreshingEEG}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-bold rounded-xl transition-all ${
                    eegStatus.status === 'Connected'
                      ? 'bg-[#F0FDF4] text-[#16A34A] hover:bg-[#DCFCE7] border border-[#BBF7D0]'
                      : 'bg-[#EFF6FF] text-[#3B82F6] hover:bg-[#DBEAFE] border border-[#DBEAFE]'
                  }`}
                >
                  {eegStatus.status === 'Connected' ? (
                    <>
                      <RefreshCw
                        className={`w-4 h-4 ${isRefreshingEEG ? 'animate-spin' : ''}`}
                      />
                      {isRefreshingEEG ? 'Refreshing...' : 'Refresh Connection'}
                    </>
                  ) : (
                    <>
                      <Unplug className="w-4 h-4" />
                      Pair USB Headset
                    </>
                  )}
                </button>
              </div>
            </DeviceCard>

            <DeviceCard
              deviceNumber="DEVICE 02"
              deviceName="Learning Camera"
              metrics={[
                {
                  label: 'Status',
                  value: cameraStatus.status,
                  icon: cameraStatus.icon,
                },
                {
                  label: 'Device Name',
                  value: cameraStatus.name,
                  icon: Camera,
                },
                {
                  label: 'Lens Visibility',
                  value: lensVisibility,
                  icon: Eye,
                },
              ]}
            >
              <div className="flex flex-col gap-4">
                {isPreviewing && (
                  <div className="relative rounded-xl overflow-hidden bg-black aspect-video shadow-inner">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-md animate-pulse flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      LIVE
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#F1F5F9] hover:bg-[#E2E8F0] disabled:opacity-50 text-[#475569] text-sm font-bold rounded-xl transition-all"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
                    />
                    {isRefreshing ? 'Re-scanning...' : 'Re-scan'}
                  </button>

                  <button
                    onClick={togglePreview}
                    disabled={cameraStatus.status !== 'Connected'}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-bold rounded-xl transition-all ${
                      isPreviewing
                        ? 'bg-[#FEF2F2] text-[#EF4444] hover:bg-[#FEE2E2]'
                        : 'bg-[#EFF6FF] text-[#3B82F6] hover:bg-[#DBEAFE] disabled:bg-slate-50 disabled:text-slate-400'
                    }`}
                  >
                    {isPreviewing ? (
                      <>
                        <VideoOff className="w-4 h-4" />
                        Stop Preview
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4" />
                        Live Preview
                      </>
                    )}
                  </button>
                </div>
              </div>
            </DeviceCard>
          </div>
        </div>

        <div className="mt-8">
          <SystemStatusBar />
        </div>

        {/* Hidden canvas for frame analysis */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </main>
  );
}
