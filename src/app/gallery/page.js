'use client';

import { useEffect, useState, useCallback } from 'react';
import NextImage from 'next/image';
import { supabase } from '@/lib/supabase/client';

const LOCAL_PHOTOS = [
  { src: 'https://res.cloudinary.com/dwh5daoyd/image/upload/v1760584988/1_v9wn9z.jpg', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/dwh5daoyd/image/upload/v1760584987/2_u3jeit.jpg', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/dwh5daoyd/image/upload/v1760584987/5_ywiy35.jpg', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737894905/Website/GalleryPhotos/4_vfbuhn.jpg', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737894911/Website/GalleryPhotos/5_d1yzj6.jpg', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737894907/Website/GalleryPhotos/6_tdeu3f.jpg', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737894910/Website/GalleryPhotos/7_rksjdx.jpg', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737894909/Website/GalleryPhotos/8_zcrqg5.jpg', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/dwh5daoyd/image/upload/v1760584987/4_vbgeoc.jpg', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737894905/Website/GalleryPhotos/10_ynwzre.jpg', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737894905/Website/GalleryPhotos/11_j0p2me.jpg', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737894907/Website/GalleryPhotos/12_thlfff.jpg', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737894908/Website/GalleryPhotos/13_gaujtx.jpg', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/randomize/image/upload/w_800,h_600,c_fit,q_auto,f_auto/v1737894910/Website/GalleryPhotos/14_d0l5b1.jpg', width: 800, height: 600 },
  { src: 'https://res.cloudinary.com/dwh5daoyd/image/upload/v1760584987/3_memvg9.jpg', width: 800, height: 600 },
];

function optimizeCloudinaryUrl(url) {
  if (!url.includes('/upload/')) return url;
  if (/\/upload\/[^/]*w_\d+/.test(url)) return url;
  return url.replace('/upload/', '/upload/w_800,h_600,c_fill,q_auto,f_auto/');
}

function Photo({ src, alt, width, height, index }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl cursor-pointer group w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <NextImage
        src={src}
        alt={alt || 'Gallery photo'}
        width={width}
        height={height}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        priority={index < 3}
        loading={index < 3 ? 'eager' : 'lazy'}
      />
    </div>
  );
}

export default function Gallery() {
  const [photos, setPhotos] = useState(() => LOCAL_PHOTOS.map(p => ({ ...p, src: optimizeCloudinaryUrl(p.src) })));

  const fetchUploaded = useCallback(async () => {
    const { data, error } = await supabase
      .from('gallery')
      .select('image_url, caption, sort_order')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Failed to load gallery:', error);
      return;
    }

    const uploaded = (data ?? []).map(img => ({
      src: optimizeCloudinaryUrl(img.image_url),
      alt: img.caption || 'Gallery photo',
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

  return (
    <div className="min-h-screen bg-transparent py-20">
      <div className="mx-4 sm:mx-9 md:mx-28 p-3 mb-24 my-28">
        <h1 className="text-4xl md:text-6xl text-center font-bold mb-6 md:mb-9 text-white">
          Gallery
        </h1>

        {photos.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No photos yet.</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {photos.map((photo, index) => (
              <Photo
                key={photo.src + index}
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}