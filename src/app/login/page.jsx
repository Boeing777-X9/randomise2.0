'use client';

import Floating, { FloatingElement } from "@/fancy/components/image/parallax-floating";
import GlassmorphismCard from "@/components/GlassmorphismCard";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Landing() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="relative isolate overflow-hidden bg-transparent min-h-lvh">
      <Floating className="w-full h-full" sensitivity={3} easingFactor={0.15}>
        {/* Main Content Container with Parallax */}
        <FloatingElement depth={1.2} className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 pb-16 sm:pb-24 flex items-center place-content-center min-h-lvh w-full lg:flex-row flex-col-reverse lg:px-8 lg:py-8" absolute={false}>
          <FloatingElement depth={1.5} className="mx-auto max-w-7xl px-2 sm:px-4 pb-2 md:pb-4 flex-row lg:px-8 lg:pt-10 mt-24 sm:mt-16 pt-10 sm:pt-16" absolute={false}>
            {/*Login / signup form */}
            <GlassmorphismCard className="w-full">
              <div className="w-full">
                {/* Header */}
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 bg-clip-text text-transparent mb-2">
                    {isLogin ? "Welcome Back" : "Join Randomize()"}
                  </h1>
                  <p className="text-gray-300 text-sm sm:text-base">
                    {isLogin ? "Sign in to your account to continue" : "Create your account to get started"}
                  </p>
                </motion.div>

                {/* Form */}
                <motion.form 
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  {/* Name Field (Sign Up Only) */}
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#A10FF2] focus:ring-2 focus:ring-[#A10FF2]/30 transition-all duration-300 backdrop-blur-sm"
                      />
                    </motion.div>
                  )}

                  {/* Email Field */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#A10FF2] focus:ring-2 focus:ring-[#A10FF2]/30 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#A10FF2] focus:ring-2 focus:ring-[#A10FF2]/30 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>

                  {/* Confirm Password Field (Sign Up Only) */}
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="block text-gray-300 text-sm font-medium mb-2">Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#A10FF2] focus:ring-2 focus:ring-[#A10FF2]/30 transition-all duration-300 backdrop-blur-sm"
                      />
                    </motion.div>
                  )}

                  {/* Remember Me (Login Only) */}
                  {isLogin && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="remember"
                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#A10FF2] focus:ring-[#A10FF2] focus:ring-offset-0 cursor-pointer"
                      />
                      <label htmlFor="remember" className="ml-2 text-sm text-gray-300 cursor-pointer">
                        Remember me
                      </label>
                    </div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-3 px-6 mt-6 rounded-lg font-semibold text-white bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 transform"
                  >
                    {isLogin ? "Sign In" : "Create Account"}
                  </motion.button>
                </motion.form>

                {/* Footer Link */}
                <p className="text-center text-sm text-gray-400 mt-6">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-transparent bg-gradient-to-r from-[#4ECDC4] to-[#45B7D1] bg-clip-text font-semibold hover:from-[#45B7D1] hover:to-[#4ECDC4] transition-all duration-300 cursor-pointer"
                  >
                    {isLogin ? "Sign up" : "Log in"}
                  </button>
                </p>
              </div>
            </GlassmorphismCard>
          </FloatingElement>
        </FloatingElement>
      </Floating>
    </div>
  );
}