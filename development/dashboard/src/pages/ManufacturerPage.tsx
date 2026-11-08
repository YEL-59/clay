import React, { useMemo, useState } from 'react';
import { Icon } from '../components/ui/Icon';
import {
  Card,
  Drawer,
  Modal,
  PageHeader,
  SegmentedControl,
  StatItem,
} from '../components/ui/Primitives';
import {
  addProductionBatch,
  addPurchaseOrder,
  advanceBatchStage,
  recordQcAudit,
  STAGE_FLOW,
  updatePurchaseOrderStatus,
  useEnterpriseStore,
} from '../store/enterpriseStore';
import {
  POStatus,
  ProductCategory,
  ProductionBatch,
  ProductionStage,
  PurchaseOrder,
  RawMaterialSupplier,
} from '../types';
import { formatBDT, formatCompactBDT } from '../utils/format';

export const ManufacturerPage: React.FC = () => {
  const store = useEnterpriseStore();
  const [activeTab, setActiveTab] = useState<'batches' | 'orders' | 'suppliers' | 'qc'>('batches');
  const [stageFilter, setStageFilter] = useState<'All' | ProductionStage>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected batch for detail drawer
  const [selectedBatch, setSelectedBatch] = useState<ProductionBatch | null>(null);

  // Modals
  const [newBatchModalOpen, setNewBatchModalOpen] = useState(false);
  const [newPoModalOpen, setNewPoModalOpen] = useState(false);
  const [newQcModalOpen, setNewQcModalOpen] = useState(false);

  // Form states for New Batch
  const [batchForm, setBatchForm] = useState({
    styleName: '',
    category: 'long' as ProductCategory,
    targetUnits: 1000,
    stage: 'Cutting' as ProductionStage,
    factory: 'Gazipur StitchCraft Ltd. (Unit 3)',
    leadMaster: 'Kabir Hossain',
    colorway: 'Sky Blue Stripe',
    assignedFabric: '100% GOTS Organic Cotton 40s',
    estimatedCompletion: '2026-11-20',
    notes: '',
  });

  // Form states for New PO
  const [poForm, setPoForm] = useState({
    poNumber: `PO-TEX-${Math.floor(4400 + Math.random() * 900)}`,
    supplierName: 'Padma Spinning & Weaving Mills',
    supplierCategory: 'Fabric Mill',
    description: '100% Organic Combed Yarn 40s',
    qty: 2000,
    unitPrice: 420,
    deliveryDueDate: '2026-11-25',
    remarks: 'Approved lab dips batch #904',
  });

  // Form states for QC Audit
  const [qcForm, setQcForm] = useState({
    batchId: store.batches[0]?.id || 'BATCH-2026-088',
    inspector: 'Afzal Rahman (Lead Auditor)',
    inspectedUnits: 200,
    passedUnits: 196,
    defectsText: 'Collar point asymmetry (1.5mm): 2 units\nButtonhole thread tail: 2 units',
    status: 'Passed' as 'Passed' | 'Conditional' | 'Rejected',
  });

  // Summary Metrics
  const totalUnitsInProgress = useMemo(
    () => store.batches.reduce((sum, b) => (b.stage !== 'Dispatched' ? sum + b.targetUnits : sum), 0),
    [store.batches]
  );

  const totalPoValue = useMemo(
    () => store.purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0),
    [store.purchaseOrders]
  );

  const avgQcPassRate = useMemo(() => {
    if (store.qcLogs.length === 0) return 98;
    const sum = store.qcLogs.reduce((acc, q) => acc + q.passRate, 0);
    return Math.round((sum / store.qcLogs.length) * 10) / 10;
  }, [store.qcLogs]);

  const filteredBatches = useMemo(() => {
    return store.batches.filter((b) => {
      const matchStage = stageFilter === 'All' || b.stage === stageFilter;
      const matchQuery =
        !searchQuery ||
        b.styleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.factory.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStage && matchQuery;
    });
  }, [store.batches, stageFilter, searchQuery]);

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchForm.styleName) return;
    addProductionBatch({
      ...batchForm,
      startDate: new Date().toISOString().split('T')[0],
    });
    setNewBatchModalOpen(false);
  };

  const handleCreatePo = (e: React.FormEvent) => {
    e.preventDefault();
    const itemTotal = poForm.qty * poForm.unitPrice;
    addPurchaseOrder({
      poNumber: poForm.poNumber,
      supplierName: poForm.supplierName,
      supplierCategory: poForm.supplierCategory,
      items: [
        {
          description: poForm.description,
          qty: Number(poForm.qty),
          unitPrice: Number(poForm.unitPrice),
          total: itemTotal,
        },
      ],
      totalAmount: itemTotal,
      status: 'Issued',
      issuedDate: new Date().toISOString().split('T')[0],
      deliveryDueDate: poForm.deliveryDueDate,
      paymentStatus: 'Advance 50%',
      remarks: poForm.remarks,
    });
    setNewPoModalOpen(false);
  };

  const handleCreateQc = (e: React.FormEvent) => {
    e.preventDefault();
    const inspected = Number(qcForm.inspectedUnits);
    const passed = Number(qcForm.passedUnits);
    const failed = Math.max(0, inspected - passed);
    const passRate = inspected > 0 ? Math.round((passed / inspected) * 1000) / 10 : 100;
    const defects = qcForm.defectsText
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean);

    recordQcAudit({
      batchId: qcForm.batchId,
      inspector: qcForm.inspector,
      inspectedUnits: inspected,
      passedUnits: passed,
      failedUnits: failed,
      passRate,
      defects,
      status: qcForm.status,
      auditDate: new Date().toISOString().split('T')[0],
    });
    setNewQcModalOpen(false);
  };

  return (
    <div className="manuf-page" data-in>
      <PageHeader
        title={['Factory', '&', 'Manufacturer', 'Portal']}
        stats={
          <>
            <StatItem
              icon="factory"
              value={totalUnitsInProgress}
              label="Garments in active production"
              fmt={(v) => `${v.toLocaleString()} pcs`}
            />
            <StatItem
              icon="bag"
              value={totalPoValue}
              label="Total Factory Purchase Orders"
              fmt={(v) => formatCompactBDT(v)}
            />
            <StatItem
              icon="fileCheck"
              value={avgQcPassRate}
              label="Quality audit pass rate"
              fmt={(v) => `${v}%`}
            />
          </>
        }
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setNewPoModalOpen(true)}
            >
              <Icon name="plus" size={15} /> Issue PO
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setNewQcModalOpen(true)}
            >
              <Icon name="check" size={15} /> Log QC Audit
            </button>
            <button
              type="button"
              className="btn btn--ink btn--sm"
              onClick={() => setNewBatchModalOpen(true)}
            >
              <Icon name="plus" size={15} /> New Batch
            </button>
          </div>
        }
      />

      {/* Primary Module Tabs */}
      <div className="toolbar">
        <SegmentedControl
          label="Manufacturer Subsections"
          value={activeTab}
          options={[
            { id: 'batches', label: `Batches (${store.batches.length})` },
            { id: 'orders', label: `Purchase Orders (${store.purchaseOrders.length})` },
            { id: 'suppliers', label: `Material Suppliers (${store.suppliers.length})` },
            { id: 'qc', label: `QC Inspection Audits (${store.qcLogs.length})` },
          ]}
          onChange={(tab) => setActiveTab(tab)}
        />
        <div className="toolbar__spacer" />
        <div className="search">
          <Icon name="search" />
          <input
            type="search"
            placeholder="Search batches, mills, POs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. Production Batches View                                    */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'batches' && (
        <div className="space-y-4">
          <div className="chips">
            <span className="text-xs font-semibold text-muted self-center mr-2">Filter Stage:</span>
            {(['All', ...STAGE_FLOW] as const).map((st) => (
              <button
                key={st}
                type="button"
                className="chip"
                aria-pressed={stageFilter === st}
                onClick={() => setStageFilter(st)}
              >
                {st}
                {st !== 'All' && (
                  <span className="ml-1 text-2xs opacity-70">
                    ({store.batches.filter((b) => b.stage === st).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBatches.map((batch) => (
              <Card
                key={batch.id}
                className="hover:shadow-md transition-all cursor-pointer"
                title={
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono text-xs opacity-75">{batch.id}</span>
                    <span
                      className={`badge ${
                        batch.stage === 'QC Audit'
                          ? 'badge--coral'
                          : batch.stage === 'Packaging' || batch.stage === 'Dispatched'
                          ? 'badge--teal'
                          : 'badge--plain'
                      }`}
                    >
                      {batch.stage}
                    </span>
                  </div>
                }
              >
                <div onClick={() => setSelectedBatch(batch)} className="space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-text line-clamp-1">{batch.styleName}</h3>
                    <p className="text-xs text-muted mt-0.5">{batch.factory}</p>
                  </div>

                  <div className="bg-well rounded-xl p-3 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-muted">Target Quantity:</span>
                      <span className="font-semibold">{batch.targetUnits.toLocaleString()} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Assigned Fabric:</span>
                      <span className="font-medium text-right line-clamp-1 max-w-[170px]">
                        {batch.assignedFabric}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Colorway:</span>
                      <span className="font-medium">{batch.colorway}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Master Craftsman:</span>
                      <span className="font-medium">{batch.leadMaster}</span>
                    </div>
                  </div>

                  {/* Progress Bar with Steps */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-2xs font-semibold text-muted">
                      <span>Pipeline Progress</span>
                      <span>{batch.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-well rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal transition-all duration-500 rounded-full"
                        style={{ width: `${batch.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-line text-xs">
                    <span className="text-muted flex items-center gap-1">
                      <Icon name="clock" size={13} /> Due: {batch.estimatedCompletion}
                    </span>
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm py-1 px-3 text-2xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        advanceBatchStage(batch.id);
                      }}
                    >
                      Advance <Icon name="arrowR" size={12} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. Purchase Orders (PO) View                                  */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'orders' && (
        <Card
          title="Factory Purchase Orders (POs)"
          sub="Contractual manufacturing and material orders with supplier lead times"
          tools={
            <button
              type="button"
              className="btn btn--ink btn--sm"
              onClick={() => setNewPoModalOpen(true)}
            >
              <Icon name="plus" size={14} /> New Purchase Order
            </button>
          }
        >
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Supplier / Mill</th>
                  <th>Category</th>
                  <th>Items Description</th>
                  <th className="r">Total Amount</th>
                  <th>Delivery Due</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th className="r">Action</th>
                </tr>
              </thead>
              <tbody>
                {store.purchaseOrders.map((po) => (
                  <tr key={po.id}>
                    <td>
                      <b className="font-mono text-xs">{po.poNumber}</b>
                      <small className="block text-2xs text-muted">Issued: {po.issuedDate}</small>
                    </td>
                    <td>
                      <span className="font-semibold block">{po.supplierName}</span>
                    </td>
                    <td>
                      <span className="badge badge--plain text-2xs">{po.supplierCategory}</span>
                    </td>
                    <td>
                      <div className="text-xs max-w-xs truncate">
                        {po.items.map((i) => `${i.description} (${i.qty.toLocaleString()} pcs)`).join(', ')}
                      </div>
                    </td>
                    <td className="r">
                      <b className="text-sm font-semibold">{formatBDT(po.totalAmount)}</b>
                    </td>
                    <td>
                      <span className="text-xs text-muted flex items-center gap-1">
                        <Icon name="calendar" size={13} /> {po.deliveryDueDate}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                          po.paymentStatus === 'Paid'
                            ? 'bg-good/20 text-good'
                            : po.paymentStatus === 'Advance 50%'
                            ? 'bg-sky/30 text-ink'
                            : 'bg-bad/20 text-bad'
                        }`}
                      >
                        {po.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          po.status === 'Completed'
                            ? 'badge--teal'
                            : po.status === 'In Production'
                            ? 'badge--coral'
                            : 'badge--plain'
                        }`}
                      >
                        {po.status}
                      </span>
                    </td>
                    <td className="r">
                      {po.status !== 'Completed' && (
                        <button
                          type="button"
                          className="btn btn--ghost btn--sm py-1 px-2.5 text-2xs"
                          onClick={() => {
                            const next: POStatus =
                              po.status === 'Issued'
                                ? 'In Production'
                                : po.status === 'In Production'
                                ? 'Inspected'
                                : 'Completed';
                            updatePurchaseOrderStatus(po.id, next);
                          }}
                        >
                          Mark Next Status
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. Raw Material Suppliers View                                */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {store.suppliers.map((sup) => (
            <Card key={sup.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="badge badge--plain text-2xs mb-1">{sup.category}</span>
                  <h3 className="font-bold text-base text-text">{sup.name}</h3>
                  <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                    <Icon name="home" size={13} /> {sup.location}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-well px-2 py-1 rounded-lg">
                  <Icon name="star" size={13} className="text-coral" />
                  <span className="text-xs font-bold">{sup.rating}</span>
                </div>
              </div>

              <div className="bg-well rounded-xl p-3 text-xs space-y-2">
                <div>
                  <span className="text-muted block text-2xs">Materials Supplied:</span>
                  <p className="font-semibold mt-0.5">{sup.materialSupplied}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-line">
                  <div>
                    <span className="text-muted block text-2xs">Lead Time:</span>
                    <b className="text-xs">{sup.leadTimeDays} days</b>
                  </div>
                  <div>
                    <span className="text-muted block text-2xs">Minimum Order:</span>
                    <b className="text-xs">{sup.moq}</b>
                  </div>
                </div>
              </div>

              <div className="pt-1 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-muted">
                  <Icon name="users" size={13} /> {sup.contactPerson}
                </div>
                <div className="flex items-center gap-1.5 text-muted">
                  <Icon name="phone" size={13} /> {sup.phone}
                </div>
                <div className="flex items-center gap-1.5 text-muted truncate">
                  <Icon name="mail" size={13} /> {sup.email}
                </div>
              </div>

              <div className="pt-2 border-t border-line flex justify-between items-center">
                <span className="text-xs font-semibold text-text">
                  Approx. {formatBDT(sup.unitPriceBdt)} / unit
                </span>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm py-1 px-3 text-2xs"
                  onClick={() => {
                    setPoForm({
                      ...poForm,
                      supplierName: sup.name,
                      supplierCategory: sup.category,
                      description: sup.materialSupplied,
                    });
                    setNewPoModalOpen(true);
                  }}
                >
                  Create PO
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. QC Inspection Audits View                                  */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'qc' && (
        <Card
          title="Quality Control (QC) Inspection Audits"
          sub="Defect tracking, tolerance audits, and lab specimen verifications"
          tools={
            <button
              type="button"
              className="btn btn--ink btn--sm"
              onClick={() => setNewQcModalOpen(true)}
            >
              <Icon name="plus" size={14} /> Record QC Audit
            </button>
          }
        >
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Audit ID</th>
                  <th>Batch ID</th>
                  <th>Inspector</th>
                  <th>Inspected Units</th>
                  <th>Passed / Failed</th>
                  <th>Pass Rate</th>
                  <th>Defect Analysis</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {store.qcLogs.map((qc) => (
                  <tr key={qc.id}>
                    <td>
                      <b className="font-mono text-xs">{qc.id}</b>
                      <small className="block text-2xs text-muted">{qc.auditDate}</small>
                    </td>
                    <td>
                      <span className="font-mono text-xs font-semibold">{qc.batchId}</span>
                    </td>
                    <td>
                      <span className="font-semibold">{qc.inspector}</span>
                    </td>
                    <td>{qc.inspectedUnits} pcs sampled</td>
                    <td>
                      <span className="text-good font-semibold">{qc.passedUnits} passed</span>
                      <span className="text-muted mx-1">/</span>
                      <span className="text-bad font-semibold">{qc.failedUnits} defects</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <b className="text-sm font-bold">{qc.passRate}%</b>
                        <div className="w-16 h-1.5 bg-well rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              qc.passRate >= 97 ? 'bg-good' : qc.passRate >= 92 ? 'bg-coral' : 'bg-bad'
                            }`}
                            style={{ width: `${qc.passRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <ul className="text-2xs text-muted list-disc list-inside max-w-sm">
                        {qc.defects.map((def, idx) => (
                          <li key={idx}>{def}</li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          qc.status === 'Passed'
                            ? 'badge--teal'
                            : qc.status === 'Conditional'
                            ? 'badge--coral'
                            : 'badge--plain text-bad'
                        }`}
                      >
                        {qc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Batch Detail Drawer                                           */}
      {/* ------------------------------------------------------------- */}
      <Drawer
        open={Boolean(selectedBatch)}
        onClose={() => setSelectedBatch(null)}
        title={selectedBatch?.styleName || 'Production Batch'}
        sub={selectedBatch ? `Batch ID: ${selectedBatch.id}` : ''}
        foot={
          selectedBatch && (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-muted">
                Status: <strong className="text-text">{selectedBatch.stage}</strong>
              </span>
              <button
                type="button"
                className="btn btn--ink btn--sm"
                onClick={() => {
                  advanceBatchStage(selectedBatch.id);
                  const updated = store.batches.find((b) => b.id === selectedBatch.id);
                  if (updated) setSelectedBatch(updated);
                }}
              >
                Advance to Next Stage <Icon name="arrowR" size={14} />
              </button>
            </div>
          )
        }
      >
        {selectedBatch && (
          <div className="space-y-4">
            <div className="bg-well rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-line">
                <span className="text-muted">Target Production:</span>
                <span className="font-bold text-sm">
                  {selectedBatch.targetUnits.toLocaleString()} units
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-line">
                <span className="text-muted">Manufacturing Facility:</span>
                <span className="font-semibold">{selectedBatch.factory}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-line">
                <span className="text-muted">Master Craftsman:</span>
                <span className="font-semibold">{selectedBatch.leadMaster}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-line">
                <span className="text-muted">Colorway / Palette:</span>
                <span className="font-semibold">{selectedBatch.colorway}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-line">
                <span className="text-muted">Assigned Fabric & Weave:</span>
                <span className="font-semibold text-right">{selectedBatch.assignedFabric}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-line">
                <span className="text-muted">Start Date:</span>
                <span className="font-semibold">{selectedBatch.startDate}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted">Estimated Delivery:</span>
                <span className="font-semibold text-coral">{selectedBatch.estimatedCompletion}</span>
              </div>
            </div>

            {/* Stages Stepper */}
            <div>
              <h4 className="text-xs font-bold text-text uppercase tracking-wider mb-2">
                Garment Construction Pipeline
              </h4>
              <div className="space-y-2">
                {STAGE_FLOW.map((st, idx) => {
                  const currentIdx = STAGE_FLOW.indexOf(selectedBatch.stage);
                  const isDone = idx < currentIdx;
                  const isCurrent = idx === currentIdx;
                  return (
                    <div
                      key={st}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                        isCurrent
                          ? 'border-coral bg-coral/10 font-bold'
                          : isDone
                          ? 'border-line bg-well opacity-80'
                          : 'border-line/40 opacity-40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-2xs font-bold ${
                            isCurrent
                              ? 'bg-coral text-on-coral'
                              : isDone
                              ? 'bg-good text-white'
                              : 'bg-well text-muted'
                          }`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </span>
                        <span>{st}</span>
                      </div>
                      {isCurrent && (
                        <span className="badge badge--coral text-2xs">Active Phase</span>
                      )}
                      {isDone && <span className="text-good font-semibold text-2xs">Completed</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedBatch.notes && (
              <div className="bg-sand/20 rounded-xl p-3 text-xs">
                <span className="font-bold text-ink block mb-0.5">Manufacturing & Cutting Note:</span>
                <p className="text-muted leading-relaxed">{selectedBatch.notes}</p>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* ------------------------------------------------------------- */}
      {/* New Batch Modal                                               */}
      {/* ------------------------------------------------------------- */}
      <Modal
        open={newBatchModalOpen}
        onClose={() => setNewBatchModalOpen(false)}
        title="Schedule New Production Batch"
      >
        <form onSubmit={handleCreateBatch} className="mform">
          <div className="field">
            <label className="field__label">Garment Style Name</label>
            <input
              type="text"
              className="input"
              required
              placeholder="e.g. Seaside Linen Oversized Drop"
              value={batchForm.styleName}
              onChange={(e) => setBatchForm({ ...batchForm, styleName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="field">
              <label className="field__label">Category</label>
              <select
                className="input"
                value={batchForm.category}
                onChange={(e) =>
                  setBatchForm({ ...batchForm, category: e.target.value as ProductCategory })
                }
              >
                <option value="short">Short Sleeve</option>
                <option value="long">Long Sleeve</option>
                <option value="oversized">Oversized</option>
              </select>
            </div>
            <div className="field">
              <label className="field__label">Target Units</label>
              <input
                type="number"
                className="input"
                required
                min={100}
                value={batchForm.targetUnits}
                onChange={(e) =>
                  setBatchForm({ ...batchForm, targetUnits: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="field">
              <label className="field__label">Partner Factory</label>
              <select
                className="input"
                value={batchForm.factory}
                onChange={(e) => setBatchForm({ ...batchForm, factory: e.target.value })}
              >
                <option value="Gazipur StitchCraft Ltd. (Unit 3)">Gazipur StitchCraft (Unit 3)</option>
                <option value="Narayanganj TexHub Apparel">Narayanganj TexHub Apparel</option>
                <option value="Savar EcoApparel Complex">Savar EcoApparel Complex</option>
              </select>
            </div>
            <div className="field">
              <label className="field__label">Master Tailor</label>
              <input
                type="text"
                className="input"
                required
                value={batchForm.leadMaster}
                onChange={(e) => setBatchForm({ ...batchForm, leadMaster: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="field">
              <label className="field__label">Colorway</label>
              <input
                type="text"
                className="input"
                placeholder="Sky Blue Stripe"
                value={batchForm.colorway}
                onChange={(e) => setBatchForm({ ...batchForm, colorway: e.target.value })}
              />
            </div>
            <div className="field">
              <label className="field__label">Estimated Delivery</label>
              <input
                type="date"
                className="input"
                value={batchForm.estimatedCompletion}
                onChange={(e) =>
                  setBatchForm({ ...batchForm, estimatedCompletion: e.target.value })
                }
              />
            </div>
          </div>

          <div className="field">
            <label className="field__label">Fabric Specification</label>
            <input
              type="text"
              className="input"
              value={batchForm.assignedFabric}
              onChange={(e) => setBatchForm({ ...batchForm, assignedFabric: e.target.value })}
            />
          </div>

          <div className="field">
            <label className="field__label">Craftsman Notes (Optional)</label>
            <textarea
              className="input h-20 py-2"
              placeholder="e.g. Needle pitch, thread gauge, special washes..."
              value={batchForm.notes}
              onChange={(e) => setBatchForm({ ...batchForm, notes: e.target.value })}
            />
          </div>

          <div className="mform__foot">
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setNewBatchModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn--ink btn--sm">
              Initiate Production
            </button>
          </div>
        </form>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* New Purchase Order Modal                                      */}
      {/* ------------------------------------------------------------- */}
      <Modal
        open={newPoModalOpen}
        onClose={() => setNewPoModalOpen(false)}
        title="Issue Factory Purchase Order (PO)"
      >
        <form onSubmit={handleCreatePo} className="mform">
          <div className="grid grid-cols-2 gap-3">
            <div className="field">
              <label className="field__label">PO Reference Number</label>
              <input
                type="text"
                className="input font-mono"
                required
                value={poForm.poNumber}
                onChange={(e) => setPoForm({ ...poForm, poNumber: e.target.value })}
              />
            </div>
            <div className="field">
              <label className="field__label">Delivery Due Date</label>
              <input
                type="date"
                className="input"
                required
                value={poForm.deliveryDueDate}
                onChange={(e) => setPoForm({ ...poForm, deliveryDueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="field">
            <label className="field__label">Supplier / Textile Mill</label>
            <select
              className="input"
              value={poForm.supplierName}
              onChange={(e) => {
                const s = store.suppliers.find((sup) => sup.name === e.target.value);
                setPoForm({
                  ...poForm,
                  supplierName: e.target.value,
                  supplierCategory: s?.category || 'Fabric Mill',
                });
              }}
            >
              {store.suppliers.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="field__label">Items Description</label>
            <input
              type="text"
              className="input"
              required
              value={poForm.description}
              onChange={(e) => setPoForm({ ...poForm, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="field">
              <label className="field__label">Quantity (meters / pcs)</label>
              <input
                type="number"
                className="input"
                required
                min={1}
                value={poForm.qty}
                onChange={(e) => setPoForm({ ...poForm, qty: Number(e.target.value) })}
              />
            </div>
            <div className="field">
              <label className="field__label">Unit Price (BDT)</label>
              <input
                type="number"
                className="input"
                required
                min={1}
                value={poForm.unitPrice}
                onChange={(e) => setPoForm({ ...poForm, unitPrice: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="bg-well rounded-xl p-3 flex justify-between items-center text-xs">
            <span className="text-muted">Calculated PO Value:</span>
            <b className="text-base text-text">{formatBDT(poForm.qty * poForm.unitPrice)}</b>
          </div>

          <div className="mform__foot">
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setNewPoModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn--ink btn--sm">
              Issue Purchase Order
            </button>
          </div>
        </form>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* Log QC Audit Modal                                            */}
      {/* ------------------------------------------------------------- */}
      <Modal
        open={newQcModalOpen}
        onClose={() => setNewQcModalOpen(false)}
        title="Record Garment Quality Audit"
      >
        <form onSubmit={handleCreateQc} className="mform">
          <div className="grid grid-cols-2 gap-3">
            <div className="field">
              <label className="field__label">Production Batch</label>
              <select
                className="input"
                value={qcForm.batchId}
                onChange={(e) => setQcForm({ ...qcForm, batchId: e.target.value })}
              >
                {store.batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.id} — {b.styleName}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field__label">Inspector Name</label>
              <input
                type="text"
                className="input"
                required
                value={qcForm.inspector}
                onChange={(e) => setQcForm({ ...qcForm, inspector: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="field">
              <label className="field__label">Sampled Count (pcs)</label>
              <input
                type="number"
                className="input"
                required
                min={10}
                value={qcForm.inspectedUnits}
                onChange={(e) => setQcForm({ ...qcForm, inspectedUnits: Number(e.target.value) })}
              />
            </div>
            <div className="field">
              <label className="field__label">Passed Count (pcs)</label>
              <input
                type="number"
                className="input"
                required
                min={0}
                max={qcForm.inspectedUnits}
                value={qcForm.passedUnits}
                onChange={(e) => setQcForm({ ...qcForm, passedUnits: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="field">
            <label className="field__label">Defect Observations (1 per line)</label>
            <textarea
              className="input h-20 py-2"
              value={qcForm.defectsText}
              onChange={(e) => setQcForm({ ...qcForm, defectsText: e.target.value })}
            />
          </div>

          <div className="field">
            <label className="field__label">Audit Verdict</label>
            <select
              className="input"
              value={qcForm.status}
              onChange={(e) =>
                setQcForm({
                  ...qcForm,
                  status: e.target.value as 'Passed' | 'Conditional' | 'Rejected',
                })
              }
            >
              <option value="Passed">Passed (AQL 2.5 Compliant)</option>
              <option value="Conditional">Conditional (Minor Rework Required)</option>
              <option value="Rejected">Rejected (Critical Fabric/Seam Defect)</option>
            </select>
          </div>

          <div className="mform__foot">
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setNewQcModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn--ink btn--sm">
              Save Audit Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
