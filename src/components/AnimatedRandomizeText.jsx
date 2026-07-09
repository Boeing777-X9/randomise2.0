'use client';

/**
 * AnimatedRandomizeText
 *
 * The main hero heading — "RANDOMIZE()" rendered in Bebas Neue
 * (a condensed, ultra-bold display font matching the HIGHRISE reference).
 *
 * The flickering white glow is handled by <FlickerText />.
 *
 * ─── To customise the flicker ─────────────────────────────────
 *  glowIntensity  – px radius of the white glow (6–16 sweet-spot)
 *  animationSpeed – higher = faster flicker cycle
 *  animationPattern – "sequential" | "random" | "sync"
 *  Full prop list documented in src/components/FlickerText.jsx
 * ──────────────────────────────────────────────────────────────
 */

import FlickerText from './FlickerText';

export default function AnimatedRandomizeText() {
  return (
    <div className="flex items-center justify-center px-2 mb-6 mt-2">
      <FlickerText
        text="RANDOMIZE()"
        textColor="#ffffffce"
        glowIntensity={12}
        strokeWidth={1}
        animationSpeed={0.75}
        animationPattern="sequential"
        className={[
          // Bebas Neue — condensed bold display (HIGHRISE-style)
          'font-[family-name:var(--font-bebas)]',
          // Responsive size: from 52px on mobile up to 120px on desktop
          'text-[clamp(52px,13vw,120px)]',
          // Very wide tracking gives that stretched cinematic look
          'tracking-[0.08em]',
          // Tight line height since we're display-only
          'leading-none',
        ].join(' ')}
      />
    </div>
  );
}
