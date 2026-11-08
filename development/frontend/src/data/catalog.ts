import {
  AssetFolderId,
  AssetItem,
  DeliveryMethodId,
  ImageRef,
  PaymentMethodId,
  Product,
  ProductCategory,
  PromoConfig,
  SizeCode,
} from '../types';

export const PHOTO_BASE_PATH = '/raye/photos/220-raye/';

export const makeImage = (file: string, n: number, w = 1200, h = 1600): ImageRef => ({
  src: PHOTO_BASE_PATH + file,
  w,
  h,
  n,
});

export const SIZES: SizeCode[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const CATEGORIES: Record<ProductCategory, string> = {
  short: 'Short sleeve',
  long: 'Long sleeve',
  oversized: 'Oversized',
};

const parseStock = (csv: string): Record<SizeCode, number> =>
  Object.fromEntries(csv.split(',').map((val, idx) => [SIZES[idx], Number(val)])) as Record<
    SizeCode,
    number
  >;

const makeShirtPair = (slug: string, imgN: number, modelN: number) => ({
  img: makeImage(`shirt-${slug}.jpg`, imgN),
  model: makeImage(`shirt-${slug}-model.jpg`, modelN),
});

export const EDITORIAL_ASSETS = {
  hero: makeImage('hero.jpg', 1, 1600, 1600),
  flex: makeImage('flex.jpg', 8),
  weekend: makeImage('mood-weekend.jpg', 9, 1200, 1200),
  studio: makeImage('mood-studio.jpg', 10, 900, 1200),
  dockside: makeImage('mood-dockside.jpg', 11, 900, 1200),
  feel: makeImage('feel.jpg', 12, 1600, 900),
  hands: makeImage('journal-weave.jpg', 39, 1600, 1200),
  loom: makeImage('about-loom.jpg', 36, 1600, 900),
  team: makeImage('about-team.jpg', 37, 1600, 1200),
  journalHeat: makeImage('journal-heat.jpg', 38, 1600, 1200),
  journalFive: makeImage('journal-five.jpg', 40, 1600, 1200),
  avatar1: makeImage('avatar-1.jpg', 13, 240, 240),
  avatar2: makeImage('avatar-2.jpg', 14, 240, 240),
  avatar3: makeImage('avatar-3.jpg', 15, 240, 240),
};

export const PRODUCTS: Product[] = [
  {
    slug: 'sunday',
    name: 'Sunday Stripe',
    cat: 'short',
    price: 2890,
    rating: 4.6,
    reviews: 214,
    tag: 'Popular',
    family: 'Coral',
    added: 9,
    colours: [
      { name: 'Coral / Cream', hex: '#ff6b4a' },
      { name: 'Teal / Cream', hex: '#0e4f4b' },
    ],
    stock: parseStock('4,9,14,11,6,0'),
    ...makeShirtPair('sunday', 2, 18),
    blurb:
      'Our signature camp-collar shirt in wide coral-and-cream stripes. Boxy, breezy, made for long lunches.',
    details: ['Camp collar', 'Relaxed boxy fit', 'Straight hem, wear it out', 'Real shell buttons'],
    fabric: '55% linen, 45% cotton · 140 GSM · yarn-dyed',
  },
  {
    slug: 'lido',
    name: 'Lido Stripe',
    cat: 'short',
    price: 2890,
    rating: 4.9,
    reviews: 168,
    tag: 'New',
    family: 'Teal',
    added: 12,
    colours: [
      { name: 'Teal / White', hex: '#0e4f4b' },
      { name: 'Coral / White', hex: '#ff6b4a' },
    ],
    stock: parseStock('2,6,10,8,5,3'),
    img: makeImage('shirt-lido.jpg', 17),
    model: makeImage('shirt-lido-model.jpg', 3),
    blurb:
      'Candy stripes in deep teal, cut short in the sleeve and easy everywhere else. Throw it open over a tee.',
    details: ['Camp collar', 'Relaxed fit', 'Side vents', 'Real shell buttons'],
    fabric: '55% linen, 45% cotton · 140 GSM · yarn-dyed',
  },
  {
    slug: 'harbour',
    name: 'Harbour Stripe',
    cat: 'long',
    price: 2690,
    rating: 4.5,
    reviews: 97,
    family: 'Blue',
    added: 6,
    colours: [
      { name: 'Navy / White', hex: '#1f2f4f' },
      { name: 'Sky / White', hex: '#9fc3e0' },
    ],
    stock: parseStock('3,8,12,10,6,2'),
    ...makeShirtPair('harbour', 4, 19),
    blurb:
      'A fine navy pinstripe that goes to the office and stays out after. Roll the sleeves once and you’re done.',
    details: ['Button-down collar', 'Regular fit', 'Curved hem', 'Single chest pocket'],
    fabric: '100% cotton poplin · 120 GSM · yarn-dyed',
  },
  {
    slug: 'clay',
    name: 'Clay Stripe',
    cat: 'long',
    price: 2690,
    rating: 4.3,
    reviews: 64,
    tag: 'New',
    family: 'Earth',
    added: 11,
    colours: [{ name: 'Terracotta / Sand', hex: '#b8553a' }],
    stock: parseStock('0,4,7,9,5,2'),
    ...makeShirtPair('clay', 5, 20),
    blurb:
      'Terracotta and sand, the colours of a sun-baked roof. Relaxed through the body with one useful pocket.',
    details: ['Point collar', 'Relaxed fit', 'Chest pocket', 'Dropped shoulder'],
    fabric: '60% linen, 40% cotton · 150 GSM · yarn-dyed',
  },
  {
    slug: 'butter',
    name: 'Butter Stripe',
    cat: 'short',
    price: 2590,
    rating: 4.7,
    reviews: 131,
    family: 'Yellow',
    added: 7,
    colours: [{ name: 'Butter / Cream', hex: '#ffd66b' }],
    stock: parseStock('5,10,13,12,7,4'),
    ...makeShirtPair('butter', 6, 21),
    blurb:
      'Soft butter-yellow candy stripes that look like a good mood. The easiest shirt in the drawer.',
    details: ['Camp collar', 'Relaxed boxy fit', 'Straight hem', 'Real shell buttons'],
    fabric: '55% linen, 45% cotton · 140 GSM · yarn-dyed',
  },
  {
    slug: 'ink',
    name: 'Ink Stripe',
    cat: 'oversized',
    price: 2790,
    rating: 4.8,
    reviews: 88,
    family: 'Mono',
    added: 8,
    colours: [{ name: 'Charcoal / Ecru', hex: '#2a2724' }],
    stock: parseStock('3,6,9,8,4,2'),
    ...makeShirtPair('ink', 7, 22),
    blurb:
      'Charcoal bengal stripes on an oversized body. Wear it as a shirt, a jacket, or a beach cover-up.',
    details: ['Point collar', 'Oversized fit', 'Chest pocket', 'Long back hem'],
    fabric: '100% cotton · 160 GSM · yarn-dyed',
  },
  {
    slug: 'marina',
    name: 'Marina Stripe',
    cat: 'short',
    price: 2590,
    was: 2890,
    rating: 4.4,
    reviews: 52,
    tag: 'Sale',
    family: 'Blue',
    added: 4,
    colours: [{ name: 'Sky / White', hex: '#7fb3dd' }],
    stock: parseStock('2,5,6,4,3,1'),
    img: makeImage('shirt-marina.jpg', 23),
    blurb:
      'Wide sky-blue stripes for the days you can smell the sea. Light enough to forget about.',
    details: ['Camp collar', 'Relaxed fit', 'Straight hem', 'Coconut buttons'],
    fabric: '55% linen, 45% cotton · 140 GSM · yarn-dyed',
  },
  {
    slug: 'pistachio',
    name: 'Pistachio Stripe',
    cat: 'long',
    price: 2790,
    rating: 4.6,
    reviews: 41,
    tag: 'New',
    family: 'Green',
    added: 10,
    colours: [{ name: 'Pistachio / Cream', hex: '#a9c79a' }],
    stock: parseStock('3,7,9,8,5,2'),
    ...makeShirtPair('pistachio', 25, 26),
    blurb: 'Pale pistachio stripes on a soft long-sleeve. Cool in the morning, rolled up by noon.',
    details: ['Band collar', 'Regular fit', 'Curved hem', 'Real shell buttons'],
    fabric: '60% linen, 40% cotton · 150 GSM · yarn-dyed',
  },
  {
    slug: 'rust',
    name: 'Rust Bengal',
    cat: 'oversized',
    price: 3190,
    rating: 5,
    reviews: 23,
    tag: 'Limited',
    family: 'Earth',
    added: 13,
    colours: [{ name: 'Rust / Navy', hex: '#b5482a' }],
    stock: parseStock('1,3,4,3,2,0'),
    ...makeShirtPair('rust', 27, 28),
    blurb:
      'Drop 03: rust and navy bengal stripes, woven in one small batch. When it’s gone, it’s gone.',
    details: ['Point collar', 'Oversized fit', 'Two chest pockets', 'Numbered inside label'],
    fabric: '100% cotton · 160 GSM · yarn-dyed',
  },
  {
    slug: 'seafoam',
    name: 'Seafoam Stripe',
    cat: 'short',
    price: 2590,
    rating: 4.5,
    reviews: 76,
    family: 'Teal',
    added: 5,
    colours: [{ name: 'Seafoam / Sand', hex: '#8fcfc0' }],
    stock: parseStock('4,8,11,9,5,3'),
    img: makeImage('shirt-seafoam-model.jpg', 30),
    blurb:
      'Seafoam and sand in a relaxed camp-collar. Pairs with linen trousers and nothing to do.',
    details: ['Camp collar', 'Relaxed fit', 'Side vents', 'Coconut buttons'],
    fabric: '55% linen, 45% cotton · 140 GSM · yarn-dyed',
  },
  {
    slug: 'midnight',
    name: 'Midnight Pinstripe',
    cat: 'long',
    price: 2890,
    rating: 4.7,
    reviews: 58,
    family: 'Mono',
    added: 3,
    colours: [{ name: 'Midnight / Cream', hex: '#1b2230' }],
    stock: parseStock('2,6,8,7,4,2'),
    ...makeShirtPair('midnight', 31, 32),
    blurb:
      'Deep midnight with a whisper of cream pinstripe. The one for dinners and first dates.',
    details: ['Point collar', 'Regular fit', 'Curved hem', 'Mother-of-pearl buttons'],
    fabric: '100% cotton poplin · 120 GSM · yarn-dyed',
  },
  {
    slug: 'tangerine',
    name: 'Tangerine Candy',
    cat: 'oversized',
    price: 2790,
    was: 3090,
    rating: 4.6,
    reviews: 39,
    tag: 'Sale',
    family: 'Coral',
    added: 2,
    colours: [{ name: 'Tangerine / White', hex: '#ff8a3d' }],
    stock: parseStock('2,4,7,6,3,1'),
    img: makeImage('shirt-sunday.jpg', 33),
    model: makeImage('shirt-sunday-model.jpg', 34),
    blurb: 'Tangerine candy stripes, oversized and loud in the best way. Bring sunglasses.',
    details: ['Camp collar', 'Oversized fit', 'Straight hem', 'Real shell buttons'],
    fabric: '55% linen, 45% cotton · 140 GSM · yarn-dyed',
  },
];

export const getProductBySlug = (slug: string): Product =>
  PRODUCTS.find((p) => p.slug === slug) ?? PRODUCTS[0];

export const TOP_BAR_MESSAGES = [
  'Free delivery on orders over ৳3,000',
  'Cash on delivery across Bangladesh',
  'Use RAYE10 for 10% off your first order',
];

export const DROP_CLOSES_AT = new Date('2026-11-21T18:00:00+06:00').getTime();

export const FREE_DELIVERY_THRESHOLD = 3000;

export const DELIVERY_OPTIONS: Array<{
  id: DeliveryMethodId;
  label: string;
  note: string;
  fee: number;
}> = [
  { id: 'dhaka', label: 'Inside Dhaka', note: '1–2 working days', fee: 80 },
  { id: 'outside', label: 'Outside Dhaka', note: '3–5 working days', fee: 150 },
  { id: 'express', label: 'Express, Dhaka', note: 'Next day before 8 pm', fee: 250 },
];

export const PAYMENT_OPTIONS: Array<{
  id: PaymentMethodId;
  label: string;
  note: string;
}> = [
  { id: 'cod', label: 'Cash on delivery', note: 'Pay when it arrives' },
  { id: 'bkash', label: 'bKash', note: 'You’ll get a payment request' },
  { id: 'nagad', label: 'Nagad', note: 'You’ll get a payment request' },
  { id: 'card', label: 'Card', note: 'Visa, Mastercard, Amex' },
];

export const PAYMENT_LABELS: Record<PaymentMethodId, string> = Object.fromEntries(
  PAYMENT_OPTIONS.map((p) => [p.id, p.label])
) as Record<PaymentMethodId, string>;

export const DELIVERY_LABELS: Record<DeliveryMethodId, string> = Object.fromEntries(
  DELIVERY_OPTIONS.map((d) => [d.id, d.label])
) as Record<DeliveryMethodId, string>;

export const DEFAULT_PROMOS: Record<string, PromoConfig> = {
  RAYE10: { kind: 'pct', value: 10, label: '10% off' },
  SALTAIR: { kind: 'ship', value: 0, label: 'Free delivery' },
};

export const SIZE_TABLE: Array<[SizeCode, number, number, number]> = [
  ['XS', 100, 68, 44],
  ['S', 106, 70, 46],
  ['M', 112, 72, 48],
  ['L', 118, 74, 50],
  ['XL', 124, 76, 52],
  ['XXL', 130, 78, 54],
];

export const INITIAL_BASELINE = {
  products: PRODUCTS.map((p) => ({
    slug: p.slug,
    price: p.price,
    stock: { ...p.stock },
  })),
  promos: { ...DEFAULT_PROMOS },
};

export const ASSET_FOLDERS: Array<{
  id: 'all' | AssetFolderId;
  label: string;
  path: string;
  description: string;
}> = [
  {
    id: 'all',
    label: 'All assets',
    path: '/assets/raye/',
    description: 'Complete offline-ready image library across products, lookbook, editorial, and team',
  },
  {
    id: 'products/flatlays',
    label: 'Product flatlays',
    path: '/assets/raye/products/flatlays/',
    description: 'Studio packshots and folded stripe shirt flatlays',
  },
  {
    id: 'products/lookbook',
    label: 'Model lookbook',
    path: '/assets/raye/products/lookbook/',
    description: 'On-model fit and styling photography for product drawers',
  },
  {
    id: 'editorial/mood',
    label: 'Editorial & mood',
    path: '/assets/raye/editorial/mood/',
    description: 'Hero campaign, studio, weekend, and dockside mood boards',
  },
  {
    id: 'editorial/journal',
    label: 'Journal & story',
    path: '/assets/raye/editorial/journal/',
    description: 'Loom weaving, yarn-dyed fabric closeups, and workshop stories',
  },
  {
    id: 'team/avatars',
    label: 'Team & avatars',
    path: '/assets/raye/team/avatars/',
    description: 'Customer & team portraits used in reviews and profiles',
  },
];

// Build organized asset catalog covering every unique image in /public/raye/photos/220-raye/
export const ASSET_LIBRARY: AssetItem[] = [
  // Product flatlays
  ...PRODUCTS.filter((p) => p.slug !== 'tangerine' && p.slug !== 'seafoam').map((p) => {
    const filename = p.img.src.split('/').pop()!;
    return {
      id: `flatlay-${p.slug}`,
      filename,
      title: `${p.name} — Flatlay`,
      folder: 'products/flatlays' as AssetFolderId,
      categoryLabel: 'Product flatlay',
      src: p.img.src,
      w: p.img.w,
      h: p.img.h,
      assetNumber: p.img.n,
      productSlug: p.slug,
      tags: [p.family.toLowerCase(), p.cat, 'flatlay', 'shirt', p.slug],
    };
  }),
  // Model lookbook photos
  ...PRODUCTS.filter((p) => p.slug !== 'tangerine' && (p.model || p.slug === 'seafoam')).map((p) => {
    const ref = p.model ?? p.img;
    const filename = ref.src.split('/').pop()!;
    return {
      id: `lookbook-${p.slug}`,
      filename,
      title: `${p.name} — Model Lookbook`,
      folder: 'products/lookbook' as AssetFolderId,
      categoryLabel: 'Model lookbook',
      src: ref.src,
      w: ref.w,
      h: ref.h,
      assetNumber: ref.n,
      productSlug: p.slug,
      tags: [p.family.toLowerCase(), p.cat, 'model', 'lookbook', p.slug],
    };
  }),
  // Editorial & mood
  {
    id: 'editorial-hero',
    filename: 'hero.jpg',
    title: 'Campaign Hero — Slow Sunny Days',
    folder: 'editorial/mood',
    categoryLabel: 'Editorial mood',
    src: EDITORIAL_ASSETS.hero.src,
    w: EDITORIAL_ASSETS.hero.w,
    h: EDITORIAL_ASSETS.hero.h,
    assetNumber: EDITORIAL_ASSETS.hero.n,
    tags: ['hero', 'campaign', 'editorial'],
  },
  {
    id: 'editorial-flex',
    filename: 'flex.jpg',
    title: 'Linen & Cotton Drape Study',
    folder: 'editorial/mood',
    categoryLabel: 'Editorial mood',
    src: EDITORIAL_ASSETS.flex.src,
    w: EDITORIAL_ASSETS.flex.w,
    h: EDITORIAL_ASSETS.flex.h,
    assetNumber: EDITORIAL_ASSETS.flex.n,
    tags: ['drape', 'fabric', 'editorial'],
  },
  {
    id: 'editorial-weekend',
    filename: 'mood-weekend.jpg',
    title: 'Mood — Weekend Sun',
    folder: 'editorial/mood',
    categoryLabel: 'Editorial mood',
    src: EDITORIAL_ASSETS.weekend.src,
    w: EDITORIAL_ASSETS.weekend.w,
    h: EDITORIAL_ASSETS.weekend.h,
    assetNumber: EDITORIAL_ASSETS.weekend.n,
    tags: ['weekend', 'mood', 'sun'],
  },
  {
    id: 'editorial-studio',
    filename: 'mood-studio.jpg',
    title: 'Mood — Dhaka Studio',
    folder: 'editorial/mood',
    categoryLabel: 'Editorial mood',
    src: EDITORIAL_ASSETS.studio.src,
    w: EDITORIAL_ASSETS.studio.w,
    h: EDITORIAL_ASSETS.studio.h,
    assetNumber: EDITORIAL_ASSETS.studio.n,
    tags: ['studio', 'mood', 'dhaka'],
  },
  {
    id: 'editorial-dockside',
    filename: 'mood-dockside.jpg',
    title: 'Mood — Dockside Breeze',
    folder: 'editorial/mood',
    categoryLabel: 'Editorial mood',
    src: EDITORIAL_ASSETS.dockside.src,
    w: EDITORIAL_ASSETS.dockside.w,
    h: EDITORIAL_ASSETS.dockside.h,
    assetNumber: EDITORIAL_ASSETS.dockside.n,
    tags: ['dockside', 'mood', 'sea'],
  },
  {
    id: 'editorial-feel',
    filename: 'feel.jpg',
    title: '140 GSM Yarn-Dyed Texture',
    folder: 'editorial/mood',
    categoryLabel: 'Editorial mood',
    src: EDITORIAL_ASSETS.feel.src,
    w: EDITORIAL_ASSETS.feel.w,
    h: EDITORIAL_ASSETS.feel.h,
    assetNumber: EDITORIAL_ASSETS.feel.n,
    tags: ['texture', 'linen', 'closeup'],
  },
  // Journal & story
  {
    id: 'journal-loom',
    filename: 'about-loom.jpg',
    title: 'Workshop Loom — Small Batch Weaving',
    folder: 'editorial/journal',
    categoryLabel: 'Journal & story',
    src: EDITORIAL_ASSETS.loom.src,
    w: EDITORIAL_ASSETS.loom.w,
    h: EDITORIAL_ASSETS.loom.h,
    assetNumber: EDITORIAL_ASSETS.loom.n,
    tags: ['loom', 'weaving', 'journal'],
  },
  {
    id: 'journal-team',
    filename: 'about-team.jpg',
    title: 'Atelier Team — Cutting Table',
    folder: 'editorial/journal',
    categoryLabel: 'Journal & story',
    src: EDITORIAL_ASSETS.team.src,
    w: EDITORIAL_ASSETS.team.w,
    h: EDITORIAL_ASSETS.team.h,
    assetNumber: EDITORIAL_ASSETS.team.n,
    tags: ['team', 'atelier', 'journal'],
  },
  {
    id: 'journal-heat',
    filename: 'journal-heat.jpg',
    title: 'Journal — Dressing for Monsoon Heat',
    folder: 'editorial/journal',
    categoryLabel: 'Journal & story',
    src: EDITORIAL_ASSETS.journalHeat.src,
    w: EDITORIAL_ASSETS.journalHeat.w,
    h: EDITORIAL_ASSETS.journalHeat.h,
    assetNumber: EDITORIAL_ASSETS.journalHeat.n,
    tags: ['heat', 'journal', 'linen'],
  },
  {
    id: 'journal-weave',
    filename: 'journal-weave.jpg',
    title: 'Journal — Yarn-Dyed vs Printed Stripes',
    folder: 'editorial/journal',
    categoryLabel: 'Journal & story',
    src: EDITORIAL_ASSETS.hands.src,
    w: EDITORIAL_ASSETS.hands.w,
    h: EDITORIAL_ASSETS.hands.h,
    assetNumber: EDITORIAL_ASSETS.hands.n,
    tags: ['weave', 'yarn', 'journal'],
  },
  {
    id: 'journal-five',
    filename: 'journal-five.jpg',
    title: 'Journal — Five Shirts for the Week',
    folder: 'editorial/journal',
    categoryLabel: 'Journal & story',
    src: EDITORIAL_ASSETS.journalFive.src,
    w: EDITORIAL_ASSETS.journalFive.w,
    h: EDITORIAL_ASSETS.journalFive.h,
    assetNumber: EDITORIAL_ASSETS.journalFive.n,
    tags: ['five', 'rotation', 'journal'],
  },
  // Team & avatars
  {
    id: 'avatar-1',
    filename: 'avatar-1.jpg',
    title: 'Portrait — Rumana Akter',
    folder: 'team/avatars',
    categoryLabel: 'Team & avatar',
    src: EDITORIAL_ASSETS.avatar1.src,
    w: EDITORIAL_ASSETS.avatar1.w,
    h: EDITORIAL_ASSETS.avatar1.h,
    assetNumber: EDITORIAL_ASSETS.avatar1.n,
    tags: ['avatar', 'portrait', 'team'],
  },
  {
    id: 'avatar-2',
    filename: 'avatar-2.jpg',
    title: 'Portrait — Rafi Ahmed',
    folder: 'team/avatars',
    categoryLabel: 'Team & avatar',
    src: EDITORIAL_ASSETS.avatar2.src,
    w: EDITORIAL_ASSETS.avatar2.w,
    h: EDITORIAL_ASSETS.avatar2.h,
    assetNumber: EDITORIAL_ASSETS.avatar2.n,
    tags: ['avatar', 'portrait', 'team'],
  },
  {
    id: 'avatar-3',
    filename: 'avatar-3.jpg',
    title: 'Portrait — Nabila Sultana',
    folder: 'team/avatars',
    categoryLabel: 'Team & avatar',
    src: EDITORIAL_ASSETS.avatar3.src,
    w: EDITORIAL_ASSETS.avatar3.w,
    h: EDITORIAL_ASSETS.avatar3.h,
    assetNumber: EDITORIAL_ASSETS.avatar3.n,
    tags: ['avatar', 'portrait', 'team'],
  },
];
