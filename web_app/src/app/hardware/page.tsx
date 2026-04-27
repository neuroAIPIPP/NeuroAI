import Navbar from '@/components/Navbar';
import DeviceCard from '@/components/hardware/DeviceCard';
import SystemStatusBar from '@/components/hardware/SystemStatusBar';
import { BarChart2, Check, Clock } from 'lucide-react';
import React from 'react';

export default function HardwarePage() {
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
                { label: 'Status', value: 'Connected', icon: Check },
                { label: 'Signal Quality', value: 'High', icon: BarChart2 },
                { label: 'Latency', value: '12ms', icon: Clock },
              ]}
            />
            <DeviceCard
              deviceNumber="DEVICE 02"
              deviceName="Learning Camera"
              metrics={[{ label: 'Status', value: 'Active', icon: Check }]}
            />
          </div>
        </div>

        <div className="mt-8">
          <SystemStatusBar />
        </div>
      </div>
    </main>
  );
}
