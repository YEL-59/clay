import { Schema, model } from 'mongoose';
import {
  CandidateProfile,
  JobOpening,
  ProductionBatch,
  PurchaseOrder,
  QcAuditLog,
  RawMaterialSupplier,
  StaffMember,
  StaffShiftSchedule,
  StoreBranch,
} from '../types';

export const ProductionBatchModel = model<ProductionBatch>(
  'ProductionBatch',
  new Schema<ProductionBatch>(
    {
      id: { type: String, required: true, unique: true },
      styleName: { type: String, required: true },
      category: { type: String, enum: ['short', 'long', 'oversized'], required: true },
      targetUnits: { type: Number, required: true },
      stage: {
        type: String,
        enum: ['Cutting', 'Sewing', 'Ironing', 'QC Audit', 'Packaging', 'Dispatched'],
        required: true,
      },
      progress: { type: Number, default: 0 },
      startDate: { type: String, required: true },
      estimatedCompletion: { type: String, required: true },
      factory: { type: String, required: true },
      leadMaster: { type: String, required: true },
      colorway: { type: String, required: true },
      assignedFabric: { type: String, required: true },
      notes: { type: String },
    },
    { timestamps: true }
  )
);

export const RawMaterialSupplierModel = model<RawMaterialSupplier>(
  'RawMaterialSupplier',
  new Schema<RawMaterialSupplier>(
    {
      id: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      type: {
        type: String,
        enum: ['Fabric Mill', 'Yarn Spinner', 'Trims & Shell Buttons', 'Label & Packaging'],
        required: true,
      },
      origin: { type: String, required: true },
      leadTimeDays: { type: Number, required: true },
      qualityRating: { type: Number, required: true },
      activeContracts: { type: Number, default: 0 },
      contactPerson: { type: String, required: true },
      phone: { type: String, required: true },
      moqMetersOrUnits: { type: String, required: true },
    },
    { timestamps: true }
  )
);

export const PurchaseOrderModel = model<PurchaseOrder>(
  'PurchaseOrder',
  new Schema<PurchaseOrder>(
    {
      poNumber: { type: String, required: true, unique: true },
      supplierId: { type: String, required: true },
      supplierName: { type: String, required: true },
      itemDescription: { type: String, required: true },
      quantity: { type: String, required: true },
      totalAmountBDT: { type: Number, required: true },
      issueDate: { type: String, required: true },
      expectedDelivery: { type: String, required: true },
      status: {
        type: String,
        enum: ['Draft', 'Issued', 'In Production', 'Inspected', 'Completed'],
        default: 'Issued',
      },
      paymentState: {
        type: String,
        enum: ['Paid', '50% Advance', 'Pending'],
        default: 'Pending',
      },
    },
    { timestamps: true }
  )
);

export const QcAuditLogModel = model<QcAuditLog>(
  'QcAuditLog',
  new Schema<QcAuditLog>(
    {
      id: { type: String, required: true, unique: true },
      batchId: { type: String, required: true },
      auditorName: { type: String, required: true },
      auditDate: { type: String, required: true },
      sampleSize: { type: Number, required: true },
      defectsFound: { type: Number, required: true },
      defectTypes: [{ type: String }],
      verdict: {
        type: String,
        enum: ['Pass (AQL 2.5)', 'Conditional', 'Rejected'],
        required: true,
      },
      notes: { type: String, default: '' },
    },
    { timestamps: true }
  )
);

export const StoreBranchModel = model<StoreBranch>(
  'StoreBranch',
  new Schema<StoreBranch>(
    {
      id: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      type: {
        type: String,
        enum: ['Flagship', 'Experience Hub', 'Boutique', 'Outlet'],
        required: true,
      },
      address: { type: String, required: true },
      city: { type: String, required: true },
      managerName: { type: String, required: true },
      sqFootage: { type: Number, required: true },
      activeStaffCount: { type: Number, required: true },
      monthlyTargetBDT: { type: Number, required: true },
      mtdSalesBDT: { type: Number, required: true },
      footfallConversionRate: { type: Number, required: true },
    },
    { timestamps: true }
  )
);

export const StaffMemberModel = model<StaffMember>(
  'StaffMember',
  new Schema<StaffMember>(
    {
      id: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      role: {
        type: String,
        enum: [
          'Store Manager',
          'Senior Fashion Stylist',
          'Sales Associate',
          'Visual Merchandiser',
          'Inventory Lead',
        ],
        required: true,
      },
      branchId: { type: String, required: true },
      branchName: { type: String, required: true },
      joinedDate: { type: String, required: true },
      monthlyTargetBDT: { type: Number, required: true },
      achievedSalesBDT: { type: Number, default: 0 },
      commissionRate: { type: Number, required: true },
      rating: { type: Number, default: 5.0 },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    { timestamps: true }
  )
);

export const StaffShiftScheduleModel = model<StaffShiftSchedule>(
  'StaffShiftSchedule',
  new Schema<StaffShiftSchedule>(
    {
      staffId: { type: String, required: true, unique: true },
      staffName: { type: String, required: true },
      branchId: { type: String, required: true },
      schedule: {
        Mon: { type: String, enum: ['Morning', 'Evening', 'Full Day', 'Off Day'] },
        Tue: { type: String, enum: ['Morning', 'Evening', 'Full Day', 'Off Day'] },
        Wed: { type: String, enum: ['Morning', 'Evening', 'Full Day', 'Off Day'] },
        Thu: { type: String, enum: ['Morning', 'Evening', 'Full Day', 'Off Day'] },
        Fri: { type: String, enum: ['Morning', 'Evening', 'Full Day', 'Off Day'] },
        Sat: { type: String, enum: ['Morning', 'Evening', 'Full Day', 'Off Day'] },
        Sun: { type: String, enum: ['Morning', 'Evening', 'Full Day', 'Off Day'] },
      },
    },
    { timestamps: true }
  )
);

export const CandidateProfileModel = model<CandidateProfile>(
  'CandidateProfile',
  new Schema<CandidateProfile>(
    {
      id: { type: String, required: true, unique: true },
      fullName: { type: String, required: true },
      applyingForRole: { type: String, required: true },
      experienceYears: { type: Number, required: true },
      currentStage: {
        type: String,
        enum: [
          'Applied',
          'Screening',
          '1st Round',
          'Skill Assessment',
          'Final Interview',
          'Offer Sent',
          'Hired',
          'Archived',
        ],
        default: 'Applied',
      },
      appliedDate: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      matchScore: { type: Number, default: 0 },
      extractedSkills: [{ type: String }],
      missingSkills: [{ type: String }],
      resumeSummary: { type: String, default: '' },
      evaluations: [
        {
          interviewer: { type: String, required: true },
          date: { type: String, required: true },
          communicationRating: { type: Number, min: 1, max: 5 },
          retailKnowledgeRating: { type: Number, min: 1, max: 5 },
          salesAgilityRating: { type: Number, min: 1, max: 5 },
          leadershipRating: { type: Number, min: 1, max: 5 },
          culturalFitRating: { type: Number, min: 1, max: 5 },
          recommendation: { type: String, enum: ['Strong Hire', 'Hire', 'On Hold', 'Reject'] },
          feedbackNotes: { type: String, default: '' },
        },
      ],
    },
    { timestamps: true }
  )
);

export const JobOpeningModel = model<JobOpening>(
  'JobOpening',
  new Schema<JobOpening>(
    {
      id: { type: String, required: true, unique: true },
      title: { type: String, required: true },
      department: {
        type: String,
        enum: ['Retail Operations', 'Manufacturing & QC', 'Supply Chain', 'Fashion Design'],
        required: true,
      },
      openPositions: { type: Number, required: true },
      branch: { type: String, required: true },
      status: { type: String, enum: ['Active', 'Draft', 'Closed'], default: 'Active' },
      requiredSkills: [{ type: String }],
    },
    { timestamps: true }
  )
);
