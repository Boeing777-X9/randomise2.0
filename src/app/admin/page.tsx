'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import GlassmorphismCard from '@/components/GlassmorphismCard';
import Floating, { FloatingElement } from '@/fancy/components/image/parallax-floating';

import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data: admin, error } = await supabase
          .from('admins')
          .select('*')
          .eq('email', user.email);

        if (error || !admin || admin.length === 0) {
          setError('You are not authorized.');
          await supabase.auth.signOut();
          router.push('/');
          return;
        }

        setUser(user);
      } catch (err) {
        console.error('Auth check error:', err);
        setError('An error occurred during authentication. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/');
    } catch (error) {
      console.error('Sign-Out Error:', error);
      setError('Failed to sign out. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="relative isolate overflow-hidden bg-transparent min-h-lvh">
        <Floating className="w-full h-full" sensitivity={3} easingFactor={0.15}>
          <FloatingElement
            depth={1.2}
            className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 pb-16 sm:pb-24 flex items-center justify-center min-h-lvh w-full"
            absolute={false}
          >
            <GlassmorphismCard className="w-full max-w-md p-8 text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-center mb-4">
                  <div className="relative w-12 h-12">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      style={{ opacity: 0.3 }}
                    />
                    <motion.div
                      className="absolute inset-2 bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 rounded-full"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      style={{ opacity: 0.5 }}
                    />
                  </div>
                </div>
                <p className="text-gray-300">Authenticating...</p>
              </motion.div>
            </GlassmorphismCard>
          </FloatingElement>
        </Floating>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative isolate overflow-hidden bg-transparent min-h-lvh">
        <Floating className="w-full h-full" sensitivity={3} easingFactor={0.15}>
          <FloatingElement
            depth={1.2}
            className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 pb-16 sm:pb-24 flex items-center justify-center min-h-lvh w-full"
            absolute={false}
          >
            <GlassmorphismCard className="w-full max-w-md p-8">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 bg-clip-text text-transparent mb-4">
                  Admin Access Required
                </h1>
                <p className="text-gray-300 mb-6">Sign in with Google to continue</p>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50"
                  >
                    <p className="text-red-300 text-sm">{error}</p>
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoogleSignIn}
                  className="w-full py-3 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                  </svg>
                  Sign In with Google
                </motion.button>
              </motion.div>
            </GlassmorphismCard>
          </FloatingElement>
        </Floating>
      </div>
    );
  }

  return (
    <div className="relative isolate overflow-hidden bg-transparent min-h-lvh">
      {/* Header bar - sits just below the main nav bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full border-b border-white/10 bg-white/5 backdrop-blur-md mt-24 sm:mt-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-300 text-sm">
            Welcome, {user.user_metadata?.full_name || user.email || 'Admin'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/admin/gallery')}
              className="py-2 px-5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300"
            >
              Gallery Control
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/admin/events')}
              className="py-2 px-5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300"
            >
              Event Control
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSignOut}
              className="py-2 px-5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300"
            >
              Sign Out
            </motion.button>
          </div>
        </div>
      </motion.div>

      <Floating className="w-full h-full" sensitivity={3} easingFactor={0.15}>
        <FloatingElement
          depth={1.2}
          className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 pb-16 sm:pb-24 flex items-center justify-center min-h-lvh w-full"
          absolute={false}
        >
          <GlassmorphismCard className="w-full max-w-2xl p-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 bg-clip-text text-transparent mb-4">
                Admin Access Granted
              </h1>
              <p className="text-gray-300 mb-6">
                Welcome, {user.user_metadata?.full_name || user.email || 'Admin'}!
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50"
                >
                  <p className="text-red-300 text-sm">{error}</p>
                </motion.div>
              )}
            </motion.div>
          </GlassmorphismCard>
        </FloatingElement>
      </Floating>
    </div>
  );
}