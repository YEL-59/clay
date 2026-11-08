/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * E-Mart | Modern Multi-Category E-commerce Storefront
 * Cloned based on https://e-mart-beta-mocha.vercel.app/en
 */

import React, { useEffect } from 'react';
import { EmartHeader } from './components/emart/EmartHeader';
import { EmartHomePage } from './components/emart/EmartHomePage';
import { EmartShopView } from './components/emart/EmartShopView';
import { EmartProductDetailView } from './components/emart/EmartProductDetailView';
import { EmartFlashDealsSection } from './components/emart/EmartFlashDealsSection';
import { EmartUserDashboard } from './components/emart/EmartUserDashboard';
import { EmartFooter } from './components/emart/EmartFooter';
import { EmartCartDrawer } from './components/emart/EmartCartDrawer';
import { EmartQuickViewModal } from './components/emart/EmartQuickViewModal';
import { EmartWishlistModal } from './components/emart/EmartWishlistModal';
import { EmartCompareModal } from './components/emart/EmartCompareModal';
import { EmartCheckoutModal } from './components/emart/EmartCheckoutModal';
import { EMART_CATEGORIES } from './data/emartCatalog';
import { useEmart, setActiveView, mutateEmart } from './store/emartStore';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function App() {
  const store = useEmart();

  // Meaningful, interconnected URL Hash-based router
  useEffect(() => {
    const handleHashChange = () => {
      const raw = window.location.hash.replace(/^#\/?/, '').trim();
      const [pathPart = ''] = raw.split('?');
      const segments = pathPart.split('/').filter(Boolean);
      const primary = segments[0]?.toLowerCase() || '';
      const secondary = segments[1] || '';

      if (primary === 'shop') {
        mutateEmart((s) => {
          s.activeView = 'shop';
          if (secondary) {
            const matched = EMART_CATEGORIES.find(
              (c) =>
                c.slug.toLowerCase() === secondary.toLowerCase() ||
                c.name.toLowerCase() === secondary.toLowerCase() ||
                c.slug.replace(/-/g, '') === secondary.replace(/-/g, '').toLowerCase()
            );
            s.activeCategory = matched ? matched.name : secondary;
          } else {
            s.activeCategory = 'All';
          }
        });
      } else if ((primary === 'product' || primary === 'product-detail') && secondary) {
        mutateEmart((s) => {
          s.activeView = 'product-detail';
          s.selectedProductSlug = secondary;
        });
      } else if (primary === 'flash-deals' || primary === 'deals') {
        mutateEmart((s) => {
          s.activeView = 'flash-deals';
        });
      } else if (primary === 'user-dashboard' || primary === 'dashboard') {
        const tab = (secondary as any) || 'profile';
        mutateEmart((s) => {
          s.activeView = 'user-dashboard';
          if (['orders', 'profile', 'addresses', 'wishlist'].includes(tab)) {
            s.activeUserTab = tab;
          }
        });
      } else if (primary === 'orders') {
        mutateEmart((s) => {
          s.activeView = 'user-dashboard';
          s.activeUserTab = 'orders';
        });
      } else if (primary === 'profile') {
        mutateEmart((s) => {
          s.activeView = 'user-dashboard';
          s.activeUserTab = 'profile';
        });
      } else if (primary === 'addresses') {
        mutateEmart((s) => {
          s.activeView = 'user-dashboard';
          s.activeUserTab = 'addresses';
        });
      } else if (primary === '' || primary === 'home') {
        mutateEmart((s) => {
          s.activeView = 'home';
        });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans antialiased selection:bg-[#FAB005] selection:text-slate-950">
      {/* Sticky Top Header */}
      <EmartHeader />

      {/* Main View Router */}
      <main className="grow">
        {store.activeView === 'home' && <EmartHomePage />}
        {store.activeView === 'shop' && <EmartShopView />}
        {store.activeView === 'product-detail' && <EmartProductDetailView />}
        {store.activeView === 'flash-deals' && (
          <div className="pt-6">
            <EmartFlashDealsSection />
          </div>
        )}
        {store.activeView === 'user-dashboard' && <EmartUserDashboard />}
      </main>

      {/* Multi-column Footer */}
      <EmartFooter />

      {/* Floating Drawers & Modals */}
      <EmartCartDrawer />
      <EmartQuickViewModal />
      <EmartWishlistModal />
      <EmartCompareModal />
      <EmartCheckoutModal />

      {/* Notification Toasts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {store.toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold transition-all duration-300 transform translate-y-0 ${
              toast.type === 'success'
                ? 'bg-slate-950 text-white border border-[#FAB005]/40'
                : toast.type === 'warn'
                ? 'bg-rose-950 text-white border border-rose-500/40'
                : 'bg-blue-950 text-white border border-blue-500/40'
            }`}
          >
            {toast.type === 'success' && (
              <CheckCircle2 className="w-4 h-4 text-[#FAB005]" />
            )}
            {toast.type === 'warn' && (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            {toast.type === 'info' && (
              <Info className="w-4 h-4 text-blue-400" />
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
