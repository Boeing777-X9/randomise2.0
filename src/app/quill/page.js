'use client';

import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const team = [
  {
    name: "Mahir Rohatgi",
    role: "Project Lead",
    imageUrl:
      "https://res.cloudinary.com/randomize/image/upload/v1738163351/Website/Projects%20team/quill/Mahir_k3z8lu.jpg",
  },
  {
    name: "Krish Goel",
    role: "Technical Advisor",
    imageUrl:
      "https://res.cloudinary.com/randomize/image/upload/v1738163359/Website/Projects%20team/quill/Krish-Goel_vcy2si.jpg",
  },
  {
    name: "Devyani Ghildiyal",
    role: "Team Member",
    imageUrl:
      "https://res.cloudinary.com/randomize/image/upload/v1738163374/Website/Projects%20team/quill/Devyani_xywrz0.jpg",
  },
  {
    name: "Khetul Patel",
    role: "Robotics Head",
    imageUrl:
      "https://res.cloudinary.com/randomize/image/upload/v1738163389/Website/Projects%20team/quill/Khetul_htsgpe.jpg",
  },
  {
    name: "Shresth Shroff ",
    role: "Electrical and Mechanical Head",
    imageUrl:
      "https://res.cloudinary.com/randomize/image/upload/v1738163396/Website/Projects%20team/quill/Shresth_v4srhr.jpg",
  },
  {
    name: "Aanan Chopra",
    role: "Python Team",
    imageUrl:
      "https://res.cloudinary.com/randomize/image/upload/v1738163412/Website/Projects%20team/quill/Aanan_syjzxt.jpg",
  },
  {
    name: "Rishi Singh",
    role: "Coding the backend python thing",
    imageUrl:
      "https://res.cloudinary.com/randomize/image/upload/v1738163425/Website/Projects%20team/quill/Rishi_ev5qu2.jpg",
  },
  {
    name: "Tanishka Magar",
    role: "Image processing & Arduino Team",
    imageUrl:
      "https://res.cloudinary.com/randomize/image/upload/v1738163446/Website/Projects%20team/quill/Tanishka_wub2qa.jpg",
  },
  {
    name: "Sia asrani ",
    role: "Documentation Team",
    imageUrl:
      "https://res.cloudinary.com/randomize/image/upload/v1738163454/Website/Projects%20team/quill/Sia_szyegg.jpg",
  },
];

export default function Quill() {
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
        <h1 className="text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
          Quill
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mx-auto mb-8">
          A Robot that Writes Your Assignments in Your Handwriting. Just Submit Your Questions in any format.
        </p>
        
        {/* Project Image */}
        <motion.div 
          className="relative max-w-4xl mx-auto mb-12 rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Image
            src="/quill.jpg"
            alt="Quill Robot"
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
          <h2 className="text-3xl font-bold mb-6 text-green-400">About the Project</h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            Quill is an innovative robotic writing system that can replicate your handwriting style. 
            Simply submit your questions in any format, and Quill will write out the answers in your 
            unique handwriting, making it perfect for assignments, notes, and personal correspondence.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-blue-400">Key Features</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Handwriting replication technology</li>
                <li>• Multi-format input support</li>
                <li>• Precision motor control</li>
                <li>• AI-powered text processing</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-blue-400">Technologies Used</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Computer Vision</li>
                <li>• Machine Learning</li>
                <li>• Arduino/Raspberry Pi</li>
                <li>• Image Processing</li>
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
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center hover:border-green-500/30 transition-all duration-300"
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
              <p className="text-green-400 text-sm">
                {member.role}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
