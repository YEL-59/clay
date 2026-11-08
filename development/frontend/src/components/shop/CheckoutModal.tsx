import React, { useState } from 'react';
import {
  calculateCartTotals,
  placeOrder,
  toggleCheckout,
  useShopStore,
} from '../../store/shopStore';
import { PaymentMethodId } from '../../types';
import { formatBDT } from '../../utils/format';
import { Icon } from '../ui/Icon';

const BD_DISTRICTS = [
  'Dhaka',
  'Chattogram',
  'Sylhet',
  'Gazipur',
  'Narayanganj',
  'Cumilla',
  'Khulna',
  'Rajshahi',
  'Cox\'s Bazar',
  'Mymensingh',
  'Barishal',
  'Rangpur',
  'Bogura',
  'Jessore',
];

export const CheckoutModal: React.FC = () => {
  const shopStore = useShopStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('cod');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!shopStore.checkoutOpen) return null;

  const totals = calculateCartTotals(
    shopStore.cart,
    shopStore.promoDiscount,
    shopStore.deliveryMethod
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your full recipient name.');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setError('Please provide a valid 11-digit Bangladesh phone number (e.g. 01711223344).');
      return;
    }
    if (!address.trim()) {
      setError('Please enter your complete street delivery address.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      placeOrder({
        customer: {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          district,
          address: address.trim(),
          note: note.trim() || undefined,
        },
        lines: shopStore.cart.map((i) => ({
          slug: i.slug,
          size: i.size,
          qty: i.qty,
          price: i.price,
        })),
        promoCode: shopStore.promoCode || undefined,
        deliveryMethod: shopStore.deliveryMethod,
        paymentMethod,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={() => toggleCheckout(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
    >
      <div className="modal modal--checkout" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <div className="modal__title-wrap">
            <span className="badge badge--pill badge--teal">
              Secure Checkout · ৳ BDT
            </span>
            <h2 id="checkout-title" className="modal__title">
              Complete Your Linen Order
            </h2>
          </div>
          <button
            type="button"
            className="ibtn ibtn--ghost"
            onClick={() => toggleCheckout(false)}
            aria-label="Close checkout"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal__body">
          {error && <div className="checkout-alert is-error">{error}</div>}

          {/* Delivery Details */}
          <div className="checkout-section">
            <h3 className="checkout-section-title">
              1. Delivery Information
            </h3>

            <div className="form-grid">
              <div className="form-group">
                <label className="field-label" htmlFor="checkout-name">
                  Full Name *
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  placeholder="e.g. Tanvir Ahmed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="checkout-phone">
                  Phone Number (01XXXXXXXXX) *
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  placeholder="01711223344"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="checkout-email">
                  Email Address (Optional)
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="checkout-district">
                  District *
                </label>
                <select
                  id="checkout-district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="input"
                >
                  {BD_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group form-group--full">
                <label className="field-label" htmlFor="checkout-address">
                  Full Delivery Address *
                </label>
                <textarea
                  id="checkout-address"
                  required
                  rows={2}
                  placeholder="House number, Road, Area, Dhaka"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input"
                />
              </div>

              <div className="form-group form-group--full">
                <label className="field-label" htmlFor="checkout-note">
                  Order Note (Optional)
                </label>
                <input
                  id="checkout-note"
                  type="text"
                  placeholder="e.g. Call before delivery, gift wrap..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="checkout-section">
            <h3 className="checkout-section-title">
              2. Select Payment Method
            </h3>

            <div className="payment-methods-grid">
              {[
                {
                  id: 'cod',
                  label: 'Cash on Delivery (COD)',
                  desc: 'Pay cash when packet arrives at your door',
                  icon: 'box',
                },
                {
                  id: 'bkash',
                  label: 'bKash Merchant Pay',
                  desc: 'Instant checkout via bKash PGW',
                  icon: 'tag',
                },
                {
                  id: 'nagad',
                  label: 'Nagad Gateway',
                  desc: 'Pay zero surcharge via Nagad',
                  icon: 'tag',
                },
                {
                  id: 'card',
                  label: 'Debit / Credit Card',
                  desc: 'Visa, Mastercard, Amex, UnionPay',
                  icon: 'shield',
                },
              ].map((m) => (
                <label
                  key={m.id}
                  className={`payment-option-card ${
                    paymentMethod === m.id ? 'is-selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={paymentMethod === m.id}
                    onChange={() => setPaymentMethod(m.id as PaymentMethodId)}
                    className="sr-only"
                  />
                  <div className="payment-card-content">
                    <span className="payment-name">{m.label}</span>
                    <span className="payment-desc">{m.desc}</span>
                  </div>
                  <div className="payment-radio-indicator" />
                </label>
              ))}
            </div>
          </div>

          {/* Order Summary Strip */}
          <div className="checkout-summary-card">
            <div className="checkout-summary-items">
              {shopStore.cart.map((item) => (
                <div
                  key={`${item.slug}-${item.size}`}
                  className="checkout-item-preview"
                >
                  <span>
                    {item.name} ({item.size}) × {item.qty}
                  </span>
                  <span>{formatBDT(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <div className="checkout-summary-total-row">
              <div>
                <span>Total Amount Payable</span>
                {shopStore.promoCode && (
                  <small> (includes code {shopStore.promoCode})</small>
                )}
              </div>
              <span className="grand-price">{formatBDT(totals.total)}</span>
            </div>
          </div>

          <div className="modal__footer">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => toggleCheckout(false)}
            >
              Back to Bag
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn--primary btn--lg"
            >
              <Icon name="check" size={16} />
              <span>
                {isSubmitting
                  ? 'Confirming Order...'
                  : `Confirm Order · ${formatBDT(totals.total)}`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
