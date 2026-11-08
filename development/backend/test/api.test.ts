import request from 'supertest';
import { createApp } from '../src/app';
import { inMemoryStore } from '../src/data/inMemoryStore';

const app = createApp();

describe('Raye MERN Backend API Test Suite', () => {
  beforeEach(() => {
    // Reset store to known deterministic seed baseline before each test block
    inMemoryStore.resetToSeed();
  });

  describe('Health and System Status', () => {
    it('GET /health returns 200 OK with status ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(typeof res.body.uptime).toBe('number');
    });

    it('GET / returns 200 with API metadata', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body.name).toContain('Raye');
      expect(res.body.status).toBe('active');
    });

    it('returns 404 for unknown endpoints in standardized format', async () => {
      const res = await request(app).get('/api/v1/unknown-endpoint');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Route not found');
      expect(res.body.statusCode).toBe(404);
    });
  });

  describe('Catalog & Products (/api/v1/products)', () => {
    it('GET /api/v1/products returns all products', async () => {
      const res = await request(app).get('/api/v1/products');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.count).toBeGreaterThanOrEqual(6);
    });

    it('GET /api/v1/products filters by category', async () => {
      const res = await request(app).get('/api/v1/products?cat=short');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      res.body.data.forEach((p: any) => expect(p.cat).toBe('short'));
    });

    it('GET /api/v1/products filters by search query', async () => {
      const res = await request(app).get('/api/v1/products?search=oxford');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0].slug).toBe('breeze');
    });

    it('GET /api/v1/products/:slug returns product detail', async () => {
      const res = await request(app).get('/api/v1/products/sunday');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Sunday Stripe');
      expect(res.body.data.price).toBe(2890);
    });

    it('GET /api/v1/products/:slug returns 404 for non-existent slug', async () => {
      const res = await request(app).get('/api/v1/products/non-existent-shirt');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.statusCode).toBe(404);
    });

    it('PATCH /api/v1/products/:slug/stock updates specific size stock', async () => {
      const initial = inMemoryStore.getProductBySlug('sunday')!.stock.M;
      const res = await request(app)
        .patch('/api/v1/products/sunday/stock')
        .send({ size: 'M', delta: 5 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.stock.M).toBe(initial + 5);
    });

    it('PATCH /api/v1/products/:slug/price updates product price', async () => {
      const res = await request(app)
        .patch('/api/v1/products/sunday/price')
        .send({ price: 3190 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.price).toBe(3190);
      expect(res.body.data.was).toBe(2890);
    });
  });

  describe('Promotions & Discounts (/api/v1/promos)', () => {
    it('GET /api/v1/promos lists all promos', async () => {
      const res = await request(app).get('/api/v1/promos');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.some((p: any) => p.code === 'RAYE10')).toBe(true);
    });

    it('POST /api/v1/promos/validate validates percentage promo RAYE10', async () => {
      const res = await request(app)
        .post('/api/v1/promos/validate')
        .send({ code: 'RAYE10', subtotal: 2890 });

      expect(res.status).toBe(200);
      expect(res.body.valid).toBe(true);
      expect(res.body.code).toBe('RAYE10');
      expect(res.body.discountAmount).toBe(289);
    });

    it('POST /api/v1/promos/validate handles invalid promo gracefully', async () => {
      const res = await request(app)
        .post('/api/v1/promos/validate')
        .send({ code: 'FAKECODE', subtotal: 2890 });

      expect(res.status).toBe(200);
      expect(res.body.valid).toBe(false);
      expect(res.body.discountAmount).toBe(0);
    });

    it('POST /api/v1/promos creates a new promo and DELETE removes it', async () => {
      const createRes = await request(app)
        .post('/api/v1/promos')
        .send({
          code: 'WINTER20',
          kind: 'pct',
          value: 20,
          label: '20% Winter Launch',
        });

      expect(createRes.status).toBe(201);
      expect(createRes.body.data.code).toBe('WINTER20');

      const delRes = await request(app).delete('/api/v1/promos/WINTER20');
      expect(delRes.status).toBe(200);
      expect(delRes.body.success).toBe(true);
    });
  });

  describe('Fit Finder Telemetry (/api/v1/fit-sessions)', () => {
    it('POST /api/v1/fit-sessions records user measurement telemetry', async () => {
      const res = await request(app)
        .post('/api/v1/fit-sessions')
        .send({
          heightCm: 178,
          weightKg: 72,
          recommendedSize: 'M',
          addedToBag: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.recommendedSize).toBe('M');
    });

    it('POST /api/v1/fit-sessions rejects invalid height with 400', async () => {
      const res = await request(app)
        .post('/api/v1/fit-sessions')
        .send({
          heightCm: 50, // below min 100
          weightKg: 70,
          recommendedSize: 'M',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Validation error');
    });
  });

  describe('Storefront Checkout & Customer Creation (/api/v1/orders)', () => {
    it('POST /api/v1/orders creates order, decrements stock, and creates/updates customer record', async () => {
      const initialStock = inMemoryStore.getProductBySlug('sunday')!.stock.M;

      const payload = {
        customer: {
          name: 'Shahriar Kabir',
          email: 'shahriar@example.com',
          phone: '01719998877',
          district: 'Dhaka',
          address: 'Block C, Bashundhara R/A',
        },
        lines: [
          {
            slug: 'sunday',
            name: 'Sunday Stripe',
            size: 'M',
            qty: 2,
            price: 2890,
          },
        ],
        promoCode: 'RAYE10',
        deliveryFee: 80,
        paymentMethod: 'bkash',
      };

      const res = await request(app).post('/api/v1/orders').send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.orderId).toMatch(/^RY-\d+$/);
      expect(res.body.data.status).toBe('new');
      expect(res.body.data.paymentMethod).toBe('bkash');

      // Acceptance Criteria: Placing order creates customer record
      const customersRes = await request(app).get('/api/v1/customers?search=shahriar');
      expect(customersRes.status).toBe(200);
      expect(customersRes.body.data.length).toBe(1);
      expect(customersRes.body.data[0].email).toBe('shahriar@example.com');

      // Stock is decremented by 2
      const updatedStock = inMemoryStore.getProductBySlug('sunday')!.stock.M;
      expect(updatedStock).toBe(initialStock - 2);

      // Acceptance Criteria: Reflects on Overview
      const overviewRes = await request(app).get('/api/v1/overview');
      expect(overviewRes.status).toBe(200);
      expect(overviewRes.body.success).toBe(true);
    });

    it('POST /api/v1/orders validates input payload with Zod', async () => {
      const res = await request(app).post('/api/v1/orders').send({
        customer: { name: 'A' }, // invalid email, missing phone, short name
        lines: [],
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Validation error');
    });
  });

  describe('Kanban Order Management & Auto-Restock on Return', () => {
    it('PATCH /api/v1/orders/:id/status transitions status to packing then shipped', async () => {
      const order = inMemoryStore.getOrders({ status: 'new' })[0];

      const packRes = await request(app)
        .patch(`/api/v1/orders/${order.orderId}/status`)
        .send({ status: 'packing' });

      expect(packRes.status).toBe(200);
      expect(packRes.body.data.status).toBe('packing');

      const shipRes = await request(app)
        .patch(`/api/v1/orders/${order.orderId}/status`)
        .send({ status: 'shipped' });

      expect(shipRes.status).toBe(200);
      expect(shipRes.body.data.status).toBe('shipped');
    });

    it('Acceptance Criteria: Dragging order to returned increments shirt stock per line item', async () => {
      // Find order with known items
      const order = inMemoryStore.getOrderById('RY-48201')!;
      expect(order.status).toBe('new');
      const targetLine = order.lines[0]; // sunday, size M, qty 1
      const stockBefore = inMemoryStore.getProductBySlug(targetLine.slug)!.stock[targetLine.size];

      const res = await request(app)
        .patch('/api/v1/orders/RY-48201/status')
        .send({ status: 'returned' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('returned');

      // Verify product stock incremented by qty
      const stockAfter = inMemoryStore.getProductBySlug(targetLine.slug)!.stock[targetLine.size];
      expect(stockAfter).toBe(stockBefore + targetLine.qty);
    });

    it('POST /api/v1/orders/:id/notes appends note to order', async () => {
      const res = await request(app)
        .post('/api/v1/orders/RY-48201/notes')
        .send({ text: 'Customer requested change of delivery address', by: 'Support Lead' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const lastNote = res.body.data.notes[res.body.data.notes.length - 1];
      expect(lastNote.text).toBe('Customer requested change of delivery address');
      expect(lastNote.by).toBe('Support Lead');
    });
  });

  describe('Customer CRM (/api/v1/customers)', () => {
    it('GET /api/v1/customers lists all CRM customers', async () => {
      const res = await request(app).get('/api/v1/customers');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBeGreaterThanOrEqual(5);
    });

    it('GET /api/v1/customers/:id returns customer profile with linked orders', async () => {
      const res = await request(app).get('/api/v1/customers/CUST-101');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.customer.customerId).toBe('CUST-101');
      expect(Array.isArray(res.body.data.orders)).toBe(true);
    });

    it('POST /api/v1/customers/:id/notes appends CRM note', async () => {
      const res = await request(app)
        .post('/api/v1/customers/CUST-101/notes')
        .send({ text: 'VIP customer requested lookbook catalog preview' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const notes = res.body.data.notes;
      expect(notes[notes.length - 1].text).toBe('VIP customer requested lookbook catalog preview');
    });
  });

  describe('Settings & Demo Seed Reset (/api/v1/settings & /api/v1/admin/reset-seed)', () => {
    it('GET /api/v1/settings returns store config', async () => {
      const res = await request(app).get('/api/v1/settings');
      expect(res.status).toBe(200);
      expect(res.body.data.storeName).toContain('Shifatdevs');
      expect(res.body.data.paymentToggles.bkash).toBe(true);
    });

    it('PATCH /api/v1/settings updates store configuration', async () => {
      const res = await request(app)
        .patch('/api/v1/settings')
        .send({ lowStock: 5, deliveryDhaka: 90 });

      expect(res.status).toBe(200);
      expect(res.body.data.lowStock).toBe(5);
      expect(res.body.data.deliveryDhaka).toBe(90);
    });

    it('POST /api/v1/admin/reset-seed restores baseline seed', async () => {
      const res = await request(app).post('/api/v1/admin/reset-seed');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Baseline seed restored');
    });
  });

  describe('Enterprise Modules (Manufacturer, Stores, HR & CV Checker)', () => {
    it('GET & POST /api/v1/manufacturer/batches manages production batches', async () => {
      const listRes = await request(app).get('/api/v1/manufacturer/batches');
      expect(listRes.status).toBe(200);
      expect(listRes.body.count).toBeGreaterThanOrEqual(4);

      const progRes = await request(app)
        .patch('/api/v1/manufacturer/batches/BATCH-2026-088/stage')
        .send({ stage: 'Ironing' });

      expect(progRes.status).toBe(200);
      expect(progRes.body.data.stage).toBe('Ironing');
    });

    it('GET & POST /api/v1/manufacturer/pos manages purchase orders', async () => {
      const posRes = await request(app).get('/api/v1/manufacturer/pos');
      expect(posRes.status).toBe(200);
      expect(posRes.body.count).toBeGreaterThanOrEqual(3);
    });

    it('GET & POST /api/v1/stores/branches & /api/v1/stores/staff manages retail network', async () => {
      const branchesRes = await request(app).get('/api/v1/stores/branches');
      expect(branchesRes.status).toBe(200);
      expect(branchesRes.body.count).toBeGreaterThanOrEqual(5);

      const staffRes = await request(app).get('/api/v1/stores/staff');
      expect(staffRes.status).toBe(200);
      expect(staffRes.body.count).toBeGreaterThanOrEqual(4);
    });

    it('POST /api/v1/hr/analyze-cv performs live resume skill parsing and role-fit calculation', async () => {
      const cvText = `
        Candidate: Tanmoy Ahmed
        Role: Senior Store Manager (Flagship)
        Experience: 7 years in retail apparel operations
        Skills: Store Operations, Sales Leadership, POS / Inventory CRM, Luxury Client Styling, Team Scheduling, Visual Merchandising.
      `;

      const res = await request(app)
        .post('/api/v1/hr/analyze-cv')
        .send({ cvText, targetRole: 'Senior Store Manager (Flagship)' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.matchScore).toBeGreaterThanOrEqual(80);
      expect(res.body.data.extractedSkills.length).toBeGreaterThanOrEqual(4);
      expect(res.body.data.candidateName).toBe('Tanmoy Ahmed');
    });
  });
});
