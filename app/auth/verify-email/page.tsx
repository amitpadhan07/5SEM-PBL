'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';
  
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleResendOTP = async () => {
    if (!email || isResending || cooldown > 0) return;

    setIsResending(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: result.error || 'Failed to resend OTP' });
        return;
      }

      setMessage({ type: 'success', text: result.message || 'New verification OTP sent to your email!' });
      setCooldown(60);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to resend OTP. Please try again.' });
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setMessage({ type: 'error', text: 'OTP must be 6 digits' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: result.error || 'Verification failed' });
        return;
      }

      // Store token and redirect
      localStorage.setItem('token', result.token);
      document.cookie = `token=${result.token}; path=/; max-age=${30 * 24 * 60 * 60}`;
      setMessage({ type: 'success', text: 'Email verified! Redirecting...' });

      setTimeout(() => {
        // Check if user needs to complete profile
        if (result.user.profileCompletionPercentage < 100) {
          window.location.href = '/dashboard/complete-profile';
        } else {
          window.location.href = '/dashboard';
        }
      }, 1000);
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">V</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Verify Your Email</h1>
          <p className="text-muted-foreground mt-2">Enter the 6-digit OTP sent to your email</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-border">
          <form onSubmit={handleVerify} className="space-y-4">
            {/* Email Display */}
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Verification code sent to</p>
              <p className="font-medium break-all">{email}</p>
            </div>

            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Enter OTP</label>
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 border-2 border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center text-2xl tracking-widest font-mono"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Check your email for the verification code. It will expire in 10 minutes.
              </p>
            </div>

            {/* Messages */}
            {message && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Didn&apos;t receive the code?</p>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isResending || cooldown > 0}
              className="text-primary hover:underline text-sm font-medium disabled:opacity-50 disabled:no-underline inline-flex items-center gap-1.5 cursor-pointer"
            >
              {isResending && <Loader2 size={14} className="animate-spin" />}
              {isResending
                ? 'Sending...'
                : cooldown > 0
                ? `Resend OTP in ${cooldown}s`
                : 'Resend OTP'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm">
          <Link href="/auth/signup" className="text-primary hover:underline">
            Back to Signup
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
