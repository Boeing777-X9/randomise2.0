'use client';

import { useEffect, useState, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import events from "@/data/EventsData";

/* ──────────────────────────────────────────────
   Helpers
────────────────────────────────────────────── */
const YEARS = (() => {
  const ySet = new Set();
  events.forEach(e => {
    const m = e.date.match(/20\d{2}/);
    if (m) ySet.add(m[0]);
  });
  return ['All', ...Array.from(ySet).sort((a, b) => b - a)];
})();

/* ──────────────────────────────────────────────
   Event Card
────────────────────────────────────────────── */
const EventCard = ({ event, index, onSelect }) => (
  <motion.article
    className="group relative cursor-pointer"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: (index % 9) * 0.04 }}
    viewport={{ once: true, margin: "-40px" }}
    onClick={() => onSelect(event)}
    layout
  >
    <div className="relative h-[420px] md:h-[480px] rounded-[1.5rem] overflow-hidden border border-white/[0.06] bg-gray-950">
      {/* Image */}
      <img
        src={event.image}
        alt={event.title}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Date pill — top right */}
      <div className="absolute top-4 right-4 px-3 py-1 text-[10px] font-bold tracking-[0.15em] uppercase text-white/70 bg-black/50 backdrop-blur-md border border-white/10 rounded-full">
        {event.date}
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-7">
        <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
          {event.title}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 font-light">
          {event.description}
        </p>

        {/* Arrow CTA */}
        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-purple-400 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
          <span>Read more</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>

      {/* Hover glow edge */}
      <div
        className="absolute inset-0 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(168,85,247,0.5), transparent 40%, transparent 60%, rgba(236,72,153,0.5))',
          padding: '1px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'exclude',
        }}
      />
    </div>
  </motion.article>
);

/* ──────────────────────────────────────────────
   Detail Modal
────────────────────────────────────────────── */
const EventModal = ({ event, onClose }) => {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-lg" onClick={onClose} />

      {/* Modal panel — horizontal on md+ */}
      <motion.div
        className="relative w-full max-w-5xl mx-4 max-h-[92vh] rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden bg-[#0c0812] border border-white/[0.08] shadow-[0_0_80px_rgba(168,85,247,0.12)] flex flex-col md:flex-row"
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.97 }}
        transition={{ type: "spring", damping: 35, stiffness: 350 }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 group"
          aria-label="Close"
        >
          <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image — left side on desktop, top on mobile */}
        <div className="relative w-full md:w-[45%] h-56 sm:h-64 md:h-auto md:min-h-[450px] flex-shrink-0 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0812] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#0c0812]" />
        </div>

        {/* Content — right side */}
        <div className="w-full md:w-[55%] p-7 sm:p-9 md:p-10 flex flex-col overflow-y-auto max-h-[60vh] md:max-h-[92vh] events-modal-scroll">
          <div className="flex-1">
            <div className="inline-block mb-5 px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full">
              <span className="text-purple-300 text-sm font-medium">{event.date}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              {event.title}
            </h2>

            <p className="text-gray-300 text-base sm:text-lg leading-[1.8] font-light">
              {event.description}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.06]">
            <button
              onClick={onClose}
              className="w-full py-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]"
            >
              Back to Events
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ──────────────────────────────────────────────
   Main Page
────────────────────────────────────────────── */
export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [yearFilter, setYearFilter] = useState('All');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Lock scroll on modal
  useEffect(() => {
    if (selectedEvent) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedEvent]);

  const closeModal = useCallback(() => setSelectedEvent(null), []);

  const filtered = useMemo(() => {
    if (yearFilter === 'All') return events;
    return events.filter(e => e.date.includes(yearFilter));
  }, [yearFilter]);

  return (
    <div className="min-h-screen bg-transparent text-white overflow-x-hidden">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-purple-600/[0.06] rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-600/[0.04] rounded-full blur-[140px]" />
      </div>

      {/* ─── Hero ─── */}
      <div className="relative z-10 pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-purple-500 to-transparent" />
              <span className="text-[11px] font-bold tracking-[0.3em] text-purple-400 uppercase">
                Godspeed Randomize
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.85] whitespace-nowrap">
                <span className="text-white">ALL </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-500">
                  EVENTS
                </span>
              </h1>

              <p className="text-lg text-gray-500 font-light leading-relaxed">
                Every workshop, hackathon, and meetup that shaped our <span className="text-purple-400 font-medium">2023–2025</span> journey.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── Year Filter ─── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {YEARS.map((yr) => (
            <button
              key={yr}
              onClick={() => setYearFilter(yr)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-300 ${
                yearFilter === yr
                  ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                  : 'bg-white/[0.03] text-gray-400 border-white/[0.08] hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              {yr}
            </button>
          ))}
          <span className="ml-auto self-center text-sm text-gray-600">{filtered.length} events</span>
        </motion.div>
      </div>

      {/* ─── Featured Event (first one) ─── */}
      {filtered.length > 0 && (
        <div className="relative z-10 max-w-7xl mx-auto px-6 mb-12">
          <motion.div
            className="group relative h-[500px] md:h-[550px] rounded-[2rem] overflow-hidden border border-white/[0.06] cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => setSelectedEvent(filtered[0])}
          >
            <img
              src={filtered[0].image}
              alt={filtered[0].title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 text-[10px] font-bold tracking-[0.15em] uppercase text-purple-300 bg-white/10 backdrop-blur-md border border-white/10 rounded-full">
                  Featured
                </span>
                <span className="text-sm text-gray-400">{filtered[0].date}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                {filtered[0].title}
              </h2>
              <p className="text-gray-300 text-lg font-light leading-relaxed line-clamp-3">
                {filtered[0].description}
              </p>
            </div>

            {/* Hover glow */}
            <div
              className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(168,85,247,0.4), transparent 30%, transparent 70%, rgba(236,72,153,0.4))',
                padding: '1px',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'exclude',
              }}
            />
          </motion.div>
        </div>
      )}

      {/* ─── Events Grid ─── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.slice(1).map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
              onSelect={setSelectedEvent}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No events found for this year.</p>
          </div>
        )}
      </div>

      {/* ─── Modal ─── */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedEvent && (
            <EventModal event={selectedEvent} onClose={closeModal} />
          )}
        </AnimatePresence>,
        document.body
      )}

      <style jsx global>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .events-modal-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .events-modal-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .events-modal-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.08);
          border-radius: 8px;
        }
        .events-modal-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.15);
        }
      `}</style>
    </div>
  );
}
