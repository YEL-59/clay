import { Request, Response } from 'express';
import { inMemoryStore } from '../data/inMemoryStore';

// --- MANUFACTURER PORTAL ---
export const getBatches = (_req: Request, res: Response): void => {
  const batches = inMemoryStore.getBatches();
  res.status(200).json({ success: true, data: batches, count: batches.length });
};

export const createBatch = (req: Request, res: Response): void => {
  const batch = inMemoryStore.createBatch(req.body);
  res.status(201).json({ success: true, data: batch, message: 'Production batch initialized' });
};

export const updateBatchStage = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { stage, progress } = req.body;
  const updated = inMemoryStore.updateBatchStage(id, stage, progress);

  if (!updated) {
    res.status(404).json({ success: false, error: `Batch '${id}' was not found`, statusCode: 404 });
    return;
  }
  res.status(200).json({ success: true, data: updated, message: `Batch progressed to ${stage}` });
};

export const getSuppliers = (_req: Request, res: Response): void => {
  const suppliers = inMemoryStore.getSuppliers();
  res.status(200).json({ success: true, data: suppliers, count: suppliers.length });
};

export const getPurchaseOrders = (_req: Request, res: Response): void => {
  const pos = inMemoryStore.getPurchaseOrders();
  res.status(200).json({ success: true, data: pos, count: pos.length });
};

export const createPurchaseOrder = (req: Request, res: Response): void => {
  const po = inMemoryStore.createPurchaseOrder(req.body);
  res.status(201).json({ success: true, data: po, message: 'Purchase Order issued' });
};

export const getQcLogs = (_req: Request, res: Response): void => {
  const logs = inMemoryStore.getQcLogs();
  res.status(200).json({ success: true, data: logs, count: logs.length });
};

export const createQcLog = (req: Request, res: Response): void => {
  const log = inMemoryStore.createQcLog(req.body);
  res.status(201).json({ success: true, data: log, message: 'QC Audit logged' });
};

// --- STORE MANAGEMENT ---
export const getBranches = (_req: Request, res: Response): void => {
  const branches = inMemoryStore.getBranches();
  res.status(200).json({ success: true, data: branches, count: branches.length });
};

export const getStaff = (_req: Request, res: Response): void => {
  const staff = inMemoryStore.getStaff();
  res.status(200).json({ success: true, data: staff, count: staff.length });
};

export const addStaff = (req: Request, res: Response): void => {
  const staff = inMemoryStore.addStaff(req.body);
  res.status(201).json({ success: true, data: staff, message: 'Staff associate enrolled' });
};

export const updateStaffTarget = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { monthlyTargetBDT } = req.body;
  const updated = inMemoryStore.updateStaffTarget(id, monthlyTargetBDT);

  if (!updated) {
    res.status(404).json({ success: false, error: `Staff member '${id}' was not found`, statusCode: 404 });
    return;
  }
  res.status(200).json({ success: true, data: updated, message: 'Target adjusted' });
};

export const getShifts = (_req: Request, res: Response): void => {
  const shifts = inMemoryStore.getShifts();
  res.status(200).json({ success: true, data: shifts });
};

export const updateShiftSchedule = (req: Request, res: Response): void => {
  const updated = inMemoryStore.updateShiftSchedule(req.body);
  res.status(200).json({ success: true, data: updated, message: 'Shift schedule updated' });
};

// --- HR & CV CHECKER ---
export const getCandidates = (_req: Request, res: Response): void => {
  const candidates = inMemoryStore.getCandidates();
  res.status(200).json({ success: true, data: candidates, count: candidates.length });
};

export const addCandidate = (req: Request, res: Response): void => {
  const candidate = inMemoryStore.addCandidate(req.body);
  res.status(201).json({ success: true, data: candidate, message: 'Candidate added to talent pipeline' });
};

export const updateCandidateStage = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { stage } = req.body;
  const updated = inMemoryStore.updateCandidateStage(id, stage);

  if (!updated) {
    res.status(404).json({ success: false, error: `Candidate '${id}' was not found`, statusCode: 404 });
    return;
  }
  res.status(200).json({ success: true, data: updated, message: `Candidate moved to ${stage}` });
};

export const addCandidateEvaluation = (req: Request, res: Response): void => {
  const { id } = req.params;
  const updated = inMemoryStore.addCandidateEvaluation(id, req.body);

  if (!updated) {
    res.status(404).json({ success: false, error: `Candidate '${id}' was not found`, statusCode: 404 });
    return;
  }
  res.status(200).json({ success: true, data: updated, message: 'Evaluation scorecard recorded' });
};

export const getJobOpenings = (_req: Request, res: Response): void => {
  const jobs = inMemoryStore.getJobOpenings();
  res.status(200).json({ success: true, data: jobs, count: jobs.length });
};

export const analyzeCv = (req: Request, res: Response): void => {
  const { cvText, targetRole } = req.body;
  const result = inMemoryStore.analyzeCv(cvText, targetRole);
  res.status(200).json({ success: true, data: result });
};
