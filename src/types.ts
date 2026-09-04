export type ProjectCategory = 
  | 'ALL'
  | 'ART DIRECTION'
  | 'GRAPHIC DESIGN'
  | 'BRANDING'
  | '3D'
  | 'MOTION DESIGN'
  | 'DIGITAL';

export interface ProjectMedia {
  type: 'image' | 'video' | '3d-canvas';
  url: string;
  caption?: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '9/16';
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  client: string;
  year: string;
  category: ProjectCategory;
  tags: string[];
  summary: string;
  description: string;
  heroImage: string;
  secondaryImage: string;
  secondaryBottomImage?: string;
  accentColor: string;
  gradient: string;
  role: string[];
  tools: string[];
  metrics?: { label: string; value: string }[];
  deliverables: string[];
  videoUrl?: string;
  videoCaption?: string;
  gallery: {
    type: 'image' | 'video';
    url: string;
    caption: string;
  }[];
  interactive3DType?: 'cube' | 'torus' | 'cylinder' | 'sphere' | 'crystal';
  featured?: boolean;
  en?: {
    subtitle?: string;
    summary?: string;
    description?: string;
    tags?: string[];
    role?: string[];
    metrics?: { label: string; value: string }[];
    deliverables?: string[];
    videoCaption?: string;
    galleryCaptions?: string[];
  };
}

export interface SocialLinks {
  instagram: string;
  linkedin: string;
  behance: string;
  dribbble: string;
  twitter: string;
  email: string;
  phone: string;
  cvUrl: string;
  github?: string;
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  highlights: string[];
}

export interface EducationItem {
  degree: string;
  specialization?: string;
  school?: string;
  year: string;
}

export interface SkillGroup {
  category: string;
  iconName: string;
  skills: { name: string; level: number }[];
}

export type CursorMode = 'DEFAULT' | 'VIEW' | 'OPEN' | 'DRAG' | 'CLICK' | 'HOVER';
