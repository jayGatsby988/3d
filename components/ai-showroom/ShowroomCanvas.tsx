'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import useShowroomStore from '@/lib/showroomStore';
import ProceduralKitchen from './ProceduralKitchen';
import type { SceneAnalysis } from '@/app/api/analyze-kitchen/route';

/** Default scene when no analysis is provided */
const DEFAULT_SCENE: SceneAnalysis = {
  room: {
    layout: 'L-shaped',
    widthFeet: 14,
    depthFeet: 12,
    ceilingHeightFeet: 9,
    style: 'modern',
  },
  cabinets: {
    present: true,
    style: 'shaker',
    color: '#F5F5F5',
    upperColor: '#F5F5F5',
    isTwoTone: false,
    finish: 'satin',
    hardware: 'pulls',
    hardwareColor: '#C0C0C0',
    upperCabinets: true,
    hasGlassFronts: false,
    baseHeight: 36,
    upperHeight: 30,
    baseDepth: 24,
    upperDepth: 12,
    runs: [
      { wall: 'back', startX: 0, lengthFeet: 10, hasUpperCabinets: true, baseCabinetCount: 5, upperCabinetCount: 4 },
      { wall: 'left', startX: 0, lengthFeet: 6, hasUpperCabinets: true, baseCabinetCount: 3, upperCabinetCount: 2 },
    ],
  },
  island: {
    present: false,
    type: 'island',
    lengthFeet: 0,
    widthFeet: 0,
    color: '#F5F5F5',
    hasSeating: false,
    seatingCount: 0,
    hasWaterfallEdge: false,
    attachedToWall: 'none',
  },
  countertops: {
    material: 'quartz',
    color: '#F8F8F8',
    pattern: 'veined',
    thickness: 'thick',
  },
  backsplash: {
    present: true,
    type: 'subway-tile',
    color: '#FFFFFF',
    height: 'full-height',
  },
  flooring: {
    material: 'hardwood',
    color: '#6B5344',
    pattern: 'herringbone',
  },
  walls: {
    color: '#FAFAFA',
    accent: false,
    accentWall: 'none',
    accentColor: '#FAFAFA',
    ceilingColor: '#FFFFFF',
  },
  windows: [
    { wall: 'back', positionX: 4, widthFeet: 4, heightFeet: 4, bottomFromFloor: 3.5, style: 'standard' },
  ],
  doors: [],
  lighting: {
    pendants: { present: true, count: 3, style: 'globe', color: '#D4AF37', glassColor: '#FFFFFF' },
    recessed: { present: true, count: 6 },
    underCabinet: true,
    chandelier: false,
  },
  woodAccents: {
    present: false,
    color: '#8B5A2B',
    locations: [],
  },
  appliances: {
    rangeHood: { present: true, style: 'wall-mount', material: 'stainless', wall: 'back', positionAlongWall: 0.5 },
    refrigerator: { present: true, style: 'french-door', color: '#C0C0C0', wall: 'left', positionAlongWall: 0.95, widthFeet: 3 },
    oven: { present: false, type: 'wall-oven', color: '#2D2D2D', wall: 'back', positionAlongWall: 0.3 },
    range: { present: true, type: 'gas', color: '#2D2D2D', widthInches: 30, wall: 'back', positionAlongWall: 0.5 },
    cooktop: { present: false, type: 'gas', color: '#2D2D2D', wall: 'back', positionAlongWall: 0.5 },
    dishwasher: { present: true, wall: 'back', positionAlongWall: 0.35 },
    sink: { present: true, style: 'farmhouse', material: 'stainless', wall: 'back', positionAlongWall: 0.5 },
    microwave: { present: false, location: 'over-range', wall: 'back', positionAlongWall: 0.5 },
    wineFridge: { present: false, location: 'under-counter', wall: 'back', positionAlongWall: 0.8 },
  },
  openShelving: {
    present: false,
    wall: 'back',
    positionAlongWall: 0.8,
    widthFeet: 2,
    shelfCount: 3,
    color: '#8B5A2B',
  },
  aesthetic: {
    luxuryScore: 8,
    modernScore: 8,
    warmthScore: 7,
    brightnessScore: 8,
  },
  description: 'Modern L-shaped kitchen with white shaker cabinets and herringbone hardwood floors.',
  confidence: 1,
};

/** Scene wrapper with proper lighting */
function SceneWrapper() {
  return (
    <>
      {/* Scene lighting is handled inside ProceduralKitchen */}
      <ProceduralKitchen />
      
      {/* Contact shadows for grounding */}
      <ContactShadows 
        position={[0, -0.01, 0]} 
        opacity={0.4} 
        scale={30} 
        blur={2} 
        far={8}
        color="#1a1a2e"
      />
    </>
  );
}

export default function ShowroomCanvas() {
  const autoRotate = useShowroomStore((s) => s.autoRotate);
  const sceneAnalysis = useShowroomStore((s) => s.sceneAnalysis);
  
  // Use the analyzed scene or default
  const scene = sceneAnalysis || DEFAULT_SCENE;
  
  // Calculate camera position based on room size
  const roomSize = Math.max(scene.room.widthFeet, scene.room.depthFeet);
  const cameraDistance = roomSize * 1.2;

  return (
    <div 
      className="w-full h-full rounded-2xl overflow-hidden shadow-inner" 
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
      }}
    >
      <Canvas
        camera={{ 
          position: [cameraDistance, scene.room.ceilingHeightFeet * 0.8, cameraDistance], 
          fov: 50,
          near: 0.1,
          far: 100,
        }}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: 3, // ACESFilmicToneMapping
          toneMappingExposure: 1.0,
        }}
        dpr={[1, 2]}
      >
        {/* Subtle fog for atmosphere */}
        <fog attach="fog" args={['#1a1a2e', 25, 60]} />
        
        <Suspense fallback={null}>
          <SceneWrapper />
          
          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            autoRotate={autoRotate}
            autoRotateSpeed={0.25}
            minDistance={5}
            maxDistance={25}
            maxPolarAngle={Math.PI / 2.05}
            minPolarAngle={Math.PI / 8}
            enableDamping
            dampingFactor={0.05}
            target={[0, scene.room.ceilingHeightFeet / 3, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
