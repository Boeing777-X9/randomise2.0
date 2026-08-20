'use client';

import { useEffect, useState, Suspense, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

interface EventData {
  id: string;
  title: string;
  registration_live: boolean;
  whatsapp_group_link: string;
  event_slug?: string;
  slug?: string;
}

interface SuccessData {
  registration_id: string;
  whatsapp_group_link: string;
  isExisting?: boolean;
  full_name?: string;
}

const MUJ_COURSES = [
  { name: "B.Tech (All Branches)", duration: 4 },
  { name: "BCA", duration: 3 },
  { name: "BCA (Hons)", duration: 4 },
  { name: "BBA", duration: 3 },
  { name: "BBA (Hons)", duration: 4 },
  { name: "B.Com", duration: 3 },
  { name: "B.Com (Hons)", duration: 4 },
  { name: "BA", duration: 3 },
  { name: "BA (Hons)", duration: 4 },
  { name: "B.Sc", duration: 3 },
  { name: "B.Sc (Hons)", duration: 4 },
  { name: "B.Arch", duration: 5 },
  { name: "B.Des", duration: 4 },
  { name: "BFA", duration: 4 },
  { name: "LLB", duration: 3 },
  { name: "BA-LLB / BBA-LLB (Integrated)", duration: 5 },
  { name: "Integrated MBA", duration: 5 },
  { name: "M.Tech", duration: 2 },
  { name: "MCA", duration: 2 },
  { name: "MBA", duration: 2 },
  { name: "M.Com", duration: 2 },
  { name: "M.Sc", duration: 2 },
  { name: "MA", duration: 2 },
  { name: "LLM", duration: 1 },
];

function EventRegistrationFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');

  const [user, setUser] = useState<User | null>(null);
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [existingRandomizeId, setExistingRandomizeId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    outlookEmail: '',
    registrationNumber: '',
    courseIndex: 0,
    whatsappNumber: '',
    joinedWhatsapp: 'No',
  });

  useEffect(() => {
    const initialize = async () => {
      if (!eventId) {
        router.push('/events');
        return;
      }

      const eventPromise = supabase.from('events').select('*').eq('id', eventId).single();
      const userPromise = supabase.auth.getUser();

      const [eventResponse, userResponse] = await Promise.all([eventPromise, userPromise]);

      const eventData = eventResponse.data;
      const currentUser = userResponse.data?.user;

      if (!eventData || !eventData.registration_live) {
        router.push('/events');
        return;
      }

      setEvent(eventData as EventData);

      if (currentUser) {
        setUser(currentUser);

        // 1. Check if already registered for this specific event
        const { data: existingReg } = await supabase
          .from('event_registrations')
          .select('randomize_id, full_name')
          .eq('event_id', eventId)
          .or(`user_id.eq.${currentUser.id},personal_email.ilike.${currentUser.email}`)
          .maybeSingle();

        if (existingReg) {
          setSuccessData({
            registration_id: existingReg.randomize_id,
            whatsapp_group_link: eventData.whatsapp_group_link,
            isExisting: true,
            full_name: existingReg.full_name,
          });
          setLoading(false);
          return;
        }

        // 2. Auto-fill: Check randomize_directory first, fallback to hello_world_26
        const cleanEmail = currentUser.email?.toLowerCase().trim();
        let userProfile: any = null;
        let foundId: string | null = null;

        const { data: directoryProfile } = await supabase
          .from('randomize_directory')
          .select('*')
          .or(`email.ilike.${cleanEmail},outlook_email.ilike.${cleanEmail}`)
          .maybeSingle();

        if (directoryProfile) {
          userProfile = directoryProfile;
          foundId = directoryProfile.randomize_id;
        } else {
          const { data: hwProfile } = await supabase
            .from('hello_world_26')
            .select('*')
            .or(`personal_email.ilike.${cleanEmail},outlook_email.ilike.${cleanEmail}`)
            .maybeSingle();

          if (hwProfile) {
            userProfile = {
              name: hwProfile.full_name,
              outlook_email: hwProfile.outlook_email,
              registration_number: hwProfile.registration_number,
              phone_number: hwProfile.whatsapp_number,
              course: hwProfile.course_name,
            };
            foundId = hwProfile.registration_id;
          }
        }

        if (userProfile && foundId) {
          setExistingRandomizeId(foundId);

          const foundCourseIdx = MUJ_COURSES.findIndex(
            (c) => c.name.toLowerCase() === (userProfile.course || '').toLowerCase()
          );

          setFormData((prev) => ({
            ...prev,
            fullName: userProfile.name || currentUser.user_metadata?.full_name || '',
            outlookEmail: userProfile.outlook_email || '',
            registrationNumber: userProfile.registration_number || '',
            courseIndex: foundCourseIdx !== -1 ? foundCourseIdx : 0,
            whatsappNumber: userProfile.phone_number || '',
          }));
        } else if (currentUser.user_metadata?.full_name) {
          setFormData((prev) => ({
            ...prev,
            fullName: currentUser.user_metadata.full_name,
          }));
        }
      }
      setLoading(false);
    };

    initialize();
  }, [eventId, router]);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/events/form?eventId=${eventId}` },
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user || !eventId) {
      setError("User session or event ID is missing.");
      return;
    }

    const cleanOutlook = formData.outlookEmail.trim().toLowerCase();
    const cleanRegNo = formData.registrationNumber.trim().toUpperCase();

    if (!cleanOutlook.endsWith('@muj.manipal.edu')) {
      setError("Outlook email must end with @muj.manipal.edu");
      return;
    }

    if (!cleanOutlook.includes(cleanRegNo.toLowerCase())) {
      setError("Registration number does not match the Outlook email.");
      return;
    }

    setSubmitting(true);
    try {
      const selectedCourse = MUJ_COURSES[formData.courseIndex];

      // Direct RPC Call to execute PostgreSQL counter + array append logic
      const { data, error: rpcError } = await supabase.rpc('register_for_event', {
        p_event_id: eventId,
        p_user_id: user.id,
        p_personal_email: user.email?.toLowerCase().trim(),
        p_outlook_email: cleanOutlook,
        p_full_name: formData.fullName.trim(),
        p_registration_number: cleanRegNo,
        p_whatsapp_number: formData.whatsappNumber.trim(),
        p_joined_whatsapp: formData.joinedWhatsapp === 'Yes',
        p_course_name: selectedCourse.name,
        p_course_duration: selectedCourse.duration
      });

      if (rpcError) throw rpcError;

      if (data?.success) {
        setSuccessData({
          registration_id: data.registration_id,
          whatsapp_group_link: event?.whatsapp_group_link || '',
          isExisting: false,
          full_name: data.full_name
        });
      } else {
        throw new Error("Unable to complete registration. Please try again.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to register. You may have already registered.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white w-full">Loading...</div>;

  return (
    <div className="w-[90vw] md:w-[600px] lg:w-[700px] mx-auto relative z-10 flex flex-col">
      <div className="w-full mb-6">
        <button onClick={() => router.push('/events')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors whitespace-nowrap">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </button>
      </div>

      <div className="w-full bg-[#0c0812]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 sm:p-10 shadow-2xl">
        {!successData && (
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 text-center sm:text-left">
            Register for {event?.title}
          </h1>
        )}

        {!user ? (
          <div className="w-full py-12">
            <p className="text-gray-300 mb-8 text-base sm:text-lg text-center">
              You must sign in with your personal Google account to continue registration.
            </p>
            <div className="w-full flex justify-center">
              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-3 w-[280px] sm:w-[350px] py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] hover:shadow-xl hover:shadow-purple-500/30 transition-transform hover:scale-105 cursor-pointer"
              >
                <svg className="w-5 h-5 bg-white rounded-full p-0.5 shrink-0" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
                <span>Sign In with Google</span>
              </button>
            </div>
          </div>
        ) : successData ? (
          <div className="w-full py-4 sm:py-8 flex flex-col items-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/50 shrink-0">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>

            {successData.isExisting ? (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center">
                  You're already registered, {successData.full_name?.split(' ')[0]}!
                </h2>
                <p className="text-gray-400 mb-8 text-center px-2">Here are your registration details for <span className="text-white font-semibold">{event?.title}</span>.</p>
              </>
            ) : (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center">Registration Successful!</h2>
                <p className="text-gray-400 mb-8 text-center">Your registration ID is securely generated.</p>
              </>
            )}

            <div className="bg-black/40 border border-white/10 rounded-xl p-6 mb-8 w-[280px] sm:w-[350px] flex flex-col items-center justify-center">
              <p className="text-sm text-purple-300 font-semibold uppercase tracking-wider mb-2">Registration ID</p>
              <p className="text-3xl sm:text-4xl font-black text-white tracking-widest">{successData.registration_id}</p>
            </div>

            {successData.whatsapp_group_link && (
              <div className="w-full flex flex-col items-center">
                <p className="text-gray-300 text-center px-4 mb-4">Don't forget to join the WhatsApp group for updates!</p>
                <div className="w-full flex justify-center">
                  <a
                    href={successData.whatsapp_group_link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-[280px] sm:w-[350px] py-4 rounded-xl font-bold text-white bg-green-600 hover:bg-green-500 transition-colors"
                  >
                    Join WhatsApp Group
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 mt-8 w-full">
            {existingRandomizeId && (
              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-purple-300 font-bold uppercase tracking-wider block">
                    Recognized Member
                  </span>
                  <span className="text-xs text-gray-300">
                    Details loaded from directory. Update any field if needed.
                  </span>
                </div>
                <span className="px-3 py-1 bg-black/40 border border-white/10 rounded-lg text-xs font-mono font-bold text-white tracking-wider">
                  {existingRandomizeId}
                </span>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-300">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-1.5 w-full block">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Personal Gmail</label>
              <input type="text" value={user.email || ''} readOnly className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed outline-none block" />
            </div>

            <div className="space-y-1.5 w-full block">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Full Name *</label>
              <input required type="text" value={formData.fullName} onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors block" placeholder="Mohak Singhal" />
            </div>

            <div className="space-y-1.5 w-full block">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">MUJ Outlook Email *</label>
              <input required type="email" value={formData.outlookEmail} onChange={e => setFormData(p => ({ ...p, outlookEmail: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors block" placeholder="Enter outlook email ID" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              <div className="space-y-1.5 w-full block">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Registration Number *</label>
                <input required type="text" value={formData.registrationNumber} onChange={e => setFormData(p => ({ ...p, registrationNumber: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors block" placeholder="Enter registration number" />
              </div>

              <div className="space-y-1.5 w-full block">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Course / Program *</label>
                <select
                  required
                  value={formData.courseIndex}
                  onChange={e => setFormData(p => ({ ...p, courseIndex: Number(e.target.value) }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors cursor-pointer appearance-none block"
                >
                  {MUJ_COURSES.map((course, index) => (
                    <option key={index} value={index} className="bg-gray-900 text-white">
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              <div className="space-y-1.5 w-full block">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">WhatsApp Number *</label>
                <input required type="tel" value={formData.whatsappNumber} onChange={e => setFormData(p => ({ ...p, whatsappNumber: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors block" placeholder="+91..." />
              </div>

              <div className="space-y-1.5 w-full block">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Joined WhatsApp Group? *</label>
                <select required value={formData.joinedWhatsapp} onChange={e => setFormData(p => ({ ...p, joinedWhatsapp: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors cursor-pointer appearance-none block">
                  <option value="No" className="bg-gray-900 text-white">No</option>
                  <option value="Yes" className="bg-gray-900 text-white">Yes</option>
                </select>
              </div>
            </div>

            <div className="w-full flex justify-center pt-4">
              <button disabled={submitting} type="submit" className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] hover:shadow-xl hover:shadow-purple-500/30 transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 cursor-pointer">
                {submitting ? 'Registering...' : 'Complete Registration'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function EventRegistrationForm() {
  return (
    <div className="w-full flex flex-col items-center min-h-screen bg-transparent text-white pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/[0.08] rounded-full blur-[140px] pointer-events-none" />

      <Suspense fallback={
        <div className="flex items-center justify-center pt-20 w-full">
          <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
        </div>
      }>
        <EventRegistrationFormContent />
      </Suspense>
    </div>
  );
}