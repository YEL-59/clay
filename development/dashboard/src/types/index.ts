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
  | 'manufacturer'
  | 'stores'
  | 'hr'
  | 'fit'
  | 'promos'
  | 'assets'
  | 'settings'
  | 'shop';

export type ProductionStage = 'Cutting' | 'Sewing' | 'Ironing' | 'QC Audit' | 'Packaging' | 'Dispatched';

export interface ProductionBatch {
  id: string;
  styleName: string;
  category: ProductCategory;
  targetUnits: number;
  stage: ProductionStage;
  progress: number;
  startDate: string;
  estimatedCompletion: string;
  factory: string;
  leadMaster: string;
  colorway: string;
  assignedFabric: string;
  notes?: string;
}

export interface RawMaterialSupplier {
  id: string;
  name: string;
  category: 'Fabric Mill' | 'Buttons & Trims' | 'Dyeing & Finishing' | 'Packaging & Labels';
  materialSupplied: string;
  leadTimeDays: number;
  contactPerson: string;
  phone: string;
  email: string;
  location: string;
  rating: number;
  moq: string;
  unitPriceBdt: number;
}

export type POStatus = 'Draft' | 'Issued' | 'In Production' | 'Inspected' | 'Completed';

export interface PurchaseOrderItem {
  description: string;
  qty: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  supplierCategory: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: POStatus;
  issuedDate: string;
  deliveryDueDate: string;
  paymentStatus: 'Paid' | 'Advance 50%' | 'Pending';
  remarks?: string;
}

export interface QcAuditLog {
  id: string;
  batchId: string;
  inspector: string;
  inspectedUnits: number;
  passedUnits: number;
  failedUnits: number;
  passRate: number;
  defects: string[];
  status: 'Passed' | 'Conditional' | 'Rejected';
  auditDate: string;
}

export interface StoreBranch {
  id: string;
  name: string;
  district: string;
  address: string;
  areaSqft: number;
  monthlyTargetBdt: number;
  monthToDateSalesBdt: number;
  activeStaffCount: number;
  footfallMonthly: number;
  conversionRate: number;
  managerName: string;
}

export type StaffRole = 'Store Manager' | 'Senior Sales Associate' | 'Sales Representative' | 'Styling Consultant';

export type ShiftType = 'Morning (9:30 AM - 4:30 PM)' | 'Evening (2:30 PM - 9:30 PM)' | 'Full Day (10:00 AM - 9:00 PM)' | 'Off';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  branchId: string;
  branchName: string;
  phone: string;
  email: string;
  joiningDate: string;
  monthlyTargetBdt: number;
  achievedSalesBdt: number;
  commissionTierPct: number;
  customerRating: number;
  shiftWeek: Record<string, ShiftType>; // 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
  avatarInitial: string;
}

export type PipelineStage = 'Applied' | 'Screening' | '1st Round' | 'Skill Assessment' | 'Final Interview' | 'Offer Sent' | 'Hired';

export interface JobOpening {
  id: string;
  title: string;
  department: 'Retail Sales' | 'Store Management' | 'Garment Production' | 'Quality Assurance' | 'Styling & Visual';
  location: string;
  vacancies: number;
  requiredSkills: string[];
  minExperienceYears: number;
  targetKeywords: string[];
}

export interface CandidateEvaluationScorecard {
  communication: number; // 1-5
  technicalKnowledge: number; // 1-5
  salesAgility: number; // 1-5
  leadership: number; // 1-5
  culturalFit: number; // 1-5
  evaluatorNotes: string;
  decision: 'Strong Hire' | 'Hire' | 'Hold' | 'Pass';
  evaluatedAt: string;
  evaluator: string;
}

export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobId: string;
  jobTitle: string;
  appliedDate: string;
  stage: PipelineStage;
  cvFileName: string;
  matchScorePct: number;
  matchedSkills: string[];
  missingSkills: string[];
  yearsExperience: number;
  education: string;
  previousCompany: string;
  summary: string;
  scheduledInterview?: {
    date: string;
    time: string;
    mode: 'In-Person (Gulshan Flagship)' | 'Zoom Video Call';
    interviewers: string[];
  };
  scorecard?: CandidateEvaluationScorecard;
}

export interface CartItem {
  slug: string;
  name: string;
  cat: ProductCategory;
  price: number;
  size: SizeCode;
  qty: number;
  img: string;
}

export interface CheckoutPayload {
  customer: {
    name: string;
    email: string;
    phone: string;
    district: string;
    address: string;
    note?: string;
  };
  lines: Array<{
    slug: string;
    size: SizeCode;
    qty: number;
    price: number;
  }>;
  promoCode?: string;
  deliveryMethod: DeliveryMethodId;
  paymentMethod: PaymentMethodId;
}

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
