import React, { useRef } from 'react';
import {
  adminState,
  navigate,
  setTheme,
  useAdminStore,
} from '../../store/adminStore';
import { PageId } from '../../types';
import { runViewTransition } from '../../utils/animations';
import { Icon } from '../ui/Icon';
import { DropdownMenu } from '../ui/Primitives';

export const QuickDock: React.FC<{
  page: PageId;
  onOpenSearch: () => void;
}> = ({ page, onOpenSearch }) => {
  const store = useAdminStore();
  const themeBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <nav className="dock" aria-label="Quick actions">
      <button
        type="button"
        className="dock__btn"
        onClick={onOpenSearch}
        aria-label="Search (⌘K)"
      >
        <Icon name="search" />
        <span className="dock__tip">
          Search <kbd>⌘K</kbd>
        </span>
      </button>

      <DropdownMenu
        label="Create"
        icon="plus"
        className="dock__btn"
        align="start"
        items={[
          {
            label: 'New discount code',
            icon: 'tag',
            onSelect: () => navigate('promos?new=1'),
          },
          {
            label: 'Restock a shirt',
            icon: 'box',
            onSelect: () => navigate('products?filter=low'),
          },
          {
            label: 'Orders to pack',
            icon: 'bag',
            onSelect: () => navigate('orders'),
          },
          {
            label: 'Download offline assets',
            icon: 'download',
            onSelect: () => navigate('assets'),
          },
        ]}
      />

      <a
        className="dock__btn"
        href="#/orders"
        aria-label="Orders to pack"
        aria-current={page === 'orders' ? 'page' : undefined}
      >
        <Icon name="bag" />
        <span className="dock__tip">Orders</span>
      </a>

      <a
        className="dock__btn"
        href="#/fit"
        aria-label="Fit insights"
        aria-current={page === 'fit' ? 'page' : undefined}
      >
        <Icon name="ruler" />
        <span className="dock__tip">Fit insights</span>
      </a>

      <a
        className="dock__btn"
        href="#/assets"
        aria-label="Offline assets & images"
        aria-current={page === 'assets' ? 'page' : undefined}
      >
        <Icon name="download" />
        <span className="dock__tip">Assets & offline</span>
      </a>

      <span className="dock__sep" aria-hidden="true" />

      <a
        className="dock__btn"
        href="#/settings"
        aria-label="Settings"
        aria-current={page === 'settings' ? 'page' : undefined}
      >
        <Icon name="gear" />
        <span className="dock__tip">Settings</span>
      </a>

      <button
        type="button"
        ref={themeBtnRef}
        className="dock__btn"
        onClick={() =>
          runViewTransition(themeBtnRef.current, () => {
            const nextTheme = adminState.theme === 'dark' ? 'light' : 'dark';
            setTheme(nextTheme);
            document.documentElement.dataset.theme = nextTheme;
          })
        }
        aria-label={
          store.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
        }
      >
        <Icon name={store.theme === 'dark' ? 'sun' : 'moon'} />
        <span className="dock__tip">
          {store.theme === 'dark' ? 'Light' : 'Dark'} theme
        </span>
      </button>
    </nav>
  );
};
