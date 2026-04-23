import { User } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[#8EACCD] rounded-b-[10px] shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-2 rounded-2xl">
        {/* Logo */}
        <div className="text-2xl font-bold italic tracking-tight text-gradient-neuro">
          NeuroLearn AI
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {['Dashboard', 'Session', 'Analytics', 'History', 'Hardware'].map(
            (item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-lg font-medium text-white/80 hover:text-white transition-colors"
              >
                {item}
              </Link>
            ),
          )}
        </div>

        {/* Sign In Button */}
        <Link
          href="/register"
          className="px-6 py-2 bg-white text-[#8EACCD] font-bold rounded-full hover:bg-gray-100 transition-all shadow-sm text-sm"
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
}
