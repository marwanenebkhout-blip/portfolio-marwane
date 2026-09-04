import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

interface HeaderNavProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onOpenContact: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onNavigate,
  activeSection,
  onOpenContact,
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'hero', label: 'HOME' },
    { id: 'work', label: 'WORK' },
    { id: 'about', label: 'ABOUT' },
    { id: 'contact', label: 'CONTACT' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#080808]/90 backdrop-blur-md border-b border-white/10 py-3.5 shadow-2xl'
          : 'bg-transparent py-5 sm:py-6'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 flex items-center justify-between">
        {/* Left: MN® Logo */}
        <button
          onClick={() => {
            onNavigate('hero');
          }}
          className="group flex items-baseline gap-0.5 focus:outline-none cursor-pointer"
          aria-label="Retour à l'accueil"
        >
          <span className="font-black text-2xl tracking-tighter text-[#39FF14] drop-shadow-[0_0_12px_rgba(57,255,20,0.6)] font-sans">
            MN
          </span>
          <span className="text-[10px] font-bold text-[#39FF14] leading-none">®</span>
        </button>

        {/* Center: Desktop Navigation Bar */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-10 text-xs font-semibold tracking-wider font-mono">
          {navLinks.map((link, idx) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={`${link.label}-${idx}`}
                onClick={() => {
                  onNavigate(link.id);
                }}
                className={`transition-colors cursor-pointer relative py-1 uppercase ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-white/60 hover:text-[#39FF14]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Français / Anglais language pill */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111113] border border-white/15 text-white/90 font-mono text-xs font-medium tracking-wider select-none shadow-sm"
            title="Langues / Languages: Français / Anglais"
          >
            <Globe className="h-3.5 w-3.5 text-[#39FF14]" />
            <span>Français / Anglais</span>
          </div>
        </div>
      </div>
    </header>
  );
};

