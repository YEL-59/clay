import React from 'react';
import { EMART_PRODUCTS } from '../../data/emartCatalog';
import {
  addToCart,
  formatPrice,
  mutateEmart,
  setActiveView,
  useEmart,
} from '../../store/emartStore';
import { Sparkles, ArrowRight, ShoppingBag } from 'lucide-react';

export const EmartFashionSection: React.FC = () => {
  const store = useEmart();
  const fashionProducts = EMART_PRODUCTS.filter((p) => p.category === 'Fashion');

  return (
    <section className="py-24 relative overflow-hidden bg-slate-50">
      {/* Huge Watermark text in background (matching e-mart design) */}
      <div className="absolute top-12 left-0 w-full overflow-hidden whitespace-nowrap opacity-[0.03] pointer-events-none select-none">
        <span className="text-[180px] font-black uppercase text-black leading-none">
          Fashion Week Summer 2026 Collection
        </span>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-rose-500">
              <Sparkles className="w-5 h-5 fill-current" />
              <span className="font-bold uppercase tracking-[0.2em] text-xs">
                New Season
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#023047] tracking-tight">
              Trending{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">
                Collection
              </span>
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setActiveView('shop', 'Fashion')}
            style={{ backgroundColor: '#023047', color: '#ffffff' }}
            className="group flex items-center gap-3 px-7 py-3.5 rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-[#023047]/20 hover:shadow-xl hover:bg-[#0f172a] transition-all hover:scale-105 active:scale-95 cursor-pointer border border-[#023047]/40"
          >
            <span style={{ color: '#ffffff', fontWeight: 800 }}>See All Looks</span>
            <ArrowRight className="w-4 h-4 text-[#FAB005] group-hover:translate-x-1.5 transition-transform" style={{ color: '#FAB005' }} />
          </button>
        </div>

        {/* Fashion Editorial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fashionProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setActiveView('product-detail', product.slug)}
              className="group relative h-[420px] sm:h-[480px] w-full bg-gray-900 rounded-[24px] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Background Image with hover zoom */}
              <img
                src={product.images[0]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Top Badges */}
              <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                  {product.badge || 'New Season'}
                </span>

                <span className="bg-[#FAB005] text-slate-950 text-xs font-black px-3 py-1.5 rounded-full shadow-md">
                  {formatPrice(product.price, store.currency)}
                </span>
              </div>

              {/* Bottom Info & Quick Add Button */}
              <div className="absolute bottom-6 inset-x-6 z-10 space-y-3">
                <span className="text-xs font-bold text-rose-300 uppercase tracking-widest">
                  {product.subCategory}
                </span>

                <h3 className="text-xl sm:text-2xl font-black text-white leading-snug group-hover:text-[#FAB005] transition-colors">
                  {product.name}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-2">
                  {product.description}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, 1, product.sizes?.[0]);
                    }}
                    style={{ backgroundColor: '#FAB005', color: '#0f172a' }}
                    className="flex items-center gap-2 px-5 py-2.5 hover:brightness-105 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 stroke-[2.2]" style={{ color: '#0f172a' }} />
                    <span style={{ color: '#0f172a' }}>Quick Add</span>
                  </button>

                  <span className="text-xs text-white/80 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>View Look</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
