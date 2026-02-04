'use client';

/**
 * HYPER-REALISTIC PROCEDURAL KITCHEN
 * - All customizer options work perfectly
 * - Detailed PBR materials with refined colors
 * - Dramatic lighting scene differences
 * - Island add option with themed generation
 * - Exact cabinet counts from GPT analysis
 */

import { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import useShowroomStore from '@/lib/showroomStore';

// ============================================================================
// MATERIAL MAPPINGS - Match EXACTLY with customizer names
// REFINED BLACK TONES: Using sophisticated charcoal/slate instead of pure black
// ============================================================================

const CABINET_MATERIALS: Record<string, { color: string; roughness: number; metalness: number }> = {
  // Whites & Creams
  'Shaker White': { color: '#FAFAFA', roughness: 0.45, metalness: 0.02 },
  'Shaker Cream': { color: '#F5F0E6', roughness: 0.45, metalness: 0.02 },
  'High-Gloss White': { color: '#FFFFFF', roughness: 0.03, metalness: 0.1 },
  // Grays
  'Dove Gray Shaker': { color: '#A8A8A8', roughness: 0.45, metalness: 0.02 },
  'Charcoal Shaker': { color: '#4A4A4D', roughness: 0.45, metalness: 0.02 },
  'High-Gloss Charcoal': { color: '#3A3A3D', roughness: 0.03, metalness: 0.12 },
  // Blues & Greens
  'Navy Blue Shaker': { color: '#2C3E50', roughness: 0.45, metalness: 0.02 },
  'Sage Green': { color: '#9CAF88', roughness: 0.45, metalness: 0.02 },
  'Hunter Green': { color: '#355E3B', roughness: 0.45, metalness: 0.02 },
  // Natural Woods
  'Natural Maple': { color: '#E8D5B7', roughness: 0.42, metalness: 0.02 },
  'White Oak': { color: '#D4C8B0', roughness: 0.42, metalness: 0.02 },
  'Walnut': { color: '#5D4E37', roughness: 0.42, metalness: 0.02 },
  'Espresso Oak': { color: '#4A3C2A', roughness: 0.48, metalness: 0.02 },
  // Modern
  'Matte Black': { color: '#2D2D30', roughness: 0.55, metalness: 0.05 },
  'Flat Panel White': { color: '#F5F5F5', roughness: 0.35, metalness: 0.02 },
  'Flat Panel Gray': { color: '#808080', roughness: 0.35, metalness: 0.02 },
  // Legacy names for backwards compatibility
  'Shaker MDF': { color: '#FAFAFA', roughness: 0.45, metalness: 0.02 },
  'Solid Maple': { color: '#E8D5B7', roughness: 0.42, metalness: 0.02 },
  'Rift Oak': { color: '#4A3C2A', roughness: 0.48, metalness: 0.02 },
  'High-Gloss Euro': { color: '#3A3A3D', roughness: 0.03, metalness: 0.12 },
};

const COUNTERTOP_MATERIALS: Record<string, { color: string; roughness: number; metalness: number; hasVeins?: boolean }> = {
  // Quartz Options
  'Pure White Quartz': { color: '#F8F8F8', roughness: 0.12, metalness: 0.05 },
  'Calacatta Quartz': { color: '#FEFEFE', roughness: 0.08, metalness: 0.05, hasVeins: true },
  'Carrara Quartz': { color: '#F5F5F0', roughness: 0.1, metalness: 0.05, hasVeins: true },
  'Gray Quartz': { color: '#B8B8B8', roughness: 0.12, metalness: 0.05 },
  'Concrete Look': { color: '#9A9A9A', roughness: 0.35, metalness: 0.02 },
  // Natural Stone
  'Black Granite': { color: '#2A2A2A', roughness: 0.2, metalness: 0.1 },
  'Speckled Granite': { color: '#7A7A7A', roughness: 0.22, metalness: 0.08 },
  'Real Marble': { color: '#FEFEFE', roughness: 0.06, metalness: 0.05, hasVeins: true },
  // Wood & Specialty
  'Butcher Block': { color: '#C4A882', roughness: 0.5, metalness: 0.0 },
  'Ultra-Compact Dekton': { color: '#E8E8E8', roughness: 0.06, metalness: 0.1 },
  'Stainless Steel': { color: '#D0D0D0', roughness: 0.15, metalness: 0.95 },
  // Legacy names
  'Quartz': { color: '#F5F5F5', roughness: 0.12, metalness: 0.05 },
  'Granite': { color: '#5A5A5A', roughness: 0.22, metalness: 0.08 },
  'Marble-Look Quartz': { color: '#FEFEFE', roughness: 0.08, metalness: 0.05, hasVeins: true },
  'Ultra-Compact Surface': { color: '#E8E8E8', roughness: 0.06, metalness: 0.1 },
};

const FLOORING_MATERIALS: Record<string, { color: string; roughness: number; type: string }> = {
  // Vinyl Plank
  'LVP Light Oak': { color: '#D4C4A8', roughness: 0.4, type: 'plank' },
  'LVP Gray Wash': { color: '#A8A098', roughness: 0.4, type: 'plank' },
  'LVP Dark Walnut': { color: '#5D4E37', roughness: 0.4, type: 'plank' },
  // Hardwood
  'White Oak Natural': { color: '#D4C8B0', roughness: 0.35, type: 'plank' },
  'White Oak Gray': { color: '#A8A098', roughness: 0.35, type: 'plank' },
  'Solid Walnut': { color: '#5D4E37', roughness: 0.35, type: 'plank' },
  'Herringbone Oak': { color: '#C4B090', roughness: 0.35, type: 'herringbone' },
  // Tile
  'Porcelain White': { color: '#F5F5F5', roughness: 0.15, type: 'tile' },
  'Porcelain Gray': { color: '#B0B0B0', roughness: 0.15, type: 'tile' },
  'Porcelain Wood-Look': { color: '#C4A882', roughness: 0.25, type: 'plank' },
  'Terrazzo': { color: '#E8E4E0', roughness: 0.2, type: 'terrazzo' },
  'Marble Tile': { color: '#FEFEFE', roughness: 0.1, type: 'tile' },
  'White Oak Engineered': { color: '#D8CEB8', roughness: 0.35, type: 'plank' },
  'Natural Oak Engineered': { color: '#C4A872', roughness: 0.35, type: 'plank' },
  'Hickory Hardwood': { color: '#B89868', roughness: 0.38, type: 'plank' },
  'Walnut Hardwood': { color: '#5D4E37', roughness: 0.3, type: 'plank' },
  'Ebony Stained Oak': { color: '#3A3530', roughness: 0.32, type: 'plank' },
  'White Porcelain Tile': { color: '#F5F5F5', roughness: 0.12, type: 'tile' },
  'Gray Porcelain Tile': { color: '#B8B8B8', roughness: 0.15, type: 'tile' },
  'LVP Standard': { color: '#B8A898', roughness: 0.4, type: 'plank' },
  'Engineered Hardwood': { color: '#9C7B5C', roughness: 0.35, type: 'plank' },
  'Porcelain Tile': { color: '#D8D0C8', roughness: 0.15, type: 'tile' },
  'Solid Hardwood': { color: '#7A5D45', roughness: 0.3, type: 'plank' },
};

const BACKSPLASH_MATERIALS: Record<string, { color: string; roughness: number; pattern?: string }> = {
  // Subway & Metro
  'White Subway Tile': { color: '#FFFFFF', roughness: 0.25, pattern: 'subway' },
  'Gray Subway Tile': { color: '#B8B8B8', roughness: 0.25, pattern: 'subway' },
  'Black Subway Tile': { color: '#2D2D30', roughness: 0.25, pattern: 'subway' },
  'Beveled Subway': { color: '#FAFAFA', roughness: 0.2, pattern: 'subway' },
  // Patterns
  'Herringbone Tile': { color: '#FFFFFF', roughness: 0.25, pattern: 'herringbone' },
  'Hexagon Mosaic': { color: '#F5F5F5', roughness: 0.25, pattern: 'hexagon' },
  'Chevron Tile': { color: '#FFFFFF', roughness: 0.25, pattern: 'chevron' },
  // Slab & Stone
  'Marble Slab': { color: '#FEFEFE', roughness: 0.08, pattern: 'slab' },
  'Quartz Slab': { color: '#F5F5F5', roughness: 0.1, pattern: 'slab' },
  'Porcelain Slab': { color: '#E8E8E8', roughness: 0.12, pattern: 'slab' },
  // Specialty
  'Back-Painted Glass': { color: '#E8F0F5', roughness: 0.02, pattern: 'glass' },
  'Wood Plank': { color: '#C4A882', roughness: 0.4, pattern: 'plank' },
  'Stainless Panel': { color: '#D0D0D0', roughness: 0.15, pattern: 'metal' },
  // Legacy names
  'Subway Tile': { color: '#FFFFFF', roughness: 0.25, pattern: 'subway' },
  'Large-Format Porcelain': { color: '#F5F5F0', roughness: 0.12, pattern: 'slab' },
  'Glass Mosaic': { color: '#E8F4F8', roughness: 0.05, pattern: 'mosaic' },
  'Natural Stone Slab': { color: '#FEFEFE', roughness: 0.08, pattern: 'slab' },
};

const HARDWARE_MATERIALS: Record<string, { color: string; roughness: number; metalness: number }> = {
  // Silver Tones
  'Brushed Nickel': { color: '#C0C0C0', roughness: 0.35, metalness: 0.9 },
  'Polished Chrome': { color: '#E8E8E8', roughness: 0.1, metalness: 0.95 },
  'Stainless Steel': { color: '#D0D0D0', roughness: 0.25, metalness: 0.9 },
  // Black & Dark
  'Matte Black': { color: '#2D2D30', roughness: 0.5, metalness: 0.85 },
  'Oil-Rubbed Bronze': { color: '#3D2B1F', roughness: 0.5, metalness: 0.8 },
  'Gunmetal': { color: '#4A4A4A', roughness: 0.4, metalness: 0.88 },
  // Gold & Brass
  'Satin Brass': { color: '#C9A227', roughness: 0.35, metalness: 0.88 },
  'Polished Brass': { color: '#D4AF37', roughness: 0.15, metalness: 0.92 },
  'Champagne Bronze': { color: '#B89F7D', roughness: 0.3, metalness: 0.85 },
  'Antique Brass': { color: '#B5A642', roughness: 0.45, metalness: 0.85 },
  // Copper & Rose
  'Copper': { color: '#B87333', roughness: 0.35, metalness: 0.88 },
  'Rose Gold': { color: '#E8B4B4', roughness: 0.25, metalness: 0.85 },
  // Legacy
  'Oil Rubbed Bronze': { color: '#3D2B1F', roughness: 0.5, metalness: 0.8 },
  'Brushed Gold': { color: '#D4AF37', roughness: 0.3, metalness: 0.9 },
};

const LIGHTING_STYLES: Record<string, { type: string; fixtureColor: string; glowIntensity: number; glassColor?: string }> = {
  // Pendant Styles
  'Globe Pendants': { type: 'globe', fixtureColor: '#C0C0C0', glowIntensity: 0.7 },
  'Drum Pendants': { type: 'drum', fixtureColor: '#F5F5F0', glowIntensity: 0.6 },
  'Cone Pendants': { type: 'cone', fixtureColor: '#4A4A4D', glowIntensity: 0.7 },
  'Dome Pendants': { type: 'dome', fixtureColor: '#4A4A4D', glowIntensity: 0.7 },
  'Industrial Pendants': { type: 'industrial', fixtureColor: '#2D2D30', glowIntensity: 0.8 },
  'Linear Pendant': { type: 'linear', fixtureColor: '#C0C0C0', glowIntensity: 0.6 },
  'Amber Glass Pendants': { type: 'amber-glass', fixtureColor: '#D4AF37', glowIntensity: 0.8, glassColor: '#F5A623' },
  'Smoke Glass Pendants': { type: 'smoke-glass', fixtureColor: '#4A4A4A', glowIntensity: 0.7, glassColor: '#6B6B6B' },
  'Crystal Pendants': { type: 'crystal', fixtureColor: '#E8E8E8', glowIntensity: 0.9 },
  'Sputnik Chandelier': { type: 'sputnik', fixtureColor: '#D4AF37', glowIntensity: 0.85 },
  // Metal Finishes
  'Brass Fixtures': { type: 'globe', fixtureColor: '#D4AF37', glowIntensity: 0.7 },
  'Matte Black Fixtures': { type: 'cone', fixtureColor: '#2D2D30', glowIntensity: 0.75 },
  'Chrome Fixtures': { type: 'globe', fixtureColor: '#E8E8E8', glowIntensity: 0.7 },
  'Copper Fixtures': { type: 'globe', fixtureColor: '#B87333', glowIntensity: 0.75 },
};

// ============================================================================
// REALISTIC FLOOR COMPONENTS
// ============================================================================

function RealisticPlankFloor({ 
  size, 
  color, 
  roughness = 0.35 
}: { 
  size: [number, number]; 
  color: string; 
  roughness?: number;
}) {
  const planks = useMemo(() => {
    const result: Array<{ x: number; z: number; rot: number; shade: number; length: number }> = [];
    const plankWidth = 0.5; // Width of each plank
    const plankLengthBase = 3.5; // Length of each plank
    const gap = 0.015; // Small gap between planks
    
    for (let z = -size[1] / 2; z < size[1] / 2; z += plankWidth + gap) {
      let xPos = -size[0] / 2;
      // Stagger each row
      if (Math.floor((z + size[1] / 2) / (plankWidth + gap)) % 2 === 1) {
        xPos -= plankLengthBase / 2;
      }
      while (xPos < size[0] / 2) {
        const length = plankLengthBase + (Math.random() - 0.5) * 0.5;
        result.push({
          x: xPos + length / 2,
          z: z + plankWidth / 2,
          rot: 0,
          shade: 0.9 + Math.random() * 0.2,
          length,
        });
        xPos += length + gap;
      }
    }
    return result;
  }, [size]);

  // Gap color derived from plank color (darker)
  const gapColor = useMemo(() => {
    return new THREE.Color(color).multiplyScalar(0.5);
  }, [color]);

  return (
    <group>
      {/* Gap/subfloor - color derived from plank color */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow>
        <planeGeometry args={size} />
        <meshStandardMaterial color={gapColor} roughness={0.9} />
      </mesh>
      {planks.map((p, i) => {
        if (Math.abs(p.x) > size[0] / 2 + 2 || Math.abs(p.z) > size[1] / 2 + 1) return null;
        const plankColor = new THREE.Color(color).multiplyScalar(p.shade);
        return (
          <mesh key={i} position={[p.x, 0.001, p.z]} rotation={[-Math.PI / 2, p.rot, 0]} receiveShadow>
            <planeGeometry args={[p.length - 0.01, 0.48]} />
            <meshStandardMaterial color={plankColor} roughness={roughness} metalness={0.02} />
          </mesh>
        );
      })}
    </group>
  );
}

function HerringboneFloor({ 
  size, 
  color, 
  roughness = 0.32 
}: { 
  size: [number, number]; 
  color: string; 
  roughness?: number;
}) {
  // Create a proper herringbone pattern with interlocking planks
  const planks = useMemo(() => {
    const result: Array<{ x: number; z: number; rot: number; shade: number; width: number; length: number }> = [];
    const plankWidth = 0.15; // Width of each plank (narrower for herringbone)
    const plankLength = 0.6; // Length of each plank
    const gap = 0.005; // Very small gap
    
    // Calculate the diagonal offset for herringbone pattern
    const diagOffset = plankLength * Math.cos(Math.PI / 4);
    const rowHeight = plankWidth * Math.cos(Math.PI / 4) * 2;
    
    let rowIdx = 0;
    for (let z = -size[1] / 2 - 2; z < size[1] / 2 + 2; z += rowHeight) {
      const isEvenRow = rowIdx % 2 === 0;
      for (let col = -size[0] / 2 - 2; col < size[0] / 2 + 2; col += diagOffset * 2) {
        // First plank (angled one way)
        result.push({
          x: col + (isEvenRow ? 0 : diagOffset),
          z: z,
          rot: Math.PI / 4,
          shade: 0.92 + Math.random() * 0.16,
          width: plankWidth,
          length: plankLength,
        });
        // Second plank (angled other way)
        result.push({
          x: col + diagOffset + (isEvenRow ? 0 : diagOffset),
          z: z,
          rot: -Math.PI / 4,
          shade: 0.92 + Math.random() * 0.16,
          width: plankWidth,
          length: plankLength,
        });
      }
      rowIdx++;
    }
    return result;
  }, [size]);

  // Base floor color (solid underneath)
  const baseColor = useMemo(() => {
    return new THREE.Color(color).multiplyScalar(0.95);
  }, [color]);

  return (
    <group>
      {/* Solid base floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <planeGeometry args={[size[0] + 4, size[1] + 4]} />
        <meshStandardMaterial color={baseColor} roughness={0.5} />
      </mesh>
      {/* Herringbone planks on top */}
      {planks.map((p, i) => {
        // Only render planks within visible area
        if (Math.abs(p.x) > size[0] / 2 + 1 || Math.abs(p.z) > size[1] / 2 + 1) return null;
        const plankColor = new THREE.Color(color).multiplyScalar(p.shade);
        return (
          <mesh key={i} position={[p.x, 0.002, p.z]} rotation={[-Math.PI / 2, p.rot, 0]} receiveShadow>
            <planeGeometry args={[p.length, p.width]} />
            <meshStandardMaterial color={plankColor} roughness={roughness} metalness={0.02} />
          </mesh>
        );
      })}
    </group>
  );
}

function RealisticTileFloor({ 
  size, 
  color, 
  roughness = 0.15,
  tileSize = 2.0,
}: { 
  size: [number, number]; 
  color: string; 
  roughness?: number;
  tileSize?: number;
}) {
  const tiles = useMemo(() => {
    const result: Array<{ x: number; z: number; shade: number }> = [];
    const gap = 0.02; // Very thin grout line
    for (let x = -size[0] / 2; x < size[0] / 2; x += tileSize + gap) {
      for (let z = -size[1] / 2; z < size[1] / 2; z += tileSize + gap) {
        result.push({
          x: x + tileSize / 2,
          z: z + tileSize / 2,
          shade: 0.97 + Math.random() * 0.06, // Subtle variation
        });
      }
    }
    return result;
  }, [size, tileSize]);

  // Grout color is slightly darker than tile color
  const groutColor = useMemo(() => {
    return new THREE.Color(color).multiplyScalar(0.7);
  }, [color]);

  return (
    <group>
      {/* Grout base - color derived from tile */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow>
        <planeGeometry args={size} />
        <meshStandardMaterial color={groutColor} roughness={0.9} />
      </mesh>
      {tiles.map((t, i) => {
        const tileColor = new THREE.Color(color).multiplyScalar(t.shade);
        return (
          <mesh key={i} position={[t.x, 0.001, t.z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[tileSize - 0.02, tileSize - 0.02]} />
            <meshStandardMaterial color={tileColor} roughness={roughness} metalness={0.02} />
          </mesh>
        );
      })}
    </group>
  );
}

function RealisticTerrazzoFloor({ 
  size, 
  color 
}: { 
  size: [number, number]; 
  color: string;
}) {
  // Create speckles/chips for terrazzo effect
  const speckles = useMemo(() => {
    const result: Array<{ x: number; z: number; size: number; color: string }> = [];
    const speckleColors = ['#8B7355', '#4A4A4A', '#D4C4B0', '#6B5B4F', '#3D3D3D', '#B8A090'];
    const count = Math.floor(size[0] * size[1] * 15); // Density of speckles
    
    for (let i = 0; i < count; i++) {
      result.push({
        x: (Math.random() - 0.5) * size[0],
        z: (Math.random() - 0.5) * size[1],
        size: 0.02 + Math.random() * 0.06,
        color: speckleColors[Math.floor(Math.random() * speckleColors.length)],
      });
    }
    return result;
  }, [size]);

  return (
    <group>
      {/* Base floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={size} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.05} />
      </mesh>
      {/* Speckles */}
      {speckles.map((s, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[s.x, 0.001, s.z]}>
          <circleGeometry args={[s.size, 6]} />
          <meshStandardMaterial color={s.color} roughness={0.3} metalness={0.02} />
        </mesh>
      ))}
    </group>
  );
}

// ============================================================================
// REALISTIC CABINET
// ============================================================================

function RealisticCabinet({
  position,
  width,
  height,
  depth,
  material,
  hardwareMat,
  isPremiumHardware,
  isUpper = false,
  isDrawer = false,
}: {
  position: [number, number, number];
  width: number;
  height: number;
  depth: number;
  material: { color: string; roughness: number; metalness: number };
  hardwareMat: { color: string; roughness: number; metalness: number };
  isPremiumHardware: boolean;
  isUpper?: boolean;
  isDrawer?: boolean;
}) {
  const pullLength = isPremiumHardware ? 0.15 : 0.1;
  const pullRadius = 0.01;
  const doorGap = 0.006;
  const frameWidth = 0.05; // Shaker frame width
  const panelRecess = 0.008;
  const doorThickness = 0.02;
  
  const drawerCount = isDrawer ? Math.min(4, Math.max(2, Math.floor(height / 0.5))) : 1;
  const drawerH = (height - (drawerCount + 1) * doorGap) / drawerCount;
  
  // Darker shade for depth/shadow
  const shadowColor = useMemo(() => {
    const c = new THREE.Color(material.color);
    c.multiplyScalar(0.88);
    return '#' + c.getHexString();
  }, [material.color]);
  
  // Lighter for highlights
  const highlightColor = useMemo(() => {
    const c = new THREE.Color(material.color);
    c.multiplyScalar(1.05);
    return '#' + c.getHexString();
  }, [material.color]);
  
  const isWide = width > 0.65;
  
  // Render shaker door panel
  const renderDoorPanel = (doorW: number, doorH: number, xOff: number, yOff: number) => (
    <group position={[xOff, yOff, depth / 2]}>
      {/* Door base */}
      <mesh position={[0, 0, doorThickness / 2]} castShadow>
        <boxGeometry args={[doorW - doorGap, doorH - doorGap, doorThickness]} />
        <meshStandardMaterial color={material.color} roughness={material.roughness} metalness={material.metalness} />
      </mesh>
      
      {/* Shaker frame - raised border */}
      {/* Top rail */}
      <mesh position={[0, (doorH - doorGap) / 2 - frameWidth / 2, doorThickness + 0.002]} castShadow>
        <boxGeometry args={[doorW - doorGap - 0.004, frameWidth, 0.004]} />
        <meshStandardMaterial color={highlightColor} roughness={material.roughness - 0.05} metalness={material.metalness} />
      </mesh>
      {/* Bottom rail */}
      <mesh position={[0, -(doorH - doorGap) / 2 + frameWidth / 2, doorThickness + 0.002]} castShadow>
        <boxGeometry args={[doorW - doorGap - 0.004, frameWidth, 0.004]} />
        <meshStandardMaterial color={highlightColor} roughness={material.roughness - 0.05} metalness={material.metalness} />
      </mesh>
      {/* Left stile */}
      <mesh position={[-(doorW - doorGap) / 2 + frameWidth / 2, 0, doorThickness + 0.002]} castShadow>
        <boxGeometry args={[frameWidth, doorH - doorGap - frameWidth * 2, 0.004]} />
        <meshStandardMaterial color={highlightColor} roughness={material.roughness - 0.05} metalness={material.metalness} />
      </mesh>
      {/* Right stile */}
      <mesh position={[(doorW - doorGap) / 2 - frameWidth / 2, 0, doorThickness + 0.002]} castShadow>
        <boxGeometry args={[frameWidth, doorH - doorGap - frameWidth * 2, 0.004]} />
        <meshStandardMaterial color={highlightColor} roughness={material.roughness - 0.05} metalness={material.metalness} />
      </mesh>
      
      {/* Recessed center panel */}
      <mesh position={[0, 0, doorThickness - panelRecess]}>
        <boxGeometry args={[doorW - doorGap - frameWidth * 2 - 0.01, doorH - doorGap - frameWidth * 2 - 0.01, panelRecess]} />
        <meshStandardMaterial color={shadowColor} roughness={material.roughness + 0.08} metalness={material.metalness} />
      </mesh>
      
      {/* Shadow line around recessed panel */}
      <mesh position={[0, 0, doorThickness - 0.001]}>
        <boxGeometry args={[doorW - doorGap - frameWidth * 2 + 0.005, doorH - doorGap - frameWidth * 2 + 0.005, 0.002]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.06} />
      </mesh>
    </group>
  );
  
  // Render drawer front
  const renderDrawerFront = (drawerW: number, dH: number, yOff: number) => (
    <group position={[0, yOff, depth / 2]}>
      {/* Drawer panel */}
      <mesh position={[0, 0, doorThickness / 2]} castShadow>
        <boxGeometry args={[drawerW - doorGap, dH, doorThickness]} />
        <meshStandardMaterial color={material.color} roughness={material.roughness} metalness={material.metalness} />
      </mesh>
      
      {/* Frame */}
      <mesh position={[0, dH / 2 - 0.022, doorThickness + 0.002]} castShadow>
        <boxGeometry args={[drawerW - doorGap - 0.004, 0.04, 0.004]} />
        <meshStandardMaterial color={highlightColor} roughness={material.roughness - 0.05} metalness={material.metalness} />
      </mesh>
      <mesh position={[0, -dH / 2 + 0.022, doorThickness + 0.002]} castShadow>
        <boxGeometry args={[drawerW - doorGap - 0.004, 0.04, 0.004]} />
        <meshStandardMaterial color={highlightColor} roughness={material.roughness - 0.05} metalness={material.metalness} />
      </mesh>
      <mesh position={[-(drawerW - doorGap) / 2 + 0.025, 0, doorThickness + 0.002]} castShadow>
        <boxGeometry args={[0.04, dH - 0.05, 0.004]} />
        <meshStandardMaterial color={highlightColor} roughness={material.roughness - 0.05} metalness={material.metalness} />
      </mesh>
      <mesh position={[(drawerW - doorGap) / 2 - 0.025, 0, doorThickness + 0.002]} castShadow>
        <boxGeometry args={[0.04, dH - 0.05, 0.004]} />
        <meshStandardMaterial color={highlightColor} roughness={material.roughness - 0.05} metalness={material.metalness} />
      </mesh>
      
      {/* Recessed panel */}
      <mesh position={[0, 0, doorThickness - panelRecess]}>
        <boxGeometry args={[drawerW - 0.1, dH - 0.06, panelRecess]} />
        <meshStandardMaterial color={shadowColor} roughness={material.roughness + 0.08} metalness={material.metalness} />
      </mesh>
      
      {/* Shadow under drawer */}
      <mesh position={[0, -dH / 2 - 0.002, doorThickness]}>
        <boxGeometry args={[drawerW - doorGap, 0.004, 0.003]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.12} />
      </mesh>
      
      {/* Pull */}
      <group position={[0, 0, doorThickness + 0.02]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[pullRadius, pullRadius, pullLength * 1.2, 12]} />
          <meshStandardMaterial {...hardwareMat} />
        </mesh>
        <mesh position={[-pullLength * 0.6, 0, -0.008]}>
          <cylinderGeometry args={[0.006, 0.008, 0.016, 10]} />
          <meshStandardMaterial {...hardwareMat} />
        </mesh>
        <mesh position={[pullLength * 0.6, 0, -0.008]}>
          <cylinderGeometry args={[0.006, 0.008, 0.016, 10]} />
          <meshStandardMaterial {...hardwareMat} />
        </mesh>
      </group>
    </group>
  );
  
  return (
    <group position={position}>
      {/* Cabinet box (dark interior) */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={shadowColor} roughness={0.75} metalness={0} />
      </mesh>
      
      {/* Side panels */}
      <mesh position={[-width / 2 + 0.008, 0, 0]} castShadow>
        <boxGeometry args={[0.016, height - 0.01, depth - 0.01]} />
        <meshStandardMaterial color={material.color} roughness={material.roughness} metalness={material.metalness} />
      </mesh>
      <mesh position={[width / 2 - 0.008, 0, 0]} castShadow>
        <boxGeometry args={[0.016, height - 0.01, depth - 0.01]} />
        <meshStandardMaterial color={material.color} roughness={material.roughness} metalness={material.metalness} />
      </mesh>
      
      {/* Top panel (for base cabinets) */}
      {!isUpper && (
        <mesh position={[0, height / 2 - 0.008, 0]} castShadow>
          <boxGeometry args={[width - 0.02, 0.016, depth - 0.01]} />
          <meshStandardMaterial color={material.color} roughness={material.roughness} metalness={material.metalness} />
        </mesh>
      )}
      
      {/* Door/Drawer fronts */}
      {isDrawer ? (
        Array.from({ length: drawerCount }).map((_, i) => {
          const yPos = -height / 2 + drawerH / 2 + doorGap + i * (drawerH + doorGap);
          return <group key={i}>{renderDrawerFront(width, drawerH, yPos)}</group>;
        })
      ) : isWide ? (
        // Double doors for wide cabinets
        <>
          {renderDoorPanel(width / 2, height, -width / 4, 0)}
          {renderDoorPanel(width / 2, height, width / 4, 0)}
          {/* Hardware for both doors */}
          <group position={[width / 4 - 0.08, isUpper ? -height * 0.28 : height * 0.15, depth / 2 + doorThickness + 0.02]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[pullRadius, pullRadius, pullLength, 12]} />
              <meshStandardMaterial {...hardwareMat} />
            </mesh>
          </group>
          <group position={[-width / 4 + 0.08, isUpper ? -height * 0.28 : height * 0.15, depth / 2 + doorThickness + 0.02]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[pullRadius, pullRadius, pullLength, 12]} />
              <meshStandardMaterial {...hardwareMat} />
            </mesh>
          </group>
        </>
      ) : (
        // Single door
        <>
          {renderDoorPanel(width, height, 0, 0)}
          <group position={[width * 0.28, isUpper ? -height * 0.28 : height * 0.15, depth / 2 + doorThickness + 0.02]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[pullRadius, pullRadius, pullLength, 12]} />
              <meshStandardMaterial {...hardwareMat} />
            </mesh>
            <mesh position={[-pullLength / 2, 0, -0.008]}>
              <cylinderGeometry args={[0.006, 0.008, 0.016, 10]} />
              <meshStandardMaterial {...hardwareMat} />
            </mesh>
            <mesh position={[pullLength / 2, 0, -0.008]}>
              <cylinderGeometry args={[0.006, 0.008, 0.016, 10]} />
              <meshStandardMaterial {...hardwareMat} />
            </mesh>
          </group>
        </>
      )}
      
      {/* Toe kick */}
      {!isUpper && (
        <mesh position={[0, -height / 2 - 0.04, depth / 2 - 0.06]}>
          <boxGeometry args={[width - 0.03, 0.08, 0.04]} />
          <meshStandardMaterial color="#0F0F0F" roughness={0.9} />
        </mesh>
      )}
    </group>
  );
}

// ============================================================================
// GLASS FRONT CABINET
// ============================================================================

function GlassFrontCabinet({
  position,
  width,
  height,
  depth,
  frameColor,
  hardwareMat,
}: {
  position: [number, number, number];
  width: number;
  height: number;
  depth: number;
  frameColor: string;
  hardwareMat: { color: string; roughness: number; metalness: number };
}) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={frameColor} roughness={0.45} metalness={0.02} />
      </mesh>
      <mesh position={[0, 0, depth / 2 + 0.01]}>
        <boxGeometry args={[width * 0.85, height * 0.85, 0.02]} />
        <meshStandardMaterial color="#88CCEE" roughness={0.02} metalness={0.1} transparent opacity={0.3} />
      </mesh>
      <group position={[width * 0.35, 0, depth / 2 + 0.03]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.1, 12]} />
          <meshStandardMaterial {...hardwareMat} />
        </mesh>
      </group>
    </group>
  );
}

// ============================================================================
// REALISTIC COUNTERTOP
// ============================================================================

function RealisticCountertop({
  position,
  width,
  depth,
  material,
  hasVeins = false,
}: {
  position: [number, number, number];
  width: number;
  depth: number;
  material: { color: string; roughness: number; metalness: number };
  hasVeins?: boolean;
}) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, 0.05, depth]} />
        <meshStandardMaterial 
          color={material.color} 
          roughness={material.roughness} 
          metalness={material.metalness}
        />
      </mesh>
      {hasVeins && (
        <mesh position={[0, 0.026, 0]}>
          <planeGeometry args={[width * 0.9, depth * 0.9]} />
          <meshStandardMaterial 
            color="#D0D0D0" 
            roughness={0.1} 
            transparent 
            opacity={0.15}
          />
        </mesh>
      )}
      <mesh position={[0, -0.03, depth / 2 - 0.02]}>
        <boxGeometry args={[width, 0.02, 0.04]} />
        <meshStandardMaterial color={material.color} roughness={material.roughness} metalness={material.metalness} />
      </mesh>
    </group>
  );
}

// ============================================================================
// REALISTIC BACKSPLASH
// ============================================================================

function RealisticBacksplash({
  position,
  width,
  height,
  material,
  type = 'subway',
}: {
  position: [number, number, number];
  width: number;
  height: number;
  material: { color: string; roughness: number };
  type?: 'subway' | 'grid' | 'slab';
}) {
  return (
    <group position={position}>
      <mesh receiveShadow>
        <boxGeometry args={[width, height, 0.02]} />
        <meshStandardMaterial color={material.color} roughness={material.roughness} metalness={0.05} />
      </mesh>
      {type === 'subway' && (
        <group position={[0, 0, 0.011]}>
          {Array.from({ length: Math.floor(height / 0.15) }).map((_, row) =>
            Array.from({ length: Math.floor(width / 0.3) }).map((_, col) => (
              <mesh
                key={`${row}-${col}`}
                position={[
                  -width / 2 + 0.15 + col * 0.3 + (row % 2) * 0.15,
                  -height / 2 + 0.075 + row * 0.15,
                  0,
                ]}
              >
                <planeGeometry args={[0.28, 0.13]} />
                <meshStandardMaterial color={material.color} roughness={material.roughness - 0.05} />
              </mesh>
            ))
          )}
        </group>
      )}
    </group>
  );
}

// ============================================================================
// REALISTIC WINDOW
// ============================================================================

function RealisticWindow({
  position,
  width,
  height,
}: {
  position: [number, number, number];
  width: number;
  height: number;
}) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[width + 0.15, height + 0.15, 0.1]} />
        <meshStandardMaterial color="#FAFAFA" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[width, height, 0.02]} />
        <meshStandardMaterial color="#87CEEB" roughness={0.02} metalness={0.1} transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[0.03, height, 0.02]} />
        <meshStandardMaterial color="#FAFAFA" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[width, 0.03, 0.02]} />
        <meshStandardMaterial color="#FAFAFA" roughness={0.5} />
      </mesh>
    </group>
  );
}

// ============================================================================
// REALISTIC SINK
// ============================================================================

function RealisticSink({
  position,
  faucetMat,
}: {
  position: [number, number, number];
  faucetMat: { color: string; roughness: number; metalness: number };
}) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[2.2, 0.3, 1.4]} />
        <meshStandardMaterial color="#D0D0D0" roughness={0.15} metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[2, 0.25, 1.2]} />
        <meshStandardMaterial color="#404040" roughness={0.2} />
      </mesh>
      <group position={[0, 0.4, -0.5]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.5, 16]} />
          <meshStandardMaterial {...faucetMat} />
        </mesh>
        <mesh position={[0, 0.25, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.3, 16]} />
          <meshStandardMaterial {...faucetMat} />
        </mesh>
        <mesh position={[0, 0.25, 0.3]}>
          <cylinderGeometry args={[0.02, 0.015, 0.08, 16]} />
          <meshStandardMaterial {...faucetMat} />
        </mesh>
      </group>
    </group>
  );
}

// ============================================================================
// REALISTIC PENDANT
// ============================================================================

function RealisticPendant({
  position,
  intensity = 0.7,
  isEvening = false,
  fixtureColor = '#D4AF37',
  pendantType = 'globe',
}: {
  position: [number, number, number];
  intensity?: number;
  isEvening?: boolean;
  fixtureColor?: string;
  pendantType?: string;
}) {
  // Render different pendant styles based on type
  const renderPendantShape = () => {
    const glowColor = isEvening ? '#FFF8DC' : '#F5F5F0';
    const emissiveColor = isEvening ? '#FFE4B5' : '#000000';
    const emissiveInt = isEvening ? 0.8 : 0;
    
    switch (pendantType) {
      case 'industrial':
        // Cage-style industrial pendant
        return (
          <>
            <mesh position={[0, -0.5, 0]}>
              <cylinderGeometry args={[0.2, 0.25, 0.35, 8]} />
              <meshStandardMaterial color={fixtureColor} roughness={0.6} metalness={0.8} wireframe />
            </mesh>
            <mesh position={[0, -0.5, 0]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color={glowColor} emissive={emissiveColor} emissiveIntensity={emissiveInt} />
            </mesh>
          </>
        );
      
      case 'drum':
        // Drum shade pendant
        return (
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.3, 32]} />
            <meshStandardMaterial color="#F5F5F0" roughness={0.8} transparent opacity={0.85} emissive={emissiveColor} emissiveIntensity={emissiveInt * 0.5} />
          </mesh>
        );
      
      case 'linear':
        // Linear bar pendant
        return (
          <mesh position={[0, -0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.08, 1.5, 0.08]} />
            <meshStandardMaterial color={fixtureColor} roughness={0.3} metalness={0.9} emissive={emissiveColor} emissiveIntensity={emissiveInt * 0.3} />
          </mesh>
        );
      
      case 'crystal':
        // Crystal pendant with facets
        return (
          <>
            <mesh position={[0, -0.5, 0]}>
              <dodecahedronGeometry args={[0.15, 0]} />
              <meshStandardMaterial color="#F8F8FF" roughness={0.05} metalness={0.1} transparent opacity={0.8} emissive={emissiveColor} emissiveIntensity={emissiveInt} />
            </mesh>
            {/* Crystal drops */}
            {[0.08, -0.08].map((x, i) => (
              <mesh key={i} position={[x, -0.7, 0]}>
                <octahedronGeometry args={[0.04, 0]} />
                <meshStandardMaterial color="#F8F8FF" roughness={0.02} transparent opacity={0.9} />
              </mesh>
            ))}
          </>
        );
      
      case 'sputnik':
        // Sputnik style with multiple arms
        return (
          <>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const angle = (i / 6) * Math.PI * 2;
              const x = Math.cos(angle) * 0.3;
              const z = Math.sin(angle) * 0.3;
              return (
                <group key={i}>
                  <mesh position={[x, -0.5, z]}>
                    <sphereGeometry args={[0.06, 16, 16]} />
                    <meshStandardMaterial color={glowColor} emissive={emissiveColor} emissiveIntensity={emissiveInt} />
                  </mesh>
                  <mesh position={[x / 2, -0.5, z / 2]} rotation={[0, -angle, Math.PI / 2]}>
                    <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
                    <meshStandardMaterial color={fixtureColor} roughness={0.3} metalness={0.9} />
                  </mesh>
                </group>
              );
            })}
          </>
        );
      
      case 'cone':
      case 'dome':
        // Cone/dome pendant (like the dark gray ones with white interior)
        return (
          <>
            {/* Outer cone shape */}
            <mesh position={[0, -0.55, 0]}>
              <coneGeometry args={[0.25, 0.35, 32, 1, true]} />
              <meshStandardMaterial color={fixtureColor} roughness={0.4} metalness={0.1} side={2} />
            </mesh>
            {/* Inner white diffuser */}
            <mesh position={[0, -0.55, 0]}>
              <coneGeometry args={[0.22, 0.32, 32, 1, true]} />
              <meshStandardMaterial color="#FFFFFF" emissive={emissiveColor} emissiveIntensity={emissiveInt * 0.5} roughness={0.6} side={0} />
            </mesh>
            {/* Bulb glow */}
            <mesh position={[0, -0.5, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color={glowColor} emissive={emissiveColor} emissiveIntensity={emissiveInt} transparent opacity={0.8} />
            </mesh>
          </>
        );
      
      case 'globe':
      default:
        // Standard globe pendant
        return (
          <>
            <mesh position={[0, -0.6, 0]}>
              <sphereGeometry args={[0.2, 24, 24]} />
              <meshStandardMaterial color={glowColor} emissive={emissiveColor} emissiveIntensity={emissiveInt} roughness={0.1} transparent opacity={0.9} />
            </mesh>
            <mesh position={[0, -0.4, 0]}>
              <cylinderGeometry args={[0.04, 0.03, 0.08, 16]} />
              <meshStandardMaterial color={fixtureColor} roughness={0.3} metalness={0.9} />
            </mesh>
          </>
        );
    }
  };

  return (
    <group position={position}>
      {/* Cord/rod */}
      <mesh>
        <cylinderGeometry args={[0.01, 0.01, 1.2, 8]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.5} metalness={0.8} />
      </mesh>
      
      {/* Canopy */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.03, 16]} />
        <meshStandardMaterial color={fixtureColor} roughness={0.3} metalness={0.9} />
      </mesh>
      
      {/* Pendant shape based on type */}
      {renderPendantShape()}
      
      {/* Light source */}
      {isEvening && (
        <pointLight
          position={[0, -0.6, 0]}
          intensity={intensity * 2}
          distance={4}
          color="#FFE4B5"
          castShadow
        />
      )}
    </group>
  );
}

// ============================================================================
// AMBER GLASS PENDANT
// ============================================================================

function AmberGlassPendant({
  position,
  intensity = 0.7,
  isEvening = false,
}: {
  position: [number, number, number];
  intensity?: number;
  isEvening?: boolean;
}) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.01, 0.01, 1.0, 8]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.5} metalness={0.8} />
      </mesh>
      <mesh position={[0, -0.5, 0]}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial
          color="#D2691E"
          emissive={isEvening ? '#FF8C00' : '#000000'}
          emissiveIntensity={isEvening ? 1.0 : 0}
          roughness={0.05}
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.035, 0.025, 0.06, 16]} />
        <meshStandardMaterial color="#2D2D2D" roughness={0.4} metalness={0.85} />
      </mesh>
      {isEvening && (
        <pointLight
          position={[0, -0.5, 0]}
          intensity={intensity * 2.5}
          distance={5}
          color="#FF8C00"
          castShadow
        />
      )}
    </group>
  );
}

// ============================================================================
// APPLIANCES
// ============================================================================

function BuiltInOven({ position, isDouble = false }: { position: [number, number, number]; isDouble?: boolean }) {
  const ovenHeight = isDouble ? 4.5 : 2.5;
  const ovenCount = isDouble ? 2 : 1;
  
  return (
    <group position={position}>
      {/* Cabinet housing */}
      <mesh castShadow>
        <boxGeometry args={[2.4, ovenHeight, 2]} />
        <meshStandardMaterial color="#2D2D2D" roughness={0.4} metalness={0.5} />
      </mesh>
      
      {/* Render oven(s) */}
      {Array.from({ length: ovenCount }).map((_, i) => {
        const yOffset = isDouble ? (i === 0 ? 1.0 : -1.0) : 0;
        return (
          <group key={i} position={[0, yOffset, 0]}>
            {/* Oven door */}
            <mesh position={[0, 0, 1.01]} castShadow>
              <boxGeometry args={[2.1, 1.6, 0.08]} />
              <meshStandardMaterial color="#1A1A1A" roughness={0.2} metalness={0.6} />
            </mesh>
            {/* Glass window */}
            <mesh position={[0, 0.1, 1.06]}>
              <boxGeometry args={[1.7, 1.1, 0.02]} />
              <meshStandardMaterial color="#0A0A0A" roughness={0.02} metalness={0.1} transparent opacity={0.85} />
            </mesh>
            {/* Handle */}
            <mesh position={[0, -0.7, 1.12]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.025, 0.025, 1.4, 12]} />
              <meshStandardMaterial color="#808080" roughness={0.3} metalness={0.9} />
            </mesh>
            {/* Control panel */}
            <mesh position={[0, 0.9, 1.04]}>
              <boxGeometry args={[2.0, 0.25, 0.04]} />
              <meshStandardMaterial color="#2D2D2D" roughness={0.3} metalness={0.5} />
            </mesh>
            {/* Control knobs */}
            {[-0.6, -0.2, 0.2, 0.6].map((x, j) => (
              <mesh key={j} position={[x, 0.9, 1.08]}>
                <cylinderGeometry args={[0.04, 0.04, 0.04, 12]} />
                <meshStandardMaterial color="#404040" roughness={0.4} metalness={0.7} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

function RangeHood({ position, width = 2.5 }: { position: [number, number, number]; width?: number }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[width, 0.8, 1.8]} />
        <meshStandardMaterial color="#C0C0C0" roughness={0.2} metalness={0.95} />
      </mesh>
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[width * 0.95, 0.15, 1.7]} />
        <meshStandardMaterial color="#A0A0A0" roughness={0.25} metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.4, 0.8, 0.4]} />
        <meshStandardMaterial color="#B0B0B0" roughness={0.2} metalness={0.9} />
      </mesh>
    </group>
  );
}

function Refrigerator({ position, color = '#C0C0C0' }: { position: [number, number, number]; color?: string }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[2.5, 5.8, 2.2]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.95} />
      </mesh>
      <mesh position={[0, 0.8, 1.12]}>
        <boxGeometry args={[2.48, 0.02, 0.01]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.8} />
      </mesh>
      <mesh position={[1.1, 1.8, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.8, 12]} />
        <meshStandardMaterial color="#808080" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[1.1, -0.6, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.6, 12]} />
        <meshStandardMaterial color="#808080" roughness={0.3} metalness={0.9} />
      </mesh>
    </group>
  );
}

function Cooktop({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[2.4, 0.03, 1.6]} />
        <meshStandardMaterial color="#0A0A0A" roughness={0.05} metalness={0.1} />
      </mesh>
      {[-0.6, 0.6].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0.02, -0.35]}>
            <cylinderGeometry args={[0.2, 0.2, 0.01, 24]} />
            <meshStandardMaterial color="#1A1A1A" roughness={0.3} />
          </mesh>
          <mesh position={[x, 0.02, 0.35]}>
            <cylinderGeometry args={[0.15, 0.15, 0.01, 24]} />
            <meshStandardMaterial color="#1A1A1A" roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function OpenShelving({ 
  position, 
  width = 2, 
  shelfCount = 3, 
  color = '#8B5A2B' 
}: { 
  position: [number, number, number]; 
  width?: number; 
  shelfCount?: number; 
  color?: string; 
}) {
  const shelfSpacing = 0.45;
  return (
    <group position={position}>
      {Array.from({ length: shelfCount }).map((_, i) => (
        <mesh key={i} position={[0, i * shelfSpacing, 0]} castShadow receiveShadow>
          <boxGeometry args={[width, 0.04, 0.35]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.02} />
        </mesh>
      ))}
      {[-width / 2 + 0.1, width / 2 - 0.1].map((x, i) => (
        <group key={i}>
          {Array.from({ length: shelfCount }).map((_, j) => (
            <mesh key={j} position={[x, j * shelfSpacing - 0.1, 0.15]}>
              <boxGeometry args={[0.02, 0.15, 0.02]} />
              <meshStandardMaterial color="#4A4A4A" roughness={0.4} metalness={0.7} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// Bar stool / counter stool
function BarStool({
  position,
  color = '#2D2D2D',
  style = 'modern',
  material = 'metal'
}: {
  position: [number, number, number];
  color?: string;
  style?: string;
  material?: string;
}) {
  const isWood = material === 'wood';
  const isUpholstered = material === 'upholstered' || material === 'leather';
  const seatHeight = 2.5; // ~30 inches for counter height
  
  return (
    <group position={position}>
      {/* Seat */}
      <mesh position={[0, seatHeight, 0]} castShadow>
        {style === 'modern' ? (
          <cylinderGeometry args={[0.5, 0.45, 0.15, 24]} />
        ) : (
          <boxGeometry args={[0.9, 0.15, 0.9]} />
        )}
        <meshStandardMaterial 
          color={isUpholstered ? color : (isWood ? '#8B6914' : '#2D2D2D')} 
          roughness={isUpholstered ? 0.8 : (isWood ? 0.5 : 0.3)} 
          metalness={isUpholstered ? 0 : (isWood ? 0 : 0.7)} 
        />
      </mesh>
      
      {/* Back rest (if not backless) */}
      {style !== 'modern' && (
        <mesh position={[0, seatHeight + 0.6, -0.35]} castShadow>
          <boxGeometry args={[0.8, 1.0, 0.08]} />
          <meshStandardMaterial 
            color={isUpholstered ? color : (isWood ? '#8B6914' : '#2D2D2D')} 
            roughness={0.5} 
          />
        </mesh>
      )}
      
      {/* Legs - 4 legs for traditional, center post for modern */}
      {style === 'modern' ? (
        <>
          {/* Center post */}
          <mesh position={[0, seatHeight / 2, 0]}>
            <cylinderGeometry args={[0.04, 0.04, seatHeight - 0.2, 16]} />
            <meshStandardMaterial color="#808080" roughness={0.3} metalness={0.9} />
          </mesh>
          {/* Base */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.1, 24]} />
            <meshStandardMaterial color="#808080" roughness={0.3} metalness={0.9} />
          </mesh>
          {/* Footrest ring */}
          <mesh position={[0, seatHeight * 0.4, 0]}>
            <torusGeometry args={[0.35, 0.02, 8, 24]} />
            <meshStandardMaterial color="#808080" roughness={0.3} metalness={0.9} />
          </mesh>
        </>
      ) : (
        <>
          {/* 4 legs */}
          {[[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]].map(([x, z], i) => (
            <mesh key={i} position={[x, seatHeight / 2, z]}>
              <boxGeometry args={[0.05, seatHeight, 0.05]} />
              <meshStandardMaterial 
                color={isWood ? '#6B4423' : '#2D2D2D'} 
                roughness={isWood ? 0.5 : 0.3} 
                metalness={isWood ? 0 : 0.7} 
              />
            </mesh>
          ))}
          {/* Footrest bar */}
          <mesh position={[0, seatHeight * 0.35, 0.3]}>
            <boxGeometry args={[0.6, 0.04, 0.04]} />
            <meshStandardMaterial color={isWood ? '#6B4423' : '#2D2D2D'} roughness={0.3} metalness={isWood ? 0 : 0.7} />
          </mesh>
        </>
      )}
    </group>
  );
}

// Decorative plant
function DecorativePlant({
  position,
  size = 'medium'
}: {
  position: [number, number, number];
  size?: 'small' | 'medium' | 'large';
}) {
  const potSize = size === 'small' ? 0.2 : size === 'medium' ? 0.3 : 0.5;
  const plantHeight = size === 'small' ? 0.3 : size === 'medium' ? 0.5 : 1.0;
  
  return (
    <group position={position}>
      {/* Pot */}
      <mesh position={[0, potSize / 2, 0]} castShadow>
        <cylinderGeometry args={[potSize * 0.8, potSize * 0.6, potSize, 16]} />
        <meshStandardMaterial color="#D4A574" roughness={0.7} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, potSize, 0]}>
        <cylinderGeometry args={[potSize * 0.7, potSize * 0.7, 0.05, 16]} />
        <meshStandardMaterial color="#3D2B1F" roughness={0.9} />
      </mesh>
      {/* Plant foliage (simplified as sphere clusters) */}
      <mesh position={[0, potSize + plantHeight * 0.6, 0]}>
        <sphereGeometry args={[plantHeight * 0.5, 12, 12]} />
        <meshStandardMaterial color="#2D5A27" roughness={0.8} />
      </mesh>
      <mesh position={[plantHeight * 0.2, potSize + plantHeight * 0.4, plantHeight * 0.1]}>
        <sphereGeometry args={[plantHeight * 0.3, 12, 12]} />
        <meshStandardMaterial color="#3D6A37" roughness={0.8} />
      </mesh>
    </group>
  );
}

function WoodFrame({
  position,
  width,
  height,
  color,
}: {
  position: [number, number, number];
  width: number;
  height: number;
  color: string;
}) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.1, height, 0.1]} />
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.02} />
      </mesh>
      <mesh position={[width / 2, height / 2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.1, width, 0.1]} />
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.02} />
      </mesh>
    </group>
  );
}

// Wood slat panel (vertical slats like walnut accent panels behind backsplash)
function WoodSlatPanel({
  position,
  width,
  height,
  color,
  slatWidth = 0.04,
  slatGap = 0.02,
}: {
  position: [number, number, number];
  width: number;
  height: number;
  color: string;
  slatWidth?: number;
  slatGap?: number;
}) {
  const slatSpacing = slatWidth + slatGap;
  const slatCount = Math.floor(width / slatSpacing);
  
  return (
    <group position={position}>
      {/* Back panel (dark background) */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[width, height, 0.02]} />
        <meshStandardMaterial color="#2A2520" roughness={0.8} />
      </mesh>
      {/* Vertical slats */}
      {Array.from({ length: slatCount }).map((_, i) => (
        <mesh key={i} position={[-width / 2 + slatWidth / 2 + i * slatSpacing, 0, 0]} castShadow>
          <boxGeometry args={[slatWidth, height, 0.015]} />
          <meshStandardMaterial color={color} roughness={0.45} metalness={0.02} />
        </mesh>
      ))}
    </group>
  );
}

// Reeded/fluted panel - dense vertical grooves like on island fronts
function ReededPanel({
  position,
  width,
  height,
  color,
  depth = 0.04,
}: {
  position: [number, number, number];
  width: number;
  height: number;
  color: string;
  depth?: number;
}) {
  // Create dense reeding pattern - narrow slats with very small gaps
  const slatsPerMeter = 25; // Dense reeding
  const slatCount = Math.floor(width * slatsPerMeter);
  const slatWidth = (width / slatCount) * 0.75;
  const slatSpacing = width / slatCount;
  
  // Slightly darker groove color
  const grooveColor = useMemo(() => {
    const c = new THREE.Color(color);
    c.multiplyScalar(0.7);
    return '#' + c.getHexString();
  }, [color]);
  
  return (
    <group position={position}>
      {/* Back panel (groove color) */}
      <mesh>
        <boxGeometry args={[width, height, depth * 0.5]} />
        <meshStandardMaterial color={grooveColor} roughness={0.6} />
      </mesh>
      {/* Dense vertical slats (reeds) */}
      {Array.from({ length: slatCount }).map((_, i) => {
        const shade = 0.95 + Math.random() * 0.1; // Subtle variation
        const slatColor = new THREE.Color(color).multiplyScalar(shade);
        return (
          <mesh key={i} position={[-width / 2 + slatWidth / 2 + i * slatSpacing, 0, depth * 0.3]} castShadow>
            <boxGeometry args={[slatWidth, height - 0.01, depth * 0.6]} />
            <meshStandardMaterial color={slatColor} roughness={0.4} metalness={0.02} />
          </mesh>
        );
      })}
    </group>
  );
}

// Slab cabinet with wood grain texture (for modern/minimalist kitchens)
function SlabCabinet({
  position,
  width,
  height,
  depth,
  color,
  hardwareMat,
  isUpper = false,
  hasHandle = true,
}: {
  position: [number, number, number];
  width: number;
  height: number;
  depth: number;
  color: string;
  hardwareMat: { color: string; roughness: number; metalness: number };
  isUpper?: boolean;
  hasHandle?: boolean;
}) {
  const doorGap = 0.004;
  const doorThickness = 0.02;
  const isWide = width > 0.6;
  
  // Slightly darker interior
  const interiorColor = useMemo(() => {
    const c = new THREE.Color(color);
    c.multiplyScalar(0.85);
    return '#' + c.getHexString();
  }, [color]);
  
  const renderSlabDoor = (doorW: number, xOff: number) => (
    <group position={[xOff, 0, depth / 2]}>
      {/* Flat slab door - no frame, just clean panel */}
      <mesh position={[0, 0, doorThickness / 2]} castShadow>
        <boxGeometry args={[doorW - doorGap * 2, height - doorGap * 2, doorThickness]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.02} />
      </mesh>
      {/* Subtle edge highlight */}
      <mesh position={[0, (height - doorGap * 2) / 2 - 0.002, doorThickness + 0.001]}>
        <boxGeometry args={[doorW - doorGap * 2, 0.004, 0.002]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.05} />
      </mesh>
      {/* Shadow line at bottom */}
      <mesh position={[0, -(height - doorGap * 2) / 2 - 0.002, doorThickness]}>
        <boxGeometry args={[doorW - doorGap * 2, 0.004, 0.002]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.08} />
      </mesh>
    </group>
  );
  
  return (
    <group position={position}>
      {/* Cabinet interior */}
      <mesh>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={interiorColor} roughness={0.7} />
      </mesh>
      
      {/* Side panels */}
      <mesh position={[-width / 2 + 0.008, 0, 0]} castShadow>
        <boxGeometry args={[0.016, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.02} />
      </mesh>
      <mesh position={[width / 2 - 0.008, 0, 0]} castShadow>
        <boxGeometry args={[0.016, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.02} />
      </mesh>
      
      {/* Door(s) */}
      {isWide ? (
        <>
          {renderSlabDoor(width / 2, -width / 4)}
          {renderSlabDoor(width / 2, width / 4)}
          {/* Handles for double doors - integrated/invisible or minimal */}
          {hasHandle && (
            <>
              <mesh position={[width / 4 - 0.05, isUpper ? -height * 0.35 : height * 0.35, depth / 2 + doorThickness + 0.01]} rotation={[Math.PI / 2, 0, 0]}>
                <boxGeometry args={[0.015, 0.04, 0.8]} />
                <meshStandardMaterial {...hardwareMat} />
              </mesh>
              <mesh position={[-width / 4 + 0.05, isUpper ? -height * 0.35 : height * 0.35, depth / 2 + doorThickness + 0.01]} rotation={[Math.PI / 2, 0, 0]}>
                <boxGeometry args={[0.015, 0.04, 0.8]} />
                <meshStandardMaterial {...hardwareMat} />
              </mesh>
            </>
          )}
        </>
      ) : (
        <>
          {renderSlabDoor(width, 0)}
          {hasHandle && (
            <mesh position={[width * 0.35, isUpper ? -height * 0.35 : height * 0.35, depth / 2 + doorThickness + 0.01]} rotation={[Math.PI / 2, 0, 0]}>
              <boxGeometry args={[0.015, 0.04, 0.6]} />
              <meshStandardMaterial {...hardwareMat} />
            </mesh>
          )}
        </>
      )}
      
      {/* Toe kick */}
      {!isUpper && (
        <mesh position={[0, -height / 2 - 0.04, depth / 2 - 0.05]}>
          <boxGeometry args={[width - 0.02, 0.08, 0.04]} />
          <meshStandardMaterial color="#0A0A0A" roughness={0.9} />
        </mesh>
      )}
    </group>
  );
}

// Open basket storage - wicker/rattan baskets in cabinet frame
function OpenBasketStorage({
  position,
  width,
  height,
  depth,
  frameColor,
  basketCount = 2,
}: {
  position: [number, number, number];
  width: number;
  height: number;
  depth: number;
  frameColor: string;
  basketCount?: number;
}) {
  const basketHeight = (height - 0.1) / basketCount;
  const basketColor = '#C4956A'; // Wicker/rattan color
  const basketDarkColor = '#8B6914';
  
  return (
    <group position={position}>
      {/* Frame/cabinet box */}
      <mesh>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={frameColor} roughness={0.45} />
      </mesh>
      
      {/* Side panels */}
      <mesh position={[-width / 2 + 0.01, 0, 0]}>
        <boxGeometry args={[0.02, height, depth]} />
        <meshStandardMaterial color={frameColor} roughness={0.4} />
      </mesh>
      <mesh position={[width / 2 - 0.01, 0, 0]}>
        <boxGeometry args={[0.02, height, depth]} />
        <meshStandardMaterial color={frameColor} roughness={0.4} />
      </mesh>
      
      {/* Baskets */}
      {Array.from({ length: basketCount }).map((_, i) => {
        const basketY = -height / 2 + basketHeight / 2 + 0.05 + i * basketHeight;
        return (
          <group key={`basket-${i}`} position={[0, basketY, depth / 2 - 0.1]}>
            {/* Basket body */}
            <mesh castShadow>
              <boxGeometry args={[width - 0.1, basketHeight - 0.08, depth - 0.15]} />
              <meshStandardMaterial color={basketColor} roughness={0.7} />
            </mesh>
            {/* Basket weave texture (horizontal lines) */}
            {Array.from({ length: 4 }).map((_, j) => (
              <mesh key={`weave-${j}`} position={[0, -basketHeight / 4 + j * (basketHeight / 5), (depth - 0.15) / 2 + 0.01]}>
                <boxGeometry args={[width - 0.12, 0.015, 0.01]} />
                <meshStandardMaterial color={basketDarkColor} roughness={0.6} />
              </mesh>
            ))}
            {/* Basket rim */}
            <mesh position={[0, basketHeight / 2 - 0.06, 0]}>
              <boxGeometry args={[width - 0.08, 0.04, depth - 0.13]} />
              <meshStandardMaterial color={basketDarkColor} roughness={0.5} />
            </mesh>
          </group>
        );
      })}
      
      {/* Toe kick */}
      <mesh position={[0, -height / 2 - 0.04, depth / 2 - 0.05]}>
        <boxGeometry args={[width - 0.02, 0.08, 0.04]} />
        <meshStandardMaterial color="#0A0A0A" roughness={0.9} />
      </mesh>
    </group>
  );
}

// Tall shelving unit with open shelves (like wood accent units)
function TallShelvingUnit({
  position,
  width,
  height,
  depth,
  color,
  shelfCount = 5,
}: {
  position: [number, number, number];
  width: number;
  height: number;
  depth: number;
  color: string;
  shelfCount?: number;
}) {
  const shelfSpacing = height / (shelfCount + 1);
  const shelfThickness = 0.025;
  
  return (
    <group position={position}>
      {/* Back panel */}
      <mesh position={[0, 0, -depth / 2 + 0.01]}>
        <boxGeometry args={[width - 0.02, height, 0.02]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      
      {/* Side panels */}
      <mesh position={[-width / 2 + 0.015, 0, 0]}>
        <boxGeometry args={[0.03, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <mesh position={[width / 2 - 0.015, 0, 0]}>
        <boxGeometry args={[0.03, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      
      {/* Top panel */}
      <mesh position={[0, height / 2 - shelfThickness / 2, 0]}>
        <boxGeometry args={[width, shelfThickness, depth]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      
      {/* Shelves */}
      {Array.from({ length: shelfCount }).map((_, i) => {
        const shelfY = -height / 2 + shelfSpacing * (i + 1);
        return (
          <mesh key={`shelf-${i}`} position={[0, shelfY, 0]}>
            <boxGeometry args={[width - 0.04, shelfThickness, depth - 0.02]} />
            <meshStandardMaterial color={color} roughness={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}

// Detailed Range/Stove with burners and oven
function DetailedRange({ 
  position, 
  widthInches = 30,
  type = 'gas',
  color = '#2D2D2D' 
}: { 
  position: [number, number, number];
  widthInches?: number;
  type?: 'gas' | 'electric' | 'dual-fuel';
  color?: string;
}) {
  const widthFeet = widthInches / 12;
  const isGas = type === 'gas' || type === 'dual-fuel';
  
  return (
    <group position={position}>
      {/* Main body */}
      <mesh castShadow>
        <boxGeometry args={[widthFeet, 3, 2]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
      </mesh>
      
      {/* Oven door */}
      <mesh position={[0, -0.3, 1.01]}>
        <boxGeometry args={[widthFeet - 0.15, 2.2, 0.05]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.8} />
      </mesh>
      
      {/* Oven window */}
      <mesh position={[0, -0.1, 1.04]}>
        <boxGeometry args={[widthFeet - 0.5, 1.2, 0.02]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.05} metalness={0.1} transparent opacity={0.85} />
      </mesh>
      
      {/* Oven handle */}
      <mesh position={[0, 0.8, 1.15]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, widthFeet - 0.3, 12]} />
        <meshStandardMaterial color="#808080" roughness={0.3} metalness={0.9} />
      </mesh>
      
      {/* Cooktop surface */}
      <mesh position={[0, 1.52, 0]}>
        <boxGeometry args={[widthFeet, 0.04, 2]} />
        <meshStandardMaterial color={isGas ? "#1a1a1a" : "#0a0a0a"} roughness={isGas ? 0.4 : 0.05} metalness={0.3} />
      </mesh>
      
      {/* Burners/elements */}
      {isGas ? (
        // Gas grates
        <>
          {[[-widthFeet/4, -0.4], [widthFeet/4, -0.4], [-widthFeet/4, 0.4], [widthFeet/4, 0.4]].map(([x, z], i) => (
            <group key={i} position={[x, 1.56, z]}>
              {/* Grate */}
              <mesh>
                <boxGeometry args={[0.5, 0.04, 0.5]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.4} />
              </mesh>
              {/* Burner ring */}
              <mesh position={[0, -0.02, 0]}>
                <torusGeometry args={[0.15, 0.02, 8, 24]} />
                <meshStandardMaterial color="#303030" roughness={0.5} metalness={0.5} />
              </mesh>
            </group>
          ))}
        </>
      ) : (
        // Electric elements
        <>
          {[[-widthFeet/4, -0.35], [widthFeet/4, -0.35], [-widthFeet/4, 0.35], [widthFeet/4, 0.35]].map(([x, z], i) => (
            <mesh key={i} position={[x, 1.55, z]}>
              <cylinderGeometry args={[i < 2 ? 0.22 : 0.17, i < 2 ? 0.22 : 0.17, 0.01, 32]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.2} />
            </mesh>
          ))}
        </>
      )}
      
      {/* Control panel */}
      <mesh position={[0, 1.4, 0.95]}>
        <boxGeometry args={[widthFeet - 0.1, 0.2, 0.1]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
      </mesh>
      
      {/* Control knobs */}
      {Array.from({ length: Math.min(5, Math.ceil(widthInches / 8)) }).map((_, i) => (
        <mesh key={i} position={[(-widthFeet/2 + 0.3) + i * (widthFeet - 0.5) / 4, 1.4, 1.02]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.05, 16]} />
          <meshStandardMaterial color="#808080" roughness={0.4} metalness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// Detailed Dishwasher
function DetailedDishwasher({ 
  position,
  color = '#C0C0C0'
}: { 
  position: [number, number, number];
  color?: string;
}) {
  return (
    <group position={position}>
      {/* Main body */}
      <mesh castShadow>
        <boxGeometry args={[2, 2.8, 2]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.85} />
      </mesh>
      
      {/* Door panel */}
      <mesh position={[0, 0, 1.01]}>
        <boxGeometry args={[1.95, 2.75, 0.03]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.9} />
      </mesh>
      
      {/* Handle recess */}
      <mesh position={[0, 1.2, 1.03]}>
        <boxGeometry args={[1.6, 0.15, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.3} />
      </mesh>
      
      {/* Handle */}
      <mesh position={[0, 1.2, 1.08]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.4, 12]} />
        <meshStandardMaterial color="#808080" roughness={0.3} metalness={0.9} />
      </mesh>
      
      {/* Control panel */}
      <mesh position={[0, 1.35, 1.04]}>
        <boxGeometry args={[1.8, 0.12, 0.01]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.3} />
      </mesh>
      
      {/* Status lights */}
      {[0.3, 0, -0.3].map((x, i) => (
        <mesh key={i} position={[x, 1.35, 1.05]}>
          <circleGeometry args={[0.015, 16]} />
          <meshStandardMaterial color={i === 1 ? "#00ff00" : "#333333"} emissive={i === 1 ? "#00ff00" : "#000000"} emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// Detailed Microwave
function DetailedMicrowave({ 
  position,
  location = 'over-range'
}: { 
  position: [number, number, number];
  location?: string;
}) {
  const isOverRange = location === 'over-range';
  
  return (
    <group position={position}>
      {/* Main body */}
      <mesh castShadow>
        <boxGeometry args={[2.5, isOverRange ? 1.2 : 0.9, 1.3]} />
        <meshStandardMaterial color="#2D2D2D" roughness={0.25} metalness={0.7} />
      </mesh>
      
      {/* Door/window area */}
      <mesh position={[-0.3, 0, 0.66]}>
        <boxGeometry args={[1.7, isOverRange ? 1.0 : 0.7, 0.02]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.05} metalness={0.1} transparent opacity={0.85} />
      </mesh>
      
      {/* Door frame */}
      <mesh position={[-0.3, 0, 0.67]}>
        <boxGeometry args={[1.8, isOverRange ? 1.1 : 0.8, 0.01]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.5} />
      </mesh>
      
      {/* Control panel */}
      <mesh position={[0.95, 0, 0.66]}>
        <boxGeometry args={[0.5, isOverRange ? 1.0 : 0.7, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.4} />
      </mesh>
      
      {/* Number pad buttons */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[0.85 + (i % 3) * 0.1, 0.15 - Math.floor(i / 3) * 0.15, 0.68]}>
          <boxGeometry args={[0.06, 0.08, 0.01]} />
          <meshStandardMaterial color="#404040" roughness={0.6} />
        </mesh>
      ))}
      
      {/* Door handle */}
      <mesh position={[0.55, 0, 0.75]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.08, isOverRange ? 0.8 : 0.5, 0.04]} />
        <meshStandardMaterial color="#808080" roughness={0.3} metalness={0.9} />
      </mesh>
      
      {/* Vent (for over-range) */}
      {isOverRange && (
        <mesh position={[0, -0.65, 0.3]}>
          <boxGeometry args={[2.3, 0.08, 0.8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.4} />
        </mesh>
      )}
    </group>
  );
}

// Wine Fridge / Beverage Center
function WineFridge({ 
  position,
  location = 'under-counter'
}: { 
  position: [number, number, number];
  location?: string;
}) {
  const height = location === 'under-counter' ? 2.8 : 4.5;
  
  return (
    <group position={position}>
      {/* Main body */}
      <mesh castShadow>
        <boxGeometry args={[1.5, height, 2]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.25} metalness={0.6} />
      </mesh>
      
      {/* Glass door frame */}
      <mesh position={[0, 0, 1.01]}>
        <boxGeometry args={[1.45, height - 0.1, 0.05]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.7} />
      </mesh>
      
      {/* Glass door */}
      <mesh position={[0, 0, 1.04]}>
        <boxGeometry args={[1.3, height - 0.2, 0.02]} />
        <meshStandardMaterial color="#1a3a4a" roughness={0.05} metalness={0.1} transparent opacity={0.7} />
      </mesh>
      
      {/* Interior shelves (visible through glass) */}
      {Array.from({ length: Math.floor(height / 0.8) }).map((_, i) => (
        <mesh key={i} position={[0, -height/2 + 0.4 + i * 0.75, 0]}>
          <boxGeometry args={[1.25, 0.02, 1.8]} />
          <meshStandardMaterial color="#333333" roughness={0.4} metalness={0.3} />
        </mesh>
      ))}
      
      {/* Handle */}
      <mesh position={[0.65, 0, 1.12]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.06, 0.8, 0.04]} />
        <meshStandardMaterial color="#808080" roughness={0.3} metalness={0.9} />
      </mesh>
      
      {/* Interior light glow */}
      <mesh position={[0, 0, 0.5]}>
        <boxGeometry args={[1.2, height - 0.3, 0.01]} />
        <meshBasicMaterial color="#e8f0ff" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

// Detailed French Door Refrigerator
function DetailedRefrigerator({ 
  position, 
  color = '#C0C0C0',
  style = 'french-door'
}: { 
  position: [number, number, number]; 
  color?: string;
  style?: 'french-door' | 'side-by-side' | 'top-freezer' | 'integrated';
}) {
  const isIntegrated = style === 'integrated';
  const bodyColor = isIntegrated ? '#F5F5F5' : color;
  
  return (
    <group position={position}>
      {/* Main body */}
      <mesh castShadow>
        <boxGeometry args={[3, 5.8, 2.5]} />
        <meshStandardMaterial color={bodyColor} roughness={isIntegrated ? 0.5 : 0.2} metalness={isIntegrated ? 0.1 : 0.9} />
      </mesh>
      
      {style === 'french-door' && (
        <>
          {/* Left door */}
          <mesh position={[-0.75, 0.8, 1.26]}>
            <boxGeometry args={[1.45, 3.5, 0.05]} />
            <meshStandardMaterial color={bodyColor} roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Right door */}
          <mesh position={[0.75, 0.8, 1.26]}>
            <boxGeometry args={[1.45, 3.5, 0.05]} />
            <meshStandardMaterial color={bodyColor} roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Door gap */}
          <mesh position={[0, 0.8, 1.27]}>
            <boxGeometry args={[0.02, 3.5, 0.01]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          {/* Freezer drawer */}
          <mesh position={[0, -2.0, 1.26]}>
            <boxGeometry args={[2.95, 1.5, 0.05]} />
            <meshStandardMaterial color={bodyColor} roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Handles - vertical bars */}
          <mesh position={[-0.1, 0.8, 1.35]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.06, 1.2, 0.04]} />
            <meshStandardMaterial color="#808080" roughness={0.3} metalness={0.9} />
          </mesh>
          <mesh position={[0.1, 0.8, 1.35]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.06, 1.2, 0.04]} />
            <meshStandardMaterial color="#808080" roughness={0.3} metalness={0.9} />
          </mesh>
          {/* Freezer handle */}
          <mesh position={[0, -2.0, 1.35]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 1.5, 12]} />
            <meshStandardMaterial color="#808080" roughness={0.3} metalness={0.9} />
          </mesh>
          {/* Ice/water dispenser */}
          <mesh position={[-0.75, 0.3, 1.3]}>
            <boxGeometry args={[0.6, 0.8, 0.08]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.3} />
          </mesh>
        </>
      )}
      
      {style === 'side-by-side' && (
        <>
          {/* Left door (freezer) */}
          <mesh position={[-0.9, 0, 1.26]}>
            <boxGeometry args={[1.15, 5.6, 0.05]} />
            <meshStandardMaterial color={bodyColor} roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Right door (fridge) */}
          <mesh position={[0.6, 0, 1.26]}>
            <boxGeometry args={[1.75, 5.6, 0.05]} />
            <meshStandardMaterial color={bodyColor} roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Door gap */}
          <mesh position={[-0.3, 0, 1.27]}>
            <boxGeometry args={[0.02, 5.6, 0.01]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          {/* Handles */}
          <mesh position={[-0.4, 0, 1.35]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.06, 1.5, 0.04]} />
            <meshStandardMaterial color="#808080" roughness={0.3} metalness={0.9} />
          </mesh>
          <mesh position={[-0.2, 0, 1.35]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.06, 1.5, 0.04]} />
            <meshStandardMaterial color="#808080" roughness={0.3} metalness={0.9} />
          </mesh>
        </>
      )}
    </group>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ProceduralKitchen() {
  const sceneAnalysis = useShowroomStore((s) => s.sceneAnalysis);
  const settings = useShowroomStore((s) => s.settings);
  const lightingScene = useShowroomStore((s) => s.lightingScene);

  // Always log GPT analysis to help debug
  useEffect(() => {
    if (sceneAnalysis) {
      console.log('=== GPT ANALYSIS RECEIVED ===');
      console.log('Layout:', sceneAnalysis.room?.layout);
      console.log('Cabinet Color:', sceneAnalysis.cabinets?.color);
      console.log('Cabinet Style:', sceneAnalysis.cabinets?.style);
      console.log('Island Present:', sceneAnalysis.island?.present);
      console.log('Island Color:', sceneAnalysis.island?.color);
      console.log('Countertop Color:', sceneAnalysis.countertops?.color);
      console.log('Flooring Color:', sceneAnalysis.flooring?.color);
      console.log('Pendant Style:', sceneAnalysis.lighting?.pendants?.style);
      console.log('Pendant Color:', sceneAnalysis.lighting?.pendants?.color);
      console.log('Wood Accents:', sceneAnalysis.woodAccents?.present, sceneAnalysis.woodAccents?.color);
      console.log('Cabinet Runs:', sceneAnalysis.cabinets?.runs);
      console.log('Full Analysis:', sceneAnalysis);
    }
  }, [sceneAnalysis]);

  // ========== ADAPTIVE MATERIALS ==========
  const getFinishProps = (finish?: string) => {
    switch (finish) {
      case 'gloss': return { roughness: 0.08, metalness: 0.1 };
      case 'matte': return { roughness: 0.6, metalness: 0.02 };
      default: return { roughness: 0.45, metalness: 0.02 };
    }
  };
  const cabinetFinish = getFinishProps(sceneAnalysis?.cabinets.finish);

  // MATERIAL PRIORITY:
  // 1. If user selected a material (settings.materials.X is not empty), use that
  // 2. Otherwise, if GPT detected a color, use GPT color
  // 3. Otherwise, use default
  const gptCabinetColor = sceneAnalysis?.cabinets?.color;
  const userSelectedCabinet = settings.materials.cabinetMaterial;
  
  const cabinetMat = userSelectedCabinet && CABINET_MATERIALS[userSelectedCabinet]
    ? CABINET_MATERIALS[userSelectedCabinet]
    : gptCabinetColor
    ? { color: gptCabinetColor, ...cabinetFinish }
    : { color: '#F5F5F5', ...cabinetFinish };
  

  // Two-tone: upper cabinets can have different color
  const isTwoTone = sceneAnalysis?.cabinets?.isTwoTone ?? false;
  const gptUpperColor = sceneAnalysis?.cabinets?.upperColor;
  // Upper cabinets use user selection if set, else GPT upper color if two-tone, else same as base
  const upperCabinetMat = userSelectedCabinet && CABINET_MATERIALS[userSelectedCabinet]
    ? CABINET_MATERIALS[userSelectedCabinet]
    : isTwoTone && gptUpperColor
    ? { color: gptUpperColor, ...cabinetFinish }
    : cabinetMat;

  // Island uses its own GPT-detected color, fallback to cabinet color
  const islandColor = sceneAnalysis?.island?.color ?? cabinetMat.color;
  const islandMat = { color: islandColor, ...cabinetFinish };
  
  // Cabinet style (slab, shaker, flat-panel, etc.)
  const cabinetStyle = sceneAnalysis?.cabinets?.style ?? 'shaker';
  const isSlabStyle = cabinetStyle === 'slab' || cabinetStyle === 'flat-panel';
  
  // Log actual materials being used
  useEffect(() => {
    if (sceneAnalysis) {
      console.log('=== MATERIALS BEING USED ===');
      console.log('Cabinet Material:', userSelectedCabinet || 'GPT color: ' + gptCabinetColor);
      console.log('Cabinet Mat Final:', cabinetMat.color);
      console.log('Island Mat Final:', islandMat.color);
    }
  }, [sceneAnalysis, userSelectedCabinet, gptCabinetColor, cabinetMat, islandMat]);

  // COUNTERTOP: User selection > GPT color > default
  const gptCountertopColor = sceneAnalysis?.countertops?.color;
  const userSelectedCountertop = settings.materials.countertopMaterial;
  const presetCountertop = userSelectedCountertop && COUNTERTOP_MATERIALS[userSelectedCountertop] 
    ? COUNTERTOP_MATERIALS[userSelectedCountertop] : null;
  
  const countertopMat = presetCountertop
    ? { color: presetCountertop.color, roughness: presetCountertop.roughness, metalness: presetCountertop.metalness }
    : gptCountertopColor
    ? { color: gptCountertopColor, roughness: 0.12, metalness: 0.05 }
    : { color: '#F8F8F0', roughness: 0.12, metalness: 0.05 };
  const countertopHasVeins = presetCountertop?.hasVeins ?? (sceneAnalysis?.countertops?.pattern === 'veined');

  // FLOORING: If sceneAnalysis exists, use GPT color
  const gptFloorColor = sceneAnalysis?.flooring?.color;
  // Determine floor type from GPT analysis
  const getFloorType = () => {
    const material = sceneAnalysis?.flooring.material;
    const pattern = sceneAnalysis?.flooring.pattern;
    
    // Check material first
    if (material === 'terrazzo') return 'terrazzo';
    
    // Check pattern
    if (pattern === 'herringbone' || pattern === 'chevron') return 'herringbone';
    if (pattern === 'random' || pattern === 'speckled') return 'terrazzo';
    if (pattern === 'grid') return 'tile';
    
    // Then check other materials
    if (material === 'tile' || material === 'stone' || material === 'concrete') return 'tile';
    if (material === 'hardwood' || material === 'vinyl' || material === 'laminate') return 'plank';
    
    return 'plank'; // Default to plank
  };
  const floorType = getFloorType();
  const floorRoughness = floorType === 'tile' ? 0.15 : floorType === 'terrazzo' ? 0.2 : 0.35;
  // FLOORING: User selection > GPT color > default
  const userSelectedFloor = settings.materials.flooringMaterial;
  const presetFloor = userSelectedFloor && FLOORING_MATERIALS[userSelectedFloor] ? FLOORING_MATERIALS[userSelectedFloor] : null;
  
  const floorMat = presetFloor
    ? presetFloor
    : gptFloorColor
    ? { color: gptFloorColor, roughness: floorRoughness, type: floorType }
    : { color: '#C4A872', roughness: floorRoughness, type: floorType };

  // BACKSPLASH: User selection > GPT color > default
  const gptBacksplashColor = sceneAnalysis?.backsplash?.color;
  const userSelectedBacksplash = settings.materials.backsplashMaterial;
  const presetBacksplash = userSelectedBacksplash && BACKSPLASH_MATERIALS[userSelectedBacksplash] 
    ? BACKSPLASH_MATERIALS[userSelectedBacksplash] : null;
  
  const backsplashMat = presetBacksplash
    ? presetBacksplash
    : gptBacksplashColor
    ? { color: gptBacksplashColor, roughness: 0.25 }
    : { color: '#FFFFFF', roughness: 0.25 };

  // HARDWARE: User selection > GPT color > default
  const gptHardwareColor = sceneAnalysis?.cabinets?.hardwareColor;
  const userSelectedHardware = settings.materials.hardwareMaterial;
  const presetHardware = userSelectedHardware && HARDWARE_MATERIALS[userSelectedHardware]
    ? HARDWARE_MATERIALS[userSelectedHardware] : null;
  
  const hardwareMat = presetHardware
    ? presetHardware
    : gptHardwareColor
    ? { color: gptHardwareColor, roughness: 0.3, metalness: 0.9 }
    : { color: '#C0C0C0', roughness: 0.3, metalness: 0.9 };

  const pendantStyle = sceneAnalysis?.lighting.pendants.style ?? 'globe';
  const pendantColor = sceneAnalysis?.lighting.pendants.color ?? '#D4AF37';
  const presetLightingStyle = settings.materials.lightingType ? LIGHTING_STYLES[settings.materials.lightingType] : null;
  const lightingStyle = presetLightingStyle ?? { type: pendantStyle, fixtureColor: pendantColor, glowIntensity: 0.7 };

  const hasWoodAccents = sceneAnalysis?.woodAccents?.present ?? false;
  // Default to warm walnut brown (not reddish)
  const woodAccentColor = sceneAnalysis?.woodAccents?.color ?? '#8B6914';

  // Appliances - comprehensive detection
  const appliances = sceneAnalysis?.appliances;
  
  // Range Hood
  const hasRangeHood = appliances?.rangeHood?.present ?? false;
  const rangeHoodWall = appliances?.rangeHood?.wall ?? 'back';
  const rangeHoodPos = appliances?.rangeHood?.positionAlongWall ?? 0.5;
  const rangeHoodStyle = appliances?.rangeHood?.style ?? 'wall-mount';
  const rangeHoodMaterial = appliances?.rangeHood?.material ?? 'stainless';
  
  // Range (Stove with cooktop + oven combo)
  const hasRange = (appliances as any)?.range?.present ?? false;
  const rangeWall = (appliances as any)?.range?.wall ?? 'back';
  const rangePos = (appliances as any)?.range?.positionAlongWall ?? 0.5;
  const rangeType = (appliances as any)?.range?.type ?? 'gas';
  const rangeColor = (appliances as any)?.range?.color ?? '#2D2D2D';
  const rangeWidth = (appliances as any)?.range?.widthInches ?? 30;
  
  // Wall Oven (separate from range)
  const hasOven = appliances?.oven?.present ?? false;
  const ovenWall = appliances?.oven?.wall ?? 'back';
  const ovenPos = appliances?.oven?.positionAlongWall ?? 0.3;
  const ovenType = appliances?.oven?.type ?? 'wall-oven';
  
  // Cooktop (separate, e.g. on island)
  const hasCooktop = appliances?.cooktop?.present ?? false;
  const cooktopWall = appliances?.cooktop?.wall ?? 'back';
  const cooktopPos = appliances?.cooktop?.positionAlongWall ?? 0.5;
  const cooktopType = appliances?.cooktop?.type ?? 'gas';
  
  // Refrigerator
  const hasFridge = appliances?.refrigerator?.present ?? false;
  const fridgeWall = appliances?.refrigerator?.wall ?? 'left';
  const fridgePos = appliances?.refrigerator?.positionAlongWall ?? 0.95;
  const fridgeWidth = appliances?.refrigerator?.widthFeet ?? 3;
  const fridgeColor = appliances?.refrigerator?.color ?? '#C0C0C0';
  const fridgeStyle = appliances?.refrigerator?.style ?? 'french-door';
  
  // Dishwasher
  const hasDishwasher = appliances?.dishwasher?.present ?? false;
  const dishwasherWall = appliances?.dishwasher?.wall ?? 'back';
  const dishwasherPos = appliances?.dishwasher?.positionAlongWall ?? 0.35;
  
  // Sink
  const hasSink = appliances?.sink?.present ?? true;
  const sinkWall = appliances?.sink?.wall ?? 'back';
  const sinkPos = appliances?.sink?.positionAlongWall ?? 0.5;
  const sinkStyle = appliances?.sink?.style ?? 'undermount';
  const sinkMaterial = appliances?.sink?.material ?? 'stainless';
  
  // Microwave
  const hasMicrowave = appliances?.microwave?.present ?? false;
  const microwaveWall = appliances?.microwave?.wall ?? 'back';
  const microwavePos = appliances?.microwave?.positionAlongWall ?? 0.5;
  const microwaveLocation = appliances?.microwave?.location ?? 'over-range';
  
  // Wine Fridge
  const hasWineFridge = (appliances as any)?.wineFridge?.present ?? false;
  const wineFridgeWall = (appliances as any)?.wineFridge?.wall ?? 'back';
  const wineFridgePos = (appliances as any)?.wineFridge?.positionAlongWall ?? 0.8;
  const wineFridgeLocation = (appliances as any)?.wineFridge?.location ?? 'under-counter';
  
  // Open Shelving
  const hasOpenShelving = sceneAnalysis?.openShelving?.present ?? false;
  const openShelvingWall = sceneAnalysis?.openShelving?.wall ?? 'back';
  const openShelvingPos = sceneAnalysis?.openShelving?.positionAlongWall ?? 0.8;
  const openShelvingWidth = sceneAnalysis?.openShelving?.widthFeet ?? 2;
  const openShelvingColor = sceneAnalysis?.openShelving?.color ?? '#8B5A2B';
  const openShelvingCount = sceneAnalysis?.openShelving?.shelfCount ?? 3;
  
  const hasGlassFronts = sceneAnalysis?.cabinets?.hasGlassFronts ?? false;

  const isPremiumHardware = settings.upgrades.premiumHardware;
  const hasWaterfall = settings.upgrades.waterfallEdge;
  const hasUndercabLighting = settings.upgrades.undercabLighting;

  // ========== LAYOUT ==========
  const roomLayout = sceneAnalysis?.room.layout ?? 'single-wall';
  const roomWidth = sceneAnalysis?.room.widthFeet ?? 16;
  const roomDepth = sceneAnalysis?.room.depthFeet ?? 14;
  const ceilingHeight = sceneAnalysis?.room.ceilingHeightFeet ?? 9;
  const wallColor = sceneAnalysis?.walls.color ?? '#F8F8F8';

  type CabinetRun = {
    wall: 'back' | 'left' | 'right';
    startX: number;
    lengthFeet: number;
    hasUpperCabinets: boolean;
    baseCabinetCount?: number;
    upperCabinetCount?: number;
    hasDrawerStack?: boolean;
    drawerStackPosition?: number;
  };

  const cabinetRuns: CabinetRun[] = useMemo(() => {
    if (sceneAnalysis?.cabinets?.runs && sceneAnalysis.cabinets.runs.length > 0) {
      return sceneAnalysis.cabinets.runs as CabinetRun[];
    }
    switch (roomLayout) {
      case 'U-shaped':
        return [
          { wall: 'back' as const, startX: 0, lengthFeet: roomWidth - 4, hasUpperCabinets: true },
          { wall: 'left' as const, startX: 0, lengthFeet: roomDepth - 4, hasUpperCabinets: true },
          { wall: 'right' as const, startX: 0, lengthFeet: roomDepth - 4, hasUpperCabinets: true },
        ];
      case 'L-shaped':
        return [
          { wall: 'back' as const, startX: 0, lengthFeet: roomWidth - 2, hasUpperCabinets: true },
          { wall: 'left' as const, startX: 0, lengthFeet: roomDepth - 4, hasUpperCabinets: true },
        ];
      case 'galley':
        return [
          { wall: 'back' as const, startX: 0, lengthFeet: roomWidth - 2, hasUpperCabinets: true },
          { wall: 'right' as const, startX: 0, lengthFeet: roomWidth - 2, hasUpperCabinets: false },
        ];
      default:
        return [
          { wall: 'back' as const, startX: 0, lengthFeet: roomWidth - 2, hasUpperCabinets: true },
        ];
    }
  }, [sceneAnalysis?.cabinets.runs, roomLayout, roomWidth, roomDepth]);

  const hasUpperCabinets = sceneAnalysis?.cabinets?.upperCabinets ?? true;
  const islandLengthInches = settings.roomDimensions.islandLength;
  const islandLength = islandLengthInches / 12;
  const islandWidth = sceneAnalysis?.island?.widthFeet ?? 3.5;
  // CRITICAL: Only show island if GPT detected one
  const gptIslandPresent = sceneAnalysis?.island?.present;
  const hasIsland = gptIslandPresent === true && islandLength > 0;
  
  const windows = sceneAnalysis?.windows ?? [];
  const recessedCount = sceneAnalysis?.lighting.recessed.count ?? 3;

  const baseHeightInches = sceneAnalysis?.cabinets.baseHeight ?? settings.cabinetHeight ?? 36;
  const upperHeightInches = sceneAnalysis?.cabinets.upperHeight ?? 36;
  const baseHeight = baseHeightInches / 12;
  const upperHeight = upperHeightInches / 12;
  
  // Cabinet depths - uppers are shallower than base cabinets
  const baseDepthInches = (sceneAnalysis?.cabinets as any)?.baseDepth ?? 24;
  const upperDepthInches = (sceneAnalysis?.cabinets as any)?.upperDepth ?? 12;
  const cabinetDepth = baseDepthInches / 12;  // Base cabinet depth in feet
  const upperCabinetDepth = upperDepthInches / 12;  // Upper cabinet depth in feet (shallower)

  // Lighting config
  const lightConfig = useMemo(() => {
    switch (lightingScene) {
      case 'evening':
        return { ambient: 0.15, hemisphere: 0.12, key: 0.25, fill: 0.08, rim: 0.05, recessed: 0.9, pendant: 1.2, ambientColor: '#FFE4C4', keyColor: '#FFA07A', envColor: '#2D1F14' };
      case 'showroom':
        return { ambient: 0.6, hemisphere: 0.5, key: 1.4, fill: 0.6, rim: 0.4, recessed: 0.7, pendant: 0.9, ambientColor: '#FFFFFF', keyColor: '#FFFFFF', envColor: '#F0F0F0' };
      default:
        return { ambient: 0.45, hemisphere: 0.4, key: 1.0, fill: 0.35, rim: 0.2, recessed: 0.5, pendant: 0.6, ambientColor: '#FFFAF0', keyColor: '#FFFAF0', envColor: '#F5F5F5' };
    }
  }, [lightingScene]);

  const floorSize: [number, number] = [roomWidth + 4, roomDepth + 6];

  // Appliance zones helper
  const getApplianceZones = (wall: string) => {
    const zones: Array<{ start: number; end: number; type: string; skipLower: boolean; skipUpper: boolean }> = [];
    if (hasFridge && fridgeWall === wall) {
      const fridgeNormWidth = fridgeWidth / (wall === 'back' ? roomWidth : roomDepth);
      zones.push({ start: fridgePos - fridgeNormWidth / 2, end: fridgePos + fridgeNormWidth / 2, type: 'fridge', skipLower: true, skipUpper: true });
    }
    if (hasOven && ovenWall === wall) {
      zones.push({ start: ovenPos - 0.08, end: ovenPos + 0.08, type: 'oven', skipLower: true, skipUpper: true });
    }
    if (hasCooktop && cooktopWall === wall) {
      zones.push({ start: cooktopPos - 0.08, end: cooktopPos + 0.08, type: 'cooktop', skipLower: false, skipUpper: true });
    }
    if (hasRangeHood && rangeHoodWall === wall) {
      zones.push({ start: rangeHoodPos - 0.1, end: rangeHoodPos + 0.1, type: 'rangehood', skipLower: false, skipUpper: true });
    }
    if (hasOpenShelving && openShelvingWall === wall) {
      const shelfNormWidth = openShelvingWidth / (wall === 'back' ? roomWidth : roomDepth);
      zones.push({ start: openShelvingPos - shelfNormWidth / 2, end: openShelvingPos + shelfNormWidth / 2, type: 'shelving', skipLower: false, skipUpper: true });
    }
    return zones;
  };

  // Floor component
  const FloorComponent = useMemo(() => {
    if (floorMat.type === 'herringbone' || sceneAnalysis?.flooring.pattern === 'herringbone') {
      return <HerringboneFloor size={floorSize} color={floorMat.color} roughness={floorMat.roughness} />;
    } else if (floorMat.type === 'plank') {
      return <RealisticPlankFloor size={floorSize} color={floorMat.color} roughness={floorMat.roughness} />;
    } else if (floorMat.type === 'terrazzo' || sceneAnalysis?.flooring.pattern === 'random') {
      return <RealisticTerrazzoFloor size={floorSize} color={floorMat.color} />;
    }
    return <RealisticTileFloor size={floorSize} color={floorMat.color} roughness={floorMat.roughness} />;
  }, [floorMat, floorSize, sceneAnalysis?.flooring.pattern]);

  return (
    <group>
      {/* LIGHTING */}
      <ambientLight intensity={lightConfig.ambient} color={lightConfig.ambientColor} />
      <hemisphereLight intensity={lightConfig.hemisphere} color="#FFFFFF" groundColor={lightConfig.envColor} />
      <directionalLight position={[8, 12, 5]} intensity={lightConfig.key} color={lightConfig.keyColor} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0001} />
      <directionalLight position={[-6, 8, 8]} intensity={lightConfig.fill} color="#F0F0FF" />
      <directionalLight position={[0, 5, -10]} intensity={lightConfig.rim} color="#FFF8E8" />

      {/* FLOOR */}
      {FloorComponent}

      {/* WALLS */}
      <mesh position={[0, ceilingHeight / 2, -roomDepth / 2 - 0.02]} receiveShadow>
        <planeGeometry args={[roomWidth + 2, ceilingHeight + 1]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      {(roomLayout === 'L-shaped' || roomLayout === 'U-shaped') && cabinetRuns.some(r => r.wall === 'left') && (
        <mesh position={[-roomWidth / 2 - 0.02, ceilingHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[roomDepth + 2, ceilingHeight + 1]} />
          <meshStandardMaterial color={wallColor} roughness={0.95} side={THREE.DoubleSide} />
        </mesh>
      )}
      {(roomLayout === 'U-shaped' || roomLayout === 'galley') && cabinetRuns.some(r => r.wall === 'right') && (
        <mesh position={[roomWidth / 2 + 0.02, ceilingHeight / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[roomDepth + 2, ceilingHeight + 1]} />
          <meshStandardMaterial color={wallColor} roughness={0.95} side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* CEILING - use GPT ceiling color */}
      <mesh position={[0, ceilingHeight, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomWidth * 2, roomDepth * 2]} />
        <meshStandardMaterial color={sceneAnalysis?.walls?.ceilingColor ?? '#FFFFFF'} roughness={0.98} />
      </mesh>

      {/* CABINETS */}
      {cabinetRuns.map((run, runIdx) => {
        const runLengthFeet = run.lengthFeet;
        const applianceZones = getApplianceZones(run.wall);
        
        // Add windows to appliance zones so upper cabinets are skipped WHERE windows are (not everywhere)
        const windowsOnWall = windows.filter(w => w.wall === run.wall);
        const windowZones = windowsOnWall.map(w => {
          const windowCenter = w.positionX / runLengthFeet;
          const windowHalfWidth = (w.widthFeet / 2) / runLengthFeet;
          return { start: windowCenter - windowHalfWidth - 0.05, end: windowCenter + windowHalfWidth + 0.05, type: 'window', skipLower: false, skipUpper: true };
        });
        const allZones = [...applianceZones, ...windowZones];
        
        const calculateEffectiveCabinetCount = (count: number | undefined, isUpper: boolean) => {
          if (count && count > 0) return count;
          const defaultWidth = 2;
          const baseCount = Math.max(1, Math.floor(runLengthFeet / defaultWidth));
          const gaps = applianceZones.filter(z => isUpper ? z.skipUpper : z.skipLower).length;
          return Math.max(1, baseCount - gaps);
        };
        
        const baseCabinetCount = calculateEffectiveCabinetCount(run.baseCabinetCount, false);
        const upperCabinetCount = calculateEffectiveCabinetCount(run.upperCabinetCount, true);
        const baseCabinetWidth = runLengthFeet / baseCabinetCount;
        const upperCabinetWidth = runLengthFeet / Math.max(1, upperCabinetCount);
        const upperY = baseHeight + 1.6 + upperHeight / 2;

        const getPositionAlongWall = (normPos: number, y: number, zOffset: number = 0.08): [number, number, number] => {
          const offset = -runLengthFeet / 2 + normPos * runLengthFeet;
          switch (run.wall) {
            case 'back': return [offset, y, -roomDepth / 2 + cabinetDepth / 2 + zOffset];
            case 'left': return [-roomWidth / 2 + cabinetDepth / 2 + zOffset, y, offset];
            case 'right': return [roomWidth / 2 - cabinetDepth / 2 - zOffset, y, offset];
            default: return [offset, y, -roomDepth / 2 + cabinetDepth / 2 + zOffset];
          }
        };
        
        const getRotation = (): [number, number, number] => {
          switch (run.wall) {
            case 'left': return [0, Math.PI / 2, 0];
            case 'right': return [0, -Math.PI / 2, 0];
            default: return [0, 0, 0];
          }
        };
        
        const getCountertopPosition = (): [number, number, number] => {
          switch (run.wall) {
            case 'back': return [0, baseHeight + 0.025, -roomDepth / 2 + cabinetDepth / 2 + 0.15];
            case 'left': return [-roomWidth / 2 + cabinetDepth / 2 + 0.15, baseHeight + 0.025, 0];
            case 'right': return [roomWidth / 2 - cabinetDepth / 2 - 0.15, baseHeight + 0.025, 0];
            default: return [0, baseHeight + 0.025, -roomDepth / 2 + cabinetDepth / 2 + 0.15];
          }
        };
        
        const getCountertopDimensions = (): { width: number; depth: number; rotation: number } => {
          if (run.wall === 'left' || run.wall === 'right') {
            return { width: run.lengthFeet + 0.2, depth: cabinetDepth + 0.2, rotation: Math.PI / 2 };
          }
          return { width: run.lengthFeet + 0.2, depth: cabinetDepth + 0.2, rotation: 0 };
        };

        const rotation = getRotation();
        const ctDims = getCountertopDimensions();

        // Check if we have detailed cabinet specs from GPT
        const hasDetailedBaseCabinets = (run as any).baseCabinets && (run as any).baseCabinets.length > 0;
        const hasDetailedUpperCabinets = (run as any).upperCabinets && (run as any).upperCabinets.length > 0;
        
        // Calculate positions for detailed cabinets
        const getDetailedCabinetPositions = (cabinets: Array<{widthInches: number; type: string; hasDrawers?: boolean}>, isUpper: boolean) => {
          const totalWidthInches = cabinets.reduce((sum, c) => sum + c.widthInches, 0);
          const totalWidthFeet = totalWidthInches / 12;
          let currentX = -totalWidthFeet / 2;
          
          return cabinets.map((cab, i) => {
            const widthFeet = cab.widthInches / 12;
            const centerX = currentX + widthFeet / 2;
            currentX += widthFeet;
            
            const normalizedPos = (centerX + totalWidthFeet / 2) / totalWidthFeet;
            
            return {
              ...cab,
              widthFeet,
              centerX,
              normalizedPos,
            };
          });
        };
        
        const detailedBaseCabinets = hasDetailedBaseCabinets 
          ? getDetailedCabinetPositions((run as any).baseCabinets, false)
          : null;
        const detailedUpperCabinets = hasDetailedUpperCabinets 
          ? getDetailedCabinetPositions((run as any).upperCabinets, true)
          : null;

        return (
          <group key={`${run.wall}-${runIdx}`}>
            {/* BASE CABINETS - Use detailed specs if available, SlabCabinet for slab style */}
            {detailedBaseCabinets ? (
              // Render with EXACT widths from GPT analysis - FLUSH placement
              detailedBaseCabinets.map((cab, i) => {
                const conflictingZone = allZones.find(zone => cab.normalizedPos >= zone.start && cab.normalizedPos <= zone.end);
                if (conflictingZone?.skipLower || cab.type === 'appliance-gap') return null;
                
                const pos = getPositionAlongWall(cab.normalizedPos, baseHeight / 2);
                const isDrawer = cab.type === 'drawer-stack';
                const isOpenBasket = cab.type === 'open-basket';
                
                return (
                  <group key={`base-${i}`} position={pos} rotation={rotation}>
                    {isOpenBasket ? (
                      <OpenBasketStorage
                        position={[0, 0, 0]}
                        width={cab.widthFeet}
                        height={baseHeight}
                        depth={cabinetDepth}
                        frameColor={cabinetMat.color}
                        basketCount={2}
                      />
                    ) : isSlabStyle ? (
                      <SlabCabinet 
                        position={[0, 0, 0]} 
                        width={cab.widthFeet} 
                        height={baseHeight} 
                        depth={cabinetDepth} 
                        color={cabinetMat.color}
                        hardwareMat={hardwareMat} 
                        isUpper={false}
                        hasHandle={!isDrawer}
                      />
                    ) : (
                      <RealisticCabinet 
                        position={[0, 0, 0]} 
                        width={cab.widthFeet} 
                        height={baseHeight} 
                        depth={cabinetDepth} 
                        material={cabinetMat} 
                        hardwareMat={hardwareMat} 
                        isPremiumHardware={isPremiumHardware} 
                        isDrawer={isDrawer}
                      />
                    )}
                  </group>
                );
              })
            ) : (
              // Fallback to evenly distributed cabinets
              Array.from({ length: baseCabinetCount }).map((_, i) => {
                const normalizedPos = (i + 0.5) / baseCabinetCount;
                const conflictingZone = allZones.find(zone => normalizedPos >= zone.start && normalizedPos <= zone.end);
                if (conflictingZone?.skipLower) return null;
                const pos = getPositionAlongWall(normalizedPos, baseHeight / 2);
                const isDrawer = run.hasDrawerStack && run.drawerStackPosition !== undefined && Math.abs(normalizedPos - run.drawerStackPosition) < (1 / baseCabinetCount);
                return (
                  <group key={`base-${i}`} position={pos} rotation={rotation}>
                    {isSlabStyle ? (
                      <SlabCabinet position={[0, 0, 0]} width={baseCabinetWidth} height={baseHeight} depth={cabinetDepth} color={cabinetMat.color} hardwareMat={hardwareMat} isUpper={false} hasHandle={!isDrawer} />
                    ) : (
                      <RealisticCabinet position={[0, 0, 0]} width={baseCabinetWidth} height={baseHeight} depth={cabinetDepth} material={cabinetMat} hardwareMat={hardwareMat} isPremiumHardware={isPremiumHardware} isDrawer={isDrawer} />
                    )}
                  </group>
                );
              })
            )}
            
            {/* UPPER CABINETS - Use detailed specs if available, SlabCabinet for slab style */}
            {run.hasUpperCabinets && hasUpperCabinets && (
              detailedUpperCabinets ? (
                // Render with EXACT widths from GPT analysis
                detailedUpperCabinets.map((cab, i) => {
                  const conflictingZone = allZones.find(zone => cab.normalizedPos >= zone.start && cab.normalizedPos <= zone.end);
                  if (conflictingZone?.skipUpper || cab.type === 'appliance-gap') return null;
                  
                  const pos = getPositionAlongWall(cab.normalizedPos, upperY, -0.22);
                  const useGlassFront = cab.type === 'glass-door' || (hasGlassFronts && (i === 1 || i === detailedUpperCabinets.length - 2));
                  const isOpenShelf = cab.type === 'open-shelf';
                  
                  if (isOpenShelf) {
                    return (
                      <group key={`upper-${i}`} position={pos} rotation={rotation}>
                        <OpenShelving position={[0, 0, 0]} width={cab.widthFeet} shelfCount={3} color={upperCabinetMat.color} />
                      </group>
                    );
                  }
                  
                  return (
                    <group key={`upper-${i}`} position={pos} rotation={rotation}>
                      {useGlassFront ? (
                        <GlassFrontCabinet position={[0, 0, 0]} width={cab.widthFeet} height={upperHeight} depth={upperCabinetDepth} frameColor={upperCabinetMat.color} hardwareMat={hardwareMat} />
                      ) : isSlabStyle ? (
                        <SlabCabinet position={[0, 0, 0]} width={cab.widthFeet} height={upperHeight} depth={upperCabinetDepth} color={upperCabinetMat.color} hardwareMat={hardwareMat} isUpper hasHandle />
                      ) : (
                        <RealisticCabinet position={[0, 0, 0]} width={cab.widthFeet} height={upperHeight} depth={upperCabinetDepth} material={upperCabinetMat} hardwareMat={hardwareMat} isPremiumHardware={isPremiumHardware} isUpper />
                      )}
                    </group>
                  );
                })
              ) : (
                // Fallback to evenly distributed cabinets
                Array.from({ length: upperCabinetCount }).map((_, i) => {
                  const normalizedPos = (i + 0.5) / upperCabinetCount;
                  const conflictingZone = allZones.find(zone => normalizedPos >= zone.start && normalizedPos <= zone.end);
                  if (conflictingZone?.skipUpper) return null;
                  const pos = getPositionAlongWall(normalizedPos, upperY, -0.22);
                  const useGlassFront = hasGlassFronts && (i === 1 || i === upperCabinetCount - 2);
                  return (
                    <group key={`upper-${i}`} position={pos} rotation={rotation}>
                      {useGlassFront ? (
                        <GlassFrontCabinet position={[0, 0, 0]} width={upperCabinetWidth} height={upperHeight} depth={upperCabinetDepth} frameColor={upperCabinetMat.color} hardwareMat={hardwareMat} />
                      ) : isSlabStyle ? (
                        <SlabCabinet position={[0, 0, 0]} width={upperCabinetWidth} height={upperHeight} depth={upperCabinetDepth} color={upperCabinetMat.color} hardwareMat={hardwareMat} isUpper hasHandle />
                      ) : (
                        <RealisticCabinet position={[0, 0, 0]} width={upperCabinetWidth} height={upperHeight} depth={upperCabinetDepth} material={upperCabinetMat} hardwareMat={hardwareMat} isPremiumHardware={isPremiumHardware} isUpper />
                      )}
                    </group>
                  );
                })
              )
            )}
            
            {/* COUNTERTOP */}
            <group position={getCountertopPosition()} rotation={[0, ctDims.rotation, 0]}>
              <RealisticCountertop position={[0, 0, 0]} width={ctDims.width} depth={ctDims.depth} material={countertopMat} hasVeins={countertopHasVeins} />
            </group>
          </group>
        );
      })}

      {/* BACKSPLASH */}
      {sceneAnalysis?.backsplash.present !== false && cabinetRuns.map((run, runIdx) => {
        const getBacksplashPosition = (): [number, number, number] => {
          switch (run.wall) {
            case 'back': return [0, baseHeight + 0.85, -roomDepth / 2 + 0.12];
            case 'left': return [-roomWidth / 2 + 0.12, baseHeight + 0.85, 0];
            case 'right': return [roomWidth / 2 - 0.12, baseHeight + 0.85, 0];
            default: return [0, baseHeight + 0.85, -roomDepth / 2 + 0.12];
          }
        };
        const getBacksplashRotation = (): [number, number, number] => {
          switch (run.wall) {
            case 'left': return [0, Math.PI / 2, 0];
            case 'right': return [0, -Math.PI / 2, 0];
            default: return [0, 0, 0];
          }
        };
        return (
          <group key={`backsplash-${run.wall}-${runIdx}`} position={getBacksplashPosition()} rotation={getBacksplashRotation()}>
            <RealisticBacksplash position={[0, 0, 0]} width={run.lengthFeet} height={1.4} material={backsplashMat} type={sceneAnalysis?.backsplash.type === 'subway-tile' ? 'subway' : 'grid'} />
          </group>
        );
      })}

      {/* WINDOWS */}
      {windows.filter(w => w.wall === 'back').map((win, i) => (
        <RealisticWindow key={i} position={[win.positionX ?? 0, win.bottomFromFloor + win.heightFeet / 2, -roomDepth / 2 + 0.06]} width={win.widthFeet} height={win.heightFeet} />
      ))}

      {/* SINK */}
      {hasSink && sinkWall !== 'island' && (() => {
        const getSinkPosition = (): [number, number, number] => {
          switch (sinkWall) {
            case 'back': return [-roomWidth / 2 + sinkPos * roomWidth, baseHeight + 0.05, -roomDepth / 2 + cabinetDepth / 2 + 0.12];
            case 'left': return [-roomWidth / 2 + cabinetDepth / 2 + 0.12, baseHeight + 0.05, -roomDepth / 2 + sinkPos * roomDepth];
            case 'right': return [roomWidth / 2 - cabinetDepth / 2 - 0.12, baseHeight + 0.05, -roomDepth / 2 + sinkPos * roomDepth];
            default: return [0, baseHeight + 0.05, -roomDepth / 2 + cabinetDepth / 2 + 0.12];
          }
        };
        const getSinkRotation = (): [number, number, number] => {
          switch (sinkWall) {
            case 'left': return [0, Math.PI / 2, 0];
            case 'right': return [0, -Math.PI / 2, 0];
            default: return [0, 0, 0];
          }
        };
        return (
          <group position={getSinkPosition()} rotation={getSinkRotation()}>
            <RealisticSink position={[0, 0, 0]} faucetMat={hardwareMat} />
          </group>
        );
      })()}

      {/* TALL CABINETS / SHELVING UNITS */}
      {(sceneAnalysis as any)?.tallCabinets?.map((tallCab: any, idx: number) => {
        const getTallCabinetPosition = (): [number, number, number] => {
          const y = (tallCab.heightFeet || 7) / 2;
          const wallPos = tallCab.positionAlongWall ?? 0;
          switch (tallCab.wall) {
            case 'back': return [-roomWidth / 2 + wallPos * roomWidth, y, -roomDepth / 2 + 0.5];
            case 'left': return [-roomWidth / 2 + 0.5, y, -roomDepth / 2 + wallPos * roomDepth];
            case 'right': return [roomWidth / 2 - 0.5, y, -roomDepth / 2 + wallPos * roomDepth];
            default: return [0, y, -roomDepth / 2 + 0.5];
          }
        };
        const getTallCabinetRotation = (): [number, number, number] => {
          switch (tallCab.wall) {
            case 'left': return [0, Math.PI / 2, 0];
            case 'right': return [0, -Math.PI / 2, 0];
            default: return [0, 0, 0];
          }
        };
        
        const tallWidth = tallCab.widthFeet || 1.5;
        const tallHeight = tallCab.heightFeet || 7;
        const tallDepth = 1.5;
        const tallColor = tallCab.color || woodAccentColor;
        
        return (
          <group key={`tall-${idx}`} position={getTallCabinetPosition()} rotation={getTallCabinetRotation()}>
            {tallCab.type === 'open-shelving' || tallCab.type === 'display' ? (
              <TallShelvingUnit
                position={[0, 0, 0]}
                width={tallWidth}
                height={tallHeight}
                depth={tallDepth}
                color={tallColor}
                shelfCount={5}
              />
            ) : (
              // Tall pantry cabinet
              <SlabCabinet
                position={[0, 0, 0]}
                width={tallWidth}
                height={tallHeight}
                depth={tallDepth}
                color={tallColor}
                hardwareMat={hardwareMat}
                isUpper={false}
                hasHandle={true}
              />
            )}
          </group>
        );
      })}

      {/* ISLAND - detailed with reeded/slab front panel */}
      {hasIsland && islandLength > 0 && (() => {
        const islandY = baseHeight / 2;
        const islandBaseHeight = baseHeight - 0.1; // Leave room for toe kick
        const islandDepth = islandWidth;
        const isReeded = cabinetStyle === 'slab' || cabinetStyle === 'flat-panel';
        const frontZ = islandDepth / 2;
        const backZ = -islandDepth / 2;
        
        return (
          <group position={[0, 0, 2.5]}>
            {/* Island base structure */}
            <mesh position={[0, islandY, 0]} castShadow>
              <boxGeometry args={[islandLength - 0.08, islandBaseHeight, islandDepth - 0.08]} />
              <meshStandardMaterial {...islandMat} />
            </mesh>
            
            {/* Front panel - reeded wood style (facing seating area) */}
            {isReeded ? (
              <ReededPanel
                position={[0, islandY, frontZ - 0.02]}
                width={islandLength - 0.04}
                height={islandBaseHeight - 0.08}
                color={islandMat.color}
                depth={0.05}
              />
            ) : (
              /* Standard cabinet fronts for front side (shaker style) */
              <>
                {Array.from({ length: Math.max(1, Math.floor(islandLength / 0.6)) }).map((_, i) => {
                  const cabinetW = (islandLength - 0.06) / Math.max(1, Math.floor(islandLength / 0.6));
                  return (
                    <RealisticCabinet
                      key={`island-front-${i}`}
                      position={[-islandLength / 2 + cabinetW / 2 + 0.03 + i * cabinetW, islandY, frontZ - 0.01]}
                      width={cabinetW}
                      height={islandBaseHeight - 0.1}
                      depth={0.02}
                      material={islandMat}
                      hardwareMat={hardwareMat}
                      isPremiumHardware={isPremiumHardware}
                      isUpper={false}
                    />
                  );
                })}
              </>
            )}
            
            {/* Back panel - slab/flat (where sink/storage would be) */}
            <mesh position={[0, islandY, backZ + 0.02]} castShadow>
              <boxGeometry args={[islandLength - 0.04, islandBaseHeight - 0.08, 0.025]} />
              <meshStandardMaterial color={islandMat.color} roughness={0.35} metalness={0.02} />
            </mesh>
            
            {/* Side panels */}
            <mesh position={[-islandLength / 2 + 0.02, islandY, 0]} castShadow>
              <boxGeometry args={[0.025, islandBaseHeight - 0.08, islandDepth - 0.08]} />
              <meshStandardMaterial color={islandMat.color} roughness={0.35} metalness={0.02} />
            </mesh>
            <mesh position={[islandLength / 2 - 0.02, islandY, 0]} castShadow>
              <boxGeometry args={[0.025, islandBaseHeight - 0.08, islandDepth - 0.08]} />
              <meshStandardMaterial color={islandMat.color} roughness={0.35} metalness={0.02} />
            </mesh>
            
            {/* Toe kick */}
            <mesh position={[0, 0.04, frontZ - 0.06]}>
              <boxGeometry args={[islandLength - 0.1, 0.08, 0.04]} />
              <meshStandardMaterial color="#0A0A0A" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.04, backZ + 0.06]}>
              <boxGeometry args={[islandLength - 0.1, 0.08, 0.04]} />
              <meshStandardMaterial color="#0A0A0A" roughness={0.9} />
            </mesh>
            
            {/* Countertop */}
            <RealisticCountertop position={[0, baseHeight + 0.025, 0]} width={islandLength + 0.15} depth={islandDepth + 0.15} material={countertopMat} hasVeins={countertopHasVeins} />
            
            {/* Waterfall edges */}
            {hasWaterfall && (
              <>
                <mesh position={[islandLength / 2 + 0.025, baseHeight / 2, 0]} castShadow>
                  <boxGeometry args={[0.05, baseHeight, islandDepth + 0.15]} />
                  <meshStandardMaterial {...countertopMat} />
                </mesh>
                <mesh position={[-islandLength / 2 - 0.025, baseHeight / 2, 0]} castShadow>
                  <boxGeometry args={[0.05, baseHeight, islandDepth + 0.15]} />
                  <meshStandardMaterial {...countertopMat} />
                </mesh>
              </>
            )}
            
            {/* Island cooktop if on island */}
            {hasCooktop && cooktopWall === 'island' && (
              <Cooktop position={[0, baseHeight + 0.06, -0.3]} />
            )}
          </group>
        );
      })()}

      {/* APPLIANCES - All detected appliances */}
      {(() => {
        const getAppliancePosition = (wall: string, normPos: number, y: number, zOffset: number = 0): [number, number, number] => {
          switch (wall) {
            case 'back': return [-roomWidth / 2 + normPos * roomWidth, y, -roomDepth / 2 + cabinetDepth / 2 + zOffset];
            case 'left': return [-roomWidth / 2 + cabinetDepth / 2 + zOffset, y, -roomDepth / 2 + normPos * roomDepth];
            case 'right': return [roomWidth / 2 - cabinetDepth / 2 - zOffset, y, -roomDepth / 2 + normPos * roomDepth];
            default: return [0, y, 0];
          }
        };
        const getApplianceRotation = (wall: string): [number, number, number] => {
          switch (wall) {
            case 'left': return [0, Math.PI / 2, 0];
            case 'right': return [0, -Math.PI / 2, 0];
            default: return [0, 0, 0];
          }
        };
        return (
          <>
            {/* Range Hood - above cooking area */}
            {hasRangeHood && (
              <group position={getAppliancePosition(rangeHoodWall, rangeHoodPos, baseHeight + 2.5, 0.5)} rotation={getApplianceRotation(rangeHoodWall)}>
                <RangeHood position={[0, 0, 0]} width={rangeWidth / 12 + 0.5} />
              </group>
            )}
            
            {/* Range/Stove - combined cooktop and oven */}
            {hasRange && (
              <group position={getAppliancePosition(rangeWall, rangePos, baseHeight / 2 + 0.02, 0.2)} rotation={getApplianceRotation(rangeWall)}>
                <DetailedRange position={[0, 0, 0]} widthInches={rangeWidth} type={rangeType} color={rangeColor} />
              </group>
            )}
            
            {/* Separate Cooktop - if no range */}
            {hasCooktop && !hasRange && cooktopWall !== 'island' && (
              <group position={getAppliancePosition(cooktopWall, cooktopPos, baseHeight + 0.04, 0.15)} rotation={getApplianceRotation(cooktopWall)}>
                <Cooktop position={[0, 0, 0]} />
              </group>
            )}
            
            {/* Wall Oven - built into cabinet */}
            {hasOven && !hasRange && (
              <group position={getAppliancePosition(ovenWall, ovenPos, ovenType === 'double-oven' ? baseHeight + 1.5 : baseHeight / 2 + 0.8, 0.2)} rotation={getApplianceRotation(ovenWall)}>
                <BuiltInOven position={[0, 0, 0]} isDouble={ovenType === 'double-oven'} />
              </group>
            )}
            
            {/* Refrigerator */}
            {hasFridge && (
              <group position={getAppliancePosition(fridgeWall, fridgePos, 2.9, 1.2)} rotation={getApplianceRotation(fridgeWall)}>
                <DetailedRefrigerator position={[0, 0, 0]} color={fridgeColor} style={fridgeStyle} />
              </group>
            )}
            
            {/* Dishwasher - next to sink */}
            {hasDishwasher && (
              <group position={getAppliancePosition(dishwasherWall, dishwasherPos, baseHeight / 2 - 0.1, 0.1)} rotation={getApplianceRotation(dishwasherWall)}>
                <DetailedDishwasher position={[0, 0, 0]} />
              </group>
            )}
            
            {/* Microwave - over range or built-in */}
            {hasMicrowave && (
              <group 
                position={getAppliancePosition(
                  microwaveWall, 
                  microwaveLocation === 'over-range' ? rangePos : microwavePos, 
                  microwaveLocation === 'over-range' ? baseHeight + 1.5 : baseHeight + 1.8, 
                  microwaveLocation === 'over-range' ? 0.3 : -0.2
                )} 
                rotation={getApplianceRotation(microwaveWall)}
              >
                <DetailedMicrowave position={[0, 0, 0]} location={microwaveLocation} />
              </group>
            )}
            
            {/* Wine Fridge / Beverage Center */}
            {hasWineFridge && (
              <group position={getAppliancePosition(wineFridgeWall, wineFridgePos, wineFridgeLocation === 'under-counter' ? baseHeight / 2 - 0.1 : 2.2, 0.1)} rotation={getApplianceRotation(wineFridgeWall)}>
                <WineFridge position={[0, 0, 0]} location={wineFridgeLocation} />
              </group>
            )}
            
            {/* Open Shelving */}
            {hasOpenShelving && (
              <group position={getAppliancePosition(openShelvingWall, openShelvingPos, baseHeight + 1.8, -0.3)} rotation={getApplianceRotation(openShelvingWall)}>
                <OpenShelving position={[0, 0, 0]} width={openShelvingWidth} shelfCount={openShelvingCount} color={openShelvingColor} />
              </group>
            )}
          </>
        );
      })()}

      {/* WOOD SLAT ACCENTS - positioned on back wall beside backsplash */}
      {hasWoodAccents && (
        <>
          {/* Left wood slat panel */}
          <WoodSlatPanel 
            position={[-roomWidth / 2 + 0.8, baseHeight + 0.7, -roomDepth / 2 + 0.05]} 
            width={1.2} 
            height={ceilingHeight - baseHeight - 0.8} 
            color={woodAccentColor} 
          />
          {/* Right wood slat panel */}
          <WoodSlatPanel 
            position={[roomWidth / 2 - 0.8, baseHeight + 0.7, -roomDepth / 2 + 0.05]} 
            width={1.2} 
            height={ceilingHeight - baseHeight - 0.8} 
            color={woodAccentColor} 
          />
        </>
      )}

      {/* BAR STOOLS / SEATING */}
      {(() => {
        const seating = sceneAnalysis?.seating;
        if (!seating?.present || seating.count === 0) return null;
        
        const stoolCount = seating.count || 3;
        const stoolSpacing = (islandLength - 1) / Math.max(1, stoolCount - 1);
        const stoolZ = 2.5 + islandWidth / 2 + 0.8; // In front of island
        
        return Array.from({ length: stoolCount }).map((_, i) => {
          const xPos = hasIsland 
            ? -islandLength / 2 + 0.5 + i * stoolSpacing
            : -roomWidth / 4 + i * 1.5;
          return (
            <BarStool 
              key={`stool-${i}`}
              position={[xPos, 0, stoolZ]}
              color={seating.color || '#2D2D2D'}
              style={seating.style || 'modern'}
              material={seating.material || 'metal'}
            />
          );
        });
      })()}

      {/* DECORATIVE PLANTS */}
      {(() => {
        const plants = sceneAnalysis?.decor?.plants;
        if (!plants?.present || plants.count === 0) return null;
        
        return plants.locations?.map((loc: string, i: number) => {
          let pos: [number, number, number] = [0, 0, 0];
          if (loc === 'counter') pos = [roomWidth / 4, baseHeight + 0.15, -roomDepth / 2 + 0.8];
          else if (loc === 'windowsill') pos = [0, baseHeight + 1.5, -roomDepth / 2 + 0.3];
          else if (loc === 'floor') pos = [roomWidth / 2 - 1, 0, -roomDepth / 4];
          else if (loc === 'shelf') pos = [-roomWidth / 4, baseHeight + 2, -roomDepth / 2 + 0.3];
          
          return (
            <DecorativePlant 
              key={`plant-${i}`}
              position={pos}
              size={loc === 'floor' ? 'large' : 'medium'}
            />
          );
        });
      })()}

      {/* PENDANTS - over island or over counters */}
      {hasIsland && islandLength > 0 && (
        (() => {
          const pendantCount = sceneAnalysis?.lighting?.pendants?.count ?? 3;
          const useAmberGlass = lightingStyle.type === 'amber-glass' || lightingStyle.type === 'smoke-glass';
          const spacing = islandLength / Math.max(2, pendantCount - 1);
          
          return Array.from({ length: pendantCount }).map((_, i) => {
            const xPos = -islandLength / 2 + 0.8 + i * spacing;
            return useAmberGlass ? (
              <AmberGlassPendant 
                key={i} 
                position={[xPos, ceilingHeight - 0.05, 2.5]} 
                intensity={lightingStyle.glowIntensity * lightConfig.pendant} 
                isEvening={lightingScene === 'evening'} 
              />
            ) : (
              <RealisticPendant 
                key={i} 
                position={[xPos, ceilingHeight - 0.05, 2.5]} 
                intensity={lightingStyle.glowIntensity * lightConfig.pendant} 
                isEvening={lightingScene === 'evening'} 
                fixtureColor={lightingStyle.fixtureColor}
                pendantType={lightingStyle.type}
              />
            );
          });
        })()
      )}

      {/* UNDER-CABINET LIGHTING */}
      {hasUndercabLighting && (
        <>
          {/* Back wall under-cabinet lights */}
          {Array.from({ length: Math.ceil(roomWidth / 1.5) }).map((_, i) => (
            <group key={`undercab-back-${i}`} position={[-roomWidth / 2 + 0.75 + i * 1.5, baseHeight + 0.5, -roomDepth / 2 + 0.6]}>
              <mesh>
                <boxGeometry args={[1.2, 0.02, 0.03]} />
                <meshStandardMaterial 
                  color="#FFF8E8" 
                  emissive="#FFF8E8" 
                  emissiveIntensity={lightingScene === 'evening' ? 1.2 : 0.4} 
                />
              </mesh>
              <rectAreaLight 
                width={1.2} 
                height={0.1} 
                intensity={lightingScene === 'evening' ? 3 : 1} 
                color="#FFF8E8"
                position={[0, -0.02, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
              />
            </group>
          ))}
        </>
      )}

      {/* RECESSED LIGHTS */}
      {Array.from({ length: recessedCount }).map((_, i) => (
        <group key={i} position={[-roomWidth / 3 + i * (roomWidth / (recessedCount - 1 || 1)), ceilingHeight - 0.02, -roomDepth / 3]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.12, 0.05, 24]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={lightingScene === 'evening' ? 0.8 : 0.3} />
          </mesh>
          {lightingScene === 'evening' && (
            <pointLight position={[0, -0.1, 0]} intensity={lightConfig.recessed} distance={6} color="#FFF8E8" />
          )}
        </group>
      ))}
    </group>
  );
}
