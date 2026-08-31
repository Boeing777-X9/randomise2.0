"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import GlassCard from '@/components/membership-card';
import { 
  UploadCloud, CheckCircle2, AlertTriangle, 
  Sparkles, RefreshCw, ArrowLeft, ExternalLink, CreditCard,
  ChevronDown, Check, FileText, X, Clock
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

const PITCHED_BY_OPTIONS = [
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

function extractTransactionReference(text) {
  if (!text) return null;
  const ccavenueMatch = text.match(/(?:Order\s*(?:No|ID|#)|Reference\s*(?:No|ID|#)|CCAvenue\s*Ref)\s*[:#-]?\s*([A-Za-z0-9_-]{8,24})/i);
  if (ccavenueMatch?.[1]) return ccavenueMatch[1].trim();

  const utrMatch = text.match(/(?:UPI\s*Ref\s*(?:No|ID)?|UTR|Txn\s*ID|Transaction\s*ID)\s*[:#-]?\s*(\d{12})/i);
  if (utrMatch?.[1]) return utrMatch[1].trim();

  const razorpayMatch = text.match(/\bpay_[a-zA-Z0-9]{14,20}\b/);
  if (razorpayMatch) return razorpayMatch[0].trim();

  const standaloneUtr = text.match(/\b[1-9]\d{11}\b/);
  if (standaloneUtr) return standaloneUtr[0].trim();

  return null;
}

export default function MembershipForm() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    regNo: '',
    outlookEmail: '',
    phone: '',
    registrationType: 'Standard', // 'Standard' (₹400) or 'Renewal' (₹100)
    academicDetails: COURSES[0].name,
    courseDuration: 4,
    accommodation: 'GHS',
    pitchedBy: '',
    paymentReferenceId: '',
    paymentProof: null
  });

  const [pitchedByQuery, setPitchedByQuery] = useState('');
  const [pitchedByDropdownOpen, setPitchedByDropdownOpen] = useState(false);
  const pitchedByRef = useRef(null);

  const [activeField, setActiveField] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [ocrDetected, setOcrDetected] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const planAmount = formData.registrationType === 'Renewal' ? 100 : 400;

  // 1. Generate preview blob URL
  useEffect(() => {
    if (!formData.paymentProof) {
      setImagePreviewUrl(null);
      return;
    }

    if (formData.paymentProof.type?.startsWith('image/')) {
      const url = URL.createObjectURL(formData.paymentProof);
      setImagePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreviewUrl(null);
    }
  }, [formData.paymentProof]);

  // 2. Load cached form state
  useEffect(() => {
    try {
      const saved = localStorage.getItem('membership_form_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({
          ...prev,
          name: parsed.name || prev.name,
          regNo: parsed.regNo || prev.regNo,
          outlookEmail: parsed.outlookEmail || prev.outlookEmail,
          phone: parsed.phone || prev.phone,
          registrationType: parsed.registrationType || prev.registrationType,
          academicDetails: parsed.academicDetails || prev.academicDetails,
          courseDuration: parsed.courseDuration || prev.courseDuration,
          accommodation: parsed.accommodation || prev.accommodation,
          pitchedBy: parsed.pitchedBy && parsed.pitchedBy !== 'NONE' ? parsed.pitchedBy : prev.pitchedBy,
          paymentReferenceId: parsed.paymentReferenceId || prev.paymentReferenceId
        }));
      }
    } catch (e) {
      console.warn("Failed to load saved form data", e);
    }
  }, []);

  // 3. Persist form data
  useEffect(() => {
    try {
      const { paymentProof, ...serializable } = formData;
      localStorage.setItem('membership_form_data', JSON.stringify(serializable));
    } catch (e) {
      console.warn("Failed to save form data", e);
    }
  }, [formData]);

  // 4. Click & Touch outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (pitchedByRef.current && !pitchedByRef.current.contains(event.target)) {
        setPitchedByDropdownOpen(false);
        setPitchedByQuery('');
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // 5. Auth verification & autofill
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

        // Check if user already submitted application
        const { data: existingMember } = await supabase
          .from('members_26')
          .select('randomize_id, full_name, status, registration_type')
          .or(`user_id.eq.${currentUser.id},personal_email.ilike.${cleanEmail},outlook_email.ilike.${cleanEmail}`)
          .maybeSingle();

        if (existingMember && isMounted) {
          setSuccessData({
            randomize_id: existingMember.randomize_id,
            full_name: existingMember.full_name,
            status: existingMember.status || 'pending_verification',
            alreadyRegistered: true
          });
          setLoading(false);
          return;
        }

        // Fetch directory entry for autofill
        let { data: dirProfile } = await supabase
          .from('randomize_directory')
          .select('*')
          .or(`email.ilike.${cleanEmail},outlook_email.ilike.${cleanEmail}`)
          .maybeSingle();

        if (dirProfile && isMounted) {
          const matchedCourse = COURSES.find(c => 
            dirProfile.course && String(dirProfile.course).toLowerCase().includes(c.name.slice(0, 10).toLowerCase())
          );

          const is26Batch = String(dirProfile.registration_number || '').trim().startsWith('26');

          setFormData((prev) => ({
            ...prev,
            name: prev.name || dirProfile.name || currentUser.user_metadata?.full_name || '',
            outlookEmail: prev.outlookEmail || dirProfile.outlook_email || '',
            regNo: prev.regNo || dirProfile.registration_number || '',
            phone: prev.phone || dirProfile.phone_number || '',
            registrationType: is26Batch ? 'Standard' : (prev.registrationType || 'Renewal'),
            academicDetails: (prev.academicDetails && prev.academicDetails !== COURSES[0].name)
              ? prev.academicDetails
              : (matchedCourse ? matchedCourse.name : (dirProfile.course || prev.academicDetails)),
            courseDuration: (prev.courseDuration && prev.courseDuration !== 4)
              ? prev.courseDuration
              : (matchedCourse ? matchedCourse.duration : 4)
          }));
        } else if (currentUser.user_metadata?.full_name && isMounted) {
          setFormData((prev) => ({
            ...prev,
            name: prev.name || currentUser.user_metadata.full_name
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

  const handleRegNoChange = (val) => {
    const clean = val.trim();
    const is26 = clean.startsWith('26');
    setFormData(prev => ({
      ...prev,
      regNo: val,
      registrationType: is26 ? 'Standard' : prev.registrationType
    }));
  };

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

      const extractedId = extractTransactionReference(text);
      if (extractedId) {
        setFormData((prev) => ({ ...prev, paymentReferenceId: extractedId }));
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
      setError("Please sign in with Google first.");
      return;
    }

    const cleanOutlook = formData.outlookEmail.trim().toLowerCase();
    const cleanRegNo = formData.regNo.trim().toUpperCase();

    if (cleanRegNo.startsWith('26') && formData.registrationType === 'Renewal') {
      setError("2026 admission batch must register via New Membership.");
      return;
    }

    if (!cleanOutlook.endsWith('@muj.manipal.edu')) {
      setError("Outlook email must end with @muj.manipal.edu");
      return;
    }

    if (!cleanOutlook.includes(cleanRegNo.toLowerCase())) {
      setError("Registration number does not match your Outlook email.");
      return;
    }

    if (!formData.pitchedBy.trim() || formData.pitchedBy === 'NONE') {
      setError("Please select the club member who pitched Randomize(); to you.");
      return;
    }

    if (!formData.paymentProof || !formData.paymentReferenceId.trim()) {
      setError("Payment Screenshot and Transaction Reference ID are required.");
      return;
    }

    setSubmitting(true);
    try {
      const fileExt = formData.paymentProof.name.split('.').pop();
      const fileName = `receipt_${cleanRegNo}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('membership-receipts')
        .upload(fileName, formData.paymentProof, {
          cacheControl: '3600',
          upsert: true,
          contentType: formData.paymentProof.type
        });

      if (uploadError) {
        throw new Error(`Receipt upload failed: ${uploadError.message}`);
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
        p_registration_type: formData.registrationType,
        p_amount: planAmount,
        p_payment_reference_id: formData.paymentReferenceId.trim(),
        p_payment_screenshot_url: screenshotUrl,
        p_referral: formData.pitchedBy.trim(),
        p_course_duration: formData.courseDuration || 4
      });

      if (rpcError) throw rpcError;

      if (data?.success) {
        setSuccessData({
          randomize_id: data.randomize_id,
          full_name: data.full_name,
          status: 'pending_verification',
          alreadyRegistered: false
        });
        try {
          localStorage.removeItem('membership_form_data');
        } catch (e) {
          console.warn("Failed to clear saved form data", e);
        }
      } else {
        throw new Error("Unable to record membership application.");
      }
    } catch (err) {
      const msg = err?.message || '';
      if (msg.includes('already exists')) {
        setError('Application already exists for this student.');
      } else if (msg.includes('payment reference')) {
        setError('Transaction Reference ID already submitted.');
      } else if (msg.includes('Outlook')) {
        setError('Enter a valid MUJ Outlook email.');
      } else if (msg.includes('receipt')) {
        setError('Failed to upload receipt screenshot.');
      } else {
        setError(msg.replace(/^.*?:\s*/, '').slice(0, 60) || 'Submission failed.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPitchedByGroups = PITCHED_BY_OPTIONS.map((group) => ({
    ...group,
    members: group.members.filter((m) => 
      m.toLowerCase().includes(pitchedByQuery.toLowerCase().trim())
    )
  })).filter((group) => group.members.length > 0);

  const isBatch26 = formData.regNo.trim().startsWith('26');

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent text-white pt-[100px] sm:pt-[110px] pb-[80px] relative overflow-hidden flex flex-col items-center justify-center px-[16px]">
        <RefreshCw className="w-[30px] h-[30px] animate-spin text-purple-400 mb-[12px]" aria-hidden="true" />
        <p className="text-[12px] font-mono text-gray-400 tracking-wider uppercase">Checking Membership Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white pt-[88px] min-[400px]:pt-[96px] sm:pt-[120px] pb-[72px] sm:pb-[96px] relative overflow-hidden flex flex-col items-center justify-start px-[10px] min-[400px]:px-[14px] sm:px-[16px]">
      
      {/* Background Radial Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] bg-purple-600/[0.07] rounded-full blur-[120px]" />
      </div>

      <div 
        className="w-full flex flex-col items-center gap-[12px] sm:gap-[16px] relative z-10"
        style={{ width: "560px", maxWidth: "100%" }}
      >
        {/* Navigation Bar */}
        <div className="w-full flex items-center justify-between pb-[2px] px-[2px]">
          <Link 
            href="/" 
            className="inline-flex items-center gap-[6px] text-[11px] sm:text-[12px] font-mono uppercase tracking-wider text-gray-400 hover:text-white transition-colors min-h-[44px] py-[8px]"
          >
            <ArrowLeft className="w-[15px] h-[15px]" aria-hidden="true" /> Return Home
          </Link>
          <span className="px-[8px] sm:px-[10px] py-[3px] sm:py-[4px] bg-white/5 border border-white/10 rounded-full text-[9px] sm:text-[10px] font-mono tracking-widest text-cyan-300 uppercase font-semibold">
            Tenure 2026-27
          </span>
        </div>

        {/* Liquid Glass Shell */}
        <div 
          className="relative z-10 w-full bg-[#0c0812]/90 backdrop-blur-xl border border-white/10 rounded-[20px] min-[400px]:rounded-[24px] sm:rounded-[32px] p-[12px] min-[400px]:p-[18px] sm:p-[32px] shadow-2xl text-left overflow-hidden"
          style={{ width: "100%" }}
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

          {/* Club Header Glass Card */}
          <GlassCard 
            className="w-full mb-[16px] sm:mb-[20px] relative"
            innerClassName="p-[12px] min-[400px]:p-[16px] sm:p-[20px]"
          >
            <h1 className="text-[20px] min-[400px]:text-[22px] sm:text-[24px] font-black mb-[4px] sm:mb-[6px] text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 text-center leading-tight">
              Join Randomize();
            </h1>
            <p className="text-[11px] min-[400px]:text-[12px] sm:text-[13px] text-gray-300 leading-relaxed text-center">
              The Official Computing Club of Manipal University Jaipur.
            </p>
            <div className="mt-[8px] sm:mt-[10px] pt-[6px] sm:pt-[8px] border-t border-white/[0.08] text-center font-mono">
              <p className="text-[8.5px] min-[400px]:text-[9.5px] sm:text-[10px] text-cyan-300 uppercase font-bold tracking-[0.2em] m-0">IDEATE . COMMIT . SUCCEED</p>
            </div>
          </GlassCard>

          {/* 1. Unauthenticated Google Login Gate */}
          {!user ? (
            <div className="w-full py-[24px] sm:py-[28px] flex flex-col items-center text-center">
              <p className="text-[12px] min-[400px]:text-[13px] sm:text-[14px] text-gray-300 mb-[18px] sm:mb-[20px] max-w-[340px] leading-relaxed">
                Sign in with your personal Google account to start or access your membership portal.
              </p>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-[10px] sm:gap-[12px] w-full py-[14px] sm:py-[16px] rounded-[14px] font-semibold text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 transition-all active:scale-[0.99] min-h-[48px] cursor-pointer"
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
            /* 2. State-Aware Minimal Success Card */
            <div className="w-full py-[24px] sm:py-[28px] flex flex-col items-center text-center space-y-[16px] sm:space-y-[18px]">
              
              {successData.status === 'verified' ? (
                <div className="w-[50px] sm:w-[54px] h-[50px] sm:h-[54px] bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-[26px] sm:w-[28px] h-[26px] sm:h-[28px] text-emerald-400" aria-hidden="true" />
                </div>
              ) : (
                <div className="w-[50px] sm:w-[54px] h-[50px] sm:h-[54px] bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/10">
                  <Clock className="w-[24px] sm:w-[26px] h-[24px] sm:h-[26px] text-amber-400 animate-pulse" aria-hidden="true" />
                </div>
              )}

              <div>
                <h2 className="text-[19px] min-[400px]:text-[20px] sm:text-[22px] font-extrabold uppercase tracking-wide text-white mb-[4px]">
                  {successData.alreadyRegistered ? 'WELCOME BACK,' : 'APPLICATION LOGGED,'} {successData.full_name?.split(' ')[0]}!
                </h2>
                <p className="text-[11px] min-[400px]:text-[12px] sm:text-[13px] text-gray-400 px-[8px]">
                  {successData.status === 'verified'
                    ? 'You are actively registered for Randomize(); Tenure 2026-27.'
                    : 'Your payment details are queued for verification.'}
                </p>
              </div>

              {/* ID Pill Box with Live Approval Badge */}
              <div 
                className="bg-white/[0.03] border border-white/10 rounded-[16px] p-[16px] flex flex-col items-center justify-center shadow-xl relative w-full max-w-[280px]"
                style={{ minHeight: "105px" }}
              >
                <span className="text-[10px] sm:text-[11px] text-gray-400 font-mono uppercase tracking-[1.5px] mb-[4px] block text-center">
                  YOUR RANDOMIZE ID
                </span>
                <span className="text-[20px] min-[400px]:text-[22px] sm:text-[24px] leading-[28px] font-extrabold text-white tracking-[2px] font-mono whitespace-nowrap block text-center">
                  {successData.randomize_id}
                </span>

                {/* Status Indicator Bar */}
                <div className="mt-[8px] pt-[6px] border-t border-white/[0.06] w-full flex items-center justify-center">
                  {successData.status === 'verified' ? (
                    <span className="text-[9.5px] sm:text-[10px] font-mono uppercase tracking-[1px] text-emerald-400 font-semibold flex items-center gap-[4px]">
                      <span className="w-[5px] h-[5px] rounded-full bg-emerald-400 inline-block" />
                      Verified Member
                    </span>
                  ) : (
                    <span className="text-[9.5px] sm:text-[10px] font-mono uppercase tracking-[1px] text-amber-300 font-semibold flex items-center gap-[4px]">
                      <span className="w-[5px] h-[5px] rounded-full bg-amber-400 animate-ping inline-block" />
                      Waiting for Approval
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* 3. Main Form */
            <>
              {error && (
                <div 
                  role="alert" 
                  className="mb-[14px] px-[12px] py-[10px] bg-red-500/10 border border-red-500/20 rounded-[10px] flex items-center gap-[8px] text-red-300"
                >
                  <AlertTriangle className="w-[14px] h-[14px] shrink-0 text-red-400" aria-hidden="true" />
                  <span className="text-[11.5px] sm:text-[12px] font-mono leading-tight">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="w-full space-y-[12px] min-[400px]:space-y-[14px] sm:space-y-[16px]">
                
                {/* Authenticated Gmail */}
                <div className="space-y-[4px]">
                  <label htmlFor="auth-email" className="text-[10.5px] sm:text-[11px] font-mono uppercase tracking-wider text-gray-400 block">Personal Gmail (Authenticated)</label>
                  <input 
                    id="auth-email"
                    type="text" 
                    value={user.email || ''} 
                    readOnly 
                    className="w-full bg-white/[0.02] border border-white/10 rounded-[12px] px-[12px] min-[400px]:px-[14px] py-[11px] min-[400px]:py-[12px] text-gray-400 cursor-not-allowed outline-none font-mono text-[16px] sm:text-[13px] min-h-[48px]" 
                  />
                </div>

                {/* Membership Type Switcher */}
                <fieldset className="space-y-[4px]">
                  <legend className="text-[10.5px] sm:text-[11px] font-mono uppercase tracking-wider text-gray-400 block mb-[4px]">
                    Membership Mode *
                  </legend>
                  <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-[6px]">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, registrationType: 'Standard'})}
                      className={`py-[12px] px-[8px] text-center rounded-[12px] text-[12px] font-medium border transition-all min-h-[48px] active:scale-[0.98] ${
                        formData.registrationType === 'Standard'
                          ? 'bg-white/10 border-white/40 text-white font-semibold'
                          : 'bg-white/[0.03] border-white/15 text-gray-400 hover:text-white'
                      }`}
                    >
                      New Membership (₹400)
                    </button>
                    <button
                      type="button"
                      disabled={isBatch26}
                      onClick={() => {
                        if (!isBatch26) {
                          setFormData({...formData, registrationType: 'Renewal'});
                        }
                      }}
                      className={`py-[12px] px-[8px] text-center rounded-[12px] text-[12px] font-medium border transition-all min-h-[48px] active:scale-[0.98] ${
                        isBatch26 
                          ? 'opacity-40 cursor-not-allowed bg-white/[0.01] border-white/10 text-gray-500' 
                          : formData.registrationType === 'Renewal'
                            ? 'bg-white/10 border-white/40 text-white font-semibold'
                            : 'bg-white/[0.03] border-white/15 text-gray-400 hover:text-white'
                      }`}
                    >
                      Renewal (Existing Members) (₹100)
                    </button>
                  </div>
                  {isBatch26 && (
                    <p className="text-[9.5px] sm:text-[10px] text-amber-400/80 font-mono mt-[3px]">
                      * 2026 admission batch is restricted to New Membership.
                    </p>
                  )}
                </fieldset>

                {/* Text Inputs */}
                {[
                  { id: 'name', label: 'Full Name *', type: 'text', placeholder: 'e.g. Mohak Singhal', val: formData.name, autoComplete: 'name' },
                  { id: 'regNo', label: 'Registration Number *', type: 'text', placeholder: 'e.g. 24568478', val: formData.regNo, inputMode: 'numeric', pattern: '[0-9]*' },
                  { id: 'phone', label: 'WhatsApp / Mobile Number *', type: 'tel', placeholder: 'e.g. +91 98765 43210', val: formData.phone, inputMode: 'tel', autoComplete: 'tel' },
                  { id: 'outlookEmail', label: 'MUJ Outlook Email ID *', type: 'email', placeholder: 'name.24568478@muj.manipal.edu', val: formData.outlookEmail, autoComplete: 'email', autoCapitalize: 'none', autoCorrect: 'off', spellCheck: 'false' },
                ].map((field) => (
                  <div key={field.id} className="space-y-[4px]">
                    <label 
                      htmlFor={field.id}
                      className={`block text-[10.5px] sm:text-[11px] font-mono uppercase tracking-wider transition-colors ${activeField === field.id ? 'text-gray-200' : 'text-gray-400'}`}
                    >
                      {field.label}
                    </label>
                    <input 
                      id={field.id}
                      type={field.type} 
                      required 
                      placeholder={field.placeholder}
                      value={field.val}
                      inputMode={field.inputMode}
                      pattern={field.pattern}
                      autoComplete={field.autoComplete}
                      autoCapitalize={field.autoCapitalize}
                      autoCorrect={field.autoCorrect}
                      spellCheck={field.spellCheck}
                      className="w-full px-[12px] min-[400px]:px-[14px] py-[11px] min-[400px]:py-[12px] bg-white/[0.04] border border-white/15 rounded-[12px] text-white text-[16px] sm:text-[13px] outline-none transition-all focus:border-white/40 focus:bg-white/[0.07] placeholder:text-gray-500 min-h-[48px]"
                      onFocus={() => setActiveField(field.id)}
                      onBlur={() => setActiveField(null)}
                      onChange={(e) => {
                        if (field.id === 'regNo') {
                          handleRegNoChange(e.target.value);
                        } else {
                          setFormData({...formData, [field.id]: e.target.value});
                        }
                      }}
                    />
                  </div>
                ))}

                {/* Course Selector */}
                <div className="space-y-[4px]">
                  <label htmlFor="course-select" className="block text-[10.5px] sm:text-[11px] font-mono uppercase tracking-wider text-gray-400">
                    Academic Programme / Course *
                  </label>
                  <div className="relative">
                    <select
                      id="course-select"
                      required
                      value={formData.academicDetails}
                      onChange={handleCourseChange}
                      className="w-full px-[12px] min-[400px]:px-[14px] py-[11px] min-[400px]:py-[12px] pr-[36px] bg-[#120c1d] border border-white/15 rounded-[12px] text-white text-[16px] sm:text-[13px] outline-none focus:border-white/40 min-h-[48px] appearance-none cursor-pointer"
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

                {/* Mandatory Searchable Pitched By Dropdown */}
                <div className="space-y-[4px] relative" ref={pitchedByRef}>
                  <label 
                    htmlFor="pitched-by-input" 
                    className="block text-[10.5px] sm:text-[11px] font-mono uppercase tracking-wider text-gray-400"
                  >
                    Pitched By *
                  </label>
                  
                  <div className="relative flex items-center">
                    <input 
                      id="pitched-by-input"
                      type="text"
                      required
                      placeholder="Select or search member name..."
                      value={pitchedByDropdownOpen ? pitchedByQuery : (formData.pitchedBy || '')}
                      onFocus={(e) => {
                        setPitchedByQuery('');
                        setPitchedByDropdownOpen(true);
                        e.target.select();
                      }}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPitchedByQuery(val);
                        setFormData(prev => ({ ...prev, pitchedBy: val }));
                        setPitchedByDropdownOpen(true);
                      }}
                      className="w-full px-[12px] min-[400px]:px-[14px] py-[11px] min-[400px]:py-[12px] pr-[44px] bg-white/[0.04] border border-white/15 rounded-[12px] text-white text-[16px] sm:text-[13px] outline-none focus:border-white/40 min-h-[48px]"
                    />
                    <button
                      type="button"
                      aria-label="Toggle pitched by dropdown"
                      onClick={() => {
                        setPitchedByDropdownOpen(prev => {
                          const next = !prev;
                          if (next) {
                            setPitchedByQuery('');
                          }
                          return next;
                        });
                      }}
                      className="absolute right-[4px] w-[36px] h-[36px] flex items-center justify-center text-gray-400 hover:text-white rounded-[8px] transition-colors cursor-pointer"
                    >
                      <ChevronDown className={`w-[16px] h-[16px] transition-transform ${pitchedByDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {pitchedByDropdownOpen && (
                    <div className="absolute left-0 right-0 top-[102%] z-50 max-h-[260px] sm:max-h-[280px] overflow-y-auto bg-[#0d0915] border border-white/15 rounded-[14px] shadow-2xl p-[6px] backdrop-blur-2xl scrollbar-thin">
                      {filteredPitchedByGroups.length === 0 ? (
                        <div className="py-[12px] px-[10px] text-center text-gray-400 text-[12px] font-mono">
                          No matching member found
                        </div>
                      ) : (
                        filteredPitchedByGroups.map((group) => (
                          <div key={group.category} className="mb-[8px] last:mb-0">
                            <div className="px-[10px] pt-[6px] pb-[4px] border-b border-white/[0.08] mb-[3px]">
                              <span className="text-[10px] font-mono uppercase tracking-[1.5px] font-semibold text-cyan-400/90">
                                {group.category}
                              </span>
                            </div>

                            <div className="space-y-[1px] pl-[2px]">
                              {group.members.map((member) => {
                                const isSelected = formData.pitchedBy === member;
                                return (
                                  <button
                                    type="button"
                                    key={member}
                                    onClick={() => {
                                      setFormData(prev => ({ ...prev, pitchedBy: member }));
                                      setPitchedByQuery('');
                                      setPitchedByDropdownOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-[10px] py-[10px] rounded-[8px] text-[12px] text-left transition-colors cursor-pointer ${
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
                  <legend className="text-[10.5px] sm:text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-[6px]">Your Accommodation *</legend>
                  <div className="grid grid-cols-1 min-[400px]:grid-cols-3 gap-[6px] sm:gap-[8px]">
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

                {/* Dynamic Plan Summary Card */}
                <div className="p-[12px] min-[400px]:p-[14px] sm:p-[16px] rounded-[16px] bg-white/[0.02] border border-white/10 my-[10px]">
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-gray-400 font-semibold mb-[6px] block">
                    Membership Plan
                  </span>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[12.5px] min-[400px]:text-[13px] sm:text-[14px] font-semibold text-white">
                        {formData.registrationType === 'Renewal' ? 'Annual Renewal Pass' : 'Full Annual Access'}
                      </h4>
                      <p className="text-[10.5px] sm:text-[11px] text-gray-400 mt-[2px] leading-relaxed">
                        Workspaces, internal workshops & priority hackathons.
                      </p>
                    </div>
                    <span className="text-[13px] sm:text-[14px] font-mono text-white font-semibold bg-white/[0.06] border border-white/10 px-[10px] py-[4px] rounded-[8px]">
                      ₹{planAmount}
                    </span>
                  </div>
                </div>

                {/* Step 1: Payment Link */}
                <div className="space-y-[6px]">
                  <label className="text-[10.5px] sm:text-[11px] font-mono uppercase tracking-wider text-gray-400 block">
                    Step 1: Complete Payment (₹{planAmount})
                  </label>
                  <a
                    href={`/api/pay/membership?amount=${planAmount}&type=${formData.registrationType.toLowerCase()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-[13px] sm:py-[14px] px-[14px] sm:px-[16px] rounded-[12px] bg-white/[0.05] hover:bg-white/[0.09] border border-white/15 hover:border-white/30 text-white text-[12.5px] sm:text-[13px] font-semibold flex items-center justify-center gap-[8px] transition-all min-h-[48px] active:scale-[0.99]"
                  >
                    <CreditCard className="w-[16px] h-[16px] text-gray-300 shrink-0" />
                    <span>Pay ₹{planAmount} with CCAvenue</span>
                    <ExternalLink className="w-[14px] h-[14px] text-gray-400 shrink-0" />
                  </a>
                  <p className="text-[9.5px] sm:text-[10px] text-gray-400 font-mono text-center">
                    Opens gateway in a new tab. Complete payment and return here.
                  </p>
                </div>

                {/* Step 2: Receipt Dropzone */}
                <div className="space-y-[6px] pt-[2px]">
                  <label className="text-[10.5px] sm:text-[11px] font-mono uppercase tracking-wider text-gray-400 block">
                    Step 2: Upload Payment Screenshot *
                  </label>
                  
                  {!formData.paymentProof ? (
                    <div className="relative flex flex-col items-center justify-center w-full border border-dashed border-white/20 hover:border-white/45 focus-within:border-white/45 rounded-[14px] p-[16px] min-[400px]:p-[20px] bg-white/[0.02] transition-colors cursor-pointer text-center min-h-[96px]">
                      <input 
                        id="proof-upload"
                        type="file" 
                        required 
                        accept="image/*,application/pdf"
                        className="absolute inset-0 opacity-0 cursor-pointer z-20 w-full h-full"
                        onChange={handleScreenshotChange}
                      />
                      <div className="space-y-[6px] pointer-events-none flex flex-col items-center">
                        <UploadCloud className="w-[22px] sm:w-[24px] h-[22px] sm:h-[24px] text-gray-400" aria-hidden="true" />
                        <p className="text-[11.5px] sm:text-[12px] text-gray-300 font-medium m-0">
                          Tap to select receipt photo or PDF
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative p-[10px] min-[400px]:p-[12px] bg-white/[0.04] border border-white/15 rounded-[14px] flex flex-col gap-[10px]">
                      {imagePreviewUrl ? (
                        <div className="relative w-full max-h-[160px] rounded-[10px] overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center p-[4px]">
                          <img 
                            src={imagePreviewUrl} 
                            alt="Payment receipt preview" 
                            className="max-h-[140px] sm:max-h-[150px] object-contain rounded-[6px]"
                          />
                        </div>
                      ) : (
                        <div className="w-full py-[14px] sm:py-[16px] rounded-[10px] bg-black/40 border border-white/10 flex items-center justify-center gap-[10px]">
                          <FileText className="w-[22px] sm:w-[24px] h-[22px] sm:h-[24px] text-purple-400 shrink-0" />
                          <div className="text-left overflow-hidden max-w-[70%]">
                            <p className="text-[11.5px] sm:text-[12px] text-white font-mono truncate m-0">{formData.paymentProof.name}</p>
                            <p className="text-[9.5px] sm:text-[10px] text-gray-400 font-mono m-0">
                              {(formData.paymentProof.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-[4px] border-t border-white/[0.08]">
                        <span className="text-[10.5px] sm:text-[11px] font-mono text-gray-400 truncate max-w-[70%]">
                          {formData.paymentProof.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, paymentProof: null }))}
                          className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[6px] bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-[10.5px] sm:text-[11px] font-mono border border-red-500/20 transition-colors min-h-[32px] cursor-pointer"
                        >
                          <X className="w-[12px] h-[12px]" /> Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 3: Reference ID Input */}
                <div className="space-y-[4px]">
                  <div className="flex items-center justify-between">
                    <label htmlFor="ref-id" className="text-[10.5px] sm:text-[11px] font-mono uppercase tracking-wider text-gray-400">
                      Step 3: Reference ID / UTR *
                    </label>
                    {isScanning && (
                      <span className="flex items-center gap-[4px] text-[9.5px] sm:text-[10px] text-gray-300 font-mono" aria-live="polite">
                        <RefreshCw className="w-[11px] h-[11px] animate-spin" aria-hidden="true" /> Scanning...
                      </span>
                    )}
                    {ocrDetected && !isScanning && (
                      <span className="flex items-center gap-[4px] text-[9.5px] sm:text-[10px] text-emerald-400 font-mono">
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
                    className="w-full px-[12px] min-[400px]:px-[14px] py-[11px] min-[400px]:py-[12px] bg-white/[0.04] border border-white/15 rounded-[12px] text-white font-mono text-[16px] sm:text-[13px] outline-none focus:border-white/40 min-h-[48px]"
                  />
                </div>

                {/* Submit Form CTA */}
                <div className="pt-[6px] min-[400px]:pt-[8px] sm:pt-[12px]">
                  <button 
                    type="submit"
                    disabled={submitting || isScanning}
                    className="w-full py-[13px] sm:py-[14px] rounded-[12px] bg-gradient-to-r from-sky-500 via-blue-600 to-purple-600 hover:from-sky-400 hover:via-blue-500 hover:to-purple-500 active:scale-[0.99] disabled:opacity-50 min-h-[48px] cursor-pointer text-white font-semibold text-[13.5px] sm:text-[14px] tracking-wide transition-all shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 border-0 flex items-center justify-center gap-[8px]"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-[16px] h-[16px] animate-spin shrink-0" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <span>Submit Form</span>
                    )}
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