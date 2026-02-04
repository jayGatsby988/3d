'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sun, Moon, Lightbulb, RotateCw, Eye } from 'lucide-react';
import useShowroomStore from '@/lib/showroomStore';

export default function SceneControls() {
  const {
    lightingScene,
    setLightingScene,
    realismMode,
    setRealismMode,
    autoRotate,
    setAutoRotate,
  } = useShowroomStore();

  return (
    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
      <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/80 p-3 space-y-2">
        <div className="text-xs font-semibold text-gray-700 px-1">Lighting</div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={lightingScene === 'day' ? 'default' : 'ghost'}
            onClick={() => setLightingScene('day')}
            className="flex-1 text-xs"
            title="Daylight"
          >
            <Sun className="h-3.5 w-3.5 mr-1" />
            Day
          </Button>
          <Button
            size="sm"
            variant={lightingScene === 'evening' ? 'default' : 'ghost'}
            onClick={() => setLightingScene('evening')}
            className="flex-1 text-xs"
            title="Warm evening"
          >
            <Moon className="h-3.5 w-3.5 mr-1" />
            Evening
          </Button>
          <Button
            size="sm"
            variant={lightingScene === 'showroom' ? 'default' : 'ghost'}
            onClick={() => setLightingScene('showroom')}
            className="flex-1 text-xs"
            title="Showroom lighting"
          >
            <Lightbulb className="h-3.5 w-3.5 mr-1" />
            Showroom
          </Button>
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/80 p-3 space-y-2">
        <Button
          size="sm"
          variant={autoRotate ? 'default' : 'ghost'}
          onClick={() => setAutoRotate(!autoRotate)}
          className="w-full justify-start text-xs"
        >
          <RotateCw className="h-3.5 w-3.5 mr-2" />
          Auto-Rotate
        </Button>
        <div className="text-xs font-semibold text-gray-700 px-1 pt-1 border-t border-gray-100">Rendering</div>
        <Button
          size="sm"
          variant={realismMode === 'photoreal' ? 'default' : 'ghost'}
          onClick={() =>
            setRealismMode(realismMode === 'standard' ? 'photoreal' : 'standard')
          }
          className="w-full justify-start text-xs"
          title={realismMode === 'photoreal' ? 'Softer materials, more reflections' : 'Standard materials'}
        >
          <Eye className="h-3.5 w-3.5 mr-2" />
          {realismMode === 'photoreal' ? 'Photoreal' : 'Standard'}
        </Button>
      </div>
    </div>
  );
}
