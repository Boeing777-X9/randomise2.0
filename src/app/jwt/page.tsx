'use client';
import { useEffect, useState, Suspense, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { CheckCircle, AlertTriangle, ArrowLeft, Info, ArrowRight, BookOpen, LogOut, ChevronDown, ChevronUp, Edit3, Trash2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
const DOMAIN_OPTIONS = [
  'Tech', 'Events & operation', 'Gd', 
  'Editorial', 'Social media & coverage', 'FNR', 'Outreach & promotions'
];
const MUJ_COURSES = [
  "B.Tech - Computer Science & Engineering (CSE)",
  "B.Tech - Information Technology (IT)",
  "B.Tech - Computer Science & Eng. (AI & ML)",
  "B.Tech - Computer Science & Eng. (Data Science)",
  "B.Tech - Computer Science & Eng. (IoT & Intelligent Systems)",
  "B.Tech - Electronics & Communication Engineering (ECE)",
  "B.Tech - Electrical & Electronics Engineering (EEE)",
  "B.Tech - Electrical & Computer Engineering",
  "B.Tech - Mechanical Engineering",
  "B.Tech - Mechatronics Engineering",
  "B.Tech - Automobile Engineering",
  "B.Tech - Civil Engineering",
  "B.Tech - Chemical Engineering",
  "B.Tech - Biotechnology",
  "B.Tech - Robotics and Artificial Intelligence",
  "Bachelor of Computer Applications (BCA)",
  "BCA (Honours / Honours with Research)",
  "Master of Computer Applications (MCA)",
  "Bachelor of Business Administration (BBA)",
  "BBA (Business Analytics)",
  "BBA (Hospitality & Tourism Operations)",
  "Bachelor of Commerce (B.Com) - Honours",
  "Master of Business Administration (MBA)",
  "Integrated MBA",
  "Bachelor of Architecture (B.Arch)",
  "Bachelor of Design (B.Des) - Interior Design",
  "Bachelor of Design (B.Des) - Fashion Design",
  "Bachelor of Fine Arts (BFA)",
  "BA LLB (Hons)",
  "BBA LLB (Hons)",
  "LLB",
  "LLM",
  "BA - Journalism & Mass Communication",
  "BA - Psychology",
  "BA - Economics",
  "BA - English",
  "B.Sc - Psychology",
  "B.Sc - Biotechnology",
  "B.Sc - Microbiology",
  "Bachelor of Physical Education and Sports (BPES)",
  "Bachelor of Hotel Management (BHM)"
];
const getCourseDuration = (courseName: string): number => {
  const lower = courseName.toLowerCase();
  if (lower.includes('b.arch') || lower.includes('ba llb') || lower.includes('bba llb') || lower.includes('integrated')) return 5;
  if (lower.includes('b.tech') || lower.includes('b.des') || lower.includes('bfa') || lower.includes('bhm') || lower.includes('hons') || lower.includes('honours')) return 4;
  if (lower.includes('mca') || lower.includes('mba') || lower.includes('llm')) return 2;
  return 3;
};
const isValidGithubProfile = (url: string): boolean => {
  const pattern = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}\/?$/i;
  return pattern.test(url.trim());
};
const isValidDriveUrl = (url: string): boolean => {
  const pattern = /^https?:\/\/(drive|docs)\.google\.com\/(drive\/(u\/\d+\/)?folders\/|file\/d\/|open\?id=)[a-zA-Z0-9_-]+/i;
  return pattern.test(url.trim());
};
const DOMAIN_INSTRUCTIONS = [
  {
    name: "Tech",
    desc: "Working right alongside the second-year leads, you’ll dive straight into building and updating the club’s website, fixing bugs on the fly, and creating the tools that keep event registrations running smoothly.",
    projects: [
      "CampusNav: A full-stack navigation platform guiding users room to room through complex campus buildings while live tracking college shuttles using ESP32 IoT hardware.",
      "Mesh Routed Offline Payments: An offline transaction system where encrypted payments hop across local devices through a mesh network until reaching internet settlement."
    ]
  },
  {
    name: "Editorial",
    desc: "Working with the core writing team, you’ll polish the club’s public voice by writing Vantage (the official club newsletter), event recaps, official communications, and promotional copy across all platforms."
  },
  {
    name: "Graphic Design (GD)",
    desc: "Under the direction of core design leads, you’ll turn ideas into visual assets, designing the official posters, social graphics, and branding that set the look and feel for everything we post."
  },
  {
    name: "Events & Operations",
    desc: "You’ll team up with the core committee to run the show ground level, securing venues, setting up tech hardware, and handling real-time logistics so every event goes off without a hitch."
  },
  {
    name: "Social Media & Coverage",
    desc: "You’ll join the core media crew behind the camera, capturing live events, shaping our social presence, and putting together content that keeps campus hooked on what we’re doing next."
  },
  {
    name: "Finance & Registrations (FNR)",
    desc: "You’ll manage registrations across all club events. You’ll also track JWT members’ expenses and assist the Treasurer and Core Members with budgeting, documentation, and other finance operations."
  },
  {
    name: "Outreach & Promotions",
    desc: "Teaming up with second-year leads, you’ll drive publicity across campus channels, execute hype campaigns, and get students excited to show up and participate."
  }
];
interface SuccessData {
  application_id: string;
  randomize_id?: string | null;
  isExisting?: boolean;
  full_name?: string;
}
const DRAFT_STORAGE_KEY = 'randomize_jwt_draft_26';
const MAX_FILE_SIZE_MB = 2;
const COUNTER_EVENT_ID = '94a0bde7-69af-483a-b8e4-66fa25be981f';
const maskEmail = (email?: string | null) => {
  if (!email) return null;
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  const [name, domain] = parts;
  if (name.length <= 2) return `${name[0]}***@${domain}`;
  return `${name.substring(0, 2)}***${name.substring(name.length - 1)}@${domain}`;
};

export default function JWTRegistrationForm() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#050505]"><div className="animate-spin w-10 h-10 border-4 border-white/20 border-t-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)]" /></div>}>
      <JWTRegistrationFormContent />
    </Suspense>
  );
}

function JWTRegistrationFormContent() {
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mismatchError, setMismatchError] = useState<{ personal?: string | null, outlook?: string | null } | null>(null);

  const [profileDone, setProfileDone] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [rolesConfirmed, setRolesConfirmed] = useState(false);
  const [expandedDomain, setExpandedDomain] = useState<number | null>(null);
  
  const [isMember, setIsMember] = useState(false);
  const [randomizeId, setRandomizeId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    registrationNumber: '',
    phoneNumber: '',
    yearOfStudy: '1',
    outlookEmail: '',
    course: '',
    accommodation: '',
    githubLink: '',
    gdPortfolioLink: '',
  });
  
  const [pref1, setPref1] = useState('');
  const [pref2, setPref2] = useState('');
  const [pref3, setPref3] = useState('');
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [techStack, setTechStack] = useState('');

  const [is3dFamiliar, setIs3dFamiliar] = useState(false);
  const [hasGraphicExp, setHasGraphicExp] = useState(false);
  const [graphicLevel, setGraphicLevel] = useState('');
  const [designTools, setDesignTools] = useState('');

  const [socialReachStrategy, setSocialReachStrategy] = useState('');
  const [hasVideoExp, setHasVideoExp] = useState(false);
  const [videoTools, setVideoTools] = useState('');
  const [videoLink, setVideoLink] = useState('');
  
  const [outreachStrategy, setOutreachStrategy] = useState('');
  const [editorialProcess, setEditorialProcess] = useState('');
  const [editorialUrgent, setEditorialUrgent] = useState('');

  useEffect(() => {
    if (error) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [error]);

  useEffect(() => {
    const initialize = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (currentUser) {
        setUser(currentUser);

        const { data: existingApp } = await supabase
          .from('jwt_recruitment_26')
          .select('id, full_name, randomize_id')
          .eq('email', currentUser.email?.toLowerCase().trim())
          .maybeSingle();

        if (existingApp) {
          setSuccessData({
            application_id: existingApp.id,
            randomize_id: existingApp.randomize_id,
            isExisting: true,
            full_name: existingApp.full_name,
          });
          setLoading(false);
          setIsDraftLoaded(true);
          return;
        }

        const cleanEmail = currentUser.email?.toLowerCase().trim();
        const { data: directoryProfile } = await supabase
          .from('randomize_directory')
          .select('*') 
          .or(`email.ilike.${cleanEmail},outlook_email.ilike.${cleanEmail}`)
          .maybeSingle();

        let officialName = currentUser.user_metadata?.full_name || '';
        let officialReg = '';
        let officialPhone = '';
        let officialYear = '1';
        let officialOutlook = '';
        let officialCourse = '';
        let officialAccommodation = '';

        if (directoryProfile) {
          setIsMember(directoryProfile.is_member === true);
          setRandomizeId(directoryProfile.randomize_id);
          
          officialName = directoryProfile.name || officialName;
          officialReg = directoryProfile.registration_number || '';
          officialPhone = directoryProfile.phone_number || directoryProfile.whatsapp_number || '';
          
          if (directoryProfile.pass_year) {
             const currentYear = new Date().getFullYear();
             const calcYear = 4 - (directoryProfile.pass_year - currentYear) + 1;
             officialYear = calcYear > 0 && calcYear <= 5 ? String(calcYear) : '1';
          }
          
          officialOutlook = directoryProfile.outlook_email || '';
          officialCourse = directoryProfile.course || directoryProfile.branch || '';
          officialAccommodation = directoryProfile.accommodation || '';
          
          setProfileDone(true);
        }

        const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (savedDraft) {
          try {
            const draft = JSON.parse(savedDraft);
            setFormData({
              fullName: officialName || draft.formData?.fullName || '', 
              registrationNumber: officialReg || draft.formData?.registrationNumber || '', 
              phoneNumber: officialPhone || draft.formData?.phoneNumber || '',
              yearOfStudy: officialYear !== '1' ? officialYear : (draft.formData?.yearOfStudy || '1'),
              outlookEmail: officialOutlook || draft.formData?.outlookEmail || '',
              course: officialCourse || draft.formData?.course || '',
              accommodation: officialAccommodation || draft.formData?.accommodation || '',
              githubLink: draft.formData?.githubLink || '',
              gdPortfolioLink: draft.formData?.gdPortfolioLink || ''
            });
            setPref1(draft.pref1 || '');
            setPref2(draft.pref2 || '');
            setPref3(draft.pref3 || '');
            setTechStack(draft.techStack || '');
            setIs3dFamiliar(draft.is3dFamiliar || false);
            setHasGraphicExp(draft.hasGraphicExp || false);
            setGraphicLevel(draft.graphicLevel || '');
            setDesignTools(draft.designTools || '');
            setSocialReachStrategy(draft.socialReachStrategy || '');
            setHasVideoExp(draft.hasVideoExp || false);
            setVideoTools(draft.videoTools || '');
            setVideoLink(draft.videoLink || '');
            setOutreachStrategy(draft.outreachStrategy || '');
            setEditorialProcess(draft.editorialProcess || '');
            setEditorialUrgent(draft.editorialUrgent || '');
            
            setShowForm(draft.showForm || false);
            setRolesConfirmed(draft.rolesConfirmed || false);
            
            if (!directoryProfile) {
              if (draft.profileDone && (!draft.formData?.outlookEmail || !draft.formData?.course || !draft.formData?.accommodation)) {
                setProfileDone(false);
                setShowForm(false);
              } else {
                setProfileDone(draft.profileDone || false);
              }
            }
          } catch {
            setFormData(prev => ({ ...prev, fullName: officialName, registrationNumber: officialReg, phoneNumber: officialPhone, yearOfStudy: officialYear, outlookEmail: officialOutlook, course: officialCourse, accommodation: officialAccommodation }));
          }
        } else {
          setFormData(prev => ({ ...prev, fullName: officialName, registrationNumber: officialReg, phoneNumber: officialPhone, yearOfStudy: officialYear, outlookEmail: officialOutlook, course: officialCourse, accommodation: officialAccommodation }));
        }
      }
      setLoading(false);
      setIsDraftLoaded(true);
    };

    initialize();
  }, []);

  useEffect(() => {
    if (!user || formData.registrationNumber.length < 5 || isMember) {
      setMismatchError(null);
      return;
    }
    
    const checkMismatch = async () => {
      const { data } = await supabase
        .from('randomize_directory')
        .select('email, outlook_email')
        .eq('registration_number', formData.registrationNumber)
        .maybeSingle();

      if (data) {
        const currentEmail = user.email?.toLowerCase().trim();
        const dirEmail = data.email?.toLowerCase().trim();
        const dirOutlook = data.outlook_email?.toLowerCase().trim();

        if (currentEmail !== dirEmail && currentEmail !== dirOutlook) {
          setMismatchError({ 
            personal: maskEmail(data.email), 
            outlook: maskEmail(data.outlook_email) 
          });
        } else {
          setMismatchError(null);
        }
      } else {
        setMismatchError(null);
      }
    };
    
    const timeoutId = setTimeout(checkMismatch, 600);
    return () => clearTimeout(timeoutId);
  }, [formData.registrationNumber, user, isMember]);

  useEffect(() => {
    if (isDraftLoaded && user && !successData) {
      const draft = {
        formData, pref1, pref2, pref3, techStack,
        is3dFamiliar, hasGraphicExp, graphicLevel, designTools, 
        socialReachStrategy, hasVideoExp, videoTools, videoLink, 
        outreachStrategy, editorialProcess, editorialUrgent,
        showForm, rolesConfirmed, profileDone
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    }
  }, [formData, pref1, pref2, pref3, techStack, is3dFamiliar, hasGraphicExp, graphicLevel, designTools, socialReachStrategy, hasVideoExp, videoTools, videoLink, outreachStrategy, editorialProcess, editorialUrgent, showForm, rolesConfirmed, profileDone, user, successData, isDraftLoaded]);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/jwt` },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleClearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    window.location.reload();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setResumeFile(null);
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Resume file is too large. Maximum size allowed is ${MAX_FILE_SIZE_MB}MB.`);
      e.target.value = '';
      setResumeFile(null);
      return;
    }
    setError(null);
    setResumeFile(file);
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (mismatchError) {
       window.scrollTo({ top: 0, behavior: 'smooth' });
       return;
    }
    if (!formData.accommodation) return setError("Please select your accommodation type.");
    if (!formData.course) return setError("Please select your academic programme.");

    const expectedFirstName = formData.fullName.trim().split(' ')[0].toLowerCase();
    const cleanRegNo = formData.registrationNumber.trim().toLowerCase();
    const expectedEmail = `${expectedFirstName}.${cleanRegNo}@muj.manipal.edu`;
    const providedEmail = formData.outlookEmail.trim().toLowerCase();

    if (providedEmail !== expectedEmail) {
      return setError(`Invalid MUJ Outlook Email format. Expected: ${expectedEmail}`);
    }

    setSubmitting(true);
    try {
      const startYearStr = formData.registrationNumber.substring(0, 2);
      let safeStartYear = parseInt(startYearStr, 10);
      if (isNaN(safeStartYear) || safeStartYear < 10) safeStartYear = parseInt(String(new Date().getFullYear()).substring(2, 4));
      
      const courseDuration = getCourseDuration(formData.course);
      const shortGradYear = safeStartYear + courseDuration;
      const fullPassYear = 2000 + shortGradYear;

      const { data: existingDirEntry } = await supabase
        .from('randomize_directory')
        .select('randomize_id')
        .eq('registration_number', formData.registrationNumber)
        .maybeSingle();

      let newRandomizeId = existingDirEntry?.randomize_id || randomizeId;
      
      if (!newRandomizeId) {
        const { data: counterData } = await supabase
          .from('event_counters')
          .select('current_serial')
          .eq('event_id', COUNTER_EVENT_ID)
          .eq('graduation_year', shortGradYear)
          .maybeSingle();

        let nextSerial = 1;
        if (counterData) {
          nextSerial = counterData.current_serial + 1;
          await supabase
            .from('event_counters')
            .update({ current_serial: nextSerial })
            .eq('event_id', COUNTER_EVENT_ID)
            .eq('graduation_year', shortGradYear);
        } else {
          await supabase
            .from('event_counters')
            .insert({
              event_id: COUNTER_EVENT_ID,
              graduation_year: shortGradYear,
              current_serial: nextSerial
            });
        }
        
        newRandomizeId = `RA${shortGradYear}-${String(nextSerial).padStart(3, '0')}`;
        setRandomizeId(newRandomizeId);
      }

      const dirPayload = {
        randomize_id: newRandomizeId,
        registration_number: formData.registrationNumber,
        name: formData.fullName.trim(),
        email: user?.email?.toLowerCase().trim() || '',
        outlook_email: formData.outlookEmail.toLowerCase().trim(),
        phone_number: formData.phoneNumber.trim(),
        course: formData.course.trim(),
        pass_year: fullPassYear,
        accommodation: formData.accommodation,
        google_auth_id: user?.id || null,
        is_member: false 
      };

      if (existingDirEntry) {
        const { error: updateError } = await supabase
          .from('randomize_directory')
          .update(dirPayload)
          .eq('registration_number', formData.registrationNumber);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('randomize_directory')
          .insert(dirPayload);
        if (insertError) throw insertError;
      }
      
      setError(null);
      setProfileDone(true);
    } catch (err: any) {
      setError("Failed to save directory profile: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const verifyDriveLinkPublic = async (url: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/check-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      return !!data.isPublic;
    } catch {
      return true;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pref1 || !pref2 || !pref3) {
      return setError("Please select all 3 domain preferences.");
    }

    if (!user) return setError("User session is missing.");
    if (mismatchError) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return setError("ID Mismatch detected. Please resolve before submitting.");
    }

    const selectedDomains = [pref1, pref2, pref3];

    if (selectedDomains.includes('Tech')) {
      if (formData.githubLink && !isValidGithubProfile(formData.githubLink)) {
        return setError("Please enter a valid GitHub profile URL (e.g., https://github.com/username).");
      }
      if (!resumeFile) {
        return setError("Please upload your PDF resume.");
      }
      if (!techStack.trim()) {
        return setError("Please enter your Tech Stack & Skills.");
      }
    }

    if (selectedDomains.includes('Gd')) {
      if (!formData.gdPortfolioLink || !isValidDriveUrl(formData.gdPortfolioLink)) {
        return setError("Please enter a valid Google Drive portfolio URL (e.g., https://drive.google.com/drive/folders/...).");
      }
    }

    if (selectedDomains.includes('Social media & coverage') && hasVideoExp) {
      if (!videoLink || !isValidDriveUrl(videoLink)) {
        return setError("Please enter a valid Google Drive link for your video edits.");
      }
    }

    setSubmitting(true);

    if (selectedDomains.includes('Gd') && formData.gdPortfolioLink) {
      const isPublic = await verifyDriveLinkPublic(formData.gdPortfolioLink);
      if (!isPublic) {
        setSubmitting(false);
        return setError("Your Graphic Design Drive folder is set to Private. Please open Drive > Share > change access to 'Anyone with the link can view' before submitting.");
      }
    }

    if (selectedDomains.includes('Social media & coverage') && hasVideoExp && videoLink) {
      const isPublic = await verifyDriveLinkPublic(videoLink);
      if (!isPublic) {
        setSubmitting(false);
        return setError("Your Video edits Drive link is set to Private. Please open Drive > Share > change access to 'Anyone with the link can view' before submitting.");
      }
    }

    try {
      let resumeUrl = '';
      
      if (selectedDomains.includes('Tech') && resumeFile) {
        const fileExt = resumeFile.name.split('.').pop();
        const safeRegNumber = formData.registrationNumber || 'GUEST';
        const fileName = `${safeRegNumber}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(`jwt_26/${fileName}`, resumeFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw new Error("Failed to upload resume: " + uploadError.message);
        
        const { data: { publicUrl } } = supabase.storage
          .from('resumes')
          .getPublicUrl(`jwt_26/${fileName}`);
          
        resumeUrl = publicUrl;
      }

      const { data, error: insertError } = await supabase
        .from('jwt_recruitment_26')
        .insert({
          registration_number: formData.registrationNumber,
          randomize_id: randomizeId,
          is_member: isMember,
          full_name: formData.fullName.trim(),
          email: user.email?.toLowerCase().trim(),
          phone_number: formData.phoneNumber.trim(),
          year_of_study: parseInt(formData.yearOfStudy),
          domain_preferences: selectedDomains,
          
          tech_stack: techStack || null,
          github_link: formData.githubLink || null,
          resume_s3_url: resumeUrl || null,
          
          gdrive_portfolio_link: formData.gdPortfolioLink || null,
          is_3d_familiar: is3dFamiliar,
          has_graphic_design_exp: hasGraphicExp,
          graphic_design_level: hasGraphicExp ? graphicLevel : null,
          design_tools_used: designTools || null,
          
          social_reach_strategy: socialReachStrategy || null,
          has_video_exp: hasVideoExp,
          video_tools_used: hasVideoExp ? videoTools : null,
          video_portfolio_link: hasVideoExp ? videoLink : null,
          
          outreach_research_strategy: outreachStrategy || null,
          editorial_blank_page_process: editorialProcess || null,
          editorial_urgent_draft_action: editorialUrgent || null
        })
        .select('id')
        .single();

      if (insertError) throw insertError;
      
      if (data) {
        setSuccessData({ 
          application_id: data.id, 
          randomize_id: randomizeId,
          isExisting: false, 
          full_name: formData.fullName 
        });
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedDomainsArray = [pref1, pref2, pref3];
  const isTechSelected = selectedDomainsArray.includes('Tech');
  const isGdSelected = selectedDomainsArray.includes('Gd');
  const isSocialSelected = selectedDomainsArray.includes('Social media & coverage');
  const isOutreachSelected = selectedDomainsArray.includes('Outreach & promotions');
  const isEditorialSelected = selectedDomainsArray.includes('Editorial');
  
  const inputStyle = "w-full px-4 py-3.5 text-sm rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all duration-300 backdrop-blur-sm";
  const labelStyle = "block text-xs font-semibold text-gray-300 uppercase tracking-widest mb-2";

  const dynamicSectionStyle = "p-6 border border-purple-500/30 bg-purple-500/[0.05] rounded-2xl space-y-6 shadow-inner shadow-black/10";
  const dynamicHeaderStyle = "font-black text-purple-400 text-sm uppercase tracking-widest";

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white bg-[#050505]">Loading...</div>;

  return (
    <div className="relative isolate min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden overflow-y-auto pt-32 pb-24 flex justify-center items-start">
      
      <div className="fixed inset-0 pointer-events-none -z-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      <div className="fixed top-[10%] left-[20%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-[20%] right-[20%] w-[500px] h-[500px] bg-pink-600/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Strict Pixel Constraint for Outer Container: Shrinks to exactly 600px when successful */}
      <div className={`w-full px-2 sm:px-6 relative z-10 flex flex-col mx-auto transition-all duration-500 ease-in-out ${successData ? 'max-w-[600px]' : 'max-w-[90vw] md:max-w-3xl lg:max-w-4xl'}`}>
        
        <div className="flex justify-between items-center mt-8 mb-6 px-2">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm group font-medium">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </button>
          
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                {randomizeId && (
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-[#F20059] bg-[#F20059]/10 px-3 py-1 rounded-full border border-[#F20059]/20 shadow-[0_0_10px_rgba(242,0,89,0.2)] hidden sm:block">
                    {randomizeId}
                  </span>
                )}
                <span className="text-[10px] sm:text-xs font-mono text-purple-200/70 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 hidden sm:block">
                  {user.email}
                </span>
                <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-red-400/80 hover:text-red-400 transition-colors font-semibold bg-red-500/10 hover:bg-red-500/20 px-3 py-1 rounded-full border border-red-500/20">
                  <LogOut className="w-3 h-3" /> <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            )}
            
            {user && !successData && showForm && (
              <button onClick={() => setShowForm(false)} className="flex items-center gap-2 text-purple-400/70 hover:text-purple-300 transition-colors text-xs sm:text-sm font-semibold ml-2">
                <BookOpen className="w-4 h-4" /> Review Roles
              </button>
            )}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full bg-white/[0.02] backdrop-blur-3xl border border-white/[0.08] shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-3xl p-6 sm:p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

          {!successData && (
            <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 relative z-10">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2 uppercase drop-shadow-md">
                  Randomize(); <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">JWT</span>
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm tracking-widest uppercase font-semibold">Ideate. Commit. Succeed.</p>
              </div>
              {showForm && (
                <div className="flex items-center gap-3 mt-4 sm:mt-0">
                  <button type="button" onClick={handleClearDraft} className="text-[10px] sm:text-xs text-red-400/60 hover:text-red-400 uppercase tracking-widest flex items-center gap-1 transition-colors">
                    <Trash2 className="w-3 h-3" /> Clear Draft
                  </button>
                  <span className="text-[10px] sm:text-xs font-mono text-purple-300/50 uppercase tracking-widest">Draft Saved Locally</span>
                </div>
              )}
            </div>
          )}

          <div className="relative z-10">
            {!user ? (
              <div className="w-full py-12 flex flex-col items-center animate-in fade-in zoom-in-95">
                <p className="text-gray-300 mb-8 text-center text-sm sm:text-base">Sign in with your Google account to start your application.</p>
                <button onClick={handleGoogleLogin} className="flex items-center justify-center gap-3 w-full sm:w-[320px] py-4 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-300 backdrop-blur-md shadow-lg">
                  <svg className="w-5 h-5 bg-white rounded-full p-0.5 shrink-0" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                  </svg>
                  <span>Sign In with Google</span>
                </button>
              </div>
            ) : successData ? (
              <div className="w-full py-10 flex flex-col items-center text-center animate-in fade-in">
                <CheckCircle className="w-20 h-20 text-purple-400 mb-6 drop-shadow-[0_0_20px_rgba(192,132,252,0.4)]" />
                
                {/* Strict Width Pixel Enforcement Blocks (Prevents Word Wrapping) */}
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 w-[500px]">
                  {successData.isExisting ? 'APPLICATION ALREADY SUBMITTED!' : 'APPLICATION SUBMITTED!'}
                </h2>
                
                <p className="text-gray-400 mb-8 text-sm sm:text-base w-[450px] leading-relaxed">
                  {successData.full_name ? `Thanks, ${successData.full_name}. ` : ''}
                  Your JWT recruitment preferences and portfolio have been recorded.
                </p>
            
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 w-[450px] shadow-inner shadow-black/20 space-y-2 mx-auto">
                  <p className="text-[11px] text-purple-300 font-bold uppercase tracking-widest mb-1">Randomize ID</p>
                  <p className="text-2xl font-mono font-black tracking-wider text-white">
                    {successData.randomize_id || randomizeId || 'ASSIGNED'}
                  </p>
                </div>
            
                <button
                  onClick={() => router.push('/')}
                  className="mt-8 px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors w-[250px]"
                >
                  Return to Home
                </button>
              </div>
            ) : !profileDone ? (

              <form onSubmit={handleProfileSubmit} className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-500">
                <div className="mb-8 border-b border-white/[0.06] pb-6">
                  <h3 className="text-white text-xl font-bold tracking-wide flex items-center gap-3 mb-2">
                    Directory Profile Setup
                  </h3>
                  <p className="text-gray-400 text-sm">Please verify your details and fill in the missing information before proceeding to the application.</p>
                </div>

                {mismatchError && (
                  <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-2xl flex flex-col items-center gap-3 text-center animate-in zoom-in-95 backdrop-blur-md">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                    <p className="text-sm font-bold text-red-200 uppercase tracking-widest">ID Mismatch Detected</p>
                    <p className="text-xs text-red-300/80 leading-relaxed">
                      The Registration Number <strong>{formData.registrationNumber.toUpperCase()}</strong> belongs to an existing member. 
                      However, you are logged in with <strong>{user.email}</strong>.
                    </p>
                    <div className="text-xs text-red-300/80 mt-1 mb-2">
                      Please logout and sign in using the correct email:
                      <div className="flex flex-wrap justify-center gap-2 mt-3">
                        {mismatchError.personal && <span className="px-3 py-1 bg-black/40 rounded-lg font-mono text-white tracking-widest">{mismatchError.personal}</span>}
                        {mismatchError.outlook && <span className="px-3 py-1 bg-black/40 rounded-lg font-mono text-white tracking-widest">{mismatchError.outlook}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {error && !mismatchError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 text-red-200 backdrop-blur-md">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelStyle}>Full Name *</label>
                    <input required type="text" disabled={isMember} value={formData.fullName} onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))} className={`${inputStyle} disabled:opacity-50`} />
                  </div>
                  <div>
                    <label className={labelStyle}>Registration Number *</label>
                    <input required type="text" inputMode="numeric" pattern="[0-9]*" maxLength={15} disabled={isMember} value={formData.registrationNumber} onChange={e => setFormData(p => ({ ...p, registrationNumber: e.target.value.replace(/\D/g, '') }))} className={`${inputStyle} ${mismatchError ? 'border-red-500/50 focus:border-red-500' : ''} disabled:opacity-50`} placeholder="e.g. 260205XXXX" />
                  </div>
                  <div>
                    <label className={labelStyle}>WhatsApp / Mobile Number *</label>
                    <input required type="tel" value={formData.phoneNumber} onChange={e => setFormData(p => ({ ...p, phoneNumber: e.target.value.replace(/[^\d+]/g, '') }))} className={inputStyle} placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className={labelStyle}>MUJ Outlook Email ID *</label>
                    <input required type="email" value={formData.outlookEmail} onChange={e => setFormData(p => ({ ...p, outlookEmail: e.target.value }))} className={inputStyle} placeholder="firstname.12345678@muj.manipal.edu" />
                  </div>
                  
                  <div>
                    <label className={labelStyle}>Academic Programme / Course *</label>
                    <select required value={formData.course} onChange={e => setFormData(p => ({ ...p, course: e.target.value }))} className={`${inputStyle} cursor-pointer appearance-none`}>
                      <option value="" className="bg-[#0c0812]">Select your course...</option>
                      {MUJ_COURSES.map(course => <option key={course} value={course} className="bg-[#0c0812]">{course}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className={labelStyle}>Year of Study *</label>
                    <select required value={formData.yearOfStudy} onChange={e => setFormData(p => ({ ...p, yearOfStudy: e.target.value }))} className={`${inputStyle} cursor-pointer appearance-none`}>
                      <option value="1" className="bg-[#0c0812]">1st Year</option>
                      <option value="2" className="bg-[#0c0812]">2nd Year</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelStyle}>Your Accommodation *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                       {['GHS', 'Day Scholar', 'PG/Flat'].map(acc => (
                          <button
                            key={acc}
                            type="button"
                            onClick={() => setFormData(p => ({...p, accommodation: acc}))}
                            className={`py-3.5 rounded-xl border text-sm font-bold tracking-wider transition-all duration-300 ${formData.accommodation === acc ? 'bg-purple-500/20 border-purple-500/50 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-white/[0.02] border-white/10 text-gray-400 hover:bg-white/[0.05]'}`}
                          >
                            {acc}
                          </button>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/[0.06] flex justify-end">
                  <button disabled={!!mismatchError || submitting} type="submit" className="w-full sm:w-auto px-8 py-4 rounded-xl font-black uppercase tracking-widest text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2">
                    {submitting ? 'Saving Profile...' : 'Continue to Application'} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

            ) : !showForm ? (
              
              <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                <div className="flex items-center gap-3 mb-2">
                  <Info className="w-6 h-6 text-purple-400" />
                  <h3 className="text-white text-lg font-bold tracking-widest uppercase">Select Your Domain</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">Review the responsibilities for each core domain before submitting your application. Click to expand.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {DOMAIN_INSTRUCTIONS.map((domain, idx) => {
                    const isExpanded = expandedDomain === idx;
                    
                    return (
                      <div 
                        key={idx} 
                        className="bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden hover:bg-white/[0.03] transition-colors shadow-inner shadow-black/10 cursor-pointer"
                        onClick={() => setExpandedDomain(isExpanded ? null : idx)}
                      >
                        <div className="p-5 flex items-center justify-between">
                          <h4 className="text-sm font-bold text-purple-300 uppercase tracking-wider">{domain.name}</h4>
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                        </div>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }} 
                              animate={{ height: 'auto', opacity: 1 }} 
                              exit={{ height: 0, opacity: 0 }}
                              className="px-5 pb-5 overflow-hidden"
                            >
                              <div className="pt-2 border-t border-white/[0.05]">
                                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mt-4">{domain.desc}</p>
                                {domain.projects && (
                                  <ul className="mt-4 list-disc text-xs text-gray-400 space-y-2 ml-4">
                                    {domain.projects.map((proj, pIdx) => (
                                      <li key={pIdx}><span className="text-gray-300 font-medium">{proj.split(':')[0]}:</span>{proj.split(':')[1]}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row gap-6 items-center justify-between">
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-1">
                      <input type="checkbox" checked={rolesConfirmed} onChange={(e) => setRolesConfirmed(e.target.checked)} className="peer appearance-none w-6 h-6 border-2 border-white/20 rounded-md checked:bg-purple-500 checked:border-purple-500 transition-all cursor-pointer" />
                      <CheckCircle className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors leading-relaxed">
                      I have reviewed the domain responsibilities and am ready to proceed with my application.
                    </span>
                  </label>
                  
                  <button 
                    onClick={() => setShowForm(true)} 
                    disabled={!rolesConfirmed}
                    className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-white bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] hover:shadow-[0_0_30px_rgba(161,15,242,0.4)] transition-all duration-300 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                  >
                    Proceed <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

            ) : (
              
              <form onSubmit={handleSubmit} className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-500">
                
                {mismatchError && (
                  <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-2xl flex flex-col items-center gap-3 text-center animate-in zoom-in-95 backdrop-blur-md">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                    <p className="text-sm font-bold text-red-200 uppercase tracking-widest">ID Mismatch Detected</p>
                    <p className="text-xs text-red-300/80 leading-relaxed">
                      The Registration Number <strong>{formData.registrationNumber.toUpperCase()}</strong> belongs to an existing member. 
                      However, you are currently logged in with a different email ({user.email}).
                    </p>
                    <div className="text-xs text-red-300/80 mt-1 mb-2">
                      Please logout and sign in using one of the associated emails:
                      <div className="flex flex-wrap justify-center gap-2 mt-3">
                        {mismatchError.personal && <span className="px-3 py-1 bg-black/40 rounded-lg font-mono text-white tracking-widest">{mismatchError.personal}</span>}
                        {mismatchError.outlook && <span className="px-3 py-1 bg-black/40 rounded-lg font-mono text-white tracking-widest">{mismatchError.outlook}</span>}
                      </div>
                    </div>
                    <button type="button" onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600/80 hover:bg-red-500 text-white text-sm font-bold transition-colors shadow-lg">
                      <LogOut className="w-4 h-4" /> Logout & Switch Account
                    </button>
                  </div>
                )}

                {error && !mismatchError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 text-red-200 backdrop-blur-md">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                {/* Profile Card with prominent ID */}
                <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-inner shadow-black/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-white tracking-widest block">
                        RANDOMIZE ID: <span className="text-purple-400">{randomizeId || 'GENERATED UPON SUBMIT'}</span>
                      </span>
                      <span className="text-[11px] text-gray-400 block">
                        Linked with {formData.registrationNumber}
                      </span>
                    </div>
                  </div>
                  {!isMember && (
                     <button type="button" onClick={() => { setProfileDone(false); setShowForm(false); }} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white self-start sm:self-auto transition-colors flex items-center gap-2">
                       <Edit3 className="w-3 h-3" /> Edit Details
                     </button>
                  )}
                </div>

                <div className="pt-4">
                  <h3 className="text-white text-lg font-bold mb-6 tracking-wide">Domain Preferences</h3>
                  <div className="flex flex-col space-y-5">
                    <div>
                      <label className={labelStyle}>1st Preference *</label>
                      <select required value={pref1} onChange={e => setPref1(e.target.value)} className={`${inputStyle} cursor-pointer appearance-none`}>
                        <option value="" className="bg-[#0c0812]">Select First Domain...</option>
                        {DOMAIN_OPTIONS.map(d => <option key={d} value={d} className="bg-[#0c0812]">{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelStyle}>2nd Preference *</label>
                      <select required value={pref2} onChange={e => setPref2(e.target.value)} className={`${inputStyle} cursor-pointer appearance-none`}>
                        <option value="" className="bg-[#0c0812]">Select Second Domain...</option>
                        {DOMAIN_OPTIONS.map(d => <option key={d} value={d} className="bg-[#0c0812]">{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelStyle}>3rd Preference *</label>
                      <select required value={pref3} onChange={e => setPref3(e.target.value)} className={`${inputStyle} cursor-pointer appearance-none`}>
                        <option value="" className="bg-[#0c0812]">Select Third Domain...</option>
                        {DOMAIN_OPTIONS.map(d => <option key={d} value={d} className="bg-[#0c0812]">{d}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  
                  {/* Tech Requirements */}
                  <AnimatePresence>
                    {isTechSelected && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className={dynamicSectionStyle}>
                          <h3 className={dynamicHeaderStyle}>TECH REQUIREMENTS</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                              <label className={labelStyle}>GitHub Profile URL</label>
                              <input 
                                type="url" 
                                value={formData.githubLink} 
                                onChange={e => setFormData(p => ({ ...p, githubLink: e.target.value }))} 
                                className={inputStyle} 
                                placeholder="https://github.com/your-username (Optional)"
                              />
                            </div>
                            <div>
                              <label className={labelStyle}>Resume (PDF) - Max 2MB *</label>
                              <input type="file" accept=".pdf" required onChange={handleFileChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:font-bold file:uppercase file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer border border-white/[0.08] bg-white/[0.02] transition-colors" />
                            </div>
                            <div className="md:col-span-2">
                              <label className={labelStyle}>Tech Stack & Skills *</label>
                              <textarea required rows={3} value={techStack} onChange={e => setTechStack(e.target.value)} className={`${inputStyle} resize-none`} placeholder="React, Node.js, Python, C++, Figma..." />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Graphic Design Portfolio */}
                  <AnimatePresence>
                    {isGdSelected && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className={dynamicSectionStyle}>
                          <h3 className={dynamicHeaderStyle}>GRAPHIC DESIGN PORTFOLIO</h3>
                          
                          <div>
                            <label className={labelStyle}>Public Google Drive Portfolio Link (Posters, Assets, Branding) *</label>
                            <input 
                              type="url" 
                              required 
                              value={formData.gdPortfolioLink} 
                              onChange={e => setFormData(p => ({ ...p, gdPortfolioLink: e.target.value }))} 
                              className={inputStyle} 
                              placeholder="https://drive.google.com/drive/folders/..." 
                            />
                            <p className="text-[11px] text-gray-400 mt-2">
                              Make sure the folder permission is set to <strong>Anyone with the link can view</strong>.
                            </p>
                          </div>

                          <div className="space-y-4 bg-black/20 p-5 rounded-xl border border-white/[0.05]">
                            <label className="block text-sm font-medium text-gray-300">Are you familiar with 3D designing or software such as Blender?</label>
                            <div className="flex gap-6">
                              <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold">
                                <input type="radio" checked={is3dFamiliar} onChange={() => setIs3dFamiliar(true)} className="w-4 h-4 accent-purple-500" /> Yes
                              </label>
                              <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold">
                                <input type="radio" checked={!is3dFamiliar} onChange={() => setIs3dFamiliar(false)} className="w-4 h-4 accent-purple-500" /> No
                              </label>
                            </div>
                            {is3dFamiliar && (
                              <div className="mt-4 flex items-start gap-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                                <input type="checkbox" required className="mt-1 w-4 h-4 accent-purple-500 shrink-0" />
                                <p className="text-xs text-purple-200/80 leading-relaxed font-medium">
                                  I confirm that I have added my 3D design work to the Drive link provided above, and I am prepared to present my relevant 3D work when asked by the interview panel.
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="space-y-4 bg-black/20 p-5 rounded-xl border border-white/[0.05]">
                            <label className="block text-sm font-medium text-gray-300">Have you done graphic designing before?</label>
                            <div className="flex gap-6">
                              <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold">
                                <input type="radio" checked={hasGraphicExp} onChange={() => setHasGraphicExp(true)} className="w-4 h-4 accent-purple-500" /> Yes
                              </label>
                              <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold">
                                <input type="radio" checked={!hasGraphicExp} onChange={() => setHasGraphicExp(false)} className="w-4 h-4 accent-purple-500" /> No
                              </label>
                            </div>
                            {hasGraphicExp && (
                              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in">
                                <div>
                                  <label className={labelStyle}>Proficiency Level *</label>
                                  <select required value={graphicLevel} onChange={e => setGraphicLevel(e.target.value)} className={`${inputStyle} cursor-pointer appearance-none`}>
                                    <option value="" className="bg-[#0c0812]">Select Level...</option>
                                    <option value="Beginner" className="bg-[#0c0812]">Beginner</option>
                                    <option value="Amateur" className="bg-[#0c0812]">Amateur</option>
                                    <option value="Semi-Pro" className="bg-[#0c0812]">Semi-Pro</option>
                                    <option value="Professional" className="bg-[#0c0812]">Professional</option>
                                  </select>
                                </div>
                                <div>
                                  <label className={labelStyle}>Tools you use *</label>
                                  <input type="text" required value={designTools} onChange={e => setDesignTools(e.target.value)} placeholder="Photoshop, Illustrator, Figma..." className={inputStyle} />
                                </div>
                              </div>
                            )}
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Social Media & Coverage Assessment */}
                  <AnimatePresence>
                    {isSocialSelected && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className={dynamicSectionStyle}>
                          <h3 className={dynamicHeaderStyle}>SOCIAL MEDIA & COVERAGE ASSESSMENT</h3>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3 leading-relaxed">
                              What creative strategies or content ideas would you implement to amplify Randomize();'s reach and engagement across campus social media channels? *
                            </label>
                            <textarea required rows={4} value={socialReachStrategy} onChange={e => setSocialReachStrategy(e.target.value)} className={`${inputStyle} resize-none`} placeholder="Share campaign ideas, reel concepts, trends, coverage plans..." />
                          </div>

                          <div className="space-y-4 bg-black/20 p-5 rounded-xl border border-white/[0.05]">
                            <label className="block text-sm font-medium text-gray-300">
                              Do you have prior experience with videography, camera shooting, or video editing?
                            </label>
                            <div className="flex gap-6">
                              <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold">
                                <input type="radio" checked={hasVideoExp} onChange={() => setHasVideoExp(true)} className="w-4 h-4 accent-purple-500" /> Yes
                              </label>
                              <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold">
                                <input type="radio" checked={!hasVideoExp} onChange={() => setHasVideoExp(false)} className="w-4 h-4 accent-purple-500" /> No
                              </label>
                            </div>
                            
                            {hasVideoExp && (
                              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in">
                                <div>
                                  <label className={labelStyle}>Editing Tools / Software You Use *</label>
                                  <input type="text" required value={videoTools} onChange={e => setVideoTools(e.target.value)} placeholder="Premiere Pro, DaVinci, CapCut, AE..." className={inputStyle} />
                                </div>
                                <div>
                                  <label className={labelStyle}>Public Google Drive Link to Your Edits / Showreel *</label>
                                  <input 
                                    type="url" 
                                    required 
                                    value={videoLink} 
                                    onChange={e => setVideoLink(e.target.value)} 
                                    placeholder="https://drive.google.com/..." 
                                    className={inputStyle} 
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {isOutreachSelected && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className={dynamicSectionStyle}>
                          <h3 className={dynamicHeaderStyle}>OUTREACH ASSESSMENT</h3>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-4 leading-relaxed">
                              What information would you research about a company before approaching them for sponsorship/collaboration? *
                            </label>
                            <textarea required rows={4} value={outreachStrategy} onChange={e => setOutreachStrategy(e.target.value)} className={`${inputStyle} resize-none`} placeholder="Detail your approach..." />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {isEditorialSelected && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className={dynamicSectionStyle}>
                          <h3 className={dynamicHeaderStyle}>EDITORIAL ASSESSMENT</h3>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-4 leading-relaxed">
                              Walk me through your actual process from a blank page to the final piece. *
                            </label>
                            <textarea required rows={4} value={editorialProcess} onChange={e => setEditorialProcess(e.target.value)} className={`${inputStyle} resize-none`} placeholder="Detail your workflow..." />
                          </div>
                          <div className="pt-2">
                            <label className="block text-sm font-medium text-gray-300 mb-4 leading-relaxed">
                              Your piece is due tomorrow, but an urgent draft gets dropped on your desk for 4 PM. What do you do? *
                            </label>
                            <textarea required rows={4} value={editorialUrgent} onChange={e => setEditorialUrgent(e.target.value)} className={`${inputStyle} resize-none`} placeholder="Explain how you handle this..." />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                <div className="pt-8 border-t border-white/[0.06]">
                  <button disabled={submitting || !!mismatchError} type="submit" className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300 disabled:opacity-50 backdrop-blur-lg">
                    {submitting ? 'Verifying Links & Submitting...' : 'Submit Application'}
                  </button>
                </div>

              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}