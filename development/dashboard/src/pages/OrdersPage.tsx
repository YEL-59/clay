import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { Icon } from '../components/ui/Icon';
import {
  Avatar,
  Card,
  Drawer,
  DropdownMenu,
  EmptyState,
  PageHeader,
  SegmentedControl,
  StatItem,
  StatusPill,
  Thumb,
} from '../components/ui/Primitives';
import {
  DELIVERY_LABELS,
  PAYMENT_LABELS,
  PAYMENT_OPTIONS,
  getProductBySlug,
} from '../data/catalog';
import { ORDER_COLUMNS } from '../data/seed';
import {
  addNote,
  adminState,
  getCustomerById,
  getOrders,
  navigate,
  pushToast,
  setOrderStatus,
  useAdminStore,
  useRoute,
} from '../store/adminStore';
import { Order, OrderStatus, ToneName } from '../types';
import { animateBounce, prefersReducedMotion } from '../utils/animations';
import {
  formatBDT,
  formatCompactBDT,
  formatDateTime,
  pluralize,
} from '../utils/format';

const NEXT_STATUS_ACTION: Partial<Record<OrderStatus, [OrderStatus, string]>> = {
  new: ['packing', 'Start packing'],
  packing: ['shipped', 'Mark shipped'],
  shipped: ['delivered', 'Mark delivered'],
};

const totalShirtCount = (o: Order): number => o.lines.reduce((s, l) => s + l.qty, 0);

function exportOrdersCSV(orders: Order[]): void {
  const rows = [
    ['Order', 'Placed', 'Customer', 'District', 'Shirts', 'Payment', 'Status', 'Total (BDT)'],
    ...orders.map((o) => {
      const cust = getCustomerById(o.customer);
      return [
        o.id,
        new Date(o.t).toISOString(),
        cust?.name ?? '',
        cust?.district ?? '',
        String(totalShirtCount(o)),
        PAYMENT_LABELS[o.payment],
        o.status,
        String(o.total),
      ];
    }),
  ];
  const csvContent = rows
    .map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const link = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob),
    download: 'raye-orders.csv',
  });
  link.click();
  URL.revokeObjectURL(link.href);
}

const OrderCard: React.FC<{
  order: Order;
  tone: ToneName;
  onGrab: (e: React.PointerEvent<HTMLElement>, order: Order) => void;
}> = ({ order, tone, onGrab }) => {
  const cust = getCustomerById(order.customer);
  return (
    <article
      className={`block block--${tone} ocard`}
      data-id={order.id}
      onPointerDown={(e) => onGrab(e, order)}
    >
      <span className="block__meta">
        {formatDateTime(order.t)}
        {order.fromShop && <span className="badge badge--plain">Shop</span>}
      </span>

      <DropdownMenu
        label={`Actions for ${order.id}`}
        className="ibtn ibtn--sm ibtn--on-dark ocard__menu"
        items={[
          {
            label: 'Open order',
            icon: 'out',
            onSelect: () => navigate(`orders/${order.id}`),
          },
          'sep',
          ...ORDER_COLUMNS.filter((c) => c.id !== order.status).map((c) => ({
            label: `Move to ${c.label}`,
            icon: 'arrowR',
            onSelect: () => {
              setOrderStatus(order.id, c.id);
              pushToast(`${order.id} moved to ${c.label}`);
            },
          })),
          ...(order.status === 'returned'
            ? []
            : [
                'sep' as const,
                {
                  label: 'Return and restock',
                  icon: 'return',
                  danger: true,
                  onSelect: () => {
                    setOrderStatus(order.id, 'returned');
                    pushToast(`${order.id} returned, shirts back in stock`);
                  },
                },
              ]),
        ]}
      />

      <a className="block__title" href={`#/orders/${order.id}`} draggable={false}>
        {cust?.name ?? 'Shop customer'}
      </a>
      <span className="block__sub">
        {order.id} · {cust?.district}
      </span>
      <span className="block__foot">
        <b className="block__fig num">{formatBDT(order.total)}</b>
        <span className="block__thumbs">
          {order.lines.slice(0, 3).map((l) => (
            <Thumb key={l.slug + l.size} img={getProductBySlug(l.slug).img} size={24} />
          ))}
        </span>
      </span>
    </article>
  );
};

const OrdersBoard: React.FC<{ list: Order[] }> = ({ list }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [overCol, setOverCol] = useState<string | null>(null);
  const droppedOrderId = useRef<string | null>(null);

  useLayoutEffect(() => {
    if (droppedOrderId.current) {
      const el = boardRef.current?.querySelector<HTMLElement>(
        `[data-id="${droppedOrderId.current}"]`
      );
      animateBounce(el ?? null);
      droppedOrderId.current = null;
    }
  });

  const handleGrab = (e: React.PointerEvent<HTMLElement>, order: Order) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest('button, .menu')) return;
    const cardEl = e.currentTarget;
    const rect = cardEl.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const isTouch = e.pointerType === 'touch';
    let ghostEl: HTMLElement | null = null;
    let targetCol: OrderStatus | null = null;
    let moved = false;

    const onMove = (ev: PointerEvent) => {
      if (Math.hypot(ev.clientX - startX, ev.clientY - startY) >= 6) {
        moved = true;
      }
      if (!isTouch) {
        if (!ghostEl) {
          if (!moved) return;
          ghostEl = cardEl.cloneNode(true) as HTMLElement;
          Object.assign(ghostEl.style, {
            position: 'fixed',
            left: `${rect.left}px`,
            top: `${rect.top}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            margin: '0',
            zIndex: '90',
            pointerEvents: 'none',
          });
          ghostEl.classList.add('is-ghost');
          document.body.appendChild(ghostEl);
          cardEl.classList.add('is-lifted');
          if (!prefersReducedMotion()) {
            gsap.to(ghostEl, {
              rotation: -2.5,
              scale: 1.03,
              duration: 0.25,
              ease: 'power2.out',
            });
          }
        }
        gsap.set(ghostEl, { x: ev.clientX - startX, y: ev.clientY - startY });
        const colUnderPointer = document
          .elementsFromPoint(ev.clientX, ev.clientY)
          .map((el) => el.closest<HTMLElement>('[data-col]'))
          .find(Boolean)?.dataset.col as OrderStatus | undefined;
        targetCol = colUnderPointer ?? null;
        setOverCol(targetCol && targetCol !== order.status ? targetCol : null);
      }
    };

    const onUp = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      setOverCol(null);

      if (!ghostEl) {
        if (
          !moved &&
          ev.type === 'pointerup' &&
          !(e.target as HTMLElement).closest('a, button, .menu')
        ) {
          navigate(`orders/${order.id}`);
        }
        return;
      }

      ghostEl.remove();
      cardEl.classList.remove('is-lifted');
      const suppressClick = (clickEv: Event) => {
        clickEv.preventDefault();
        clickEv.stopPropagation();
      };
      cardEl.addEventListener('click', suppressClick, { capture: true, once: true });
      setTimeout(
        () => cardEl.removeEventListener('click', suppressClick, { capture: true }),
        0
      );

      if (targetCol && targetCol !== order.status) {
        droppedOrderId.current = order.id;
        setOrderStatus(order.id, targetCol);
        pushToast(
          targetCol === 'returned'
            ? `${order.id} returned, shirts back in stock`
            : `${order.id} moved to ${ORDER_COLUMNS.find((c) => c.id === targetCol)!.label}`
        );
      }
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  const returnedOrders = list.filter((o) => o.status === 'returned');

  return (
    <div className="board" ref={boardRef}>
      {ORDER_COLUMNS.map((col) => {
        const colOrders = list.filter((o) => o.status === col.id);
        const visibleOrders = col.id === 'delivered' ? colOrders.slice(0, 10) : colOrders;
        return (
          <section
            key={col.id}
            className={`col${overCol === col.id ? ' is-over' : ''}`}
            data-col={col.id}
            data-in
            aria-label={`${col.label}, ${pluralize(colOrders.length, 'order')}`}
          >
            <header className="col__head">
              <span className={`spill spill--${col.tone}`}>
                <i />
                {col.label}
              </span>
              <span className="col__count num">{colOrders.length}</span>
              <span className="col__sum num">
                {formatCompactBDT(colOrders.reduce((s, o) => s + o.total, 0))}
              </span>
            </header>
            <div className="col__list">
              {visibleOrders.map((o) => (
                <OrderCard key={o.id} order={o} tone={col.tone} onGrab={handleGrab} />
              ))}
              {!colOrders.length && <p className="col__empty">Drop an order here</p>}
              {colOrders.length > visibleOrders.length && (
                <a className="col__more" href="#/orders?view=list">
                  and {colOrders.length - visibleOrders.length} more in the list
                </a>
              )}
            </div>
          </section>
        );
      })}

      <section
        className={`col col--slot${overCol === 'returned' ? ' is-over' : ''}`}
        data-col="returned"
        data-in
        aria-label="Returns"
      >
        <span className="slot__ico">
          <Icon name="return" size={20} />
        </span>
        <b>Returns</b>
        <small>
          {pluralize(returnedOrders.length, 'order')} · drop here to take one back and restock it
        </small>
      </section>
    </div>
  );
};

const OrdersTable: React.FC<{ list: Order[] }> = ({ list }) => {
  const [sort, setSort] = useState<{ by: 't' | 'total'; dir: 1 | -1 }>({ by: 't', dir: -1 });
  const sorted = [...list].sort((a, b) => (a[sort.by] - b[sort.by]) * sort.dir);

  const renderSortTh = (col: 't' | 'total', label: string, className = '') => (
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
    <Card className="olist">
      <div className="table-wrap">
        <table className="table table--stack">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              {renderSortTh('t', 'Placed')}
              <th>Shirts</th>
              <th>Payment</th>
              <th>Status</th>
              {renderSortTh('total', 'Total', 'r')}
            </tr>
          </thead>
          <tbody>
            {sorted.slice(0, 60).map((o) => {
              const cust = getCustomerById(o.customer);
              return (
                <tr key={o.id} onClick={() => navigate(`orders/${o.id}`)}>
                  <td>
                    <a href={`#/orders/${o.id}`} onClick={(e) => e.stopPropagation()}>
                      <b>{o.id}</b>
                    </a>
                  </td>
                  <td>
                    <span className="cell-person">
                      <Avatar name={cust?.name ?? '?'} tone={cust?.tone} size="sm" />
                      <span>
                        <b>{cust?.name}</b>
                        <small>{cust?.district}</small>
                      </span>
                    </span>
                  </td>
                  <td className="num">{formatDateTime(o.t)}</td>
                  <td className="num">{totalShirtCount(o)}</td>
                  <td>{PAYMENT_LABELS[o.payment]}</td>
                  <td>
                    <StatusPill s={o.status} />
                  </td>
                  <td className="r num">
                    <b>{formatBDT(o.total)}</b>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!sorted.length && (
        <EmptyState
          icon="bag"
          title="No orders match"
          text="Try another payment method or clear the search."
        />
      )}
    </Card>
  );
};

const TRACK_STEPS: OrderStatus[] = ['new', 'packing', 'shipped', 'delivered'];

const OrderDetailDrawer: React.FC<{
  order?: Order;
  onClose: () => void;
}> = ({ order, onClose }) => {
  const [noteInput, setNoteInput] = useState('');
  const cust = order ? getCustomerById(order.customer) : undefined;
  const stepIndex = order ? TRACK_STEPS.indexOf(order.status) : -1;
  const nextAction = order ? NEXT_STATUS_ACTION[order.status] : undefined;

  return (
    <Drawer
      open={!!order}
      onClose={onClose}
      title={order?.id ?? ''}
      sub={order && `${formatDateTime(order.t)} · ${DELIVERY_LABELS[order.delivery]}`}
      foot={
        order && (
          <>
            {order.status !== 'returned' && order.status !== 'new' && (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  setOrderStatus(order.id, 'returned');
                  pushToast(`${order.id} returned, shirts back in stock`);
                }}
              >
                <Icon name="return" size={16} />
                Return
              </button>
            )}
            {nextAction ? (
              <button
                type="button"
                className="btn btn--ink grow"
                onClick={() => {
                  setOrderStatus(order.id, nextAction[0]);
                  pushToast(
                    `${order.id}: ${ORDER_COLUMNS.find((c) => c.id === nextAction[0])!.label}`
                  );
                }}
              >
                {nextAction[1]}
                <Icon name="arrowR" size={16} />
              </button>
            ) : (
              <span className="drawer__done">
                <StatusPill s={order.status} />
              </span>
            )}
          </>
        )
      }
    >
      {order && (
        <div className="od">
          <ol
            className={`track${order.status === 'returned' ? ' is-returned' : ''}`}
            style={{ '--at': Math.max(0, stepIndex) / 3 } as React.CSSProperties}
          >
            {TRACK_STEPS.map((st, idx) => (
              <li key={st} className={idx <= stepIndex ? 'is-done' : ''}>
                <i />
                <span>{ORDER_COLUMNS[idx].label}</span>
              </li>
            ))}
          </ol>

          {order.status === 'returned' && (
            <p className="od__note">
              <Icon name="return" size={16} />
              Returned. The shirts are back in stock.
            </p>
          )}

          <a className="od__who" href={`#/customers/${cust?.id}`}>
            <Avatar name={cust?.name ?? '?'} tone={cust?.tone} size="lg" />
            <span>
              <b>{cust?.name}</b>
              <small>{cust?.email}</small>
              <small>
                {cust?.phone} · {cust?.district}
              </small>
            </span>
            <Icon name="out" />
          </a>

          <ul className="od__lines">
            {order.lines.map((l) => {
              const prod = getProductBySlug(l.slug);
              return (
                <li key={l.slug + l.size}>
                  <Thumb img={prod.img} size={48} />
                  <span>
                    <b>{prod.name}</b>
                    <small>
                      Size {l.size} · {l.qty} × {formatBDT(l.price)}
                    </small>
                  </span>
                  <b className="num">{formatBDT(l.qty * l.price)}</b>
                </li>
              );
            })}
          </ul>

          <dl className="od__sum">
            <div>
              <dt>Subtotal</dt>
              <dd>{formatBDT(order.subtotal)}</dd>
            </div>
            {order.discount > 0 && (
              <div>
                <dt>Code {order.promo}</dt>
                <dd>−{formatBDT(order.discount)}</dd>
              </div>
            )}
            <div>
              <dt>Delivery{order.promo === 'SALTAIR' ? ' (SALTAIR)' : ''}</dt>
              <dd>{order.shipping ? formatBDT(order.shipping) : 'Free'}</dd>
            </div>
            <div className="od__total">
              <dt>Total</dt>
              <dd>{formatBDT(order.total)}</dd>
            </div>
            <div>
              <dt>Payment</dt>
              <dd>{PAYMENT_LABELS[order.payment]}</dd>
            </div>
          </dl>

          <section className="notes">
            <h3 className="card__title">Notes</h3>
            {(adminState.notes[order.id] ?? []).map((note, idx) => (
              <p className="notes__item" key={idx}>
                {note}
              </p>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (noteInput.trim()) {
                  addNote(order.id, noteInput.trim());
                  setNoteInput('');
                }
              }}
            >
              <label className="sr" htmlFor="o-note">
                Add a note
              </label>
              <input
                id="o-note"
                className="input"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Gift wrap, call before delivery…"
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

export const OrdersPage: React.FC = () => {
  useAdminStore();
  const route = useRoute();
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');

  const viewMode = route.query.get('view') === 'list' ? 'list' : 'board';
  const allOrders = getOrders();

  const filteredOrders = useMemo(
    () =>
      allOrders.filter(
        (o) =>
          (paymentFilter === 'all' || o.payment === paymentFilter) &&
          (!search ||
            `${o.id} ${getCustomerById(o.customer)?.name}`
              .toLowerCase()
              .includes(search.toLowerCase()))
      ),
    [allOrders, search, paymentFilter]
  );

  const activeOrder = allOrders.find((o) => o.id === route.params[0]);
  const countByStatus = (st: OrderStatus) => allOrders.filter((o) => o.status === st).length;

  return (
    <div className="view view--orders">
      <PageHeader
        title={['Orders', 'Board']}
        stats={
          <>
            <StatItem
              icon="bag"
              value={countByStatus('new') + countByStatus('packing')}
              fmt={(v) => String(Math.round(v))}
              label="To pack and send"
            />
            <StatItem
              icon="truck"
              value={countByStatus('shipped')}
              fmt={(v) => String(Math.round(v))}
              label="On the road"
            />
            <StatItem
              icon="return"
              value={countByStatus('returned')}
              fmt={(v) => String(Math.round(v))}
              label="Returned"
            />
          </>
        }
      />

      <div className="toolbar" data-in>
        <label className="search">
          <Icon name="search" size={16} />
          <span className="sr">Search orders</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders or customers"
          />
        </label>

        <div className="chips" role="group" aria-label="Payment">
          {[{ id: 'all', label: 'All' }, ...PAYMENT_OPTIONS].map((p) => (
            <button
              key={p.id}
              type="button"
              className="chip"
              aria-pressed={paymentFilter === p.id}
              onClick={() => setPaymentFilter(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <span className="toolbar__spacer" />

        <SegmentedControl
          label="View"
          value={viewMode}
          onChange={(v) => navigate(v === 'list' ? 'orders?view=list' : 'orders')}
          options={[
            { id: 'board', label: 'Board' },
            { id: 'list', label: 'List' },
          ]}
        />

        <button
          type="button"
          className="ibtn ibtn--glass"
          aria-label="Export orders as CSV"
          title="Export CSV"
          onClick={() => {
            exportOrdersCSV(filteredOrders);
            pushToast(`${pluralize(filteredOrders.length, 'order')} exported`);
          }}
        >
          <Icon name="download" />
        </button>
      </div>

      {viewMode === 'board' ? (
        <OrdersBoard list={filteredOrders} />
      ) : (
        <OrdersTable list={filteredOrders} />
      )}

      <OrderDetailDrawer
        order={activeOrder}
        onClose={() => navigate(`orders${viewMode === 'list' ? '?view=list' : ''}`)}
      />
    </div>
  );
};
