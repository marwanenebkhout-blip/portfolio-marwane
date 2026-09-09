import React, { useRef, useState, useEffect, useMemo, Suspense, Component, ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Preload } from '@react-three/drei';
import * as THREE from 'three';
import { audio } from '../../utils/audio';
import { CursorMode } from '../../types';

class SceneErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; retries: number }> {
  state = { hasError: false, retries: 0 };
  private timer: any = null;

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('3D Floating Icons caught error, scheduling auto-recovery:', error);
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

interface FloatingIconsFieldProps {
  setCursorMode?: (mode: CursorMode, text?: string) => void;
  isPaused?: boolean;
}

interface FloatingIconsSceneProps extends FloatingIconsFieldProps {
  pointerActiveRef: React.MutableRefObject<boolean>;
}

interface SingleIconProps {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  basePosition: THREE.Vector3;
  index: number;
  name: string;
  setCursorMode?: (mode: CursorMode, text?: string) => void;
  pointerActiveRef: React.MutableRefObject<boolean>;
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
  pointerActiveRef,
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

  // Spring physics variables - initialized directly to resting base position
  const currentPos = useRef(basePosition.clone());
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const targetPos = useMemo(() => basePosition.clone(), [basePosition]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.04);
    const t = state.clock.getElapsedTime();

    // 1. Organic multi-axis levitation motion (while staying strictly facing forward)
    const levitateX = basePosition.x + Math.sin(t * params.floatSpeed * 0.7 + params.phase) * params.floatAmpX;
    const levitateY = basePosition.y + Math.sin(t * params.floatSpeed + params.phase) * params.floatAmpY;
    const levitateZ = basePosition.z + Math.cos(t * params.floatSpeed * 0.8 + params.phase) * params.floatAmpZ;

    let pushX = 0;
    let pushY = 0;
    let pushZ = 0;
    let targetScale = 1.0;

    // 2. Cursor repulsion physics - ONLY active when the user's mouse is hovering inside the canvas
    // Prevents phantom (0,0) center cursor from blowing all icons apart on initial scroll
    if (pointerActiveRef?.current) {
      const { pointer, viewport } = state;
      const cursorWorldX = pointer.x * (viewport.width * 0.5);
      const cursorWorldY = pointer.y * (viewport.height * 0.5);

      const dx = currentPos.current.x - cursorWorldX;
      const dy = currentPos.current.y - cursorWorldY;
      const dist2DSq = dx * dx + dy * dy;
      const repelRadiusSq = 3.61; // 1.9 * 1.9

      if (dist2DSq < repelRadiusSq) {
        const dist2D = Math.sqrt(dist2DSq);
        const force = Math.pow(1 - dist2D / 1.9, 1.6);
        const invDist = 1 / (dist2D + 0.0001);
        const dirX = dx * invDist;
        const dirY = dy * invDist;

        // Repel away from cursor on X/Y and project forward in +Z towards user
        pushX = dirX * force * 1.1;
        pushY = dirY * force * 0.75;
        pushZ = force * 0.85;

        targetScale = 1.0 + force * 0.22;
      }
    }

    const isRepelling = pointerActiveRef?.current && (pushX !== 0 || pushY !== 0 || pushZ !== 0);
    const hasVelocity = velocity.current.lengthSq() > 0.0001;

    // Calculate dynamic safe visible frustum boundaries at the icon depth
    const camZ = state.camera.position.z;
    const distToCam = Math.max(1.0, camZ - (basePosition.z + pushZ));
    const halfFovRad = THREE.MathUtils.degToRad((state.camera as any).fov ? (state.camera as any).fov * 0.5 : 22.5);
    const frustumHalfHeight = distToCam * Math.tan(halfFovRad);
    const frustumHalfWidth = frustumHalfHeight * (state.viewport.width / Math.max(0.001, state.viewport.height));

    const iconRadius = 0.38;
    const safeLimitY = Math.max(0.4, frustumHalfHeight - iconRadius);
    const safeLimitX = Math.max(0.4, frustumHalfWidth - iconRadius);

    let rawTargetX = levitateX + pushX;
    let rawTargetY = levitateY + pushY;
    let rawTargetZ = levitateZ + pushZ;

    // Soft elastic resistance on target Y so icon never shoots out of top or bottom of the canvas
    if (rawTargetY > safeLimitY) {
      const excess = rawTargetY - safeLimitY;
      rawTargetY = safeLimitY + Math.tanh(excess * 1.5) * 0.06;
    } else if (rawTargetY < -safeLimitY) {
      const excess = -safeLimitY - rawTargetY;
      rawTargetY = -safeLimitY - Math.tanh(excess * 1.5) * 0.06;
    }

    // Soft elastic resistance on target X
    if (rawTargetX > safeLimitX) {
      const excess = rawTargetX - safeLimitX;
      rawTargetX = safeLimitX + Math.tanh(excess * 1.5) * 0.06;
    } else if (rawTargetX < -safeLimitX) {
      const excess = -safeLimitX - rawTargetX;
      rawTargetX = -safeLimitX - Math.tanh(excess * 1.5) * 0.06;
    }

    if (isRepelling || hasVelocity) {
      targetPos.set(rawTargetX, rawTargetY, rawTargetZ);

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

      // Soft physical cushion if velocity pushes position past the visible boundary
      if (currentPos.current.y > safeLimitY + 0.05) {
        currentPos.current.y = safeLimitY + 0.05;
        if (velocity.current.y > 0) velocity.current.y *= -0.2;
      } else if (currentPos.current.y < -(safeLimitY + 0.05)) {
        currentPos.current.y = -(safeLimitY + 0.05);
        if (velocity.current.y < 0) velocity.current.y *= -0.2;
      }

      if (currentPos.current.x > safeLimitX + 0.05) {
        currentPos.current.x = safeLimitX + 0.05;
        if (velocity.current.x > 0) velocity.current.x *= -0.2;
      } else if (currentPos.current.x < -(safeLimitX + 0.05)) {
        currentPos.current.x = -(safeLimitX + 0.05);
        if (velocity.current.x < 0) velocity.current.x *= -0.2;
      }
    } else {
      currentPos.current.set(rawTargetX, rawTargetY, rawTargetZ);
      velocity.current.set(0, 0, 0);
    }

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
    velocity.current.z += 1.2;
    velocity.current.y += (Math.random() - 0.5) * 0.8;
    velocity.current.x += (Math.random() - 0.5) * 0.8;
  };

  return (
    <mesh
      ref={meshRef}
      position={[basePosition.x, basePosition.y, basePosition.z]}
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
const FloatingIconsScene: React.FC<FloatingIconsSceneProps> = ({ setCursorMode, pointerActiveRef }) => {
  const gltf = useGLTF(MODEL_URL, DRACO_DECODER_PATH) as any;
  const { viewport } = useThree();

  // Dynamically scale icons so they fit comfortably inside the canvas in both dimensions
  const responsiveScale = useMemo(() => {
    const scaleX = (viewport.width * 0.90) / 4.8;
    const scaleY = (viewport.height * 0.86) / 3.3;
    return Math.min(1.0, Math.max(0.46, Math.min(scaleX, scaleY)));
  }, [viewport.width, viewport.height]);

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

        // Scale and map model position to wider viewport coordinates with comfortable vertical margins
        const spreadFactorX = 3.6;
        const spreadFactorY = 2.45;
        const spreadFactorZ = 1.8;

        // Detect if this mesh contains two fused icons (specifically geometry_0.009 which has both the 'M' logo and circular emblem)
        const isFusedDualIcon = child.name === 'geometry_0.009' || (bbox.max.y - bbox.min.y > 0.45 && Math.abs(center.x - 0.057) < 0.1);

        if (isFusedDualIcon) {
          // Split the single fused mesh into two completely distinct, isolated icons
          const { topGeom, bottomGeom, topCenter, bottomCenter } = splitDualIconMesh(child.geometry, 0.068);

          // Top icon ('M' logo) - separate upwards and slightly left
          const topPos = new THREE.Vector3(
            topCenter.x * spreadFactorX - 0.05,
            topCenter.y * spreadFactorY + 0.14,
            topCenter.z * spreadFactorZ
          );

          // Bottom icon (circular emblem) - separate downwards and slightly right
          const bottomPos = new THREE.Vector3(
            bottomCenter.x * spreadFactorX + 0.05,
            bottomCenter.y * spreadFactorY - 0.14,
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
          pointerActiveRef={pointerActiveRef}
        />
      ))}
    </group>
  );
};

export const FloatingIconsField: React.FC<FloatingIconsFieldProps> = ({ setCursorMode, isPaused = false }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(!document.hidden);
  const pointerActiveRef = useRef(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      setIsTabVisible(visible);
      if (visible) {
        pointerActiveRef.current = false;
      }
    };
    const handleFocus = () => {
      setIsTabVisible(true);
    };
    const handleScroll = () => {
      // Deactivate repulsion during scrolling so icons remain undisturbed and in place
      pointerActiveRef.current = false;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Check if already in or near view on initial load
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 250 && rect.bottom > -250) {
      setIsInView(true);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '250px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const shouldRender = isInView && isTabVisible && !isPaused;

  return (
    <section 
      ref={sectionRef}
      id="floating-icons" 
      className="relative w-full py-12 sm:py-20 select-none overflow-visible"
    >
      {/* Soft Ambient Background Glow strictly behind the 3D Canvas - fully diffuse, seamless falloff to transparent black with no bounding box */}
      <div className="absolute -inset-y-32 inset-x-0 pointer-events-none flex items-center justify-center -z-10 overflow-visible">
        <div 
          className="w-full h-full max-w-6xl mx-auto bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(57,255,20,0.18)_0%,rgba(34,197,94,0.08)_28%,rgba(16,185,129,0.02)_52%,transparent_72%)]" 
        />
      </div>

      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4">
        {/* Seamless Transparent 3D Stage without frame, borders or clipping overflow */}
        <div 
          className="relative w-full h-[400px] sm:h-[540px] lg:h-[700px] z-0"
          onPointerEnter={(e) => {
            if (e.pointerType !== 'touch') {
              pointerActiveRef.current = true;
            }
          }}
          onPointerMove={(e) => {
            if (e.pointerType !== 'touch') {
              pointerActiveRef.current = true;
            }
          }}
          onPointerLeave={() => {
            pointerActiveRef.current = false;
          }}
          onPointerCancel={() => {
            pointerActiveRef.current = false;
          }}
        >
          <Canvas
            frameloop={shouldRender ? 'always' : 'never'}
            camera={{ position: [0, 0, 5.7], fov: 45 }}
            className="w-full h-full"
            style={{ background: 'transparent' }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
            }}
            dpr={1}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
            }}
          >
            {/* Clean Neutral Studio Lighting on Front of Icons */}
            <ambientLight intensity={0.9} />
            <directionalLight position={[4, 6, 5]} intensity={1.1} color="#ffffff" />
            <directionalLight position={[-4, 2, 4]} intensity={0.4} color="#f8fafc" />

            {/* Gentle Soft Backlight behind the icons (Z = -2.0) */}
            <pointLight position={[0, 0, -2.0]} intensity={1.1} color="#39FF14" distance={7} />

            {/* Suspense with Fallback and Error Boundary */}
            <Suspense fallback={null}>
              <SceneErrorBoundary>
                <FloatingIconsScene setCursorMode={setCursorMode} pointerActiveRef={pointerActiveRef} />
              </SceneErrorBoundary>
              <Preload all />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </section>
  );
};

