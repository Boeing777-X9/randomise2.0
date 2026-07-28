'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-black p-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full p-8 rounded-3xl bg-white/4 border border-white/6 backdrop-blur shadow-2xl"
      >
        <h1 className="text-2xl font-semibold text-white mb-2">Member Sign in</h1>
        <p className="text-sm text-white/70 mb-6">Only sign in via Google. Members will be checked against the Randomize members table.</p>

        <div className="flex flex-col gap-3">
          <a
            href="/api/auth/google"
            className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/12 text-white"
          >
            <img src="/icons/google.svg" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </a>

          <p className="text-xs text-white/60">After signing in with Google, membership will be verified and you'll be redirected to your profile.</p>
        </div>
      </motion.div>
    </div>
  );
}
