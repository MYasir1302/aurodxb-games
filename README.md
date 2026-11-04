# AuroDXB Games (aurodxb.com) 🏎️💨

> The premier Miniclip-style online gaming portal featuring **ONLY car games**. Built with Next.js (App Router), Tailwind CSS, HTML5 Canvas, and Web Audio API. 100% self-engineered, zero external copyrighted assets, and ready for instant Vercel deployment.

---

## 🌟 Highlights

- **10 Playable Car Games**: Built from scratch in vanilla JS/Canvas & React (Racing, Parking, Stunt, Puzzle, Casual).
- **Zero External Game Embeds**: 100% self-hosted, safe from 404s, CORS, or broken third-party iframes.
- **Synthesized Web Audio API**: Procedural sound generation for engine revs, tire screeches, coin pickups, and crashes without downloading any `.mp3` files.
- **Cross-Platform**: Dual keyboard and touch on-screen controls for seamless mobile, tablet, and desktop play.
- **Miniclip Aesthetics**: Cyber neon theme (electric cyan `#00f0ff` + vibrant purple `#a855f7`), dark/light mode toggle, glowing cards, and smooth hover interactions.
- **Local Persistence**: High scores, recently played car games, and sound/theme preferences stored in `localStorage`.
- **AdSense Ready**: Standard header, sidebar, and under-game advertisement slots configured with strict Google AdSense compliance policies.
- **SEO & Lighthouse 90+**: Full OpenGraph tags, dynamic `sitemap.xml`, `robots.txt`, breadcrumbs, and static pre-rendering.

---

## 🎮 The 10 Built-In Car Games

| # | Game | Genre | Description | Controls |
|---|------|-------|-------------|----------|
| 1 | **Traffic Racer** | Racing | Endless 4-lane highway rush; weave through traffic with nitro surge. | `A/D` or `Left/Right`, `W` (Nitro), `S` (Brake) |
| 2 | **Drift Master** | Racing | 2D dynamic vehicle physics; maintain high slip angles around track corners. | `WASD` / Arrows, `Space` (Handbrake) |
| 3 | **Circuit Rush** | Racing | Formula lap racer with boost pads, checkpoints, and lap record tracker. | `WASD` / Arrows, `Space` (Boost) |
| 4 | **Parking Master** | Parking | 5-level precision puzzle with Drive (D) & Reverse (R) gear shift. | `WASD` / Arrows, `G` (Toggle Gear) |
| 5 | **Hill Climb Racer**| Racing | 2D physics offroader climbing rolling hills; collect fuel & coins without flipping. | `D` (Gas/Tilt), `A` (Brake/Tilt) |
| 6 | **Stunt Ramp Jump** | Stunt | Sky-high mega ramp; rocket boost, perform 360° flips, and land safely. | `W` (Ramp Gas), `Space` (Rocket), `A/D` (Flips) |
| 7 | **Fuel Run** | Casual | High-speed survival; collect green jerrycans and dodge oil slicks & barriers. | `A/D` (Steer), `W` / `Space` (Surge) |
| 8 | **Car Merge** | Puzzle | 2048-style sliding puzzler; merge identical cars up to the legendary Auro 2048. | Arrow Keys / `WASD`, `U` (Undo), Touch Swipe |
| 9 | **Car Memory Match**| Puzzle | Card flip recall with 12 stylized car models across Easy, Medium, and Hard. | Mouse Click / Touch Tap |
| 10| **Taxi Rush** | Casual | City cabbie dispatch; pick up passengers on a grid and beat the fare timer. | `WASD` / Arrows, Honk Horn button |

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router, Server Components & Static Site Generation)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom cyber/neon palette
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio**: Synthesized Web Audio API (`src/lib/audio.ts`)
- **Graphics**: HTML5 2D Canvas & Vector SVGs (`src/lib/carDraw.ts` & `src/components/common/GameThumbnail.tsx`)
- **Hosting**: Zero-configuration [Vercel](https://vercel.com/) deployment

---

## 📁 Project Structure

```text
aurodxb-games/
├── public/                  # Static assets & icons
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout, navigation, ads, metadata
│   │   ├── page.tsx         # Home: Hero featured, trending, category tabs, game grid
│   │   ├── globals.css      # Cyber theme & animations
│   │   ├── sitemap.ts       # Dynamic sitemap.xml generator
│   │   ├── robots.ts        # robots.txt handler
│   │   ├── games/[slug]/    # Game page with centered canvas & controls
│   │   ├── category/[name]/ # Category spotlight pages (Racing, Parking, etc.)
│   │   ├── search/          # Live filtering search page
│   │   ├── about/           # About AuroDXB Games
│   │   ├── contact/         # Contact & support form
│   │   ├── privacy/         # AdSense compliant Privacy Policy
│   │   └── terms/           # Terms of Service
│   ├── components/
│   │   ├── common/          # GameCard, GameThumbnail, HeroFeatured, AdPlaceholder, RecentlyPlayed
│   │   ├── games/           # 10 self-contained playable games & GameContainer dispatcher
│   │   └── layout/          # Sticky Navbar, Live search dropdown, Footer
│   ├── data/
│   │   └── games.ts         # Single Source of Truth for game catalog metadata
│   ├── lib/
│   │   ├── audio.ts         # Web Audio API sound generator
│   │   ├── carDraw.ts       # HTML5 Canvas vector car renderer
│   │   └── storage.ts       # LocalStorage high scores & session history
│   └── types/
│       └── game.ts          # TypeScript interfaces
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🚀 How to Add a New Game in 3 Simple Steps

Adding a new car game to AuroDXB is designed to take under 5 minutes:

### Step 1: Add Game Metadata to `src/data/games.ts`
Append your new game object to the `GAMES` array:

```typescript
{
  id: 'cyber-drift',
  slug: 'cyber-drift',
  title: 'Cyber Drift 2077',
  shortDescription: 'Neon cybernetic street drift racing with EMP traps.',
  description: 'Full rich description for SEO and game page...',
  category: 'Racing', // 'Racing' | 'Parking' | 'Stunt' | 'Puzzle' | 'Casual'
  tags: ['Cyber', 'Drift', 'Night'],
  controls: [
    { key: 'W / Up Arrow', action: 'Gas' },
    { key: 'A / D', action: 'Steer' },
  ],
  mobileControlsHint: 'Touch steer buttons on screen.',
  featured: false,
  trending: true,
  releaseYear: 2026,
  rating: 4.9,
  playCount: 1200,
  thumbnailAccent: '#00f0ff',
}
```

### Step 2: Build the Game Component
Create `src/components/games/CyberDrift.tsx`. Use HTML5 Canvas or React DOM, and leverage `sounds` from `@/lib/audio` and `saveHighScore` from `@/lib/storage`.

### Step 3: Register in `GameContainer.tsx` and `GameThumbnail.tsx`
1. In `src/components/games/GameContainer.tsx`, dynamically import your game and add a case in `renderGame()`:
   ```typescript
   case 'cyber-drift':
     return <CyberDrift />;
   ```
2. In `src/components/common/GameThumbnail.tsx`, add an SVG case for `'cyber-drift'`.

*That's it! Next.js will automatically generate the `/games/cyber-drift` static page, category listings, and sitemap entries.*

---

## 💻 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/aurodxb-games.git
   cd aurodxb-games
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local dev server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Production Build**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🌐 Deploying to Vercel

AuroDXB is configured with zero extra configuration needed:

1. Push your repository to GitHub.
2. In Vercel, click **Add New Project** and select your repository.
3. Framework Preset: **Next.js** (detected automatically).
4. Click **Deploy**.

---

## 📄 License & Compliance

All software code, canvas rendering engines, and vector artwork are licensed under the MIT License. No copyrighted vehicle brands or logos are included.
