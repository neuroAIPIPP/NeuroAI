'use client';

import { authClient } from '@/lib/auth-client';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminHero() {
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user;

  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Column: Text Content */}
        <div className="space-y-8">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Manage Focus <br />
            with <span className="text-blue-500">Neuro-AI</span>
          </h1>
          <p className="text-lg text-gray-700 max-w-lg leading-relaxed">
            Monitor and manage focus analytics in real time. Access all user
            attention data, EEG metrics, and system performance overview.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href={isLoggedIn ? '/admin/dashboard' : '/login'}>
              <button className="px-8 py-4 bg-[#8EACCD] text-white rounded-xl font-semibold shadow-lg hover:bg-[#7a9ab5] transform hover:-translate-y-1 transition-all active:scale-95 cursor-pointer">
                {isLoggedIn ? 'Go to Admin Dashboard' : 'Login to Dashboard'}
              </button>
            </Link>
            <Link href={isLoggedIn ? '/admin/history' : '/login'}>
              <button className="px-8 py-4 bg-white text-[#8EACCD] rounded-xl font-semibold shadow-lg hover:bg-gray-50 transform hover:-translate-y-1 transition-all active:scale-95 cursor-pointer">
                {isLoggedIn ? 'Go to Session History' : 'Login for Session'}
              </button>
            </Link>
          </div>
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
