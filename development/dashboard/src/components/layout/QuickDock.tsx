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
            label: 'Issue factory PO',
            icon: 'factory',
            onSelect: () => navigate('manufacturer?tab=orders'),
          },
          {
            label: 'Add store staff',
            icon: 'users',
            onSelect: () => navigate('stores'),
          },
          {
            label: 'Analyze candidate CV',
            icon: 'fileCheck',
            onSelect: () => navigate('hr?tab=analyzer'),
          },
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
        href="#/manufacturer"
        aria-label="Manufacturer & production"
        aria-current={page === 'manufacturer' ? 'page' : undefined}
      >
        <Icon name="factory" />
        <span className="dock__tip">Manufacturer</span>
      </a>

      <a
        className="dock__btn"
        href="#/stores"
        aria-label="Store managers & sales staff"
        aria-current={page === 'stores' ? 'page' : undefined}
      >
        <Icon name="building" />
        <span className="dock__tip">Store Staff</span>
      </a>

      <a
        className="dock__btn"
        href="#/hr"
        aria-label="HR & candidate CV checker"
        aria-current={page === 'hr' ? 'page' : undefined}
      >
        <Icon name="userCheck" />
        <span className="dock__tip">CV Checker</span>
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

      <a
        className="dock__btn"
        href="http://localhost:3005"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open E-Mart Live Storefront (Port 3005)"
      >
        <Icon name="tag" />
        <span className="dock__tip">Live Store (3005)</span>
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
