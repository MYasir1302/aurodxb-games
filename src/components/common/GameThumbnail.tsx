import React from 'react';

interface Props {
  slug: string;
  className?: string;
}

export default function GameThumbnail({ slug, className = 'w-full h-full' }: Props) {
  switch (slug) {
    case 'drift-master':
      return (
        <svg viewBox="0 0 320 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="driftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
            <filter id="neonGlowDrift">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect width="320" height="200" fill="url(#driftGrad)" />
          {/* Curved track curb */}
          <path d="M-20,180 Q160,20 340,160" fill="none" stroke="#a855f7" strokeWidth="24" opacity="0.6" />
          <path d="M-20,180 Q160,20 340,160" fill="none" stroke="#00f0ff" strokeWidth="3" filter="url(#neonGlowDrift)" />
          {/* Skid marks */}
          <path d="M40,150 Q160,70 240,120" fill="none" stroke="#000000" strokeWidth="6" opacity="0.5" />
          <path d="M55,160 Q170,80 250,130" fill="none" stroke="#000000" strokeWidth="6" opacity="0.5" />
          {/* Drifting Sports Car */}
          <g transform="translate(180, 105) rotate(35)">
            <rect x="-35" y="-18" width="70" height="36" rx="8" fill="#a855f7" />
            <polygon points="-10,-14 18,-14 10,-5 -10,-5" fill="#00f0ff" />
            <rect x="-38" y="-4" width="8" height="8" fill="#ff2a85" />
            <rect x="25" y="-16" width="10" height="4" fill="#fffffa" filter="url(#neonGlowDrift)" />
            <rect x="25" y="12" width="10" height="4" fill="#fffffa" filter="url(#neonGlowDrift)" />
          </g>
          {/* Tire smoke clouds */}
          <circle cx="140" cy="120" r="14" fill="#ffffff" opacity="0.15" />
          <circle cx="120" cy="130" r="20" fill="#ffffff" opacity="0.2" />
        </svg>
      );

    case 'traffic-racer':
      return (
        <svg viewBox="0 0 320 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="roadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0b0f19" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="beam" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="320" height="200" fill="url(#roadGrad)" />
          {/* Perspective highway lanes */}
          <polygon points="120,0 200,0 290,200 30,200" fill="#131b2e" />
          <line x1="160" y1="0" x2="160" y2="200" stroke="#ff2a85" strokeWidth="3" strokeDasharray="12,12" />
          <line x1="140" y1="0" x2="95" y2="200" stroke="#ffffff" strokeWidth="2" strokeDasharray="8,8" opacity="0.4" />
          <line x1="180" y1="0" x2="225" y2="200" stroke="#ffffff" strokeWidth="2" strokeDasharray="8,8" opacity="0.4" />
          {/* Headlight beam */}
          <polygon points="160,140 110,40 210,40" fill="url(#beam)" />
          {/* Player Car */}
          <g transform="translate(160, 150)">
            <rect x="-24" y="-14" width="48" height="28" rx="6" fill="#00f0ff" />
            <rect x="-10" y="-8" width="20" height="16" rx="3" fill="#0f172a" />
            <rect x="-24" y="-12" width="4" height="6" fill="#ff0044" />
            <rect x="-24" y="6" width="4" height="6" fill="#ff0044" />
          </g>
          {/* Traffic Ahead */}
          <g transform="translate(140, 70)">
            <rect x="-16" y="-10" width="32" height="20" rx="4" fill="#f43f5e" />
            <rect x="14" y="-8" width="3" height="4" fill="#ff0000" />
            <rect x="14" y="4" width="3" height="4" fill="#ff0000" />
          </g>
          <g transform="translate(180, 50)">
            <rect x="-14" y="-9" width="28" height="18" rx="4" fill="#eab308" />
          </g>
        </svg>
      );

    case 'circuit-rush':
      return (
        <svg viewBox="0 0 320 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="200" fill="#080d1a" />
          {/* Race track loop */}
          <ellipse cx="160" cy="100" rx="120" ry="60" fill="none" stroke="#1e293b" strokeWidth="48" />
          <ellipse cx="160" cy="100" rx="120" ry="60" fill="none" stroke="#00f0ff" strokeWidth="3" />
          {/* Chequered line */}
          <line x1="160" y1="40" x2="160" y2="64" stroke="#ffffff" strokeWidth="6" strokeDasharray="6,6" />
          {/* F1 Car */}
          <g transform="translate(240, 100) rotate(90)">
            <polygon points="0,-25 -8,15 8,15" fill="#00f0ff" />
            <rect x="-14" y="-15" width="28" height="6" rx="2" fill="#a855f7" />
            <rect x="-16" y="10" width="32" height="6" rx="2" fill="#ffffff" />
            <circle cx="0" cy="-2" r="4" fill="#ffff00" />
          </g>
        </svg>
      );

    case 'parking-master':
      return (
        <svg viewBox="0 0 320 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="200" fill="#0f172a" />
          {/* Parking spot bays */}
          <rect x="50" y="40" width="60" height="110" rx="4" fill="none" stroke="#eab308" strokeWidth="3" strokeDasharray="6,4" />
          <text x="80" y="100" fill="#eab308" fontSize="22" fontWeight="bold" textAnchor="middle">P</text>
          {/* Parked car nearby */}
          <rect x="140" y="45" width="50" height="100" rx="8" fill="#3b82f6" />
          <rect x="145" y="65" width="40" height="50" rx="4" fill="#1e3a8a" />
          {/* Player car maneuvering */}
          <g transform="translate(80, 100) rotate(-10)">
            <rect x="-22" y="-45" width="44" height="90" rx="8" fill="#00f0ff" />
            <rect x="-16" y="-20" width="32" height="40" rx="4" fill="#0f172a" />
          </g>
        </svg>
      );

    case 'hill-climb-racer':
      return (
        <svg viewBox="0 0 320 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="200" fill="#0c1322" />
          {/* Hills path */}
          <path d="M0,170 Q70,70 160,140 T320,110 L320,200 L0,200 Z" fill="#0f172a" stroke="#10b981" strokeWidth="4" />
          {/* Offroad Buggy mid-jump */}
          <g transform="translate(130, 90) rotate(-20)">
            <rect x="-24" y="-14" width="48" height="16" rx="5" fill="#10b981" />
            <line x1="-15" y1="-14" x2="-5" y2="-25" stroke="#ffffff" strokeWidth="3" />
            <line x1="5" y1="-25" x2="15" y2="-14" stroke="#ffffff" strokeWidth="3" />
            <circle cx="0" cy="-18" r="5" fill="#00f0ff" />
            <circle cx="-18" cy="8" r="11" fill="#1e293b" stroke="#34d399" strokeWidth="2" />
            <circle cx="18" cy="8" r="11" fill="#1e293b" stroke="#34d399" strokeWidth="2" />
          </g>
          {/* Golden Coin floating */}
          <circle cx="180" cy="80" r="10" fill="#eab308" />
          <text x="180" y="84" fill="#78350f" fontSize="12" fontWeight="bold" textAnchor="middle">$</text>
        </svg>
      );

    case 'stunt-ramp-jump':
      return (
        <svg viewBox="0 0 320 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="200" fill="#0a0a1a" />
          {/* Mega Ramp */}
          <polygon points="0,200 110,200 110,120" fill="#1e293b" stroke="#f97316" strokeWidth="3" />
          {/* Flying stunt car in air */}
          <g transform="translate(190, 75) rotate(-35)">
            <rect x="-28" y="-12" width="56" height="20" rx="5" fill="#f97316" />
            <polygon points="-28,-5 -45,-15 -45,5" fill="#00f0ff" />
            <circle cx="-16" cy="10" r="9" fill="#0f172a" />
            <circle cx="16" cy="10" r="9" fill="#0f172a" />
          </g>
          {/* Fiery hoop */}
          <ellipse cx="280" cy="85" rx="15" ry="45" fill="none" stroke="#f97316" strokeWidth="6" />
        </svg>
      );

    case 'fuel-run':
      return (
        <svg viewBox="0 0 320 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="200" fill="#080e1a" />
          {/* Road */}
          <rect x="60" y="0" width="200" height="200" fill="#131b2e" />
          <line x1="60" y1="0" x2="60" y2="200" stroke="#06b6d4" strokeWidth="4" />
          <line x1="260" y1="0" x2="260" y2="200" stroke="#06b6d4" strokeWidth="4" />
          <line x1="160" y1="0" x2="160" y2="200" stroke="#ffffff" strokeWidth="2" strokeDasharray="10,10" opacity="0.3" />
          {/* Fuel Cans */}
          <rect x="100" y="45" width="22" height="28" rx="4" fill="#10b981" />
          <rect x="200" y="110" width="22" height="28" rx="4" fill="#eab308" />
          {/* Player Car */}
          <g transform="translate(160, 150)">
            <rect x="-20" y="-32" width="40" height="64" rx="8" fill="#06b6d4" />
            <rect x="-14" y="-12" width="28" height="24" rx="4" fill="#082f49" />
          </g>
        </svg>
      );

    case 'car-merge':
      return (
        <svg viewBox="0 0 320 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="200" fill="#110d1f" />
          {/* 2048 tiles matrix */}
          <rect x="50" y="30" width="60" height="60" rx="8" fill="#3b82f6" opacity="0.8" />
          <text x="80" y="65" fill="#ffffff" fontSize="18" fontWeight="black" textAnchor="middle">2</text>
          <rect x="130" y="30" width="60" height="60" rx="8" fill="#f43f5e" opacity="0.8" />
          <text x="160" y="65" fill="#ffffff" fontSize="18" fontWeight="black" textAnchor="middle">16</text>
          <rect x="210" y="30" width="60" height="60" rx="8" fill="#a855f7" opacity="0.9" />
          <text x="240" y="65" fill="#ffffff" fontSize="18" fontWeight="black" textAnchor="middle">64</text>

          <rect x="50" y="110" width="60" height="60" rx="8" fill="#06b6d4" opacity="0.8" />
          <text x="80" y="145" fill="#ffffff" fontSize="18" fontWeight="black" textAnchor="middle">256</text>
          <rect x="130" y="110" width="60" height="60" rx="8" fill="#eab308" opacity="0.9" />
          <text x="160" y="145" fill="#ffffff" fontSize="18" fontWeight="black" textAnchor="middle">512</text>
          <rect x="210" y="110" width="60" height="60" rx="8" fill="#ec4899" stroke="#00f0ff" strokeWidth="2" />
          <text x="240" y="145" fill="#ffffff" fontSize="14" fontWeight="black" textAnchor="middle">2048</text>
        </svg>
      );

    case 'car-memory-match':
      return (
        <svg viewBox="0 0 320 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="200" fill="#0d111e" />
          {/* 4 Cards */}
          <rect x="40" y="40" width="65" height="110" rx="8" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2" />
          <text x="72" y="100" fill="#a855f7" fontSize="24" textAnchor="middle">★</text>

          <rect x="125" y="40" width="65" height="110" rx="8" fill="#1e293b" stroke="#00f0ff" strokeWidth="2" />
          <g transform="translate(157, 95)">
            <rect x="-20" y="-8" width="40" height="16" rx="4" fill="#00f0ff" />
            <circle cx="-12" cy="10" r="4" fill="#ffffff" />
            <circle cx="12" cy="10" r="4" fill="#ffffff" />
          </g>

          <rect x="210" y="40" width="65" height="110" rx="8" fill="#1e293b" stroke="#00f0ff" strokeWidth="2" />
          <g transform="translate(242, 95)">
            <rect x="-20" y="-8" width="40" height="16" rx="4" fill="#00f0ff" />
            <circle cx="-12" cy="10" r="4" fill="#ffffff" />
            <circle cx="12" cy="10" r="4" fill="#ffffff" />
          </g>
        </svg>
      );

    case 'taxi-rush':
    default:
      return (
        <svg viewBox="0 0 320 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="200" fill="#0b0f19" />
          {/* City blocks */}
          <rect x="30" y="20" width="110" height="60" rx="4" fill="#1e293b" />
          <rect x="180" y="20" width="110" height="60" rx="4" fill="#1e293b" />
          <rect x="30" y="120" width="110" height="60" rx="4" fill="#1e293b" />
          <rect x="180" y="120" width="110" height="60" rx="4" fill="#1e293b" />
          {/* Streets */}
          <line x1="0" y1="100" x2="320" y2="100" stroke="#eab308" strokeWidth="2" strokeDasharray="8,8" />
          <line x1="160" y1="0" x2="160" y2="200" stroke="#eab308" strokeWidth="2" strokeDasharray="8,8" />
          {/* Yellow Taxi */}
          <g transform="translate(160, 100) rotate(45)">
            <rect x="-26" y="-13" width="52" height="26" rx="6" fill="#eab308" />
            <rect x="-8" y="-5" width="16" height="10" rx="2" fill="#0f172a" />
            <rect x="-4" y="-4" width="8" height="8" fill="#ffffff" />
            <rect x="-4" y="-4" width="8" height="8" fill="#f59e0b" />
          </g>
          {/* Passenger Beacon */}
          <circle cx="210" cy="95" r="8" fill="#10b981" />
          <text x="210" y="99" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">$</text>
        </svg>
      );
  }
}
