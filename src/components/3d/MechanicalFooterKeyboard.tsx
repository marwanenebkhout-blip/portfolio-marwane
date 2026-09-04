import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { audio } from '../../utils/audio';
import { socialLinks } from '../../data/config';
import { CursorMode } from '../../types';
import confetti from 'canvas-confetti';

interface MechanicalFooterKeyboardProps {
  onNavigateHome: () => void;
  onOpenCV: () => void;
  onOpenContact: () => void;
  setCursorMode: (mode: CursorMode, text?: string) => void;
}

// Generate Instagram sunset gradient texture on canvas
function createInstagramTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, '#c026d3'); // Magenta/purple top
  gradient.addColorStop(0.45, '#e11d48'); // Hot pink / crimson mid
  gradient.addColorStop(0.85, '#ea580c'); // Warm orange
  gradient.addColorStop(1, '#f59e0b'); // Golden amber bottom

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle radial inner glow
  const radial = ctx.createRadialGradient(256, 180, 20, 256, 256, 300);
  radial.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
  radial.addColorStop(1, 'rgba(0, 0, 0, 0.15)');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Generate Brushed Gunmetal Metal Canvas Texture for the Chassis
function createBrushedMetalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#141519';
  ctx.fillRect(0, 0, 1024, 512);

  // Horizontal brushed metal micro-streaks
  for (let i = 0; i < 6000; i++) {
    const y = Math.random() * 512;
    const x = Math.random() * 1024;
    const len = 30 + Math.random() * 180;
    const alpha = 0.015 + Math.random() * 0.035;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillRect(x, y, len, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

interface KeyConfig {
  id: string;
  label: string;
  gridPos: [number, number]; // [x, z]
  color: string;
  textColor: string;
  emissiveColor: string;
  emissiveIntensity: number;
  roughness: number;
  metalness: number;
  textureType?: 'ig';
  action: () => void;
  hoverInfo: string;
}

// Single 3D Sculpted Keycap with mechanical spring physics
const Key3D = ({
  config,
  igTexture,
  onHover,
  onUnhover,
  setCursorMode,
}: {
  config: KeyConfig;
  igTexture: THREE.CanvasTexture;
  onHover: (info: string) => void;
  onUnhover: () => void;
  setCursorMode: (mode: CursorMode, text?: string) => void;
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Physics animation values
  const currentY = useRef(0);
  const targetY = isPressed ? -0.22 : isHovered ? 0.06 : 0;

  useFrame((_, delta) => {
    currentY.current += (targetY - currentY.current) * Math.min(1, delta * 30);
    if (meshRef.current) {
      meshRef.current.position.y = currentY.current;
    }
  });

  const width = 1.62;
  const height = 0.72;
  const depth = 1.62;

  const lastClickRef = useRef(0);

  const triggerPress = (e: any) => {
    e.stopPropagation();
    const now = Date.now();
    if (now - lastClickRef.current < 250) return;
    lastClickRef.current = now;

    setIsPressed(true);
    audio.playMechanicalClick();
    config.action();

    setTimeout(() => {
      setIsPressed(false);
    }, 180);
  };

  return (
    <group
      position={[config.gridPos[0], 0.42, config.gridPos[1]]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        audio.playKeyHover();
        onHover(config.hoverInfo);
        setCursorMode('CLICK', `PRESS [ ${config.label} ]`);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setIsHovered(false);
        onUnhover();
        setCursorMode('DEFAULT');
        document.body.style.cursor = 'default';
      }}
      onPointerDown={(e) => {
        triggerPress(e);
      }}
      onClick={(e) => {
        triggerPress(e);
      }}
    >
      {/* Dynamic Keycap Assembly with Physics Spring */}
      <group ref={meshRef}>
        {/* Main 3D Keycap Shell with Chamfered Edges */}
        <RoundedBox
          args={[width, height, depth]}
          radius={0.16}
          smoothness={8}
          castShadow
          receiveShadow
        >
          {config.textureType === 'ig' ? (
            <meshStandardMaterial
              map={igTexture}
              roughness={0.2}
              metalness={0.3}
              emissive="#e11d48"
              emissiveIntensity={isHovered ? 0.4 : 0.15}
            />
          ) : (
            <meshStandardMaterial
              color={config.color}
              roughness={config.roughness}
              metalness={config.metalness}
              emissive={config.emissiveColor}
              emissiveIntensity={isHovered ? 0.35 : config.emissiveIntensity}
            />
          )}
        </RoundedBox>

        {/* Concave Keycap Dish Inset on Top Face */}
        <mesh position={[0, height / 2 + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[width * 0.82, depth * 0.82]} />
          {config.textureType === 'ig' ? (
            <meshStandardMaterial
              map={igTexture}
              roughness={0.25}
              emissive="#e11d48"
              emissiveIntensity={isHovered ? 0.5 : 0.2}
            />
          ) : (
            <meshStandardMaterial
              color={config.color}
              roughness={config.roughness + 0.08}
              metalness={config.metalness}
              emissive={config.emissiveColor}
              emissiveIntensity={isHovered ? 0.25 : 0.05}
            />
          )}
        </mesh>

        {/* Crisp Bold 3D Centered Legend */}
        <Text
          position={[0, height / 2 + 0.015, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={config.label.length > 4 ? 0.26 : 0.34}
          color={config.textColor}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          letterSpacing={0.05}
          renderOrder={10}
        >
          {config.label}
        </Text>
      </group>

      {/* Mechanical Switch Housing Box */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[width * 0.92, 0.35, depth * 0.92]} />
        <meshStandardMaterial color="#0b0c0e" roughness={0.9} metalness={0.1} />
      </mesh>
    </group>
  );
};

// 3D Recessed Phillips Metal Screw Head
const Screw3D = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Recessed Circular Counterbore Hole */}
    <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.22, 0.26, 32]} />
      <meshStandardMaterial color="#050608" roughness={0.8} />
    </mesh>

    {/* Convex Metallic Screw Head Dome */}
    <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
      <meshStandardMaterial color="#3a3e4a" metalness={0.92} roughness={0.18} />
    </mesh>

    {/* Phillips Cross Slot Lines */}
    <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.24, 0.045]} />
      <meshBasicMaterial color="#07080a" />
    </mesh>
    <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
      <planeGeometry args={[0.24, 0.045]} />
      <meshBasicMaterial color="#07080a" />
    </mesh>
  </group>
);

// Entire 3D Keyboard Scene inside Canvas with subtle mouse parallax tilt
const KeyboardScene = ({
  onNavigateHome,
  onOpenCV,
  onOpenContact,
  setCursorMode,
}: MechanicalFooterKeyboardProps) => {
  const { mouse } = useThree();
  const chassisRef = useRef<THREE.Group>(null);
  const [activeHoverInfo, setActiveHoverInfo] = useState<string | null>(null);
  const igTexture = useMemo(() => createInstagramTexture(), []);
  const metalTexture = useMemo(() => createBrushedMetalTexture(), []);

  // Smooth mouse parallax rotation
  useFrame(() => {
    if (chassisRef.current) {
      // Natural perspective angle matching the photograph: ~20 degrees forward tilt
      const targetRotX = 0.32 + mouse.y * 0.08;
      const targetRotY = mouse.x * 0.08;
      chassisRef.current.rotation.x += (targetRotX - chassisRef.current.rotation.x) * 0.08;
      chassisRef.current.rotation.y += (targetRotY - chassisRef.current.rotation.y) * 0.08;
    }
  });

  // 10 Keycaps Config matching exact photo layout:
  // Spacing: X col pitch = 1.95, Z row pitch = 1.95
  const keys: KeyConfig[] = [
    // ROW 1
    {
      id: 'home',
      label: 'HOME',
      gridPos: [-4.6, -0.6],
      color: '#131417',
      textColor: '#ffffff',
      emissiveColor: '#1c1e24',
      emissiveIntensity: 0.1,
      roughness: 0.38,
      metalness: 0.3,
      hoverInfo: 'RETOUR EN HAUT DU SITE',
      action: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onNavigateHome();
      },
    },
    {
      id: 'cv',
      label: 'CV',
      gridPos: [-2.65, -0.6],
      color: '#15161a',
      textColor: '#ffffff',
      emissiveColor: '#1c1e24',
      emissiveIntensity: 0.1,
      roughness: 0.38,
      metalness: 0.3,
      hoverInfo: 'TÉLÉCHARGER LE CV',
      action: () => {
        onOpenCV();
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.85 } });
      },
    },
    {
      id: 'ig',
      label: 'IG',
      gridPos: [-0.7, -0.6],
      color: '#c026d3',
      textColor: '#ffffff',
      emissiveColor: '#e11d48',
      emissiveIntensity: 0.3,
      roughness: 0.2,
      metalness: 0.4,
      textureType: 'ig',
      hoverInfo: 'INSTAGRAM: @neben_99',
      action: () => window.open('https://www.instagram.com/neben_99?igsi=MWlsYmsyb2syZ205aw%3D%3D&utm_source=qr', '_blank', 'noopener,noreferrer'),
    },
    {
      id: 'in',
      label: 'IN',
      gridPos: [1.25, -0.6],
      color: '#1d4ed8', // Deep Cobalt Blue
      textColor: '#ffffff',
      emissiveColor: '#2563eb',
      emissiveIntensity: 0.35,
      roughness: 0.22,
      metalness: 0.5,
      hoverInfo: 'LINKEDIN: Marwane Nebkhout',
      action: () => window.open('https://www.linkedin.com/in/marwane-nebkhout-✍🏽💻-a28a48157?utm_source=share_via&utm_content=profile&utm_medium=member_ios', '_blank', 'noopener,noreferrer'),
    },
    {
      id: 'x',
      label: 'X',
      gridPos: [3.2, -0.6],
      color: '#111215',
      textColor: '#ffffff',
      emissiveColor: '#1c1e24',
      emissiveIntensity: 0.1,
      roughness: 0.38,
      metalness: 0.3,
      hoverInfo: 'X: PAGE D\'ACCUEIL',
      action: () => window.open('https://x.com', '_blank', 'noopener,noreferrer'),
    },

    // ROW 2
    {
      id: 'email',
      label: '@',
      gridPos: [-4.6, 1.35],
      color: '#dfcf9d', // Vintage Warm Ivory / Gold
      textColor: '#111215',
      emissiveColor: '#f59e0b',
      emissiveIntensity: 0.1,
      roughness: 0.35,
      metalness: 0.2,
      hoverInfo: 'MAIL: marwanenebkhout@gmail.com',
      action: () => {
        window.location.href = 'mailto:marwanenebkhout@gmail.com';
      },
    },
    {
      id: 'hire',
      label: 'HIRE ME',
      gridPos: [-2.65, 1.35],
      color: '#131417',
      textColor: '#ffffff',
      emissiveColor: '#1c1e24',
      emissiveIntensity: 0.1,
      roughness: 0.38,
      metalness: 0.3,
      hoverInfo: 'HIRE ME: marwanenebkhout@gmail.com',
      action: () => {
        window.location.href = 'mailto:marwanenebkhout@gmail.com';
      },
    },
    {
      id: 'call',
      label: 'CALL ME',
      gridPos: [-0.7, 1.35],
      color: '#131417',
      textColor: '#ffffff',
      emissiveColor: '#1c1e24',
      emissiveIntensity: 0.1,
      roughness: 0.38,
      metalness: 0.3,
      hoverInfo: 'CALL ME: marwanenebkhout@gmail.com',
      action: () => {
        window.location.href = 'mailto:marwanenebkhout@gmail.com';
      },
    },
    {
      id: 'dr',
      label: 'DR',
      gridPos: [1.25, 1.35],
      color: '#ec4899', // Bright Bubblegum Orchid Pink
      textColor: '#111215',
      emissiveColor: '#db2777',
      emissiveIntensity: 0.35,
      roughness: 0.25,
      metalness: 0.35,
      hoverInfo: 'DRIBBBLE: Projets Graphiques',
      action: () => window.open(socialLinks.dribbble, '_blank', 'noopener,noreferrer'),
    },
    {
      id: 'bh',
      label: 'BH',
      gridPos: [3.2, 1.35],
      color: '#2563eb', // Electric Royal Blue
      textColor: '#ffffff',
      emissiveColor: '#1d4ed8',
      emissiveIntensity: 0.35,
      roughness: 0.22,
      metalness: 0.5,
      hoverInfo: 'BEHANCE: Direction Artistique',
      action: () => window.open('https://www.behance.net/marwanenebkhout2', '_blank', 'noopener,noreferrer'),
    },
  ];

  return (
    <group ref={chassisRef} position={[0, -0.4, 0]}>
      {/* 1. Main 3D Gunmetal Brushed Aluminum Hardware Enclosure */}
      <RoundedBox
        args={[14.2, 0.9, 6.8]}
        radius={0.42}
        smoothness={8}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#16181d"
          roughness={0.35}
          metalness={0.7}
          map={metalTexture}
        />
      </RoundedBox>

      {/* Recessed Inner Tray around the Keycaps */}
      <mesh position={[-0.7, 0.46, 0.38]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10.2, 4.3]} />
        <meshStandardMaterial color="#0c0d10" roughness={0.9} metalness={0.2} />
      </mesh>

      {/* 2. Top Header Bar: Screen Capsule, LED, Medallion, Speaker Slots */}
      {/* Indented Black Screen Capsule on the Left */}
      <group position={[-3.8, 0.47, -2.45]}>
        {/* Capsule Border / Bezel */}
        <RoundedBox args={[4.4, 0.1, 0.72]} radius={0.25} smoothness={6}>
          <meshStandardMaterial color="#08090b" roughness={0.8} metalness={0.3} />
        </RoundedBox>

        {/* OLED Screen Content: Dynamic Status & Key Legend */}
        <Text
          position={[-0.32, 0.06, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={activeHoverInfo ? 0.16 : 0.21}
          color="#39FF14"
          fontWeight="bold"
          letterSpacing={0.06}
        >
          {activeHoverInfo ? activeHoverInfo : 'AVAILABLE FOR FREELANCE'}
        </Text>

        {/* 3D Glowing Green LED Sphere Indicator */}
        <mesh position={[1.65, 0.07, 0]}>
          <sphereGeometry args={[0.085, 16, 16]} />
          <meshStandardMaterial
            color="#39FF14"
            emissive="#39FF14"
            emissiveIntensity={2.5}
            roughness={0.1}
          />
        </mesh>
        <pointLight position={[1.65, 0.2, 0]} color="#39FF14" intensity={0.8} distance={2} />
      </group>

      {/* Circular Metal Coin Medallion with "MN" Monogram */}
      <group position={[-1.1, 0.48, -2.45]}>
        {/* Outer Metallic Bevel */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.08, 32]} />
          <meshStandardMaterial color="#3a3f4d" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Inner Dark Metal Inset */}
        <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.02, 32]} />
          <meshStandardMaterial color="#14161c" roughness={0.5} />
        </mesh>
        {/* Stylized Monogram */}
        <Text
          position={[0, 0.06, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.26}
          color="#e4e4e7"
          fontWeight="bold"
          fontStyle="italic"
        >
          MN
        </Text>
      </group>

      {/* 3 Horizontal Ventilation / CNC Speaker Slots */}
      <group position={[1.2, 0.47, -2.45]}>
        {[-0.14, 0, 0.14].map((zOffset, idx) => (
          <mesh key={idx} position={[0, 0.01, zOffset]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.2, 0.05]} />
            <meshBasicMaterial color="#050608" />
          </mesh>
        ))}
      </group>

      {/* 3. Right Hardware Telemetry Panel matching photo */}
      <group position={[5.35, 0.47, 0.38]}>
        {/* Inset Sub-chassis Box */}
        <RoundedBox args={[2.5, 0.12, 4.3]} radius={0.22} smoothness={6}>
          <meshStandardMaterial color="#090a0d" roughness={0.8} metalness={0.3} />
        </RoundedBox>

        {/* Tiny Right Panel Screw */}
        <Screw3D position={[0.9, 0.06, -1.8]} />

        {/* Green Glowing Status Dot + "BASED IN FRANCE" */}
        <mesh position={[-0.88, 0.08, -1.5]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#39FF14" emissive="#39FF14" emissiveIntensity={2.0} />
        </mesh>

        <Text
          position={[-0.05, 0.07, -1.5]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.16}
          color="#39FF14"
          fontWeight="bold"
          letterSpacing={0.04}
        >
          BASED IN FRANCE
        </Text>

        {/* Location PARIS */}
        <Text
          position={[-0.1, 0.07, -0.65]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.18}
          color="#ffffff"
          fontWeight="bold"
          letterSpacing={0.06}
        >
          PARIS
        </Text>

        {/* Timezone GMT+1 */}
        <Text
          position={[-0.1, 0.07, 0.1]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.18}
          color="#d4d4d8"
          fontWeight="bold"
          letterSpacing={0.06}
        >
          GMT+1
        </Text>

        {/* Copyright Text at Bottom */}
        <Text
          position={[0, 0.07, 1.35]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.11}
          color="#71717a"
          fontWeight="bold"
          letterSpacing={0.02}
        >
          © 2024 MARWANE NEBKHOUT
        </Text>
        <Text
          position={[0, 0.07, 1.65]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.11}
          color="#71717a"
          fontWeight="bold"
          letterSpacing={0.02}
        >
          ALL RIGHTS RESERVED
        </Text>
      </group>

      {/* 4. 4 Recessed Metallic Corner Screws */}
      <Screw3D position={[-6.4, 0.46, -2.8]} />
      <Screw3D position={[6.4, 0.46, -2.8]} />
      <Screw3D position={[-6.4, 0.46, 2.8]} />
      <Screw3D position={[6.4, 0.46, 2.8]} />

      {/* 5. The 10 Interactive 3D Keys */}
      {keys.map((k) => (
        <Key3D
          key={k.id}
          config={k}
          igTexture={igTexture}
          onHover={(info) => setActiveHoverInfo(info)}
          onUnhover={() => setActiveHoverInfo(null)}
          setCursorMode={setCursorMode}
        />
      ))}
    </group>
  );
};

export const MechanicalFooterKeyboard: React.FC<MechanicalFooterKeyboardProps> = ({
  onNavigateHome,
  onOpenCV,
  onOpenContact,
  setCursorMode,
}) => {
  return (
    <div className="w-full max-w-[1380px] mx-auto select-none">
      {/* 3D WebGL Canvas Container without bounding frame/box */}
      <div className="relative w-full h-[360px] sm:h-[450px] lg:h-[500px] overflow-visible">
        
        {/* Ambient Neon Green Halo Backlight Behind Keyboard */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] lg:w-[1150px] h-[260px] sm:h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(57,255,20,0.32)_0%,rgba(57,255,20,0.12)_45%,rgba(57,255,20,0.02)_70%,transparent_85%)] blur-[50px] sm:blur-[70px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] lg:w-[900px] h-[200px] sm:h-[280px] bg-[#39FF14]/15 blur-[90px] rounded-full pointer-events-none" />

        <Canvas
          shadows
          camera={{ position: [0, 8.5, 6.2], fov: 42 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
        >
          {/* Studio Lighting Rig */}
          <ambientLight intensity={0.8} />

          {/* Primary Key Spotlight */}
          <directionalLight
            position={[5, 12, 8]}
            intensity={2.2}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0001}
          />

          {/* Subtle Cool Rim Light from Back-Left */}
          <directionalLight position={[-8, 6, -4]} intensity={1.2} color="#93c5fd" />

          {/* Warm Accent Point Light on the Keyboard Deck */}
          <pointLight position={[0, 4, 3]} intensity={1.0} color="#ffffff" />
          <pointLight position={[-4, 2, 1]} intensity={0.8} color="#39FF14" />
          <pointLight position={[3, 2, 1]} intensity={0.8} color="#3b82f6" />
          {/* Green Underglow & Rim Backlight */}
          <pointLight position={[0, -0.5, -1.2]} intensity={2.2} color="#39FF14" distance={12} />
          <pointLight position={[0, 1.2, -4]} intensity={1.5} color="#39FF14" distance={10} />

          {/* 3D Keyboard Scene */}
          <KeyboardScene
            onNavigateHome={onNavigateHome}
            onOpenCV={onOpenCV}
            onOpenContact={onOpenContact}
            setCursorMode={setCursorMode}
          />
        </Canvas>
      </div>
    </div>
  );
};
