import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI 3D Showroom + Live Pricing | Norton Home Remodeling',
  description:
    'Upload a photo and instantly explore your kitchen in interactive 3D. Customize everything and watch pricing update live. Transparent estimates for your remodel.',
  keywords: [
    'kitchen remodel',
    '3D kitchen design',
    'AI kitchen planner',
    'live pricing',
    'kitchen renovation',
    'transparent pricing',
    'Norton Home Remodeling',
  ],
  openGraph: {
    title: 'AI 3D Showroom + Live Pricing | Norton Home Remodeling',
    description:
      'Transform your kitchen planning with our interactive 3D showroom. Customize materials, see live pricing, and create shareable proposals.',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Norton Home Remodeling AI 3D Showroom',
      },
    ],
  },
};

export default function AIShowroomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
