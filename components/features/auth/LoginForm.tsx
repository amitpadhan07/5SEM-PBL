'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/schemas/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setMessage(null);
    setUnverifiedEmail(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.isEmailVerified === false) {
          setUnverifiedEmail(result.email || data.email);
          setMessage({
            type: 'error',
            text: result.error || 'Please verify your email address before logging in.',
          });
        } else {
          setMessage({ type: 'error', text: result.error || 'Login failed' });
        }
        return;
      }

      // Store token locally and in cookie
      localStorage.setItem('token', result.token);
      document.cookie = `token=${result.token}; path=/; max-age=${30 * 24 * 60 * 60}`;
      setMessage({ type: 'success', text: 'Login successful! Redirecting...' });

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1.5">Email Address</label>
        <input
          type="email"
          placeholder="john@college.edu"
          className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          {...register('email')}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium">Password</label>
          <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
            Forgot?
          </Link>
        </div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      {/* Remember Me */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="remember"
          className="w-4 h-4 rounded border-border"
          {...register('rememberMe')}
        />
        <label htmlFor="remember" className="ml-2 text-sm">
          Remember me for 30 days
        </label>
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`p-3 rounded-lg text-sm flex flex-col gap-2 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-amber-50 text-amber-900 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800'
          }`}
        >
          <p>{message.text}</p>
          {unverifiedEmail && (
            <button
              type="button"
              onClick={async () => {
                try {
                  await fetch('/api/auth/resend-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: unverifiedEmail }),
                  });
                } catch (e) {
                  console.error(e);
                }
                router.push(`/auth/verify-email?email=${encodeURIComponent(unverifiedEmail)}`);
              }}
              className="mt-1 inline-flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-md shadow transition-colors text-center cursor-pointer"
            >
              Verify Email Now
            </button>
          )}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 rounded-lg flex items-center justify-center gap-2"
      >
        {isLoading && <Loader2 size={16} className="animate-spin" />}
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="text-primary hover:underline font-medium">
          Sign up here
        </Link>
      </p>
    </form>
  );
}
