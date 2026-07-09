'use client';

/**
 * FlickerText Component
 *
 * Ported & adapted from the Framer FlickerText module:
 * https://framer.com/m/FlickerText-bbmC.js@pWiVQK6QyOxgvhst254T
 *
 * Each character flickers individually in an infinite loop.
 * The glow uses white text-shadow — visible but never blinding.
 *
 * ─── Editable Props ───────────────────────────────────────────
 *  text            (string)   Text to display. Default: "FLICKER TEXT"
 *  textColor       (string)   Fill colour when lit. Default: "#FFFFFF"
 *  glowIntensity   (number)   Glow radius in px (keep 6–14 for subtlety).
 *                             Default: 10
 *  strokeWidth     (number)   Stroke width during the "off" frame. Default: 1
 *  animationSpeed  (number)   Multiplier — higher = faster. Default: 0.8
 *  animationPattern ("sequential"|"random"|"sync")  Default: "sequential"
 *  className       (string)   Extra Tailwind classes on the wrapper.
 * ──────────────────────────────────────────────────────────────
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function FlickerText({
  text            = 'FLICKER TEXT',
  textColor       = '#FFFFFF',
  glowIntensity   = 10,
  strokeWidth     = 1,
  animationSpeed  = 0.8,
  animationPattern = 'sequential',
  className       = '',
}) {
  const characters = useMemo(
    () =>
      text.split('').map((char, index) => ({
        char:  char === ' ' ? '\u00a0' : char,
        index,
        id:    `${char}-${index}`,
      })),
    [text]
  );

  const baseDelay      = 0.09 / animationSpeed;
  const flickerDuration = 0.38 / animationSpeed;
  const totalDuration  = characters.length * baseDelay + flickerDuration + 1.8;

  const getDelay = (index) => {
    switch (animationPattern) {
      case 'random':
        return Math.random() * (totalDuration * 0.6);
      case 'sync':
        return 0;
      case 'sequential':
      default:
        return index * baseDelay;
    }
  };

  return (
    <div className={`flex flex-wrap justify-center items-center select-none ${className}`}>
      {characters.map((character, index) => {
        const delay = getDelay(index);

        return (
          <motion.span
            key={`${character.id}`}
            initial={{
              opacity:          1,
              color:            textColor,
              textShadow:       `0 0 8px rgba(255,255,255,0.18), 0 0 16px rgba(255,255,255,0.08)`,
              WebkitTextStroke: `${strokeWidth}px transparent`,
            }}
            animate={{
              // Three-beat flicker: dim → out (stroke only) → half-recover → off → full lit
              opacity: [
                1,      // lit
                0.15,   // nearly off
                1,      // back on
                0.04,   // almost dead
                0.75,   // partial
                1,      // fully lit
              ],
              color: [
                textColor,
                'transparent',
                textColor,
                'transparent',
                textColor,
                textColor,
              ],
              WebkitTextStroke: [
                `${strokeWidth}px transparent`,
                `${strokeWidth}px ${textColor}`,
                `${strokeWidth}px transparent`,
                `${strokeWidth}px ${textColor}`,
                `${strokeWidth}px transparent`,
                `${strokeWidth}px transparent`,
              ],
              // Glow pulses with the flicker — bright when lit, gone when off
              textShadow: [
                `0 0 ${glowIntensity}px rgba(255,255,255,0.55), 0 0 ${glowIntensity * 2}px rgba(255,255,255,0.22)`,
                `0 0 0px transparent`,
                `0 0 ${glowIntensity}px rgba(255,255,255,0.55), 0 0 ${glowIntensity * 2}px rgba(255,255,255,0.22)`,
                `0 0 0px transparent`,
                `0 0 ${glowIntensity * 0.6}px rgba(255,255,255,0.35)`,
                `0 0 ${glowIntensity}px rgba(255,255,255,0.55), 0 0 ${glowIntensity * 2}px rgba(255,255,255,0.22)`,
              ],
            }}
            transition={{
              duration:    flickerDuration,
              delay,
              ease:        'easeInOut',
              repeat:      Infinity,
              repeatDelay: totalDuration - flickerDuration - delay,
            }}
            style={{
              display:       'inline-block',
              fontSize:      'inherit',
              fontWeight:    'inherit',
              fontFamily:    'inherit',
              lineHeight:    'inherit',
              letterSpacing: 'inherit',
              whiteSpace:    'pre',
            }}
          >
            {character.char}
          </motion.span>
        );
      })}
    </div>
  );
}
