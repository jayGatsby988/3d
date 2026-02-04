import { MaterialTier } from './estimator';

export interface Material {
  id: string;
  name: string;
  tier: MaterialTier;
  description: string;
}

export interface MaterialCategory {
  category: string;
  options: Material[];
}

export const MATERIALS_CATALOG: MaterialCategory[] = [
  {
    category: 'Cabinets',
    options: [
      // Whites & Creams
      { id: 'shaker-white', name: 'Shaker White', tier: 'standard', description: 'Classic white shaker style' },
      { id: 'shaker-cream', name: 'Shaker Cream', tier: 'standard', description: 'Warm cream shaker style' },
      { id: 'high-gloss-white', name: 'High-Gloss White', tier: 'premium', description: 'Modern glossy white finish' },
      // Grays
      { id: 'dove-gray', name: 'Dove Gray Shaker', tier: 'standard', description: 'Light gray shaker cabinets' },
      { id: 'charcoal-shaker', name: 'Charcoal Shaker', tier: 'premium', description: 'Dark charcoal gray finish' },
      { id: 'high-gloss-charcoal', name: 'High-Gloss Charcoal', tier: 'luxury', description: 'Modern dark glossy finish' },
      // Blues & Greens
      { id: 'navy-blue', name: 'Navy Blue Shaker', tier: 'premium', description: 'Bold navy blue cabinets' },
      { id: 'sage-green', name: 'Sage Green', tier: 'premium', description: 'Soft sage green finish' },
      { id: 'hunter-green', name: 'Hunter Green', tier: 'premium', description: 'Deep forest green' },
      // Natural Woods
      { id: 'natural-maple', name: 'Natural Maple', tier: 'standard', description: 'Light natural maple wood' },
      { id: 'white-oak', name: 'White Oak', tier: 'premium', description: 'Beautiful white oak grain' },
      { id: 'walnut', name: 'Walnut', tier: 'luxury', description: 'Rich dark walnut wood' },
      { id: 'espresso-oak', name: 'Espresso Oak', tier: 'premium', description: 'Dark espresso stained oak' },
      // Modern
      { id: 'matte-black', name: 'Matte Black', tier: 'luxury', description: 'Sleek matte black finish' },
      { id: 'flat-panel-white', name: 'Flat Panel White', tier: 'premium', description: 'Modern slab door white' },
      { id: 'flat-panel-gray', name: 'Flat Panel Gray', tier: 'premium', description: 'Modern slab door gray' },
    ],
  },
  {
    category: 'Countertops',
    options: [
      // Quartz Options
      { id: 'pure-white-quartz', name: 'Pure White Quartz', tier: 'standard', description: 'Clean white engineered stone' },
      { id: 'calacatta-quartz', name: 'Calacatta Quartz', tier: 'premium', description: 'Marble-look with bold veins' },
      { id: 'carrara-quartz', name: 'Carrara Quartz', tier: 'premium', description: 'Subtle gray veining' },
      { id: 'gray-quartz', name: 'Gray Quartz', tier: 'standard', description: 'Modern gray engineered stone' },
      { id: 'concrete-look', name: 'Concrete Look', tier: 'premium', description: 'Industrial concrete aesthetic' },
      // Natural Stone
      { id: 'black-granite', name: 'Black Granite', tier: 'premium', description: 'Elegant black natural stone' },
      { id: 'speckled-granite', name: 'Speckled Granite', tier: 'premium', description: 'Classic speckled pattern' },
      { id: 'real-marble', name: 'Real Marble', tier: 'luxury', description: 'Genuine marble slab' },
      // Wood & Specialty
      { id: 'butcher-block', name: 'Butcher Block', tier: 'standard', description: 'Warm wood countertop' },
      { id: 'ultra-compact-dekton', name: 'Ultra-Compact Dekton', tier: 'luxury', description: 'Heat resistant sintered stone' },
      { id: 'stainless-steel', name: 'Stainless Steel', tier: 'premium', description: 'Professional kitchen style' },
    ],
  },
  {
    category: 'Hardware',
    options: [
      // Silver Tones
      { id: 'brushed-nickel', name: 'Brushed Nickel', tier: 'standard', description: 'Classic brushed silver' },
      { id: 'polished-chrome', name: 'Polished Chrome', tier: 'standard', description: 'Bright mirror finish' },
      { id: 'stainless-steel', name: 'Stainless Steel', tier: 'standard', description: 'Durable steel finish' },
      // Black & Dark
      { id: 'matte-black', name: 'Matte Black', tier: 'premium', description: 'Modern matte black' },
      { id: 'oil-rubbed-bronze', name: 'Oil-Rubbed Bronze', tier: 'premium', description: 'Warm dark bronze' },
      { id: 'gunmetal', name: 'Gunmetal', tier: 'premium', description: 'Dark metallic gray' },
      // Gold & Brass
      { id: 'satin-brass', name: 'Satin Brass', tier: 'premium', description: 'Warm brushed brass' },
      { id: 'polished-brass', name: 'Polished Brass', tier: 'premium', description: 'Classic gold tone' },
      { id: 'champagne-bronze', name: 'Champagne Bronze', tier: 'luxury', description: 'Soft golden bronze' },
      { id: 'antique-brass', name: 'Antique Brass', tier: 'premium', description: 'Aged vintage brass' },
      // Copper & Rose
      { id: 'copper', name: 'Copper', tier: 'luxury', description: 'Warm copper finish' },
      { id: 'rose-gold', name: 'Rose Gold', tier: 'luxury', description: 'Trendy rose gold' },
    ],
  },
  {
    category: 'Flooring',
    options: [
      // Vinyl Plank
      { id: 'lvp-light-oak', name: 'LVP Light Oak', tier: 'standard', description: 'Light oak vinyl plank' },
      { id: 'lvp-gray-wash', name: 'LVP Gray Wash', tier: 'standard', description: 'Gray washed vinyl plank' },
      { id: 'lvp-dark-walnut', name: 'LVP Dark Walnut', tier: 'standard', description: 'Dark walnut vinyl plank' },
      // Hardwood
      { id: 'white-oak-natural', name: 'White Oak Natural', tier: 'premium', description: 'Natural white oak planks' },
      { id: 'white-oak-gray', name: 'White Oak Gray', tier: 'premium', description: 'Gray stained white oak' },
      { id: 'walnut-solid', name: 'Solid Walnut', tier: 'luxury', description: 'Rich solid walnut' },
      { id: 'herringbone-oak', name: 'Herringbone Oak', tier: 'luxury', description: 'Classic herringbone pattern' },
      // Tile
      { id: 'porcelain-white', name: 'Porcelain White', tier: 'premium', description: 'Large format white tiles' },
      { id: 'porcelain-gray', name: 'Porcelain Gray', tier: 'premium', description: 'Large format gray tiles' },
      { id: 'porcelain-wood-look', name: 'Porcelain Wood-Look', tier: 'premium', description: 'Tile with wood grain' },
      { id: 'terrazzo', name: 'Terrazzo', tier: 'luxury', description: 'Classic speckled terrazzo' },
      { id: 'marble-tile', name: 'Marble Tile', tier: 'luxury', description: 'Natural marble flooring' },
    ],
  },
  {
    category: 'Backsplash',
    options: [
      // Subway & Metro
      { id: 'subway-white', name: 'White Subway Tile', tier: 'standard', description: 'Classic white 3x6 subway' },
      { id: 'subway-gray', name: 'Gray Subway Tile', tier: 'standard', description: 'Modern gray subway tile' },
      { id: 'subway-black', name: 'Black Subway Tile', tier: 'premium', description: 'Bold black subway tile' },
      { id: 'beveled-subway', name: 'Beveled Subway', tier: 'premium', description: 'Dimensional beveled edges' },
      // Patterns
      { id: 'herringbone-tile', name: 'Herringbone Tile', tier: 'premium', description: 'Herringbone pattern tile' },
      { id: 'hexagon-mosaic', name: 'Hexagon Mosaic', tier: 'premium', description: 'Trendy hexagon tiles' },
      { id: 'chevron-tile', name: 'Chevron Tile', tier: 'premium', description: 'Zigzag chevron pattern' },
      // Slab & Stone
      { id: 'marble-slab', name: 'Marble Slab', tier: 'luxury', description: 'Full height marble' },
      { id: 'quartz-slab', name: 'Quartz Slab', tier: 'premium', description: 'Seamless quartz backsplash' },
      { id: 'porcelain-slab', name: 'Porcelain Slab', tier: 'premium', description: 'Large format porcelain' },
      // Specialty
      { id: 'glass-sheet', name: 'Back-Painted Glass', tier: 'premium', description: 'Sleek colored glass' },
      { id: 'wood-plank', name: 'Wood Plank', tier: 'premium', description: 'Warm wood backsplash' },
      { id: 'stainless-panel', name: 'Stainless Panel', tier: 'premium', description: 'Professional steel look' },
    ],
  },
  {
    category: 'Lighting',
    options: [
      // Pendant Styles
      { id: 'globe-pendants', name: 'Globe Pendants', tier: 'standard', description: 'Classic globe fixtures' },
      { id: 'drum-pendants', name: 'Drum Pendants', tier: 'standard', description: 'Fabric drum shades' },
      { id: 'industrial-pendants', name: 'Industrial Pendants', tier: 'premium', description: 'Metal cage pendants' },
      { id: 'linear-pendant', name: 'Linear Pendant', tier: 'premium', description: 'Long bar LED fixture' },
      { id: 'amber-glass', name: 'Amber Glass Pendants', tier: 'premium', description: 'Warm amber glass globes' },
      { id: 'smoke-glass', name: 'Smoke Glass Pendants', tier: 'premium', description: 'Sophisticated smoke glass' },
      { id: 'crystal-pendants', name: 'Crystal Pendants', tier: 'luxury', description: 'Elegant crystal fixtures' },
      { id: 'sputnik', name: 'Sputnik Chandelier', tier: 'luxury', description: 'Mid-century statement piece' },
      // Metal Finishes
      { id: 'brass-fixtures', name: 'Brass Fixtures', tier: 'premium', description: 'Warm brass light fixtures' },
      { id: 'black-fixtures', name: 'Matte Black Fixtures', tier: 'premium', description: 'Modern black fixtures' },
      { id: 'chrome-fixtures', name: 'Chrome Fixtures', tier: 'standard', description: 'Polished chrome lights' },
      { id: 'copper-fixtures', name: 'Copper Fixtures', tier: 'luxury', description: 'Warm copper pendants' },
    ],
  },
];

export interface Preset {
  id: string;
  name: string;
  description: string;
  selections: {
    cabinetMaterial: string;
    cabinetTier: MaterialTier;
    countertopMaterial: string;
    countertopTier: MaterialTier;
    backsplashMaterial: string;
    backsplashTier: MaterialTier;
    flooringMaterial: string;
    flooringTier: MaterialTier;
    hardwareMaterial: string;
    hardwareTier: MaterialTier;
    lightingType: string;
    lightingTier: MaterialTier;
  };
  upgrades: {
    softClose: boolean;
    undercabLighting: boolean;
    waterfallEdge: boolean;
    premiumHardware: boolean;
  };
}

export const PRESETS: Preset[] = [
  {
    id: 'modern-luxe',
    name: 'Modern Luxe',
    description: 'High-gloss cabinets with marble-look quartz and brass accents',
    selections: {
      cabinetMaterial: 'High-Gloss White',
      cabinetTier: 'premium',
      countertopMaterial: 'Calacatta Quartz',
      countertopTier: 'premium',
      backsplashMaterial: 'Porcelain Slab',
      backsplashTier: 'premium',
      flooringMaterial: 'Porcelain White',
      flooringTier: 'premium',
      hardwareMaterial: 'Satin Brass',
      hardwareTier: 'premium',
      lightingType: 'Crystal Pendants',
      lightingTier: 'luxury',
    },
    upgrades: {
      softClose: true,
      undercabLighting: true,
      waterfallEdge: true,
      premiumHardware: true,
    },
  },
  {
    id: 'warm-transitional',
    name: 'Warm Transitional',
    description: 'Natural maple with granite counters and black hardware',
    selections: {
      cabinetMaterial: 'Natural Maple',
      cabinetTier: 'standard',
      countertopMaterial: 'Speckled Granite',
      countertopTier: 'premium',
      backsplashMaterial: 'White Subway Tile',
      backsplashTier: 'standard',
      flooringMaterial: 'White Oak Natural',
      flooringTier: 'premium',
      hardwareMaterial: 'Matte Black',
      hardwareTier: 'premium',
      lightingType: 'Globe Pendants',
      lightingTier: 'standard',
    },
    upgrades: {
      softClose: true,
      undercabLighting: true,
      waterfallEdge: false,
      premiumHardware: false,
    },
  },
  {
    id: 'minimal-white',
    name: 'Minimal White',
    description: 'Clean white shaker with quartz and chrome hardware',
    selections: {
      cabinetMaterial: 'Shaker White',
      cabinetTier: 'standard',
      countertopMaterial: 'Pure White Quartz',
      countertopTier: 'standard',
      backsplashMaterial: 'White Subway Tile',
      backsplashTier: 'standard',
      flooringMaterial: 'LVP Light Oak',
      flooringTier: 'standard',
      hardwareMaterial: 'Polished Chrome',
      hardwareTier: 'standard',
      lightingType: 'Chrome Fixtures',
      lightingTier: 'standard',
    },
    upgrades: {
      softClose: false,
      undercabLighting: false,
      waterfallEdge: false,
      premiumHardware: false,
    },
  },
  {
    id: 'dark-brass',
    name: 'Dark + Brass',
    description: 'Rich dark cabinets with brass accents and statement lighting',
    selections: {
      cabinetMaterial: 'Charcoal Shaker',
      cabinetTier: 'premium',
      countertopMaterial: 'Black Granite',
      countertopTier: 'premium',
      backsplashMaterial: 'Marble Slab',
      backsplashTier: 'luxury',
      flooringMaterial: 'Herringbone Oak',
      flooringTier: 'luxury',
      hardwareMaterial: 'Satin Brass',
      hardwareTier: 'premium',
      lightingType: 'Brass Fixtures',
      lightingTier: 'premium',
    },
    upgrades: {
      softClose: true,
      undercabLighting: true,
      waterfallEdge: true,
      premiumHardware: true,
    },
  },
  {
    id: 'natural-oak',
    name: 'Natural Oak',
    description: 'Organic oak tones with natural stone and minimal hardware',
    selections: {
      cabinetMaterial: 'White Oak',
      cabinetTier: 'premium',
      countertopMaterial: 'Butcher Block',
      countertopTier: 'standard',
      backsplashMaterial: 'Hexagon Mosaic',
      backsplashTier: 'premium',
      flooringMaterial: 'White Oak Natural',
      flooringTier: 'premium',
      hardwareMaterial: 'Brushed Nickel',
      hardwareTier: 'standard',
      lightingType: 'Industrial Pendants',
      lightingTier: 'premium',
    },
    upgrades: {
      softClose: true,
      undercabLighting: true,
      waterfallEdge: false,
      premiumHardware: false,
    },
  },
  {
    id: 'coastal-blue',
    name: 'Coastal Blue',
    description: 'Navy blue cabinets with white marble and copper accents',
    selections: {
      cabinetMaterial: 'Navy Blue Shaker',
      cabinetTier: 'premium',
      countertopMaterial: 'Carrara Quartz',
      countertopTier: 'premium',
      backsplashMaterial: 'Herringbone Tile',
      backsplashTier: 'premium',
      flooringMaterial: 'White Oak Gray',
      flooringTier: 'premium',
      hardwareMaterial: 'Copper',
      hardwareTier: 'luxury',
      lightingType: 'Copper Fixtures',
      lightingTier: 'luxury',
    },
    upgrades: {
      softClose: true,
      undercabLighting: true,
      waterfallEdge: false,
      premiumHardware: true,
    },
  },
  {
    id: 'industrial-modern',
    name: 'Industrial Modern',
    description: 'Matte black cabinets with concrete counters and exposed metal',
    selections: {
      cabinetMaterial: 'Matte Black',
      cabinetTier: 'luxury',
      countertopMaterial: 'Concrete Look',
      countertopTier: 'premium',
      backsplashMaterial: 'Stainless Panel',
      backsplashTier: 'premium',
      flooringMaterial: 'Porcelain Gray',
      flooringTier: 'premium',
      hardwareMaterial: 'Gunmetal',
      hardwareTier: 'premium',
      lightingType: 'Industrial Pendants',
      lightingTier: 'premium',
    },
    upgrades: {
      softClose: true,
      undercabLighting: true,
      waterfallEdge: false,
      premiumHardware: true,
    },
  },
];

export interface Testimonial {
  name: string;
  location: string;
  project: string;
  quote: string;
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sarah Mitchell',
    location: 'Westchester, NY',
    project: 'Kitchen Remodel',
    quote: 'The 3D showroom was incredible. We could see exactly what our kitchen would look like before committing. The pricing was transparent and accurate.',
    rating: 5,
  },
  {
    name: 'David Chen',
    location: 'Greenwich, CT',
    project: 'Kitchen + Island Addition',
    quote: 'Being able to compare different material options side-by-side with live pricing made our decision so much easier. The final result exceeded our expectations.',
    rating: 5,
  },
  {
    name: 'Jennifer Adams',
    location: 'Scarsdale, NY',
    project: 'Full Kitchen Renovation',
    quote: 'The instant visualization helped us convince our family on the design direction. We saved the versions and showed them to everyone before deciding.',
    rating: 5,
  },
  {
    name: 'Michael Torres',
    location: 'Rye, NY',
    project: 'Kitchen & Butler\'s Pantry',
    quote: 'Norton\'s transparent pricing and professional execution made this the smoothest remodel we\'ve ever done. The 3D tool was a game-changer.',
    rating: 5,
  },
];

export interface FAQ {
  question: string;
  answer: string;
}

export const FAQS: FAQ[] = [
  {
    question: 'How accurate is the photo-to-3D reconstruction?',
    answer: 'Our AI analyzes your photo to detect room dimensions, cabinet placement, and key features. While it provides a strong starting point, we recommend an in-home measurement for final specifications and accurate site conditions.',
  },
  {
    question: 'Is the pricing real?',
    answer: 'Yes. The estimates are based on real material costs and labor rates in your region. However, final pricing may vary based on site conditions, exact measurements, and any unforeseen structural work discovered during demolition.',
  },
  {
    question: 'What\'s included in the labor costs?',
    answer: 'Labor includes demolition, installation, basic electrical work, plumbing connections, and finishing. Complex electrical or plumbing modifications may require additional allowances, which we\'ll identify during the in-home consultation.',
  },
  {
    question: 'What can change the final price?',
    answer: 'Site conditions (structural issues, outdated plumbing/electrical), changes to the original design, premium upgrades, and permit requirements can affect final pricing. We provide detailed estimates after measurements to minimize surprises.',
  },
  {
    question: 'Can I share my design with others?',
    answer: 'Absolutely. Use the Share Link feature to generate a URL that includes your design selections and pricing. Share it with your spouse, family, or anyone you\'d like input from.',
  },
  {
    question: 'Do you offer in-home measurements?',
    answer: 'Yes. After you finalize your design direction in the 3D showroom, we\'ll schedule a complimentary in-home consultation to verify measurements, discuss site conditions, and provide a detailed proposal.',
  },
  {
    question: 'What\'s the typical timeline?',
    answer: 'Most kitchen remodels take 5–10 weeks from demolition to completion, depending on complexity and material lead times. We provide a detailed timeline in your proposal.',
  },
  {
    question: 'Can I use this tool without committing to a project?',
    answer: 'Of course. The 3D showroom is free to use for exploration and planning. There\'s no obligation. Many clients use it to plan and budget before deciding when to move forward.',
  },
  {
    question: 'What types of remodels do you support?',
    answer: 'We specialize in kitchens, bathrooms, basements, and full-home renovations. The 3D showroom currently focuses on kitchen design, with bathroom support coming soon.',
  },
  {
    question: 'What\'s included in the proposal?',
    answer: 'Your proposal includes detailed design selections, material specifications, scope of work, line-item cost breakdown, timeline estimate, and next steps. It\'s a comprehensive document you can review and share.',
  },
];

export interface CaseStudy {
  title: string;
  location: string;
  scope: string[];
  timeline: string;
  estimateRange: string;
  beforeImage: string;
  afterImage: string;
  selections: {
    cabinets: string;
    countertops: string;
    backsplash: string;
    flooring: string;
    hardware: string;
  };
}

export const CASE_STUDY: CaseStudy = {
  title: 'Modern Transitional Kitchen',
  location: 'Bronxville, NY',
  scope: [
    'Full cabinet replacement',
    'Quartz countertops with waterfall island',
    'New backsplash and lighting',
    'Engineered hardwood flooring',
    'Updated plumbing and electrical',
  ],
  timeline: '7 weeks from demo to completion',
  estimateRange: '$48,000 – $62,000',
  beforeImage: '/placeholder-before.jpg',
  afterImage: '/placeholder-after.jpg',
  selections: {
    cabinets: 'Solid Maple Shaker, Custom Gray',
    countertops: 'Marble-Look Quartz',
    backsplash: 'Large-Format Porcelain',
    flooring: 'Engineered Oak, Natural Finish',
    hardware: 'Satin Brass Pulls & Knobs',
  },
};

export const COLORS = {
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  mediumGray: '#9CA3AF',
  darkGray: '#374151',
  oak: '#D4A574',
  walnut: '#5D4E37',
  brass: '#B5A642',
  nickel: '#C0C0C0',
  black: '#1F2937',
  marble: '#F8F8F8',
  granite: '#6B7280',
};
