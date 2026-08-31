"use client";
import { useState, useCallback } from "react";
import Image from "next/image";
import { Mail, ArrowUpRight, BookOpen } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
const NEWSLETTER_EDITIONS = [
  {
    id: "august-2026",
    title: "August Edition",
    month: "August 2026",
    badge: "Latest Release",
    posterUrl: "https://res.cloudinary.com/vm6fmwen/image/upload/v1788198433/vantage2_post_ecafim.png", 
    readUrl: "https://drive.google.com/file/d/1o3LJG4okRZk-hsoUunCYbwA3cRxm97DW/view?usp=sharing", 
    isFeatured: true,
  },
  {
    id: "july-2026",
    title: "July Edition",
    month: "July 2026",
    badge: "Previous Edition",
    posterUrl: "/newsletter_july.png",
    readUrl: "https://drive.google.com/file/d/10fPPPYhX0WDnKFBZ5-tZc0tYh5XP0u4l/view?usp=sharing",
    isFeatured: false,
  },
];
export default function NewsletterComingSoonPage() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const isValidEmail = useCallback((value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // 1. Honeypot check[cite: 3]
      if (honeypot) { 
        setStatus("success"); 
        setMessage("You're on the list!"); 
        return; 
      }

      // 2. Email syntax check[cite: 3]
      if (!isValidEmail(email)) { 
        setStatus("error"); 
        setMessage("Please enter a valid email address."); 
        return; 
      }

      // 3. Bot Turnstile verification check[cite: 3]
      if (!turnstileToken) {
        setStatus("error");
        setMessage("Bot check pending. Please wait a moment and try again.");
        return;
      }

      setStatus("loading");
      setMessage("");

      try {
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            token: turnstileToken
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setMessage(data.error || "Something went wrong. Please try again.");
          return;
        }

        setStatus("success");
        setMessage(data.message || "You're on the list!");
        setEmail("");
      } catch (err) {
        console.error("Newsletter submission error:", err);
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    },
    [email, honeypot, isValidEmail, turnstileToken]
  );

  const featuredEdition = NEWSLETTER_EDITIONS.find((ed) => ed.isFeatured) || NEWSLETTER_EDITIONS[0];

  return (
    <div style={{ minHeight: "100vh", color: "white", overflowX: "hidden" }}>
      <div style={{ paddingTop: "8rem", paddingBottom: "6rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <div style={{ maxWidth: "64rem", marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-slate-300 tracking-tight mb-4 leading-tight drop-shadow-[0_0_12px_rgba(56,189,248,0.15)]">
            Stay in the Loop
          </h1>

          {/* Subheading */}
          <p style={{ color: "#d1d5db", fontSize: "1rem", lineHeight: "1.75", marginBottom: "2.5rem" }}>
            Catch up on our monthly highlights and subscribe to have every edition delivered directly to your inbox.
          </p>

          {/* Email Subscription Form Card */}
          <div style={{
            width: "100%",
            maxWidth: "36rem",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: "1rem",
            border: "1px solid rgba(168,85,247,0.25)",
            padding: "0.375rem",
            background: "rgba(10,5,26,0.75)",
            backdropFilter: "blur(12px)",
            position: "relative",
          }}>
            {/* Ambient Glow */}
            <div style={{
              position: "absolute",
              inset: "-4px",
              borderRadius: "1rem",
              background: "linear-gradient(to right, rgba(45,15,247,0.2), rgba(161,15,242,0.2), rgba(242,0,89,0.2))",
              filter: "blur(16px)",
              opacity: 0.45,
              pointerEvents: "none",
              zIndex: -1,
            }} />

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "stretch" }}>
                <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
                  <Mail style={{ position: "absolute", left: "1rem", width: "1.25rem", height: "1.25rem", color: "#9ca3af", pointerEvents: "none" }} />
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-describedby="newsletter-status"
                    style={{
                      width: "100%",
                      paddingLeft: "3rem",
                      paddingRight: "1rem",
                      paddingTop: "0.75rem",
                      paddingBottom: "0.75rem",
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: "white",
                      fontSize: "0.95rem",
                    }}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={status === "loading"}
                  style={{
                    padding: "0.75rem 1.5rem",
                    borderRadius: "0.5rem",
                    fontWeight: "700",
                    color: "#e0f2fe",
                    background: "transparent",
                    border: "1.5px solid rgba(186,230,253,0.65)",
                    cursor: status === "loading" ? "not-allowed" : "pointer",
                    opacity: status === "loading" ? 0.6 : 1,
                    whiteSpace: "nowrap",
                    fontSize: "0.95rem",
                    transition: "transform 0.15s, box-shadow 0.15s",
                    boxShadow: "0 0 12px rgba(186,230,253,0.2)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(186,230,253,0.45)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 0 12px rgba(186,230,253,0.2)"; }}
                >
                  {status === "loading" ? "Subscribing…" : "Subscribe"}
                </button>
              </div>

              {/* Turnstile Bot Protection */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: "0.75rem" }}>
                <Turnstile
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                  onSuccess={(token) => setTurnstileToken(token)}
                  options={{ theme: "dark" }}
                />
              </div>

              {/* Honeypot */}
              <div className="hidden" aria-hidden="true" style={{ display: "none" }}>
                <label htmlFor="company">Company</label>
                <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
              </div>
            </form>
          </div>

          {/* Status Message */}
          <p
            id="newsletter-status"
            role="status"
            aria-live="polite"
            style={{
              marginTop: "0.75rem",
              fontSize: "0.875rem",
              fontWeight: "500",
              minHeight: "1.5rem",
              color: status === "error" ? "#F20059" : status === "success" ? "#4ECDC4" : "transparent",
            }}
          >
            {message || "placeholder"}
          </p>

          <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.5rem" }}>
            No spam. Unsubscribe any time.
          </p>

          {/* 1. HERO FEATURED EDITION (AUGUST) */}
          <div style={{ marginTop: "4.5rem" }}>
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-slate-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.15)]">
              Featured Edition
            </h2>

            <a
              href={featuredEdition.readUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
              style={{
                display: "inline-block",
                width: "100%",
                maxWidth: "400px",
                borderRadius: "1.5rem",
                overflow: "hidden",
                boxShadow: "0 25px 50px rgba(0,0,0,0.7)",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "#000",
                position: "relative",
                transition: "transform 0.4s, box-shadow 0.4s, border-color 0.4s",
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.transform = "scale(1.03)"; 
                e.currentTarget.style.boxShadow = "0 30px 70px rgba(168,85,247,0.25)"; 
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.5)";
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.transform = "scale(1)"; 
                e.currentTarget.style.boxShadow = "0 25px 50px rgba(0,0,0,0.7)"; 
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              }}
            >
              <div style={{ position: "relative", width: "100%", aspectRatio: "1730/2160", overflow: "hidden" }}>
                <Image
                  src={featuredEdition.posterUrl}
                  alt={`Preview of the ${featuredEdition.title}`}
                  fill
                  sizes="400px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </div>

              {/* Gradient Overlay */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 45%, transparent 100%)",
                pointerEvents: "none",
                zIndex: 10,
              }} />

              {/* Bottom Card Content */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                zIndex: 20,
                pointerEvents: "none",
              }}>
                <div style={{ textAlign: "left" }}>
                  <span style={{ 
                    display: "inline-block",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "0.375rem",
                    background: "rgba(192,132,252,0.15)",
                    border: "1px solid rgba(192,132,252,0.35)",
                    fontSize: "0.65rem", 
                    color: "#c084fc", 
                    textTransform: "uppercase", 
                    letterSpacing: "0.1em", 
                    fontWeight: "700", 
                    marginBottom: "0.5rem" 
                  }}>
                    {featuredEdition.badge}
                  </span>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "white" }}>{featuredEdition.title}</h3>
                </div>
                
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.75rem",
                  background: "white",
                  color: "black",
                  fontWeight: "700",
                  fontSize: "0.8rem",
                  flexShrink: 0,
                }}>
                  Read <ArrowUpRight style={{ width: "0.95rem", height: "0.95rem" }} />
                </span>
              </div>
            </a>
          </div>

          {/* 2. ALL RELEASES / ARCHIVE (AUGUST & JULY) */}
          <div style={{ marginTop: "6rem", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "4rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "2rem" }}>
              <BookOpen style={{ width: "1.25rem", height: "1.25rem", color: "#38bdf8" }} />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.15)]">
                All Editions
              </h2>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2rem",
              maxWidth: "52rem",
              marginLeft: "auto",
              marginRight: "auto",
            }}>
              {NEWSLETTER_EDITIONS.map((edition) => (
                <a
                  key={edition.id}
                  href={edition.readUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "1.25rem",
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(10,5,26,0.6)",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.5)",
                    transition: "transform 0.3s, border-color 0.3s, box-shadow 0.3s",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.transform = "translateY(-4px)"; 
                    e.currentTarget.style.borderColor = "rgba(56,189,248,0.4)";
                    e.currentTarget.style.boxShadow = "0 20px 45px rgba(56,189,248,0.15)";
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.transform = "translateY(0)"; 
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.5)";
                  }}
                >
                  <div style={{ position: "relative", width: "100%", aspectRatio: "1730/2160", overflow: "hidden", background: "#000" }}>
                    <Image
                      src={edition.posterUrl}
                      alt={edition.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 380px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div style={{ padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: "0.65rem", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "700" }}>
                        {edition.month}
                      </span>
                      <h4 style={{ fontSize: "1.05rem", fontWeight: "700", color: "white", marginTop: "0.15rem" }}>
                        {edition.title}
                      </h4>
                    </div>

                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      padding: "0.35rem 0.75rem",
                      borderRadius: "0.625rem",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "white",
                      fontWeight: "600",
                      fontSize: "0.75rem",
                    }}>
                      View <ArrowUpRight style={{ width: "0.8rem", height: "0.8rem" }} />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}