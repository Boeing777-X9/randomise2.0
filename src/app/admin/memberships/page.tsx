'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { 
  Search, RefreshCw, ShieldCheck, 
  ArrowLeft, Eye, ShieldAlert, Lock, X, ExternalLink,
  Phone, Clock, Download, AlertTriangle, AlertOctagon
} from 'lucide-react';
import Link from 'next/link';

interface MembershipApp {
  id: string;
  randomize_id: string;
  full_name: string;
  personal_email: string;
  outlook_email: string;
  registration_number: string;
  phone_number: string;
  academic_details: string;
  accommodation: string;
  registration_type: string;
  amount: number;
  payment_reference_id: string;
  payment_screenshot_url: string;
  status: 'pending_verification' | 'verified' | 'rejected';
  created_at: string;
  referral?: string;
}

// Formats timestamp to Non-US format: DD/MM/YYYY, HH:MM AM/PM
function formatSubmissionTimestamp(dateStr?: string) {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`;
  } catch (e) {
    return dateStr;
  }
}

export default function AdminMembershipsPage() {
  const [apps, setApps] = useState<MembershipApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'verified' | 'all'>('pending');
  const [activeImageModal, setActiveImageModal] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const router = useRouter();

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const verifyAdmin = async () => {
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
        .select('*')
        .ilike('email', emailNormalized)
        .maybeSingle();

      if (error || !adminRecord) {
        setIsAuthorizedAdmin(false);
      } else {
        setIsAuthorizedAdmin(true);
      }
      setAuthChecking(false);
    };

    verifyAdmin();
  }, []);

  const fetchApplications = useCallback(async (isSilent = false) => {
    if (!adminEmail) return;
    if (!isSilent) setLoading(true);

    try {
      const { data, error } = await supabase.rpc('get_admin_membership_applications', {
        p_admin_email: adminEmail
      });

      if (!error && data) {
        setApps(data as MembershipApp[]);
      } else if (error) {
        showToast(`Fetch error: ${error.message}`);
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [adminEmail]);

  useEffect(() => {
    if (!isAuthorizedAdmin || !adminEmail) return;
    fetchApplications(false);

    const channel = supabase
      .channel('memberships_sync_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'members_26' },
        () => fetchApplications(true)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthorizedAdmin, adminEmail, fetchApplications]);

  const handleApprove = async (app: MembershipApp) => {
    if (!adminEmail) return;
    setProcessingId(app.id);

    try {
      const { data, error } = await supabase.rpc('approve_membership_application', {
        p_application_id: app.id,
        p_admin_email: adminEmail
      });

      if (error) throw error;

      if (data?.success) {
        showToast(`Approved ${app.full_name} (${app.randomize_id})`);
        setApps(prev => prev.map(item => item.id === app.id ? { ...item, status: 'verified' } : item));
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  // Rejection logic verified directly through Supabase RPC
  const handleReject = async (app: MembershipApp) => {
    if (!adminEmail) return;

    if (!confirm(`WARNING: Please confirm again. Do you really want to reject ${app.full_name}?`)) {
      return;
    }

    setProcessingId(app.id);

    try {
      const { data, error } = await supabase.rpc('reject_membership_application', {
        p_application_id: app.id,
        p_admin_email: adminEmail
      });

      if (error) throw error;

      if (data?.success) {
        showToast(`Rejected application for ${app.full_name}`);
        setApps(prev => prev.map(item => item.id === app.id ? { ...item, status: 'rejected' } : item));
      }
    } catch (err: any) {
      showToast(err.message || 'Unauthorized: Only authorized leads can reject applications.');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredApps = useMemo(() => {
    return apps.filter(a => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = !term || 
        a.full_name?.toLowerCase().includes(term) ||
        a.registration_number?.toLowerCase().includes(term) ||
        a.payment_reference_id?.toLowerCase().includes(term) ||
        a.personal_email?.toLowerCase().includes(term) ||
        a.phone_number?.toLowerCase().includes(term) ||
        a.randomize_id?.toLowerCase().includes(term);

      if (!matchesSearch) return false;
      if (statusFilter === 'pending') return a.status === 'pending_verification';
      if (statusFilter === 'verified') return a.status === 'verified';
      return true;
    });
  }, [apps, searchTerm, statusFilter]);

  const downloadPhoneNumbersCSV = () => {
    if (filteredApps.length === 0) {
      showToast('No records to download');
      return;
    }

    const headers = ['Randomize ID', 'Full Name', 'Registration Number', 'Phone Number', 'Status'];
    const rows = filteredApps.map(a => [
      `"${a.randomize_id || ''}"`,
      `"${(a.full_name || '').replace(/"/g, '""')}"`,
      `"${a.registration_number || ''}"`,
      `"${(a.phone_number || '').replace(/[^\d+]/g, '')}"`,
      `"${a.status || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `members_phone_numbers_${statusFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filteredApps.length} contact records`);
  };

  if (authChecking) {
    return (
      <main className="min-h-screen bg-[#07050e] text-white flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-purple-400" />
          <p className="text-sm text-zinc-300 font-mono">Verifying Admin Permissions...</p>
        </div>
      </main>
    );
  }

  if (!isAuthorizedAdmin) {
    return (
      <main className="min-h-screen bg-[#07050e] text-white flex items-center justify-center p-4">
        <div className="bg-[#0f0b1c] border border-red-500/40 rounded-3xl p-8 text-center space-y-5 shadow-2xl max-w-md w-full">
          <ShieldAlert className="w-14 h-14 text-red-400 mx-auto" />
          <h1 className="text-2xl font-black">Access Denied</h1>
          <p className="text-sm text-zinc-300 leading-relaxed">
            {adminEmail ? (
              <>Account <span className="text-white font-mono font-bold">{adminEmail}</span> is not registered in the admins table.</>
            ) : (
              'You must be logged in with an authorized Admin account.'
            )}
          </p>
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" /> Go to Admin Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07050e] text-white p-4 sm:p-8 pt-28 sm:pt-32">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#160d2b] text-white px-5 py-3 rounded-xl border border-purple-400/50 shadow-2xl backdrop-blur-md flex items-center gap-2 font-mono">
          <ShieldCheck className="w-5 h-5 text-purple-300" />
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <Link href="/admin" className="text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                Membership Approval Desk
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-mono">
              Logged in: <span className="text-purple-300">{adminEmail}</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={downloadPhoneNumbersCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white transition-all min-h-[44px]"
              title="Download filtered contacts for WhatsApp GC"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" /> Download Phone CSV
            </button>

            <button
              onClick={() => fetchApplications(false)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-purple-500/50 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white transition-all min-h-[44px]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-purple-400' : ''}`} /> Refresh
            </button>
          </div>
        </header>

        {/* Warning Banner */}
        <div className="bg-red-950/40 border border-red-500/40 rounded-2xl p-4 flex items-start gap-3 shadow-lg">
          <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-red-300 tracking-wide uppercase">
              Important: Do NOT reject any applicants
            </p>
            <p className="text-zinc-300 leading-relaxed">
              Do not reject any registration without consulting first. If the transaction ID looks like a receipt name or is marked incorrect, click <strong className="text-white">View</strong> to inspect the payment screenshot proof directly.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0d0918] border border-white/10 p-3.5 rounded-2xl">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search Name, Reg No, Phone, UTR, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:border-cyan-400 outline-none min-h-[44px]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {['pending', 'verified', 'all'].map((mode) => (
              <button
                key={mode}
                onClick={() => setStatusFilter(mode as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors min-h-[44px] ${
                  statusFilter === mode ? 'bg-cyan-600 text-white' : 'bg-white/5 text-zinc-400 border border-white/10'
                }`}
              >
                {mode === 'verified' ? 'Verified' : mode} ({
                  apps.filter(a => mode === 'all' ? true : mode === 'pending' ? a.status === 'pending_verification' : a.status === 'verified').length
                })
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#0c0814]/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-white/5 uppercase tracking-wider text-purple-300 border-b border-white/10 text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Randomize ID</th>
                  <th className="py-3.5 px-4 font-bold">Member Details</th>
                  <th className="py-3.5 px-4 font-bold">Phone Number</th>
                  <th className="py-3.5 px-4 font-bold">Pitched By</th>
                  <th className="py-3.5 px-4 font-bold">Plan & Amount</th>
                  <th className="py-3.5 px-4 font-bold">Payment Ref / UTR</th>
                  <th className="py-3.5 px-4 font-bold text-center">Receipt</th>
                  <th className="py-3.5 px-4 font-bold text-center">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading && apps.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-zinc-500 font-mono">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-400" />
                      Loading submissions...
                    </td>
                  </tr>
                ) : filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-zinc-500 font-mono">
                      No applications match the current filter.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((a) => {
                    const isInvalidOcrId = a.payment_reference_id?.toUpperCase().startsWith('RCPT');

                    return (
                      <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-cyan-300 align-top">
                          {a.randomize_id}
                        </td>
                        <td className="py-3 px-4 align-top space-y-1">
                          <div className="font-semibold text-white">{a.full_name}</div>
                          <div className="text-[11px] text-zinc-400 font-mono">
                            Reg: {a.registration_number} | {a.outlook_email}
                          </div>
                          <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1 pt-0.5 border-t border-white/5">
                            <Clock className="w-3 h-3 text-zinc-400 inline" />
                            <span>Submitted: {formatSubmissionTimestamp(a.created_at)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-zinc-300 align-top whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                            <Phone className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{a.phone_number || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-pink-300 align-top">
                          {a.referral || <span className="text-zinc-500">-</span>}
                        </td>
                        <td className="py-3 px-4 align-top">
                          <span className="font-semibold text-zinc-200">{a.registration_type}</span>
                          <div className="text-pink-400 font-mono font-bold">₹{a.amount}</div>
                        </td>
                        <td className="py-3 px-4 font-mono align-top">
                          <div className="font-semibold text-amber-300 break-all">
                            {a.payment_reference_id}
                          </div>
                          {isInvalidOcrId && (
                            <div className="text-[10px] text-red-400 font-sans flex items-center gap-1 mt-1 bg-red-950/40 border border-red-800/40 px-2 py-0.5 rounded leading-tight">
                              <AlertTriangle className="w-3 h-3 shrink-0 text-red-400" />
                              <span>transaction id is incorrect bcz OCR was removed</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center align-top">
                          <button
                            onClick={() => setActiveImageModal(a.payment_screenshot_url)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[11px] text-zinc-200 transition-colors min-h-[36px]"
                          >
                            <Eye className="w-3.5 h-3.5 text-cyan-400" /> View
                          </button>
                        </td>
                        <td className="py-3 px-4 text-center align-top">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            a.status === 'verified' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            a.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {a.status === 'pending_verification' ? 'Pending' : a.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5 align-top whitespace-nowrap">
                          {a.status === 'pending_verification' && (
                            <>
                              <button
                                disabled={processingId === a.id}
                                onClick={() => handleApprove(a)}
                                className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 min-h-[36px]"
                              >
                                Approve
                              </button>
                              <button
                                disabled={processingId === a.id}
                                onClick={() => handleReject(a)}
                                className="px-2.5 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 min-h-[36px]"
                              >
                                Reject
                              </button>
                            </>
                          )}
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

      {/* Image Preview Modal */}
      {activeImageModal && (
        <div 
          onClick={() => setActiveImageModal(null)} 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0f0b1c] border border-white/20 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-between"
            style={{ width: "540px", maxWidth: "92vw", minHeight: "400px" }}
          >
            <div className="w-full flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Payment Proof Receipt
              </span>
              <button 
                onClick={() => setActiveImageModal(null)}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full h-[320px] bg-black/60 rounded-2xl border border-white/10 flex flex-col items-center justify-center overflow-hidden p-2 relative">
              {activeImageModal.startsWith('http') ? (
                <img 
                  src={activeImageModal} 
                  alt="Payment Proof" 
                  className="w-full h-full object-contain rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                    const fb = document.getElementById('receipt-error-state');
                    if (fb) fb.style.display = 'flex';
                  }}
                />
              ) : null}

              <div 
                id="receipt-error-state" 
                className={`flex-col items-center justify-center p-6 text-center space-y-3 ${activeImageModal.startsWith('http') ? 'hidden' : 'flex'}`}
              >
                <p className="text-xs text-amber-300 font-mono">
                  Direct image preview unavailable
                </p>
                <p className="text-[11px] text-gray-400 break-all max-w-[380px] bg-black/40 p-2 rounded-lg border border-white/10 font-mono">
                  {activeImageModal}
                </p>
                {activeImageModal.startsWith('http') && (
                  <a
                    href={activeImageModal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-xs font-bold text-white transition-all inline-flex items-center gap-2 font-mono"
                  >
                    Open Original Link <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            <div className="w-full flex items-center justify-between mt-4 pt-3 border-t border-white/10">
              {activeImageModal.startsWith('http') ? (
                <a
                  href={activeImageModal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                >
                  Open in New Tab <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : <div />}

              <button 
                onClick={() => setActiveImageModal(null)} 
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded-xl text-white transition-colors"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}