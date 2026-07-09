'use client';

import { motion } from "framer-motion";
import AnimatedRandomizeText from "./AnimatedRandomizeText";
import RhythmicWords from "./RhythmicWords";
import Floating, { FloatingElement } from "@/fancy/components/image/parallax-floating";

export default function Landing() {
  return (
  <div className="relative isolate overflow-hidden bg-transparent min-h-[110vh]">
      <Floating className="w-full h-full" sensitivity={3} easingFactor={0.15}>
        {/* Main Content Container with Parallax */}
        <FloatingElement depth={1.2} className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-20 sm:pb-32 flex items-center place-content-center min-h-[110vh] w-full lg:flex-row flex-col-reverse lg:px-8 lg:py-12" absolute={false}>
          <FloatingElement depth={1.5} className="mx-auto max-w-7xl px-2 sm:px-4 pb-4 md:pb-8 flex-row lg:px-8 lg:pt-12 lg:mt-0 pt-12 sm:pt-20" absolute={false}>
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