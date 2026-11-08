import { useSyncExternalStore } from 'react';
import { EMART_PRODUCTS, EmartProduct } from '../data/emartCatalog';

export interface EmartCartItem {
  product: EmartProduct;
  qty: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface EmartOrder {
  id: string;
  placedAt: string;
  items: {
    productId: string;
    name: string;
    price: number;
    qty: number;
    image: string;
    selectedSize?: string;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: 'COD' | 'Card' | 'bKash' | 'Nagad';
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface EmartUserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  memberTier: 'Silver Member' | 'Gold VIP' | 'Platinum Elite';
  addresses: {
    id: string;
    title: string;
    address: string;
    city: string;
    isDefault: boolean;
  }[];
}

export interface EmartState {
  cart: EmartCartItem[];
  wishlist: string[];
  compareList: string[];
  appliedCoupon: string | null;
  discountPercentage: number;
  currency: 'USD' | 'BDT';
  language: 'en' | 'bn';
  searchQuery: string;
  activeCategory: string;
  activeView: 'home' | 'shop' | 'flash-deals' | 'product-detail' | 'user-dashboard';
  selectedProductSlug: string | null;
  quickViewProductId: string | null;
  isCartDrawerOpen: boolean;
  isWishlistModalOpen: boolean;
  isCompareModalOpen: boolean;
  isCheckoutModalOpen: boolean;
  isAuthModalOpen: boolean;
  isCategorySidebarOpen: boolean;
  activeUserTab: 'orders' | 'profile' | 'addresses' | 'wishlist';
  user: EmartUserProfile;
  orders: EmartOrder[];
  toasts: { id: string; message: string; type: 'success' | 'info' | 'warn' }[];
}

const STORAGE_KEY = 'emart:v1_state';

const INITIAL_USER: EmartUserProfile = {
  id: 'usr_882910',
  fullName: 'Tofayel Ahmed',
  email: 'tofayel.ahmed@example.com',
  phone: '+880 1711-234567',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
  memberTier: 'Platinum Elite',
  addresses: [
    {
      id: 'addr_1',
      title: 'Home (Gulshan)',
      address: 'House 42, Road 11, Gulshan-2',
      city: 'Dhaka',
      isDefault: true,
    },
    {
      id: 'addr_2',
      title: 'Work / Studio (Banani)',
      address: 'Level 5, Plot 78, Kemal Ataturk Ave',
      city: 'Dhaka',
      isDefault: false,
    },
  ],
};

const INITIAL_ORDERS: EmartOrder[] = [
  {
    id: 'ORD-2026-9812',
    placedAt: '2026-11-04T10:15:00Z',
    items: [
      {
        productId: '6a7fda9dee093f7586171ded',
        name: 'HP Vision Pro S24e 23.8" 100Hz FHD IPS Monitor',
        price: 1450,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000',
      },
    ],
    subtotal: 1450,
    discount: 145,
    shipping: 0,
    total: 1305,
    status: 'Delivered',
    shippingAddress: {
      fullName: 'Tofayel Ahmed',
      phone: '+880 1711-234567',
      address: 'House 42, Road 11, Gulshan-2',
      city: 'Dhaka',
      zipCode: '1212',
      country: 'Bangladesh',
    },
    paymentMethod: 'bKash',
    trackingNumber: 'TRK-DH-84920',
    estimatedDelivery: 'Delivered on Nov 4, 2026',
  },
  {
    id: 'ORD-2026-9905',
    placedAt: '2026-11-05T08:30:00Z',
    items: [
      {
        productId: '6a7c0f6b787707ac4652df90',
        name: 'Sony WH-1000XM5 Wireless Headphones',
        price: 42000,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000',
      },
    ],
    subtotal: 42000,
    discount: 4200,
    shipping: 0,
    total: 37800,
    status: 'Processing',
    shippingAddress: {
      fullName: 'Tofayel Ahmed',
      phone: '+880 1711-234567',
      address: 'Level 5, Plot 78, Kemal Ataturk Ave',
      city: 'Dhaka',
      zipCode: '1213',
      country: 'Bangladesh',
    },
    paymentMethod: 'Card',
    trackingNumber: 'TRK-DH-91024',
    estimatedDelivery: 'Arriving Nov 07, 2026',
  },
];

function loadSavedState(): Partial<EmartState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore storage errors
  }
  return {};
}

const saved = loadSavedState();

let emartState: EmartState = {
  cart: saved.cart || [
    {
      product: EMART_PRODUCTS[0],
      qty: 1,
    },
  ],
  wishlist: saved.wishlist || [EMART_PRODUCTS[3].id, EMART_PRODUCTS[4].id],
  compareList: saved.compareList || [EMART_PRODUCTS[0].id, EMART_PRODUCTS[1].id],
  appliedCoupon: saved.appliedCoupon || 'EMART10',
  discountPercentage: saved.discountPercentage ?? 10,
  currency: saved.currency || 'USD',
  language: saved.language || 'en',
  searchQuery: '',
  activeCategory: 'All',
  activeView: 'home',
  selectedProductSlug: null,
  quickViewProductId: null,
  isCartDrawerOpen: false,
  isWishlistModalOpen: false,
  isCompareModalOpen: false,
  isCheckoutModalOpen: false,
  isAuthModalOpen: false,
  isCategorySidebarOpen: true,
  activeUserTab: 'orders',
  user: saved.user || INITIAL_USER,
  orders: saved.orders && saved.orders.length > 0 ? saved.orders : INITIAL_ORDERS,
  toasts: [],
};

const listeners = new Set<() => void>();

function notify(): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        cart: emartState.cart,
        wishlist: emartState.wishlist,
        compareList: emartState.compareList,
        appliedCoupon: emartState.appliedCoupon,
        discountPercentage: emartState.discountPercentage,
        currency: emartState.currency,
        language: emartState.language,
        user: emartState.user,
        orders: emartState.orders,
      })
    );
  } catch {
    // Ignore
  }
  for (const cb of listeners) cb();
}

export function mutateEmart(updater: (draft: EmartState) => void): void {
  const next = { ...emartState };
  updater(next);
  emartState = next;
  notify();
}

export function useEmart(): EmartState {
  return useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    () => emartState
  );
}

// ----------------- Actions -----------------

export function emartToast(message: string, type: 'success' | 'info' | 'warn' = 'success'): void {
  const id = 'toast_' + Math.random().toString(36).substring(2, 9);
  mutateEmart((s) => {
    s.toasts = [...s.toasts, { id, message, type }];
  });
  setTimeout(() => {
    mutateEmart((s) => {
      s.toasts = s.toasts.filter((t) => t.id !== id);
    });
  }, 3500);
}

export function addToCart(product: EmartProduct, qty = 1, size?: string, color?: string): void {
  mutateEmart((s) => {
    const existingIndex = s.cart.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === size &&
        item.selectedColor === color
    );
    if (existingIndex > -1) {
      s.cart[existingIndex].qty += qty;
    } else {
      s.cart.push({
        product,
        qty,
        selectedSize: size,
        selectedColor: color,
      });
    }
  });
  emartToast(`Added "${product.name.substring(0, 32)}..." to cart!`, 'success');
}

export function updateCartQty(productId: string, qty: number): void {
  mutateEmart((s) => {
    if (qty <= 0) {
      s.cart = s.cart.filter((i) => i.product.id !== productId);
    } else {
      const item = s.cart.find((i) => i.product.id === productId);
      if (item) item.qty = qty;
    }
  });
}

export function removeFromCart(productId: string): void {
  mutateEmart((s) => {
    s.cart = s.cart.filter((i) => i.product.id !== productId);
  });
  emartToast('Item removed from cart', 'info');
}

export function clearCart(): void {
  mutateEmart((s) => {
    s.cart = [];
  });
}

export function toggleWishlist(productId: string): void {
  mutateEmart((s) => {
    if (s.wishlist.includes(productId)) {
      s.wishlist = s.wishlist.filter((id) => id !== productId);
      emartToast('Removed from wishlist', 'info');
    } else {
      s.wishlist.push(productId);
      emartToast('Saved to wishlist ❤️', 'success');
    }
  });
}

export function toggleCompare(productId: string): void {
  mutateEmart((s) => {
    if (s.compareList.includes(productId)) {
      s.compareList = s.compareList.filter((id) => id !== productId);
      emartToast('Removed from compare list', 'info');
    } else {
      if (s.compareList.length >= 4) {
        emartToast('You can compare maximum 4 products at once', 'warn');
        return;
      }
      s.compareList.push(productId);
      emartToast('Added to compare list ⚖️', 'success');
    }
  });
}

export function applyCoupon(code: string): boolean {
  const clean = code.trim().toUpperCase();
  if (clean === 'EMART10' || clean === 'WELCOME10') {
    mutateEmart((s) => {
      s.appliedCoupon = clean;
      s.discountPercentage = 10;
    });
    emartToast('Coupon applied: 10% Discount activated! 🎉', 'success');
    return true;
  } else if (clean === 'SUPER20' || clean === 'VIP20') {
    mutateEmart((s) => {
      s.appliedCoupon = clean;
      s.discountPercentage = 20;
    });
    emartToast('Super Coupon applied: 20% Off! 🚀', 'success');
    return true;
  }
  emartToast('Invalid coupon code. Try EMART10', 'warn');
  return false;
}

export function removeCoupon(): void {
  mutateEmart((s) => {
    s.appliedCoupon = null;
    s.discountPercentage = 0;
  });
}

export function setCurrency(currency: 'USD' | 'BDT'): void {
  mutateEmart((s) => {
    s.currency = currency;
  });
  emartToast(`Currency switched to ${currency}`, 'info');
}

export function setLanguage(lang: 'en' | 'bn'): void {
  mutateEmart((s) => {
    s.language = lang;
  });
}

export function setActiveView(
  view: 'home' | 'shop' | 'flash-deals' | 'product-detail' | 'user-dashboard',
  param?: string
): void {
  mutateEmart((s) => {
    s.activeView = view;
    try {
      if (view === 'home') {
        window.location.hash = '#/';
      } else if (view === 'shop') {
        if (param) s.activeCategory = param;
        const catSlug = param && param !== 'All' ? param.toLowerCase().replace(/\s+/g, '-') : '';
        window.location.hash = catSlug ? `#/shop/${catSlug}` : '#/shop';
      } else if (view === 'flash-deals') {
        window.location.hash = '#/flash-deals';
      } else if (view === 'product-detail') {
        if (param) s.selectedProductSlug = param;
        window.location.hash = param ? `#/product/${param}` : '#/shop';
      } else if (view === 'user-dashboard') {
        const tab = (param as any) || s.activeUserTab || 'profile';
        s.activeUserTab = tab;
        window.location.hash = `#/user-dashboard/${tab}`;
      }
    } catch {
      // Ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

export function openQuickView(productId: string | null): void {
  mutateEmart((s) => {
    s.quickViewProductId = productId;
  });
}

export function toggleCartDrawer(isOpen?: boolean): void {
  mutateEmart((s) => {
    s.isCartDrawerOpen = isOpen !== undefined ? isOpen : !s.isCartDrawerOpen;
  });
}

export function toggleWishlistModal(isOpen?: boolean): void {
  mutateEmart((s) => {
    s.isWishlistModalOpen = isOpen !== undefined ? isOpen : !s.isWishlistModalOpen;
  });
}

export function toggleCompareModal(isOpen?: boolean): void {
  mutateEmart((s) => {
    s.isCompareModalOpen = isOpen !== undefined ? isOpen : !s.isCompareModalOpen;
  });
}

export function toggleCategorySidebar(isOpen?: boolean): void {
  mutateEmart((s) => {
    s.isCategorySidebarOpen = isOpen !== undefined ? isOpen : !s.isCategorySidebarOpen;
  });
}

export function toggleCheckoutModal(isOpen?: boolean): void {
  mutateEmart((s) => {
    s.isCheckoutModalOpen = isOpen !== undefined ? isOpen : !s.isCheckoutModalOpen;
  });
}

export function toggleAuthModal(isOpen?: boolean): void {
  mutateEmart((s) => {
    s.isAuthModalOpen = isOpen !== undefined ? isOpen : !s.isAuthModalOpen;
  });
}

export function setActiveUserTab(tab: 'orders' | 'profile' | 'addresses' | 'wishlist'): void {
  mutateEmart((s) => {
    s.activeUserTab = tab;
    s.activeView = 'user-dashboard';
    try {
      window.location.hash = `#/user-dashboard/${tab}`;
    } catch {
      // Ignore
    }
  });
}

// ----------------- Checkout & Order Placement -----------------

export interface PlaceOrderPayload {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  paymentMethod: 'COD' | 'Card' | 'bKash' | 'Nagad';
}

export function placeOrder(payload: PlaceOrderPayload): EmartOrder {
  const subtotal = emartState.cart.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );
  const discount = Math.round((subtotal * emartState.discountPercentage) / 100);
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 150;
  const total = Math.max(0, subtotal - discount + shipping);

  const orderId =
    'ORD-' +
    new Date().getFullYear() +
    '-' +
    Math.floor(1000 + Math.random() * 9000);

  const newOrder: EmartOrder = {
    id: orderId,
    placedAt: new Date().toISOString(),
    items: emartState.cart.map((i) => ({
      productId: i.product.id,
      name: i.product.name,
      price: i.product.price,
      qty: i.qty,
      image: i.product.images[0],
      selectedSize: i.selectedSize,
    })),
    subtotal,
    discount,
    shipping,
    total,
    status: 'Pending',
    shippingAddress: {
      fullName: payload.fullName,
      phone: payload.phone,
      address: payload.address,
      city: payload.city,
      zipCode: payload.zipCode,
      country: 'Bangladesh',
    },
    paymentMethod: payload.paymentMethod,
    trackingNumber: 'TRK-BD-' + Math.floor(100000 + Math.random() * 900000),
    estimatedDelivery: 'Expected in 2-4 Business Days',
  };

  // Sync to adminStore format in localStorage so Admin Orders Kanban gets it!
  try {
    const rawRaye = localStorage.getItem('raye:v1');
    const rayeData = rawRaye ? JSON.parse(rawRaye) : { shopOrders: [] };
    if (!Array.isArray(rayeData.shopOrders)) rayeData.shopOrders = [];
    rayeData.shopOrders.unshift({
      id: orderId,
      isoDate: newOrder.placedAt,
      status: 'new',
      totalBDT: total,
      itemsSummary: newOrder.items
        .map((i) => `${i.name} (x${i.qty})`)
        .join(', '),
      customer: {
        name: payload.fullName,
        phone: payload.phone,
        district: payload.city,
        address: payload.address,
      },
    });
    localStorage.setItem('raye:v1', JSON.stringify(rayeData));
  } catch {
    // Ignore
  }

  mutateEmart((s) => {
    s.orders = [newOrder, ...s.orders];
    s.cart = [];
    s.isCheckoutModalOpen = false;
    s.activeView = 'user-dashboard';
    s.activeUserTab = 'orders';
  });

  emartToast(`🎉 Order ${orderId} placed successfully!`, 'success');
  return newOrder;
}

// ----------------- Price Helper -----------------

export function formatPrice(amountUSD: number, currency: 'USD' | 'BDT'): string {
  if (currency === 'BDT') {
    const bdt = Math.round(amountUSD * 110);
    return '৳' + bdt.toLocaleString('en-US');
  }
  return '$' + amountUSD.toLocaleString('en-US');
}
