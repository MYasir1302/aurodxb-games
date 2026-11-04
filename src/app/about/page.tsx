import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Flag, ShieldCheck, Zap, Heart, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | AuroDXB Games',
  description:
    'Learn about AuroDXB Games (aurodxb.com) — the premier Miniclip-style portal dedicated 100% to browser car games.',
};

export default function AboutPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 text-gray-300">
      <div className="p-8 sm:p-12 rounded-3xl bg-brand-card border border-brand-border shadow-2xl mb-12">
        <span className="text-xs font-mono font-bold text-brand-cyan uppercase tracking-widest block mb-2">
          OUR MISSION
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white mb-6">
          About <span className="text-brand-cyan">AuroDXB</span> Games
        </h1>

        <p className="text-base sm:text-lg text-gray-200 leading-relaxed mb-6">
          Welcome to <strong className="text-white">AuroDXB Games</strong> (aurodxb.com), the internet’s ultimate Miniclip-inspired destination built exclusively for motorsport and car gaming fans.
        </p>

        <p className="text-sm text-gray-300 leading-relaxed mb-6">
          In an era where web games are often buried under heavy ads, clunky emulators, and 500MB downloads, AuroDXB was founded on a simple principle: <strong>pure speed and instant arcade satisfaction</strong>. Every single car game on our platform is custom-engineered using modern web technologies—HTML5 Canvas, React, and synthesized Web Audio—running at 60 frames per second directly in your browser.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
          <div className="p-6 rounded-2xl bg-brand-darker border border-brand-border">
            <Zap className="w-8 h-8 text-brand-cyan mb-3" />
            <h3 className="font-bold text-white text-base mb-2">Zero Friction</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              No account creation required, no downloads, and zero plugins. Just click and hit the throttle.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-brand-darker border border-brand-border">
            <ShieldCheck className="w-8 h-8 text-brand-purple mb-3" />
            <h3 className="font-bold text-white text-base mb-2">100% Original Code</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every vehicle, physics formula, and circuit layout is built in-house with zero trademark infringement or copyrighted assets.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-brand-darker border border-brand-border">
            <Flag className="w-8 h-8 text-yellow-400 mb-3" />
            <h3 className="font-bold text-white text-base mb-2">Cross-Platform</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Complete support for touchscreens on iPhones, iPads, Android phones, as well as desktop mechanical keyboards.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-black text-white mb-4">Our Technology</h2>
        <p className="text-sm text-gray-300 leading-relaxed mb-6">
          AuroDXB is powered by Next.js and Tailwind CSS, hosted globally on high-speed edge CDN infrastructure for sub-second load times worldwide. All vehicle sounds are procedurally generated in real time through the HTML5 Web Audio API, ensuring zero audio lag and eliminating heavy media asset downloads.
        </p>

        <div className="pt-8 border-t border-brand-border/60 flex items-center justify-between">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple text-brand-darker font-black text-sm shadow-neonCyan"
          >
            EXPLORE THE GAMES
          </Link>

          <Link href="/contact" className="text-xs text-gray-400 hover:text-white underline">
            Have feedback? Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
