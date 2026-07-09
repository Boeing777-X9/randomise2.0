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
  <div className="relative isolate overflow-hidden bg-gradient-to-br from-[#0d0618] via-[#1a0b3d] to-[#000000] min-h-lvh">
      <Floating className="w-full h-full" sensitivity={3} easingFactor={0.15}>
        {/* Background Pattern with Parallax */}
        <FloatingElement depth={0.5} className="absolute inset-0 -z-10 h-full w-full">
          <svg
            className="h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
                width={200}
                height={200}
                x="50%"
                y={-1}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-800/20">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              width="100%"
              height="100%"
              strokeWidth={0}
              fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)"
            />
          </svg>
        </FloatingElement>

        {/* Background Gradient Blob with Parallax */}
        <FloatingElement 
          depth={0.8} 
          className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
        >
          <div
            className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] opacity-25"
            style={{
              clipPath:
                "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
            }}
          />
        </FloatingElement>

        {/* Main Content Container with Parallax */}
        <FloatingElement depth={1.2} className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 pb-16 sm:pb-24 flex items-center place-content-center min-h-lvh w-full lg:flex-row flex-col-reverse lg:px-8 lg:py-8" absolute={false}>
          <FloatingElement depth={1.5} className="mx-auto max-w-7xl px-2 sm:px-4 pb-2 md:pb-4 flex-row lg:px-8 lg:pt-10 lg:mt-0 pt-10 sm:pt-16" absolute={false}>
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
                      placeholder="you@example.com"
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