import React from 'react';

interface Props {
  slot: 'header' | 'sidebar' | 'below-game' | 'in-feed';
  className?: string;
}

export default function AdPlaceholder({ slot, className = '' }: Props) {
  let dimensions = 'w-full h-24 max-w-[728px]'; // default leaderboard
  let label = 'Header Leaderboard (728x90)';

  if (slot === 'sidebar') {
    dimensions = 'w-[300px] h-[250px]';
    label = 'Sidebar Rectangle (300x250)';
  } else if (slot === 'below-game') {
    dimensions = 'w-full h-[90px] sm:h-[120px] max-w-[970px]';
    label = 'Under-Game Billboard (970x90 / Responsive)';
  } else if (slot === 'in-feed') {
    dimensions = 'w-full h-[100px] max-w-[728px]';
    label = 'In-Feed Ad Unit (728x90)';
  }

  return (
    <aside
      aria-label="Advertisement"
      className={`mx-auto my-4 flex flex-col items-center justify-center p-2 rounded-xl bg-brand-card/40 border border-brand-border/80 border-dashed text-center overflow-hidden ${dimensions} ${className}`}
    >
      <span className="text-[10px] tracking-widest uppercase font-mono text-gray-500 mb-1">
        ADVERTISEMENT
      </span>
      <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
        <span>Google AdSense Slot</span>
        <span className="text-brand-purple/70">•</span>
        <span className="text-gray-400">{label}</span>
      </div>
    </aside>
  );
}
