'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Send, Users, Mail, Trash2, RefreshCw, CheckCircle, 
  AlertTriangle, Clock, Eye, ChevronDown, ChevronUp, X
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import GlassmorphismCard from "@/components/GlassmorphismCard";
import type { User } from "@supabase/supabase-js";
import { logAction } from "@/lib/audit";

type Subscriber = {
  id: string;
  email: string;
  subscribed_at: string;
  unsubscribed_at?: string | null;
};

type SentEmail = {
  id: string;
  subject: string;
  sent_at: string;
  recipient_count: number;
  resend_id?: string;
  recipients?: string[];
};

type SendState = "idle" | "loading" | "success" | "error";

export default function AdminNewsletterPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // Auth Check
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/admin"); return; }

      const { data } = await supabase.from("admins").select("email").eq("email", user.email).single();
      if (!data) {
        await supabase.auth.signOut();
        router.push("/admin");
      } else {
        setUser(user);
      }
    };
    checkAuth();
  }, [router]);

  const [tab, setTab] = useState<"compose" | "subscribers" | "history">("compose");
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [sentEmails, setSentEmails] = useState<SentEmail[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);
  
  // Compose State
  const [fromName, setFromName] = useState("Randomize();");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sendState, setSendState] = useState<SendState>("idle");
  const [showPreview, setShowPreview] = useState(false);
  
  // UI State
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const activeCount = subscribers.filter(s => !s.unsubscribed_at).length;
  const unsubCount = subscribers.filter(s => s.unsubscribed_at).length;

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchSubscribers = useCallback(async () => {
    setLoadingSubs(true);
    const { data } = await supabase.from("newsletters_subscribers").select("*").order("subscribed_at", { ascending: false });
    if (data) setSubscribers(data as Subscriber[]);
    setLoadingSubs(false);
  }, []);

  const fetchSentEmails = useCallback(async () => {
    const { data } = await supabase.from("newsletter_sent_emails").select("*").order("sent_at", { ascending: false }).limit(50);
    if (data) setSentEmails(data as SentEmail[]);
  }, []);

  useEffect(() => {
    fetchSubscribers();
    fetchSentEmails();
  }, [fetchSubscribers, fetchSentEmails]);

  async function handleSend() {
    if (!subject.trim() || !body.trim()) {
      showToast("Add a subject and body before sending.", "error");
      return;
    }

    const activeEmails = subscribers.filter(s => !s.unsubscribed_at).map(s => s.email);

    if (activeEmails.length === 0) {
      showToast("You don't have any active subscribers yet.", "error");
      return;
    }

    setSendState("loading");

    try {
      const res = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body, fromName, recipients: activeEmails }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong. Try again?");

      // Save to Supabase History
      await supabase.from("newsletter_sent_emails").insert([{
        subject,
        sent_at: new Date().toISOString(),
        recipient_count: activeEmails.length,
        resend_id: json.id,
        recipients: activeEmails,
      }]);

      // 📝 AUDIT LOG: NEWSLETTER SENT
      await logAction(user?.email || 'Unknown', 'Sent Newsletter Campaign', { 
        subject: subject, 
        recipient_count: activeEmails.length 
      });

      setSendState("success");
      showToast(`Sent successfully to ${activeEmails.length} subscribers!`, "success");
      setSubject("");
      setBody("");
      fetchSentEmails();
      
      // Reset success state after a few seconds
      setTimeout(() => setSendState("idle"), 4000);

    } catch (err: any) {
      showToast(err.message || "Something went wrong.", "error");
      setSendState("error");
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const subToDelete = subscribers.find(s => s.id === id);
    
    await supabase.from("newsletters_subscribers").delete().eq("id", id);
    
    // 📝 AUDIT LOG: SUBSCRIBER REMOVED
    await logAction(user?.email || 'Unknown', 'Removed Newsletter Subscriber', { 
      subscriber_email: subToDelete?.email 
    });

    setSubscribers(prev => prev.filter(s => s.id !== id));
    setDeletingId(null);
    setConfirmDelete(null);
    showToast("Subscriber removed");
  }

  const filteredSubs = subscribers.filter(s => s.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative isolate overflow-hidden bg-transparent min-h-lvh text-white pb-24">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-24 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm shadow-lg border backdrop-blur-md ${
          toast.type === "success" ? "bg-green-500/20 border-green-500/50 text-green-300" : "bg-red-500/20 border-red-500/50 text-red-300"
        }`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-purple-600/[0.06] rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-600/[0.04] rounded-full blur-[140px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-24 z-10 relative">
        
        {/* Header Area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
              Newsletter Control
            </h1>
            <p className="text-sm text-gray-400 mt-2">Compose emails and manage your audience.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => { fetchSubscribers(); fetchSentEmails(); }} className="p-2.5 bg-white/5 border border-white/10 rounded-lg hover:border-purple-500/50 transition-colors">
              <RefreshCw className={`w-4 h-4 ${loadingSubs ? "animate-spin text-purple-400" : "text-gray-300"}`} />
            </button>
            <button onClick={() => router.push('/admin')} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-colors">
              Dashboard
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Subscribers", value: subscribers.length, color: "text-white", border: "border-white/10" },
            { label: "Active Audience", value: activeCount, color: "text-green-400", border: "border-green-500/30" },
            { label: "Unsubscribed", value: unsubCount, color: "text-red-400", border: "border-red-500/30" },
            { label: "Campaigns Sent", value: sentEmails.length, color: "text-purple-400", border: "border-purple-500/30" },
          ].map(stat => (
            <GlassmorphismCard key={stat.label} className={`p-5 border ${stat.border}`}>
              <div className={`text-3xl font-black ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{stat.label}</div>
            </GlassmorphismCard>
          ))}
        </div>

        {/* Custom Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => { setTab('compose'); setSendState("idle"); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${tab === 'compose' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-transparent text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
          >
            <Mail className="w-4 h-4" /> Compose Email
          </button>
          <button 
            onClick={() => setTab('subscribers')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${tab === 'subscribers' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-transparent text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
          >
            <Users className="w-4 h-4" /> Subscribers
          </button>
          <button 
            onClick={() => setTab('history')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${tab === 'history' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-transparent text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
          >
            <Clock className="w-4 h-4" /> Campaign History
          </button>
        </div>

        {/* ── Write (Compose) ── */}
        {tab === "compose" && (
          <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
            <GlassmorphismCard className="lg:col-span-7 p-6 border-purple-500/30">
              <h2 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-500">
                New Campaign
              </h2>

              <div className="space-y-5">
                <Field label="From Name">
                  <input value={fromName} onChange={e => setFromName(e.target.value)} className="inp" placeholder="Randomize();" />
                </Field>

                <Field label="Email Subject">
                  <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Exciting news from the club..." className="inp text-lg font-medium" />
                </Field>

                <Field label="Email Body (HTML Supported)">
                  <textarea
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    placeholder={"<h2>Hey everyone!</h2>\n<p>Here is what is happening this week...</p>"}
                    rows={12}
                    className="inp resize-y font-mono text-xs leading-relaxed"
                  />
                </Field>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                  <button onClick={() => setShowPreview(p => !p)} className="flex items-center gap-2 px-5 py-2.5 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                    <Eye className="w-4 h-4" />
                    {showPreview ? "Hide Preview" : "Show Preview"}
                  </button>

                  <button
                    onClick={handleSend}
                    disabled={sendState === "loading" || sendState === "success"}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] rounded-lg text-white text-sm font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
                  >
                    {sendState === "loading" ? (
                      <><RefreshCw className="w-4 h-4 animate-spin" /> Sending to {activeCount}...</>
                    ) : sendState === "success" ? (
                      <><CheckCircle className="w-4 h-4" /> Sent successfully!</>
                    ) : (
                      <><Send className="w-4 h-4" /> Send Campaign</>
                    )}
                  </button>
                </div>
              </div>
            </GlassmorphismCard>

            {/* Live Preview Pane */}
            <div className={`lg:col-span-5 transition-all duration-300 ${showPreview ? 'opacity-100' : 'opacity-0 hidden lg:block lg:opacity-50'}`}>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                <Eye className="w-4 h-4" /> Live Preview
              </h2>
              <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
                <div className="bg-gray-100/80 px-5 py-4 border-b border-gray-200 text-xs text-gray-600 space-y-1.5">
                  <p><span className="font-bold text-gray-800 uppercase tracking-wider">From:</span> {fromName}</p>
                  <p><span className="font-bold text-gray-800 uppercase tracking-wider">Subject:</span> <span className="text-gray-900 text-sm font-medium">{subject || "—"}</span></p>
                </div>
                <div
                  className="p-8 text-black text-sm min-h-[400px] max-h-[600px] overflow-y-auto prose prose-sm max-w-none bg-white"
                  dangerouslySetInnerHTML={{
                    __html: body || "<p style='color:#aaa; font-style:italic;'>Your email body will appear here. You can use HTML tags like &lt;h1&gt;, &lt;b&gt;, or &lt;a&gt;.</p>"
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Subscribers ── */}
        {tab === "subscribers" && (
          <GlassmorphismCard className="p-1 animate-in fade-in duration-300 border-blue-500/30">
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">Audience List</h2>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search emails..."
                className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 w-full sm:w-64"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase bg-white/5">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Email Address</th>
                    <th className="px-6 py-4 font-semibold hidden sm:table-cell">Subscribed On</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loadingSubs ? (
                    <tr><td colSpan={4} className="text-center py-12"><RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500" /></td></tr>
                  ) : filteredSubs.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-12 text-gray-500">No subscribers found.</td></tr>
                  ) : (
                    filteredSubs.map(sub => (
                      <tr key={sub.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 font-mono text-gray-300">{sub.email}</td>
                        <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">
                          {new Date(sub.subscribed_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-6 py-4">
                          {sub.unsubscribed_at ? (
                            <span className="px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider">Unsubscribed</span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider">Active</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {confirmDelete === sub.id ? (
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleDelete(sub.id)} disabled={deletingId === sub.id} className="px-3 py-1.5 bg-red-500/20 border border-red-500/40 text-red-300 rounded text-xs hover:bg-red-500/30 transition-colors disabled:opacity-50">
                                {deletingId === sub.id ? "..." : "Confirm"}
                              </button>
                              <button onClick={() => setConfirmDelete(null)} className="px-3 py-1.5 bg-white/5 border border-white/10 text-gray-400 rounded text-xs hover:text-white transition-colors">Cancel</button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmDelete(sub.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassmorphismCard>
        )}

        {/* ── History ── */}
        {tab === "history" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {sentEmails.length === 0 ? (
              <GlassmorphismCard className="p-16 text-center text-gray-500 border-emerald-500/30">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg">No campaigns sent yet.</p>
                <p className="text-sm mt-2 text-gray-600">Your sent history will appear here.</p>
              </GlassmorphismCard>
            ) : (
              sentEmails.map(email => {
                const isExpanded = expandedId === email.id;
                const sentTo = email.recipients ?? [];
                
                return (
                  <GlassmorphismCard key={email.id} className="border-emerald-500/20 overflow-hidden transition-all hover:border-emerald-500/40">
                    <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : email.id)}>
                      <div>
                        <h3 className="font-bold text-lg text-white">{email.subject}</h3>
                        <p className="text-xs text-gray-500 font-mono mt-1">ID: {email.resend_id || "N/A"}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 shrink-0">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                          <Users className="w-3.5 h-3.5 text-blue-400" /> {email.recipient_count} Delivered
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                          <Clock className="w-3.5 h-3.5 text-emerald-400" /> {new Date(email.sent_at).toLocaleString()}
                        </span>
                        <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-white/10 p-5 bg-black/40">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5" /> Successful Deliveries ({sentTo.length})
                        </h4>
                        {sentTo.length === 0 ? (
                          <p className="text-sm text-gray-500">No recipient data saved for this old campaign.</p>
                        ) : (
                          <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                            {sentTo.map(e => (
                              <span key={e} className="text-xs font-mono text-gray-300 bg-black/50 border border-white/5 px-3 py-1.5 rounded-md">
                                {e}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </GlassmorphismCard>
                );
              })
            )}
          </div>
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
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

// Helper Component for forms
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}