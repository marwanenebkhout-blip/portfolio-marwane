import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Project, CursorMode } from '../types';
import { projects } from '../data/projects';
import { localizeProject } from '../data/projectsTranslations';
import { useLanguage } from '../context/LanguageContext';
import { audio } from '../utils/audio';
import { ArrowUpRight, Layers, ChevronLeft, ChevronRight } from 'lucide-react';

interface ControlledVideoProps {
  src: string;
  isActive: boolean;
  isSectionInView: boolean;
  className?: string;
  isIkea?: boolean;
  isPaused?: boolean;
  poster?: string;
  fallbackImage?: string;
}

const ControlledVideo: React.FC<ControlledVideoProps> = ({
  src,
  isActive,
  isSectionInView,
  className,
  isIkea,
  isPaused = false,
  poster,
  fallbackImage,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    if (isIkea) {
      v.volume = 0;
    }

    const updatePlayback = () => {
      if (!videoRef.current) return;
      if (!isActive || !isSectionInView || isPaused || document.hidden) {
        videoRef.current.pause();
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', updatePlayback);
    updatePlayback();

    return () => {
      document.removeEventListener('visibilitychange', updatePlayback);
      // Cleanly release hardware video decoder resources from GPU memory
      if (v) {
        v.pause();
        try {
          v.removeAttribute('src');
          v.load();
        } catch {}
      }
    };
  }, [isActive, isSectionInView, isIkea, isPaused]);

  if (hasError && fallbackImage) {
    return (
      <img
        src={fallbackImage}
        alt="Fallback visual"
        referrerPolicy="no-referrer"
        loading="lazy"
        className={className}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster || fallbackImage}
      loop
      muted
      playsInline
      preload="metadata"
      onError={() => {
        setHasError(true);
      }}
      className={className}
    />
  );
};

interface ProjectsSectionProps {
  onSelectProject: (project: Project) => void;
  setCursorMode: (mode: CursorMode, text?: string) => void;
  isPaused?: boolean;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onSelectProject,
  setCursorMode,
  isPaused = false,
}) => {
  const { lang, t } = useLanguage();
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [isSectionInView, setIsSectionInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Check if already in view on mount
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 80 && rect.bottom > -80) {
      setIsSectionInView(true);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionInView(entry.isIntersecting);
      },
      { rootMargin: '80px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.map((p) => localizeProject(p, lang));
  }, [lang]);

  const selectProjectByIndex = useCallback((idx: number) => {
    if (idx < 0 || idx >= filteredProjects.length) return;
    try {
      audio.playMechanicalClick();
    } catch {
      // non-blocking
    }
    setActiveIdx(idx);
  }, [filteredProjects.length]);

  const handleLiveProjectClick = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      audio.playMechanicalClick();
    } catch {
      // non-blocking
    }
    onSelectProject(project);
  };

  const handlePrev = () => {
    selectProjectByIndex(Math.max(0, activeIdx - 1));
  };

  const handleNext = () => {
    selectProjectByIndex(Math.min(filteredProjects.length - 1, activeIdx + 1));
  };

  // Keyboard navigation support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <section
      ref={sectionRef}
      id="work"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="relative outline-none py-10 sm:py-14 px-4 sm:px-6 max-w-7xl mx-auto"
    >
      {/* Showcase Stage */}
      <div className="relative z-10">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-4 sm:mb-6 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#39FF14] tracking-[0.3em] uppercase mb-1.5">
              <Layers className="h-4 w-4" />
              <span>{t('projects.badge')}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter italic text-white">
              {t('projects.title')}
            </h2>
          </div>

          {/* Controls: Prev/Next & Live Counter */}
          <div className="flex items-center gap-1.5 bg-[#111114] p-1 rounded-full border border-white/10 shadow-lg backdrop-blur-md">
            <button
              onClick={handlePrev}
              disabled={activeIdx === 0}
              className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              title={t('projects.prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-mono text-xs text-white/80 px-2 font-semibold tracking-wider select-none">
              {String(activeIdx + 1).padStart(2, '0')} / {String(filteredProjects.length).padStart(2, '0')}
            </span>
            <button
              onClick={handleNext}
              disabled={activeIdx === filteredProjects.length - 1}
              className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              title={t('projects.next')}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* PHYSICAL STACK CONTAINER */}
        <div className="relative pb-4">
          {filteredProjects.map((project, idx) => {
            const isActive = idx === activeIdx;
            const isBeforeActive = idx < activeIdx;
            const indexFormatted = String(idx + 1).padStart(2, '0');

            // Media selection ensuring non-duplication
            const mainVisual = project.videoUrl || project.heroImage;
            const secondaryTop = project.secondaryImage || project.gallery?.[1]?.url || project.heroImage;
            const secondaryBottom = project.secondaryBottomImage || project.gallery?.[2]?.url || project.gallery?.[0]?.url || secondaryTop;

            const zIndex = isBeforeActive
              ? 10 + idx
              : isActive
              ? 30
              : 40 + idx;

            // Mount media strictly for the active card to prevent excessive memory and decoder consumption
            const shouldMountMedia = isActive;

            return (
              <div
                key={project.id}
                style={{ zIndex }}
                onClick={() => {
                  if (!isActive) selectProjectByIndex(idx);
                }}
                onMouseEnter={() => {
                  setCursorMode(isActive ? 'OPEN' : 'CLICK', isActive ? 'CASE STUDY' : 'EXPAND');
                }}
                onMouseLeave={() => setCursorMode('DEFAULT')}
                className={`relative rounded-[20px] sm:rounded-[26px] md:rounded-[30px] border bg-[#0b0c10] select-none transition-all duration-200 overflow-hidden cursor-pointer transform-gpu ${
                  idx > 0 ? '-mt-4 sm:-mt-5 md:-mt-6' : ''
                } ${
                  isActive
                    ? 'border-white/40 shadow-[0_12px_40px_rgba(0,0,0,0.85)] ring-1 ring-white/20'
                    : 'border-white/20 shadow-[0_6px_25px_rgba(0,0,0,0.7)] hover:border-white/40 hover:bg-[#101116]'
                }`}
              >
                {/* Card Header Bar (Always visible in the stack) */}
                <div className="p-3 sm:p-4 md:px-6 md:py-3.5 flex items-center justify-between gap-2 sm:gap-4 select-none min-w-0">
                  {/* Left: Big Number + Client */}
                  <div className="flex items-center gap-2.5 sm:gap-5 md:gap-6 min-w-0 flex-1">
                    {/* Big Modernist Sans Number */}
                    <span
                      className={`font-sans font-black tracking-tight select-none transition-colors shrink-0 ${
                        isActive
                          ? 'text-white text-lg sm:text-2xl md:text-3xl drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]'
                          : 'text-white/70 text-base sm:text-xl md:text-2xl'
                      }`}
                    >
                      {indexFormatted}
                    </span>

                    {/* Project Title & Client Information */}
                    <div className="flex flex-col min-w-0 flex-1">
                      <span
                        className={`font-display text-sm sm:text-lg md:text-xl font-bold tracking-tight transition-colors truncate ${
                          isActive ? 'text-white' : 'text-white/80'
                        }`}
                      >
                        {project.title}
                      </span>
                      <span className="font-mono text-[9px] sm:text-[10px] font-medium text-white/40 tracking-wider truncate">
                        {project.client}
                      </span>
                    </div>
                  </div>

                  {/* Right: Live Project Pill Button */}
                  <div className="flex items-center shrink-0">
                    <button
                      onClick={(e) => handleLiveProjectClick(project, e)}
                      onMouseEnter={() => setCursorMode('HOVER', 'EXPLORE')}
                      onMouseLeave={() => setCursorMode('DEFAULT')}
                      className={`inline-flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full font-mono text-[10px] sm:text-xs font-semibold tracking-wider uppercase border transition-all cursor-pointer shadow-sm group/btn shrink-0 whitespace-nowrap ${
                        isActive
                          ? 'bg-transparent text-white border-white/60 hover:bg-white hover:text-black hover:border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                          : 'bg-[#141418]/60 text-white/80 border-white/25 hover:border-white hover:bg-white hover:text-black'
                      }`}
                    >
                      <span>LIVE</span>
                      <span className="hidden sm:inline">PROJECT</span>
                      <ArrowUpRight className="h-3 sm:h-3.5 w-3 sm:w-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform shrink-0" />
                    </button>
                  </div>
                </div>

                {/* Card Media Showcase: Instant GPU-accelerated CSS Grid accordion */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                    isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="overflow-hidden">
                    {shouldMountMedia && (
                      <div className="px-3 sm:px-5 md:px-6 pb-3 sm:pb-5 md:pb-6 pt-1">
                        {(() => {
                          const isIkea = project.id === 'ikea-motion-showcase' || project.slug === 'ikea-motion-showcase' || project.title.toLowerCase().includes('ikea');
                          const isLina = project.id === 'lina-18th-invitation' || project.slug === 'lina-18th-invitation';
                          return (
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-3.5 items-stretch h-auto md:h-[320px] lg:h-[370px] xl:h-[400px]">
                              
                              {/* Left Large Visual (7 Cols) */}
                              <div
                                onClick={() => {
                                  audio.playMechanicalClick();
                                  onSelectProject(project);
                                }}
                                onMouseEnter={() => setCursorMode('OPEN', 'CASE STUDY')}
                                onMouseLeave={() => setCursorMode('DEFAULT')}
                                className="md:col-span-7 rounded-[16px] sm:rounded-[20px] md:rounded-[24px] overflow-hidden border border-white/15 bg-black relative aspect-[16/10] md:aspect-auto md:h-full group/media cursor-pointer transform-gpu"
                              >
                                {project.videoUrl ? (
                                  <ControlledVideo
                                    src={project.videoUrl}
                                    poster={project.heroImage}
                                    fallbackImage={project.heroImage}
                                    isActive={isActive}
                                    isSectionInView={isSectionInView}
                                    isIkea={isIkea}
                                    isPaused={isPaused}
                                    className={`w-full h-full object-cover block select-none transition-transform duration-300 origin-center ${
                                      isLina
                                        ? 'scale-[1.45] group-hover/media:scale-[1.48]'
                                        : 'group-hover/media:scale-[1.02]'
                                    }`}
                                  />
                                ) : (
                                  <img
                                    src={mainVisual}
                                    alt={project.title}
                                    referrerPolicy="no-referrer"
                                    loading={idx === 0 ? 'eager' : 'lazy'}
                                    decoding="async"
                                    className="w-full h-full object-cover block select-none group-hover/media:scale-[1.02] transition-transform duration-300"
                                  />
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover/media:bg-black/20 transition-colors duration-300 pointer-events-none" />
                              </div>

                              {/* Right 2 Stacked Visuals (5 Cols) */}
                              <div className="md:col-span-5 grid grid-cols-2 md:flex md:flex-col gap-2.5 sm:gap-3 md:h-full">
                                {/* Top Visual */}
                                <div
                                  onClick={() => {
                                    audio.playMechanicalClick();
                                    onSelectProject(project);
                                  }}
                                  onMouseEnter={() => setCursorMode('OPEN', 'CASE STUDY')}
                                  onMouseLeave={() => setCursorMode('DEFAULT')}
                                  className="relative aspect-[16/10] md:aspect-auto md:flex-1 md:min-h-0 rounded-[16px] sm:rounded-[20px] md:rounded-[24px] overflow-hidden border border-white/15 bg-black group/media cursor-pointer transform-gpu"
                                >
                                  {secondaryTop && (secondaryTop.endsWith('.mp4') || secondaryTop.endsWith('.mov') || secondaryTop.endsWith('.webm')) ? (
                                    <ControlledVideo
                                      src={secondaryTop}
                                      fallbackImage={project.heroImage}
                                      isActive={isActive}
                                      isSectionInView={isSectionInView}
                                      isIkea={isIkea}
                                      isPaused={isPaused}
                                      className="w-full h-full md:absolute md:inset-0 object-cover block select-none group-hover/media:scale-[1.03] transition-transform duration-300"
                                    />
                                  ) : (
                                    <img
                                      src={secondaryTop}
                                      alt={`${project.title} visual 1`}
                                      referrerPolicy="no-referrer"
                                      loading={idx === 0 ? 'eager' : 'lazy'}
                                      decoding="async"
                                      className="w-full h-full md:absolute md:inset-0 object-cover block select-none group-hover/media:scale-[1.03] transition-transform duration-300"
                                    />
                                  )}
                                  <div className="absolute inset-0 bg-black/0 group-hover/media:bg-black/20 transition-colors duration-300 pointer-events-none" />
                                </div>

                                {/* Bottom Visual */}
                                <div
                                  onClick={() => {
                                    audio.playMechanicalClick();
                                    onSelectProject(project);
                                  }}
                                  onMouseEnter={() => setCursorMode('OPEN', 'CASE STUDY')}
                                  onMouseLeave={() => setCursorMode('DEFAULT')}
                                  className="relative aspect-[16/10] md:aspect-auto md:flex-1 md:min-h-0 rounded-[16px] sm:rounded-[20px] md:rounded-[24px] overflow-hidden border border-white/15 bg-black group/media cursor-pointer transform-gpu"
                                >
                                  {secondaryBottom && (secondaryBottom.endsWith('.mp4') || secondaryBottom.endsWith('.mov') || secondaryBottom.endsWith('.webm')) ? (
                                    <ControlledVideo
                                      src={secondaryBottom}
                                      fallbackImage={project.heroImage}
                                      isActive={isActive}
                                      isSectionInView={isSectionInView}
                                      isIkea={isIkea}
                                      isPaused={isPaused}
                                      className="w-full h-full md:absolute md:inset-0 object-cover block select-none group-hover/media:scale-[1.03] transition-transform duration-300"
                                    />
                                  ) : (
                                    <img
                                      src={secondaryBottom}
                                      alt={`${project.title} visual 2`}
                                      referrerPolicy="no-referrer"
                                      loading={idx === 0 ? 'eager' : 'lazy'}
                                      decoding="async"
                                      className="w-full h-full md:absolute md:inset-0 object-cover block select-none group-hover/media:scale-[1.03] transition-transform duration-300"
                                    />
                                  )}
                                  <div className="absolute inset-0 bg-black/0 group-hover/media:bg-black/20 transition-colors duration-300 pointer-events-none" />
                                </div>
                              </div>

                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
