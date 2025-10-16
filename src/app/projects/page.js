'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import LiveProjectsData from "@/data/LiveProjectsData";
// import PassionProjectsData from "@/data/PassionProjectsData";

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredProject, setHoveredProject] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const allProjects = [
    ...LiveProjectsData.map(p => ({ ...p, category: 'live' })),
    // ...PassionProjectsData.map(p => ({ ...p, category: 'passion' })) <--pojects exlcuded 
  ];

  const filteredProjects = activeCategory === 'all' 
    ? allProjects 
    : allProjects.filter(project => project.category === activeCategory);

  const categories = [
    { id: 'all', label: 'All Projects', count: allProjects.length },
    { id: 'live', label: 'Live Projects', count: LiveProjectsData.length },
    // { id: 'passion', label: 'Passion Projects', count: PassionProjectsData.length } <-- projects excluded
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-32 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-16">
        <motion.div 
          className="text-center max-w-6xl mx-auto px-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            className="inline-block mb-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-sm font-semibold uppercase tracking-wider">
              Innovation Hub
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Our Projects
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Explore our rich inventory of innovative projects that showcase our 
            <span className="text-blue-400 font-semibold"> creativity</span> and 
            <span className="text-purple-400 font-semibold"> technical expertise</span>
          </motion.p>
        </motion.div>
      </div>

      {/* Category Filter */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 mb-16">
        <motion.div 
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm border ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-transparent text-white shadow-lg'
                  : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.label}
              <span className="ml-2 text-xs opacity-75">({category.count})</span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Projects Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={`${project.category}-${project.id}`}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onHoverStart={() => setHoveredProject(project.id)}
                onHoverEnd={() => setHoveredProject(null)}
              >
                <Link href={project.href}>
                  <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 group-hover:scale-105 cursor-pointer h-full">
                    
                    {/* Project Image */}
                    <div className="relative h-64 overflow-hidden">
                      <motion.img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        whileHover={{ scale: 1.1 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* Category Badge */}
                      <motion.div 
                        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
                          project.category === 'live' 
                            ? 'bg-gradient-to-r from-green-600 to-blue-600' 
                            : 'bg-gradient-to-r from-purple-600 to-pink-600'
                        }`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        {project.category === 'live' ? 'Live' : 'Passion'}
                      </motion.div>

                      {/* Hover Overlay */}
                      <AnimatePresence>
                        {hoveredProject === project.id && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <motion.div
                              className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                            >
                              <span className="text-white font-semibold">View Project</span>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Project Content */}
                    <div className="p-6">
                      <motion.h3 
                        className="text-xl font-bold mb-3 group-hover:text-blue-300 transition-colors duration-300"
                        layoutId={`title-${project.category}-${project.id}`}
                      >
                        {project.title}
                      </motion.h3>
                      
                      <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4">
                        {project.description}
                      </p>

                      {/* Project Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          {project.date}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          project.category === 'live' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-purple-500/20 text-purple-400'
                        }`}>
                          {project.category === 'live' ? 'Active' : 'Creative'}
                        </span>
                      </div>
                    </div>

                    {/* Glowing Border Effect */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                         style={{
                           background: project.category === 'live' 
                             ? 'linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.4), transparent)'
                             : 'linear-gradient(45deg, transparent, rgba(168, 85, 247, 0.4), transparent)',
                           padding: '2px',
                           WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                           WebkitMaskComposite: 'exclude'
                         }}></div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold mb-2">No projects found</h3>
            <p className="text-gray-400">Try selecting a different category</p>
          </motion.div>
        )}
      </div>

      {/* Call to Action Section */}
      <div className="relative z-10 py-20 px-6">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Want to collaborate with us?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            We're always looking for passionate individuals to join our innovative projects
          </p>
          <motion.button 
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get in Touch
          </motion.button>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
