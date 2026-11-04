'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { GAMES, CATEGORIES } from '@/data/games';
import { Game } from '@/types/game';
import GameThumbnail from '../common/GameThumbnail';
import { Search, Moon, Sun, Menu, X, Play, Trophy, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Dark / light mode toggle
  useEffect(() => {
    const savedTheme = localStorage.getItem('auro_theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('auro_theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('auro_theme', 'dark');
      setIsDarkMode(true);
    }
  };

  // Live search filtering
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const filtered = GAMES.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q))
      );
      setSearchResults(filtered);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-brand-darker/90 border-b border-brand-border/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple via-brand-cyan to-white flex items-center justify-center shadow-neonCyan group-hover:scale-105 transition duration-300">
              <span className="text-brand-darker font-black text-xl font-mono">A</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-brand-cyan transition-colors">
                Auro<span className="text-brand-cyan">DXB</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-mono text-brand-purple font-bold -mt-1">
                CAR GAMES
              </span>
            </div>
          </Link>

          {/* Search Bar with Live Suggestions Dropdown */}
          <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search 10 free car games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setIsSearchOpen(true);
                }}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-brand-card/80 border border-brand-border focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan text-sm text-gray-200 placeholder-gray-500 transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </form>

            {/* Live Search Dropdown */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-brand-card border border-brand-border rounded-2xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
                <div className="p-2 divide-y divide-brand-border/40 max-h-80 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map((game) => (
                      <Link
                        key={game.slug}
                        href={`/games/${game.slug}`}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-brand-cardHover transition"
                      >
                        <div className="w-12 h-8 rounded-lg overflow-hidden bg-brand-darker flex-shrink-0">
                          <GameThumbnail slug={game.slug} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-gray-200 truncate">{game.title}</div>
                          <div className="text-xs text-brand-cyan uppercase font-mono">{game.category}</div>
                        </div>
                        <Play className="w-4 h-4 text-brand-purple flex-shrink-0" />
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-gray-400">
                      No car games found for &quot;{searchQuery}&quot;
                    </div>
                  )}
                </div>

                <div className="p-2 bg-brand-darker/60 border-t border-brand-border/40 text-center">
                  <Link
                    href={`/search?q=${encodeURIComponent(searchQuery)}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="text-xs text-brand-cyan font-bold hover:underline"
                  >
                    View all results for &quot;{searchQuery}&quot; ➔
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Category Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-xl transition ${
                pathname === '/'
                  ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/50'
                  : 'text-gray-400 hover:text-white hover:bg-brand-card'
              }`}
            >
              All Games
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/category/${cat.name.toLowerCase()}`}
                className={`px-3 py-1.5 rounded-xl transition ${
                  pathname === `/category/${cat.name.toLowerCase()}`
                    ? 'bg-brand-purple/20 text-brand-purple border border-brand-purple/50'
                    : 'text-gray-400 hover:text-white hover:bg-brand-card'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons: Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-gray-300 transition"
              title="Toggle Theme"
              aria-label="Toggle Dark and Light Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-brand-purple" />}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-gray-300"
              aria-label="Open Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-brand-border animate-fadeIn">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative mb-4">
              <input
                type="text"
                placeholder="Search car games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-sm text-gray-200"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </form>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-brand-card hover:bg-brand-cardHover font-bold text-xs uppercase text-gray-200"
              >
                All Games
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/category/${cat.name.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-brand-card hover:bg-brand-cardHover font-bold text-xs uppercase text-brand-cyan"
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-brand-card text-xs text-gray-400"
              >
                About
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-brand-card text-xs text-gray-400"
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
