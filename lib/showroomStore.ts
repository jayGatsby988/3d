import { create } from 'zustand';
import { ProjectSettings, getDefaultSettings, calculateEstimate, ProjectEstimate, MaterialTier } from './estimator';
import type { SceneAnalysis } from '@/app/api/analyze-kitchen/route';

export type ActiveElement = 'cabinets' | 'island' | 'countertop' | 'backsplash' | 'flooring' | 'hardware' | 'lighting' | null;
export type LightingScene = 'day' | 'evening' | 'showroom';
export type RealismMode = 'standard' | 'photoreal';

// Re-export SceneAnalysis for convenience
export type { SceneAnalysis } from '@/app/api/analyze-kitchen/route';

export interface SavedVersion {
  id: string;
  name: string;
  settings: ProjectSettings;
  estimate: ProjectEstimate;
  timestamp: number;
  thumbnail?: string;
}

interface ShowroomState {
  settings: ProjectSettings;
  estimate: ProjectEstimate;
  activeElement: ActiveElement;
  lightingScene: LightingScene;
  realismMode: RealismMode;
  autoRotate: boolean;
  savedVersions: SavedVersion[];
  /** Full scene analysis from GPT - used to build procedural 3D kitchen */
  sceneAnalysis: SceneAnalysis | null;

  setSettings: (settings: Partial<ProjectSettings>) => void;
  setSceneAnalysis: (analysis: SceneAnalysis | null) => void;
  updateMaterial: (category: keyof ProjectSettings['materials'], material: string, tier: any) => void;
  updateUpgrade: (upgrade: keyof ProjectSettings['upgrades'], enabled: boolean) => void;
  updateRoomSize: (squareFeet: number) => void;
  updateIslandLength: (length: number) => void;
  updateCabinetHeight: (height: number) => void;
  updateComplexity: (complexity: 'standard' | 'complex') => void;
  setActiveElement: (element: ActiveElement) => void;
  setLightingScene: (scene: LightingScene) => void;
  setRealismMode: (mode: RealismMode) => void;
  setAutoRotate: (enabled: boolean) => void;
  resetToDefault: () => void;
  applyPreset: (preset: any) => void;
  saveVersion: (name: string) => void;
  loadVersion: (versionId: string) => void;
  deleteVersion: (versionId: string) => void;
  randomizeLuxuryLook: () => void;
}

const useShowroomStore = create<ShowroomState>((set, get) => {
  const defaultSettings = getDefaultSettings();
  const defaultEstimate = calculateEstimate(defaultSettings);

  return {
    settings: defaultSettings,
    estimate: defaultEstimate,
    activeElement: null,
    lightingScene: 'day',
    realismMode: 'standard',
    autoRotate: true,
    savedVersions: [],
    sceneAnalysis: null,

    setSettings: (newSettings) => {
      const currentSettings = get().settings;
      const updatedSettings = { ...currentSettings, ...newSettings };
      const estimate = calculateEstimate(updatedSettings);
      set({ settings: updatedSettings, estimate });
    },

    updateMaterial: (category, material, tier) => {
      const currentSettings = get().settings;
      const updatedSettings = {
        ...currentSettings,
        materials: {
          ...currentSettings.materials,
          [category]: material,
          [`${category}Tier`]: tier,
        },
      };
      const estimate = calculateEstimate(updatedSettings);
      set({ settings: updatedSettings, estimate });
    },

    updateUpgrade: (upgrade, enabled) => {
      const currentSettings = get().settings;
      const updatedSettings = {
        ...currentSettings,
        upgrades: {
          ...currentSettings.upgrades,
          [upgrade]: enabled,
        },
      };
      const estimate = calculateEstimate(updatedSettings);
      set({ settings: updatedSettings, estimate });
    },

    updateRoomSize: (squareFeet) => {
      const currentSettings = get().settings;
      const linearFeetMultiplier = squareFeet / 220;
      const updatedSettings = {
        ...currentSettings,
        roomDimensions: {
          ...currentSettings.roomDimensions,
          squareFeet,
          cabinetLinearFeet: Math.round(28 * linearFeetMultiplier),
          countertopSqFt: Math.round(65 * linearFeetMultiplier),
        },
      };
      const estimate = calculateEstimate(updatedSettings);
      set({ settings: updatedSettings, estimate });
    },

    updateIslandLength: (length) => {
      const currentSettings = get().settings;
      const updatedSettings = {
        ...currentSettings,
        roomDimensions: {
          ...currentSettings.roomDimensions,
          islandLength: length,
        },
      };
      const estimate = calculateEstimate(updatedSettings);
      set({ settings: updatedSettings, estimate });
    },

    updateCabinetHeight: (height) => {
      const currentSettings = get().settings;
      const updatedSettings = {
        ...currentSettings,
        cabinetHeight: height,
      };
      const estimate = calculateEstimate(updatedSettings);
      set({ settings: updatedSettings, estimate });
    },

    updateComplexity: (complexity) => {
      const currentSettings = get().settings;
      const updatedSettings = {
        ...currentSettings,
        complexity,
      };
      const estimate = calculateEstimate(updatedSettings);
      set({ settings: updatedSettings, estimate });
    },

    setActiveElement: (element) => set({ activeElement: element }),

    setSceneAnalysis: (analysis) => {
      // Update settings based on scene analysis
      // Clear all preset materials so GPT-detected colors are used initially
      const currentSettings = get().settings;
      const newIslandLength = analysis?.island?.present ? Math.round(analysis.island.lengthFeet * 12) : 0;
      
      const updatedSettings = {
        ...currentSettings,
        roomDimensions: {
          ...currentSettings.roomDimensions,
          islandLength: newIslandLength,
        },
        // Clear all materials so GPT analysis is used initially
        // User can then override by selecting from customizer
        materials: {
          ...currentSettings.materials,
          cabinetMaterial: '',
          countertopMaterial: '',
          backsplashMaterial: '',
          flooringMaterial: '',
          hardwareMaterial: '',
        },
      };
      const estimate = calculateEstimate(updatedSettings);
      set({ sceneAnalysis: analysis, settings: updatedSettings, estimate });
    },

    setLightingScene: (scene) => set({ lightingScene: scene }),

    setRealismMode: (mode) => set({ realismMode: mode }),

    setAutoRotate: (enabled) => set({ autoRotate: enabled }),

    resetToDefault: () => {
      const defaultSettings = getDefaultSettings();
      const defaultEstimate = calculateEstimate(defaultSettings);
      set({
        settings: defaultSettings,
        estimate: defaultEstimate,
        activeElement: null,
      });
    },

    applyPreset: (preset) => {
      const currentSettings = get().settings;
      const updatedSettings = {
        ...currentSettings,
        materials: preset.selections,
        upgrades: preset.upgrades,
      };
      const estimate = calculateEstimate(updatedSettings);
      set({ settings: updatedSettings, estimate });
    },

    saveVersion: (name) => {
      const { settings, estimate, savedVersions } = get();
      const newVersion: SavedVersion = {
        id: `version-${Date.now()}`,
        name,
        settings: { ...settings },
        estimate: { ...estimate },
        timestamp: Date.now(),
      };
      set({ savedVersions: [...savedVersions, newVersion] });
    },

    loadVersion: (versionId) => {
      const version = get().savedVersions.find((v) => v.id === versionId);
      if (version) {
        set({
          settings: version.settings,
          estimate: version.estimate,
          activeElement: null,
        });
      }
    },

    deleteVersion: (versionId) => {
      const savedVersions = get().savedVersions.filter((v) => v.id !== versionId);
      set({ savedVersions });
    },

    randomizeLuxuryLook: () => {
      const luxuryMaterials = {
        cabinets: [
          { material: 'Rift Oak', tier: 'luxury' as MaterialTier },
          { material: 'High-Gloss Euro', tier: 'luxury' as MaterialTier },
        ],
        countertops: [
          { material: 'Marble-Look Quartz', tier: 'premium' as MaterialTier },
          { material: 'Ultra-Compact Surface', tier: 'luxury' as MaterialTier },
          { material: 'Granite', tier: 'premium' as MaterialTier },
        ],
        hardware: [
          { material: 'Satin Brass', tier: 'premium' as MaterialTier },
          { material: 'Matte Black', tier: 'premium' as MaterialTier },
        ],
        backsplash: [
          { material: 'Large-Format Porcelain', tier: 'premium' as MaterialTier },
          { material: 'Natural Stone Slab', tier: 'luxury' as MaterialTier },
          { material: 'Glass Mosaic', tier: 'premium' as MaterialTier },
        ],
        flooring: [
          { material: 'Engineered Hardwood', tier: 'premium' as MaterialTier },
          { material: 'Solid Hardwood', tier: 'luxury' as MaterialTier },
          { material: 'Porcelain Tile', tier: 'premium' as MaterialTier },
        ],
        lighting: [
          { material: 'Designer Pendants', tier: 'premium' as MaterialTier },
          { material: 'Chandelier + Track', tier: 'luxury' as MaterialTier },
        ],
      };

      const randomCabinet = luxuryMaterials.cabinets[Math.floor(Math.random() * luxuryMaterials.cabinets.length)];
      const randomCountertop = luxuryMaterials.countertops[Math.floor(Math.random() * luxuryMaterials.countertops.length)];
      const randomHardware = luxuryMaterials.hardware[Math.floor(Math.random() * luxuryMaterials.hardware.length)];
      const randomBacksplash = luxuryMaterials.backsplash[Math.floor(Math.random() * luxuryMaterials.backsplash.length)];
      const randomFlooring = luxuryMaterials.flooring[Math.floor(Math.random() * luxuryMaterials.flooring.length)];
      const randomLighting = luxuryMaterials.lighting[Math.floor(Math.random() * luxuryMaterials.lighting.length)];

      const currentSettings = get().settings;
      const updatedSettings: ProjectSettings = {
        ...currentSettings,
        materials: {
          cabinetMaterial: randomCabinet.material,
          cabinetTier: randomCabinet.tier,
          countertopMaterial: randomCountertop.material,
          countertopTier: randomCountertop.tier,
          backsplashMaterial: randomBacksplash.material,
          backsplashTier: randomBacksplash.tier,
          flooringMaterial: randomFlooring.material,
          flooringTier: randomFlooring.tier,
          hardwareMaterial: randomHardware.material,
          hardwareTier: randomHardware.tier,
          lightingType: randomLighting.material,
          lightingTier: randomLighting.tier,
        },
        upgrades: {
          softClose: true,
          undercabLighting: Math.random() > 0.3,
          waterfallEdge: Math.random() > 0.5,
          premiumHardware: Math.random() > 0.4,
        },
      };
      const estimate = calculateEstimate(updatedSettings);
      set({ settings: updatedSettings, estimate });
    },
  };
});

export default useShowroomStore;
