import React, { useRef, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import boxVideo from '../assets/images/BOX ICONES.mp4';
import boxPoster from '../assets/images/box_poster.webp';

export const RelevantCompaniesVideo: React.FC = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInViewRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = videoRef.current;
          if (!v) return;

          if (entry.isIntersecting) {
            // Arrived at this level of the site: play once from the beginning
            if (!isInViewRef.current) {
              isInViewRef.current = true;
              if (v.readyState === 0) {
                v.load();
              }
              v.currentTime = 0;
              const playPromise = v.play();
              if (playPromise !== undefined) {
                playPromise.catch(() => {});
              }
            }
          } else {
            // Left this level of the site: pause and reset so it can replay on return
            if (isInViewRef.current) {
              isInViewRef.current = false;
              v.pause();
              v.currentTime = 0;
            }
          }
        });
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      if (video) {
        video.pause();
      }
    };
  }, []);

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
            preload="auto"
            className="w-full h-full object-cover rounded-xl pointer-events-none drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)]"
          />
        </div>
      </div>
    </div>
  );
};

