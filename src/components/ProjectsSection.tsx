import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, CursorMode } from '../types';
import { projects } from '../data/projects';
import { audio } from '../utils/audio';
import { ArrowUpRight, Layers, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface ProjectsSectionProps {
  onSelectProject: (project: Project) => void;
  setCursorMode: (mode: CursorMode, text?: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onSelectProject,
  setCursorMode,
}) => {
  // Default to 2 (project 03) so user immediately sees the stacked layout
  const [activeIdx, setActiveIdx] = useState<number>(projects.length >= 3 ? 2 : 0);
  const trackRef = useRef<HTMLDivElement>(null);
  const isManualSelectionRef = useRef<boolean>(false);
  const manualTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const filteredProjects = projects;

  const selectProjectByIndex = useCallback((idx: number) => {
    if (idx < 0 || idx >= filteredProjects.length) return;
    audio.playMechanicalClick();
    setActiveIdx(idx);

    // Block scroll-sync momentarily so manual clicks are sticky and comfortable
    isManualSelectionRef.current = true;
    if (manualTimeoutRef.current) clearTimeout(manualTimeoutRef.current);
    manualTimeoutRef.current = setTimeout(() => {
      isManualSelectionRef.current = false;
    }, 1000);
  }, [filteredProjects.length]);

  // Scroll sync: smoothly advance through cards as user scrolls through the track
  useEffect(() => {
    const handleScroll = () => {
      if (isManualSelectionRef.current || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;

      if (totalScrollable > 150) {
        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
        const newIndex = Math.min(
          filteredProjects.length - 1,
          Math.floor(progress * filteredProjects.length)
        );
        if (newIndex !== activeIdx && newIndex >= 0) {
          setActiveIdx(newIndex);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeIdx, filteredProjects.length]);

  const handleLiveProjectClick = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    audio.playMechanicalClick();
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
      id="work"
      ref={trackRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="relative outline-none min-h-[140vh] sm:min-h-[180vh] lg:min-h-[220vh] py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto"
    >
      {/* Sticky Showcase Stage: remains locked in viewport while user scrolls through the stack */}
      <div className="sticky top-16 sm:top-20 z-10">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#39FF14] tracking-[0.3em] uppercase mb-1.5">
              <Layers className="h-4 w-4" />
              <span>01 // SÉLECTION DE PROJETS & ÉTUDES DE CAS</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter italic text-white">
              Selected Works
            </h2>
          </div>

          {/* Controls: Prev/Next */}
          <div className="flex items-center gap-1 bg-[#111114] p-1 rounded-full border border-white/10">
            <button
              onClick={handlePrev}
              disabled={activeIdx === 0}
              className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              title="Projet précédent"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={activeIdx === filteredProjects.length - 1}
              className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              title="Projet suivant"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* PHYSICAL STACK CONTAINER (Matching Reference Screenshot Exactly) */}
        <div className="relative pb-6">
          {filteredProjects.map((project, idx) => {
            const isActive = idx === activeIdx;
            const isBeforeActive = idx < activeIdx;
            const isAfterActive = idx > activeIdx;
            const indexFormatted = String(idx + 1).padStart(2, '0');

            // Media selection ensuring non-duplication
            const mainVisual = project.videoUrl || project.heroImage;
            const secondaryTop = project.secondaryImage || project.gallery?.[1]?.url || project.heroImage;
            const secondaryBottom = project.secondaryBottomImage || project.gallery?.[2]?.url || project.gallery?.[0]?.url || secondaryTop;

            // Compute precise layering z-index:
            // Top stack: 10 + idx (cards before active stack over each other downwards)
            // Active card: 30 (sits right in front of top stack)
            // Bottom stack: 40 + idx (cards after active stack below active card)
            const zIndex = isBeforeActive
              ? 10 + idx
              : isActive
              ? 30
              : 40 + idx;

            return (
              <motion.div
                key={project.id}
                layout
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 32,
                  mass: 0.85,
                }}
                style={{ zIndex }}
                onClick={() => {
                  if (!isActive) selectProjectByIndex(idx);
                }}
                onMouseEnter={() => {
                  setCursorMode(isActive ? 'OPEN' : 'CLICK', isActive ? 'CASE STUDY' : 'EXPAND');
                }}
                onMouseLeave={() => setCursorMode('DEFAULT')}
                className={`relative rounded-[24px] sm:rounded-[30px] md:rounded-[34px] border bg-[#0b0c10] select-none transition-colors duration-300 overflow-hidden cursor-pointer ${
                  idx > 0 ? '-mt-4 sm:-mt-5 md:-mt-6' : ''
                } ${
                  isActive
                    ? 'border-white/40 shadow-[0_-12px_40px_rgba(0,0,0,0.95),0_25px_60px_rgba(0,0,0,0.95)] ring-1 ring-white/20'
                    : 'border-white/20 shadow-[0_-8px_30px_rgba(0,0,0,0.85),0_12px_35px_rgba(0,0,0,0.85)] hover:border-white/40 hover:bg-[#101116]'
                }`}
              >
                {/* Card Header Bar (Always visible in the stack) */}
                <div className="p-4 sm:p-5 md:px-7 md:py-4 flex items-center justify-between gap-4 select-none">
                  {/* Left: Big Number + Client */}
                  <div className="flex items-center gap-4 sm:gap-6 md:gap-7">
                    {/* Big Modernist Sans Number */}
                    <span
                      className={`font-sans font-black tracking-tight select-none transition-colors ${
                        isActive
                          ? 'text-white text-2xl sm:text-3xl md:text-4xl drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]'
                          : 'text-white/80 text-xl sm:text-2xl md:text-3xl'
                      }`}
                    >
                      {indexFormatted}
                    </span>

                    {/* Project Title & Client Information */}
                    <div className="flex flex-col">
                      <span
                        className={`font-display text-base sm:text-xl md:text-2xl font-bold tracking-tight transition-colors truncate max-w-[200px] sm:max-w-[320px] md:max-w-md ${
                          isActive ? 'text-white' : 'text-white/80'
                        }`}
                      >
                        {project.title}
                      </span>
                      <span className="font-mono text-[9px] sm:text-[10px] font-medium text-white/40 tracking-wider truncate max-w-[180px] sm:max-w-[280px] md:max-w-md">
                        {project.client}
                      </span>
                    </div>
                  </div>

                  {/* Right: Live Project Pill Button */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => handleLiveProjectClick(project, e)}
                      onMouseEnter={() => setCursorMode('HOVER', 'EXPLORE')}
                      onMouseLeave={() => setCursorMode('DEFAULT')}
                      className={`inline-flex items-center gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full font-mono text-[10px] sm:text-xs font-semibold tracking-wider uppercase border transition-all cursor-pointer shadow-sm group/btn ${
                        isActive
                          ? 'bg-transparent text-white border-white/60 hover:bg-white hover:text-black hover:border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                          : 'bg-[#141418]/60 text-white/80 border-white/25 hover:border-white hover:bg-white hover:text-black'
                      }`}
                    >
                      <span>LIVE PROJECT</span>
                      <ArrowUpRight className="h-3 sm:h-3.5 w-3 sm:w-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Card Media Showcase: revealed ONLY on the active card */}
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-6 md:px-7 pb-4 sm:pb-6 md:pb-7 pt-1">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-stretch h-auto md:h-[380px] lg:h-[430px]">
                          
                          {/* Left Large Visual (7 Cols) */}
                          <div
                            onClick={() => {
                              audio.playMechanicalClick();
                              onSelectProject(project);
                            }}
                            onMouseEnter={() => setCursorMode('OPEN', 'CASE STUDY')}
                            onMouseLeave={() => setCursorMode('DEFAULT')}
                            className="md:col-span-7 rounded-[18px] sm:rounded-[22px] md:rounded-[26px] overflow-hidden border border-white/15 bg-black relative aspect-[16/10] md:aspect-auto md:h-full group/media cursor-pointer"
                          >
                            {project.videoUrl ? (
                              <video
                                src={project.videoUrl}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover block select-none group-hover/media:scale-[1.02] transition-transform duration-500"
                              />
                            ) : (
                              <img
                                src={mainVisual}
                                alt={project.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover block select-none group-hover/media:scale-[1.02] transition-transform duration-500"
                              />
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover/media:bg-black/20 transition-colors duration-300 pointer-events-none" />
                          </div>

                          {/* Right 2 Stacked Visuals (5 Cols) */}
                          <div className="md:col-span-5 grid grid-cols-2 md:flex md:flex-col gap-3 sm:gap-4 md:h-full">
                            {/* Top Visual */}
                            <div
                              onClick={() => {
                                audio.playMechanicalClick();
                                onSelectProject(project);
                              }}
                              onMouseEnter={() => setCursorMode('OPEN', 'CASE STUDY')}
                              onMouseLeave={() => setCursorMode('DEFAULT')}
                              className="relative aspect-[16/10] md:aspect-auto md:flex-1 md:min-h-0 rounded-[18px] sm:rounded-[22px] md:rounded-[26px] overflow-hidden border border-white/15 bg-black group/media cursor-pointer"
                            >
                              {secondaryTop && (secondaryTop.endsWith('.mp4') || secondaryTop.endsWith('.mov') || secondaryTop.endsWith('.webm')) ? (
                                <video
                                  src={secondaryTop}
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                  className="w-full h-full md:absolute md:inset-0 object-cover block select-none group-hover/media:scale-[1.03] transition-transform duration-500"
                                />
                              ) : (
                                <img
                                  src={secondaryTop}
                                  alt={`${project.title} visual 1`}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full md:absolute md:inset-0 object-cover block select-none group-hover/media:scale-[1.03] transition-transform duration-500"
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
                              className="relative aspect-[16/10] md:aspect-auto md:flex-1 md:min-h-0 rounded-[18px] sm:rounded-[22px] md:rounded-[26px] overflow-hidden border border-white/15 bg-black group/media cursor-pointer"
                            >
                              {secondaryBottom && (secondaryBottom.endsWith('.mp4') || secondaryBottom.endsWith('.mov') || secondaryBottom.endsWith('.webm')) ? (
                                <video
                                  src={secondaryBottom}
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                  className="w-full h-full md:absolute md:inset-0 object-cover block select-none group-hover/media:scale-[1.03] transition-transform duration-500"
                                />
                              ) : (
                                <img
                                  src={secondaryBottom}
                                  alt={`${project.title} visual 2`}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full md:absolute md:inset-0 object-cover block select-none group-hover/media:scale-[1.03] transition-transform duration-500"
                                />
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover/media:bg-black/20 transition-colors duration-300 pointer-events-none" />
                            </div>
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
