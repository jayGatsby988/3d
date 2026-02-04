'use client';

import { Suspense, useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles } from 'lucide-react';
import SceneControls from './SceneControls';
import CustomizerPanel from './CustomizerPanel';
import EstimatePanel from './EstimatePanel';
import VersionManager from './VersionManager';
import ShowroomCanvas from './ShowroomCanvas';
import useShowroomStore from '@/lib/showroomStore';

type ShowroomShellProps = {
  onOpenAIChat?: () => void;
};

export default function ShowroomShell({ onOpenAIChat }: ShowroomShellProps) {
  const [isMounted, setIsMounted] = useState(false);
  const sceneAnalysis = useShowroomStore((s) => s.sceneAnalysis);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="w-full bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_400px] gap-6 p-6">
        <div className="space-y-4">
          {/* Scene info banner */}
          <div className="text-sm text-gray-600 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-lg px-4 py-3">
            {sceneAnalysis ? (
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-indigo-800">AI-Generated 3D Kitchen</strong>
                  <p className="text-gray-600 mt-1">{sceneAnalysis.description}</p>
                  <div className="flex gap-3 mt-2 text-xs text-indigo-600">
                    <span>Style: {sceneAnalysis.room.style}</span>
                    <span>•</span>
                    <span>Layout: {sceneAnalysis.room.layout}</span>
                    <span>•</span>
                    <span>~{sceneAnalysis.room.widthFeet * sceneAnalysis.room.depthFeet} sq ft</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <strong>Interactive 3D Kitchen</strong> — Click elements to select. Change materials, dimensions, and upgrades. Pricing updates live.
              </>
            )}
          </div>
          
          {/* 3D Canvas */}
          <div className="relative aspect-[4/3] lg:aspect-video w-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            {isMounted ? (
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="text-center space-y-4">
                      <div className="animate-spin h-8 w-8 border-4 border-white/20 border-t-white rounded-full mx-auto" />
                      <p className="text-white/60 text-sm">Loading 3D scene...</p>
                    </div>
                  </div>
                }
              >
                <ShowroomCanvas />
                <SceneControls />
              </Suspense>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="text-center space-y-4">
                  <Skeleton className="h-12 w-48 mx-auto bg-gray-700" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-64 mx-auto bg-gray-700" />
                    <Skeleton className="h-4 w-48 mx-auto bg-gray-700" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:hidden">
            <EstimatePanel onOpenAIChat={onOpenAIChat} />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden flex flex-col h-[600px]">
            <CustomizerPanel />
            <VersionManager />
          </div>

          <div className="hidden lg:block">
            <EstimatePanel onOpenAIChat={onOpenAIChat} />
          </div>
        </div>
      </div>
    </div>
  );
}
