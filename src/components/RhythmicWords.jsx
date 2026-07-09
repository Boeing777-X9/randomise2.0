import RotatingText from './RotatingText';

const rotatingTexts = ['IDEATE', 'COMMIT', 'SUCCEED'];
const sizeClass = 'text-[clamp(24px,6vw,60px)]';

export default function RhythmicWords() {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-x-[0.4em] mt-4 sm:mt-6 ${sizeClass}`}
      style={{ 
        fontFamily: 'var(--font-bebas, sans-serif)', 
        letterSpacing: '0.06em', 
        lineHeight: 1 
      }}
    >
      <span className="text-white/60 whitespace-nowrap">
        IT&apos;S TIME TO
      </span>

      <RotatingText
        texts={rotatingTexts}
        rotationInterval={2000}
        splitBy="words"
        initial={{ y: '105%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '-105%', opacity: 0 }}
        animatePresenceMode="popLayout"
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        mainClassName={sizeClass}
        // CRITICAL FIX: The background gradient classes are passed directly 
        // to the single letter levels here, protecting the background clip mapping!
        elementLevelClassName="bg-gradient-to-r from-[#22D3EE] via-[#4F46E5] to-[#7C3AED]"
        splitLevelClassName="overflow-visible" 
        style={{ 
          fontFamily: 'var(--font-bebas, sans-serif)', 
          letterSpacing: '0.06em', 
          lineHeight: 1 
        }}
      />
    </div>
  );
}