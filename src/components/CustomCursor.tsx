import React, { useEffect, useState } from 'react';
import { CursorMode } from '../types';

interface CustomCursorProps {
  mode: CursorMode;
  hoverText?: string;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ mode, hoverText }) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailerPos, setTrailerPos] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  // Smooth trailing effect
  useEffect(() => {
    if (isTouch) return;
    let animationFrameId: number;

    const followCursor = () => {
      setTrailerPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.18,
        y: prev.y + (pos.y - prev.y) * 0.18,
      }));
      animationFrameId = requestAnimationFrame(followCursor);
    };

    animationFrameId = requestAnimationFrame(followCursor);
    return () => cancelAnimationFrame(animationFrameId);
  }, [pos, isTouch]);

  if (isTouch || !isVisible) return null;

  const isExpanded = mode !== 'DEFAULT';

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Precision center dot */}
      <div
        className="fixed top-0 left-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#39FF14] shadow-[0_0_8px_#39FF14] transition-transform duration-75"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        }}
      />

      {/* Trailing interactive ring */}
      <div
        className={`fixed top-0 left-0 flex items-center justify-center rounded-full border transition-all duration-200 ${
          isExpanded
            ? 'h-14 w-14 -translate-x-1/2 -translate-y-1/2 border-[#39FF14] bg-[#39FF14]/15 backdrop-blur-[2px] shadow-[0_0_15px_rgba(57,255,20,0.3)]'
            : 'h-8 w-8 -translate-x-1/2 -translate-y-1/2 border-white/30 bg-transparent'
        }`}
        style={{
          transform: `translate3d(${trailerPos.x}px, ${trailerPos.y}px, 0) translate(-50%, -50%)`,
        }}
      >
        {isExpanded && (
          <span className="font-mono text-[9px] font-bold tracking-widest text-[#39FF14] uppercase">
            {hoverText || mode}
          </span>
        )}
      </div>
    </div>
  );
};
