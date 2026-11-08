import { useSyncExternalStore } from 'react';
import {
  INITIAL_BATCHES,
  INITIAL_BRANCHES,
  INITIAL_CANDIDATES,
  INITIAL_JOB_OPENINGS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_QC_LOGS,
  INITIAL_STAFF,
  INITIAL_SUPPLIERS,
} from '../data/enterpriseData';
import {
  CandidateEvaluationScorecard,
  CandidateProfile,
  JobOpening,
  PipelineStage,
  POStatus,
  ProductionBatch,
  ProductionStage,
  PurchaseOrder,
  QcAuditLog,
  RawMaterialSupplier,
  ShiftType,
  StaffMember,
  StoreBranch,
} from '../types';
import { pushToast } from './adminStore';

const STORAGE_KEY = 'raye:enterprise:v1';

export interface EnterpriseState {
  batches: ProductionBatch[];
  suppliers: RawMaterialSupplier[];
  purchaseOrders: PurchaseOrder[];
  qcLogs: QcAuditLog[];
  branches: StoreBranch[];
  staff: StaffMember[];
  jobs: JobOpening[];
  candidates: CandidateProfile[];
}

function loadInitialEnterpriseState(): EnterpriseState {
  if (typeof window === 'undefined') {
    return {
      batches: INITIAL_BATCHES,
      suppliers: INITIAL_SUPPLIERS,
      purchaseOrders: INITIAL_PURCHASE_ORDERS,
      qcLogs: INITIAL_QC_LOGS,
      branches: INITIAL_BRANCHES,
      staff: INITIAL_STAFF,
      jobs: INITIAL_JOB_OPENINGS,
      candidates: INITIAL_CANDIDATES,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        batches: parsed.batches ?? INITIAL_BATCHES,
        suppliers: parsed.suppliers ?? INITIAL_SUPPLIERS,
        purchaseOrders: parsed.purchaseOrders ?? INITIAL_PURCHASE_ORDERS,
        qcLogs: parsed.qcLogs ?? INITIAL_QC_LOGS,
        branches: parsed.branches ?? INITIAL_BRANCHES,
        staff: parsed.staff ?? INITIAL_STAFF,
        jobs: parsed.jobs ?? INITIAL_JOB_OPENINGS,
        candidates: parsed.candidates ?? INITIAL_CANDIDATES,
      };
    }
  } catch (e) {
    console.warn('Failed to parse enterprise state from storage:', e);
  }

  return {
    batches: INITIAL_BATCHES,
    suppliers: INITIAL_SUPPLIERS,
    purchaseOrders: INITIAL_PURCHASE_ORDERS,
    qcLogs: INITIAL_QC_LOGS,
    branches: INITIAL_BRANCHES,
    staff: INITIAL_STAFF,
    jobs: INITIAL_JOB_OPENINGS,
    candidates: INITIAL_CANDIDATES,
  };
}

export let enterpriseState: EnterpriseState = loadInitialEnterpriseState();
const listeners = new Set<() => void>();

function persistAndNotify() {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(enterpriseState));
    }
  } catch (e) {
    console.warn('Failed to save enterprise state:', e);
  }
  listeners.forEach((fn) => fn());
}

export function useEnterpriseStore(): EnterpriseState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => enterpriseState
  );
}

// -------------------------------------------------------------
// Manufacturer Actions
// -------------------------------------------------------------

export const STAGE_FLOW: ProductionStage[] = [
  'Cutting',
  'Sewing',
  'Ironing',
  'QC Audit',
  'Packaging',
  'Dispatched',
];

export function advanceBatchStage(batchId: string, specificStage?: ProductionStage) {
  enterpriseState = {
    ...enterpriseState,
    batches: enterpriseState.batches.map((b) => {
      if (b.id !== batchId) return b;
      let nextStage: ProductionStage;
      if (specificStage) {
        nextStage = specificStage;
      } else {
        const curIdx = STAGE_FLOW.indexOf(b.stage);
        nextStage = curIdx < STAGE_FLOW.length - 1 ? STAGE_FLOW[curIdx + 1] : b.stage;
      }
      const stageIdx = STAGE_FLOW.indexOf(nextStage);
      const newProgress = Math.min(100, Math.round(((stageIdx + 1) / STAGE_FLOW.length) * 100));

      return {
        ...b,
        stage: nextStage,
        progress: newProgress,
      };
    }),
  };
  persistAndNotify();
  pushToast(`Batch ${batchId} advanced to stage.`);
}

export function addProductionBatch(batch: Omit<ProductionBatch, 'id' | 'progress'>) {
  const newId = `BATCH-2026-${String(enterpriseState.batches.length + 89).padStart(3, '0')}`;
  const stageIdx = STAGE_FLOW.indexOf(batch.stage);
  const progress = Math.round(((stageIdx + 1) / STAGE_FLOW.length) * 100);

  const fullBatch: ProductionBatch = {
    ...batch,
    id: newId,
    progress,
  };

  enterpriseState = {
    ...enterpriseState,
    batches: [fullBatch, ...enterpriseState.batches],
  };
  persistAndNotify();
  pushToast(`Created production batch ${newId}`);
}

export function updatePurchaseOrderStatus(poId: string, status: POStatus) {
  enterpriseState = {
    ...enterpriseState,
    purchaseOrders: enterpriseState.purchaseOrders.map((po) =>
      po.id === poId ? { ...po, status } : po
    ),
  };
  persistAndNotify();
  pushToast(`Purchase order ${poId} status set to ${status}`);
}

export function addPurchaseOrder(po: Omit<PurchaseOrder, 'id'>) {
  const newId = `PO-2026-${String(enterpriseState.purchaseOrders.length + 4405)}`;
  const fullPo: PurchaseOrder = {
    ...po,
    id: newId,
  };
  enterpriseState = {
    ...enterpriseState,
    purchaseOrders: [fullPo, ...enterpriseState.purchaseOrders],
  };
  persistAndNotify();
  pushToast(`Purchase order ${fullPo.poNumber} issued successfully`);
}

export function recordQcAudit(log: Omit<QcAuditLog, 'id'>) {
  const newId = `QC-${String(8820 + enterpriseState.qcLogs.length + 1)}`;
  const fullLog: QcAuditLog = {
    ...log,
    id: newId,
  };
  enterpriseState = {
    ...enterpriseState,
    qcLogs: [fullLog, ...enterpriseState.qcLogs],
  };
  persistAndNotify();
  pushToast(`Audit record ${newId} logged for batch ${log.batchId}`);
}

// -------------------------------------------------------------
// Store Management Actions
// -------------------------------------------------------------

export function updateStaffShift(staffId: string, day: string, shift: ShiftType) {
  enterpriseState = {
    ...enterpriseState,
    staff: enterpriseState.staff.map((s) => {
      if (s.id !== staffId) return s;
      return {
        ...s,
        shiftWeek: {
          ...s.shiftWeek,
          [day]: shift,
        },
      };
    }),
  };
  persistAndNotify();
  pushToast(`Updated shift schedule for ${day}`);
}

export function updateStaffTarget(staffId: string, newTargetBdt: number) {
  enterpriseState = {
    ...enterpriseState,
    staff: enterpriseState.staff.map((s) =>
      s.id === staffId ? { ...s, monthlyTargetBdt: newTargetBdt } : s
    ),
  };
  persistAndNotify();
  pushToast(`Monthly target updated to BDT ${newTargetBdt.toLocaleString()}`);
}

export function addStaffMember(member: Omit<StaffMember, 'id' | 'avatarInitial'>) {
  const newId = `STF-${String(100 + enterpriseState.staff.length + 1)}`;
  const initials = member.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

  const fullMember: StaffMember = {
    ...member,
    id: newId,
    avatarInitial: initials || 'ST',
  };

  enterpriseState = {
    ...enterpriseState,
    staff: [...enterpriseState.staff, fullMember],
    branches: enterpriseState.branches.map((b) =>
      b.id === member.branchId ? { ...b, activeStaffCount: b.activeStaffCount + 1 } : b
    ),
  };
  persistAndNotify();
  pushToast(`Added staff member ${member.name}`);
}

// -------------------------------------------------------------
// HR & CV Checker Actions
// -------------------------------------------------------------

export function updateCandidateStage(candidateId: string, stage: PipelineStage) {
  enterpriseState = {
    ...enterpriseState,
    candidates: enterpriseState.candidates.map((c) =>
      c.id === candidateId ? { ...c, stage } : c
    ),
  };
  persistAndNotify();
  pushToast(`Candidate moved to ${stage}`);
}

export function scheduleInterview(
  candidateId: string,
  interview: {
    date: string;
    time: string;
    mode: 'In-Person (Gulshan Flagship)' | 'Zoom Video Call';
    interviewers: string[];
  }
) {
  enterpriseState = {
    ...enterpriseState,
    candidates: enterpriseState.candidates.map((c) => {
      if (c.id !== candidateId) return c;
      const nextStage: PipelineStage =
        c.stage === 'Applied' || c.stage === 'Screening' ? '1st Round' : c.stage;
      return {
        ...c,
        stage: nextStage,
        scheduledInterview: interview,
      };
    }),
  };
  persistAndNotify();
  pushToast(`Interview scheduled for ${interview.date} at ${interview.time}`);
}

export function submitCandidateScorecard(
  candidateId: string,
  scorecard: CandidateEvaluationScorecard
) {
  enterpriseState = {
    ...enterpriseState,
    candidates: enterpriseState.candidates.map((c) => {
      if (c.id !== candidateId) return c;
      const nextStage: PipelineStage =
        scorecard.decision === 'Strong Hire' || scorecard.decision === 'Hire'
          ? 'Offer Sent'
          : c.stage;
      return {
        ...c,
        stage: nextStage,
        scorecard,
      };
    }),
  };
  persistAndNotify();
  pushToast(`Evaluation scorecard submitted (${scorecard.decision})`);
}

/**
 * Intelligent Keyword & Skill Match Analyzer
 */
export function analyzeCvMatch(cvText: string, targetJobId: string): {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchedKeywords: string[];
  summary: string;
} {
  const job = enterpriseState.jobs.find((j) => j.id === targetJobId) || enterpriseState.jobs[0];
  const lowerText = cvText.toLowerCase();

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  const matchedKeywords: string[] = [];

  for (const skill of job.requiredSkills) {
    const parts = skill.toLowerCase().split(' ');
    // Match if full skill string or 50%+ of subwords appear in text
    const hasFull = lowerText.includes(skill.toLowerCase());
    const matchedParts = parts.filter((p) => p.length > 2 && lowerText.includes(p));
    if (hasFull || matchedParts.length >= Math.ceil(parts.length / 2)) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  for (const kw of job.targetKeywords) {
    if (lowerText.includes(kw.toLowerCase())) {
      matchedKeywords.push(kw);
    }
  }

  // Calculate weighted score: 70% required skills + 30% target keywords
  const skillRatio = job.requiredSkills.length > 0 ? matchedSkills.length / job.requiredSkills.length : 1;
  const kwRatio = job.targetKeywords.length > 0 ? matchedKeywords.length / job.targetKeywords.length : 1;
  const rawScore = skillRatio * 70 + kwRatio * 30;
  const score = Math.max(25, Math.min(99, Math.round(rawScore)));

  const summary = `Resume contains ${matchedSkills.length} of ${job.requiredSkills.length} core competencies for "${job.title}". Matched ${matchedKeywords.length} retail/technical industry keywords. Fit assessment indicates ${
    score >= 85 ? 'Strong Candidate for immediate interview' : score >= 70 ? 'Viable candidate meeting baseline qualifications' : 'Substantial skill gaps detected against job profile'
  }.`;

  return {
    score,
    matchedSkills,
    missingSkills,
    matchedKeywords,
    summary,
  };
}

export function addCandidateFromCV(candidate: Omit<CandidateProfile, 'id' | 'appliedDate'>) {
  const newId = `CAND-${String(500 + enterpriseState.candidates.length + 1)}`;
  const now = new Date().toISOString().split('T')[0];

  const fullCandidate: CandidateProfile = {
    ...candidate,
    id: newId,
    appliedDate: now,
  };

  enterpriseState = {
    ...enterpriseState,
    candidates: [fullCandidate, ...enterpriseState.candidates],
  };
  persistAndNotify();
  pushToast(`Candidate ${candidate.name} added to pipeline`);
  return fullCandidate;
}

export function resetEnterpriseData() {
  enterpriseState = {
    batches: INITIAL_BATCHES,
    suppliers: INITIAL_SUPPLIERS,
    purchaseOrders: INITIAL_PURCHASE_ORDERS,
    qcLogs: INITIAL_QC_LOGS,
    branches: INITIAL_BRANCHES,
    staff: INITIAL_STAFF,
    jobs: INITIAL_JOB_OPENINGS,
    candidates: INITIAL_CANDIDATES,
  };
  persistAndNotify();
  pushToast('Enterprise demo data reset to default seed.');
}
