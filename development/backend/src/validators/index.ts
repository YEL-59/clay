import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    customer: z.object({
      name: z.string().min(2, 'Customer name must be at least 2 characters'),
      email: z.string().email('Valid email is required'),
      phone: z.string().min(8, 'Valid phone number is required'),
      district: z.string().min(2, 'District is required'),
      address: z.string().optional(),
    }),
    lines: z
      .array(
        z.object({
          slug: z.string().min(1, 'Product slug is required'),
          name: z.string().optional(),
          size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
          qty: z.number().int().min(1, 'Quantity must be at least 1'),
          price: z.number().min(0, 'Price must be non-negative'),
        })
      )
      .min(1, 'Order must contain at least one line item'),
    promoCode: z.string().optional(),
    deliveryFee: z.number().optional(),
    paymentMethod: z.enum(['cod', 'bkash', 'nagad', 'card']),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    status: z.enum(['new', 'packing', 'shipped', 'delivered', 'returned']),
  }),
});

export const addOrderNoteSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    text: z.string().min(1, 'Note text is required'),
    by: z.string().optional(),
  }),
});

export const updateStockSchema = z.object({
  params: z.object({
    slug: z.string().min(1),
  }),
  body: z.object({
    size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']).optional(),
    delta: z.number().optional(),
    bulk: z.number().optional(),
  }),
});

export const updatePriceSchema = z.object({
  params: z.object({
    slug: z.string().min(1),
  }),
  body: z.object({
    price: z.number().positive('Price must be greater than 0'),
  }),
});

export const validatePromoSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Promo code is required'),
    subtotal: z.number().min(0).optional(),
  }),
});

export const createPromoSchema = z.object({
  body: z.object({
    code: z.string().min(2, 'Promo code must be at least 2 characters'),
    kind: z.enum(['pct', 'ship']),
    value: z.number().positive('Discount value must be positive'),
    label: z.string().min(2, 'Label is required'),
    active: z.boolean().optional(),
  }),
});

export const recordFitSessionSchema = z.object({
  body: z.object({
    heightCm: z.number().min(100).max(250),
    weightKg: z.number().min(30).max(200),
    recommendedSize: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
    addedToBag: z.boolean().optional(),
  }),
});

export const updateSettingsSchema = z.object({
  body: z.object({
    storeName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    lowStock: z.number().min(0).optional(),
    deliveryDhaka: z.number().min(0).optional(),
    deliveryOutside: z.number().min(0).optional(),
    freeDeliveryThreshold: z.number().min(0).optional(),
    paymentToggles: z
      .object({
        cod: z.boolean().optional(),
        bkash: z.boolean().optional(),
        nagad: z.boolean().optional(),
        card: z.boolean().optional(),
      })
      .optional(),
    notificationToggles: z
      .object({
        order: z.boolean().optional(),
        lowStock: z.boolean().optional(),
        returns: z.boolean().optional(),
      })
      .optional(),
  }),
});

export const createBatchSchema = z.object({
  body: z.object({
    styleName: z.string().min(2),
    category: z.enum(['short', 'long', 'oversized']),
    targetUnits: z.number().positive(),
    stage: z.enum(['Cutting', 'Sewing', 'Ironing', 'QC Audit', 'Packaging', 'Dispatched']),
    startDate: z.string(),
    estimatedCompletion: z.string(),
    factory: z.string(),
    leadMaster: z.string(),
    colorway: z.string(),
    assignedFabric: z.string(),
    notes: z.string().optional(),
  }),
});

export const updateBatchStageSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    stage: z.enum(['Cutting', 'Sewing', 'Ironing', 'QC Audit', 'Packaging', 'Dispatched']),
    progress: z.number().min(0).max(100).optional(),
  }),
});

export const createPoSchema = z.object({
  body: z.object({
    supplierId: z.string().min(1),
    supplierName: z.string().min(1),
    itemDescription: z.string().min(1),
    quantity: z.string().min(1),
    totalAmountBDT: z.number().positive(),
    issueDate: z.string(),
    expectedDelivery: z.string(),
    status: z.enum(['Draft', 'Issued', 'In Production', 'Inspected', 'Completed']),
    paymentState: z.enum(['Paid', '50% Advance', 'Pending']),
  }),
});

export const createQcLogSchema = z.object({
  body: z.object({
    batchId: z.string().min(1),
    auditorName: z.string().min(1),
    auditDate: z.string(),
    sampleSize: z.number().positive(),
    defectsFound: z.number().min(0),
    defectTypes: z.array(z.string()),
    verdict: z.enum(['Pass (AQL 2.5)', 'Conditional', 'Rejected']),
    notes: z.string().optional(),
  }),
});

export const addStaffSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    role: z.enum([
      'Store Manager',
      'Senior Fashion Stylist',
      'Sales Associate',
      'Visual Merchandiser',
      'Inventory Lead',
    ]),
    branchId: z.string(),
    branchName: z.string(),
    joinedDate: z.string(),
    monthlyTargetBDT: z.number().positive(),
    achievedSalesBDT: z.number().min(0),
    commissionRate: z.number().positive(),
    rating: z.number().min(1).max(5),
    phone: z.string(),
    email: z.string().email(),
  }),
});

export const updateStaffTargetSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    monthlyTargetBDT: z.number().positive('Monthly target must be greater than 0'),
  }),
});

export const updateShiftScheduleSchema = z.object({
  body: z.object({
    staffId: z.string().min(1),
    staffName: z.string().min(1),
    branchId: z.string().min(1),
    schedule: z.record(z.enum(['Morning', 'Evening', 'Full Day', 'Off Day'])),
  }),
});

export const addCandidateSchema = z.object({
  body: z.object({
    fullName: z.string().min(2),
    applyingForRole: z.string().min(2),
    experienceYears: z.number().min(0),
    currentStage: z.enum([
      'Applied',
      'Screening',
      '1st Round',
      'Skill Assessment',
      'Final Interview',
      'Offer Sent',
      'Hired',
      'Archived',
    ]),
    appliedDate: z.string(),
    email: z.string().email(),
    phone: z.string(),
    matchScore: z.number().min(0).max(100),
    extractedSkills: z.array(z.string()),
    missingSkills: z.array(z.string()),
    resumeSummary: z.string().optional(),
    evaluations: z.array(z.any()).optional(),
  }),
});

export const updateCandidateStageSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    stage: z.enum([
      'Applied',
      'Screening',
      '1st Round',
      'Skill Assessment',
      'Final Interview',
      'Offer Sent',
      'Hired',
      'Archived',
    ]),
  }),
});

export const addEvaluationSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    interviewer: z.string().min(2),
    date: z.string(),
    communicationRating: z.number().min(1).max(5),
    retailKnowledgeRating: z.number().min(1).max(5),
    salesAgilityRating: z.number().min(1).max(5),
    leadershipRating: z.number().min(1).max(5),
    culturalFitRating: z.number().min(1).max(5),
    recommendation: z.enum(['Strong Hire', 'Hire', 'On Hold', 'Reject']),
    feedbackNotes: z.string().optional(),
  }),
});

export const analyzeCvSchema = z.object({
  body: z.object({
    cvText: z.string().min(10, 'CV text must have at least 10 characters'),
    targetRole: z.string().min(2, 'Target role is required'),
  }),
});
