import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Play, Volume2, VolumeX } from 'lucide-react';
import ordiCodeVideo from '../assets/images/ORDI CODE.mp4';

interface PortfolioVideoSectionProps {
  setCursorMode?: (mode: any, text?: string) => void;
}

export const PortfolioVideoSection: React.FC<PortfolioVideoSectionProps> = ({ setCursorMode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Detect when scrolled into view (triggers when 20% visible)
  const isInView = useInView(containerRef, {
    once: true,
    amount: 0.2,
  });

  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Play video automatically when scrolled into view and keep looping
  useEffect(() => {
    if (isInView && videoRef.current) {
      setHasStarted(true);
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.log('Video autoplay prevented on scroll:', err);
          });
      }
    }
  }, [isInView]);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      setHasStarted(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section 
      ref={containerRef}
      id="portfolio-reel"
      className="relative z-10 py-8 sm:py-16 px-3 sm:px-6 lg:px-8 flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* Main Container - Expanded Cinematic Width */}
      <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto flex flex-col items-center">
        
        {/* Pure Video Element on Solid Black with Infinite Loop */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-video flex items-center justify-center overflow-hidden bg-black group cursor-pointer"
          onClick={togglePlay}
          onMouseEnter={() => setCursorMode?.('HOVER', 'LOOP')}
          onMouseLeave={() => setCursorMode?.('DEFAULT')}
        >
          <video
            ref={videoRef}
            src={ordiCodeVideo}
            autoPlay
            muted={isMuted}
            playsInline
            preload="auto"
            loop
            className="w-full h-full object-contain block select-none bg-black"
          />

          {/* Sound Mute/Unmute Toggle in Corner */}
          <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={toggleSound}
              className="p-2.5 rounded-full bg-[#111113]/80 hover:bg-[#1f1f23] border border-white/15 hover:border-[#39FF14]/50 text-white hover:text-[#39FF14] transition-all backdrop-blur-sm cursor-pointer shadow-lg"
              title={isMuted ? 'Activer le son' : 'Couper le son'}
              aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#39FF14]" />
              )}
            </button>
          </div>

          {/* Manual Play Trigger (fallback if autoplay blocked or paused) */}
          {(!hasStarted || !isPlaying) && (
            <div
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 hover:bg-black/30 transition-colors pointer-events-none"
            >
              <div className="h-16 w-16 rounded-full bg-[#141416]/90 border border-white/20 flex items-center justify-center text-white group-hover:text-[#39FF14] group-hover:scale-110 group-hover:border-white/40 transition-all shadow-2xl">
                <Play className="w-7 h-7 ml-0.5" />
              </div>
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
};
