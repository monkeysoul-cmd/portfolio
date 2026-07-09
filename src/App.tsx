import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Gamepad2,
  Trophy,
  Coins,
  Music,
  Code,
  Sparkles,
  Database,
  Cpu,
  Layers,
  Search,
  Mail,
  Phone,
  MapPin,
  Activity,
  ArrowRight,
  Github,
  Linkedin,
  Terminal,
  ExternalLink,
  FileText,
  Send,
  User,
  Clock,
  Heart
} from 'lucide-react';

import BugBlasterGame from './components/BugBlasterGame';
import GemGame from './components/GemGame';
import Inventory from './components/Inventory';
import QuestLog from './components/QuestLog';
import AchievementsGrid from './components/AchievementsGrid';
import ArcadeCabinet from './components/ArcadeCabinet';

export default function App() {
  const [gemsCount, setGemsCount] = useState(3); // Start with 3 standard unlocked gems
  const [scorePoints, setScorePoints] = useState(0);
  const [clockTime, setClockTime] = useState('');
  // Form states
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formTransmitting, setFormTransmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Sound triggers
  const onSoundTriggerRef = useRef<((type: 'coin' | 'laser' | 'powerup' | 'gem') => void) | null>(null);

  const triggerSound = (type: 'coin' | 'laser' | 'powerup' | 'gem') => {
    if (onSoundTriggerRef.current) {
      onSoundTriggerRef.current(type);
    }
  };

  // Log events to virtual terminal / console
  const logEvent = (msg: string) => {
    console.log(`[EVENT]: ${msg}`);
  };

  // Clock tick
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClockTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Increase gems count as score climbs
  useEffect(() => {
    if (scorePoints > 0 && scorePoints % 200 === 0) {
      setGemsCount((g) => {
        const nextG = g + 1;
        logEvent(`GEM LEVEL UP! Unlocked Slot ${nextG} Gem!`);
        triggerSound('powerup');
        return nextG;
      });
    }
  }, [scorePoints]);

  const handleGameScore = (pts: number, message?: string) => {
    setScorePoints((prev) => prev + pts);
    if (message) {
      logEvent(`${message} (+${pts} PTS!)`);
    } else {
      logEvent(`EARNED +${pts} PTS! CURRENT SCORE: ${scorePoints + pts}`);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormTransmitting(true);
    triggerSound('laser');
    logEvent(`TRANSMITTING PACKAGE TO AYUSH...`);

    setTimeout(() => {
      setFormTransmitting(false);
      setFormSuccess(true);
      triggerSound('powerup');
      logEvent(`ESTABLISHED SECURE LINK. MESSAGE DELIVERED!`);

      const subject = encodeURIComponent(`Contact from ${formData.name}`);
      const body = encodeURIComponent(`Sender Name: ${formData.name}\nSender Email: ${formData.email}\n\nMessage:\n${formData.message}`);
      window.location.href = `mailto:ayushrajput87917@gmail.com?subject=${subject}&body=${body}`;

      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormSuccess(false), 5000);
    }, 1800);
  };

  return (
    <div 
      className="min-h-screen bg-[#050505] text-[#00ff41] relative overflow-x-hidden font-mono selection:bg-[#ff00ff]/30"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 255, 65, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 65, 0.08) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Absolute Corner Borders for the viewport framing */}
      <div className="fixed top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#00ff41] z-50 pointer-events-none" />
      <div className="fixed top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#00ff41] z-50 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#00ff41] z-50 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#00ff41] z-50 pointer-events-none" />

      {/* Subtle CRT Overlay & Vignette */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.04),rgba(0,255,0,0.02),rgba(0,0,255,0.04))] bg-[length:100%_4px,4px_100%] opacity-40" />
      <div className="crt-vignette" />

      {/* Main Top Stat Bar / Navigation Header (Design Theme replica) */}
      <header className="max-w-6xl mx-auto px-4 pt-6 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-[#00ff41] mb-8 gap-4">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter uppercase italic retro-header select-none name-glitch-hover" data-text="AYUSH_BHATI.CMD">
            AYUSH_BHATI.CMD
          </h1>
          <p className="text-xs mt-1 text-[#00ff41] opacity-80 uppercase font-bold animate-arcade-flicker">
            PLAYER PORTFOLIO // EMU_STATUS: ONLINE
          </p>
        </div>
        <div className="w-full md:w-auto flex flex-wrap justify-between md:justify-end gap-6 items-center">
          <div className="text-xs text-right">
            <p className="text-[#ff00ff] font-bold">GITHUB CONNECTED</p>
            <p className="text-white font-mono">@MONKEYSOUL-CMD</p>
          </div>
          <div className="bg-[#00ff41] text-black px-4 py-2 font-black italic tracking-widest animate-arcade-score select-none">
            SCORE: {scorePoints}
          </div>
        </div>
      </header>

      {/* Hero Header Space */}
      <section className="max-w-6xl mx-auto px-4 pt-4 pb-6 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-[#ff00ff]/5 rounded-full blur-3xl -z-10" />

        {/* Level Emblem */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 bg-[#ff00ff]/10 border-2 border-[#ff00ff] px-4 py-1.5 text-[#ff00ff] text-xs font-mono mb-6 uppercase tracking-wider font-extrabold"
        >
          <Trophy className="w-3.5 h-3.5 text-[#ff00ff]" />
          RUNNER-UP • SMART INDIA HACKATHON 2025
        </motion.div>

        {/* Animated Greeting */}
        <div className="text-xl sm:text-2xl font-mono font-bold text-[#00ff41] mb-1">
          {"Hii, i am".split('').map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, display: 'inline-block' }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.05, delay: 0.2 + index * 0.05 }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </div>

        {/* Main Name Heading */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-5xl sm:text-7xl font-mono font-black tracking-tighter uppercase italic text-transparent retro-header mb-4 name-glitch-hover"
          data-text="AYUSH BHATI"
        >
          AYUSH BHATI
        </motion.h2>

        {/* Subtitle / Bio */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto text-xs sm:text-sm text-[#00ff41]/90 leading-relaxed font-mono mb-8 border-l-4 border-r-4 border-[#ff00ff] px-4 text-left"
        >
          A software developer skilled in <span className="text-[#ff00ff] font-extrabold">React.js</span>,{' '}
          <span className="text-white font-extrabold">Next.js</span>,{' '}
          <span className="text-[#00ff41] font-extrabold">Node.js</span>, and{' '}
          <span className="text-[#ff00ff] font-extrabold">MongoDB</span>. I focus on building beautiful, interactive, and easy-to-use websites. I also designed an award-winning traffic simulator for SIH and an AI medical helper.
        </motion.p>

        {/* Profile badges / social links */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-10"
        >
          <a
            href="https://github.com/monkeysoul-cmd"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-[#111111] hover:bg-[#00ff41] hover:text-black text-[#00ff41] text-xs font-mono font-bold px-4 py-2.5 border-2 border-[#00ff41] transition-all cursor-crosshair hover-glitch-text"
          >
            <Github className="w-4 h-4" />
            GITHUB PROFILE
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-[#111111] hover:bg-[#00ff41] hover:text-black text-[#00ff41] text-xs font-mono font-bold px-4 py-2.5 border-2 border-[#00ff41] transition-all cursor-crosshair hover-glitch-text"
          >
            <Linkedin className="w-4 h-4" />
            LINKEDIN
          </a>

          <a
            href="mailto:ayushrajput87917@gmail.com"
            className="flex items-center gap-2 bg-[#111111] hover:bg-[#00ff41] hover:text-black text-[#00ff41] text-xs font-mono font-bold px-4 py-2.5 border-2 border-[#00ff41] transition-all cursor-crosshair hover-glitch-text"
          >
            <Mail className="w-4 h-4" />
            EMAIL AYUSH
          </a>

          {/* Direct Resume Link Option */}
          <button
            onClick={() => {
              logEvent('DOWNLOADING AYUSH_BHATI_RESUME.PDF...');
              triggerSound('powerup');
              alert('Initiating download of Ayush Bhati Resume representation!');
            }}
            className="flex items-center gap-2 bg-[#111111] hover:bg-[#ff00ff] hover:text-black text-[#ff00ff] text-xs font-mono font-bold px-4 py-2.5 border-2 border-[#ff00ff] transition-all cursor-crosshair hover-glitch-text"
          >
            <FileText className="w-4 h-4" />
            DOWNLOAD RESUME
          </button>
        </motion.div>
      </section>

      {/* Main Interactive Deck Grid (Cabinet & Synth Side-by-Side) */}
      <main className="max-w-6xl mx-auto px-4 pb-16 space-y-16">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Playable Game Cabinet Box */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 group">
                <span className="text-xs font-mono text-violet-400 font-bold bg-violet-950/40 px-2 py-0.5 rounded border border-violet-900/40 group-hover:hover-glitch-text transition-all cursor-default shadow-[0_0_10px_rgba(167,139,250,0.3)]">
                  STAGE_00
                </span>
                <h2 className="text-sm font-mono uppercase tracking-wider text-slate-300">
                  Interactive Cabinets
                </h2>
              </div>
            </div>
            
            <GemGame
              onScorePoints={handleGameScore}
              onSoundTrigger={triggerSound}
              gemsCount={gemsCount}
            />
          </div>

          {/* Retro Bug Blaster Arcade Game */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-mono text-fuchsia-400 font-bold bg-fuchsia-950/40 px-2 py-0.5 rounded border border-fuchsia-900/40">
                BUG_BLASTER
              </span>
              <h2 className="text-sm font-mono uppercase tracking-wider text-slate-300">
                Retro Bug Blaster
              </h2>
            </div>

            <BugBlasterGame
              onScorePoints={handleGameScore}
              onSoundTriggerRef={onSoundTriggerRef}
              onClose={() => {
                logEvent('RESETTING AND REBOOTING BUG BLASTER ARCADE CABINET...');
              }}
            />
          </div>
        </section>

        {/* Cartridge SELECT STAGE (Projects) Section */}
        <section className="space-y-6" id="projects">
          <div className="flex items-center gap-2 group">
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/40 group-hover:hover-glitch-text transition-all cursor-default shadow-[0_0_10px_rgba(52,211,153,0.3)]">
              STAGE_01
            </span>
            <h2 className="text-sm font-mono uppercase tracking-wider text-slate-300">
              Select Your Stage (Pinned Projects)
            </h2>
          </div>

          <ArcadeCabinet />
        </section>

        {/* HERO BAG INVENTORY (Skills) Section */}
        <section className="space-y-6" id="skills">
          <div className="flex items-center gap-2 group">
            <span className="text-xs font-mono text-blue-400 font-bold bg-blue-950/40 px-2 py-0.5 rounded border border-blue-900/40 group-hover:hover-glitch-text transition-all cursor-default shadow-[0_0_10px_rgba(96,165,250,0.3)]">
              STAGE_02
            </span>
            <h2 className="text-sm font-mono uppercase tracking-wider text-slate-300">
              Hero Backpack Inventory (Skills Tree)
            </h2>
          </div>

          <Inventory unlockedGemsCount={gemsCount} />
        </section>

        {/* QUEST CHRONOLOGY (Timeline) Section */}
        <section className="space-y-6" id="quests">
          <div className="flex items-center gap-2 group">
            <span className="text-xs font-mono text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/40 group-hover:hover-glitch-text transition-all cursor-default shadow-[0_0_10px_rgba(251,191,36,0.3)]">
              STAGE_03
            </span>
            <h2 className="text-sm font-mono uppercase tracking-wider text-slate-300">
              Campaign Chronology (Active Quest Log)
            </h2>
          </div>

          <QuestLog />
        </section>

        {/* TROPHY CABINET (Achievements) Section */}
        <section className="space-y-6" id="achievements">
          <div className="flex items-center gap-2 group">
            <span className="text-xs font-mono text-pink-400 font-bold bg-pink-950/40 px-2 py-0.5 rounded border border-pink-900/40 group-hover:hover-glitch-text transition-all cursor-default shadow-[0_0_10px_rgba(244,114,182,0.3)]">
              STAGE_04
            </span>
            <h2 className="text-sm font-mono uppercase tracking-wider text-slate-300">
              Trophy Room & Certifications
            </h2>
          </div>

          <AchievementsGrid onSoundTrigger={triggerSound} />
        </section>

        {/* CHAT TRANSMISSION (Contact) Section */}
        <section className="space-y-6" id="contact">
          <div className="flex items-center gap-2 group">
            <span className="text-xs font-mono text-fuchsia-400 font-bold bg-fuchsia-950/40 px-2 py-0.5 rounded border border-fuchsia-900/40 group-hover:hover-glitch-text transition-all cursor-default shadow-[0_0_10px_rgba(232,121,249,0.3)]">
              STAGE_05
            </span>
            <h2 className="text-sm font-mono uppercase tracking-wider text-slate-300">
              Transmit Code Package (Contact Deck)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Info Deck */}
            <div className="md:col-span-5 space-y-4">
              <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-5 space-y-4 shadow-inner">
                <h4 className="text-sm font-bold text-slate-200">Ayush Bhati HQ</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Available for full-time employment opportunities, hackathons, open-source projects, and technical consulting.
                </p>

                <div className="space-y-3 pt-2 text-xs font-mono">
                  <div className="flex items-center gap-3 text-slate-300">
                    <MapPin className="w-4 h-4 text-violet-400 shrink-0" />
                    <span>Bulandshahr, Uttar Pradesh, India</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                    <a href="mailto:ayushrajput87917@gmail.com" className="hover:underline">
                      ayushrajput87917@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>+91 93689 51820</span>
                  </div>
                </div>
              </div>

              {/* Competitive links box */}
              <div className="bg-slate-950/50 border border-slate-900 rounded-2xl p-4 flex justify-between gap-2">
                <a
                  href="https://leetcode.com" // Default, user LeetCode listed
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-[10px] font-mono py-2 rounded-xl text-center border border-slate-850 hover:text-white"
                >
                  LeetCode
                </a>
                <a
                  href="https://www.codechef.com" // Default, user CodeChef listed
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-[10px] font-mono py-2 rounded-xl text-center border border-slate-850 hover:text-white"
                >
                  CodeChef
                </a>
                <a
                  href="https://github.com/monkeysoul-cmd"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-[10px] font-mono py-2 rounded-xl text-center border border-slate-850 hover:text-white"
                >
                  GitHub
                </a>
              </div>
            </div>

            {/* Form deck */}
            <div className="md:col-span-7">
              <form
                onSubmit={handleFormSubmit}
                className="bg-slate-950/80 border border-slate-900 rounded-3xl p-6 lg:p-8 space-y-4 relative overflow-hidden"
              >
                {/* Visual glow overlay */}
                {formSuccess && (
                  <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center text-center z-10 p-4">
                    <Sparkles className="w-10 h-10 text-emerald-400 mb-2 animate-bounce" />
                    <h4 className="text-sm font-sans font-extrabold text-slate-100 uppercase">
                      TRANSMISSION SECURED!
                    </h4>
                    <p className="text-xs text-slate-400 font-mono mt-1 max-w-[280px]">
                      Your code package was encrypted and transmitted to ayushrajput87917@gmail.com. Connection intact.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                      <User className="w-3 h-3 text-violet-400" />
                      Sender Identity
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Commander Shepard"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-850 focus:border-violet-500/50 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                      <Mail className="w-3 h-3 text-rose-400" />
                      Secure Email URL
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. commander@alliance.com"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-850 focus:border-violet-500/50 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-emerald-400" />
                    Secure Message Payload
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter payload instructions..."
                    value={formData.message}
                    onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-850 focus:border-violet-500/50 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500/20 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formTransmitting}
                  className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-mono font-extrabold text-xs py-3 rounded-xl border border-violet-500/50 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" />
                  {formTransmitting ? 'TRANSMITTING PACKAGE...' : 'TRANSMIT MESSAGE'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Ticker Marquee */}
      <footer className="mt-12 border-t-2 border-b-2 border-[#00ff41]/50 bg-[#111111]/70 py-3 ticker-wrap select-none">
        <div className="ticker-content text-[11px] italic font-mono uppercase tracking-widest text-[#00ff41]">
          <span className="mx-8">INSERT_COIN_TO_HIRE</span>
          <span className="mx-8 opacity-60 text-white">READY PLAYER ONE</span>
          <span className="mx-8 text-[#ff00ff] font-bold">AVAILABLE FOR NEW PROJECTS //</span>
          <span className="mx-8 text-white">GITHUB.COM/MONKEYSOUL-CMD</span>
          <span className="mx-8 text-[#ff00ff] font-bold">FULL STACK CORE SYSTEM //</span>
          <span className="mx-8">INSERT_COIN_TO_HIRE</span>
          <span className="mx-8 opacity-60 text-white">READY PLAYER ONE</span>
          <span className="mx-8 text-[#ff00ff] font-bold">AVAILABLE FOR NEW PROJECTS //</span>
          <span className="mx-8 text-white">GITHUB.COM/MONKEYSOUL-CMD</span>
          <span className="mx-8 text-[#ff00ff] font-bold">FULL STACK CORE SYSTEM //</span>
        </div>
      </footer>

      {/* Footer credits */}
      <footer className="bg-[#050505] py-8 text-center text-xs font-mono text-[#00ff41]/60 space-y-2 border-t-2 border-[#00ff41]/10">
        <p className="flex items-center justify-center gap-1.5">
          <Heart className="w-3 h-3 text-[#ff00ff] fill-[#ff00ff] animate-pulse" />
        </p>
        <p className="text-[10px] text-white/50">
          AYUSH BHATI • ALL RIGHTS RESERVED © 2026
        </p>
      </footer>
    </div>
  );
}
