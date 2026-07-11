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
                  className="w-full py-3 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300"
                >
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

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSignOut}
                className="py-2 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300"
              >
                Sign Out
              </motion.button>
            </motion.div>
          </GlassmorphismCard>
        </FloatingElement>
      </Floating>
    </div>
  );
}