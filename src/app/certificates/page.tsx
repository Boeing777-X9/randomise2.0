'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import { Download, Award, AlertCircle, CheckCircle2, RefreshCw, Mail, Hash, ShieldCheck } from 'lucide-react';

interface EligibleParticipant {
  id: string;
  full_name: string;
  registration_number: string;
  outlook_email: string;
  personal_email: string;
  certificate_url?: string | null;
  day1_confirmed?: boolean;
  day2_confirmed?: boolean;
}

export default function CertificatePortal() {
  // Temporary: render 404 while certificates are paused. Remove this line to re-enable.
  notFound();

  const [regNumber, setRegNumber] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [participant, setParticipant] = useState<EligibleParticipant | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  // Securely verify BOTH Registration Number & Personal Gmail via Database RPC
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNumber.trim() || !emailInput.trim()) {
      setErrorMsg('Please enter both your Registration Number and Personal Gmail address.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setParticipant(null);

    const cleanReg = regNumber.trim();
    const cleanEmail = emailInput.trim();

    try {
      // Call secure Supabase RPC function
      const { data, error } = await supabase.rpc('verify_certificate_recipient', {
        p_reg_no: cleanReg,
        p_email: cleanEmail,
      });

      setLoading(false);

      if (error || !data || data.length === 0) {
        setErrorMsg('No match found. Please verify that both your Registration Number and Gmail match what you submitted during registration, and that you attended the event.');
        return;
      }

      setParticipant(data[0]);
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } catch (err: any) {
      setLoading(false);
      setErrorMsg('An error occurred during verification. Please try again.');
    }
  };

  // Generate & Download PDF
  const downloadCertificate = async () => {
    if (!participant) return;
    setDownloading(true);
    setErrorMsg(null);

    try {
      const template = new Image();
      // Make sure your file is saved exactly with this name in the /public folder
      template.src = '/ML_Certificate_template.png'; 

      template.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context could not be created');

        canvas.width = template.naturalWidth || 1492;
        canvas.height = template.naturalHeight || 1054;

        // 1. Draw Template
        ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

        // 2. Format Participant Name (Uppercase looks best with Orbitron)
        const nameToPrint = participant.full_name
          ? participant.full_name.trim().toUpperCase()
          : 'PARTICIPANT';

        // 3. Dynamic Font Sizing (Reduced sizes for smaller text)
        let fontSize = Math.round(canvas.height * 0.035); 
        if (nameToPrint.length > 22) {
          fontSize = Math.round(canvas.height * 0.025); 
        } else if (nameToPrint.length > 16) {
          fontSize = Math.round(canvas.height * 0.030); 
        }

        // Wait for Orbitron font to load before drawing to canvas
        await document.fonts.ready;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#FFFFFF'; // White text
        ctx.font = `bold ${fontSize}px "Orbitron", sans-serif`; // Orbitron Bold

        // Center vertically between "THIS IS TO CERTIFY THAT" and the pink divider line
        const nameYPosition = canvas.height * 0.472; 
        ctx.fillText(nameToPrint, canvas.width / 2, nameYPosition);

        // 4. Generate PDF
        const imgData = canvas.toDataURL('image/png', 0.95);
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width, canvas.height],
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

        // 5. Trigger Instant Browser Download
        const fileName = `${participant.registration_number || participant.full_name.replace(/\s+/g, '_')}_ML_Workshop_Certificate.pdf`;
        pdf.save(fileName);

        // 6. Save backup copy to Supabase Storage in background
        try {
          const pdfBlob = pdf.output('blob');
          const storagePath = `ml-workshop-2026/${fileName}`; // Updated storage bucket path

          const { error: uploadError } = await supabase.storage
            .from('certificates')
            .upload(storagePath, pdfBlob, {
              contentType: 'application/pdf',
              upsert: true,
            });

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from('certificates')
              .getPublicUrl(storagePath);

            if (publicUrlData?.publicUrl) {
              await supabase
                .from('event_registrations')
                .update({
                  certificate_url: publicUrlData.publicUrl,
                  certificate_issued_at: new Date().toISOString(),
                })
                .eq('id', participant.id);
            }
          }
        } catch (uploadErr) {
          console.warn('Supabase storage backup sync skipped:', uploadErr);
        }

        setDownloading(false);
      };

      template.onerror = () => {
        setErrorMsg('Failed to load template image. Ensure ML_Certificate_template.png is in the /public folder.');
        setDownloading(false);
      };
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process certificate. Please try again.');
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#07050e] text-white pt-28 sm:pt-36 pb-16 px-4 sm:px-6 flex flex-col items-center justify-center">
      <div 
        className="w-full bg-[#0f0b1c] border border-purple-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-center"
        style={{ width: '100%', maxWidth: '580px', minWidth: '320px' }}
      >
        {/* Header */}
        <div className="space-y-3">
          <div className="w-16 h-16 bg-purple-600/20 border border-purple-500/40 rounded-2xl flex items-center justify-center mx-auto text-purple-400">
            <Award className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-sky-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
            Claim Event Certificate
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Randomize(); Club • <strong>ML Workshop</strong> (11th October 2026)
          </p>
          <p className="text-xs text-gray-400">
            Enter your <strong>Registration Number</strong> and registered <strong>Personal Gmail</strong> to verify your certificate.
          </p>
        </div>

        {/* Dual Input Form */}
        <form onSubmit={handleVerify} className="space-y-3 text-left">
          {/* Registration Number Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 pl-1">
              Registration Number
            </label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. 26020149"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white focus:border-purple-400 outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Personal Gmail Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 pl-1">
              Personal Gmail Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                placeholder="e.g. yourname@gmail.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white focus:border-purple-400 outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 min-h-[46px] shadow-lg shadow-purple-600/25"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            {loading ? 'Verifying Details...' : 'Verify & Unlock Certificate'}
          </button>
        </form>

        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 text-red-300 text-sm text-left">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Verified Certificate Card */}
        {participant && (
          <div className="bg-gradient-to-b from-purple-900/20 to-black/40 border border-green-500/40 rounded-2xl p-6 space-y-5 text-left animate-in fade-in">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0" />
              <div>
                <h3 className="font-bold text-white text-lg">{participant.full_name}</h3>
                <p className="text-xs text-gray-400 font-mono">Reg No: {participant.registration_number}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-300 bg-white/5 p-3 rounded-xl">
              <span>Event Attendance:</span>
              <span className="font-semibold text-green-400">
                Verified (Attended {participant.day1_confirmed && participant.day2_confirmed ? 'Both Days' : participant.day1_confirmed ? 'Day 1' : 'Day 2'})
              </span>
            </div>

            <button
              type="button"
              onClick={downloadCertificate}
              disabled={downloading}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm shadow-lg shadow-green-600/30 min-h-[48px]"
            >
              {downloading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {downloading ? 'Generating & Saving PDF...' : 'Download Official Certificate (PDF)'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}