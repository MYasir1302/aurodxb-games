'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sounds } from '@/lib/audio';
import { getHighScore, saveHighScore } from '@/lib/storage';
import { RotateCcw, Volume2, VolumeX, Fuel, Coins } from 'lucide-react';

interface PickupItem {
  worldX: number;
  type: 'fuel' | 'coin';
  collected: boolean;
}

export default function HillClimbRacer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [distance, setDistance] = useState(0);
  const [coins, setCoins] = useState(0);
  const [fuel, setFuel] = useState(100);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState('Ran out of fuel!');
  const [isMuted, setIsMuted] = useState(sounds.getMuted());
  const [isNewRecord, setIsNewRecord] = useState(false);

  const stateRef = useRef({
    // Car state
    carX: 200, // world coordinate
    carY: 0,
    vx: 0,
    vy: 0,
    angle: 0,
    angularVelocity: 0,
    fuel: 100,
    distance: 0,
    coins: 0,
    gameOver: false,
    pickups: [] as PickupItem[],
    keys: {
      gas: false,
      brake: false,
    },
  });

  // Smooth terrain function
  const getTerrainHeight = (worldX: number): number => {
    // Ground level starts around y=420
    const base = 420;
    const wave1 = Math.sin(worldX * 0.003) * 60;
    const wave2 = Math.cos(worldX * 0.007) * 40;
    const wave3 = Math.sin(worldX * 0.015) * 20;
    return base + wave1 + wave2 + wave3;
  };

  const resetGame = useCallback(() => {
    const s = stateRef.current;
    s.carX = 200;
    s.carY = getTerrainHeight(200) - 25;
    s.vx = 0;
    s.vy = 0;
    s.angle = 0;
    s.angularVelocity = 0;
    s.fuel = 100;
    s.distance = 0;
    s.coins = 0;
    s.gameOver = false;

    // Generate pickups ahead
    s.pickups = [];
    for (let x = 600; x < 25000; x += 350) {
      if (Math.random() > 0.6) {
        s.pickups.push({ worldX: x, type: 'fuel', collected: false });
      } else {
        s.pickups.push({ worldX: x, type: 'coin', collected: false });
      }
    }

    setDistance(0);
    setCoins(0);
    setFuel(100);
    setIsGameOver(false);
    setIsNewRecord(false);
    sounds.playClick();
  }, []);

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  useEffect(() => {
    const saved = getHighScore('hill-climb-racer');
    setHighScore(saved);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') stateRef.current.keys.gas = true;
      if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') stateRef.current.keys.brake = true;
      if (e.code === 'KeyR') resetGame();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') stateRef.current.keys.gas = false;
      if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') stateRef.current.keys.brake = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    resetGame();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [resetGame]);

  // Main Physics & Render Loop
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
        // Fuel consumption
        if (s.keys.gas) {
          s.fuel -= 0.12;
        } else {
          s.fuel -= 0.03;
        }

        if (s.fuel <= 0) {
          s.fuel = 0;
          s.gameOver = true;
          setGameOverReason('Out of Fuel!');
          sounds.playGameOver();
          const rec = saveHighScore('hill-climb-racer', s.distance);
          if (rec) {
            setIsNewRecord(true);
            setHighScore(s.distance);
          }
          setIsGameOver(true);
        }

        // Physics constants
        const gravity = 0.35;
        const wheelBase = 46;
        const carHalfWidth = wheelBase / 2;

        s.vy += gravity;

        // Wheel positions on ground
        const rearWheelX = s.carX - Math.cos(s.angle) * carHalfWidth;
        const frontWheelX = s.carX + Math.cos(s.angle) * carHalfWidth;

        const groundRearY = getTerrainHeight(rearWheelX);
        const groundFrontY = getTerrainHeight(frontWheelX);
        const groundCenterY = getTerrainHeight(s.carX);

        // Ground slope angle
        const groundAngle = Math.atan2(groundFrontY - groundRearY, wheelBase);

        // Ground collision & suspension
        const wheelRadius = 16;
        const carGroundY = (groundRearY + groundFrontY) / 2 - wheelRadius;

        const onGround = s.carY >= carGroundY - 4;

        if (onGround) {
          s.carY = carGroundY;
          s.vy = 0;

          // Normal align to terrain angle
          s.angle += (groundAngle - s.angle) * 0.18;
          s.angularVelocity *= 0.5;

          // Driving torque
          if (s.keys.gas && s.fuel > 0) {
            s.vx += Math.cos(groundAngle) * 0.45;
            s.vy += Math.sin(groundAngle) * 0.45;
          }
          if (s.keys.brake) {
            s.vx -= 0.3;
          }

          // Rolling friction
          s.vx *= 0.985;
        } else {
          // In the air! Pitch control
          if (s.keys.gas) s.angularVelocity += 0.005;
          if (s.keys.brake) s.angularVelocity -= 0.005;
          s.angularVelocity *= 0.96;
          s.angle += s.angularVelocity;
        }

        // Apply velocities
        s.carX += s.vx;
        s.carY += s.vy;

        // Prevent driving backward past start
        if (s.carX < 150) {
          s.carX = 150;
          s.vx = 0;
        }

        // Flip detection: upside down collision
        if (onGround) {
          let normalizedAngle = s.angle % (Math.PI * 2);
          if (normalizedAngle < 0) normalizedAngle += Math.PI * 2;
          if (normalizedAngle > Math.PI * 0.65 && normalizedAngle < Math.PI * 1.35) {
            s.gameOver = true;
            setGameOverReason('Driver Head Impact!');
            sounds.playCrash();
            const rec = saveHighScore('hill-climb-racer', s.distance);
            if (rec) {
              setIsNewRecord(true);
              setHighScore(s.distance);
            }
            setIsGameOver(true);
          }
        }

        // Distance in meters
        s.distance = Math.max(s.distance, Math.floor((s.carX - 200) / 10));

        // Pickups check
        s.pickups.forEach((p) => {
          if (!p.collected && Math.abs(s.carX - p.worldX) < 35) {
            const py = getTerrainHeight(p.worldX) - 30;
            if (Math.abs(s.carY - py) < 45) {
              p.collected = true;
              if (p.type === 'fuel') {
                s.fuel = Math.min(100, s.fuel + 65);
                sounds.playBoost();
              } else {
                s.coins += 10;
                sounds.playCoin();
              }
            }
          }
        });

        // Sync react state throttled
        if (Math.random() < 0.2) {
          setDistance(s.distance);
          setFuel(Math.round(s.fuel));
          setCoins(s.coins);
        }
      }

      // RENDER
      // Camera follows carX
      const cameraX = s.carX - width * 0.3;

      // Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#090d1a');
      skyGrad.addColorStop(1, '#1b223c');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Distant neon mountains (parallax)
      ctx.fillStyle = 'rgba(168, 85, 247, 0.15)';
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 50) {
        const mx = x + cameraX * 0.2;
        const my = 280 + Math.sin(mx * 0.004) * 80;
        ctx.lineTo(x, my);
      }
      ctx.lineTo(width, height);
      ctx.fill();

      // Draw Main Hills Ground
      ctx.save();
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, height);

      for (let screenX = -50; screenX <= width + 50; screenX += 15) {
        const worldX = screenX + cameraX;
        const worldY = getTerrainHeight(worldX);
        if (screenX === -50) ctx.lineTo(screenX, worldY);
        else ctx.lineTo(screenX, worldY);
      }
      ctx.lineTo(width + 50, height);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Render Pickups
      s.pickups.forEach((p) => {
        if (!p.collected) {
          const screenX = p.worldX - cameraX;
          if (screenX > -40 && screenX < width + 40) {
            const py = getTerrainHeight(p.worldX) - 30;

            ctx.save();
            ctx.translate(screenX, py);
            if (p.type === 'fuel') {
              // Red Fuel Jerrycan
              ctx.fillStyle = '#ef4444';
              ctx.fillRect(-10, -12, 20, 24);
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 9px sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText('GAS', 0, 4);
            } else {
              // Shiny Golden Coin
              ctx.fillStyle = '#eab308';
              ctx.shadowColor = '#eab308';
              ctx.shadowBlur = 8;
              ctx.beginPath();
              ctx.arc(0, 0, 11, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#fef08a';
              ctx.beginPath();
              ctx.arc(0, 0, 7, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.restore();
          }
        }
      });

      // Render 2D Offroad Buggy
      ctx.save();
      const carScreenX = s.carX - cameraX;
      ctx.translate(carScreenX, s.carY);
      ctx.rotate(s.angle);

      // Chassis Roll Cage
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.roundRect(-24, -18, 48, 16, 6);
      ctx.fill();

      // Cockpit rollcage bars
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-16, -18);
      ctx.lineTo(-6, -30);
      ctx.lineTo(14, -30);
      ctx.lineTo(20, -18);
      ctx.stroke();

      // Driver Helmet
      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.arc(4, -22, 6, 0, Math.PI * 2);
      ctx.fill();

      // Front & Rear Big Tires
      const tireRadius = 14;
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;

      // Rear Wheel
      ctx.beginPath();
      ctx.arc(-22, 8, tireRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Front Wheel
      ctx.beginPath();
      ctx.arc(22, 8, tireRadius, 0, Math.PI * 2);
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
            <span className="text-2xl font-black text-green-400 font-mono">{distance}m</span>
          </div>
          <div className="border-l border-brand-border pl-4">
            <span className="text-xs text-gray-400 block uppercase font-mono">Best</span>
            <span className="text-lg font-bold text-brand-purple font-mono">{highScore}m</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Fuel Bar */}
          <div className="flex items-center gap-2">
            <Fuel className={`w-4 h-4 ${fuel < 25 ? 'text-red-500 animate-bounce' : 'text-yellow-400'}`} />
            <div className="w-24 h-3 bg-brand-darker rounded-full overflow-hidden border border-brand-border">
              <div
                className={`h-full transition-all duration-100 ${
                  fuel > 40 ? 'bg-green-500' : fuel > 20 ? 'bg-yellow-400' : 'bg-red-500 animate-pulse'
                }`}
                style={{ width: `${fuel}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 text-yellow-400 font-bold font-mono">
            <Coins className="w-4 h-4" /> {coins}
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

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <span className="text-red-500 font-black tracking-widest text-3xl mb-1 uppercase drop-shadow-lg">
              {gameOverReason}
            </span>
            <p className="text-gray-300 text-sm mb-4">Off-road run finished!</p>

            {isNewRecord && (
              <div className="mb-4 px-4 py-1.5 bg-green-500/20 border border-green-500 rounded-full text-green-400 text-sm font-bold animate-pulse">
                🏆 NEW DISTANCE RECORD!
              </div>
            )}

            <div className="bg-brand-card/80 border border-brand-border rounded-xl p-4 w-full max-w-[260px] mb-6">
              <div className="flex justify-between py-1 border-b border-brand-border/50 text-sm">
                <span className="text-gray-400">Distance</span>
                <span className="font-bold text-green-400 font-mono">{distance}m</span>
              </div>
              <div className="flex justify-between py-1 text-sm">
                <span className="text-gray-400">Coins</span>
                <span className="font-bold text-yellow-400 font-mono">{coins}</span>
              </div>
            </div>

            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 to-brand-cyan hover:brightness-110 text-brand-darker font-black text-base rounded-xl shadow-lg transition"
            >
              <RotateCcw className="w-5 h-5" /> CLIMB AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Touch Controls */}
      <div className="w-full max-w-[640px] mt-3 flex items-center justify-between gap-4 px-4">
        <button
          onTouchStart={() => { stateRef.current.keys.brake = true; }}
          onTouchEnd={() => { stateRef.current.keys.brake = false; }}
          onMouseDown={() => { stateRef.current.keys.brake = true; }}
          onMouseUp={() => { stateRef.current.keys.brake = false; }}
          className="flex-1 py-4 bg-brand-card active:bg-red-500/30 border border-brand-border rounded-xl text-base font-bold text-gray-200 shadow"
        >
          ◀ BRAKE / TILT
        </button>
        <button
          onTouchStart={() => { stateRef.current.keys.gas = true; }}
          onTouchEnd={() => { stateRef.current.keys.gas = false; }}
          onMouseDown={() => { stateRef.current.keys.gas = true; }}
          onMouseUp={() => { stateRef.current.keys.gas = false; }}
          className="flex-1 py-4 bg-brand-card active:bg-green-500/30 border border-brand-border rounded-xl text-base font-bold text-green-400 shadow"
        >
          GAS / ACCEL ▶
        </button>
      </div>
    </div>
  );
}
