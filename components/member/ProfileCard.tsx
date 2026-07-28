'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { Member } from '../../lib/supabaseServer';

type Props = {
  member: Member;
};

export default function ProfileCard({ member }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full md:w-1/2 p-6 rounded-2xl bg-gradient-to-br from-white/3 to-white/5 backdrop-blur shadow-lg border border-white/6"
    >
      <h2 className="text-lg font-semibold text-white/95 mb-4">Profile Information</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-white/80">
        <div>
          <dt className="text-xs text-white/60">Full Name</dt>
          <dd className="mt-1">{member.full_name}</dd>
        </div>
        <div>
          <dt className="text-xs text-white/60">Member ID</dt>
          <dd className="mt-1">{member.member_id}</dd>
        </div>
        <div>
          <dt className="text-xs text-white/60">Personal Gmail</dt>
          <dd className="mt-1">{member.personal_gmail || '—'}</dd>
        </div>
        <div>
          <dt className="text-xs text-white/60">MUJ Outlook Email</dt>
          <dd className="mt-1">{member.muj_email || '—'}</dd>
        </div>
        <div>
          <dt className="text-xs text-white/60">Phone Number</dt>
          <dd className="mt-1">{member.phone || '—'}</dd>
        </div>
        <div>
          <dt className="text-xs text-white/60">Course</dt>
          <dd className="mt-1">{member.course || '—'}</dd>
        </div>
        <div>
          <dt className="text-xs text-white/60">Specialization / Major</dt>
          <dd className="mt-1">{member.specialization || '—'}</dd>
        </div>
        <div>
          <dt className="text-xs text-white/60">Graduation Year</dt>
          <dd className="mt-1">{member.graduation_year || '—'}</dd>
        </div>
        <div>
          <dt className="text-xs text-white/60">Date of Birth</dt>
          <dd className="mt-1">{member.dob || '—'}</dd>
        </div>
        <div>
          <dt className="text-xs text-white/60">Current Position</dt>
          <dd className="mt-1">{member.current_position || '—'}</dd>
        </div>
        <div>
          <dt className="text-xs text-white/60">Current Domain</dt>
          <dd className="mt-1">{member.current_domain || '—'}</dd>
        </div>
        <div>
          <dt className="text-xs text-white/60">Member Since</dt>
          <dd className="mt-1">{member.member_since ? new Date(member.member_since).toLocaleDateString() : '—'}</dd>
        </div>
      </dl>
    </motion.section>
  );
}
