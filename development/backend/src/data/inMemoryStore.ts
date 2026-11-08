import {
  CandidateProfile,
  Customer,
  FitSession,
  JobOpening,
  Order,
  OrderStatus,
  Product,
  ProductionBatch,
  Promo,
  PurchaseOrder,
  QcAuditLog,
  RawMaterialSupplier,
  Settings,
  SizeCode,
  StaffMember,
  StaffShiftSchedule,
  StoreBranch,
} from '../types';
import {
  SEED_BATCHES,
  SEED_CANDIDATES,
  SEED_CUSTOMERS,
  SEED_JOBS,
  SEED_ORDERS,
  SEED_POS,
  SEED_PRODUCTS,
  SEED_PROMOS,
  SEED_QC_LOGS,
  SEED_SETTINGS,
  SEED_SHIFTS,
  SEED_STAFF,
  SEED_STORES,
  SEED_SUPPLIERS,
} from './seedData';

class InMemoryStore {
  private products: Product[] = [];
  private orders: Order[] = [];
  private customers: Customer[] = [];
  private fitSessions: FitSession[] = [];
  private promos: Promo[] = [];
  private settings: Settings = { ...SEED_SETTINGS };
  private batches: ProductionBatch[] = [];
  private suppliers: RawMaterialSupplier[] = [];
  private purchaseOrders: PurchaseOrder[] = [];
  private qcLogs: QcAuditLog[] = [];
  private stores: StoreBranch[] = [];
  private staff: StaffMember[] = [];
  private shifts: StaffShiftSchedule[] = [];
  private candidates: CandidateProfile[] = [];
  private jobs: JobOpening[] = [];

  constructor() {
    this.resetToSeed();
  }

  public resetToSeed(): void {
    this.products = JSON.parse(JSON.stringify(SEED_PRODUCTS));
    this.orders = JSON.parse(JSON.stringify(SEED_ORDERS));
    this.customers = JSON.parse(JSON.stringify(SEED_CUSTOMERS));
    this.fitSessions = [];
    this.promos = JSON.parse(JSON.stringify(SEED_PROMOS));
    this.settings = JSON.parse(JSON.stringify(SEED_SETTINGS));
    this.batches = JSON.parse(JSON.stringify(SEED_BATCHES));
    this.suppliers = JSON.parse(JSON.stringify(SEED_SUPPLIERS));
    this.purchaseOrders = JSON.parse(JSON.stringify(SEED_POS));
    this.qcLogs = JSON.parse(JSON.stringify(SEED_QC_LOGS));
    this.stores = JSON.parse(JSON.stringify(SEED_STORES));
    this.staff = JSON.parse(JSON.stringify(SEED_STAFF));
    this.shifts = JSON.parse(JSON.stringify(SEED_SHIFTS));
    this.candidates = JSON.parse(JSON.stringify(SEED_CANDIDATES));
    this.jobs = JSON.parse(JSON.stringify(SEED_JOBS));
  }

  // --- PRODUCTS ---
  public getProducts(filter?: { cat?: string; family?: string; search?: string }): Product[] {
    let list = [...this.products];
    if (filter?.cat) {
      list = list.filter((p) => p.cat === filter.cat);
    }
    if (filter?.family) {
      list = list.filter((p) => p.family.toLowerCase() === filter.family!.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.blurb.toLowerCase().includes(q) ||
          p.family.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.products.find((p) => p.slug === slug);
  }

  public updateProductStock(
    slug: string,
    update: { size?: SizeCode; delta?: number; bulk?: number }
  ): Product | undefined {
    const product = this.getProductBySlug(slug);
    if (!product) return undefined;

    if (update.bulk !== undefined) {
      (Object.keys(product.stock) as SizeCode[]).forEach((s) => {
        product.stock[s] = Math.max(0, product.stock[s] + update.bulk!);
      });
    } else if (update.size && update.delta !== undefined) {
      const current = product.stock[update.size] || 0;
      product.stock[update.size] = Math.max(0, current + update.delta);
    }
    return product;
  }

  public updateProductPrice(slug: string, newPrice: number): Product | undefined {
    const product = this.getProductBySlug(slug);
    if (!product) return undefined;
    product.was = product.price;
    product.price = newPrice;
    return product;
  }

  // --- ORDERS ---
  public getOrders(filter?: {
    status?: OrderStatus;
    search?: string;
    payment?: string;
  }): Order[] {
    let list = [...this.orders];
    if (filter?.status) {
      list = list.filter((o) => o.status === filter.status);
    }
    if (filter?.payment) {
      list = list.filter((o) => o.payment === filter.payment);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderId.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          o.customerPhone.includes(q)
      );
    }
    // Most recent first
    return list.sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
  }

  public getOrderById(orderId: string): Order | undefined {
    return this.orders.find((o) => o.orderId === orderId);
  }

  public createOrder(payload: {
    customer: {
      name: string;
      email: string;
      phone: string;
      district: string;
      address?: string;
    };
    lines: Array<{ slug: string; name?: string; size: SizeCode; qty: number; price: number }>;
    promoCode?: string;
    deliveryFee?: number;
    paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card';
  }): Order {
    const subtotal = payload.lines.reduce((acc, line) => acc + line.price * line.qty, 0);

    let discount = 0;
    if (payload.promoCode) {
      const promo = this.validatePromo(payload.promoCode, subtotal);
      if (promo.valid) {
        discount = promo.discountAmount;
      }
    }

    const shipping = payload.deliveryFee !== undefined
      ? payload.deliveryFee
      : (payload.customer.district.toLowerCase() === 'dhaka' ? this.settings.deliveryDhaka : this.settings.deliveryOutside);

    const total = Math.max(0, subtotal - discount + shipping);

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `RY-${randomSuffix}`;

    // Find or create customer
    let customer = this.customers.find(
      (c) => c.email.toLowerCase() === payload.customer.email.toLowerCase()
    );
    if (!customer) {
      const custId = `CUST-${100 + this.customers.length + 1}`;
      customer = {
        customerId: custId,
        name: payload.customer.name,
        email: payload.customer.email,
        phone: payload.customer.phone,
        district: payload.customer.district,
        since: new Date().toISOString(),
        tier: 'New',
        spent: total,
        orders: 1,
        notes: [],
      };
      this.customers.push(customer);
    } else {
      customer.spent += total;
      customer.orders += 1;
      if (customer.orders >= 3 || customer.spent >= 15000) {
        customer.tier = 'VIP';
      } else {
        customer.tier = 'Regular';
      }
    }

    // Decrement stock for purchased items
    for (const line of payload.lines) {
      const prod = this.getProductBySlug(line.slug);
      if (prod && prod.stock[line.size] !== undefined) {
        prod.stock[line.size] = Math.max(0, prod.stock[line.size] - line.qty);
      }
    }

    const newOrder: Order = {
      orderId,
      placedAt: new Date().toISOString(),
      customerId: customer.customerId,
      customerName: payload.customer.name,
      customerEmail: payload.customer.email,
      customerPhone: payload.customer.phone,
      district: payload.customer.district,
      address: payload.customer.address,
      lines: payload.lines,
      subtotal,
      discount,
      shipping,
      total,
      payment: payload.paymentMethod,
      promo: payload.promoCode,
      status: 'new',
      notes: [{ id: `ON-${Date.now()}`, text: 'Order placed via Storefront Checkout', at: new Date().toISOString(), by: 'System' }],
      fromShop: true,
    };

    this.orders.unshift(newOrder);
    return newOrder;
  }

  public updateOrderStatus(orderId: string, nextStatus: OrderStatus): Order | undefined {
    const order = this.getOrderById(orderId);
    if (!order) return undefined;

    const prevStatus = order.status;
    order.status = nextStatus;

    // Requirement: When transitioning to 'returned', automatically restock products
    if (nextStatus === 'returned' && prevStatus !== 'returned') {
      for (const line of order.lines) {
        const prod = this.getProductBySlug(line.slug);
        if (prod && prod.stock[line.size] !== undefined) {
          prod.stock[line.size] += line.qty;
        }
      }
      order.notes.push({
        id: `ON-${Date.now()}`,
        text: 'Returned — Items restocked to inventory.',
        at: new Date().toISOString(),
        by: 'System',
      });
    }

    return order;
  }

  public addOrderNote(orderId: string, text: string, by = 'Admin'): Order | undefined {
    const order = this.getOrderById(orderId);
    if (!order) return undefined;
    order.notes.push({
      id: `ON-${Date.now()}`,
      text,
      at: new Date().toISOString(),
      by,
    });
    return order;
  }

  // --- CUSTOMERS ---
  public getCustomers(search?: string): Customer[] {
    if (!search) return [...this.customers];
    const q = search.toLowerCase();
    return this.customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.district.toLowerCase().includes(q)
    );
  }

  public getCustomerById(id: string): { customer: Customer; orders: Order[] } | undefined {
    const customer = this.customers.find((c) => c.customerId === id);
    if (!customer) return undefined;
    const orders = this.orders.filter(
      (o) => o.customerId === id || o.customerEmail.toLowerCase() === customer.email.toLowerCase()
    );
    return { customer, orders };
  }

  public addCustomerNote(customerId: string, text: string): Customer | undefined {
    const customer = this.customers.find((c) => c.customerId === customerId);
    if (!customer) return undefined;
    customer.notes.push({
      id: `CN-${Date.now()}`,
      text,
      at: new Date().toISOString(),
    });
    return customer;
  }

  // --- PROMOS ---
  public getPromos(): Promo[] {
    return [...this.promos];
  }

  public validatePromo(
    code: string,
    subtotal: number
  ): {
    valid: boolean;
    code: string;
    kind?: 'pct' | 'ship';
    value?: number;
    discountAmount: number;
    label?: string;
    message?: string;
  } {
    const promo = this.promos.find(
      (p) => p.code.toUpperCase() === code.trim().toUpperCase() && p.active
    );
    if (!promo) {
      return { valid: false, code, discountAmount: 0, message: 'Invalid or expired promo code' };
    }

    let discountAmount = 0;
    if (promo.kind === 'pct') {
      discountAmount = Math.round((subtotal * promo.value) / 100);
    } else if (promo.kind === 'ship') {
      discountAmount = promo.value;
    }

    return {
      valid: true,
      code: promo.code,
      kind: promo.kind,
      value: promo.value,
      discountAmount,
      label: promo.label,
    };
  }

  public createPromo(promo: Omit<Promo, 'uses'>): Promo {
    const newPromo: Promo = { ...promo, code: promo.code.toUpperCase(), uses: 0, custom: true };
    this.promos.push(newPromo);
    return newPromo;
  }

  public deletePromo(code: string): boolean {
    const idx = this.promos.findIndex((p) => p.code.toUpperCase() === code.toUpperCase());
    if (idx < 0) return false;
    this.promos.splice(idx, 1);
    return true;
  }

  // --- FIT SESSIONS ---
  public recordFitSession(data: Omit<FitSession, 'id' | 'createdAt'>): FitSession {
    const session: FitSession = {
      id: `FIT-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.fitSessions.push(session);
    return session;
  }

  public getFitSessions(): FitSession[] {
    return [...this.fitSessions];
  }

  // --- SETTINGS ---
  public getSettings(): Settings {
    return { ...this.settings };
  }

  public updateSettings(partial: Partial<Settings>): Settings {
    this.settings = {
      ...this.settings,
      ...partial,
      paymentToggles: {
        ...this.settings.paymentToggles,
        ...(partial.paymentToggles || {}),
      },
      notificationToggles: {
        ...this.settings.notificationToggles,
        ...(partial.notificationToggles || {}),
      },
    };
    return { ...this.settings };
  }

  // --- OVERVIEW / TELEMETRY ---
  public getOverviewTelemetry(): {
    monthSales: number;
    ordersToPack: number;
    averageOrderValue: number;
    salesChart: Array<{ month: string; revenue: number }>;
    toPackQueue: Order[];
    runningLowStock: Array<{ slug: string; name: string; totalStock: number; sizes: Array<{ size: SizeCode; stock: number }> }>;
  } {
    const validOrders = this.orders.filter((o) => o.status !== 'returned');
    const monthSales = validOrders.reduce((sum, o) => sum + o.total, 0);
    const toPackQueue = this.orders.filter((o) => o.status === 'packing');
    const ordersToPack = toPackQueue.length;
    const averageOrderValue = validOrders.length > 0 ? Math.round(monthSales / validOrders.length) : 0;

    const salesChart = [
      { month: 'Jun', revenue: 410000 },
      { month: 'Jul', revenue: 485000 },
      { month: 'Aug', revenue: 530000 },
      { month: 'Sep', revenue: 490000 },
      { month: 'Oct', revenue: 595890 },
      { month: 'Nov', revenue: monthSales },
    ];

    const lowStockThreshold = this.settings.lowStock || 3;
    const runningLowStock: Array<{
      slug: string;
      name: string;
      totalStock: number;
      sizes: Array<{ size: SizeCode; stock: number }>;
    }> = [];

    for (const p of this.products) {
      const lowSizes: Array<{ size: SizeCode; stock: number }> = [];
      let total = 0;
      for (const [size, count] of Object.entries(p.stock)) {
        total += count;
        if (count <= lowStockThreshold) {
          lowSizes.push({ size: size as SizeCode, stock: count });
        }
      }
      if (lowSizes.length > 0) {
        runningLowStock.push({
          slug: p.slug,
          name: p.name,
          totalStock: total,
          sizes: lowSizes,
        });
      }
    }

    return {
      monthSales,
      ordersToPack,
      averageOrderValue,
      salesChart,
      toPackQueue,
      runningLowStock,
    };
  }

  // --- ENTERPRISE: MANUFACTURER ---
  public getBatches(): ProductionBatch[] {
    return [...this.batches];
  }

  public createBatch(data: Omit<ProductionBatch, 'id' | 'progress'>): ProductionBatch {
    const id = `BATCH-2026-${String(88 + this.batches.length).padStart(3, '0')}`;
    const newBatch: ProductionBatch = {
      ...data,
      id,
      progress: data.stage === 'Cutting' ? 20 : data.stage === 'Sewing' ? 50 : 80,
    };
    this.batches.unshift(newBatch);
    return newBatch;
  }

  public updateBatchStage(
    batchId: string,
    nextStage: ProductionBatch['stage'],
    progress?: number
  ): ProductionBatch | undefined {
    const batch = this.batches.find((b) => b.id === batchId);
    if (!batch) return undefined;
    batch.stage = nextStage;
    if (progress !== undefined) {
      batch.progress = progress;
    } else {
      const stageMap: Record<ProductionBatch['stage'], number> = {
        Cutting: 20,
        Sewing: 50,
        Ironing: 75,
        'QC Audit': 90,
        Packaging: 96,
        Dispatched: 100,
      };
      batch.progress = stageMap[nextStage] || batch.progress;
    }
    return batch;
  }

  public getSuppliers(): RawMaterialSupplier[] {
    return [...this.suppliers];
  }

  public getPurchaseOrders(): PurchaseOrder[] {
    return [...this.purchaseOrders];
  }

  public createPurchaseOrder(data: Omit<PurchaseOrder, 'poNumber'>): PurchaseOrder {
    const poNumber = `PO-2026-${401 + this.purchaseOrders.length}`;
    const newPo: PurchaseOrder = { ...data, poNumber };
    this.purchaseOrders.unshift(newPo);
    return newPo;
  }

  public getQcLogs(): QcAuditLog[] {
    return [...this.qcLogs];
  }

  public createQcLog(data: Omit<QcAuditLog, 'id'>): QcAuditLog {
    const id = `QC-2026-${101 + this.qcLogs.length}`;
    const newLog: QcAuditLog = { ...data, id };
    this.qcLogs.unshift(newLog);
    return newLog;
  }

  // --- ENTERPRISE: STORE MANAGEMENT ---
  public getBranches(): StoreBranch[] {
    return [...this.stores];
  }

  public getStaff(): StaffMember[] {
    return [...this.staff];
  }

  public addStaff(data: Omit<StaffMember, 'id'>): StaffMember {
    const id = `STF-${String(this.staff.length + 1).padStart(2, '0')}`;
    const newStaff: StaffMember = { ...data, id };
    this.staff.push(newStaff);
    return newStaff;
  }

  public updateStaffTarget(staffId: string, targetBDT: number): StaffMember | undefined {
    const member = this.staff.find((s) => s.id === staffId);
    if (!member) return undefined;
    member.monthlyTargetBDT = targetBDT;
    return member;
  }

  public getShifts(): StaffShiftSchedule[] {
    return [...this.shifts];
  }

  public updateShiftSchedule(schedule: StaffShiftSchedule): StaffShiftSchedule {
    const idx = this.shifts.findIndex((s) => s.staffId === schedule.staffId);
    if (idx >= 0) {
      this.shifts[idx] = schedule;
    } else {
      this.shifts.push(schedule);
    }
    return schedule;
  }

  // --- ENTERPRISE: HR MANAGEMENT ---
  public getCandidates(): CandidateProfile[] {
    return [...this.candidates];
  }

  public addCandidate(data: Omit<CandidateProfile, 'id'>): CandidateProfile {
    const id = `CAND-2026-${String(this.candidates.length + 1).padStart(2, '0')}`;
    const newCandidate: CandidateProfile = { ...data, id };
    this.candidates.unshift(newCandidate);
    return newCandidate;
  }

  public updateCandidateStage(
    candidateId: string,
    stage: CandidateProfile['currentStage']
  ): CandidateProfile | undefined {
    const candidate = this.candidates.find((c) => c.id === candidateId);
    if (!candidate) return undefined;
    candidate.currentStage = stage;
    return candidate;
  }

  public addCandidateEvaluation(
    candidateId: string,
    evaluation: CandidateProfile['evaluations'][number]
  ): CandidateProfile | undefined {
    const candidate = this.candidates.find((c) => c.id === candidateId);
    if (!candidate) return undefined;
    candidate.evaluations.push(evaluation);
    return candidate;
  }

  public getJobOpenings(): JobOpening[] {
    return [...this.jobs];
  }

  public analyzeCv(cvText: string, targetRole: string): {
    matchScore: number;
    extractedSkills: string[];
    missingSkills: string[];
    resumeSummary: string;
    candidateName: string;
    experienceYears: number;
  } {
    const job = this.jobs.find(
      (j) => j.title.toLowerCase().includes(targetRole.toLowerCase()) || targetRole.toLowerCase().includes(j.title.toLowerCase())
    ) || this.jobs[0];

    const requiredSkills = job ? job.requiredSkills : ['Store Operations', 'Sales Leadership', 'POS CRM', 'Styling'];
    const extractedSkills: string[] = [];
    const missingSkills: string[] = [];

    const lowerCv = cvText.toLowerCase();

    for (const skill of requiredSkills) {
      const tokens = skill.toLowerCase().split(/[\s/]+/);
      const matched = tokens.some((token) => token.length > 2 && lowerCv.includes(token));
      if (matched) {
        extractedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    }

    const matchScore = Math.max(
      20,
      Math.min(100, Math.round((extractedSkills.length / Math.max(1, requiredSkills.length)) * 100))
    );

    // Try extracting name and experience
    const nameMatch = cvText.match(/(?:name|candidate):\s*([^\r\n,]+)/i);
    const candidateName = nameMatch && nameMatch[1] ? nameMatch[1].trim() : 'Applicant Candidate';

    const expMatch = cvText.match(/(\d+)\+?\s*(?:years?|yrs?)/i);
    const experienceYears = expMatch ? parseInt(expMatch[1], 10) : 3;

    const resumeSummary = `Profile scanned for ${job.title}. Matches ${extractedSkills.length} of ${requiredSkills.length} required competencies with a ${matchScore}% role fit.`;

    return {
      matchScore,
      extractedSkills,
      missingSkills,
      resumeSummary,
      candidateName,
      experienceYears,
    };
  }
}

export const inMemoryStore = new InMemoryStore();
