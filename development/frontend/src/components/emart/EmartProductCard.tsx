import React from 'react';
import { EmartProduct } from '../../data/emartCatalog';
import {
  addToCart,
  formatPrice,
  openQuickView,
  setActiveView,
  toggleCompare,
  toggleWishlist,
  useEmart,
} from '../../store/emartStore';
import {
  Heart,
  ArrowLeftRight,
  ShoppingCart,
  Star,
  ArrowUpRight,
} from 'lucide-react';

interface EmartProductCardProps {
  product: EmartProduct;
}

export const EmartProductCard: React.FC<EmartProductCardProps> = ({ product }) => {
  const store = useEmart();
  const isWishlisted = store.wishlist.includes(product.id);
  const isCompared = store.compareList.includes(product.id);

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="group bg-white rounded-[16px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 relative flex flex-col h-full">
      {/* Top Image Showcase Box */}
      <div className="relative overflow-hidden bg-[#F8F9FB] shrink-0 h-[250px] w-full flex items-center justify-center p-4">
        {/* Discount Badge */}
        {product.discountPercent && (
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <span className="bg-rose-500 text-white text-[10px] w-fit font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-rose-500/30">
              {product.discountPercent}% OFF
            </span>
          </div>
        )}

        {/* Floating Actions (Slide in on card hover) */}
        <div className="absolute right-4 top-4 flex flex-col gap-2 z-20 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            aria-label="Add to wishlist"
            className={`w-10 h-10 flex items-center justify-center cursor-pointer rounded-full shadow-lg border transition-all duration-300 ${
              isWishlisted
                ? 'bg-rose-500 border-rose-500 text-white scale-110'
                : 'bg-white/70 border-white/40 backdrop-blur-md text-slate-800 hover:bg-white hover:text-rose-500 hover:scale-110'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(product.id);
            }}
            aria-label="Add to compare"
            className={`w-10 h-10 flex items-center justify-center cursor-pointer rounded-full shadow-lg border transition-all duration-300 ${
              isCompared
                ? 'bg-blue-600 border-blue-600 text-white scale-110'
                : 'bg-white/70 border-white/40 backdrop-blur-md text-slate-800 hover:bg-white hover:text-blue-600 hover:scale-110'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* Centered Product Photo */}
        <div
          onClick={() => setActiveView('product-detail', product.slug)}
          className="relative h-full w-full flex items-center justify-center cursor-pointer"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
        </div>

        {/* Slide-Up Buy Now Floating Pill Button */}
        <div className="absolute inset-x-0 bottom-4 px-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-30 flex justify-center">
          <button
            onClick={handleBuyNow}
            aria-label="Buy Now"
            className="w-full cursor-pointer h-11 border border-white/20 bg-slate-950/60 backdrop-blur-md text-white rounded-full font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all duration-300 hover:bg-[#FAB005] hover:text-slate-950 hover:border-[#FAB005] hover:scale-105 active:scale-95 group/btn"
          >
            <ShoppingCart className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
            <span>Add to Cart</span>
          </button>
        </div>

        {/* Golden ambient blur spot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#FAB005]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
      </div>

      {/* Card Info Body */}
      <div className="p-6 flex flex-col justify-between flex-1 min-w-0 space-y-3">
        {/* Rating and Subcategory Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
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
            <span className="text-xs font-bold text-[#023047] mt-0.5">
              {product.rating.toFixed(1)}
            </span>
          </div>

          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {product.subCategory}
          </span>
        </div>

        {/* Title */}
        <h3
          onClick={() => setActiveView('product-detail', product.slug)}
          className="text-base font-bold text-[#023047] leading-snug group-hover:text-[#FAB005] transition-colors line-clamp-2 min-h-[44px] cursor-pointer"
        >
          {product.name}
        </h3>

        {/* Price and Action Row */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block -mb-0.5">
                Price
              </span>
              <span className="text-xl font-black text-[#023047] tracking-tight">
                {formatPrice(product.price, store.currency)}
              </span>
            </div>

            {product.inStock && (
              <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                In Stock
              </span>
            )}
          </div>

          {/* Quick View Button */}
          <button
            onClick={() => openQuickView(product.id)}
            aria-label="View details"
            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-[#023047] hover:text-slate-950 hover:border-[#FAB005] hover:bg-[#FAB005] transition-all cursor-pointer shadow-xs"
            title="Quick View Details"
          >
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
