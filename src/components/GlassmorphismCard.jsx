'use client';

import React from "react";
import { motion } from "framer-motion";

const GlassmorphismCard = ({ 
  title = "Options", 
  subtitle = "Select an option",
  features = [],
  frontIcon = null,
  hue1 = 300,
  hue2 = 240,
  className = "",
  children = null
}) => {
  return (
    <motion.div 
      className={`glassmorphism-card relative ${className}`}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      style={{
        background: `
          linear-gradient(135deg, 
            hsla(${hue1}, 20%, 15%, 0.25) 0%,
            hsla(${hue2}, 25%, 10%, 0.15) 100%
          ),
          linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 100%
          )
        `,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid`,
        borderImage: `linear-gradient(135deg, 
          hsla(${hue1}, 70%, 80%, 0.5) 0%,
          rgba(255, 255, 255, 0.4) 25%,
          hsla(${hue2}, 70%, 80%, 0.45) 50%,
          rgba(255, 255, 255, 0.35) 75%,
          hsla(${hue1}, 70%, 80%, 0.4) 100%
        ) 1`,
        borderRadius: '24px',
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.37),
          inset 0 1px 0 rgba(255, 255, 255, 0.15),
          inset 0 0 20px hsla(${hue1}, 50%, 50%, 0.05),
          0 1px 3px rgba(0, 0, 0, 0.2),
          0 0 15px hsla(${hue1}, 80%, 50%, 0.15),
          0 0 30px hsla(${hue2}, 80%, 50%, 0.12)
        `,
        isolation: 'isolate',
        position: 'relative',
        overflow: 'hidden',
        minWidth: '320px',
        minHeight: '380px',
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Subtle gradient overlay */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, 
            hsla(${hue1}, 60%, 50%, 0.08) 0%,
            hsla(${hue2}, 60%, 50%, 0.05) 100%
          )`,
          borderRadius: '24px',
        }}
      />
      
      {/* Top-left corner light beam */}
      <motion.div 
        className="absolute top-0 left-0 pointer-events-none overflow-hidden"
        style={{
          width: '120px',
          height: '120px',
          borderTopLeftRadius: '24px',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatDelay: 4,
          ease: "easeInOut"
        }}
      >
        <div 
          className="absolute -top-4 -left-4 w-32 h-1 origin-left"
          style={{
            background: `linear-gradient(90deg, 
              hsla(${hue1}, 80%, 80%, 0.8) 0%,
              hsla(${hue1}, 80%, 80%, 0.4) 50%,
              transparent 100%
            )`,
            transform: 'rotate(45deg)',
            filter: 'blur(1px)',
            boxShadow: `0 0 10px hsla(${hue1}, 80%, 70%, 0.6)`,
          }}
        />
        <div 
          className="absolute -top-2 -left-2 w-28 h-0.5 origin-left"
          style={{
            background: `linear-gradient(90deg, 
              hsla(${hue1}, 90%, 90%, 1) 0%,
              hsla(${hue1}, 90%, 90%, 0.6) 60%,
              transparent 100%
            )`,
            transform: 'rotate(45deg)',
            filter: 'blur(0.5px)',
          }}
        />
      </motion.div>

      {/* Top-right corner light beam */}
      <motion.div 
        className="absolute top-0 right-0 pointer-events-none overflow-hidden"
        style={{
          width: '100px',
          height: '100px',
          borderTopRightRadius: '24px',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 6,
          delay: 1,
          ease: "easeInOut"
        }}
      >
        <div 
          className="absolute -top-4 -right-4 w-28 h-1 origin-right"
          style={{
            background: `linear-gradient(90deg, 
              transparent 0%,
              hsla(${hue2}, 80%, 80%, 0.4) 50%,
              hsla(${hue2}, 80%, 80%, 0.8) 100%
            )`,
            transform: 'rotate(-45deg)',
            filter: 'blur(1px)',
            boxShadow: `0 0 8px hsla(${hue2}, 80%, 70%, 0.5)`,
          }}
        />
        <div 
          className="absolute -top-2 -right-2 w-24 h-0.5 origin-right"
          style={{
            background: `linear-gradient(90deg, 
              transparent 0%,
              hsla(${hue2}, 90%, 90%, 0.6) 40%,
              hsla(${hue2}, 90%, 90%, 1) 100%
            )`,
            transform: 'rotate(-45deg)',
            filter: 'blur(0.5px)',
          }}
        />
      </motion.div>

      {/* Bottom-left corner light beam */}
      <motion.div 
        className="absolute bottom-0 left-0 pointer-events-none overflow-hidden"
        style={{
          width: '80px',
          height: '80px',
          borderBottomLeftRadius: '24px',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          repeatDelay: 7,
          delay: 2,
          ease: "easeInOut"
        }}
      >
        <div 
          className="absolute -bottom-4 -left-4 w-24 h-0.5 origin-left"
          style={{
            background: `linear-gradient(90deg, 
              hsla(${hue1}, 70%, 75%, 0.7) 0%,
              hsla(${hue1}, 70%, 75%, 0.3) 70%,
              transparent 100%
            )`,
            transform: 'rotate(-45deg)',
            filter: 'blur(1px)',
            boxShadow: `0 0 6px hsla(${hue1}, 70%, 65%, 0.4)`,
          }}
        />
      </motion.div>

      {/* Bottom-right corner light beam */}
      <motion.div 
        className="absolute bottom-0 right-0 pointer-events-none overflow-hidden"
        style={{
          width: '90px',
          height: '90px',
          borderBottomRightRadius: '24px',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0] }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          repeatDelay: 5.5,
          delay: 3,
          ease: "easeInOut"
        }}
      >
        <div 
          className="absolute -bottom-4 -right-4 w-26 h-0.5 origin-right"
          style={{
            background: `linear-gradient(90deg, 
              transparent 0%,
              hsla(${hue2}, 70%, 75%, 0.3) 30%,
              hsla(${hue2}, 70%, 75%, 0.7) 100%
            )`,
            transform: 'rotate(45deg)',
            filter: 'blur(1px)',
            boxShadow: `0 0 8px hsla(${hue2}, 70%, 65%, 0.5)`,
          }}
        />
        <div 
          className="absolute -bottom-2 -right-2 w-22 h-px origin-right"
          style={{
            background: `linear-gradient(90deg, 
              transparent 0%,
              hsla(${hue2}, 80%, 85%, 0.5) 40%,
              hsla(${hue2}, 80%, 85%, 0.9) 100%
            )`,
            transform: 'rotate(45deg)',
            filter: 'blur(0.5px)',
          }}
        />
      </motion.div>

      {/* Top-left corner shine */}
      <div 
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: '60px',
          height: '60px',
          background: `radial-gradient(circle at top left, 
            hsla(${hue1}, 70%, 70%, 0.4) 0%,
            hsla(${hue1}, 70%, 70%, 0.2) 30%,
            transparent 60%
          )`,
          borderTopLeftRadius: '24px',
        }}
      />
      
      {/* Top-right corner shine */}
      <div 
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: '80px',
          height: '80px',
          background: `radial-gradient(circle at top right, 
            hsla(${hue2}, 70%, 70%, 0.3) 0%,
            hsla(${hue2}, 70%, 70%, 0.15) 35%,
            transparent 65%
          )`,
          borderTopRightRadius: '24px',
        }}
      />
      
      {/* Bottom-left subtle glow */}
      <div 
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{
          width: '50px',
          height: '50px',
          background: `radial-gradient(circle at bottom left, 
            hsla(${hue1}, 60%, 60%, 0.25) 0%,
            hsla(${hue1}, 60%, 60%, 0.1) 40%,
            transparent 70%
          )`,
          borderBottomLeftRadius: '24px',
        }}
      />
      
      {/* Bottom-right corner glow */}
      <div 
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{
          width: '70px',
          height: '70px',
          background: `radial-gradient(circle at bottom right, 
            hsla(${hue2}, 60%, 60%, 0.2) 0%,
            hsla(${hue2}, 60%, 60%, 0.08) 45%,
            transparent 75%
          )`,
          borderBottomRightRadius: '24px',
        }}
      />
      
      {/* Top-left edge light beam */}
      <div
        className="absolute -top-[2px] -left-[2px] w-[100px] h-[100px] pointer-events-none overflow-hidden z-10"
      >
        <div
          style={{
            position: 'absolute',
            width: '20px',
            height: '150px',
            background: `linear-gradient(to bottom right, 
              hsla(${hue1}, 90%, 70%, 0.9),
              hsla(${hue1}, 90%, 70%, 0.2) 40%, 
              transparent 80%
            )`,
            transform: 'rotate(45deg) translate(-80px, -10px)',
            borderRadius: '100%',
            filter: 'blur(5px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '10px',
            height: '120px',
            background: `linear-gradient(to bottom right, 
              hsla(${hue1}, 90%, 90%, 0.95),
              hsla(${hue1}, 90%, 80%, 0.3) 30%, 
              transparent 70%
            )`,
            transform: 'rotate(45deg) translate(-75px, -5px)',
            borderRadius: '100%',
            filter: 'blur(2px)',
          }}
        />
      </div>

      {/* Top-right edge light beam */}
      <div
        className="absolute -top-[2px] -right-[2px] w-[100px] h-[100px] pointer-events-none overflow-hidden z-10"
      >
        <div
          style={{
            position: 'absolute',
            width: '20px',
            height: '150px',
            background: `linear-gradient(to bottom left, 
              hsla(${hue2}, 90%, 70%, 0.9),
              hsla(${hue2}, 90%, 70%, 0.2) 40%, 
              transparent 80%
            )`,
            transform: 'rotate(-45deg) translate(-80px, -10px)',
            borderRadius: '100%',
            filter: 'blur(5px)',
            right: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '10px',
            height: '120px',
            background: `linear-gradient(to bottom left, 
              hsla(${hue2}, 90%, 90%, 0.95),
              hsla(${hue2}, 90%, 80%, 0.3) 30%, 
              transparent 70%
            )`,
            transform: 'rotate(-45deg) translate(-75px, -5px)',
            borderRadius: '100%',
            filter: 'blur(2px)',
            right: 0,
          }}
        />
      </div>

      {/* Bottom-left edge light beam */}
      <div
        className="absolute -bottom-[2px] -left-[2px] w-[100px] h-[100px] pointer-events-none overflow-hidden z-10"
      >
        <div
          style={{
            position: 'absolute',
            width: '20px',
            height: '150px',
            background: `linear-gradient(to top right, 
              hsla(${hue1}, 90%, 70%, 0.8),
              hsla(${hue1}, 90%, 70%, 0.2) 40%, 
              transparent 80%
            )`,
            transform: 'rotate(-45deg) translate(-80px, -40px)',
            borderRadius: '100%',
            filter: 'blur(5px)',
            bottom: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '10px',
            height: '120px',
            background: `linear-gradient(to top right, 
              hsla(${hue1}, 90%, 90%, 0.9),
              hsla(${hue1}, 90%, 80%, 0.3) 30%, 
              transparent 70%
            )`,
            transform: 'rotate(-45deg) translate(-75px, -45px)',
            borderRadius: '100%',
            filter: 'blur(2px)',
            bottom: 0,
          }}
        />
      </div>

      {/* Bottom-right edge light beam */}
      <div
        className="absolute -bottom-[2px] -right-[2px] w-[100px] h-[100px] pointer-events-none overflow-hidden z-10"
      >
        <div
          style={{
            position: 'absolute',
            width: '20px',
            height: '150px',
            background: `linear-gradient(to top left, 
              hsla(${hue2}, 90%, 70%, 0.8),
              hsla(${hue2}, 90%, 70%, 0.2) 40%, 
              transparent 80%
            )`,
            transform: 'rotate(45deg) translate(-80px, -40px)',
            borderRadius: '100%',
            filter: 'blur(5px)',
            bottom: 0,
            right: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '10px',
            height: '120px',
            background: `linear-gradient(to top left, 
              hsla(${hue2}, 90%, 90%, 0.9),
              hsla(${hue2}, 90%, 80%, 0.3) 30%, 
              transparent 70%
            )`,
            transform: 'rotate(45deg) translate(-75px, -45px)',
            borderRadius: '100%',
            filter: 'blur(2px)',
            bottom: 0,
            right: 0,
          }}
        />
      </div>

      {/* Additional horizontal edge beams */}
      <div 
        className="absolute -top-1 left-1/4 right-1/4 h-px opacity-40 z-10"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent)',
          filter: 'blur(0.5px)',
        }}
      />

      <div 
        className="absolute -bottom-1 left-1/4 right-1/4 h-px opacity-40 z-10"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent)',
          filter: 'blur(0.5px)',
        }}
      />

      {/* Additional vertical edge beams */}
      <div 
        className="absolute -left-1 top-1/4 bottom-1/4 w-px opacity-40 z-10"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.9), transparent)',
          filter: 'blur(0.5px)',
        }}
      />

      <div 
        className="absolute -right-1 top-1/4 bottom-1/4 w-px opacity-40 z-10"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.9), transparent)',
          filter: 'blur(0.5px)',
        }}
      />
      
      {/* Animated shimmer effect */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-0"
        style={{
          background: `linear-gradient(135deg, 
            transparent 0%,
            hsla(${hue1}, 70%, 80%, 0.1) 25%,
            hsla(${hue2}, 70%, 80%, 0.15) 50%,
            hsla(${hue1}, 70%, 80%, 0.1) 75%,
            transparent 100%
          )`,
          borderRadius: '24px',
          transform: 'translateX(-100%)',
        }}
        animate={{
          translateX: ['100%', '-100%'],
          opacity: [0, 0.6, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 5,
          ease: "easeInOut"
        }}
      />

      {/* Diagonal sweeping beam */}
      <motion.div 
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          borderRadius: '24px',
        }}
      >
        <motion.div 
          className="absolute w-2 h-full opacity-0"
          style={{
            background: `linear-gradient(180deg, 
              transparent 0%,
              hsla(${hue1}, 80%, 85%, 0.4) 20%,
              hsla(${hue2}, 80%, 85%, 0.6) 50%,
              hsla(${hue1}, 80%, 85%, 0.4) 80%,
              transparent 100%
            )`,
            filter: 'blur(2px)',
            boxShadow: `0 0 20px hsla(${hue2}, 70%, 70%, 0.4)`,
            left: '-10px',
            transform: 'rotate(15deg) skewX(-15deg)',
          }}
          animate={{
            left: ['-10px', 'calc(100% + 10px)'],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatDelay: 8,
            ease: "easeInOut"
          }}
        />
      </motion.div>
      
      {/* Render children if provided, otherwise use the default header + features layout */}
      {children ? (
        <div className="relative z-10 flex-1">
          {children}
        </div>
      ) : (
        <>
          {/* Header section */}
          <motion.header 
            className="flex items-start gap-4 mb-8 relative z-10"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {frontIcon && (
              <motion.div 
                className="flex-shrink-0 p-3 rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, 
                    hsla(${hue1}, 70%, 50%, 0.15) 0%,
                    hsla(${hue2}, 70%, 50%, 0.1) 100%
                  )`,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-white/90">
                  {React.cloneElement(frontIcon, { className: "w-8 h-8" })}
                </div>
              </motion.div>
            )}
            <div className="flex-1">
              <motion.h3 
                className="text-white font-semibold text-xl mb-1 leading-tight"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {title}
              </motion.h3>
              {subtitle && (
                <motion.p 
                  className="text-white/70 text-sm font-medium"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {subtitle}
                </motion.p>
              )}
            </div>
          </motion.header>
          
          {/* Features list */}
          <motion.div 
            className="flex-1 space-y-4 relative z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="group"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, 
                        hsl(${hue1}, 70%, 60%) 0%,
                        hsl(${hue2}, 70%, 60%) 100%
                      )`,
                      boxShadow: `0 0 8px hsla(${hue1}, 70%, 60%, 0.5)`
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-base mb-2 leading-snug">
                      {feature.name}
                    </h4>
                    <p className="text-white/75 text-sm leading-relaxed font-normal">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
      
      {/* Bottom highlight */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-px opacity-20"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)'
        }}
      />
    </motion.div>
  );
};

export default GlassmorphismCard;
