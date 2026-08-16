'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupInput } from '@/schemas/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const designation = watch('designation');

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true);
    setMessage(null);
    setUnverifiedEmail(null);

    try {
      const response = await fetch('/api/auth/signup', {
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
            text: result.message || result.error || 'Account exists but is not verified.',
          });
        } else {
          setMessage({ type: 'error', text: result.error || 'Signup failed' });
        }
        return;
      }

      setMessage({
        type: 'success',
        text: 'Signup successful! Check your email for verification OTP.',
      });

      // Store email for OTP verification
      localStorage.setItem('verifyEmail', data.email);

      setTimeout(() => {
        window.location.href = `/auth/verify-email?email=${encodeURIComponent(data.email)}`;
      }, 1500);

      reset();
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium mb-1.5">Full Name</label>
        <input
          type="text"
          placeholder="John Doe"
          className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          {...register('fullName')}
        />
        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1.5">Email</label>
        <input
          type="email"
          placeholder="john@college.edu"
          className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          {...register('email')}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      {/* Designation */}
      <div>
        <label className="block text-sm font-medium mb-1.5">Designation</label>
        <select
          className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          {...register('designation')}
        >
          <option value="">Select Designation</option>
          <option value="Student">Student</option>
          <option value="Faculty">Faculty</option>
          <option value="HOD">HOD</option>
          <option value="Exam Cell">Exam Cell</option>
        </select>
        {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation.message}</p>}
      </div>

      {/* ID Field (Dynamic based on designation) */}
      {designation === 'Student' ? (
        <div>
          <label className="block text-sm font-medium mb-1.5">Student ID</label>
          <input
            type="text"
            placeholder="STU-2024-001"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            {...register('studentId')}
          />
          {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId.message}</p>}
        </div>
      ) : designation ? (
        <div>
          <label className="block text-sm font-medium mb-1.5">Employee ID</label>
          <input
            type="text"
            placeholder="EMP-2024-001"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            {...register('employeeId')}
          />
          {errors.employeeId && <p className="text-red-500 text-xs mt-1">{errors.employeeId.message}</p>}
        </div>
      ) : null}

      {/* Password */}
      <div>
        <label className="block text-sm font-medium mb-1.5">Password</label>
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

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
      </div>

      {/* Terms & Conditions */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="terms"
          className="w-4 h-4 rounded border-border"
          {...register('acceptTerms')}
        />
        <label htmlFor="terms" className="ml-2 text-sm">
          I accept the{' '}
          <Link href="/terms" className="text-primary hover:underline">
            terms and conditions
          </Link>
        </label>
      </div>
      {errors.acceptTerms && <p className="text-red-500 text-xs">{errors.acceptTerms.message}</p>}

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
            <Link
              href={`/auth/verify-email?email=${encodeURIComponent(unverifiedEmail)}`}
              className="mt-1 inline-flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-md shadow transition-colors text-center"
            >
              Verify Email Now
            </Link>
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
        {isLoading ? 'Creating Account...' : 'Sign Up'}
      </Button>

      {/* Login Link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-primary hover:underline font-medium">
          Login here
        </Link>
      </p>
    </form>
  );
}
