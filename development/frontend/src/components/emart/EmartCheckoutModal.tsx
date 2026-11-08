import React, { useState } from 'react';
import {
  formatPrice,
  placeOrder,
  toggleCheckoutModal,
  useEmart,
} from '../../store/emartStore';
import {
  X,
  ShieldCheck,
  CreditCard,
  Banknote,
  Smartphone,
  Lock,
} from 'lucide-react';

export const EmartCheckoutModal: React.FC = () => {
  const store = useEmart();
  const [fullName, setFullName] = useState(store.user.fullName);
  const [phone, setPhone] = useState(store.user.phone);
  const [address, setAddress] = useState(store.user.addresses[0]?.address || 'House 42, Road 11');
  const [city, setCity] = useState(store.user.addresses[0]?.city || 'Dhaka');
  const [zipCode, setZipCode] = useState('1212');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Card' | 'bKash' | 'Nagad'>('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!store.isCheckoutModalOpen) return null;

  const subtotal = store.cart.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );
  const discount = Math.round((subtotal * store.discountPercentage) / 100);
  const shippingFee = subtotal >= 200 || subtotal === 0 ? 0 : 25;
  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      placeOrder({
        fullName,
        phone,
        address,
        city,
        zipCode,
        paymentMethod,
      });
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => toggleCheckoutModal(false)}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#023047]">
                Secure Fast Checkout
              </h3>
              <span className="text-xs text-slate-400 font-bold">
                256-Bit SSL Encrypted Transaction
              </span>
            </div>
          </div>

          <button
            onClick={() => toggleCheckoutModal(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Shipping Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#023047] uppercase tracking-wider">
              1. Delivery Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 font-bold mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:outline-none focus:ring-1 focus:ring-[#FAB005]"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:outline-none focus:ring-1 focus:ring-[#FAB005]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-500 font-bold mb-1">
                  Delivery Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, Building, Apartment number"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:outline-none focus:ring-1 focus:ring-[#FAB005]"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">
                  City / District *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:outline-none focus:ring-1 focus:ring-[#FAB005]"
                >
                  <option value="Dhaka">Dhaka (Same/Next Day)</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Barisal">Barisal</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:outline-none focus:ring-1 focus:ring-[#FAB005]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#023047] uppercase tracking-wider">
              2. Select Payment Method
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* COD */}
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all cursor-pointer ${
                  paymentMethod === 'COD'
                    ? 'border-[#FAB005] bg-[#FFF8E6] shadow-sm'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-600" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Cash on Delivery
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Pay on arrival</span>
                </div>
              </button>

              {/* bKash */}
              <button
                type="button"
                onClick={() => setPaymentMethod('bKash')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all cursor-pointer ${
                  paymentMethod === 'bKash'
                    ? 'border-[#FAB005] bg-[#FFF8E6] shadow-sm'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <Smartphone className="w-5 h-5 text-pink-600" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">bKash</span>
                  <span className="text-[10px] text-slate-400 font-medium">Instant Mobile</span>
                </div>
              </button>

              {/* Nagad */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Nagad')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all cursor-pointer ${
                  paymentMethod === 'Nagad'
                    ? 'border-[#FAB005] bg-[#FFF8E6] shadow-sm'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <Smartphone className="w-5 h-5 text-orange-600" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Nagad</span>
                  <span className="text-[10px] text-slate-400 font-medium">Instant Wallet</span>
                </div>
              </button>

              {/* Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all cursor-pointer ${
                  paymentMethod === 'Card'
                    ? 'border-[#FAB005] bg-[#FFF8E6] shadow-sm'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <CreditCard className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Credit Card</span>
                  <span className="text-[10px] text-slate-400 font-medium">Visa / Amex</span>
                </div>
              </button>
            </div>
          </div>

          {/* Order Summary Recap */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Items Total ({store.cart.length} unique)</span>
              <span className="font-bold text-slate-800">
                {formatPrice(subtotal, store.currency)}
              </span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-rose-500 font-bold">
                <span>Coupon Discount ({store.discountPercentage}%)</span>
                <span>-{formatPrice(discount, store.currency)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-500">
              <span>Delivery Fee</span>
              <span className="font-bold text-slate-800">
                {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee, store.currency)}
              </span>
            </div>

            <div className="flex justify-between text-base font-black text-[#023047] pt-2 border-t border-slate-200">
              <span>Payable Amount:</span>
              <span className="text-xl text-[#023047]">
                {formatPrice(grandTotal, store.currency)}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ backgroundColor: '#FAB005', color: '#0f172a' }}
            className="w-full py-4 hover:brightness-105 font-black rounded-2xl text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            <Lock className="w-4 h-4 stroke-[2.2]" style={{ color: '#0f172a' }} />
            <span style={{ color: '#0f172a' }}>
              {isSubmitting
                ? 'Securing Order...'
                : `Place Order • ${formatPrice(grandTotal, store.currency)}`}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
