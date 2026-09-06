import { Project } from '../types';
import sweepnAppVideo from '../assets/images/VIDEO-APP.mp4';
import sweepn01Cover from '../assets/images/sweepn_slide_01_cover.png';
import sweepn02Context from '../assets/images/sweepn_slide_02_context.png';
import sweepn03WhatIs from '../assets/images/sweepn_slide_03_whatis.png';
import sweepn04HowWorks from '../assets/images/sweepn_slide_04_howworks.png';
import sweepn05Game from '../assets/images/sweepn_slide_05_game.png';
import sweepn06Sellers from '../assets/images/sweepn_slide_06_sellers.png';
import sweepn07Buyers from '../assets/images/sweepn_slide_07_buyers.png';
import sweepn08Validation from '../assets/images/sweepn_slide_08_validation.png';
import sweepn09BusinessModel from '../assets/images/sweepn_slide_09_businessmodel.png';
import sweepn10Communication from '../assets/images/sweepn_slide_10_communication.png';
import anthem01Cover from '../assets/images/IMG_7658.jpeg';
import anthem02Portrait from '../assets/images/IMG_7657.jpeg';
import anthem03Collection from '../assets/images/IMG_7656.jpeg';
import recylingVideo from '../assets/images/recyling_video.mp4';
import recyling01Billboard from '../assets/images/IMG_7474.jpeg';
import recyling02AppUI from '../assets/images/IMG_7472.jpeg';
import recyling03Blender3D from '../assets/images/IMG_7484.jpeg';
import recyling04Logo from '../assets/images/IMG_7476.jpeg';
import recyling05Declinaisons from '../assets/images/IMG_7475.jpeg';
import recyling06MetroAd from '../assets/images/IMG_7477.jpeg';
import recyling07SubwayAd from '../assets/images/IMG_7478.jpeg';
import recyling08StreetAd from '../assets/images/IMG_7483.jpeg';
import recyling09iMacHome from '../assets/images/IMG_7479.jpeg';
import recyling10iMacStats from '../assets/images/IMG_7481.jpeg';
import recyling11LaptopStep from '../assets/images/IMG_7482.jpeg';
import recyling12AppHands from '../assets/images/IMG_7485.jpeg';
import ikeaTarnoVideo from '../assets/images/TARNO VT5.mp4';
import ikeaRaskogVideo from '../assets/images/VERSION 2.mp4';
import ikeaKitchenVideo from '../assets/images/TEST VIDEO V6.mp4';
import ikeaBienvenueVideo from '../assets/images/VIDEO BIENVENUE V2-1.mp4';
import ikeaKjugeVideo from '../assets/images/KJUGE-1.mp4';
import lsc01CrechAndDo from '../assets/images/IMG_7664.jpeg';
import lsc02BeautySkin from '../assets/images/IMG_7665.jpeg';
import lsc03AssuEuro from '../assets/images/IMG_7660.jpeg';
import lsc04Dermessence from '../assets/images/IMG_7663.jpeg';
import lsc05Ecodorat from '../assets/images/IMG_7661.jpeg';
import lsc06CroquettesLib from '../assets/images/IMG_7666.jpeg';
import veepee01Moodboard from '../assets/images/IMG_7667.jpeg';
import veepee02TechTalks from '../assets/images/IMG_7670.jpeg';
import veepee03HotNews from '../assets/images/IMG_7671.jpeg';
import veepee04GoodImpact from '../assets/images/IMG_7668.jpeg';
import veepee05LogTeam from '../assets/images/IMG_7669.jpeg';
import logoGodIsGreat from '../assets/images/C9AB49AC-F7F5-4A33-81E5-EDFFB63786AE.png';
import logoPacifico from '../assets/images/0FBEA023-EE96-4B97-835A-B326952AD13B.png';
import logoCompass from '../assets/images/32674766-89A7-476C-96D9-893336313341.png';
import logoVeepeePrivacyMerch from '../assets/images/DFFAE623-57BF-439E-A586-AEB95A5AD7AD.jpg';
import logoVeepeePrivacyGoodies from '../assets/images/IMG_7774.jpeg';
import logoNebine from '../assets/images/C32294FC-094F-4CA3-A89F-47674C70EF13.png';
import logoAgServices from '../assets/images/670ACAAB-88B5-43EB-A044-0FF2624A4CC2.png';
import logoMrBatiment from '../assets/images/BF0F00EB-51D1-40BD-B7E3-6E24D024BFB9.png';
import logoGoEcolo from '../assets/images/03A9F8C6-CC3D-4E1C-92F6-09266286BC11.png';
import neben01Concept from '../assets/images/017CC932-3303-4C48-A714-312C98495EC8-1.jpg';
import neben02LeatherJacket from '../assets/images/IMG_9946-V2.png';
import neben03Lineup from '../assets/images/C701A2FF-E73F-47B5-A3FD-F603B64CE169.png';
import neben04TextureGreen from '../assets/images/Virtualthreads_13.png';
import neben05ChenillePatch from '../assets/images/84613D24-6F6D-4F42-9E47-71E91894DE39.png';
import neben06Perspective from '../assets/images/049BBDA6-569D-4C03-8017-0F7A59D102E6.png';
import neben07VintageTaxi from '../assets/images/Virtualthreads_17.png';
import neben08RegardOriental from '../assets/images/529F40D8-7C51-4416-A29E-70AC11D0D2B0.png';
import neben09PackagingCap from '../assets/images/36D19EBD-0F28-410E-A269-8F8039509574.jpg';
import neben10BadgeYellow from '../assets/images/Virtualthreads_15.png';
import neben11BadgePink from '../assets/images/Virtualthreads_3.png';
import neben12PatchGreyTee from '../assets/images/F63C7C89-EC9D-4AAD-915E-3DD19AA3D313.png';
import neben13BlackTeeStore from '../assets/images/Untitled_Project_2.jpg';
import neben14EmbroideryZoom from '../assets/images/Untitled_Project_1.jpg';

const assetImageModules = import.meta.glob<string>('../assets/images/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG}', { eager: true, import: 'default' });

export function resolveImageByQuery(queries: string | string[], fallback: string = ''): string {
  const queryList = Array.isArray(queries) ? queries : [queries];
  for (const q of queryList) {
    const match = Object.entries(assetImageModules).find(([k]) =>
      k.toLowerCase().includes(q.toLowerCase())
    );
    if (match) return match[1];
  }
  return fallback;
}

export const projects: Project[] = [
  {
    id: 'sweepn-app',
    slug: 'sweepn-app',
    title: "Sweep'n",
    subtitle: "L'application E-commerce Divertissante & Jeu d'Adresse",
    client: "Sweep'n",
    year: '2024 - 2025',
    category: 'BRANDING',
    tags: ['Direction Artistique', 'Branding', 'UI/UX Design', 'New App', 'E-commerce'],
    summary: "Conception globale de l’application Sweep’n : direction artistique, identité de marque, design d’interface mobile et gamification innovante de la vente d’occasion.",
    description: "Sweep'n réinvente le marché de la seconde main en associant e-commerce et divertissement. Face aux conflits et à la braderie des prix entre particuliers, Sweep'n propose un système innovant : les vendeurs fixent leur prix sans négociation abusive et les acheteurs participent via un jeu d'adresse au chrono (suite logique 0 à 100). Direction artistique complète, création de la marque, ergonomie des flux acheteurs/vendeurs, système de sécurisation par code unique et business model.",
    heroImage: sweepn01Cover,
    secondaryImage: sweepn05Game,
    accentColor: '#2563eb',
    gradient: 'from-[#2563eb]/25 via-[#ef4444]/10 to-transparent',
    role: ['Co-fondateur & CEO', 'Direction Artistique', 'Branding & Identité Visuelle', 'UI/UX Design Mobile'],
    tools: ['Figma', 'Illustrator', 'Photoshop', 'After Effects', 'Design System'],
    metrics: [
      { label: 'Marché Cible', value: '14 Mds€ Seconde Main' },
      { label: 'Mécanique', value: 'Jeu d’adresse 0-100' },
      { label: 'Partenaires & Soutiens', value: 'Qonto, Legalstart, Railway...' }
    ],
    deliverables: [
      'Direction artistique globale & identité visuelle complète de Sweep’n',
      'Design UI/UX complet de l’application mobile (Home, Catégories, Jeu Chrono, Profil, Wallet)',
      'Système de gamification du Chrono et monnaie d’échange "Sweep" (1€ = 1 Sweep)',
      'Parcours de sécurisation : Code unique, validation de l’échange et déblocage des fonds',
      'Deck de présentation investisseurs, supports promotionnels et site web vitrine'
    ],
    videoUrl: sweepnAppVideo,
    videoCaption: "Démonstration animée de l'application Sweep'n — Défilement des annonces & mécanique de jeu",
    gallery: [
      {
        type: 'image',
        url: sweepn01Cover,
        caption: "Slide 01 // Couverture : Sweep'n — L'application e-commerce divertissante."
      },
      {
        type: 'image',
        url: sweepn02Context,
        caption: "Slide 02 // Contexte : Marché de l'occasion (+20%), conflits acheteurs/vendeurs, inflation et économie."
      },
      {
        type: 'image',
        url: sweepn03WhatIs,
        caption: "Slide 03 // Sweep'n c'est quoi ? Vendre ses biens, acheter des Sweep et jouer au chrono."
      },
      {
        type: 'image',
        url: sweepn04HowWorks,
        caption: "Slide 04 // Comment ça fonctionne ? Échanger ses euros (1€ = 1 Sweep), jouer au chrono (0 à 100) et débloquer les fonds."
      },
      {
        type: 'image',
        url: sweepn05Game,
        caption: "Slide 05 // Un jeu d'adresse ? Stopper le chrono, se rapprocher de 100 et remporter le bien."
      },
      {
        type: 'image',
        url: sweepn06Sellers,
        caption: "Slide 06 // Vendeurs : quels sont leurs rôles ? Déposer des annonces, fixer les prix en Sweep, valider et récupérer les fonds."
      },
      {
        type: 'image',
        url: sweepn07Buyers,
        caption: "Slide 07 // Acheteurs : quels sont leurs rôles ? Acheter des Sweep, participer, jouer au chrono et valider l'échange."
      },
      {
        type: 'image',
        url: sweepn08Validation,
        caption: "Slide 08 // Comment valider l'échange ? Communication directe, fixer un rendez-vous et code unique."
      },
      {
        type: 'image',
        url: sweepn09BusinessModel,
        caption: "Slide 09 // Business Model : Commission sur les Sweep, boosters d'annonces et assurance des biens."
      },
      {
        type: 'image',
        url: sweepn10Communication,
        caption: "Slide 10 // Notre communication : Site internet promotionnel Sweepn.fr et réseaux sociaux @sweepn.app."
      }
    ],
    interactive3DType: 'cube',
    featured: true
  },
  {
    id: 'cyber-monolith',
    slug: 'anthem-joaillerie',
    title: 'Anthem Joaillerie',
    subtitle: 'Livre de Marque & Édition Haute Joaillerie',
    client: 'Anthem Joaillerie',
    year: '2024 - 2025',
    category: 'BRANDING',
    tags: ['Direction Artistique', 'Édition Luxe', 'Brand Book', 'Haute Joaillerie', 'Branding'],
    summary: 'Direction artistique, identité de marque et conception du livre d’édition haute joaillerie pour la maison Anthem.',
    description: 'Conception de l’univers graphique et de l’identité éditoriale de la maison de haute joaillerie Anthem fondée par Aïssata Dia. Création du brand book complet, mise en page éditoriale raffinée, direction photographique et mise en valeur des collections joaillières en or 18 carats et diamants certifiés.',
    heroImage: anthem01Cover,
    secondaryImage: anthem02Portrait,
    accentColor: '#c88a58',
    gradient: 'from-[#c88a58]/25 via-[#9c4d32]/10 to-transparent',
    role: ['Direction Artistique', 'Design Éditorial & Graphisme', 'Brand Identity', 'Mise en page'],
    tools: ['InDesign', 'Photoshop', 'Illustrator', 'Direction Photo'],
    metrics: [
      { label: 'Format', value: 'Brand Book & Catalogue' },
      { label: 'Matériaux', value: 'Or 18K & Diamants' },
      { label: 'Secteur', value: 'Haute Joaillerie' }
    ],
    deliverables: [
      'Direction artistique globale et charte graphique de la maison Anthem',
      'Conception et mise en page du livre de marque et catalogue de présentation',
      'Storytelling et portrait de la fondatrice Aïssata Dia (Miss Côte d’Ivoire & influenceuse)',
      'Direction photographique des pièces de haute joaillerie (Collection Love Tie)',
      'Guide typographique, palette de teintes terre de Sienne & finitions d’impression or'
    ],
    gallery: [
      {
        type: 'image',
        url: anthem01Cover,
        caption: "Slide 01 // Anthem Joaillerie : « Une pierre précieuse apportée à l'édifice du monde joaillier » & Couverture officielle."
      },
      {
        type: 'image',
        url: anthem02Portrait,
        caption: "Slide 02 // Aïssata Dia : Portrait brut aux multiples facettes (Fondatrice, parcours & vision joaillière)."
      },
      {
        type: 'image',
        url: anthem03Collection,
        caption: "Slide 03 // Nos collections : Love Tie « Taillé pour s'engager » & Pièces en or 18 carats et diamants."
      },
      {
        type: 'image',
        url: resolveImageByQuery(['5276B917', '43314EF6', 'anthem_editorial', 'lovetie'], anthem01Cover),
        caption: "Slide 04 // ANTHEM JOAILLERIE : Catalogue Éditorial & Lookbook — Collection LoveTie, bracelets d'exception or jaune, or rose et or blanc sertis de diamants, porté duo & site officiel."
      },
      {
        type: 'image',
        url: resolveImageByQuery(['B01C5564', 'anthem_arm_quote', 'secrets'], anthem02Portrait),
        caption: "Slide 05 // ANTHEM JOAILLERIE : Livre d'Édition Noir & Blanc — « Certains secrets sont faits pour être vus. », bracelet pavé étincelant au poignet & filigrane du monogramme royal A."
      },
      {
        type: 'image',
        url: resolveImageByQuery(['04C675D6', 'anthem_couple_ring', 'couple'], anthem03Collection),
        caption: "Slide 06 // ANTHEM JOAILLERIE : Édition Prestige Cuir & Or — « Certains secrets sont faits pour être vus. », gros plan intime du couple, bague signature en or & tranche en cuir bordeaux gaufré or."
      }
    ].filter((slide): slide is { type: 'image' | 'video'; url: string; caption: string } => Boolean(slide.url)),
    interactive3DType: 'cube',
    featured: true
  },
  {
    id: 'recyling-nespresso',
    slug: 'recyling-nespresso',
    title: 'Recyling // Nespresso',
    subtitle: 'Campagne 360°, Rendu 3D & Application Mobile Éco-responsable',
    client: 'Recyling // Nespresso',
    year: '2024 - 2025',
    category: '3D',
    tags: ['Direction Artistique', 'Modélisation 3D', 'UI/UX Design', 'Branding', 'Campagne Pub'],
    summary: 'Conception de l’identité visuelle, campagne d’affichage immersive « On vous invite à boire Plus loin », design d’application mobile et modélisation 3D sous Blender pour la valorisation et le recyclage des dosettes de café.',
    description: 'Projet d’envergure combinant direction artistique, branding engagé, modélisation 3D sous Blender et expérience utilisateur mobile. L’initiative Recyling sensibilise à l’impact environnemental des 500 millions de dosettes consommées par an en gamifiant la collecte via 5 000 points relais. Le dispositif comprend la création du logotype organique, des déclinaisons matières (grains de café, feuillages), la modélisation 3D complète de la machine et des capsules sous Blender, ainsi qu’une campagne publicitaire urbaine percutante avec QR code immersif.',
    heroImage: recyling01Billboard,
    secondaryImage: recyling02AppUI,
    videoUrl: recylingVideo,
    accentColor: '#8a7343',
    gradient: 'from-[#8a7343]/25 via-[#233827]/10 to-transparent',
    role: ['Direction Artistique', 'Modélisation 3D & Shading (Blender)', 'UI/UX Design Mobile & Web', 'Branding & Campagne 360°'],
    tools: ['Blender', 'Photoshop', 'Illustrator', 'Figma', 'InDesign'],
    metrics: [
      { label: 'Impact Annuel', value: '500M Dosettes' },
      { label: 'Réseau Collecte', value: '5 000 Points Relais' },
      { label: 'Dispositif', value: 'Campagne 360° & 3D' }
    ],
    deliverables: [
      'Logotype Recyling organique, typographie calligraphique signature et déclinaisons chromatiques',
      'Modélisation 3D intégrale et shaders procéduraux sous Blender (machine à café, tasse, capsules, gouttelette)',
      'Campagne d’affichage urbaine, grand format et réseau métropolitain : « On vous invite à boire Plus loin »',
      'Conception UI/UX de l’application mobile (roue de sélection des capsules, gestion de compte, scan QR code)',
      'Conception de l’interface web responsive (landing page, statistiques d’impact et paliers de récompense)'
    ],
    gallery: [
      {
        type: 'image',
        url: recyling01Billboard,
        caption: "Slide 01 // Campagne d'affichage Grand Format Urbain : « On vous invite à boire Plus loin » (Nespresso x Recyling)."
      },
      {
        type: 'image',
        url: recyling02AppUI,
        caption: "Slide 02 // Conception UI/UX Mobile : Roue interactive de sélection des capsules, compte utilisateur & univers végétal."
      },
      {
        type: 'image',
        url: recyling03Blender3D,
        caption: "Slide 03 // Modélisation 3D sous Blender : Wireframes, shaders procéduraux, modélisation de la machine, tasse et capsules."
      },
      {
        type: 'image',
        url: recyling04Logo,
        caption: "Slide 04 // Logotype Recyling : Identité visuelle, typographie calligraphique et badges chromatiques (vert, or, noir, brun)."
      },
      {
        type: 'image',
        url: recyling05Declinaisons,
        caption: "Slide 05 // Déclinaisons de marque : Intégration sur fonds matières (grains de café torréfiés, feuillage et fond minéral)."
      },
      {
        type: 'image',
        url: recyling06MetroAd,
        caption: "Slide 06 // Affichage réseau métropolitain : Mockup station de métro avec QR Code interactif et visuel immersif jumelles café."
      },
      {
        type: 'image',
        url: recyling07SubwayAd,
        caption: "Slide 07 // Affichage couloir & passerelle : Dispositif rétro-éclairé haute visibilité pour flux piétons."
      },
      {
        type: 'image',
        url: recyling08StreetAd,
        caption: "Slide 08 // Affichage mobilier urbain : Panneau rétroéclairé en extérieur invitant au recyclage responsable."
      },
      {
        type: 'image',
        url: recyling09iMacHome,
        caption: "Slide 09 // Interface Web Vitrine iMac : « L'application Qu'il faut » — Accueil de la plateforme éco-responsable."
      },
      {
        type: 'image',
        url: recyling10iMacStats,
        caption: "Slide 10 // Statistiques d'impact clé : « En quelques Chiffres » (500M dosettes consommées / 5 000 points de collecte)."
      },
      {
        type: 'image',
        url: recyling11LaptopStep,
        caption: "Slide 11 // Parcours utilisateur & Gamification : « Étape 4 : Je récolte » (Paliers de récompenses et cadeaux éco-responsables)."
      },
      {
        type: 'image',
        url: recyling12AppHands,
        caption: "Slide 12 // Expérience Mobile en situation : Application en main, sélection dynamique de capsules Lungo et parcours « Boire Plus loin »."
      }
    ],
    interactive3DType: 'torus',
    featured: true
  },
  {
    id: 'ikea-motion-showcase',
    slug: 'ikea-motion-showcase',
    title: 'Ikea // Product Motion',
    subtitle: 'Vidéos de Présentation Produits & Animation Motion 3D',
    client: 'IKEA',
    year: '2024 - 2025',
    category: 'MOTION DESIGN',
    tags: ['Motion Design', 'Animation 3D', 'Direction Artistique', 'Spot Produit', 'Social Media'],
    summary: 'Série de capsules vidéos et animations motion design dynamiques pour la présentation des produits iconiques IKEA (TÄRNÖ, RÅSKOG, KJUGE & Cuisine Durable).',
    description: 'Conception et réalisation d’animations motion design rythmées et percutantes pour la mise en valeur des produits phares IKEA. Unboxing dynamique, mise en avant des fonctionnalités, transitions typographiques soignées et respect strict des codes de la marque suédoise.',
    heroImage: ikeaTarnoVideo,
    secondaryImage: ikeaRaskogVideo,
    secondaryBottomImage: ikeaKitchenVideo,
    videoUrl: ikeaTarnoVideo,
    accentColor: '#0058a3',
    gradient: 'from-[#0058a3]/25 via-[#ffcc00]/10 to-transparent',
    role: ['Motion Design 2D/3D', 'Direction Artistique', 'Animation Typographique', 'Montage & Sound Sync'],
    tools: ['After Effects', 'Premiere Pro', 'Blender', 'Illustrator', 'Photoshop'],
    metrics: [
      { label: 'Format', value: 'Reels & Stories 9:16' },
      { label: 'Produits Phares', value: 'TÄRNÖ, RÅSKOG, KJUGE' },
      { label: 'Type de Contenu', value: 'Social Ads & In-Store' }
    ],
    deliverables: [
      'Vidéo Bienvenue IKEA Paris Nord 2 : Animation typographique cinétique et identité de marque',
      'Vidéo TÄRNÖ : Animation dynamique d’unboxing et assemblage du tabouret pliant',
      'Vidéo RÅSKOG : Présentation de la desserte à roulettes et déclinaisons de coloris',
      'Vidéo KJUGE : Animation 3D et démonstration du pouf pliable avec coffre de rangement',
      'Vidéo Cuisine Durable & Optimisée : Bocaux KOKEN, poubelles FARMARKVAST et DAMMÄNG'
    ],
    gallery: [
      {
        type: 'video',
        url: ikeaBienvenueVideo,
        caption: "Vidéo 01 // IKEA PARIS NORD 2 : « Bienvenue » — Animation typographique cinétique & identité de marque suédoise."
      },
      {
        type: 'video',
        url: ikeaTarnoVideo,
        caption: "Vidéo 02 // IKEA TÄRNÖ : « Notre prix le plus bas » — Animation d'ouverture de boîte et déploiement du tabouret."
      },
      {
        type: 'video',
        url: ikeaRaskogVideo,
        caption: "Vidéo 03 // IKEA RÅSKOG : « Prix baissé » — Démonstration de la desserte mobile et palette de couleurs."
      },
      {
        type: 'video',
        url: ikeaKjugeVideo,
        caption: "Vidéo 04 // IKEA KJUGE : « Notre prix le plus bas » — Animation 3D du pouf pliable avec espace de rangement intégré."
      },
      {
        type: 'video',
        url: ikeaKitchenVideo,
        caption: "Vidéo 05 // IKEA Cuisine Durable : Bocaux KOKEN, tri sélectif FARMARKVAST et DAMMÄNG."
      }
    ],
    interactive3DType: 'cylinder',
    featured: true
  },
  {
    id: 'la-strategie-creative-web',
    slug: 'la-strategie-creative',
    title: 'La Stratégie Créative',
    subtitle: 'Direction Artistique Web & Conception de Sites Internet',
    client: 'La Stratégie Créative',
    year: '2023 - 2024',
    category: 'DIGITAL',
    tags: ['Direction Artistique', 'Web Design', 'UI/UX Design', 'Sites Vitrines', 'E-commerce', 'Responsive'],
    summary: 'Conception de sites internet sur-mesure (vitrines & e-commerce) et accompagnement en direction artistique au sein de l’agence de communication 360° La Stratégie Créative.',
    description: 'Au sein de l’agence de communication globale La Stratégie Créative, accompagnement stratégique et graphique d’un portefeuille diversifié d’entreprises et marques. Définition de l’identité numérique, direction artistique web et conception d’interfaces UI/UX responsives (desktop 27", laptop, tablette et smartphone). Réalisation de plateformes e-commerce spécialisées (Beauty Skin Tattoo, Croquettes lib\'), de sites vitrines sectoriels et B2B (Créch & Do, Assu Euro, Ecodorat) et d’univers de soins et bien-être haut de gamme (Dermessence). Maquettage ergonomique centré sur la clarté de l\'information et l\'optimisation de la conversion.',
    heroImage: lsc02BeautySkin,
    secondaryImage: lsc04Dermessence,
    secondaryBottomImage: lsc01CrechAndDo,
    accentColor: '#8b5cf6',
    gradient: 'from-[#8b5cf6]/25 via-[#ec4899]/10 to-transparent',
    role: ['Direction Artistique Web', 'UI/UX Design Multi-device', 'Design System & Maquettage', 'Accompagnement Client & Agence 360°'],
    tools: ['Figma', 'Photoshop', 'Illustrator', 'WordPress / WooCommerce', 'Shopify', 'Design System'],
    metrics: [
      { label: 'Projets Déployés', value: '6+ Sites Web' },
      { label: 'Typologies', value: 'E-commerce & Vitrines B2B/B2C' },
      { label: 'Format', value: '100% Responsive Multi-Device' }
    ],
    deliverables: [
      'Direction artistique web & chartes graphiques digitales personnalisées',
      'Conception UI/UX multi-écrans (Desktop 27", MacBook, iPad & iPhone)',
      'Design de boutiques e-commerce (Beauty Skin Tattoo, Croquettes lib\')',
      'Conception de sites vitrines sectoriels (Créch & Do, Assu Euro, Dermessence, Ecodorat)',
      'Optimisation des parcours utilisateurs, formulaires de devis et tunnels d’achat'
    ],
    gallery: [
      {
        type: 'image',
        url: lsc01CrechAndDo,
        caption: "Slide 01 // CRÉCH & DO : « Construisez votre avenir et celui des enfants » — Site vitrine et accompagnement à la création de micro-crèches."
      },
      {
        type: 'image',
        url: lsc02BeautySkin,
        caption: "Slide 02 // BEAUTY SKIN TATTOO : Déclinaisons multi-écrans du site e-commerce & catalogue de prestations (Tatouage, piercing, bijoux et esthétique)."
      },
      {
        type: 'image',
        url: lsc03AssuEuro,
        caption: "Slide 03 // ASSU EURO : « Votre courtier de proximité » — Interface responsive et ergonomique pour assurances particuliers, professionnels & entreprises."
      },
      {
        type: 'image',
        url: lsc04Dermessence,
        caption: "Slide 04 // DERMESSENCE : « Bien plus qu'un institut de beauté » — Écosystème digital pour institut de spa, soins médicalisés et bons cadeaux."
      },
      {
        type: 'image',
        url: lsc05Ecodorat,
        caption: "Slide 05 // ECODORAT : « Pump & Jakta, un flair à toute épreuve » — Site vitrine pour la détection canine naturelle des punaises de lit."
      },
      {
        type: 'image',
        url: lsc06CroquettesLib,
        caption: "Slide 06 // CROQUETTES LIB' : Boutique en ligne conviviale et ergonomique pour l'alimentation de qualité chiens et chats."
      }
    ],
    interactive3DType: 'crystal',
    featured: true
  },
  {
    id: 'veepee-food-3d',
    slug: 'veepee',
    title: 'Veepee',
    subtitle: 'Direction Artistique, Food Art 3D & Communication Interne',
    client: 'Veepee',
    year: '2023 - 2024',
    category: 'ART DIRECTION',
    tags: ['Direction Artistique', '3D / CGI', 'Food Styling', 'Communication Interne', 'Typographie 3D', 'Branding'],
    summary: 'Direction artistique pop et surréaliste combinant food styling et typographie 3D volumique pour dynamiser la communication interne et événementielle de Veepee.',
    description: 'Conception d’un univers visuel pop, décalé et percutant au sein de Veepee. Exploration d’une direction artistique audacieuse mêlant lettrages 3D extrudés en perspective et détournements culinaires surréalistes : clavier d’ordinateur en tablette de chocolat blanc pour les « Tech Talks », gazette d’actualités servie dans un pain à hot-dog serti de perles pour les « Hot News », barquette de frites revisitée en légumes croquants pour les initiatives RSE « Good Impact », et pyramide de churros pour célébrer la « Log Team ». Élaboration d’un univers chromatique vibrant et d’un éclairage studio léché valorisant la culture d’entreprise avec humour et élégance.',
    heroImage: veepee01Moodboard,
    secondaryImage: veepee02TechTalks,
    secondaryBottomImage: veepee03HotNews,
    accentColor: '#ec008c',
    gradient: 'from-[#ec008c]/25 via-[#f43f5e]/10 to-transparent',
    role: ['Direction Artistique', 'Concept & Moodboarding', '3D & Food Styling', 'Typographie Volumique', 'Communication Interne'],
    tools: ['Cinema 4D', 'Blender', 'Photoshop', 'Illustrator', 'Octane / Redshift'],
    metrics: [
      { label: 'Pôles Ciblés', value: 'Tech, Logistique, RSE & Com' },
      { label: 'Direction Artistique', value: 'Food Art 3D & Typo Pop' },
      { label: 'Impact Culture', value: 'Identité Interne & Events' }
    ],
    deliverables: [
      'Direction artistique globale & moodboard d’inspirations culinaires et pop',
      'Visuel 3D « Tech Talks » : Clavier d\'ordinateur sculpté en chocolat blanc et papier d\'argent',
      'Visuel 3D « Hot News » : Pain hot-dog garni de presse roulée et perles nacrées',
      'Visuel 3D « Good Impact » : Frites saines de légumes frais (carottes et céleri) et typo extrudée',
      'Visuel 3D « Log Team » : Tour de churros gourmands sur mur typographique pour la supply chain',
      'Déclinaisons pour newsletters internes, intranet, affichage siège et écrans événementiels'
    ],
    gallery: [
      {
        type: 'image',
        url: veepee01Moodboard,
        caption: "Slide 01 // MOODBOARD & DIRECTION ARTISTIQUE : Recherches typographiques, univers pop art, food styling et compositions 3D volumiques."
      },
      {
        type: 'image',
        url: veepee02TechTalks,
        caption: "Slide 02 // TECH TALKS : Événements tech et conférences internes — Clavier d’ordinateur en tablette de chocolat blanc déballée sur lit typographique 3D rose bonbon."
      },
      {
        type: 'image',
        url: veepee03HotNews,
        caption: "Slide 03 // HOT NEWS : Actualités & gazette interne décalée — Hot-dog surréaliste garni de presse roulée et perles nacrées sur fond vert menthe."
      },
      {
        type: 'image',
        url: veepee04GoodImpact,
        caption: "Slide 04 // GOOD IMPACT : Démarche RSE & alimentation durable — Barquette de frites revisitée en légumes croquants sur lettrage 3D bleu électrique."
      },
      {
        type: 'image',
        url: veepee05LogTeam,
        caption: "Slide 05 // LOG TEAM : Hommage aux équipes logistiques et supply chain — Pyramide de churros dorés sur mur typographique extrudé orange vif."
      }
    ],
    interactive3DType: 'torus',
    featured: true
  },
  {
    id: 'logofolio-brand-identity',
    slug: 'logofolio',
    title: 'Logofolio',
    subtitle: 'Sélection de Logotypes, Emblèmes & Identités Visuelles',
    client: 'Multi-marques & Entreprises',
    year: '2023 - 2025',
    category: 'BRANDING',
    tags: ['Branding', 'Logotypes', 'Direction Artistique', 'Identité Visuelle', 'Typographie', 'Packaging'],
    summary: 'Sélection d’identités visuelles, logotypes et chartes graphiques conçus sur-mesure pour divers secteurs : corporate, luxe, streetwear, tech, gastronomie et architecture.',
    description: 'Conception stratégique et graphique de logotypes originaux et déclinaisons de marque sur-mesure : Veepee (Compass, Privacy), Pacifico (bières artisanales & tapas), God is Great (label de mode streetwear & univers musical), Neben 1999 (streetwear haut de gamme & calligraphie moderne), AG Services (cabinet d’architecture & maîtrise d’œuvre), M-R Bâtiment (secteur BTP & construction), Go Ecolo (gamme écoresponsable). Chaque identité s’appuie sur un travail typographique soigné, une symbolique percutante et des applications concrètes multi-supports (merchandising, packaging, papeterie, enseignes et interfaces digitales).',
    heroImage: logoGodIsGreat,
    secondaryImage: logoPacifico,
    secondaryBottomImage: logoCompass,
    accentColor: '#39FF14',
    gradient: 'from-[#39FF14]/20 via-[#007BFF]/10 to-transparent',
    role: ['Direction Artistique', 'Création de Logotypes & Emblèmes', 'Charte Graphique & Brand Identity', 'Design Packaging & Merchandising', 'Déclinaisons Multi-Supports'],
    tools: ['Illustrator', 'Photoshop', 'InDesign'],
    metrics: [
      { label: 'Logotypes Conçus', value: '25+ Identités' },
      { label: 'Secteurs Clés', value: 'Tech, Mode, BTP & Food' },
      { label: 'Déclinaisons', value: '360° Print, Pack & Web' }
    ],
    deliverables: [
      'Création de logotypes vectoriels originaux, monogrammes et typographies sur-mesure',
      'Développement de chartes graphiques complètes (couleurs, typographies, règles d’usage)',
      'Conception de packagings événementiels, boîtes d’expédition et étiquettes produits',
      'Merchandising textile : t-shirts, hoodies brodés, casquettes et tote bags',
      'Papeterie d’entreprise, cartes de visite de prestige, badges et signalétique de chantier',
      'Déclinaisons pour interfaces numériques, applications mobiles et réseaux sociaux'
    ],
    gallery: [
      {
        type: 'image',
        url: logoGodIsGreat,
        caption: "Slide 01 // GOD IS GREAT : Identité visuelle & univers streetwear — Déclinaisons textile, casquette brodée, packaging album & merchandising."
      },
      {
        type: 'image',
        url: logoPacifico,
        caption: "Slide 02 // PACIFICO : Bières & Tapas — Création de logotype rétro et charte graphique vintage, étiquettes de bouteilles, sous-bocks & cartes menu en bois."
      },
      {
        type: 'image',
        url: logoCompass,
        caption: "Slide 03 // COMPASS BY VEEPEE : Logotype & identité du pôle logistique — Packaging cartons d'expédition, application mobile de suivi & univers de marque interne."
      },
      {
        type: 'image',
        url: logoVeepeePrivacyMerch,
        caption: "Slide 04 // VEEPEE PRIVACY : Identité 3D & merchandising interne — Logotype volumique, tote bag coton, packaging événementiel & t-shirt corporate."
      },
      {
        type: 'image',
        url: logoVeepeePrivacyGoodies,
        caption: "Slide 05 // VEEPEE PRIVACY : Goodies & sécurité des données — Déclinaisons papeterie, stickers MacBook, gourde siglée et badge d'accès sécurisé."
      },
      {
        type: 'image',
        url: logoNebine,
        caption: "Slide 06 // NEBEN 1999 : Marque de mode & streetwear — Logotype calligraphique moderne, sweat à capuche premium, packaging boîte & tote bag."
      },
      {
        type: 'image',
        url: logoAgServices,
        caption: "Slide 07 // AG SERVICES : Cabinet d'architecture & maîtrise d'œuvre — Logotype géométrique minimaliste, papeterie haut de gamme & cartes de visite dorées sur tranche."
      },
      {
        type: 'image',
        url: logoMrBatiment,
        caption: "Slide 08 // M-R BÂTIMENT : Entreprise générale de bâtiment — Identité de marque corporate, casque de chantier siglé, carnet de suivi & papeterie professionnelle."
      },
      {
        type: 'image',
        url: logoGoEcolo,
        caption: "Slide 09 // GO ECOLO : Marque éco-responsable — Bouteilles de verre consignées, étiquettes végétales épurées & communication durable."
      },
      {
        type: 'image',
        url: resolveImageByQuery(['66C8718A', 'gue', 'tresmes']),
        caption: "Slide 10 // LE GUÉ À TRESMES : Lycée des Métiers — Charte vert sauge & papeterie d'excellence (tote bag, gourde, carnet, trousse, mug et badge élève)."
      },
      {
        type: 'image',
        url: resolveImageByQuery(['6B67198A', 'beaujolais_nouveau', 'beaujolais']),
        caption: "Slide 11 // BEAUJOLAIS NOUVEAU : Univers Bistrot & Dégustation — Merchandising vintage, mug bicolore, plaque émaillée bordeaux, tire-bouchon et bouchon gravé."
      },
      {
        type: 'image',
        url: resolveImageByQuery(['466383D8', 'komal', 'beauty']),
        caption: "Slide 12 // KOMAL BEAUTY : Cosmétique & Soins de Prestige — Logotype calligraphique turquoise & violet, sérum éclat anti-âge, crème hydratante et sac satiné."
      },
      {
        type: 'image',
        url: resolveImageByQuery(['DBFE81B6', 'coeur', 'mains']),
        caption: "Slide 13 // LOGO CŒUR & MAINS : Marque Solidaire & Bien-Être — Sweat bordeaux brodé, gourde rouge mat isotherme, coque smartphone, mug céramique et bento box."
      },
      {
        type: 'image',
        url: resolveImageByQuery(['CEC8AFDD', 'travel', 'maroc']),
        caption: "Slide 14 // TRAVEL ACTION : Évasion & Hôtellerie au Maroc — Interface web & mobile responsive, carte de visite dorée, porte-clés cuir surpiqué et accroche-porte aux motifs zelliges."
      },
      {
        type: 'image',
        url: resolveImageByQuery(['6F3D48AA', 'livraison']),
        caption: "Slide 15 // LIVRAISON DE REPAS : Service Gourmet — « Bon appétit, on s'occupe du reste ! », packaging sac kraft, burger wrap et application mobile intuitive."
      },
      {
        type: 'image',
        url: resolveImageByQuery(['7775', 'jnb']),
        caption: "Slide 16 // JNB MAKER : Studio d'Innovation & Création 3D — Emblème cyber-géométrique en néon losange rose fuchsia et bleu cyan sur podium futuriste."
      },
      {
        type: 'image',
        url: resolveImageByQuery(['7782', 'iniciativas']),
        caption: "Slide 17 // FONDATION INICIATIVAS : Impact Social & Solidarité — Logotype ampoule et libellule jaune solaire sur marquage au sol en béton ciré."
      },
      {
        type: 'image',
        url: resolveImageByQuery(['7776', 'sound']),
        caption: "Slide 18 // SOUND LIVE : Plateforme Audio & Streaming — Ondes sonores en dégradé magenta/orange éclatant sur smartphone et écouteurs nomades."
      },
      {
        type: 'image',
        url: resolveImageByQuery(['4F6A2DAB', 'croquettes']),
        caption: "Slide 19 // CROQUETTES LIB' : Nutrition Animale Saine — Sachets kraft éco-conçus pour chiens et chats, gamelle céramique et médaille siglée."
      },
      {
        type: 'image',
        url: resolveImageByQuery(['69F96EF8', 'champlodges']),
        caption: "Slide 20 // CHAMPLODGES : Écotourisme & Séjours Insolites — « Vivre une expérience nature », sac à dos bicolore, gourde inox, casquette et mug émaillé."
      },
      {
        type: 'image',
        url: resolveImageByQuery(['E8E744BF', 'compass', 'veepee']),
        caption: "Slide 21 // COMPASS BY VEEPEE : Direction Mode & E-commerce — « La mode est notre boussole, votre style notre destination. », packaging box, papier de soie, flyer & app mobile."
      },
      {
        type: 'image',
        url: resolveImageByQuery(['1E61849F', 'ag_services', 'architecture']),
        caption: "Slide 22 // AG SERVICES : Cabinet d'Architecture — Monogramme doré précieux sur carnet noir gaufré, mug en céramique mate, carte de visite minérale & plans d'architecte."
      },
      {
        type: 'image',
        url: resolveImageByQuery(['BBA10071', 'privacy_laptop', 'privacy']),
        caption: "Slide 23 // PRIVACY VEEPEE (Onboarding & Workplace) — Logotype clé & papillon Veepee, fond d'écran MacBook, gourde isotherme mate, carnet de notes & badge d'accès tour de cou."
      },
      {
        type: 'image',
        url: resolveImageByQuery(['5702B7D1', 'privacy_tshirt', 'privacy_box']),
        caption: "Slide 24 // PRIVACY VEEPEE (Identité Visuelle & Goodies) — Ruban isométrique 3D déstructuré, t-shirt brodé poitrine, tote bag écru & boîte d'expédition kraft scellée de rose."
      },
      {
        type: 'image',
        url: resolveImageByQuery(['017CC932', '1999', 'arabe', 'calligraphie']),
        caption: "Slide 25 // 1999 : Calligraphie Arabe Moderne & Streetwear — « ١٩٩٩ », identité monochrome #111111 & #FFFFFF, hoodie oversize brodé, tote bag, packaging rigide & pochon satiné."
      },
      {
        type: 'image',
        url: resolveImageByQuery('vin'),
        caption: "Slide 26 // BEAUJOLAIS NOUVEAU VEEPEE : Édition Limitée — Bouteille de vin millésimée et sac cadeau d'exception aux armoiries papillon Veepee."
      },
      {
        type: 'image',
        url: resolveImageByQuery('soum'),
        caption: "Slide 27 // DËLI' SÖUM : Cuisine Orientale & Gastronomie Authentique — Menu noir gaufré or, rosace mandala et lanterne traditionnelle ciselée."
      },
      {
        type: 'image',
        url: resolveImageByQuery('audita'),
        caption: "Slide 28 // GROUPE AUDITA ASSURANCES : Conseil & Courtage — Charte graphique corporate vert anis et gris anthracite, chemises à rabat et papeterie d'affaires."
      },
      {
        type: 'image',
        url: resolveImageByQuery('hoko'),
        caption: "Slide 29 // HÔKÖ EAU DE PARFUM : Parfumerie d'Exception — Monogramme doré HK, flacon sous cloche de verre et étui beige minimaliste de prestige."
      },
      {
        type: 'image',
        url: resolveImageByQuery('daric'),
        caption: "Slide 30 // DARIC NETTOYAGE : Detailing Automobile d'Élite — Seau de lavage professionnel siglé, spray lustrant et casquette brodée aux touches néon."
      }
    ].filter((slide): slide is { type: 'image' | 'video'; url: string; caption: string } => Boolean(slide.url)),
    interactive3DType: 'sphere',
    featured: true
  },
  {
    id: 'neben-clothing-brand',
    slug: 'neben-streetwear',
    title: 'Neben',
    subtitle: 'Marque Streetwear & Calligraphie Arabe Moderne',
    client: 'Neben (Projet Personnel / Marque Propre)',
    year: '2024 - Présent',
    category: 'BRANDING',
    tags: ['Direction Artistique', 'Fashion Design', 'Calligraphie Arabe', 'Streetwear', 'Branding', 'Textile'],
    summary: "Création et direction artistique globale de Neben, marque de vêtements streetwear fusionnant l'élégance de la calligraphie arabe traditionnelle et les codes contemporains de la culture urbaine.",
    description: "Neben réinvente le vestiaire streetwear à travers une identité typographique audacieuse et intemporelle. Au croisement de l'héritage calligraphique arabe et de la culture streetwear contemporaine, la marque propose des pièces structurées aux finitions d'exception : broderies chenille en relief, sérigraphies haute densité, coupes oversize en molleton lourd (100% coton peigné) et vestes en cuir de prestige. Conception intégrale de la marque, du logotype « نيبين » et de son monogramme « ١٩٩٩ » jusqu'au stylisme des collections, packaging d'expédition rigide, direction photo et boutique e-commerce neben.fr.",
    heroImage: neben01Concept,
    secondaryImage: neben02LeatherJacket,
    secondaryBottomImage: neben05ChenillePatch,
    accentColor: '#e11d48',
    gradient: 'from-neutral-900/50 via-rose-500/10 to-transparent',
    role: [
      'Fondateur & Directeur Artistique',
      'Design Textile & Stylisme',
      'Identité Visuelle & Typographie Calligraphique',
      'Direction de Shooting & Packaging'
    ],
    tools: ['Illustrator', 'Photoshop', 'CLO 3D / Blender', 'Modélisme Textile', 'Figma (e-commerce)'],
    metrics: [
      { label: 'Matériaux', value: '100% Coton Lourd Peigné' },
      { label: 'Identité', value: 'Calligraphie Arabe & 1999' },
      { label: 'Univers', value: 'Streetwear Intemporel' },
      { label: 'Boutique', value: 'neben.fr' }
    ],
    deliverables: [
      'Identité visuelle globale, logotype calligraphié « نيبين » et monogramme signature « ١٩٩٩ »',
      'Direction artistique des collections capsule (Capsule Classique, Lineup 3D Coins, Taxi Vintage, Regard Oriental)',
      'Fiches techniques de confection textile : broderie chenille bouclette, sérigraphie gonflante 3D et molleton lourd',
      'Création des déclinaisons vestimentaires : blouson en cuir zippé, hoodies oversize, t-shirts boxy, sweatshirts col rond & casquettes dad hat',
      'Packaging et expérience d’unboxing : boîte rigide aimantée noire scellée, pochons satinés, étiquettes tissées & sacs ziploc d’expédition',
      'Direction du shooting lookbook, mise en scène packshot produit et design de la boutique e-commerce neben.fr'
    ],
    gallery: [
      {
        type: 'image',
        url: neben01Concept,
        caption: "Slide 01 // LE CONCEPT : Neben — Logotype inspiré de la calligraphie arabe traditionnelle fusionné avec une esthétique moderne intemporelle. Identité monochrome (#111111 & #FFFFFF), hoodie oversize, tote bag, boîte rigide EST.1999 & pochon satiné."
      },
      {
        type: 'image',
        url: neben02LeatherJacket,
        caption: "Slide 02 // PIÈCE MAÎTRESSE : Blouson en cuir zippé noir d'exception — Monogramme signature Neben et date calligraphiée « ١٩٩٩ » sérigraphiés en blanc pur, coupe boxy contemporaine et chaînes argentées."
      },
      {
        type: 'image',
        url: neben05ChenillePatch,
        caption: "Slide 03 // SAVOIR-FAIRE TEXTILE : Sweatshirt écru — Écusson ovale brodé en point de chaînette / chenille bouclette rétro jaune moutarde, lettrage arabe magenta et accents turquoise."
      },
      {
        type: 'image',
        url: neben04TextureGreen,
        caption: "Slide 04 // MATIÈRE & TEXTURE : Macro 3D textile — Détail de la broderie en relief calligraphique « عربي » vert matcha avec ombrage 3D noir et typographie millésime « ١٩٩٩ » sur molleton blanc cassé."
      },
      {
        type: 'image',
        url: neben03Lineup,
        caption: "Slide 05 // CAPSULE LINEUP : Collection Streetwear « EST. 1999 » — Déclinaison complète en t-shirts, sweatshirts col rond et hoodies (noir & blanc) avec médaillons superposés 3D et calligraphie arabe."
      },
      {
        type: 'image',
        url: neben06Perspective,
        caption: "Slide 06 // GRAPHIC STREETWEAR : Typographie perspective 3D — Hoodie noir et t-shirt blanc arborant la date « ١٩٩٩ » en projection ascendante rétro, médaillon central vert et lettrage d'ancrage violet."
      },
      {
        type: 'image',
        url: neben07VintageTaxi,
        caption: "Slide 07 // HÉRITAGE & NOSTALGIE : T-shirt blanc oversize — Illustration dos taxi oriental rétro dans son cadre carmin avec typographie arabe « عربي » jaune en relief et signature « نيبين ١٩٩٩ »."
      },
      {
        type: 'image',
        url: neben08RegardOriental,
        caption: "Slide 08 // CAPSULE REGARD : T-shirt crème & Hoodie rose bubblegum — Cadre iconique aux yeux orientaux soulignés de khôl intense et typographie calligraphiée « عربي » jaune contrastée."
      },
      {
        type: 'image',
        url: neben09PackagingCap,
        caption: "Slide 09 // EXPÉDITION & PACKAGING : Sweatshirt col rond blanc « عربي ١٩٩٩ », casquette dad hat vintage vert délavé brodée et pochette d'expédition dépolie ziploc @1999.official."
      },
      {
        type: 'image',
        url: neben10BadgeYellow,
        caption: "Slide 10 // DÉTAIL COUTURE : Zoom écusson talisman brodé — Symbole minimaliste jaune safran et contour carmin cousu sur jersey de coton lourd blanc."
      },
      {
        type: 'image',
        url: neben11BadgePink,
        caption: "Slide 11 // DÉTAIL COUTURE : Écusson brodé rose bubblegum et marine sur molleton noir profond haute densité."
      },
      {
        type: 'image',
        url: neben12PatchGreyTee,
        caption: "Slide 12 // DÉCLINAISON ESSENTIELLE : T-shirt écru boxy et sweatshirt gris chiné avec mini-patch carré brodé sur la poitrine."
      },
      {
        type: 'image',
        url: neben13BlackTeeStore,
        caption: "Slide 13 // BASIQUE NOIR INDISPENSABLE : T-shirt noir 100% coton peigné — Patch poitrine ovale Neben, 5 coloris disponibles, coupe unisexe décontractée sur neben.fr."
      },
      {
        type: 'image',
        url: neben14EmbroideryZoom,
        caption: "Slide 14 // EXIGENCE TEXTILE : Zoom sur la broderie haute précision du logo Neben et la texture du coton peigné d'exception."
      }
    ].filter((slide): slide is { type: 'image' | 'video'; url: string; caption: string } => Boolean(slide.url)),
    interactive3DType: 'cylinder',
    featured: true
  }
];

export const projectCategories = [
  'ALL',
  'ART DIRECTION',
  'GRAPHIC DESIGN',
  'BRANDING',
  '3D',
  'MOTION DESIGN',
  'DIGITAL'
] as const;
