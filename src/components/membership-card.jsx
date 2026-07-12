"use client";

import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

export default function GlassCard({ children, className = '', style = {} }) {
  const cardRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // High-fidelity spring physics for the 3D depth tilt
  const rotateXSpring = useSpring(0, { stiffness: 150, damping: 25 });
  const rotateYSpring = useSpring(0, { stiffness: 150, damping: 25 });

  const handleCardMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;

    rotateXSpring.set((-mouseYFromCenter / (height / 2)) * 8);
    rotateYSpring.set((mouseXFromCenter / (width / 2)) * 8);
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleCardMouseLeave = () => {
    rotateXSpring.set(0);
    rotateYSpring.set(0);
  };

  // Dynamic flashlight sheen effect following the cursor
  const dynamicGlow = useMotionTemplate`
    radial-gradient(
      600px circle at ${mouseX}px ${mouseY}px,
      rgba(34, 211, 238, 0.15),
      rgba(219, 39, 119, 0.1) 40%,
      transparent 80%
    )
  `;

  return (
    <div 
      className={`relative group text-left ${className}`} 
      style={style}
    >
      {/* Ambient Backlight Glow Effects */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none mix-blend-screen transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-pink-500/20 rounded-full blur-[80px] pointer-events-none mix-blend-screen transition-transform duration-500 group-hover:scale-110" />
      
      <motion.div
        ref={cardRef}
        onMouseMove={handleCardMouseMove}
        onMouseLeave={handleCardMouseLeave}
        style={{ rotateX: rotateXSpring, rotateY: rotateYSpring, transformStyle: "preserve-3d" }}
        className="absolute inset-0 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-white/[0.01] backdrop-blur-xl p-8 text-white shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden cursor-pointer flex flex-col justify-between"
      >
        {/* Liquid Sheen Overlay */}
        <motion.div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 mix-blend-screen" 
          style={{ background: dynamicGlow }} 
        />
        
        {/* Glass Edge Highlights */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-pink-500/40" />
        <div className="absolute bottom-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-pink-500/20 to-transparent" />

        {/* 3D Content Layer Projection */}
        <div style={{ transform: "translateZ(40px)" }} className="relative z-10 flex flex-col justify-between h-full w-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
}