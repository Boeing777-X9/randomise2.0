
import Navbar from "@/components/Navbar";
import "./globals.css";
import Footer from "@/components/Footer";
import Floating, { FloatingElement } from "@/fancy/components/image/parallax-floating";
import { Bebas_Neue, Inter } from "next/font/google";
import HeroBackground from "@/components/HeroBackground";

// Bebas Neue — condensed bold display font (used for the RANDOMIZE() heading)
const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

// Inter — clean sans-serif for body text
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
    <html lang="en">
      <body className={`relative overflow-x-hidden bg-[#05030B] ${bebasNeue.variable} ${inter.variable}`}>
        {/* Global Cinematic Background */}
        <HeroBackground isFixed={true} />

        {/* Global Parallax Container */}
        <Floating 
          className="min-h-screen" 
          sensitivity={2} 
          easingFactor={0.1}
        >
          {/* Main Content with Parallax */}
          <div className="relative z-10">
            <Navbar />
            
            <FloatingElement depth={0.5} absolute={false}>
              {children}
            </FloatingElement>
            
            <FloatingElement depth={0.2} absolute={false}>
              <Footer />
            </FloatingElement>
          </div>
        </Floating>
      </body>
    </html>
  );
}
