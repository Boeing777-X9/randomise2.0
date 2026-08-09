"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useSpring, useVelocity } from "framer-motion";

const Navbar = () => {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // Refs
    const linksRowRef = useRef(null);   // the flex row that holds all <Link> elements
    const linkRefs   = useRef({});      // href → <a> element
    const isFirstRef = useRef(true);    // skip spring on initial placement

    // Single motion value that lives for the component lifetime — no re-mounts
    const cometX  = useMotionValue(0);
    const springX = useSpring(cometX, { stiffness: 340, damping: 32, mass: 0.55 });

    // Direction flip — reads velocity off the spring, not the raw target
    const velocity      = useVelocity(springX);
    const cometScaleX   = useMotionValue(1);                                    // 1 = right, -1 = left
    const springScaleX  = useSpring(cometScaleX, { stiffness: 220, damping: 26 });

    useEffect(() => {
        // Only flip when clearly moving; ignore tiny oscillations near rest
        return velocity.on("change", (v) => {
            if (v >  10) cometScaleX.set( 1);
            else if (v < -10) cometScaleX.set(-1);
        });
    }, [velocity, cometScaleX]);

    const navLinks = [
        { href: "/",           label: "Home"       },
        { href: "/projects",   label: "Projects"   },
        { href: "/events",     label: "Events"     },
        { href: "/gallery",    label: "Gallery"    },
        { href: "/teams",      label: "Team"       },
        { href: "/newsletter", label: "Newsletter" },
        { href: "/login",      label: "Login"      },
    ];

    // ── Scroll listener ─────────────────────────────────────────
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // ── Comet position updater ───────────────────────────────────
    // Uses offsetLeft so coords are always relative to the container,
    // immune to scroll / viewport shifts.
    useEffect(() => {
        const place = () => {
            const el        = linkRefs.current[pathname];
            const container = linksRowRef.current;
            if (!el || !container) return;

            // offsetLeft is relative to offsetParent; we want it relative to linksRowRef.
            // Walk up the offsetParent chain to accumulate the correct offset.
            let offset = 0;
            let node   = el;
            while (node && node !== container) {
                offset += node.offsetLeft;
                node    = node.offsetParent;
            }
            const center = offset + el.offsetWidth / 2;

            if (isFirstRef.current) {
                // Snap to position on first render — no swooping in from 0
                cometX.jump(center);
                isFirstRef.current = false;
            } else {
                cometX.set(center);
            }
        };

        // Run once immediately, then after fonts/layout settle
        place();
        const t = setTimeout(place, 60);
        window.addEventListener("resize", place);
        return () => {
            clearTimeout(t);
            window.removeEventListener("resize", place);
        };
    }, [pathname, cometX]);

    return (
        <>
            <div className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] sm:w-[92%] max-w-7xl z-50">

                {/* Ambient glow */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-pink-500/[0.07] via-purple-500/[0.07] to-indigo-500/[0.07] blur-2xl -z-10 pointer-events-none" />

                <motion.nav
                    className={`relative w-full rounded-2xl lg:rounded-full text-white font-sans border overflow-visible transition-[background,box-shadow,border-color] duration-500 ${
                        scrolled
                            ? "bg-[#07040f]/92 backdrop-blur-2xl border-white/[0.09] shadow-[0_16px_48px_rgba(0,0,0,.55)]"
                            : "bg-[#07040f]/76 backdrop-blur-xl  border-white/[0.07] shadow-[0_8px_32px_rgba(0,0,0,.40)]"
                    }`}
                    initial={{ y: -72, opacity: 0 }}
                    animate={{ y: 0,   opacity: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Top-edge shine */}
                    <div className="pointer-events-none absolute inset-0 rounded-2xl lg:rounded-full overflow-hidden">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.035] to-transparent" />
                    </div>

                    <div className="w-full mx-auto px-3 sm:px-6">
                        <div className="flex items-center justify-between">

                            {/* ── Logo ─────────────────────────────────────── */}
                            <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.18 }}>
                                <Link href="/" className="flex items-center py-2.5 sm:py-3">
                                    <div className="flex items-center justify-center p-2 rounded-xl bg-white/[0.05] border border-white/[0.1]">
                                        <img
                                            src="/nav-logo.svg"
                                            alt="Randomize Logo"
                                            className="h-7 sm:h-8 w-auto object-contain"
                                        />
                                    </div>
                                </Link>
                            </motion.div>

                            {/* ── Desktop links ────────────────────────────── */}
                            <div
                                ref={linksRowRef}
                                className="hidden lg:flex items-center gap-0.5 relative py-2.5 sm:py-3"
                            >
                                {/* ── Comet ── lives here so x coords are local */}
                                <motion.div
                                    aria-hidden
                                    className="absolute bottom-1 left-0 pointer-events-none"
                                    style={{ x: springX, translateX: "-50%", scaleX: springScaleX }}
                                >
                                    {/* Soft glow bloom */}
                                    <div style={{
                                        position:     "absolute",
                                        bottom:        0,
                                        left:         "50%",
                                        transform:    "translateX(-50%)",
                                        width:         20,
                                        height:        20,
                                        borderRadius: "50%",
                                        background:   "radial-gradient(circle, rgba(244,114,182,0.5) 0%, transparent 70%)",
                                        filter:       "blur(4px)",
                                    }} />

                                    {/* Comet tail — points left */}
                                    <div style={{
                                        position:   "absolute",
                                        bottom:      4,
                                        right:       4,
                                        width:       44,
                                        height:      1.5,
                                        borderRadius: 999,
                                        background:  "linear-gradient(to left, rgba(249,168,212,0.85), rgba(236,72,153,0.4), transparent)",
                                    }} />

                                    {/* Star glyph */}
                                    <div style={{
                                        position:   "relative",
                                        fontSize:    10,
                                        lineHeight:  1,
                                        color:       "#fda4af",
                                        textShadow: "0 0 6px #f472b6, 0 0 14px #ec4899, 0 0 26px rgba(244,114,182,0.55)",
                                        userSelect: "none",
                                        width:       10,
                                        textAlign:  "center",
                                    }}>
                                        ✦
                                    </div>
                                </motion.div>

                                {/* Links */}
                                {navLinks.map((link, i) => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <motion.div
                                            key={link.href}
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y:  0 }}
                                            transition={{ delay: i * 0.04, duration: 0.3 }}
                                        >
                                            <Link
                                                href={link.href}
                                                ref={(el) => { if (el) linkRefs.current[link.href] = el; }}
                                                className={`relative px-4 py-1.5 rounded-full text-base font-medium tracking-wide flex items-center justify-center transition-colors duration-200 group ${
                                                    isActive
                                                        ? "text-white"
                                                        : "text-white/50 hover:text-white/85"
                                                }`}
                                            >
                                                {/* Hover bg */}
                                                <span className="absolute inset-0 rounded-full bg-white/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                                {/* Active bg */}
                                                {isActive && (
                                                    <span className="absolute inset-0 rounded-full bg-white/[0.07]" />
                                                )}
                                                <span className="relative z-10">{link.label}</span>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* ── CTA button ───────────────────────────────── */}
                            <div className="hidden lg:flex items-center">
                                <motion.button
                                    onClick={() => { window.location.href = "/membership"; }}
                                    className="relative px-4 py-2 text-sm font-semibold text-sky-100 rounded-lg overflow-hidden border border-sky-200/70"
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                    style={{
                                        background: "transparent",
                                        boxShadow: "0 0 12px rgba(186,230,253,0.2)",
                                        transition: "box-shadow 0.2s",
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 22px rgba(186,230,253,0.45)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 12px rgba(186,230,253,0.2)"; }}
                                >
                                    <span className="relative z-10">Become a Member</span>
                                </motion.button>
                            </div>

                            {/* ── Mobile toggle ────────────────────────────── */}
                            <motion.button
                                type="button"
                                className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-white bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] transition-colors"
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                whileTap={{ scale: 0.9 }}
                            >
                                <div className="relative h-5 w-5">
                                    <motion.span
                                        className="block absolute h-0.5 w-5 bg-current rounded-full"
                                        animate={showMobileMenu ? { rotate: 45, y: 0 } : { rotate: 0, y: -5 }}
                                        transition={{ duration: 0.22 }}
                                    />
                                    <motion.span
                                        className="block absolute h-0.5 w-5 bg-current rounded-full"
                                        animate={showMobileMenu ? { opacity: 0 } : { opacity: 1 }}
                                        transition={{ duration: 0.18 }}
                                    />
                                    <motion.span
                                        className="block absolute h-0.5 w-5 bg-current rounded-full"
                                        animate={showMobileMenu ? { rotate: -45, y: 0 } : { rotate: 0, y: 5 }}
                                        transition={{ duration: 0.22 }}
                                    />
                                </div>
                            </motion.button>

                        </div>
                    </div>

                    {/* ── Mobile drawer ────────────────────────────────────── */}
                    <AnimatePresence>
                        {showMobileMenu && (
                            <motion.div
                                className="absolute left-0 right-0 top-full mt-2 lg:hidden rounded-2xl bg-[#07040f]/95 backdrop-blur-2xl border border-white/[0.08] shadow-[0_24px_60px_rgba(0,0,0,.70)] overflow-hidden"
                                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                animate={{ opacity: 1, y:  0, scale: 1   }}
                                exit   ={{ opacity: 0, y: -8, scale: 0.97 }}
                                transition={{ duration: 0.22, ease: "easeOut" }}
                            >
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-400/40 to-transparent" />
                                <div className="px-3 py-3 space-y-0.5">
                                    {navLinks.map((link) => {
                                        const isActive = pathname === link.href;
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setShowMobileMenu(false)}
                                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                                                    isActive
                                                        ? "text-white bg-white/[0.09] border-pink-500/20"
                                                        : "text-white/55 hover:text-white hover:bg-white/[0.05] border-transparent"
                                                }`}
                                            >
                                                {isActive && (
                                                    <span className="text-pink-400 leading-none" style={{ fontSize: 8 }}>✦</span>
                                                )}
                                                {link.label}
                                            </Link>
                                        );
                                    })}

                                    <div className="border-t border-white/[0.06] mt-2 pt-2">
                                        <motion.button
                                            onClick={() => { window.location.href = "/membership"; setShowMobileMenu(false); }}
                                            className="w-full px-4 py-3 text-sm font-semibold text-sky-100 rounded-lg border border-sky-200/70"
                                            style={{
                                                background: "transparent",
                                                boxShadow: "0 0 12px rgba(186,230,253,0.2)",
                                            }}
                                            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(186,230,253,0.45)" }}
                                            whileTap  ={{ scale: 0.97 }}
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
