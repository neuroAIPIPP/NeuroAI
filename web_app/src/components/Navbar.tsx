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

        {/* User Profile Section */}
        <Link
          href="/login"
          className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
        >
          <User className="w-5 h-5 text-white" />
        </Link>
      </div>
    </nav>
  );
}
