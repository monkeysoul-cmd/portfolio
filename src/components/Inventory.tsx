import { useState } from 'react';
import { SKILLS } from '../data';
import { Skill } from '../types';
import { Shield, Flame, Sparkles, Database, Cpu, Layers, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InventoryProps {
  unlockedGemsCount: number;
}

const getSkillAbbreviation = (name: string) => {
  switch (name) {
    case 'C++': return 'C++';
    case 'JavaScript': return 'JS';
    case 'TypeScript': return 'TS';
    case 'Python': return 'PY';
    case 'HTML': return 'HTML';
    case 'CSS': return 'CSS';
    case 'HTML / CSS': return 'UI';
    case 'React.js': return 'RCT';
    case 'Next.js': return 'NXT';
    case 'Angular.js': return 'ANG';
    case 'Vue.js': return 'VUE';
    case 'Node.js / Express': return 'NODE';
    case 'Tailwind CSS': return 'TW';
    case 'MongoDB': return 'MDB';
    case 'MySQL': return 'SQL';
    case 'AWS Cloud': return 'AWS';
    case 'RESTful APIs': return 'API';
    case 'Git & GitHub': return 'GIT';
    case 'DSA / Algos': return 'DSA';
    case 'OOPs Pattern': return 'OOP';
    case 'Team Leadership': return 'LDR';
    case 'State Management': return 'STM';
    default: return name.slice(0, 3).toUpperCase();
  }
};

export default function Inventory({ unlockedGemsCount }: InventoryProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Languages' | 'Frameworks & Libraries' | 'Databases & Tools' | 'Concepts'>('All');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(SKILLS[0]);

  const categories: ('All' | 'Languages' | 'Frameworks & Libraries' | 'Databases & Tools' | 'Concepts')[] = [
    'All',
    'Languages',
    'Frameworks & Libraries',
    'Databases & Tools',
    'Concepts'
  ];

  const filteredSkills = SKILLS.filter(
    (s) => activeCategory === 'All' || s.category === activeCategory
  );

  const getGemColors = (type: 'ruby' | 'emerald' | 'sapphire' | 'amethyst') => {
    switch (type) {
      case 'ruby':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20',
          glow: 'shadow-rose-500/20',
          solid: 'bg-rose-500',
          text: 'text-rose-400',
          border: 'border-rose-500/40',
        };
      case 'emerald':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20',
          glow: 'shadow-emerald-500/20',
          solid: 'bg-emerald-500',
          text: 'text-emerald-400',
          border: 'border-emerald-500/40',
        };
      case 'sapphire':
        return {
          bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20',
          glow: 'shadow-blue-500/20',
          solid: 'bg-blue-500',
          text: 'text-blue-400',
          border: 'border-blue-500/40',
        };
      case 'amethyst':
        return {
          bg: 'bg-violet-500/10 border-violet-500/30 text-violet-400 hover:bg-violet-500/20',
          glow: 'shadow-violet-500/20',
          solid: 'bg-violet-500',
          text: 'text-violet-400',
          border: 'border-violet-500/40',
        };
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Languages':
        return <Cpu className="w-4 h-4" />;
      case 'Frameworks & Libraries':
        return <Layers className="w-4 h-4" />;
      case 'Databases & Tools':
        return <Database className="w-4 h-4" />;
      case 'Concepts':
        return <Shield className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="skills-inventory">
      
      <div className="lg:col-span-8 flex flex-col gap-5">
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                
                const list = SKILLS.filter((s) => cat === 'All' || s.category === cat);
                if (list.length > 0) setSelectedSkill(list[0]);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'Frameworks & Libraries' ? 'Frameworks' : cat === 'Databases & Tools' ? 'Tools' : cat}
            </button>
          ))}
        </div>

        
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
            {filteredSkills.map((skill, index) => {
              const isLocked = false;
              const colors = getGemColors(skill.gemType);
              const isSelected = selectedSkill?.name === skill.name;

              return (
                <div
                  key={skill.name}
                  onClick={() => !isLocked && setSelectedSkill(skill)}
                  className={`aspect-square rounded-xl border flex flex-col items-center justify-center relative group transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] ${
                    isLocked
                      ? 'bg-slate-900/30 border-slate-900 text-slate-600 cursor-not-allowed opacity-50'
                      : isSelected
                      ? `${colors.bg} ${colors.border} shadow-lg ring-2 ring-violet-500/40 cursor-pointer scale-102`
                      : 'bg-slate-900/50 border-slate-800/80 hover:scale-102 text-slate-300 cursor-pointer hover:border-slate-700'
                  }`}
                  title={isLocked ? `Unlocks at ${skill.unlockedAtGems} Gem level` : skill.name}
                >
                  
                  <span className="absolute top-1 left-1.5 text-[9px] font-mono text-slate-500">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  
                  {isLocked ? (
                    <div className="text-slate-600 text-xs font-mono font-bold">LOCKED</div>
                  ) : (
                    <div className="relative flex flex-col items-center justify-center w-full h-full pt-3 px-1">
                      
                      <div className="relative flex items-center justify-center w-12 h-12 mb-2">
                        <div
                          className={`w-9 h-9 rotate-45 transition-transform group-hover:rotate-180 duration-500 absolute rounded-[2px] shadow-[0_0_12px_var(--tw-shadow-color)] ${colors.solid} ${colors.glow} float-pebble-${index % 4}`}
                        />
                        
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full absolute -top-0.5 -left-0.5 pointer-events-none blur-[0.5px]" />
                        
                        
                        <span className="absolute text-[8.5px] font-sans font-black text-white pointer-events-none select-none uppercase tracking-tighter">
                          {getSkillAbbreviation(skill.name)}
                        </span>
                      </div>

                      
                      <span className="text-[8px] font-mono font-bold uppercase text-slate-400 group-hover:text-slate-200 tracking-tight text-center truncate max-w-full">
                        {skill.name}
                      </span>
                    </div>
                  )}

                  
                  {isLocked && (
                    <span className="absolute bottom-1 text-[8px] font-mono text-violet-400/80 bg-violet-950/40 px-1 rounded border border-violet-900/20">
                      LVL {skill.unlockedAtGems}
                    </span>
                  )}
                </div>
              );
            })}

            
            {Array(Math.max(0, 18 - filteredSkills.length))
              .fill(null)
              .map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="aspect-square rounded-xl border border-dashed border-slate-900/50 bg-slate-950/20 flex items-center justify-center opacity-25"
                >
                  <span className="text-[10px] text-slate-700 font-mono">+</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      
      <div className="lg:col-span-4 h-full self-stretch flex flex-col">
        <AnimatePresence mode="wait">
          {selectedSkill ? (
            <motion.div
              key={selectedSkill.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex-1 flex flex-col justify-between shadow-xl"
            >
              
              <div
                className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -z-10 opacity-10 ${
                  getGemColors(selectedSkill.gemType).solid
                }`}
              />

              <div>
                
                <div className="flex items-center gap-2 mb-3.5">
                  <div
                    className={`p-1.5 rounded-lg border flex items-center justify-center ${
                      getGemColors(selectedSkill.gemType).bg
                    }`}
                  >
                    {getCategoryIcon(selectedSkill.category)}
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">
                      {selectedSkill.category}
                    </span>
                    <h3 className="text-lg font-bold font-sans text-slate-100 tracking-tight leading-none">
                      {selectedSkill.name}
                    </h3>
                  </div>
                </div>

                
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-slate-400 font-bold">POWER LEVEL</span>
                    <span className="text-xs font-mono font-extrabold text-violet-400">
                      {selectedSkill.level === 5 ? 'MAX LEVEL' : `Lvl ${selectedSkill.level}`}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {Array(5)
                      .fill(null)
                      .map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-sm transition-all duration-300 ${
                            i < selectedSkill.level
                              ? `${getGemColors(selectedSkill.gemType).solid} shadow-[0_0_8px_var(--tw-shadow-color)] ${getGemColors(selectedSkill.gemType).glow}`
                              : 'bg-slate-800'
                          }`}
                        />
                      ))}
                  </div>
                </div>

                
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">EQUIPPED ATTRIBUTES</label>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800/60 font-sans min-h-[70px]">
                    {selectedSkill.description}
                  </p>
                </div>
              </div>

              
              <div className="mt-6 pt-4 border-t border-slate-800/60 grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/40 text-center">
                  <span className="text-[9px] font-mono text-slate-500 block">PROFICIENCY</span>
                  <span className="text-[11px] font-mono text-slate-300 font-bold">
                    {selectedSkill.level === 5 ? 'EXPERT' : selectedSkill.level === 4 ? 'ADVANCED' : 'INTERMEDIATE'}
                  </span>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/40 text-center">
                  <span className="text-[9px] font-mono text-slate-500 block">RARITY</span>
                  <span
                    className={`text-[11px] font-mono font-bold ${
                      selectedSkill.level === 5
                        ? 'text-amber-400'
                        : selectedSkill.level === 4
                        ? 'text-purple-400'
                        : 'text-blue-400'
                    }`}
                  >
                    {selectedSkill.level === 5 ? 'Legendary' : selectedSkill.level === 4 ? 'Epic' : 'Rare'}
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center flex-1">
              <Award className="w-8 h-8 text-slate-600 mb-2 animate-pulse" />
              <p className="text-xs text-slate-500 font-mono">Select a gem slot to inspect statistics</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
