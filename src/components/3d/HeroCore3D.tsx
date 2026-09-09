import React, { useRef, useEffect } from 'react';
import { CursorMode } from '../../types';
import avatarCharacterVideo from '../../assets/avatar_character_loop.mp4';
import avatarPoster from '../../assets/avatar_character_poster.webp';

interface HeroCore3DProps {
  onSelectSection?: (sectionId: string) => void;
  setCursorMode?: (mode: CursorMode, text?: string) => void;
  isPaused?: boolean;
}

export const HeroCore3D: React.FC<HeroCore3DProps> = ({ setCursorMode, isPaused = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isIntersectingRef = useRef(true);

  useEffect(() => {
    const video = videoRef.current;
    const el = containerRef.current;
    if (!video || !el) return;

    video.defaultMuted = true;
    video.muted = true;

    // Check actual viewport visibility immediately on mount
    const rect = el.getBoundingClientRect();
    isIntersectingRef.current = rect.top < window.innerHeight && rect.bottom > 0;

    const updatePlayback = () => {
      if (!video) return;
      if (document.hidden || isPaused || !isIntersectingRef.current) {
        video.pause();
      } else {
        if (video.readyState === 0) {
          video.load();
        }
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = entry.isIntersecting;
        updatePlayback();
      },
      { threshold: 0.05 }
    );
    observer.observe(el);

    const handleVisibilityChange = () => {
      updatePlayback();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    // Initial playback check
    updatePlayback();

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      if (video) {
        video.pause();
      }
    };
  }, [isPaused]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-[420px] sm:max-w-[500px] md:max-w-[560px] lg:max-w-[640px] xl:max-w-[720px] 2xl:max-w-[780px] aspect-square flex items-center justify-center select-none overflow-hidden"
      onMouseEnter={() => setCursorMode?.('HOVER', '360°')}
      onMouseLeave={() => setCursorMode?.('DEFAULT')}
    >
      <video
        ref={videoRef}
        src={avatarCharacterVideo}
        poster={avatarPoster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onError={() => {
          // Auto-recover decoder if dropped after long background sessions
          const v = videoRef.current;
          if (v) {
            setTimeout(() => {
              v.load();
              if (!document.hidden && !isPaused && isIntersectingRef.current) {
                v.play().catch(() => {});
              }
            }, 400);
          }
        }}
        className="w-full h-full object-cover object-center pointer-events-none scale-100 sm:scale-105 lg:scale-108 transition-transform duration-500"
      />
    </div>
  );
};
