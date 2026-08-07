"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/membership-card';

export default function MembershipForm() {
  const [formData, setFormData] = useState({
    name: '',
    regNo: '',
    outlookEmail: '',
    phone: '',
    registrationType: 'New',
    academicDetails: '',
    accommodation: 'GHS',
    paymentProof: null
  });

  const [activeField, setActiveField] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Randomize Registration Data: ", formData);
  };

  return (
    <div className="w-full min-h-screen bg-[#070514] px-3 sm:px-4 py-24 sm:py-16 flex flex-col items-center justify-start font-sans antialiased selection:bg-purple-500 selection:text-white overflow-x-hidden relative">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[55vw] h-[55vw] bg-cyan-900/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Centered Main Layout Stack */}
      <div className="w-full flex flex-col items-center gap-8 relative z-10">
        
        {/* ================= MAIN FORM ENVELOPE BLOCK ================= */}
        <div className="relative w-full max-w-[560px] group">
          
          {/* Animated Glow Backing Layer */}
          <motion.div 
            animate={{
              scale: [1, 1.015, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-cyan-500 to-pink-500 rounded-[32px] blur-xl opacity-1 group-hover:opacity-3 transition duration-1000 group-hover:duration-200"
          />

          {/* Form Content Wrapper */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full bg-[#0d0b21]/80 backdrop-blur-xl border border-white/[0.08] px-6 py-8 sm:p-10 rounded-[30px] text-white shadow-2xl text-left overflow-hidden"
          >
            {/* Subtle internal animated corner flare */}
            <div className="absolute top-0 left-0 w-[150px] h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
            
            {/* ================= CLUB INTRO PANEL ================= */}
            <GlassCard 
              className="w-full mb-8 relative mt-5"
            >
              <h2 className="text-lg sm:text-2xl font-extrabold mb-5 bg-gradient-to-r from-purple-400 via-indigo-200 to-cyan-400 bg-clip-text text-transparent tracking-tight text-center leading-relaxed dropped-glow-sm">
                ✨ Welcome to Randomize(); <br />
                <span className="text-sm font-medium tracking-normal text-gray-400 block mt-1">The Official Computing Club of MUJ</span>
              </h2>
              
              <div className="space-y-3 sm:space-y-4 text-sm text-gray-300/80 leading-relaxed text-left">
                <p>
                  <span className="font-semibold text-white">Randomize();</span>, proudly backed by the Department of Computer Science and Engineering, is a thriving community of tech enthusiasts passionate about innovation, coding, and emerging technologies.
                </p>
                <p>
                  From building AI pipelines to staging massive hackathons and workshops, we offer the definitive sandbox environment to learn, collaborate, and establish your target industry presence.
                </p>
                <p className="text-center font-medium text-purple-400 pt-2 animate-pulse">
                  Ready to compile your potential?
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.05] text-center font-mono tracking-wider">
                <p className="text-[10px] text-cyan-400 uppercase font-bold m-0 tracking-[0.2em]">ideate . commit . succeed</p>
                <p className="text-xs text-pink-400 font-black mt-1 m-0">GODSPEED RANDOMIZE ();</p>
              </div>
            </GlassCard>

            <div className="relative flex items-center my-8">
              <div className="flex-grow border-t border-white/[0.06]"></div>
              <span className="flex-shrink mx-4 text-xs font-mono tracking-widest text-gray-500 uppercase">Registration Data</span>
              <div className="flex-grow border-t border-white/[0.06]"></div>
            </div>

            {/* Form Action Fields */}
            <form onSubmit={handleSubmit} className="w-full m-0 space-y-6 text-left block">
              
              {/* Interactive Floating Inputs for Text Formats */}
              {[
                { id: 'name', label: 'Full Name *', type: 'text', placeholder: 'Enter name' },
                { id: 'regNo', label: 'Registration Number *', type: 'text', placeholder: 'Enter Registration Number' },
                { id: 'phone', label: 'Phone Number *', type: 'tel', placeholder: 'e.g., +91 XXXXX XXXXX' },
                { id: 'outlookEmail', label: 'Outlook Email ID *', type: 'email', placeholder: 'Enter Outlook Email ID' },
                { id: 'academicDetails', label: 'Academic Programme, Year & Section *', type: 'text', placeholder: 'e.g., B.Tech CSE 2nd Year Sec X' }
              ].map((field) => (
                <div key={field.id} className="w-full block relative">
                  <label className={`block text-xs font-mono uppercase tracking-wider mb-2 transition-colors duration-200 ${activeField === field.id ? 'text-cyan-400' : 'text-gray-400'}`}>
                    {field.label}
                  </label>
                  <div className="relative">
                    <input 
                      type={field.type} 
                      required 
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm outline-none transition-all duration-300 focus:border-cyan-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_15px_rgba(34,211,238,0.1)] placeholder:text-gray-600"
                      onFocus={() => setActiveField(field.id)}
                      onBlur={() => setActiveField(null)}
                      onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                    />
                    {/* Active Bottom-border light effect */}
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: activeField === field.id ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              ))}

              {/* Accommodation Setup Custom Pill Selectors */}
              <div className="w-full block">
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-3">Your Accommodation *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['GHS', 'Day Scholar', 'PG/Flat'].map((type) => {
                    const isSelected = formData.accommodation === type;
                    return (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setFormData({...formData, accommodation: type})}
                        className={`py-3 px-2 text-center rounded-xl text-xs font-medium border transition-all duration-300 ${
                          isSelected 
                            ? 'bg-purple-500/10 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                            : 'bg-white/[0.02] border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Registration Tier Complex Selector */}
              <div className="w-full p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] my-6 block relative overflow-hidden">
                <label className="block text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3">Registration Type *</label>
                <div className="flex flex-col gap-3">
                  {[
                    { val: 'New', title: 'New Membership', price: 'Rs. 400/-', desc: 'Full access to core resources, toolkits, and event priority.' },
                    { val: 'Renewal', title: 'Membership Renewal', price: 'Rs. 100/-', desc: 'Extend your current credentials for the upcoming tenure.' }
                  ].map((tier) => {
                    const isSelected = formData.registrationType === tier.val;
                    return (
                      <div 
                        key={tier.val}
                        onClick={() => setFormData({...formData, registrationType: tier.val})}
                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 flex items-start gap-3 select-none relative ${
                          isSelected 
                            ? 'bg-cyan-500/[0.04] border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
                            : 'bg-transparent border-white/[0.06] hover:border-white/20'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center transition-all ${isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-gray-500'}`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#0d0b21]" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <span className={`text-sm font-semibold ${isSelected ? 'text-cyan-300' : 'text-gray-200'}`}>{tier.title}</span>
                            <span className="text-xs font-mono text-pink-400 font-bold bg-pink-500/10 px-2 py-0.5 rounded-md">{tier.price}</span>
                          </div>
                          <p className="text-xs text-gray-400/80 mt-1 m-0 leading-normal">{tier.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Verification Area */}
              <div className="w-full block">
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Upload Payment Screenshot *</label>
                <div className="relative group/file flex flex-col items-center justify-center w-full border border-dashed border-white/20 hover:border-purple-500/50 rounded-xl p-5 bg-white/[0.01] transition duration-200 cursor-pointer text-center">
                  <input 
                    type="file" 
                    required 
                    accept="image/*,application/pdf"
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    onChange={(e) => setFormData({...formData, paymentProof: e.target.files ? e.target.files[0] : null})}
                  />
                  <div className="space-y-1.5 pointer-events-none flex flex-col items-center">
                    <svg className="w-6 h-6 text-gray-400 group-hover/file:text-purple-400 transition duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p className="text-xs text-gray-300 font-medium m-0">
                      {formData.paymentProof ? (
                        <span className="text-cyan-400 font-mono">{formData.paymentProof.name}</span>
                      ) : (
                        <span>Drop payment file here or <span className="text-purple-400 underline decoration-purple-400/30">browse</span></span>
                      )}
                    </p>
                    <p className="text-[10px] text-gray-500 m-0">Select platform path: Choose Club → <span className="text-gray-400 font-medium">Randomize</span></p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <motion.button 
                  whileHover={{ scale: 1.015, boxShadow: "0 0 25px rgba(168,85,247,0.4)" }}
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white text-sm font-bold border-none cursor-pointer tracking-widest uppercase transition-all duration-300 shadow-xl shadow-purple-900/40 relative overflow-hidden group"
                >
                  <span className="absolute right-0 top-0 w-10 h-full bg-white/10 skew-x-12 translate-x-12 group-hover:-translate-x-96 transition-transform duration-1000 ease-out" />
                  🚀 Join the Matrix
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
        
      </div>
    </div>
  );
}
