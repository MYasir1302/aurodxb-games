'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sounds } from '@/lib/audio';
import { getHighScore, saveHighScore } from '@/lib/storage';
import { drawCarTopDown } from '@/lib/carDraw';
import { RotateCcw, Volume2, VolumeX, DollarSign, Clock, Users } from 'lucide-react';

interface Passenger {
  pickupX: number;
  pickupY: number;
  dropX: number;
  dropY: number;
  name: string;
  fare: number;
}

interface TrafficNPC {
  x: number;
  y: number;
  speed: number;
  direction: 'H' | 'V'; // Horizontal or Vertical street
  color: string;
}

const PASSENGERS_POOL: { name: string; fare: number }[] = [
  { name: 'Sarah', fare: 85 },
  { name: 'David', fare: 120 },
  { name: 'Elena', fare: 95 },
  { name: 'Marcus', fare: 140 },
  { name: 'Amira', fare: 110 },
  { name: 'Leo', fare: 130 },
];

export default function TaxiRush() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cash, setCash] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [shiftTime, setShiftTime] = useState(45);
  const [tripsCompleted, setTripsCompleted] = useState(0);
  const [hasPassenger, setHasPassenger] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.getMuted());
  const [isNewRecord, setIsNewRecord] = useState(false);

  const stateRef = useRef({
    taxiX: 320,
    taxiY: 240,
    angle: 0,
    speed: 0,
    hasPassenger: false,
    currentPassenger: null as Passenger | null,
    cash: 0,
    shiftTime: 45,
    trips: 0,
    gameOver: false,
    traffic: [
      { x: 100, y: 120, speed: 2, direction: 'H', color: '#3b82f6' },
      { x: 500, y: 360, speed: -2.5, direction: 'H', color: '#10b981' },
      { x: 200, y: 80, speed: 2.2, direction: 'V', color: '#ec4899' },
      { x: 440, y: 400, speed: -2, direction: 'V', color: '#8b5cf6' },
    ] as TrafficNPC[],
    keys: {
      up: false,
      down: false,
      left: false,
      right: false,
    },
  });

  const spawnPassenger = (): Passenger => {
    // Street coordinates: streets at Y=120, 240, 360 and X=100, 260, 420, 560
    const streetYs = [120, 240, 360];
    const streetXs = [120, 260, 420, 540];

    const pickY = streetYs[Math.floor(Math.random() * streetYs.length)];
    const pickX = 80 + Math.random() * 460;

    let dropY = streetYs[Math.floor(Math.random() * streetYs.length)];
    let dropX = streetXs[Math.floor(Math.random() * streetXs.length)];

    // Ensure pickup and drop are decently separated
    if (Math.hypot(dropX - pickX, dropY - pickY) < 160) {
      dropX = (dropX + 300) % 560;
    }

    const poolItem = PASSENGERS_POOL[Math.floor(Math.random() * PASSENGERS_POOL.length)];

    return {
      pickupX: pickX,
      pickupY: pickY,
      dropX: dropX,
      dropY: dropY,
      name: poolItem.name,
      fare: poolItem.fare,
    };
  };

  const resetGame = useCallback(() => {
    const s = stateRef.current;
    s.taxiX = 320;
    s.taxiY = 240;
    s.angle = 0;
    s.speed = 0;
    s.hasPassenger = false;
    s.cash = 0;
    s.shiftTime = 45;
    s.trips = 0;
    s.gameOver = false;
    s.currentPassenger = spawnPassenger();

    setCash(0);
    setShiftTime(45);
    setTripsCompleted(0);
    setHasPassenger(false);
    setIsGameOver(false);
    setIsNewRecord(false);
    sounds.playClick();
  }, []);

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  useEffect(() => {
    const saved = getHighScore('taxi-rush');
    setHighScore(saved);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') stateRef.current.keys.up = true;
      if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') stateRef.current.keys.down = true;
      if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') stateRef.current.keys.left = true;
      if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') stateRef.current.keys.right = true;
      if (e.code === 'KeyR') resetGame();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') stateRef.current.keys.up = false;
      if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') stateRef.current.keys.down = false;
      if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') stateRef.current.keys.left = false;
      if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') stateRef.current.keys.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    resetGame();

    // 1s shift countdown
    const timerInterval = setInterval(() => {
      const s = stateRef.current;
      if (!s.gameOver) {
        s.shiftTime--;
        setShiftTime(s.shiftTime);
        if (s.shiftTime <= 0) {
          s.shiftTime = 0;
          s.gameOver = true;
          sounds.playGameOver();
          const rec = saveHighScore('taxi-rush', s.cash);
          if (rec) {
            setIsNewRecord(true);
            setHighScore(s.cash);
          }
          setIsGameOver(true);
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(timerInterval);
    };
  }, [resetGame]);

  // Main Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const loop = () => {
      const s = stateRef.current;
      const width = canvas.width;
      const height = canvas.height;

      if (!s.gameOver) {
        // Taxi Driving Physics
        const maxSpeed = 5.5;
        if (s.keys.up) {
          s.speed = Math.min(maxSpeed, s.speed + 0.22);
        } else if (s.keys.down) {
          s.speed = Math.max(-2.5, s.speed - 0.3);
        } else {
          s.speed *= 0.94;
        }

        if (Math.abs(s.speed) > 0.1) {
          const steerDir = s.speed > 0 ? 1 : -1;
          if (s.keys.left) s.angle -= 0.055 * steerDir;
          if (s.keys.right) s.angle += 0.055 * steerDir;
        }

        s.taxiX += Math.cos(s.angle) * s.speed;
        s.taxiY += Math.sin(s.angle) * s.speed;

        // Boundaries
        s.taxiX = Math.max(30, Math.min(width - 30, s.taxiX));
        s.taxiY = Math.max(30, Math.min(height - 30, s.taxiY));

        // Passenger Pickup & Dropoff Logic
        const p = s.currentPassenger;
        if (p) {
          if (!s.hasPassenger) {
            // Check pickup proximity
            const dist = Math.hypot(s.taxiX - p.pickupX, s.taxiY - p.pickupY);
            if (dist < 42 && Math.abs(s.speed) < 1.8) {
              s.hasPassenger = true;
              setHasPassenger(true);
              sounds.playCoin();
            }
          } else {
            // Check dropoff proximity
            const dist = Math.hypot(s.taxiX - p.dropX, s.taxiY - p.dropY);
            if (dist < 46 && Math.abs(s.speed) < 1.8) {
              s.hasPassenger = false;
              setHasPassenger(false);
              s.cash += p.fare;
              s.shiftTime += 12; // Bonus time reward!
              s.trips += 1;
              sounds.playVictory();

              setCash(s.cash);
              setShiftTime(s.shiftTime);
              setTripsCompleted(s.trips);

              // Next passenger
              s.currentPassenger = spawnPassenger();
            }
          }
        }

        // Update Traffic NPCs
        for (const t of s.traffic) {
          if (t.direction === 'H') {
            t.x += t.speed;
            if (t.x > width + 40) t.x = -40;
            if (t.x < -40) t.x = width + 40;
          } else {
            t.y += t.speed;
            if (t.y > height + 40) t.y = -40;
            if (t.y < -40) t.y = height + 40;
          }

          // Collision with traffic
          if (Math.hypot(s.taxiX - t.x, s.taxiY - t.y) < 36) {
            s.speed = -s.speed * 0.8;
            s.shiftTime = Math.max(0, s.shiftTime - 3); // Penalty for traffic crash
            sounds.playCrash();
          }
        }
      }

      // RENDER
      ctx.fillStyle = '#080c16';
      ctx.fillRect(0, 0, width, height);

      // City Grid: City Blocks & Streets
      // Buildings blocks
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = '#1f293d';
      ctx.lineWidth = 3;

      const blocks = [
        { x: 30, y: 30, w: 140, h: 60 },
        { x: 230, y: 30, w: 180, h: 60 },
        { x: 470, y: 30, w: 140, h: 60 },

        { x: 30, y: 150, w: 140, h: 60 },
        { x: 230, y: 150, w: 180, h: 60 },
        { x: 470, y: 150, w: 140, h: 60 },

        { x: 30, y: 270, w: 140, h: 60 },
        { x: 230, y: 270, w: 180, h: 60 },
        { x: 470, y: 270, w: 140, h: 60 },

        { x: 30, y: 390, w: 140, h: 60 },
        { x: 230, y: 390, w: 180, h: 60 },
        { x: 470, y: 390, w: 140, h: 60 },
      ];

      for (const b of blocks) {
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeRect(b.x, b.y, b.w, b.h);
        // Roof windows
        ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
        ctx.fillRect(b.x + 10, b.y + 10, b.w - 20, b.h - 20);
        ctx.fillStyle = '#111827';
      }

      // Street Asphalt
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      // Horizontal lane lines
      [120, 240, 360].forEach((y) => {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      });
      // Vertical lane lines
      [200, 440].forEach((x) => {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Render Passenger Beacon / Dropoff Zone
      const p = s.currentPassenger;
      if (p) {
        if (!s.hasPassenger) {
          // Waiting Passenger Icon & Ring
          ctx.save();
          ctx.strokeStyle = '#eab308';
          ctx.lineWidth = 3;
          ctx.shadowColor = '#eab308';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(p.pickupX, p.pickupY, 22, 0, Math.PI * 2);
          ctx.stroke();

          // Human silhouette
          ctx.fillStyle = '#eab308';
          ctx.beginPath();
          ctx.arc(p.pickupX, p.pickupY - 4, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(p.pickupX - 4, p.pickupY + 2, 8, 8);

          // Name & Fare Tag
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`${p.name} ($${p.fare})`, p.pickupX, p.pickupY - 18);
          ctx.restore();
        } else {
          // Dropoff Destination Zone (Neon Cyan Beacon)
          ctx.save();
          ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 3;
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(p.dropX, p.dropY, 26, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#00f0ff';
          ctx.font = '900 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('DROP HERE', p.dropX, p.dropY - 14);
          ctx.restore();
        }
      }

      // Render Traffic NPCs
      for (const t of s.traffic) {
        drawCarTopDown({
          ctx,
          x: t.x,
          y: t.y,
          angle: t.direction === 'H' ? (t.speed > 0 ? 0 : Math.PI) : t.speed > 0 ? Math.PI / 2 : -Math.PI / 2,
          width: 54,
          height: 28,
          primaryColor: t.color,
          accentColor: '#ffffff',
          type: 'sedan',
          headlights: false,
        });
      }

      // Render Yellow City Taxi
      drawCarTopDown({
        ctx,
        x: s.taxiX,
        y: s.taxiY,
        angle: s.angle,
        width: 60,
        height: 30,
        primaryColor: '#eab308',
        accentColor: '#000000',
        type: 'taxi',
        brakeLights: s.keys.down,
        headlights: true,
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Top HUD */}
      <div className="w-full max-w-[640px] mb-2 flex items-center justify-between px-4 py-2 bg-brand-card/90 border border-brand-border rounded-xl backdrop-blur-md shadow-md text-sm">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-mono">Shift Earnings</span>
            <span className="text-2xl font-black text-yellow-400 font-mono">${cash}</span>
          </div>
          <div className="border-l border-brand-border pl-4">
            <span className="text-[10px] text-gray-400 block uppercase font-mono">Fares</span>
            <span className="text-lg font-bold text-brand-cyan font-mono">{tripsCompleted}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {hasPassenger ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 border border-green-500 rounded-lg text-green-400 font-bold text-xs animate-pulse">
              <Users className="w-4 h-4" /> ONBOARD
            </div>
          ) : (
            <div className="text-xs text-yellow-400/80 font-mono">LOOKING FOR FARE</div>
          )}

          <div className="flex items-center gap-1 text-right">
            <Clock className={`w-4 h-4 ${shiftTime < 10 ? 'text-red-500 animate-spin' : 'text-gray-400'}`} />
            <span
              className={`text-xl font-black font-mono ${
                shiftTime < 10 ? 'text-red-500 animate-pulse' : 'text-gray-200'
              }`}
            >
              {shiftTime}s
            </span>
          </div>

          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-brand-border/40 hover:bg-brand-border text-gray-300 transition"
            title="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-brand-cyan" />}
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-brand-border shadow-2xl bg-brand-darker">
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="block w-full max-w-[640px] h-[340px] sm:h-[480px] touch-none"
        />

        {/* Shift Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <span className="text-yellow-400 font-black tracking-widest text-3xl mb-1 uppercase drop-shadow-lg">
              SHIFT COMPLETE!
            </span>
            <p className="text-gray-300 text-sm mb-4">You clocked out from your taxi shift.</p>

            {isNewRecord && (
              <div className="mb-4 px-4 py-1.5 bg-yellow-400/20 border border-yellow-400 rounded-full text-yellow-400 text-sm font-bold animate-pulse">
                🏆 NEW EARNINGS RECORD!
              </div>
            )}

            <div className="bg-brand-card/80 border border-brand-border rounded-xl p-4 w-full max-w-[260px] mb-6">
              <div className="flex justify-between py-1 border-b border-brand-border/50 text-sm">
                <span className="text-gray-400">Total Fares</span>
                <span className="font-bold text-yellow-400 font-mono">${cash}</span>
              </div>
              <div className="flex justify-between py-1 text-sm">
                <span className="text-gray-400">Riders Delivered</span>
                <span className="font-bold text-brand-cyan font-mono">{tripsCompleted}</span>
              </div>
            </div>

            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:brightness-110 text-brand-darker font-black text-base rounded-xl shadow-lg transition"
            >
              <RotateCcw className="w-5 h-5" /> START NEW SHIFT
            </button>
          </div>
        )}
      </div>

      {/* Touch Controls */}
      <div className="w-full max-w-[640px] mt-3 flex items-center justify-between gap-2 px-2">
        <div className="flex gap-2">
          <button
            onTouchStart={() => { stateRef.current.keys.left = true; }}
            onTouchEnd={() => { stateRef.current.keys.left = false; }}
            className="w-14 h-14 bg-brand-card active:bg-yellow-400/30 border border-brand-border rounded-xl text-xl font-bold text-gray-200"
          >
            ◀
          </button>
          <button
            onTouchStart={() => { stateRef.current.keys.right = true; }}
            onTouchEnd={() => { stateRef.current.keys.right = false; }}
            className="w-14 h-14 bg-brand-card active:bg-yellow-400/30 border border-brand-border rounded-xl text-xl font-bold text-gray-200"
          >
            ▶
          </button>
        </div>

        <button
          onClick={() => sounds.playBoost()}
          className="flex-1 max-w-[140px] h-14 bg-yellow-400/20 active:bg-yellow-400/40 border border-yellow-400 rounded-xl text-xs font-black text-yellow-400 flex items-center justify-center gap-1"
        >
          📯 HONK HORN
        </button>

        <div className="flex gap-2">
          <button
            onTouchStart={() => { stateRef.current.keys.down = true; }}
            onTouchEnd={() => { stateRef.current.keys.down = false; }}
            className="w-14 h-14 bg-brand-card active:bg-red-500/30 border border-brand-border rounded-xl text-xs font-bold text-gray-200"
          >
            BRAKE
          </button>
          <button
            onTouchStart={() => { stateRef.current.keys.up = true; }}
            onTouchEnd={() => { stateRef.current.keys.up = false; }}
            className="w-14 h-14 bg-brand-card active:bg-yellow-400/30 border border-brand-border rounded-xl text-xs font-bold text-yellow-400"
          >
            DRIVE
          </button>
        </div>
      </div>
    </div>
  );
}
