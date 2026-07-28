'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

type Props = {
  fullName: string;
  memberId: string;
  position?: string | null;
  domain?: string | null;
  profileImage?: string | null;
  joinedYear?: string | null;
};

export default function ProfileHeader({ fullName, memberId, position, domain, profileImage, joinedYear }: Props) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex flex-col items-center gap-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 12 }}
        className="relative rounded-full overflow-hidden w-40 h-40 md:w-48 md:h-48 shadow-lg bg-white/5 ring-1 ring-white/10 backdrop-blur"
      >
        <Image
          src={profileImage || 'https://placehold.co/400x400'}
          alt={fullName}
          fill
          sizes="(max-width: 768px) 10rem, 12rem"
          className="object-cover"
        />
      </motion.div>

      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-semibold text-white/95">{fullName}</h1>
        <p className="mt-1 text-sm text-white/70">{memberId}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 rounded-full bg-white/6 text-xs text-white/90">Randomize Member</span>
          {position && <span className="px-3 py-1 rounded-full bg-white/6 text-xs text-white/90">{position}</span>}
          {domain && <span className="px-3 py-1 rounded-full bg-white/6 text-xs text-white/90">{domain}</span>}
          {joinedYear && <span className="px-3 py-1 rounded-full bg-white/6 text-xs text-white/90">Joined {joinedYear}</span>}
        </div>

        <div className="mt-4 flex gap-3 justify-center">
          <button className="px-4 py-2 rounded-md bg-white/8 hover:bg-white/12 text-white/95 backdrop-blur-sm">Edit Profile</button>
          <button className="px-4 py-2 rounded-md bg-white/6 hover:bg-white/12 text-white/95 backdrop-blur-sm">Download Member Card</button>
        </div>
      </div>
    </motion.header>
  );
}
