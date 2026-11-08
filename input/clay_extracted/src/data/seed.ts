import {
  Customer,
  DeliveryMethodId,
  Order,
  OrderLine,
  OrderStatus,
  PaymentMethodId,
  SizeCode,
  ToneName,
} from '../types';
import { DELIVERY_OPTIONS, PRODUCTS, SIZES, SIZE_TABLE } from './catalog';

const EASE_ALLOWANCE = 14;

export function recommendSize(
  heightCm: number,
  weightKg: number,
  fitPreferenceOffset: number
): { size: SizeCode; chest: number; garment: number } {
  const chest = 0.3 * heightCm + 0.55 * weightKg + 5;
  const targetChest = chest + EASE_ALLOWANCE;
  let idx = SIZE_TABLE.findIndex(([, garmentChest]) => garmentChest >= targetChest - 2);
  if (idx < 0) idx = SIZES.length - 1;
  const lengthIdx = SIZE_TABLE.findIndex(([, , garmentLen]) => garmentLen >= heightCm * 0.39);
  if (lengthIdx > 0) idx = Math.max(idx, lengthIdx - 1);
  idx = Math.min(SIZES.length - 1, Math.max(0, idx + fitPreferenceOffset));
  return {
    size: SIZES[idx],
    chest: Math.round(chest),
    garment: SIZE_TABLE[idx][1],
  };
}

export const ANCHOR_TIME = new Date('2026-11-01T18:30:00+06:00').getTime();
export const DAY_MS = 864e5;

function createSeededRandom(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 1831565813) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = createSeededRandom(220);
const pick = <T,>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];
const bellRandom = (): number => (rng() + rng() + rng() + rng() - 2) / 2;

const FIRST_NAMES =
  'Nabila.Rafi.Sumaiya.Imran.Tasnia.Fahim.Maliha.Arif.Tahsin.Nusrat.Sadia.Ayaan.Rumana.Zarif.Mehnaz.Tanvir.Farhana.Shafin.Anika.Rakib.Lamia.Sabbir.Orin.Nafis.Ishrat.Junaid.Prova.Siam.Tasfia.Hasan.Raisa.Mahir.Afsana.Ehsan.Nadia.Rezwan'.split(
    '.'
  );

const LAST_NAMES = [
  'Sultana',
  'Ahmed',
  'Tabassum',
  'Khan',
  'Rahman',
  'Hossain',
  'Karim',
  'Haque',
  'Chowdhury',
  'Islam',
  'Siddiqui',
  'Akter',
  'Kabir',
  'Mahmud',
  'Nahar',
  'Alam',
];

const DISTRICTS = [
  'Dhaka',
  'Dhaka',
  'Dhaka',
  'Dhaka',
  'Chattogram',
  'Chattogram',
  'Sylhet',
  'Gazipur',
  'Narayanganj',
  'Khulna',
  'Rajshahi',
  'Cox’s Bazar',
  'Cumilla',
  'Mymensingh',
];

export const SEED_CUSTOMERS: Customer[] = FIRST_NAMES.map((first, idx) => {
  const last = LAST_NAMES[(idx * 7) % LAST_NAMES.length];
  return {
    id: `c${idx + 1}`,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@${pick([
      'gmail.com',
      'yahoo.com',
      'outlook.com',
      'proton.me',
    ])}`,
    phone: `01${pick(['3', '5', '7', '8', '9'])}${String(Math.floor(rng() * 1e8)).padStart(8, '0')}`,
    district: DISTRICTS[idx % DISTRICTS.length],
    since: ANCHOR_TIME - Math.floor(30 + rng() * 600) * DAY_MS,
    tier: 'new',
    tone: idx % 4,
  };
});

export const ORDER_COLUMNS: Array<{ id: OrderStatus; label: string; tone: ToneName }> = [
  { id: 'new', label: 'New', tone: 'sky' },
  { id: 'packing', label: 'Packing', tone: 'coral' },
  { id: 'shipped', label: 'Shipped', tone: 'teal' },
  { id: 'delivered', label: 'Delivered', tone: 'navy' },
];

const WEIGHTED_SIZES: SizeCode[] = ['XS', 'S', 'S', 'M', 'M', 'M', 'L', 'L', 'L', 'XL', 'XL', 'XXL'];
const WEIGHTED_SLUGS = PRODUCTS.flatMap((p) =>
  Array(Math.max(1, Math.round(p.reviews / 40))).fill(p.slug)
);

function generateSeededOrder(index: number, timestamp: number): Order {
  const customer = SEED_CUSTOMERS[Math.floor(rng() * SEED_CUSTOMERS.length)];
  const lines: OrderLine[] = [];
  const itemCount = rng() < 0.62 ? 1 : rng() < 0.75 ? 2 : 3;

  for (let i = 0; i < itemCount; i++) {
    const slug = pick(WEIGHTED_SLUGS);
    const product = PRODUCTS.find((p) => p.slug === slug)!;
    let size = pick(WEIGHTED_SIZES);
    if (product.stock[size] === 0) size = 'M';
    const existing = lines.find((l) => l.slug === slug && l.size === size);
    if (existing) {
      existing.qty++;
    } else {
      lines.push({ slug, size, qty: 1, price: product.price });
    }
  }

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const delivery: DeliveryMethodId =
    customer.district === 'Dhaka' ? (rng() < 0.18 ? 'express' : 'dhaka') : 'outside';
  const promo = rng() < 0.22 ? (rng() < 0.7 ? 'RAYE10' : 'SALTAIR') : null;
  const discount = promo === 'RAYE10' ? Math.round(subtotal * 0.1) : 0;
  const deliveryFee = DELIVERY_OPTIONS.find((d) => d.id === delivery)!.fee;
  const shipping =
    promo === 'SALTAIR' || (delivery !== 'express' && subtotal >= 3000) ? 0 : deliveryFee;
  const ageDays = (ANCHOR_TIME - timestamp) / DAY_MS;
  const status: OrderStatus =
    ageDays < 0.9
      ? 'new'
      : ageDays < 2
        ? 'packing'
        : ageDays < 4.5
          ? 'shipped'
          : rng() < 0.06
            ? 'returned'
            : 'delivered';

  return {
    id: `RY-${(48211 + index * 37) % 1e6}`,
    t: timestamp,
    customer: customer.id,
    lines,
    subtotal,
    discount,
    shipping,
    total: subtotal - discount + shipping,
    delivery,
    payment: pick<PaymentMethodId>(['cod', 'cod', 'cod', 'bkash', 'bkash', 'nagad', 'card']),
    promo,
    status,
  };
}

export const SEED_ORDERS: Order[] = (() => {
  const list: Order[] = [];
  let t = ANCHOR_TIME - 15e5;
  for (let n = 0; n < 78; n++) {
    list.push(generateSeededOrder(78 - n, t));
    t -= (n < 8 ? 1.4 : 5.5 + rng() * 4) * 36e5;
  }
  return list;
})();

for (const cust of SEED_CUSTOMERS) {
  const spent = SEED_ORDERS.filter((o) => o.customer === cust.id && o.status !== 'returned').reduce(
    (sum, o) => sum + o.total,
    0
  );
  cust.tier = spent > 16000 ? 'vip' : spent > 6000 ? 'regular' : 'new';
}

export const MONTH_LABELS = [
  'Nov',
  'Dec',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
];

export const MONTHLY_SALES = [
  0.58, 0.66, 0.52, 0.61, 0.84, 1.08, 1.26, 1.32, 1.18, 1.04, 0.9, 0.96,
].map((mult, idx) => Math.round((560000 * mult * (1 + idx * 0.025) + bellRandom() * 22000) / 10) * 10);

// Advance RNG identically to the target site bundle
MONTHLY_SALES.map((val) => Math.round(val / (2950 + rng() * 300)));

export const MONTHLY_TARGET = 650000;

export const CUT_SHARE = {
  short: 0.54,
  long: 0.28,
  oversized: 0.18,
};

export const FIT_SESSIONS = Array.from({ length: 420 }, () => {
  const tallerGroup = rng() < 0.62;
  const h = Math.round(
    Math.min(198, Math.max(150, (tallerGroup ? 172 : 160) + bellRandom() * 14))
  );
  const w = Math.round(
    Math.min(
      116,
      Math.max(46, (tallerGroup ? 72 : 58) + (h - (tallerGroup ? 172 : 160)) * 0.55 + bellRandom() * 14)
    )
  );
  return {
    h,
    w,
    size: recommendSize(h, w, rng() < 0.7 ? 0 : rng() < 0.5 ? -1 : 1).size,
    added: rng() < 0.41,
  };
});

export const RETURN_RATES = {
  with: 0.047,
  without: 0.118,
};

export const RETURN_REASONS: Array<[string, number]> = [
  ['Too big', 0.41],
  ['Too small', 0.29],
  ['Colour not as pictured', 0.14],
  ['Changed my mind', 0.11],
  ['Arrived damaged', 0.05],
];

export const WEEKLY_FINDER_SESSIONS = [182, 204, 231, 226, 248, 271, 263, 289, 312, 305, 334, 352];

export const INITIAL_PROMO_USES: Record<string, number> = {
  RAYE10: 318,
  SALTAIR: 142,
};

export const ACTIVE_DROP = {
  slug: 'rust',
  batch: 60,
};

export const NOTIFICATIONS = [
  {
    id: 'n1',
    icon: 'alert',
    title: 'Rust Bengal is nearly gone',
    body: 'Size S has 3 left and XXL is sold out.',
    t: ANCHOR_TIME - 24e5,
    href: '#/products?q=rust',
  },
  {
    id: 'n2',
    icon: 'return',
    title: 'Return requested',
    body: 'A Clay Stripe in L is coming back from Sylhet.',
    t: ANCHOR_TIME - 108e5,
    href: '#/orders',
  },
  {
    id: 'n3',
    icon: 'tag',
    title: 'RAYE10 passed 300 uses',
    body: 'Your first-order code is your best performer.',
    t: ANCHOR_TIME - 936e5,
    href: '#/promos',
  },
];
