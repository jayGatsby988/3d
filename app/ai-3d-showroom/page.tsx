'use client';

import { useState, useRef, useCallback } from 'react';
import { Toaster } from '@/components/ui/toaster';
import HeroSection from '@/components/ai-showroom/HeroSection';
import HowItWorksSection from '@/components/ai-showroom/HowItWorksSection';
import PhotoUploadFlow, { type PhotoCompletePayload } from '@/components/ai-showroom/PhotoUploadFlow';
import ShowroomShell from '@/components/ai-showroom/ShowroomShell';
import AIDesignAssistant from '@/components/ai-showroom/AIDesignAssistant';
import FeaturesSection from '@/components/ai-showroom/FeaturesSection';
import TrustSection from '@/components/ai-showroom/TrustSection';
import CTASection from '@/components/ai-showroom/CTASection';
import FAQSection from '@/components/ai-showroom/FAQSection';
import Footer from '@/components/ai-showroom/Footer';
import useShowroomStore from '@/lib/showroomStore';

export default function AIShowroomPage() {
  const showroomRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [showroomReady, setShowroomReady] = useState(false);
  const setSceneAnalysis = useShowroomStore((s) => s.setSceneAnalysis);

  const handlePhotoComplete = useCallback(
    (payload: PhotoCompletePayload) => {
      // Store the full scene analysis from GPT-4 Vision
      setSceneAnalysis(payload.sceneAnalysis);
      console.log('[Showroom] Scene analysis complete:', payload.sceneAnalysis.description);
      setShowroomReady(true);
    },
    [setSceneAnalysis]
  );

  const handleSkip = useCallback(() => {
    // Use default scene (null analysis will use default kitchen)
    setSceneAnalysis(null);
    setShowroomReady(true);
  }, [setSceneAnalysis]);

  const scrollToShowroom = () => {
    showroomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const scrollToCTA = () => {
    ctaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="min-h-screen bg-white">
      <HeroSection onTryDemo={scrollToShowroom} onBookCall={scrollToCTA} />

      <HowItWorksSection />

      <section ref={showroomRef} className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Interactive 3D Showroom
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Customize every detail. Watch pricing update live. Save and compare versions.
          </p>
        </div>
        <div className="max-w-[1600px] mx-auto">
          {showroomReady ? (
            <ShowroomShell onOpenAIChat={() => setAiAssistantOpen(true)} />
          ) : (
            <PhotoUploadFlow
              onComplete={handlePhotoComplete}
              onSkip={handleSkip}
            />
          )}
        </div>
      </section>

      <FeaturesSection />

      <TrustSection />

      <div ref={ctaRef}>
        <CTASection />
      </div>

      <FAQSection />

      <Footer />

      <AIDesignAssistant
        open={aiAssistantOpen}
        onOpenChange={setAiAssistantOpen}
      />
      <Toaster />
    </main>
  );
}
