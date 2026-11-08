import React, { useMemo, useState } from 'react';
import { EMART_CATEGORIES, EMART_PRODUCTS } from '../../data/emartCatalog';
import { EmartProductCard } from './EmartProductCard';
import { mutateEmart, useEmart, setActiveView } from '../../store/emartStore';
import { Filter, SlidersHorizontal, Search, Star, X } from 'lucide-react';

export const EmartShopView: React.FC = () => {
  const store = useEmart();
  const [maxPrice, setMaxPrice] = useState<number>(360000);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const filteredProducts = useMemo(() => {
    let list = [...EMART_PRODUCTS];

    // Category
    if (store.activeCategory && store.activeCategory !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === store.activeCategory.toLowerCase());
    }

    // Search Query
    if (store.searchQuery.trim()) {
      const q = store.searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Price
    list = list.filter((p) => p.price <= maxPrice);

    // Stock
    if (onlyInStock) {
      list = list.filter((p) => p.inStock);
    }

    // Rating
    if (minRating > 0) {
      list = list.filter((p) => p.rating >= minRating);
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [store.activeCategory, store.searchQuery, maxPrice, onlyInStock, minRating, sortBy]);

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Breadcrumb & Title */}
        <div className="mb-8 space-y-2">
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
              onClick={() => setActiveView('shop', 'All')}
              className={`hover:text-slate-900 transition-colors cursor-pointer ${
                store.activeCategory === 'All' ? 'text-[#FAB005]' : 'text-slate-400'
              }`}
            >
              Shop Catalog
            </button>
            {store.activeCategory !== 'All' && (
              <>
                <span>/</span>
                <span className="text-[#023047] font-black">{store.activeCategory}</span>
              </>
            )}
          </div>
          <h1 className="text-3xl font-black text-[#023047] tracking-tight">
            Browse All Products
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Filters Sidebar */}
          <div className="w-full lg:w-72 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6 shrink-0">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-[#023047] font-bold text-sm">
                <Filter className="w-4 h-4 text-[#FAB005]" />
                <span>Filters & Options</span>
              </div>
              {(store.activeCategory !== 'All' || store.searchQuery || onlyInStock || minRating > 0) && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('shop', 'All');
                    mutateEmart((s) => {
                      s.searchQuery = '';
                    });
                    setOnlyInStock(false);
                    setMinRating(0);
                    setMaxPrice(360000);
                  }}
                  className="text-xs text-rose-500 font-bold hover:underline cursor-pointer"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Categories Selection */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Category
              </span>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveView('shop', 'All')}
                  style={
                    store.activeCategory === 'All'
                      ? { backgroundColor: '#FAB005', color: '#0f172a' }
                      : undefined
                  }
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    store.activeCategory === 'All'
                      ? 'bg-[#FAB005] text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Categories ({EMART_PRODUCTS.length})
                </button>

                {EMART_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveView('shop', cat.name)}
                    style={
                      store.activeCategory.toLowerCase() === cat.name.toLowerCase()
                        ? { backgroundColor: '#FAB005', color: '#0f172a' }
                        : undefined
                    }
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex justify-between items-center ${
                      store.activeCategory.toLowerCase() === cat.name.toLowerCase()
                        ? 'bg-[#FAB005] text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] opacity-75">{cat.itemCount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock Only */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="w-4 h-4 rounded text-[#FAB005] focus:ring-[#FAB005]"
                />
                <span>In-Stock Items Only</span>
              </label>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Minimum Rating
              </span>
              <div className="space-y-1 text-xs">
                {[4.5, 4.0, 3.0].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRating(minRating === r ? 0 : r)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${
                      minRating === r
                        ? 'bg-[#FFF8E6] text-[#023047] border border-[#FAB005]/40'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-slate-800">{r} & Above</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Product Grid & Sorting Toolbar */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-600">
                Showing{' '}
                <strong className="text-[#023047]">{filteredProducts.length}</strong> of{' '}
                {EMART_PRODUCTS.length} products
              </span>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#FAB005]"
                >
                  <option value="featured">Featured / Best Matches</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <Search className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-[#023047]">
                  No products matched your criteria
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try clearing your search query or selecting "All Categories".
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <EmartProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
