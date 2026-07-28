'use client';

import React from 'react';
import TimelineItem from './TimelineItem';
import { TimelineEntry } from '../../lib/supabaseServer';

type Props = {
  items: TimelineEntry[];
};

export default function Timeline({ items }: Props) {
  if (!items || items.length === 0) {
    return <div className="text-white/70">No timeline entries yet.</div>;
  }

  // items expected chronological; if not, ensure sort by year/month
  return (
    <section className="w-full md:w-1/2 p-6 rounded-2xl bg-gradient-to-br from-white/3 to-white/5 backdrop-blur shadow-lg border border-white/6">
      <h2 className="text-lg font-semibold text-white/95 mb-4">Timeline</h2>
      <ol className="relative border-l border-white/6 ml-2">
        {items.map((it) => (
          <TimelineItem key={it.id} item={it} />
        ))}
      </ol>
    </section>
  );
}
