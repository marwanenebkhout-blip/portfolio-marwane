import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import boxVideo from '../assets/images/BOX ICONES.mp4';

export const RelevantCompaniesVideo: React.FC = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPlayedInCurrentView, setHasPlayedInCurrentView] = useState(false);

  // Play the video forward once
  const playOnce = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video
      .play()
      .then(() => {
        setHasPlayedInCurrentView(true);
      })
      .catch((err) => {
        console.warn('Video autoplay prevented:', err);
      });
  }, []);

  // Intersection Observer: detect when user scrolls to this section
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoRef.current;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            // When arriving at this section: play once if not already played
            if (!hasPlayedInCurrentView) {
              playOnce();
            }
          } else if (entry.intersectionRatio <= 0.05) {
            // When scrolled out of view (e.g. going back up to the top): reset so it replays next time
            setHasPlayedInCurrentView(false);
            if (video) {
              video.pause();
              video.currentTime = 0;
            }
          }
        });
      },
      {
        threshold: [0.0, 0.1, 0.3, 0.6, 1.0],
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [hasPlayedInCurrentView, playOnce]);

  // Click handler if user wants to replay manually
  const handleClick = () => {
    playOnce();
  };

  return (
    <div ref={containerRef} className="space-y-3 pt-6 sm:pt-10">
      {/* Title with matching typography to "Formation & Diplômes" */}
      <h3 className="font-display text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
        <Briefcase className="h-4 w-4 text-[#39FF14]" />
        <span>{t('about.companiesTitle')}</span>
      </h3>

      {/* Floating Video without outer borders */}
      <motion.div
        animate={{
          y: [-6, 6, -6],
          rotateZ: [-0.5, 0.5, -0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-full flex items-center justify-center cursor-pointer py-2"
        onClick={handleClick}
        title={t('about.replayVideo')}
      >
        <div className="relative w-full max-w-[380px] aspect-[922/756] flex items-center justify-center">
          <video
            ref={videoRef}
            src={boxVideo}
            playsInline
            muted
            preload="none"
            className="w-full h-full object-cover rounded-xl pointer-events-none drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)]"
          />
        </div>
      </motion.div>
    </div>
  );
};

