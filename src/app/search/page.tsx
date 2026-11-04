'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { GAMES, CATEGORIES } from '@/data/games';
import GameCard from '@/components/common/GameCard';
import { Search as SearchIcon, Filter, X } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (searchParams.get('q')) {
      setQuery(searchParams.get('q') || '');
    }
  }, [searchParams]);

  const filteredGames = useMemo(() => {
    return GAMES.filter((game) => {
      const q = query.toLowerCase().trim();
      const matchesQuery =
        !q ||
        game.title.toLowerCase().includes(q) ||
        game.description.toLowerCase().includes(q) ||
        game.category.toLowerCase().includes(q) ||
        game.tags.some((t) => t.toLowerCase().includes(q));

      const matchesCat =
        selectedCategory === 'all' ||
        game.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesQuery && matchesCat;
    });
  }, [query, selectedCategory]);

  return (
    <div className="w-full flex flex-col">
      {/* Search Header */}
      <div className="w-full p-6 sm:p-10 rounded-3xl bg-brand-card border border-brand-border mb-8 shadow-xl">
        <h1 className="text-2xl sm:text-4xl font-black text-white mb-2">
          Find Car Games
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mb-6">
          Search across titles, genres, and car types with live results
        </p>

        {/* Search Input */}
        <div className="relative w-full max-w-2xl mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, tag, or category (e.g., drift, parking, puzzle)..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-brand-darker border border-brand-border focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan text-base text-gray-200 placeholder-gray-500 shadow-inner"
          />
          <SearchIcon className="w-5 h-5 text-gray-400 absolute left-4 top-4" />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-white absolute right-3.5 top-3.5"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400 font-mono mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedCategory === 'all'
                ? 'bg-brand-cyan text-brand-darker font-black'
                : 'bg-brand-darker text-gray-400 hover:text-white border border-brand-border'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name.toLowerCase())}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat.name.toLowerCase()
                  ? 'bg-brand-purple text-white shadow-neonPurple'
                  : 'bg-brand-darker text-gray-400 hover:text-white border border-brand-border'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between mb-6 px-1">
        <span className="text-sm text-gray-400">
          Showing <span className="font-bold text-brand-cyan">{filteredGames.length}</span> car games
          {query && <span> for &quot;<span className="text-white">{query}</span>&quot;</span>}
        </span>
      </div>

      {/* Results Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
          {filteredGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-brand-card/40 border border-brand-border mb-16">
          <div className="text-4xl mb-3">🚗💨</div>
          <h3 className="text-xl font-bold text-white mb-2">No car games matched your search</h3>
          <p className="text-xs text-gray-400 mb-6">
            Try searching for &quot;drift&quot;, &quot;parking&quot;, &quot;highway&quot;, or &quot;speed&quot;.
          </p>
          <button
            onClick={() => {
              setQuery('');
              setSelectedCategory('all');
            }}
            className="px-6 py-2.5 rounded-xl bg-brand-border hover:bg-brand-cyan hover:text-brand-darker text-gray-200 text-xs font-bold transition"
          >
            Clear Filters & View All Games
          </button>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
