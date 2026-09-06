import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { audio } from '../utils/audio';

export type Language = 'fr' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Nav
    'nav.home': 'ACCUEIL',
    'nav.work': 'PROJETS',
    'nav.about': 'À PROPOS',
    'nav.contact': 'CONTACT',
    'nav.langToggle': 'Français',
    'nav.langTitle': 'Langue actuelle : Français (Cliquer pour passer en Anglais)',

    // Hero
    'hero.status': 'DISPONIBLE EN FREELANCE',
    'hero.location': 'PARIS, FRANCE',
    'hero.role1': 'GRAPHIC DESIGNER',
    'hero.role2': 'ART DIRECTOR',
    'hero.role3': '3D & MOTION DESIGNER',
    'hero.bio': 'Créer du sens en donnant forme aux idées et une identité aux émotions.',
    'hero.explore': 'DÉCOUVRIR MES PROJETS',
    'hero.scroll': '— DÉFILER',

    // Works / Projects
    'projects.badge': '01 // SÉLECTION DE PROJETS & ÉTUDES DE CAS',
    'projects.title': 'Selected Works',
    'projects.prev': 'Projet précédent',
    'projects.next': 'Projet suivant',
    'projects.liveBtn': 'Voir le projet',
    'projects.exploreBtn': 'Explorer',
    'projects.roleLabel': 'DIRECTEUR ARTISTIQUE & DESIGNER',
    'projects.softwareLabel': 'LOGICIELS CLÉS',
    'projects.ctaFull': 'DÉCOUVRIR LE CAS COMPLET',

    // Project Modal
    'modal.projectFile': 'DOSSIER PROJET',
    'modal.prev': 'Projet précédent (Flèche gauche)',
    'modal.next': 'Projet suivant (Flèche droite)',
    'modal.close': 'Fermer',
    'modal.conceptTitle': 'Concept & Démarche Artistique',
    'modal.rolesTitle': 'RÔLES & EXPERTISES',
    'modal.stackTitle': 'LOGICIELS UTILISÉS',
    'modal.deliverablesTitle': 'LIVRABLES CLÉS',
    'modal.metricsTitle': 'IMPACT & PERFORMANCES',
    'modal.galleryTitle': 'GALERIE DE RENDUS',
    'modal.videoDemo': 'VIDÉO & DÉMONSTRATION INTERACTIVE',

    // About
    'about.badge': '03 // DOSSIER BIOGRAPHIQUE & COMPÉTENCES',
    'about.title': 'About me',
    'about.cvBtn': 'VOIR / TÉLÉCHARGER LE CV (PDF)',
    'about.stat1Label': "Années d'Expérience",
    'about.stat2Label': 'Digital / Print / Motion',
    'about.stat3Label': 'Pipeline intégré',
    'about.softwareTitle': 'LOGICIELS & COMPÉTENCES',
    'about.softwareSubtitle': 'Pipeline Hybride Design, 3D Temps Réel & IA Générative',
    'about.expTitle': 'Parcours Professionnel',
    'about.eduTitle': 'Formation & Diplômes',
    'about.companiesTitle': 'Entreprises Pertinentes',
    'about.replayVideo': "Cliquer pour rejouer l'animation",

    // Footer
    'footer.title': 'Connect & Links',
    'footer.subtitle': 'DIRECTION ARTISTIQUE & EXPÉRIENCES 3D',

    // CV Modal
    'cv.title': 'CURRICULUM VITAE // MARWANE NEBKHOUT',
    'cv.print': 'IMPRIMER / PDF',
    'cv.profileTitle': 'Profil Professionnel',
    'cv.experienceTitle': 'Parcours Professionnel',
    'cv.educationTitle': 'Formation & Diplômes',
    'cv.stackTitle': 'LOGICIELS & COMPÉTENCES',
    'cv.expTitle': 'Parcours Professionnel',
    'cv.eduTitle': 'Formation & Diplômes',
    'cv.skillsTitle': 'Compétences Clés',
    'cv.softwareTitle': 'LOGICIELS & COMPÉTENCES',
    'cv.languagesTitle': 'Langues',
    'cv.contactTitle': 'Informations & Contact',

    // Reel
    'reel.soundOn': 'Activer le son',
    'reel.soundOff': 'Couper le son',
  },
  en: {
    // Nav
    'nav.home': 'HOME',
    'nav.work': 'WORK',
    'nav.about': 'ABOUT',
    'nav.contact': 'CONTACT',
    'nav.langToggle': 'English',
    'nav.langTitle': 'Current language: English (Click to switch to French)',

    // Hero
    'hero.status': 'AVAILABLE FOR FREELANCE',
    'hero.location': 'PARIS, FRANCE',
    'hero.role1': 'GRAPHIC DESIGNER',
    'hero.role2': 'ART DIRECTOR',
    'hero.role3': '3D & MOTION DESIGNER',
    'hero.bio': 'Creating meaning by giving shape to ideas and an identity to emotions.',
    'hero.explore': 'EXPLORE MY WORK',
    'hero.scroll': '— SCROLL',

    // Works / Projects
    'projects.badge': '01 // SELECTED WORKS & CASE STUDIES',
    'projects.title': 'Selected Works',
    'projects.prev': 'Previous project',
    'projects.next': 'Next project',
    'projects.liveBtn': 'View project',
    'projects.exploreBtn': 'Explore',
    'projects.roleLabel': 'ART DIRECTOR & DESIGNER',
    'projects.softwareLabel': 'KEY SOFTWARE',
    'projects.ctaFull': 'EXPLORE FULL CASE STUDY',

    // Project Modal
    'modal.projectFile': 'PROJECT FILE',
    'modal.prev': 'Previous project (Left arrow)',
    'modal.next': 'Next project (Right arrow)',
    'modal.close': 'Close',
    'modal.conceptTitle': 'Concept & Artistic Approach',
    'modal.rolesTitle': 'ROLES & EXPERTISE',
    'modal.stackTitle': 'SOFTWARE USED',
    'modal.deliverablesTitle': 'KEY DELIVERABLES',
    'modal.metricsTitle': 'IMPACT & PERFORMANCE',
    'modal.galleryTitle': 'GALLERY OF RENDERS',
    'modal.videoDemo': 'VIDEO & INTERACTIVE DEMO',

    // About
    'about.badge': '03 // BIOGRAPHY & SKILLS OVERVIEW',
    'about.title': 'About me',
    'about.cvBtn': 'VIEW / DOWNLOAD CV (PDF)',
    'about.stat1Label': 'Years of Experience',
    'about.stat2Label': 'Digital / Print / Motion',
    'about.stat3Label': 'Integrated Pipeline',
    'about.softwareTitle': 'SOFTWARE & SKILLS',
    'about.softwareSubtitle': 'Hybrid Design Pipeline, Realtime 3D & Generative AI',
    'about.expTitle': 'Work Experience',
    'about.eduTitle': 'Education & Degrees',
    'about.companiesTitle': 'Key Companies',
    'about.replayVideo': 'Click to replay animation',

    // Footer
    'footer.title': 'Connect & Links',
    'footer.subtitle': 'ART DIRECTION & 3D EXPERIENCES',

    // CV Modal
    'cv.title': 'CURRICULUM VITAE // MARWANE NEBKHOUT',
    'cv.print': 'PRINT / PDF',
    'cv.profileTitle': 'Professional Profile',
    'cv.experienceTitle': 'Work Experience',
    'cv.educationTitle': 'Education & Degrees',
    'cv.stackTitle': 'SOFTWARE & SKILLS',
    'cv.expTitle': 'Work Experience',
    'cv.eduTitle': 'Education & Degrees',
    'cv.skillsTitle': 'Core Skills',
    'cv.softwareTitle': 'SOFTWARE & SKILLS',
    'cv.languagesTitle': 'Languages',
    'cv.contactTitle': 'Information & Contact',

    // Reel
    'reel.soundOn': 'Unmute audio',
    'reel.soundOff': 'Mute audio',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('site_lang');
      if (saved === 'en' || saved === 'fr') return saved;
    }
    return 'fr';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('site_lang', lang);
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
  };

  const toggleLang = () => {
    audio.playMechanicalClick();
    setLangState((prev) => (prev === 'fr' ? 'en' : 'fr'));
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations.fr[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
