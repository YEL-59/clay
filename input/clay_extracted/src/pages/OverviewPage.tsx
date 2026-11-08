import React, { useEffect, useMemo, useState } from 'react';
import { LineAreaChart, ProgressRing } from '../components/charts/Charts';
import { Icon } from '../components/ui/Icon';
import {
  AnimatedNumber,
  Card,
  PageHeader,
  SegmentedControl,
  StatItem,
  Thumb,
} from '../components/ui/Primitives';
import {
  DROP_CLOSES_AT,
  PRODUCTS,
  SIZES,
  getProductBySlug,
} from '../data/catalog';
import {
  ACTIVE_DROP,
  CUT_SHARE,
  MONTHLY_SALES,
  MONTHLY_TARGET,
  MONTH_LABELS,
  ORDER_COLUMNS,
} from '../data/seed';
import {
  adminState,
  getCustomerById,
  getDropSoldCount,
  getLowStockSizes,
  getOrders,
  getOutOfStockSizes,
  getProductStock,
  getTotalProductStock,
  pushToast,
  restockAllSizes,
  useAdminStore,
} from '../store/adminStore';
import { ToneName } from '../types';
import {
  formatBDT,
  formatCompactBDT,
  formatDateTime,
  pluralize,
} from '../utils/format';

function useNowTick(intervalMs = 30000): number {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export const OverviewPage: React.FC = () => {
  useAdminStore();
  const [range, setRange] = useState<'6' | '12'>('12');
  const orders = getOrders();
  const toPackOrders = orders.filter((o) => o.status === 'new' || o.status === 'packing');

  const octSales = MONTHLY_SALES[MONTHLY_SALES.length - 1];
  const sepSales = MONTHLY_SALES[MONTHLY_SALES.length - 2];
  const momDeltaPct = Math.round(((octSales - sepSales) / sepSales) * 100);

  const nonReturned = orders.filter((o) => o.status !== 'returned');
  const avgOrderVal =
    nonReturned.reduce((sum, o) => sum + o.total, 0) / Math.max(1, nonReturned.length);

  const monthCount = range === '6' ? 6 : 12;
  const labels = MONTH_LABELS.slice(-monthCount);
  const values = MONTHLY_SALES.slice(-monthCount);
  const atTargetMonths = values.filter((v) => v >= MONTHLY_TARGET).length;

  const bestSellers = useMemo(() => {
    const stats: Record<string, { units: number; rev: number }> = {};
    for (const o of nonReturned) {
      for (const l of o.lines) {
        const entry = (stats[l.slug] ??= { units: 0, rev: 0 });
        entry.units += l.qty;
        entry.rev += l.qty * l.price;
      }
    }
    return Object.entries(stats)
      .sort((a, b) => b[1].units - a[1].units)
      .slice(0, 5);
  }, [nonReturned.length]);

  const topUnits = bestSellers[0]?.[1].units ?? 1;
  const dropProduct = getProductBySlug(ACTIVE_DROP.slug);
  const dropSold = getDropSoldCount();

  const now = useNowTick();
  const remainingMs = Math.max(0, DROP_CLOSES_AT - now);
  const daysLeft = Math.floor(remainingMs / 864e5);
  const hoursLeft = Math.floor((remainingMs / 36e5) % 24);
  const minsLeft = Math.floor((remainingMs / 6e4) % 60);

  const lowStockProducts = PRODUCTS.filter(
    (p) => getLowStockSizes(p.slug).length || getOutOfStockSizes(p.slug).length
  ).slice(0, 5);

  const cutMix: Array<{ id: string; label: string; tone: ToneName; share: number }> = [
    { id: 'short', label: 'Short sleeve', tone: 'coral', share: CUT_SHARE.short },
    { id: 'long', label: 'Long sleeve', tone: 'teal', share: CUT_SHARE.long },
    { id: 'oversized', label: 'Oversized', tone: 'navy', share: CUT_SHARE.oversized },
  ];

  return (
    <div className="view view--overview">
      <PageHeader
        title={['Shop', 'Overview']}
        stats={
          <>
            <StatItem
              icon="trend"
              value={octSales}
              fmt={formatBDT}
              label="Sales in October"
              badge={
                <span className={`badge badge--${momDeltaPct >= 0 ? 'teal' : 'coral'}`}>
                  {momDeltaPct >= 0 ? '+' : ''}
                  {momDeltaPct}% vs September
                </span>
              }
            />
            <StatItem
              icon="bag"
              value={toPackOrders.length}
              fmt={(v) => String(Math.round(v))}
              label="Orders to pack"
            />
            <StatItem icon="cash" value={avgOrderVal} fmt={formatBDT} label="Average order" />
          </>
        }
      />

      <div className="ov">
        <Card
          className="ov__sales"
          title="Sales"
          tools={
            <>
              <SegmentedControl
                label="Range"
                value={range}
                onChange={setRange}
                options={[
                  { id: '6', label: '6M' },
                  { id: '12', label: '12M' },
                ]}
              />
              <a
                className="ibtn"
                href="#/customers"
                aria-label="Customers"
                title="Customers"
              >
                <Icon name="out" />
              </a>
            </>
          }
        >
          <p className="big">
            <AnimatedNumber value={values.reduce((a, b) => a + b, 0)} fmt={formatBDT} />
            <span>
              in {monthCount} months · <b>{atTargetMonths}</b> of {monthCount} months at target
            </span>
          </p>
          <div className="legend">
            <span>
              <i className="tone--coral" />
              Sales
            </span>
            <span>
              <i className="tone--navy dash" />
              Monthly target · {formatCompactBDT(MONTHLY_TARGET)}
            </span>
          </div>
          <LineAreaChart
            labels={labels}
            height={250}
            fmt={formatBDT}
            axis={(v) => (v ? `৳${+(v / 1e5).toFixed(1)}L` : '0')}
            series={[
              { label: 'Sales', values, tone: 'coral', area: true },
              {
                label: 'Target',
                values: labels.map(() => MONTHLY_TARGET),
                tone: 'navy',
                dashed: true,
              },
            ]}
          />
        </Card>

        <Card
          className="ov__pack"
          title="To pack"
          sub={`${pluralize(toPackOrders.length, 'order')} waiting`}
          tools={
            <a className="ibtn" href="#/orders" aria-label="All orders" title="All orders">
              <Icon name="out" />
            </a>
          }
        >
          <div className="blocks">
            {[
              ...toPackOrders.filter((o) => o.status === 'new').slice(0, 2),
              ...toPackOrders.filter((o) => o.status === 'packing').slice(0, 2),
            ].map((o) => {
              const cust = getCustomerById(o.customer);
              const tone = ORDER_COLUMNS.find((c) => c.id === o.status)!.tone;
              const shirtCount = o.lines.reduce((s, l) => s + l.qty, 0);
              return (
                <a
                  key={o.id}
                  className={`block block--${tone}`}
                  href={`#/orders/${o.id}`}
                >
                  <span className="block__meta">
                    {o.status === 'new' ? 'New' : 'Packing'} · {formatDateTime(o.t)}
                  </span>
                  <b className="block__title">{cust?.name ?? 'Shop customer'}</b>
                  <span className="block__sub">
                    {pluralize(shirtCount, 'shirt')} · {cust?.district}
                  </span>
                  <span className="block__lines">
                    {o.lines.map((l) => (
                      <span key={l.slug + l.size}>
                        {getProductBySlug(l.slug).name}
                        <b>
                          {l.size}
                          {l.qty > 1 ? ` ×${l.qty}` : ''}
                        </b>
                      </span>
                    ))}
                  </span>
                  <span className="block__foot">
                    <b className="block__fig">{formatBDT(o.total)}</b>
                    <span className="block__thumbs">
                      {o.lines.slice(0, 3).map((l) => (
                        <Thumb
                          key={l.slug + l.size}
                          img={getProductBySlug(l.slug).img}
                          size={26}
                        />
                      ))}
                    </span>
                  </span>
                </a>
              );
            })}
          </div>
        </Card>

        <Card
          className="ov__drop"
          tone="teal"
          title="Drop 03 · Rust Bengal"
          tools={
            <a
              className="ibtn ibtn--on-dark"
              href="#/products/rust"
              aria-label="Open Rust Bengal"
              title="Open Rust Bengal"
            >
              <Icon name="out" />
            </a>
          }
        >
          <div className="drop">
            <ProgressRing value={dropSold / ACTIVE_DROP.batch} tone="sand">
              <b>{Math.round((dropSold / ACTIVE_DROP.batch) * 100)}%</b>
              <span>sold through</span>
            </ProgressRing>
            <dl className="drop__figs">
              <div>
                <dt>Sold</dt>
                <dd>
                  {dropSold} of {ACTIVE_DROP.batch}
                </dd>
              </div>
              <div>
                <dt>Left</dt>
                <dd>{getTotalProductStock(dropProduct.slug)}</dd>
              </div>
              <div>
                <dt>Closes in</dt>
                <dd className="num">
                  {daysLeft}d {hoursLeft}h {minsLeft}m
                </dd>
              </div>
            </dl>
          </div>
        </Card>

        <Card className="ov__mix" title="Sales by cut" sub="Share of October sales">
          <p className="big big--sm">
            <AnimatedNumber value={octSales} fmt={formatBDT} />
            <span>across {pluralize(PRODUCTS.length, 'shirt')}</span>
          </p>
          <div className="mix">
            {cutMix.map((c) => (
              <span
                key={c.id}
                className={`mix__bar tone--${c.tone}`}
                style={{ flexGrow: c.share }}
                title={c.label}
              />
            ))}
          </div>
          <ul className="rows">
            {cutMix.map((c) => (
              <li key={c.id}>
                <span className="rows__name">
                  <i className={`tone--${c.tone}`} />
                  {c.label}
                </span>
                <span className="num">{formatBDT(octSales * c.share)}</span>
                <span className="muted num">{Math.round(c.share * 100)}%</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="ov__best" title="Best sellers" sub="Last three weeks">
          <ol className="best">
            {bestSellers.map(([slug, stat], idx) => {
              const prod = getProductBySlug(slug);
              return (
                <li key={slug}>
                  <span className="best__rank">{idx + 1}</span>
                  <Thumb img={prod.img} size={40} />
                  <span className="best__name">
                    <b>{prod.name}</b>
                    <span className="meter">
                      <span
                        className="meter__fill tone--teal"
                        style={{ transform: `scaleX(${stat.units / topUnits})` }}
                      />
                    </span>
                  </span>
                  <span className="best__fig">
                    <b className="num">{stat.units}</b>
                    <small>{formatCompactBDT(stat.rev)}</small>
                  </span>
                </li>
              );
            })}
          </ol>
        </Card>

        <Card
          className="ov__stock"
          title="Running low"
          sub={`Sizes at ${adminState.settings.lowStock} or fewer`}
          tools={
            <a className="btn btn--ghost btn--sm" href="#/products?filter=low">
              All stock
            </a>
          }
        >
          <ul className="alerts">
            {lowStockProducts.map((p) => (
              <li key={p.slug}>
                <Thumb img={p.img} size={36} />
                <a className="alerts__name" href={`#/products/${p.slug}`}>
                  <b>{p.name}</b>
                  <small>{getTotalProductStock(p.slug)} in stock</small>
                </a>
                <span className="sizes-mini">
                  {SIZES.map((sz) => {
                    const count = getProductStock(p.slug)[sz];
                    return (
                      <i
                        key={sz}
                        className={
                          count === 0
                            ? 'is-out'
                            : count <= adminState.settings.lowStock
                              ? 'is-low'
                              : ''
                        }
                        title={`${sz}: ${count}`}
                      >
                        {sz}
                      </i>
                    );
                  })}
                </span>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => {
                    restockAllSizes(p.slug, 10);
                    pushToast(`${p.name}: 10 more in every size`);
                  }}
                >
                  Restock
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};
