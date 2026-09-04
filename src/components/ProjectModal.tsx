import React, { useEffect, useRef, useState } from 'react';
import { Project, CursorMode } from '../types';
import { projects } from '../data/projects';
import { audio } from '../utils/audio';
import { X, ArrowLeft, ArrowRight, CheckCircle2, Award, Calendar, UserCheck, Wrench, Sparkles, Box, Maximize2, ZoomIn, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onSelectProject: (p: Project) => void;
  setCursorMode: (mode: CursorMode, text?: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onSelectProject,
  setCursorMode,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleFullscreenVideo = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!project) return;
      if (activeImageIndex !== null) {
        if (e.key === 'Escape') {
          setActiveImageIndex(null);
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
  }, [project, activeImageIndex]);

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl my-8 bg-[#111113] border border-white/15 rounded-2xl shadow-2xl overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Hardware Navigation Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#161619] border-b border-white/10 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: project.accentColor }} />
            <span className="font-mono text-xs font-bold text-white/80 uppercase tracking-widest">
              DOSSIER PROJET // #{String(currentIndex + 1).padStart(2, '0')}
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded bg-black/60 font-mono text-[10px] text-[#39FF14] border border-white/10">
              {project.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Prev Project */}
            <button
              onClick={handlePrev}
              className="p-2 rounded bg-black/50 border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Projet précédent (Flèche gauche)"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            {/* Next Project */}
            <button
              onClick={handleNext}
              className="p-2 rounded bg-black/50 border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Projet suivant (Flèche droite)"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
            {/* Close */}
            <button
              onClick={() => {
                audio.playKeyHover();
                onClose();
              }}
              className="p-2 rounded bg-[#39FF14] text-black font-bold hover:shadow-[0_0_15px_#39FF14] transition-all ml-2 cursor-pointer"
              title="Fermer (Échap)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 lg:p-10 space-y-12 max-h-[80vh] overflow-y-auto">
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
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover"
                  />

                  {/* Player Quick Controls */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/80 backdrop-blur-md p-1.5 rounded-xl border border-white/15 opacity-90 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={toggleVideoPlay}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
                      title={isPlaying ? "Pause" : "Lecture"}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={toggleVideoMute}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
                      title={isMuted ? "Activer le son" : "Couper le son"}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={handleFullscreenVideo}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
                      title="Plein écran"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Fallback Hero Image if no video is present */}
            {!project.videoUrl && project.heroImage && (
              <div className="mt-6 rounded-xl overflow-hidden border border-white/10 bg-black relative group">
                <img
                  src={project.heroImage}
                  alt={project.title}
                  referrerPolicy="no-referrer"
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
                IMPACT & PERFORMANCES
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {project.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#161619] border border-white/10 flex flex-col justify-between"
                  >
                    <span className="font-mono text-xs text-white/50">{m.label}</span>
                    <span className="font-display text-2xl sm:text-3xl font-black text-[#39FF14] mt-2 italic tracking-tight">
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
                <span>Concept & Démarche Artistique</span>
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
                  <span>RÔLES & EXPERTISES</span>
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
                  <span>LOGICIELS & STACK</span>
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
                LIVRABLES CLÉS
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
                  <span>GALERIE DE RENDUS & DIAPOSITIVES ({project.gallery.length})</span>
                </h3>
                <span className="font-mono text-[10px] text-white/40">
                  CLIQUEZ SUR UNE IMAGE POUR AGRANDIR
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.gallery.map((media, idx) => {
                  const isVideo = media.type === 'video' || (media.url && (media.url.endsWith('.mp4') || media.url.endsWith('.mov') || media.url.endsWith('.webm')));
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        audio.playMechanicalClick();
                        setActiveImageIndex(idx);
                      }}
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
                            className="w-full h-full object-cover scale-[1.01] group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <img
                            src={media.url}
                            alt={media.caption}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover scale-[1.01] group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 border border-white/30 text-white font-mono text-xs backdrop-blur-md">
                            <ZoomIn className="h-3.5 w-3.5 text-[#39FF14]" />
                            <span>{isVideo ? 'VISIONNER LA VIDÉO' : 'AGRANDIR LA DIAPOSITIVE'}</span>
                          </div>
                        </div>
                        <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 border border-white/20 font-mono text-[10px] text-white/80">
                          {isVideo ? 'VIDÉO' : 'DIAPO'} {String(idx + 1).padStart(2, '0')} / {String(project.gallery?.length).padStart(2, '0')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Lightbox Zoom Modal for High-Resolution Slide Inspection */}
          {activeImageIndex !== null && project.gallery && project.gallery[activeImageIndex] && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-2xl"
              onClick={() => setActiveImageIndex(null)}
            >
              <div
                className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Top Controls */}
                <div className="w-full flex items-center justify-between pb-4 font-mono text-xs text-white/80">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[#39FF14]" />
                    <span>DIAPOSITIVE {String(activeImageIndex + 1).padStart(2, '0')} / {String(project.gallery.length).padStart(2, '0')}</span>
                  </div>
                  <button
                    onClick={() => setActiveImageIndex(null)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                    <span>FERMER (ESC)</span>
                  </button>
                </div>

                {/* Big Image/Video Display */}
                <div className="relative max-w-5xl w-auto max-h-[82vh] rounded-2xl overflow-hidden border border-white/20 shadow-2xl flex items-center justify-center bg-transparent mx-auto">
                  {project.gallery[activeImageIndex].url && (project.gallery[activeImageIndex].url.endsWith('.mp4') || project.gallery[activeImageIndex].url.endsWith('.mov') || project.gallery[activeImageIndex].url.endsWith('.webm')) ? (
                    <video
                      src={project.gallery[activeImageIndex].url}
                      controls
                      autoPlay
                      className="max-w-full max-h-[82vh] w-auto h-auto rounded-2xl object-cover block"
                    />
                  ) : (
                    <img
                      src={project.gallery[activeImageIndex].url}
                      alt={project.gallery[activeImageIndex].caption}
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-[82vh] w-auto h-auto rounded-2xl object-cover block shadow-2xl"
                    />
                  )}

                  {/* Left Arrow */}
                  <button
                    onClick={() => {
                      audio.playMechanicalClick();
                      setActiveImageIndex((activeImageIndex - 1 + project.gallery!.length) % project.gallery!.length);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 border border-white/20 hover:border-white/50 text-white hover:bg-black/90 transition-all cursor-pointer backdrop-blur-sm"
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
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 border border-white/20 hover:border-white/50 text-white hover:bg-black/90 transition-all cursor-pointer backdrop-blur-sm"
                    title="Suivant"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

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
    </div>
  );
};
