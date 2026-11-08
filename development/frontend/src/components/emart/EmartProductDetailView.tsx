import React, { useState } from 'react';
import { EMART_PRODUCTS } from '../../data/emartCatalog';
import {
  addToCart,
  formatPrice,
  setActiveView,
  toggleCompare,
  toggleWishlist,
  useEmart,
} from '../../store/emartStore';
import { EmartProductCard } from './EmartProductCard';
import {
  Star,
  ShoppingBag,
  Heart,
  ArrowLeftRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
} from 'lucide-react';

export const EmartProductDetailView: React.FC = () => {
  const store = useEmart();
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);

  const product =
    EMART_PRODUCTS.find((p) => p.slug === store.selectedProductSlug) ||
    EMART_PRODUCTS[0];

  const isWishlisted = store.wishlist.includes(product.id);
  const isCompared = store.compareList.includes(product.id);

  const relatedProducts = EMART_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, qty, selectedSize || product.sizes?.[0]);
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Link & Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveView('shop', product.category)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#FAB005] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to {product.category}</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
            <button
              type="button"
              onClick={() => setActiveView('home')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => setActiveView('shop', product.category)}
              className="hover:text-slate-900 transition-colors cursor-pointer text-[#FAB005]"
            >
              {product.category}
            </button>
            <span>/</span>
            <span className="text-[#023047] font-black">{product.subCategory}</span>
          </div>
        </div>

        {/* Main Product Showcase Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm mb-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="w-full aspect-square bg-[#F8F9FB] rounded-2xl p-6 flex items-center justify-center border border-slate-100 relative overflow-hidden group">
              <img
                src={product.images[selectedImgIdx] || product.images[0]}
                alt={product.name}
                className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-rose-500 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImgIdx(idx)}
                    className={`w-16 h-16 rounded-xl border-2 p-1 bg-white cursor-pointer transition-all ${
                      selectedImgIdx === idx
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

          {/* Right Column: Details & Ordering */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#FAB005] uppercase tracking-widest bg-[#FFF8E6] px-3 py-1 rounded-full border border-[#FAB005]/20">
                Official E-Mart Guarantee
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#023047] leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#023047]">
                  {product.rating} ({product.reviewCount} customer reviews)
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>In Stock ({product.stockQty} units)</span>
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-3xl font-black text-[#023047]">
                {formatPrice(product.price, store.currency)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-base font-semibold text-slate-400 line-through">
                  {formatPrice(product.originalPrice, store.currency)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Sizes (if available) */}
            {product.sizes && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  Select Size:
                </span>
                <div className="flex gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`w-12 h-12 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
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

            {/* Key Features Bullet points */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Highlights:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FAB005]" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions & Quantity */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2.5 text-slate-600 hover:bg-slate-200 font-bold"
                >
                  -
                </button>
                <span className="px-3 text-sm font-bold text-slate-800">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-2.5 text-slate-600 hover:bg-slate-200 font-bold"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                style={{ backgroundColor: '#FAB005', color: '#0f172a' }}
                className="flex-1 py-3.5 px-6 hover:brightness-105 text-slate-950 font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02] active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.2]" style={{ color: '#0f172a' }} />
                <span style={{ color: '#0f172a' }}>Add to Shopping Bag</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'bg-rose-500 border-rose-500 text-white'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => toggleCompare(product.id)}
                className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                  isCompared
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
                title="Compare"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-slate-600 text-[11px]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#FAB005]" />
                <span>Express Dhaka Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FAB005]" />
                <span>Official Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#FAB005]" />
                <span>30-Day Hassle Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specs Detailed Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-14 space-y-4">
          <h3 className="text-base font-black text-[#023047] uppercase tracking-wider">
            Complete Product Specifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {Object.entries(product.specs).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <span className="font-bold text-slate-400">{key}:</span>
                <span className="font-bold text-[#023047] text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-[#023047]">
              You May Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <EmartProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
