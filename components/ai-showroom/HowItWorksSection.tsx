'use client';

import { motion } from 'framer-motion';
import { Camera, Box, Palette, FileCheck, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const steps = [
  {
    number: 1,
    icon: Camera,
    title: 'Upload Photo / Scan Space',
    description: 'Take a photo with your phone or upload an existing image of your kitchen.',
    pricing: 'No cost at this stage',
    details: 'AI processes your image to understand room layout and dimensions',
  },
  {
    number: 2,
    icon: Box,
    title: 'AI Reconstructs Room into 3D',
    description: 'Our AI detects cabinets, counters, and appliances, then rebuilds your space in interactive 3D.',
    pricing: 'Cabinets: $8K–$25K | Counters: $3K–$8K',
    details: 'Estimates based on detected square footage and standard materials',
  },
  {
    number: 3,
    icon: Palette,
    title: 'Customize Materials + Layout',
    description: 'Click any element to change materials, colors, and finishes. Pricing updates instantly.',
    pricing: 'Material upgrades: $2K–$15K | Labor: $8K–$18K',
    details: 'Range varies by quality tier and installation complexity',
  },
  {
    number: 4,
    icon: FileCheck,
    title: 'Generate Proposal + Book Install',
    description: 'Export a detailed proposal with selections and pricing. Schedule consultation to finalize.',
    pricing: 'Demo/Disposal: $800–$1.5K | Permits: $150–$350',
    details: 'Final quote after in-home measurements and site review',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From photo to proposal in minutes. Transparent pricing at every step.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-400 to-blue-200 hidden sm:block" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } items-center gap-8`}
              >
                <div className="flex-1 w-full">
                  <div
                    className={`bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-lg p-6 md:p-8 ${
                      index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'
                    }`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center">
                        <step.icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-blue-900 mb-1">
                            Pricing happens here:
                          </p>
                          <p className="text-sm font-semibold text-blue-900">
                            {step.pricing}
                          </p>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-blue-600" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="text-xs">{step.details}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg border-4 border-white z-10">
                  <span className="text-2xl font-bold text-white">{step.number}</span>
                </div>

                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-200"
        >
          <p className="text-sm text-gray-600 text-center">
            <strong>Important:</strong> Estimates vary by region and site conditions.
            Final pricing determined after measurements and site review. These ranges
            are for planning purposes.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
