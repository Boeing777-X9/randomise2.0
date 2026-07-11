'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Wait for the OAuth callback to be processed
        // Supabase automatically handles the code exchange
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) {
          console.error('Auth error:', authError);
          setError('Authentication failed. Please try again.');
          setTimeout(() => router.replace('/'), 3000);
          return;
        }

        if (user) {
          console.log('User authenticated:', user.email);
          // Give the session a moment to settle before redirecting
          await new Promise(resolve => setTimeout(resolve, 500));
          router.replace('/admin');
        } else {
          console.log('No user found, redirecting to home');
          router.replace('/');
        }
      } catch (err) {
        console.error('Callback error:', err);
        setError('An error occurred. Please try again.');
        setTimeout(() => router.replace('/'), 3000);
      }
    };

    handleCallback();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-lvh flex flex-col items-center justify-center gap-4 px-4">
        <div className="max-w-md p-6 rounded-lg bg-red-500/20 border border-red-500/50 text-center">
          <p className="text-red-300 font-semibold mb-2">Authentication Error</p>
          <p className="text-red-200 text-sm">{error}</p>
          <p className="text-gray-400 text-xs mt-4">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-lvh flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-12 h-12 mx-auto mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 rounded-full animate-spin opacity-30" />
          <div className="absolute inset-2 bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 rounded-full animate-spin opacity-50" style={{ animationDirection: 'reverse' }} />
        </div>
        <p className="text-gray-400">Signing you in...</p>
      </div>
    </div>
  );
}