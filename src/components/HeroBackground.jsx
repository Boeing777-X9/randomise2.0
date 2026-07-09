'use client';

import React from 'react';
import { motion } from 'framer-motion';


export default function HeroBackground({ children, className = '', isFixed = false }) {
  // SVG Fractal Noise Data URI for high-quality film grain texture
  const grainDataUri = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

  const bgCanvas = (
    <div 
      className={`pointer-events-none select-none overflow-hidden ${
        isFixed ? 'fixed inset-0 w-screen h-screen' : 'absolute inset-0 w-full h-full'
      } bg-[#05030B]`}
      style={{ zIndex: -50 }}
    >
      {/* 1. LAYERED BLURRED RADIAL GLOWS (ANIMATED) */}
      
      {/* A. Large Soft Purple Glow (Center) */}
      <motion.div
        className="absolute left-[15%] top-[15%] w-[75vw] h-[75vw] max-w-[900px] max-h-[900px] rounded-full opacity-[0.16] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #8900F2 0%, rgba(43, 1, 75, 0.49) 70%)',
          filter: 'blur(130px)',
        }}
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -30, 30, 0],
          scale: [1, 1.08, 0.92, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* B. Subtle Blue-Violet Glow (Bottom-Left) */}
      <motion.div
        className="absolute left-[-10%] bottom-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full opacity-[0.12] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #2D0FF7 0%, rgba(12, 1, 85, 0.93) 70%)',
          filter: 'blur(110px)',
        }}
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 40, -20, 0],
          scale: [1, 0.92, 1.08, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* C. Faint Pink Glow (Top-Right) */}
      <motion.div
        className="absolute right-[-10%] top-[-10%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full opacity-[0.05] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #F20059 0%, rgba(59, 1, 22, 0.96) 70%)',
          filter: 'blur(120px)',
        }}
        animate={{
          x: [0, 20, -40, 0],
          y: [0, 30, -30, 0],
          scale: [0.95, 1.05, 0.95, 0.95],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 2. SUBTLE MASKED GRID OVERLAY */}
      <div 
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundSize: '45px 45px',
          backgroundImage: `
            linear-gradient(to right, rgba(187, 223, 228, 0.61) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(153, 188, 199, 0.96) 1px, transparent 1px)
          `,
          maskImage: 'radial-gradient(circle at center, black 25%, transparent 1%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 25%, transparent 1%)',
        }}
      />

      {/* 3. SOFT EDGE VIGNETTE */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 35%, rgba(13, 1, 46, 0.8) 80%, #0b0129 100%)',
        }}
      />

      {/* 4. CINEMATIC FILM GRAIN NOISE */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: grainDataUri,
          mixBlendMode: 'normal',
        }}
      />

      {/* 5. CORNER & SIDE DITHER HALFTONE EFFECT */}
      <div 
        className="absolute inset-0 opacity-[0.5] pointer-events-none mix-blend-screen"
        style={{
          backgroundSize: '7px 7px', // Tiny mesh dither pattern
          backgroundImage: `
            radial-gradient(rgba(199, 178, 209, 0.97) 1px, transparent 10px),
            radial-gradient(rgba(23, 2, 58, 0.95) 10px, transparent 90px)
          `,
          backgroundPosition: '0 0, 2px 2px',
          // The inverted radial mask leaves the center pristine and smoothly rolls the dither into the edges
          maskImage: 'radial-gradient(circle at center, transparent 89%, black 95%)',
          WebkitMaskImage: 'radial-gradient(circle at center, transparent 85%, black 98%)',
        }}
      />
    </div>
  );

  if (isFixed) {
    return bgCanvas;
  }

  return (
    <div className={`relative isolate overflow-hidden bg-[#05030B] ${className}`}>
      {bgCanvas}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}