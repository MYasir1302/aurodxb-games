import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | AuroDXB Games',
  description: 'Terms and Conditions of Use for AuroDXB Games (aurodxb.com).',
};

export default function TermsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 text-gray-300">
      <div className="p-8 sm:p-12 rounded-3xl bg-brand-card border border-brand-border shadow-2xl space-y-6">
        <h1 className="text-3xl sm:text-5xl font-black text-white mb-2">
          Terms of Service
        </h1>
        <p className="text-xs font-mono text-gray-400">
          Last Updated: November 2026 • Effective Date: January 1, 2026
        </p>

        <section className="space-y-3 pt-4 border-t border-brand-border/60">
          <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
          <p className="text-sm leading-relaxed text-gray-300">
            By accessing and playing games on <strong className="text-brand-cyan">aurodxb.com</strong> (&quot;AuroDXB Games&quot;), you acknowledge and agree to abide by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">2. Free Entertainment Use License</h2>
          <p className="text-sm leading-relaxed text-gray-300">
            All games available on AuroDXB Games are provided completely free of charge for non-commercial, personal entertainment purposes directly within compatible web browsers. You may not decompile, reverse-engineer, redistribute, or mirror any game source code without explicit written consent from AuroDXB.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">3. Intellectual Property & Car Designs</h2>
          <p className="text-sm leading-relaxed text-gray-300">
            All games, code, mechanics, procedural audio, graphics, and user interfaces on AuroDXB Games are original works of authorship owned by AuroDXB. All vehicles are fictional, stylized vector/canvas representations. <strong>No real-world car manufacturer logos, trademarks, or proprietary vehicle names are used on this portal.</strong>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. Disclaimer of Warranties</h2>
          <p className="text-sm leading-relaxed text-gray-300">
            The games on this portal are provided &quot;as is&quot; without warranties of any kind. While we strive to ensure 100% bug-free 60FPS performance across all hardware, AuroDXB does not guarantee that website functions will be completely uninterrupted or error-free.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. Governing Law</h2>
          <p className="text-sm leading-relaxed text-gray-300">
            These terms shall be governed by and interpreted in accordance with applicable international web commerce laws and the laws of Dubai, UAE.
          </p>
        </section>

        <div className="pt-8 border-t border-brand-border/60">
          <Link href="/" className="text-sm font-bold text-brand-cyan hover:underline">
            ← Return to AuroDXB Games Home
          </Link>
        </div>
      </div>
    </div>
  );
}
