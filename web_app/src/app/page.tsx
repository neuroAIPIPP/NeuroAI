'use client';

import FeatureCard from '@/components/FeatureCard';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import { authClient } from '@/lib/auth-client';
import { ArrowRight, Brain, Eye, UserCheck } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: 'EEG Analysis',
    description:
      'Measure brain activity in real time to identify focus levels and cognitive states during learning sessions.',
    Icon: Brain,
  },
  {
    title: 'Eye Tracking',
    description:
      'Track gaze patterns to determine attention focus and detect distractions during learning activities.',
    Icon: Eye,
  },
  {
    title: 'Face Recognition',
    description:
      'Analyze facial expressions to detect engagement, fatigue, and emotional responses in real time.',
    Icon: UserCheck,
  },
];

export default function Home() {
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user;

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-blue-100/30 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-yellow-100/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

      <Navbar />
      <Hero />

      {/* Biometric Precision Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Biometric Precision
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto italic text-lg">
              Track focus, attention, and cognitive load during learning
              sessions using integrated biometric data.
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#8EACCD] to-[#7a9ab5] rounded-[32px] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Ready to Optimize <br className="hidden md:block" /> Your
              Learning?
            </h2>
            <p className="text-xl text-blue-50 max-w-2xl mx-auto opacity-90">
              Join thousands of learners using NeuroAI to master their focus and
              achieve peak cognitive performance.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href={isLoggedIn ? '/dashboard' : '/register'}>
                <button className="px-10 py-5 bg-white text-[#8EACCD] rounded-2xl font-bold shadow-xl hover:bg-gray-100 transition-all flex items-center gap-2 group">
                  {isLoggedIn ? 'Go to Dashboard' : 'Get Started for Free'}{' '}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#8EACCD]/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-2xl font-bold italic text-[#8EACCD]">
            NeuroLearn AI
          </div>
          <div className="flex gap-8 text-sm font-medium text-gray-500">
            <Link href="#" className="hover:text-[#8EACCD] transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-[#8EACCD] transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-[#8EACCD] transition-colors">
              Contact Us
            </Link>
          </div>
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} NeuroLearn AI. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
