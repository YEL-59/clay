import React, { useMemo, useState } from 'react';
import { Icon } from '../components/ui/Icon';
import {
  Avatar,
  Card,
  Drawer,
  EmptyState,
  PageHeader,
  StatItem,
  StatusPill,
} from '../components/ui/Primitives';
import { getProductBySlug } from '../data/catalog';
import {
  addNote,
  adminState,
  getCustomers,
  getOrders,
  navigate,
  useAdminStore,
  useRoute,
} from '../store/adminStore';
import { CustomerTier, CustomerWithStats } from '../types';
import {
  formatBDT,
  formatDate,
  formatDateTime,
  pluralize,
} from '../utils/format';

const TIER_FILTERS = [
  { id: 'all', label: 'Everyone' },
  { id: 'vip', label: 'VIP' },
  { id: 'regular', label: 'Regular' },
  { id: 'new', label: 'New' },
];

const TIER_LABELS: Record<CustomerTier, string> = {
  vip: 'VIP',
  regular: 'Regular',
  new: 'New',
};

function computeCustomerStats(): CustomerWithStats[] {
  const validOrders = getOrders().filter((o) => o.status !== 'returned');
  return getCustomers().map((c) => {
    const custOrders = validOrders.filter((o) => o.customer === c.id);
    return {
      ...c,
      count: custOrders.length,
      spent: custOrders.reduce((s, o) => s + o.total, 0),
      last: custOrders[0]?.t ?? 0,
    };
  });
}

const CustomerDrawer: React.FC<{
  customer?: CustomerWithStats;
  onClose: () => void;
}> = ({ customer, onClose }) => {
  const [noteInput, setNoteInput] = useState('');
  const custOrders = customer ? getOrders().filter((o) => o.customer === customer.id) : [];
  const validLines = custOrders
    .filter((o) => o.status !== 'returned')
    .flatMap((o) => o.lines);

  const topAttribute = (field: 'slug' | 'size') =>
    Object.entries(
      validLines.reduce<Record<string, number>>((acc, line) => {
        acc[line[field]] = (acc[line[field]] ?? 0) + line.qty;
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1])[0]?.[0];

  const favSlug = topAttribute('slug');
  const favProduct = favSlug ? getProductBySlug(favSlug) : undefined;
  const usualSize = topAttribute('size');

  return (
    <Drawer
      open={!!customer}
      onClose={onClose}
      title={customer?.name ?? ''}
      sub={customer && `Customer since ${formatDate(customer.since)}`}
    >
      {customer && (
        <div className="cp">
          <div className="cp__top">
            <Avatar name={customer.name} tone={customer.tone} size="xl" />
            <span className={`tier tier--${customer.tier}`}>
              {TIER_LABELS[customer.tier]}
            </span>
            <a href={`mailto:${customer.email}`} className="cp__line">
              <Icon name="note" size={15} />
              {customer.email}
            </a>
            <a href={`tel:${customer.phone}`} className="cp__line">
              <Icon name="clock" size={15} />
              {customer.phone} · {customer.district}
            </a>
          </div>

          <dl className="cp__figs">
            <div>
              <dt>Orders</dt>
              <dd className="num">{customer.count}</dd>
            </div>
            <div>
              <dt>Spent</dt>
              <dd className="num">{formatBDT(customer.spent)}</dd>
            </div>
            <div>
              <dt>Usual size</dt>
              <dd>{usualSize ?? '—'}</dd>
            </div>
          </dl>

          {favProduct && (
            <a className="cp__fav" href={`#/products/${favProduct.slug}`}>
              <img
                src={favProduct.img.src}
                width={favProduct.img.w}
                height={favProduct.img.h}
                alt={favProduct.name}
                loading="lazy"
              />
              <span>
                <small>Favourite shirt</small>
                <b>{favProduct.name}</b>
                <small>{formatBDT(favProduct.price)}</small>
              </span>
            </a>
          )}

          <section>
            <h3 className="card__title">Orders</h3>
            <ul className="cp__orders">
              {custOrders.map((o) => (
                <li key={o.id}>
                  <a href={`#/orders/${o.id}`}>
                    <b>{o.id}</b>
                    <small>{formatDateTime(o.t)}</small>
                    <StatusPill s={o.status} />
                    <b className="num">{formatBDT(o.total)}</b>
                  </a>
                </li>
              ))}
              {!custOrders.length && <li className="muted">No orders yet.</li>}
            </ul>
          </section>

          <section className="notes">
            <h3 className="card__title">Notes</h3>
            {(adminState.notes[customer.id] ?? []).map((note, idx) => (
              <p className="notes__item" key={idx}>
                {note}
              </p>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (noteInput.trim()) {
                  addNote(customer.id, noteInput.trim());
                  setNoteInput('');
                }
              }}
            >
              <label className="sr" htmlFor="c-note">
                Add a note
              </label>
              <input
                id="c-note"
                className="input"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Prefers bKash, sizes down in oversized…"
              />
              <button className="btn btn--ghost" type="submit">
                Add
              </button>
            </form>
          </section>
        </div>
      )}
    </Drawer>
  );
};

export const CustomersPage: React.FC = () => {
  useAdminStore();
  const route = useRoute();
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [sort, setSort] = useState<{ by: 'count' | 'spent' | 'last'; dir: 1 | -1 }>({
    by: 'spent',
    dir: -1,
  });

  const ordersLen = getOrders().length;
  const allCustomers = useMemo(computeCustomerStats, [ordersLen]);

  const filtered = allCustomers
    .filter(
      (c) =>
        (tierFilter === 'all' || c.tier === tierFilter) &&
        (!search ||
          `${c.name} ${c.email} ${c.district}`
            .toLowerCase()
            .includes(search.toLowerCase()))
    )
    .sort((a, b) => (a[sort.by] - b[sort.by]) * sort.dir);

  const buyers = allCustomers.filter((c) => c.count > 0);
  const repeatShare =
    buyers.filter((c) => c.count > 1).length / Math.max(1, buyers.length);
  const activeCustomer = allCustomers.find((c) => c.id === route.params[0]);

  const renderSortTh = (
    col: 'count' | 'spent' | 'last',
    label: string,
    className = ''
  ) => (
    <th
      className={className}
      aria-sort={
        sort.by === col ? (sort.dir === 1 ? 'ascending' : 'descending') : undefined
      }
    >
      <button
        type="button"
        onClick={() =>
          setSort((s) => ({
            by: col,
            dir: s.by === col ? (s.dir === 1 ? -1 : 1) : -1,
          }))
        }
      >
        {label}
        {sort.by === col && (sort.dir === 1 ? ' ↑' : ' ↓')}
      </button>
    </th>
  );

  return (
    <div className="view view--customers">
      <PageHeader
        title={['Your', 'customers']}
        stats={
          <>
            <StatItem
              icon="users"
              value={allCustomers.length}
              fmt={(v) => String(Math.round(v))}
              label="Customers"
            />
            <StatItem
              icon="return"
              value={repeatShare * 100}
              fmt={(v) => `${Math.round(v)}%`}
              label="Came back for another"
            />
            <StatItem
              icon="sparkle"
              value={allCustomers.filter((c) => c.tier === 'vip').length}
              fmt={(v) => String(Math.round(v))}
              label="VIPs, over ৳16,000 spent"
            />
          </>
        }
      />

      <div className="toolbar" data-in>
        <label className="search">
          <Icon name="search" size={16} />
          <span className="sr">Search customers</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or district"
          />
        </label>

        <div className="chips" role="group" aria-label="Tier">
          {TIER_FILTERS.map((t) => (
            <button
              key={t.id}
              type="button"
              className="chip"
              aria-pressed={tierFilter === t.id}
              onClick={() => setTierFilter(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <Card className="ctable">
        <div className="table-wrap">
          <table className="table table--stack">
            <thead>
              <tr>
                <th>Customer</th>
                <th>District</th>
                {renderSortTh('count', 'Orders', 'r')}
                {renderSortTh('spent', 'Spent', 'r')}
                {renderSortTh('last', 'Last order')}
                <th>Tier</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} onClick={() => navigate(`customers/${c.id}`)}>
                  <td>
                    <a
                      className="cell-person"
                      href={`#/customers/${c.id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Avatar name={c.name} tone={c.tone} size="md" />
                      <span>
                        <b>{c.name}</b>
                        <small>{c.email}</small>
                      </span>
                    </a>
                  </td>
                  <td>{c.district}</td>
                  <td className="r num">{c.count}</td>
                  <td className="r num">
                    <b>{formatBDT(c.spent)}</b>
                  </td>
                  <td className="num">{c.last ? formatDate(c.last) : '—'}</td>
                  <td>
                    <span className={`tier tier--${c.tier}`}>
                      {TIER_LABELS[c.tier]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && (
          <EmptyState
            icon="users"
            title="No customers match"
            text="Clear the search or pick another tier."
          />
        )}
        <p className="ctable__foot muted">{pluralize(filtered.length, 'customer')}</p>
      </Card>

      <CustomerDrawer
        customer={activeCustomer}
        onClose={() => navigate('customers')}
      />
    </div>
  );
};
