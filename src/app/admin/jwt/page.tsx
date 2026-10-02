'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { 
  Search, Phone, Mail, BookOpen, Home, Calendar, 
  ExternalLink, X, Copy, CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function JWTAdminDashboard() {
  const router = useRouter();
  
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [shiftFilter, setShiftFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      // Fetch all JWT applications
      const { data: appsData, error: appsError } = await supabase
        .from('jwt_recruitment_26')
        .select('*')
        .order('id', { ascending: false });

      if (appsError) throw appsError;

      // Fetch ALL directory data for contact/location info
      const regNumbers = appsData.map(a => a.registration_number);
      const { data: dirData, error: dirError } = await supabase
        .from('randomize_directory')
        .select('*')
        .in('registration_number', regNumbers);

      if (dirError) throw dirError;

      // Merge the application data with the directory contact data
      const mergedData = appsData.map(app => {
        const dirMatch = dirData.find(d => String(d.registration_number) === String(app.registration_number)) || {};
        return { ...dirMatch, ...app }; 
      });

      setApplications(mergedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkAuthAndFetch = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) { 
        router.push('/admin'); 
        return; 
      }

      const { data: admin } = await supabase
        .from('admins')
        .select('*')
        .eq('email', user.email);
      
      const currentAdmin = admin?.[0];
      
      // Enforce the specific 'jwt' permission to access this page
      if (!currentAdmin || !currentAdmin.permissions?.includes('jwt')) { 
        router.push('/admin'); 
        return; 
      }

      await fetchApplications();
      
    } catch (err: any) {
      setError('Authentication failure.');
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { 
    checkAuthAndFetch(); 
  }, [checkAuthAndFetch]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      app.registration_number?.includes(searchTerm) ||
      app.randomize_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDomain = domainFilter === 'All' || (app.domain_preferences && app.domain_preferences.includes(domainFilter));
    const matchesShift = shiftFilter === 'All' || app.shift_preference === shiftFilter;

    return matchesSearch && matchesDomain && matchesShift;
  });

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full" /></div>;

  return (
    <div className="relative isolate min-h-screen bg-[#050505] text-white p-4 sm:p-8 pt-32 sm:pt-40 font-sans overflow-x-hidden">
      
      {/* Matrix Background & Glow Effects */}
      <div className="fixed inset-0 pointer-events-none -z-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      <div className="fixed top-[10%] left-[20%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-[20%] right-[20%] w-[500px] h-[500px] bg-pink-600/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              JWT Recruitment Admin
            </h1>
            <p className="text-gray-400 text-sm mt-1">Review applications and contact candidates for interviews.</p>
          </div>
          <div className="text-right flex items-center gap-4">
            <button 
              onClick={() => router.push('/admin')}
              className="text-gray-400 hover:text-white transition-colors text-sm font-bold border border-white/10 px-4 py-2 rounded-lg bg-white/5"
            >
              Back to Portal
            </button>
            <p className="text-2xl font-bold">{filteredApps.length} <span className="text-sm font-normal text-gray-500">Total Applicants</span></p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl backdrop-blur-md">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search name, reg no, ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-purple-500 transition-colors backdrop-blur-md"
            />
          </div>
          
          <select 
            value={domainFilter} 
            onChange={(e) => setDomainFilter(e.target.value)}
            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-purple-500 appearance-none cursor-pointer backdrop-blur-md"
          >
            <option value="All" className="bg-[#0c0812]">All Domains</option>
            <option value="Tech" className="bg-[#0c0812]">Tech</option>
            <option value="Events & operation" className="bg-[#0c0812]">Events</option>
            <option value="Gd" className="bg-[#0c0812]">Graphic Design</option>
            <option value="Social media & coverage" className="bg-[#0c0812]">Social Media</option>
            <option value="FNR" className="bg-[#0c0812]">Finance (FNR)</option>
            <option value="Editorial" className="bg-[#0c0812]">Editorial</option>
            <option value="Outreach & promotions" className="bg-[#0c0812]">Outreach</option>
          </select>

          <select 
            value={shiftFilter} 
            onChange={(e) => setShiftFilter(e.target.value)}
            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-purple-500 appearance-none cursor-pointer backdrop-blur-md"
          >
            <option value="All" className="bg-[#0c0812]">All Shifts</option>
            <option value="Morning" className="bg-[#0c0812]">Morning Shift</option>
            <option value="Evening" className="bg-[#0c0812]">Evening Shift</option>
          </select>
        </div>

        {/* Data Table */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 border-b border-white/10 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Shift & Accommodation</th>
                  <th className="px-6 py-4">Domain Preferences</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.04] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{app.full_name}</div>
                      <div className="text-gray-500 font-mono mt-0.5">{app.registration_number} • {app.randomize_id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Phone className="w-3 h-3 text-purple-400" /> {app.phone_number}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 mt-1">
                        <Mail className="w-3 h-3 text-purple-400" /> {app.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center px-2 py-1 rounded-md bg-white/5 text-gray-300 text-xs font-bold border border-white/10">
                        {app.shift_preference || 'N/A'}
                      </div>
                      <div className="text-gray-500 mt-1 text-xs">
                        {app.accommodation || 'Unknown'} • Yr {app.year_of_study}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-normal min-w-[200px]">
                      <div className="flex flex-wrap gap-1.5 items-start">
                        {app.domain_preferences?.map((domain: string, idx: number) => (
                          <span key={idx} className="text-purple-300 bg-purple-500/10 px-2.5 py-0.5 rounded-md text-[10px] font-bold border border-purple-500/20">
                            {domain}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedApp(app)}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors border border-white/10"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredApps.length === 0 && (
              <div className="p-12 text-center text-gray-500">No applications found matching your filters.</div>
            )}
          </div>
        </div>

      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c0a10] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedApp.full_name}</h2>
                  <p className="text-xs font-mono text-purple-400 mt-1">{selectedApp.randomize_id} • {selectedApp.registration_number}</p>
                </div>
                <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">
                
                {/* Contact & Academic Block */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Contact Details</h3>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3 text-sm"><Phone className="w-4 h-4 text-purple-400" /> {selectedApp.phone_number}</div>
                      <button onClick={() => handleCopy(selectedApp.phone_number, 'phone')} className="text-gray-500 hover:text-white transition-colors">{copied === 'phone' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}</button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3 text-sm"><Mail className="w-4 h-4 text-purple-400" /> {selectedApp.email}</div>
                      <button onClick={() => handleCopy(selectedApp.email, 'email')} className="text-gray-500 hover:text-white transition-colors">{copied === 'email' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}</button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3 text-sm text-gray-400"><Mail className="w-4 h-4 text-pink-400" /> {selectedApp.outlook_email || 'N/A'}</div>
                      {selectedApp.outlook_email && (
                        <button onClick={() => handleCopy(selectedApp.outlook_email, 'outlook')} className="text-gray-500 hover:text-white transition-colors">{copied === 'outlook' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}</button>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Academic & Location</h3>
                    
                    <div className="flex items-center gap-3 text-sm"><BookOpen className="w-4 h-4 text-purple-400" /> {selectedApp.course || 'Course not specified'}</div>
                    <div className="flex items-center gap-3 text-sm"><Home className="w-4 h-4 text-purple-400" /> {selectedApp.accommodation || 'Accommodation not specified'}</div>
                    <div className="flex items-center gap-3 text-sm"><Calendar className="w-4 h-4 text-purple-400" /> Shift: <span className="font-bold text-white">{selectedApp.shift_preference || 'Not Specified'}</span></div>
                  </div>
                </div>

                {/* Domain Preferences */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Domain Preferences</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.domain_preferences?.map((domain: string, idx: number) => (
                      <div key={idx} className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-sm font-bold text-purple-200">
                        {idx + 1}. {domain}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Details */}
                {selectedApp.domain_preferences?.includes('Tech') && (
                  <div className="p-5 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-2">Tech Portfolio</h3>
                    {selectedApp.resume_s3_url ? (
                      <a href={selectedApp.resume_s3_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-blue-300 hover:text-blue-100 bg-blue-500/20 px-4 py-2 rounded-lg transition-colors">
                        <ExternalLink className="w-4 h-4" /> View Resume PDF
                      </a>
                    ) : (
                      <div className="inline-flex items-center gap-2 text-sm text-gray-400 bg-black/40 px-4 py-2 rounded-lg">
                        No Resume Submitted
                      </div>
                    )}
                    {selectedApp.github_link && (
                      <a href={selectedApp.github_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white bg-white/10 ml-3 px-4 py-2 rounded-lg transition-colors">
                        <ExternalLink className="w-4 h-4" /> GitHub Profile
                      </a>
                    )}
                    <div className="mt-4">
                      <p className="text-xs text-gray-400 mb-1">Tech Stack & Skills:</p>
                      <p className="text-sm bg-black/40 p-3 rounded-lg border border-white/5 whitespace-pre-wrap leading-relaxed">{selectedApp.tech_stack || 'None provided'}</p>
                    </div>
                  </div>
                )}

                {/* Graphic Design Details */}
                {selectedApp.domain_preferences?.includes('Gd') && (
                  <div className="p-5 rounded-xl border border-pink-500/20 bg-pink-500/5 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-pink-400 mb-2">Graphic Design Portfolio</h3>
                    {selectedApp.gdrive_portfolio_link && (
                      <a href={selectedApp.gdrive_portfolio_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-pink-300 hover:text-pink-100 bg-pink-500/20 px-4 py-2 rounded-lg transition-colors">
                        <ExternalLink className="w-4 h-4" /> View Drive Portfolio
                      </a>
                    )}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Previous GD Experience:</p>
                        <p className="text-sm font-bold text-white">{selectedApp.has_graphic_design_exp ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Skill Level:</p>
                        <p className="text-sm font-bold text-white">{selectedApp.graphic_design_level || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Tools Used:</p>
                        <p className="text-sm font-bold text-white">{selectedApp.design_tools_used || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">3D Design Familiarity:</p>
                        <p className="text-sm font-bold text-white">{selectedApp.is_3d_familiar ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Social Media Details */}
                {selectedApp.domain_preferences?.includes('Social media & coverage') && (
                  <div className="p-5 rounded-xl border border-orange-500/20 bg-orange-500/5 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-orange-400 mb-2">Social Media & Video</h3>
                    {selectedApp.video_portfolio_link && (
                      <a href={selectedApp.video_portfolio_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-orange-300 hover:text-orange-100 bg-orange-500/20 px-4 py-2 rounded-lg transition-colors mb-4">
                        <ExternalLink className="w-4 h-4" /> View Video Edits Drive
                      </a>
                    )}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Social Reach Strategy:</p>
                        <p className="text-sm bg-black/40 p-3 rounded-lg border border-white/5 whitespace-pre-wrap leading-relaxed">{selectedApp.social_reach_strategy || 'None provided'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Video Editing Exp:</p>
                          <p className="text-sm font-bold text-white">{selectedApp.has_video_exp ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Video Tools Used:</p>
                          <p className="text-sm font-bold text-white">{selectedApp.video_tools_used || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Outreach Details */}
                {selectedApp.domain_preferences?.includes('Outreach & promotions') && (
                  <div className="p-5 rounded-xl border border-teal-500/20 bg-teal-500/5 space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-teal-400 mb-2">Outreach Assessment</h3>
                    <p className="text-xs text-gray-400 mb-1">Research Strategy:</p>
                    <p className="text-sm bg-black/40 p-3 rounded-lg border border-white/5 whitespace-pre-wrap leading-relaxed">{selectedApp.outreach_research_strategy || 'None provided'}</p>
                  </div>
                )}

                {/* Editorial Details */}
                {selectedApp.domain_preferences?.includes('Editorial') && (
                  <div className="p-5 rounded-xl border border-yellow-500/20 bg-yellow-500/5 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-yellow-400 mb-2">Editorial Assessment</h3>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Blank Page Process:</p>
                      <p className="text-sm bg-black/40 p-3 rounded-lg border border-white/5 whitespace-pre-wrap leading-relaxed">{selectedApp.editorial_blank_page_process || 'None provided'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Urgent Draft Action:</p>
                      <p className="text-sm bg-black/40 p-3 rounded-lg border border-white/5 whitespace-pre-wrap leading-relaxed">{selectedApp.editorial_urgent_draft_action || 'None provided'}</p>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}