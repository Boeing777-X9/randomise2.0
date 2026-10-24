'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  LogOut,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  Code2,
  Layers,
  Send,
  Trash2,
  AlertCircle,
  FolderGit2,
  UserCheck,
  RefreshCw,
  Compass,
  Cpu
} from 'lucide-react';

const DRAFT_STORAGE_KEY = 'randomize_build_draft_26';

const ROLE_OPTIONS = [
  { group: 'Club Membership', roles: ['Member'] },
  {
    group: 'JWT (Junior Working Team)',
    roles: [
      'JWT Tech',
      'JWT Editorial',
      'JWT Events & Operations',
      'JWT Social Media & Coverage',
      'JWT Finance & Registrations',
      'JWT Outreach',
      'JWT Graphic Design'
    ]
  }
];

const PROJECT_OPTIONS = [
  { id: 'Campus Navigator', name: 'Campus Navigator', desc: 'Room-to-room navigation & campus shuttle tracking system' },
  { id: 'Offline UPI', name: 'Offline UPI', desc: 'Mesh-routed offline transaction & local settlement system' },
  { id: 'GPS Tracker', name: 'GPS Tracker', desc: 'Hardware & telemetry tracking with real-time maps' }
];

interface BuildFormData {
  fullName: string;
  registrationNumber: string;
  outlookEmail: string;
  phoneNumber: string;
  role: string;
  projectPreference1: string;
  projectPreference2: string;
  techStack: string;
  githubLink: string;
  projectReason: string;
}

const initialFormData: BuildFormData = {
  fullName: '',
  registrationNumber: '',
  outlookEmail: '',
  phoneNumber: '',
  role: '',
  projectPreference1: '',
  projectPreference2: '',
  techStack: '',
  githubLink: '',
  projectReason: ''
};

export default function BuildWithUsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<BuildFormData>(initialFormData);
  const [autoFilled, setAutoFilled] = useState(false);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    applicationId: string;
    fullName: string;
    preference1: string;
    preference2: string;
    role: string;
  } | null>(null);

  // ── 1. Listen to Supabase Auth State ─────────────────────────────
  useEffect(() => {
    let isMounted = true;

    const checkAuthAndAutoFill = async (currentUser: User | null) => {
      if (!isMounted) return;
      setUser(currentUser);

      if (!currentUser) {
        setLoading(false);
        setIsDraftLoaded(true);
        return;
      }

      try {
        const cleanEmail = currentUser.email?.toLowerCase().trim();

        // 1. Fetch from randomize_directory (matching membership & jwt)
        const [dirRes, memberRes] = await Promise.all([
          supabase
            .from('randomize_directory')
            .select('*')
            .or(`email.ilike.${cleanEmail},outlook_email.ilike.${cleanEmail}`)
            .maybeSingle(),
          supabase
            .from('members_26')
            .select('*')
            .or(`personal_email.ilike.${cleanEmail},outlook_email.ilike.${cleanEmail}`)
            .maybeSingle()
        ]);

        const dirProfile = dirRes.data;
        const memberProfile = memberRes.data;

        const fetchedName = dirProfile?.name || memberProfile?.full_name || currentUser.user_metadata?.full_name || '';
        const fetchedReg = dirProfile?.registration_number || memberProfile?.registration_number || '';
        const fetchedOutlook = dirProfile?.outlook_email || memberProfile?.outlook_email || '';
        const fetchedPhone = dirProfile?.phone_number || dirProfile?.whatsapp_number || memberProfile?.phone_number || '';
        const defaultRole = (dirProfile?.is_member || memberProfile) ? 'Member' : '';

        const hasProfileData = !!(fetchedName || fetchedReg || fetchedOutlook || fetchedPhone);
        if (hasProfileData) {
          setAutoFilled(true);
        }

        // 2. Check draft storage in localStorage
        const savedDraftStr = localStorage.getItem(DRAFT_STORAGE_KEY);
        let draftData: Partial<BuildFormData> = {};
        if (savedDraftStr) {
          try {
            draftData = JSON.parse(savedDraftStr);
          } catch (e) {
            console.warn('Error parsing draft:', e);
          }
        }

        setFormData(prev => ({
          ...prev,
          fullName: draftData.fullName || fetchedName || prev.fullName,
          registrationNumber: draftData.registrationNumber || fetchedReg || prev.registrationNumber,
          outlookEmail: draftData.outlookEmail || fetchedOutlook || prev.outlookEmail,
          phoneNumber: draftData.phoneNumber || fetchedPhone || prev.phoneNumber,
          role: draftData.role || defaultRole || prev.role,
          projectPreference1: draftData.projectPreference1 || prev.projectPreference1,
          projectPreference2: draftData.projectPreference2 || prev.projectPreference2,
          techStack: draftData.techStack || prev.techStack,
          githubLink: draftData.githubLink || prev.githubLink,
          projectReason: draftData.projectReason || prev.projectReason
        }));
      } catch (err) {
        console.warn('Auto-fill fetch note:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
          setIsDraftLoaded(true);
        }
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAuthAndAutoFill(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkAuthAndAutoFill(session?.user || null);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // ── 2. Persist Form Draft Locally ─────────────────────────────
  useEffect(() => {
    if (!isDraftLoaded || !user || successData) return;
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      console.warn('Draft save error:', e);
    }
  }, [formData, isDraftLoaded, user, successData]);

  const handleClearDraft = () => {
    if (window.confirm('Are you sure you want to clear your saved responses?')) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setFormData(initialFormData);
      setAutoFilled(false);
    }
  };

  // ── 3. Google Sign-In ─────────────────────────────────────────
  const handleGoogleLogin = async () => {
    try {
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/build`
        : undefined;

      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });
    } catch (err: any) {
      setError('Google Sign-In failed. Please try again: ' + (err.message || ''));
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setFormData(initialFormData);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // ── 4. Form Field Changes ─────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Handle mutual exclusion for Project Preferences
    if (name === 'projectPreference1') {
      setFormData(prev => ({
        ...prev,
        projectPreference1: value,
        projectPreference2: prev.projectPreference2 === value ? '' : prev.projectPreference2
      }));
      return;
    }

    if (name === 'projectPreference2') {
      setFormData(prev => ({
        ...prev,
        projectPreference2: value,
        projectPreference1: prev.projectPreference1 === value ? '' : prev.projectPreference1
      }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ── 5. Submit Handler ─────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form validations
    if (!formData.fullName.trim()) {
      return setError('Please enter your full name.');
    }
    if (!formData.registrationNumber.trim()) {
      return setError('Please enter your registration number.');
    }
    if (!formData.outlookEmail.trim()) {
      return setError('Please enter your Outlook email ID.');
    }
    if (!formData.outlookEmail.toLowerCase().includes('@')) {
      return setError('Please provide a valid Outlook email address.');
    }
    if (!formData.phoneNumber.trim()) {
      return setError('Please enter your phone number.');
    }
    if (!formData.role.trim()) {
      return setError('Please select your role from the dropdown menu.');
    }
    if (!formData.projectPreference1.trim()) {
      return setError('Please select your Project Preference 1.');
    }
    if (!formData.projectPreference2.trim()) {
      return setError('Please select your Project Preference 2.');
    }
    if (formData.projectPreference1 === formData.projectPreference2) {
      return setError('Project Preference 1 and Project Preference 2 cannot be the same project.');
    }
    if (!formData.techStack.trim()) {
      return setError('Please enter your tech stack and tools.');
    }
    if (!formData.githubLink.trim()) {
      return setError('Please provide your GitHub profile or repository link.');
    }
    if (!formData.projectReason.trim()) {
      return setError('Please answer why you want to work on this project.');
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/build/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userEmail: user?.email
        })
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Submission failed. Please try again.');
      }

      localStorage.removeItem(DRAFT_STORAGE_KEY);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

      setSuccessData({
        applicationId: result.applicationId || `BLD_${Date.now()}`,
        fullName: formData.fullName.trim(),
        preference1: formData.projectPreference1,
        preference2: formData.projectPreference2,
        role: formData.role
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle =
    'w-full px-4 py-3.5 text-sm rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] transition-all duration-300 backdrop-blur-sm';
  const labelStyle = 'block text-xs font-semibold text-gray-300 uppercase tracking-widest mb-2';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-pink-400" />
          <p className="text-sm font-mono text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative isolate min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden overflow-y-auto pt-28 sm:pt-32 pb-24 flex justify-center items-start">
      {/* Background aesthetics */}
      <div className="fixed inset-0 pointer-events-none -z-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="fixed top-[10%] left-[20%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-[20%] right-[20%] w-[500px] h-[500px] bg-pink-600/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="w-full px-4 sm:px-6 relative z-10 flex flex-col mx-auto max-w-4xl">
        {/* Top Header Bar */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm group font-medium cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>

          {user && (
            <div className="flex items-center gap-3">
              <span className="text-[10px] sm:text-xs font-mono text-purple-200/80 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 hidden sm:inline-block">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs text-red-400/80 hover:text-red-400 transition-colors font-semibold bg-red-500/10 hover:bg-red-500/20 px-3 py-1 rounded-full border border-red-500/20 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full bg-white/[0.02] backdrop-blur-3xl border border-white/[0.08] shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-3xl p-6 sm:p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

          {/* Header */}
          <div className="mb-8 text-center relative z-10 flex flex-col items-center justify-center">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-wider mb-2 uppercase drop-shadow-md text-center">
              RANDOMIZE();
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm tracking-widest uppercase font-semibold text-center mb-3">
              IDEATE. COMMIT. SUCCEED.
            </p>

            {user && !successData && (
              <div className="w-full flex items-center justify-end gap-4 pt-1">
                <button
                  type="button"
                  onClick={handleClearDraft}
                  className="text-[10px] sm:text-xs text-red-400/70 hover:text-red-400 uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear Form
                </button>
                <span className="text-[10px] sm:text-xs font-mono text-purple-300/60 uppercase tracking-widest">
                  Draft Saved
                </span>
              </div>
            )}
          </div>

          <div className="relative z-10">
            {!user ? (
              /* ── 1. Unauthenticated Google Login Gate (Matching JWT/Membership) ── */
              <div className="w-full py-12 flex flex-col items-center text-center animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-5 text-pink-400 shadow-[0_0_24px_rgba(244,114,182,0.25)]">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Ready to Build Something Extraordinary?
                </h2>
                <p className="text-gray-300 mb-8 max-w-md text-sm sm:text-base leading-relaxed">
                  Sign in with your personal Google account to start your Build with Us application.
                </p>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center gap-3 w-full sm:w-[320px] py-4 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all duration-300 backdrop-blur-md shadow-lg hover:shadow-[0_0_25px_rgba(244,114,182,0.3)] cursor-pointer active:scale-[0.98]"
                >
                  <svg className="w-5 h-5 bg-white rounded-full p-0.5 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                  </svg>
                  <span>Sign In with Google</span>
                </button>
              </div>
            ) : successData ? (
              /* ── 2. Success State ── */
              <div className="w-full py-10 flex flex-col items-center text-center animate-in fade-in">
                <CheckCircle2 className="w-20 h-20 text-emerald-400 mb-6 drop-shadow-[0_0_20px_rgba(52,211,153,0.4)]" />
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                  APPLICATION SUBMITTED!
                </h2>
                <p className="text-gray-400 mb-8 text-sm sm:text-base max-w-lg leading-relaxed">
                  Thanks, <span className="text-white font-semibold">{successData.fullName}</span>. Your project application has been received and saved.
                </p>

                <div className="w-full max-w-md bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-left space-y-3.5 mb-8">
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-white/[0.06]">
                    <span className="text-gray-400 uppercase tracking-wider font-semibold">Application Reference</span>
                    <span className="font-mono text-cyan-300 font-bold">{successData.applicationId}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-white/[0.06]">
                    <span className="text-gray-400 uppercase tracking-wider font-semibold">Role</span>
                    <span className="text-pink-300 font-semibold">{successData.role}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-white/[0.06]">
                    <span className="text-gray-400 uppercase tracking-wider font-semibold">Preference 1</span>
                    <span className="text-white font-semibold">{successData.preference1}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 uppercase tracking-wider font-semibold">Preference 2</span>
                    <span className="text-white font-semibold">{successData.preference2}</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            ) : (
              /* ── 3. Active Build with Us Form ── */
              <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in">
                {/* Auto-filled status indicator }
                {autoFilled && (
                  <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-between text-xs text-cyan-300 font-mono">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span> </span>
                    </div>
                  </div>
                )}*/}

                {/* Error Banner */}
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* ── Section A: Personal Information ── */}
                <div className="p-6 border border-white/[0.08] bg-white/[0.015] rounded-2xl space-y-5">
                  <div className="flex items-center gap-2 text-pink-400 text-xs font-black uppercase tracking-widest">
                    <Code2 className="w-4 h-4" /> Personal Information
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className={labelStyle}>Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                        className={inputStyle}
                      />
                    </div>

                    {/* Registration Number */}
                    <div>
                      <label className={labelStyle}>Registration Number *</label>
                      <input
                        type="text"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        placeholder="Enter your registration number"
                        required
                        className={inputStyle}
                      />
                    </div>

                    {/* Outlook Email */}
                    <div>
                      <label className={labelStyle}>Outlook Email ID *</label>
                      <input
                        type="email"
                        name="outlookEmail"
                        value={formData.outlookEmail}
                        onChange={handleChange}
                        placeholder="Enter your Outlook email ID"
                        required
                        className={inputStyle}
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className={labelStyle}>Phone Number *</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        required
                        className={inputStyle}
                      />
                    </div>
                  </div>
                </div>

                {/* ── Section B: Role & Project Preferences ── */}
                 <div className="p-6 border border-purple-500/30 bg-purple-500/[0.03] rounded-2xl space-y-6">
                  <div className="flex items-center gap-2 text-purple-400 text-xs font-black uppercase tracking-widest">
                    <Layers className="w-4 h-4" /> Role & Project Preferences
                  </div> 

                  {/* Role Dropdown */}
                  <div>
                    <label className={labelStyle}>Role *</label>
                    <div className="relative">
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        className={`${inputStyle} appearance-none pr-10 cursor-pointer`}
                      >
                        <option value="" disabled className="bg-[#0b0814] text-gray-400">
                          Select your role
                        </option>
                        {ROLE_OPTIONS.map((grp) => (
                          <optgroup key={grp.group} label={grp.group} className="bg-[#0b0814] text-purple-300 font-semibold">
                            {grp.roles.map((r) => (
                              <option key={r} value={r} className="bg-[#0b0814] text-white font-normal">
                                {r}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Project Preferences Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Project Preference 1 */}
                    <div>
                      <label className={labelStyle}>Project Preference 1 *</label>
                      <div className="relative">
                        <select
                          name="projectPreference1"
                          value={formData.projectPreference1}
                          onChange={handleChange}
                          required
                          className={`${inputStyle} appearance-none pr-10 cursor-pointer`}
                        >
                          <option value="" disabled className="bg-[#0b0814] text-gray-400">
                            Select Preference 1
                          </option>
                          {PROJECT_OPTIONS.map((proj) => (
                            <option
                              key={proj.id}
                              value={proj.name}
                              disabled={formData.projectPreference2 === proj.name}
                              className="bg-[#0b0814] text-white disabled:text-gray-600"
                            >
                              {proj.name} {formData.projectPreference2 === proj.name ? '(Selected in Pref 2)' : ''}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Project Preference 2 */}
                    <div>
                      <label className={labelStyle}>Project Preference 2 *</label>
                      <div className="relative">
                        <select
                          name="projectPreference2"
                          value={formData.projectPreference2}
                          onChange={handleChange}
                          required
                          className={`${inputStyle} appearance-none pr-10 cursor-pointer`}
                        >
                          <option value="" disabled className="bg-[#0b0814] text-gray-400">
                            Select Preference 2
                          </option>
                          {PROJECT_OPTIONS.map((proj) => (
                            <option
                              key={proj.id}
                              value={proj.name}
                              disabled={formData.projectPreference1 === proj.name}
                              className="bg-[#0b0814] text-white disabled:text-gray-600"
                            >
                              {proj.name} {formData.projectPreference1 === proj.name ? '(Selected in Pref 1)' : ''}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-400 font-mono">
                    Note: A project chosen in Preference 1 cannot be selected again in Preference 2.
                  </p>
                </div>

                {/* ── Section C: Technical Profile & Project Motivation ── */}
                <div className="p-6 border border-white/[0.08] bg-white/[0.015] rounded-2xl space-y-6">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-widest">
                    <Cpu className="w-4 h-4" /> Technical Profile 
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <label className={labelStyle}>Tech Stack *</label>
                    <textarea
                      name="techStack"
                      rows={3}
                      value={formData.techStack}
                      onChange={handleChange}
                      placeholder="Enter your tech stack, programming languages, and tools you work with"
                      required
                      className={`${inputStyle} resize-y min-h-[90px]`}
                    />
                  </div>

                  {/* GitHub Link */}
                  <div>
                    <label className={labelStyle}>GitHub Profile / Link *</label>
                    <textarea
                      name="githubLink"
                      rows={2}
                      value={formData.githubLink}
                      onChange={handleChange}
                      placeholder="Enter your GitHub profile link or relevant repositories"
                      required
                      className={`${inputStyle} resize-y min-h-[60px]`}
                    />
                  </div>

                  {/* Paragraph Question: Why do you want to work on this project? */}
                  <div>
                    <label className={labelStyle}>Why do you want to work on this project? *</label>
                    <textarea
                      name="projectReason"
                      rows={5}
                      value={formData.projectReason}
                      onChange={handleChange}
                      placeholder="Enter your response explaining your interest, past experience, or what you want to achieve"
                      required
                      className={`${inputStyle} resize-y min-h-[120px]`}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                    className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:via-purple-500 hover:to-indigo-500 border border-pink-400/40 shadow-[0_0_25px_rgba(236,72,153,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[50px]"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
