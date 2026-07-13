import { useState, useEffect, useRef } from 'react';
import { PROJECTS } from '../data';
import { Project } from '../types';
import { Github, ExternalLink, ShieldCheck, ChevronLeft, ChevronRight, PlayCircle, Sparkles, Tv, Activity, Cpu, Database, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function TrafficSimulation() {
  const [cars, setCars] = useState<{ id: number; y: number; lane: number; speed: number; color: string }[]>([]);
  const [lightState, setLightState] = useState<'RED' | 'YELLOW' | 'GREEN'>('RED');
  const [timer, setTimer] = useState(30);
  const [pulse, setPulse] = useState(true);

  
  useEffect(() => {
    const lightInterval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setLightState((curr) => {
            if (curr === 'RED') return 'GREEN';
            if (curr === 'GREEN') return 'YELLOW';
            return 'RED';
          });
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    
    const pulseInterval = setInterval(() => {
      setPulse((p) => !p);
    }, 800);

    
    const carInterval = setInterval(() => {
      setCars((prevCars) => {
        let nextCars = [...prevCars];
        
        if (nextCars.length < 6 && Math.random() < 0.25) {
          nextCars.push({
            id: Date.now() + Math.random(),
            y: -10,
            lane: Math.floor(Math.random() * 3),
            speed: Math.random() * 1.5 + 1.2,
            color: ['#00ff41', '#ff00ff', '#00ffff', '#fbbf24'][Math.floor(Math.random() * 4)],
          });
        }

        return nextCars
          .map((car) => {
            
            let currentSpeed = car.speed;
            if (lightState === 'RED' && car.y > 15 && car.y < 35) {
              currentSpeed = car.speed * 0.15;
            }
            return {
              ...car,
              y: car.y + currentSpeed,
            };
          })
          .filter((car) => car.y < 90);
      });
    }, 40);

    return () => {
      clearInterval(lightInterval);
      clearInterval(pulseInterval);
      clearInterval(carInterval);
    };
  }, [lightState]);

  return (
    <div className="relative w-full h-full bg-[#030306] overflow-hidden font-mono flex select-none text-slate-300">
      
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(0,255,65,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.02)_1px,transparent_1px)] bg-[length:6px_6px]" />

      
      <div className="w-[50px] border-r border-slate-900 bg-black/60 flex flex-col justify-between py-2 items-center text-[5px] font-bold shrink-0">
        <div className="w-full flex flex-col items-center gap-2.5">
          
          <div className="flex flex-col items-center">
            <span className="text-[6.5px] font-black text-emerald-400 tracking-tighter">TRAFFIC</span>
            <span className="text-[4px] text-slate-500 leading-none">FLOW</span>
          </div>

          
          <div className="w-full flex flex-col gap-1 px-1">
            <div className="flex items-center gap-1 py-1 px-1 rounded bg-emerald-950/40 border border-emerald-900/40 text-emerald-400">
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              <span className="scale-75 origin-left">DASHBOARD</span>
            </div>
            <div className="flex items-center gap-1 py-1 px-1 text-slate-500 hover:text-slate-400">
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <span className="scale-75 origin-left">LIVE_VIEW</span>
            </div>
            <div className="flex items-center gap-1 py-1 px-1 text-slate-500 hover:text-slate-400">
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <span className="scale-75 origin-left">GRAPHS</span>
            </div>
            <div className="flex items-center gap-1 py-1 px-1 text-slate-500 hover:text-slate-400">
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <span className="scale-75 origin-left">HISTORY</span>
            </div>
          </div>
        </div>

        
        <div className="w-full px-1 flex flex-col gap-1">
          <div className="flex items-center gap-1 py-0.5 px-1 text-slate-500">
            <span className="scale-75 origin-left">PROFILE</span>
          </div>
          <div className="flex items-center gap-1 py-0.5 px-1 text-rose-500 bg-rose-950/10 border border-rose-950/20 rounded">
            <span className="scale-75 origin-left">LOGOUT</span>
          </div>
        </div>
      </div>

      
      <div className="flex-1 flex flex-col p-2 gap-1.5 overflow-hidden">
        
        <div className="flex justify-between items-center bg-black/40 border border-slate-900 px-1.5 py-0.5 rounded text-[5px] text-slate-400 font-bold">
          <div className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
            <span>SYS_STATUS: ACTIVE</span>
          </div>
          <span>USER: bitfusion-l</span>
        </div>

        
        <div className="grid grid-cols-4 gap-1">
          
          <div className="bg-slate-950/80 border border-emerald-950 p-1 rounded flex flex-col justify-between">
            <span className="text-[4px] text-slate-500 leading-none">TOTAL VEHICLES</span>
            <div className="flex justify-between items-end mt-0.5">
              <span className="text-[9px] font-black text-emerald-400 leading-none">128</span>
              <span className="text-[3.5px] text-emerald-500/60 font-bold">▲ 12%</span>
            </div>
          </div>
          
          <div className="bg-slate-950/80 border border-slate-900 p-1 rounded flex flex-col justify-between">
            <span className="text-[4px] text-slate-500 leading-none">AVERAGE SPEED</span>
            <div className="flex justify-between items-end mt-0.5">
              <span className="text-[9px] font-black text-slate-200 leading-none">42 <span className="text-[5px] font-normal">KM/H</span></span>
              <span className="text-[3.5px] text-slate-600 font-bold">--</span>
            </div>
          </div>
          
          <div className="bg-slate-950/80 border border-slate-900 p-1 rounded flex flex-col justify-between">
            <span className="text-[4px] text-slate-500 leading-none">TRAFFIC LEVEL</span>
            <div className="flex justify-between items-end mt-0.5">
              <span className="text-[9px] font-black text-amber-400 leading-none">MODERATE</span>
              <span className="text-[3.5px] text-amber-500/60 font-bold">WARN</span>
            </div>
          </div>
          
          <div className="bg-slate-950/80 border border-rose-950 p-1 rounded flex flex-col justify-between">
            <span className="text-[4px] text-slate-500 leading-none">ACTIVE ALERTS</span>
            <div className="flex justify-between items-end mt-0.5">
              <span className="text-[9px] font-black text-rose-500 leading-none animate-pulse">2</span>
              <span className="text-[3.5px] text-rose-500/60 font-black animate-pulse">!</span>
            </div>
          </div>
        </div>

        
        <div className="flex-1 grid grid-cols-12 gap-1.5 overflow-hidden">
          
          <div className="col-span-7 bg-black/60 border border-slate-900 rounded p-1 flex flex-col overflow-hidden justify-between">
            <div className="flex justify-between items-center text-[5px] font-black text-slate-400 border-b border-slate-900 pb-0.5 mb-1">
              <span>📷 CAMERA FEED: HWY_3A</span>
              <span className="text-emerald-500 animate-pulse">[RECORDING]</span>
            </div>

            
            <div className="flex-1 bg-[#020204] border border-slate-950 rounded relative overflow-hidden flex items-center justify-center">
              
              <div className="absolute top-0 bottom-0 left-1/3 border-r border-dashed border-slate-800 w-0 z-0" />
              <div className="absolute top-0 bottom-0 left-2/3 border-r border-dashed border-slate-800 w-0 z-0" />

              
              {cars.map((car) => (
                <div
                  key={car.id}
                  className="absolute w-2.5 h-4 rounded transition-all duration-75 flex flex-col justify-between p-0.5 shadow-md"
                  style={{
                    left: `${15 + car.lane * 25}%`,
                    top: '-10px',
                    transform: `translateY(${car.y * 1.5}px)`,
                    willChange: 'transform',
                    backgroundColor: car.color,
                    boxShadow: `0 0 4px ${car.color}60`,
                  }}
                >
                  
                  <div className="w-1.5 h-1 bg-black/40 rounded-sm mx-auto" />
                </div>
              ))}

              
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-slate-950 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-slate-950 to-transparent" />

              
              <span className="absolute bottom-1 left-1.5 text-[4px] text-emerald-500/60 font-mono font-black tracking-widest bg-black/60 px-1 py-0.5 rounded">
                CAM_REC_LIVE_09_1
              </span>
            </div>
          </div>

          
          <div className="col-span-5 flex flex-col gap-1.5 overflow-hidden">
            
            <div className="bg-black/60 border border-slate-900 rounded p-1 flex flex-col justify-between">
              <div className="flex justify-between items-center text-[4.5px] font-black text-slate-400 border-b border-slate-900 pb-0.5 mb-1.5">
                <span>🚦 SIGNAL CONTROL</span>
                <span className="bg-emerald-950 text-emerald-400 px-1 py-0.2 rounded scale-90 origin-right">PILOT_ON</span>
              </div>

              
              <div className="space-y-1 text-[4px] font-bold">
                <div className="flex justify-between items-center bg-slate-950/40 p-0.5 rounded border border-slate-900">
                  <span className="text-slate-400 scale-95 origin-left">MG ROAD: LN_1</span>
                  <div className="flex gap-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${lightState === 'RED' ? 'bg-red-500 shadow-[0_0_4px_#ef4444]' : 'bg-red-950'}`} />
                    <span className={`w-1.5 h-1.5 rounded-full ${lightState === 'YELLOW' ? 'bg-amber-500 shadow-[0_0_4px_#f59e0b]' : 'bg-amber-950'}`} />
                    <span className={`w-1.5 h-1.5 rounded-full ${lightState === 'GREEN' ? 'bg-emerald-500 shadow-[0_0_4px_#10b981]' : 'bg-emerald-950'}`} />
                  </div>
                </div>
                <div className="flex justify-between items-center bg-slate-950/40 p-0.5 rounded border border-slate-900">
                  <span className="text-slate-400 scale-95 origin-left">MG ROAD: LN_2</span>
                  <div className="flex gap-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${lightState === 'GREEN' ? 'bg-red-500 shadow-[0_0_4px_#ef4444]' : 'bg-red-950'}`} />
                    <span className={`w-1.5 h-1.5 rounded-full ${lightState === 'YELLOW' ? 'bg-amber-500 shadow-[0_0_4px_#f59e0b]' : 'bg-amber-950'}`} />
                    <span className={`w-1.5 h-1.5 rounded-full ${lightState === 'RED' ? 'bg-emerald-500 shadow-[0_0_4px_#10b981]' : 'bg-emerald-950'}`} />
                  </div>
                </div>
              </div>

              
              <div className="flex justify-between items-center mt-1.5 text-[4.5px] font-black">
                <span className="text-emerald-400">STATE: {lightState}</span>
                <span className="text-slate-500">T-MINUS: {timer}s</span>
              </div>
            </div>

            
            <div className="flex-1 bg-black/60 border border-slate-900 rounded p-1 flex flex-col justify-between overflow-hidden">
              <span className="text-[4.5px] font-black text-slate-400 border-b border-slate-900 pb-0.5 mb-1 uppercase">
                ⚠️ RECENT INCIDENTS
              </span>
              <div className="flex-1 flex flex-col justify-center gap-0.5 text-[4px] leading-none font-bold text-slate-400">
                <div className="flex justify-between py-0.2 border-b border-slate-900/40">
                  <span className="text-rose-500">INC_02</span>
                  <span>LN_1 BLOCKAGE</span>
                  <span className="text-rose-400">HIGH</span>
                </div>
                <div className="flex justify-between py-0.2 border-b border-slate-900/40">
                  <span className="text-amber-500">INC_01</span>
                  <span>SIGNAL LAG</span>
                  <span className="text-amber-400">MED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HealthSimulation() {
  const [symptoms, setSymptoms] = useState([
    { id: 'fever', label: 'FEVER', selected: true },
    { id: 'cough', label: 'COUGH', selected: false },
    { id: 'headache', label: 'HEADACHE', selected: true },
    { id: 'fatigue', label: 'FATIGUE', selected: false },
    { id: 'congestion', label: 'CONGESTION', selected: false },
  ]);

  const [chatMessage, setChatMessage] = useState('Hello! Select symptoms and I will prepare an assessment.');

  const toggleSymptom = (id: string) => {
    setSymptoms(prev => prev.map(s => {
      if (s.id === id) {
        const nextSel = !s.selected;
        return { ...s, selected: nextSel };
      }
      return s;
    }));
  };

  useEffect(() => {
    const selectedList = symptoms.filter(s => s.selected).map(s => s.label);
    if (selectedList.length === 0) {
      setChatMessage('Hello! Please select your symptoms to begin.');
    } else {
      setChatMessage(`Analysis: Selected ${selectedList.join(' + ')}. Preparing assessment...`);
    }
  }, [symptoms]);

  return (
    <div className="relative w-full h-full bg-[#030611] overflow-hidden font-sans flex select-none text-slate-300 p-2">
      
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 gap-2 p-1.5 opacity-15 pointer-events-none select-none text-[5px] text-emerald-500/40">
        {Array.from({ length: 96 }).map((_, i) => (
          <span key={i} className="text-center font-extralight">+</span>
        ))}
      </div>
      
      <div 
        className="absolute left-0 right-0 h-[10px] bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent pointer-events-none z-0 border-y border-emerald-500/20" 
        style={{
          animation: 'health-scan-y 3s linear infinite',
          willChange: 'transform'
        }}
      />

      <div className="relative z-10 w-full h-full flex flex-col gap-1.5 justify-between">
        
        <div className="flex flex-col items-center justify-center gap-0.5 mt-0.5">
          
          <div className="w-5 h-5 rounded-md bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.15)]">
            <svg className="w-3 h-3 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="text-[8.5px] font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent uppercase text-center mt-0.5 leading-none">
            Virtual Health Assistant
          </h1>
          <p className="text-[4px] text-slate-400 text-center font-bold uppercase tracking-widest leading-none max-w-[140px]">
            Your intelligent guide to understanding and monitoring symptoms
          </p>
        </div>

        
        <div className="flex-1 grid grid-cols-12 gap-1.5 my-1 overflow-hidden">
          
          <div className="col-span-7 bg-black/40 border border-slate-900 rounded p-1 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center gap-1 text-[4.5px] text-emerald-400 font-extrabold border-b border-slate-900/60 pb-0.5 mb-1 shrink-0">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span>📋 SYMPTOM CHECKER</span>
            </div>

            <div className="flex-1 flex flex-wrap gap-0.5 content-start overflow-y-auto">
              {symptoms.map((symptom) => (
                <button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`px-1 py-0.5 rounded text-[3.8px] font-black uppercase transition-all duration-150 flex items-center gap-0.5 border ${
                    symptom.selected
                      ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-[0_0_4px_rgba(16,185,129,0.2)]'
                      : 'bg-slate-950/60 border-slate-900 text-slate-500 hover:text-slate-400 hover:border-slate-800'
                  }`}
                >
                  <span>{symptom.selected ? '✓' : '+'}</span>
                  <span>{symptom.label}</span>
                </button>
              ))}
            </div>

            <div className="text-[3.5px] text-slate-500 font-bold border-t border-slate-900/40 pt-0.5 mt-0.5 flex justify-between shrink-0">
              <span>ACTIVE: {symptoms.filter(s => s.selected).length} SYMPTOMS</span>
              <span className="text-emerald-500">READY</span>
            </div>
          </div>

          
          <div className="col-span-5 bg-black/40 border border-slate-900 rounded p-1 flex flex-col justify-between overflow-hidden">
            
            <div className="flex justify-between items-center text-[4px] font-extrabold border-b border-slate-900/60 pb-0.5 shrink-0">
              <div className="flex items-center gap-0.5 text-emerald-400">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                <span>Dr. Sneha Reddy</span>
              </div>
              <span className="text-[3.5px] text-slate-500 bg-slate-950 px-0.5 rounded">GP_CONSULT</span>
            </div>

            
            <div className="flex-1 flex flex-col justify-center py-1 relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-40">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute h-[0.5px] bg-emerald-500/80 w-full" 
                    style={{ 
                      top: `${15 + i * 25}%`,
                      animation: `health-scan-x ${1.5 + i * 0.5}s linear infinite`,
                      animationDelay: `${i * 0.3}s`,
                      willChange: 'transform'
                    }} 
                  />
                ))}
              </div>
              <div className="bg-slate-950/80 border border-slate-900 rounded p-1 text-[3.5px] leading-tight text-slate-300 relative min-h-[22px] flex items-center z-10 shadow-[0_0_8px_rgba(0,0,0,0.5)]">
                <p className="font-medium tracking-wide">
                  {chatMessage}
                  <span className="inline-block w-0.5 h-1.5 bg-emerald-400 ml-0.5 animate-pulse" />
                </p>
              </div>
            </div>

            
            <div className="flex justify-between items-center shrink-0 border-t border-slate-900/40 pt-0.5 mt-0.5">
              <span className="text-[3.5px] font-black text-indigo-400">AI ASSESSMENT</span>
              <div className="relative w-3.5 h-3.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center overflow-hidden">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-400 absolute top-0.5" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-200 absolute top-1" />
                <div className="w-3 h-2 bg-slate-600 rounded-t-sm absolute bottom-0" />
                <div className="w-2 h-2 rounded-full border border-emerald-400/40 absolute top-1" />
                <span className="absolute bottom-0 right-0 w-1 h-1 bg-rose-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        
        <div className="flex justify-between items-center text-[4px] font-black text-slate-500 border-t border-slate-900/40 pt-0.5">
          <span>🔬 ENGINE: CLINICAL_GPT_v1</span>
          <span className="text-emerald-500">ACCURACY: 99.4%</span>
        </div>
      </div>
    </div>
  );
}

export default function ArcadeCabinet() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeProject = PROJECTS[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % PROJECTS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);
  };

  const getGemGlow = (type: string) => {
    switch (type) {
      case 'ruby':
        return 'shadow-rose-500/20 border-rose-500/40 text-rose-400';
      case 'emerald':
        return 'shadow-emerald-500/20 border-emerald-500/40 text-emerald-400';
      case 'sapphire':
        return 'shadow-blue-500/20 border-blue-500/40 text-blue-400';
      case 'amethyst':
        return 'shadow-violet-500/20 border-violet-500/40 text-violet-400';
      default:
        return 'shadow-slate-500/20 border-slate-500/40 text-slate-400';
    }
  };

  const getGemSolidColor = (type: string) => {
    switch (type) {
      case 'ruby': return 'bg-rose-500';
      case 'emerald': return 'bg-emerald-500';
      case 'sapphire': return 'bg-blue-500';
      case 'amethyst': return 'bg-violet-500';
      default: return 'bg-slate-500';
    }
  };

  const getGemBgGradient = (type: string) => {
    switch (type) {
      case 'ruby': return 'from-rose-500/10 via-rose-500/5 to-transparent border-rose-500/20';
      case 'emerald': return 'from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20';
      case 'sapphire': return 'from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/20';
      case 'amethyst': return 'from-violet-500/10 via-violet-500/5 to-transparent border-violet-500/20';
      default: return 'from-slate-500/10 to-transparent border-slate-500/20';
    }
  };

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 lg:p-8 relative overflow-hidden" id="projects-selector">
      
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 border-b border-slate-900 pb-5">
        <div>
          <h3 className="text-lg font-bold font-sans text-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            Arcade Project Emulator
          </h3>
          <p className="text-xs font-mono text-slate-400">
            Select and run the deployed full-stack software cartridges
          </p>
        </div>

        
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 active:scale-95 transition-all cursor-pointer"
            title="Previous Game"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-xs font-mono text-slate-400">
            CARTRIDGE <span className="text-violet-400 font-bold">{currentIndex + 1}</span> OF <span className="text-slate-300 font-bold">{PROJECTS.length}</span>
          </span>

          <button
            onClick={handleNext}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 active:scale-95 transition-all cursor-pointer"
            title="Next Game"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeProject.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch border rounded-2xl p-6 lg:p-8 bg-gradient-to-br ${getGemBgGradient(activeProject.gemType)} shadow-[0_0_20px_rgba(0,0,0,0.4)]`}
        >
          
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            <div className={`relative bg-slate-950 border-4 rounded-2xl overflow-hidden aspect-[4/3] group shadow-[0_0_15px_rgba(0,0,0,0.6)] flex flex-col`}
                 style={{ borderColor: activeProject.gemType === 'ruby' ? '#f43f5e' : activeProject.gemType === 'emerald' ? '#10b981' : activeProject.gemType === 'sapphire' ? '#3b82f6' : '#8b5cf6' }}>
              
              
              <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] opacity-60" />
              <div className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-tr from-white/0 via-white/5 to-white/10" />

              
              <div className="bg-black/90 border-b border-slate-900 px-3 py-1.5 flex justify-between items-center z-10 text-[8px] font-mono select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span className="text-slate-400 font-black uppercase">MONITOR_01</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[7.5px] text-fuchsia-400 font-extrabold uppercase animate-pulse">CRT ENGINE LIVE</span>
                </div>
              </div>

              
              <div className="flex-1 w-full bg-black relative overflow-hidden">
                {activeProject.id === 'traffic-flow' ? (
                  <TrafficSimulation />
                ) : activeProject.id === 'virtual-health' ? (
                  <HealthSimulation />
                ) : (
                  <div className="w-full h-full bg-[#020204] flex flex-col items-center justify-center p-4">
                    <Cpu className="w-8 h-8 text-slate-500 animate-spin" />
                    <span className="text-[9px] font-mono text-slate-400 uppercase mt-2">CARTRIDGE LOAD FAILURE</span>
                  </div>
                )}
              </div>

              
              <div className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.45)_100%)]" />

              
              <div className="bg-black border-t border-slate-900/80 px-3 py-1.5 flex justify-between items-center z-10 text-[7.5px] font-mono select-none">
                <span className="text-slate-500 font-bold uppercase">{activeProject.id.toUpperCase()}.EXE</span>
                <span className="text-[#00ff41] font-black uppercase tracking-widest bg-[#00ff41]/10 px-1.5 py-0.5 rounded border border-[#00ff41]/20">ARCADE_THEME</span>
              </div>
            </div>

            
            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-2 tracking-wide uppercase">
                CARTRIDGE DIAGNOSTICS
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {activeProject.stats.map((stat, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-900 rounded-xl p-3 text-center shadow-inner">
                    <span className="text-[10px] font-mono text-slate-500 block leading-tight">
                      {stat.label}
                    </span>
                    <span className="text-sm font-mono font-extrabold text-emerald-400 block mt-1">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              
              <div>
                <h2 className="text-xl lg:text-2xl font-bold font-sans text-slate-100 tracking-tight leading-none mb-2">
                  {activeProject.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {activeProject.description}
                </p>
              </div>

              
              <div className="flex flex-wrap gap-1.5">
                {activeProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-slate-300 rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              
              <div className="space-y-2 bg-slate-950/40 p-4.5 border border-slate-900 rounded-2xl">
                <label className="text-[9px] font-mono text-slate-400 block tracking-wide uppercase mb-1">
                  CORE OUTCOMES & EXPERIENCES
                </label>
                <div className="space-y-2">
                  {activeProject.impactPoints.map((point, idx) => (
                    <div key={idx} className="flex gap-2.5 text-xs text-slate-300 font-sans leading-normal">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={activeProject.github}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-900 hover:bg-slate-800 text-slate-100 text-xs font-mono font-bold px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-750 transition-all flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                SOURCE CODE
              </a>
              {activeProject.live && (
                <a
                  href={activeProject.live}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-mono font-bold px-4 py-2.5 rounded-xl border border-violet-500/50 shadow-lg shadow-violet-600/20 transition-all flex items-center gap-2"
                >
                  <PlayCircle className="w-4 h-4" />
                  LAUNCH STAGE
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      
      <div className="mt-8 border-t border-slate-900/60 pt-6 flex justify-between items-center bg-slate-950/20 -mx-6 -mb-6 px-6 pb-6 rounded-b-3xl">
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center relative shadow-inner">
            <div className="w-4 h-4 rounded-full bg-rose-500 animate-pulse relative" />
            <div className="absolute top-1/2 left-1/2 w-8 h-1 bg-rose-500/40 origin-left -translate-y-1/2 -rotate-45" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 block leading-none">SYSTEM CONTROL</span>
            <span className="text-[11px] font-mono text-slate-300 font-bold">JOYSTICK_UP_ACTIVE</span>
          </div>
        </div>

        
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-full bg-rose-600 border-2 border-rose-500 hover:bg-rose-500 shadow-lg shadow-rose-600/30 active:scale-90 transition-all font-mono font-bold text-[10px] text-white flex items-center justify-center cursor-pointer"
          >
            A
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-full bg-blue-600 border-2 border-blue-500 hover:bg-blue-500 shadow-lg shadow-blue-600/30 active:scale-90 transition-all font-mono font-bold text-[10px] text-white flex items-center justify-center cursor-pointer"
          >
            B
          </button>
          <button
            onClick={() => {
              window.open('https://github.com/monkeysoul-cmd', '_blank');
            }}
            className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-emerald-500 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 active:scale-90 transition-all font-mono font-bold text-[10px] text-white flex items-center justify-center cursor-pointer"
            title="Open monkeysoul-cmd GitHub Profile"
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
}
