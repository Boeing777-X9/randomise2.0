'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, UserGroupIcon, TagIcon } from '@heroicons/react/24/outline';
import { PlayIcon } from '@heroicons/react/24/solid';

// Enhanced events data with more details
const eventsData = [
  {
    id: 1,
    title: "Tech Fest 2024",
    description: "Annual technology festival showcasing innovation, creativity, and cutting-edge solutions",
    longDescription: "Our flagship event bringing together tech enthusiasts, innovators, and industry experts for three days of workshops, competitions, and networking.",
    date: "Dec 15-17, 2024",
    status: "Completed",
    participants: "500+",
    image: "/fest.webp",
    category: "Festival",
    tags: ["Technology", "Innovation", "Competition"],
    highlights: ["48-hour Hackathon", "Industry Talks", "Project Showcase", "Networking Sessions"]
  },
  {
    id: 2,
    title: "Competitive Programming Workshop",
    description: "Comprehensive CP masterclass covering algorithms, data structures, and problem-solving techniques",
    longDescription: "Intensive workshop designed to elevate your competitive programming skills from beginner to advanced level.",
    date: "Nov 20, 2024",
    status: "Completed",
    participants: "200+",
    image: "/cp-workshop.jpg",
    category: "Workshop",
    tags: ["Programming", "Algorithms", "Learning"],
    highlights: ["Live Coding Sessions", "Contest Practice", "Expert Mentorship", "Problem Analysis"]
  },
  {
    id: 3,
    title: "GitHub & Open Source",
    description: "Master version control, collaboration, and open source contribution workflows",
    longDescription: "Learn industry-standard practices for code collaboration and contribute to the global developer community.",
    date: "Oct 28, 2024",
    status: "Completed",
    participants: "150+",
    image: "/GitHub Workshop.png",
    category: "Workshop",
    tags: ["Git", "Collaboration", "Open Source"],
    highlights: ["Git Fundamentals", "Pull Requests", "Code Review", "OSS Contribution"]
  },
  {
    id: 4,
    title: "Hello World 2024",
    description: "Welcome event for freshers featuring programming fundamentals and community introduction",
    longDescription: "The perfect starting point for new members to dive into the world of programming and join our vibrant community.",
    date: "Sep 10, 2024",
    status: "Completed",
    participants: "300+",
    image: "/hello-world-2024.png",
    category: "Welcome Event",
    tags: ["Beginners", "Community", "Introduction"],
    highlights: ["Programming Basics", "Community Tour", "Mentor Meet", "Welcome Kit"]
  },
  {
    id: 5,
    title: "Web Development Bootcamp",
    description: "Full-stack web development intensive covering modern frameworks and best practices",
    longDescription: "Comprehensive bootcamp covering React, Node.js, databases, and deployment strategies for modern web applications.",
    date: "Aug 15-17, 2024",
    status: "Completed",
    participants: "180+",
    image: "/WebDevWS-1.jpg",
    category: "Bootcamp",
    tags: ["Web Dev", "React", "Full Stack"],
    highlights: ["React Fundamentals", "Backend APIs", "Database Design", "Deployment"]
  },
  {
    id: 6,
    title: "AI/ML Workshop",
    description: "Dive into artificial intelligence and machine learning with hands-on projects",
    longDescription: "Explore the fascinating world of AI and ML through practical implementation and real-world case studies.",
    date: "Jul 22, 2024",
    status: "Completed",
    participants: "220+",
    image: "/ANN Class.png",
    category: "Workshop",
    tags: ["AI", "Machine Learning", "Data Science"],
    highlights: ["Neural Networks", "Model Training", "Data Processing", "Project Building"]
  }
];

const NewEvents = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get unique categories
  const categories = ['All', ...new Set(eventsData.map(event => event.category))];
  
  // Filter events by category
  const filteredEvents = selectedCategory === 'All' 
    ? eventsData 
    : eventsData.filter(event => event.category === selectedCategory);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredEvents.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [filteredEvents.length]);

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredEvents.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredEvents.length) % filteredEvents.length);
  };

  const currentEvent = filteredEvents[currentIndex];

  if (!currentEvent) return null;

  return (
    <section 
      className="relative min-h-screen bg-transparent overflow-hidden"
      id="events"
    >
      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-7xl font-black mb-6 pt-4 text-slate-300 tracking-tight drop-shadow-[0_0_12px_rgba(56,189,248,0.15)]">
              EVENTS
            </h2>
          
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-lg border transition-all duration-300 font-medium ${
                selectedCategory === category
                  ? 'bg-transparent border-sky-200/70 text-sky-100 shadow-[0_0_14px_rgba(186,230,253,0.3)]'
                  : 'border-gray-600 text-gray-300 hover:border-sky-300/40 hover:text-sky-200'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Main Event Display */}
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentEvent.id}
              className="grid lg:grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              {/* Event Content */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    currentEvent.status === 'Completed' 
                      ? 'bg-green-900/30 text-green-300 border border-green-700'
                      : 'bg-blue-900/30 text-blue-300 border border-blue-700'
                  }`}>
                    {currentEvent.status}
                  </span>
                  <span className="text-purple-400 font-medium">{currentEvent.category}</span>
                </div>

                <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                  {currentEvent.title}
                </h3>

                <p className="text-gray-300 text-lg leading-relaxed">
                  {currentEvent.longDescription}
                </p>

                {/* Event Stats */}
                <div className="flex flex-wrap gap-6 py-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <CalendarIcon className="w-5 h-5" />
                    <span>{currentEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <UserGroupIcon className="w-5 h-5" />
                    <span>{currentEvent.participants} Participants</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {currentEvent.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-800/50 border border-gray-700 rounded-full text-sm text-gray-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Highlights */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                    <TagIcon className="w-5 h-5 text-purple-400" />
                    Event Highlights
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {currentEvent.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-300">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                        <span className="text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Event Image */}
              <div className="relative">
                <motion.div
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-1"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={currentEvent.image}
                      alt={currentEvent.title}
                      className="w-full h-[400px] object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-event.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    
                    {/* Play Button Overlay */}
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/20"
                      whileHover={{ opacity: 1 }}
                    >
                      <motion.button
                        className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <PlayIcon className="w-8 h-8 text-white ml-1" />
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 blur-xl opacity-60 -z-10" />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-12">
            {/* Previous/Next Buttons */}
            <div className="flex gap-4">
              <motion.button
                onClick={prevSlide}
                className="w-12 h-12 bg-gray-800/50 border border-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:bg-purple-600/20 hover:border-purple-500 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </motion.button>
              <motion.button
                onClick={nextSlide}
                className="w-12 h-12 bg-gray-800/50 border border-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:bg-purple-600/20 hover:border-purple-500 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRightIcon className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Slide Indicators */}
            <div className="flex gap-2">
              {filteredEvents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-gradient-to-r from-purple-400 to-pink-400 scale-125'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Event Counter */}
          <div className="text-center mt-8">
            <span className="text-gray-400 text-sm">
              {currentIndex + 1} of {filteredEvents.length} events
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewEvents;
