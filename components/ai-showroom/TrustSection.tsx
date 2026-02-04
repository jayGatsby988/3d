'use client';

import { motion } from 'framer-motion';
import { Star, Shield, Award, DollarSign, Users } from 'lucide-react';
import { TESTIMONIALS, CASE_STUDY } from '@/lib/mockData';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function TrustSection() {
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
            Trusted by Premium Homeowners
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transparent pricing, exceptional craftsmanship, and results that exceed expectations
          </p>
        </motion.div>

        <div className="mb-16">
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {TESTIMONIALS.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="border-2 border-gray-200 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex gap-1 mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-5 w-5 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          "{testimonial.quote}"
                        </p>
                        <div className="border-t pt-4">
                          <p className="font-semibold text-gray-900">
                            {testimonial.name}
                          </p>
                          <p className="text-sm text-gray-600">{testimonial.location}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {testimonial.project}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-200 shadow-lg p-8 md:p-12 mb-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {CASE_STUDY.title}
              </h3>
              <p className="text-gray-600 mb-4">{CASE_STUDY.location}</p>

              <div className="space-y-3 mb-6">
                <div className="text-sm">
                  <span className="font-semibold text-gray-900">Project Scope:</span>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                    {CASE_STUDY.scope.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Investment Range</p>
                  <p className="text-xl font-bold text-gray-900">
                    {CASE_STUDY.estimateRange}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Timeline</p>
                  <p className="text-xl font-bold text-gray-900">
                    {CASE_STUDY.timeline}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="aspect-video bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
                Before → After Slider
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Final Selections:
                </p>
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Cabinets:</span>
                    <span className="font-medium text-gray-900">
                      {CASE_STUDY.selections.cabinets}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Countertops:</span>
                    <span className="font-medium text-gray-900">
                      {CASE_STUDY.selections.countertops}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Backsplash:</span>
                    <span className="font-medium text-gray-900">
                      {CASE_STUDY.selections.backsplash}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Flooring:</span>
                    <span className="font-medium text-gray-900">
                      {CASE_STUDY.selections.flooring}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hardware:</span>
                    <span className="font-medium text-gray-900">
                      {CASE_STUDY.selections.hardware}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-8 text-center"
        >
          {[
            { icon: Shield, text: 'Licensed & Insured' },
            { icon: Award, text: 'Premium Materials' },
            { icon: DollarSign, text: 'Transparent Estimates' },
            { icon: Users, text: 'Design-to-Build Support' },
          ].map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl"
            >
              <badge.icon className="h-8 w-8 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">{badge.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
