import { Game, GameCategory } from '@/types/game';

export const CATEGORIES: { name: GameCategory; description: string; icon: string }[] = [
  {
    name: 'Racing',
    description: 'High-speed track showdowns, highway overtakes, and downhill drift battles.',
    icon: 'Flag',
  },
  {
    name: 'Parking',
    description: 'Precision driving challenges, tight maneuvers, and obstacle-filled bays.',
    icon: 'SquareParking',
  },
  {
    name: 'Stunt',
    description: 'Mega-ramps, high-flying barrel rolls, insane loops, and mid-air stunts.',
    icon: 'Zap',
  },
  {
    name: 'Puzzle',
    description: 'Brain-teasing car merges, card flips, and strategic garage management.',
    icon: 'Puzzle',
  },
  {
    name: 'Casual',
    description: 'Pick-up-and-play arcade thrillers, passenger taxi pickups, and endless runners.',
    icon: 'Gamepad2',
  },
];

export const GAMES: Game[] = [
  {
    id: 'drift-master',
    slug: 'drift-master',
    title: 'Drift Master',
    shortDescription: 'Tear up the asphalt! Rack up huge drift combos around winding corners.',
    description:
      'Master the art of controlled chaos in Drift Master. Slide through apexes on a neon-lit race circuit, maintain high slip angles, and build your combo multiplier without scraping the walls. Features real dynamic 2D vehicle physics, tire smoke, and skid mark persistence.',
    category: 'Racing',
    tags: ['Drifting', 'Physics', 'Asphalt', 'Combo'],
    controls: [
      { key: 'W / Up Arrow', action: 'Accelerate' },
      { key: 'S / Down Arrow', action: 'Brake / Reverse' },
      { key: 'A / D or Left / Right', action: 'Steer' },
      { key: 'Spacebar', action: 'Handbrake Drift' },
      { key: 'R', action: 'Quick Restart' },
    ],
    mobileControlsHint: 'Use on-screen steering buttons, throttle pedal, and handbrake button.',
    featured: true,
    trending: true,
    releaseYear: 2026,
    rating: 4.9,
    playCount: 14280,
    thumbnailAccent: '#00f0ff',
  },
  {
    id: 'traffic-racer',
    slug: 'traffic-racer',
    title: 'Traffic Racer',
    shortDescription: 'Dodge bumper-to-bumper highway rush hour at blazing speeds.',
    description:
      'Weave between commuter sedans, semi-trucks, and speeding sports cars on an endless four-lane neon expressway. The longer you survive and the closer you shave oncoming vehicles, the higher your near-miss bonus score multiplies!',
    category: 'Racing',
    tags: ['Highway', 'Endless', 'Speed', 'Overtake'],
    controls: [
      { key: 'A / Left Arrow', action: 'Steer Left' },
      { key: 'D / Right Arrow', action: 'Steer Right' },
      { key: 'W / Up Arrow', action: 'Nitro Boost' },
      { key: 'S / Down Arrow', action: 'Brake' },
    ],
    mobileControlsHint: 'Tap left/right arrows to shift lanes. Hold Nitro button to sprint.',
    featured: false,
    trending: true,
    releaseYear: 2026,
    rating: 4.8,
    playCount: 18920,
    thumbnailAccent: '#ff2a85',
  },
  {
    id: 'circuit-rush',
    slug: 'circuit-rush',
    title: 'Circuit Rush',
    shortDescription: 'Top-down grand prix lap racing against the clock with boost pads.',
    description:
      'Test your precision driving on a winding Grand Prix circuit. Hit turbo boost pads, brake before sharp hairpin turns, and shave tenths off your best lap time in this fast-paced time-trial racer.',
    category: 'Racing',
    tags: ['Grand Prix', 'Time Trial', 'Lap Record', 'Arcade'],
    controls: [
      { key: 'W / Up Arrow', action: 'Accelerate' },
      { key: 'S / Down Arrow', action: 'Brake / Reverse' },
      { key: 'A / Left Arrow', action: 'Steer Left' },
      { key: 'D / Right Arrow', action: 'Steer Right' },
      { key: 'Space', action: 'Boost' },
    ],
    mobileControlsHint: 'Virtual steer buttons and gas pedal.',
    featured: false,
    trending: true,
    releaseYear: 2026,
    rating: 4.7,
    playCount: 11500,
    thumbnailAccent: '#a855f7',
  },
  {
    id: 'parking-master',
    slug: 'parking-master',
    title: 'Parking Master',
    shortDescription: 'Navigate tight obstacle courses and park cleanly without a scratch.',
    description:
      'Test your spatial awareness and fine wheel control across 5 increasingly tricky parking levels. Toggle between Drive (D) and Reverse (R) gears, swing into narrow bays, and avoid concrete pillars, curbs, and parked exotics.',
    category: 'Parking',
    tags: ['Precision', 'Puzzle', 'Levels', 'Steering'],
    controls: [
      { key: 'W / Up Arrow', action: 'Gas Pedal' },
      { key: 'S / Down Arrow', action: 'Brake' },
      { key: 'A / Left Arrow', action: 'Steer Left' },
      { key: 'D / Right Arrow', action: 'Steer Right' },
      { key: 'G / Shift', action: 'Toggle Gear (D / R)' },
    ],
    mobileControlsHint: 'Steer buttons, Gas/Brake pedals, and Gear toggle button.',
    featured: false,
    trending: true,
    releaseYear: 2026,
    rating: 4.8,
    playCount: 16400,
    thumbnailAccent: '#ffd200',
  },
  {
    id: 'hill-climb-racer',
    slug: 'hill-climb-racer',
    title: 'Hill Climb Racer',
    shortDescription: 'Conquer steep rolling peaks and balance your suspension before fuel runs dry.',
    description:
      'Take on rugged 2D physics-based terrain in a tuned off-road buggy. Balance your vehicle mid-air to land level, grab fuel canisters before your tank empties, and collect shiny coins to set record distances.',
    category: 'Racing',
    tags: ['Physics', '2D', 'Off-Road', 'Distance'],
    controls: [
      { key: 'D / Right Arrow', action: 'Gas / Lean Forward' },
      { key: 'A / Left Arrow', action: 'Brake / Lean Back' },
    ],
    mobileControlsHint: 'Touch Gas button on right, Brake button on left.',
    featured: false,
    trending: true,
    releaseYear: 2026,
    rating: 4.9,
    playCount: 22100,
    thumbnailAccent: '#10b981',
  },
  {
    id: 'stunt-ramp-jump',
    slug: 'stunt-ramp-jump',
    title: 'Stunt Ramp Jump',
    shortDescription: 'Launch off colossal sky ramps, pull mid-air flips, and stick the landing!',
    description:
      'Hit terminal velocity rolling down a sky-high mega ramp. Launch into the stratosphere, perform flips in mid-air for massive style points, and ignite rocket boosters to fly over canyons and obstacles.',
    category: 'Stunt',
    tags: ['Mega Ramp', 'Airtime', 'Flips', 'Rocket'],
    controls: [
      { key: 'W / Up Arrow', action: 'Accelerate' },
      { key: 'Space', action: 'Rocket Boost' },
      { key: 'A / Left Arrow', action: 'Backflip Tilt' },
      { key: 'D / Right Arrow', action: 'Frontflip Tilt' },
    ],
    mobileControlsHint: 'Touch and hold Boost on ramp, tilt buttons in air.',
    featured: false,
    trending: false,
    releaseYear: 2026,
    rating: 4.7,
    playCount: 9800,
    thumbnailAccent: '#f97316',
  },
  {
    id: 'fuel-run',
    slug: 'fuel-run',
    title: 'Fuel Run',
    shortDescription: 'Collect green jerrycans and dodge hazards as your fuel gauge counts down.',
    description:
      'An adrenaline-pumping survival runner where your tank is draining by the second! Swerve between road cones, oil slicks, and blockades while scooping up fuel cans, super magnets, and nitro fuel.',
    category: 'Casual',
    tags: ['Endless', 'Survival', 'Pickups', 'Refuel'],
    controls: [
      { key: 'A / Left Arrow', action: 'Move Left' },
      { key: 'D / Right Arrow', action: 'Move Right' },
      { key: 'W / Up Arrow', action: 'Nitro Surge' },
    ],
    mobileControlsHint: 'Tap left/right arrows to steer. Tap boost for quick speed.',
    featured: false,
    trending: false,
    releaseYear: 2026,
    rating: 4.6,
    playCount: 8400,
    thumbnailAccent: '#06b6d4',
  },
  {
    id: 'car-merge',
    slug: 'car-merge',
    title: 'Car Merge',
    shortDescription: 'Merge identical rides to unlock legendary hypercars in this 2048 puzzler.',
    description:
      'Swipe and combine identical motor cars on a 4x4 garage grid. Merge two Hatchbacks into a Sedan, Sedans into Coupes, and keep evolving all the way up to the legendary Auro Vision Hypercar!',
    category: 'Puzzle',
    tags: ['2048', 'Merge', 'Logic', 'Garage'],
    controls: [
      { key: 'Arrow Keys or WASD', action: 'Slide Grid' },
      { key: 'U', action: 'Undo Last Move' },
      { key: 'R', action: 'New Garage' },
    ],
    mobileControlsHint: 'Swipe up, down, left, or right on the grid.',
    featured: false,
    trending: true,
    releaseYear: 2026,
    rating: 4.9,
    playCount: 15600,
    thumbnailAccent: '#ec4899',
  },
  {
    id: 'car-memory-match',
    slug: 'car-memory-match',
    title: 'Car Memory Match',
    shortDescription: 'Flip cards and match exotic car silhouettes before time runs out.',
    description:
      'Sharpen your automotive recall! Flip cards to match pairs of iconic car types—from rally racers and formula cars to cyber pickups and electric exotics. Includes 3 difficulty modes and combo bonuses.',
    category: 'Puzzle',
    tags: ['Memory', 'Cards', 'Pairs', 'Brain'],
    controls: [
      { key: 'Mouse Click / Tap', action: 'Flip Card' },
      { key: 'R', action: 'Restart Game' },
    ],
    mobileControlsHint: 'Tap cards to flip.',
    featured: false,
    trending: false,
    releaseYear: 2026,
    rating: 4.5,
    playCount: 7100,
    thumbnailAccent: '#8b5cf6',
  },
  {
    id: 'taxi-rush',
    slug: 'taxi-rush',
    title: 'Taxi Rush',
    shortDescription: 'Pick up commuters on a bustling city grid and speed them to their destination.',
    description:
      'Become the top city cabbie! Cruise the urban grid, pick up waiting passengers, navigate traffic intersections, and beat the delivery timer to collect fat fares and speed tips.',
    category: 'Casual',
    tags: ['City', 'Pick & Drop', 'Taxi', 'Timer'],
    controls: [
      { key: 'W / Up Arrow', action: 'Drive Forward' },
      { key: 'S / Down Arrow', action: 'Reverse' },
      { key: 'A / Left Arrow', action: 'Steer Left' },
      { key: 'D / Right Arrow', action: 'Steer Right' },
      { key: 'Space', action: 'Handbrake / Stop' },
    ],
    mobileControlsHint: 'D-Pad buttons for navigation.',
    featured: false,
    trending: true,
    releaseYear: 2026,
    rating: 4.8,
    playCount: 13300,
    thumbnailAccent: '#eab308',
  },
];

export function getGameBySlug(slug: string): Game | undefined {
  return GAMES.find((game) => game.slug === slug);
}

export function getGamesByCategory(category: GameCategory): Game[] {
  return GAMES.filter((game) => game.category.toLowerCase() === category.toLowerCase());
}

export function getRelatedGames(currentSlug: string, count = 4): Game[] {
  const current = getGameBySlug(currentSlug);
  if (!current) return GAMES.slice(0, count);

  const sameCategory = GAMES.filter(
    (g) => g.slug !== currentSlug && g.category === current.category
  );
  const others = GAMES.filter(
    (g) => g.slug !== currentSlug && g.category !== current.category
  );

  return [...sameCategory, ...others].slice(0, count);
}
