import React, { useRef, useState, useEffect, useMemo, Suspense, Component, ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Preload } from '@react-three/drei';
import * as THREE from 'three';
import { audio } from '../../utils/audio';
import { CursorMode } from '../../types';

class SceneErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn('3D Floating Icons error caught by boundary:', error);
  }
  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

interface FloatingIconsFieldProps {
  setCursorMode?: (mode: CursorMode, text?: string) => void;
}

interface SingleIconProps {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  basePosition: THREE.Vector3;
  index: number;
  name: string;
  setCursorMode?: (mode: CursorMode, text?: string) => void;
}

const MODEL_URL = '/models/v3_icone.glb';
const DRACO_DECODER_PATH = '/draco/';

// Preload GLTF model with local DRACO decoder so assets are instantly ready
useGLTF.preload(MODEL_URL, DRACO_DECODER_PATH);

const SingleFloatingIcon: React.FC<SingleIconProps> = ({
  geometry,
  material,
  basePosition,
  index,
  name,
  setCursorMode,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Independent floating random seeds per mesh (no rotation over time)
  const params = useMemo(() => {
    // Deterministic pseudo-random based on index
    const seed1 = Math.sin(index * 12.9898) * 43758.5453;
    const r1 = seed1 - Math.floor(seed1);
    const seed2 = Math.sin((index + 1) * 78.233) * 43758.5453;
    const r2 = seed2 - Math.floor(seed2);
    const seed3 = Math.sin((index + 2) * 45.164) * 43758.5453;
    const r3 = seed3 - Math.floor(seed3);

    return {
      phase: r1 * Math.PI * 2,
      floatSpeed: 0.6 + r2 * 0.7,
      floatAmpY: 0.08 + r3 * 0.06,
      floatAmpX: 0.02 + r1 * 0.025,
      floatAmpZ: 0.03 + r2 * 0.03,
    };
  }, [index]);

  // Spring physics variables
  const currentPos = useRef(basePosition.clone());
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const targetPos = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.04);
    const t = state.clock.getElapsedTime();

    // 1. Organic multi-axis levitation motion (while staying strictly facing forward)
    const levitateX = basePosition.x + Math.sin(t * params.floatSpeed * 0.7 + params.phase) * params.floatAmpX;
    const levitateY = basePosition.y + Math.sin(t * params.floatSpeed + params.phase) * params.floatAmpY;
    const levitateZ = basePosition.z + Math.cos(t * params.floatSpeed * 0.8 + params.phase) * params.floatAmpZ;

    // 2. Cursor repulsion physics (calculate cursor position on world plane)
    const { pointer, viewport } = state;
    const cursorWorldX = pointer.x * (viewport.width / 2);
    const cursorWorldY = pointer.y * (viewport.height / 2);

    const dx = currentPos.current.x - cursorWorldX;
    const dy = currentPos.current.y - cursorWorldY;
    const dist2D = Math.sqrt(dx * dx + dy * dy);

    const repelRadius = 1.9; // Distance threshold for magnetic repulsion
    let pushX = 0;
    let pushY = 0;
    let pushZ = 0;
    let targetScale = 1.0;

    // Active cursor repulsion when close
    if (dist2D < repelRadius) {
      const force = Math.pow(1 - dist2D / repelRadius, 1.6);
      const dirX = dx / (dist2D + 0.0001);
      const dirY = dy / (dist2D + 0.0001);

      // Repel away from cursor on X/Y and project forward in +Z towards user (pop out of screen)
      pushX = dirX * force * 1.5;
      pushY = dirY * force * 1.5;
      pushZ = force * 2.2; // Pops out towards camera

      targetScale = 1.0 + force * 0.25; // Scale up as it approaches screen
    }

    targetPos.set(levitateX + pushX, levitateY + pushY, levitateZ + pushZ);

    // 3. Second-Order Spring Physics (Hooke's Law + Damping)
    const stiffness = 95;
    const damping = 12;

    const forceVecX = (targetPos.x - currentPos.current.x) * stiffness;
    const forceVecY = (targetPos.y - currentPos.current.y) * stiffness;
    const forceVecZ = (targetPos.z - currentPos.current.z) * stiffness;

    velocity.current.x += (forceVecX - velocity.current.x * damping) * dt;
    velocity.current.y += (forceVecY - velocity.current.y * damping) * dt;
    velocity.current.z += (forceVecZ - velocity.current.z * damping) * dt;

    currentPos.current.addScaledVector(velocity.current, dt);

    // Apply updated coordinates & transforms
    meshRef.current.position.copy(currentPos.current);

    // Keep icons strictly facing forward (0 rotation)
    meshRef.current.rotation.set(0, 0, 0);

    const currentScale = meshRef.current.scale.x;
    const newScale = THREE.MathUtils.damp(currentScale, targetScale, 10, dt);
    meshRef.current.scale.setScalar(newScale);
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setCursorMode?.('HOVER', 'REPULSE 3D');
    audio.playKeyHover();
  };

  const handlePointerOut = () => {
    setCursorMode?.('DEFAULT');
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    audio.playMechanicalClick();
    // Add dynamic tactile bounce impulse towards screen
    velocity.current.z += 2.5;
    velocity.current.y += (Math.random() - 0.5) * 1.5;
    velocity.current.x += (Math.random() - 0.5) * 1.5;
  };

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      castShadow
      receiveShadow
    />
  );
};

// Component parsing the GLB file into individual centered meshes
const FloatingIconsScene: React.FC<FloatingIconsFieldProps> = ({ setCursorMode }) => {
  const gltf = useGLTF(MODEL_URL, DRACO_DECODER_PATH) as any;
  const { viewport } = useThree();

  // Dynamically scale icons so they fit comfortably inside the canvas on narrow mobile screens
  const responsiveScale = useMemo(() => {
    // Normal desktop spread is ~4.8 units
    return Math.min(1.0, Math.max(0.48, (viewport.width * 0.92) / 4.8));
  }, [viewport.width]);

  // Extract and center each mesh individually
  const iconMeshes = useMemo(() => {
    const meshes: Array<{
      id: string;
      name: string;
      geometry: THREE.BufferGeometry;
      material: THREE.Material;
      basePosition: THREE.Vector3;
    }> = [];

    let count = 0;
    gltf.scene.traverse((child: any) => {
      if (child.isMesh && child.geometry) {
        // Compute bounding box of the original mesh in model coordinates
        child.geometry.computeBoundingBox();
        const bbox = child.geometry.boundingBox;
        const center = new THREE.Vector3();
        bbox.getCenter(center);

        // Clone and center the geometry locally around (0,0,0)
        const centeredGeom = child.geometry.clone();
        centeredGeom.center();

        // Scale and map model position to wider viewport coordinates
        const spreadFactorX = 3.6;
        const spreadFactorY = 2.8;
        const spreadFactorZ = 2.0;

        const basePos = new THREE.Vector3(
          center.x * spreadFactorX,
          center.y * spreadFactorY,
          center.z * spreadFactorZ
        );

        // Clone material and enhance lighting & surface response without front emission
        const mat = child.material ? child.material.clone() : new THREE.MeshStandardMaterial({ color: '#ffffff' });
        if (mat.isMeshStandardMaterial) {
          mat.roughness = Math.max(0.14, mat.roughness * 0.9);
          mat.metalness = Math.min(0.95, mat.metalness * 1.05);
        }

        meshes.push({
          id: `icon-${count++}`,
          name: child.name || `Icon_${count}`,
          geometry: centeredGeom,
          material: mat,
          basePosition: basePos,
        });
      }
    });

    return meshes;
  }, [gltf]);

  return (
    <group scale={[responsiveScale, responsiveScale, responsiveScale]}>
      {iconMeshes.map((item, idx) => (
        <SingleFloatingIcon
          key={item.id}
          index={idx}
          name={item.name}
          geometry={item.geometry}
          material={item.material}
          basePosition={item.basePosition}
          setCursorMode={setCursorMode}
        />
      ))}
    </group>
  );
};

// Subtle, soft volumetric glow backdrop located strictly behind the 3D model (z = -2.4)
const SoftBackdropGlow: React.FC = () => {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, 'rgba(57, 255, 20, 0.32)');
    gradient.addColorStop(0.35, 'rgba(34, 197, 94, 0.15)');
    gradient.addColorStop(0.68, 'rgba(57, 255, 20, 0.03)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  if (!texture) return null;

  return (
    <mesh position={[0, 0, -2.4]} renderOrder={-1}>
      <planeGeometry args={[13.5, 8]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

export const FloatingIconsField: React.FC<FloatingIconsFieldProps> = ({ setCursorMode }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Check if already in or near view on initial load
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 800 && rect.bottom > -800) {
      setIsInView(true);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '800px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="floating-icons" 
      className="relative w-full max-w-7xl mx-auto py-10 sm:py-16 px-2 sm:px-4 select-none overflow-hidden"
    >
      {/* Soft Ambient Background Glow strictly behind the 3D Canvas */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10 overflow-hidden">
        <div 
          className="w-full max-w-[620px] sm:max-w-[860px] lg:max-w-[1080px] h-[300px] sm:h-[400px] lg:h-[460px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(57,255,20,0.18)_0%,rgba(16,185,129,0.07)_45%,transparent_70%)] blur-[75px] sm:blur-[100px]" 
        />
      </div>

      {/* Seamless Transparent 3D Stage without frame or borders */}
      <div className="relative w-full h-[360px] sm:h-[480px] lg:h-[650px] overflow-hidden z-0">
        {/* R3F Canvas - idle 'demand' mode when far offscreen, active 'always' when near/in view */}
        <Canvas
          frameloop={isInView ? 'always' : 'demand'}
          camera={{ position: [0, 0, 5.4], fov: 45 }}
          className="w-full h-full"
          dpr={[1, 1.25]}
          gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
        >
          {/* Clean Neutral Studio Lighting on Front of Icons */}
          <ambientLight intensity={0.9} />
          <directionalLight position={[4, 6, 5]} intensity={1.1} color="#ffffff" />
          <directionalLight position={[-4, 2, 4]} intensity={0.4} color="#f8fafc" />

          {/* Gentle Soft Backlight behind the icons (Z = -2.0) */}
          <pointLight position={[0, 0, -2.0]} intensity={1.1} color="#39FF14" distance={7} />

          {/* Soft 3D Glow Plane strictly behind the models */}
          <SoftBackdropGlow />

          {/* Suspense with Fallback and Error Boundary */}
          <Suspense fallback={null}>
            <SceneErrorBoundary>
              <FloatingIconsScene setCursorMode={setCursorMode} />
            </SceneErrorBoundary>
            <Preload all />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
};

