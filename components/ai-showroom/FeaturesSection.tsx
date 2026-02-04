'use client';

import { motion } from 'framer-motion';
import {
  Camera,
  MousePointer,
  Sparkles,
  DollarSign,
  GitCompare,
  Lightbulb,
  Layers,
  Share2,
} from 'lucide-react';

const features = [
  {
    icon: Camera,
    title: 'Photo-to-3D Reconstruction',
    description: 'AI analyzes your photo and rebuilds your kitchen in explorable 3D',
  },
  {
    icon: MousePointer,
    title: 'Click-to-Edit Components',
    description: 'Select any element to customize materials, finishes, and dimensions',
  },
  {
    icon: Sparkles,
    title: 'Real-Time Material Swapping',
    description: 'Instantly visualize different cabinets, countertops, and finishes',
  },
  {
    icon: DollarSign,
    title: 'Live Pricing Breakdown',
    description: 'See material and labor costs update as you make selections',
  },
  {
    icon: GitCompare,
    title: 'Versioning + Comparisons',
    description: 'Save multiple designs and compare them side-by-side',
  },
  {
    icon: Lightbulb,
    title: 'Lighting Scenes',
    description: 'Preview your kitchen in daylight, evening, and showroom modes',
  },
  {
    icon: Layers,
    title: 'Guided Design Presets',
    description: 'Start with curated luxury styles and customize from there',
  },
  {
    icon: Share2,
    title: 'Shareable Proposal Links',
    description: 'Generate links to share your design with family and decision-makers',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Premium Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to design, visualize, and plan your dream kitchen
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
