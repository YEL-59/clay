import React, { useState } from 'react';
import {
  applyPromoCode,
  calculateCartTotals,
  removeFromCart,
  removePromoCode,
  setDeliveryMethod,
  toggleCart,
  toggleCheckout,
  updateCartQty,
  useShopStore,
} from '../../store/shopStore';
import { DeliveryMethodId } from '../../types';
import { formatBDT } from '../../utils/format';
import { Icon } from '../ui/Icon';

export const CartDrawer: React.FC = () => {
  const shopStore = useShopStore();
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  if (!shopStore.cartOpen) return null;

  const totals = calculateCartTotals(
    shopStore.cart,
    shopStore.promoDiscount,
    shopStore.deliveryMethod
  );

  const freeShippingThreshold = 3000;
  const neededForFree = Math.max(0, freeShippingThreshold - totals.subtotal);
  const freePct = Math.min(
    100,
    Math.round((totals.subtotal / freeShippingThreshold) * 100)
  );

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoMsg({ text: res.message, isError: !res.success });
    if (res.success) setPromoInput('');
  };

  return (
    <div
      className="drawer-backdrop"
      onClick={() => toggleCart(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      <div className="drawer drawer--cart" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer__header">
          <div className="drawer__title-wrap">
            <h2 id="cart-drawer-title" className="drawer__title">
              Your Shopping Bag
            </h2>
            <span className="cart-count-pill">
              {shopStore.cart.reduce((s, i) => s + i.qty, 0)} items
            </span>
          </div>
          <button
            type="button"
            className="ibtn ibtn--ghost"
            onClick={() => toggleCart(false)}
            aria-label="Close bag drawer"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Free shipping banner */}
        <div className="free-shipping-bar">
          <div className="free-shipping-bar__label">
            {totals.subtotal >= freeShippingThreshold ||
            shopStore.promoDiscount === -1 ? (
              <span className="free-shipping-bar__ok">
                🎉 Congratulations! You have unlocked <strong>Free Nationwide Delivery</strong>!
              </span>
            ) : (
              <span>
                Add <strong>{formatBDT(neededForFree)}</strong> more for{' '}
                <strong>Free Delivery</strong> anywhere in Bangladesh!
              </span>
            )}
          </div>
          <div className="free-shipping-bar__track">
            <div
              className="free-shipping-bar__fill"
              style={{
                width: `${
                  shopStore.promoDiscount === -1 ? 100 : freePct
                }%`,
              }}
            />
          </div>
        </div>

        {/* Body */}
        <div className="drawer__body drawer__body--scroll">
          {shopStore.cart.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-icon-wrap">
                <Icon name="tag" size={36} />
              </div>
              <h3>Your bag is empty</h3>
              <p>Explore our yarn-dyed striped shirt collection handcrafted in Dhaka.</p>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => toggleCart(false)}
              >
                Browse Collection
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {shopStore.cart.map((item) => (
                <div
                  key={`${item.slug}-${item.size}`}
                  className="cart-item-row"
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="cart-item-img"
                  />
                  <div className="cart-item-info">
                    <div className="cart-item-top">
                      <h4 className="cart-item-title">{item.name}</h4>
                      <button
                        type="button"
                        className="cart-item-remove"
                        onClick={() => removeFromCart(item.slug, item.size)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Icon name="x" size={14} />
                      </button>
                    </div>

                    <div className="cart-item-size-badge">
                      <span>Size: <strong>{item.size}</strong></span>
                      <span className="cart-item-unit-price">
                        {formatBDT(item.price)} each
                      </span>
                    </div>

                    <div className="cart-item-bottom">
                      <div className="qty-stepper qty-stepper--sm">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() =>
                            updateCartQty(item.slug, item.size, -1)
                          }
                        >
                          -
                        </button>
                        <span className="qty-val">{item.qty}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => updateCartQty(item.slug, item.size, 1)}
                        >
                          +
                        </button>
                      </div>

                      <strong className="cart-item-total">
                        {formatBDT(item.price * item.qty)}
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {shopStore.cart.length > 0 && (
            <>
              {/* Delivery Destination Selector */}
              <div className="delivery-select-box">
                <label className="delivery-box-title">
                  Delivery Destination
                </label>
                <div className="delivery-options-grid">
                  {[
                    { id: 'dhaka', label: 'Inside Dhaka', fee: 80 },
                    { id: 'outside', label: 'Outside Dhaka', fee: 150 },
                    { id: 'express', label: 'Dhaka Express (Same Day)', fee: 250 },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`delivery-option-btn ${
                        shopStore.deliveryMethod === opt.id ? 'is-active' : ''
                      }`}
                      onClick={() =>
                        setDeliveryMethod(opt.id as DeliveryMethodId)
                      }
                    >
                      <span className="opt-name">{opt.label}</span>
                      <span className="opt-fee">
                        {totals.subtotal >= freeShippingThreshold ||
                        shopStore.promoDiscount === -1
                          ? 'FREE'
                          : formatBDT(opt.fee)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="promo-box">
                {shopStore.promoCode ? (
                  <div className="promo-active-tag">
                    <Icon name="check" size={16} />
                    <span>
                      Code <strong>{shopStore.promoCode}</strong> applied (
                      {shopStore.promoDiscount === -1
                        ? 'Free Delivery'
                        : `${shopStore.promoDiscount}% off`}
                      )
                    </span>
                    <button
                      type="button"
                      className="promo-remove-btn"
                      onClick={removePromoCode}
                      title="Remove promo"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="promo-form">
                    <input
                      type="text"
                      placeholder="Discount code (try RAYE10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="promo-input"
                    />
                    <button type="submit" className="btn btn--secondary btn--sm">
                      Apply
                    </button>
                  </form>
                )}
                {promoMsg && (
                  <div
                    className={`promo-feedback ${
                      promoMsg.isError ? 'is-error' : 'is-success'
                    }`}
                  >
                    {promoMsg.text}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Calculation & Checkout CTA */}
        {shopStore.cart.length > 0 && (
          <div className="drawer__footer drawer__footer--cart">
            <div className="cart-totals-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatBDT(totals.subtotal)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="summary-row summary-row--discount">
                  <span>Discount ({shopStore.promoCode})</span>
                  <span>-{formatBDT(totals.discount)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Estimated Delivery</span>
                <span>
                  {totals.shipping === 0 ? 'FREE' : formatBDT(totals.shipping)}
                </span>
              </div>
              <div className="summary-row summary-row--grand">
                <strong>Total Amount</strong>
                <strong>{formatBDT(totals.total)}</strong>
              </div>
            </div>

            <button
              type="button"
              className="btn btn--primary btn--full btn--lg"
              onClick={() => toggleCheckout(true)}
            >
              <span>Proceed to Checkout</span>
              <Icon name="arrow" size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
