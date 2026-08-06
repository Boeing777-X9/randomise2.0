'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import GlassmorphismCard from '@/components/GlassmorphismCard';
import Floating, { FloatingElement } from '@/fancy/components/image/parallax-floating';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { 
  Plus, Trash2, RefreshCw, CheckCircle, AlertTriangle, 
  ChevronDown, ChevronUp, X, Edit2, Save, Eye, EyeOff, Star, Upload
} from 'lucide-react';
import { logAction } from '@/lib/audit'; 

interface Winner {
  position: 1 | 2 | 3;
  name: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
  is_banner: boolean;
  is_visible: boolean;
  type: 'normal' | 'competition';
  show_winners: boolean;
  winners: Winner[];
  registration_live: boolean;
  whatsapp_group_link: string;
}

type Toast = { message: string; type: "success" | "error" };

const emptyEvent = (): Omit<Event, 'id'> => ({
  title: "",
  date: "",
  description: "",
  image: "",
  is_banner: false,
  is_visible: true,
  type: 'normal',
  show_winners: false,
  registration_live: false,
  whatsapp_group_link: "",
  winners: [
    { position: 1, name: "" },
    { position: 2, name: "" },
    { position: 3, name: "" },
  ]
});

const parseEventDate = (dateStr: string): number => {
  if (!dateStr) return 0;
  
  const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  
  const yearMatch = dateStr.match(/\b(20\d{2})\b/);
  const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();

  const monthMatch = dateStr.match(/[a-zA-Z]+/);
  let monthIndex = 0;
  if (monthMatch) {
    const m = monthMatch[0].toLowerCase().substring(0, 3);
    monthIndex = months.indexOf(m);
    if (monthIndex === -1) monthIndex = 0; 
  }

  const dayMatch = dateStr.match(/\b(\d{1,2})\b/);
  const day = dayMatch ? parseInt(dayMatch[1]) : 1;

  return new Date(year, monthIndex, day).getTime();
};

export default function AdminEventsControl() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Registration Management State
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loadingRegs, setLoadingRegs] = useState(false);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Event>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState(emptyEvent());
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const checkAuthAndFetch = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/admin'); return; }

    const { data: admin } = await supabase.from('admins').select('*').eq('email', user.email);
    if (!admin || admin.length === 0) { router.push('/admin'); return; }

    setUser(user);
    await fetchEvents();
  }, [router]);

  useEffect(() => { checkAuthAndFetch(); }, [checkAuthAndFetch]);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
      .order('id', { ascending: true });
      
    if (!error && data) {
      const sortedEvents = data.sort((a, b) => {
        const timeA = parseEventDate(a.date);
        const timeB = parseEventDate(b.date);
        if (timeB === timeA) return a.id > b.id ? 1 : -1;
        return timeB - timeA;
      });
      setEvents(sortedEvents);
    }
    setLoading(false);
  };

  const fetchRegistrations = async (eventId: string) => {
    setLoadingRegs(true);
    const { data } = await supabase.from('event_registrations').select('*').eq('event_id', eventId);
    setRegistrations(data || []);
    setLoadingRegs(false);
  };

  const exportCSV = () => {
    const header = ["Reg ID", "Name", "Personal Email", "Outlook Email", "Reg Number", "WhatsApp", "Joined", "Date"];
    const csv = registrations.map(r => [
      r.registration_id, r.full_name, r.personal_email, r.outlook_email, 
      r.registration_number, r.whatsapp_number, r.joined_whatsapp ? 'Yes' : 'No', 
      new Date(r.created_at).toLocaleString()
    ].join(','));
    const blob = new Blob([header.join(',') + '\n' + csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'registrations.csv';
    a.click();
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Failed to upload image to Cloudinary');
    return data.secure_url;
  };

  const handleAdd = async () => {
    if (!newEvent.title || !newEvent.date) {
      showToast("Title and date are required", "error");
      return;
    }
    
    setSaving(true);
    try {
      let uploadedImageUrl = "";
      
      if (imageFile) {
        uploadedImageUrl = await handleImageUpload(imageFile);
      }

      if (newEvent.is_banner) {
        await supabase.from('events').update({ is_banner: false }).eq('is_banner', true);
      }

      const eventToInsert = { ...newEvent, image: uploadedImageUrl };
      const { data, error } = await supabase.from('events').insert([eventToInsert]).select();
      
      if (error) throw error;
      await logAction(user?.email || 'Unknown', 'Created Event', { 
        title: eventToInsert.title, 
        date: eventToInsert.date,
        is_banner: eventToInsert.is_banner
      });

      showToast("Event added successfully!");
      setNewEvent(emptyEvent());
      setImageFile(null);
      setShowAdd(false);
      fetchEvents();
    } catch (err: any) {
      showToast(err.message || "An error occurred", "error");
    } finally {
      setSaving(false);
    }
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    try {
      let updatedValues = { ...editValues };
      const originalEvent = events.find(e => e.id === id);

      if (editImageFile) {
        const newImageUrl = await handleImageUpload(editImageFile);
        updatedValues.image = newImageUrl;
      }

      if (updatedValues.is_banner) {
        await supabase.from('events').update({ is_banner: false }).eq('is_banner', true);
      }

      const { error } = await supabase.from('events').update(updatedValues).eq('id', id);
      if (error) throw error;
      
      if (originalEvent) {
        const changes: Record<string, any> = {};
        Object.keys(updatedValues).forEach((key) => {
          const k = key as keyof Event;
          if (JSON.stringify(originalEvent[k]) !== JSON.stringify(updatedValues[k])) {
            changes[k] = { 
              from: originalEvent[k], 
              to: updatedValues[k] 
            };
          }
        });

        if (Object.keys(changes).length > 0) {
          await logAction(user?.email || 'Unknown', 'Edited Event Details', { 
            event_id: id, 
            event_title: updatedValues.title, 
            changes 
          });
        }
      }

      showToast("Changes saved successfully!");
      setEditingId(null);
      setEditImageFile(null);
      fetchEvents();
    } catch (err: any) {
      showToast(err.message || "An error occurred", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const eventToDelete = events.find(e => e.id === id);

    const { error } = await supabase.from('events').delete().eq('id', id);
    if (!error) {
      await logAction(user?.email || 'Unknown', 'Deleted Event', { 
        event_id: id, 
        event_title: eventToDelete?.title 
      });

      setEvents(prev => prev.filter(e => e.id !== id));
      showToast("Event deleted");
    } else {
      showToast("Failed to delete", "error");
    }
    setDeleting(null);
    setConfirmDelete(null);
  };

  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    const event = events.find(e => e.id === id);
    const { error } = await supabase.from('events').update({ is_visible: !currentStatus }).eq('id', id);
    if (!error) {
      await logAction(user?.email || 'Unknown', 'Toggled Event Visibility', { 
        event_id: id, 
        event_title: event?.title,
        visible_from: currentStatus,
        visible_to: !currentStatus
      });

      setEvents(prev => prev.map(e => e.id === id ? { ...e, is_visible: !currentStatus } : e));
      showToast(!currentStatus ? "Event is now visible" : "Event hidden");
    }
  };

  const setAsBanner = async (id: string) => {
    const event = events.find(e => e.id === id);
    const previousBanner = events.find(e => e.is_banner);

    await supabase.from('events').update({ is_banner: false }).eq('is_banner', true);
    await supabase.from('events').update({ is_banner: true }).eq('id', id);
    
    await logAction(user?.email || 'Unknown', 'Changed Featured Banner', { 
      new_banner_event: event?.title,
      previous_banner: previousBanner?.title || 'None'
    });

    fetchEvents();
    showToast("Banner updated");
  };

  const bannerEvent = events.find(e => e.is_banner);

  const renderEventCard = (event: Event, isBannerSlot: boolean = false) => {
    const isExpanded = expandedId === event.id;
    const isEditing = editingId === event.id;

    return (
      <div key={isBannerSlot ? `banner-slot-${event.id}` : event.id} className={`bg-[#0c0812]/60 backdrop-blur-md border rounded-xl overflow-hidden transition-all duration-300 ${!event.is_visible ? "opacity-50 border-white/5 grayscale-[50%]" : "border-white/10"} ${event.is_banner ? "border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.15)] bg-purple-900/10" : ""}`}>
        
        {/* Thin Card Header */}
        <div className="p-3 sm:px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            {event.image ? (
              <div 
                className="relative w-16 h-10 sm:w-20 sm:h-12 rounded bg-black border border-white/10 shrink-0 overflow-hidden cursor-pointer group"
                onClick={() => setPreviewImage(event.image)}
                title="Click to preview image"
              >
                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Eye className="w-4 h-4 text-white" />
                </div>
              </div>
            ) : (
              <div className="w-16 h-10 sm:w-20 sm:h-12 rounded bg-white/5 border border-white/10 shrink-0 flex items-center justify-center text-[10px] text-gray-500">
                No Img
              </div>
            )}
            
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 flex-wrap leading-none mb-1.5">
                <h3 className="font-semibold text-sm text-white">{event.title}</h3>
                {event.is_banner && <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-purple-500/20 text-purple-300 rounded border border-purple-500/30 flex items-center gap-0.5"><Star className="w-2.5 h-2.5"/> Banner</span>}
                {!event.is_visible && <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-gray-500/20 text-gray-400 rounded border border-gray-500/30 flex items-center gap-0.5"><EyeOff className="w-2.5 h-2.5"/> Hidden</span>}
                {event.type === 'competition' && <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">Comp</span>}
              </div>
              <p className="text-xs text-gray-400 leading-none">{event.date}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            {!event.is_banner && (
              <button onClick={() => setAsBanner(event.id)} className="px-2.5 py-1.5 border border-white/10 rounded-lg text-xs font-medium text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all">
                Set Banner
              </button>
            )}
            
            <button onClick={() => toggleVisibility(event.id, event.is_visible)} className="flex items-center gap-1 px-2.5 py-1.5 border border-white/10 rounded-lg text-xs font-medium text-gray-300 hover:bg-white/5 transition-all">
              {event.is_visible ? <><EyeOff className="w-3 h-3" /> Hide</> : <><Eye className="w-3 h-3" /> Show</>}
            </button>

            <button onClick={() => { 
                setEditingId(event.id); 
                setEditValues({ ...event }); 
                setExpandedId(event.id); 
                setEditImageFile(null);
              }} 
              className="flex items-center gap-1 px-2.5 py-1.5 border border-white/10 rounded-lg text-xs font-medium text-gray-300 hover:bg-white/5 transition-all">
              <Edit2 className="w-3 h-3" /> Edit
            </button>

            {confirmDelete === event.id ? (
              <div className="flex items-center gap-1">
                <button onClick={() => handleDelete(event.id)} disabled={deleting === event.id} className="px-2.5 py-1.5 bg-red-500/20 border border-red-500/40 text-red-300 rounded-lg text-xs font-medium hover:bg-red-500/30 disabled:opacity-50">
                  {deleting === event.id ? "..." : "Confirm"}
                </button>
                <button onClick={() => setConfirmDelete(null)} className="px-2.5 py-1.5 bg-white/5 border border-white/10 text-gray-400 rounded-lg text-xs hover:text-white">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(event.id)} className="p-1.5 border border-white/10 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            <button onClick={() => {
                setExpandedId(isExpanded ? null : event.id);
                if (!isExpanded) { setRegistrations([]); }
              }} className="flex items-center justify-center w-7 h-7 border border-white/10 rounded-lg text-gray-300 hover:bg-white/5 transition-all ml-1">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-white/10 p-5 bg-black/40">
            {isEditing ? (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Title"><input value={editValues.title ?? ""} onChange={e => setEditValues(p => ({ ...p, title: e.target.value }))} className="inp" /></Field>
                  <Field label="Date"><input value={editValues.date ?? ""} onChange={e => setEditValues(p => ({ ...p, date: e.target.value }))} className="inp" /></Field>
                  
                  <Field label="Update Image (Cloudinary)">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={e => setEditImageFile(e.target.files?.[0] || null)} 
                      className="inp file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30 cursor-pointer" 
                    />
                    <p className="text-[10px] text-gray-500 mt-1 pl-1">Leave empty to keep the current image.</p>
                  </Field>

                  <Field label="Category">
                    <select value={editValues.type ?? "normal"} onChange={e => setEditValues(p => ({ ...p, type: e.target.value as 'normal'|'competition' }))} className="inp">
                      <option value="normal">Normal Event</option>
                      <option value="competition">Competition</option>
                    </select>
                  </Field>
                  
                  <Field label="WhatsApp Group Link">
                    <input value={editValues.whatsapp_group_link ?? ""} onChange={e => setEditValues(p => ({ ...p, whatsapp_group_link: e.target.value }))} className="inp" placeholder="https://chat.whatsapp.com/..." />
                  </Field>
                </div>
                
                <Field label="Description">
                  <textarea value={editValues.description ?? ""} onChange={e => setEditValues(p => ({ ...p, description: e.target.value }))} className="inp resize-y" rows={3} />
                </Field>

                <div className="flex flex-col gap-2 mt-4">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={editValues.is_banner ?? false} onChange={e => setEditValues(p => ({ ...p, is_banner: e.target.checked }))} className="w-4 h-4 rounded border-gray-500 text-purple-600 bg-transparent" />
                    <label className="text-sm text-gray-300">Set as Featured Banner Event</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={editValues.registration_live ?? false} onChange={e => setEditValues(p => ({ ...p, registration_live: e.target.checked }))} className="w-4 h-4 rounded border-gray-500 text-purple-600 bg-transparent" />
                    <label className="text-sm text-gray-300">Registration Live / Open</label>
                  </div>
                </div>

                {editValues.type === 'competition' && (
                  <div className="p-4 border border-white/10 rounded-lg bg-black/20">
                    <div className="flex items-center gap-2 mb-4">
                      <input type="checkbox" checked={editValues.show_winners ?? false} onChange={e => setEditValues(p => ({ ...p, show_winners: e.target.checked }))} className="w-4 h-4 rounded border-gray-500 text-purple-600 bg-transparent" />
                      <label className="text-sm font-semibold text-purple-300">Declare / Show Winners</label>
                    </div>
                    
                    {editValues.show_winners && (
                      <div className="space-y-3">
                        {[1, 2, 3].map(pos => {
                          const w = (editValues.winners ?? []).find(x => x.position === pos) || { position: pos as 1|2|3, name: "" };
                          return (
                            <div key={pos} className="flex items-center gap-3">
                              <span className="text-xl">{pos === 1 ? "🥇" : pos === 2 ? "🥈" : "🥉"}</span>
                              <input 
                                value={w.name} 
                                onChange={e => {
                                  const rest = (editValues.winners ?? []).filter(x => x.position !== pos);
                                  setEditValues(p => ({ ...p, winners: [...rest, { position: pos as 1|2|3, name: e.target.value }].sort((a,b) => a.position - b.position) }));
                                }} 
                                className="inp flex-1" 
                                placeholder={`${pos === 1 ? "1st" : pos === 2 ? "2nd" : "3rd"} place winner`} 
                              />
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button onClick={() => saveEdit(event.id)} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] rounded-lg text-white font-semibold hover:opacity-90 disabled:opacity-50 text-sm">
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? "Uploading & Saving..." : "Save Changes"}
                  </button>
                  <button onClick={() => { setEditingId(null); setEditImageFile(null); }} className="px-5 py-2 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6 text-sm animate-in fade-in duration-300">
                <div className="space-y-3">
                  <h4 className="text-purple-300 font-semibold uppercase tracking-wider text-[10px]">Description</h4>
                  <p className="text-gray-300 leading-relaxed">{event.description}</p>
                </div>
                
                {event.type === 'competition' && event.show_winners && event.winners && (
                  <div>
                    <h4 className="text-purple-300 font-semibold uppercase tracking-wider text-[10px] mb-3">Declared Winners</h4>
                    <div className="space-y-2 bg-white/5 p-4 rounded-lg border border-white/10">
                      {event.winners.map(w => w.name ? (
                        <div key={w.position} className="flex items-center gap-3">
                          <span className="text-lg">{w.position === 1 ? "🥇" : w.position === 2 ? "🥈" : "🥉"}</span>
                          <span className="text-white font-medium">{w.name}</span>
                        </div>
                      ) : null)}
                      {!event.winners.some(w => w.name) && <span className="text-gray-500 italic">No names added yet.</span>}
                    </div>
                  </div>
                )}

                {/* Registration Management View */}
                <div className="col-span-full mt-6 border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-purple-300 font-semibold uppercase tracking-wider text-[10px]">Registration Data</h4>
                    {event.registration_live ? (
                      <span className="px-2 py-1 text-[10px] uppercase font-bold bg-green-500/20 text-green-400 rounded border border-green-500/30">Live</span>
                    ) : (
                      <span className="px-2 py-1 text-[10px] uppercase font-bold bg-red-500/20 text-red-400 rounded border border-red-500/30">Closed</span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <button 
                      onClick={() => fetchRegistrations(event.id)} 
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors"
                    >
                      Load Registrations
                    </button>
                    {registrations.length > 0 && (
                      <>
                         <span className="text-sm text-gray-400">{registrations.length} Total Registrations</span>
                         <button onClick={exportCSV} className="px-4 py-2 bg-purple-500/20 border border-purple-500/40 text-purple-300 rounded-lg text-sm hover:bg-purple-500/30 transition-colors ml-auto">
                           Export CSV
                         </button>
                      </>
                    )}
                  </div>
                  
                  {loadingRegs && <p className="text-sm text-gray-500 mt-4">Loading Data...</p>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative isolate overflow-hidden bg-transparent min-h-lvh text-white pb-24">
      
      {toast && (
        <div className={`fixed top-24 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm shadow-lg border backdrop-blur-md ${
          toast.type === "success" ? "bg-green-500/20 border-green-500/50 text-green-300" : "bg-red-500/20 border-red-500/50 text-red-300"
        }`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setPreviewImage(null)} 
              className="absolute -top-12 right-0 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 hover:text-red-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={previewImage} alt="Preview" className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10" />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 py-24 z-10 relative">
        
        {/* Header Area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
              Events Control Panel
            </h1>
            <p className="text-sm text-gray-400 mt-2">Manage visibility, categories, and winners.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={fetchEvents} className="p-2.5 bg-white/5 border border-white/10 rounded-lg hover:border-purple-500/50 transition-colors">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-purple-400" : "text-gray-300"}`} />
            </button>
            <button
              onClick={() => setShowAdd(p => !p)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] rounded-lg text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Event
            </button>
            <button onClick={() => router.push('/admin/access')} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-colors">
              Access & Logs
            </button>
            <button onClick={() => router.push('/admin')} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-colors">
              Dashboard
            </button>
          </div>
        </div>

        {/* Add Form (Accordion style) */}
        {showAdd && (
          <GlassmorphismCard className="mb-8 p-6 border-purple-500/40 border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-500">Create New Event</h2>
              <button onClick={() => setShowAdd(false)}><X className="w-5 h-5 text-gray-400 hover:text-white" /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Event Title *"><input value={newEvent.title} onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))} className="inp" placeholder="e.g. CodeFest 2026" /></Field>
              <Field label="Date *"><input value={newEvent.date} onChange={e => setNewEvent(p => ({ ...p, date: e.target.value }))} className="inp" placeholder="e.g. 15 March 2026" /></Field>
              
              <Field label="Upload Image (To Cloudinary)">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => setImageFile(e.target.files?.[0] || null)} 
                  className="inp file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30 cursor-pointer" 
                />
              </Field>

              <Field label="Category">
                <select value={newEvent.type} onChange={e => setNewEvent(p => ({ ...p, type: e.target.value as 'normal'|'competition' }))} className="inp">
                  <option value="normal">Normal Event</option>
                  <option value="competition">Competition</option>
                </select>
              </Field>

              <Field label="WhatsApp Group Link">
                <input value={newEvent.whatsapp_group_link} onChange={e => setNewEvent(p => ({ ...p, whatsapp_group_link: e.target.value }))} className="inp" placeholder="https://chat.whatsapp.com/..." />
              </Field>
            </div>
            <div className="mt-5">
              <Field label="Description"><textarea value={newEvent.description} onChange={e => setNewEvent(p => ({ ...p, description: e.target.value }))} className="inp resize-y" rows={3} /></Field>
            </div>
            
            <div className="mt-5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={newEvent.is_banner} onChange={e => setNewEvent(p => ({ ...p, is_banner: e.target.checked }))} className="w-4 h-4 rounded border-gray-500 text-purple-600 focus:ring-purple-600 bg-transparent" />
                <label className="text-sm text-gray-300">Set as Featured Banner Event</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={newEvent.registration_live} onChange={e => setNewEvent(p => ({ ...p, registration_live: e.target.checked }))} className="w-4 h-4 rounded border-gray-500 text-purple-600 focus:ring-purple-600 bg-transparent" />
                <label className="text-sm text-gray-300">Registration Live / Open</label>
              </div>
            </div>

            {newEvent.type === 'competition' && (
              <div className="mt-6 p-4 border border-white/10 rounded-lg bg-black/20">
                <div className="flex items-center gap-2 mb-4">
                  <input type="checkbox" checked={newEvent.show_winners} onChange={e => setNewEvent(p => ({ ...p, show_winners: e.target.checked }))} className="w-4 h-4 rounded border-gray-500 text-purple-600 bg-transparent" />
                  <label className="text-sm font-semibold text-purple-300">Declare / Show Winners</label>
                </div>
                {newEvent.show_winners && (
                  <div className="space-y-3">
                    {[1, 2, 3].map(pos => {
                      const w = newEvent.winners.find(x => x.position === pos) || { position: pos as 1|2|3, name: "" };
                      return (
                        <div key={pos} className="flex items-center gap-3">
                          <span className="text-xl">{pos === 1 ? "🥇" : pos === 2 ? "🥈" : "🥉"}</span>
                          <input value={w.name} onChange={e => {
                              const rest = newEvent.winners.filter(x => x.position !== pos);
                              setNewEvent(p => ({ ...p, winners: [...rest, { position: pos as 1|2|3, name: e.target.value }].sort((a,b) => a.position - b.position) }));
                            }} className="inp flex-1" placeholder={`${pos === 1 ? "1st" : pos === 2 ? "2nd" : "3rd"} place winner`} />
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
            
            <button onClick={handleAdd} disabled={saving} className="mt-6 flex items-center justify-center w-full gap-2 px-5 py-3 bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] rounded-lg text-white font-semibold hover:shadow-lg disabled:opacity-50">
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {saving ? "Uploading & Saving Event..." : "Upload Image & Add Event"}
            </button>
          </GlassmorphismCard>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-500" /> Loading Database...
          </div>
        ) : (
          <>
            {bannerEvent && (
              <div className="mb-10">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-400" /> Currently Featured Banner
                </h2>
                {renderEventCard(bannerEvent, true)}
              </div>
            )}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white mb-4 mt-8 flex items-center gap-2 border-t border-white/10 pt-8">
                All Events Timeline
              </h2>
              {events.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No events found.</div>
              ) : (
                events.map(event => renderEventCard(event, false))
              )}
            </div>
          </>
        )}

      </div>

      <style jsx global>{`
        .inp {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: white;
          outline: none;
          transition: all 0.2s;
        }
        .inp:focus { 
          border-color: #A10FF2; 
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 2px rgba(161, 15, 242, 0.2);
        }
        .inp::placeholder { color: #6b7280; }
        .inp option { background: #0a0a0a; color: white; }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}