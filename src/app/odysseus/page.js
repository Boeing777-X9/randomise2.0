'use client';

import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const team = [
  {
    name: "Krish Goel",
    role: "Project Lead/Founder",
    imageUrl:
      "https://res.cloudinary.com/randomize/image/upload/v1738162708/Website/Projects%20team/Odysseus/Krish-Goel_xehjuv.jpg",
  },
  {
    name: "Aditya Punmiya",
    role: "Project Co-Lead",
    imageUrl:
      "https://res.cloudinary.com/randomize/image/upload/v1738162713/Website/Projects%20team/Odysseus/Aditya_yo78ag.webp",
  },
  {
    name: "Dhruv Bansal",
    role: "Team Head",
    imageUrl:
      "https://res.cloudinary.com/randomize/image/upload/v1738162765/Website/Projects%20team/Odysseus/Dhruv_pprqj2.jpg",
  },
  {
    name: "Aviral Gupta",
    role: "Team Leader",
    imageUrl:
      "https://res.cloudinary.com/randomize/image/upload/v1738162773/Website/Projects%20team/Odysseus/Aviral_jnrpai.jpg",
  },
  {
    name: "GARVIT ARORA",
    role: "Hardware and robotics",
    imageUrl:
      "https://res.cloudinary.com/randomize/image/upload/v1738162796/Website/Projects%20team/Odysseus/Garvit_obqmwr.png",
  },
  {
    name: "Shresth Shroff ",
    role: "Electrical and Mechanical Head",
    imageUrl:
      "https://res.cloudinary.com/randomize/image/upload/v1738162800/Website/Projects%20team/Odysseus/Shresth_zrrcor.jpg",
  },
  {
    name: "Siddharth Singhal",
    role: "Circuitry and Robotics ",
    imageUrl:
      "https://res.cloudinary.com/randomize/image/upload/v1738162823/Website/Projects%20team/Odysseus/Siddharth_kq4y4i.jpg",
  },
  {
    name: "Savir Sharma ",
    role: "Software Team Lead",
    imageUrl:
      "https://res.cloudinary.com/randomize/image/upload/v1738162829/Website/Projects%20team/Odysseus/Savir_u20tzk.jpg",
  },
  {
    name: "Mahadevan K S",
    role: "Circuitry, Robotics, Maze Building",
    imageUrl:
      "https://res.cloudinary.com/randomize/image/upload/v1738162836/Website/Projects%20team/Odysseus/Mahadevan_rtyy2j.jpg",
  },
  {
    name: "Garv Kundnani",
    role: "Algorithms & AI, Documentation & Logistics",
    imageUrl:
      "https://res.cloudinary.com/randomize/image/upload/v1738162841/Website/Projects%20team/Odysseus/Garv_gnpxpf.jpg",
  },
];

export default function Odysseus() {
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
        <h1 className="text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Odysseus
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mx-auto mb-8">
          An autonomous maze-solving robot that navigates complex pathways using advanced algorithms and sensor technology.
        </p>
        
        {/* Project Image */}
        <motion.div 
          className="relative max-w-4xl mx-auto mb-12 rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Image
            src="/odysseus.jpg"
            alt="Odysseus Robot"
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
          <h2 className="text-3xl font-bold mb-6 text-blue-400">About the Project</h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            Odysseus is an autonomous maze-solving robot designed to navigate complex pathways using sophisticated 
            algorithms and sensor technology. The robot employs advanced pathfinding algorithms to efficiently 
            solve mazes while avoiding obstacles and finding the shortest route to its destination.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-purple-400">Key Features</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Autonomous navigation system</li>
                <li>• Advanced sensor integration</li>
                <li>• Real-time obstacle detection</li>
                <li>• Efficient pathfinding algorithms</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-purple-400">Technologies Used</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Arduino/Raspberry Pi</li>
                <li>• Ultrasonic sensors</li>
                <li>• Motor control systems</li>
                <li>• Computer vision</li>
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
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center hover:border-blue-500/30 transition-all duration-300"
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
              <p className="text-blue-400 text-sm">
                {member.role}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
