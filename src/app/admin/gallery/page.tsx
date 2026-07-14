'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import GlassmorphismCard from '@/components/GlassmorphismCard';
import Floating, { FloatingElement } from '@/fancy/components/image/parallax-floating';
import { supabase } from '@/lib/supabase/client';

type GalleryImage = {
  id: string;
  image_url: string;
  cloudinary_public_id: string;
  caption: string;
  is_visible: boolean;
  sort_order: number;
};

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [captionValue, setCaptionValue] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAuthAndLoad() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/admin'); return; }

      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session exists:', !!session);
      console.log('Access token present:', !!session?.access_token);
      if (session?.access_token) {
        try {
          const payload = JSON.parse(atob(session.access_token.split('.')[1]));
          console.log('Token role:', payload.role);
          console.log('Token exp (unix):', payload.exp, '| now:', Math.floor(Date.now() / 1000));
        } catch (e) {
          console.error('Could not decode token payload:', e);
        }
      }

      const { data: admin } = await supabase
        .from('admins')
        .select('permissions')
        .eq('email', user.email);

      if (!admin || admin.length === 0) { router.push('/admin'); return; }

      const permissions: string[] = admin[0].permissions || [];
      if (!permissions.includes('gallery')) { router.push('/admin'); return; }

      setAuthorized(true);
      fetchImages();
    }
    checkAuthAndLoad();
  }, [router]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function fetchImages() {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) {
      console.error('Supabase fetch error:', error);
      showToast(`Failed to load gallery: ${error.message}`);
    }
    setImages(data ?? []);
    setLoading(false);
  }

  async function handleUploadSuccess(result: any) {
    const info = result.info;

    const minSortOrder = images.length > 0 ? Math.min(...images.map(img => img.sort_order)) : 0;
    const newSortOrder = minSortOrder - 1;

    const { data, error } = await supabase.from('gallery').insert([{
      image_url: info.secure_url,
      cloudinary_public_id: info.public_id,
      caption: '',
      is_visible: true,
      sort_order: newSortOrder,
    }]).select();

    if (error) {
      console.error('Supabase insert error:', error);
      showToast(`Upload failed: ${error.message}`);
      return;
    }

    console.log('Inserted row:', data);
    await fetchImages();
    showToast('Photo uploaded!');
  }

  async function toggleVisibility(id: string, current: boolean) {
    const { error } = await supabase.from('gallery').update({ is_visible: !current }).eq('id', id);
    if (error) {
      console.error('Supabase update error message:', error.message);
      console.error('Supabase update error code:', error.code);
      console.error('Supabase update error details:', error.details);
      console.error('Supabase update error hint:', error.hint);
      showToast(`Failed to update: ${error.message || 'unknown error'}`);
      return;
    }
    setImages(prev => prev.map(img => img.id === id ? { ...img, is_visible: !current } : img));
    showToast(current ? 'Photo hidden from gallery' : 'Photo now visible in gallery');
  }

  async function handleDelete(id: string, publicId: string) {
    setDeleting(id);
    try {
      const res = await fetch('/api/cloudinary/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId }),
      });
      if (!res.ok) {
        console.error('Cloudinary delete failed:', await res.text());
      }

      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) {
        console.error('Supabase delete error:', error);
        showToast(`Failed to delete: ${error.message}`);
        return;
      }

      setImages(prev => prev.filter(img => img.id !== id));
      showToast('Photo deleted');
    } finally {
      setDeleting(null);
    }
  }

  async function saveCaption(id: string) {
    const { error } = await supabase.from('gallery').update({ caption: captionValue }).eq('id', id);
    if (error) {
      console.error('Supabase caption update error:', error);
      showToast(`Failed to save caption: ${error.message}`);
      return;
    }
    setImages(prev => prev.map(img => img.id === id ? { ...img, caption: captionValue } : img));
    setEditingId(null);
    showToast('Caption saved');
  }

  async function moveImage(id: string, direction: 'up' | 'down') {
    const index = images.findIndex(img => img.id === id);
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= images.length) return;

    const updated = [...images];
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
    const reordered = updated.map((img, i) => ({ ...img, sort_order: i }));
    setImages(reordered);

    await Promise.all(
      reordered.map(img =>
        supabase.from('gallery').update({ sort_order: img.sort_order }).eq('id', img.id)
      )
    );
  }

  if (!authorized) return null;

  return (
    <div className="relative isolate overflow-hidden bg-transparent min-h-lvh">
      <Floating className="w-full h-full" sensitivity={3} easingFactor={0.15}>
        <FloatingElement
          depth={1.2}
          className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-24 w-full"
          absolute={false}
        >
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-white/10 border border-purple-500/30 text-white text-sm backdrop-blur-xl"
              >
                {toast}
              </motion.div>
            )}
          </AnimatePresence>

          <GlassmorphismCard className="w-full p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                  Gallery Manager
                </h1>
                <p className="text-gray-400 text-sm mt-1">{images.length} photos · hover to manage</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push('/admin')}
                  className="px-4 py-2 rounded-lg text-sm text-gray-400 border border-white/10 hover:text-white hover:border-white/20 transition-all"
                >
                  ← Back
                </button>

                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  onSuccess={handleUploadSuccess}
                  options={{ multiple: true, resourceType: 'image' }}
                >
                  {({ open }) => (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => open()}
                      className="px-5 py-2 rounded-lg font-semibold text-white text-sm bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300"
                    >
                      + Upload Photos
                    </motion.button>
                  )}
                </CldUploadWidget>
              </div>
            </div>

            <div className="flex items-start gap-3 px-4 py-3 mb-6 rounded-xl border border-red-500/40 bg-red-500/10">
              <span className="text-red-400 text-lg leading-none mt-0.5">⚠</span>
              <p className="text-red-400 text-sm">
                <span className="font-semibold">Known bug:</span> The Hide/Show button is currently not working. Images toggled as hidden will still appear on the public gallery. Fix in progress.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                No photos yet. Click "+ Upload Photos" to get started.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <motion.div
                    key={img.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`relative group rounded-xl overflow-hidden border transition-all ${
                      img.is_visible ? 'border-white/10' : 'border-red-500/20 opacity-50'
                    }`}
                  >
                    <div className="aspect-square relative">
                      <img
                        src={img.image_url}
                        alt={img.caption || 'Gallery photo'}
                        className="w-full h-full object-cover"
                      />

                      {!img.is_visible && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-xs text-red-400 font-medium">Hidden</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                        <button
                          onClick={() => toggleVisibility(img.id, img.is_visible)}
                          className={`w-full text-xs py-1.5 rounded-lg border font-medium transition-all ${
                            img.is_visible
                              ? 'border-red-500/40 text-red-400 hover:bg-red-500/10'
                              : 'border-green-500/40 text-green-400 hover:bg-green-500/10'
                          }`}
                        >
                          {img.is_visible ? 'Hide' : 'Show'}
                        </button>

                        <button
                          onClick={() => { setEditingId(img.id); setCaptionValue(img.caption ?? ''); }}
                          className="w-full text-xs py-1.5 rounded-lg border border-white/20 text-gray-300 hover:border-purple-500/40 hover:text-white transition-all"
                        >
                          Edit Caption
                        </button>

                        <div className="flex gap-1.5 w-full">
                          <button
                            onClick={() => moveImage(img.id, 'up')}
                            disabled={index === 0}
                            className="flex-1 text-xs py-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition-all"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveImage(img.id, 'down')}
                            disabled={index === images.length - 1}
                            className="flex-1 text-xs py-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition-all"
                          >
                            ↓
                          </button>
                        </div>

                        <button
                          onClick={() => handleDelete(img.id, img.cloudinary_public_id)}
                          disabled={deleting === img.id}
                          className="w-full text-xs py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-50 transition-all"
                        >
                          {deleting === img.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>

                    {img.caption && (
                      <div className="px-3 py-2 bg-white/[0.03] border-t border-white/[0.05]">
                        <p className="text-xs text-gray-400 truncate">{img.caption}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </GlassmorphismCard>
        </FloatingElement>
      </Floating>

      <AnimatePresence>
        {editingId && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditingId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm"
            >
              <GlassmorphismCard className="p-6 space-y-4">
                <h3 className="text-white font-semibold">Edit Caption</h3>
                <input
                  value={captionValue}
                  onChange={e => setCaptionValue(e.target.value)}
                  placeholder="Add a caption..."
                  autoFocus
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => saveCaption(editingId)}
                    className="flex-1 py-2.5 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300"
                  >
                    Save
                  </motion.button>
                </div>
              </GlassmorphismCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}