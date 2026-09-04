import React, { useState } from 'react';
import { personalInfo, socialLinks } from '../data/config';
import { audio } from '../utils/audio';
import { Send, Mail, Phone, Copy, Check, Terminal, Sparkles, MessageSquare, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'ART DIRECTION',
    message: '',
  });
  const [sentStatus, setSentStatus] = useState<'IDLE' | 'TRANSMITTING' | 'SENT'>('IDLE');

  const handleCopyEmail = () => {
    audio.playMechanicalClick();
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audio.playMechanicalClick();
    setSentStatus('TRANSMITTING');

    setTimeout(() => {
      setSentStatus('SENT');
      audio.playSystemBoot();
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.7 } });

      // Automatically construct mailto link as reliable fallback
      const subject = encodeURIComponent(`[NEW PROJECT] ${formData.service} — ${formData.name}`);
      const body = encodeURIComponent(
        `Bonjour Marwane,\n\nNom: ${formData.name}\nEmail: ${formData.email}\nService: ${formData.service}\n\nMessage:\n${formData.message}`
      );
      window.location.href = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
    }, 900);
  };

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#39FF14] tracking-[0.3em] uppercase mb-2">
            <Terminal className="h-4 w-4" />
            <span>04 // DISPATCH & PRISE DE CONTACT</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter italic text-white">
            Start a Project
          </h2>
          <p className="mt-2 text-white/50 text-sm max-w-xl font-light">
            Disponible pour des missions de direction artistique, création 3D, motion design et branding à travers le monde.
          </p>
        </div>

        {/* Live Availability Signal */}
        <div className="mt-4 md:mt-0 flex items-center gap-2 font-mono text-[11px] text-[#39FF14] bg-[#111113] px-3.5 py-1.5 rounded border border-[#39FF14]/30 shadow-[0_0_12px_rgba(57,255,20,0.2)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39FF14] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39FF14]"></span>
          </span>
          <span className="font-bold uppercase tracking-wider">{personalInfo.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Contact Credentials Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-xl bg-[#111113] border border-white/10 space-y-6 shadow-2xl">
            <h3 className="font-display text-2xl font-bold tracking-tight text-white italic">
              Échangeons sur votre vision.
            </h3>
            <p className="text-white/60 text-sm leading-relaxed font-light">
              Que ce soit pour un lancement de produit, une refonte de marque globale, une expérience web 3D ou un film cinématique en motion design.
            </p>

            {/* Email Copy Card */}
            <div className="p-4 rounded bg-[#161619] border border-white/10 space-y-2">
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest block">
                CANAL EMAIL DIRECT
              </span>
              <div className="flex items-center justify-between gap-2">
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="font-mono text-xs sm:text-sm font-bold text-white hover:text-[#39FF14] truncate transition-colors"
                >
                  {personalInfo.email}
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded bg-black/60 border border-white/10 hover:border-[#39FF14] text-white/70 hover:text-[#39FF14] transition-colors shrink-0 cursor-pointer"
                  title="Copier l'adresse email"
                >
                  {copied ? <Check className="h-4 w-4 text-[#39FF14]" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              {copied && (
                <div className="font-mono text-[10px] text-[#39FF14] animate-pulse">
                  ✓ Adresse copiée dans le presse-papier !
                </div>
              )}
            </div>

            {/* Direct Phone Line */}
            <div className="p-4 rounded bg-[#161619] border border-white/10 flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest block">
                  LOCALISATION & HORAIRES
                </span>
                <span className="font-mono text-xs font-bold text-white">
                  {personalInfo.location}
                </span>
              </div>
              <a
                href={socialLinks.phone}
                className="p-2.5 rounded bg-[#39FF14] text-black font-bold hover:shadow-[0_0_15px_#39FF14] transition-all cursor-pointer"
                title="Appeler"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>

            {/* Quick Links */}
            <div className="pt-4 border-t border-white/10">
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest block mb-3">
                RÉSEAUX & GALERIES
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Instagram', url: socialLinks.instagram },
                  { name: 'LinkedIn', url: socialLinks.linkedin },
                  { name: 'Behance', url: socialLinks.behance },
                  { name: 'X', url: socialLinks.twitter },
                  { name: 'Dribbble', url: socialLinks.dribbble },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#161619] border border-white/10 font-mono text-xs text-white/70 hover:text-[#39FF14] hover:border-[#39FF14]/40 transition-all"
                  >
                    <span>{item.name}</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interactive Terminal Dispatch Form (7 Cols) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-8 rounded-xl bg-[#111113] border border-white/10 space-y-6 shadow-2xl relative overflow-hidden"
          >
            {/* Terminal Header Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase tracking-wider">
                <MessageSquare className="h-4 w-4 text-[#39FF14]" />
                <span>TERMINAL DE TRANSMISSION EN LIGNE</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500/80" />
                <span className="h-2 w-2 rounded-full bg-yellow-500/80" />
                <span className="h-2 w-2 rounded-full bg-[#39FF14]" />
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[11px] text-white/50 uppercase tracking-wider mb-2">
                  VOTRE NOM / ENTREPRISE *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Studio Aura"
                  className="w-full px-4 py-2.5 rounded bg-[#161619] border border-white/10 text-white font-mono text-xs focus:border-[#39FF14] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-white/50 uppercase tracking-wider mb-2">
                  VOTRE ADRESSE EMAIL *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@studioaura.com"
                  className="w-full px-4 py-2.5 rounded bg-[#161619] border border-white/10 text-white font-mono text-xs focus:border-[#39FF14] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Service Type Radio / Selector */}
            <div>
              <label className="block font-mono text-[11px] text-white/50 uppercase tracking-wider mb-2">
                TYPE DE PROJET OU PRESTATION
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'DIRECTION ARTISTIQUE',
                  'MODÉLISATION 3D',
                  'MOTION DESIGN',
                  'BRANDING & TYPE',
                  'WEB & INTERACTIVE',
                  'AUTRE MISSION',
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      audio.playKeyHover();
                      setFormData({ ...formData, service: s });
                    }}
                    className={`px-3 py-2 rounded font-mono text-[11px] uppercase tracking-wider font-semibold text-center border transition-all cursor-pointer ${
                      formData.service === s
                        ? 'bg-[#39FF14] text-black border-[#39FF14] shadow-[0_0_12px_rgba(57,255,20,0.4)] font-bold'
                        : 'bg-[#161619] text-white/50 border-white/10 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Area */}
            <div>
              <label className="block font-mono text-[11px] text-white/50 uppercase tracking-wider mb-2">
                DÉTAILS DU PROJET / BRIEFING *
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Décrivez vos objectifs, calendrier envisagé, budget ou références visuelles..."
                className="w-full px-4 py-2.5 rounded bg-[#161619] border border-white/10 text-white font-mono text-xs focus:border-[#39FF14] focus:outline-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={sentStatus === 'TRANSMITTING'}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded bg-[#39FF14] text-black font-mono text-xs font-black tracking-widest uppercase hover:shadow-[0_0_25px_rgba(57,255,20,0.6)] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>
                {sentStatus === 'TRANSMITTING'
                  ? 'TRANSMISSION EN COURS...'
                  : sentStatus === 'SENT'
                  ? 'MESSAGE TRANSMIS AVEC SUCCÈS ✓'
                  : 'ENVOYER LA TRANSMISSION'}
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
