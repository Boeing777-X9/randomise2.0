'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { 
  Search, RefreshCw, PhoneOff, CheckCircle2, XCircle, 
  Edit3, ShieldCheck, UserCheck, Phone, X, Save, ShieldAlert, Lock, User, Mail, Hash, BookOpen, Info, AlertTriangle, AlertCircle
} from 'lucide-react';

interface Participant {
  id: string;
  registration_id: string;
  event_id: string;
  full_name: string;
  personal_email: string;
  outlook_email: string;
  registration_number: string;
  whatsapp_number: string | null;
  course_name?: string | null;
  day1_confirmed?: boolean;
  day2_confirmed?: boolean;
  created_at: string;
}

const COURSE_OPTIONS = [
  'B.Tech (All Branches)',
  'BCA',
  'B.Sc (Hons)',
  'BBA (Hons)',
  'B.Com (Hons)',
  'B.Design',
  'B.Arch',
  'BA (Hons)',
  'MBA',
  'M.Tech',
  'MCA',
  'Other'
];

export default function EventRegistrationsAdmin() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'missing_mobile' | 'temp_ids' | 'day1' | 'day2'>('all');
  const router = useRouter();

  // Modal Edit State
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [editName, setEditName] = useState('');
  const [editRegNum, setEditRegNum] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [editOutlook, setEditOutlook] = useState('');
  const [editCourse, setEditCourse] = useState('');
  
  // Confirmation state before saving
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Verify Admin Permissions against public.admins table
  useEffect(() => {
    const verifyAdminPermissions = async () => {
      setAuthChecking(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || !user.email) {
        setIsAuthorizedAdmin(false);
        setAuthChecking(false);
        return;
      }

      const emailNormalized = user.email.trim().toLowerCase();
      setAdminEmail(emailNormalized);

      const { data: adminRecord, error } = await supabase
        .from('admins')
        .select('email, permissions')
        .ilike('email', emailNormalized)
        .maybeSingle();

      if (error || !adminRecord) {
        setIsAuthorizedAdmin(false);
      } else {
        const hasRegPermission = 
          Array.isArray(adminRecord.permissions) && 
          adminRecord.permissions.includes('registrations');

        setIsAuthorizedAdmin(hasRegPermission);
      }
      setAuthChecking(false);
    };

    verifyAdminPermissions();
  }, []);

  // Fetch registrations from database
  const fetchRegistrations = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    const { data, error } = await supabase
      .from('event_registrations')
      .select('id, registration_id, event_id, full_name, personal_email, outlook_email, registration_number, whatsapp_number, course_name, day1_confirmed, day2_confirmed, created_at')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setParticipants(data as Participant[]);
    }
    if (!isSilent) setLoading(false);
  }, []);

  // Realtime Syncing + 2-Second Auto-Polling Fallback
  useEffect(() => {
    if (!isAuthorizedAdmin) return;

    fetchRegistrations(false);

    const channel = supabase
      .channel('auditorium_checkin_realtime_v9')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'event_registrations' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setParticipants((prev) => [payload.new as Participant, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setParticipants((prev) =>
              prev.map((item) => (item.id === payload.new.id ? { ...item, ...payload.new } : item))
            );
          }
        }
      )
      .subscribe();

    const pollInterval = setInterval(() => {
      fetchRegistrations(true);
    }, 2000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, [isAuthorizedAdmin, fetchRegistrations]);

  // Escape key handler for Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && editingParticipant) {
        setEditingParticipant(null);
        setShowConfirm(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingParticipant]);

  const isTempRecord = (p: Participant) => {
    const regUpper = (p.registration_number || '').toUpperCase();
    const outlookLower = (p.outlook_email || '').toLowerCase();
    return regUpper.includes('TEMP') || outlookLower.includes('temp-');
  };

  const isMissingPhone = (p: Participant) => {
    return !p.whatsapp_number || p.whatsapp_number.trim() === '';
  };

  // Day 1 Check-In Toggle with Mandatory Profile Guard
  const toggleDay1 = async (p: Participant) => {
    if (isTempRecord(p) || isMissingPhone(p)) {
      showToast('⚠️ Mandatory: Update Mobile Number & Temp details before check-in!');
      handleOpenEdit(p);
      return;
    }

    const nextStatus = !p.day1_confirmed;
    setParticipants((prev) =>
      prev.map((item) => (item.id === p.id ? { ...item, day1_confirmed: nextStatus } : item))
    );

    const { error } = await supabase
      .from('event_registrations')
      .update({ day1_confirmed: nextStatus })
      .eq('id', p.id);

    if (error) {
      showToast('Error syncing Day 1 status: ' + error.message);
      fetchRegistrations(true);
    } else {
      showToast(nextStatus ? 'Day 1 Checked In!' : 'Day 1 Check-In Removed');
    }
  };

  // Day 2 Check-In Toggle with Mandatory Profile Guard
  const toggleDay2 = async (p: Participant) => {
    if (isTempRecord(p) || isMissingPhone(p)) {
      showToast('⚠️ Mandatory: Update Mobile Number & Temp details before check-in!');
      handleOpenEdit(p);
      return;
    }

    const nextStatus = !p.day2_confirmed;
    setParticipants((prev) =>
      prev.map((item) => (item.id === p.id ? { ...item, day2_confirmed: nextStatus } : item))
    );

    const { error } = await supabase
      .from('event_registrations')
      .update({ day2_confirmed: nextStatus })
      .eq('id', p.id);

    if (error) {
      showToast('Error syncing Day 2 status: ' + error.message);
      fetchRegistrations(true);
    } else {
      showToast(nextStatus ? 'Day 2 Checked In!' : 'Day 2 Check-In Removed');
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (participant: Participant) => {
    setEditingParticipant(participant);
    setEditName(participant.full_name || '');
    setEditRegNum(participant.registration_number || '');
    setEditMobile(participant.whatsapp_number || '');
    setEditOutlook(participant.outlook_email || '');
    setEditCourse(participant.course_name || 'B.Tech (All Branches)');
    setShowConfirm(false);
  };

  // Trigger Confirmation Request
  const requestSaveConfirmation = () => {
    if (!editMobile.trim()) {
      showToast('⚠️ Phone / WhatsApp Number is mandatory!');
      return;
    }
    if (!editRegNum.trim() || editRegNum.toUpperCase().includes('TEMP')) {
      showToast('⚠️ Please enter a valid Registration Number!');
      return;
    }
    setShowConfirm(true);
  };

  // Execute Save after Confirmation
  const handleExecuteSave = async () => {
    if (!editingParticipant) return;

    setSaving(true);
    const { error } = await supabase
      .from('event_registrations')
      .update({
        full_name: editName.trim(),
        registration_number: editRegNum.trim(),
        whatsapp_number: editMobile.trim(),
        outlook_email: editOutlook.trim(),
        course_name: editCourse.trim(),
      })
      .eq('id', editingParticipant.id);

    if (error) {
      showToast('Failed to update: ' + error.message);
    } else {
      showToast('Participant details updated successfully!');
      setEditingParticipant(null);
      setShowConfirm(false);
    }
    setSaving(false);
  };

  // Search Filtering
  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        p.full_name?.toLowerCase().includes(term) ||
        p.registration_number?.toLowerCase().includes(term) ||
        p.personal_email?.toLowerCase().includes(term) ||
        p.outlook_email?.toLowerCase().includes(term) ||
        p.whatsapp_number?.toLowerCase().includes(term) ||
        p.registration_id?.toLowerCase().includes(term) ||
        p.course_name?.toLowerCase().includes(term);

      if (!matchesSearch) return false;

      if (filterMode === 'missing_mobile') return isMissingPhone(p);
      if (filterMode === 'temp_ids') return isTempRecord(p);
      if (filterMode === 'day1') return !!p.day1_confirmed;
      if (filterMode === 'day2') return !!p.day2_confirmed;

      return true;
    });
  }, [participants, searchTerm, filterMode]);

  const missingMobileCount = useMemo(
    () => participants.filter((p) => isMissingPhone(p)).length,
    [participants]
  );

  const tempIdsCount = useMemo(
    () => participants.filter((p) => isTempRecord(p)).length,
    [participants]
  );

  if (authChecking) {
    return (
      <main className="min-h-screen bg-[#07050e] text-white flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3" aria-live="polite">
          <RefreshCw className="w-8 h-8 animate-spin text-purple-400" aria-hidden="true" />
          <p className="text-sm text-gray-300">Verifying Admin Permissions...</p>
        </div>
      </main>
    );
  }

  if (!isAuthorizedAdmin) {
    return (
      <main className="min-h-screen bg-[#07050e] text-white flex items-center justify-center p-4">
        <div 
          className="bg-[#0f0b1c] border border-red-500/40 rounded-3xl p-8 text-center space-y-5 shadow-2xl mx-auto"
          style={{ width: '100%', maxWidth: '480px', minWidth: '320px' }}
        >
          <ShieldAlert className="w-14 h-14 text-red-400 mx-auto" aria-hidden="true" />
          <h1 className="text-2xl font-black">Access Denied</h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            {adminEmail ? (
              <>
                Account <span className="text-white font-mono font-bold">{adminEmail}</span> does not have the <span className="text-red-400 font-bold">'registrations'</span> permission.
              </>
            ) : (
              'You must be logged in with an authorized Admin account to view this page.'
            )}
          </p>
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white hover:opacity-90 transition-opacity text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 min-h-[44px]"
          >
            <Lock className="w-4 h-4" aria-hidden="true" /> Go to Admin Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07050e] text-white p-4 sm:p-8 relative">
      {/* Toast Notification */}
      {toast && (
        <div 
          role="status" 
          aria-live="polite" 
          className="fixed bottom-6 right-6 z-50 bg-purple-600/90 text-white px-5 py-3 rounded-xl border border-purple-400/50 shadow-2xl backdrop-blur-md flex items-center gap-2"
        >
          <ShieldCheck className="w-5 h-5 text-green-300 shrink-0" aria-hidden="true" />
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-sky-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                Auditorium Check-In Desk
              </h1>
              <span className="px-2.5 py-1 text-[10px] uppercase font-bold bg-green-500/20 text-green-400 rounded-full border border-green-500/40 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" aria-hidden="true" /> Live Sync (2s)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Logged in as: <span className="text-purple-300 font-mono">{adminEmail}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchRegistrations(false)}
            aria-label="Manually sync registration database"
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 hover:border-purple-500/50 rounded-xl text-sm font-medium transition-all text-gray-300 hover:text-white min-h-[44px]"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-purple-400' : ''}`} aria-hidden="true" />
            Sync Now
          </button>
        </header>

        {/* TOP NOTE FOR ORGANIZERS */}
        <div className="bg-purple-900/30 border border-purple-500/40 rounded-2xl p-4 flex items-center gap-3 text-purple-200 text-sm shadow-md">
          <Info className="w-5 h-5 text-purple-400 shrink-0" aria-hidden="true" />
          <span>
            <strong>Organizer Note:</strong> If you are unable to find a participant by name or registration number, search using their <strong>Personal Gmail</strong>.
          </span>
        </div>

        {/* Stats Summary Row */}
        <section aria-label="Registration Statistics" className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#0f0b1a] border border-white/10 rounded-2xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Registered</p>
            <p className="text-2xl font-black text-white mt-1">{participants.length}</p>
          </div>
          <div className="bg-[#0f0b1a] border border-red-500/30 rounded-2xl p-4 bg-red-950/10">
            <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">Missing Phone</p>
            <p className="text-2xl font-black text-red-400 mt-1">{missingMobileCount}</p>
          </div>
          <div className="bg-[#0f0b1a] border border-blue-500/30 rounded-2xl p-4 bg-blue-950/10">
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Day 1 Present</p>
            <p className="text-2xl font-black text-blue-300 mt-1">
              {participants.filter((p) => p.day1_confirmed).length}
            </p>
          </div>
          <div className="bg-[#0f0b1a] border border-green-500/30 rounded-2xl p-4 bg-green-950/10">
            <p className="text-xs font-semibold text-green-400 uppercase tracking-wider">Day 2 Present</p>
            <p className="text-2xl font-black text-green-300 mt-1">
              {participants.filter((p) => p.day2_confirmed).length}
            </p>
          </div>
        </section>

        {/* Search Input & Quick Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0d0918] border border-white/10 p-4 rounded-2xl">
          <div className="relative w-full md:w-96">
            <label htmlFor="participant-search" className="sr-only">Search Participants</label>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
            <input
              id="participant-search"
              type="text"
              placeholder="Search Name, Reg No, Personal Gmail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-8 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500 outline-none"
            />
            {searchTerm && (
              <button 
                type="button"
                onClick={() => setSearchTerm('')} 
                aria-label="Clear search text"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-1"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto" role="group" aria-label="Filter Options">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors min-h-[36px] ${
                filterMode === 'all' ? 'bg-purple-600 text-white' : 'bg-white/5 border border-white/10 text-gray-400'
              }`}
            >
              All ({participants.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('missing_mobile')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors min-h-[36px] ${
                filterMode === 'missing_mobile' ? 'bg-red-600 text-white' : 'bg-red-500/10 border border-red-500/30 text-red-300'
              }`}
            >
              <PhoneOff className="w-3.5 h-3.5" aria-hidden="true" /> Missing Phone ({missingMobileCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('temp_ids')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors min-h-[36px] ${
                filterMode === 'temp_ids' ? 'bg-amber-600 text-white' : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" /> Temp Records ({tempIdsCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('day1')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors min-h-[36px] ${
                filterMode === 'day1' ? 'bg-blue-600 text-white' : 'bg-white/5 border border-white/10 text-gray-400'
              }`}
            >
              Day 1 Confirmed
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('day2')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors min-h-[36px] ${
                filterMode === 'day2' ? 'bg-green-600 text-white' : 'bg-white/5 border border-white/10 text-gray-400'
              }`}
            >
              Day 2 Confirmed
            </button>
          </div>
        </div>

        {/* Participant Data Table */}
        <div className="bg-[#0c0814]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-white/5 text-xs uppercase tracking-wider text-purple-300 border-b border-white/10">
                <tr>
                  <th scope="col" className="py-4 px-4 font-bold">Reg ID / Event ID</th>
                  <th scope="col" className="py-4 px-4 font-bold">Participant Name & Branch</th>
                  <th scope="col" className="py-4 px-4 font-bold">Emails</th>
                  <th scope="col" className="py-4 px-4 font-bold">Mobile</th>
                  <th scope="col" className="py-4 px-4 font-bold text-center">Day 1 Check-In</th>
                  <th scope="col" className="py-4 px-4 font-bold text-center">Day 2 Check-In</th>
                  <th scope="col" className="py-4 px-4 font-bold text-right">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading && participants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-400" aria-hidden="true" />
                      Connecting to Database...
                    </td>
                  </tr>
                ) : filteredParticipants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      No matching participants found.
                    </td>
                  </tr>
                ) : (
                  filteredParticipants.map((p) => {
                    const missingPhone = isMissingPhone(p);
                    const tempRecord = isTempRecord(p);

                    return (
                      <tr key={p.id} className={`hover:bg-white/[0.02] transition-colors ${missingPhone || tempRecord ? 'bg-red-500/[0.03]' : ''}`}>
                        <td className="py-3.5 px-4 font-mono text-xs text-purple-300 font-bold">
                          {p.registration_id || 'N/A'}
                        </td>

                        <td className="py-3.5 px-4 font-medium text-white">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span>{p.full_name || 'No Name'}</span>
                            {tempRecord && (
                              <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold bg-amber-500/20 text-amber-300 rounded border border-amber-500/40">
                                Temp Details
                              </span>
                            )}
                            {missingPhone && (
                              <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold bg-red-500/20 text-red-400 rounded border border-red-500/40">
                                Missing Phone
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 font-mono mt-0.5">
                            Reg No: <span className="text-gray-200">{p.registration_number || 'N/A'}</span>
                            {p.course_name && (
                              <span className="text-purple-300 ml-2">| {p.course_name}</span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-xs space-y-0.5">
                          <div className="text-gray-300 truncate max-w-[180px]" title={p.personal_email}>
                            <span className="text-gray-500 text-[10px]">Gmail:</span> {p.personal_email}
                          </div>
                          <div className="text-purple-300 truncate max-w-[180px]" title={p.outlook_email}>
                            <span className="text-gray-500 text-[10px]">MUJ:</span> {p.outlook_email || 'N/A'}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-xs font-mono">
                          {missingPhone || tempRecord ? (
                            <button 
                              type="button"
                              onClick={() => handleOpenEdit(p)} 
                              aria-label={`Update details for ${p.full_name}`}
                              className="px-2.5 py-1 bg-red-500/20 border border-red-500/40 text-red-300 rounded-lg text-xs hover:bg-red-500/30 flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" /> Update Info
                            </button>
                          ) : (
                            <div className="flex items-center gap-1.5 text-gray-200">
                              <Phone className="w-3 h-3 text-green-400 shrink-0" aria-hidden="true" />
                              {p.whatsapp_number}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleDay1(p)}
                            aria-label={`Toggle Day 1 Check-In for ${p.full_name}`}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors min-h-[36px] ${
                              p.day1_confirmed
                                ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                                : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'
                            }`}
                          >
                            {p.day1_confirmed ? <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" /> : <XCircle className="w-3.5 h-3.5 text-gray-600" aria-hidden="true" />}
                            {p.day1_confirmed ? 'D1 Present' : 'D1 Check-In'}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleDay2(p)}
                            aria-label={`Toggle Day 2 Check-In for ${p.full_name}`}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors min-h-[36px] ${
                              p.day2_confirmed
                                ? 'bg-green-600/20 border-green-500/50 text-green-300'
                                : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'
                            }`}
                          >
                            {p.day2_confirmed ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" aria-hidden="true" /> : <XCircle className="w-3.5 h-3.5 text-gray-600" aria-hidden="true" />}
                            {p.day2_confirmed ? 'D2 Present' : 'D2 Check-In'}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button 
                            type="button"
                            onClick={() => handleOpenEdit(p)} 
                            aria-label={`Edit details for ${p.full_name}`}
                            className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:text-white hover:bg-purple-500/20"
                          >
                            <Edit3 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Accessible & Spacious Edit Modal */}
      {editingParticipant && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto"
        >
          <div 
            className="relative bg-[#0f0b1c] border border-purple-500/30 rounded-3xl p-6 sm:p-8 w-[92vw] max-w-xl min-w-[320px] shadow-2xl space-y-6 text-left"
            style={{ width: '100%', maxWidth: '560px' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 id="modal-title" className="text-xl font-extrabold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-purple-400" aria-hidden="true" /> Update Participant Details
                </h2>
                <p className="text-xs text-purple-300 font-mono mt-0.5">
                  ID: {editingParticipant.registration_id} | {editingParticipant.personal_email}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setEditingParticipant(null)} 
                aria-label="Close update details modal"
                className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Confirmation Banner Overlay if User Pressed Save */}
            {showConfirm ? (
              <div className="bg-amber-950/40 border border-amber-500/50 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3 text-amber-300 font-bold text-base">
                  <AlertCircle className="w-6 h-6 text-amber-400 shrink-0" />
                  <span>Confirm Details Update</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Are you sure you want to update the details for <strong>{editName}</strong>? This will permanently update their record across all organizer check-in desks.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleExecuteSave}
                    disabled={saving}
                    className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold text-white hover:opacity-90 transition-opacity text-sm shadow-lg shadow-green-600/30 flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Saving...' : 'Yes, Confirm & Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 hover:text-white min-h-[44px]"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            ) : (
              /* Editable Fields Form */
              <div className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
                    <label htmlFor="edit-full-name" className="flex items-center gap-1.5 text-gray-300">
                      <User className="w-3.5 h-3.5 text-purple-400" aria-hidden="true" /> Full Name
                    </label>
                    <span className="text-[11px] text-gray-400">
                      Current: <strong className="text-purple-300">{editingParticipant.full_name || 'None'}</strong>
                    </span>
                  </div>
                  <input
                    id="edit-full-name"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-400 outline-none transition-colors"
                  />
                </div>

                {/* Registration Number */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
                    <label htmlFor="edit-reg-num" className="flex items-center gap-1.5 text-gray-300">
                      <Hash className="w-3.5 h-3.5 text-purple-400" aria-hidden="true" /> Registration Number *
                    </label>
                    <span className="text-[11px] text-gray-400">
                      Current: <strong className="text-purple-300">{editingParticipant.registration_number || 'None'}</strong>
                    </span>
                  </div>
                  <input
                    id="edit-reg-num"
                    type="text"
                    value={editRegNum}
                    onChange={(e) => setEditRegNum(e.target.value)}
                    placeholder="e.g. 2602050939"
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3 text-sm font-mono text-white focus:border-purple-400 outline-none transition-colors"
                  />
                </div>

                {/* Branch / Course Name Dropdown */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
                    <label htmlFor="edit-course" className="flex items-center gap-1.5 text-gray-300">
                      <BookOpen className="w-3.5 h-3.5 text-purple-400" aria-hidden="true" /> Branch / Course Name
                    </label>
                    <span className="text-[11px] text-gray-400">
                      Current: <strong className="text-purple-300">{editingParticipant.course_name || 'None'}</strong>
                    </span>
                  </div>
                  <select
                    id="edit-course"
                    value={editCourse}
                    onChange={(e) => setEditCourse(e.target.value)}
                    className="w-full bg-[#0d0918] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-400 outline-none transition-colors cursor-pointer"
                  >
                    {COURSE_OPTIONS.map((c) => (
                      <option key={c} value={c} className="bg-[#0f0b1c] text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mobile / WhatsApp Number */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
                    <label htmlFor="edit-mobile" className="flex items-center gap-1.5 text-purple-300 font-bold">
                      <Phone className="w-3.5 h-3.5 text-green-400" aria-hidden="true" /> Mobile / WhatsApp Number *
                    </label>
                    <span className="text-[11px] text-gray-400">
                      Current: <strong className="text-purple-300">{editingParticipant.whatsapp_number || 'Missing'}</strong>
                    </span>
                  </div>
                  <input
                    id="edit-mobile"
                    type="tel"
                    placeholder="+91..."
                    value={editMobile}
                    onChange={(e) => setEditMobile(e.target.value)}
                    className="w-full bg-purple-500/10 border border-purple-500/40 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-gray-500 focus:border-purple-400 outline-none transition-colors"
                  />
                </div>

                {/* MUJ Outlook Email */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
                    <label htmlFor="edit-outlook" className="flex items-center gap-1.5 text-gray-300">
                      <Mail className="w-3.5 h-3.5 text-purple-400" aria-hidden="true" /> MUJ Outlook Email
                    </label>
                    <span className="text-[11px] text-gray-400 truncate max-w-[200px]">
                      Current: <strong className="text-purple-300">{editingParticipant.outlook_email || 'None'}</strong>
                    </span>
                  </div>
                  <input
                    id="edit-outlook"
                    type="email"
                    placeholder="name.260XXXXXXX@muj.manipal.edu"
                    value={editOutlook}
                    onChange={(e) => setEditOutlook(e.target.value)}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3 text-sm font-mono text-white focus:border-purple-400 outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!showConfirm && (
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={requestSaveConfirmation}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white hover:opacity-90 transition-opacity text-sm shadow-lg shadow-purple-600/30 min-h-[44px]"
                >
                  <Save className="w-4 h-4" aria-hidden="true" /> Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingParticipant(null)}
                  className="px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors min-h-[44px]"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}