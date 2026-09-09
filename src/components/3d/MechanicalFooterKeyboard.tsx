import React, { useRef, useState, useMemo, useEffect, Component, ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Text, Float } from '@react-three/drei';
import { RoundedBoxGeometry } from 'three-stdlib';
import * as THREE from 'three';
import { audio } from '../../utils/audio';
import { socialLinks } from '../../data/config';
import { CursorMode } from '../../types';
import confetti from 'canvas-confetti';

class SceneErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; retries: number }> {
  state = { hasError: false, retries: 0 };
  private timer: any = null;

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('3D Mechanical Keyboard error caught, auto-recovering:', error);
    if (this.state.retries < 4) {
      this.timer = setTimeout(() => {
        this.setState((prev) => ({ hasError: false, retries: prev.retries + 1 }));
      }, 1500);
    }
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

interface MechanicalFooterKeyboardProps {
  onNavigateHome: () => void;
  onOpenCV: () => void;
  onOpenContact: () => void;
  setCursorMode: (mode: CursorMode, text?: string) => void;
  isPaused?: boolean;
}

// Original Instagram sunset gradient texture on canvas with vibrant radial glow
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
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

// Custom 3D RoundedBox geometry with continuous planar UV mapping
// Prevents the UV from flipping back to purple/red on the front bevel and skirt,
// ensuring the gradient smoothly flows into golden amber at the bottom.
function createInstagramKeycapGeometry(): THREE.BufferGeometry {
  const geom = new RoundedBoxGeometry(1.62, 0.72, 1.62, 4, 0.16);
  const pos = geom.attributes.position;
  const uv = geom.attributes.uv;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    // Continuous planar projection:
    // U runs across width (-0.81 to +0.81)
    const u = Math.max(0.0, Math.min(1.0, (x + 0.81) / 1.62));

    // V runs from back to front:
    // Z = -0.81 (back) -> V = 1.0 (Purple/Magenta top of texture)
    // Z = +0.81 (front) -> V = 0.0 (Golden Amber bottom of texture)
    let v = 1.0 - (z + 0.81) / 1.62;
    v = Math.max(0.0, Math.min(1.0, v));

    // Front bevel and front skirt stay firmly at golden amber (V = 0.0)
    // to follow the natural gradient without jumping back to red
    if (z > 0.55 && y < 0.35) {
      v = 0.0;
    }

    uv.setXY(i, u, v);
  }
  uv.needsUpdate = true;
  return geom;
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

// Global activity tracker for the keyboard scene to achieve 0% idle GPU consumption
const keyboardActivity = {
  renderUntil: performance.now() + 2000,
  markActive(ms = 800) {
    this.renderUntil = Math.max(this.renderUntil, performance.now() + ms);
  },
};

// Single 3D Sculpted Keycap with mechanical spring physics
const Key3D = ({
  config,
  igTexture,
  igGeometry,
  onHover,
  onUnhover,
  setCursorMode,
}: {
  config: KeyConfig;
  igTexture: THREE.CanvasTexture;
  igGeometry: THREE.BufferGeometry;
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
    if (Math.abs(targetY - currentY.current) > 0.0005) {
      currentY.current += (targetY - currentY.current) * Math.min(1, delta * 30);
      if (meshRef.current) {
        meshRef.current.position.y = currentY.current;
      }
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

    keyboardActivity.markActive(800);
    setIsPressed(true);
    audio.playMechanicalClick();
    config.action();

    setTimeout(() => {
      setIsPressed(false);
      keyboardActivity.markActive(400);
    }, 180);
  };

  return (
    <group
      position={[config.gridPos[0], 0.42, config.gridPos[1]]}
      onPointerOver={(e) => {
        e.stopPropagation();
        keyboardActivity.markActive(800);
        setIsHovered(true);
        audio.playKeyHover();
        onHover(config.hoverInfo);
        setCursorMode('CLICK', `PRESS [ ${config.label} ]`);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        keyboardActivity.markActive(600);
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
        {config.textureType === 'ig' ? (
          <mesh geometry={igGeometry}>
            <meshStandardMaterial
              map={igTexture}
              roughness={0.2}
              metalness={0.25}
              emissive="#ea580c"
              emissiveIntensity={isHovered ? 0.25 : 0.02}
            />
          </mesh>
        ) : (
          <RoundedBox
            args={[width, height, depth]}
            radius={0.16}
            smoothness={4}
          >
            <meshStandardMaterial
              color={config.color}
              roughness={config.roughness}
              metalness={config.metalness}
              emissive={config.emissiveColor}
              emissiveIntensity={isHovered ? 0.35 : config.emissiveIntensity}
            />
          </RoundedBox>
        )}

        {/* Concave Keycap Dish Inset on Top Face (for solid matte keycaps) */}
        {config.textureType !== 'ig' && (
          <mesh position={[0, height / 2 + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[width * 0.82, depth * 0.82]} />
            <meshStandardMaterial
              color={config.color}
              roughness={config.roughness + 0.08}
              metalness={config.metalness}
              emissive={config.emissiveColor}
              emissiveIntensity={isHovered ? 0.25 : 0.05}
            />
          </mesh>
        )}

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
  const { mouse, viewport } = useThree();
  const chassisRef = useRef<THREE.Group>(null);
  const [activeHoverInfo, setActiveHoverInfo] = useState<string | null>(null);
  const igTexture = useMemo(() => createInstagramTexture(), []);
  const igGeometry = useMemo(() => createInstagramKeycapGeometry(), []);
  const metalTexture = useMemo(() => createBrushedMetalTexture(), []);

  // Compute responsive scale so the entire 3D mechanical keyboard chassis (~14.6 units wide)
  // fits completely inside the canvas viewport on any mobile phone or tablet screen without clipping
  const responsiveScale = useMemo(() => {
    // Total keyboard visual width is ~14.8 units including chassis bevel and corner screws
    const targetWidth = 14.8;
    // 0.94 factor ensures a balanced margin on the left and right edges
    const scale = (viewport.width * 0.94) / targetWidth;
    return Math.min(1.0, Math.max(0.35, scale));
  }, [viewport.width]);

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
    <group
      ref={chassisRef}
      position={[0, -0.4, 0]}
      scale={[responsiveScale, responsiveScale, responsiveScale]}
    >
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
          igGeometry={igGeometry}
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
  isPaused = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      setIsTabVisible(visible);
      if (visible && isInView) {
        keyboardActivity.markActive(2500);
      }
    };

    const handleFocus = () => {
      setIsTabVisible(true);
      if (isInView) {
        keyboardActivity.markActive(2500);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isInView]);

  // When modal closes or pause status releases, awaken rendering
  useEffect(() => {
    if (!isPaused && isInView && isTabVisible) {
      keyboardActivity.markActive(3000);
    }
  }, [isPaused, isInView, isTabVisible]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Check if already in or near view on initial load
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
      setIsInView(true);
      keyboardActivity.markActive(2500);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          keyboardActivity.markActive(2500);
        }
      },
      { rootMargin: '100px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const shouldRender = isInView && isTabVisible && !isPaused;

  return (
    <div 
      ref={containerRef}
      onPointerMove={() => keyboardActivity.markActive(800)}
      onPointerEnter={() => keyboardActivity.markActive(1200)}
      onPointerDown={() => keyboardActivity.markActive(800)}
      className="relative isolate w-full max-w-[1380px] mx-auto select-none overflow-visible"
    >
      {/* 3D WebGL Canvas Container with optimized responsive height */}
      <div className="relative w-full h-[260px] sm:h-[360px] md:h-[440px] lg:h-[500px] overflow-visible flex items-center justify-center">
        
        {/* Ambient Neon Green Halo Backlight Behind Keyboard - Vibrant, Volumetric & Perfectly Diffuse */}
        {/* Wide atmospheric aura with soft radial falloff into black */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[650px] sm:max-w-[950px] lg:max-w-[1150px] h-[220px] sm:h-[360px] bg-[radial-gradient(ellipse_at_center,rgba(57,255,20,0.36)_0%,rgba(57,255,20,0.18)_35%,rgba(57,255,20,0.04)_65%,transparent_82%)] blur-[45px] sm:blur-[75px] pointer-events-none z-0" 
          aria-hidden="true"
        />
        {/* Concentrated neon green glow hugging the 3D chassis */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[450px] sm:max-w-[750px] lg:max-w-[900px] h-[160px] sm:h-[270px] bg-[#39FF14]/18 blur-[50px] sm:blur-[85px] rounded-full pointer-events-none z-0" 
          aria-hidden="true"
        />
        {/* Core underglow center */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[550px] h-[100px] sm:h-[160px] bg-[#39FF14]/28 blur-[35px] sm:blur-[55px] rounded-full pointer-events-none z-0" 
          aria-hidden="true"
        />

        <Canvas
          className="relative z-10 w-full h-full"
          frameloop={shouldRender ? 'always' : 'never'}
          camera={{ position: [0, 8.5, 6.2], fov: 42 }}
          dpr={1}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
        >
          {/* Studio Lighting Rig */}
          <ambientLight intensity={0.9} />

          {/* Primary Key Spotlight */}
          <directionalLight
            position={[5, 12, 8]}
            intensity={2.2}
          />

          {/* Subtle Cool Rim Light from Back-Left */}
          <directionalLight position={[-8, 6, -4]} intensity={1.2} color="#93c5fd" />

          {/* Warm Accent Point Light on the Keyboard Deck */}
          <pointLight position={[0, 4, 3]} intensity={1.1} color="#ffffff" />
          
          {/* Green Underglow & Rim Backlight */}
          <pointLight position={[0, -0.5, -1.2]} intensity={2.4} color="#39FF14" distance={12} />
          <pointLight position={[0, 1.2, -4]} intensity={1.5} color="#39FF14" distance={10} />

          {/* 3D Keyboard Scene with Error Boundary */}
          <SceneErrorBoundary>
            <KeyboardScene
              onNavigateHome={onNavigateHome}
              onOpenCV={onOpenCV}
              onOpenContact={onOpenContact}
              setCursorMode={setCursorMode}
            />
          </SceneErrorBoundary>
        </Canvas>
      </div>
    </div>
  );
};
