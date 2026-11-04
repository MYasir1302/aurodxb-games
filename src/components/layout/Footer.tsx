import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/data/games';
import { Flag, Shield, FileText, Mail, Info, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-brand-darker border-t border-brand-border/80 text-gray-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-cyan flex items-center justify-center shadow-neonCyan">
                <span className="text-brand-darker font-black text-lg font-mono">A</span>
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Auro<span className="text-brand-cyan">DXB</span>
              </span>
            </Link>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm mb-6">
              AuroDXB Games (aurodxb.com) is the premier Miniclip-style online gaming portal dedicated exclusively to high-octane car games. Play 10 original racing, drift, parking, stunt, and automotive puzzle games instantly in your browser with zero installs or downloads.
            </p>

            <div className="flex items-center gap-3">
              {['Twitter', 'Discord', 'YouTube', 'GitHub'].map((social) => (
                <span
                  key={social}
                  className="w-9 h-9 rounded-xl bg-brand-card hover:bg-brand-border flex items-center justify-center text-xs text-gray-300 transition cursor-pointer"
                  title={social}
                >
                  {social[0]}
                </span>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Car Categories
            </h3>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={`/category/${cat.name.toLowerCase()}`}
                    className="hover:text-brand-cyan transition-colors"
                  >
                    {cat.name} Games
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Portal Links
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-brand-cyan transition-colors">
                  All 10 Games
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-cyan transition-colors">
                  About AuroDXB
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-cyan transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-brand-cyan transition-colors">
                  Sitemap XML
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / AdSense */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white mb-4">
              Legal & Privacy
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-brand-purple transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-purple transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <span className="text-gray-500 text-[11px] block mt-4 leading-normal">
                  All vehicle designs and assets are original canvas creations. No copyrighted car brands or logos are utilized.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} AuroDXB Games (aurodxb.com). All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with Next.js & Tailwind CSS for extreme speed
          </p>
        </div>
      </div>
    </footer>
  );
}
