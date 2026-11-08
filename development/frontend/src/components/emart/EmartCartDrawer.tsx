import React, { useState } from 'react';
import {
  applyCoupon,
  formatPrice,
  removeFromCart,
  removeCoupon,
  setActiveView,
  toggleCartDrawer,
  toggleCheckoutModal,
  updateCartQty,
  useEmart,
} from '../../store/emartStore';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  Truck,
  Check,
} from 'lucide-react';

export const EmartCartDrawer: React.FC = () => {
  const store = useEmart();
  const [couponInput, setCouponInput] = useState('');

  if (!store.isCartDrawerOpen) return null;

  const subtotal = store.cart.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );
  const discount = Math.round((subtotal * store.discountPercentage) / 100);
  const freeShippingThreshold = 200;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingFee = isFreeShipping || subtotal === 0 ? 0 : 25;
  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyCoupon(couponInput)) {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    toggleCartDrawer(false);
    toggleCheckoutModal(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => toggleCartDrawer(false)}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FAB005]/20 flex items-center justify-center text-[#FAB005]">
                <ShoppingBag className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#023047]">Shopping Bag</h3>
                <span className="text-xs text-slate-400 font-bold">
                  {store.cart.length} unique item{store.cart.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            <button
              onClick={() => toggleCartDrawer(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Tracker Bar */}
          <div className="bg-[#FFF8E6] px-6 py-3 border-b border-[#FAB005]/20">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#FAB005]" />
                {isFreeShipping ? (
                  <span className="text-emerald-700 font-black">
                    🎉 You qualify for FREE Shipping!
                  </span>
                ) : (
                  <span>
                    Add{' '}
                    <strong className="text-[#023047]">
                      {formatPrice(freeShippingThreshold - subtotal, store.currency)}
                    </strong>{' '}
                    more for FREE delivery!
                  </span>
                )}
              </span>
              <span className="font-black text-[#023047]">
                {Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%
              </span>
            </div>
            <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-[#FAB005]/30">
              <div
                className="h-full bg-[#FAB005] rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round((subtotal / freeShippingThreshold) * 100)
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-100">
            {store.cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#023047]">
                    Your bag is empty
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    Explore monitors, processors, or summer linen and add your favorite items!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    toggleCartDrawer(false);
                    setActiveView('shop', 'All');
                  }}
                  style={{ backgroundColor: '#FAB005', color: '#0f172a' }}
                  className="px-6 py-2.5 font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-md hover:brightness-105 active:scale-95 transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              store.cart.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-4 items-center">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-xs font-bold text-[#023047] truncate">
                      {item.product.name}
                    </h4>

                    {item.selectedSize && (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded mr-2">
                        Size: {item.selectedSize}
                      </span>
                    )}

                    <div className="text-xs font-black text-[#023047]">
                      {formatPrice(item.product.price, store.currency)}
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => updateCartQty(item.product.id, item.qty - 1)}
                          className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-slate-800">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.product.id, item.qty + 1)}
                          className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Coupon & Checkout */}
          {store.cart.length > 0 && (
            <div className="px-6 py-5 border-t border-slate-100 bg-slate-50 space-y-4">
              {/* Coupon Code Input */}
              {store.appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold">
                    <Check className="w-4 h-4" />
                    <span>Coupon "{store.appliedCoupon}" applied ({store.discountPercentage}% OFF)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-rose-500 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon code (try EMART10)"
                      className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-xs uppercase font-bold focus:outline-none focus:ring-1 focus:ring-[#FAB005]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 h-9 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-[#FAB005] hover:text-slate-950 transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800">
                    {formatPrice(subtotal, store.currency)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-rose-500 font-bold">
                    <span>Discount ({store.discountPercentage}%)</span>
                    <span>-{formatPrice(discount, store.currency)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-500">
                  <span>Shipping Estimate</span>
                  <span className="font-bold text-slate-800">
                    {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee, store.currency)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-black text-[#023047] pt-2 border-t border-slate-200">
                  <span>Estimated Total</span>
                  <span className="text-xl text-[#023047]">
                    {formatPrice(grandTotal, store.currency)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                style={{ backgroundColor: '#FAB005', color: '#0f172a' }}
                className="w-full py-3.5 hover:brightness-105 font-bold rounded-xl text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02] active:scale-95"
              >
                <span style={{ color: '#0f172a' }}>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" style={{ color: '#0f172a' }} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
