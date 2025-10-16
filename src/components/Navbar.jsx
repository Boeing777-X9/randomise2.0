"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const scrollHandler = () => {
            setScrolled(window.pageYOffset > 20);
        };

        window.addEventListener("scroll", scrollHandler);
        scrollHandler();

        return () => {
            window.removeEventListener("scroll", scrollHandler);
        };
    }, []);

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/projects", label: "Projects" },
        { href: "/events", label: "Events" },
        { href: "/gallery", label: "Gallery" },
        { href: "/teams", label: "Team" },
    ];

    return (
        <>
            <motion.nav 
                className={`fixed top-0 left-0 right-0 z-50 text-white font-sans transition-all duration-300 ${
                    scrolled 
                        ? 'bg-gradient-to-r from-[#020108]/95 via-[#0a051a]/95 to-[#020108]/95 backdrop-blur-xl border-b border-[#A10FF2]/30 py-3 shadow-lg shadow-purple-500/10' 
                        : 'bg-gradient-to-r from-[#020108]/80 via-[#0a051a]/80 to-[#020108]/80 backdrop-blur-md border-b border-[#A10FF2]/10 py-5'
                }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo Section */}
                        <motion.div 
                            className="flex items-center"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Link href="/" className="flex items-center group">
                                <div className="relative h-10 w-34 mr-3 transition-transform duration-300 group-hover:rotate-12">
                                    <Image
                                        src="/nav_logo.avif"
                                        alt="Randomize"
                                        fill
                                        className="object-contain"
                                        sizes="48px"
                                        priority
                                    />
                                </div>
                                <motion.span 
                                    className="text-xl font-bold bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#45B7D1] bg-clip-text text-transparent hidden sm:block"
                                    whileHover={{ 
                                        backgroundImage: 'linear-gradient(to right, #4ECDC4, #45B7D1, #96CEB4)' 
                                    }}
                                >
                                    
                                </motion.span>
                            </Link>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-1">
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                >
                                    <Link
                                        href={link.href}
                                        className="relative px-4 py-2 text-gray-200 hover:text-white transition-all duration-300 group"
                                    >
                                        <span className="relative z-10 font-medium">
                                            {link.label}
                                        </span>
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-[#2D0FF7]/20 via-[#A10FF2]/20 to-[#F20059]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            whileHover={{ scale: 1.05 }}
                                        />
                                        <motion.div
                                            className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] group-hover:w-full group-hover:left-0 transition-all duration-300"
                                        />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            type="button"
                            className="lg:hidden relative w-10 h-10 flex items-center justify-center text-white hover:text-gray-300 focus:outline-none"
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                className="relative"
                                animate={showMobileMenu ? "open" : "closed"}
                            >
                                <motion.span
                                    className="block absolute h-0.5 w-6 bg-current transform transition duration-300"
                                    variants={{
                                        closed: { rotate: 0, y: -6 },
                                        open: { rotate: 45, y: 0 }
                                    }}
                                />
                                <motion.span
                                    className="block absolute h-0.5 w-6 bg-current transform transition duration-300"
                                    variants={{
                                        closed: { opacity: 1 },
                                        open: { opacity: 0 }
                                    }}
                                />
                                <motion.span
                                    className="block absolute h-0.5 w-6 bg-current transform transition duration-300"
                                    variants={{
                                        closed: { rotate: 0, y: 6 },
                                        open: { rotate: -45, y: 0 }
                                    }}
                                />
                            </motion.div>
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {showMobileMenu && (
                        <motion.div
                            className="lg:hidden bg-gradient-to-b from-[#020108]/95 to-[#0a051a]/95 backdrop-blur-xl border-t border-[#A10FF2]/20"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <div className="px-4 py-6 space-y-2">
                                {navLinks.map((link, index) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.3 }}
                                    >
                                        <Link
                                            href={link.href}
                                            className="block px-4 py-3 text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-[#2D0FF7]/10 hover:to-[#A10FF2]/10 rounded-lg transition-all duration-300 border border-transparent hover:border-[#A10FF2]/20"
                                            onClick={() => setShowMobileMenu(false)}
                                        >
                                            <span className="font-medium">{link.label}</span>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </>
    );
};

export default Navbar;