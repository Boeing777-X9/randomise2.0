'use client';

import { useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaRocket, 
  FaLightbulb, 
  FaClock, 
  FaCodeBranch, 
  FaClipboardList,
  FaTrophy
} from "react-icons/fa";

const timeline = [
  {
    title: "Problem Statement Release",
    time: "01:00 PM - 02:00 PM",
    description: "Problem statements released, team formation begins.",
    icon: <FaLightbulb />
  },
  {
    title: "Team Formation & Registration",
    time: "02:00 PM - 06:00 PM", 
    description: "Form teams of 3-4 members, register on the portal.",
    icon: <FaClipboardList />
  },
  {
    title: "Ideation & Planning",
    time: "06:00 PM - 09:00 PM",
    description: "Brainstorm solutions, plan your approach, create initial designs.",
    icon: <FaLightbulb />
  },
  {
    title: "Round 1: Pitch Presentation",
    time: "09:00 PM - 12:00 AM",
    description: "Present your idea to judges (5 min pitch + 2 min Q&A).",
    icon: <FaRocket />
  },
  {
    title: "PPT Submission & Tech Stack Selection",
    time: "12:00 AM - 10:00 AM",
    description: "Submit PPT, choose tech stack, create GitHub repo, fill Google Form (live at 8:00 AM).",
    icon: <FaClipboardList />
  },
  {
    title: "Break & Round 1 Result",
    time: "10:00 AM - 12:00 PM",
    description: "Rest period and Round 1 results announced.",
    icon: <FaClock />
  },
  {
    title: "Report to College",
    time: "12:00 PM - 01:00 PM",
    description: "Participants report back to the venue.",
    icon: <FaRocket />
  },
  {
    title: "Coding Begins",
    time: "01:00 PM - 08:00 PM",
    description: "Teams develop their prototypes with mentor support.",
    icon: <FaCodeBranch />
  },
  {
    title: "Break & Round 2 Result",
    time: "08:00 PM - 10:00 PM",
    description: "Rest period and Round 2 results announced.",
    icon: <FaClock />
  },
  {
    title: "Project Completion (Online)",
    time: "10:00 PM - 11:00 AM",
    description: "Complete and polish the project online.",
    icon: <FaCodeBranch />
  },
  {
    title: "Break & Round 3 Result",
    time: "11:00 AM - 12:00 PM",
    description: "Rest and Round 3 results announced.",
    icon: <FaClock />
  },
  {
    title: "Final Pitching to Judges",
    time: "12:00 PM - 02:00 PM",
    description: "Top teams pitch with a live demo (7-10 min each).",
    icon: <FaRocket />
  },
  {
    title: "Judges' Deliberation",
    time: "02:00 PM - 03:00 PM",
    description: "Judges decide the final winners.",
    icon: <FaTrophy />
  },
  {
    title: "Results & Prize Distribution",
    time: "03:00 PM - 04:00 PM",
    description: "Winner announcement and prize distribution ceremony.",
    icon: <FaTrophy />
  }
];

export default function Hackathon() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-white py-20">
      {/* Hero Section */}
      <motion.div 
        className="text-center mb-16 px-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-7xl font-bold mb-6 text-slate-300 tracking-tight drop-shadow-[0_0_12px_rgba(56,189,248,0.15)]">
          The Hackathon
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          A 36-hour coding marathon where innovation meets execution. Join us for an intense 
          journey of problem-solving, creativity, and technological excellence.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
          <span className="bg-purple-600/20 px-4 py-2 rounded-full border border-purple-600/30">
            36 Hours
          </span>
          <span className="bg-pink-600/20 px-4 py-2 rounded-full border border-pink-600/30">
            Multiple Rounds
          </span>
          <span className="bg-blue-600/20 px-4 py-2 rounded-full border border-blue-600/30">
            Live Mentorship
          </span>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Event Timeline
        </motion.h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-600 to-pink-600"></div>

          {timeline.map((event, index) => (
            <motion.div
              key={index}
              className={`relative flex items-center mb-12 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Icon */}
              <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white z-10">
                {event.icon}
              </div>

              {/* Content */}
              <div className={`ml-20 md:ml-0 md:w-5/12 ${
                index % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
              }`}>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 hover:border-purple-600/30 transition-all duration-300">
                  <h3 className="text-xl font-bold mb-2 text-purple-300">
                    {event.title}
                  </h3>
                  <p className="text-pink-400 font-semibold mb-3">
                    {event.time}
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <motion.div 
        className="text-center mt-16 px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h3 className="text-2xl md:text-3xl font-bold mb-6">
          Ready to Code Your Way to Victory?
        </h3>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Join us for an unforgettable experience of innovation, collaboration, and technological excellence. 
          Push your limits and create something amazing!
        </p>
        <motion.button 
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Register Now
        </motion.button>
      </motion.div>
    </div>
  );
}
