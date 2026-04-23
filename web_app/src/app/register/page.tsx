'use client';

// Import refactored auth components from components directory
import AuthCard from '@/components/auth/AuthCard';
import AuthHeader from '@/components/auth/AuthHeader';
import GoogleButton from '@/components/auth/GoogleButton';
import InputField from '@/components/auth/InputField';
import PasswordField from '@/components/auth/PasswordField';
import { AtSign, CheckCircle2, LogIn, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
}

export default function RegisterPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'username':
        if (!value.trim()) return 'Username wajib diisi';
        if (value.trim().length < 3) return 'Username minimal 3 karakter';
        return undefined;
      case 'email':
        if (!value.trim()) return 'Email wajib diisi';
        if (!validateEmail(value)) return 'Format email tidak valid';
        return undefined;
      case 'password':
        if (!value.trim()) return 'Password wajib diisi';
        if (value.length < 6) return 'Password minimal 6 karakter';
        return undefined;
      default:
        return undefined;
    }
  };

  const handleBlur = (field: string, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: string, value: string) => {
    switch (field) {
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
    }
    // Clear error on type if already touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: FormErrors = {
      username: validateField('username', username),
      email: validateField('email', email),
      password: validateField('password', password),
    };

    setErrors(newErrors);
    setTouched({ username: true, email: true, password: true });

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(
      (error) => error !== undefined,
    );
    if (hasErrors) return;

    setIsSuccess(true);
    setTimeout(() => {
      router.push('/login');
    }, 5000);
  };

  const handleGoogleRegister = () => {
    // TODO: Integrate with Google OAuth provider
    console.log('Register with Google clicked');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <AuthCard>
        <AuthHeader title="Register" />

        {/* Form */}
        <form className="space-y-4" onSubmit={handleRegister} noValidate>
          <InputField
            label="USERNAME"
            icon={User}
            placeholder="Username"
            value={username}
            onChange={(e) => handleChange('username', e.target.value)}
            onBlur={() => handleBlur('username', username)}
            error={errors.username}
            touched={touched.username}
          />

          <InputField
            label="EMAIL"
            icon={AtSign}
            type="email"
            placeholder="Email@gmail.com"
            value={email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email', email)}
            error={errors.email}
            touched={touched.email}
          />

          <PasswordField
            label="PASSWORD"
            placeholder="••••••••"
            value={password}
            onChange={(e) => handleChange('password', e.target.value)}
            onBlur={() => handleBlur('password', password)}
            error={errors.password}
            touched={touched.password}
          />

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#8eaccd] hover:bg-[#7b98b9] text-white font-medium py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
            >
              Register <LogIn size={18} />
            </button>
          </div>
        </form>

        <GoogleButton
          onClick={handleGoogleRegister}
          text="Daftar dengan Google"
        />

        {/* Footer */}
        <div className="mt-6 text-center text-s text-gray-800 font-semibold">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-[#8eaccd] hover:underline font-bold"
          >
            Login
          </Link>
        </div>

        {/* Success Modal with Email Verification Notice */}
        {isSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center animate-[fadeIn_0.3s_ease-out]">
              <div className="bg-green-100 text-green-500 p-4 rounded-full mb-4">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Berhasil!
              </h3>
              <p className="text-gray-500 text-center mb-4 text-sm">
                Akun Anda berhasil didaftarkan.
              </p>

              {/* Email Verification Notice */}
              <div className="w-full bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                <div className="bg-blue-100 text-blue-500 p-2 rounded-lg shrink-0 mt-0.5">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-blue-800 font-semibold text-sm mb-1">
                    Verifikasi Email Anda
                  </p>
                  <p className="text-blue-600 text-xs leading-relaxed">
                    Kami telah mengirimkan link verifikasi ke{' '}
                    <strong>{email}</strong>. Silakan cek inbox email Anda dan
                    klik link verifikasi untuk mengaktifkan akun.
                  </p>
                </div>
              </div>

              <button
                onClick={() => router.push('/login')}
                className="w-full bg-[#8eaccd] hover:bg-[#7b98b9] text-white font-medium py-3 rounded-xl transition-all shadow-md text-sm"
              >
                Lanjutkan ke Login
              </button>
            </div>
          </div>
        )}
      </AuthCard>
    </div>
  );
}
