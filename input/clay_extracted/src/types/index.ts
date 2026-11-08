export type SizeCode = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type ProductCategory = 'short' | 'long' | 'oversized';

export type OrderStatus = 'new' | 'packing' | 'shipped' | 'delivered' | 'returned';

export type PaymentMethodId = 'cod' | 'bkash' | 'nagad' | 'card';

export type DeliveryMethodId = 'dhaka' | 'outside' | 'express';

export type CustomerTier = 'vip' | 'regular' | 'new';

export type ToneName = 'sky' | 'coral' | 'teal' | 'navy' | 'sand' | 'sea' | 'ink' | 'plain';

export interface ImageRef {
  src: string;
  w: number;
  h: number;
  n: number;
}

export interface ProductColour {
  name: string;
  hex: string;
}

export interface Product {
  slug: string;
  name: string;
  cat: ProductCategory;
  price: number;
  was?: number;
  rating: number;
  reviews: number;
  tag?: 'Popular' | 'New' | 'Sale' | 'Limited';
  family: string;
  added: number;
  colours: ProductColour[];
  stock: Record<SizeCode, number>;
  img: ImageRef;
  model?: ImageRef;
  blurb: string;
  details: string[];
  fabric: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  district: string;
  since: number;
  tier: CustomerTier;
  tone: number;
}

export interface CustomerWithStats extends Customer {
  count: number;
  spent: number;
  last: number;
}

export interface OrderLine {
  slug: string;
  size: SizeCode;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  t: number;
  customer: string;
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  delivery: DeliveryMethodId;
  payment: PaymentMethodId;
  promo: string | null;
  status: OrderStatus;
  fromShop?: boolean;
}

export interface PromoConfig {
  kind: 'pct' | 'ship';
  value: number;
  label: string;
  active?: boolean;
}

export interface PromoItem extends PromoConfig {
  code: string;
  active: boolean;
  uses: number;
  custom: boolean;
}

export interface AdminSettings {
  storeName: string;
  email: string;
  phone: string;
  lowStock: number;
  cod: boolean;
  bkash: boolean;
  nagad: boolean;
  card: boolean;
  notifyOrders: boolean;
  notifyStock: boolean;
  notifyReturns: boolean;
}

export type PageId =
  | 'overview'
  | 'orders'
  | 'products'
  | 'customers'
  | 'fit'
  | 'promos'
  | 'assets'
  | 'settings';

export type AssetFolderId =
  | 'products/flatlays'
  | 'products/lookbook'
  | 'editorial/mood'
  | 'editorial/journal'
  | 'team/avatars';

export interface AssetItem {
  id: string;
  filename: string;
  title: string;
  folder: AssetFolderId;
  categoryLabel: string;
  src: string;
  w: number;
  h: number;
  assetNumber: number;
  productSlug?: string;
  tags: string[];
}
