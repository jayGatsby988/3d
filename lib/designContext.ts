import type { ProjectSettings, ProjectEstimate } from './estimator';
import { formatRange } from './format';

/**
 * Serialize current design + estimate for AI context (system prompt / suggestions).
 */
export function buildDesignContextSummary(settings: ProjectSettings, estimate: ProjectEstimate): string {
  const { roomDimensions, materials, upgrades, complexity, cabinetHeight } = settings;
  const lines: string[] = [
    '## Current kitchen design',
    `- Room: ${roomDimensions.squareFeet} sq ft, ${roomDimensions.cabinetLinearFeet} linear ft cabinets, ${roomDimensions.islandLength}" island`,
    `- Cabinet: ${materials.cabinetMaterial} (${materials.cabinetTier}), height ${cabinetHeight}"`,
    `- Countertop: ${materials.countertopMaterial} (${materials.countertopTier})`,
    `- Backsplash: ${materials.backsplashMaterial} (${materials.backsplashTier})`,
    `- Flooring: ${materials.flooringMaterial} (${materials.flooringTier})`,
    `- Hardware: ${materials.hardwareMaterial} (${materials.hardwareTier})`,
    `- Lighting: ${materials.lightingType} (${materials.lightingTier})`,
    `- Upgrades: soft-close ${upgrades.softClose ? 'yes' : 'no'}, under-cabinet lighting ${upgrades.undercabLighting ? 'yes' : 'no'}, waterfall edge ${upgrades.waterfallEdge ? 'yes' : 'no'}, premium hardware ${upgrades.premiumHardware ? 'yes' : 'no'}`,
    `- Complexity: ${complexity}`,
    '',
    '## Estimate',
    `- Total: ${formatRange(estimate.totalLow, estimate.totalHigh)}`,
    `- Timeline: ${estimate.timelineLow}–${estimate.timelineHigh} weeks`,
    '- Line items: ' + estimate.lineItems.map((i) => `${i.category} ${formatRange(i.totalLow, i.totalHigh)}`).join('; '),
  ];
  return lines.join('\n');
}
