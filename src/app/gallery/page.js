'use client';

import { useEffect, useState, useCallback } from 'react';
import NextImage from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';

const LOCAL_PHOTOS = [
  // Web-Development Workshop
  { src: 'https://res.cloudinary.com/dpasrciqd/image/upload/v1785660869/IMG_0993_r1gdkq.jpg', event_name: 'Web-Development Workshop', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/dpasrciqd/image/upload/v1785660863/IMG_0972_efuenv.jpg', event_name: 'Web-Development Workshop', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/dpasrciqd/image/upload/v1785660857/IMG_0966_sw9yna.jpg', event_name: 'Web-Development Workshop', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/dpasrciqd/image/upload/v1785660848/IMG_0945_r7hwja.jpg', event_name: 'Web-Development Workshop', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/dpasrciqd/image/upload/v1785660726/IMG_0917_fi6qsc.jpg', event_name: 'Web-Development Workshop', width: 800, height: 600 },

  // Hello World
  { src: 'https://res.cloudinary.com/dpasrciqd/image/upload/v1785661076/IMG20250825152531_1_pdbjyg.jpg', event_name: 'Hello World', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/dpasrciqd/image/upload/v1785661064/IMG20250825150634_1_wjrwfd.jpg', event_name: 'Hello World', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/dpasrciqd/image/upload/v1785661051/IMG20250825171803_1_lnn0a9.jpg', event_name: 'Hello World', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/dpasrciqd/image/upload/v1785661042/IMG20250825162447_1_rrqjhv.jpg', event_name: 'Hello World', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/dpasrciqd/image/upload/v1785661026/IMG20250825152550_dy0bvi.jpg', event_name: 'Hello World', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/dpasrciqd/image/upload/v1785661016/IMG20250825174330_1_el9ndm.jpg', event_name: 'Hello World', width: 800, height: 600 },

  // Freshmen Meetup
  { src: 'https://res.cloudinary.com/dpasrciqd/image/upload/v1785660944/IMG_4144_aav8fk.heic', event_name: 'Freshmen Meetup', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/dpasrciqd/image/upload/v1785660939/IMG_4132_wqfgwq.heic', event_name: 'Freshmen Meetup', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/dpasrciqd/image/upload/v1785660935/IMG_4129_iz9eoz.heic', event_name: 'Freshmen Meetup', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/dpasrciqd/image/upload/v1785660928/IMG_3341_pyto84.heic', event_name: 'Freshmen Meetup', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/dpasrciqd/image/upload/v1785660932/IMG_3351_yjdsff.heic', event_name: 'Freshmen Meetup', width: 800, height: 600 },

  // Cloud Computing Workshop
  { src: 'https://res.cloudinary.com/dpasrciqd/image/upload/v1785661968/IMG_1215_rctflr.jpg', event_name: 'Cloud Computing Workshop', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/dpasrciqd/image/upload/v1785661867/IMG_1224_onbruz.jpg', event_name: 'Cloud Computing Workshop', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/dpasrciqd/image/upload/v1785661194/IMG_1180_igjkjk.jpg', event_name: 'Cloud Computing Workshop', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/dpasrciqd/image/upload/v1785661146/IMG_1189_hr5kqs.jpg', event_name: 'Cloud Computing Workshop', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/dpasrciqd/image/upload/v1785661135/IMG_1175_dzrvlw.jpg', event_name: 'Cloud Computing Workshop', width: 800, height: 600 }
];

function optimizeCloudinaryUrl(url) {
  if (!url.includes('/upload/')) return url;
  if (/\/upload\/[^/]*w_\d+/.test(url)) return url;
  return url.replace('/upload/', '/upload/w_800,h_600,c_fill,q_auto,f_auto/');
}

function Photo({ src, alt, width, height, index, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden rounded-2xl cursor-pointer group w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] bg-[#0c0812]/40 border border-white/5 shadow-md"
      style={{ aspectRatio: `${width} / ${height}` }}
      onClick={onClick}
    >
      <NextImage
        src={src}
        alt={alt || 'Gallery photo'}
        width={width}
        height={height}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        priority={index < 3}
        loading={index < 3 ? 'eager' : 'lazy'}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <p className="text-white text-xs font-medium truncate w-full">{alt || 'View photo'}</p>
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  const [photos, setPhotos] = useState(() => LOCAL_PHOTOS.map(p => ({ ...p, src: optimizeCloudinaryUrl(p.src) })));
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const fetchUploaded = useCallback(async () => {
    const { data, error } = await supabase
      .from('gallery')
      .select('image_url, caption, sort_order, event_name')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Failed to load gallery:', error);
      return;
    }

    const uploaded = (data ?? []).map(img => ({
      src: optimizeCloudinaryUrl(img.image_url),
      alt: img.caption || 'Gallery photo',
      event_name: img.event_name || 'General',
      width: 800,
      height: 600,
    }));

    const local = LOCAL_PHOTOS.map(p => ({ ...p, src: optimizeCloudinaryUrl(p.src) }));
    setPhotos([...uploaded, ...local]);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUploaded();
  }, [fetchUploaded]);

  // Extract unique categories dynamically, maintaining priority order
  const baseCategories = [
    'Web-Development Workshop',
    'Hello World',
    'Freshmen Meetup',
    'Cloud Computing Workshop'
  ];

  const uniqueCategories = ['All', ...baseCategories];
  photos.forEach(p => {
    const cat = p.event_name || 'General';
    if (!uniqueCategories.includes(cat)) {
      uniqueCategories.push(cat);
    }
  });

  const filteredPhotos = selectedCategory === 'All'
    ? photos
    : photos.filter(p => p.event_name === selectedCategory);

  const openLightbox = (photo, list) => {
    const index = list.findIndex(p => p.src === photo.src);
    if (index !== -1) {
      setLightboxIndex(index);
    }
  };

  const closeLightbox = () => setLightboxIndex(null);

  const showNext = () => {
    const list = selectedCategory === 'All' ? photos : filteredPhotos;
    setLightboxIndex((prev) => (prev + 1) % list.length);
  };

  const showPrev = () => {
    const list = selectedCategory === 'All' ? photos : filteredPhotos;
    setLightboxIndex((prev) => (prev - 1 + list.length) % list.length);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') showNext();
      else if (e.key === 'ArrowLeft') showPrev();
      else if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, selectedCategory, photos, filteredPhotos]);

  const activeList = selectedCategory === 'All' ? photos : filteredPhotos;

  return (
    <div className="min-h-screen bg-transparent py-20">
      <div className="mx-4 sm:mx-9 md:mx-28 p-3 mb-24 my-28">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl text-center font-bold pb-4 mb-8 text-slate-300 tracking-[0.12em] drop-shadow-[0_0_12px_rgba(56,189,248,0.15)]"
        >
          Gallery
        </motion.h1>

        {/* Tab Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 max-w-4xl mx-auto">
          {uniqueCategories.map(cat => {
            // Count photos in this category
            const count = cat === 'All' ? photos.length : photos.filter(p => p.event_name === cat).length;
            if (count === 0 && cat !== 'All') return null;

            return (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-lg text-xs md:text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === cat
                    ? 'bg-transparent border border-sky-200/70 text-sky-100 shadow-[0_0_14px_rgba(186,230,253,0.3)]'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:text-sky-200 hover:border-sky-300/40 hover:bg-white/5'
                }`}
              >
                {cat}
                <span className={`text-[10px] px-2 py-0.5 rounded-md ${
                  selectedCategory === cat ? 'bg-sky-200/15 text-sky-200' : 'bg-white/10 text-gray-500'
                }`}>
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No photos yet.</div>
        ) : (
          <div>
            {selectedCategory === 'All' ? (
              // Grouped by Event Name
              uniqueCategories.filter(cat => cat !== 'All').map(cat => {
                const catPhotos = photos.filter(p => p.event_name === cat);
                if (catPhotos.length === 0) return null;

                return (
                  <div key={cat} className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                      <h2 className="text-xl md:text-2xl font-semibold italic text-slate-300 tracking-wide drop-shadow-[0_0_10px_rgba(56,189,248,0.12)]">
                        {cat}
                      </h2>
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-sky-300/25 to-transparent" />
                    </div>
                    <div className="flex flex-wrap justify-start gap-4">
                      {catPhotos.map((photo, idx) => (
                        <Photo
                          key={photo.src + idx}
                          src={photo.src}
                          alt={photo.alt}
                          width={photo.width}
                          height={photo.height}
                          index={idx}
                          onClick={() => openLightbox(photo, photos)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              // Selected category only
              <div className="flex flex-wrap justify-start gap-4">
                {filteredPhotos.map((photo, index) => (
                  <Photo
                    key={photo.src + index}
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    index={index}
                    onClick={() => openLightbox(photo, filteredPhotos)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/10 hover:text-red-400 z-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Prev Arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); showPrev(); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/10 z-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Lightbox Image Container */}
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[80vh] flex flex-col items-center gap-4"
            >
              <div className="relative w-full h-[70vh] flex items-center justify-center">
                <img
                  src={activeList[lightboxIndex].src}
                  alt={activeList[lightboxIndex].alt}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-white/10"
                />
              </div>

              {/* Info panel */}
              <div className="text-center bg-white/5 border border-white/10 backdrop-blur-md py-3 px-6 rounded-full max-w-md w-full">
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                  {activeList[lightboxIndex].event_name || 'General'}
                </span>
                <p className="text-white text-sm mt-2 font-medium">
                  {activeList[lightboxIndex].alt !== 'Gallery photo' ? activeList[lightboxIndex].alt : 'Randomize Club Event'}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {lightboxIndex + 1} of {activeList.length}
                </p>
              </div>
            </motion.div>

            {/* Next Arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); showNext(); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/10 z-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}