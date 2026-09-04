import React, { useState, useEffect } from 'react';
import { audio } from '../utils/audio';
import { Terminal, Cpu, CheckCircle2 } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);

  const logs = [
    'INIT WEBGL 2.0 GRAPHICS PIPELINE & GPU CONTEXT...',
    'COMPILING GLSL PROCEDURAL SHADERS & MATRICES...',
    'CALIBRATING 3D MECHANICAL MACROPAD ACTUATORS...',
    'CONFIGURING SYNTHESIZED WEB AUDIO ENGINE...',
    'CREATIVE SYSTEM READY // WELCOME TO MY PLAYGROUND.',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          audio.playSystemBoot();
          setTimeout(onComplete, 400);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 12) + 4;
        const bounded = Math.min(100, next);

        if (bounded > 20 && logIndex < 1) setLogIndex(1);
        if (bounded > 45 && logIndex < 2) setLogIndex(2);
        if (bounded > 75 && logIndex < 3) setLogIndex(3);
        if (bounded >= 95 && logIndex < 4) setLogIndex(4);

        return bounded;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [logIndex, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-[#E0E0E0] p-6 select-none scanlines">
      <div className="w-full max-w-lg space-y-6">
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 font-mono text-xs text-[#39FF14]">
            <Cpu className="h-4 w-4 animate-spin" />
            <span className="font-bold">SYSTEM BOOT V4.02 // MN_SYSTEM_V.1.0</span>
          </div>
          <span className="font-mono text-xs text-white/40">INIT 60FPS</span>
        </div>

        {/* Big Progress Counter */}
        <div className="text-center py-4">
          <div className="font-display text-6xl sm:text-7xl font-black text-white tracking-tighter italic">
            {progress}
            <span className="text-[#39FF14] text-3xl sm:text-4xl ml-1 not-italic">%</span>
          </div>
          <p className="font-mono text-xs text-white/40 mt-2 tracking-[0.3em] uppercase">
            {progress < 100 ? 'CHARGEMENT DE L’EXPÉRIENCE 3D...' : 'SYSTÈME OPÉRATIONNEL'}
          </p>
        </div>

        {/* Progress Bar with Glowing Head */}
        <div className="relative h-2 w-full bg-[#111113] rounded-full overflow-hidden border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#39FF14] to-[#007BFF] rounded-full transition-all duration-100 relative shadow-[0_0_15px_rgba(57,255,20,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Diagnostic Telemetry Logs */}
        <div className="p-4 rounded-xl bg-[#111113] border border-white/10 font-mono text-[11px] space-y-2 min-h-[140px]">
          {logs.slice(0, logIndex + 1).map((log, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 ${
                idx === logIndex ? 'text-[#39FF14]' : 'text-white/40'
              }`}
            >
              <span className="text-white/20">[{String(idx + 1).padStart(2, '0')}]</span>
              <span>{log}</span>
            </div>
          ))}
        </div>

        {/* Skip button for instant entry */}
        <div className="text-center">
          <button
            onClick={() => {
              audio.playMechanicalClick();
              onComplete();
            }}
            className="font-mono text-xs text-white/40 hover:text-[#39FF14] underline tracking-wider cursor-pointer transition-colors"
          >
            PASSER L'INITIALISATION →
          </button>
        </div>
      </div>
    </div>
  );
};
