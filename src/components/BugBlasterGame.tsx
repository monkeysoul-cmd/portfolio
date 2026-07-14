import { useState, useEffect, useRef, MutableRefObject } from 'react';
import { Target, Zap, Play, Radio, Cpu, RotateCcw, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface BugBlasterGameProps {
  onScorePoints: (pts: number, message?: string) => void;
  onSoundTriggerRef: MutableRefObject<((type: 'coin' | 'laser' | 'powerup' | 'gem') => void) | null>;
  onClose?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
}

interface Bullet {
  x: number;
  y: number;
  w: number;
  h: number;
  vy: number;
}

interface Enemy {
  x: number;
  y: number;
  w: number;
  h: number;
  type: string;
  label: string;
  color: string;
  points: number;
  vx: number;
  hp: number;
}

interface Star {
  x: number;
  y: number;
  speed: number;
  size: number;
}

interface ProjectCartridge {
  id: 'traffic' | 'health' | 'music';
  title: string;
  subtitle: string;
  date: string;
  color: string;
  accentColor: string;
  bgColor: string;
  glowColor: string;
  description: string;
  bugs: { type: string; label: string; color: string; points: number; hp: number }[];
}

export default function BugBlasterGame({
  onScorePoints,
  onSoundTriggerRef,
  onClose,
}: BugBlasterGameProps) {
  const [gameState, setGameState] = useState<'welcome' | 'cartridge_select' | 'playing' | 'gameover'>('welcome');
  const [selectedProject, setSelectedProject] = useState<'traffic' | 'health' | 'music' | null>(null);
  const [gameScore, setGameScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [shield, setShield] = useState(100);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mainGainNodeRef = useRef<GainNode | null>(null);

  
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  
  const playerX = useRef(150);
  const bullets = useRef<Bullet[]>([]);
  const enemies = useRef<Enemy[]>([]);
  const particles = useRef<Particle[]>([]);
  const stars = useRef<Star[]>([]);
  const lastShotTime = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const isAutoFiring = useRef(false);

  
  const cartridges: ProjectCartridge[] = [
    {
      id: 'traffic',
      title: 'Traffic Flow',
      subtitle: 'Real-Time Monitoring',
      date: 'Sep 2025 - Nov 2025',
      color: '#fbbf24', 
      accentColor: '#f59e0b',
      bgColor: 'bg-amber-950/20',
      glowColor: 'shadow-amber-500/40',
      description: 'Smart India Hackathon 2025 Runner-Up. Features real-time vehicle flow metrics, congestion solvers, and dynamic signal calculators.',
      bugs: [
        { type: 'syntax', label: 'SignalDrift', color: '#fbbf24', points: 20, hp: 1 },
        { type: 'merge', label: 'Queue_Jam', color: '#f59e0b', points: 25, hp: 1 },
        { type: 'null', label: 'SIH_Conflict', color: '#f43f5e', points: 30, hp: 2 },
        { type: 'leak', label: 'Sensor_Lag', color: '#06b6d4', points: 35, hp: 1 },
        { type: 'syntax', label: 'TimingBias', color: '#a855f7', points: 20, hp: 1 },
        { type: 'merge', label: 'PhaseOverlap', color: '#10b981', points: 40, hp: 2 },
        { type: 'null', label: 'LaneBlockage', color: '#3b82f6', points: 30, hp: 2 },
        { type: 'leak', label: 'Node_Crash', color: '#ef4444', points: 50, hp: 3 },
        { type: 'syntax', label: 'DataOverflow', color: '#fbbf24', points: 25, hp: 1 },
        { type: 'merge', label: 'RouteDrop', color: '#f59e0b', points: 35, hp: 2 },
        { type: 'null', label: 'Gridlock', color: '#f43f5e', points: 50, hp: 3 },
        { type: 'leak', label: 'TelemetryErr', color: '#06b6d4', points: 30, hp: 1 },
        { type: 'syntax', label: 'SpeedDrift', color: '#a855f7', points: 20, hp: 1 },
        { type: 'merge', label: 'PeakOverload', color: '#10b981', points: 45, hp: 2 },
        { type: 'null', label: 'MapDraw_Fail', color: '#3b82f6', points: 40, hp: 2 },
        { type: 'leak', label: 'SyncLatency', color: '#ef4444', points: 35, hp: 1 },
        { type: 'syntax', label: 'SocketLeak', color: '#fbbf24', points: 30, hp: 2 },
        { type: 'merge', label: 'GeoFenceMiss', color: '#f59e0b', points: 25, hp: 1 },
        { type: 'null', label: 'D3_RenderLag', color: '#f43f5e', points: 40, hp: 2 },
        { type: 'leak', label: 'CrosswalkBug', color: '#06b6d4', points: 30, hp: 1 },
        { type: 'syntax', label: 'LaneDiverge', color: '#a855f7', points: 35, hp: 2 },
        { type: 'merge', label: 'KafkaDrop', color: '#10b981', points: 45, hp: 2 }
      ]
    },
    {
      id: 'health',
      title: 'Health Assistant',
      subtitle: 'AI Symptom Checker',
      date: 'Dec 2025 - Jan 2026',
      color: '#00ff41', 
      accentColor: '#10b981',
      bgColor: 'bg-emerald-950/20',
      glowColor: 'shadow-emerald-500/40',
      description: 'An intelligent medical assistant powered by Gemini. Resolves complex symptoms into safe suggestions over high-speed RESTful APIs.',
      bugs: [
        { type: 'syntax', label: 'NLP_Misread', color: '#00ff41', points: 20, hp: 1 },
        { type: 'merge', label: 'API_Latency', color: '#10b981', points: 25, hp: 1 },
        { type: 'null', label: 'TokenExceed', color: '#d946ef', points: 30, hp: 2 },
        { type: 'leak', label: 'ModelTimeout', color: '#06b6d4', points: 35, hp: 1 },
        { type: 'syntax', label: 'PromptLeak', color: '#fbbf24', points: 20, hp: 1 },
        { type: 'merge', label: 'JSON_ParseErr', color: '#f43f5e', points: 40, hp: 2 },
        { type: 'null', label: 'SymptomNull', color: '#a855f7', points: 30, hp: 2 },
        { type: 'leak', label: 'DiagDrift', color: '#3b82f6', points: 45, hp: 3 },
        { type: 'syntax', label: 'BiometricLag', color: '#00ff41', points: 25, hp: 1 },
        { type: 'merge', label: 'AuthExpire', color: '#10b981', points: 35, hp: 2 },
        { type: 'null', label: 'CORS_Blocked', color: '#d946ef', points: 50, hp: 3 },
        { type: 'leak', label: 'HR_Spike', color: '#06b6d4', points: 30, hp: 1 },
        { type: 'syntax', label: 'AccuracyDrop', color: '#fbbf24', points: 20, hp: 1 },
        { type: 'merge', label: 'PayloadHuge', color: '#f43f5e', points: 45, hp: 2 },
        { type: 'null', label: 'SessionLost', color: '#a855f7', points: 40, hp: 2 },
        { type: 'leak', label: 'REST_Err500', color: '#3b82f6', points: 35, hp: 1 },
        { type: 'syntax', label: 'RateLimited', color: '#00ff41', points: 30, hp: 2 },
        { type: 'merge', label: 'StateMismatch', color: '#10b981', points: 25, hp: 1 },
        { type: 'null', label: 'CacheInval', color: '#d946ef', points: 40, hp: 2 },
        { type: 'leak', label: 'SDK_Crash', color: '#06b6d4', points: 30, hp: 1 },
        { type: 'syntax', label: 'Warmup_Delay', color: '#fbbf24', points: 35, hp: 2 },
        { type: 'merge', label: 'SSL_Handshake', color: '#f43f5e', points: 45, hp: 2 }
      ]
    },
    {
      id: 'music',
      title: 'CodeAlpha Music',
      subtitle: 'Audio Sync Console',
      date: 'Jul 2025 - Aug 2025',
      color: '#ff00ff', 
      accentColor: '#ec4899',
      bgColor: 'bg-fuchsia-950/20',
      glowColor: 'shadow-fuchsia-500/40',
      description: 'Refactored frontend logic to enhance audio rendering efficiency by 15% with complete Web Audio context synthesizers.',
      bugs: [
        { type: 'syntax', label: 'Audio_Lag', color: '#ff00ff', points: 20, hp: 1 },
        { type: 'merge', label: 'Runtime_Err', color: '#ec4899', points: 25, hp: 1 },
        { type: 'null', label: 'BufferUnder', color: '#a855f7', points: 30, hp: 2 },
        { type: 'leak', label: 'GainDistort', color: '#3b82f6', points: 35, hp: 1 },
        { type: 'syntax', label: 'LoopHanging', color: '#00ff41', points: 20, hp: 1 },
        { type: 'merge', label: 'OscillatorLeak', color: '#06b6d4', points: 40, hp: 2 },
        { type: 'null', label: 'TrackMiss', color: '#fbbf24', points: 30, hp: 2 },
        { type: 'leak', label: 'DecalAlign', color: '#f43f5e', points: 45, hp: 3 },
        { type: 'syntax', label: 'Codec_Unsupp', color: '#ff00ff', points: 25, hp: 1 },
        { type: 'merge', label: 'VolumeSpike', color: '#ec4899', points: 35, hp: 2 },
        { type: 'null', label: 'DOM_Exception', color: '#a855f7', points: 50, hp: 3 },
        { type: 'leak', label: 'StateFreeze', color: '#3b82f6', points: 30, hp: 1 },
        { type: 'syntax', label: 'CSS_Flicker', color: '#00ff41', points: 20, hp: 1 },
        { type: 'merge', label: 'Memory_Bloat', color: '#06b6d4', points: 45, hp: 2 },
        { type: 'null', label: 'PointerLost', color: '#fbbf24', points: 40, hp: 2 },
        { type: 'leak', label: 'SampleRateMis', color: '#f43f5e', points: 35, hp: 1 },
        { type: 'syntax', label: 'CrossfadeBug', color: '#ff00ff', points: 30, hp: 2 },
        { type: 'merge', label: 'PlaySuspended', color: '#ec4899', points: 25, hp: 1 },
        { type: 'null', label: 'BPM_Drift', color: '#a855f7', points: 40, hp: 2 },
        { type: 'leak', label: 'MutedAutoplay', color: '#3b82f6', points: 30, hp: 1 },
        { type: 'syntax', label: 'ID3_ParseErr', color: '#00ff41', points: 35, hp: 2 },
        { type: 'merge', label: 'SliderSticky', color: '#06b6d4', points: 45, hp: 2 }
      ]
    }
  ];

  const currentCartridge = cartridges.find(c => c.id === selectedProject) || cartridges[0];

  
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
      mainGainNodeRef.current = audioCtxRef.current.createGain();
      mainGainNodeRef.current.gain.setValueAtTime(0.2, audioCtxRef.current.currentTime);
      mainGainNodeRef.connect ? mainGainNodeRef.current.connect(audioCtxRef.current.destination) : null;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  
  const triggerSound = (type: 'coin' | 'laser' | 'powerup' | 'gem') => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      const mainGain = mainGainNodeRef.current;
      if (!ctx || !mainGain) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination); 

      if (type === 'coin') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(523.25, now); 
        osc.frequency.setValueAtTime(659.25, now + 0.08); 
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'laser') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.1);
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'powerup') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(261.63, now); 
        osc.frequency.setValueAtTime(329.63, now + 0.05); 
        osc.frequency.setValueAtTime(392.00, now + 0.1); 
        osc.frequency.setValueAtTime(523.25, now + 0.15); 
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'gem') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now); 
        osc.frequency.setValueAtTime(1318.51, now + 0.04); 
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch (e) {
      console.warn('Synth trigger failed:', e);
    }
  };

  
  useEffect(() => {
    onSoundTriggerRef.current = (type) => {
      triggerSound(type);
    };
  }, []);

  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
      if (e.key === ' ' && gameState === 'playing') {
        e.preventDefault(); 
        fireLaser();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, selectedProject]);

  
  const initStars = (width: number, height: number) => {
    stars.current = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: Math.random() * 1.5 + 0.5,
      size: Math.random() * 1.5 + 0.5
    }));
  };

  
  const spawnEnemyWave = (width: number) => {
    if (!selectedProject) return;

    const availableBugs = currentCartridge.bugs;
    const waveCount = level * 2 + 3;

    for (let i = 0; i < waveCount; i++) {
      const template = availableBugs[Math.floor(Math.random() * availableBugs.length)];
      enemies.current.push({
        x: Math.random() * (width - 90) + 10,
        y: -Math.random() * 20 - 10, 
        w: 76,
        h: 22,
        type: template.type,
        label: template.label,
        color: template.color,
        points: template.points,
        vx: (Math.random() * 1.4 - 0.7) * (1 + level * 0.1),
        hp: template.hp
      });
    }
  };

  
  const fireLaser = () => {
    const now = Date.now();
    if (now - lastShotTime.current < 220) return; 
    lastShotTime.current = now;

    bullets.current.push({
      x: playerX.current,
      y: 280, 
      w: 3.5,
      h: 11,
      vy: -6.5
    });
    triggerSound('laser');
  };

  
  const createExplosion = (x: number, y: number, color: string) => {
    for (let i = 0; i < 18; i++) {
      particles.current.push({
        x,
        y,
        vx: Math.random() * 4.5 - 2.25,
        vy: Math.random() * 4.5 - 2.25,
        color,
        alpha: 1,
        size: Math.random() * 2.5 + 1
      });
    }
  };

  
  const startGame = (projectId?: 'traffic' | 'health' | 'music') => {
    const activeProject = projectId || selectedProject;
    if (!activeProject) return;
    initAudio();
    playerX.current = 150;
    bullets.current = [];
    particles.current = [];
    isAutoFiring.current = false;
    const autofireBtn = document.getElementById('autofire-btn');
    if (autofireBtn) autofireBtn.innerText = 'AUTOFIRE: OFF';
    setGameScore(0);
    setLevel(1);
    setShield(100);
    setGameState('playing');
    triggerSound('powerup');

    
    const activeCart = cartridges.find(c => c.id === activeProject) || cartridges[0];
    const availableBugs = activeCart.bugs;
    const waveCount = 5; 
    enemies.current = Array.from({ length: waveCount }, () => {
      const template = availableBugs[Math.floor(Math.random() * availableBugs.length)];
      return {
        x: Math.random() * (300 - 90) + 10,
        y: -Math.random() * 20 - 10, 
        w: 76,
        h: 22,
        type: template.type,
        label: template.label,
        color: template.color,
        points: template.points,
        vx: (Math.random() * 1.4 - 0.7) * (1 + 1 * 0.1),
        hp: template.hp
      };
    });
  };

  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    
    const width = 300;
    const height = 320;
    canvas.width = width;
    canvas.height = height;

    if (stars.current.length === 0) {
      initStars(width, height);
    }

    const updateLoop = () => {
      if (gameState !== 'playing') return;

      
      if (keysPressed.current['arrowleft'] || keysPressed.current['a']) {
        playerX.current = Math.max(15, playerX.current - 4);
      }
      if (keysPressed.current['arrowright'] || keysPressed.current['d']) {
        playerX.current = Math.min(width - 15, playerX.current + 4);
      }

      if (isAutoFiring.current) {
        fireLaser();
      }

      
      if (enemies.current.length === 0) {
        spawnEnemyWave(width);
        setLevel((prev) => {
          const nextLvl = prev + 1;
          triggerSound('powerup');
          onScorePoints(100, `PROMOTED TO LEVEL ${nextLvl}!`);
          return nextLvl;
        });
      }

      
      ctx.fillStyle = '#030306';
      ctx.fillRect(0, 0, width, height);

      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      stars.current.forEach((star) => {
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });

      
      ctx.fillStyle = currentCartridge.color;
      bullets.current = bullets.current.filter((b) => {
        b.y += b.vy;
        ctx.fillRect(b.x - b.w / 2, b.y, b.w, b.h);
        return b.y > 0;
      });

      
      particles.current = particles.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.restore();
        return p.alpha > 0;
      });

      
      enemies.current.forEach((enemy, eIdx) => {
        enemy.x += enemy.vx;
        enemy.y += 0.8 * (1 + level * 0.15); 

        
        if (enemy.x <= 5 || enemy.x >= width - enemy.w - 5) {
          enemy.vx *= -1;
        }

        ctx.save();
        
        ctx.strokeStyle = enemy.color;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 0; 

        const legWiggle = Math.sin(Date.now() / 120 + enemy.y / 8) * 3.5;

        
        ctx.beginPath();
        ctx.moveTo(enemy.x, enemy.y + 5);
        ctx.lineTo(enemy.x - 7, enemy.y + 3 + legWiggle);
        ctx.moveTo(enemy.x, enemy.y + 11);
        ctx.lineTo(enemy.x - 9, enemy.y + 11 - legWiggle);
        ctx.moveTo(enemy.x, enemy.y + 17);
        ctx.lineTo(enemy.x - 7, enemy.y + 19 + legWiggle);
        ctx.stroke();

        
        ctx.beginPath();
        ctx.moveTo(enemy.x + enemy.w, enemy.y + 5);
        ctx.lineTo(enemy.x + enemy.w + 7, enemy.y + 3 + legWiggle);
        ctx.moveTo(enemy.x + enemy.w, enemy.y + 11);
        ctx.lineTo(enemy.x + enemy.w + 9, enemy.y + 11 - legWiggle);
        ctx.moveTo(enemy.x + enemy.w, enemy.y + 17);
        ctx.lineTo(enemy.x + enemy.w + 7, enemy.y + 19 + legWiggle);
        ctx.stroke();

        
        ctx.beginPath();
        ctx.moveTo(enemy.x + enemy.w / 3, enemy.y);
        ctx.lineTo(enemy.x + enemy.w / 3 - 4, enemy.y - 5);
        ctx.moveTo(enemy.x + (2 * enemy.w) / 3, enemy.y);
        ctx.lineTo(enemy.x + (2 * enemy.w) / 3 + 4, enemy.y - 5);
        ctx.stroke();

        
        ctx.shadowBlur = 12;
        ctx.shadowColor = enemy.color;
        ctx.fillStyle = 'rgba(5, 5, 8, 0.9)';
        ctx.beginPath();
        ctx.roundRect(enemy.x, enemy.y, enemy.w, enemy.h, 5);
        ctx.fill();
        ctx.stroke();

        
        ctx.shadowBlur = 0;
        ctx.fillStyle = enemy.color;
        ctx.beginPath();
        ctx.arc(enemy.x + 8, enemy.y + enemy.h / 2, 3, 0, Math.PI * 2);
        ctx.fill();

        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8.5px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(enemy.label, enemy.x + 16, enemy.y + 14);
        ctx.restore();

        
        if (enemy.y > height - 40) {
          enemies.current.splice(eIdx, 1);
          setShield((prev) => {
            const nextShield = Math.max(0, prev - 20);
            triggerSound('coin'); 
            if (nextShield <= 0) {
              setGameState('gameover');
              triggerSound('gem'); 
            }
            return nextShield;
          });
        }
      });

      
      bullets.current.forEach((bullet, bIdx) => {
        enemies.current.forEach((enemy, eIdx) => {
          if (
            bullet.x >= enemy.x &&
            bullet.x <= enemy.x + enemy.w &&
            bullet.y >= enemy.y &&
            bullet.y <= enemy.y + enemy.h
          ) {
            
            bullets.current.splice(bIdx, 1);
            enemy.hp -= 1;

            if (enemy.hp <= 0) {
              
              createExplosion(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, enemy.color);
              enemies.current.splice(eIdx, 1);
              setGameScore((prev) => {
                const added = enemy.points;
                onScorePoints(added, `RESOLVED ERROR: ${enemy.label.toUpperCase()}`);
                return prev + added;
              });
            } else {
              
              createExplosion(bullet.x, bullet.y, '#ffffff');
            }
          }
        });
      });

      
      const shipX = playerX.current;
      const shipY = 295;

      ctx.save();
      ctx.shadowBlur = 12;
      ctx.shadowColor = currentCartridge.color;

      
      ctx.fillStyle = currentCartridge.color;
      ctx.fillRect(shipX - 12, shipY - 5, 3, 8);
      ctx.fillRect(shipX + 9, shipY - 5, 3, 8);

      
      ctx.fillStyle = currentCartridge.color;
      ctx.beginPath();
      ctx.moveTo(shipX, shipY - 12);
      ctx.lineTo(shipX - 10, shipY + 8);
      ctx.lineTo(shipX + 10, shipY + 8);
      ctx.closePath();
      ctx.fill();

      
      ctx.shadowBlur = 0;
      ctx.fillStyle = Math.random() > 0.5 ? '#ff2a5f' : '#fbbf24';
      ctx.fillRect(shipX - 3, shipY + 9, 6, Math.random() * 5 + 3);
      ctx.restore();

      animationFrameId.current = requestAnimationFrame(updateLoop);
    };

    if (gameState === 'playing') {
      animationFrameId.current = requestAnimationFrame(updateLoop);
    } else {
      
      ctx.fillStyle = '#040407';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      stars.current.forEach((star) => {
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });

      if (gameState === 'welcome') {
        
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#f43f5e';
        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 18px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('BUG BLASTER v2.0', width / 2, 90);
        ctx.restore();

        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('DEFEND AYUSH\'S PRODUCTION', width / 2, 115);

        ctx.font = '8px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('EXCEPTIONS ARE ATTACKING THE SYSTEM!', width / 2, 135);

        ctx.font = 'bold 8px monospace';
        ctx.fillStyle = '#10b981';
        ctx.fillText('CLICK START GAME TO BEGIN', width / 2, 185);

        ctx.font = '7px monospace';
        ctx.fillStyle = '#475569';
        ctx.fillText('POWERED BY RETRO EMULATOR CORE', width / 2, 215);
      } else if (gameState === 'cartridge_select') {
        
        ctx.save();
        
        
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
        ctx.lineWidth = 1;
        for (let y = 10; y < height; y += 12) {
          ctx.beginPath();
          ctx.moveTo(10, y);
          ctx.lineTo(width - 10, y);
          ctx.stroke();
        }

        
        ctx.strokeStyle = selectedProject ? currentCartridge.color : '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(10, 15, width - 20, 290);
        
        ctx.fillStyle = '#030306';
        ctx.fillRect(width / 2 - 60, 8, 120, 14);
        ctx.font = 'bold 8px monospace';
        ctx.fillStyle = selectedProject ? currentCartridge.color : '#38bdf8';
        ctx.textAlign = 'center';
        ctx.fillText('ARCADE BIOS COMPILER', width / 2, 18);

        
        if (selectedProject) {
          
          ctx.fillStyle = `${currentCartridge.color}15`;
          ctx.fillRect(20, 40, width - 40, 155);
          ctx.strokeStyle = currentCartridge.color;
          ctx.lineWidth = 1;
          ctx.strokeRect(20, 40, width - 40, 155);
          
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
          ctx.fillRect(width / 2 - 30, 40, 60, 25);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.strokeRect(width / 2 - 30, 40, 60, 25);
          
          
          const pulse = Math.abs(Math.sin(Date.now() / 250));
          ctx.fillStyle = `rgba(16, 185, 129, ${0.4 + pulse * 0.6})`;
          ctx.beginPath();
          ctx.arc(35, 52, 3, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.font = 'bold 6px monospace';
          ctx.fillStyle = '#10b981';
          ctx.textAlign = 'left';
          ctx.fillText('MOUNT_OK', 44, 55);

          
          ctx.textAlign = 'center';
          ctx.font = 'bold 11px monospace';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(currentCartridge.title.toUpperCase(), width / 2, 92);
          
          ctx.font = 'bold 7px monospace';
          ctx.fillStyle = currentCartridge.color;
          ctx.fillText(currentCartridge.subtitle.toUpperCase(), width / 2, 107);

          ctx.font = '6.5px monospace';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText(`TIMEFRAME: ${currentCartridge.date}`, width / 2, 125);
          
          ctx.fillStyle = '#fbbf24';
          ctx.fillText(`THREATS DETECTED: ${currentCartridge.bugs.length} BUGS`, width / 2, 140);
          
          ctx.fillStyle = '#ef4444';
          ctx.fillText(`DIFFICULTY: CLASS_${currentCartridge.bugs.length > 20 ? 'CRITICAL' : 'HIGH'}`, width / 2, 155);
          
          ctx.fillStyle = '#64748b';
          ctx.fillText('STATUS: WAITING FOR COMPLIANT RUN...', width / 2, 172);

          
          ctx.fillStyle = `rgba(255, 255, 255, ${0.35 + pulse * 0.65})`;
          ctx.font = 'bold 8.5px monospace';
          ctx.fillText('▶ PRESS START BUTTON BELOW ◀', width / 2, 230);
          
          ctx.font = '7px monospace';
          ctx.fillStyle = '#64748b';
          ctx.fillText('OR CHOOSE A DIFFERENT MEMORY DRIVE', width / 2, 248);
        } else {
          
          ctx.font = 'bold 12px monospace';
          ctx.fillStyle = '#38bdf8';
          ctx.textAlign = 'center';
          ctx.fillText('BIOS CONSOLE v2.1', width / 2, 72);

          ctx.save();
          const pulseColor = Math.abs(Math.sin(Date.now() / 250));
          
          
          ctx.strokeStyle = `rgba(244, 63, 94, ${0.3 + pulseColor * 0.5})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(30, 91, width - 60, 22);
          ctx.fillStyle = 'rgba(244, 63, 94, 0.08)';
          ctx.fillRect(30, 91, width - 60, 22);

          ctx.shadowBlur = 12;
          ctx.shadowColor = `rgba(244, 63, 94, ${pulseColor})`;
          ctx.font = 'bold 10px monospace';
          ctx.fillStyle = `rgba(244, 63, 94, ${0.65 + pulseColor * 0.35})`;
          ctx.fillText('⚡ SELECT A PROJECT TO PLAY GAME ⚡', width / 2, 105);
          ctx.restore();

          
          cartridges.forEach((cart, i) => {
            const yOffset = 150 + i * 26;
            ctx.fillStyle = selectedProject === cart.id ? `${cart.color}15` : 'rgba(255, 255, 255, 0.02)';
            ctx.fillRect(25, yOffset - 12, width - 50, 18);
            ctx.strokeStyle = selectedProject === cart.id ? cart.color : 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = selectedProject === cart.id ? 1 : 0.5;
            ctx.strokeRect(25, yOffset - 12, width - 50, 18);
            
            ctx.font = 'bold 7px monospace';
            ctx.fillStyle = cart.color;
            ctx.textAlign = 'left';
            ctx.fillText(`${selectedProject === cart.id ? '▶ ' : ''}${cart.title.toUpperCase()}`, 35, yOffset);
            
            ctx.font = '6px monospace';
            ctx.fillStyle = selectedProject === cart.id ? '#ffffff' : '#64748b';
            ctx.textAlign = 'right';
            ctx.fillText(`${cart.bugs.length} BUGS INSTALLED`, width - 35, yOffset);
          });

          ctx.font = '7px monospace';
          ctx.fillStyle = '#475569';
          ctx.textAlign = 'center';
          ctx.fillText('READY TO EMULATE SYSTEM DEFENDER', width / 2, 255);
        }
        ctx.restore();
      } else if (gameState === 'gameover') {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
        ctx.fillRect(15, 60, width - 30, 160);
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(15, 60, width - 30, 160);

        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = '#f43f5e';
        ctx.textAlign = 'center';
        ctx.fillText('PRODUCTION BREACHED', width / 2, 100);

        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`RESOLVED SCORE: ${gameScore} PTS`, width / 2, 130);

        ctx.font = 'bold 7px monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText('EXCEPTIONS ESCAPED TO PRODUCTION LOGS', width / 2, 160);
        ctx.fillText('CLICK RE-DEPLOY BELOW TO RE-COMPUTE FIX', width / 2, 175);
      }
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameState, level, selectedProject]);

  return (
    <div 
      className={`bg-[#0b0c10] border-2 p-5 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col justify-between transition-all duration-300 rounded-3xl ${shield <= 20 ? 'bb-critical-shake' : ''}`}
      id="retro-bug-blaster-arcade"
      style={{ borderColor: selectedProject ? currentCartridge.color : '#475569' }}
    >
      
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[length:15px_15px] z-0" />
      <div className="animate-scanline" />

      <div>
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2 z-10 relative">
            <Target className="w-4 h-4 text-slate-400 animate-pulse" style={{ color: selectedProject ? currentCartridge.color : '#94a3b8' }} />
            <span className="text-xs font-mono font-black uppercase tracking-wider text-slate-200 bb-title-pulse" style={{ textShadow: selectedProject ? `0 0 8px ${currentCartridge.color}` : 'none' }}>
              {selectedProject ? `${currentCartridge.title.replace(' ', '_').toUpperCase()}_SYS` : 'ARCADE_EMULATOR.EXE'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 border border-slate-800 rounded">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: gameState === 'playing' ? '#00ff41' : '#ef4444' }} />
              <span className="text-[8px] font-mono text-white font-bold uppercase">
                {gameState === 'playing' ? 'LIVE' : 'IDLE'}
              </span>
            </div>
            <button
              onClick={() => {
                setGameState('welcome');
                setSelectedProject(null);
                setGameScore(0);
                setLevel(1);
                setShield(100);
                triggerSound('gem');
                if (onClose) {
                  onClose();
                }
              }}
              className="text-[10px] font-mono font-black px-3.5 py-1.5 rounded-lg border border-rose-500/30 border-b-rose-900 bg-rose-950/20 text-rose-400 hover:bg-rose-900/30 hover:text-white hover:border-rose-500 hover:border-b-rose-800 transition-all cursor-pointer flex items-center gap-1.5 uppercase select-none retro-btn z-10 relative"
              title="Reset simulator back to BIOS Welcome stage"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              POWER OFF
            </button>
          </div>
        </div>

        
        <div className="grid grid-cols-3 gap-2 mb-3 text-[9px] font-mono text-white/90">
          <div className="bg-black/80 border border-slate-800 p-1.5 rounded text-center">
            <span className="text-[7px] text-slate-500 block leading-tight uppercase">Shield Integrity</span>
            <span className={`font-black ${shield <= 40 ? 'text-[#ff2a5f] animate-pulse' : 'text-[#00ff41]'}`}>
              {shield}%
            </span>
          </div>
          <div className="bg-black/80 border border-slate-800 p-1.5 rounded text-center">
            <span className="text-[7px] text-slate-500 block leading-tight uppercase">Stage Difficulty</span>
            <span className="text-[#fbbf24] font-black">
              LVL {level}
            </span>
          </div>
          <div className="bg-black/80 border border-slate-800 p-1.5 rounded text-center">
            <span className="text-[7px] text-slate-500 block leading-tight uppercase">Game Score</span>
            <span className="text-[#a855f7] font-black" style={{ color: selectedProject ? currentCartridge.color : '#a855f7' }}>
              {gameScore}
            </span>
          </div>
        </div>

        
        <div className="bg-[#030306] border border-slate-800 relative overflow-hidden flex items-center justify-center rounded-lg shadow-inner">
          <canvas
            ref={canvasRef}
            className="block w-full h-[280px] bg-[#030306] max-w-full"
            style={{ imageRendering: 'pixelated' }}
          />

          
          {gameState === 'welcome' && (
            <div className="absolute inset-0 bg-black/45 flex items-center justify-center flex-col pt-20">
              <button
                onClick={() => {
                  setGameState('cartridge_select');
                  triggerSound('powerup');
                }}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-400 border-b-emerald-800 cursor-pointer transition-all flex items-center gap-2 retro-btn retro-border-glow bb-btn-hover z-10 relative"
              >
                <Play className="w-4 h-4 fill-black" />
                START GAME
              </button>
            </div>
          )}

          
          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center flex-col gap-4 pt-10 z-20">
              <div className="text-rose-500 font-black font-mono text-xl tracking-widest uppercase bb-critical-shake drop-shadow-[0_0_10px_rgba(225,29,72,0.8)]">
                SYSTEM CRASH
              </div>
              <button
                onClick={() => {
                  setGameState('welcome');
                  setSelectedProject(null);
                  setShield(100);
                  setGameScore(0);
                  setLevel(1);
                  triggerSound('gem');
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-mono text-[10px] font-black uppercase tracking-widest rounded border border-rose-500 border-b-rose-900 shadow-[0_0_20px_rgba(244,63,94,0.6)] cursor-pointer transition-all flex items-center gap-2 retro-btn bb-btn-hover z-10 relative"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                REBOOT CONSOLE
              </button>
            </div>
          )}

          
          {gameState === 'cartridge_select' && selectedProject && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
              <button
                onClick={() => {
                  startGame(selectedProject);
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#00ff41] text-black font-black font-mono text-[9px] tracking-widest border border-white hover:bg-white hover:text-black transition-all uppercase select-none retro-btn retro-border-glow bb-btn-hover z-10 relative"
                style={{
                  backgroundColor: currentCartridge.color,
                  borderColor: currentCartridge.accentColor,
                  borderBottomColor: '#000000',
                  boxShadow: `0 0 15px ${currentCartridge.color}60`
                }}
              >
                <Cpu className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
                MOUNT & RUN SIMULATION
              </button>
            </div>
          )}
        </div>
      </div>

      
      {gameState === 'cartridge_select' && (
        <div className="mt-5 border-t border-slate-800 pt-5">
          <div className="mb-4 bg-gradient-to-r from-fuchsia-950/30 via-pink-950/20 to-purple-950/30 border border-fuchsia-500/30 px-3 py-2 rounded-xl text-center shadow-[0_0_15px_rgba(244,63,94,0.1)] flex items-center justify-between gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-ping hidden sm:block" />
            <span className="text-slate-500 text-[10px] font-mono font-bold select-none">[DECK]</span>
            <p className="text-[10px] sm:text-xs font-mono text-fuchsia-400 uppercase tracking-widest font-black animate-pulse flex-1 text-center">
              🕹️ SELECT A PROJECT CARTRIDGE BELOW TO PLAY GAME 🕹️
            </p>
            <span className="text-slate-500 text-[10px] font-mono font-bold select-none">[LINKED]</span>
            <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-ping hidden sm:block" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {cartridges.map((cart) => (
              <button
                key={cart.id}
                onClick={() => {
                  if (selectedProject === cart.id) {
                    startGame(cart.id);
                  } else {
                    setSelectedProject(cart.id);
                    triggerSound('coin');
                  }
                }}
                className={`relative flex flex-col justify-between p-2 rounded-xl border text-left cursor-pointer transition-all duration-300 select-none retro-btn bb-btn-hover z-10 ${
                  selectedProject === cart.id
                    ? `${cart.bgColor} border-2 border-b-black retro-border-glow`
                    : 'bg-slate-900/30 border-slate-800 border-b-slate-950 hover:border-slate-600 hover:bg-slate-900/60'
                }`}
                style={{ borderColor: selectedProject === cart.id ? cart.color : undefined }}
              >
                
                <div 
                  className="absolute top-0 left-4 right-4 h-[3px] rounded-b-md opacity-80"
                  style={{ backgroundColor: cart.color }}
                />
                
                <div className="flex justify-between items-start w-full pt-1.5">
                  <Cpu 
                    className={`w-3.5 h-3.5 ${selectedProject === cart.id ? 'animate-spin' : ''}`} 
                    style={{ 
                      color: selectedProject === cart.id ? cart.color : '#64748b',
                      animationDuration: selectedProject === cart.id ? '4s' : undefined
                    }} 
                  />
                  <span className="text-[6px] font-mono text-slate-500">{cart.date.split(' ')[2]}</span>
                </div>
                <div className="mt-2.5">
                  <h4 className="text-[9px] font-mono font-black leading-none text-slate-100 uppercase truncate">
                    {cart.title}
                  </h4>
                  <span className="text-[7px] font-mono text-slate-400 block leading-tight mt-0.5 truncate uppercase">
                    {cart.subtitle}
                  </span>
                </div>
              </button>
            ))}
          </div>

          
          <div className="mt-3 bg-black/60 border border-slate-800 p-2.5 rounded-xl text-left transition-all duration-300">
            {selectedProject ? (
              <div className="animate-fadeIn">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[7.5px] font-mono uppercase tracking-widest text-[#00ff41] font-black">
                    SYSTEM LOADER LINKED: {currentCartridge.title}
                  </span>
                </div>
                <p className="text-[8.5px] font-mono text-slate-300 leading-normal">
                  {currentCartridge.description}
                </p>
                <div className="mt-2 flex gap-3 text-[7px] text-slate-400 font-mono">
                  <span>🛠️ STACK: {currentCartridge.id === 'traffic' ? 'D3.js + WEBSOCKETS' : currentCartridge.id === 'health' ? 'GEMINI API + REST' : 'WEB AUDIO SYNTH'}</span>
                  <span>🦠 SECTOR THREATS: {currentCartridge.bugs.length} DEPLOY BUGS</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-2.5 text-slate-500 animate-pulse text-[8px] uppercase font-bold tracking-wider">
                🔌 AWAITING MEMORY INTERFACES... SELECT A CARTRIDGE TO INSPECT SYSTEMS
              </div>
            )}
          </div>
        </div>
      )}

      
      <div className="mt-4 border-t border-slate-800 pt-4 flex justify-between items-center bg-black/40 rounded-xl p-3">
        
        <div className="flex gap-2">
          <button
            onMouseDown={() => { keysPressed.current['arrowleft'] = true; }}
            onMouseUp={() => { keysPressed.current['arrowleft'] = false; }}
            onMouseLeave={() => { keysPressed.current['arrowleft'] = false; }}
            onTouchStart={() => { keysPressed.current['arrowleft'] = true; }}
            onTouchEnd={() => { keysPressed.current['arrowleft'] = false; }}
            className="w-11 h-8 bg-slate-900 border border-slate-700 border-b-black hover:bg-slate-800 text-slate-300 font-mono font-black text-xs transition-all rounded-lg cursor-pointer select-none flex items-center justify-center retro-btn z-10 relative"
            style={{ color: selectedProject ? currentCartridge.color : undefined, borderColor: selectedProject ? currentCartridge.color : undefined }}
          >
            ◀
          </button>
          <button
            onMouseDown={() => { keysPressed.current['arrowright'] = true; }}
            onMouseUp={() => { keysPressed.current['arrowright'] = false; }}
            onMouseLeave={() => { keysPressed.current['arrowright'] = false; }}
            onTouchStart={() => { keysPressed.current['arrowright'] = true; }}
            onTouchEnd={() => { keysPressed.current['arrowright'] = false; }}
            className="w-11 h-8 bg-slate-900 border border-slate-700 border-b-black hover:bg-slate-800 text-slate-300 font-mono font-black text-xs transition-all rounded-lg cursor-pointer select-none flex items-center justify-center retro-btn z-10 relative"
            style={{ color: selectedProject ? currentCartridge.color : undefined, borderColor: selectedProject ? currentCartridge.color : undefined }}
          >
            ▶
          </button>
        </div>

        
        <button
          id="autofire-btn"
          onClick={(e) => {
            if (gameState === 'playing') {
              isAutoFiring.current = !isAutoFiring.current;
              e.currentTarget.innerText = isAutoFiring.current ? 'AUTOFIRE: ON' : 'AUTOFIRE: OFF';
            }
          }}
          disabled={gameState !== 'playing'}
          className="px-6 h-8 text-black font-mono font-black text-[9px] tracking-widest uppercase transition-all rounded-lg border border-b-black cursor-pointer select-none retro-btn disabled:bg-slate-950 disabled:text-slate-800 disabled:border-slate-900 z-10 relative"
          style={{
            backgroundColor: gameState === 'playing' ? currentCartridge.color : undefined,
            borderColor: gameState === 'playing' ? currentCartridge.accentColor : undefined,
            color: gameState === 'playing' ? '#000000' : undefined
          }}
        >
          AUTOFIRE: OFF
        </button>
      </div>

      <div className="mt-4 border-t border-slate-800 pt-3 text-center flex items-center justify-between text-[8px] text-slate-500 font-mono">
        <span className="flex items-center gap-1">
          <Zap className="w-2.5 h-2.5 shrink-0" style={{ color: selectedProject ? currentCartridge.color : '#64748b' }} />
          {selectedProject ? `${currentCartridge.title.toUpperCase()} SYSTEM CALIBRATED` : 'INSERT CARTRIDGE TO COMMENCE'}
        </span>
        <span className="text-slate-600 uppercase">CONTROLS: A/D OR CLICK BUTTONS</span>
      </div>
    </div>
  );
}
