import React, { useMemo, useState } from 'react';
import { PRODUCTS } from '../../data/catalog';
import { Product, SizeCode, ProductCategory } from '../../types';
import {
  useEmart,
  addToCart,
  toggleCartDrawer,
  openQuickView,
  emartToast,
} from '../../store/emartStore';
import { EmartProduct } from '../../data/emartCatalog';
import { Search, X, ShoppingBag, Star, Eye, Sparkles } from 'lucide-react';

const ALL_SIZES: SizeCode[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const ALL_FAMILIES = [
  'All',
  'Coral',
  'Teal',
  'Blue',
  'Earth',
  'Yellow',
  'Monochrome',
  'Green',
  'Midnight',
];

interface StripedCardProps {
  product: Product;
  currency: 'USD' | 'BDT';
}

const StripedShirtCard: React.FC<StripedCardProps> = ({ product, currency }) => {
  const [selectedSize, setSelectedSize] = useState<SizeCode>('M');
  const [isHovered, setIsHovered] = useState(false);

  // Format price in BDT or USD
  const formatShirtPrice = (bdtAmount: number) => {
    if (currency === 'BDT') {
      return `৳${bdtAmount.toLocaleString('en-US')}`;
    }
    const usd = Math.round(bdtAmount / 110);
    return `$${usd.toLocaleString('en-US')}`;
  };

  const activePriceDisplay = formatShirtPrice(product.price);
  const wasPriceDisplay = product.was ? formatShirtPrice(product.was) : null;
  const isSelectedSizeInStock = (product.stock[selectedSize] ?? 0) > 0;

  // Convert Product to EmartProduct for cart compatibility
  const handleAddToCart = () => {
    const priceValue = currency === 'BDT' ? product.price : Math.round(product.price / 110);
    const emartProd: EmartProduct = {
      id: `shirt_${product.slug}`,
      slug: product.slug,
      name: product.name,
      category: 'Fashion',
      subCategory:
        product.cat === 'short'
          ? 'Short Sleeve'
          : product.cat === 'long'
          ? 'Long Sleeve'
          : 'Oversized',
      price: priceValue,
      originalPrice: product.was
        ? currency === 'BDT'
          ? product.was
          : Math.round(product.was / 110)
        : priceValue,
      discountPercent: product.was
        ? Math.round(((product.was - product.price) / product.was) * 100)
        : undefined,
      rating: product.rating,
      reviewCount: product.reviews,
      inStock: isSelectedSizeInStock,
      stockQty: Object.values(product.stock).reduce((a, b) => a + b, 0),
      images: [product.img.src, ...(product.model ? [product.model.src] : [])],
      badge: product.tag,
      description: product.blurb,
      features: product.details,
      specs: {
        Fabric: product.fabric,
        Collar: product.details[0] || 'Camp Collar',
        Cut:
          product.cat === 'short'
            ? 'Short sleeve'
            : product.cat === 'long'
            ? 'Long sleeve'
            : 'Oversized',
        Origin: 'Dhaka Atelier Heritage Shuttle Loom',
      },
      colors: product.colours.map((c) => c.name),
      sizes: ALL_SIZES,
    };

    addToCart(emartProd, 1, selectedSize, product.colours[0]?.name || product.family);
    toggleCartDrawer(true);
  };

  return (
    <div
      className="group relative flex flex-col justify-between rounded-[26px] bg-[#FAF9F5] border border-slate-200/80 p-3.5 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-[#F2EFE9] mb-3">
        <img
          src={isHovered && product.model ? product.model.src : product.img.src}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Tag Badge */}
        {product.tag && (
          <span
            className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
              product.tag === 'Popular'
                ? 'bg-[#023047] text-white'
                : product.tag === 'New'
                ? 'bg-emerald-700 text-white'
                : product.tag === 'Sale'
                ? 'bg-rose-600 text-white'
                : 'bg-amber-600 text-white'
            }`}
          >
            {product.tag}
          </span>
        )}

        {/* Quick View Button on Hover */}
        <button
          type="button"
          onClick={() => {
            emartToast(`Viewing ${product.name} atelier specifications`, 'info');
          }}
          className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-slate-900 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 shadow-md hover:bg-white"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </button>
      </div>

      {/* Information Meta */}
      <div className="flex flex-col flex-1 justify-between space-y-2.5">
        <div>
          {/* Top Meta: Sleeve Type & Star Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span className="capitalize">
              {product.cat === 'short'
                ? 'Short sleeve'
                : product.cat === 'long'
                ? 'Long sleeve'
                : 'Oversized'}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-800">{product.rating}</span>
              <span className="text-slate-400 text-[11px]">({product.reviews})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-amber-700 transition-colors">
            {product.name}
          </h3>

          {/* Price & Color Row */}
          <div className="flex items-baseline justify-between mt-1.5">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-slate-900 tracking-tight">
                {activePriceDisplay}
              </span>
              {wasPriceDisplay && (
                <span className="text-xs font-semibold text-slate-400 line-through">
                  {wasPriceDisplay}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {product.family}
            </span>
          </div>
        </div>

        {/* Size Selection Pills */}
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-6 gap-1" role="group" aria-label="Available sizes">
            {ALL_SIZES.map((sz) => {
              const qty = product.stock[sz] ?? 0;
              const isOut = qty <= 0;
              const isSelected = selectedSize === sz;

              return (
                <button
                  key={sz}
                  type="button"
                  disabled={isOut}
                  onClick={() => setSelectedSize(sz)}
                  className={`h-7 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center ${
                    isSelected
                      ? 'bg-slate-950 text-white shadow-sm ring-1 ring-slate-900'
                      : isOut
                      ? 'bg-slate-100 text-slate-300 cursor-not-allowed line-through'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                  title={isOut ? `${sz} is Out of stock` : `${qty} available in ${sz}`}
                >
                  {sz}
                </button>
              );
            })}
          </div>

          {/* Add to Bag Button */}
          <button
            type="button"
            disabled={!isSelectedSizeInStock}
            onClick={handleAddToCart}
            className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
              isSelectedSizeInStock
                ? 'bg-white hover:bg-slate-950 text-slate-900 hover:text-white border border-slate-300 hover:border-slate-950 cursor-pointer active:scale-[0.98]'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>
              {isSelectedSizeInStock
                ? `Add ${selectedSize} to Bag · ${activePriceDisplay}`
                : `Sold Out in ${selectedSize}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const EmartStripedShirtSection: React.FC = () => {
  const store = useEmart();
  const [selectedCat, setSelectedCat] = useState<ProductCategory | 'all'>('all');
  const [selectedFamily, setSelectedFamily] = useState('All');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<SizeCode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Filtered & sorted product list
  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    if (selectedCat !== 'all') {
      list = list.filter((p) => p.cat === selectedCat);
    }

    if (selectedFamily !== 'All') {
      list = list.filter(
        (p) => p.family.toLowerCase() === selectedFamily.toLowerCase()
      );
    }

    if (selectedSizeFilter) {
      list = list.filter((p) => (p.stock[selectedSizeFilter] ?? 0) > 0);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.family.toLowerCase().includes(q) ||
          p.blurb.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // featured order
        break;
    }

    return list;
  }, [selectedCat, selectedFamily, selectedSizeFilter, searchQuery, sortBy]);

  return (
    <section id="striped-shirts" className="py-16 bg-gradient-to-b from-white via-[#FCFBF8] to-slate-50">
      <div className="container mx-auto px-4">
        {/* Section Header (Matching Screenshot) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/80 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              100% Linen & Cotton · Small Batch
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              The Striped Shirt Collection
            </h2>
            <p className="text-slate-500 text-sm md:text-base mt-1.5 max-w-2xl">
              12 original cuts designed for breezy Dhaka afternoons, coastal journeys, and everyday comfort.
            </p>
          </div>

          <div className="bg-slate-100/90 border border-slate-200/80 px-4 py-2 rounded-full text-xs font-medium text-slate-600 self-start md:self-auto">
            Showing <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> of {PRODUCTS.length} shirts
          </div>
        </div>

        {/* Filter & Search Toolbar (Matching Screenshot) */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 p-3.5 shadow-sm mb-8 flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, fabric, or color..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-full bg-slate-100 border border-transparent focus:border-slate-300 focus:bg-white text-xs text-slate-800 outline-none transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {[
              { id: 'all', label: 'All Cuts' },
              { id: 'short', label: 'Short Sleeve' },
              { id: 'long', label: 'Long Sleeve' },
              { id: 'oversized', label: 'Oversized' },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCat(c.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCat === c.id
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Color Family Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Color Family:</span>
            <select
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="py-1.5 px-3 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:bg-white"
            >
              {ALL_FAMILIES.map((fam) => (
                <option key={fam} value={fam}>
                  {fam}
                </option>
              ))}
            </select>
          </div>

          {/* Size Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Size Filter:</span>
            <select
              value={selectedSizeFilter || 'all'}
              onChange={(e) =>
                setSelectedSizeFilter(
                  e.target.value === 'all' ? null : (e.target.value as SizeCode)
                )
              }
              className="py-1.5 px-3 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:bg-white"
            >
              <option value="all">All Sizes (XS–XXL)</option>
              {ALL_SIZES.map((s) => (
                <option key={s} value={s}>
                  In Stock in {s}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 px-3 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:bg-white"
            >
              <option value="featured">Featured / Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* 5-Column Product Grid (Matching Screenshot) */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No shirts match your criteria</h3>
            <p className="text-xs text-slate-400 mt-1">Try resetting your filters or search term.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCat('all');
                setSelectedFamily('All');
                setSelectedSizeFilter(null);
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filteredProducts.map((p) => (
              <StripedShirtCard
                key={p.slug}
                product={p}
                currency={store.currency}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
