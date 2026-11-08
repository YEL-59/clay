import React, { useState } from 'react';
import { getProductBySlug } from '../../data/catalog';
import { adminState, getProductPrice, getProductStock } from '../../store/adminStore';
import {
  addToCart,
  openProductDetail,
  useShopStore,
} from '../../store/shopStore';
import { SizeCode } from '../../types';
import { formatBDT } from '../../utils/format';
import { Icon } from '../ui/Icon';

const ALL_SIZES: SizeCode[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const ProductDetailDrawer: React.FC = () => {
  const shopStore = useShopStore();
  const [selectedSize, setSelectedSize] = useState<SizeCode>('M');
  const [qty, setQty] = useState(1);
  const [activePhoto, setActivePhoto] = useState<'flatlay' | 'model'>('model');

  if (!shopStore.selectedProductSlug) return null;

  const product = getProductBySlug(shopStore.selectedProductSlug);
  if (!product) return null;

  const activeStock = getProductStock(product.slug);
  const activePrice = getProductPrice(product.slug);
  const currentSizeStock = activeStock[selectedSize] ?? 0;
  const isAvailable = currentSizeStock > 0;

  const handleAdd = () => {
    addToCart(product.slug, selectedSize, qty);
    openProductDetail(null);
  };

  return (
    <div
      className="drawer-backdrop"
      onClick={() => openProductDetail(null)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-drawer-title"
    >
      <div
        className="drawer drawer--product"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer__header">
          <div className="drawer__title-wrap">
            <span className="badge badge--pill badge--teal">
              {product.cat === 'short'
                ? 'Short sleeve'
                : product.cat === 'long'
                ? 'Long sleeve'
                : 'Oversized'}{' '}
              · {product.family}
            </span>
            <h2 id="product-drawer-title" className="drawer__title">
              {product.name}
            </h2>
          </div>
          <button
            type="button"
            className="ibtn ibtn--ghost"
            onClick={() => openProductDetail(null)}
            aria-label="Close product drawer"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="drawer__body drawer__body--scroll">
          {/* Photos Showcase */}
          <div className="product-media-showcase">
            <div className="product-media-main">
              <img
                src={
                  activePhoto === 'model' && product.model
                    ? product.model.src
                    : product.img.src
                }
                alt={product.name}
                className="product-media-img"
              />
            </div>

            {product.model && (
              <div className="product-media-tabs">
                <button
                  type="button"
                  className={`btn btn--sm ${
                    activePhoto === 'model' ? 'btn--primary' : 'btn--ghost'
                  }`}
                  onClick={() => setActivePhoto('model')}
                >
                  On Model
                </button>
                <button
                  type="button"
                  className={`btn btn--sm ${
                    activePhoto === 'flatlay' ? 'btn--primary' : 'btn--ghost'
                  }`}
                  onClick={() => setActivePhoto('flatlay')}
                >
                  Studio Flatlay
                </button>
              </div>
            )}
          </div>

          {/* Pricing & Ratings */}
          <div className="product-price-strip">
            <div className="price-display">
              <span className="current-price">{formatBDT(activePrice)}</span>
              {product.was && product.was > activePrice && (
                <span className="was-price">{formatBDT(product.was)}</span>
              )}
            </div>
            <div className="rating-pill">
              <span className="rating-star">★</span>
              <strong>{product.rating}</strong>
              <span>({product.reviews} reviews)</span>
            </div>
          </div>

          <p className="product-blurb">{product.blurb}</p>

          {/* Fabric & Construction */}
          <div className="product-spec-card">
            <h4>Fabric & Tailoring</h4>
            <p className="fabric-text">
              <strong>{product.fabric}</strong>
            </p>
            <ul className="details-list">
              {product.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>

          {/* Sizing Selector */}
          <div className="product-size-section">
            <div className="size-section-header">
              <label className="size-label">Select Shirt Size</label>
              <span className="stock-hint">
                {currentSizeStock > 0 ? (
                  <span className="stock-hint--in">
                    ● {currentSizeStock} units left in {selectedSize}
                  </span>
                ) : (
                  <span className="stock-hint--out">● Size {selectedSize} Sold Out</span>
                )}
              </span>
            </div>

            <div className="size-grid-drawer">
              {ALL_SIZES.map((sz) => {
                const stockQty = activeStock[sz] ?? 0;
                const isOut = stockQty <= 0;
                const isSel = selectedSize === sz;

                return (
                  <button
                    key={sz}
                    type="button"
                    disabled={isOut}
                    className={`size-tile ${isSel ? 'is-selected' : ''} ${
                      isOut ? 'is-out' : stockQty <= 3 ? 'is-low' : ''
                    }`}
                    onClick={() => setSelectedSize(sz)}
                  >
                    <span className="size-tile__code">{sz}</span>
                    <span className="size-tile__stock">
                      {isOut ? 'Sold out' : `${stockQty} left`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="product-qty-row">
            <label className="qty-label">Quantity</label>
            <div className="qty-stepper">
              <button
                type="button"
                className="qty-btn"
                disabled={qty <= 1}
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <span className="qty-val">{qty}</span>
              <button
                type="button"
                className="qty-btn"
                disabled={qty >= currentSizeStock}
                onClick={() => setQty((q) => Math.min(currentSizeStock, q + 1))}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="drawer__footer">
          <button
            type="button"
            disabled={!isAvailable}
            className={`btn btn--full ${
              isAvailable ? 'btn--primary' : 'btn--disabled'
            }`}
            onClick={handleAdd}
          >
            <Icon name="tag" size={16} />
            <span>
              {isAvailable
                ? `Add ${qty} × ${selectedSize} to Bag · ${formatBDT(
                    activePrice * qty
                  )}`
                : `Size ${selectedSize} is Sold Out`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
