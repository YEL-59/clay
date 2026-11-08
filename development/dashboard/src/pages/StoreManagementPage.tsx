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
  addStaffMember,
  updateStaffShift,
  updateStaffTarget,
  useEnterpriseStore,
} from '../store/enterpriseStore';
import {
  ShiftType,
  StaffMember,
  StaffRole,
  StoreBranch,
} from '../types';
import { formatBDT, formatCompactBDT } from '../utils/format';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const SHIFT_OPTIONS: ShiftType[] = [
  'Morning (9:30 AM - 4:30 PM)',
  'Evening (2:30 PM - 9:30 PM)',
  'Full Day (10:00 AM - 9:00 PM)',
  'Off',
];

export const StoreManagementPage: React.FC = () => {
  const store = useEnterpriseStore();
  const [activeTab, setActiveTab] = useState<'roster' | 'branches' | 'shifts'>('roster');
  const [branchFilter, setBranchFilter] = useState<string>('All');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected staff member for detail drawer
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  // Modals
  const [newStaffModalOpen, setNewStaffModalOpen] = useState(false);
  const [targetModalOpen, setTargetModalOpen] = useState(false);
  const [staffForTarget, setStaffForTarget] = useState<StaffMember | null>(null);
  const [newTargetVal, setNewTargetVal] = useState(1000000);

  // New staff form state
  const [staffForm, setStaffForm] = useState({
    name: '',
    role: 'Sales Representative' as StaffRole,
    branchId: store.branches[0]?.id || 'BR-GUL',
    phone: '+880 1700-000000',
    email: '',
    joiningDate: new Date().toISOString().split('T')[0],
    monthlyTargetBdt: 800000,
    achievedSalesBdt: 0,
    commissionTierPct: 3.5,
    customerRating: 4.9,
  });

  // Summary Metrics
  const totalMonthlySalesTarget = useMemo(
    () => store.staff.reduce((acc, s) => acc + s.monthlyTargetBdt, 0),
    [store.staff]
  );

  const totalAchievedSales = useMemo(
    () => store.staff.reduce((acc, s) => acc + s.achievedSalesBdt, 0),
    [store.staff]
  );

  const totalCommissionEarned = useMemo(
    () =>
      store.staff.reduce(
        (acc, s) => acc + Math.round((s.achievedSalesBdt * s.commissionTierPct) / 100),
        0
      ),
    [store.staff]
  );

  const filteredStaff = useMemo(() => {
    return store.staff.filter((s) => {
      const matchBranch = branchFilter === 'All' || s.branchId === branchFilter;
      const matchRole = roleFilter === 'All' || s.role === roleFilter;
      const matchQuery =
        !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.branchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchBranch && matchRole && matchQuery;
    });
  }, [store.staff, branchFilter, roleFilter, searchQuery]);

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.name) return;
    const branch = store.branches.find((b) => b.id === staffForm.branchId);

    const defaultWeek: Record<string, ShiftType> = {
      Mon: 'Morning (9:30 AM - 4:30 PM)',
      Tue: 'Morning (9:30 AM - 4:30 PM)',
      Wed: 'Evening (2:30 PM - 9:30 PM)',
      Thu: 'Evening (2:30 PM - 9:30 PM)',
      Fri: 'Full Day (10:00 AM - 9:00 PM)',
      Sat: 'Full Day (10:00 AM - 9:00 PM)',
      Sun: 'Off',
    };

    addStaffMember({
      ...staffForm,
      branchName: branch?.name || 'Gulshan Atelier',
      shiftWeek: defaultWeek,
    });
    setNewStaffModalOpen(false);
  };

  const handleSaveTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (staffForTarget) {
      updateStaffTarget(staffForTarget.id, newTargetVal);
      if (selectedStaff?.id === staffForTarget.id) {
        setSelectedStaff({ ...selectedStaff, monthlyTargetBdt: newTargetVal });
      }
      setTargetModalOpen(false);
    }
  };

  return (
    <div className="store-mgmt-page" data-in>
      <PageHeader
        title={['Store', 'Managers', '&', 'Sales', 'Staff']}
        stats={
          <>
            <StatItem
              icon="building"
              value={store.branches.length}
              label="Flagship Atelier Branches"
              fmt={(v) => `${v} locations`}
            />
            <StatItem
              icon="users"
              value={store.staff.length}
              label="Active Store Associates"
              fmt={(v) => `${v} staff`}
            />
            <StatItem
              icon="target"
              value={totalAchievedSales}
              label="MTD Staff Sales Achieved"
              fmt={(v) => formatCompactBDT(v)}
            />
            <StatItem
              icon="award"
              value={totalCommissionEarned}
              label="Staff Commissions Accrued"
              fmt={(v) => formatCompactBDT(v)}
            />
          </>
        }
        actions={
          <button
            type="button"
            className="btn btn--ink btn--sm"
            onClick={() => setNewStaffModalOpen(true)}
          >
            <Icon name="plus" size={15} /> Add Staff Associate
          </button>
        }
      />

      {/* Tabs */}
      <div className="toolbar">
        <SegmentedControl
          label="Store Management Sections"
          value={activeTab}
          options={[
            { id: 'roster', label: `Staff Roster (${store.staff.length})` },
            { id: 'branches', label: `Flagship Branches (${store.branches.length})` },
            { id: 'shifts', label: 'Weekly Shift Schedule' },
          ]}
          onChange={(tab) => setActiveTab(tab)}
        />
        <div className="toolbar__spacer" />
        <div className="search">
          <Icon name="search" />
          <input
            type="search"
            placeholder="Search staff, branches, roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. Staff Roster View                                          */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          <div className="chips">
            <span className="text-xs font-semibold text-muted self-center mr-2">Filter Branch:</span>
            {['All', ...store.branches.map((b) => b.id)].map((brId) => {
              const label =
                brId === 'All' ? 'All Branches' : store.branches.find((b) => b.id === brId)?.name.split(' ')[0] || brId;
              return (
                <button
                  key={brId}
                  type="button"
                  className="chip"
                  aria-pressed={branchFilter === brId}
                  onClick={() => setBranchFilter(brId)}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredStaff.map((staff) => {
              const targetPct = Math.round((staff.achievedSalesBdt / staff.monthlyTargetBdt) * 100);
              const commissionBdt = Math.round((staff.achievedSalesBdt * staff.commissionTierPct) / 100);

              return (
                <Card
                  key={staff.id}
                  className="hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div onClick={() => setSelectedStaff(staff)} className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="av av--md av--t0 font-bold">{staff.avatarInitial}</div>
                        <div>
                          <h3 className="font-bold text-sm text-text leading-tight">{staff.name}</h3>
                          <span className="text-2xs text-muted block mt-0.5">{staff.role}</span>
                        </div>
                      </div>
                      <span className="badge badge--plain text-2xs flex items-center gap-1">
                        <Icon name="star" size={11} className="text-coral" />
                        {staff.customerRating}
                      </span>
                    </div>

                    <div className="text-xs text-muted flex items-center gap-1">
                      <Icon name="home" size={12} />
                      <span className="truncate">{staff.branchName}</span>
                    </div>

                    <div className="bg-well rounded-xl p-3 text-xs space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-muted">Monthly Target:</span>
                        <b className="font-semibold text-text">{formatBDT(staff.monthlyTargetBdt)}</b>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-muted">Achieved Sales:</span>
                        <b className="font-bold text-teal">{formatBDT(staff.achievedSalesBdt)}</b>
                      </div>

                      {/* Achievement Progress Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-2xs font-semibold">
                          <span className="text-muted">Target Attainment</span>
                          <span className={targetPct >= 100 ? 'text-good' : 'text-text'}>
                            {targetPct}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-line rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              targetPct >= 100 ? 'bg-good' : 'bg-coral'
                            }`}
                            style={{ width: `${Math.min(100, targetPct)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-1 border-t border-line text-2xs">
                        <span className="text-muted">Commission ({staff.commissionTierPct}%):</span>
                        <b className="text-text font-bold">{formatBDT(commissionBdt)}</b>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-line flex items-center justify-between text-xs mt-3">
                    <button
                      type="button"
                      className="text-muted hover:text-text text-2xs font-semibold"
                      onClick={() => {
                        setStaffForTarget(staff);
                        setNewTargetVal(staff.monthlyTargetBdt);
                        setTargetModalOpen(true);
                      }}
                    >
                      Adjust Target
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm py-1 px-2.5 text-2xs"
                      onClick={() => setSelectedStaff(staff)}
                    >
                      Shift Schedule <Icon name="arrowR" size={12} />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. Flagship Branches View                                     */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'branches' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {store.branches.map((branch) => {
            const attainPct = Math.round(
              (branch.monthToDateSalesBdt / branch.monthlyTargetBdt) * 100
            );

            return (
              <Card key={branch.id} className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="badge badge--plain text-2xs mb-1">{branch.district} District</span>
                    <h3 className="font-bold text-base text-text">{branch.name}</h3>
                    <p className="text-xs text-muted mt-0.5">{branch.address}</p>
                  </div>
                  <span className="badge badge--teal text-xs font-semibold">
                    {branch.activeStaffCount} Staff
                  </span>
                </div>

                <div className="bg-well rounded-xl p-3 text-xs space-y-2">
                  <div className="flex justify-between py-1 border-b border-line">
                    <span className="text-muted">Store Manager:</span>
                    <b className="font-semibold text-text">{branch.managerName}</b>
                  </div>
                  <div className="flex justify-between py-1 border-b border-line">
                    <span className="text-muted">Atelier Floor Area:</span>
                    <span className="font-semibold">{branch.areaSqft.toLocaleString()} sq.ft.</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-line">
                    <span className="text-muted">Monthly Walk-in Footfall:</span>
                    <span className="font-semibold">{branch.footfallMonthly.toLocaleString()} patrons</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted">Patron Conversion Rate:</span>
                    <b className="font-bold text-good">{branch.conversionRate}%</b>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted">MTD Sales Revenue</span>
                    <b className="text-text font-bold">
                      {formatBDT(branch.monthToDateSalesBdt)} / {formatCompactBDT(branch.monthlyTargetBdt)}
                    </b>
                  </div>
                  <div className="w-full h-2 bg-well rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, attainPct)}%` }}
                    />
                  </div>
                  <div className="text-right text-2xs text-muted">{attainPct}% of monthly target</div>
                </div>

                <div className="pt-2 border-t border-line flex justify-between items-center text-xs">
                  <span className="text-muted text-2xs">Live store POS synced</span>
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm py-1 px-3 text-2xs"
                    onClick={() => {
                      setBranchFilter(branch.id);
                      setActiveTab('roster');
                    }}
                  >
                    View Roster
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. Weekly Shift Schedule View                                 */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'shifts' && (
        <Card
          title="Weekly Store Staff Roster & Shift Allocation"
          sub="Assign morning, evening, or weekend shifts across boutique stores"
        >
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Staff Member</th>
                  <th>Role & Branch</th>
                  {DAYS_OF_WEEK.map((d) => (
                    <th key={d} className="text-center">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {store.staff.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="av av--sm av--t1 font-bold">{s.avatarInitial}</div>
                        <div>
                          <b className="text-sm font-semibold">{s.name}</b>
                          <small className="block text-2xs text-muted">{s.phone}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="font-semibold block text-xs">{s.role}</span>
                      <small className="text-2xs text-muted">{s.branchName.split(' ')[0]}</small>
                    </td>
                    {DAYS_OF_WEEK.map((day) => {
                      const curShift = s.shiftWeek[day] || 'Off';
                      const isMorning = curShift.startsWith('Morning');
                      const isEvening = curShift.startsWith('Evening');
                      const isFull = curShift.startsWith('Full Day');
                      const isOff = curShift === 'Off';

                      return (
                        <td key={day} className="text-center p-2">
                          <select
                            className={`text-2xs font-semibold px-2 py-1.5 rounded-lg border outline-none cursor-pointer ${
                              isMorning
                                ? 'bg-sky/20 border-sky/40 text-ink'
                                : isEvening
                                ? 'bg-coral/20 border-coral/40 text-ink'
                                : isFull
                                ? 'bg-teal/20 border-teal/40 text-ink font-bold'
                                : 'bg-well border-line text-muted opacity-60'
                            }`}
                            value={curShift}
                            onChange={(e) =>
                              updateStaffShift(s.id, day, e.target.value as ShiftType)
                            }
                          >
                            {SHIFT_OPTIONS.map((sh) => (
                              <option key={sh} value={sh}>
                                {sh === 'Off' ? 'Off Day' : sh.split(' ')[0]}
                              </option>
                            ))}
                          </select>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Staff Detail Drawer                                           */}
      {/* ------------------------------------------------------------- */}
      <Drawer
        open={Boolean(selectedStaff)}
        onClose={() => setSelectedStaff(null)}
        title={selectedStaff?.name || 'Staff Associate'}
        sub={selectedStaff ? `${selectedStaff.role} — ${selectedStaff.branchName}` : ''}
        foot={
          selectedStaff && (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-muted">
                Joined: <strong>{selectedStaff.joiningDate}</strong>
              </span>
              <button
                type="button"
                className="btn btn--ink btn--sm"
                onClick={() => {
                  setStaffForTarget(selectedStaff);
                  setNewTargetVal(selectedStaff.monthlyTargetBdt);
                  setTargetModalOpen(true);
                }}
              >
                Update Monthly Target
              </button>
            </div>
          )
        }
      >
        {selectedStaff && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-well rounded-2xl p-4">
              <div className="av av--lg av--t2 font-bold text-xl">
                {selectedStaff.avatarInitial}
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-base text-text">{selectedStaff.name}</h3>
                <p className="text-xs text-muted">{selectedStaff.role}</p>
                <div className="flex items-center gap-3 pt-1 text-2xs text-muted">
                  <span className="flex items-center gap-1">
                    <Icon name="phone" size={11} /> {selectedStaff.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="mail" size={11} /> {selectedStaff.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Sales & Commission Breakdown */}
            <div className="bg-well rounded-2xl p-4 space-y-2.5 text-xs">
              <h4 className="text-xs font-bold text-text uppercase tracking-wider mb-1">
                Performance & Commission Matrix
              </h4>
              <div className="flex justify-between py-1 border-b border-line">
                <span className="text-muted">Monthly Sales Target:</span>
                <b className="text-sm font-semibold text-text">
                  {formatBDT(selectedStaff.monthlyTargetBdt)}
                </b>
              </div>
              <div className="flex justify-between py-1 border-b border-line">
                <span className="text-muted">Month-to-Date Revenue:</span>
                <b className="text-sm font-bold text-teal">
                  {formatBDT(selectedStaff.achievedSalesBdt)}
                </b>
              </div>
              <div className="flex justify-between py-1 border-b border-line">
                <span className="text-muted">Target Realization:</span>
                <span className="font-bold text-good">
                  {Math.round(
                    (selectedStaff.achievedSalesBdt / selectedStaff.monthlyTargetBdt) * 100
                  )}
                  %
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-line">
                <span className="text-muted">Commission Tier:</span>
                <span className="badge badge--coral text-2xs">
                  {selectedStaff.commissionTierPct}% Flat Rate
                </span>
              </div>
              <div className="flex justify-between py-1 text-sm font-bold">
                <span className="text-text">Earned Monthly Incentive:</span>
                <span className="text-good">
                  {formatBDT(
                    Math.round(
                      (selectedStaff.achievedSalesBdt * selectedStaff.commissionTierPct) / 100
                    )
                  )}
                </span>
              </div>
            </div>

            {/* Shift Roster */}
            <div>
              <h4 className="text-xs font-bold text-text uppercase tracking-wider mb-2">
                Assigned Shift Schedule
              </h4>
              <div className="space-y-1.5">
                {DAYS_OF_WEEK.map((day) => (
                  <div
                    key={day}
                    className="flex justify-between items-center p-2 rounded-xl bg-well text-xs"
                  >
                    <span className="font-bold text-muted w-10">{day}</span>
                    <span className="font-semibold text-text">
                      {selectedStaff.shiftWeek[day] || 'Off Day'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* ------------------------------------------------------------- */}
      {/* Add Staff Modal                                               */}
      {/* ------------------------------------------------------------- */}
      <Modal
        open={newStaffModalOpen}
        onClose={() => setNewStaffModalOpen(false)}
        title="Add Store Associate / Manager"
      >
        <form onSubmit={handleAddStaff} className="mform">
          <div className="field">
            <label className="field__label">Full Name</label>
            <input
              type="text"
              className="input"
              required
              placeholder="e.g. Farhan Chowdhury"
              value={staffForm.name}
              onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="field">
              <label className="field__label">Role</label>
              <select
                className="input"
                value={staffForm.role}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, role: e.target.value as StaffRole })
                }
              >
                <option value="Store Manager">Store Manager</option>
                <option value="Senior Sales Associate">Senior Sales Associate</option>
                <option value="Sales Representative">Sales Representative</option>
                <option value="Styling Consultant">Styling Consultant</option>
              </select>
            </div>
            <div className="field">
              <label className="field__label">Assigned Branch</label>
              <select
                className="input"
                value={staffForm.branchId}
                onChange={(e) => setStaffForm({ ...staffForm, branchId: e.target.value })}
              >
                {store.branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="field">
              <label className="field__label">Phone Number</label>
              <input
                type="text"
                className="input"
                required
                value={staffForm.phone}
                onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
              />
            </div>
            <div className="field">
              <label className="field__label">Email Address</label>
              <input
                type="email"
                className="input"
                required
                placeholder="name@raye-atelier.com"
                value={staffForm.email}
                onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="field">
              <label className="field__label">Monthly Sales Target (BDT)</label>
              <input
                type="number"
                className="input"
                required
                min={200000}
                step={50000}
                value={staffForm.monthlyTargetBdt}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, monthlyTargetBdt: Number(e.target.value) })
                }
              />
            </div>
            <div className="field">
              <label className="field__label">Commission Tier (%)</label>
              <input
                type="number"
                className="input"
                required
                min={1}
                max={10}
                step={0.5}
                value={staffForm.commissionTierPct}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, commissionTierPct: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="mform__foot">
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setNewStaffModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn--ink btn--sm">
              Enroll Associate
            </button>
          </div>
        </form>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* Adjust Target Modal                                           */}
      {/* ------------------------------------------------------------- */}
      <Modal
        open={targetModalOpen}
        onClose={() => setTargetModalOpen(false)}
        title={`Adjust Target — ${staffForTarget?.name || 'Staff'}`}
      >
        <form onSubmit={handleSaveTarget} className="mform">
          <div className="field">
            <label className="field__label">New Monthly Target (BDT)</label>
            <input
              type="number"
              className="input text-lg font-bold"
              required
              min={200000}
              step={50000}
              value={newTargetVal}
              onChange={(e) => setNewTargetVal(Number(e.target.value))}
            />
          </div>
          <p className="text-2xs text-muted">
            Target updates reflect immediately in staff commission projections and store branch quota
            meters.
          </p>
          <div className="mform__foot">
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setTargetModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn--ink btn--sm">
              Save Target
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
