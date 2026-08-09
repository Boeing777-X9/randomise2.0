'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Floating, { FloatingElement } from '@/fancy/components/image/parallax-floating';
import LiveProjectsData from '../data/LiveProjectsData';
import PassionProjectsData from '../data/PassionProjectsData';

export default function Projects() {
  const liveProjectsRef = useRef(null);
  const passionProjectsRef = useRef(null);
  
  const liveProjectsInView = useInView(liveProjectsRef, { 
    threshold: 0.3, 
    once: true 
  });
  const passionProjectsInView = useInView(passionProjectsRef, { 
    threshold: 0.3, 
    once: true 
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      x: 100,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const ProjectCard = ({ project, index }) => (
    <motion.article
      variants={cardVariants}
      className="group relative flex flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br from-[#020108]/90 via-[#0a051a]/85 to-[#1a0b3d]/90 backdrop-blur-md border border-[#A10FF2]/20 hover:border-[#A10FF2]/40 transition-all duration-500 cursor-pointer shadow-xl shadow-black/20"
      whileHover={{ 
        y: -12,
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(161, 15, 242, 0.3)"
      }}
      style={{ minHeight: '480px' }}
    >
      {/* Background Image with Enhanced Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.img
          src={project.imageUrl}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          whileHover={{ filter: "brightness(0.7)" }}
        />
        {/* Multiple overlay layers for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#2D0FF7]/20 via-transparent to-[#F20059]/20 opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
      </div>
      
      {/* Enhanced Content with Better Contrast */}
      <div className="relative z-10 p-8 text-white">
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <span className="inline-block px-4 py-2 text-sm font-semibold bg-gradient-to-r from-[#2D0FF7] to-[#A10FF2] rounded-full text-white shadow-lg">
            Project #{String(index + 1).padStart(2, '0')}
          </span>
        </motion.div>
        
        <motion.h3 
          className="text-2xl lg:text-3xl font-bold leading-8 text-white mb-4 drop-shadow-lg group-hover:text-gradient-primary transition-all duration-300"
          whileHover={{ scale: 1.05, x: 5 }}
        >
          <a 
            href={project.href} 
            className="hover:underline decoration-2 underline-offset-4 decoration-[#A10FF2]"
          >
            {project.title}
          </a>
        </motion.h3>
        
        <motion.p 
          className="text-base lg:text-lg text-gray-100 leading-relaxed font-medium drop-shadow-md group-hover:text-white transition-colors duration-300"
          whileHover={{ x: 5 }}
        >
          {project.description}
        </motion.p>
        
        {/* Animated bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] w-0 group-hover:w-full transition-all duration-500 ease-out"
        />
      </div>
      
      {/* Floating action indicator */}
      <motion.div
        className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        whileHover={{ scale: 1.1, rotate: 15 }}
      >
        <div className="w-10 h-10 bg-gradient-to-r from-[#2D0FF7] to-[#A10FF2] rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </motion.div>
    </motion.article>
  );

  const ProjectSection = ({ 
    title, 
    projects, 
    sectionRef, 
    inView, 
    gradientClass = "bg-gradient-to-br from-[#020108]/40 via-[#0a051a]/30 to-[#1a0b3d]/40" 
  }) => (
    <motion.div
      ref={sectionRef}
      className="w-full px-6 lg:px-10 flex items-center justify-center py-20"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className={`w-full max-w-7xl ${gradientClass} rounded-3xl backdrop-blur-md border border-[#A10FF2]/10 p-8 lg:p-12 shadow-2xl shadow-black/20`}>
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Enhanced Section Title */}
          <motion.div 
            className="flex-shrink-0 text-center lg:text-left relative"
            variants={cardVariants}
          >
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-[#2D0FF7]/20 via-[#A10FF2]/20 to-[#F20059]/20 rounded-2xl blur-xl opacity-0"
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            />
            <h2 className="relative heading-hero text-4xl lg:text-6xl xl:text-7xl font-black tracking-tight">
              {title.split(' ').map((word, index) => (
                <motion.span 
                  key={index} 
                  className="block text-slate-300 tracking-tight drop-shadow-[0_0_10px_rgba(56,189,248,0.12)]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundImage: 'linear-gradient(to right, #FF6B6B, #4ECDC4, #45B7D1)',
                    transition: { duration: 0.3 }
                  }}
                >
                  {word}
                </motion.span>
              ))}
              
              {/* Decorative elements */}
              <motion.div
                className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-[#2D0FF7] to-[#A10FF2] rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-3 h-3 bg-gradient-to-r from-[#A10FF2] to-[#F20059] rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.8, 0.4]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
            </h2>
          </motion.div>

          {/* Enhanced Projects Grid */}
          <motion.div 
            className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
            variants={containerVariants}
          >
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section 
      id="projects" 
      className="relative bg-transparent py-20 overflow-hidden"
    >

      {/* Live Projects Section */}
      <ProjectSection
        title="Live Projects"
        projects={LiveProjectsData}
        sectionRef={liveProjectsRef}
        inView={liveProjectsInView}
        gradientClass="bg-gradient-to-br from-[#2D0FF7]/5 via-[#020108]/60 to-[#6A0FF4]/5"
      />

    </section>
  );
}
