import { TROPHIES } from '../data';
import { Award, Trophy, Star, Sparkles, BookOpen, CheckCircle2, Globe } from 'lucide-react';

interface AchievementsGridProps {
  onSoundTrigger: (type: 'coin' | 'laser' | 'powerup' | 'gem') => void;
}

export default function AchievementsGrid({ onSoundTrigger }: AchievementsGridProps) {
  const certifications = [
    { name: 'MERN Stack Development', provider: 'Infosys Springboard', date: '2025' },
    { name: 'AWS Cloud Services', provider: 'Infosys Springboard', date: '2025' },
    { name: 'Python Programming', provider: 'Infosys Springboard', date: '2024' },
    { name: 'JavaScript Programming', provider: 'Infosys Springboard', date: '2024' },
  ];

  const getGemColors = (type: string) => {
    switch (type) {
      case 'ruby':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'emerald':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'sapphire':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'amethyst':
        return 'text-violet-400 bg-violet-500/10 border-violet-500/30';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  const getAchievementIcon = (id: string) => {
    switch (id) {
      case 'sih-crown':
        return <Trophy className="w-5 h-5" />;
      case 'cc-star':
        return <Star className="w-5 h-5 animate-pulse" />;
      case 'lc-dsa':
        return <Award className="w-5 h-5" />;
      case 'cc-global':
        return <Globe className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="achievements-podiums">
      
      <div className="lg:col-span-7 space-y-4">
        <label className="text-[10px] font-mono text-slate-400 block tracking-wider uppercase">
          Trophies & High Scores
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TROPHIES.map((trophy) => (
            <div
              key={trophy.id}
              onMouseEnter={() => onSoundTrigger('coin')}
              className="bg-slate-950/80 border border-slate-900 hover:border-slate-800 rounded-2xl p-5 relative overflow-hidden group transition-all duration-300 shadow-inner flex flex-col justify-between hover:scale-101"
            >
              
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/2 rounded-full blur-2xl group-hover:bg-violet-600/5 transition-all" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl border ${getGemColors(trophy.gemType)}`}>
                    {getAchievementIcon(trophy.id)}
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg font-extrabold flex items-center gap-1">
                    +{trophy.points} PTS
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-100 font-sans tracking-tight">
                    {trophy.title}
                  </h4>
                  <p className="text-[11px] font-mono text-violet-400 mt-0.5">
                    {trophy.subtitle}
                  </p>
                  <p className="text-xs text-slate-400 leading-normal mt-2">
                    {trophy.detail}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-900/60 flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                UNLOCKED
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <div className="lg:col-span-5 space-y-4">
        <label className="text-[10px] font-mono text-slate-400 block tracking-wider uppercase">
          Acquired Certifications
        </label>

        <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-5 space-y-4 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-600/5 rounded-full blur-3xl -z-10" />
          
          <div className="space-y-3.5">
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-slate-900/40 rounded-xl border border-slate-900 hover:border-slate-800 transition-colors"
              >
                <div className="p-2 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-lg mt-0.5 shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100 leading-tight">
                    {cert.name}
                  </h4>
                  <p className="text-[10px] font-mono text-slate-400 mt-1">
                    {cert.provider} • Verified {cert.date}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[9px] font-mono text-slate-500 block uppercase">CREDENTIAL CODES</span>
              <span className="text-[11px] font-mono text-slate-300 font-bold block mt-0.5">
                INFOSYS_SPRINGBOARD_ACTIVE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
