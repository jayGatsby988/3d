import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          AI 3D Design Showroom
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          Turn your kitchen photo into an interactive, price-aware remodeling experience. Customize every detail and see your estimate update live.
        </p>
        <Link
          href="/ai-3d-showroom"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-8 py-4 text-lg font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Enter the Showroom
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
