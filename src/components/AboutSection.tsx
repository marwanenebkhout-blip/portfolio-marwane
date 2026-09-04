import React, { useState } from 'react';
import { personalInfo, softwareStack, skillGroups, experiences, education, socialLinks } from '../data/config';
import { audio } from '../utils/audio';
import { FileText, Download, Briefcase, GraduationCap, Sparkles, Terminal, CheckCircle, ExternalLink, Cpu } from 'lucide-react';
import confetti from 'canvas-confetti';
import { RelevantCompaniesVideo } from './RelevantCompaniesVideo';
import moiMiniImg from '../assets/images/MOI MINI V2.png';

interface AboutSectionProps {
  onOpenCVModal: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenCVModal }) => {
  const [activeSkillGroup, setActiveSkillGroup] = useState(0);

  const handleDownloadCV = () => {
    audio.playMechanicalClick();
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    onOpenCVModal();
  };

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#FF00FF] tracking-[0.3em] uppercase mb-2">
            <Terminal className="h-4 w-4" />
            <span>03 // DOSSIER BIOGRAPHIQUE & COMPÉTENCES</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter italic text-white">
            About me
          </h2>
        </div>

        {/* Download CV CTA */}
        <button
          onClick={handleDownloadCV}
          className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2.5 rounded bg-[#111113] border border-white/20 text-white hover:border-[#39FF14] hover:text-[#39FF14] font-mono text-xs font-bold tracking-wider transition-all shadow-lg group cursor-pointer"
        >
          <FileText className="h-4 w-4 text-[#39FF14] group-hover:scale-110 transition-transform" />
          <span>VOIR / TÉLÉCHARGER LE CV (PDF)</span>
          <Download className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Main Bio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Left: Bio & Manifesto (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-8 rounded-xl bg-[#111113] border border-white/10 relative overflow-hidden shadow-2xl">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
              <div className="relative h-14 w-14 shrink-0 flex items-center justify-center">
                <img
                  src={moiMiniImg}
                  alt={personalInfo.name}
                  className="h-full w-full object-contain drop-shadow-md"
                />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold tracking-tight text-white uppercase">
                  {personalInfo.name}
                </h3>
                <p className="font-mono text-xs text-[#39FF14] tracking-widest uppercase mt-0.5">
                  {personalInfo.role}
                </p>
              </div>
            </div>

            <p className="text-white/70 text-base leading-relaxed mb-6 font-light">
              {personalInfo.shortBio}
            </p>

            <div className="p-4 rounded bg-[#161619] border-l-2 border-[#39FF14] text-white/80 text-xs sm:text-sm italic leading-relaxed font-mono whitespace-pre-line">
              "{personalInfo.manifesto}"
            </div>

            {/* Quick Stats Matrix */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10 text-center">
              <div className="flex flex-col items-center justify-center">
                <span className="font-gilroy-heavy-italic text-2xl sm:text-3xl font-black text-white italic tracking-tight">
                  {personalInfo.yearsOfExperience}
                </span>
                <span className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mt-1">
                  Années d'Expérience
                </span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="font-gilroy-heavy-italic text-2xl sm:text-3xl font-black text-[#39FF14] italic tracking-tight">
                  {personalInfo.completedProjects}
                </span>
                <span className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mt-1">
                  Digital / Print / Motion
                </span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="font-gilroy-heavy-italic text-2xl sm:text-3xl font-black text-[#007BFF] italic tracking-tight">
                  {personalInfo.awards}
                </span>
                <span className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mt-1">
                  Pipeline intégré
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Software Matrix (5 Cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-xl bg-[#111113] border border-white/10 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <h3 className="font-mono text-xs font-bold text-white/60 uppercase tracking-[0.2em] flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#39FF14]" />
                <span>LOGICIELS & COMPÉTENCES</span>
              </h3>
              <span className="font-mono text-[10px] text-[#39FF14] font-bold">PRO LEVEL</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
              {softwareStack.map((soft) => (
                <div key={soft.name} className="p-2 rounded bg-white/[0.02] border border-white/5 space-y-1 hover:border-white/15 transition-colors">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-white font-medium truncate">{soft.name}</span>
                    <span className="text-white/40 text-[10px] ml-2 shrink-0">{soft.category}</span>
                  </div>
                  <div className="h-1 w-full bg-[#1e1e22] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#39FF14] to-[#007BFF] rounded-full"
                      style={{ width: `${soft.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 font-mono text-[11px] text-white/40 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#39FF14] animate-pulse shrink-0" />
            <span className="truncate">Pipeline Hybride Design, 3D Temps Réel & IA Générative</span>
          </div>
        </div>
      </div>

      {/* Experience & Education Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Experience Timeline (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="font-display text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[#39FF14]" />
            <span>Parcours Professionnel</span>
          </h3>

          <div className="space-y-4">
            {experiences.map((exp, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-[#111113] border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <h4 className="font-display text-lg font-bold text-white tracking-tight">
                    {exp.role}
                  </h4>
                  <span className="font-mono text-xs text-[#39FF14] bg-[#39FF14]/10 px-2.5 py-0.5 rounded border border-[#39FF14]/20 self-start sm:self-auto font-medium">
                    {exp.period}
                  </span>
                </div>

                <div className="font-mono text-xs text-white/40 mb-3">
                  {exp.company} • {exp.location}
                </div>

                <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-4 font-light">
                  {exp.description}
                </p>

                <div className="space-y-1.5 pt-3 border-t border-white/5">
                  {exp.highlights.map((item, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2 text-xs leading-relaxed text-white/50">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#39FF14] shrink-0 mt-[5px]" />
                      <span className="flex-1">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Client Marquee (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Education */}
          <div className="space-y-6">
            <h3 className="font-display text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-[#007BFF]" />
              <span>Formation & Diplômes</span>
            </h3>

            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div key={idx} className="p-6 rounded-xl bg-[#111113] border border-white/10 hover:border-white/20 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <h4 className="font-display text-lg font-bold text-white tracking-tight">
                      {edu.degree}
                    </h4>
                    <span className="font-mono text-xs text-[#007BFF] bg-[#007BFF]/10 px-2.5 py-0.5 rounded border border-[#007BFF]/20 self-start sm:self-auto font-medium">
                      {edu.year}
                    </span>
                  </div>

                  {(edu.school || edu.specialization) && (
                    <div className="font-mono text-xs text-white/40">
                      {edu.school} {edu.school && edu.specialization ? '•' : ''} {edu.specialization}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Entreprises Pertinentes Video */}
          <RelevantCompaniesVideo />
        </div>
      </div>
    </section>
  );
};
