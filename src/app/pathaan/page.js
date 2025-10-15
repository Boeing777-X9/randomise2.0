'use client';

import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const team = [
  {
    name: "Mahek Chandak",
    role: "Project Lead/Founder",
    imageUrl:
      "https://ucarecdn.com/0f786e22-2575-4aee-ad01-8dc00c68b074/-/preview/",
  },
  {
    name: "Aditya Punmiya",
    role: "Project Software Lead",
    imageUrl:
      "https://res.cloudinary.com/randomize/image/upload/w_800,h_800,c_fit,q_auto,f_auto/v1738163115/Website/Projects%20team/pathaan/Aditya_r99a8d.webp",
  },
  {
    name: "Pranit Khandelwal",
    role: "Project Lead",
    imageUrl:
      "https://res.cloudinary.com/randomize/image/upload/w_800,h_800,c_fit,q_auto,f_auto/v1737884264/Website/Team2024-25/Pranit_q0xsjy.jpg",
  },
  {
    name: "Siddarth Singhal",
    role: "Project Lead",
    imageUrl:
      "https://res.cloudinary.com/randomize/image/upload/w_800,h_800,c_fit,q_auto,f_auto/v1738163122/Website/Projects%20team/pathaan/Siddharth_uv7uul.jpg",
  },
  {
    name: "Savir Sharma",
    role: "Senior Developer",
    imageUrl:
      "https://res.cloudinary.com/randomize/image/upload/w_800,h_800,c_fit,q_auto,f_auto/v1738163128/Website/Projects%20team/pathaan/Savir_kvs0gj.jpg",
  },
  {
    name: "Dhruv Bansal",
    role: "Hardware Lead",
    imageUrl:
      "https://res.cloudinary.com/randomize/image/upload/w_800,h_800,c_fit,q_auto,f_auto/v1738163134/Website/Projects%20team/pathaan/Dhruv_xh7odb.jpg",
  },
  {
    name: "Aviral Gupta",
    role: "Software Developer",
    imageUrl:
      "https://res.cloudinary.com/randomize/image/upload/w_800,h_800,c_fit,q_auto,f_auto/v1738163139/Website/Projects%20team/pathaan/Aviral_xzgzbr.jpg",
  },
  {
    name: "Krish Goel",
    role: "Technical Advisor",
    imageUrl:
      "https://res.cloudinary.com/randomize/image/upload/w_800,h_800,c_fit,q_auto,f_auto/v1738163146/Website/Projects%20team/pathaan/Krish-Goel_lqz7oh.jpg",
  },
];

export default function Pathaan() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#020108] to-[#0a051a] text-white py-20">
      {/* Hero Section */}
      <motion.div 
        className="text-center mb-16 px-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-600 bg-clip-text text-transparent">
          Pathaan
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mx-auto mb-8">
          Precision Android Targeted for Hostile Annihilation and Nullification - An advanced robotic security system.
        </p>
        
        {/* Project Image */}
        <motion.div 
          className="relative max-w-4xl mx-auto mb-12 rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Image
            src="/pathaan.jpg"
            alt="Pathaan Robot"
            width={800}
            height={500}
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </motion.div>
      </motion.div>

      {/* Project Description */}
      <motion.div 
        className="max-w-4xl mx-auto px-4 mb-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
          <h2 className="text-3xl font-bold mb-6 text-red-400">About the Project</h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            Pathaan is an advanced robotic security system designed for precision targeting and threat neutralization. 
            The system combines cutting-edge AI technology with robust hardware to create a comprehensive security solution 
            that can identify, track, and respond to potential threats in real-time.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-orange-400">Key Features</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Real-time threat detection</li>
                <li>• Precision targeting system</li>
                <li>• Advanced AI recognition</li>
                <li>• Autonomous response capability</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-orange-400">Technologies Used</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Computer Vision</li>
                <li>• Machine Learning</li>
                <li>• Advanced Robotics</li>
                <li>• Security Protocols</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Team Section */}
      <motion.div 
        className="max-w-7xl mx-auto px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Meet the Team
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center hover:border-red-500/30 transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">
                {member.name}
              </h3>
              <p className="text-red-400 text-sm">
                {member.role}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
