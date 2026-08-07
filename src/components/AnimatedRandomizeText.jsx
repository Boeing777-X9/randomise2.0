'use client';



import FlickerText from './FlickerText';

export default function AnimatedRandomizeText() {
  return (
    <div className="flex items-center justify-center px-2 mb-6 mt-2">
      <FlickerText
        text="RANDOMIZE();"
        textColor="#ffffffce"
        glowIntensity={12}
        strokeWidth={1}
        animationSpeed={0.75}
        animationPattern="sequential"
        className={[

          'font-[family-name:var(--font-bebas)]',          
          'text-[clamp(52px,13vw,120px)]',          
          'tracking-[0.08em]',          
          'leading-none',
        ].join(' ')}
      />
    </div>
  );
}
