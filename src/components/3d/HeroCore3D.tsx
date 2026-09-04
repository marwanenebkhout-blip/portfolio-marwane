import React, { useRef, useEffect } from 'react';
import { CursorMode } from '../../types';
import avatarCharacterVideo from '../../assets/avatar_character_loop.mp4';

interface HeroCore3DProps {
  onSelectSection?: (sectionId: string) => void;
  setCursorMode?: (mode: CursorMode, text?: string) => void;
}

export const HeroCore3D: React.FC<HeroCore3DProps> = ({ setCursorMode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        // Autoplay fallback
      });
    }
  }, []);

  return (
    <div 
      className="relative w-full max-w-[420px] sm:max-w-[500px] md:max-w-[560px] lg:max-w-[640px] xl:max-w-[720px] 2xl:max-w-[780px] aspect-square flex items-center justify-center select-none overflow-hidden"
      onMouseEnter={() => setCursorMode?.('HOVER', '360°')}
      onMouseLeave={() => setCursorMode?.('DEFAULT')}
    >
      <video
        ref={videoRef}
        src={avatarCharacterVideo}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover object-center pointer-events-none scale-100 sm:scale-105 lg:scale-108 transition-transform duration-500"
      />
    </div>
  );
};
