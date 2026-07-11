'use client';

import AboutUs from '@/components/AboutUs';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Background Decorative Elements (Global Background) */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-blue-100/30 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-yellow-100/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

      <Navbar />

      <div className="flex-1 pt-32 pb-24 px-6 relative z-10 flex items-center justify-center">
        <AboutUs />
      </div>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-[#8EACCD]/10 rounded-t-[10px] mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <Link
            href="/"
            className="text-2xl font-bold italic tracking-tight text-gradient-neuro hover:opacity-80 transition-opacity cursor-pointer"
          >
            NeuroLearn AI
          </Link>
          <div className="flex gap-8 text-sm font-medium text-gray-500">
            <Link
              href="/about"
              className="hover:text-[#8EACCD] transition-colors"
            >
              About Us
            </Link>
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
