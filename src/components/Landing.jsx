'use client';

import { motion } from "framer-motion";
import AnimatedRandomizeText from "./AnimatedRandomizeText";
import RhythmicWords from "./RhythmicWords";
import Floating, { FloatingElement } from "@/fancy/components/image/parallax-floating";

export default function Landing() {
  return (
  <div className="relative isolate overflow-hidden bg-gradient-to-br from-[#0d0618] via-[#1a0b3d] to-[#000000] min-h-lvh">
      <Floating className="w-full h-full" sensitivity={3} easingFactor={0.15}>
        {/* Background Pattern with Parallax */}
        <FloatingElement depth={0.5} className="absolute inset-0 -z-10 h-full w-full">
          <svg
            className="h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
                width={200}
                height={200}
                x="50%"
                y={-1}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-800/20">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              width="100%"
              height="100%"
              strokeWidth={0}
              fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)"
            />
          </svg>
        </FloatingElement>

        {/* Background Gradient Blob with Parallax */}
        <FloatingElement 
          depth={0.8} 
          className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
        >
          <div
            className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] opacity-25"
            style={{
              clipPath:
                "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
            }}
          />
        </FloatingElement>

        {/* Main Content Container with Parallax */}
        <FloatingElement depth={1.2} className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 pb-16 sm:pb-24 flex items-center place-content-center min-h-lvh w-full lg:flex-row flex-col-reverse lg:px-8 lg:py-8" absolute={false}>
          <FloatingElement depth={1.5} className="mx-auto max-w-7xl px-2 sm:px-4 pb-2 md:pb-4 flex flex-row lg:px-8 lg:pt-10 lg:mt-0 pt-10 sm:pt-16" absolute={false}>
            {/* Logo Container with Enhanced Parallax */}
            <FloatingElement depth={2} className="flex place-content-center" absolute={false}>
              <motion.div 
                className="relative mt-6 md:-mt-6 h-[clamp(120px,28vw,320px)] w-[clamp(120px,28vw,320px)]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [0, -10, 0],
                  rotateY: [0, 5, 0, -5, 0],
                }}
                transition={{
                  opacity: { duration: 0.8, ease: "easeOut" },
                  scale: { duration: 0.8, ease: "easeOut" },
                  y: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  rotateY: {
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 15,
                  transition: { duration: 0.3 }
                }}
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "1000px"
                }}
              >
                <motion.div
                  animate={{
                    filter: [
                      "brightness(1) contrast(1)",
                      "brightness(1.1) contrast(1.1)",
                      "brightness(1) contrast(1)",
                      "brightness(0.9) contrast(0.9)",
                      "brightness(1) contrast(1)"
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Using regular img tag for better GIF support */}
                  <img
                    src="/logo-gif.gif"
                    alt="Randomize Logo"
                    className="w-full h-full object-contain"
                    style={{
                      imageRendering: "auto",
                    }}
                  />
                </motion.div>
                
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </FloatingElement>
            
            {/* Animated Text with Parallax */}
            <FloatingElement depth={1.8} absolute={false}>
              <motion.div 
                className="mx-auto flex-shrink-0 lg:mx-0"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <AnimatedRandomizeText />
              </motion.div>
            </FloatingElement>

            {/* Title Text with Parallax */}
            <FloatingElement depth={2.2} absolute={false}>
              <motion.div 
                className="mx-auto flex-shrink-0 lg:mx-auto lg:max-w-xl lg:pt-0 flex justify-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <RhythmicWords />
              </motion.div>
            </FloatingElement>
          </FloatingElement>
        </FloatingElement>
      </Floating>
    </div>
  );
}