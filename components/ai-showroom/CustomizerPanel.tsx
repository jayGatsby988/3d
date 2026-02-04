'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useShowroomStore from '@/lib/showroomStore';
import { MATERIALS_CATALOG, PRESETS, COLORS } from '@/lib/mockData';
import { MaterialTier } from '@/lib/estimator';
import { Shuffle, RotateCcw } from 'lucide-react';

export default function CustomizerPanel() {
  const {
    settings,
    activeElement,
    updateMaterial,
    updateUpgrade,
    updateRoomSize,
    updateIslandLength,
    updateCabinetHeight,
    updateComplexity,
    resetToDefault,
    applyPreset,
    randomizeLuxuryLook,
  } = useShowroomStore();

  const [activeTab, setActiveTab] = useState('cabinets');

  // Sync panel tab to selected 3D object so user always sees the right controls
  useEffect(() => {
    if (!activeElement) return;
    if (activeElement === 'cabinets' || activeElement === 'island') setActiveTab('cabinets');
    else if (activeElement === 'countertop' || activeElement === 'backsplash' || activeElement === 'flooring') setActiveTab('surfaces');
    else if (activeElement === 'hardware' || activeElement === 'lighting') setActiveTab('finishes');
  }, [activeElement]);

  const getMaterialOptions = (category: string) => {
    const cat = MATERIALS_CATALOG.find((c) => c.category === category);
    return cat?.options || [];
  };

  const getTierColor = (tier: MaterialTier) => {
    switch (tier) {
      case 'budget':
        return 'bg-gray-100 text-gray-700';
      case 'standard':
        return 'bg-blue-100 text-blue-700';
      case 'premium':
        return 'bg-purple-100 text-purple-700';
      case 'luxury':
        return 'bg-amber-100 text-amber-700';
    }
  };

  const handleResetClick = () => {
    if (confirm('Reset all selections to default?')) {
      resetToDefault();
    }
  };

  const editingLabel = activeElement
    ? { cabinets: 'Cabinets / Island', countertop: 'Countertop', backsplash: 'Backsplash', flooring: 'Flooring', hardware: 'Hardware', lighting: 'Lighting', island: 'Island' }[activeElement] || activeElement
    : null;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Customize Your Kitchen</h3>
          {editingLabel && (
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md shrink-0">
              Editing: {editingLabel}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={randomizeLuxuryLook}
            className="flex-1"
          >
            <Shuffle className="h-4 w-4 mr-2" />
            Randomize Luxury
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetClick}
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 sticky top-0 bg-white z-10">
            <TabsTrigger value="cabinets">Cabinets</TabsTrigger>
            <TabsTrigger value="surfaces">Surfaces</TabsTrigger>
            <TabsTrigger value="finishes">Finishes</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
          </TabsList>

          <TabsContent value="cabinets" className="p-4 space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Cabinet Style & Color</Label>
              <Select
                value={settings.materials.cabinetMaterial}
                onValueChange={(value) => {
                  const material = getMaterialOptions('Cabinets').find((m) => m.name === value);
                  if (material) {
                    updateMaterial('cabinetMaterial', value, material.tier);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="From Photo (AI detected)" />
                </SelectTrigger>
                <SelectContent>
                  {getMaterialOptions('Cabinets').map((material) => (
                    <SelectItem key={material.id} value={material.name}>
                      <div className="flex items-center gap-2">
                        <span>{material.name}</span>
                        <Badge className={getTierColor(material.tier)} variant="secondary">
                          {material.tier}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Island Section */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <Label className="text-sm font-semibold">Kitchen Island</Label>
              {settings.roomDimensions.islandLength > 0 ? (
                <>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">
                      Island Length: {settings.roomDimensions.islandLength}"
                    </Label>
                    <Slider
                      value={[settings.roomDimensions.islandLength]}
                      onValueChange={([value]) => updateIslandLength(value)}
                      min={48}
                      max={120}
                      step={6}
                      className="w-full"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateIslandLength(0)}
                    className="w-full mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Remove Island
                  </Button>
                </>
              ) : (
                <div className="text-center py-2">
                  <p className="text-xs text-gray-500 mb-2">No island detected in your photo</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateIslandLength(72)}
                    className="w-full"
                  >
                    + Add Island
                  </Button>
                  <p className="text-xs text-gray-400 mt-1">Island will match your cabinet style</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="soft-close" className="text-sm font-medium">
                  Soft-Close Upgrade
                </Label>
                <p className="text-xs text-gray-500">Quiet, smooth closing</p>
              </div>
              <Switch
                id="soft-close"
                checked={settings.upgrades.softClose}
                onCheckedChange={(checked) => updateUpgrade('softClose', checked)}
              />
            </div>
          </TabsContent>

          <TabsContent value="surfaces" className="p-4 space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Countertop Material</Label>
              <Select
                value={settings.materials.countertopMaterial}
                onValueChange={(value) => {
                  const material = getMaterialOptions('Countertops').find((m) => m.name === value);
                  if (material) {
                    updateMaterial('countertopMaterial', value, material.tier);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="From Photo (AI detected)" />
                </SelectTrigger>
                <SelectContent>
                  {getMaterialOptions('Countertops').map((material) => (
                    <SelectItem key={material.id} value={material.name}>
                      <div className="flex items-center gap-2">
                        <span>{material.name}</span>
                        <Badge className={getTierColor(material.tier)} variant="secondary">
                          {material.tier}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="waterfall" className="text-sm font-medium">
                  Waterfall Edge
                </Label>
                <p className="text-xs text-gray-500">Modern cascading edge on island</p>
              </div>
              <Switch
                id="waterfall"
                checked={settings.upgrades.waterfallEdge}
                onCheckedChange={(checked) => updateUpgrade('waterfallEdge', checked)}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold">Backsplash Style</Label>
              <Select
                value={settings.materials.backsplashMaterial}
                onValueChange={(value) => {
                  const material = getMaterialOptions('Backsplash').find((m) => m.name === value);
                  if (material) {
                    updateMaterial('backsplashMaterial', value, material.tier);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="From Photo (AI detected)" />
                </SelectTrigger>
                <SelectContent>
                  {getMaterialOptions('Backsplash').map((material) => (
                    <SelectItem key={material.id} value={material.name}>
                      <div className="flex items-center gap-2">
                        <span>{material.name}</span>
                        <Badge className={getTierColor(material.tier)} variant="secondary">
                          {material.tier}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold">Flooring</Label>
              <Select
                value={settings.materials.flooringMaterial}
                onValueChange={(value) => {
                  const material = getMaterialOptions('Flooring').find((m) => m.name === value);
                  if (material) {
                    updateMaterial('flooringMaterial', value, material.tier);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="From Photo (AI detected)" />
                </SelectTrigger>
                <SelectContent>
                  {getMaterialOptions('Flooring').map((material) => (
                    <SelectItem key={material.id} value={material.name}>
                      <div className="flex items-center gap-2">
                        <span>{material.name}</span>
                        <Badge className={getTierColor(material.tier)} variant="secondary">
                          {material.tier}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="finishes" className="p-4 space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Hardware Finish</Label>
              <Select
                value={settings.materials.hardwareMaterial}
                onValueChange={(value) => {
                  const material = getMaterialOptions('Hardware').find((m) => m.name === value);
                  if (material) {
                    updateMaterial('hardwareMaterial', value, material.tier);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="From Photo (AI detected)" />
                </SelectTrigger>
                <SelectContent>
                  {getMaterialOptions('Hardware').map((material) => (
                    <SelectItem key={material.id} value={material.name}>
                      <div className="flex items-center gap-2">
                        <span>{material.name}</span>
                        <Badge className={getTierColor(material.tier)} variant="secondary">
                          {material.tier}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="premium-hardware" className="text-sm font-medium">
                  Premium Hardware Set
                </Label>
                <p className="text-xs text-gray-500">Designer pulls and knobs</p>
              </div>
              <Switch
                id="premium-hardware"
                checked={settings.upgrades.premiumHardware}
                onCheckedChange={(checked) => updateUpgrade('premiumHardware', checked)}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold">Pendant Light Style</Label>
              <Select
                value={settings.materials.lightingType}
                onValueChange={(value) => {
                  const material = getMaterialOptions('Lighting').find((m) => m.name === value);
                  if (material) {
                    updateMaterial('lightingType', value, material.tier);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="From Photo (AI detected)" />
                </SelectTrigger>
                <SelectContent>
                  {getMaterialOptions('Lighting').map((material) => (
                    <SelectItem key={material.id} value={material.name}>
                      <div className="flex items-center gap-2">
                        <span>{material.name}</span>
                        <Badge className={getTierColor(material.tier)} variant="secondary">
                          {material.tier}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="undercab-lighting" className="text-sm font-medium">
                  Under-Cabinet Lighting
                </Label>
                <p className="text-xs text-gray-500">LED task lighting</p>
              </div>
              <Switch
                id="undercab-lighting"
                checked={settings.upgrades.undercabLighting}
                onCheckedChange={(checked) => updateUpgrade('undercabLighting', checked)}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold">Project Complexity</Label>
              <Select
                value={settings.complexity}
                onValueChange={(value: 'standard' | 'complex') => updateComplexity(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="complex">Complex (custom layout)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Complex projects include custom modifications
              </p>
            </div>
          </TabsContent>

          <TabsContent value="presets" className="p-4 space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Apply a curated design preset to quickly explore different styles
            </p>
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="w-full p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all text-left"
              >
                <h4 className="font-semibold text-gray-900 mb-1">{preset.name}</h4>
                <p className="text-xs text-gray-600">{preset.description}</p>
              </button>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
