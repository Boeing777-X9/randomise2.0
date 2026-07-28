'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { TimelineEntry } from '../../lib/supabaseServer';

type Props = { item: TimelineEntry };

export default function TimelineItem({ item }: Props) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="relative pl-6 pb-8"
    >
      <span className="absolute left-0 top-1 w-3 h-3 rounded-full bg-white/90 ring-4 ring-white/10" />
      <div className="text-xs text-white/60 mb-1">{item.month} {item.year}</div>
      <h3 className="text-white/95 font-medium">{item.title}</h3>
      {item.position && <div className="text-sm text-white/80 mt-1">Position: {item.position}</div>}
      {item.domain && <div className="text-sm text-white/80">Domain: {item.domain}</div>}
      {item.description && <p className="mt-2 text-sm text-white/70">{item.description}</p>}
    </motion.li>
  );
}
