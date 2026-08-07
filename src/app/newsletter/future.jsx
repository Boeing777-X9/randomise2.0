"use client";

import { useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";
const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    global: {
      headers: { Prefer: "return=minimal" },
    },
  }
);

export default function NewsletterComingSoonPage() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const isValidEmail = useCallback((value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (honeypot) {
        setStatus("success");
        setMessage("You're on the list!");
        return;
      }

      if (!isValidEmail(email)) {
        setStatus("error");
        setMessage("Please enter a valid email address.");
        return;
      }

      setStatus("loading");
      setMessage("");

      try {
        const { error } = await supabase
          .from("newsletter_subscribers")
          .insert({ email: email.trim().toLowerCase() });

        if (error) {
          if (error.code === "23505") {
            setStatus("success");
            setMessage("You're already on the list!");
          } else {
            setStatus("error");
            setMessage("Something went wrong. Please try again.");
          }
          return;
        }

        setStatus("success");
        setMessage("You're on the list!");
        setEmail("");
      } catch (err) {
        console.error("Supabase insert error:", err);
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    },
    [email, honeypot, isValidEmail]
  );

  return (
    <main className="w-full min-h-screen bg-transparent text-white font-sans relative overflow-x-hidden flex flex-col items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-10xl relative z-10 mx-auto text-center py-12 sm:py-20">
        <section className="w-full flex flex-col items-center">
          <div className="flex justify-center mb-6 w-full">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white border border-purple-500/40 bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059]"
              style={{
                boxShadow: "0 0 20px rgba(161,15,242,0.4)",
              }}
            >
  
             
            </span>
          </div>

          <h1 className="w-full text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] bg-clip-text text-transparent mb-4 leading-tight px-2">
            Stay in the Loop
          </h1>

          <p className="w-full text-gray-200 text-sm sm:text-base max-w-7xl mx-auto mb-10 leading-relaxed">
            Catch up on this month's highlights and subscribe to have every edition delivered directly to your inbox.
          </p>

          <div className="w-full max-w-4xl mx-auto rounded-2xl border border-purple-500/20 p-6 sm:p-10 shadow-xl backdrop-blur-md text-left bg-opacity-40 bg-[#0a051a]">
            <form onSubmit={handleSubmit} noValidate className="w-full">
              <label
                htmlFor="newsletter-email"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Email address
              </label>

              <div className="flex flex-col sm:flex-row gap-3 w-full items-stretch">
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-describedby="newsletter-status"
                  className="flex-1 min-w-0 w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow duration-200 bg-[#020108]/60"
                />

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="sm:w-auto px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-[#2D0FF7] via-[#A10FF2] to-[#F20059] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/30 whitespace-nowrap"
                >
                  {status === "loading" ? "Joining…" : "Notify Me"}
                </button>
              </div>

              <div className="hidden" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <p
                id="newsletter-status"
                role="status"
                aria-live="polite"
                className={`mt-4 text-sm font-medium min-h-[1.25rem] ${
                  status === "error"
                    ? "text-[#F20059]"
                    : status === "success"
                    ? "text-[#4ECDC4]"
                    : "text-transparent"
                }`}
              >
                {message || "placeholder"}
              </p>
            </form>
          </div>

          <p className="text-xs text-gray-400 mt-8 w-full">
            No spam. Unsubscribe any time.
          </p>
        </section>
      </div>

      <style jsx global>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </main>
  );
}