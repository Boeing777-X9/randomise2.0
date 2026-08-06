import Navbar from "@/components/Navbar";
import "./globals.css";
import Footer from "@/components/Footer";
import Floating, { FloatingElement } from "@/fancy/components/image/parallax-floating";
import { Bebas_Neue, Inter } from "next/font/google";
import HeroBackground from "@/components/HeroBackground";

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: "Randomize",
  description: "Official website of Randomize MUJ, the official coding club of Manipal University Jaipur",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`relative overflow-x-hidden bg-[#05030B] ${bebasNeue.variable} ${inter.variable}`}>
        <HeroBackground isFixed={true} />

        <Floating 
          className="min-h-screen" 
          sensitivity={2} 
          easingFactor={0.1}
        >
          <div aria-hidden="true">
            <FloatingElement depth={0.5} className="fixed top-10 left-10 pointer-events-none z-0">
              <div className="w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
            </FloatingElement>

            <FloatingElement depth={1} className="fixed top-1/4 right-20 pointer-events-none z-0">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-lg rotate-45 blur-lg animate-pulse animation-delay-300" />
            </FloatingElement>

            <FloatingElement depth={0.8} className="fixed bottom-1/3 left-1/4 pointer-events-none z-0">
              <div className="w-40 h-40 bg-gradient-to-br from-emerald-400/15 to-teal-500/15 rounded-full blur-2xl animate-pulse animation-delay-600" />
            </FloatingElement>

            <FloatingElement depth={1.5} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/25 to-orange-500/25 rounded-full blur-md animate-pulse animation-delay-900" />
            </FloatingElement>

            <FloatingElement depth={1.2} className="fixed bottom-20 right-1/3 pointer-events-none z-0">
              <div className="w-28 h-28 bg-gradient-to-br from-rose-400/20 to-red-500/20 rounded-lg rotate-12 blur-lg animate-pulse animation-delay-1200" />
            </FloatingElement>

            <FloatingElement depth={0.6} className="fixed top-3/4 left-1/6 pointer-events-none z-0">
              <div className="w-36 h-36 bg-gradient-to-br from-violet-400/15 to-indigo-500/15 rounded-full blur-xl animate-pulse animation-delay-1500" />
            </FloatingElement>

            <FloatingElement depth={2} className="fixed top-16 right-1/4 pointer-events-none z-0">
              <div className="w-6 h-6 border-2 border-cyan-400/30 rounded-full animate-pulse" />
            </FloatingElement>

            <FloatingElement depth={1.8} className="fixed bottom-1/4 left-10 pointer-events-none z-0">
              <div className="w-4 h-4 bg-purple-400/40 rounded-full animate-twinkle" />
            </FloatingElement>

            <FloatingElement depth={2.2} className="fixed top-1/3 right-10 pointer-events-none z-0">
              <div className="w-3 h-3 bg-pink-400/50 rounded-full animate-twinkle animation-delay-700" />
            </FloatingElement>

            <FloatingElement depth={1.7} className="fixed bottom-1/2 right-1/2 pointer-events-none z-0">
              <div className="w-5 h-5 border border-emerald-400/40 rotate-45 animate-pulse animation-delay-400" />
            </FloatingElement>

            <FloatingElement depth={3.5} className="fixed top-1/6 left-3/4 pointer-events-none z-0">
              <div className="w-2 h-2 bg-cyan-300/60 rounded-full animate-twinkle" />
            </FloatingElement>

            <FloatingElement depth={2.8} className="fixed bottom-1/6 left-1/2 pointer-events-none z-0">
              <div className="w-1 h-1 bg-yellow-400/70 rounded-full animate-twinkle animation-delay-800" />
            </FloatingElement>

            <FloatingElement depth={4} className="fixed top-2/3 right-1/6 pointer-events-none z-0">
              <div className="w-1.5 h-1.5 bg-rose-400/60 rounded-full animate-twinkle animation-delay-1100" />
            </FloatingElement>
          </div>

          <div className="relative z-10 w-full">
            <Navbar />
            <main className="w-full">{children}</main>
            <Footer />
          </div>
        </Floating>
      </body>
    </html>
  );
}