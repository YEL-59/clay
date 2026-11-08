import React from 'react';
import { EMART_PRODUCTS } from '../../data/emartCatalog';
import {
  addToCart,
  formatPrice,
  toggleWishlist,
  toggleWishlistModal,
  useEmart,
} from '../../store/emartStore';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export const EmartWishlistModal: React.FC = () => {
  const store = useEmart();

  if (!store.isWishlistModalOpen) return null;

  const wishlistProducts = EMART_PRODUCTS.filter((p) =>
    store.wishlist.includes(p.id)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={() => toggleWishlistModal(false)}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#023047]">My Wishlist</h3>
                <span className="text-xs text-slate-400 font-bold">
                  {wishlistProducts.length} saved item{wishlistProducts.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            <button
              onClick={() => toggleWishlistModal(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-100">
            {wishlistProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-400">
                  <Heart className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#023047]">
                    No items in wishlist
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    Click the heart icon on any product card to save it for later!
                  </p>
                </div>
              </div>
            ) : (
              wishlistProducts.map((product) => (
                <div key={product.id} className="py-4 flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-xs font-bold text-[#023047] truncate">
                      {product.name}
                    </h4>

                    <div className="text-xs font-black text-[#023047]">
                      {formatPrice(product.price, store.currency)}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(product, 1);
                          toggleWishlist(product.id);
                        }}
                        style={{ backgroundColor: '#FAB005', color: '#0f172a' }}
                        className="px-3 py-1.5 hover:brightness-105 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 stroke-[2.2]" style={{ color: '#0f172a' }} />
                        <span style={{ color: '#0f172a' }}>Move to Bag</span>
                      </button>

                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
