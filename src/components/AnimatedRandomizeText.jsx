'use client';

import { motion } from "framer-motion";

export default function AnimatedRandomizeText() {
  // Define fixed gradient colors
  const gradientColors = {
    r: '#973BED',
    a: '#007CFF',
    n: '#FFC800',
    d: '#F0F',
    o: '#973BED',
    m: '#007CFF',
    i: '#FFC800',
    z: '#F0F',
    e: '#00DA72',
    openParen: '#973BED',
    closeParen: '#007CFF'
  };

  // Responsive sizing for all letter SVGs
  // - Height scales with viewport using clamp to avoid overflow on small screens
  // - Width auto to preserve aspect ratio (viewBox handles scaling)
  const letterSvgClass = "inline-block h-[clamp(24px,8vw,96px)] w-auto";

  return (
    <motion.div 
      className="flex items-center justify-center mb-8 px-2"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
    >
      <div className="flex items-center justify-center flex-nowrap gap-[clamp(2px,1vw,8px)]">
        {/* Letter R */}
        <motion.div 
          className="relative inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <svg
            viewBox="0 0 64 64"
            className={letterSvgClass}
            style={{
              filter: `drop-shadow(0 0 8px ${gradientColors.r}40)`,
            }}
          >
            <defs>
              <linearGradient
                id="gradient-r"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="2"
                x2="0"
                y2="62"
              >
                <stop stopColor={gradientColors.r} />
                <stop offset="1" stopColor="#007CFF" />
              </linearGradient>
            </defs>
            <path
              d="M 8,8 L 8,56 M 8,8 L 32,8 C 40,8 48,16 48,24 C 48,32 40,32 32,32 L 8,32 M 32,32 L 48,56"
              fill="none"
              stroke="url(#gradient-r)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="360"
              className="dash-animate"
            />
          </svg>
        </motion.div>

        {/* Letter A */}
        <motion.div 
          className="relative inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <svg
            viewBox="0 0 64 64"
            className={letterSvgClass}
            style={{
              filter: `drop-shadow(0 0 8px ${gradientColors.a}40)`,
            }}
          >
            <defs>
              <linearGradient
                id="gradient-a"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="2"
                x2="0"
                y2="62"
              >
                <stop stopColor={gradientColors.a} />
                <stop offset="1" stopColor="#F0F" />
              </linearGradient>
            </defs>
            <path
              d="M 12,56 L 32,8 L 52,56 M 20,40 L 44,40"
              fill="none"
              stroke="url(#gradient-a)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="360"
              className="dash-animate"
            />
          </svg>
        </motion.div>

        {/* Letter N */}
        <motion.div 
          className="relative inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <svg
            viewBox="0 0 64 64"
            className={letterSvgClass}
            style={{
              filter: `drop-shadow(0 0 8px ${gradientColors.n}40)`,
            }}
          >
            <defs>
              <linearGradient
                id="gradient-n"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="2"
                x2="0"
                y2="62"
              >
                <stop stopColor={gradientColors.n} />
                <stop offset="1" stopColor="#00DA72" />
              </linearGradient>
            </defs>
            <path
              d="M 12,56 L 12,8 L 52,56 L 52,8"
              fill="none"
              stroke="url(#gradient-n)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="360"
              className="dash-animate"
            />
          </svg>
        </motion.div>

        {/* Letter D */}
        <motion.div 
          className="relative inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <svg
            viewBox="0 0 64 64"
            className={letterSvgClass}
            style={{
              filter: `drop-shadow(0 0 8px ${gradientColors.d}40)`,
            }}
          >
            <defs>
              <linearGradient
                id="gradient-d"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="2"
                x2="0"
                y2="62"
              >
                <stop stopColor={gradientColors.d} />
                <stop offset="1" stopColor="#007CFF" />
              </linearGradient>
            </defs>
            <path
              d="M 12,8 L 12,56 M 12,8 L 36,8 C 48,8 56,16 56,32 C 56,48 48,56 36,56 L 12,56"
              fill="none"
              stroke="url(#gradient-d)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="360"
              className="dash-animate"
            />
          </svg>
        </motion.div>

        {/* Letter O */}
        <motion.div 
          className="relative inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <svg
            viewBox="0 0 64 64"
            className={letterSvgClass}
            style={{
              filter: `drop-shadow(0 0 8px ${gradientColors.o}40)`,
            }}
          >
            <defs>
              <linearGradient
                id="gradient-o"
                gradientUnits="userSpaceOnUse"
                x1="32"
                y1="5"
                x2="32"
                y2="59"
              >
                <stop stopColor={gradientColors.o} />
                <stop offset="1" stopColor="#F0F" />
                <animateTransform
                  attributeName="gradientTransform"
                  type="rotate"
                  values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32"
                  keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1"
                  keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </linearGradient>
            </defs>
            <path
              d="M 32 32 m 0 -27 a 27 27 0 1 1 0 54 a 27 27 0 1 1 0 -54"
              fill="none"
              stroke="url(#gradient-o)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="360"
              className="spin-animate"
            />
          </svg>
        </motion.div>

        {/* Letter M */}
        <motion.div 
          className="relative inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <svg
            viewBox="0 0 64 64"
            className={letterSvgClass}
            style={{
              filter: `drop-shadow(0 0 8px ${gradientColors.m}40)`,
            }}
          >
            <defs>
              <linearGradient
                id="gradient-m"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="2"
                x2="0"
                y2="62"
              >
                <stop stopColor={gradientColors.m} />
                <stop offset="1" stopColor="#00DA72" />
              </linearGradient>
            </defs>
            <path
              d="M 8,56 L 8,8 L 32,32 L 56,8 L 56,56"
              fill="none"
              stroke="url(#gradient-m)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="360"
              className="dash-animate"
            />
          </svg>
        </motion.div>

        {/* Letter I */}
        <motion.div 
          className="relative inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <svg
            viewBox="0 0 64 64"
            className={letterSvgClass}
            style={{
              filter: `drop-shadow(0 0 8px ${gradientColors.i}40)`,
            }}
          >
            <defs>
              <linearGradient
                id="gradient-i"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="2"
                x2="0"
                y2="62"
              >
                <stop stopColor={gradientColors.i} />
                <stop offset="1" stopColor="#F0F" />
              </linearGradient>
            </defs>
            <path
              d="M 16,8 L 48,8 M 32,8 L 32,56 M 16,56 L 48,56"
              fill="none"
              stroke="url(#gradient-i)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="360"
              className="dash-animate"
            />
          </svg>
        </motion.div>

        {/* Letter Z */}
        <motion.div 
          className="relative inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <svg
            viewBox="0 0 64 64"
            className={letterSvgClass}
            style={{
              filter: `drop-shadow(0 0 8px ${gradientColors.z}40)`,
            }}
          >
            <defs>
              <linearGradient
                id="gradient-z"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="2"
                x2="0"
                y2="62"
              >
                <stop stopColor={gradientColors.z} />
                <stop offset="1" stopColor="#007CFF" />
              </linearGradient>
            </defs>
            <path
              d="M 12,8 L 52,8 L 12,56 L 52,56"
              fill="none"
              stroke="url(#gradient-z)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="360"
              className="dash-animate"
            />
          </svg>
        </motion.div>

        {/* Letter E */}
        <motion.div 
          className="relative inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <svg
            viewBox="0 0 64 64"
            className={letterSvgClass}
            style={{
              filter: `drop-shadow(0 0 8px ${gradientColors.e}40)`,
            }}
          >
            <defs>
              <linearGradient
                id="gradient-e"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="2"
                x2="0"
                y2="62"
              >
                <stop stopColor={gradientColors.e} />
                <stop offset="1" stopColor="#00DA72" />
              </linearGradient>
            </defs>
            <path
              d="M 12,8 L 12,56 M 12,8 L 48,8 M 12,32 L 40,32 M 12,56 L 48,56"
              fill="none"
              stroke="url(#gradient-e)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="360"
              className="dash-animate"
            />
          </svg>
        </motion.div>

        {/* Parentheses () */}
        <motion.div 
          className="relative inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <svg
            viewBox="0 0 64 64"
            className={letterSvgClass}
            style={{
              filter: `drop-shadow(0 0 8px ${gradientColors.openParen}40)`,
            }}
          >
            <defs>
              <linearGradient
                id="gradient-parens"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="2"
                x2="0"
                y2="62"
              >
                <stop stopColor={gradientColors.openParen} />
                <stop offset="1" stopColor="#00DA72" />
              </linearGradient>
            </defs>
            <path
              d="M 24,8 Q 8,32 24,56 M 40,8 Q 56,32 40,56"
              fill="none"
              stroke="url(#gradient-parens)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="360"
              className="dash-animate"
            />
          </svg>
        </motion.div>
      </div>

      <style jsx>{`
        .dash-animate {
          animation: dashArray 3s ease-in-out infinite,
                     dashOffset 3s linear infinite;
        }

        .spin-animate {
          animation: spinDashArray 3s ease-in-out infinite,
                     spin 8s ease-in-out infinite,
                     dashOffset 3s linear infinite;
          transform-origin: center;
        }

        @keyframes dashArray {
          0% {
            stroke-dasharray: 0 1 359 0;
          }
          50% {
            stroke-dasharray: 0 359 1 0;
          }
          100% {
            stroke-dasharray: 359 1 0 0;
          }
        }

        @keyframes spinDashArray {
          0% {
            stroke-dasharray: 270 90;
          }
          50% {
            stroke-dasharray: 0 360;
          }
          100% {
            stroke-dasharray: 270 90;
          }
        }

        @keyframes dashOffset {
          0% {
            stroke-dashoffset: 365;
          }
          100% {
            stroke-dashoffset: 5;
          }
        }

        @keyframes spin {
          0% {
            rotate: 0deg;
          }
          12.5%, 25% {
            rotate: 270deg;
          }
          37.5%, 50% {
            rotate: 540deg;
          }
          62.5%, 75% {
            rotate: 810deg;
          }
          87.5%, 100% {
            rotate: 1080deg;
          }
        }
      `}</style>
    </motion.div>
  );
}
