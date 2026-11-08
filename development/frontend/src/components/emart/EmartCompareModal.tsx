import React from 'react';
import { EMART_PRODUCTS } from '../../data/emartCatalog';
import {
  addToCart,
  formatPrice,
  toggleCompare,
  toggleCompareModal,
  useEmart,
} from '../../store/emartStore';
import { X, ArrowRightLeft, ShoppingBag, Trash2, CheckCircle, Star } from 'lucide-react';

export const EmartCompareModal: React.FC = () => {
  const store = useEmart();

  if (!store.isCompareModalOpen) return null;

  const compareProducts = EMART_PRODUCTS.filter((p) =>
    store.compareList.includes(p.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => toggleCompareModal(false)}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#023047]">
                Product Comparison Matrix
              </h3>
              <span className="text-xs text-slate-400 font-bold">
                Comparing {compareProducts.length} product{compareProducts.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          <button
            onClick={() => toggleCompareModal(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Matrix Body */}
        <div className="flex-1 overflow-auto p-6">
          {compareProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ArrowRightLeft className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-[#023047]">
                No products in comparison
              </h4>
              <p className="text-xs text-slate-400">
                Click the compare icon on product cards to add products for side-by-side analysis.
              </p>
            </div>
          ) : (
            <div className="min-w-[600px]">
              <div className="grid grid-cols-5 gap-4 border-b border-slate-100 pb-6 items-start">
                <div className="text-xs font-bold text-slate-400 uppercase pt-4">
                  Product
                </div>
                {compareProducts.map((p) => (
                  <div key={p.id} className="space-y-3 relative">
                    <button
                      onClick={() => toggleCompare(p.id)}
                      className="absolute -top-2 -right-2 p-1 text-slate-400 hover:text-rose-500 rounded-full bg-slate-100"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-full aspect-square rounded-2xl bg-slate-50 p-2 border border-slate-100 flex items-center justify-center">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="max-h-full object-contain"
                      />
                    </div>
                    <h4 className="text-xs font-bold text-[#023047] line-clamp-2">
                      {p.name}
                    </h4>
                    <div className="text-base font-black text-[#023047]">
                      {formatPrice(p.price, store.currency)}
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(p, 1)}
                      style={{ backgroundColor: '#FAB005', color: '#0f172a' }}
                      className="w-full py-2 hover:brightness-105 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 stroke-[2.2]" style={{ color: '#0f172a' }} />
                      <span style={{ color: '#0f172a' }}>Add to Bag</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Specs Rows */}
              <div className="divide-y divide-slate-100 text-xs">
                {/* Rating */}
                <div className="grid grid-cols-5 gap-4 py-3 items-center">
                  <span className="font-bold text-slate-400">Rating</span>
                  {compareProducts.map((p) => (
                    <div key={p.id} className="flex items-center gap-1 font-bold text-[#023047]">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{p.rating} / 5.0</span>
                    </div>
                  ))}
                </div>

                {/* Category */}
                <div className="grid grid-cols-5 gap-4 py-3 items-center">
                  <span className="font-bold text-slate-400">Category</span>
                  {compareProducts.map((p) => (
                    <span key={p.id} className="font-semibold text-slate-700">
                      {p.category} ({p.subCategory})
                    </span>
                  ))}
                </div>

                {/* Availability */}
                <div className="grid grid-cols-5 gap-4 py-3 items-center">
                  <span className="font-bold text-slate-400">Availability</span>
                  {compareProducts.map((p) => (
                    <span
                      key={p.id}
                      className="inline-flex items-center gap-1 text-emerald-600 font-bold"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{p.inStock ? 'Ready in Warehouse' : 'Out of Stock'}</span>
                    </span>
                  ))}
                </div>

                {/* Key Spec 1 */}
                <div className="grid grid-cols-5 gap-4 py-3 items-center">
                  <span className="font-bold text-slate-400">Key Feature</span>
                  {compareProducts.map((p) => (
                    <span key={p.id} className="text-slate-600 line-clamp-2">
                      {p.features[0] || 'Standard spec'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
