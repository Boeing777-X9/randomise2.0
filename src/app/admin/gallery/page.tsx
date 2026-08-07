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
  event_name?: string;
};

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  
  // Edit Modal States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [captionValue, setCaptionValue] = useState('');
  const [eventValue, setEventValue] = useState('');

  const [deleting, setDeleting] = useState<string | null>(null);
  
  // Upload Event States
  const [uploadMode, setUploadMode] = useState<'existing' | 'new'>('existing');
  const [selectedUploadEvent, setSelectedUploadEvent] = useState('Web-Development Workshop');
  const [newEventName, setNewEventName] = useState('');
  // Track custom events added via "+ New Event" so dropdown updates live
  const [customEvents, setCustomEvents] = useState<string[]>([]);
  
  // Filter state
  const [filterEvent, setFilterEvent] = useState('All');
  
  const router = useRouter();

  useEffect(() => {
    async function checkAuthAndLoad() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/admin'); return; }

      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session exists:', !!session);

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

    // Get the target event name based on configuration
    const targetEvent = uploadMode === 'new' ? newEventName.trim() : selectedUploadEvent;
    const finalEventName = targetEvent || 'General';

    const { data, error } = await supabase.from('gallery').insert([{
      image_url: info.secure_url,
      cloudinary_public_id: info.public_id,
      caption: '',
      is_visible: true,
      sort_order: newSortOrder,
      event_name: finalEventName,
    }]).select();

    if (error) {
      console.error('Supabase insert error:', error);
      showToast(`Upload failed: ${error.message}`);
      return;
    }

    console.log('Inserted row:', data);
    
    // If a brand new event was created, add it to customEvents so the dropdown updates
    if (uploadMode === 'new' && finalEventName !== 'General') {
      setCustomEvents(prev => prev.includes(finalEventName) ? prev : [...prev, finalEventName]);
      setNewEventName('');
      setUploadMode('existing');
      setSelectedUploadEvent(finalEventName);
    }

    await fetchImages();
    showToast(`Uploaded to "${finalEventName}"!`);
  }

  async function toggleVisibility(id: string, current: boolean) {
    const { error } = await supabase.from('gallery').update({ is_visible: !current }).eq('id', id);
    if (error) {
      console.error('Supabase update error:', error.message);
      showToast(`Failed to update: ${error.message}`);
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

  async function saveDetails(id: string) {
    const finalEvent = eventValue.trim() || 'General';
    const { error } = await supabase.from('gallery').update({ 
      caption: captionValue,
      event_name: finalEvent
    }).eq('id', id);

    if (error) {
      console.error('Supabase details update error:', error);
      showToast(`Failed to save: ${error.message}`);
      return;
    }
    setImages(prev => prev.map(img => img.id === id ? { ...img, caption: captionValue, event_name: finalEvent } : img));
    setEditingId(null);
    showToast('Photo details saved');
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

  // Fixed base events + General + any custom events created this session
  const BASE_EVENTS = [
    'Web-Development Workshop',
    'Hello World',
    'Freshmen Meetup',
    'Cloud Computing Workshop',
    'General',
  ];

  // Also include any custom event names that have been uploaded to the DB
  // (so they persist on refresh), but only ones not in BASE_EVENTS
  const dbCustomEvents = images
    .map(img => img.event_name)
    .filter((name): name is string => !!name && !BASE_EVENTS.includes(name));

  const uniqueEventsList = Array.from(new Set([
    ...BASE_EVENTS,
    ...dbCustomEvents,
    ...customEvents,
  ]));

  const filteredImages = filterEvent === 'All'
    ? images
    : images.filter(img => (img.event_name || 'General') === filterEvent);

  return (
    <div className="relative isolate overflow-hidden bg-transparent min-h-lvh pb-20">
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/5 pb-6">
              <div>
                <h1 className="text-3xl font-bold pb-1 bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                  Gallery Manager
                </h1>
                <p className="text-gray-400 text-sm mt-1">{images.length} photos total</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push('/admin')}
                  className="px-4 py-2 rounded-lg text-sm text-gray-400 border border-white/10 hover:text-white hover:border-white/20 transition-all"
                >
                  ← Back
                </button>
              </div>
            </div>

            {/* Event Upload Config Area */}
            <div className="mb-8 p-6 rounded-xl border border-white/10 bg-white/[0.02]">
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider text-purple-400">
                1. Configure Event details for Upload
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Upload Destination Event
                  </label>
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setUploadMode('existing')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        uploadMode === 'existing'
                          ? 'bg-purple-600/20 border-purple-500/50 text-white'
                          : 'bg-transparent border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      Existing Event
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode('new')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        uploadMode === 'new'
                          ? 'bg-purple-600/20 border-purple-500/50 text-white'
                          : 'bg-transparent border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      + New Event
                    </button>
                  </div>

                  {uploadMode === 'existing' ? (
                    <select
                      value={selectedUploadEvent}
                      onChange={e => setSelectedUploadEvent(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                    >
                      {uniqueEventsList.map(ev => (
                        <option key={ev} value={ev} className="bg-[#0c0812]">
                          {ev}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={newEventName}
                      onChange={e => setNewEventName(e.target.value)}
                      placeholder="Enter new event title..."
                      className="w-full px-3 py-2.5 rounded-lg bg-white/[0.05] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50"
                    />
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[11px] text-gray-400">
                    Photos uploaded will automatically be grouped under: <br/>
                    <strong className="text-white">
                      {uploadMode === 'new' ? (newEventName.trim() || 'New Event') : selectedUploadEvent}
                    </strong>
                  </span>
                  
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
                        className="w-full px-5 py-3 rounded-lg font-bold text-white text-sm bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        2. Upload Photos Here
                      </motion.button>
                    )}
                  </CldUploadWidget>
                </div>
              </div>
            </div>

            {/* Filter and Manager Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-t border-white/5 pt-6">
              <h3 className="text-white font-semibold text-lg">Manage Photos</h3>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">Filter by Event:</span>
                <select
                  value={filterEvent}
                  onChange={e => setFilterEvent(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500/50"
                >
                  <option value="All" className="bg-[#0c0812]">All Events ({images.length})</option>
                  {uniqueEventsList.map(ev => {
                    const count = images.filter(img => (img.event_name || 'General') === ev).length;
                    return (
                      <option key={ev} value={ev} className="bg-[#0c0812]">
                        {ev} ({count})
                      </option>
                    );
                  })}
                  <option value="General" className="bg-[#0c0812]">General ({images.filter(img => !img.event_name || img.event_name === 'General').length})</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                No photos found matching this filter.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in duration-300">
                {filteredImages.map((img, index) => (
                  <motion.div
                    key={img.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`relative group rounded-xl overflow-hidden border transition-all ${
                      img.is_visible ? 'border-white/10 bg-white/[0.01]' : 'border-red-500/20 opacity-50 bg-black/40'
                    }`}
                  >
                    <div className="aspect-square relative">
                      <img
                        src={img.image_url}
                        alt={img.caption || 'Gallery photo'}
                        className="w-full h-full object-cover"
                      />

                      {/* Event Badge */}
                      <div className="absolute top-2 left-2 z-10">
                        <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-purple-950/80 text-purple-300 border border-purple-500/30 backdrop-blur-md">
                          {img.event_name || 'General'}
                        </span>
                      </div>

                      {!img.is_visible && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-xs text-red-400 font-medium">Hidden</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
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
                          onClick={() => { 
                            setEditingId(img.id); 
                            setCaptionValue(img.caption ?? '');
                            setEventValue(img.event_name ?? 'General');
                          }}
                          className="w-full text-xs py-1.5 rounded-lg border border-white/20 text-gray-300 hover:border-purple-500/40 hover:text-white transition-all"
                        >
                          Edit Details
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
                            disabled={index === filteredImages.length - 1}
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

                    <div className="px-3 py-2 bg-white/[0.03] border-t border-white/[0.05] flex flex-col gap-0.5">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-purple-400 truncate">
                        {img.event_name || 'General'}
                      </p>
                      {img.caption ? (
                        <p className="text-xs text-gray-300 truncate">{img.caption}</p>
                      ) : (
                        <p className="text-xs text-gray-600 italic">No caption</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </GlassmorphismCard>
        </FloatingElement>
      </Floating>

      {/* Edit Details Modal */}
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
              className="w-full max-w-md"
            >
              <GlassmorphismCard className="p-6 space-y-4">
                <h3 className="text-white font-semibold border-b border-white/5 pb-2 text-base">Edit Photo Details</h3>
                
                <div>
                  <label className="block text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">Event Group</label>
                  
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={eventValue}
                      onChange={e => setEventValue(e.target.value)}
                      placeholder="Enter event name..."
                      className="flex-1 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                  <span className="text-[10px] text-gray-500">
                    Suggestions:
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5 max-h-24 overflow-y-auto pr-1">
                    {uniqueEventsList.map(ev => (
                      <button
                        key={ev}
                        type="button"
                        onClick={() => setEventValue(ev)}
                        className={`px-2 py-0.5 rounded text-[10px] border transition-all ${
                          eventValue === ev 
                            ? 'bg-purple-600/30 border-purple-500/50 text-white' 
                            : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {ev}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">Caption</label>
                  <input
                    value={captionValue}
                    onChange={e => setCaptionValue(e.target.value)}
                    placeholder="Add a caption..."
                    autoFocus
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => saveDetails(editingId)}
                    className="flex-1 py-2.5 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300"
                  >
                    Save Details
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