"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const RhythmicWords = () => {
  const words = [
    { text: 'Ideate.', color: 'text-gradient-primary', delay: 0 },
    { text: 'Commit.', color: 'text-gradient-secondary', delay: 2 },
    { text: 'Succeed.', color: 'text-gradient-full', delay: 4 }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % words.length;
        if (next === 0) {
          setCycle(c => c + 1);
        }
        return next;
      });
    }, 2000); // Change word every 2 seconds

    return () => clearInterval(interval);
  }, [words.length]);

  // Scale particle burst distance based on heading font size for consistency
  const headingRef = useRef(null);
  const [particleDistance, setParticleDistance] = useState(80);

  useEffect(() => {
    const calc = () => {
      if (!headingRef.current) return;
      const fs = parseFloat(getComputedStyle(headingRef.current).fontSize || '48');
      // Distance ~ 1.4x font size, clamped for sanity
      const dist = Math.max(40, Math.min(140, fs * 1.4));
      setParticleDistance(dist);
    };
    const r = () => requestAnimationFrame(calc);
    calc();
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);

  return (
    <StyledWrapper>
      <div className="rhythmic-container">
        <h1 ref={headingRef} className="text-center leading-none select-none tracking-tightest font-extrabold flex flex-col lg:flex-row mt-2 sm:mt-4 justify-center items-center text-[clamp(28px,9vw,72px)] gap-[clamp(4px,2vw,16px)]">
          {words.map((word, index) => (
            <motion.span
              key={`${word.text}-${cycle}`}
              data-content={word.text}
              className={`relative block ${word.color} text-shadow-glow flex-row word-span`}
              animate={{
                scale: activeIndex === index ? [1, 1.15, 1] : 1,
                opacity: activeIndex === index ? [0.8, 1, 0.8] : 0.4,
                filter: activeIndex === index ? 
                  ['brightness(1) saturate(1)', 'brightness(1.2) saturate(1.3)', 'brightness(1) saturate(1)'] : 
                  'brightness(0.7) saturate(0.9)',
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.5, 1],
              }}
              style={{
                textShadow: activeIndex === index ? 
                  '0 0 8px currentColor, 0 0 15px currentColor' : 
                  '0 0 5px currentColor',
              }}
            >
              <motion.span
                className="word-inner"
                animate={{
                  y: activeIndex === index ? [0, -5, 0] : 0,
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  times: [0, 0.5, 1],
                }}
              >
                {word.text}
              </motion.span>
              
              {/* Rhythmic pulse ring */}
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    className="pulse-ring"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: [0.8, 1.3, 1.8], 
                      opacity: [0, 0.3, 0] 
                    }}
                    exit={{ scale: 2, opacity: 0 }}
                    transition={{
                      duration: 2,
                      ease: "easeOut",
                      times: [0, 0.3, 1],
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Spotlight effect */}
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    className="spotlight"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ 
                      opacity: [0, 0.2, 0],
                      scale: [0.5, 1.1, 1.3]
                    }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    transition={{
                      duration: 2,
                      ease: "easeInOut",
                      times: [0, 0.4, 1],
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Particle burst */}
              <AnimatePresence>
                {activeIndex === index && (
                  <div className="particles-container">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`particle particle-${i}`}
                        initial={{ 
                          scale: 0, 
                          x: 0, 
                          y: 0, 
                          opacity: 0 
                        }}
                        animate={{ 
                          scale: [0, 1, 0],
                          x: Math.cos((i * 60) * Math.PI / 180) * particleDistance,
                          y: Math.sin((i * 60) * Math.PI / 180) * particleDistance,
                          opacity: [0, 0.6, 0]
                        }}
                        exit={{ 
                          scale: 0, 
                          opacity: 0 
                        }}
                        transition={{
                          duration: 1.5,
                          ease: "easeOut",
                          delay: 0.2,
                        }}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </motion.span>
          ))}
        </h1>

        {/* Progress indicator */}
        <div className="progress-container">
          {words.map((_, index) => (
            <motion.div
              key={index}
              className="progress-dot"
              animate={{
                scale: activeIndex === index ? 1.5 : 1,
                opacity: activeIndex === index ? 1 : 0.4,
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .rhythmic-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  gap: clamp(0.5rem, 3vw, 2rem);
  }

  .word-span {
    position: relative;
    display: inline-block;
    transition: all 0.3s ease;
  }

  .word-inner {
    position: relative;
    z-index: 2;
  }

  .pulse-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border: 1px solid currentColor;
    border-radius: 50%;
    pointer-events: none;
    z-index: 1;
    opacity: 0.6;
  }

  .spotlight {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 130%;
    height: 130%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.05) 0%,
      rgba(255, 255, 255, 0.02) 30%,
      transparent 60%
    );
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }

  .particles-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }

  .particle {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 3px;
    height: 3px;
    background: currentColor;
    border-radius: 50%;
    box-shadow: 0 0 3px currentColor;
    transform: translate(-50%, -50%);
    opacity: 0.7;
  }

  .progress-container {
    display: flex;
    gap: clamp(0.375rem, 1.5vw, 1rem);
    margin-top: clamp(0.5rem, 1.5vw, 1rem);
  }

  .progress-dot {
    width: clamp(6px, 1.6vw, 12px);
    height: clamp(6px, 1.6vw, 12px);
    border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 5px currentColor;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .progress-container {
      gap: clamp(0.25rem, 1.5vw, 0.5rem);
    }
    
    .progress-dot {
      width: clamp(6px, 2vw, 8px);
      height: clamp(6px, 2vw, 8px);
    }
  }
`;

export default RhythmicWords;
