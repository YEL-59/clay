import React, { useState } from 'react';
import { EMART_PRODUCTS } from '../../data/emartCatalog';
import {
  addToCart,
  formatPrice,
  openQuickView,
  setActiveView,
  toggleWishlist,
  useEmart,
} from '../../store/emartStore';
import { X, Star, ShoppingBag, Heart, CheckCircle2, ArrowRight } from 'lucide-react';

export const EmartQuickViewModal: React.FC = () => {
  const store = useEmart();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);

  if (!store.quickViewProductId) return null;

  const product = EMART_PRODUCTS.find((p) => p.id === store.quickViewProductId);
  if (!product) return null;

  const isWishlisted = store.wishlist.includes(product.id);

  const handleAdd = () => {
    addToCart(product, qty, selectedSize || product.sizes?.[0]);
    openQuickView(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => openQuickView(null)}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={() => openQuickView(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Gallery */}
        <div className="md:w-1/2 bg-[#F8F9FB] p-6 flex flex-col justify-between items-center">
          <div className="w-full aspect-square flex items-center justify-center p-4">
            <img
              src={product.images[selectedImageIdx] || product.images[0]}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 pt-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-14 h-14 rounded-xl border-2 p-1 bg-white overflow-hidden cursor-pointer transition-all ${
                    selectedImageIdx === idx
                      ? 'border-[#FAB005] scale-105 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={img}
                    alt="Thumbnail"
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {product.category} / {product.subCategory}
              </span>
              {product.badge && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {product.badge}
                </span>
              )}
            </div>

            <h2 className="text-xl font-black text-[#023047] leading-tight">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-700">
                {product.rating} ({product.reviewCount} customer reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 pt-1">
            <span className="text-2xl font-black text-[#023047]">
              {formatPrice(product.price, store.currency)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm font-semibold text-slate-400 line-through">
                {formatPrice(product.originalPrice, store.currency)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Sizes (if available) */}
          {product.sizes && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700 block">
                Select Size:
              </span>
              <div className="flex gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-10 h-10 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      (selectedSize || product.sizes?.[0]) === sz
                        ? 'border-[#FAB005] bg-[#FAB005] text-slate-950 font-black shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Specs Table */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-xs space-y-1.5">
            <span className="font-bold text-slate-700 block mb-1">
              Technical Specifications:
            </span>
            {Object.entries(product.specs).slice(0, 4).map(([key, val]) => (
              <div key={key} className="flex justify-between text-slate-600">
                <span className="text-slate-400">{key}:</span>
                <span className="font-semibold text-right">{val}</span>
              </div>
            ))}
          </div>

          {/* Quantity & CTA */}
          <div className="pt-4 flex items-center gap-3">
            <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-2 text-slate-600 hover:bg-slate-200 font-bold"
              >
                -
              </button>
              <span className="px-3 text-sm font-bold text-slate-800">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-3 py-2 text-slate-600 hover:bg-slate-200 font-bold"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              style={{ backgroundColor: '#FAB005', color: '#0f172a' }}
              className="flex-1 py-3 hover:brightness-105 font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.2]" style={{ color: '#0f172a' }} />
              <span style={{ color: '#0f172a' }}>Add to Bag</span>
            </button>

            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                isWishlisted
                  ? 'bg-rose-500 border-rose-500 text-white'
                  : 'border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* View Complete Product Page Link */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                openQuickView(null);
                setActiveView('product-detail', product.slug);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#FAB005] transition-colors cursor-pointer"
            >
              <span>View Full Product Specifications & Reviews</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
