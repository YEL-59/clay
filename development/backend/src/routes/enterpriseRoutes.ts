import { Router } from 'express';
import {
  addCandidate,
  addCandidateEvaluation,
  addStaff,
  analyzeCv,
  createBatch,
  createPurchaseOrder,
  createQcLog,
  getBatches,
  getBranches,
  getCandidates,
  getJobOpenings,
  getPurchaseOrders,
  getQcLogs,
  getShifts,
  getStaff,
  getSuppliers,
  updateBatchStage,
  updateCandidateStage,
  updateShiftSchedule,
  updateStaffTarget,
} from '../controllers/enterpriseController';
import { validate } from '../middleware/validate';
import {
  addCandidateSchema,
  addEvaluationSchema,
  addStaffSchema,
  analyzeCvSchema,
  createBatchSchema,
  createPoSchema,
  createQcLogSchema,
  updateBatchStageSchema,
  updateCandidateStageSchema,
  updateShiftScheduleSchema,
  updateStaffTargetSchema,
} from '../validators';

const router = Router();

// Manufacturer Portal
router.get('/manufacturer/batches', getBatches);
router.post('/manufacturer/batches', validate(createBatchSchema), createBatch);
router.patch('/manufacturer/batches/:id/stage', validate(updateBatchStageSchema), updateBatchStage);
router.get('/manufacturer/suppliers', getSuppliers);
router.get('/manufacturer/pos', getPurchaseOrders);
router.post('/manufacturer/pos', validate(createPoSchema), createPurchaseOrder);
router.get('/manufacturer/qc', getQcLogs);
router.post('/manufacturer/qc', validate(createQcLogSchema), createQcLog);

// Store Management
router.get('/stores/branches', getBranches);
router.get('/stores/staff', getStaff);
router.post('/stores/staff', validate(addStaffSchema), addStaff);
router.patch('/stores/staff/:id/target', validate(updateStaffTargetSchema), updateStaffTarget);
router.get('/stores/shifts', getShifts);
router.put('/stores/shifts', validate(updateShiftScheduleSchema), updateShiftSchedule);

// HR Management & CV Checker
router.get('/hr/candidates', getCandidates);
router.post('/hr/candidates', validate(addCandidateSchema), addCandidate);
router.patch('/hr/candidates/:id/stage', validate(updateCandidateStageSchema), updateCandidateStage);
router.post('/hr/candidates/:id/evaluations', validate(addEvaluationSchema), addCandidateEvaluation);
router.get('/hr/jobs', getJobOpenings);
router.post('/hr/analyze-cv', validate(analyzeCvSchema), analyzeCv);

export default router;
