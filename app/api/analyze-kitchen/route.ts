import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 120000,
  maxRetries: 3,
});

/** Complete 3D scene specification from GPT analysis */
export interface SceneAnalysis {
  room: {
    layout: 'single-wall' | 'galley' | 'L-shaped' | 'U-shaped' | 'peninsula';
    widthFeet: number;
    depthFeet: number;
    ceilingHeightFeet: number;
    style: 'modern' | 'traditional' | 'transitional' | 'farmhouse' | 'industrial' | 'contemporary';
  };
  
  cabinets: {
    present: boolean;
    style: 'shaker' | 'flat-panel' | 'raised-panel' | 'glass-front' | 'open-shelving' | 'slab';
    color: string;
    upperColor: string;
    isTwoTone: boolean;
    finish: 'matte' | 'satin' | 'gloss';
    hardware: 'knobs' | 'pulls' | 'integrated' | 'none';
    hardwareColor: string;
    upperCabinets: boolean;
    hasGlassFronts: boolean;
    baseHeight: number;        // inches, typically 34-36
    upperHeight: number;       // inches, typically 30-42 (SHORTER than base)
    baseDepth: number;         // inches, typically 24
    upperDepth: number;        // inches, typically 12-14 (SHALLOWER than base)
    runs: Array<{
      wall: 'back' | 'left' | 'right';
      startX: number;
      lengthFeet: number;
      hasUpperCabinets: boolean;
      // Individual base cabinet specs (left to right) - OPTIONAL for detailed rendering
      baseCabinets?: Array<{
        widthInches: number; // 12, 15, 18, 21, 24, 30, 33, 36
        type: 'door' | 'drawer-stack' | 'sink-base' | 'appliance-gap' | 'corner' | 'pull-out' | 'open-basket';
        hasDrawers?: boolean; // true if door + drawer combo
      }>;
      // Individual upper cabinet specs (left to right) - OPTIONAL for detailed rendering
      upperCabinets?: Array<{
        widthInches: number;
        type: 'door' | 'glass-door' | 'open-shelf' | 'appliance-gap' | 'corner' | 'microwave-shelf' | 'display-niche';
      }>;
      // Open storage sections within the run
      openStorage?: Array<{
        positionAlongWall: number; // 0-1
        widthInches: number;
        type: 'basket' | 'open-shelf' | 'display';
        shelfCount?: number;
      }>;
      // Counts (always required)
      baseCabinetCount: number;
      upperCabinetCount: number;
      hasDrawerStack?: boolean;
      drawerStackPosition?: number;
    }>;
  };
  
  // Tall cabinets/pantries (floor to ceiling or near ceiling)
  tallCabinets?: Array<{
    wall: 'back' | 'left' | 'right';
    positionAlongWall: number;
    widthFeet: number;
    heightFeet: number;
    type: 'pantry' | 'utility' | 'open-shelving' | 'display';
    color: string;
    hasGlassDoors?: boolean;
  }>;
  
  island: {
    present: boolean;
    type: 'island' | 'peninsula' | 'breakfast-bar';
    lengthFeet: number;
    widthFeet: number;
    color: string;
    hasSeating: boolean;
    seatingCount: number;
    hasWaterfallEdge: boolean;
    attachedToWall: 'left' | 'right' | 'back' | 'none';
  };
  
  countertops: {
    material: 'granite' | 'quartz' | 'marble' | 'butcher-block' | 'laminate' | 'concrete' | 'stainless';
    color: string;
    pattern: 'solid' | 'veined' | 'speckled';
    thickness: 'thin' | 'standard' | 'thick';
  };
  
  backsplash: {
    present: boolean;
    type: 'subway-tile' | 'mosaic' | 'slab' | 'brick' | 'herringbone' | 'hexagon' | 'none';
    color: string;
    height: 'standard' | 'full-height';
  };
  
  flooring: {
    material: 'hardwood' | 'tile' | 'vinyl' | 'concrete' | 'stone' | 'laminate' | 'terrazzo';
    color: string;
    pattern: 'planks' | 'herringbone' | 'chevron' | 'grid' | 'random' | 'speckled';
  };
  
  walls: {
    color: string;
    accent: boolean;
    accentWall: 'back' | 'left' | 'right' | 'none';
    accentColor: string;
    ceilingColor: string;
  };
  
  windows: Array<{
    wall: 'back' | 'left' | 'right';
    positionX: number;
    widthFeet: number;
    heightFeet: number;
    bottomFromFloor: number;
    style: 'standard' | 'picture' | 'bay';
  }>;
  
  doors: Array<{
    wall: 'back' | 'left' | 'right';
    positionX: number;
    widthFeet: number;
    heightFeet: number;
    style: 'standard' | 'french' | 'sliding';
  }>;
  
  lighting: {
    pendants: {
      present: boolean;
      count: number;
      style: 'globe' | 'cone' | 'dome' | 'drum' | 'industrial' | 'lantern' | 'linear' | 'amber-glass' | 'smoke-glass' | 'cage' | 'crystal';
      color: string;
      glassColor: string;
    };
    recessed: {
      present: boolean;
      count: number;
    };
    underCabinet: boolean;
    chandelier: boolean;
  };
  
  woodAccents: {
    present: boolean;
    color: string;
    locations: Array<'ceiling-beam' | 'frame' | 'shelving' | 'trim'>;
  };
  
  appliances: {
    rangeHood: {
      present: boolean;
      style: 'wall-mount' | 'island' | 'under-cabinet' | 'integrated';
      material: 'stainless' | 'black' | 'white' | 'copper';
      wall: 'back' | 'left' | 'right';
      positionAlongWall: number;
    };
    refrigerator: {
      present: boolean;
      style: 'french-door' | 'side-by-side' | 'top-freezer' | 'integrated';
      color: string;
      wall: 'back' | 'left' | 'right';
      positionAlongWall: number;
      widthFeet: number;
    };
    oven: {
      present: boolean;
      type: 'wall-oven' | 'double-oven' | 'range' | 'built-in';
      color: string;
      wall: 'back' | 'left' | 'right';
      positionAlongWall: number;
    };
    cooktop: {
      present: boolean;
      type: 'gas' | 'electric' | 'induction';
      color: string;
      wall: 'back' | 'left' | 'right' | 'island';
      positionAlongWall: number;
    };
    dishwasher: {
      present: boolean;
      wall: 'back' | 'left' | 'right';
      positionAlongWall: number;
    };
    sink: {
      present: boolean;
      style: 'undermount' | 'farmhouse' | 'drop-in' | 'integrated';
      material: 'stainless' | 'composite' | 'porcelain' | 'copper';
      wall: 'back' | 'left' | 'right' | 'island';
      positionAlongWall: number;
    };
    microwave: {
      present: boolean;
      location: 'over-range' | 'built-in' | 'countertop' | 'drawer';
      wall: 'back' | 'left' | 'right';
      positionAlongWall: number;
    };
    wineFridge: {
      present: boolean;
      location: 'under-counter' | 'built-in' | 'island';
      wall: 'back' | 'left' | 'right' | 'island';
      positionAlongWall: number;
    };
    range: {
      present: boolean;
      type: 'gas' | 'electric' | 'dual-fuel';
      color: string;
      widthInches: 30 | 36 | 48;
      wall: 'back' | 'left' | 'right';
      positionAlongWall: number;
    };
  };
  
  openShelving: {
    present: boolean;
    wall: 'back' | 'left' | 'right';
    positionAlongWall: number;
    widthFeet: number;
    shelfCount: number;
    color: string;
  };
  
  seating?: {
    present: boolean;
    type: 'bar-stool' | 'counter-stool' | 'chair';
    count: number;
    style: 'modern' | 'traditional' | 'industrial' | 'mid-century';
    color: string;
    material: 'wood' | 'metal' | 'upholstered' | 'leather';
    location: 'island' | 'peninsula' | 'counter';
  };
  
  decor?: {
    plants: { present: boolean; count: number; locations: string[] };
    pendantCount: number;
    artwork: { present: boolean; wall: string };
    vases: { present: boolean; count: number };
    cuttingBoards: { present: boolean };
    fruitBowl: { present: boolean };
    books: { present: boolean };
  };
  
  aesthetic: {
    luxuryScore: number;
    modernScore: number;
    warmthScore: number;
    brightnessScore: number;
  };
  
  description: string;
  confidence: number;
}

/** Default scene when analysis fails */
function getDefaultScene(): SceneAnalysis {
  return {
    room: {
      layout: 'single-wall',
      widthFeet: 14,
      depthFeet: 12,
      ceilingHeightFeet: 9,
      style: 'modern',
    },
    cabinets: {
      present: true,
      style: 'shaker',
      color: '#F5F5F5',
      upperColor: '#F5F5F5',
      isTwoTone: false,
      finish: 'satin',
      hardware: 'pulls',
      hardwareColor: '#C0C0C0',
      upperCabinets: true,
      hasGlassFronts: false,
      baseHeight: 36,
      upperHeight: 30,
      baseDepth: 24,
      upperDepth: 12,
      runs: [
        { 
          wall: 'back', 
          startX: 0, 
          lengthFeet: 10, 
          hasUpperCabinets: true, 
          baseCabinets: [
            { widthInches: 24, type: 'door', hasDrawers: true },
            { widthInches: 18, type: 'drawer-stack' },
            { widthInches: 33, type: 'sink-base' },
            { widthInches: 24, type: 'door', hasDrawers: true },
            { widthInches: 21, type: 'door' },
          ],
          upperCabinets: [
            { widthInches: 30, type: 'door' },
            { widthInches: 24, type: 'glass-door' },
            { widthInches: 24, type: 'glass-door' },
            { widthInches: 30, type: 'door' },
          ],
          baseCabinetCount: 5, 
          upperCabinetCount: 4 
        },
        { 
          wall: 'left', 
          startX: 0, 
          lengthFeet: 6, 
          hasUpperCabinets: true, 
          baseCabinets: [
            { widthInches: 24, type: 'door', hasDrawers: true },
            { widthInches: 24, type: 'appliance-gap' },
            { widthInches: 24, type: 'door' },
          ],
          upperCabinets: [
            { widthInches: 36, type: 'door' },
            { widthInches: 36, type: 'door' },
          ],
          baseCabinetCount: 3, 
          upperCabinetCount: 2 
        },
      ],
    },
    island: {
      present: true,
      type: 'island',
      lengthFeet: 6,
      widthFeet: 3,
      color: '#F5F5F5',
      hasSeating: true,
      seatingCount: 3,
      hasWaterfallEdge: false,
      attachedToWall: 'none',
    },
    countertops: {
      material: 'quartz',
      color: '#FFFFFF',
      pattern: 'veined',
      thickness: 'standard',
    },
    backsplash: {
      present: true,
      type: 'subway-tile',
      color: '#FFFFFF',
      height: 'standard',
    },
    flooring: {
      material: 'hardwood',
      color: '#8B7355',
      pattern: 'planks',
    },
    walls: {
      color: '#FAFAFA',
      accent: false,
      accentWall: 'none',
      accentColor: '#FAFAFA',
      ceilingColor: '#FFFFFF',
    },
    windows: [
      { wall: 'back', positionX: 3, widthFeet: 4, heightFeet: 4, bottomFromFloor: 3, style: 'standard' },
    ],
    doors: [],
    lighting: {
      pendants: { present: true, count: 3, style: 'globe', color: '#D4AF37', glassColor: '#FFFFFF' },
      recessed: { present: true, count: 6 },
      underCabinet: true,
      chandelier: false,
    },
    woodAccents: {
      present: false,
      color: '#8B5A2B',
      locations: [],
    },
    appliances: {
      rangeHood: { present: false, style: 'wall-mount', material: 'stainless', wall: 'back', positionAlongWall: 0.5 },
      refrigerator: { present: false, style: 'french-door', color: '#C0C0C0', wall: 'left', positionAlongWall: 0.95, widthFeet: 3 },
      oven: { present: false, type: 'wall-oven', color: '#2D2D2D', wall: 'left', positionAlongWall: 0.1 },
      range: { present: false, type: 'gas', color: '#2D2D2D', widthInches: 30, wall: 'back', positionAlongWall: 0.5 },
      cooktop: { present: false, type: 'gas', color: '#2D2D2D', wall: 'back', positionAlongWall: 0.5 },
      dishwasher: { present: false, wall: 'back', positionAlongWall: 0.35 },
      sink: { present: true, style: 'undermount', material: 'stainless', wall: 'back', positionAlongWall: 0.5 },
      microwave: { present: false, location: 'over-range', wall: 'back', positionAlongWall: 0.5 },
      wineFridge: { present: false, location: 'under-counter', wall: 'back', positionAlongWall: 0.8 },
    },
    openShelving: {
      present: false,
      wall: 'back',
      positionAlongWall: 0.8,
      widthFeet: 2,
      shelfCount: 3,
      color: '#8B5A2B',
    },
    seating: {
      present: false,
      type: 'bar-stool',
      count: 0,
      style: 'modern',
      color: '#2D2D2D',
      material: 'metal',
      location: 'island',
    },
    decor: {
      plants: { present: false, count: 0, locations: [] },
      pendantCount: 0,
      artwork: { present: false, wall: 'back' },
      vases: { present: false, count: 0 },
      cuttingBoards: { present: false },
      fruitBowl: { present: false },
      books: { present: false },
    },
    aesthetic: {
      luxuryScore: 7,
      modernScore: 8,
      warmthScore: 5,
      brightnessScore: 8,
    },
    description: 'A modern kitchen with white shaker cabinets and quartz countertops.',
    confidence: 0.5,
  };
}

const USER_LAYOUT_TO_ROOM: Record<string, 'U-shaped' | 'L-shaped' | 'single-wall'> = {
  'U-shaped': 'U-shaped',
  'L-shaped': 'L-shaped',
  'single-wall': 'single-wall',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const image_url = body?.image_url;
    const user_layout = body?.user_layout as string | undefined;
    
    if (!image_url) {
      console.warn('[Scene Analysis] No image provided, using defaults');
      return NextResponse.json(getDefaultScene());
    }

    const forcedLayout = user_layout && USER_LAYOUT_TO_ROOM[user_layout] ? USER_LAYOUT_TO_ROOM[user_layout] : null;
    if (forcedLayout) console.log('[Scene Analysis] User layout:', forcedLayout);

    console.log('[Scene Analysis] Starting GPT-4o Vision analysis...');
    
    // Retry logic for connection errors
    const maxRetries = 2;
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-2024-11-20',
          messages: [
            {
              role: 'system',
              content: `You are an expert kitchen analyst. Analyze EVERY detail in this image. Return ONLY valid JSON.

CRITICAL - ANALYZE EVERYTHING:
1. Return ONLY JSON - no text before/after
2. Extract EXACT HEX colors by sampling image pixels
3. Cabinets are FLUSH/CONNECTED (no gaps between them)
4. Upper cabinets are SMALLER (shallower depth ~12", shorter height ~30") than base (~24" deep, ~34" tall)
5. Detect TWO-TONE if upper and lower cabinet colors differ

CABINET ANALYSIS:
- Style: "slab" (flat smooth, no frame), "shaker" (frame+recessed panel), "flat-panel", "raised-panel"
- Finish: "gloss" (shiny/reflective), "matte" (flat), "satin" (slight sheen)
- Count EACH cabinet door on each wall
- Note ANY open storage sections (baskets, open shelves built into cabinet run)
- Look for tall pantry/utility cabinets

LAYOUT - USE THE VISUAL SHAPE ONLY:
Look at the photo. What shape do the cabinets/counters form?
- If the layout LOOKS like a "U" (cabinets on three sides wrapping around the room) → "U-shaped"
- If the layout LOOKS like an "L" (cabinets on two sides meeting at one corner) → "L-shaped"
- If only one wall has cabinets → "single-wall"
- If two opposite walls have cabinets (narrow walk-through) → "galley"

Ignore wall labels. Just ask: does it look like a U or an L? Use that.
Then in "runs", include one run per wall that has cabinets: U-shaped = 3 runs (wall "back", "left", "right"). L-shaped = 2 runs (e.g. "back" and "left", or "back" and "right").

SPECIAL FEATURES TO DETECT:
- Open storage with wicker/rattan baskets
- Built-in open shelving sections within cabinet runs
- Tall wood accent shelving units
- Display niches/cubbies
- Pull-out storage

APPLIANCES - SCAN FOR ALL:
- Range hood (wall-mount, under-cabinet, island style; color/material)
- Cooktop (gas burners visible? induction? electric?)
- Wall oven vs range (combined unit)
- Refrigerator (visible? style? position?)
- Dishwasher, microwave, sink

WINDOWS: Always detect! Look for blinds, natural light, glass.

DECORATIVE ELEMENTS:
- Plants (count, locations)
- Jars, containers, vases
- Cutting boards
- Fruit bowls
- Pendant lights (style, count)
- Geometric/artistic fixtures

JSON structure:
{
  "room": {
    "layout": "single-wall" | "galley" | "L-shaped" | "U-shaped" | "peninsula",
    "widthFeet": 10-25,
    "depthFeet": 8-20,
    "ceilingHeightFeet": 8-12,
    "style": "modern" | "traditional" | "transitional" | "farmhouse" | "industrial" | "contemporary"
  },
  "cabinets": {
    "present": true,
    "style": "shaker" | "flat-panel" | "raised-panel" | "glass-front" | "open-shelving" | "slab",
    "color": "#HEXCOLOR - BASE cabinet color, sample EXACTLY from image",
    "upperColor": "#HEXCOLOR - UPPER cabinet color (may be DIFFERENT = two-tone)",
    "isTwoTone": true|false,
    "finish": "matte" | "satin" | "gloss",
    "hardware": "knobs" | "pulls" | "integrated" | "none",
    "hardwareColor": "#HEXCOLOR",
    "upperCabinets": true|false,
    "hasGlassFronts": true|false,
    "baseHeight": 34,
    "upperHeight": 30,
    "baseDepth": 24,
    "upperDepth": 12,
    "runs": [
      {
        "wall": "back"|"left"|"right",
        "startX": 0,
        "lengthFeet": <total length>,
        "hasUpperCabinets": true|false,
        "baseCabinets": [
          {"widthInches": 24, "type": "door"},
          {"widthInches": 18, "type": "open-basket"},
          {"widthInches": 24, "type": "drawer-stack"}
        ],
        "upperCabinets": [
          {"widthInches": 24, "type": "door"},
          {"widthInches": 30, "type": "open-shelf"},
          {"widthInches": 24, "type": "door"}
        ],
        "openStorage": [
          {"positionAlongWall": 0.4, "widthInches": 18, "type": "basket", "shelfCount": 2}
        ],
        "baseCabinetCount": <count>,
        "upperCabinetCount": <count>
      }
    ]
  },
  "tallCabinets": [
    {"wall": "left", "positionAlongWall": 0, "widthFeet": 1.5, "heightFeet": 7, "type": "open-shelving", "color": "#8B6914"}
  ],
  "island": {
    "present": true|false,
    "type": "island" | "peninsula" | "breakfast-bar",
    "lengthFeet": 4-10,
    "widthFeet": 2-4,
    "color": "#HEXCOLOR - the BASE/CABINET color of island (often wood like walnut #8B6914, may differ from perimeter cabinets)",
    "hasSeating": true|false,
    "seatingCount": 0-6,
    "hasWaterfallEdge": true|false,
    "attachedToWall": "left"|"right"|"back"|"none"
  },
  "countertops": {
    "material": "granite"|"quartz"|"marble"|"butcher-block"|"laminate"|"concrete"|"stainless",
    "color": "#HEXCOLOR",
    "pattern": "solid"|"veined"|"speckled",
    "thickness": "thin"|"standard"|"thick"
  },
  "backsplash": {
    "present": true|false,
    "type": "subway-tile"|"mosaic"|"slab"|"brick"|"herringbone"|"hexagon"|"none",
    "color": "#HEXCOLOR",
    "height": "standard"|"full-height"
  },
  "flooring": {
    "material": "hardwood"|"tile"|"vinyl"|"concrete"|"stone"|"laminate"|"terrazzo",
    "color": "#HEXCOLOR",
    "pattern": "planks"|"herringbone"|"chevron"|"grid"|"random"|"speckled"
  },
  "walls": {"color": "#HEXCOLOR", "accent": false, "accentWall": "none", "accentColor": "#HEXCOLOR", "ceilingColor": "#HEXCOLOR"},
  "windows": [],
  "doors": [],
  "lighting": {
    "pendants": {"present": true, "count": 3, "style": "globe"|"cone"|"dome"|"drum"|"industrial"|"linear"|"crystal", "color": "#HEXCOLOR", "glassColor": "#HEXCOLOR"},
    "recessed": {"present": true, "count": 6},
    "underCabinet": true|false,
    "chandelier": false
  },
  "woodAccents": {"present": false, "color": "#HEXCOLOR", "locations": []},
  "appliances": {
    "rangeHood": {"present": true|false, "style": "wall-mount"|"under-cabinet"|"island", "material": "stainless"|"black"|"white", "wall": "back", "positionAlongWall": 0.5},
    "refrigerator": {"present": true|false, "style": "french-door"|"side-by-side"|"integrated", "color": "#HEXCOLOR", "wall": "left"|"right", "positionAlongWall": 0.95, "widthFeet": 3},
    "oven": {"present": true|false, "type": "wall-oven"|"double-oven"|"range"|"built-in", "color": "#HEXCOLOR", "wall": "back"|"left"|"right", "positionAlongWall": 0.5},
    "range": {"present": true|false, "type": "gas"|"electric"|"dual-fuel", "color": "#HEXCOLOR", "widthInches": 30|36|48, "wall": "back", "positionAlongWall": 0.5},
    "cooktop": {"present": true|false, "type": "gas"|"electric"|"induction", "color": "#HEXCOLOR", "wall": "back"|"island", "positionAlongWall": 0.5},
    "dishwasher": {"present": true|false, "wall": "back"|"left"|"right", "positionAlongWall": 0.35},
    "sink": {"present": true|false, "style": "undermount"|"farmhouse"|"drop-in", "material": "stainless"|"composite"|"porcelain", "wall": "back"|"island", "positionAlongWall": 0.5},
    "microwave": {"present": true|false, "location": "over-range"|"built-in"|"countertop"|"drawer", "wall": "back", "positionAlongWall": 0.5},
    "wineFridge": {"present": true|false, "location": "under-counter"|"built-in"|"island", "wall": "back"|"left"|"right"|"island", "positionAlongWall": 0.8}
  },
  "openShelving": {"present": false, "wall": "back", "positionAlongWall": 0.8, "widthFeet": 2, "shelfCount": 3, "color": "#HEXCOLOR"},
  "seating": {
    "present": true|false,
    "type": "bar-stool"|"counter-stool"|"chair",
    "count": 0-6,
    "style": "modern"|"traditional"|"industrial"|"mid-century",
    "color": "#HEXCOLOR",
    "material": "wood"|"metal"|"upholstered"|"leather",
    "location": "island"|"peninsula"|"counter"
  },
  "decor": {
    "plants": {"present": true|false, "count": 0-5, "locations": ["counter"|"windowsill"|"floor"|"shelf"]},
    "pendantCount": 0-5,
    "artwork": {"present": true|false, "wall": "back"|"left"|"right"},
    "vases": {"present": true|false, "count": 0-3},
    "cuttingBoards": {"present": true|false},
    "fruitBowl": {"present": true|false},
    "books": {"present": true|false}
  },
  "aesthetic": {"luxuryScore": 1-10, "modernScore": 1-10, "warmthScore": 1-10, "brightnessScore": 1-10},
  "description": "2-3 sentence summary",
  "confidence": 0-1
}`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze EVERY aspect of this kitchen image for 3D recreation.

CABINET DETAILS - BE PRECISE:
1. Style: SLAB (flat/smooth) or SHAKER (frame+panel) or other?
2. Finish: GLOSS (shiny) or MATTE (flat)?
3. BASE cabinet color - sample exact HEX from image
4. UPPER cabinet color - sample exact HEX (may differ = two-tone!)
5. Count each individual cabinet door per wall
6. Upper cabinets HEIGHT vs base cabinet HEIGHT (uppers are shorter)
7. Are there ANY open storage sections? Wicker baskets? Open shelves?

LAYOUT - LOOK AT THE SHAPE IN THE PHOTO:
Does the kitchen LOOK like a U (three sides with cabinets) or an L (two sides meeting at a corner)?
- Looks like U → "U-shaped"
- Looks like L → "L-shaped"
- One wall only → "single-wall"
- Two parallel walls → "galley"
Set "layout" to match what you see. Then add one run per wall with cabinets so the 3D matches (U = 3 runs, L = 2 runs).

APPLIANCES - Find each one:
1. RANGE HOOD - what style? color? material?
2. COOKTOP - gas (visible burners)? induction? electric?
3. Is there a WALL OVEN or is cooktop part of a RANGE?
4. SINK - where? what style?
5. REFRIGERATOR - visible? where?
6. Any dishwasher, microwave?

WINDOWS - CRITICAL:
- Scan for ANY windows or natural light
- Note blinds, curtains, or bare glass
- Position on which wall

SPECIAL FEATURES:
- Tall pantry/utility cabinets?
- Wood accent shelving units?
- Open display shelving?
- Decorative niches?

DECORATIVE ITEMS:
- Plants (how many, where)
- Jars, vases, containers
- Cutting boards, utensils
- Fruit bowls
- Pendant/decorative lights

Sample EXACT colors from pixels. Return ONLY valid JSON.`,
            },
            {
              type: 'image_url',
              image_url: { url: image_url, detail: 'high' },
            },
          ],
        },
      ],
          max_tokens: 3500,
          temperature: 0.1,
          response_format: { type: 'json_object' },
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
          console.warn('[Scene Analysis] No response, using defaults');
          return NextResponse.json(getDefaultScene());
        }

        let analysis: SceneAnalysis;
        try {
          const parsed = JSON.parse(content);
          analysis = parsed as SceneAnalysis;

          // User chose layout: override and force runs to match
          if (forcedLayout) {
            analysis.room.layout = forcedLayout;
            const wantWalls = forcedLayout === 'U-shaped' ? ['back', 'left', 'right'] : forcedLayout === 'L-shaped' ? ['back', 'left'] : ['back'];
            const existing = analysis.cabinets?.runs ?? [];
            const hasWall = (w: string) => existing.some((r: { wall: string }) => r.wall === w);
            if (forcedLayout === 'U-shaped' && (!hasWall('left') || !hasWall('right'))) {
              const template = existing[0];
              const run = (wall: 'back' | 'left' | 'right') => ({
                wall,
                startX: template?.startX ?? 0,
                lengthFeet: template?.lengthFeet ?? 4,
                hasUpperCabinets: template?.hasUpperCabinets ?? true,
                baseCabinetCount: template?.baseCabinetCount ?? 2,
                upperCabinetCount: template?.upperCabinetCount ?? 2,
              });
              if (!hasWall('back')) analysis.cabinets.runs.unshift(run('back'));
              if (!hasWall('left')) analysis.cabinets.runs.push(run('left'));
              if (!hasWall('right')) analysis.cabinets.runs.push(run('right'));
            } else if (forcedLayout === 'L-shaped' && existing.length > 2) {
              analysis.cabinets.runs = existing.slice(0, 2);
            } else if (forcedLayout === 'single-wall' && existing.length > 1) {
              analysis.cabinets.runs = existing.filter((r: { wall: string }) => r.wall === 'back').slice(0, 1);
              if (analysis.cabinets.runs.length === 0 && existing[0]) analysis.cabinets.runs = [{ ...existing[0], wall: 'back' as const }];
            }
          }

          // Sync cabinet runs to the chosen layout (trust visual: U vs L)
          if (analysis.cabinets?.runs && analysis.room?.layout && !forcedLayout) {
            const layout = analysis.room.layout;
            const runs = analysis.cabinets.runs;
            const walls = runs.map((r: { wall: string }) => r.wall);
            if (layout === 'U-shaped' && walls.length < 3) {
              const need = ['back', 'left', 'right'].filter(w => !walls.includes(w));
              const template = runs[0];
              need.forEach(w => {
                runs.push({
                  wall: w as 'back' | 'left' | 'right',
                  startX: template?.startX ?? 0,
                  lengthFeet: template?.lengthFeet ?? 4,
                  hasUpperCabinets: template?.hasUpperCabinets ?? true,
                  baseCabinetCount: template?.baseCabinetCount ?? 2,
                  upperCabinetCount: template?.upperCabinetCount ?? 2,
                });
              });
              console.log('[Scene Analysis] Added runs to match U-shaped:', need);
            } else if (layout === 'L-shaped' && walls.length > 2) {
              analysis.cabinets.runs = runs.slice(0, 2);
              console.log('[Scene Analysis] Trimmed runs to match L-shaped');
            }
          }

          console.log('[Scene Analysis] Complete:', analysis.description);
          console.log('[Scene Analysis] Layout:', analysis.room.layout);
          console.log('[Scene Analysis] Cabinet Walls:', analysis.cabinets.runs?.map(r => r.wall).join(', ') || 'none');
          console.log('[Scene Analysis] Cabinet Style:', analysis.cabinets.style);
          console.log('[Scene Analysis] Cabinet Color:', analysis.cabinets.color);
          console.log('[Scene Analysis] Upper Color:', analysis.cabinets.upperColor);
          console.log('[Scene Analysis] Two-Tone:', analysis.cabinets.isTwoTone);
          console.log('[Scene Analysis] Island Present:', analysis.island.present);
          console.log('[Scene Analysis] Oven:', analysis.appliances?.oven);
          console.log('[Scene Analysis] Windows:', analysis.windows?.length ?? 0);
        } catch {
          console.warn('[Scene Analysis] Parse failed, using defaults');
          return NextResponse.json(getDefaultScene());
        }

        return NextResponse.json(analysis);
        
      } catch (retryError) {
        lastError = retryError as Error;
        console.warn(`[Scene Analysis] Attempt ${attempt + 1} failed:`, (retryError as Error).message);
        if (attempt < maxRetries) {
          console.log(`[Scene Analysis] Retrying in 2 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
    
    console.error('[Scene Analysis] All retries failed:', lastError);
    return NextResponse.json(getDefaultScene());
    
  } catch (err) {
    console.error('[Scene Analysis] Error:', err);
    return NextResponse.json(getDefaultScene());
  }
}
