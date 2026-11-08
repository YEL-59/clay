import { useSyncExternalStore } from 'react';
import {
  DEFAULT_PROMOS,
  INITIAL_BASELINE,
  PRODUCTS,
  SIZES,
  getProductBySlug,
} from '../data/catalog';
import { ACTIVE_DROP, INITIAL_PROMO_USES, SEED_CUSTOMERS, SEED_ORDERS } from '../data/seed';
import {
  AdminSettings,
  Customer,
  Order,
  OrderStatus,
  PageId,
  PromoConfig,
  PromoItem,
  SizeCode,
} from '../types';

export const STORAGE_KEY = 'raye:admin:v1';

export const ALL_PAGES: PageId[] = [
  'shop',
  'overview',
  'orders',
  'products',
  'manufacturer',
  'stores',
  'hr',
  'customers',
  'fit',
  'promos',
  'assets',
  'settings',
];

export const MAIN_TABS: Array<{ id: PageId; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'orders', label: 'Orders' },
  { id: 'products', label: 'Products' },
  { id: 'manufacturer', label: 'Manufacturer' },
  { id: 'stores', label: 'Store Staff' },
  { id: 'hr', label: 'CV Checker' },
  { id: 'customers', label: 'Customers' },
  { id: 'fit', label: 'Fit' },
  { id: 'promos', label: 'Promos' },
  { id: 'assets', label: 'Assets' },
];

export const PAGE_TITLES: Record<PageId, string> = {
  shop: 'Raye Striped-Shirt — Dhaka Atelier Shop',
  overview: 'Overview',
  orders: 'Orders',
  products: 'Products',
  manufacturer: 'Manufacturer & Production Portal',
  stores: 'Store Managers & Sales Roster',
  hr: 'HR & Candidate CV Checker',
  customers: 'Customers',
  fit: 'Fit insights',
  promos: 'Promotions',
  assets: 'Assets & Offline',
  settings: 'Settings',
};

export interface RouteState {
  page: PageId;
  params: string[];
  query: URLSearchParams;
}

function parseHash(): RouteState {
  const raw = typeof window !== 'undefined' ? window.location.hash : '';
  const [pathPart = '', queryPart = ''] = raw.replace(/^#\/?/, '').split('?');
  const segments = pathPart.split('/').filter(Boolean).map(decodeURIComponent);
  const first = segments[0] as PageId | undefined;

  // Default to 'overview' for admin dashboard, or fallback to requested valid page
  let targetPage: PageId = 'overview';
  if (first && ALL_PAGES.includes(first)) {
    targetPage = first;
  } else if (!first) {
    targetPage = 'overview';
  }

  return {
    page: targetPage,
    params: segments.slice(1),
    query: new URLSearchParams(queryPart),
  };
}

let currentRoute: RouteState = parseHash();
const routeListeners = new Set<() => void>();

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    currentRoute = parseHash();
    routeListeners.forEach((fn) => fn());
  });
}

export const useRoute = (): RouteState =>
  useSyncExternalStore(
    (cb) => {
      routeListeners.add(cb);
      return () => routeListeners.delete(cb);
    },
    () => currentRoute
  );

export const navigate = (target: string): void => {
  window.location.hash = `#/${target.replace(/^[#/]+/, '')}`;
};

const DEFAULT_SETTINGS: AdminSettings = {
  storeName: 'Shifatdevs',
  email: 'hello@raye.example',
  phone: '01700 000 220',
  lowStock: 3,
  cod: true,
  bkash: true,
  nagad: true,
  card: true,
  notifyOrders: true,
  notifyStock: true,
  notifyReturns: false,
};

export const isRecordMode =
  typeof window !== 'undefined' && /[?&]record\b/.test(window.location.search);

export interface AdminStoreState {
  status: Record<string, OrderStatus>;
  notes: Record<string, string[]>;
  stock?: Record<string, Record<SizeCode, number>>;
  price?: Record<string, number>;
  promos?: Record<string, PromoConfig>;
  promoUses: Record<string, number>;
  promoAdded: string[];
  settings: AdminSettings;
  theme: 'light' | 'dark';
  read: string[];
  assetFavorites?: string[];
  assetNotes?: Record<string, string>;
}

function createInitialState(): AdminStoreState {
  return {
    status: {},
    notes: {},
    promoUses: { ...INITIAL_PROMO_USES },
    promoAdded: [],
    settings: { ...DEFAULT_SETTINGS },
    theme: 'light',
    read: [],
    assetFavorites: [],
    assetNotes: {},
  };
}

function loadState(): AdminStoreState {
  if (isRecordMode || typeof window === 'undefined') return createInitialState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...createInitialState(), ...JSON.parse(raw) } : createInitialState();
  } catch {
    return createInitialState();
  }
}

export const adminState: AdminStoreState = loadState();
let stateVersion = 0;
const stateListeners = new Set<() => void>();

// Sync initial persisted overrides onto PRODUCTS
try {
  for (const p of PRODUCTS) {
    if (adminState.stock?.[p.slug]) {
      Object.assign(p.stock, adminState.stock[p.slug]);
    }
    if (adminState.price?.[p.slug]) {
      p.price = adminState.price[p.slug];
    }
  }
} catch {
  // Ignore
}

function mutateAdminState(mutator: (draft: AdminStoreState) => void): void {
  mutator(adminState);
  stateVersion++;
  if (!isRecordMode) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(adminState));
    } catch {
      // Ignore quota errors
    }
  }
  stateListeners.forEach((fn) => fn());
}

export function useAdminStore(): AdminStoreState {
  useSyncExternalStore(
    (cb) => {
      stateListeners.add(cb);
      return () => stateListeners.delete(cb);
    },
    () => stateVersion
  );
  return adminState;
}

function getShopOrders(): any[] {
  if (isRecordMode || typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('raye:v1') || '{}').orders ?? [];
  } catch {
    return [];
  }
}

export function getCustomers(): Customer[] {
  const shopCustomers: Customer[] = getShopOrders()
    .filter((o) => !SEED_CUSTOMERS.some((c) => c.email === o.email))
    .map((o, idx) => ({
      id: `s-${o.email}`,
      name: o.name,
      email: o.email,
      phone: o.phone,
      district: o.district,
      since: o.t,
      tier: 'new',
      tone: idx % 4,
    }));

  return [
    ...shopCustomers.filter((c, i) => shopCustomers.findIndex((x) => x.id === c.id) === i),
    ...SEED_CUSTOMERS,
  ];
}

export function getOrders(): Order[] {
  const shopOrders: Order[] = getShopOrders().map((o) => ({
    id: o.id,
    t: o.t,
    customer: SEED_CUSTOMERS.find((c) => c.email === o.email)?.id ?? `s-${o.email}`,
    lines: o.lines.map((l: any) => ({
      slug: l.slug,
      size: l.size,
      qty: l.qty,
      price: l.price,
    })),
    subtotal: o.subtotal,
    discount: o.discount,
    shipping: o.shipping,
    total: o.total,
    delivery: o.delivery,
    payment: o.payment,
    promo: o.promo,
    status: 'new',
    fromShop: true,
  }));

  return [...shopOrders, ...SEED_ORDERS]
    .map((o) => ({
      ...o,
      status: adminState.status[o.id] ?? o.status,
    }))
    .sort((a, b) => b.t - a.t);
}

export const getCustomerById = (id: string): Customer | undefined =>
  getCustomers().find((c) => c.id === id);

export const getProductStock = (slug: string): Record<SizeCode, number> =>
  adminState.stock?.[slug] ?? INITIAL_BASELINE.products.find((p) => p.slug === slug)!.stock;

export const getProductPrice = (slug: string): number =>
  adminState.price?.[slug] ?? INITIAL_BASELINE.products.find((p) => p.slug === slug)!.price;

export const getTotalProductStock = (slug: string): number =>
  SIZES.reduce((sum, sz) => sum + getProductStock(slug)[sz], 0);

function applyStockDelta(
  draft: AdminStoreState,
  slug: string,
  size: SizeCode,
  delta: number
): void {
  const next = { ...getProductStock(slug) };
  next[size] = Math.max(0, next[size] + delta);
  draft.stock = { ...draft.stock, [slug]: next };
  Object.assign(getProductBySlug(slug).stock, next);
}

export function setOrderStatus(orderId: string, nextStatus: OrderStatus): void {
  const order = getOrders().find((o) => o.id === orderId);
  if (!order || order.status === nextStatus) return;
  mutateAdminState((draft) => {
    draft.status[orderId] = nextStatus;
    if (nextStatus === 'returned') {
      for (const line of order.lines) {
        applyStockDelta(draft, line.slug, line.size, line.qty);
      }
    }
  });
}

export function addNote(entityId: string, note: string): void {
  mutateAdminState((draft) => {
    draft.notes[entityId] = [...(draft.notes[entityId] ?? []), note];
  });
}

export function setSizeStock(slug: string, size: SizeCode, count: number): void {
  mutateAdminState((draft) => {
    const clamped = Math.max(0, Math.min(999, count));
    applyStockDelta(draft, slug, size, clamped - getProductStock(slug)[size]);
  });
}

export function restockAllSizes(slug: string, deltaEach: number): void {
  mutateAdminState((draft) => {
    for (const sz of SIZES) {
      applyStockDelta(draft, slug, sz, deltaEach);
    }
  });
}

export function setProductPrice(slug: string, rawPrice: number): void {
  const rounded = Math.max(100, Math.round(rawPrice / 10) * 10);
  mutateAdminState((draft) => {
    draft.price = { ...draft.price, [slug]: rounded };
    getProductBySlug(slug).price = rounded;
  });
}

export const getLowStockSizes = (slug: string): SizeCode[] =>
  SIZES.filter(
    (sz) => getProductStock(slug)[sz] > 0 && getProductStock(slug)[sz] <= adminState.settings.lowStock
  );

export const getOutOfStockSizes = (slug: string): SizeCode[] =>
  SIZES.filter((sz) => getProductStock(slug)[sz] === 0);

export function getPromos(): PromoItem[] {
  return [...Object.keys(INITIAL_BASELINE.promos), ...adminState.promoAdded].map((code) => {
    const customOverride = adminState.promos?.[code];
    const base = INITIAL_BASELINE.promos[code];
    return {
      code,
      kind: customOverride?.kind ?? base.kind,
      value: customOverride?.value ?? base.value,
      label: customOverride?.label ?? base.label,
      active: customOverride?.active ?? true,
      uses: adminState.promoUses[code] ?? 0,
      custom: !base,
    };
  });
}

export function savePromo(code: string, config: PromoConfig): void {
  mutateAdminState((draft) => {
    draft.promos = { ...draft.promos, [code]: config };
    if (!INITIAL_BASELINE.promos[code] && !draft.promoAdded.includes(code)) {
      draft.promoAdded = [...draft.promoAdded, code];
    }
    if (config.active) {
      DEFAULT_PROMOS[code] = { kind: config.kind, value: config.value, label: config.label };
    } else {
      delete DEFAULT_PROMOS[code];
    }
  });
}

export function deletePromo(code: string): void {
  mutateAdminState((draft) => {
    draft.promoAdded = draft.promoAdded.filter((c) => c !== code);
    const { [code]: _, ...rest } = draft.promos ?? {};
    draft.promos = rest;
    delete DEFAULT_PROMOS[code];
  });
}

export const updateSettings = (patch: Partial<AdminSettings>): void =>
  mutateAdminState((draft) => {
    draft.settings = { ...draft.settings, ...patch };
  });

export const setTheme = (theme: 'light' | 'dark'): void =>
  mutateAdminState((draft) => {
    draft.theme = theme;
  });

export const markNotificationsRead = (ids: string[]): void =>
  mutateAdminState((draft) => {
    draft.read = [...new Set([...draft.read, ...ids])];
  });

export const toggleAssetFavorite = (assetId: string): void =>
  mutateAdminState((draft) => {
    const favs = draft.assetFavorites ?? [];
    draft.assetFavorites = favs.includes(assetId)
      ? favs.filter((id) => id !== assetId)
      : [...favs, assetId];
  });

export function resetDemoData(): void {
  mutateAdminState((draft) => {
    Object.assign(draft, createInitialState(), { theme: draft.theme });
  });
  for (const base of INITIAL_BASELINE.products) {
    const prod = getProductBySlug(base.slug);
    prod.price = base.price;
    Object.assign(prod.stock, base.stock);
  }
  for (const key of Object.keys(DEFAULT_PROMOS)) {
    delete DEFAULT_PROMOS[key];
  }
  Object.assign(DEFAULT_PROMOS, INITIAL_BASELINE.promos);
}

export function getDropSoldCount(): number {
  const baseProd = INITIAL_BASELINE.products.find((p) => p.slug === ACTIVE_DROP.slug);
  const currentTotal = baseProd
    ? Object.values(getProductStock(ACTIVE_DROP.slug)).reduce((a, b) => a + b, 0)
    : ACTIVE_DROP.batch;
  return Math.min(ACTIVE_DROP.batch, Math.max(0, ACTIVE_DROP.batch - currentTotal));
}

// Toast store
export interface ToastMessage {
  id: number;
  text: string;
}

let toasts: ToastMessage[] = [];
let toastVersion = 0;
let toastSeq = 0;
const toastListeners = new Set<() => void>();

export function pushToast(text: string): void {
  const id = ++toastSeq;
  toasts = [...toasts.slice(-2), { id, text }];
  toastVersion++;
  toastListeners.forEach((fn) => fn());
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    toastVersion++;
    toastListeners.forEach((fn) => fn());
  }, 3200);
}

export function useToasts(): ToastMessage[] {
  useSyncExternalStore(
    (cb) => {
      toastListeners.add(cb);
      return () => toastListeners.delete(cb);
    },
    () => toastVersion
  );
  return toasts;
}
