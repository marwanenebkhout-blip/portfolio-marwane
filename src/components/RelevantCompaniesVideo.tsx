import React, { useRef, useEffect, useCallback } from 'react';
import { Briefcase } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import boxVideo from '../assets/images/BOX ICONES.mp4';
import boxPoster from '../assets/images/box_poster.webp';

export const RelevantCompaniesVideo: React.FC = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isIntersectingRef = useRef(false);

  // Play video smoothly when in view
  const resumePlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.readyState === 0) {
      video.load();
    }
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }, []);

  // Intersection Observer: play when in view, pause when scrolled away
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoRef.current;
          isIntersectingRef.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            resumePlayback();
          } else if (entry.intersectionRatio <= 0.0) {
            if (video && !video.paused) {
              video.pause();
            }
          }
        });
      },
      {
        rootMargin: '200px 0px',
        threshold: [0.0, 0.1, 0.5],
      }
    );

    observer.observe(container);

    // Wake-up listener when user returns from other tabs or hours of browsing
    const handleWakeup = () => {
      if (isIntersectingRef.current && !document.hidden) {
        resumePlayback();
      }
    };

    document.addEventListener('visibilitychange', handleWakeup);
    window.addEventListener('focus', handleWakeup);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleWakeup);
      window.removeEventListener('focus', handleWakeup);
      const video = videoRef.current;
      if (video) {
        video.pause();
      }
    };
  }, [resumePlayback]);

  return (
    <div ref={containerRef} className="space-y-3 pt-6 sm:pt-10 select-none">
      {/* Title with matching typography to "Formation & Diplômes" */}
      <h3 className="font-display text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
        <Briefcase className="h-4 w-4 text-[#39FF14]" />
        <span>{t('about.companiesTitle')}</span>
      </h3>

      {/* Floating Video without outer borders - non-interactive display */}
      <div className="w-full flex items-center justify-center py-2 pointer-events-none animate-subtle-float">
        <div className="relative w-full max-w-[380px] aspect-[922/756] flex items-center justify-center bg-transparent">
          <video
            ref={videoRef}
            src={boxVideo}
            poster={boxPoster}
            playsInline
            muted
            loop
            autoPlay
            preload="auto"
            onError={() => {
              const v = videoRef.current;
              if (v) {
                setTimeout(() => {
                  v.load();
                  if (isIntersectingRef.current && !document.hidden) {
                    v.play().catch(() => {});
                  }
                }, 400);
              }
            }}
            className="w-full h-full object-cover rounded-xl pointer-events-none drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)]"
          />
        </div>
      </div>
    </div>
  );
};
