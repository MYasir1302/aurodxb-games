'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sounds } from '@/lib/audio';
import { getHighScore, saveHighScore } from '@/lib/storage';
import { RotateCcw, Volume2, VolumeX, Rocket, Award } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

export default function StuntRampJump() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [distance, setDistance] = useState(0);
  const [airTime, setAirTime] = useState(0);
  const [flips, setFlips] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [nitroFuel, setNitroFuel] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);
  const [landingStatus, setLandingStatus] = useState<'CRASH' | 'PERFECT' | 'GREAT'>('PERFECT');
  const [isMuted, setIsMuted] = useState(sounds.getMuted());
  const [isNewRecord, setIsNewRecord] = useState(false);

  const stateRef = useRef({
    // Game stage: 'ramp' -> 'air' -> 'landed' -> 'gameover'
    phase: 'ramp' as 'ramp' | 'air' | 'landed' | 'gameover',
    x: 60,
    y: 180,
    vx: 0,
    vy: 0,
    angle: 0.38,
    angularVelocity: 0,
    totalRotation: 0,
    flips: 0,
    airTime: 0,
    nitro: 100,
    distance: 0,
    score: 0,
    particles: [] as Particle[],
    keys: {
      gas: false,
      nitro: false,
      tiltLeft: false,
      tiltRight: false,
    },
  });

  const resetGame = useCallback(() => {
    const s = stateRef.current;
    s.phase = 'ramp';
    s.x = 60;
    s.y = 180;
    s.vx = 2;
    s.vy = 0;
    s.angle = 0.38;
    s.angularVelocity = 0;
    s.totalRotation = 0;
    s.flips = 0;
    s.airTime = 0;
    s.nitro = 100;
    s.distance = 0;
    s.score = 0;
    s.particles = [];

    setDistance(0);
    setAirTime(0);
    setFlips(0);
    setNitroFuel(100);
    setIsGameOver(false);
    setIsNewRecord(false);
    sounds.playClick();
  }, []);

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  useEffect(() => {
    const saved = getHighScore('stunt-ramp-jump');
    setHighScore(saved);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') stateRef.current.keys.gas = true;
      if (e.code === 'Space') stateRef.current.keys.nitro = true;
      if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') stateRef.current.keys.tiltLeft = true;
      if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') stateRef.current.keys.tiltRight = true;
      if (e.code === 'KeyR') resetGame();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') stateRef.current.keys.gas = false;
      if (e.code === 'Space') stateRef.current.keys.nitro = false;
      if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') stateRef.current.keys.tiltLeft = false;
      if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') stateRef.current.keys.tiltRight = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    resetGame();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
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

      // PHASE 1: DRIVING DOWN RAMP
      if (s.phase === 'ramp') {
        const rampAccel = 0.35;
        if (s.keys.gas) s.vx += rampAccel;
        else s.vx += 0.15; // Gravity down ramp

        if (s.keys.nitro && s.nitro > 0) {
          s.vx += 0.55;
          s.nitro -= 1.2;
          sounds.playBoost();
        }

        // Move along ramp slope (from x=60,y=180 to x=280,y=320 then upward kicker at x=340, y=280)
        if (s.x < 280) {
          s.x += s.vx * 0.85;
          s.y = 180 + (s.x - 60) * 0.64;
          s.angle = 0.38;
        } else if (s.x < 360) {
          // Launch kicker ramp
          s.x += s.vx * 0.85;
          s.y = 320 - Math.sin(((s.x - 280) / 80) * (Math.PI / 2)) * 60;
          s.angle = -0.55;
        } else {
          // LAUNCH INTO AIR!
          s.phase = 'air';
          s.vy = -s.vx * 0.75;
          s.vx = s.vx * 1.1;
          sounds.playBoost();
        }
      }

      // PHASE 2: IN MID-AIR FLIGHT
      else if (s.phase === 'air') {
        s.airTime += 0.016;

        // Nitro Rocket in Air
        if (s.keys.nitro && s.nitro > 0) {
          s.vx += Math.cos(s.angle) * 0.35;
          s.vy += Math.sin(s.angle) * 0.35;
          s.nitro -= 1;

          // Rocket smoke trail
          s.particles.push({
            x: s.x - Math.cos(s.angle) * 25,
            y: s.y - Math.sin(s.angle) * 25,
            vx: (Math.random() - 0.5) * 2 - Math.cos(s.angle) * 4,
            vy: (Math.random() - 0.5) * 2 - Math.sin(s.angle) * 4,
            color: Math.random() > 0.5 ? '#f97316' : '#00f0ff',
            size: 4 + Math.random() * 4,
            life: 1,
          });
        }

        // Air Tilt / Flips
        const tiltPower = 0.007;
        if (s.keys.tiltLeft) {
          s.angularVelocity -= tiltPower;
        }
        if (s.keys.tiltRight) {
          s.angularVelocity += tiltPower;
        }

        s.angularVelocity *= 0.98;
        s.angle += s.angularVelocity;
        s.totalRotation += s.angularVelocity;

        // Count completed 360 flips
        const totalFlips = Math.floor(Math.abs(s.totalRotation) / (Math.PI * 2));
        if (totalFlips > s.flips) {
          s.flips = totalFlips;
          sounds.playCoin();
        }

        // Gravity
        s.vy += 0.28;
        s.x += s.vx;
        s.y += s.vy;

        // Distance in meters
        s.distance = Math.floor((s.x - 360) / 8);

        // Ground collision level is y=420
        if (s.y >= 420) {
          s.y = 420;
          s.phase = 'landed';

          // Check landing angle
          let normAngle = Math.abs(s.angle % (Math.PI * 2));
          if (normAngle > Math.PI) normAngle = Math.PI * 2 - normAngle;

          const isCleanLanding = normAngle < 0.65; // within ~37 degrees

          let totalScore = s.distance * 10 + Math.floor(s.airTime * 200) + s.flips * 500;

          if (isCleanLanding) {
            totalScore = Math.floor(totalScore * 1.5);
            setLandingStatus('PERFECT');
            sounds.playVictory();
          } else {
            setLandingStatus('CRASH');
            sounds.playCrash();
            // Crash explosion
            for (let i = 0; i < 40; i++) {
              s.particles.push({
                x: s.x,
                y: s.y,
                vx: (Math.random() - 0.5) * 14,
                vy: (Math.random() - 0.5) * 14,
                color: '#ff3300',
                size: 5 + Math.random() * 6,
                life: 1,
              });
            }
          }

          s.score = totalScore;
          const rec = saveHighScore('stunt-ramp-jump', totalScore);
          if (rec) {
            setIsNewRecord(true);
            setHighScore(totalScore);
          }
          setIsGameOver(true);
        }
      }

      // Update particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;
        if (p.life <= 0) s.particles.splice(i, 1);
      }

      // Throttle react HUD updates
      if (Math.random() < 0.25) {
        setDistance(s.distance);
        setAirTime(parseFloat(s.airTime.toFixed(1)));
        setFlips(s.flips);
        setNitroFuel(Math.round(s.nitro));
      }

      // RENDER
      // Camera follows car
      const cameraX = Math.max(0, s.x - width * 0.35);

      // Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#060814');
      skyGrad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Mega Ramp Structure
      ctx.save();
      const rampScreenStart = 60 - cameraX;
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 4;

      ctx.beginPath();
      ctx.moveTo(rampScreenStart, 190);
      ctx.lineTo(280 - cameraX, 330);
      ctx.lineTo(360 - cameraX, 270); // Kicker tip
      ctx.lineTo(360 - cameraX, height);
      ctx.lineTo(rampScreenStart, height);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Launch Arrow on Kicker
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 16px sans-serif';
      ctx.fillText('▲ LAUNCH', 290 - cameraX, 290);
      ctx.restore();

      // Flat Landing Strip (from x=360 onwards)
      ctx.save();
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 4;
      ctx.fillRect(360 - cameraX, 420, width * 10, height - 420);
      ctx.beginPath();
      ctx.moveTo(360 - cameraX, 420);
      ctx.lineTo(360 - cameraX + width * 10, 420);
      ctx.stroke();

      // Obstacle 1: Stunt Buses to jump over (at x=600 and x=750)
      const busX1 = 600 - cameraX;
      if (busX1 > -120 && busX1 < width + 120) {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(busX1, 350, 100, 70);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('BUS', busX1 + 35, 390);
      }

      const busX2 = 720 - cameraX;
      if (busX2 > -120 && busX2 < width + 120) {
        ctx.fillStyle = '#eab308';
        ctx.fillRect(busX2, 350, 100, 70);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('BUS', busX2 + 35, 390);
      }

      // Obstacle 2: Floating Ring of Fire at x=1050, y=260
      const ringX = 1050 - cameraX;
      if (ringX > -60 && ringX < width + 60) {
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 10;
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(ringX, 260, 45, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      ctx.restore();

      // Render Particles
      for (const p of s.particles) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x - cameraX, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Render Stunt Sports Car (Side View)
      ctx.save();
      const carScreenX = s.x - cameraX;
      ctx.translate(carScreenX, s.y);
      ctx.rotate(s.angle);

      // Rocket Booster Thruster
      if (s.keys.nitro && s.nitro > 0) {
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(-26, 0, 7 + Math.random() * 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Aerodynamic Stunt Body
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.roundRect(-24, -14, 48, 16, 5);
      ctx.fill();

      // Big Stunt Rear Wing
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-26, -22, 6, 12);
      ctx.fillRect(-28, -24, 16, 4);

      // Windshield
      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.moveTo(-4, -14);
      ctx.lineTo(8, -14);
      ctx.lineTo(16, -6);
      ctx.lineTo(-4, -6);
      ctx.closePath();
      ctx.fill();

      // Tires
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-16, 6, 10, 0, Math.PI * 2);
      ctx.arc(16, 6, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.restore();

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
            <span className="text-xs text-gray-400 block uppercase font-mono">Distance</span>
            <span className="text-2xl font-black text-orange-400 font-mono">{distance}m</span>
          </div>
          <div className="border-l border-brand-border pl-4">
            <span className="text-xs text-gray-400 block uppercase font-mono">Air Time</span>
            <span className="text-lg font-bold text-brand-cyan font-mono">{airTime}s</span>
          </div>
          <div className="border-l border-brand-border pl-4">
            <span className="text-xs text-gray-400 block uppercase font-mono">Flips</span>
            <span className="text-lg font-bold text-yellow-400 font-mono">{flips}x</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Rocket Nitro Gauge */}
          <div className="flex items-center gap-1.5">
            <Rocket className="w-4 h-4 text-orange-400" />
            <div className="w-20 h-3 bg-brand-darker rounded-full overflow-hidden border border-brand-border">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-brand-cyan transition-all duration-100"
                style={{ width: `${nitroFuel}%` }}
              />
            </div>
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

        {/* Jump Completed Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <span
              className={`font-black tracking-widest text-3xl mb-1 uppercase drop-shadow-lg ${
                landingStatus === 'PERFECT' ? 'text-green-400' : 'text-red-500'
              }`}
            >
              {landingStatus === 'PERFECT' ? 'STUCK THE LANDING!' : 'CRASH LANDING!'}
            </span>
            <p className="text-gray-300 text-sm mb-4">Insane mega-ramp airtime recorded!</p>

            {isNewRecord && (
              <div className="mb-4 px-4 py-1.5 bg-orange-500/20 border border-orange-500 rounded-full text-orange-400 text-sm font-bold animate-pulse">
                🏆 NEW MEGA JUMP RECORD!
              </div>
            )}

            <div className="bg-brand-card/80 border border-brand-border rounded-xl p-4 w-full max-w-[260px] mb-6">
              <div className="flex justify-between py-1 border-b border-brand-border/50 text-sm">
                <span className="text-gray-400">Total Score</span>
                <span className="font-bold text-orange-400 font-mono">{stateRef.current.score}</span>
              </div>
              <div className="flex justify-between py-1 text-sm">
                <span className="text-gray-400">High Score</span>
                <span className="font-bold text-brand-cyan font-mono">{highScore}</span>
              </div>
            </div>

            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-400 to-brand-purple hover:brightness-110 text-brand-darker font-black text-base rounded-xl shadow-lg transition"
            >
              <RotateCcw className="w-5 h-5" /> JUMP AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Touch Controls */}
      <div className="w-full max-w-[640px] mt-3 flex items-center justify-between gap-3 px-2">
        <div className="flex gap-2">
          <button
            onTouchStart={() => { stateRef.current.keys.tiltLeft = true; }}
            onTouchEnd={() => { stateRef.current.keys.tiltLeft = false; }}
            className="w-14 h-14 bg-brand-card active:bg-orange-500/30 border border-brand-border rounded-xl text-xs font-bold text-gray-200"
          >
            FLIP ↺
          </button>
          <button
            onTouchStart={() => { stateRef.current.keys.tiltRight = true; }}
            onTouchEnd={() => { stateRef.current.keys.tiltRight = false; }}
            className="w-14 h-14 bg-brand-card active:bg-orange-500/30 border border-brand-border rounded-xl text-xs font-bold text-gray-200"
          >
            ↻ FLIP
          </button>
        </div>

        <button
          onTouchStart={() => { stateRef.current.keys.nitro = true; }}
          onTouchEnd={() => { stateRef.current.keys.nitro = false; }}
          className="flex-1 max-w-[170px] h-14 bg-orange-500/20 active:bg-orange-500/50 border border-orange-500 rounded-xl text-sm font-black text-orange-400 flex items-center justify-center gap-1 shadow-neonPink"
        >
          <Rocket className="w-5 h-5" /> ROCKET BOOST
        </button>

        <button
          onTouchStart={() => { stateRef.current.keys.gas = true; }}
          onTouchEnd={() => { stateRef.current.keys.gas = false; }}
          className="w-20 h-14 bg-brand-card active:bg-brand-cyan/30 border border-brand-border rounded-xl text-sm font-black text-brand-cyan"
        >
          RAMP GAS
        </button>
      </div>
    </div>
  );
}
