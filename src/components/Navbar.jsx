"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const router = useRouter();
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const scrollHandler = () => {
            setScrolled(window.scrollY > 20);
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
        { href: "/newsletter", label: "Newsletter" },
        { href: "/login", label: "Login" }
    ];

    

    const handleBecomeMember = () => {
        window.location.href = "/membership";
    };

    return (
        <>
            {/* WRAPPER CONTAINER TO ALLOW RELATIVE GLOW POSITIONING */}
            <div className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] sm:w-[92%] max-w-7xl z-50">

                {/* TOUCH 10: AURORA GLOW BEHIND THE NAVBAR */}
                <div className="absolute -inset-1 rounded-xl lg:rounded-full bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-violet-500/10 blur-xl -z-10 pointer-events-none" />

                <motion.nav
                    className={`relative w-full rounded-xl lg:rounded-full overflow-visible transition-all duration-500 border text-white font-sans ${
                        scrolled
                            ? 'bg-[#080513] lg:bg-white/[0.08] backdrop-blur-xl lg:backdrop-blur-3xl border-white/10 shadow-[0_12px_40px_rgba(0,0,0,.45)] py-2.5 sm:py-3'
                            : 'bg-[#080513] lg:bg-white/[0.04] backdrop-blur-xl lg:backdrop-blur-2xl border-white/10 lg:border-white/8 shadow-[0_8px_30px_rgba(0,0,0,.35)] lg:shadow-[0_8px_30px_rgba(0,0,0,.25)] py-3 sm:py-4'
                    }`}
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {/* TOUCH 3: GLASS REFLECTION SHINE OVERLAY */}
                    <div className="pointer-events-none absolute inset-0 rounded-xl lg:rounded-full overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.12] via-white/[0.02] to-transparent" />
                    </div>

                    {/* TOUCH 4: SUBTLE AURORA PROJECTOR INSIDE NAV */}
                    <motion.div
                        animate={{ x: ["-30%", "40%", "-30%"] }}
                        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                        className="hidden lg:block absolute top-0 left-0 w-64 h-full bg-gradient-to-r from-cyan-400/5 via-violet-500/8 to-transparent blur-3xl pointer-events-none"
                    />

                    <div className="w-full mx-auto px-3 sm:px-8">
                        <div className="flex items-center justify-between relative z-10">

                                                {/* TOUCH 6: LOGO WITH ELEVATED HOVER & GLOW */}
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="flex items-center filter drop-shadow-[0_0_18px_rgba(125,211,252,.3)]"
                                                >
                                                    <Link href="/" className="flex items-center group">
                                                        
                                                        <div className="flex items-center justify-center p-2 rounded-lg lg:rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-cyan-500/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                                                            <img
                                                                src="/nav-logo.svg" 
                                                                alt="Randomize Logo"
                                                                className="h-7 sm:h-8 w-auto object-contain"
                                                            />
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                                                            {/* DESKTOP NAVIGATION LINKS */}
                            <div className="hidden lg:flex items-center space-x-2">
                                {navLinks.map((link, index) => {
                                    const isActive = pathname === link.href;

                                    return (
                                        <motion.div
                                            key={link.href}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05, duration: 0.4 }}
                                        >
                                            <Link
                                                href={link.href}
                                                className="relative px-5 py-2 rounded-full transition-all duration-300 hover:text-white text-gray-200 text-sm font-medium tracking-wide flex items-center justify-center group"
                                            >
                                                <span className="relative z-10">{link.label}</span>

                                                {/* TOUCH 5: FLUID ACTIVE TAB LAYOUT CAP */}
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="nav-active"
                                                        className="absolute inset-0 rounded-full bg-white/[0.05]"
                                                    />
                                                )}

                                                {/* GRADIENT HOVER FILL - matches Newsletter button */}
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-[#2D0FF7]/20 via-[#A10FF2]/20 to-[#F20059]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                />

                                                {/* TOUCH 8: PREMIUM HOVER GRADIENT UNDERLINE - matches Newsletter button */}
                                                <motion.div
                                                    className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] group-hover:w-[calc(100%-2rem)] group-hover:left-4 transition-all duration-300"
                                                />
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Two Buttons */}
                            <div className="hidden lg:flex items-center gap-2 -translate-x-2">
                                

                                {/* Become a Member Button - Highlighted */}
                                <motion.button
                                    onClick={handleBecomeMember}
                                    className="relative px-3 py-2 text-white font-medium text-sm bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Become a Member
                                </motion.button>
                            </div>

                            {/* MOBILE MENU INTERACTIVE TOGGLE */}
                            <motion.button
                                type="button"
                                className="lg:hidden relative w-11 h-11 rounded-lg flex items-center justify-center text-white bg-white/[0.04] border border-white/10 hover:text-white focus:outline-none"
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                whileTap={{
                                    scale: 0.95,
                                    background: "linear-gradient(to right, #2D0FF7, #A10FF2, #F20059)"
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="relative h-6 w-6">
                                    <motion.span
                                        className="block absolute h-0.5 w-6 bg-current transform transition duration-300"
                                        animate={showMobileMenu ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
                                    />
                                    <motion.span
                                        className="block absolute h-0.5 w-6 bg-current transform transition duration-300"
                                        animate={showMobileMenu ? { opacity: 0 } : { opacity: 1 }}
                                    />
                                    <motion.span
                                        className="block absolute h-0.5 w-6 bg-current transform transition duration-300"
                                        animate={showMobileMenu ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
                                    />
                                </div>
                            </motion.button>
                        </div>
                    </div>

                    {/* TOUCH 9: UPGRADED MOBILE GLASS OVERLAY DRAWER */}
                    <AnimatePresence>
                        {showMobileMenu && (
                            <motion.div
                                className="absolute left-0 right-0 top-full mt-2 lg:hidden isolate rounded-xl bg-[#070411] border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,.72)] overflow-hidden"
                                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
                                <div className="max-h-[calc(100vh-7rem)] overflow-y-auto px-3 py-3 space-y-1 bg-[#070411]">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`block px-4 py-2.5 text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-[#2D0FF7]/20 hover:via-[#A10FF2]/20 hover:to-[#F20059]/20 rounded-lg transition-all duration-300 text-sm font-medium border ${
                                                pathname === link.href
                                                    ? 'border-[#A10FF2]/40 bg-white/[0.08] text-white'
                                                    : 'border-transparent hover:border-[#A10FF2]/20'
                                            }`}
                                            onClick={() => setShowMobileMenu(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}

                                    {/* Mobile Buttons */}
                                    <div className="border-t border-[#A10FF2]/20 mt-3 pt-3 space-y-2">
                                        
                                        <motion.button
                                            onClick={() => {
                                                handleBecomeMember();
                                                setShowMobileMenu(false);
                                            }}
                                            className="w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Become a Member
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.nav>
            </div>
        </>
    );
};

export default Navbar;
