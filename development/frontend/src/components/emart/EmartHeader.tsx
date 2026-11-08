import React, { useState, useRef, useEffect } from 'react';
import {
  formatPrice,
  mutateEmart,
  setActiveUserTab,
  setActiveView,
  toggleCartDrawer,
  toggleCompareModal,
  toggleWishlistModal,
  toggleCategorySidebar,
  useEmart,
} from '../../store/emartStore';
import { EMART_PRODUCTS } from '../../data/emartCatalog';
import {
  Search,
  Heart,
  ShoppingBag,
  Bell,
  ChevronDown,
  Sparkles,
  Zap,
  X,
  Menu,
  LayoutDashboard,
} from 'lucide-react';

export const EmartHeader: React.FC = () => {
  const store = useEmart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const cartCount = store.cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = store.cart.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  // Close search suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    mutateEmart((s) => {
      s.searchQuery = val;
      if (s.activeView !== 'shop' && val.trim().length > 0) {
        s.activeView = 'shop';
      }
    });
  };

  const filteredSuggestions =
    store.searchQuery.trim().length > 0
      ? EMART_PRODUCTS.filter(
          (p) =>
            p.name.toLowerCase().includes(store.searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(store.searchQuery.toLowerCase())
        ).slice(0, 5)
      : [];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 transition-colors duration-300">
      {/* 1. Main Header: Brand, Big Search Bar with Dropdown & Yellow Button, Profile & Cart */}
      <div className="container mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo: Yellow square with letter 'E' and 'E-Mart' text */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 -ml-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveView('home')}
            className="flex items-center gap-3 cursor-pointer text-left select-none group"
          >
            {/* Yellow Square 'E' Icon */}
            <div
              style={{ backgroundColor: '#FAB005' }}
              className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-2xl text-slate-950 shadow-xs group-hover:scale-105 transition-transform"
            >
              <span>E</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-[#0f172a] leading-none">
                E-Mart
              </span>
              <span className="text-xs font-medium text-slate-400 mt-1 tracking-tight">
                Shop Smarter, Everyday
              </span>
            </div>
          </button>
        </div>

        {/* Center Search Bar: Large Input + Category Dropdown + Attached Yellow Search Button */}
        <div
          ref={searchContainerRef}
          className="hidden lg:flex items-center flex-1 max-w-2xl mx-8 relative"
        >
          <div className="w-full flex items-center h-11 rounded-xl border border-slate-200 bg-slate-50/80 focus-within:border-[#FAB005] focus-within:ring-2 focus-within:ring-[#FAB005]/20 focus-within:bg-white transition-all overflow-hidden">
            {/* Search Magnifying Glass Icon */}
            <Search className="w-4 h-4 text-slate-400 ml-4 mr-2.5 shrink-0" />

            {/* Search Input */}
            <input
              type="text"
              value={store.searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search for products, brands and more..."
              className="flex-1 h-full bg-transparent border-0 outline-none text-sm text-slate-800 placeholder:text-slate-400 font-medium"
            />

            {/* Clear Button */}
            {store.searchQuery && (
              <button
                type="button"
                onClick={() => mutateEmart((s) => (s.searchQuery = ''))}
                className="p-1 mr-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Category Filter Dropdown with Divider */}
            <div className="relative border-l border-slate-200 h-full flex items-center">
              <button
                type="button"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="h-full px-3.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer select-none"
              >
                <span>{selectedCategory}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs font-semibold">
                  {['All Categories', 'Electronics', 'Gadgets', 'Fashion', 'Room Decor', 'Toys'].map(
                    (cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsCategoryDropdownOpen(false);
                          setActiveView('shop', cat === 'All Categories' ? 'All' : cat);
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-amber-50 hover:text-[#D97706] cursor-pointer"
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Attached Yellow Search Action Button */}
            <button
              type="button"
              onClick={() => {
                if (store.searchQuery.trim()) {
                  setActiveView('shop');
                }
              }}
              style={{ backgroundColor: '#FAB005', color: '#0f172a' }}
              className="h-full w-12 flex items-center justify-center shrink-0 hover:brightness-105 active:scale-95 transition-all cursor-pointer"
              title="Search"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Autocomplete Suggestions Popover */}
          {isSearchFocused && filteredSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden divide-y divide-slate-100">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Matching Products ({filteredSuggestions.length})
              </div>
              {filteredSuggestions.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    setActiveView('product-detail', product.slug);
                    setIsSearchFocused(false);
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-amber-50/80 text-left transition-colors cursor-pointer"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-9 h-9 object-cover rounded-lg border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {product.name}
                    </p>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {product.category} · {formatPrice(product.price, store.currency)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Action Icons: Notification Bell, Wishlist, Cart & Profile */}
        <div className="flex items-center gap-3 lg:gap-5">
          {/* Notification Bell with Red Badge */}
          <button
            type="button"
            className="relative p-2 text-slate-800 hover:text-slate-950 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-800" />
            <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              2
            </span>
          </button>

          {/* Wishlist Heart with Red Badge */}
          <button
            type="button"
            onClick={() => toggleWishlistModal(true)}
            className="relative p-2 text-slate-800 hover:text-rose-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5 text-slate-800 hover:text-rose-500 transition-colors" />
            <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              3
            </span>
          </button>

          {/* Shopping Cart Bag with Yellow Badge, Label & Subtotal */}
          <button
            type="button"
            onClick={() => toggleCartDrawer(true)}
            className="flex items-center gap-2.5 p-1 text-slate-800 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer select-none"
            title="Cart"
            aria-label="Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-6 h-6 text-slate-800" />
              <span
                style={{ backgroundColor: '#FAB005', color: '#0f172a' }}
                className="absolute -top-1.5 -right-2 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs"
              >
                {cartCount > 0 ? cartCount : 1}
              </span>
            </div>
            <div className="text-left hidden sm:flex sm:flex-col">
              <span className="text-[11px] font-bold text-slate-400 -mb-0.5 leading-none">
                Cart
              </span>
              <span className="text-xs font-black text-slate-950 leading-tight">
                {formatPrice(cartSubtotal > 0 ? cartSubtotal : 1450, store.currency)}
              </span>
            </div>
          </button>

          {/* User Profile Avatar with Name & 'Premium Member' subtitle */}
          <div className="border-l border-slate-200 pl-4 ml-1 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setActiveView('user-dashboard');
                setActiveUserTab('profile');
              }}
              className="flex items-center gap-2.5 hover:opacity-90 transition-opacity cursor-pointer text-left select-none"
              title="Open Customer Dashboard"
            >
              <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                <img
                  src="/assets/images/tofayel_avatar.png"
                  alt="Tofayel Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden xl:block">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-900 leading-none">
                    Tofayel (Portal)
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] font-medium text-slate-400 leading-none">
                    Customer Portal
                  </span>
                  <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                </div>
              </div>
            </button>

            {/* Direct Admin Dashboard Link to Port 3006 */}
            <a
              href="http://localhost:3006/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                padding: '8px 14px',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 800,
                fontSize: '11px',
                textDecoration: 'none',
              }}
              className="hidden lg:inline-flex hover:bg-slate-800 shadow-xs transition-colors cursor-pointer select-none"
              title="Open Merchant & Admin Dashboard (Port 3006)"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#FAB005]" style={{ color: '#FAB005' }} />
              <span style={{ color: '#ffffff' }}>Admin (3006)</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Secondary Subnav Bar: Links and Flash Deals Pill Badge */}
      <div className="border-t border-slate-100 bg-white">
        <div className="container mx-auto px-4 flex items-center justify-between h-11">
          <nav className="hidden lg:flex items-center gap-7 text-[14px] font-semibold text-slate-700">
            {/* Home with active golden underline indicator */}
            <button
              type="button"
              onClick={() => setActiveView('home')}
              className={`flex items-center gap-1 transition-colors relative py-1 cursor-pointer ${
                store.activeView === 'home'
                  ? 'text-[#0f172a] font-bold'
                  : 'hover:text-[#FAB005]'
              }`}
            >
              <span>Home</span>
              {store.activeView === 'home' && (
                <span
                  style={{ backgroundColor: '#FAB005' }}
                  className="absolute -bottom-2.5 left-0 w-full h-[2.5px] rounded-full"
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveView('shop', 'All')}
              className={`hover:text-[#FAB005] transition-colors cursor-pointer ${
                store.activeView === 'shop' && store.activeCategory === 'All'
                  ? 'text-[#FAB005] font-bold'
                  : ''
              }`}
            >
              Shop
            </button>

            <button
              type="button"
              onClick={() => setActiveView('shop', 'Electronics')}
              className={`hover:text-[#FAB005] transition-colors cursor-pointer ${
                store.activeView === 'shop' && store.activeCategory === 'Electronics'
                  ? 'text-[#FAB005] font-bold'
                  : ''
              }`}
            >
              Electronics
            </button>

            <button
              type="button"
              onClick={() => setActiveView('shop', 'Gadget')}
              className={`hover:text-[#FAB005] transition-colors cursor-pointer ${
                store.activeView === 'shop' && (store.activeCategory === 'Gadget' || store.activeCategory === 'Gadgets')
                  ? 'text-[#FAB005] font-bold'
                  : ''
              }`}
            >
              Gadgets
            </button>

            <button
              type="button"
              onClick={() => setActiveView('shop', 'Fashion')}
              className={`hover:text-[#FAB005] transition-colors cursor-pointer ${
                store.activeView === 'shop' && store.activeCategory === 'Fashion'
                  ? 'text-[#FAB005] font-bold'
                  : ''
              }`}
            >
              Fashion
            </button>

            {/* Striped Shirts Signature Drop Pill */}
            <button
              type="button"
              onClick={() => {
                setActiveView('home');
                setTimeout(() => {
                  const el = document.getElementById('striped-shirts');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="flex items-center gap-1.5 text-teal-700 hover:text-teal-800 font-bold cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Striped Shirts</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('shop', 'Room Decor')}
              className={`hover:text-[#FAB005] transition-colors cursor-pointer ${
                store.activeView === 'shop' && store.activeCategory === 'Room Decor'
                  ? 'text-[#FAB005] font-bold'
                  : ''
              }`}
            >
              Room Decor
            </button>

            <button
              type="button"
              onClick={() => setActiveView('shop', 'Toys')}
              className={`hover:text-[#FAB005] transition-colors cursor-pointer ${
                store.activeView === 'shop' && store.activeCategory === 'Toys'
                  ? 'text-[#FAB005] font-bold'
                  : ''
              }`}
            >
              Toys
            </button>

            <button
              type="button"
              onClick={() => setActiveView('flash-deals')}
              className={`hover:text-[#FAB005] transition-colors cursor-pointer ${
                store.activeView === 'flash-deals'
                  ? 'text-[#FAB005] font-bold'
                  : ''
              }`}
            >
              Flash Deals
            </button>

            <button
              type="button"
              onClick={() => setActiveUserTab('orders')}
              className={`hover:text-[#FAB005] transition-colors cursor-pointer ${
                store.activeView === 'user-dashboard' && store.activeUserTab === 'orders'
                  ? 'text-[#FAB005] font-bold'
                  : ''
              }`}
            >
              My Orders
            </button>
          </nav>

          {/* Flash Deals Promo Badge (Exact Match: ⚡ FLASH DEALS UP TO 50% OFF) */}
          <div
            style={{ backgroundColor: '#FFF8E6', color: '#D97706' }}
            className="hidden lg:flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider select-none"
          >
            <Zap className="w-3.5 h-3.5 fill-[#FAB005] text-[#FAB005]" />
            <span>FLASH DEALS UP TO 50% OFF</span>
          </div>
        </div>
      </div>

      {/* 3. Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white p-4 space-y-3 shadow-lg">
          <input
            type="text"
            value={store.searchQuery}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm"
          />
          <div className="grid grid-cols-2 gap-2 text-sm font-semibold pt-2">
            <button
              type="button"
              onClick={() => {
                setActiveView('home');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 text-left bg-slate-50 rounded-xl hover:bg-amber-50 hover:text-[#FAB005]"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView('shop');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 text-left bg-slate-50 rounded-xl hover:bg-amber-50 hover:text-[#FAB005]"
            >
              Shop Catalog
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView('flash-deals');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 text-left bg-slate-50 rounded-xl hover:bg-amber-50 hover:text-[#FAB005]"
            >
              ⚡ Flash Deals
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView('user-dashboard');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 text-left bg-slate-50 rounded-xl hover:bg-amber-50 hover:text-[#FAB005]"
            >
              My Orders & Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
