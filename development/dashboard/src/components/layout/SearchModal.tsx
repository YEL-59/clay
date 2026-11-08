import React, { useEffect, useMemo, useState } from 'react';
import { ASSET_LIBRARY, PRODUCTS } from '../../data/catalog';
import { MAIN_TABS, getCustomers, getOrders } from '../../store/adminStore';
import { Icon } from '../ui/Icon';
import { Modal } from '../ui/Primitives';

interface FinderResult {
  kind: string;
  label: string;
  sub: string;
  href: string;
}

export const SearchModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const results = useMemo<FinderResult[]>(() => {
    const q = query.trim().toLowerCase();
    const pages: FinderResult[] = [
      ...MAIN_TABS,
      { id: 'settings', label: 'Settings' },
    ].map((p) => ({
      kind: 'Page',
      label: p.label,
      sub: 'Go to page',
      href: `#/${p.id}`,
    }));

    if (!q) return pages;

    const customers = getCustomers();
    const shirts: FinderResult[] = PRODUCTS.map((p) => ({
      kind: 'Shirt',
      label: p.name,
      sub: `${p.family} · ${p.cat}`,
      href: `#/products/${p.slug}`,
    }));
    const customerItems: FinderResult[] = customers.map((c) => ({
      kind: 'Customer',
      label: c.name,
      sub: `${c.district} · ${c.email}`,
      href: `#/customers/${c.id}`,
    }));
    const orderItems: FinderResult[] = getOrders()
      .slice(0, 80)
      .map((o) => ({
        kind: 'Order',
        label: o.id,
        sub: customers.find((c) => c.id === o.customer)?.name ?? '',
        href: `#/orders/${o.id}`,
      }));
    const assetItems: FinderResult[] = ASSET_LIBRARY.map((a) => ({
      kind: 'Asset',
      label: a.title,
      sub: `${a.folder}/${a.filename} · ${a.w}×${a.h}`,
      href: `#/assets/${a.id}`,
    }));

    return [...pages, ...shirts, ...customerItems, ...orderItems, ...assetItems]
      .filter((item) => `${item.label} ${item.sub}`.toLowerCase().includes(q))
      .slice(0, 12);
  }, [query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (open) setQuery('');
  }, [open]);

  const handleSelect = (item?: FinderResult) => {
    if (!item) return;
    onClose();
    window.location.hash = item.href;
  };

  return (
    <Modal open={open} onClose={onClose} title="Search">
      <div className="finder">
        <label className="search search--big">
          <Icon name="search" />
          <span className="sr">Search</span>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Orders, shirts, customers, assets, pages…"
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((i) => Math.min(results.length - 1, i + 1));
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((i) => Math.max(0, i - 1));
              }
              if (e.key === 'Enter') {
                handleSelect(results[selectedIndex]);
              }
            }}
          />
        </label>

        <ul className="finder__list" role="listbox" aria-label="Results">
          {results.map((item, idx) => (
            <li
              key={item.kind + item.href}
              role="option"
              aria-selected={idx === selectedIndex}
            >
              <button
                type="button"
                className="pop__row"
                onMouseEnter={() => setSelectedIndex(idx)}
                onClick={() => handleSelect(item)}
              >
                <span className="finder__kind">{item.kind}</span>
                <span>
                  <b>{item.label}</b>
                  <small>{item.sub}</small>
                </span>
              </button>
            </li>
          ))}
          {!results.length && (
            <li className="empty">
              <p className="empty__title">Nothing matches “{query}”</p>
            </li>
          )}
        </ul>
      </div>
    </Modal>
  );
};
