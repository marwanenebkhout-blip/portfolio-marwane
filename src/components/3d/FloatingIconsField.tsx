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
  isPaused?: boolean;
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
    const cursorWorldX = pointer.x * (viewport.width * 0.5);
    const cursorWorldY = pointer.y * (viewport.height * 0.5);

    const dx = currentPos.current.x - cursorWorldX;
    const dy = currentPos.current.y - cursorWorldY;
    const dist2DSq = dx * dx + dy * dy;
    const repelRadiusSq = 3.61; // 1.9 * 1.9

    let pushX = 0;
    let pushY = 0;
    let pushZ = 0;
    let targetScale = 1.0;

    // Active cursor repulsion only when within radius (avoid heavy sqrt/pow when far)
    if (dist2DSq < repelRadiusSq) {
      const dist2D = Math.sqrt(dist2DSq);
      const force = Math.pow(1 - dist2D / 1.9, 1.6);
      const invDist = 1 / (dist2D + 0.0001);
      const dirX = dx * invDist;
      const dirY = dy * invDist;

      // Repel away from cursor on X/Y and project forward in +Z towards user
      pushX = dirX * force * 1.5;
      pushY = dirY * force * 1.5;
      pushZ = force * 2.2;

      targetScale = 1.0 + force * 0.25;
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

    currentPos.current.x += velocity.current.x * dt;
    currentPos.current.y += velocity.current.y * dt;
    currentPos.current.z += velocity.current.z * dt;

    // Apply updated coordinates & transforms directly without object allocations
    meshRef.current.position.copy(currentPos.current);

    if (targetScale !== 1.0 || Math.abs(meshRef.current.scale.x - 1.0) > 0.005) {
      const currentScale = meshRef.current.scale.x;
      const newScale = THREE.MathUtils.damp(currentScale, targetScale, 10, dt);
      meshRef.current.scale.setScalar(newScale);
    }
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
    />
  );
};

// Helper function to split a fused dual-icon mesh (e.g. geometry_0.009 containing both the 'M' logo and circular emblem)
// into two fully independent, isolated Three.js BufferGeometries
function splitDualIconMesh(
  geometry: THREE.BufferGeometry,
  splitY: number = 0.068
): {
  topGeom: THREE.BufferGeometry;
  bottomGeom: THREE.BufferGeometry;
  topCenter: THREE.Vector3;
  bottomCenter: THREE.Vector3;
} {
  const posAttr = geometry.attributes.position;
  const normAttr = geometry.attributes.normal;
  const uvAttr = geometry.attributes.uv;
  const indexAttr = geometry.index;

  const topTriangles: [number, number, number][] = [];
  const bottomTriangles: [number, number, number][] = [];

  const triCount = indexAttr ? indexAttr.count / 3 : posAttr.count / 3;

  // Exact circle geometry parameters:
  // Center is (0.1194, -0.0598), with horizontal radius 0.1521 and vertical radius 0.1434.
  // The true top edge of the circle reaches Y = 0.0834 at the apex.
  const circleCenterX = 0.1194;
  const circleCenterY = -0.0598;
  const circleRadiusX = 0.1521;
  const circleRadiusY = 0.1434;

  const getCircleTopRimY = (x: number) => {
    const rx = (x - circleCenterX) / circleRadiusX;
    if (Math.abs(rx) > 1) return -Infinity;
    return circleCenterY + circleRadiusY * Math.sqrt(1 - rx * rx);
  };

  for (let t = 0; t < triCount; t++) {
    const i0 = indexAttr ? indexAttr.getX(t * 3) : t * 3;
    const i1 = indexAttr ? indexAttr.getX(t * 3 + 1) : t * 3 + 1;
    const i2 = indexAttr ? indexAttr.getX(t * 3 + 2) : t * 3 + 2;

    const y0 = posAttr.getY(i0);
    const y1 = posAttr.getY(i1);
    const y2 = posAttr.getY(i2);
    const avgY = (y0 + y1 + y2) / 3;

    const x0 = posAttr.getX(i0);
    const x1 = posAttr.getX(i1);
    const x2 = posAttr.getX(i2);
    const avgX = (x0 + x1 + x2) / 3;

    if (avgY < splitY) {
      // Uncontested bottom portion of the circular 'U' emblem
      bottomTriangles.push([i0, i1, i2]);
    } else {
      // In the upper portion (avgY >= splitY):
      const topRimY = getCircleTopRimY(avgX);

      // 1. Natural upper arc of the circular 'U' emblem:
      // Perfectly adheres to the circular outer rim (max Y ~ 0.0834).
      if (avgX >= 0.075 && avgY <= topRimY + 0.0005) {
        bottomTriangles.push([i0, i1, i2]);
      } 
      // 2. Connector artifact / stalk between the two icons (above the circle rim, below Maya):
      // Discarding these triangles eliminates both the black trait on the 'M' and the antenna/tick at the top of the 'U'.
      else if (avgX >= 0.075 && avgY < 0.104 && avgY > topRimY + 0.0005) {
        // Discard - belongs to neither icon
      } 
      // 3. Clean 'M' (Maya) logo:
      else {
        topTriangles.push([i0, i1, i2]);
      }
    }
  }

  function buildSubGeom(triangles: [number, number, number][]) {
    const usedVertices = new Map<number, number>();
    const newIndices: number[] = [];

    for (const tri of triangles) {
      for (const origV of tri) {
        let newV = usedVertices.get(origV);
        if (newV === undefined) {
          newV = usedVertices.size;
          usedVertices.set(origV, newV);
        }
        newIndices.push(newV);
      }
    }

    const count = usedVertices.size;
    const newPositions = new Float32Array(count * 3);
    const newNormals = normAttr ? new Float32Array(count * 3) : null;
    const newUVs = uvAttr ? new Float32Array(count * 2) : null;

    usedVertices.forEach((newV, origV) => {
      newPositions[newV * 3] = posAttr.getX(origV);
      newPositions[newV * 3 + 1] = posAttr.getY(origV);
      newPositions[newV * 3 + 2] = posAttr.getZ(origV);

      if (normAttr && newNormals) {
        newNormals[newV * 3] = normAttr.getX(origV);
        newNormals[newV * 3 + 1] = normAttr.getY(origV);
        newNormals[newV * 3 + 2] = normAttr.getZ(origV);
      }

      if (uvAttr && newUVs) {
        newUVs[newV * 2] = uvAttr.getX(origV);
        newUVs[newV * 2 + 1] = uvAttr.getY(origV);
      }
    });

    const newGeom = new THREE.BufferGeometry();
    newGeom.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
    if (newNormals) newGeom.setAttribute('normal', new THREE.BufferAttribute(newNormals, 3));
    if (newUVs) newGeom.setAttribute('uv', new THREE.BufferAttribute(newUVs, 2));
    newGeom.setIndex(newIndices);

    newGeom.computeBoundingBox();
    const center = new THREE.Vector3();
    newGeom.boundingBox?.getCenter(center);
    newGeom.center(); // Center geometry locally around (0,0,0)

    return { geom: newGeom, center };
  }

  const top = buildSubGeom(topTriangles);
  const bottom = buildSubGeom(bottomTriangles);

  return {
    topGeom: top.geom,
    bottomGeom: bottom.geom,
    topCenter: top.center,
    bottomCenter: bottom.center,
  };
}

// Component parsing the GLB file into individual centered meshes
const FloatingIconsScene: React.FC<FloatingIconsFieldProps> = ({ setCursorMode }) => {
  const gltf = useGLTF(MODEL_URL, DRACO_DECODER_PATH) as any;
  const { viewport } = useThree();

  // Dynamically scale icons so they fit comfortably inside the canvas on narrow mobile screens
  const responsiveScale = useMemo(() => {
    // Normal desktop spread is ~4.8 units
    return Math.min(1.0, Math.max(0.48, (viewport.width * 0.92) / 4.8));
  }, [viewport.width]);

  // Extract and center each mesh individually, sharing the single atlas material to avoid shader re-binding
  const iconMeshes = useMemo(() => {
    const meshes: Array<{
      id: string;
      name: string;
      geometry: THREE.BufferGeometry;
      material: THREE.Material;
      basePosition: THREE.Vector3;
    }> = [];

    // Find the master material from the GLTF scene and tune roughness/metalness once
    let masterMaterial: THREE.Material | null = null;
    gltf.scene.traverse((child: any) => {
      if (!masterMaterial && child.isMesh && child.material) {
        masterMaterial = child.material;
        if ((masterMaterial as any).isMeshStandardMaterial) {
          (masterMaterial as any).roughness = Math.max(0.14, (masterMaterial as any).roughness * 0.9);
          (masterMaterial as any).metalness = Math.min(0.95, (masterMaterial as any).metalness * 1.05);
        }
      }
    });

    const mat = masterMaterial || new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.2, metalness: 0.9 });

    let count = 0;
    gltf.scene.traverse((child: any) => {
      if (child.isMesh && child.geometry) {
        // Compute bounding box of the original mesh in model coordinates
        child.geometry.computeBoundingBox();
        const bbox = child.geometry.boundingBox;
        const center = new THREE.Vector3();
        bbox.getCenter(center);

        // Scale and map model position to wider viewport coordinates
        const spreadFactorX = 3.6;
        const spreadFactorY = 2.8;
        const spreadFactorZ = 2.0;

        // Detect if this mesh contains two fused icons (specifically geometry_0.009 which has both the 'M' logo and circular emblem)
        const isFusedDualIcon = child.name === 'geometry_0.009' || (bbox.max.y - bbox.min.y > 0.45 && Math.abs(center.x - 0.057) < 0.1);

        if (isFusedDualIcon) {
          // Split the single fused mesh into two completely distinct, isolated icons
          const { topGeom, bottomGeom, topCenter, bottomCenter } = splitDualIconMesh(child.geometry, 0.068);

          // Top icon ('M' logo) - separate upwards and slightly left
          const topPos = new THREE.Vector3(
            topCenter.x * spreadFactorX - 0.05,
            topCenter.y * spreadFactorY + 0.16,
            topCenter.z * spreadFactorZ
          );

          // Bottom icon (circular emblem) - separate downwards and slightly right
          const bottomPos = new THREE.Vector3(
            bottomCenter.x * spreadFactorX + 0.05,
            bottomCenter.y * spreadFactorY - 0.16,
            bottomCenter.z * spreadFactorZ
          );

          meshes.push({
            id: `icon-${count++}-top-m`,
            name: `${child.name}_top_M`,
            geometry: topGeom,
            material: mat,
            basePosition: topPos,
          });

          meshes.push({
            id: `icon-${count++}-bottom-circle`,
            name: `${child.name}_bottom_circle`,
            geometry: bottomGeom,
            material: mat,
            basePosition: bottomPos,
          });
          return;
        }

        // Clone and center the geometry locally around (0,0,0)
        const centeredGeom = child.geometry.clone();
        centeredGeom.center();

        const basePos = new THREE.Vector3(
          center.x * spreadFactorX,
          center.y * spreadFactorY,
          center.z * spreadFactorZ
        );

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

// Adaptive Render Controller: throttles R3F rendering to 45 FPS during active interaction,
// and 30 FPS when idle floating, preventing GPU overheating and fan noise on 120Hz/144Hz monitors.
const AdaptiveRenderController: React.FC = () => {
  const lastRenderTime = useRef(0);
  const isInteracting = useRef(false);
  const interactionTimer = useRef<any>(null);

  useEffect(() => {
    const handleMove = () => {
      isInteracting.current = true;
      if (interactionTimer.current) clearTimeout(interactionTimer.current);
      interactionTimer.current = setTimeout(() => {
        isInteracting.current = false;
      }, 1200);
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handleMove);
      if (interactionTimer.current) clearTimeout(interactionTimer.current);
    };
  }, []);

  useFrame((state) => {
    const targetFps = isInteracting.current ? 45 : 30;
    const interval = 1000 / targetFps;
    const now = performance.now();

    if (now - lastRenderTime.current >= interval) {
      lastRenderTime.current = now - ((now - lastRenderTime.current) % interval);
      state.gl.render(state.scene, state.camera);
    }
  }, 1);

  return null;
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

export const FloatingIconsField: React.FC<FloatingIconsFieldProps> = ({ setCursorMode, isPaused = false }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Check if already in or near view on initial load
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > -50) {
      setIsInView(true);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '50px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const shouldRender = isInView && isTabVisible && !isPaused;

  return (
    <section 
      ref={sectionRef}
      id="floating-icons" 
      className="relative w-full max-w-7xl mx-auto py-10 sm:py-16 px-2 sm:px-4 select-none overflow-hidden"
    >
      {/* Soft Ambient Background Glow strictly behind the 3D Canvas (using pure radial CSS gradient without GPU-heavy blur filter) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10 overflow-hidden">
        <div 
          className="w-full max-w-[620px] sm:max-w-[860px] lg:max-w-[1080px] h-[300px] sm:h-[400px] lg:h-[460px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(57,255,20,0.16)_0%,rgba(16,185,129,0.06)_40%,rgba(0,0,0,0)_70%)]" 
        />
      </div>

      {/* Seamless Transparent 3D Stage without frame or borders */}
      <div className="relative w-full h-[360px] sm:h-[480px] lg:h-[650px] overflow-hidden z-0">
        {/* R3F Canvas - throttled with AdaptiveRenderController & halts rendering when offscreen */}
        <Canvas
          frameloop={shouldRender ? 'always' : 'never'}
          camera={{ position: [0, 0, 5.4], fov: 45 }}
          className="w-full h-full"
          dpr={1}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'low-power',
            precision: 'mediump',
            stencil: false,
            depth: true,
          }}
        >
          {/* Framerate Controller: caps rendering to 45 FPS (moving) / 30 FPS (idle) */}
          <AdaptiveRenderController />

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

