import { Ghost, Rocket, Sword, Coins, Star, Zap, Target, Gamepad2 } from 'lucide-react';

export default function ArcadeBackground() {
  return (
    <>
      {/* Deep Space Stars Background */}
      <div className="star-field" />
      <div className="star-field layer-2" />
      <div className="star-field layer-3" />

      {/* Synthwave Perspective Grid */}
      <div className="synthwave-grid" />

      {/* Random Lasers in Background */}
      <div className="laser-beam" style={{ left: '10%', animationDelay: '0s', height: '150px' }} />
      <div className="laser-beam" style={{ left: '35%', animationDelay: '2s', height: '120px', background: 'linear-gradient(to bottom, transparent, #00ff41, #00ff41, transparent)', boxShadow: '0 0 10px #00ff41' }} />
      <div className="laser-beam" style={{ left: '70%', animationDelay: '1.2s', height: '200px' }} />
      <div className="laser-beam" style={{ left: '85%', animationDelay: '3.5s', height: '100px', background: 'linear-gradient(to bottom, transparent, #00ff41, #00ff41, transparent)', boxShadow: '0 0 10px #00ff41' }} />

      {/* Floating Arcade Icons (Layered Parallax) */}
      <div className="arcade-bg-element f-1" style={{ top: '15%', left: '5%', color: '#ff00ff' }}>
        <Ghost size={64} strokeWidth={1} />
      </div>
      <div className="arcade-bg-element f-2" style={{ top: '40%', right: '8%', color: '#00ff41' }}>
        <Rocket size={80} strokeWidth={1} />
      </div>
      <div className="arcade-bg-element f-3" style={{ top: '65%', left: '10%', color: '#ff00ff' }}>
        <Gamepad2 size={72} strokeWidth={1} />
      </div>
      <div className="arcade-bg-element f-1" style={{ top: '80%', right: '15%', color: '#00ff41' }}>
        <Sword size={56} strokeWidth={1} />
      </div>
      <div className="arcade-bg-element f-2" style={{ top: '25%', right: '25%', color: '#ff00ff' }}>
        <Coins size={48} strokeWidth={1} />
      </div>
      <div className="arcade-bg-element f-3" style={{ top: '55%', left: '20%', color: '#00ff41' }}>
        <Target size={90} strokeWidth={1} />
      </div>
      <div className="arcade-bg-element f-1" style={{ top: '10%', right: '40%', color: '#ff00ff' }}>
        <Zap size={40} strokeWidth={1} />
      </div>
      
      {/* Animated Rising Stars */}
      {[...Array(5)].map((_, i) => (
        <div 
          key={i} 
          className="fixed pointer-events-none z-[-1] text-[#00ff41]"
          style={{
            left: `${15 + i * 18}%`,
            animation: `float-arcade-4 ${8 + i * 2}s linear infinite`,
            animationDelay: `${i * 1.5}s`
          }}
        >
          <Star size={24} fill="currentColor" opacity={0.2} />
        </div>
      ))}
    </>
  );
}
