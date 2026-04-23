'use client';

import { authClient } from '@/lib/auth-client';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user;

  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Column: Text Content */}
        <div className="space-y-8">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Master Your Focus <br />
            with <span className="text-blue-500">Neuro-AI</span>
          </h1>
          <p className="text-lg text-gray-700 max-w-lg leading-relaxed">
            Monitor your focus in real time during learning sessions. Analyze
            attention levels using EEG, eye tracking, and facial recognition.
          </p>
          <Link href={isLoggedIn ? '/dashboard' : '/login'}>
            <button className="px-8 py-4 bg-[#8EACCD] text-white rounded-xl font-semibold shadow-lg hover:bg-[#7a9ab5] transform hover:-translate-y-1 transition-all active:scale-95">
              {isLoggedIn ? 'Go to Dashboard' : 'Login to Dashboard'}
            </button>
          </Link>
        </div>

        {/* Right Column: Brain Image */}
        <div className="relative flex justify-center items-center">
          <div className="absolute inset-0 bg-blue-200/20 blur-3xl rounded-full scale-90" />
          <div className="relative w-[280px] md:w-[320px] aspect-square rounded-full overflow-hidden border border-white/20 bg-white/10 backdrop-blur-sm shadow-2xl">
            <Image
              src="/brain-circuitry1.png"
              alt="3D Neural Visualization"
              fill
              className="object-cover opacity-70 transition-opacity hover:opacity-100"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
