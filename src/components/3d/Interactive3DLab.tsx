import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { audio } from '../../utils/audio';
import { CursorMode } from '../../types';
import { Play, Sparkles, Sliders, RefreshCw, Cpu, Layers } from 'lucide-react';

interface Interactive3DLabProps {
  setCursorMode: (mode: CursorMode, text?: string) => void;
}

type GeometryType = 'torus-knot' | 'cyber-cube' | 'hyper-sphere' | 'monolith' | 'polyhedron';
type MaterialMode = 'CYBER_GLASS' | 'CHROME_LIQUID' | 'HOLO_WIREFRAME' | 'NEON_LAVA';

const InteractiveSculpture = ({
  geometry,
  materialMode,
  wireframe,
  distortion,
  rotationSpeed,
  setCursorMode,
}: {
  geometry: GeometryType;
  materialMode: MaterialMode;
  wireframe: boolean;
  distortion: number;
  rotationSpeed: number;
  setCursorMode: (mode: CursorMode, text?: string) => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * rotationSpeed * 0.8;
      meshRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  const getMaterialProps = () => {
    switch (materialMode) {
      case 'CHROME_LIQUID':
        return {
          color: '#ffffff',
          roughness: 0.05,
          metalness: 0.98,
          emissive: '#00f0ff',
          emissiveIntensity: 0.2,
        };
      case 'HOLO_WIREFRAME':
        return {
          color: '#00ff66',
          roughness: 0.1,
          metalness: 0.8,
          emissive: '#00ff66',
          emissiveIntensity: 0.8,
        };
      case 'NEON_LAVA':
        return {
          color: '#ff007f',
          roughness: 0.2,
          metalness: 0.6,
          emissive: '#ff6b00',
          emissiveIntensity: 0.6,
        };
      case 'CYBER_GLASS':
      default:
        return {
          color: '#111827',
          roughness: 0.1,
          metalness: 0.9,
          emissive: '#00ff66',
          emissiveIntensity: 0.35,
        };
    }
  };

  const matProps = getMaterialProps();

  return (
    <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2}>
      <mesh
        ref={meshRef}
        scale={hovered ? 1.35 : 1.2}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          audio.playKeyHover();
          setCursorMode('DRAG', 'ROTATE LAB OBJECT');
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          setCursorMode('DEFAULT');
        }}
      >
        {geometry === 'torus-knot' && <torusKnotGeometry args={[1.2, 0.4, 128, 32]} />}
        {geometry === 'cyber-cube' && <boxGeometry args={[1.8, 1.8, 1.8]} />}
        {geometry === 'hyper-sphere' && <icosahedronGeometry args={[1.6, 4]} />}
        {geometry === 'monolith' && <cylinderGeometry args={[0.9, 0.9, 2.5, 32]} />}
        {geometry === 'polyhedron' && <dodecahedronGeometry args={[1.6, 0]} />}

        <MeshDistortMaterial
          {...matProps}
          distort={distortion}
          speed={3}
          wireframe={wireframe}
        />
      </mesh>
    </Float>
  );
};

export const Interactive3DLab: React.FC<Interactive3DLabProps> = ({ setCursorMode }) => {
  const [geometry, setGeometry] = useState<GeometryType>('torus-knot');
  const [materialMode, setMaterialMode] = useState<MaterialMode>('CYBER_GLASS');
  const [wireframe, setWireframe] = useState(false);
  const [distortion, setDistortion] = useState(0.4);
  const [rotationSpeed, setRotationSpeed] = useState(1);

  const geometries: { id: GeometryType; label: string }[] = [
    { id: 'torus-knot', label: 'TORUS KNOT' },
    { id: 'cyber-cube', label: 'CUBE VOID' },
    { id: 'hyper-sphere', label: 'SPHERE MESH' },
    { id: 'monolith', label: 'MONOLITH' },
    { id: 'polyhedron', label: 'DODECA' },
  ];

  const materials: { id: MaterialMode; label: string; color: string }[] = [
    { id: 'CYBER_GLASS', label: 'CYBER GLASS', color: '#39FF14' },
    { id: 'CHROME_LIQUID', label: 'CHROME LIQUID', color: '#007BFF' },
    { id: 'HOLO_WIREFRAME', label: 'HOLO MATRIX', color: '#39FF14' },
    { id: 'NEON_LAVA', label: 'MAGMA SHADER', color: '#FF00FF' },
  ];

  return (
    <section id="experience3d" className="relative py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#39FF14] tracking-[0.3em] uppercase mb-2">
            <Cpu className="h-4 w-4" />
            <span>02 // LABORATOIRE 3D EXPÉRIMENTAL</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter italic text-white">
            Spatial 3D Playground
          </h2>
          <p className="mt-2 text-white/50 text-sm max-w-xl font-light">
            Manipulez les géométries, shaders GLSL et paramètres de déformation volumétrique en temps réel.
          </p>
        </div>

        <div className="mt-4 md:mt-0 font-mono text-[11px] text-white/40 flex items-center gap-2 bg-[#111113] px-3.5 py-1.5 rounded border border-white/10">
          <span className="h-1.5 w-1.5 rounded-full bg-[#39FF14] animate-ping" />
          <span>GPU WEBGL ENGINE READY</span>
        </div>
      </div>

      {/* Main Interactive Studio Canvas & Control Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#111113] border border-white/10 rounded-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

        {/* 3D Canvas Area (7 Cols) */}
        <div className="lg:col-span-7 h-[420px] sm:h-[500px] rounded-lg bg-black/70 border border-white/10 relative overflow-hidden">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.6} />
            <pointLight position={[5, 5, 5]} intensity={2} color="#39FF14" />
            <pointLight position={[-5, -5, -5]} intensity={2} color="#007BFF" />
            <pointLight position={[0, 5, -5]} intensity={1.5} color="#FF00FF" />

            <InteractiveSculpture
              geometry={geometry}
              materialMode={materialMode}
              wireframe={wireframe}
              distortion={distortion}
              rotationSpeed={rotationSpeed}
              setCursorMode={setCursorMode}
            />
          </Canvas>

          {/* Interactive Badge */}
          <div className="absolute bottom-4 left-4 font-mono text-[10px] text-white/70 bg-black/80 px-3 py-1 rounded border border-white/10 flex items-center gap-2">
            <Sparkles className="h-3 w-3 text-[#39FF14]" />
            <span>CLIQUEZ & GLISSEZ POUR TOURNER L'OBJET</span>
          </div>
        </div>

        {/* Control Console Deck (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 relative z-10">
          {/* Geometry Selector */}
          <div>
            <label className="block font-mono text-xs font-bold text-white/60 uppercase tracking-[0.2em] mb-2.5 flex items-center gap-2">
              <Layers className="h-3.5 w-3.5 text-[#39FF14]" />
              <span>GÉOMÉTRIE 3D</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {geometries.map((g) => (
                <button
                  key={g.id}
                  onClick={() => {
                    audio.playMechanicalClick();
                    setGeometry(g.id);
                  }}
                  className={`px-3 py-2 rounded font-mono text-[11px] font-semibold tracking-wider transition-all cursor-pointer ${
                    geometry === g.id
                      ? 'bg-[#39FF14] text-black shadow-[0_0_12px_rgba(57,255,20,0.5)] font-bold'
                      : 'bg-[#1a1a1d] text-white/60 border border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Shader Material Selector */}
          <div>
            <label className="block font-mono text-xs font-bold text-white/60 uppercase tracking-[0.2em] mb-2.5 flex items-center gap-2">
              <Sliders className="h-3.5 w-3.5 text-[#007BFF]" />
              <span>SHADER & MATÉRIAU</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {materials.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    audio.playMechanicalClick();
                    setMaterialMode(m.id);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded font-mono text-[11px] font-semibold tracking-wider transition-all border cursor-pointer ${
                    materialMode === m.id
                      ? 'bg-[#1a1a1d] border-[#39FF14] text-white shadow-lg'
                      : 'bg-[#161619] text-white/50 border-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: m.color }} />
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Realtime Sliders */}
          <div className="space-y-4 pt-2 border-t border-white/10">
            {/* Distortion Slider */}
            <div>
              <div className="flex justify-between font-mono text-[11px] text-white/50 mb-1">
                <span>DÉFORMATION ORGANIQUE</span>
                <span className="text-[#39FF14] font-bold">{Math.round(distortion * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1.2"
                step="0.05"
                value={distortion}
                onChange={(e) => {
                  setDistortion(parseFloat(e.target.value));
                }}
                className="w-full h-1.5 bg-[#222226] rounded-lg appearance-none cursor-pointer accent-[#39FF14]"
              />
            </div>

            {/* Rotation Speed Slider */}
            <div>
              <div className="flex justify-between font-mono text-[11px] text-white/50 mb-1">
                <span>VITESSE DE ROTATION</span>
                <span className="text-[#007BFF] font-bold">{rotationSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={rotationSpeed}
                onChange={(e) => {
                  setRotationSpeed(parseFloat(e.target.value));
                }}
                className="w-full h-1.5 bg-[#222226] rounded-lg appearance-none cursor-pointer accent-[#007BFF]"
              />
            </div>

            {/* Wireframe Matrix Toggle */}
            <div className="flex items-center justify-between pt-2">
              <span className="font-mono text-[11px] text-white/60">AFFICHAGE MATRIX WIREFRAME</span>
              <button
                onClick={() => {
                  audio.playKeyHover();
                  setWireframe(!wireframe);
                }}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors cursor-pointer ${
                  wireframe ? 'bg-[#39FF14]' : 'bg-[#222226]'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-black transition-transform ${
                    wireframe ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
