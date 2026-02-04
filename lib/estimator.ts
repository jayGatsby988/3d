export type MaterialTier = 'budget' | 'standard' | 'premium' | 'luxury';
export type ComplexityLevel = 'standard' | 'complex';

export interface RoomDimensions {
  squareFeet: number;
  cabinetLinearFeet: number;
  countertopSqFt: number;
  islandLength: number;
}

export interface MaterialSelections {
  cabinetMaterial: string;
  cabinetTier: MaterialTier;
  countertopMaterial: string;
  countertopTier: MaterialTier;
  backsplashMaterial: string;
  backsplashTier: MaterialTier;
  flooringMaterial: string;
  flooringTier: MaterialTier;
  hardwareMaterial: string;
  hardwareTier: MaterialTier;
  lightingType: string;
  lightingTier: MaterialTier;
}

export interface UpgradeSelections {
  softClose: boolean;
  undercabLighting: boolean;
  waterfallEdge: boolean;
  premiumHardware: boolean;
}

export interface ProjectSettings {
  roomDimensions: RoomDimensions;
  materials: MaterialSelections;
  upgrades: UpgradeSelections;
  complexity: ComplexityLevel;
  cabinetHeight: number;
}

export interface LineItemEstimate {
  category: string;
  materialsLow: number;
  materialsHigh: number;
  laborLow: number;
  laborHigh: number;
  totalLow: number;
  totalHigh: number;
}

export interface ProjectEstimate {
  lineItems: LineItemEstimate[];
  totalLow: number;
  totalHigh: number;
  timelineLow: number;
  timelineHigh: number;
}

const TIER_MULTIPLIERS: Record<MaterialTier, number> = {
  budget: 0.85,
  standard: 1.0,
  premium: 1.25,
  luxury: 1.6,
};

const COMPLEXITY_MULTIPLIERS: Record<ComplexityLevel, number> = {
  standard: 1.0,
  complex: 1.25,
};

const BASE_COSTS = {
  cabinets: {
    materialPerLinearFoot: { low: 180, high: 220 },
    laborPerLinearFoot: { low: 60, high: 85 },
  },
  countertop: {
    materialPerSqFt: { low: 55, high: 75 },
    laborPerSqFt: { low: 35, high: 50 },
  },
  backsplash: {
    materialPerSqFt: { low: 12, high: 18 },
    laborPerSqFt: { low: 15, high: 22 },
  },
  flooring: {
    materialPerSqFt: { low: 4, high: 8 },
    laborPerSqFt: { low: 3, high: 5 },
  },
  hardware: {
    materialPerPiece: { low: 4, high: 8 },
    laborPerPiece: { low: 2, high: 3 },
  },
  lighting: {
    materialBase: { low: 800, high: 1200 },
    laborBase: { low: 400, high: 600 },
  },
};

const UPGRADE_COSTS = {
  softClose: { low: 350, high: 900 },
  undercabLighting: { low: 400, high: 1200 },
  waterfallEdge: { low: 900, high: 2800 },
  premiumHardware: { low: 250, high: 850 },
};

const ALLOWANCES = {
  demo: { low: 800, high: 1500 },
  electrical: { low: 600, high: 1200 },
  plumbing: { low: 400, high: 900 },
  permits: { low: 150, high: 350 },
};

export function calculateEstimate(settings: ProjectSettings): ProjectEstimate {
  const { roomDimensions, materials, upgrades, complexity, cabinetHeight } = settings;
  const complexityMultiplier = COMPLEXITY_MULTIPLIERS[complexity];

  const lineItems: LineItemEstimate[] = [];

  const cabinetLinearFeet = roomDimensions.cabinetLinearFeet + (roomDimensions.islandLength / 12);
  const heightMultiplier = cabinetHeight / 36;
  const cabinetMultiplier = TIER_MULTIPLIERS[materials.cabinetTier] * heightMultiplier;

  const cabinetMaterialsLow = BASE_COSTS.cabinets.materialPerLinearFoot.low * cabinetLinearFeet * cabinetMultiplier;
  const cabinetMaterialsHigh = BASE_COSTS.cabinets.materialPerLinearFoot.high * cabinetLinearFeet * cabinetMultiplier;
  const cabinetLaborLow = BASE_COSTS.cabinets.laborPerLinearFoot.low * cabinetLinearFeet * complexityMultiplier;
  const cabinetLaborHigh = BASE_COSTS.cabinets.laborPerLinearFoot.high * cabinetLinearFeet * complexityMultiplier;

  lineItems.push({
    category: 'Cabinets',
    materialsLow: cabinetMaterialsLow,
    materialsHigh: cabinetMaterialsHigh,
    laborLow: cabinetLaborLow,
    laborHigh: cabinetLaborHigh,
    totalLow: cabinetMaterialsLow + cabinetLaborLow,
    totalHigh: cabinetMaterialsHigh + cabinetLaborHigh,
  });

  const countertopSqFt = roomDimensions.countertopSqFt + ((roomDimensions.islandLength / 12) * 3);
  const countertopMultiplier = TIER_MULTIPLIERS[materials.countertopTier];

  const countertopMaterialsLow = BASE_COSTS.countertop.materialPerSqFt.low * countertopSqFt * countertopMultiplier;
  const countertopMaterialsHigh = BASE_COSTS.countertop.materialPerSqFt.high * countertopSqFt * countertopMultiplier;
  const countertopLaborLow = BASE_COSTS.countertop.laborPerSqFt.low * countertopSqFt * complexityMultiplier;
  const countertopLaborHigh = BASE_COSTS.countertop.laborPerSqFt.high * countertopSqFt * complexityMultiplier;

  lineItems.push({
    category: 'Countertops',
    materialsLow: countertopMaterialsLow,
    materialsHigh: countertopMaterialsHigh,
    laborLow: countertopLaborLow,
    laborHigh: countertopLaborHigh,
    totalLow: countertopMaterialsLow + countertopLaborLow,
    totalHigh: countertopMaterialsHigh + countertopLaborHigh,
  });

  const backsplashSqFt = 25;
  const backsplashMultiplier = TIER_MULTIPLIERS[materials.backsplashTier];

  const backsplashMaterialsLow = BASE_COSTS.backsplash.materialPerSqFt.low * backsplashSqFt * backsplashMultiplier;
  const backsplashMaterialsHigh = BASE_COSTS.backsplash.materialPerSqFt.high * backsplashSqFt * backsplashMultiplier;
  const backsplashLaborLow = BASE_COSTS.backsplash.laborPerSqFt.low * backsplashSqFt;
  const backsplashLaborHigh = BASE_COSTS.backsplash.laborPerSqFt.high * backsplashSqFt;

  lineItems.push({
    category: 'Backsplash',
    materialsLow: backsplashMaterialsLow,
    materialsHigh: backsplashMaterialsHigh,
    laborLow: backsplashLaborLow,
    laborHigh: backsplashLaborHigh,
    totalLow: backsplashMaterialsLow + backsplashLaborLow,
    totalHigh: backsplashMaterialsHigh + backsplashLaborHigh,
  });

  const flooringSqFt = roomDimensions.squareFeet;
  const flooringMultiplier = TIER_MULTIPLIERS[materials.flooringTier];

  const flooringMaterialsLow = BASE_COSTS.flooring.materialPerSqFt.low * flooringSqFt * flooringMultiplier;
  const flooringMaterialsHigh = BASE_COSTS.flooring.materialPerSqFt.high * flooringSqFt * flooringMultiplier;
  const flooringLaborLow = BASE_COSTS.flooring.laborPerSqFt.low * flooringSqFt;
  const flooringLaborHigh = BASE_COSTS.flooring.laborPerSqFt.high * flooringSqFt;

  lineItems.push({
    category: 'Flooring',
    materialsLow: flooringMaterialsLow,
    materialsHigh: flooringMaterialsHigh,
    laborLow: flooringLaborLow,
    laborHigh: flooringLaborHigh,
    totalLow: flooringMaterialsLow + flooringLaborLow,
    totalHigh: flooringMaterialsHigh + flooringLaborHigh,
  });

  const hardwarePieces = Math.ceil(cabinetLinearFeet * 1.5);
  const hardwareMultiplier = TIER_MULTIPLIERS[materials.hardwareTier];

  const hardwareMaterialsLow = BASE_COSTS.hardware.materialPerPiece.low * hardwarePieces * hardwareMultiplier;
  const hardwareMaterialsHigh = BASE_COSTS.hardware.materialPerPiece.high * hardwarePieces * hardwareMultiplier;
  const hardwareLaborLow = BASE_COSTS.hardware.laborPerPiece.low * hardwarePieces;
  const hardwareLaborHigh = BASE_COSTS.hardware.laborPerPiece.high * hardwarePieces;

  lineItems.push({
    category: 'Hardware',
    materialsLow: hardwareMaterialsLow,
    materialsHigh: hardwareMaterialsHigh,
    laborLow: hardwareLaborLow,
    laborHigh: hardwareLaborHigh,
    totalLow: hardwareMaterialsLow + hardwareLaborLow,
    totalHigh: hardwareMaterialsHigh + hardwareLaborHigh,
  });

  const lightingMultiplier = TIER_MULTIPLIERS[materials.lightingTier];

  const lightingMaterialsLow = BASE_COSTS.lighting.materialBase.low * lightingMultiplier;
  const lightingMaterialsHigh = BASE_COSTS.lighting.materialBase.high * lightingMultiplier;
  const lightingLaborLow = BASE_COSTS.lighting.laborBase.low * complexityMultiplier;
  const lightingLaborHigh = BASE_COSTS.lighting.laborBase.high * complexityMultiplier;

  lineItems.push({
    category: 'Lighting',
    materialsLow: lightingMaterialsLow,
    materialsHigh: lightingMaterialsHigh,
    laborLow: lightingLaborLow,
    laborHigh: lightingLaborHigh,
    totalLow: lightingMaterialsLow + lightingLaborLow,
    totalHigh: lightingMaterialsHigh + lightingLaborHigh,
  });

  lineItems.push({
    category: 'Demo & Disposal',
    materialsLow: 0,
    materialsHigh: 0,
    laborLow: ALLOWANCES.demo.low,
    laborHigh: ALLOWANCES.demo.high,
    totalLow: ALLOWANCES.demo.low,
    totalHigh: ALLOWANCES.demo.high,
  });

  lineItems.push({
    category: 'Electrical Allowance',
    materialsLow: ALLOWANCES.electrical.low,
    materialsHigh: ALLOWANCES.electrical.high,
    laborLow: 0,
    laborHigh: 0,
    totalLow: ALLOWANCES.electrical.low,
    totalHigh: ALLOWANCES.electrical.high,
  });

  lineItems.push({
    category: 'Plumbing Allowance',
    materialsLow: ALLOWANCES.plumbing.low,
    materialsHigh: ALLOWANCES.plumbing.high,
    laborLow: 0,
    laborHigh: 0,
    totalLow: ALLOWANCES.plumbing.low,
    totalHigh: ALLOWANCES.plumbing.high,
  });

  lineItems.push({
    category: 'Permits & Inspection',
    materialsLow: 0,
    materialsHigh: 0,
    laborLow: ALLOWANCES.permits.low,
    laborHigh: ALLOWANCES.permits.high,
    totalLow: ALLOWANCES.permits.low,
    totalHigh: ALLOWANCES.permits.high,
  });

  if (upgrades.softClose) {
    lineItems.push({
      category: 'Soft-Close Upgrade',
      materialsLow: UPGRADE_COSTS.softClose.low,
      materialsHigh: UPGRADE_COSTS.softClose.high,
      laborLow: 0,
      laborHigh: 0,
      totalLow: UPGRADE_COSTS.softClose.low,
      totalHigh: UPGRADE_COSTS.softClose.high,
    });
  }

  if (upgrades.undercabLighting) {
    lineItems.push({
      category: 'Under-Cabinet Lighting',
      materialsLow: UPGRADE_COSTS.undercabLighting.low,
      materialsHigh: UPGRADE_COSTS.undercabLighting.high,
      laborLow: 0,
      laborHigh: 0,
      totalLow: UPGRADE_COSTS.undercabLighting.low,
      totalHigh: UPGRADE_COSTS.undercabLighting.high,
    });
  }

  if (upgrades.waterfallEdge) {
    lineItems.push({
      category: 'Waterfall Edge',
      materialsLow: UPGRADE_COSTS.waterfallEdge.low,
      materialsHigh: UPGRADE_COSTS.waterfallEdge.high,
      laborLow: 0,
      laborHigh: 0,
      totalLow: UPGRADE_COSTS.waterfallEdge.low,
      totalHigh: UPGRADE_COSTS.waterfallEdge.high,
    });
  }

  if (upgrades.premiumHardware) {
    lineItems.push({
      category: 'Premium Hardware Set',
      materialsLow: UPGRADE_COSTS.premiumHardware.low,
      materialsHigh: UPGRADE_COSTS.premiumHardware.high,
      laborLow: 0,
      laborHigh: 0,
      totalLow: UPGRADE_COSTS.premiumHardware.low,
      totalHigh: UPGRADE_COSTS.premiumHardware.high,
    });
  }

  const subtotalLow = lineItems.reduce((sum, item) => sum + item.totalLow, 0);
  const subtotalHigh = lineItems.reduce((sum, item) => sum + item.totalHigh, 0);

  const varianceBuffer = 0.12;
  const totalLow = Math.round(subtotalLow * (1 - varianceBuffer / 2));
  const totalHigh = Math.round(subtotalHigh * (1 + varianceBuffer / 2));

  const baseTimelineWeeks = 5;
  const complexityTimeAdd = complexity === 'complex' ? 2 : 0;
  const sizeTimeAdd = roomDimensions.squareFeet > 200 ? 1 : 0;

  const timelineLow = baseTimelineWeeks + complexityTimeAdd;
  const timelineHigh = baseTimelineWeeks + complexityTimeAdd + sizeTimeAdd + 3;

  return {
    lineItems,
    totalLow,
    totalHigh,
    timelineLow,
    timelineHigh,
  };
}

export function getDefaultSettings(): ProjectSettings {
  return {
    roomDimensions: {
      squareFeet: 220,
      cabinetLinearFeet: 28,
      countertopSqFt: 65,
      islandLength: 72,
    },
    materials: {
      cabinetMaterial: 'Shaker MDF',
      cabinetTier: 'standard',
      countertopMaterial: 'Quartz',
      countertopTier: 'standard',
      backsplashMaterial: 'Subway Tile',
      backsplashTier: 'standard',
      flooringMaterial: 'LVP Standard',
      flooringTier: 'standard',
      hardwareMaterial: 'Brushed Nickel',
      hardwareTier: 'standard',
      lightingType: 'Recessed + Pendants',
      lightingTier: 'standard',
    },
    upgrades: {
      softClose: false,
      undercabLighting: false,
      waterfallEdge: false,
      premiumHardware: false,
    },
    complexity: 'standard',
    cabinetHeight: 36,
  };
}
