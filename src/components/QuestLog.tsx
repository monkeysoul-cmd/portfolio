import { useState } from 'react';
import { QUESTS } from '../data';
import { Quest } from '../types';
import { Trophy, Compass, Landmark, Briefcase, ChevronDown, CheckCircle, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function QuestLog() {
  const [activeQuest, setActiveQuest] = useState<string | null>('sih-2025');

  const getQuestIcon = (type: string) => {
    switch (type) {
      case 'education':
        return <Landmark className="w-5 h-5 text-sky-400" />;
      case 'experience':
        return <Briefcase className="w-5 h-5 text-emerald-400" />;
      case 'milestone':
        return <Trophy className="w-5 h-5 text-amber-400" />;
      default:
        return <Compass className="w-5 h-5 text-violet-400" />;
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'education':
        return 'bg-sky-500/15 border-sky-500/30 text-sky-400';
      case 'experience':
        return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400';
      case 'milestone':
        return 'bg-amber-500/15 border-amber-500/30 text-amber-400';
      default:
        return 'bg-violet-500/15 border-violet-500/30 text-violet-400';
    }
  };

  return (
    <div className="space-y-4" id="experience-questlog">
      {QUESTS.slice().reverse().map((quest, index) => {
        const isExpanded = activeQuest === quest.id;
        const stageNum = QUESTS.length - index;

        return (
          <div
            key={quest.id}
            className={`bg-slate-950/80 border rounded-2xl overflow-hidden transition-all duration-300 ${
              isExpanded
                ? 'border-violet-500/40 shadow-lg shadow-violet-500/5'
                : 'border-slate-800/80 hover:border-slate-700/80'
            }`}
          >
            
            <div
              onClick={() => setActiveQuest(isExpanded ? null : quest.id)}
              className="p-5 flex items-center justify-between cursor-pointer select-none gap-4"
            >
              <div className="flex items-center gap-4">
                
                <div className="text-center shrink-0">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">STAGE</span>
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sm font-mono font-extrabold text-violet-400 shadow-inner">
                    0{stageNum}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${getBadgeStyle(quest.type)}`}>
                      {quest.type === 'milestone' ? 'HACKATHON' : quest.type}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      {quest.period}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold font-sans text-slate-100 tracking-tight leading-tight">
                    {quest.title}
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400">
                    {quest.organization}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] rounded-lg">
                  <CheckCircle className="w-3.5 h-3.5" />
                  COMPLETED
                </div>

                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>

            
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="px-5 pb-5 pt-1 border-t border-slate-900/60 grid grid-cols-1 md:grid-cols-12 gap-5 bg-slate-950/40">
                    
                    <div className="md:col-span-8 space-y-3.5">
                      <label className="text-[10px] font-mono text-slate-400 block tracking-wider uppercase">
                        CAMPAIGN OBJECTIVES ACHIEVED
                      </label>
                      <ul className="space-y-2.5">
                        {quest.description.map((point, pIdx) => (
                          <li key={pIdx} className="flex gap-2.5 text-xs text-slate-300 leading-relaxed font-sans">
                            <span className="text-violet-400 font-mono shrink-0 select-none">▶</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    
                    <div className="md:col-span-4 bg-slate-900/40 border border-slate-850 rounded-xl p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <Award className="w-4 h-4 text-amber-400" />
                          <span className="text-[10px] font-mono text-slate-300 font-bold tracking-wide">
                            STAGE REWARDS
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {quest.rewards.map((reward, rIdx) => (
                            <div
                              key={rIdx}
                              className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5"
                            >
                              <span className="text-emerald-400/60">+</span>
                              <span>{reward}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-[9px] font-mono text-emerald-400/80">
                          XP CREDITED TO BALANCE
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
