import { SocialLinks, ExperienceItem, SkillGroup, EducationItem } from '../types';

export const personalInfo = {
  name: 'MARWANE NEBKHOUT',
  role: 'GRAPHIC DESIGNER & ART DIRECTOR',
  specialties: ['ART DIRECTION', '3D & MOTION', 'BRAND IDENTITY', 'DIGITAL EXPERIENCES'],
  location: 'Paris',
  status: 'AVAILABLE FOR FREELANCE',
  statusLed: true,
  shortBio: 'Directeur Artistique & Graphic Designer spécialisé dans la conception d’identités visuelles percutantes, d’expériences numériques immersives et d’univers 3D / motion design à forte personnalité.',
  manifesto: `Passionné par la direction artistique, je vois chaque projet comme une occasion de créer, d’imaginer et de raconter quelque chose.
J’aime partir d’une idée, parfois très simple, et lui donner une identité, une personnalité et une émotion car la création et la conception occupent une place essentielle.

J’aime observer ce qui m’entoure, comprendre les tendances, mais aussi chercher à m’en détacher pour proposer ma propre vision.
Mon approche mêle réflexion, intuition et sens du détail en accordant autant d’importance à l’esthétique d’un projet qu’au message et à l’émotion qu’il transmet.`,
  email: 'marwanenebkhout@gmail.com',
  phone: '07 69 82 54 24',
  yearsOfExperience: '+7',
  completedProjects: '360°',
  awards: 'IA'
};

export const socialLinks: SocialLinks = {
  instagram: 'https://www.instagram.com/neben_99?igsi=MWlsYmsyb2syZ205aw%3D%3D&utm_source=qr',
  linkedin: 'https://www.linkedin.com/in/marwane-nebkhout-✍🏽💻-a28a48157?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
  behance: 'https://www.behance.net/marwanenebkhout2',
  dribbble: 'https://dribbble.com/marwanenebkhout',
  twitter: 'https://x.com',
  email: 'mailto:marwanenebkhout@gmail.com',
  phone: 'tel:+33769825424',
  cvUrl: '#cv'
};

export const softwareStack = [
  { name: 'Photoshop', category: 'Digital Art & Post', level: 98, icon: 'Image' },
  { name: 'Illustrator', category: 'Vector & Branding', level: 96, icon: 'PenTool' },
  { name: 'InDesign', category: 'Editorial & Layout', level: 94, icon: 'BookOpen' },
  { name: 'After Effects / Premiere Pro', category: 'Motion & Montage', level: 98, icon: 'Film' },
  { name: 'Final Cut', category: 'Video Editing', level: 92, icon: 'Video' },
  { name: 'Figma / UI Design', category: 'UI/UX & Product', level: 96, icon: 'Layout' },
  { name: 'Blender', category: '3D & Shading', level: 94, icon: 'Layers' },
  { name: 'Cinema 4D', category: 'Motion 3D & Rendu', level: 95, icon: 'Box' },
  { name: 'Unreal Engine', category: 'Temps Réel & Spatial', level: 90, icon: 'Cpu' },
  { name: 'Midjourney / ComfyUI', category: 'IA Générative Visuelle', level: 98, icon: 'Sparkles' },
  { name: 'Sora / Kling / Runway ML', category: 'IA Génération Vidéo', level: 95, icon: 'Camera' },
  { name: 'Prompt Engineering', category: 'Architecture & Systèmes IA', level: 96, icon: 'Terminal' },
];

export const skillGroups: SkillGroup[] = [
  {
    category: 'Direction Artistique & Branding',
    iconName: 'Sparkles',
    skills: [
      { name: 'Stratégie de Marque & Identité', level: 95 },
      { name: 'Systèmes Visuels & Guidelines', level: 92 },
      { name: 'Typographie Sur-Mesure & Layout', level: 96 },
      { name: 'Direction Éditoriale & Packaging', level: 88 },
    ],
  },
  {
    category: '3D & Motion Graphics',
    iconName: 'Layers',
    skills: [
      { name: 'Modélisation & Shading Avancé', level: 94 },
      { name: 'Animation Procedurale & Rendu', level: 90 },
      { name: 'Kinetic Typography & Titles', level: 95 },
      { name: 'Simulations Physiques & Particules', level: 86 },
    ],
  },
  {
    category: 'Digital & Expériences Interactives',
    iconName: 'Monitor',
    skills: [
      { name: 'Creative Web Design & UX', level: 92 },
      { name: 'Interactions 3D WebGL / R3F', level: 88 },
      { name: 'Design Systems & Micro-Interactions', level: 94 },
      { name: 'Prototypage Rapide & Spatial UI', level: 90 },
    ],
  },
];

export const experiences: ExperienceItem[] = [
  {
    period: '2025 — Présent',
    role: 'Direction créative & communication',
    company: 'IKEA France (CDI)',
    location: 'Paris, France',
    description: 'Pilotage créatif de campagnes 360° (emailing, display, landing pages) pour +12M clients (de l’idéation à la mise en ligne).',
    highlights: [
      'Conception de systèmes visuels complets pour opérations spéciales et activations marques partenaires',
      'DA motion design (Reels, Stories) : +40% d’engagement organique',
      'Optimisation des cycles de production de 30%'
    ]
  },
  {
    period: '2023 — 2025',
    role: 'DA brand & contenus digitaux',
    company: 'Veepee (CDD)',
    location: 'Paris, France',
    description: '+200 concepts visuels événementiels pour flash sales et opérations saisonnières B2C. Garant de la charte graphique globale, pilotage créatif motion, films de marque 3D et interfaces immersives.',
    highlights: [
      'DA animations sociales (+25% de CTR vs benchmarks)',
      'Intégration de workflows IA générative (Midjourney + ComfyUI + Runway)',
      'Films de marque 3D et expériences immersives'
    ]
  },
  {
    period: '2022 — 2023',
    role: 'Graphiste 360°',
    company: 'La Stratégie Créative (Alternance)',
    location: 'France',
    description: 'Directions artistiques complètes (print + digital) pour un portefeuille de 100+ clients multi-secteurs.',
    highlights: [
      'Pilotage des livrables de la production à la mise en ligne avec les équipes et développeurs',
      'Création d’identités de marque, supports d’édition et assets digitaux'
    ]
  },
  {
    period: '2021 — 2022',
    role: 'Graphic & Digital Designer',
    company: 'Odalis (Alternance)',
    location: 'France',
    description: 'Design éditorial, packaging novateur, typographie expérimentale et conception d’interfaces digitales interactives.',
    highlights: [
      'Packaging novateur et univers typographiques sur-mesure',
      'Conception d’interfaces digitales et expériences de marque'
    ]
  },
  {
    period: '2018 — 2026',
    role: 'Motion & graphic designer — IA',
    company: 'Indépendant & Freelance international',
    location: 'International (FR, BE, MA, CI)',
    description: 'DA et production complète : identités de marque, clips, spots publicitaires (France, Belgique, Maroc, Côte d’Ivoire).',
    highlights: [
      'Workflows prompt engineering sur-mesure (Midjourney, Stable Diffusion, Sora) pour OOH et brand films',
      'Production de spots publicitaires, clips et identités visuelles internationales'
    ]
  }
];

export const education: EducationItem[] = [
  {
    degree: 'Master Direction Artistique',
    year: '2025'
  },
  {
    degree: 'Licence Web Design',
    year: '2023'
  },
  {
    degree: 'BTS Design Graphique',
    year: '2021'
  },
  {
    degree: 'BAC Arts Appliqués',
    year: '2018'
  },
  {
    degree: 'Formation Motion Design',
    year: '2018'
  }
];

export const clientLogos = [
  'HYPERION LABS', 'SYNTHESIS AUDIO', 'CHRONO DYNAMICS', 'VALENCE STUDIOS', 
  'AURA TECH', 'NEO GENESIS', 'LUMEN PARIS', 'SPECTRA CULTURE'
];

export const languages = [
  'Français',
  'Anglais',
  'Espagnol',
  'Arabe dialecte'
];
