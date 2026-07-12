export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  github: string;
  live?: string;
  stats: { label: string; value: string }[];
  gemType: 'ruby' | 'emerald' | 'sapphire' | 'amethyst';
  impactPoints: string[];
}

export interface Skill {
  name: string;
  category: 'Languages' | 'Frameworks & Libraries' | 'Databases & Tools' | 'Concepts';
  level: number; 
  description: string;
  gemType: 'ruby' | 'emerald' | 'sapphire' | 'amethyst';
  unlockedAtGems: number;
}

export interface Quest {
  id: string;
  stage: number;
  title: string;
  organization: string;
  period: string;
  type: 'experience' | 'education' | 'milestone';
  description: string[];
  rewards: string[];
}

export interface Trophy {
  id: string;
  title: string;
  subtitle: string;
  detail: string;
  points: number;
  unlocked: boolean;
  gemType: 'ruby' | 'emerald' | 'sapphire' | 'amethyst';
}
