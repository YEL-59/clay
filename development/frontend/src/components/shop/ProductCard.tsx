import React, { useState } from 'react';
import { Product, SizeCode } from '../../types';
import { getProductPrice, getProductStock } from '../../store/adminStore';
import { addToCart, openProductDetail } from '../../store/shopStore';
import { formatBDT } from '../../utils/format';
import { Icon } from '../ui/Icon';

const ALL_SIZES: SizeCode[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState<SizeCode>('M');
  const [isHovered, setIsHovered] = useState(false);

  // Active stock and price safely retrieved from adminStore
  const activeStock = getProductStock(product.slug);
  const activePrice = getProductPrice(product.slug);
  const isAvailable = (activeStock[selectedSize] ?? 0) > 0;
  const totalUnits = Object.values(activeStock).reduce((sum, n) => sum + n, 0);

  return (
    <div
      className="shop-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image & Badges */}
      <div className="shop-card__media-wrap">
        <button
          type="button"
          className="shop-card__media-btn"
          onClick={() => openProductDetail(product.slug)}
          aria-label={`View details for ${product.name}`}
        >
          <img
            src={
              isHovered && product.model
                ? product.model.src
                : product.img.src
            }
            alt={product.name}
            className="shop-card__img"
            loading="lazy"
          />
        </button>

        {product.tag && (
          <span
            className={`badge badge--pill shop-card__tag ${
              product.tag === 'Sale'
                ? 'badge--coral'
                : product.tag === 'Limited'
                ? 'badge--teal'
                : 'badge--sky'
            }`}
          >
            {product.tag}
          </span>
        )}

        <button
          type="button"
          className="shop-card__quick-view-btn"
          onClick={() => openProductDetail(product.slug)}
          aria-label={`Quick look at ${product.name}`}
          title="Quick look"
        >
          <Icon name="search" size={15} />
          <span>Quick View</span>
        </button>
      </div>

      {/* Product Information */}
      <div className="shop-card__info">
        <div className="shop-card__meta-row">
          <span className="shop-card__cat">
            {product.cat === 'short'
              ? 'Short sleeve'
              : product.cat === 'long'
              ? 'Long sleeve'
              : 'Oversized'}
          </span>
          <div className="shop-card__rating">
            <span className="rating-star">★</span>
            <span className="rating-val">{product.rating}</span>
            <span className="rating-count">({product.reviews})</span>
          </div>
        </div>

        <h3 className="shop-card__name">
          <button
            type="button"
            className="shop-card__name-btn"
            onClick={() => openProductDetail(product.slug)}
          >
            {product.name}
          </button>
        </h3>

        <div className="shop-card__price-row">
          <span className="shop-card__price">{formatBDT(activePrice)}</span>
          {product.was && product.was > activePrice && (
            <span className="shop-card__was">{formatBDT(product.was)}</span>
          )}
          <span className="shop-card__family">{product.family}</span>
        </div>

        {/* Size Selection Pills */}
        <div className="shop-card__sizes">
          <div className="size-pills-row" role="group" aria-label="Available sizes">
            {ALL_SIZES.map((sz) => {
              const qty = activeStock[sz] ?? 0;
              const isOut = qty <= 0;
              const isSelected = selectedSize === sz;

              return (
                <button
                  key={sz}
                  type="button"
                  disabled={isOut}
                  className={`size-pill ${
                    isSelected ? 'is-selected' : ''
                  } ${isOut ? 'is-out' : qty <= 3 ? 'is-low' : ''}`}
                  onClick={() => setSelectedSize(sz)}
                  title={`${sz}: ${
                    isOut ? 'Sold out' : `${qty} left in stock`
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="shop-card__action">
          <button
            type="button"
            disabled={!isAvailable || totalUnits === 0}
            className={`btn btn--full ${
              isAvailable ? 'btn--primary' : 'btn--disabled'
            }`}
            onClick={() => addToCart(product.slug, selectedSize, 1)}
          >
            <Icon name="tag" size={15} />
            <span>
              {totalUnits === 0
                ? 'Completely Sold Out'
                : isAvailable
                ? `Add ${selectedSize} to Bag · ${formatBDT(activePrice)}`
                : `Size ${selectedSize} Sold Out`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
