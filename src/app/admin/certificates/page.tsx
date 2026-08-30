'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  FileSpreadsheet,
  ArrowLeft,
  ShieldAlert,
  Lock
} from 'lucide-react';
import Link from 'next/link';

interface CertificateAttendee {
  id: string;
  full_name: string;
  registration_number: string;
  personal_email: string;
  outlook_email: string;
  certificate_url: string | null;
  certificate_issued_at: string | null;
  day1_confirmed: boolean;
  day2_confirmed: boolean;
}

export default function AdminCertificatesPage() {
  const [attendees, setAttendees] = useState<CertificateAttendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'claimed' | 'unclaimed'>('all');
  const router = useRouter();

  // Admin permission check
  useEffect(() => {
    const verifyAdmin = async () => {
      setAuthChecking(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || !user.email) {
        setIsAuthorizedAdmin(false);
        setAuthChecking(false);
        return;
      }

      setAdminEmail(user.email.trim().toLowerCase());

      const { data: adminRecord, error } = await supabase
        .from('admins')
        .select('*')
        .ilike('email', user.email.trim().toLowerCase())
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

  // Fetch certificate eligible attendees
  const fetchCertificateStats = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    const { data, error } = await supabase
      .from('event_registrations')
      .select('id, full_name, registration_number, personal_email, outlook_email, certificate_url, certificate_issued_at, day1_confirmed, day2_confirmed')
      .or('day1_confirmed.eq.true,day2_confirmed.eq.true')
      .order('full_name', { ascending: true });

    if (!error && data) {
      setAttendees(data as CertificateAttendee[]);
    }
    if (!isSilent) setLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthorizedAdmin) {
      fetchCertificateStats();
    }
  }, [isAuthorizedAdmin, fetchCertificateStats]);

  // Export CSV Report
  const exportCSV = () => {
    const headers = ['Registration Number', 'Full Name', 'Personal Email', 'Outlook Email', 'Certificate Claimed', 'Issued At', 'Certificate URL'];
    const rows = attendees.map((a) => [
      `"${a.registration_number || ''}"`,
      `"${a.full_name || ''}"`,
      `"${a.personal_email || ''}"`,
      `"${a.outlook_email || ''}"`,
      a.certificate_url ? 'YES' : 'NO',
      a.certificate_issued_at ? new Date(a.certificate_issued_at).toLocaleString() : 'N/A',
      `"${a.certificate_url || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Certificate_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalEligible = attendees.length;
  const totalClaimed = attendees.filter((a) => a.certificate_url !== null).length;
  const percentage = totalEligible > 0 ? Math.round((totalClaimed / totalEligible) * 100) : 0;

  const filteredList = useMemo(() => {
    return attendees.filter((item) => {
      const matchesSearch =
        item.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.registration_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.personal_email?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (filterStatus === 'claimed') return item.certificate_url !== null;
      if (filterStatus === 'unclaimed') return item.certificate_url === null;
      return true;
    });
  }, [attendees, searchQuery, filterStatus]);

  if (authChecking) {
    return (
      <main className="min-h-screen bg-[#07050e] text-white flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-purple-400" />
          <p className="text-sm text-gray-400">Verifying Admin Access...</p>
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
          <p className="text-sm text-gray-400 leading-relaxed">
            You do not have administrative authorization to view certificate analytics.
          </p>
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" /> Return to Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07050e] text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-sky-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                Event Certificates Analytics
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              &lt;HELLO WORLD/&gt; • Issuance & Real-Time Download Status
            </p>
          </div>

          <button
            onClick={() => fetchCertificateStats(false)}
            disabled={loading}
            className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-2 transition-colors min-h-[40px]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-purple-400' : ''}`} />
            Refresh Data
          </button>
        </header>

        {/* KPI Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0f0b1c] border border-purple-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Certificates Downloaded</p>
                <h3 className="text-3xl font-extrabold text-white mt-1">
                  {totalClaimed} <span className="text-sm font-normal text-gray-500">/ {totalEligible}</span>
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Award className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 w-full bg-white/5 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-2 font-mono">{percentage}% claimed</p>
          </div>

          <div className="bg-[#0f0b1c] border border-white/10 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Eligible Students</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{totalEligible}</h3>
              <p className="text-[11px] text-gray-500 mt-1">Marked present on Day 1 or Day 2</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-[#0f0b1c] border border-white/10 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Unclaimed Certificates</p>
              <h3 className="text-3xl font-extrabold text-yellow-400 mt-1">{totalEligible - totalClaimed}</h3>
              <p className="text-[11px] text-gray-500 mt-1">Eligible attendees yet to claim</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </section>

        {/* Search, Filters & Attendee Table */}
        <div className="bg-[#0f0b1c] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, reg no, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:border-purple-400 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
              <div className="flex bg-black/40 border border-white/10 rounded-xl p-0.5 text-xs">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${filterStatus === 'all' ? 'bg-purple-600 text-white font-semibold' : 'text-gray-400 hover:text-white'}`}
                >
                  All ({attendees.length})
                </button>
                <button
                  onClick={() => setFilterStatus('claimed')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${filterStatus === 'claimed' ? 'bg-green-600 text-white font-semibold' : 'text-gray-400 hover:text-white'}`}
                >
                  Claimed ({totalClaimed})
                </button>
                <button
                  onClick={() => setFilterStatus('unclaimed')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${filterStatus === 'unclaimed' ? 'bg-yellow-600 text-white font-semibold' : 'text-gray-400 hover:text-white'}`}
                >
                  Unclaimed ({totalEligible - totalClaimed})
                </button>
              </div>

              <button
                onClick={exportCSV}
                className="px-3.5 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-green-400" /> Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-white/[0.03] text-gray-400 uppercase font-mono text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Participant</th>
                  <th className="py-3 px-4">Reg No</th>
                  <th className="py-3 px-4">Personal Gmail</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Claimed At</th>
                  <th className="py-3 px-4 text-right">PDF File</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-purple-400" />
                      Loading certificate attendance records...
                    </td>
                  </tr>
                ) : filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No matching attendees found.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((attendee) => {
                    const isClaimed = !!attendee.certificate_url;
                    return (
                      <tr key={attendee.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 font-semibold text-white">{attendee.full_name}</td>
                        <td className="py-3 px-4 font-mono text-gray-400">{attendee.registration_number}</td>
                        <td className="py-3 px-4 text-gray-400">{attendee.personal_email}</td>
                        <td className="py-3 px-4 text-center">
                          {isClaimed ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/30">
                              <CheckCircle2 className="w-3 h-3" /> Downloaded
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                              <Clock className="w-3 h-3" /> Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-400 text-[11px]">
                          {attendee.certificate_issued_at
                            ? new Date(attendee.certificate_issued_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                            : '—'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {attendee.certificate_url ? (
                            <a
                              href={attendee.certificate_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 font-semibold"
                            >
                              View PDF <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-gray-600 text-xs">—</span>
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
    </main>
  );
}