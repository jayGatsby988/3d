'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Loader2, Sparkles, AlertCircle, Camera, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import useShowroomStore from '@/lib/showroomStore';
import type { SceneAnalysis } from '@/app/api/analyze-kitchen/route';

export type KitchenLayoutChoice = 'U-shaped' | 'L-shaped' | 'single-wall';

export interface PhotoCompletePayload {
  /** Full scene analysis from GPT-4 Vision */
  sceneAnalysis: SceneAnalysis;
}

interface PhotoUploadFlowProps {
  onComplete: (payload: PhotoCompletePayload) => void;
  onSkip?: () => void;
}

// Smaller image for faster upload
const MAX_IMAGE_PX = 1024;
const JPEG_QUALITY = 0.8;

/** Resize image and return as data URI */
function fileToResizedDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const scale = Math.min(MAX_IMAGE_PX / w, MAX_IMAGE_PX / h, 1);
      const width = Math.round(w * scale);
      const height = Math.round(h * scale);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };
    img.src = objectUrl;
  });
}

type AnalysisStep = 'preparing' | 'uploading' | 'analyzing' | 'building' | 'done';

const STEP_MESSAGES: Record<AnalysisStep, string> = {
  preparing: 'Preparing your image...',
  uploading: 'Uploading to GPT-4 Vision...',
  analyzing: 'Analyzing every detail of your kitchen...',
  building: 'Building 3D scene specifications...',
  done: 'Analysis complete!',
};

export default function PhotoUploadFlow({ onComplete, onSkip }: PhotoUploadFlowProps) {
  const setUserLayout = useShowroomStore((s) => s.setUserLayout);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [layoutChoice, setLayoutChoice] = useState<KitchenLayoutChoice | null>(null);
  const [phase, setPhase] = useState<'upload' | 'processing' | 'done' | 'error'>('upload');
  const [step, setStep] = useState<AnalysisStep>('preparing');
  const [error, setError] = useState<string | null>(null);
  const [sceneAnalysis, setSceneAnalysis] = useState<SceneAnalysis | null>(null);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || !f.type.startsWith('image/')) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    setError(null);
    setPhase('upload');
    setSceneAnalysis(null);
  }, []);

  const handleStartAnalysis = useCallback(async () => {
    if (!file) return;
    setPhase('processing');
    setError(null);
    setStep('preparing');

    try {
      // Step 1: Prepare image - convert to base64 data URL
      const dataUri = await fileToResizedDataUri(file);
      setStep('uploading');

      // Step 2: Send to GPT-4 Vision for detailed analysis
      setStep('analyzing');
      if (layoutChoice) setUserLayout(layoutChoice);
      const res = await fetch('/api/analyze-kitchen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: dataUri,
          user_layout: layoutChoice ?? undefined,
        }),
      });

      setStep('building');
      const data = await res.json();

      if (!res.ok && data.error) {
        throw new Error(data.error);
      }

      // GPT always returns a valid scene (defaults on error)
      const analysis = data as SceneAnalysis;
      setSceneAnalysis(analysis);
      setStep('done');
      setPhase('done');
      
      console.log('[GPT Analysis] Complete:', analysis.description);
      console.log('[GPT Analysis] Confidence:', analysis.confidence);
      
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Analysis failed';
      setError(msg);
      setPhase('error');
    }
  }, [file, layoutChoice, setUserLayout]);

  const handleEnterShowroom = useCallback(() => {
    if (sceneAnalysis) {
      onComplete({ sceneAnalysis });
    }
  }, [onComplete, sceneAnalysis]);

  const handleRetry = useCallback(() => {
    setError(null);
    setPhase('upload');
    setStep('preparing');
    setSceneAnalysis(null);
  }, []);

  return (
    <div className="w-full min-h-[520px] rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-indigo-600" />
          AI Kitchen Builder
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload a kitchen photo. <strong>GPT-4 Vision</strong> analyzes every detail and builds a fully customizable 3D scene — cabinets, countertops, flooring, lighting, and more.
        </p>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="w-full max-w-md space-y-6"
            >
              <label
                className={cn(
                  'flex flex-col items-center justify-center w-full h-56 rounded-xl border-2 border-dashed transition-colors cursor-pointer',
                  preview ? 'border-indigo-300 bg-indigo-50/50' : 'border-gray-300 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-400'
                )}
              >
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
                {preview ? (
                  <img src={preview} alt="Upload" className="max-h-full max-w-full object-contain rounded-lg" />
                ) : (
                  <>
                    <Camera className="h-12 w-12 text-gray-400 mb-3" />
                    <span className="text-sm font-medium text-gray-600">Click to upload your kitchen photo</span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</span>
                  </>
                )}
              </label>

              <div className="w-full space-y-2">
                <p className="text-sm font-medium text-gray-700">Kitchen layout</p>
                <div className="grid grid-cols-3 gap-2">
                  {(['U-shaped', 'L-shaped', 'single-wall'] as const).map((layout) => (
                    <button
                      key={layout}
                      type="button"
                      onClick={() => setLayoutChoice(layout)}
                      className={cn(
                        'rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-colors',
                        layoutChoice === layout
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      )}
                    >
                      {layout === 'single-wall' ? 'Flat wall' : layout.replace('-', ' ')}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500">Choose the layout that matches your kitchen. AI will use this and fill in the rest from the photo.</p>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleStartAnalysis} disabled={!file} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Build 3D Kitchen
                </Button>
                {onSkip && (
                  <Button variant="ghost" onClick={onSkip} className="text-gray-600">
                    Skip to demo
                  </Button>
                )}
              </div>

              <div className="bg-indigo-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-indigo-800 mb-2">GPT-4 Vision extracts:</h4>
                <div className="grid grid-cols-2 gap-1 text-xs text-indigo-600">
                  <span>• Room layout & dimensions</span>
                  <span>• Cabinet style & color</span>
                  <span>• Countertop material</span>
                  <span>• Flooring type & pattern</span>
                  <span>• Backsplash design</span>
                  <span>• Lighting fixtures</span>
                  <span>• Island specifications</span>
                  <span>• Appliance positions</span>
                </div>
              </div>
            </motion.div>
          )}

          {(phase === 'processing' || phase === 'done') && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-md space-y-6"
            >
              {preview && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
                  <img src={preview} alt="Analyzing" className="w-full h-full object-cover" />
                  {phase === 'processing' && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-4">
                      <div className="flex items-center gap-2 text-white">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-sm font-medium">{STEP_MESSAGES[step]}</span>
                      </div>
                    </div>
                  )}
                  {phase === 'done' && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Ready
                    </div>
                  )}
                </div>
              )}

              {phase === 'processing' && (
                <div className="space-y-3">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 15, ease: 'linear' }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    GPT-4 is analyzing your kitchen in detail. This takes 10-20 seconds.
                  </p>
                </div>
              )}

              {phase === 'done' && sceneAnalysis && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100">
                    <p className="text-sm text-gray-700">{sceneAnalysis.description}</p>
                    <div className="flex gap-4 mt-3 text-xs text-indigo-600">
                      <span>Style: {sceneAnalysis.room.style}</span>
                      <span>Layout: {sceneAnalysis.room.layout}</span>
                      <span>~{sceneAnalysis.room.widthFeet * sceneAnalysis.room.depthFeet} sq ft</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-white rounded-lg p-2 border shadow-sm">
                      <div className="font-medium text-gray-700">Cabinets</div>
                      <div className="text-gray-500">{sceneAnalysis.cabinets.style}</div>
                      <div 
                        className="w-full h-3 rounded mt-1 border" 
                        style={{ backgroundColor: sceneAnalysis.cabinets.color }} 
                      />
                    </div>
                    <div className="bg-white rounded-lg p-2 border shadow-sm">
                      <div className="font-medium text-gray-700">Countertops</div>
                      <div className="text-gray-500">{sceneAnalysis.countertops.material}</div>
                      <div 
                        className="w-full h-3 rounded mt-1 border" 
                        style={{ backgroundColor: sceneAnalysis.countertops.color }} 
                      />
                    </div>
                    <div className="bg-white rounded-lg p-2 border shadow-sm">
                      <div className="font-medium text-gray-700">Flooring</div>
                      <div className="text-gray-500">{sceneAnalysis.flooring.material}</div>
                      <div 
                        className="w-full h-3 rounded mt-1 border" 
                        style={{ backgroundColor: sceneAnalysis.flooring.color }} 
                      />
                    </div>
                  </div>

                  <Button size="lg" onClick={handleEnterShowroom} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Enter 3D Showroom
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {phase === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-md space-y-6 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <AlertCircle className="h-7 w-7 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Analysis failed</h3>
                <p className="text-sm text-gray-600 mt-1">{error}</p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={handleRetry}>
                  Try again
                </Button>
                {onSkip && (
                  <Button onClick={onSkip}>Skip to demo</Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
