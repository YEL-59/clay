import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '../components/ui/Icon';
import {
  Card,
  Drawer,
  EmptyState,
  PageHeader,
  StatItem,
} from '../components/ui/Primitives';
import {
  ASSET_LIBRARY,
  CATEGORIES,
  PRODUCTS,
  SIZES,
} from '../data/catalog';
import {
  adminState,
  getLowStockSizes,
  getOrders,
  getOutOfStockSizes,
  getProductPrice,
  getProductStock,
  getTotalProductStock,
  navigate,
  pushToast,
  restockAllSizes,
  setProductPrice,
  setSizeStock,
  useAdminStore,
  useRoute,
} from '../store/adminStore';
import { Product, SizeCode } from '../types';
import { animateBounce } from '../utils/animations';
import {
  formatBDT,
  formatCompactBDT,
  pluralize,
} from '../utils/format';
import {
  downloadOrganizedAssetsZip,
  downloadSingleAsset,
} from '../utils/offlineAssets';

const PRODUCT_FILTERS = [
  { id: 'all', label: 'All shirts' },
  { id: 'short', label: 'Short sleeve' },
  { id: 'long', label: 'Long sleeve' },
  { id: 'oversized', label: 'Oversized' },
  { id: 'low', label: 'Running low' },
];

const SizeCells: React.FC<{ slug: string }> = ({ slug }) => {
  const stock = getProductStock(slug);
  return (
    <span className="cells" aria-label={SIZES.map((s) => `${s} ${stock[s]}`).join(', ')}>
      {SIZES.map((sz) => (
        <span
          key={sz}
          className={`cell${
            stock[sz] === 0
              ? ' is-out'
              : stock[sz] <= adminState.settings.lowStock
                ? ' is-low'
                : ''
          }`}
        >
          <small>{sz}</small>
          <b className="num">{stock[sz]}</b>
        </span>
      ))}
    </span>
  );
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const lowCount = getLowStockSizes(product.slug).length;
  const outCount = getOutOfStockSizes(product.slug).length;

  return (
    <a className="pcard card" href={`#/products/${product.slug}`} data-in>
      <span className="pcard__img">
        <img
          src={product.img.src}
          width={product.img.w}
          height={product.img.h}
          alt={product.name}
          loading="lazy"
          decoding="async"
        />
        {product.tag && (
          <span
            className={`badge badge--${
              product.tag === 'Limited'
                ? 'navy'
                : product.tag === 'Sale'
                  ? 'coral'
                  : 'plain'
            }`}
          >
            {product.tag}
          </span>
        )}
        <button
          type="button"
          className="ibtn ibtn--sm pcard__dl"
          title={`Download ${product.name} photo for offline viewing`}
          aria-label={`Download ${product.name} photo`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            downloadSingleAsset(
              { src: product.img.src, folder: 'products/flatlays' },
              `shifatdevs-flatlay-${product.slug}.jpg`
            ).then(() => pushToast(`Downloaded ${product.name} photo`));
          }}
        >
          <Icon name="download" size={14} />
        </button>
      </span>

      <span className="pcard__body">
        <span className="pcard__row">
          <b className="pcard__name">{product.name}</b>
          <b className="num">{formatBDT(getProductPrice(product.slug))}</b>
        </span>
        <span className="pcard__row muted">
          <span>
            {CATEGORIES[product.cat]} · {product.family}
          </span>
          <span className="num">{getTotalProductStock(product.slug)} left</span>
        </span>
        <SizeCells slug={product.slug} />
        {(outCount > 0 || lowCount > 0) && (
          <span className="pcard__warn">
            {outCount > 0 && `${pluralize(outCount, 'size')} sold out`}
            {outCount > 0 && lowCount > 0 && ' · '}
            {lowCount > 0 && `${lowCount} running low`}
          </span>
        )}
      </span>
    </a>
  );
};

const SizeStepper: React.FC<{ slug: string; size: SizeCode }> = ({ slug, size }) => {
  const count = getProductStock(slug)[size];
  const numRef = useRef<HTMLElement>(null);

  const updateCount = (next: number) => {
    setSizeStock(slug, size, next);
    animateBounce(numRef.current);
  };

  return (
    <div
      className={`stepper${
        count === 0 ? ' is-out' : count <= adminState.settings.lowStock ? ' is-low' : ''
      }`}
    >
      <span className="stepper__size">{size}</span>
      <button
        type="button"
        className="ibtn ibtn--sm"
        aria-label={`One fewer in ${size}`}
        disabled={count === 0}
        onClick={() => updateCount(count - 1)}
      >
        <Icon name="minus" size={14} />
      </button>
      <b className="num stepper__n" ref={numRef} aria-live="polite">
        {count}
      </b>
      <button
        type="button"
        className="ibtn ibtn--sm"
        aria-label={`One more in ${size}`}
        onClick={() => updateCount(count + 1)}
      >
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
};

const ProductDetailDrawer: React.FC<{
  product?: Product;
  onClose: () => void;
}> = ({ product, onClose }) => {
  const [priceInput, setPriceInput] = useState('');

  useEffect(() => {
    if (product) {
      setPriceInput(String(getProductPrice(product.slug)));
    }
  }, [product?.slug]);

  const soldThreeWeeks = product
    ? getOrders()
        .filter((o) => o.status !== 'returned')
        .flatMap((o) => o.lines)
        .filter((l) => l.slug === product.slug)
        .reduce((sum, l) => sum + l.qty, 0)
    : 0;

  return (
    <Drawer
      open={!!product}
      onClose={onClose}
      title={product?.name ?? ''}
      sub={
        product &&
        `${CATEGORIES[product.cat]} · ${product.colours.map((c) => c.name).join(', ')}`
      }
      foot={
        product && (
          <div className="drawer__foot-row">
            <button
              type="button"
              className="btn btn--ghost grow"
              onClick={() => {
                downloadSingleAsset(
                  { src: product.img.src, folder: 'products/flatlays' },
                  `shifatdevs-${product.slug}-flatlay.jpg`
                ).then(() => pushToast(`Downloaded ${product.name} flatlay`));
              }}
            >
              <Icon name="download" size={16} />
              Download flatlay
            </button>
            {product.model && (
              <button
                type="button"
                className="btn btn--ink grow"
                onClick={() => {
                  downloadSingleAsset(
                    { src: product.model!.src, folder: 'products/lookbook' },
                    `shifatdevs-${product.slug}-model.jpg`
                  ).then(() => pushToast(`Downloaded ${product.name} lookbook`));
                }}
              >
                <Icon name="download" size={16} />
                Download lookbook
              </button>
            )}
          </div>
        )
      }
    >
      {product && (
        <div className="pd">
          <div className="pd__hero">
            <img
              src={(product.model ?? product.img).src}
              width={product.img.w}
              height={product.img.h}
              alt={product.name}
            />
            <dl>
              <div>
                <dt>In stock</dt>
                <dd className="num">{getTotalProductStock(product.slug)}</dd>
              </div>
              <div>
                <dt>Sold, 3 weeks</dt>
                <dd className="num">{soldThreeWeeks}</dd>
              </div>
              <div>
                <dt>Rating</dt>
                <dd>
                  {product.rating.toFixed(1)} · {product.reviews}
                </dd>
              </div>
            </dl>
          </div>

          <form
            className="pd__price"
            onSubmit={(e) => {
              e.preventDefault();
              const num = Number(priceInput);
              if (num) {
                setProductPrice(product.slug, num);
                setPriceInput(String(getProductPrice(product.slug)));
                pushToast(`${product.name} now ${formatBDT(getProductPrice(product.slug))}`);
              }
            }}
          >
            <label htmlFor="pd-price" className="field__label">
              Price
            </label>
            <span className="input input--prefix">
              <span>৳</span>
              <input
                id="pd-price"
                inputMode="numeric"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value.replace(/\D/g, ''))}
              />
            </span>
            <button
              type="submit"
              className="btn btn--ink"
              disabled={Number(priceInput) === getProductPrice(product.slug)}
            >
              Save
            </button>
            {product.was && (
              <small className="muted">Was {formatBDT(product.was)} before the sale</small>
            )}
          </form>

          <section>
            <div className="card__head">
              <h3 className="card__title">Stock by size</h3>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => {
                  restockAllSizes(product.slug, 10);
                  pushToast(`${product.name}: 10 more in every size`);
                }}
              >
                <Icon name="plus" size={15} />
                10 in every size
              </button>
            </div>
            <div className="steppers">
              {SIZES.map((sz) => (
                <SizeStepper key={sz} slug={product.slug} size={sz} />
              ))}
            </div>
            <p className="muted pd__hint">
              <Icon name="store" size={15} />
              The shop shows these straight away: a size at 0 is struck through and can’t be picked.
            </p>
          </section>
        </div>
      )}
    </Drawer>
  );
};

export const ProductsPage: React.FC = () => {
  useAdminStore();
  const route = useRoute();
  const [search, setSearch] = useState(route.query.get('q') ?? '');
  const [filter, setFilter] = useState(route.query.get('filter') || 'all');

  const filteredProducts = PRODUCTS.filter(
    (p) =>
      (filter === 'all' ||
        (filter === 'low'
          ? getLowStockSizes(p.slug).length + getOutOfStockSizes(p.slug).length > 0
          : p.cat === filter)) &&
      (!search || `${p.name} ${p.family}`.toLowerCase().includes(search.toLowerCase()))
  );

  const totalOnShelf = PRODUCTS.reduce((sum, p) => sum + getTotalProductStock(p.slug), 0);
  const totalStockValue = PRODUCTS.reduce(
    (sum, p) => sum + getTotalProductStock(p.slug) * getProductPrice(p.slug),
    0
  );
  const lowOrOutCount = PRODUCTS.reduce(
    (sum, p) => sum + getLowStockSizes(p.slug).length + getOutOfStockSizes(p.slug).length,
    0
  );

  const activeProduct = PRODUCTS.find((p) => p.slug === route.params[0]);

  return (
    <div className="view view--products">
      <PageHeader
        title={['Stock', '& prices']}
        stats={
          <>
            <StatItem
              icon="shirt"
              value={totalOnShelf}
              fmt={(v) => Math.round(v).toLocaleString('en-IN')}
              label="Shirts on the shelf"
            />
            <StatItem
              icon="cash"
              value={totalStockValue}
              fmt={(v) => formatCompactBDT(v)}
              label="Stock value at full price"
            />
            <StatItem
              icon="alert"
              value={lowOrOutCount}
              fmt={(v) => String(Math.round(v))}
              label="Sizes low or sold out"
            />
          </>
        }
        actions={
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => {
              const productAssets = ASSET_LIBRARY.filter((a) =>
                a.folder.startsWith('products/')
              );
              pushToast('Packaging product photos ZIP…');
              downloadOrganizedAssetsZip(productAssets, 'products/flatlays').then(() =>
                pushToast('Product photos ZIP downloaded for offline viewing')
              );
            }}
          >
            <Icon name="download" size={16} />
            Download product photos
          </button>
        }
      />

      <div className="toolbar" data-in>
        <label className="search">
          <Icon name="search" size={16} />
          <span className="sr">Search shirts</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shirts"
          />
        </label>

        <div className="chips" role="group" aria-label="Filter">
          {PRODUCT_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className="chip"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pgrid">
        {filteredProducts.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      {!filteredProducts.length && (
        <Card>
          <EmptyState
            icon="shirt"
            title="No shirts match"
            text="Clear the search or pick another filter."
          />
        </Card>
      )}

      <ProductDetailDrawer
        product={activeProduct}
        onClose={() => navigate('products')}
      />
    </div>
  );
};
