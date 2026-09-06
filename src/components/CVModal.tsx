import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getPersonalInfo, getExperiences, getEducation, getSoftwareStack } from '../data/config';
import { useLanguage } from '../context/LanguageContext';
import { audio } from '../utils/audio';
import { X, Printer, Download, Mail, Phone, MapPin, Award, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import avatarImg from '../assets/images/MOI_MINI_V2.webp';
import titreCvImg from '../assets/images/TITRE CV 2.png';

// Pre-load and pre-decode images immediately so they are cached in GPU memory
if (typeof window !== 'undefined') {
  const p1 = new Image();
  p1.src = titreCvImg;
  p1.decode?.().catch(() => {});

  const p2 = new Image();
  p2.src = avatarImg;
  p2.decode?.().catch(() => {});
}

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CVModal: React.FC<CVModalProps> = ({ isOpen, onClose }) => {
  const { lang, t } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cvContentRef = useRef<HTMLDivElement>(null);

  const resetScroll = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    if (cvContentRef.current) {
      cvContentRef.current.scrollTop = 0;
    }
  };

  const handleClose = () => {
    audio.playKeyHover();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      // Reset both outer overlay and inner content scroll positions to the top upon opening
      resetScroll();

      // Schedule check on next frame so opening is guaranteed to be at the top
      const raf1 = requestAnimationFrame(resetScroll);

      // Prevent body scrolling while modal is open
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Keyboard ESC handler
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      // Trigger confetti exactly when the CV modal is displayed on screen
      const animFrame = requestAnimationFrame(() => {
        confetti({
          particleCount: 55,
          spread: 75,
          origin: { y: 0.45 },
          zIndex: 99999,
          colors: ['#39FF14', '#00F0FF', '#FF003C', '#FFE600', '#FFFFFF'],
        });
      });

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(animFrame);
        // Note: Do NOT reset scroll during close transition; let it fade out at current position
      };
    } else {
      // Once the 200ms fade-out transition has completely ended and modal is hidden,
      // reset scroll quietly in the background so next open starts cleanly at the top.
      const timer = setTimeout(() => {
        resetScroll();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const personalInfo = getPersonalInfo(lang);
  const experiences = getExperiences(lang);
  const education = getEducation(lang);
  const softwareStack = getSoftwareStack(lang);

  const displayLanguages = lang === 'fr' 
    ? ['Français (Natif)', 'Anglais (courant)', 'Espagnol (courant)', 'Arabe (dialecte)']
    : ['French (Native)', 'English (Fluent)', 'Spanish (Fluent)', 'Arabic (Dialect)'];

  const handlePrint = () => {
    audio.playMechanicalClick();
    window.print();
  };

  return createPortal(
    <div
      ref={scrollContainerRef}
      className={`fixed inset-0 z-[100] overflow-y-auto p-0 sm:p-6 bg-black transition-all duration-200 ${
        isOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible'
      }`}
      onClick={handleClose}
      aria-hidden={!isOpen}
    >
      <div className="min-h-full flex items-start sm:items-center justify-center py-0 sm:py-8">
        <div
          className={`relative w-full max-w-4xl bg-[#111113] border-0 sm:border border-white/15 rounded-none sm:rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col min-h-screen sm:min-h-0 transition-all duration-200 ${
            isOpen ? 'scale-100 opacity-100' : 'scale-98 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-[#161619] border-b border-white/10 sticky top-0 z-20">
          <div className="flex items-center gap-2 font-mono text-xs text-white/80 min-w-0">
            <span className="h-2 w-2 rounded-full bg-[#39FF14] shrink-0" />
            <span className="font-bold tracking-wider uppercase truncate text-[11px] sm:text-xs">
              CURRICULUM VITAE // {personalInfo.name}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors cursor-pointer min-h-[36px]"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{lang === 'fr' ? 'IMPRIMER / PDF' : 'PRINT / PDF'}</span>
            </button>
            <button
              onClick={handleClose}
              className="p-1.5 sm:p-2 rounded bg-[#39FF14] text-black hover:shadow-[0_0_12px_#39FF14] transition-all cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              title={t('modal.close')}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable CV Container */}
        <div
          ref={cvContentRef}
          className="p-4 sm:p-8 md:p-12 space-y-8 sm:space-y-10 sm:max-h-[80vh] overflow-y-auto font-sans bg-black flex-1"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-8 border-b border-white/15">
            <div className="space-y-3">
              {/* Avatar + Name */}
              <div className="flex items-center gap-4 sm:gap-6 pt-2">
                {/* Avatar container sized exactly to the blue square */}
                <div className="relative h-16 sm:h-20 md:h-24 lg:h-28 aspect-[840/901] shrink-0 overflow-visible">
                  <img
                    src={avatarImg}
                    alt={personalInfo.name}
                    loading="eager"
                    decoding="sync"
                    className="absolute pointer-events-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
                    style={{
                      width: '149.3%',
                      height: '139.2%',
                      maxWidth: 'none',
                      top: '-22.53%',
                      left: '-23.21%'
                    }}
                  />
                </div>
                <div className="flex items-center">
                  <img
                    src={titreCvImg}
                    alt={personalInfo.name}
                    loading="eager"
                    decoding="sync"
                    className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-contain max-w-[360px] sm:max-w-lg md:max-w-xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
                  />
                </div>
              </div>

              {/* Subtitle & Bio placed under the avatar and name */}
              <div className="pt-3 sm:pt-4">
                <p className="font-mono text-[11px] sm:text-xs md:text-sm font-bold tracking-wide sm:tracking-wider uppercase text-[#39FF14] break-words">
                  GRAPHIC DESIGNER // ART DIRECTOR // 3D & MOTION DESIGNER
                </p>
                <p className="text-xs text-white/60 mt-2.5 max-w-xl font-light leading-relaxed">
                  {personalInfo.shortBio}
                </p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-1.5 font-mono text-xs text-white/70 self-start">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#39FF14]" />
                <a href={`mailto:${personalInfo.email}`} className="hover:text-white transition-colors">
                  {personalInfo.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#007BFF]" />
                <a href={`tel:${personalInfo.phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">
                  {personalInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#FF00FF]" />
                <span>{personalInfo.location}</span>
              </div>
            </div>
          </div>

          {/* Core Experience */}
          <div>
            <h2 className="font-mono text-xs font-bold text-white/50 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#39FF14]" />
              <span>{t('cv.experienceTitle')}</span>
            </h2>

            <div className="space-y-6">
              {experiences.map((exp, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <h3 className="font-display text-base font-bold text-white tracking-tight">
                      {exp.role} <span className="text-[#39FF14]">{exp.company}</span>
                    </h3>
                    <span className="font-mono text-xs text-white/50">{exp.period}</span>
                  </div>
                  <p className="text-xs text-white/60 font-light">{exp.description}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-1">
                    {exp.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="text-[11px] leading-relaxed text-white/60 flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#39FF14] shrink-0 mt-[5px]" />
                        <span className="flex-1">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Software Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-white/10">
            {/* Education */}
            <div>
              <h2 className="font-mono text-xs font-bold text-white/50 uppercase tracking-[0.2em] mb-4">
                {t('cv.educationTitle')}
              </h2>
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <span className="font-mono text-xs text-[#007BFF] font-semibold">{edu.year}</span>
                    <h4 className="font-bold text-xs text-white">{edu.degree}</h4>
                    {edu.specialization && (
                      <p className="font-mono text-[11px] text-[#39FF14]/90">{edu.specialization}</p>
                    )}
                    {edu.school && <p className="font-mono text-[11px] text-white/50">{edu.school}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Software Stack */}
            <div>
              <h2 className="font-mono text-xs font-bold text-white/50 uppercase tracking-[0.2em] mb-4">
                {t('cv.stackTitle')}
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {softwareStack.map((s) => (
                  <span
                    key={s.name}
                    className="px-2.5 py-1 rounded bg-[#161619] font-mono text-[11px] text-white/80 border border-white/10"
                  >
                    {s.name}
                  </span>
                ))}
              </div>

              {/* Languages */}
              <div className="mt-6 pt-5 border-t border-white/10">
                <h2 className="font-mono text-xs font-bold text-white/50 uppercase tracking-[0.2em] mb-3">
                  {t('cv.languagesTitle')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {displayLanguages.map((l) => (
                    <span
                      key={l}
                      className="px-3 py-1.5 rounded bg-[#161619] font-mono text-[11px] text-white/90 border border-white/10 flex items-center gap-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#39FF14] shrink-0" />
                      <span>{l}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
