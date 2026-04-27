'use client';

import { authClient } from '@/lib/auth-client';
import { LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user;
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/');
    router.refresh();
  };

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
            (item) => {
              const href = `/${item.toLowerCase()}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={item}
                  href={href}
                  className={`text-lg transition-all ${
                    isActive
                      ? 'text-blue-500 border-b-4 border-blue-500 pb-1 font-bold'
                      : 'text-white/80 hover:text-white font-medium'
                  }`}
                >
                  {item}
                </Link>
              );
            },
          )}
        </div>

        {/* User Profile Section / Sign In Button */}
        {isLoggedIn ? (
          <div className="relative flex items-center" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
            >
              <User className="w-5 h-5 text-white" />
            </button>

            {isProfileOpen && (
              <div className="absolute top-12 right-0 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-48">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-lg"
                >
                  <LogOut className="w-4 h-4 stroke-[2.5]" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/register"
            className="px-6 py-2 bg-white text-[#8EACCD] font-bold rounded-full hover:bg-gray-100 transition-all shadow-sm text-sm"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
