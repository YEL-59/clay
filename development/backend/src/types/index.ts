export type SizeCode = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type ProductCategory = 'short' | 'long' | 'oversized';
export type OrderStatus = 'new' | 'packing' | 'shipped' | 'delivered' | 'returned';
export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'card';

export interface ProductColour {
  name: string;
  hex: string;
}

export interface ProductStock {
  XS: number;
  S: number;
  M: number;
  L: number;
  XL: number;
  XXL: number;
}

export interface Product {
  slug: string;
  name: string;
  cat: ProductCategory;
  price: number;
  was?: number;
  rating: number;
  reviews: number;
  tag?: string;
  family: string;
  added?: number;
  colours: ProductColour[];
  stock: ProductStock;
  img: string;
  model: string;
  blurb: string;
  details: string[];
  fabric: string;
}

export interface OrderLine {
  slug: string;
  name?: string;
  size: SizeCode;
  qty: number;
  price: number;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  district: string;
  address?: string;
}

export interface OrderNote {
  id: string;
  text: string;
  at: string;
  by: string;
}

export interface Order {
  orderId: string;
  placedAt: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  district: string;
  address?: string;
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  payment: PaymentMethod;
  promo?: string;
  status: OrderStatus;
  notes: OrderNote[];
  fromShop: boolean;
}

export interface CustomerNote {
  id: string;
  text: string;
  at: string;
}

export interface Customer {
  customerId: string;
  name: string;
  email: string;
  phone: string;
  district: string;
  since: string;
  tier: 'VIP' | 'Regular' | 'New';
  spent: number;
  orders: number;
  notes: CustomerNote[];
}

export interface FitSession {
  id?: string;
  heightCm: number;
  weightKg: number;
  recommendedSize: SizeCode;
  addedToBag: boolean;
  createdAt?: string;
}

export interface Promo {
  code: string;
  kind: 'pct' | 'ship';
  value: number;
  label: string;
  active: boolean;
  uses: number;
  custom?: boolean;
}

export interface Settings {
  storeId: string;
  storeName: string;
  email: string;
  phone: string;
  lowStock: number;
  deliveryDhaka: number;
  deliveryOutside: number;
  freeDeliveryThreshold: number;
  paymentToggles: {
    cod: boolean;
    bkash: boolean;
    nagad: boolean;
    card: boolean;
  };
  notificationToggles: {
    order: boolean;
    lowStock: boolean;
    returns: boolean;
  };
}

// Enterprise Modules
export type BatchStage = 'Cutting' | 'Sewing' | 'Ironing' | 'QC Audit' | 'Packaging' | 'Dispatched';

export interface ProductionBatch {
  id: string;
  styleName: string;
  category: ProductCategory;
  targetUnits: number;
  stage: BatchStage;
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
  type: 'Fabric Mill' | 'Yarn Spinner' | 'Trims & Shell Buttons' | 'Label & Packaging';
  origin: string;
  leadTimeDays: number;
  qualityRating: number;
  activeContracts: number;
  contactPerson: string;
  phone: string;
  moqMetersOrUnits: string;
}

export interface PurchaseOrder {
  poNumber: string;
  supplierId: string;
  supplierName: string;
  itemDescription: string;
  quantity: string;
  totalAmountBDT: number;
  issueDate: string;
  expectedDelivery: string;
  status: 'Draft' | 'Issued' | 'In Production' | 'Inspected' | 'Completed';
  paymentState: 'Paid' | '50% Advance' | 'Pending';
}

export interface QcAuditLog {
  id: string;
  batchId: string;
  auditorName: string;
  auditDate: string;
  sampleSize: number;
  defectsFound: number;
  defectTypes: string[];
  verdict: 'Pass (AQL 2.5)' | 'Conditional' | 'Rejected';
  notes: string;
}

export interface StoreBranch {
  id: string;
  name: string;
  type: 'Flagship' | 'Experience Hub' | 'Boutique' | 'Outlet';
  address: string;
  city: string;
  managerName: string;
  sqFootage: number;
  activeStaffCount: number;
  monthlyTargetBDT: number;
  mtdSalesBDT: number;
  footfallConversionRate: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Store Manager' | 'Senior Fashion Stylist' | 'Sales Associate' | 'Visual Merchandiser' | 'Inventory Lead';
  branchId: string;
  branchName: string;
  joinedDate: string;
  monthlyTargetBDT: number;
  achievedSalesBDT: number;
  commissionRate: number;
  rating: number;
  phone: string;
  email: string;
}

export type ShiftType = 'Morning' | 'Evening' | 'Full Day' | 'Off Day';

export interface StaffShiftSchedule {
  staffId: string;
  staffName: string;
  branchId: string;
  schedule: Record<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun', ShiftType>;
}

export type ApplicantStage =
  | 'Applied'
  | 'Screening'
  | '1st Round'
  | 'Skill Assessment'
  | 'Final Interview'
  | 'Offer Sent'
  | 'Hired'
  | 'Archived';

export interface EvaluationScorecard {
  interviewer: string;
  date: string;
  communicationRating: number; // 1-5
  retailKnowledgeRating: number; // 1-5
  salesAgilityRating: number; // 1-5
  leadershipRating: number; // 1-5
  culturalFitRating: number; // 1-5
  recommendation: 'Strong Hire' | 'Hire' | 'On Hold' | 'Reject';
  feedbackNotes: string;
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  applyingForRole: string;
  experienceYears: number;
  currentStage: ApplicantStage;
  appliedDate: string;
  email: string;
  phone: string;
  matchScore: number;
  extractedSkills: string[];
  missingSkills: string[];
  resumeSummary: string;
  evaluations: EvaluationScorecard[];
}

export interface JobOpening {
  id: string;
  title: string;
  department: 'Retail Operations' | 'Manufacturing & QC' | 'Supply Chain' | 'Fashion Design';
  openPositions: number;
  branch: string;
  status: 'Active' | 'Draft' | 'Closed';
  requiredSkills: string[];
}
