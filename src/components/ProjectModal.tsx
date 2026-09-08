import React, { useEffect, useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Project, CursorMode } from '../types';
import { projects } from '../data/projects';
import { audio } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';
import { localizeProject } from '../data/projectsTranslations';
import { X, ArrowLeft, ArrowRight, CheckCircle2, Award, Calendar, UserCheck, Wrench, Sparkles, Box, Maximize2, ZoomIn, Play, Pause, Volume2, VolumeX } from 'lucide-react';

const getMetricFontSize = (value: string) => {
  const len = value.trim().length;
  if (len > 22) {
    return 'text-sm sm:text-base md:text-lg lg:text-xl leading-snug';
  }
  if (len > 15) {
    return 'text-base sm:text-lg md:text-xl lg:text-2xl leading-snug';
  }
  if (len > 9) {
    return 'text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight';
  }
  return 'text-2xl sm:text-3xl lg:text-4xl leading-none';
};

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onSelectProject: (p: Project) => void;
  setCursorMode: (mode: CursorMode, text?: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project: rawProject,
  onClose,
  onSelectProject,
  setCursorMode,
}) => {
  const { lang, t } = useLanguage();
  const project = useMemo(() => {
    return rawProject ? localizeProject(rawProject, lang) : null;
  }, [rawProject, lang]);

  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isHeroVideoEnlarged, setIsHeroVideoEnlarged] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const enlargedVideoRef = useRef<HTMLVideoElement>(null);

  const isIkea = project?.id === 'ikea-motion-showcase' || project?.slug === 'ikea-motion-showcase' || (project?.title ? project.title.toLowerCase().includes('ikea') : false);

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleVideoMute = () => {
    if (!videoRef.current || isIkea) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleFullscreenVideo = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
    }
    try {
      audio.playMechanicalClick();
    } catch {}

    // Immediately pause and mute background video so only one video plays at a time
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.muted = true;
    }

    setIsHeroVideoEnlarged(true);
  };

  const handleCloseHeroVideoEnlarged = () => {
    if (enlargedVideoRef.current) {
      try {
        const time = enlargedVideoRef.current.currentTime;
        enlargedVideoRef.current.pause();
        if (videoRef.current) {
          videoRef.current.currentTime = time;
        }
      } catch {}
    }
    setIsHeroVideoEnlarged(false);
    if (videoRef.current) {
      videoRef.current.muted = isIkea ? true : isMuted;
      if (isPlaying && activeImageIndex === null) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const handleOpenGalleryItem = (idx: number) => {
    try {
      audio.playMechanicalClick();
    } catch {}
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.muted = true;
    }
    setActiveImageIndex(idx);
  };

  const handleCloseGallery = () => {
    setActiveImageIndex(null);
    if (videoRef.current) {
      videoRef.current.muted = isIkea ? true : isMuted;
      if (isPlaying && !isHeroVideoEnlarged) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  useEffect(() => {
    // Whenever project changes, reset all modal overlays & playback
    setIsHeroVideoEnlarged(false);
    setActiveImageIndex(null);
    setIsPlaying(true);
    setIsMuted(true);
  }, [project.id]);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      if (enlargedVideoRef.current) {
        enlargedVideoRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    // Lock background scroll when modal or lightbox is active
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!project) return;
      if (isHeroVideoEnlarged) {
        if (e.key === 'Escape') {
          handleCloseHeroVideoEnlarged();
        }
        return;
      }
      if (activeImageIndex !== null) {
        if (e.key === 'Escape') {
          handleCloseGallery();
        } else if (e.key === 'ArrowRight' && project.gallery) {
          setActiveImageIndex((activeImageIndex + 1) % project.gallery.length);
        } else if (e.key === 'ArrowLeft' && project.gallery) {
          setActiveImageIndex((activeImageIndex - 1 + project.gallery.length) % project.gallery.length);
        }
        return;
      }

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, activeImageIndex, isHeroVideoEnlarged]);

  if (!project) return null;

  const currentIndex = projects.findIndex((p) => p.id === project.id);
  const prevProject = projects[(currentIndex - 1 + projects.length) % projects.length];
  const nextProject = projects[(currentIndex + 1) % projects.length];

  const handleNext = () => {
    audio.playMechanicalClick();
    onSelectProject(nextProject);
  };

  const handlePrev = () => {
    audio.playMechanicalClick();
    onSelectProject(prevProject);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl my-0 sm:my-8 bg-[#111113] border-0 sm:border border-white/15 rounded-none sm:rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col min-h-screen sm:min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Hardware Navigation Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-[#161619] border-b border-white/10 sticky top-0 z-20">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: project.accentColor }} />
            <span className="font-mono text-[11px] sm:text-xs font-bold text-white/80 uppercase tracking-wider sm:tracking-widest truncate">
              {t('modal.projectFile')} // #{String(currentIndex + 1).padStart(2, '0')}
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded bg-black/60 font-mono text-[10px] text-[#39FF14] border border-white/10">
              {project.category}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Prev Project */}
            <button
              onClick={handlePrev}
              className="p-2 rounded bg-black/50 border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              title={t('modal.prev')}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            {/* Next Project */}
            <button
              onClick={handleNext}
              className="p-2 rounded bg-black/50 border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              title={t('modal.next')}
            >
              <ArrowRight className="h-4 w-4" />
            </button>
            {/* Close */}
            <button
              onClick={() => {
                audio.playKeyHover();
                onClose();
              }}
              className="p-2 rounded bg-[#39FF14] text-black font-bold hover:shadow-[0_0_15px_#39FF14] transition-all ml-1 sm:ml-2 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              title={t('modal.close')}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-8 lg:p-10 space-y-10 sm:space-y-12 sm:max-h-[82vh] overflow-y-auto flex-1">
          {/* Hero Header Section */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded font-mono text-xs text-white/90 bg-white/5 border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter italic text-white">
              {project.title}
            </h1>
            <p className="mt-2 text-lg sm:text-xl font-mono text-[#39FF14]">
              {project.subtitle}
            </p>

            {/* Looped Video Demonstration */}
            {project.videoUrl && (
              <div className="mt-6 rounded-2xl overflow-hidden border border-white/15 bg-black/90 shadow-[0_0_40px_rgba(37,99,235,0.2)] relative group">
                <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center">
                  <video
                    ref={videoRef}
                    src={project.videoUrl}
                    autoPlay={!isHeroVideoEnlarged && activeImageIndex === null}
                    loop
                    muted={isIkea || isHeroVideoEnlarged || activeImageIndex !== null ? true : isMuted}
                    playsInline
                    className="w-full h-full object-cover"
                  />

                  {/* Top-left direct maximize badge */}
                  <button
                    onClick={handleFullscreenVideo}
                    className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 hover:bg-black border border-white/20 hover:border-[#39FF14] text-white/90 hover:text-white font-mono text-[11px] tracking-wider transition-all cursor-pointer opacity-90 hover:opacity-100 z-10 shadow-lg active:scale-95"
                    title={lang === 'fr' ? 'Agrandir la vidéo' : 'Enlarge video'}
                  >
                    <Maximize2 className="h-3.5 w-3.5 text-[#39FF14]" />
                    <span>{lang === 'fr' ? 'AGRANDIR' : 'EXPAND'}</span>
                  </button>

                  {/* Player Quick Controls */}
                  <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center gap-1.5 sm:gap-2 bg-black/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-white/15 opacity-90 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={toggleVideoPlay}
                      className="min-h-[40px] min-w-[40px] sm:min-h-[36px] sm:min-w-[36px] p-2 rounded-lg bg-white/10 hover:bg-white/25 active:bg-white/30 text-white transition-colors cursor-pointer flex items-center justify-center"
                      title={isPlaying ? "Pause" : "Lecture"}
                      aria-label={isPlaying ? "Mettre en pause" : "Lire la vidéo"}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    {!isIkea && (
                      <button
                        onClick={toggleVideoMute}
                        className="min-h-[40px] min-w-[40px] sm:min-h-[36px] sm:min-w-[36px] p-2 rounded-lg bg-white/10 hover:bg-white/25 active:bg-white/30 text-white transition-colors cursor-pointer flex items-center justify-center"
                        title={isMuted ? "Activer le son" : "Couper le son"}
                        aria-label={isMuted ? "Activer le son" : "Couper le son"}
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </button>
                    )}
                    <button
                      onClick={handleFullscreenVideo}
                      className="min-h-[40px] min-w-[40px] sm:min-h-[36px] sm:min-w-[36px] p-2 rounded-lg bg-white/10 hover:bg-white/25 active:bg-white/30 text-white hover:text-[#39FF14] transition-colors cursor-pointer flex items-center justify-center"
                      title={lang === 'fr' ? 'Agrandir la vidéo en plein écran' : 'Fullscreen video'}
                      aria-label="Agrandir la vidéo"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Lightbox for Hero Video Enlargement */}
            {isHeroVideoEnlarged && project.videoUrl &&
              createPortal(
                <div
                  className="fixed inset-0 z-[99999] w-screen h-screen flex items-center justify-center p-2 sm:p-6 md:p-8 bg-black select-none overflow-hidden"
                  onClick={handleCloseHeroVideoEnlarged}
                >
                  <div
                    className="relative max-w-6xl w-full max-h-[96vh] flex flex-col items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Top Controls Bar */}
                    <div className="w-full flex items-center justify-between pb-3 font-mono text-xs text-white/80">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <span className="h-2 w-2 rounded-full bg-[#39FF14] shrink-0" />
                        <span className="uppercase tracking-wider font-semibold truncate text-xs sm:text-sm">
                          {project.title}
                        </span>
                        <span className="hidden sm:inline-block text-[#39FF14] font-mono text-[10px] px-2 py-0.5 rounded bg-white/10 border border-white/10">
                          {lang === 'fr' ? 'DÉMONSTRATION VIDÉO' : 'VIDEO DEMO'}
                        </span>
                      </div>
                      <button
                        onClick={handleCloseHeroVideoEnlarged}
                        className="p-2 sm:px-3 sm:py-2 rounded-lg bg-white/15 hover:bg-white/25 active:bg-white/30 text-white transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 min-h-[44px] min-w-[44px] justify-center"
                        aria-label="Fermer"
                      >
                        <X className="h-4 w-4" />
                        <span className="font-mono text-xs">{lang === 'fr' ? 'FERMER (ESC)' : 'CLOSE (ESC)'}</span>
                      </button>
                    </div>

                    {/* Big Responsive Video Container */}
                    <div className="relative w-full max-h-[85vh] rounded-2xl overflow-hidden border border-white/20 shadow-2xl flex items-center justify-center bg-black">
                      <video
                        ref={(el) => {
                          enlargedVideoRef.current = el;
                          if (el && videoRef.current) {
                            try {
                              if (Math.abs(el.currentTime - videoRef.current.currentTime) > 0.3) {
                                el.currentTime = videoRef.current.currentTime;
                              }
                            } catch {}
                          }
                        }}
                        src={project.videoUrl}
                        controls
                        autoPlay
                        playsInline
                        loop
                        muted={isIkea ? true : isMuted}
                        className="max-w-full max-h-[82vh] w-auto h-auto rounded-2xl object-contain block bg-black shadow-2xl"
                      />
                    </div>
                  </div>
                </div>,
                document.body
              )}

            {/* Fallback Hero Image if no video is present */}
            {!project.videoUrl && project.heroImage && (
              <div className="mt-6 rounded-xl overflow-hidden border border-white/10 bg-black relative group">
                <img
                  src={project.heroImage}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover max-h-[420px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>
            )}
          </div>

          {/* Metrics Counters (if available) */}
          {project.metrics && project.metrics.length > 0 && (
            <div>
              <h3 className="font-mono text-xs font-bold text-white/50 uppercase tracking-[0.2em] mb-3">
                {t('modal.metricsTitle')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {project.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-xl bg-[#161619] border border-white/10 flex flex-col justify-between min-w-0 overflow-hidden shadow-inner"
                  >
                    <span className="font-mono text-[11px] sm:text-xs text-white/50 truncate block mb-1.5">
                      {m.label}
                    </span>
                    <span
                      className={`font-display font-black text-[#39FF14] italic tracking-tight break-words [overflow-wrap:anywhere] hyphens-auto mt-auto ${getMetricFontSize(
                        m.value
                      )}`}
                    >
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Concept Breakdown & Description */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-display text-xl font-bold text-white flex items-center gap-2 uppercase tracking-tight">
                <Sparkles className="h-4 w-4 text-[#39FF14]" />
                <span>{t('modal.conceptTitle')}</span>
              </h3>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed font-light">
                {project.description}
              </p>
            </div>

            <div className="lg:col-span-5 space-y-6 bg-[#161619] p-6 rounded-xl border border-white/10">
              {/* Roles */}
              <div>
                <h4 className="font-mono text-xs font-bold text-white/60 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                  <UserCheck className="h-3.5 w-3.5 text-[#007BFF]" />
                  <span>{t('modal.rolesTitle')}</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.role.map((r) => (
                    <span
                      key={r}
                      className="px-2.5 py-1 rounded bg-black/60 font-mono text-xs text-white border border-white/10"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div>
                <h4 className="font-mono text-xs font-bold text-white/60 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                  <Wrench className="h-3.5 w-3.5 text-[#FF00FF]" />
                  <span>{t('modal.stackTitle')}</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-2.5 py-1 rounded bg-black/60 font-mono text-xs text-[#39FF14] border border-white/10"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Deliverables Checklist */}
          {project.deliverables && (
            <div>
              <h3 className="font-mono text-xs font-bold text-white/50 uppercase tracking-[0.2em] mb-4">
                {t('modal.deliverablesTitle')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.deliverables.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded bg-[#161619] border border-white/10"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#39FF14] shrink-0 mt-0.5" />
                    <span className="text-xs text-white/70">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Media */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs font-bold text-white/50 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[#39FF14]" />
                  <span>{t('modal.galleryTitle')}</span>
                </h3>
                <span className="font-mono text-[10px] text-white/40">
                  {lang === 'fr' ? 'CLIQUEZ SUR UNE IMAGE POUR AGRANDIR' : 'CLICK ON AN IMAGE TO ENLARGE'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.gallery.map((media, idx) => {
                  const isVideo = media.type === 'video' || (media.url && (media.url.endsWith('.mp4') || media.url.endsWith('.mov') || media.url.endsWith('.webm')));
                  return (
                    <div
                      key={idx}
                      onClick={() => handleOpenGalleryItem(idx)}
                      className="rounded-xl overflow-hidden bg-black border border-white/10 group cursor-pointer hover:border-white/40 transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] relative"
                    >
                      <div className="aspect-[16/9] overflow-hidden bg-neutral-900 relative">
                        {isVideo ? (
                          <video
                            src={media.url}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-cover scale-[1.01] group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <img
                            src={media.url}
                            alt={media.caption}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover scale-[1.01] group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 border border-white/30 text-white font-mono text-xs backdrop-blur-md">
                            <ZoomIn className="h-3.5 w-3.5 text-[#39FF14]" />
                            <span>{isVideo ? (lang === 'fr' ? 'VISIONNER LA VIDÉO' : 'WATCH VIDEO') : (lang === 'fr' ? "AGRANDIR L'IMAGE" : 'ENLARGE IMAGE')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Lightbox Zoom Modal for High-Resolution Slide Inspection */}
          {activeImageIndex !== null && project.gallery && project.gallery[activeImageIndex] &&
            createPortal(
              <div
                className="fixed inset-0 z-[9999] w-screen h-screen flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black select-none overflow-hidden"
                onClick={handleCloseGallery}
              >
                <div
                  className="relative max-w-6xl w-full max-h-[94vh] flex flex-col items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Top Controls */}
                  <div className="w-full flex items-center justify-between pb-3 font-mono text-xs text-white/80">
                    <div className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-[#39FF14]" />
                      <span className="uppercase tracking-wider font-semibold">{project.title}</span>
                      <span className="text-white/40 font-mono">
                        ({activeImageIndex + 1} / {project.gallery.length})
                      </span>
                    </div>
                    <button
                      onClick={handleCloseGallery}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                      <span>{lang === 'fr' ? 'FERMER (ESC)' : 'CLOSE (ESC)'}</span>
                    </button>
                  </div>

                  {/* Big Image/Video Display */}
                  <div className="relative max-w-5xl w-auto max-h-[80vh] sm:max-h-[82vh] rounded-2xl overflow-hidden border border-white/20 shadow-2xl flex items-center justify-center bg-black mx-auto">
                    {project.gallery[activeImageIndex].url && (project.gallery[activeImageIndex].url.endsWith('.mp4') || project.gallery[activeImageIndex].url.endsWith('.mov') || project.gallery[activeImageIndex].url.endsWith('.webm')) ? (
                      <video
                        key={`gallery-video-${activeImageIndex}-${project.gallery[activeImageIndex].url}`}
                        src={project.gallery[activeImageIndex].url}
                        controls
                        autoPlay
                        playsInline
                        muted={isIkea ? true : false}
                        className="max-w-full max-h-[80vh] sm:max-h-[82vh] w-auto h-auto rounded-2xl object-contain block bg-black"
                      />
                    ) : (
                      <img
                        src={project.gallery[activeImageIndex].url}
                        alt={project.gallery[activeImageIndex].caption}
                        referrerPolicy="no-referrer"
                        className="max-w-full max-h-[80vh] sm:max-h-[82vh] w-auto h-auto rounded-2xl object-contain block shadow-2xl bg-black"
                      />
                    )}

                    {/* Left Arrow */}
                    <button
                      onClick={() => {
                        audio.playMechanicalClick();
                        setActiveImageIndex((activeImageIndex - 1 + project.gallery!.length) % project.gallery!.length);
                      }}
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/80 border border-white/25 hover:border-white/60 text-white hover:bg-black transition-all cursor-pointer backdrop-blur-md"
                      title="Précédent"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>

                    {/* Right Arrow */}
                    <button
                      onClick={() => {
                        audio.playMechanicalClick();
                        setActiveImageIndex((activeImageIndex + 1) % project.gallery!.length);
                      }}
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/80 border border-white/25 hover:border-white/60 text-white hover:bg-black transition-all cursor-pointer backdrop-blur-md"
                      title="Suivant"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>,
              document.body
            )
          }

          {/* Footer Navigation CTA */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-[#161619] border border-white/15 text-white/70 hover:text-white hover:border-white/40 font-mono text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>PROJET PRÉCÉDENT (<span className="font-display font-bold">{prevProject.title}</span>)</span>
            </button>

            <button
              onClick={handleNext}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded bg-[#39FF14] text-black font-mono text-xs font-bold hover:shadow-[0_0_20px_rgba(57,255,20,0.6)] transition-all cursor-pointer"
            >
              <span>PROJET SUIVANT (<span className="font-display font-bold">{nextProject.title}</span>)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
