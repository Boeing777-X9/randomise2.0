"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import GlassCard from '@/components/membership-card';
import { 
  UploadCloud, CheckCircle2, AlertTriangle, 
  Sparkles, RefreshCw, ArrowLeft, ExternalLink, CreditCard,
  ChevronDown, Check
} from 'lucide-react';
import Link from 'next/link';

// Comprehensive MUJ Academic Programme Directory
const COURSES = [
  // Faculty of Engineering & Technology (4 Years)
  { name: 'B.Tech - Computer Science & Engineering (CSE)', duration: 4 },
  { name: 'B.Tech - CSE (AI & Machine Learning)', duration: 4 },
  { name: 'B.Tech - CSE (Data Science)', duration: 4 },
  { name: 'B.Tech - CSE (IoT & Intelligent Systems)', duration: 4 },
  { name: 'B.Tech - Information Technology (IT)', duration: 4 },
  { name: 'B.Tech - Computer & Communication Engg (CCE)', duration: 4 },
  { name: 'B.Tech - Electronics & Communication Engg (ECE)', duration: 4 },
  { name: 'B.Tech - Electrical & Electronics Engg (EEE)', duration: 4 },
  { name: 'B.Tech - Mechanical Engineering (ME)', duration: 4 },
  { name: 'B.Tech - Civil Engineering (CE)', duration: 4 },
  { name: 'B.Tech - Mechatronics Engineering', duration: 4 },
  { name: 'B.Tech - Automobile Engineering', duration: 4 },
  { name: 'B.Tech - Chemical Engineering', duration: 4 },

  // Faculty of Science & Computer Applications (3 & 4 Years)
  { name: 'BCA (Bachelor of Computer Applications - 3 Years)', duration: 3 },
  { name: 'BCA (Hons. / Hons. with Research - 4 Years)', duration: 4 },
  { name: 'B.Sc. (Hons.) Data Science - 4 Years', duration: 4 },
  { name: 'B.Sc. (Hons.) Computer Science - 4 Years', duration: 4 },
  { name: 'B.Sc. (Hons.) Biotechnology - 4 Years', duration: 4 },
  { name: 'B.Sc. (Hons.) Physics / Chemistry / Maths - 4 Years', duration: 4 },
  { name: 'B.Sc. (Hons.) Clinical Psychology - 4 Years', duration: 4 },

  // Faculty of Management & Commerce (3 & 4 Years)
  { name: 'BBA (Bachelor of Business Administration - 3 Years)', duration: 3 },
  { name: 'BBA (Hons. / Hons. with Research - 4 Years)', duration: 4 },
  { name: 'BBA (Business Analytics / FinTech - 3 Years)', duration: 3 },
  { name: 'B.Com. (Bachelor of Commerce - 3 Years)', duration: 3 },
  { name: 'B.Com. (Hons. / Professional - 4 Years)', duration: 4 },

  // Faculty of Design, Architecture & Fine Arts (4 & 5 Years)
  { name: 'B.Des. - Interior Design (4 Years)', duration: 4 },
  { name: 'B.Des. - Fashion Design (4 Years)', duration: 4 },
  { name: 'B.Des. - User Experience (UX) Design (4 Years)', duration: 4 },
  { name: 'B.Arch. (Bachelor of Architecture - 5 Years)', duration: 5 },
  { name: 'BFA (Bachelor of Fine Arts - 4 Years)', duration: 4 },

  // Faculty of Law & Humanities (3, 4 & 5 Years)
  { name: 'B.A. LL.B. (Hons.) - 5 Years Integrated', duration: 5 },
  { name: 'B.B.A. LL.B. (Hons.) - 5 Years Integrated', duration: 5 },
  { name: 'LL.B. (3 Years)', duration: 3 },
  { name: 'B.A. (Hons.) Liberal Arts / Psychology / English (4 Years)', duration: 4 },
  { name: 'B.A. (Journalism & Mass Communication - 3 Years)', duration: 3 },
  { name: 'B.A. (Hons. J&MC - 4 Years)', duration: 4 },
  { name: 'BHM (Bachelor of Hotel Management - 4 Years)', duration: 4 },

  // Postgraduate Programmes (1 & 2 Years)
  { name: 'MCA (Master of Computer Applications - 2 Years)', duration: 2 },
  { name: 'M.Tech (Computer Science / VLSI / Energy - 2 Years)', duration: 2 },
  { name: 'MBA (Master of Business Administration - 2 Years)', duration: 2 },
  { name: 'M.Sc. (Data Science / IT / Biotechnology - 2 Years)', duration: 2 },
  { name: 'LL.M. (Master of Laws - 1 Year)', duration: 1 },
  { name: 'M.A. / M.Des. / MFA (2 Years)', duration: 2 },

  // Other
  { name: 'Other Academic Programme / PhD', duration: 4 }
];

const REFERRAL_OPTIONS = [
  {
    category: "General",
    members: ["NONE"]
  },
  {
    category: "Executive Team",
    members: [
      "Rashi Srivastava (President)",
      "Akshit Yadav (Vice President)",
      "Aastha Gupta (General Secretary)",
      "Arsheya Yadav (Treasurer)",
      "Aditya Mukherjee (Technical Secretary)",
      "Aaryan Rathee (Managing Director)"
    ]
  },
  {
    category: "Tech Team (Projects & Webmasters)",
    members: [
      "Shlok Goenka",
      "Mohak Singhal",
      "Mohammed Faisal",
      "Anwesha Thakur",
      "Rick Samanta"
    ]
  },
  {
    category: "Finance & Corporate Relations (FnR)",
    members: [
      "Anshika Adhikari",
      "Vikhyati Viha",
      "Gun Agrawal"
    ]
  },
  {
    category: "Graphic Design (GD)",
    members: [
      "Parv Jain",
      "Tara Hazra"
    ]
  },
  {
    category: "Outreach & PR",
    members: [
      "Shantanu Gupta",
      "Nikita Handa",
      "Tanvi Sachdeva",
      "Asjita Chakraborty"
    ]
  },
  {
    category: "Editorial",
    members: [
      "Anushka Bhattacharjee",
      "Jiya Vadhera",
      "Mohammed Fahad Shamsi"
    ]
  },
  {
    category: "Operations",
    members: [
      "Satvik Sharma",
      "Saima Ray",
      "Tanish Sharma",
      "Riddhima Khera"
    ]
  },
  {
    category: "Productions",
    members: [
      "Suhaan Vijay Vergiya",
      "Suhana Chauhan",
      "Aradhya Singh"
    ]
  },
  {
    category: "Social Media & Coverage",
    members: [
      "Samreen Naz",
      "Srishti Gupta",
      "Agastya Singh",
      "Pratyush Verma",
      "Shrishti Mishra",
      "Akshat Sharma",
      "Tushar Khowal",
      "Shambhavi Singh"
    ]
  },
  {
    category: "Events Team",
    members: [
      "Harshit Kapoor",
      "Harsh Agarwal",
      "Aaruthra Balamurali"
    ]
  }
];

export default function MembershipForm() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    regNo: '',
    outlookEmail: '',
    phone: '',
    registrationType: 'Standard',
    academicDetails: COURSES[0].name,
    courseDuration: 4,
    accommodation: 'GHS',
    referral: 'NONE',
    paymentReferenceId: '',
    paymentProof: null
  });

  const [referralSearch, setReferralSearch] = useState('NONE');
  const [referralDropdownOpen, setReferralDropdownOpen] = useState(false);
  const referralRef = useRef(null);

  const [activeField, setActiveField] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [ocrDetected, setOcrDetected] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (referralRef.current && !referralRef.current.contains(event.target)) {
        setReferralDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initAuthAndDirectory = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();

        if (!currentUser) {
          if (isMounted) setLoading(false);
          return;
        }

        if (isMounted) setUser(currentUser);
        const cleanEmail = currentUser.email?.toLowerCase().trim();

        // 1. Check if user is already registered in members_26
        const { data: existingMember } = await supabase
          .from('members_26')
          .select('*')
          .or(`user_id.eq.${currentUser.id},personal_email.ilike.${cleanEmail},outlook_email.ilike.${cleanEmail}`)
          .maybeSingle();

        if (existingMember && isMounted) {
          setSuccessData({
            randomize_id: existingMember.randomize_id,
            full_name: existingMember.full_name,
            alreadyRegistered: true
          });
          setLoading(false);
          return;
        }

        // 2. Auto-populate from Directory
        let { data: dirProfile } = await supabase
          .from('randomize_directory')
          .select('*')
          .or(`email.ilike.${cleanEmail},outlook_email.ilike.${cleanEmail}`)
          .maybeSingle();

        if (!dirProfile) {
          const { data: hwProfile } = await supabase
            .from('hello_world_26')
            .select('*')
            .or(`personal_email.ilike.${cleanEmail},outlook_email.ilike.${cleanEmail}`)
            .maybeSingle();

          if (hwProfile) {
            dirProfile = {
              name: hwProfile.full_name,
              outlook_email: hwProfile.outlook_email,
              registration_number: hwProfile.registration_number,
              phone_number: hwProfile.whatsapp_number,
              course: hwProfile.course_name
            };
          }
        }

        if (dirProfile && isMounted) {
          const matchedCourse = COURSES.find(c => 
            dirProfile.course && String(dirProfile.course).toLowerCase().includes(c.name.slice(0, 10).toLowerCase())
          );

          setFormData((prev) => ({
            ...prev,
            name: dirProfile.name || currentUser.user_metadata?.full_name || '',
            outlookEmail: dirProfile.outlook_email || '',
            regNo: dirProfile.registration_number || '',
            phone: dirProfile.phone_number || '',
            academicDetails: matchedCourse ? matchedCourse.name : (dirProfile.course || prev.academicDetails),
            courseDuration: matchedCourse ? matchedCourse.duration : 4
          }));
        } else if (currentUser.user_metadata?.full_name && isMounted) {
          setFormData((prev) => ({
            ...prev,
            name: currentUser.user_metadata.full_name
          }));
        }
      } catch (err) {
        console.error("Directory lookup error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initAuthAndDirectory();
    return () => { isMounted = false; };
  }, []);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/membership` : undefined 
      },
    });
  };

  const handleCourseChange = (e) => {
    const selectedCourseName = e.target.value;
    const found = COURSES.find(c => c.name === selectedCourseName);
    setFormData(prev => ({
      ...prev,
      academicDetails: selectedCourseName,
      courseDuration: found ? found.duration : 4
    }));
  };

  const handleScreenshotChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, paymentProof: file }));
    setIsScanning(true);
    setError(null);
    setOcrDetected(false);

    try {
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('eng');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      const ccavenueMatch = text.match(/\b(CCA|CC)?[0-9]{10,16}\b/i);
      const razorpayMatch = text.match(/pay_[a-zA-Z0-9]{14,}/);
      const utrMatch = text.match(/\b\d{12}\b/);

      if (ccavenueMatch) {
        setFormData((prev) => ({ ...prev, paymentReferenceId: ccavenueMatch[0] }));
        setOcrDetected(true);
      } else if (razorpayMatch) {
        setFormData((prev) => ({ ...prev, paymentReferenceId: razorpayMatch[0] }));
        setOcrDetected(true);
      } else if (utrMatch) {
        setFormData((prev) => ({ ...prev, paymentReferenceId: utrMatch[0] }));
        setOcrDetected(true);
      }
    } catch (err) {
      console.warn("Client OCR notice:", err);
    } finally {
      setIsScanning(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("Please sign in with your Google account first.");
      return;
    }

    const cleanOutlook = formData.outlookEmail.trim().toLowerCase();
    const cleanRegNo = formData.regNo.trim().toUpperCase();

    if (!cleanOutlook.endsWith('@muj.manipal.edu')) {
      setError("Outlook email must end with @muj.manipal.edu");
      return;
    }

    if (!cleanOutlook.includes(cleanRegNo.toLowerCase())) {
      setError("Registration number does not match your Outlook email ID.");
      return;
    }

    if (!formData.paymentProof || !formData.paymentReferenceId.trim()) {
      setError("Payment Screenshot and Transaction Reference ID are mandatory.");
      return;
    }

    setSubmitting(true);
    try {
      const fileExt = formData.paymentProof.name.split('.').pop();
      const fileName = `receipt_${cleanRegNo}_${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('membership-receipts')
        .upload(fileName, formData.paymentProof, {
          cacheControl: '3600',
          upsert: true,
          contentType: formData.paymentProof.type
        });

      if (uploadError) {
        throw new Error(`Failed to upload payment receipt: ${uploadError.message}`);
      }

      const { data: publicData } = supabase.storage
        .from('membership-receipts')
        .getPublicUrl(fileName);

      const screenshotUrl = publicData.publicUrl;

      const { data, error: rpcError } = await supabase.rpc('register_membership', {
        p_user_id: user.id,
        p_personal_email: user.email.toLowerCase().trim(),
        p_outlook_email: cleanOutlook,
        p_full_name: formData.name.trim(),
        p_registration_number: cleanRegNo,
        p_phone_number: formData.phone.trim(),
        p_academic_details: formData.academicDetails.trim(),
        p_accommodation: formData.accommodation,
        p_registration_type: 'Standard',
        p_amount: 400,
        p_payment_reference_id: formData.paymentReferenceId.trim(),
        p_payment_screenshot_url: screenshotUrl,
        p_referral: formData.referral || 'NONE',
        p_course_duration: formData.courseDuration || 4
      });

      if (rpcError) throw rpcError;

      if (data?.success) {
        setSuccessData(data);
      } else {
        throw new Error("Unable to record membership details. Please verify your data.");
      }
    } catch (err) {
      setError(err?.message || "Failed to submit membership application.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReferralGroups = REFERRAL_OPTIONS.map((group) => ({
    ...group,
    members: group.members.filter((m) => 
      m.toLowerCase().includes(referralSearch.toLowerCase())
    )
  })).filter((group) => group.members.length > 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent text-white pt-[110px] pb-[80px] relative overflow-hidden flex flex-col items-center justify-center px-[16px]">
        <RefreshCw className="w-[32px] h-[32px] animate-spin text-purple-400 mb-[12px]" aria-hidden="true" />
        <p className="text-[12px] font-mono text-gray-400 tracking-wider uppercase">Checking Membership Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white pt-[96px] sm:pt-[120px] pb-[80px] sm:pb-[96px] relative overflow-hidden flex flex-col items-center justify-start px-[12px] sm:px-[16px]">
      
      {/* Subtle Background Radial Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/3 w-[360px] sm:w-[500px] h-[360px] sm:h-[500px] bg-purple-600/[0.06] rounded-full blur-[140px]" />
      </div>

      <div 
        className="w-full flex flex-col items-center gap-[12px] sm:gap-[16px] relative z-10"
        style={{ width: "560px", maxWidth: "100%" }}
      >
        {/* Navigation Bar */}
        <div className="w-full flex items-center justify-between pb-[4px] px-[4px]">
          <Link 
            href="/" 
            className="inline-flex items-center gap-[6px] text-[12px] font-mono uppercase tracking-wider text-gray-400 hover:text-white transition-colors min-h-[44px] py-[8px]"
          >
            <ArrowLeft className="w-[16px] h-[16px]" aria-hidden="true" /> Return Home
          </Link>
          <span className="px-[10px] py-[4px] bg-white/5 border border-white/10 rounded-full text-[10px] font-mono tracking-widest text-cyan-300 uppercase font-semibold">
            Tenure 2026-27
          </span>
        </div>

        {/* Liquid Glass Shell */}
        <div 
          className="relative z-10 w-full bg-[#0c0812]/85 backdrop-blur-xl border border-white/10 rounded-[24px] sm:rounded-[32px] p-[20px] sm:p-[32px] shadow-2xl text-left overflow-hidden"
          style={{ width: "100%" }}
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

          {/* Club Header */}
          <GlassCard className="w-full mb-[20px] relative p-[16px] sm:p-[20px]">
            <h1 className="text-[22px] sm:text-[24px] font-black mb-[6px] text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 text-center leading-tight">
              Join Randomize();
            </h1>
            <p className="text-[12px] sm:text-[13px] text-gray-300 leading-relaxed text-center">
              The Official Computing Club of Manipal University Jaipur.
            </p>
            <div className="mt-[10px] pt-[8px] border-t border-white/[0.08] text-center font-mono">
              <p className="text-[9px] sm:text-[10px] text-cyan-300 uppercase font-bold tracking-[0.2em] m-0">IDEATE . COMMIT . SUCCEED</p>
            </div>
          </GlassCard>

          {/* 1. Unauthenticated Google Gate */}
          {!user ? (
            <div className="w-full py-[28px] flex flex-col items-center text-center">
              <p className="text-[13px] sm:text-[14px] text-gray-300 mb-[20px] max-w-[340px] leading-relaxed">
                Sign in with your personal Google account to start or access your membership portal.
              </p>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-[12px] w-full py-[14px] sm:py-[16px] rounded-[14px] font-semibold text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 transition-all active:scale-[0.99] min-h-[48px] cursor-pointer"
              >
                <svg className="w-[18px] h-[18px] bg-white rounded-full p-[2px] shrink-0" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
                <span className="text-[13px] sm:text-[14px]">Sign In with Google</span>
              </button>
            </div>
          ) : successData ? (
            /* 2. Instant ID Display Card for Registered Members */
            <div className="w-full py-[28px] flex flex-col items-center text-center space-y-[18px]">
              <div className="w-[60px] h-[60px] bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-[30px] h-[30px] text-emerald-400" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-[20px] sm:text-[22px] font-bold text-white mb-[4px]">
                  {successData.alreadyRegistered ? 'Welcome Back,' : 'Application Logged,'} {successData.full_name?.split(' ')[0]}!
                </h2>
                <p className="text-[12px] sm:text-[13px] text-gray-400">
                  {successData.alreadyRegistered 
                    ? 'You are actively registered for Randomize(); Tenure 2026-27.' 
                    : 'Your payment details are queued for verification.'}
                </p>
              </div>

              <div 
                className="bg-white/[0.03] border border-white/10 rounded-[16px] p-[16px] flex flex-col items-center justify-center shadow-xl"
                style={{ width: "260px", minHeight: "95px" }}
              >
                <span className="text-[11px] text-gray-400 font-mono uppercase tracking-[1.5px] mb-[6px] block text-center">
                  YOUR RANDOMIZE ID
                </span>
                <span className="text-[22px] sm:text-[24px] leading-[28px] font-extrabold text-white tracking-[2px] font-mono whitespace-nowrap block text-center">
                  {successData.randomize_id}
                </span>
              </div>
            </div>
          ) : (
            /* 3. New Application Form */
            <>
              {error && (
                <div role="alert" className="mb-[18px] p-[12px] sm:p-[14px] bg-red-500/10 border border-red-500/30 rounded-[12px] flex items-start gap-[10px] text-red-300">
                  <AlertTriangle className="w-[16px] h-[16px] shrink-0 mt-[2px] text-red-400" aria-hidden="true" />
                  <p className="text-[12px]">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="w-full space-y-[14px] sm:space-y-[16px]">
                
                {/* Authenticated Gmail */}
                <div className="space-y-[4px]">
                  <label htmlFor="auth-email" className="text-[11px] font-mono uppercase tracking-wider text-gray-400 block">Personal Gmail (Authenticated)</label>
                  <input 
                    id="auth-email"
                    type="text" 
                    value={user.email || ''} 
                    readOnly 
                    className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-[14px] py-[12px] text-gray-400 cursor-not-allowed outline-none font-mono text-[16px] sm:text-[13px] min-h-[48px]" 
                  />
                </div>

                {/* Text Fields */}
                {[
                  { id: 'name', label: 'Full Name *', type: 'text', placeholder: 'e.g. Mohak Singhal', val: formData.name },
                  { id: 'regNo', label: 'Registration Number *', type: 'text', placeholder: 'e.g. 24568478', val: formData.regNo },
                  { id: 'phone', label: 'WhatsApp / Mobile Number *', type: 'tel', placeholder: 'e.g. +91 98765 43210', val: formData.phone },
                  { id: 'outlookEmail', label: 'MUJ Outlook Email ID *', type: 'email', placeholder: 'name.24568478@muj.manipal.edu', val: formData.outlookEmail },
                ].map((field) => (
                  <div key={field.id} className="space-y-[4px]">
                    <label 
                      htmlFor={field.id}
                      className={`block text-[11px] font-mono uppercase tracking-wider transition-colors ${activeField === field.id ? 'text-gray-200' : 'text-gray-400'}`}
                    >
                      {field.label}
                    </label>
                    <input 
                      id={field.id}
                      type={field.type} 
                      required 
                      placeholder={field.placeholder}
                      value={field.val}
                      className="w-full px-[14px] py-[12px] bg-white/[0.04] border border-white/15 rounded-[12px] text-white text-[16px] sm:text-[13px] outline-none transition-all focus:border-white/40 focus:bg-white/[0.07] placeholder:text-gray-500 min-h-[48px]"
                      onFocus={() => setActiveField(field.id)}
                      onBlur={() => setActiveField(null)}
                      onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                    />
                  </div>
                ))}

                {/* Full Academic Programme Selection */}
                <div className="space-y-[4px]">
                  <label htmlFor="course-select" className="block text-[11px] font-mono uppercase tracking-wider text-gray-400">
                    Academic Programme / Course *
                  </label>
                  <div className="relative">
                    <select
                      id="course-select"
                      required
                      value={formData.academicDetails}
                      onChange={handleCourseChange}
                      className="w-full px-[14px] py-[12px] pr-[36px] bg-[#120c1d] border border-white/15 rounded-[12px] text-white text-[16px] sm:text-[13px] outline-none focus:border-white/40 min-h-[48px] appearance-none cursor-pointer"
                    >
                      {COURSES.map((c) => (
                        <option key={c.name} value={c.name} className="bg-[#120c1d] text-white py-[4px]">
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-[16px] h-[16px] text-gray-400 absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Clean Referral Dropdown with Subtle Category Headers */}
                <div className="space-y-[4px] relative" ref={referralRef}>
                  <label 
                    htmlFor="referral-input" 
                    className="block text-[11px] font-mono uppercase tracking-wider text-gray-400"
                  >
                    Referred By (Optional)
                  </label>
                  
                  <div className="relative flex items-center">
                    <input 
                      id="referral-input"
                      type="text"
                      placeholder="Search member name or select domain..."
                      value={referralSearch}
                      onFocus={() => {
                        setReferralDropdownOpen(true);
                        if (referralSearch === 'NONE') setReferralSearch('');
                      }}
                      onChange={(e) => {
                        setReferralSearch(e.target.value);
                        setFormData({...formData, referral: e.target.value || 'NONE'});
                        setReferralDropdownOpen(true);
                      }}
                      className="w-full px-[14px] py-[12px] pr-[44px] bg-white/[0.04] border border-white/15 rounded-[12px] text-white text-[16px] sm:text-[13px] outline-none focus:border-white/40 min-h-[48px]"
                    />
                    <button
                      type="button"
                      aria-label="Toggle referral dropdown"
                      onClick={() => setReferralDropdownOpen(!referralDropdownOpen)}
                      className="absolute right-[4px] w-[36px] h-[36px] flex items-center justify-center text-gray-400 hover:text-white rounded-[8px] transition-colors"
                    >
                      <ChevronDown className={`w-[16px] h-[16px] transition-transform ${referralDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Dropdown Menu Container */}
                  {referralDropdownOpen && (
                    <div className="absolute left-0 right-0 top-[102%] z-50 max-h-[280px] overflow-y-auto bg-[#0d0915] border border-white/15 rounded-[14px] shadow-2xl p-[6px] backdrop-blur-2xl">
                      {filteredReferralGroups.length === 0 ? (
                        <div className="py-[12px] px-[10px] text-center text-gray-400 text-[12px] font-mono">
                          No matching member found
                        </div>
                      ) : (
                        filteredReferralGroups.map((group) => (
                          <div key={group.category} className="mb-[8px] last:mb-0">
                            
                            {/* Clean Domain Header without purple background */}
                            <div className="px-[10px] pt-[6px] pb-[4px] border-b border-white/[0.08] mb-[3px]">
                              <span className="text-[10px] font-mono uppercase tracking-[1.5px] font-semibold text-cyan-400/90">
                                {group.category}
                              </span>
                            </div>

                            {/* Member Options */}
                            <div className="space-y-[1px] pl-[2px]">
                              {group.members.map((member) => {
                                const isSelected = formData.referral === member;
                                return (
                                  <button
                                    type="button"
                                    key={member}
                                    onClick={() => {
                                      setFormData({...formData, referral: member});
                                      setReferralSearch(member);
                                      setReferralDropdownOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-[10px] py-[8px] rounded-[8px] text-[12px] text-left transition-colors ${
                                      isSelected 
                                        ? 'bg-white/10 text-white font-medium border border-white/10' 
                                        : 'text-gray-300 hover:bg-white/[0.06] hover:text-white'
                                    }`}
                                  >
                                    <span>{member}</span>
                                    {isSelected && <Check className="w-[14px] h-[14px] text-cyan-300" />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Accommodation Selector */}
                <fieldset className="pt-[2px]">
                  <legend className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-[6px]">Your Accommodation *</legend>
                  <div className="grid grid-cols-3 gap-[6px] sm:gap-[8px]">
                    {['GHS', 'Day Scholar', 'PG/Flat'].map((type) => {
                      const isSelected = formData.accommodation === type;
                      return (
                        <button
                          type="button"
                          key={type}
                          onClick={() => setFormData({...formData, accommodation: type})}
                          className={`py-[12px] px-[4px] sm:px-[8px] text-center rounded-[12px] text-[12px] font-medium border transition-colors min-h-[48px] active:scale-[0.98] ${
                            isSelected 
                              ? 'bg-white/10 border-white/40 text-white' 
                              : 'bg-white/[0.03] border-white/15 text-gray-400 hover:text-white'
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {/* Membership Plan Details */}
                <div className="p-[14px] sm:p-[16px] rounded-[16px] bg-white/[0.02] border border-white/10 my-[10px]">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 font-semibold mb-[6px] block">
                    Membership Plan
                  </span>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[13px] sm:text-[14px] font-semibold text-white">Full Annual Access</h4>
                      <p className="text-[11px] text-gray-400 mt-[2px] leading-relaxed">
                        Workspaces, internal workshops & priority hackathons.
                      </p>
                    </div>
                    <span className="text-[13px] sm:text-[14px] font-mono text-white font-semibold bg-white/[0.06] border border-white/10 px-[10px] py-[4px] rounded-[8px]">
                      ₹400
                    </span>
                  </div>
                </div>

                {/* Step 1: CCAvenue Direct Link Button */}
                <div className="space-y-[6px]">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400 block">
                    Step 1: Complete Payment
                  </label>
                  <a
                    href="/api/pay/membership"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-[14px] px-[16px] rounded-[12px] bg-white/[0.05] hover:bg-white/[0.09] border border-white/15 hover:border-white/30 text-white text-[13px] font-semibold flex items-center justify-center gap-[8px] transition-all min-h-[48px] active:scale-[0.99]"
                  >
                    <CreditCard className="w-[16px] h-[16px] text-gray-300 shrink-0" />
                    <span>Pay with CCAvenue</span>
                    <ExternalLink className="w-[14px] h-[14px] text-gray-400 shrink-0" />
                  </a>
                  <p className="text-[10px] text-gray-400 font-mono text-center">
                    Opens gateway in a new tab. Complete payment and return here.
                  </p>
                </div>

                {/* Step 2: Screenshot Dropzone */}
                <div className="space-y-[4px] pt-[2px]">
                  <label htmlFor="proof-upload" className="text-[11px] font-mono uppercase tracking-wider text-gray-400 block">
                    Step 2: Upload Payment Screenshot *
                  </label>
                  <div className="relative flex flex-col items-center justify-center w-full border border-dashed border-white/20 hover:border-white/40 rounded-[14px] p-[16px] sm:p-[20px] bg-white/[0.02] transition-colors cursor-pointer text-center min-h-[85px]">
                    <input 
                      id="proof-upload"
                      type="file" 
                      required 
                      accept="image/*,application/pdf"
                      className="absolute inset-0 opacity-0 cursor-pointer z-20 w-full h-full"
                      onChange={handleScreenshotChange}
                    />
                    <div className="space-y-[4px] pointer-events-none flex flex-col items-center">
                      <UploadCloud className="w-[22px] h-[22px] text-gray-400" aria-hidden="true" />
                      <p className="text-[12px] text-gray-300 font-medium m-0">
                        {formData.paymentProof ? (
                          <span className="text-white font-mono break-all">{formData.paymentProof.name}</span>
                        ) : (
                          <span>Tap to select receipt photo</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3: Reference ID / UTR Input */}
                <div className="space-y-[4px]">
                  <div className="flex items-center justify-between">
                    <label htmlFor="ref-id" className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                      Step 3: Reference ID / UTR *
                    </label>
                    {isScanning && (
                      <span className="flex items-center gap-[4px] text-[10px] text-gray-300 font-mono" aria-live="polite">
                        <RefreshCw className="w-[11px] h-[11px] animate-spin" aria-hidden="true" /> Scanning...
                      </span>
                    )}
                    {ocrDetected && !isScanning && (
                      <span className="flex items-center gap-[4px] text-[10px] text-emerald-400 font-mono">
                        <Sparkles className="w-[11px] h-[11px]" aria-hidden="true" /> Detected
                      </span>
                    )}
                  </div>
                  <input 
                    id="ref-id"
                    type="text" 
                    required 
                    placeholder="e.g. Order ID, Reference ID, or 12-digit UTR"
                    value={formData.paymentReferenceId}
                    onChange={(e) => setFormData({...formData, paymentReferenceId: e.target.value})}
                    className="w-full px-[14px] py-[12px] bg-white/[0.04] border border-white/15 rounded-[12px] text-white font-mono text-[16px] sm:text-[13px] outline-none focus:border-white/40 min-h-[48px]"
                  />
                </div>

                {/* Submit Form CTA */}
                <div className="pt-[8px] sm:pt-[12px]">
                  <button 
                    type="submit"
                    disabled={submitting || isScanning}
                    className="w-full py-[14px] rounded-[12px] bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 text-white font-medium text-[13px] sm:text-[14px] tracking-wide transition-all active:scale-[0.99] disabled:opacity-50 min-h-[48px] cursor-pointer"
                  >
                    {submitting ? 'Submitting Application...' : 'Submit Form'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}