import React from 'react';
import { getPersonalInfo, getExperiences, getEducation, getSoftwareStack, languages } from '../data/config';
import { useLanguage } from '../context/LanguageContext';
import { audio } from '../utils/audio';
import { X, Printer, Download, Mail, Phone, MapPin, Award, CheckCircle } from 'lucide-react';
import avatarImg from '../assets/images/MOI MINI V2.png';
import titreCvImg from '../assets/images/TITRE CV 2.png';

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CVModal: React.FC<CVModalProps> = ({ isOpen, onClose }) => {
  const { lang, t } = useLanguage();
  if (!isOpen) return null;

  const personalInfo = getPersonalInfo(lang);
  const experiences = getExperiences(lang);
  const education = getEducation(lang);
  const softwareStack = getSoftwareStack(lang);

  const displayLanguages = lang === 'fr' 
    ? ['Français (Natif)', 'Anglais (Professionnel)']
    : ['French (Native)', 'English (Professional)'];

  const handlePrint = () => {
    audio.playMechanicalClick();
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl my-8 bg-[#111113] border border-white/15 rounded-2xl shadow-2xl overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#161619] border-b border-white/10 sticky top-0 z-10">
          <div className="flex items-center gap-2 font-mono text-xs text-white/80">
            <span className="h-2 w-2 rounded-full bg-[#39FF14]" />
            <span className="font-bold tracking-wider uppercase">CURRICULUM VITAE // {personalInfo.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{lang === 'fr' ? 'IMPRIMER / PDF' : 'PRINT / PDF'}</span>
            </button>
            <button
              onClick={() => {
                audio.playKeyHover();
                onClose();
              }}
              className="p-1.5 rounded bg-[#39FF14] text-black hover:shadow-[0_0_12px_#39FF14] transition-all cursor-pointer"
              title={t('modal.close')}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable CV Container */}
        <div className="p-8 sm:p-12 space-y-10 max-h-[80vh] overflow-y-auto font-sans bg-black">
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
                    className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-contain max-w-[360px] sm:max-w-lg md:max-w-xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
                  />
                </div>
              </div>

              {/* Subtitle & Bio placed under the avatar and name */}
              <div className="pt-3 sm:pt-4">
                <p className="font-mono text-[11px] sm:text-xs md:text-sm font-bold tracking-wide sm:tracking-wider uppercase text-[#39FF14] whitespace-nowrap">
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
                      {exp.role} <span className="text-[#39FF14]">@ {exp.company}</span>
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
  );
};
