import { Project, Skill, Quest, Trophy } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'traffic-flow',
    title: 'Traffic Flow - Real-Time Traffic Monitoring Dashboard',
    description: 'Smart India Hackathon (SIH) 2025 Runner-Up project managing traffic flows with responsive signal-timing.',
    longDescription: 'Led a 6-member team to develop a real-time traffic monitoring dashboard. Developed the entire dashboard in React.js, contributing over 70% of the codebase. It implements intelligent signal-timing logic which improves decision accuracy and cuts local congestion.',
    tags: ['React.js', 'Signal-Timing Logic', 'Tailwind CSS', 'WebSockets', 'D3.js'],
    github: 'https://github.com/monkeysoul-cmd/traffic-flow',
    live: 'https://github.com/monkeysoul-cmd/traffic-flow', 
    gemType: 'emerald',
    stats: [
      { label: 'Overall Perf', value: '+18%' },
      { label: 'Decision Accuracy', value: '+25%' },
      { label: 'Congestion Cut', value: '-20%' }
    ],
    impactPoints: [
      'Led 6-member developer squad to SIH 2025 Runner-Up standing.',
      'Authored 70%+ of front-end dashboard code in React.',
      'Developed real-time adaptive signal-timing logic simulation engines.'
    ]
  },
  {
    id: 'virtual-health',
    title: 'Virtual Health Assistant - AI-Powered Symptom Checker',
    description: 'AI-powered clinical diagnostic tool that interprets user symptoms and suggests medical direction.',
    longDescription: 'A fully self-contained smart assistant powered by natural language algorithms to evaluate patient symptoms. Developed the entire interactive UI and integrated high-speed REST APIs to support fluid, real-time client-to-server exchanges.',
    tags: ['React.js', 'AI Algorithms', 'REST APIs', 'Node.js', 'Express.js', 'State Management'],
    github: 'https://github.com/monkeysoul-cmd/Virtual-Health-Assistant',
    live: 'https://github.com/monkeysoul-cmd/Virtual-Health-Assistant', 
    gemType: 'ruby',
    stats: [
      { label: 'AI Suggestion Acc', value: '+22%' },
      { label: 'Interaction Time', value: '-30%' },
      { label: 'Response Latency', value: '-25%' }
    ],
    impactPoints: [
      'Engineered an AI-driven symptom parsing core for diagnostic matching.',
      'Reduced average patient-to-platform interaction duration by nearly a third.',
      'Architected highly responsive backend endpoints cutting endpoint latency.'
    ]
  }
];

export const SKILLS: Skill[] = [
  
  { name: 'C++', category: 'Languages', level: 5, description: 'Core programming language for Data Structures & Algorithms.', gemType: 'sapphire', unlockedAtGems: 0 },
  { name: 'JavaScript', category: 'Languages', level: 5, description: 'Universal scripting for high-fidelity web dynamics.', gemType: 'ruby', unlockedAtGems: 0 },
  { name: 'TypeScript', category: 'Languages', level: 4, description: 'Type-safe scalable JavaScript app architecture.', gemType: 'emerald', unlockedAtGems: 2 },
  { name: 'Python', category: 'Languages', level: 4, description: 'Data structures, AI processing, and scripting.', gemType: 'amethyst', unlockedAtGems: 4 },
  { name: 'HTML', category: 'Languages', level: 5, description: 'Semantic, accessible, and structured document layouts.', gemType: 'sapphire', unlockedAtGems: 0 },
  { name: 'CSS', category: 'Languages', level: 5, description: 'Pixel-perfect UI styling and responsive custom layouts.', gemType: 'ruby', unlockedAtGems: 0 },

  
  { name: 'React.js', category: 'Frameworks & Libraries', level: 5, description: 'Primary component-driven web framework.', gemType: 'emerald', unlockedAtGems: 0 },
  { name: 'Next.js', category: 'Frameworks & Libraries', level: 4, description: 'Server-side rendered React frameworks.', gemType: 'ruby', unlockedAtGems: 3 },
  { name: 'Angular.js', category: 'Frameworks & Libraries', level: 3, description: 'Client-side dynamic template application rendering.', gemType: 'amethyst', unlockedAtGems: 6 },
  { name: 'Vue.js', category: 'Frameworks & Libraries', level: 3, description: 'Modern simple component view layers.', gemType: 'sapphire', unlockedAtGems: 8 },
  { name: 'Node.js / Express', category: 'Frameworks & Libraries', level: 4, description: 'High-concurrency backend API routing systems.', gemType: 'amethyst', unlockedAtGems: 2 },
  { name: 'Tailwind CSS', category: 'Frameworks & Libraries', level: 5, description: 'Rapid utility-first CSS layout compilation.', gemType: 'ruby', unlockedAtGems: 0 },

  
  { name: 'MongoDB', category: 'Databases & Tools', level: 4, description: 'Document-oriented flexible NoSQL database system.', gemType: 'emerald', unlockedAtGems: 4 },
  { name: 'MySQL', category: 'Databases & Tools', level: 4, description: 'Relational query databases and schema modeling.', gemType: 'sapphire', unlockedAtGems: 5 },
  { name: 'AWS Cloud', category: 'Databases & Tools', level: 3, description: 'Cloud infrastructure deployment and computing services.', gemType: 'amethyst', unlockedAtGems: 7 },
  { name: 'RESTful APIs', category: 'Databases & Tools', level: 5, description: 'Secure request-response web protocol integrations.', gemType: 'ruby', unlockedAtGems: 1 },
  { name: 'Git & GitHub', category: 'Databases & Tools', level: 5, description: 'Distributed version control and team repositories.', gemType: 'emerald', unlockedAtGems: 0 },

  
  { name: 'DSA / Algos', category: 'Concepts', level: 5, description: 'Advanced problem-solving & memory optimization.', gemType: 'sapphire', unlockedAtGems: 0 },
  { name: 'OOPs Pattern', category: 'Concepts', level: 5, description: 'Modular, reusable Object-Oriented clean system designs.', gemType: 'amethyst', unlockedAtGems: 1 },
  { name: 'Team Leadership', category: 'Concepts', level: 4, description: 'Coordinating developer pods & agile hackathons.', gemType: 'emerald', unlockedAtGems: 5 },
  { name: 'State Management', category: 'Concepts', level: 4, description: 'Predictable application data flow architecture.', gemType: 'ruby', unlockedAtGems: 3 }
];

export const QUESTS: Quest[] = [
  {
    id: 'divine-inst',
    stage: 1,
    title: 'Divine Educational Institute',
    organization: 'Class XII (CBSE Board)',
    period: '2022 Graduate',
    type: 'education',
    description: [
      'Completed upper secondary schooling focusing heavily on Physics, Chemistry, and Mathematics.',
      'Laid solid mathematical foundations for algorithms and computational engineering.'
    ],
    rewards: ['XP +1200', 'Basic Math Badge']
  },
  {
    id: 'btech-cse',
    stage: 2,
    title: 'Ajay Kumar Garg Engineering College',
    organization: 'B.Tech in Computer Science and Engineering',
    period: '2023 - Present (In Progress)',
    type: 'education',
    description: [
      'Studying advanced computer science principles, database architectures, and algorithm analysis.',
      'Active participant in tech societies and competitive coding assemblies.'
    ],
    rewards: ['XP +3500', 'Tech Initiate Sigil']
  },
  {
    id: 'code-alpha',
    stage: 3,
    title: 'CodeAlpha - Frontend Developer Intern',
    organization: 'Software Engineering Squad',
    period: 'Jul 2025 - Aug 2025',
    type: 'experience',
    description: [
      'Increased UI rendering efficiency by 15% through logical refactoring and runtime exception management.',
      'Designed and engineered an interactive client music player featuring rich real-time audio controls.',
      'Standardized frontend layouts using CSS and JS modules to secure maintainable component bases.'
    ],
    rewards: ['XP +4000', 'Internship Trophy', 'Gold Earphone Icon']
  },
  {
    id: 'sih-2025',
    stage: 4,
    title: 'Smart India Hackathon 2025',
    organization: 'Team Leader & Lead Developer',
    period: 'Sep 2025 - Nov 2025',
    type: 'milestone',
    description: [
      'Earning Runner-Up standing in the SIH 2025 National Grand Finale.',
      'Spearheaded development of adaptive signal timing simulators cutting traffic congestion.'
    ],
    rewards: ['XP +5000', 'Runner-Up Crown', 'Emerald Traffic Badge']
  }
];

export const TROPHIES: Trophy[] = [
  {
    id: 'sih-crown',
    title: 'SIH Hackathon Runner-Up',
    subtitle: 'National Rank Achievement',
    detail: 'Achieved Runner-Up at Smart India Hackathon (SIH) 2025 with traffic-flow project.',
    points: 1500,
    unlocked: true,
    gemType: 'emerald'
  },
  {
    id: 'cc-star',
    title: '3-Star Competitive Coder',
    subtitle: 'CodeChef rating credentials',
    detail: 'Reached a prestigious 3-Star status on the competitive site CodeChef.',
    points: 1000,
    unlocked: true,
    gemType: 'sapphire'
  },
  {
    id: 'lc-dsa',
    title: 'DSA Master: 500+ Solved',
    subtitle: 'LeetCode & CodeChef',
    detail: 'Solved over 500 algorithm problems across major competitive arenas.',
    points: 1200,
    unlocked: true,
    gemType: 'ruby'
  },
  {
    id: 'cc-global',
    title: 'Global Rank 268',
    subtitle: 'CodeChef Contest 226',
    detail: 'Ranked 268th globally among thousands of master coders in standard contest.',
    points: 800,
    unlocked: true,
    gemType: 'amethyst'
  }
];
