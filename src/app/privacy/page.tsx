import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | AuroDXB Games',
  description: 'Privacy Policy for AuroDXB Games (aurodxb.com) and Google AdSense compliance disclosures.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 text-gray-300">
      <div className="p-8 sm:p-12 rounded-3xl bg-brand-card border border-brand-border shadow-2xl space-y-6">
        <h1 className="text-3xl sm:text-5xl font-black text-white mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs font-mono text-gray-400">
          Last Updated: November 2026 • Effective Date: January 1, 2026
        </p>

        <section className="space-y-3 pt-4 border-t border-brand-border/60">
          <h2 className="text-xl font-bold text-white">1. Introduction</h2>
          <p className="text-sm leading-relaxed text-gray-300">
            AuroDXB Games (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), operating at{' '}
            <strong className="text-brand-cyan">aurodxb.com</strong>, values your personal privacy. This Privacy Policy details how we collect, utilize, and protect your information when you visit and play games on our website.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">2. Information We Collect</h2>
          <p className="text-sm leading-relaxed text-gray-300">
            <strong>No Personal Registration Required:</strong> AuroDXB does not require users to register accounts or provide names to play games.
          </p>
          <p className="text-sm leading-relaxed text-gray-300">
            <strong>Browser LocalStorage:</strong> We store gameplay state, high scores, mute preference, and dark/light mode preference directly within your browser&apos;s local storage. This data never leaves your device and is not transmitted to our servers.
          </p>
          <p className="text-sm leading-relaxed text-gray-300">
            <strong>Log Files:</strong> Like standard websites, we collect anonymous server log information including browser type, operating system, referring pages, and timestamps for performance monitoring.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">3. Google AdSense & Third-Party Cookies</h2>
          <p className="text-sm leading-relaxed text-gray-300">
            We partner with third-party vendors, including <strong>Google AdSense</strong>, to serve advertisements on our portal:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1.5 text-gray-300">
            <li>Google uses cookies to serve ads based on a user&apos;s prior visits to this website or other websites.</li>
            <li>Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to our site and/or other sites on the Internet.</li>
            <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-brand-cyan underline">Google Ads Settings</a>.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. Children&apos;s Online Privacy Protection (COPPA)</h2>
          <p className="text-sm leading-relaxed text-gray-300">
            AuroDXB Games does not knowingly collect personally identifiable information from children under the age of 13. If you believe your child has provided personal information to us, please contact us immediately for prompt removal.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. GDPR & CCPA Rights</h2>
          <p className="text-sm leading-relaxed text-gray-300">
            Users located in the European Economic Area (EEA) and California enjoy rights to access, request deletion of, and restrict processing of any personal data. Inquiries can be forwarded to <strong className="text-brand-purple">privacy@aurodxb.com</strong>.
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
