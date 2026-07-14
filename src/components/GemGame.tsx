import { useState, useEffect, useRef } from 'react';
import { Gamepad2, Trophy, RefreshCw, Sparkles, Zap, Shield, Star } from 'lucide-react';

interface GemGameProps {
  onScorePoints: (pts: number, message?: string) => void;
  onSoundTrigger: (type: 'coin' | 'laser' | 'powerup' | 'gem') => void;
  gemsCount: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  vy: number;
  life: number;
  maxLife: number;
}

interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  gemType: 'ruby' | 'emerald' | 'sapphire' | 'amethyst';
  points: number;
  intact: boolean;
  skillLabel: string;
}

interface FallingGem {
  x: number;
  y: number;
  vy: number;
  size: number;
  color: string;
  gemType: 'ruby' | 'emerald' | 'sapphire' | 'amethyst' | 'coin';
  points: number;
}

export default function GemGame({ onScorePoints, onSoundTrigger, gemsCount }: GemGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('arcade_gem_highscore');
    return saved ? parseInt(saved, 10) : 500;
  });
  const [isPaused, setIsPaused] = useState(false);

  
  const animationFrameIdRef = useRef<number | null>(null);
  const gameStateRef = useRef({
    score: 0,
    paddleX: 160,
    paddleW: 75,
    paddleH: 10,
    ballX: 200,
    ballY: 250,
    ballVX: 2.0,
    ballVY: -3.5,
    ballRadius: 6,
    bricks: [] as Brick[],
    fallingGems: [] as FallingGem[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
  });

  const mouseRef = useRef({ x: 160 });

  
  const initGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cols = 6;
    const rows = 4;
    const brickW = 46;
    const brickH = 14;
    const padding = 6;
    const offsetTop = 40;
    
    
    const offsetLeft = 17;

    const skillsGrid = [
      ['C++', 'ALGOs', 'OOP', 'STL', 'POINTERS', 'MEM_MGMT'],
      ['REACT', 'NEXTJS', 'TYPESCRIPT', 'TAILWIND', 'VITE', 'STATE'],
      ['FIRESTORE', 'SQL', 'EXPRESS', 'NODE.JS', 'REST APIs', 'OAUTH'],
      ['D3.JS', 'RECHARTS', 'CANVAS', 'CHIPTUNE', 'MOTION', 'AUDIO']
    ];

    const gemTypes: ('ruby' | 'emerald' | 'sapphire' | 'amethyst')[] = ['ruby', 'emerald', 'sapphire', 'amethyst'];
    const gemColors = {
      ruby: '#ff2a5f',       
      emerald: '#00ff41',    
      sapphire: '#00e5ff',   
      amethyst: '#ff00ff',   
    };

    const bricks: Brick[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const type = gemTypes[r % gemTypes.length];
        const skillLabel = skillsGrid[r][c] || 'SKILL';
        bricks.push({
          x: offsetLeft + c * (brickW + padding),
          y: offsetTop + r * (brickH + padding),
          w: brickW,
          h: brickH,
          color: gemColors[type],
          gemType: type,
          points: (rows - r) * 20,
          intact: true,
          skillLabel,
        });
      }
    }

    gameStateRef.current = {
      score: 0,
      paddleX: canvas.width / 2 - 37.5,
      paddleW: 75,
      paddleH: 10,
      ballX: canvas.width / 2,
      ballY: canvas.height - 45,
      ballVX: (Math.random() * 2 - 1) * 1.5 || 1.5, 
      ballVY: -3.5, 
      ballRadius: 6,
      bricks,
      fallingGems: [],
      particles: [],
      floatingTexts: [],
    };

    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setIsPaused(false);
  };

  const spawnParticles = (x: number, y: number, color: string, count = 10) => {
    const state = gameStateRef.current;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2.5; 
      state.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: Math.random() * 3 + 1,
        life: 0,
        maxLife: Math.random() * 12 + 8, 
      });
    }
  };

  const spawnFloatingText = (x: number, y: number, text: string, color: string) => {
    const state = gameStateRef.current;
    state.floatingTexts.push({
      x,
      y,
      text,
      color,
      vy: -2.2, 
      life: 0,
      maxLife: 25,
    });
  };

  const spawnFallingGem = (x: number, y: number, gemType: 'ruby' | 'emerald' | 'sapphire' | 'amethyst') => {
    const state = gameStateRef.current;
    const colors = {
      ruby: '#ff2a5f',
      emerald: '#00ff41',
      sapphire: '#00e5ff',
      amethyst: '#ff00ff',
    };
    
    
    const isCoin = Math.random() > 0.6;
    state.fallingGems.push({
      x,
      y,
      vy: 3.5, 
      size: 11,
      color: isCoin ? '#fbbf24' : colors[gemType],
      gemType: isCoin ? 'coin' : gemType,
      points: isCoin ? 50 : 30,
    });
  };

  
  const updateGame = () => {
    const canvas = canvasRef.current;
    if (!canvas || isPaused) return;

    const state = gameStateRef.current;

    
    const targetX = mouseRef.current.x - state.paddleW / 2;
    state.paddleX += (targetX - state.paddleX) * 0.45; 

    
    if (state.paddleX < 0) state.paddleX = 0;
    if (state.paddleX + state.paddleW > canvas.width) {
      state.paddleX = canvas.width - state.paddleW;
    }

    
    state.ballX += state.ballVX;
    state.ballY += state.ballVY;

    
    if (state.ballX - state.ballRadius < 0) {
      state.ballX = state.ballRadius;
      state.ballVX = -state.ballVX;
      onSoundTrigger('laser');
    } else if (state.ballX + state.ballRadius > canvas.width) {
      state.ballX = canvas.width - state.ballRadius;
      state.ballVX = -state.ballVX;
      onSoundTrigger('laser');
    }

    
    if (state.ballY - state.ballRadius < 0) {
      state.ballY = state.ballRadius;
      state.ballVY = -state.ballVY;
      onSoundTrigger('laser');
    }

    
    if (state.ballY + state.ballRadius > canvas.height) {
      setIsPlaying(false);
      setGameOver(true);
      return;
    }

    
    if (
      state.ballY + state.ballRadius >= canvas.height - 25 &&
      state.ballY - state.ballRadius <= canvas.height - 15 &&
      state.ballX >= state.paddleX &&
      state.ballX <= state.paddleX + state.paddleW
    ) {
      
      const relativeHit = (state.ballX - (state.paddleX + state.paddleW / 2)) / (state.paddleW / 2);
      state.ballVX = relativeHit * 3.0; 
      state.ballVY = -Math.abs(state.ballVY);
      state.ballY = canvas.height - 25 - state.ballRadius; 
      onSoundTrigger('laser');
      spawnParticles(state.ballX, state.ballY, '#ff00ff', 8);
    }

    
    let remainingBricks = 0;
    state.bricks.forEach((brick) => {
      if (!brick.intact) return;
      remainingBricks++;

      
      const closestX = Math.max(brick.x, Math.min(state.ballX, brick.x + brick.w));
      const closestY = Math.max(brick.y, Math.min(state.ballY, brick.y + brick.h));
      
      const distanceX = state.ballX - closestX;
      const distanceY = state.ballY - closestY;
      const distanceSquared = distanceX * distanceX + distanceY * distanceY;

      if (distanceSquared < state.ballRadius * state.ballRadius) {
        
        brick.intact = false;
        onSoundTrigger('gem');
        
        
        spawnParticles(brick.x + brick.w / 2, brick.y + brick.h / 2, brick.color, 15);
        spawnFloatingText(brick.x + brick.w / 2, brick.y + brick.h / 2, `+ ${brick.skillLabel}`, brick.color);
        
        
        state.score += brick.points;
        setScore(state.score);
        onScorePoints(brick.points, `SHATTERED ${brick.skillLabel} BLOCK!`);

        
        if (Math.random() < 0.85) {
          spawnFallingGem(brick.x + brick.w / 2, brick.y + brick.h, brick.gemType);
        }

        
        if (Math.abs(distanceX) > Math.abs(distanceY)) {
          state.ballVX = -state.ballVX;
        } else {
          state.ballVY = -state.ballVY;
        }

        
        const speedMultiplier = 1.01;
        if (Math.abs(state.ballVX) < 6) state.ballVX *= speedMultiplier;
        if (Math.abs(state.ballVY) < 6) state.ballVY *= speedMultiplier;
      }
    });

    
    if (remainingBricks === 0 && state.bricks.length > 0) {
      setIsPlaying(false);
      setGameWon(true);
      onSoundTrigger('powerup');
      
      
      if (state.score > highScore) {
        setHighScore(state.score);
        localStorage.setItem('arcade_gem_highscore', state.score.toString());
      }
      return;
    }

    
    state.fallingGems.forEach((gem, idx) => {
      gem.y += gem.vy;

      
      if (
        gem.y + gem.size >= canvas.height - 25 &&
        gem.y - gem.size <= canvas.height - 15 &&
        gem.x >= state.paddleX &&
        gem.x <= state.paddleX + state.paddleW
      ) {
        
        state.score += gem.points;
        setScore(state.score);
        onScorePoints(gem.points, gem.gemType === 'coin' ? 'CAPTURED BONUS GOLD!' : `CAPTURED ${gem.gemType.toUpperCase()} SKILL GEM!`);
        onSoundTrigger('coin');
        
        
        spawnParticles(gem.x, gem.y, gem.color, 15);
        state.fallingGems.splice(idx, 1);
      } else if (gem.y > canvas.height) {
        
        state.fallingGems.splice(idx, 1);
      }
    });

    
    state.particles.forEach((p, idx) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      if (p.life >= p.maxLife) {
        state.particles.splice(idx, 1);
      }
    });

    
    state.floatingTexts.forEach((ft, idx) => {
      ft.y += ft.vy;
      ft.life++;
      if (ft.life >= ft.maxLife) {
        state.floatingTexts.splice(idx, 1);
      }
    });
  };

  
  const drawGame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const state = gameStateRef.current;

    
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    
    ctx.strokeStyle = '#151515';
    ctx.lineWidth = 1;
    const gridSize = 20;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    
    state.bricks.forEach((brick) => {
      if (!brick.intact) return;

      
      ctx.fillStyle = brick.color;
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fill();

      
      ctx.strokeStyle = '#050505';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(brick.x, brick.y, brick.w, brick.h);

      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fillRect(brick.x + 1, brick.y + 1, brick.w - 2, 2.2);

      
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 7px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(brick.skillLabel, brick.x + brick.w / 2, brick.y + brick.h / 2 + 0.5);
    });

    
    ctx.fillStyle = '#00ff41'; 
    ctx.shadowColor = '#00ff41';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.rect(state.paddleX, canvas.height - 25, state.paddleW, state.paddleH);
    ctx.fill();
    ctx.shadowBlur = 0; 

    
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(state.paddleX + 4, canvas.height - 23, state.paddleW - 8, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(state.paddleX + 16, canvas.height - 23, state.paddleW - 32, 2);

    
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00ff41';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(state.ballX, state.ballY, state.ballRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    
    state.fallingGems.forEach((gem) => {
      ctx.fillStyle = gem.color;
      ctx.shadowColor = gem.color;
      ctx.shadowBlur = 12;
      
      ctx.beginPath();
      if (gem.gemType === 'coin') {
        
        ctx.arc(gem.x, gem.y, gem.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef08a'; 
        ctx.arc(gem.x, gem.y, gem.size / 4.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        
        ctx.moveTo(gem.x, gem.y - gem.size / 1.8);
        ctx.lineTo(gem.x + gem.size / 1.8, gem.y);
        ctx.lineTo(gem.x, gem.y + gem.size / 1.8);
        ctx.lineTo(gem.x - gem.size / 1.8, gem.y);
        ctx.closePath();
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    });

    
    state.particles.forEach((p) => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);
      ctx.beginPath();
      ctx.rect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size); 
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    
    state.floatingTexts.forEach((ft) => {
      ctx.fillStyle = ft.color;
      ctx.font = '800 9px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.globalAlpha = Math.max(0, 1 - ft.life / ft.maxLife);
      
      
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2.5;
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillText(ft.text, ft.x, ft.y);
    });
    ctx.globalAlpha = 1.0;
  };

  
  useEffect(() => {
    const loop = () => {
      if (isPlaying && !isPaused) {
        updateGame();
      }
      drawGame();
      animationFrameIdRef.current = requestAnimationFrame(loop);
    };

    if (isPlaying) {
      animationFrameIdRef.current = requestAnimationFrame(loop);
    } else {
      drawGame();
    }

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isPlaying, isPaused]);

  
  useEffect(() => {
    initGame();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      mouseRef.current.x = (e.clientX - rect.left) * scaleX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        mouseRef.current.x = (e.touches[0].clientX - rect.left) * scaleX;
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const handleStartGame = () => {
    initGame();
    setIsPlaying(true);
    onSoundTrigger('powerup');
  };

  const togglePause = () => {
    setIsPaused((p) => !p);
  };

  return (
    <div className="bg-[#111111] border-2 border-[#00ff41] p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-6 items-center" id="arcade-cabinet">
      
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00ff41]"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00ff41]"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00ff41]"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ff41]"></div>

      
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,4px_100%] z-10" />

      
      <div className="flex-1 w-full max-w-[360px] aspect-[4/5] bg-[#050505] border-2 border-[#00ff41]/60 relative overflow-hidden flex flex-col justify-between">
        
        <div className="bg-[#111111] px-4 py-2 flex items-center justify-between border-b border-[#00ff41]/30 z-20">
          <div className="flex items-center gap-1.5">
            <Gamepad2 className="w-4 h-4 text-[#ff00ff] animate-bounce" />
            <span className="text-[10px] font-mono text-[#00ff41] font-bold uppercase tracking-wider">
              SKILL_HARVESTER_CORE.EXE
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-white/60">SCORE:</span>
            <span className="text-[12px] font-mono text-[#00ff41] font-bold">{score}</span>
          </div>
        </div>

        
        <div className="relative flex-1 w-full flex items-center justify-center bg-[#050505]">
          <canvas
            ref={canvasRef}
            width={340}
            height={380}
            className="w-full h-full block max-w-full cursor-crosshair"
          />

          
          {!isPlaying && !gameOver && !gameWon && (
            <div className="absolute inset-0 bg-[#050505]/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-30 animate-fade-in">
              <Gamepad2 className="w-10 h-10 text-[#00ff41] mb-3 animate-pulse" />
              <h4 className="text-sm font-mono font-extrabold text-[#00ff41] uppercase tracking-widest mb-1.5">
                ARCADE SKILL HARVESTER
              </h4>
              <p className="text-[10px] font-mono text-[#00ff41]/70 max-w-[220px] mb-4 leading-relaxed">
                Break raw blocks representing <span className="text-white font-bold">Ayush's skills</span> to harvest tags and catch falling gems! High velocity mode engaged.
              </p>
              <button
                onClick={handleStartGame}
                className="bg-[#00ff41] text-black hover:bg-black hover:text-[#00ff41] font-mono text-[11px] font-black italic tracking-widest px-6 py-2.5 border-2 border-[#00ff41] active:scale-95 transition-all cursor-pointer"
              >
                INSERT COIN (PLAY)
              </button>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-30 animate-scale-up">
              <Trophy className="w-10 h-10 text-[#ff00ff] mb-3 animate-bounce" />
              <h4 className="text-sm font-mono font-extrabold text-[#ff00ff] uppercase tracking-widest mb-1">
                SYSTEM OVERLOAD
              </h4>
              <p className="text-[10px] font-mono text-white/70 mb-4">
                FINAL HARVEST: <span className="text-[#00ff41] font-bold">{score} PTS</span>
              </p>
              <button
                onClick={handleStartGame}
                className="bg-black hover:bg-[#ff00ff] hover:text-black text-[#ff00ff] font-mono text-[10px] font-bold px-4 py-2 border-2 border-[#ff00ff] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                RETRY CORE
              </button>
            </div>
          )}

          {gameWon && (
            <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-30 animate-scale-up">
              <Trophy className="w-11 h-11 text-[#00ff41] mb-3 animate-spin" />
              <h4 className="text-sm font-mono font-extrabold text-[#00ff41] uppercase tracking-widest mb-1">
                VICTORY OVERFLOW!
              </h4>
              <p className="text-[10px] font-mono text-white/70 mb-4">
                All Skills Harvested: <span className="text-[#ff00ff] font-bold">{score} pts</span>
              </p>
              <button
                onClick={handleStartGame}
                className="bg-[#00ff41] text-black hover:bg-black hover:text-[#00ff41] font-mono text-[10px] font-extrabold px-4 py-2 border-2 border-[#00ff41] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                HARVEST AGAIN
              </button>
            </div>
          )}

          {isPlaying && isPaused && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-30">
              <h4 className="text-lg font-mono font-bold text-[#ff00ff] animate-pulse tracking-widest">
                PAUSED_
              </h4>
            </div>
          )}
        </div>

        
        {isPlaying && (
          <div className="bg-[#111111] py-1.5 border-t border-[#00ff41]/20 text-center z-20">
            <span className="text-[9px] font-mono text-[#00ff41]/80 uppercase tracking-widest">
              {('ontouchstart' in window) ? 'Drag finger to guide paddle' : 'Move cursor left / right to steer'}
            </span>
          </div>
        )}
      </div>

      
      <div className="w-full md:w-56 flex flex-col justify-between self-stretch py-2">
        <div>
          <h3 className="text-base font-extrabold text-[#00ff41] uppercase tracking-wider mb-1 flex items-center gap-1.5 italic">
            CABINET_LOG
          </h3>
          <p className="text-[10px] text-white/60 mb-4 leading-relaxed font-mono">
            Shatter C++, React, Backend & Visuals blocks. High velocity ball increases intensity on every hit!
          </p>

          <div className="space-y-2 mb-6">
            <div className="bg-[#050505] p-2.5 border border-[#00ff41]/30 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-[#ff00ff]" />
                <span className="text-[10px] font-mono text-white/70 font-bold uppercase">HIGH_SCORE</span>
              </div>
              <span className="text-xs font-mono text-[#00ff41] font-extrabold">{highScore}</span>
            </div>

            <div className="bg-[#050505] p-2.5 border border-[#00ff41]/30 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00ff41]" />
                <span className="text-[10px] font-mono text-white/70 font-bold uppercase">GEM_LVL</span>
              </div>
              <span className="text-xs font-mono text-[#ff00ff] font-extrabold">LVL {gemsCount}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {isPlaying && (
            <button
              onClick={togglePause}
              className="w-full bg-black hover:bg-[#00ff41] hover:text-black text-[#00ff41] font-mono text-[11px] font-bold py-2 border border-[#00ff41] transition-all cursor-pointer uppercase"
            >
              {isPaused ? 'RESUME EMULATOR' : 'PAUSE EMULATOR'}
            </button>
          )}

          {isPlaying && (
            <button
              onClick={() => {
                setIsPlaying(false);
                initGame();
              }}
              className="w-full bg-black hover:bg-[#ff00ff] hover:text-black text-[#ff00ff] font-mono text-[11px] font-bold py-2 border border-[#ff00ff] transition-all cursor-pointer uppercase"
            >
              RESET CABINET
            </button>
          )}

          <div className="bg-[#050505] p-3 border border-[#00ff41]/20 text-center">
            <div className="flex justify-center gap-1.5 mb-2">
              <span className="w-2.5 h-2.5 bg-[#ff2a5f] border border-black" title="C++ & Algos" />
              <span className="w-2.5 h-2.5 bg-[#00ff41] border border-black" title="React / Web" />
              <span className="w-2.5 h-2.5 bg-[#00e5ff] border border-black" title="Backend & DB" />
              <span className="w-2.5 h-2.5 bg-[#ff00ff] border border-black" title="Visuals & Audio" />
            </div>
            <p className="text-[9px] font-mono text-white/50 leading-relaxed uppercase">
              Shred blocks to harvest skill-sets. Gems = +30. Coins = +50 points.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
