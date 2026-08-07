"use client";
import { useState, useCallback } from "react";
import Image from "next/image";
import { Mail, ArrowUpRight } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

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

      // 1. Honeypot check
      if (honeypot) { 
        setStatus("success"); 
        setMessage("You're on the list!"); 
        return; 
      }

      // 2. Email syntax check
      if (!isValidEmail(email)) { 
        setStatus("error"); 
        setMessage("Please enter a valid email address."); 
        return; 
      }

      // 3. Bot Turnstile verification check
      if (!turnstileToken) {
        setStatus("error");
        setMessage("Bot check pending. Please wait a moment and try again.");
        return;
      }

      setStatus("loading");
      setMessage("");

      try {
        // Post request to Next.js API route instead of direct Supabase DB call
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

  const googleDriveLink = "https://drive.google.com/file/d/10fPPPYhX0WDnKFBZ5-tZc0tYh5XP0u4l/view?usp=sharing";

  return (
    <div style={{ minHeight: "100vh", color: "white", overflowX: "hidden" }}>
      <div style={{ paddingTop: "8rem", paddingBottom: "5rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <div style={{ maxWidth: "56rem", marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] bg-clip-text text-transparent mb-4 leading-tight">
            Stay in the Loop
          </h1>

          {/* Subheading */}
          <p style={{ color: "#d1d5db", fontSize: "1rem", lineHeight: "1.75", marginBottom: "2.5rem" }}>
            Catch up on this month&apos;s highlights and subscribe to have every edition delivered directly to your inbox.
          </p>

          {/* Email form card */}
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
            {/* Ambient glow */}
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
                {/* Input wrapper */}
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
                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  style={{
                    padding: "0.75rem 1.5rem",
                    borderRadius: "0.75rem",
                    fontWeight: "700",
                    color: "white",
                    background: "linear-gradient(to right, #2D0FF7, #A10FF2, #F20059)",
                    border: "none",
                    cursor: status === "loading" ? "not-allowed" : "pointer",
                    opacity: status === "loading" ? 0.6 : 1,
                    whiteSpace: "nowrap",
                    fontSize: "0.95rem",
                    transition: "transform 0.15s, box-shadow 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                >
                  {status === "loading" ? "Subscribing…" : "Subscribe"}
                </button>
              </div>

              {/* Cloudflare Turnstile Challenge */}
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

          {/* Status message */}
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

          {/* No spam note */}
          <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.5rem" }}>
            No spam. Unsubscribe any time.
          </p>

          {/* Featured Edition */}
          <div style={{ marginTop: "5rem" }}>
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Featured Edition
            </h2>

            <a
              href={googleDriveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
              style={{
                display: "inline-block",
                width: "100%",
                maxWidth: "380px",
                borderRadius: "1.5rem",
                overflow: "hidden",
                boxShadow: "0 25px 50px rgba(0,0,0,0.7)",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "#000",
                position: "relative",
                transition: "transform 0.4s, box-shadow 0.4s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 30px 70px rgba(0,0,0,0.85)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 25px 50px rgba(0,0,0,0.7)"; }}
            >
              <div style={{ position: "relative", width: "100%", aspectRatio: "1730/2160", overflow: "hidden" }}>
                <Image
                  src="/newsletter_july.png"
                  alt="Preview of the July newsletter edition"
                  fill
                  sizes="380px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </div>

              {/* Bottom gradient overlay */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 50%, transparent 100%)",
                pointerEvents: "none",
                zIndex: 10,
              }} />

              {/* Card bottom info */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                zIndex: 20,
                pointerEvents: "none",
              }}>
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontSize: "0.625rem", color: "#c084fc", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "700", marginBottom: "0.25rem" }}>Latest Release</p>
                  <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "white" }}>July Edition</h3>
                </div>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  padding: "0.375rem 0.75rem",
                  borderRadius: "0.75rem",
                  background: "white",
                  color: "black",
                  fontWeight: "700",
                  fontSize: "0.75rem",
                  flexShrink: 0,
                }}>
                  Read <ArrowUpRight style={{ width: "0.875rem", height: "0.875rem" }} />
                </span>
              </div>
            </a>

            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "1rem" }}>
              Click the card to read the full newsletter
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}