'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import GlassmorphismCard from '@/components/GlassmorphismCard';
import Floating, { FloatingElement } from '@/fancy/components/image/parallax-floating';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Image as ImageIcon, 
  Award, 
  ArrowRight,
  LogOut,
  ShieldCheck
} from 'lucide-react';

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
        console.error('Auth error:', err);
        setError('Authentication failure.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="relative isolate overflow-hidden bg-transparent min-h-lvh">
        <Floating className="w-full h-full" sensitivity={3} easingFactor={0.15}>
          <FloatingElement depth={1.2} className="mx-auto max-w-7xl px-4 flex items-center justify-center min-h-lvh w-full" absolute={false}>
            <GlassmorphismCard className="w-full max-w-md p-8 text-center">
              <p className="text-gray-300 font-mono text-sm">Authenticating Admin Access...</p>
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
          <FloatingElement depth={1.2} className="mx-auto max-w-7xl px-4 flex items-center justify-center min-h-lvh w-full" absolute={false}>
            <GlassmorphismCard className="w-full max-w-md p-8 text-center">
              <h1 className="text-2xl font-black bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 bg-clip-text text-transparent mb-4">
                Admin Portal
              </h1>
              {error && <p className="text-xs text-red-400 mb-4">{error}</p>}
              <button
                onClick={handleGoogleSignIn}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] shadow-lg hover:opacity-90 transition-all text-sm"
              >
                Sign In with Google
              </button>
            </GlassmorphismCard>
          </FloatingElement>
        </Floating>
      </div>
    );
  }

  const ADMIN_MODULES = [
    {
      title: 'Membership Applications',
      desc: 'Verify UTR/Razorpay transaction screenshots and approve registered members into the official directory.',
      href: '/admin/memberships',
      icon: Users,
      gradient: 'from-emerald-500/20 to-teal-500/5',
      border: 'border-emerald-500/30',
      badge: 'Tenure 2026-27'
    },
    {
      title: 'Event Registrations Desk',
      desc: 'Live auditorium desk for participant lookup, details updating, and real-time Day 1 / Day 2 check-ins.',
      href: '/admin/registrations',
      icon: UserCheck,
      gradient: 'from-blue-500/20 to-indigo-500/5',
      border: 'border-blue-500/30',
      badge: 'Live Attendance'
    },
    {
      title: 'Event Management',
      desc: 'Create and edit workshops, update posters, configure registration deadlines, and manage visibility.',
      href: '/admin/events',
      icon: Calendar,
      gradient: 'from-purple-500/20 to-pink-500/5',
      border: 'border-purple-500/30',
      badge: 'Events CMS'
    },
    {
      title: 'Certificates Analytics',
      desc: 'Real-time issuance tracker, download status analytics, and CSV report export engine.',
      href: '/admin/certificates',
      icon: Award,
      gradient: 'from-amber-500/20 to-orange-500/5',
      border: 'border-amber-500/30',
      badge: 'Verification'
    },
    {
      title: 'Gallery Control',
      desc: 'Upload event memories, organize media sets, and manage public showcase photos.',
      href: '/admin/gallery',
      icon: ImageIcon,
      gradient: 'from-pink-500/20 to-rose-500/5',
      border: 'border-pink-500/30',
      badge: 'Media'
    }
  ];

  return (
    <div className="relative isolate overflow-hidden bg-[#07050e] min-h-screen text-white pb-20">
      
      {/* Header bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full border-b border-white/10 bg-white/5 backdrop-blur-md mt-24 sm:mt-28"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span>Logged in as: <strong className="text-white font-mono">{user.email}</strong></span>
          </div>

          <button
            onClick={handleSignOut}
            className="py-1.5 px-4 rounded-lg text-xs font-semibold text-white bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </motion.div>

      {/* Main Grid Portal */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 mt-10 space-y-6">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
            Admin Control Center
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 font-mono">
            Select a module below to manage registrations, directory, events, or media.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ADMIN_MODULES.map((module) => {
            const Icon = module.icon;
            return (
              <div
                key={module.href}
                onClick={() => router.push(module.href)}
                className={`group bg-[#0c0814]/90 hover:bg-[#120c22] border ${module.border} rounded-2xl p-6 transition-all duration-300 cursor-pointer shadow-xl flex flex-col justify-between hover:scale-[1.01]`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white">
                      <Icon className="w-5 h-5 text-cyan-300" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                      {module.badge}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {module.title}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    {module.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">
                  <span>Launch Module</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-cyan-400" />
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}