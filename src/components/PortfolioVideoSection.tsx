import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';
import ordiCodeVideo from '../assets/images/ORDI CODE.mp4';
import ordiPoster from '../assets/images/ordi_code_poster.webp';

interface PortfolioVideoSectionProps {
  setCursorMode?: (mode: any, text?: string) => void;
  isPaused?: boolean;
}

export const PortfolioVideoSection: React.FC<PortfolioVideoSectionProps> = ({ isPaused = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Detect when scrolled into view (triggers when 15% visible)
  const isInView = useInView(containerRef, {
    once: false,
    amount: 0.15,
  });

  const [hasBeenInView, setHasBeenInView] = useState(false);

  // Play video automatically in an ambient loop when in view, pause when offscreen to save GPU/battery
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVisibility = () => {
      if (!videoRef.current) return;
      if (document.hidden || isPaused || !isInView) {
        videoRef.current.pause();
      } else if (isInView) {
        videoRef.current.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    if (isInView && !isPaused && !document.hidden) {
      setHasBeenInView(true);
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      video.pause();
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isInView, isPaused]);

  return (
    <section 
      ref={containerRef}
      id="portfolio-reel"
      className="relative z-10 py-8 sm:py-16 px-3 sm:px-6 lg:px-8 flex flex-col items-center justify-center overflow-hidden bg-black select-none"
    >
      {/* Main Container - Expanded Cinematic Width */}
      <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto flex flex-col items-center">
        
        {/* Ambient Video Reel on Solid Black - Continuous Seamless Non-Interactive Loop */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={hasBeenInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-video flex items-center justify-center overflow-hidden bg-black pointer-events-none"
        >
          <video
            ref={videoRef}
            src={ordiCodeVideo}
            poster={ordiPoster}
            autoPlay
            muted
            playsInline
            preload="auto"
            loop
            className="w-full h-full object-contain block select-none bg-black pointer-events-none"
          />
        </motion.div>

      </div>
    </section>
  );
};
