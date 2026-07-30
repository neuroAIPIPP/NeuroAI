'use client';

import AuthCard from '@/components/auth/AuthCard';
import AuthHeader from '@/components/auth/AuthHeader';
import InputField from '@/components/auth/InputField';
import { ArrowLeft, AtSign, CheckCircle2, Mail, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email wajib diisi');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Format email tidak valid');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call for now since backend is not ready
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50/30">
      <AuthCard>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 font-medium transition-colors mb-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <AuthHeader title="Lupa Password" />

        <p className="text-gray-500 text-sm mb-6 text-center">
          Masukkan alamat email yang terdaftar, dan kami akan mengirimkan tautan
          untuk mengatur ulang kata sandi Anda.
        </p>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleResetPassword} noValidate>
          <InputField
            label="EMAIL"
            icon={AtSign}
            type="email"
            placeholder="Email@gmail.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            error={error}
            touched={!!error}
          />

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#8eaccd] hover:bg-[#7b98b9] text-white font-medium py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Mengirim...' : 'Kirim ke Email'} <Send size={18} />
            </button>
          </div>
        </form>

        {/* Success Modal */}
        {isSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center animate-[fadeIn_0.3s_ease-out]">
              <div className="bg-green-100 text-green-500 p-4 rounded-full mb-4">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Email Terkirim!
              </h3>

              <div className="w-full bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3 mt-4">
                <div className="bg-blue-100 text-blue-500 p-2 rounded-lg shrink-0 mt-0.5">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-blue-800 font-semibold text-sm mb-1">
                    Cek Inbox Anda
                  </p>
                  <p className="text-blue-600 text-xs leading-relaxed">
                    Kami telah mengirimkan instruksi untuk mengatur ulang kata
                    sandi ke <strong>{email}</strong>.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push('/login')}
                className="w-full bg-[#8eaccd] hover:bg-[#7b98b9] text-white font-medium py-3 rounded-xl transition-all shadow-md text-sm"
              >
                Kembali ke Login
              </button>
            </div>
          </div>
        )}
      </AuthCard>
    </div>
  );
}
