import React, { useState, useEffect, useCallback } from 'react';
import { Project, CursorMode } from './types';
import { personalInfo } from './data/config';
import { projects } from './data/projects';
import { audio } from './utils/audio';
import { useLanguage } from './context/LanguageContext';
import { HeaderNav } from './components/HeaderNav';
import { HeroCore3D } from './components/3d/HeroCore3D';
import { MechanicalFooterKeyboard } from './components/3d/MechanicalFooterKeyboard';
import { ProjectsSection } from './components/ProjectsSection';
import { ProjectModal } from './components/ProjectModal';
import { FloatingIconsField } from './components/3d/FloatingIconsField';
import { AboutSection } from './components/AboutSection';
import { CVModal } from './components/CVModal';
import { LoadingScreen } from './components/LoadingScreen';
import { PortfolioVideoSection } from './components/PortfolioVideoSection';
import titleImage from './assets/images/TITRE V2.png';
import { ArrowDown, Sparkles, Terminal, Cpu, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const { lang, t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [cursorMode, setCursorModeState] = useState<CursorMode>('DEFAULT');
  const [cursorText, setCursorText] = useState<string | undefined>(undefined);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);

  const setCursorMode = useCallback((mode: CursorMode, text?: string) => {
    setCursorModeState(mode);
    setCursorText(text);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      const headerOffset = 70;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Section observer for active nav indicator
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'portfolio-reel', 'work', 'about', 'contact', 'console-keyboard'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-black text-[#e2e8f0] relative selection:bg-[#00ff66] selection:text-black overflow-x-hidden w-full max-w-full">
      {/* Cybernetic Scanlines and Noise FX */}
      <div className="fixed inset-0 scanlines opacity-40 pointer-events-none z-30 overflow-hidden" />
      <div className="fixed inset-0 bg-noise opacity-15 pointer-events-none z-10 overflow-hidden" />

      {/* Top Header Navigation */}
      <HeaderNav
        onNavigate={scrollToSection}
        activeSection={activeSection}
        onOpenContact={() => scrollToSection('contact')}
      />

      {/* Main Content Area */}
      <main className="relative z-20 overflow-x-hidden w-full max-w-full">
        {/* HERO SECTION MATCHING MOCKUP */}
        <section
          id="hero"
          className="relative min-h-[92vh] flex flex-col justify-between pt-24 pb-8 px-4 sm:px-8 lg:px-12 max-w-[1400px] mx-auto overflow-hidden"
        >
          {/* Left Vertical Scroll Indicator */}
          <div className="hidden xl:flex absolute left-4 top-1/2 -translate-y-1/2 flex-col items-center gap-3 z-20 text-white/40">
            <span
              className="text-[10px] uppercase font-mono tracking-[0.3em]"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              {t('hero.scroll')}
            </span>
            <div className="h-4 w-4 rounded-full border border-[#39FF14]/50 flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-[#39FF14] animate-pulse" />
            </div>
          </div>

          {/* Main Hero Split: Left Typography + Right 3D Glowing TV Monitor */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center pt-2">
            
            {/* Left Content Column (7 cols on lg, 6 cols on xl) */}
            <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center z-10">
              
              {/* Available for Freelance Tag */}
              <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
                <span className="h-2 w-2 rounded-full bg-[#39FF14] shadow-[0_0_8px_#39FF14] animate-pulse" />
                <span className="font-mono text-xs sm:text-[13px] font-semibold text-white/90 uppercase tracking-[0.2em]">
                  {t('hero.status')}
                </span>
              </div>

              {/* Massive Architectural Headline Image */}
              <div className="select-none w-full max-w-[420px] sm:max-w-[500px] md:max-w-[560px] lg:max-w-[600px] xl:max-w-[640px] my-1 sm:-ml-1 ml-0">
                <img 
                  src={titleImage} 
                  alt="Marwane NEBKHOUT®" 
                  className="w-full h-auto select-none pointer-events-none drop-shadow-[0_0_24px_rgba(0,255,78,0.22)]" 
                />
              </div>

              {/* Stacked Roles */}
              <div className="mt-4 sm:mt-5 space-y-1 font-mono text-xs sm:text-sm md:text-base font-semibold text-white/70 tracking-widest uppercase">
                <div>{t('hero.role1')}</div>
                <div>{t('hero.role2')}</div>
                <div>{t('hero.role3')}</div>
              </div>

              {/* Bio Box with Green Corner Brackets + Explore Link */}
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                {/* HUD Bracketed Bio Card */}
                <div className="relative p-3.5 sm:p-4 max-w-md border border-white/10 bg-[#0c0c0e]/80 backdrop-blur-sm rounded">
                  {/* Top-left & Bottom-right Accent Corner Notches */}
                  <div className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2 border-[#39FF14]" />
                  <div className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2 border-[#39FF14]" />
                  
                  <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-sans">
                    {t('hero.bio')}
                  </p>
                </div>

                {/* Explore My Work CTA */}
                <button
                  onClick={() => {
                    audio.playMechanicalClick();
                    scrollToSection('work');
                  }}
                  className="group inline-flex items-center gap-2 font-mono text-xs font-bold text-white/90 hover:text-[#39FF14] transition-colors uppercase tracking-wider cursor-pointer whitespace-nowrap"
                >
                  <span className="border-b border-white/30 group-hover:border-[#39FF14] pb-0.5">
                    {t('hero.explore')}
                  </span>
                  <span className="text-[#39FF14] group-hover:translate-x-1 transition-transform">
                    &gt;
                  </span>
                </button>
              </div>
            </div>

            {/* Right Column: 3D Character Avatar Video (5 cols on lg, 6 cols on xl) */}
            <div className="lg:col-span-5 xl:col-span-6 flex justify-center lg:justify-end items-center relative z-0 w-full">
              <HeroCore3D
                onSelectSection={scrollToSection}
                setCursorMode={setCursorMode}
              />
            </div>
          </div>
        </section>

        {/* RETRO CRT SHOWCASE VIDEO // SCROLL-TRIGGERED REEL */}
        <PortfolioVideoSection setCursorMode={setCursorMode} />

        {/* PROJECTS / WORK SECTION */}
        <ProjectsSection
          onSelectProject={(project) => setSelectedProject(project)}
          setCursorMode={setCursorMode}
        />

        {/* 3D FLOATING ICONS CLUSTER // SPATIAL LEVITATION & SPRING REPULSION */}
        <FloatingIconsField setCursorMode={setCursorMode} />

        {/* ABOUT & DOSSIER SECTION */}
        <AboutSection onOpenCVModal={() => setIsCVModalOpen(true)} />
      </main>

      {/* Global Site Footer with 3D Mechanical Keyboard Console */}
      <footer id="contact" className="relative z-20 bg-black border-t border-white/10 pt-16 pb-12 px-4 sm:px-6 overflow-hidden w-full max-w-full">
        <div className="max-w-[1400px] mx-auto space-y-12">
          {/* Header Title for Footer Hardware Console */}
          <div className="text-center">
            <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter italic text-white">
              {t('footer.title')}
            </h3>
          </div>

          {/* 3D Hardware Mechanical Console */}
          <MechanicalFooterKeyboard
            onNavigateHome={() => scrollToSection('hero')}
            onOpenCV={() => setIsCVModalOpen(true)}
            onOpenContact={() => scrollToSection('contact')}
            setCursorMode={setCursorMode}
          />

          {/* Bottom Metas & Copyright Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-center sm:justify-between gap-4 font-mono text-xs text-white/40">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="font-bold text-white tracking-wider">MARWANE NEBKHOUT</span>
              <span>© {new Date().getFullYear()}</span>
              <span className="hidden sm:inline text-white/20">•</span>
              <span className="text-[#39FF14]/80">{t('footer.subtitle')}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Project Case Study Fullscreen Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectProject={(p) => setSelectedProject(p)}
        setCursorMode={setCursorMode}
      />

      {/* CV / Resume Viewer Modal */}
      <CVModal
        isOpen={isCVModalOpen}
        onClose={() => setIsCVModalOpen(false)}
      />
    </div>
  );
}
