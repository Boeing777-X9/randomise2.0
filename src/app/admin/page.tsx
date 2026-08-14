'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import GlassmorphismCard from '@/components/GlassmorphismCard';
import Floating, { FloatingElement } from '@/fancy/components/image/parallax-floating';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  FileSpreadsheet 
} from 'lucide-react';

interface CertificateAttendee {
  id: string;
  full_name: string;
  registration_number: string;
  personal_email: string;
  outlook_email: string;
  certificate_url: string | null;
  certificate_issued_at: string | null;
  day1_confirmed: boolean;
  day2_confirmed: boolean;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Certificate Tracker State
  const [attendees, setAttendees] = useState<CertificateAttendee[]>([]);
  const [trackerLoading, setTrackerLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'claimed' | 'unclaimed'>('all');

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
        fetchCertificateStats();
      } catch (err) {
        console.error('Auth check error:', err);
        setError('An error occurred during authentication. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Fetch all attendees eligible for certificates
  const fetchCertificateStats = async () => {
    setTrackerLoading(true);
    const { data, error } = await supabase
      .from('event_registrations')
      .select('id, full_name, registration_number, personal_email, outlook_email, certificate_url, certificate_issued_at, day1_confirmed, day2_confirmed')
      .or('day1_confirmed.eq.true,day2_confirmed.eq.true')
      .order('full_name', { ascending: true });

    if (!error && data) {
      setAttendees(data);
    }
    setTrackerLoading(false);
  };

  // Google OAuth
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

  // Export CSV Report
  const exportCSV = () => {
    const headers = ['Registration Number', 'Full Name', 'Personal Email', 'Outlook Email', 'Certificate Claimed', 'Issued At', 'Certificate URL'];
    const rows = attendees.map((a) => [
      `"${a.registration_number || ''}"`,
      `"${a.full_name || ''}"`,
      `"${a.personal_email || ''}"`,
      `"${a.outlook_email || ''}"`,
      a.certificate_url ? 'YES' : 'NO',
      a.certificate_issued_at ? new Date(a.certificate_issued_at).toLocaleString() : 'N/A',
      `"${a.certificate_url || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Certificate_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // KPI Calculations
  const totalEligible = attendees.length;
  const totalClaimed = attendees.filter((a) => a.certificate_url !== null).length;
  const percentage = totalEligible > 0 ? Math.round((totalClaimed / totalEligible) * 100) : 0;

  // Search & Filter attendees
  const filteredList = attendees.filter((item) => {
    const matchesSearch =
      item.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.registration_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.personal_email?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'claimed') return item.certificate_url !== null;
    if (filterStatus === 'unclaimed') return item.certificate_url === null;
    return true;
  });

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
    <div className="relative isolate overflow-hidden bg-[#07050e] min-h-screen text-white pb-20">
      {/* Header bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full border-b border-white/10 bg-white/5 backdrop-blur-md mt-24 sm:mt-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-300 text-sm">
            Welcome, {user.user_metadata?.full_name || user.email || 'Admin'}[cite: 2]
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/admin/registrations')}
              className="py-2 px-5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
            >
              Registrations Desk
            </motion.button>

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

      {/* Main Admin Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-8 space-y-8">
        
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
              Event Certificates Analytics
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              &lt;HELLO WORLD/&gt; • Issuance & Real-Time Download Status
            </p>
          </div>
          <button
            onClick={fetchCertificateStats}
            disabled={trackerLoading}
            className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${trackerLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {/* ── KPI Summary Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Claimed */}
          <div className="bg-[#0f0b1c] border border-purple-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Certificates Downloaded</p>
                <h3 className="text-3xl font-extrabold text-white mt-1">
                  {totalClaimed} <span className="text-sm font-normal text-gray-500">/ {totalEligible}</span>
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Award className="w-6 h-6" />
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-4 w-full bg-white/5 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-2 font-mono">{percentage}% of eligible participants claimed</p>
          </div>

          {/* Total Eligible Attendees */}
          <div className="bg-[#0f0b1c] border border-white/10 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Eligible Students</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{totalEligible}</h3>
              <p className="text-[11px] text-gray-500 mt-1">Marked present on Day 1 or Day 2</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          {/* Pending */}
          <div className="bg-[#0f0b1c] border border-white/10 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Unclaimed Certificates</p>
              <h3 className="text-3xl font-extrabold text-yellow-400 mt-1">{totalEligible - totalClaimed}</h3>
              <p className="text-[11px] text-gray-500 mt-1">Eligible attendees yet to verify</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* ── Search, Filters & Attendee Table ── */}
        <div className="bg-[#0f0b1c] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, reg no, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:border-purple-400 outline-none"
              />
            </div>

            {/* Filter Pills + Export */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
              <div className="flex bg-black/40 border border-white/10 rounded-xl p-0.5 text-xs">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${filterStatus === 'all' ? 'bg-purple-600 text-white font-semibold' : 'text-gray-400 hover:text-white'}`}
                >
                  All ({attendees.length})
                </button>
                <button
                  onClick={() => setFilterStatus('claimed')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${filterStatus === 'claimed' ? 'bg-green-600 text-white font-semibold' : 'text-gray-400 hover:text-white'}`}
                >
                  Claimed ({totalClaimed})
                </button>
                <button
                  onClick={() => setFilterStatus('unclaimed')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${filterStatus === 'unclaimed' ? 'bg-yellow-600 text-white font-semibold' : 'text-gray-400 hover:text-white'}`}
                >
                  Unclaimed ({totalEligible - totalClaimed})
                </button>
              </div>

              <button
                onClick={exportCSV}
                className="px-3.5 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-green-400" /> Export CSV
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-white/[0.03] text-gray-400 uppercase font-mono text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Participant</th>
                  <th className="py-3 px-4">Reg No</th>
                  <th className="py-3 px-4">Personal Gmail</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Claimed At</th>
                  <th className="py-3 px-4 text-right">PDF File</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {trackerLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-purple-400" />
                      Loading certificate attendance records...
                    </td>
                  </tr>
                ) : filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No matching attendees found.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((attendee) => {
                    const isClaimed = !!attendee.certificate_url;
                    return (
                      <tr key={attendee.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 font-semibold text-white">{attendee.full_name}</td>
                        <td className="py-3 px-4 font-mono text-gray-400">{attendee.registration_number}</td>
                        <td className="py-3 px-4 text-gray-400">{attendee.personal_email}</td>
                        <td className="py-3 px-4 text-center">
                          {isClaimed ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/30">
                              <CheckCircle2 className="w-3 h-3" /> Downloaded
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                              <Clock className="w-3 h-3" /> Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-400 text-[11px]">
                          {attendee.certificate_issued_at
                            ? new Date(attendee.certificate_issued_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                            : '—'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {attendee.certificate_url ? (
                            <a
                              href={attendee.certificate_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 font-semibold"
                            >
                              View PDF <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-gray-600 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}