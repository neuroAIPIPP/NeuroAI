import AuthCard from '@/components/auth/AuthCard';
import AuthHeader from '@/components/auth/AuthHeader';
import GoogleButton from '@/components/auth/GoogleButton';
import InputField from '@/components/auth/InputField';
import PasswordField from '@/components/auth/PasswordField';
import { useAuth } from '@/context/AuthContext';
import { AtSign, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const { login } = useAuth();
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
      case 'email':
        if (!value.trim()) return 'Email wajib diisi';
        if (!validateEmail(value)) return 'Format email tidak valid';
        return undefined;
      case 'password':
        if (!value.trim()) return 'Password wajib diisi';
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
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);

    // Clear error on type if already touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: FormErrors = {
      email: validateField('email', email),
      password: validateField('password', password),
    };

    setErrors(newErrors);
    setTouched({ email: true, password: true });

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(
      (error) => error !== undefined,
    );
    if (hasErrors) return;

    // Design-only: Just log and redirect or show success
    console.log('Login attempt with:', { email, password });
    login(); // Call the auth context login
    router.push('/');
  };

  const handleGoogleLogin = () => {
    console.log('Google Login clicked');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50/30">
      <AuthCard>
        <AuthHeader title="Login" />

        {/* Form */}
        <form className="space-y-4" onSubmit={handleLogin} noValidate>
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
              Login <LogIn size={18} />
            </button>
          </div>
        </form>

        <GoogleButton onClick={handleGoogleLogin} text="Masuk dengan Google" />

        {/* Footer */}
        <div className="mt-6 text-center text-s text-gray-800 font-semibold">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-[#8eaccd] hover:underline font-bold"
          >
            Register
          </Link>
        </div>
      </AuthCard>
    </div>
  );
}
