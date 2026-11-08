import { useSyncExternalStore } from 'react';
import { PRODUCTS, getProductBySlug } from '../data/catalog';
import {
  CartItem,
  CheckoutPayload,
  DeliveryMethodId,
  PaymentMethodId,
  SizeCode,
} from '../types';
import { adminState, getProductStock, pushToast } from './adminStore';

export const SHOP_STORAGE_KEY = 'raye:v1';

export interface ShopStoreState {
  cart: CartItem[];
  promoCode: string | null;
  promoDiscount: number; // percentage (e.g. 10) or -1 for free shipping
  deliveryMethod: DeliveryMethodId;
  cartOpen: boolean;
  checkoutOpen: boolean;
  activeOrderModal: string | null; // order ID being tracked
  selectedProductSlug: string | null;
}

const DEFAULT_STATE: ShopStoreState = {
  cart: [],
  promoCode: null,
  promoDiscount: 0,
  deliveryMethod: 'dhaka',
  cartOpen: false,
  checkoutOpen: false,
  activeOrderModal: null,
  selectedProductSlug: null,
};

function loadShopState(): ShopStoreState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem('raye:cart:v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_STATE, cart: parsed.cart || [] };
    }
  } catch {
    // Ignore error
  }
  return DEFAULT_STATE;
}

let shopState: ShopStoreState = loadShopState();
let shopVersion = 0;
const shopListeners = new Set<() => void>();

function mutateShopState(mutator: (draft: ShopStoreState) => void): void {
  mutator(shopState);
  shopVersion++;
  try {
    localStorage.setItem(
      'raye:cart:v1',
      JSON.stringify({ cart: shopState.cart })
    );
  } catch {
    // Ignore quota errors
  }
  shopListeners.forEach((fn) => fn());
}

export function useShopStore(): ShopStoreState {
  useSyncExternalStore(
    (cb) => {
      shopListeners.add(cb);
      return () => shopListeners.delete(cb);
    },
    () => shopVersion
  );
  return shopState;
}

export function toggleCart(open?: boolean): void {
  mutateShopState((s) => {
    s.cartOpen = open !== undefined ? open : !s.cartOpen;
  });
}

export function toggleCheckout(open?: boolean): void {
  mutateShopState((s) => {
    s.checkoutOpen = open !== undefined ? open : !s.checkoutOpen;
    if (s.checkoutOpen) s.cartOpen = false;
  });
}

export function openOrderTracking(orderId: string | null): void {
  mutateShopState((s) => {
    s.activeOrderModal = orderId;
  });
}

export function openProductDetail(slug: string | null): void {
  mutateShopState((s) => {
    s.selectedProductSlug = slug;
  });
}

export function addToCart(slug: string, size: SizeCode, qty = 1): void {
  const product = getProductBySlug(slug);
  if (!product) return;

  const availableStock = getProductStock(slug)[size] || 0;
  if (availableStock <= 0) {
    pushToast(`Size ${size} for ${product.name} is currently sold out!`);
    return;
  }

  mutateShopState((s) => {
    const existing = s.cart.find((i) => i.slug === slug && i.size === size);
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, availableStock);
    } else {
      s.cart.push({
        slug: product.slug,
        name: product.name,
        cat: product.cat,
        price: product.price,
        size,
        qty: Math.min(qty, availableStock),
        img: product.img.src,
      });
    }
    s.cartOpen = true;
  });

  pushToast(`Added ${product.name} (${size}) to bag`);
}

export function updateCartQty(slug: string, size: SizeCode, delta: number): void {
  mutateShopState((s) => {
    const idx = s.cart.findIndex((i) => i.slug === slug && i.size === size);
    if (idx === -1) return;

    const item = s.cart[idx];
    const newQty = item.qty + delta;
    if (newQty <= 0) {
      s.cart.splice(idx, 1);
    } else {
      item.qty = newQty;
    }
  });
}

export function removeFromCart(slug: string, size: SizeCode): void {
  mutateShopState((s) => {
    s.cart = s.cart.filter((i) => !(i.slug === slug && i.size === size));
  });
}

export function clearCart(): void {
  mutateShopState((s) => {
    s.cart = [];
    s.promoCode = null;
    s.promoDiscount = 0;
  });
}

export function applyPromoCode(code: string): { success: boolean; message: string } {
  const clean = code.trim().toUpperCase();
  if (clean === 'RAYE10') {
    mutateShopState((s) => {
      s.promoCode = clean;
      s.promoDiscount = 10;
    });
    return { success: true, message: 'Promo code RAYE10 applied: 10% discount!' };
  }
  if (clean === 'SALTAIR') {
    mutateShopState((s) => {
      s.promoCode = clean;
      s.promoDiscount = -1; // -1 denotes free delivery
    });
    return { success: true, message: 'Promo code SALTAIR applied: Free delivery!' };
  }
  return { success: false, message: 'Invalid promo code. Try RAYE10 or SALTAIR' };
}

export function removePromoCode(): void {
  mutateShopState((s) => {
    s.promoCode = null;
    s.promoDiscount = 0;
  });
}

export function setDeliveryMethod(method: DeliveryMethodId): void {
  mutateShopState((s) => {
    s.deliveryMethod = method;
  });
}

export function calculateCartTotals(
  cart: CartItem[],
  promoDiscount: number,
  deliveryMethod: DeliveryMethodId
) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  let discount = 0;
  if (promoDiscount > 0) {
    discount = Math.round((subtotal * promoDiscount) / 100);
  }

  // Delivery fee
  let shipping = 0;
  if (subtotal > 0) {
    if (subtotal >= 3000 || promoDiscount === -1) {
      shipping = 0;
    } else {
      if (deliveryMethod === 'dhaka') shipping = 80;
      else if (deliveryMethod === 'outside') shipping = 150;
      else if (deliveryMethod === 'express') shipping = 250;
    }
  }

  const total = Math.max(0, subtotal - discount + shipping);

  return { subtotal, discount, shipping, total };
}

export function placeOrder(payload: CheckoutPayload): {
  success: boolean;
  orderId: string;
} {
  const orderId = `RY-${Math.floor(10000 + Math.random() * 90000)}`;
  const now = Date.now();

  const totals = calculateCartTotals(
    shopState.cart,
    shopState.promoDiscount,
    payload.deliveryMethod
  );

  const newOrder = {
    id: orderId,
    t: now,
    name: payload.customer.name,
    email: payload.customer.email || 'customer@example.com',
    phone: payload.customer.phone,
    district: payload.customer.district,
    address: payload.customer.address,
    lines: payload.lines,
    subtotal: totals.subtotal,
    discount: totals.discount,
    shipping: totals.shipping,
    total: totals.total,
    delivery: payload.deliveryMethod,
    payment: payload.paymentMethod,
    promo: payload.promoCode || null,
    status: 'new',
  };

  // 1. Save to raye:v1 in localStorage (read by getShopOrders in adminStore)
  try {
    const raw = localStorage.getItem(SHOP_STORAGE_KEY) || '{}';
    const parsed = JSON.parse(raw);
    const existingOrders = parsed.orders || [];
    parsed.orders = [newOrder, ...existingOrders];
    localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // Ignore
  }

  // 2. Decrement stock in adminState for every purchased line
  if (!adminState.stock) adminState.stock = {};
  for (const line of payload.lines) {
    const currentStock = getProductStock(line.slug)[line.size] ?? 0;
    const updatedStock = Math.max(0, currentStock - line.qty);
    if (!adminState.stock[line.slug]) {
      adminState.stock[line.slug] = { ...getProductStock(line.slug) };
    }
    adminState.stock[line.slug][line.size] = updatedStock;
  }

  // 3. Clear cart and open confirmation
  clearCart();
  toggleCheckout(false);
  openOrderTracking(orderId);

  pushToast(`Order ${orderId} placed successfully!`);

  return { success: true, orderId };
}
