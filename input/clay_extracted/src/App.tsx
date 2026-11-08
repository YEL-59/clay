/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { QuickDock } from './components/layout/QuickDock';
import { SearchModal } from './components/layout/SearchModal';
import { TopNav } from './components/layout/TopNav';
import { ToastContainer } from './components/ui/Primitives';
import { ASSET_LIBRARY } from './data/catalog';
import { AssetsPage } from './pages/AssetsPage';
import { CustomersPage } from './pages/CustomersPage';
import { FitInsightsPage } from './pages/FitInsightsPage';
import { OrdersPage } from './pages/OrdersPage';
import { OverviewPage } from './pages/OverviewPage';
import { ProductsPage } from './pages/ProductsPage';
import { PromotionsPage } from './pages/PromotionsPage';
import { SettingsPage } from './pages/SettingsPage';
import {
  PAGE_TITLES,
  useAdminStore,
  useRoute,
} from './store/adminStore';
import { PageId } from './types';
import { animatePageEnter, prefersReducedMotion } from './utils/animations';
import { cacheAssetsForOffline, inspectOfflineCache } from './utils/offlineAssets';

const PAGE_COMPONENTS: Record<PageId, React.FC> = {
  overview: OverviewPage,
  orders: OrdersPage,
  products: ProductsPage,
  customers: CustomersPage,
  fit: FitInsightsPage,
  promos: PromotionsPage,
  assets: AssetsPage,
  settings: SettingsPage,
};

export default function App() {
  const route = useRoute();
  const store = useAdminStore();
  const mainRef = useRef<HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const ActivePageComponent = PAGE_COMPONENTS[route.page];

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = store.theme;
  }, [store.theme]);

  useLayoutEffect(() => {
    document.title = `${PAGE_TITLES[route.page]} — Shifatdevs admin`;
    if (mainRef.current) {
      animatePageEnter(mainRef.current);
    }
    window.scrollTo({ top: 0 });
    mainRef.current
      ?.querySelector<HTMLElement>('.head__title')
      ?.focus({ preventScroll: true });
  }, [route.page]);

  useEffect(() => {
    document.documentElement.classList.add('is-ready');

    // Warm up offline image cache in the background if not yet cached
    inspectOfflineCache().then((st) => {
      if (st.cachedIds.size < ASSET_LIBRARY.length) {
        cacheAssetsForOffline(ASSET_LIBRARY).catch(() => {});
      }
    });

    const meshBlobs = document.querySelectorAll('.mesh i');
    const tweens = prefersReducedMotion()
      ? []
      : Array.from(meshBlobs).map((el, idx) =>
          gsap.to(el, {
            x: idx % 2 ? -80 : 90,
            y: idx ? 60 : -50,
            duration: 18 + idx * 4,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          })
        );

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      const isSlash =
        e.key === '/' &&
        !(
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement
        );
      if (isCmdK || isSlash) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      tweens.forEach((tw) => tw.kill());
    };
  }, []);

  return (
    <>
      <a
        className="skip"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.querySelector<HTMLElement>('.head__title')?.focus();
        }}
      >
        Skip to content
      </a>

      <div className="mesh" aria-hidden="true">
        <i className="mesh__a" />
        <i className="mesh__b" />
        <i className="mesh__c" />
      </div>

      <div className="app">
        <TopNav page={route.page} />
        <QuickDock
          page={route.page}
          onOpenSearch={() => setSearchOpen(true)}
        />
        <main className="main" id="main" ref={mainRef} key={route.page}>
          <ActivePageComponent />
        </main>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <ToastContainer />
    </>
  );
}
