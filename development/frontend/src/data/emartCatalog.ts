export interface EmartProduct {
  id: string;
  slug: string;
  name: string;
  category: 'Electronics' | 'Gadgets' | 'Room Decor' | 'Toys' | 'Fashion';
  subCategory: string;
  price: number;
  originalPrice: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQty: number;
  images: string[];
  badge?: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  colors?: string[];
  sizes?: string[];
  isFlashDeal?: boolean;
  dealEndsAt?: string;
  soldCount?: number;
  totalDealStock?: number;
}

export interface EmartCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  imageUrl: string;
  itemCount: number;
}

export const EMART_CATEGORIES: EmartCategory[] = [
  {
    id: 'cat-toys',
    name: 'Toys',
    slug: 'toys',
    icon: 'Gamepad2',
    imageUrl: '/assets/images/cat_icon_toys.jpg',
    itemCount: 48,
  },
  {
    id: 'cat-electronics',
    name: 'Electronics',
    slug: 'electronics',
    icon: 'Monitor',
    imageUrl: '/assets/images/cat_icon_electronics.jpg',
    itemCount: 124,
  },
  {
    id: 'cat-room-decor',
    name: 'Room Decor',
    slug: 'room-decor',
    icon: 'Lamp',
    imageUrl: '/assets/images/cat_icon_decor.jpg',
    itemCount: 62,
  },
  {
    id: 'cat-fashion',
    name: 'Fashion',
    slug: 'fashion',
    icon: 'Shirt',
    imageUrl: '/assets/images/cat_icon_fashion.jpg',
    itemCount: 95,
  },
  {
    id: 'cat-gadget',
    name: 'Gadget',
    slug: 'gadget',
    icon: 'Smartphone',
    imageUrl: '/assets/images/cat_icon_gadget.jpg',
    itemCount: 88,
  },
];

export const EMART_PRODUCTS: EmartProduct[] = [
  {
    id: '6a7fda9dee093f7586171ded',
    slug: 'hp-vision-pro-s24e-ips-monitor',
    name: 'HP Vision Pro S24e 23.8" 100Hz FHD IPS Monitor',
    category: 'Electronics',
    subCategory: 'Monitors',
    price: 1450,
    originalPrice: 1610,
    discountPercent: 10,
    rating: 4.8,
    reviewCount: 42,
    inStock: true,
    stockQty: 24,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000',
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=1000',
    ],
    badge: '10% OFF',
    description:
      'Experience razor-sharp clarity and fluid motion with the HP Vision Pro S24e. Featuring an edge-to-edge 23.8-inch IPS panel, 100Hz refresh rate, 99% sRGB color gamut, and TÜV-certified Low Blue Light eye protection for productive work and gaming sessions.',
    features: [
      '23.8" Full HD (1920 x 1080) IPS micro-edge display',
      'Smooth 100Hz refresh rate with AMD FreeSync support',
      '99% sRGB color accuracy with anti-glare finish',
      'HDMI 1.4 & VGA inputs with tilt-adjustable ergonomic stand',
    ],
    specs: {
      Display: '23.8" FHD IPS (1920x1080)',
      'Refresh Rate': '100Hz',
      'Response Time': '5ms GtG',
      Brightness: '300 nits',
      Connectivity: 'HDMI 1.4, VGA, Audio Out',
      Warranty: '3 Years Official',
    },
    isFlashDeal: true,
    dealEndsAt: '2026-11-20T23:59:59Z',
    soldCount: 38,
    totalDealStock: 50,
  },
  {
    id: '6a7fd6d2bccb4a58519900b4',
    slug: 'amd-ryzen-3-2200g-processor',
    name: 'AMD Ryzen 3 2200G Quad-Core Processor With Radeon Vega 8 Graphics',
    category: 'Electronics',
    subCategory: 'Laptops',
    price: 4300,
    originalPrice: 4830,
    discountPercent: 11,
    rating: 4.9,
    reviewCount: 88,
    inStock: true,
    stockQty: 18,
    images: [
      'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1000',
      'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=1000',
    ],
    badge: '11% OFF',
    description:
      'High-performance quad-core desktop processor built on Zen architecture with powerful built-in Radeon Vega 8 graphics. Delivers seamless esports gaming, ultra-crisp 4K HDR playback, and rapid application responsiveness without requiring an expensive discrete graphics card.',
    features: [
      '4 CPU cores / 4 threads running up to 3.7 GHz Max Boost',
      'Integrated Radeon Vega 8 Graphics with 8 GPU cores',
      'Unlocked for overclocking with precision boost technology',
      'AM4 socket compatible with Wraith Stealth cooler included',
    ],
    specs: {
      Cores: '4 Cores / 4 Threads',
      'Base Clock': '3.5 GHz',
      'Max Boost': '3.7 GHz',
      TDP: '65W',
      Socket: 'AM4',
      Graphics: 'Radeon Vega 8 (1100 MHz)',
    },
    isFlashDeal: true,
    dealEndsAt: '2026-11-20T23:59:59Z',
    soldCount: 45,
    totalDealStock: 60,
  },
  {
    id: '6a7fd3f9bccb4a58519900b0',
    slug: 'omron-digital-blood-pressure-monitor',
    name: 'Omron HEM-7121J Digital Blood Pressure Monitor',
    category: 'Gadgets',
    subCategory: 'Audio',
    price: 3750,
    originalPrice: 4165,
    discountPercent: 10,
    rating: 4.7,
    reviewCount: 31,
    inStock: true,
    stockQty: 35,
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1000',
      'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=1000',
    ],
    badge: '10% OFF',
    description:
      'Clinical-grade precision blood pressure monitoring for home wellness. Features Intellisense technology for comfortable, personalized cuff inflation, hypertension indicator alerts, body movement sensor, and 30-reading memory tracking.',
    features: [
      'Intellisense automatic cuff pressure personalization',
      'Cuff wrapping guide indicator for zero-error measurement',
      'Irregular heartbeat & hypertension detection alert',
      'One-touch operation with high-contrast LCD display',
    ],
    specs: {
      Measurement: 'Oscillometric method',
      Pressure: '0 to 299 mmHg',
      Pulse: '40 to 180 beats/min',
      Memory: 'Last 30 readings',
      Power: '4 x AA batteries or AC adapter',
      Warranty: '5 Years Manufacturer',
    },
  },
  {
    id: '6a7c0f6b787707ac4652df91',
    slug: 'macbook-pro-m3-max',
    name: 'MacBook Pro M3 Max 16" Liquid Retina XDR',
    category: 'Electronics',
    subCategory: 'Smartphones',
    price: 350000,
    originalPrice: 385000,
    discountPercent: 9,
    rating: 5.0,
    reviewCount: 112,
    inStock: true,
    stockQty: 8,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1000',
    ],
    badge: 'Pro Choice',
    description:
      'The ultimate pro laptop powered by Apple M3 Max silicon. With a 16-core CPU, 40-core GPU, up to 128GB unified memory, breathtaking 16.2-inch Liquid Retina XDR display with ProMotion 120Hz, and up to 22 hours of battery life.',
    features: [
      'Apple M3 Max chip with 16-core CPU and 40-core GPU',
      '16.2" Liquid Retina XDR (3456 x 2234) at 1600 nits peak brightness',
      'Hardware-accelerated ray tracing and mesh shading',
      'Three Thunderbolt 4 ports, HDMI, SDXC card slot, MagSafe 3',
    ],
    specs: {
      Chip: 'Apple M3 Max (16-core CPU, 40-core GPU)',
      Memory: '48GB Unified RAM',
      Storage: '1TB Superfast NVMe SSD',
      Display: '16.2" Liquid Retina XDR (120Hz ProMotion)',
      Battery: 'Up to 22 hours',
      Color: 'Space Black / Silver',
    },
  },
  {
    id: '6a7c0f6b787707ac4652df8e',
    slug: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max 256GB Natural Titanium',
    category: 'Gadgets',
    subCategory: 'Smartphones',
    price: 145000,
    originalPrice: 155000,
    discountPercent: 6,
    rating: 4.9,
    reviewCount: 204,
    inStock: true,
    stockQty: 15,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1000',
    ],
    badge: 'Top Seller',
    description:
      'Forged in aerospace-grade titanium with the breakthrough A17 Pro chip. Features a customizable Action button, the most versatile iPhone camera system ever with 5x optical telephoto, and USB-C with USB 3 speeds.',
    features: [
      'Aerospace-grade titanium frame with textured matte-glass back',
      'A17 Pro industry-first 3nm chip with console-grade gaming',
      '48MP Main camera with 24MP super-high-resolution default and 5x Telephoto',
      'All-day battery life with USB-C connector supporting USB 3',
    ],
    specs: {
      Display: '6.7" Super Retina XDR OLED (120Hz Always-On)',
      Chip: 'A17 Pro (6-core CPU, 6-core GPU, Neural Engine)',
      Camera: '48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto',
      Storage: '256GB NVMe',
      Protection: 'Ceramic Shield front, IP68 water resistance',
    },
  },
  {
    id: '6a7c0f6b787707ac4652df90',
    slug: 'sony-wh-1000xm5-headphones',
    name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    category: 'Gadgets',
    subCategory: 'Smartphones',
    price: 42000,
    originalPrice: 47000,
    discountPercent: 11,
    rating: 4.9,
    reviewCount: 95,
    inStock: true,
    stockQty: 22,
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000',
    ],
    badge: 'Award Winner',
    description:
      'Industry-leading noise cancelation optimized automatically by Sony’s Integrated Processor V1 and HD Noise Canceling Processor QN1. Precision voice pickup technology with 4 beamforming microphones and up to 30-hour battery life.',
    features: [
      'Two processors control 8 microphones for unparalleled noise cancelation',
      'Specially developed 30mm carbon fiber driver unit for pure sound',
      'Crystal-clear hands-free calling with AI noise reduction algorithms',
      'Multipoint connection to switch seamlessly between phone and laptop',
    ],
    specs: {
      Driver: '30mm Neodymium',
      Battery: '30 hours (ANC On) / 40 hours (ANC Off)',
      Charging: '3 min quick charge for 3 hours playback',
      Bluetooth: 'v5.2 with LDAC, AAC, SBC',
      Weight: '250 grams',
    },
  },
  {
    id: 'emart-fashion-hayfa-ellis',
    slug: 'hayfa-ellis-summer-collection',
    name: 'Hayfa Ellis Linen Resort Maxi Dress',
    category: 'Fashion',
    subCategory: 'Dresses',
    price: 8900,
    originalPrice: 10500,
    discountPercent: 15,
    rating: 4.8,
    reviewCount: 57,
    inStock: true,
    stockQty: 14,
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000',
    ],
    badge: 'New Season',
    description:
      'Crafted from 100% sustainable European organic linen. Designed with an elegant relaxed silhouette, tiered flowing hemline, breathable weave, and subtle earth-toned styling for timeless summer elegance.',
    features: [
      '100% certified pure organic flax linen',
      'Breathable, moisture-wicking and ultra-lightweight',
      'Delicate adjustable shoulder ties and side slip pockets',
      'Pre-washed for signature soft feel and zero shrinkage',
    ],
    specs: {
      Material: '100% Organic Linen (180 GSM)',
      Fit: 'Relaxed A-Line Maxi',
      Origin: 'Atelier Handcrafted',
      Care: 'Gentle Machine Wash Cold',
    },
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'emart-fashion-raye-linen',
    slug: 'raye-french-linen-striped-overshirt',
    name: 'Raye French Linen Overshirt — Ink Stripe Edition',
    category: 'Fashion',
    subCategory: 'Shirts',
    price: 2490,
    originalPrice: 2850,
    discountPercent: 12,
    rating: 4.9,
    reviewCount: 79,
    inStock: true,
    stockQty: 26,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000',
    ],
    badge: 'Atelier Drop 03',
    description:
      'Signature Raye Striped-Shirt handcrafted from 100% Normandy flax linen. Features camp collar, real mother-of-pearl buttons, double breast pocket, and a boxy relaxed drape engineered specifically for warm humid climates.',
    features: [
      'Normandy long-staple flax (210 GSM luxury weight)',
      'Subtle alternating micro-stripe woven in Dhaka atelier',
      'Natural shell buttons with lock-stitch reinforcement',
      'Includes complimentary atelier garment dust bag',
    ],
    specs: {
      Fabric: '100% French Flax Linen',
      Weight: '210 GSM',
      Collar: 'Camp / Relaxed Cuban',
      Care: 'Hand wash cold or gentle cycle',
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'emart-room-decor-ambient-lamp',
    slug: 'nordic-ambient-smart-desk-lamp',
    name: 'Nordic Minimalist Halo Desk Lamp with Wireless Charging',
    category: 'Room Decor',
    subCategory: 'Lighting',
    price: 3200,
    originalPrice: 3800,
    discountPercent: 15,
    rating: 4.7,
    reviewCount: 63,
    inStock: true,
    stockQty: 30,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1000',
    ],
    badge: 'Editor Pick',
    description:
      'Seamlessly combine architectural ambient lighting and desktop convenience. Features a satin anodized aluminum circular halo, touch-dimmable warm-to-cool LED temperature slider, and a fast 15W Qi wireless phone charger in the base.',
    features: [
      'Continuously dimmable from 2700K warm sunrise to 6500K daylight',
      'Flicker-free eye comfort certified LED chips with CRI 95+',
      'Integrated 15W Qi wireless charging pad in weighted base',
      'Memory function recalls your last preferred brightness preset',
    ],
    specs: {
      Power: '24W Total (9W LED + 15W Qi Charger)',
      ColorTemp: '2700K - 6500K',
      Lumens: '850 lm',
      Material: 'Aircraft-grade Sandblasted Aluminum',
      Dimensions: '28cm x 28cm x 34cm',
    },
  },
  {
    id: 'emart-toys-cyber-mech',
    slug: 'mecha-strike-diecast-action-figure',
    name: 'Mecha-01 Cyber Samurai Collector Diecast Figure',
    category: 'Toys',
    subCategory: 'Action Figures',
    price: 1850,
    originalPrice: 2200,
    discountPercent: 16,
    rating: 4.9,
    reviewCount: 48,
    inStock: true,
    stockQty: 19,
    images: [
      'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1000',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000',
    ],
    badge: 'Limited Edition',
    description:
      'A masterpiece for sci-fi collectors and mechanical enthusiasts. Boasts 54 points of articulation, diecast zinc alloy internal skeleton, LED illuminated optic eyes, and twin energy katana accessories with magnetic sheath.',
    features: [
      'Diecast zinc skeleton with high-grade ABS external armor plates',
      '54 fully articulated joints with ratchet knee and elbow locks',
      'Built-in LED head sensor with magnetic induction on/off switch',
      'Includes heavy assault rifle, twin katanas, and collector stand',
    ],
    specs: {
      Height: '26 cm (1/10 Scale)',
      Weight: '780 grams (Diecast core)',
      Articulation: '54 Points',
      Battery: '2 x LR41 included',
    },
  },
  {
    id: 'emart-gadgets-smartwatch-ultra',
    slug: 'titan-pro-rugged-outdoor-smartwatch',
    name: 'Titan Pro GPS Rugged Military Smartwatch',
    category: 'Gadgets',
    subCategory: 'Smartphones',
    price: 6800,
    originalPrice: 7900,
    discountPercent: 14,
    rating: 4.8,
    reviewCount: 74,
    inStock: true,
    stockQty: 25,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1000',
    ],
    badge: 'Outdoor Ready',
    description:
      'Engineered to conquer the elements. MIL-STD-810H certified with 10 ATM water resistance, dual-frequency GPS route tracking, sapphire crystal glass, offline topographic maps, and up to 21 days of continuous battery life.',
    features: [
      'Dual-frequency GNSS positioning with 5 satellite constellations',
      '1.43" AMOLED 1000 nits sunlight-readable sapphire touch display',
      'Advanced biometric monitoring: SpO2, Heart Rate, HRV, Sleep stages',
      'Titanium bezel with breathable fluoroelastomer quick-release strap',
    ],
    specs: {
      Display: '1.43" AMOLED (466x466, 1000 nits)',
      Waterproof: '10 ATM (100 meters)',
      Battery: 'Up to 21 days normal / 48 hrs full GPS',
      Sensors: 'Optical Heart Rate, Barometer, Compass, SpO2',
    },
  },
  {
    id: 'emart-electronics-keychron-q1',
    slug: 'keychron-q1-pro-wireless-custom-keyboard',
    name: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
    category: 'Electronics',
    subCategory: 'Audio',
    price: 8400,
    originalPrice: 9500,
    discountPercent: 12,
    rating: 4.9,
    reviewCount: 118,
    inStock: true,
    stockQty: 12,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1000',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000',
    ],
    badge: 'Mechanical Beast',
    description:
      'A full metal QMK/VIA wireless custom mechanical keyboard. Equipped with double-gasket design, CNC machined 6063 aluminum body, hot-swappable switches, south-facing RGB, and Mac/Windows physical switch layout.',
    features: [
      'Double-gasket acoustic design with sound absorbing foam layers',
      'CNC machined anodized aluminum body weighing 1.8 kg for zero desk flex',
      'Bluetooth 5.1 wireless connection to 3 devices + Type-C wired',
      'Full QMK/VIA key remapping support on Mac, Windows & Linux',
    ],
    specs: {
      Layout: '75% Layout (81 Keys)',
      Switches: 'K Pro Red / Brown / Banana Hot-swappable',
      Connectivity: 'Bluetooth 5.1 & USB Type-C',
      Battery: '4000 mAh (Up to 300 hrs typing)',
    },
  },
];
