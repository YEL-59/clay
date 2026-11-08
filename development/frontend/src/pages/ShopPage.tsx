import React, { useMemo, useState } from 'react';
import { PRODUCTS } from '../data/catalog';
import { adminState, getProductStock, navigate } from '../store/adminStore';
import { ProductCategory, SizeCode } from '../types';
import { ShopHeader } from '../components/shop/ShopHeader';
import { ShopHero } from '../components/shop/ShopHero';
import { SizeFinderWidget } from '../components/shop/SizeFinderWidget';
import { ProductCard } from '../components/shop/ProductCard';
import { ProductDetailDrawer } from '../components/shop/ProductDetailDrawer';
import { CartDrawer } from '../components/shop/CartDrawer';
import { CheckoutModal } from '../components/shop/CheckoutModal';
import { OrderTrackingModal } from '../components/shop/OrderTrackingModal';
import { Icon } from '../components/ui/Icon';

const ALL_FAMILIES = [
  'All',
  'Teal',
  'Coral',
  'Blue',
  'Sea',
  'Sand',
  'Earth',
  'Midnight',
  'Rust',
  'Green',
];

const ALL_SIZES: SizeCode[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const ShopPage: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<ProductCategory | 'all'>('all');
  const [selectedFamily, setSelectedFamily] = useState('All');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<SizeCode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    // Category filter
    if (selectedCat !== 'all') {
      list = list.filter((p) => p.cat === selectedCat);
    }

    // Color Family filter
    if (selectedFamily !== 'All') {
      list = list.filter(
        (p) => p.family.toLowerCase() === selectedFamily.toLowerCase()
      );
    }

    // Size filter (must have > 0 stock in selected size)
    if (selectedSizeFilter) {
      list = list.filter((p) => {
        const stockQty = getProductStock(p.slug)[selectedSizeFilter] ?? 0;
        return stockQty > 0;
      });
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.family.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.blurb.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort(
        (a, b) =>
          (adminState.price[a.slug] ?? a.price) -
          (adminState.price[b.slug] ?? b.price)
      );
    } else if (sortBy === 'price-desc') {
      list.sort(
        (a, b) =>
          (adminState.price[b.slug] ?? b.price) -
          (adminState.price[a.slug] ?? a.price)
      );
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [selectedCat, selectedFamily, selectedSizeFilter, searchQuery, sortBy]);

  return (
    <div className="shop-page">
      <ShopHeader />

      <main className="shop-main">
        {/* Cinematic Hero & Live Drop 03 */}
        <ShopHero />

        {/* Interactive Garment Size Finder */}
        <SizeFinderWidget
          onSelectSizeFilter={(sz) => setSelectedSizeFilter(sz)}
          activeFilterSize={selectedSizeFilter}
        />

        {/* Collection Section */}
        <section className="shop-collection-section" id="collection">
          <div className="collection-header">
            <div className="collection-header__title-wrap">
              <span className="badge badge--pill badge--teal">
                100% Linen & Cotton · Small Batch
              </span>
              <h2 className="collection-title">The Striped Shirt Collection</h2>
              <p className="collection-sub">
                12 original cuts designed for breezy Dhaka afternoons, coastal journeys, and everyday comfort.
              </p>
            </div>

            {/* Quick stats indicator */}
            <div className="collection-count-pill">
              Showing <strong>{filteredProducts.length}</strong> of {PRODUCTS.length} shirts
            </div>
          </div>

          {/* Filter & Search Toolbar */}
          <div className="shop-filter-bar">
            {/* Search Input */}
            <div className="filter-search-box">
              <Icon name="search" size={16} />
              <input
                type="text"
                placeholder="Search by name, fabric, or color..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="filter-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="filter-clear-btn"
                  onClick={() => setSearchQuery('')}
                >
                  <Icon name="x" size={14} />
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="filter-chips-row">
              {[
                { id: 'all', label: 'All Cuts' },
                { id: 'short', label: 'Short Sleeve' },
                { id: 'long', label: 'Long Sleeve' },
                { id: 'oversized', label: 'Oversized' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`chip ${
                    selectedCat === c.id ? 'chip--active' : ''
                  }`}
                  onClick={() => setSelectedCat(c.id as any)}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Color Family Selector */}
            <div className="filter-select-wrap">
              <label htmlFor="family-select" className="filter-label">
                Color Family:
              </label>
              <select
                id="family-select"
                value={selectedFamily}
                onChange={(e) => setSelectedFamily(e.target.value)}
                className="filter-select"
              >
                {ALL_FAMILIES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Size Filter Selector */}
            <div className="filter-select-wrap">
              <label htmlFor="size-select" className="filter-label">
                Size Filter:
              </label>
              <select
                id="size-select"
                value={selectedSizeFilter || 'all'}
                onChange={(e) =>
                  setSelectedSizeFilter(
                    e.target.value === 'all'
                      ? null
                      : (e.target.value as SizeCode)
                  )
                }
                className="filter-select"
              >
                <option value="all">All Sizes (XS–XXL)</option>
                {ALL_SIZES.map((s) => (
                  <option key={s} value={s}>
                    In Stock in {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting */}
            <div className="filter-select-wrap">
              <label htmlFor="sort-select" className="filter-label">
                Sort:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="filter-select"
              >
                <option value="featured">Featured / Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedCat !== 'all' ||
            selectedFamily !== 'All' ||
            selectedSizeFilter !== null ||
            searchQuery) && (
            <div className="active-filters-banner">
              <span>Filtered by:</span>
              {selectedCat !== 'all' && (
                <span className="active-filter-tag">
                  {selectedCat} sleeve
                  <button
                    type="button"
                    onClick={() => setSelectedCat('all')}
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedFamily !== 'All' && (
                <span className="active-filter-tag">
                  Color: {selectedFamily}
                  <button
                    type="button"
                    onClick={() => setSelectedFamily('All')}
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedSizeFilter && (
                <span className="active-filter-tag">
                  Size: {selectedSizeFilter}
                  <button
                    type="button"
                    onClick={() => setSelectedSizeFilter(null)}
                  >
                    ×
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="active-filter-tag">
                  &ldquo;{searchQuery}&rdquo;
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                type="button"
                className="clear-all-filters-btn"
                onClick={() => {
                  setSelectedCat('all');
                  setSelectedFamily('All');
                  setSelectedSizeFilter(null);
                  setSearchQuery('');
                }}
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="collection-empty">
              <Icon name="search" size={40} />
              <h3>No shirts match your criteria</h3>
              <p>Try resetting your size or color filters to view more styles.</p>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => {
                  setSelectedCat('all');
                  setSelectedFamily('All');
                  setSelectedSizeFilter(null);
                  setSearchQuery('');
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="shop-products-grid">
              {filteredProducts.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </section>

        {/* Editorial Story & Atelier Section */}
        <section className="shop-story-section">
          <div className="story-card">
            <div className="story-card__content">
              <span className="badge badge--pill badge--teal">
                Slow Fashion Craft
              </span>
              <h2 className="story-title">
                Handcrafted on heritage shuttle looms.
              </h2>
              <p className="story-desc">
                We dye our yarn prior to weaving so every stripe carries depth,
                colorfast resilience, and a soft, broken-in hand feel from the
                first wear. No synthetic polyester blends. No mass warehouse overstock.
              </p>
              <div className="story-pillars">
                <div className="pillar">
                  <Icon name="check" size={16} />
                  <span>French Normandie Flax Linen</span>
                </div>
                <div className="pillar">
                  <Icon name="check" size={16} />
                  <span>Single-Needle Tailoring</span>
                </div>
                <div className="pillar">
                  <Icon name="check" size={16} />
                  <span>Plastic-Free Recycled Paper Packaging</span>
                </div>
              </div>
            </div>

            <div className="story-card__media">
              <img
                src="/raye/photos/220-raye/about-loom.jpg"
                alt="Workshop Loom"
                className="story-img"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Storefront Footer */}
        <footer className="shop-footer">
          <div className="shop-footer__top">
            <div className="footer-brand">
              <div className="brand brand--shop">
                <span className="brand__mark">R</span>
                <span className="brand__name">Raye Striped-Shirt</span>
              </div>
              <p className="footer-blurb">
                Direct-to-consumer linen and cotton striped shirts tailored in Dhaka,
                Bangladesh. Designed for hot humid monsoons and breezy seaside weekends.
              </p>
              <div className="footer-location">
                <Icon name="grid" size={14} />
                <span>Atelier: Gulshan-2, Dhaka 1212, Bangladesh</span>
              </div>
            </div>

            <div className="footer-links-group">
              <h4>Shop By Cut</h4>
              <ul>
                <li>
                  <button type="button" onClick={() => setSelectedCat('short')}>
                    Short Sleeve Shirts
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setSelectedCat('long')}>
                    Long Sleeve Shirts
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setSelectedCat('oversized')}>
                    Oversized Summer Fits
                  </button>
                </li>
                <li>
                  <a href="#drop03">Drop 03 · Rust Bengal</a>
                </li>
              </ul>
            </div>

            <div className="footer-links-group">
              <h4>Customer Support</h4>
              <ul>
                <li>
                  <a href="#size-finder">Garment Size Finder</a>
                </li>
                <li>
                  <a href="#/assets">Lookbook & Offline Assets</a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('overview')}
                    className="admin-footer-link"
                  >
                    🛡️ Store Back Office (Admin)
                  </button>
                </li>
              </ul>
            </div>

            <div className="footer-links-group">
              <h4>Nationwide Delivery</h4>
              <p className="footer-delivery-info">
                Cash on delivery across all 64 districts. Inside Dhaka: 1–2 days (৳80).
                Nationwide: 3–4 days (৳150). Free over ৳3,000.
              </p>
              <div className="payment-badges-row">
                <span className="pay-badge">bKash</span>
                <span className="pay-badge">Nagad</span>
                <span className="pay-badge">Visa</span>
                <span className="pay-badge">Mastercard</span>
                <span className="pay-badge">COD</span>
              </div>
            </div>
          </div>

          <div className="shop-footer__bottom">
            <span>© 2026 Shifatdevs (Raye Apparel Studio). All rights reserved.</span>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => navigate('overview')}
            >
              <Icon name="grid" size={14} />
              <span>Switch to Admin Dashboard</span>
            </button>
          </div>
        </footer>
      </main>

      {/* Slide-over Drawers and Modals */}
      <ProductDetailDrawer />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
    </div>
  );
};
