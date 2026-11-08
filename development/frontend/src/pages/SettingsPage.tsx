import React, { useState } from 'react';
import { Icon } from '../components/ui/Icon';
import {
  Card,
  PageHeader,
  SegmentedControl,
  Switch,
} from '../components/ui/Primitives';
import {
  ASSET_LIBRARY,
  DELIVERY_OPTIONS,
  FREE_DELIVERY_THRESHOLD,
} from '../data/catalog';
import {
  adminState,
  navigate,
  pushToast,
  resetDemoData,
  setTheme,
  updateSettings,
  useAdminStore,
} from '../store/adminStore';
import { AdminSettings, PaymentMethodId } from '../types';
import { runViewTransition } from '../utils/animations';
import { formatBDT } from '../utils/format';
import {
  cacheAssetsForOffline,
  downloadOrganizedAssetsZip,
} from '../utils/offlineAssets';

const PAYMENT_KEYS: PaymentMethodId[] = ['cod', 'bkash', 'nagad', 'card'];

export const SettingsPage: React.FC = () => {
  const store = useAdminStore();
  const [form, setForm] = useState({
    storeName: store.settings.storeName,
    email: store.settings.email,
    phone: store.settings.phone,
  });
  const [error, setError] = useState('');

  const renderToggleRow = (key: keyof AdminSettings, label: string) => (
    <li className="setrow" key={key}>
      <span>{label}</span>
      <Switch
        on={Boolean(store.settings[key])}
        label={label}
        onChange={(next) => {
          if (
            !next &&
            PAYMENT_KEYS.includes(key as PaymentMethodId) &&
            PAYMENT_KEYS.filter((k) => store.settings[k]).length === 1
          ) {
            return pushToast('Checkout needs at least one way to pay');
          }
          updateSettings({ [key]: next });
        }}
      />
    </li>
  );

  return (
    <div className="view view--settings">
      <PageHeader title={['Store', 'settings']} />

      <div className="setgrid">
        <Card
          title="Store details"
          sub="On receipts and the emails customers get"
        >
          <form
            className="mform mform--flat"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (!form.storeName.trim()) {
                return setError('The store needs a name.');
              }
              if (!/^\S+@\S+\.\S+$/.test(form.email)) {
                return setError('That email doesn’t look right.');
              }
              setError('');
              updateSettings(form);
              pushToast('Store details saved');
            }}
          >
            <label className="field">
              <span className="field__label">Store name</span>
              <input
                className="input"
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              />
            </label>
            <label className="field">
              <span className="field__label">Email</span>
              <input
                className="input"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label className="field">
              <span className="field__label">Phone</span>
              <input
                className="input"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </label>
            {error && (
              <p className="field__err" role="alert">
                {error}
              </p>
            )}
            <div className="mform__foot">
              <button className="btn btn--ink" type="submit">
                Save
              </button>
            </div>
          </form>
        </Card>

        <Card title="Stock" sub="When a size counts as running low">
          <div className="lowline">
            <button
              type="button"
              className="ibtn"
              aria-label="Lower"
              onClick={() =>
                updateSettings({
                  lowStock: Math.max(1, store.settings.lowStock - 1),
                })
              }
            >
              <Icon name="minus" size={16} />
            </button>
            <b className="num">{store.settings.lowStock}</b>
            <button
              type="button"
              className="ibtn"
              aria-label="Higher"
              onClick={() =>
                updateSettings({
                  lowStock: Math.min(10, store.settings.lowStock + 1),
                })
              }
            >
              <Icon name="plus" size={16} />
            </button>
            <span className="muted">or fewer left in a size</span>
          </div>

          <h3 className="card__title set__sub">Delivery</h3>
          <ul className="setlist">
            {DELIVERY_OPTIONS.map((d) => (
              <li className="setrow" key={d.id}>
                <span>
                  {d.label}
                  <small>{d.note}</small>
                </span>
                <b className="num">{formatBDT(d.fee)}</b>
              </li>
            ))}
            <li className="setrow">
              <span>Free delivery over</span>
              <b className="num">{formatBDT(FREE_DELIVERY_THRESHOLD)}</b>
            </li>
          </ul>
        </Card>

        <Card title="Payments" sub="What the shop’s checkout offers">
          <ul className="setlist">
            {renderToggleRow('cod', 'Cash on delivery')}
            {renderToggleRow('bkash', 'bKash')}
            {renderToggleRow('nagad', 'Nagad')}
            {renderToggleRow('card', 'Card')}
          </ul>
        </Card>

        <Card title="Notifications">
          <ul className="setlist">
            {renderToggleRow('notifyOrders', 'Every new order')}
            {renderToggleRow('notifyStock', 'A size running low')}
            {renderToggleRow('notifyReturns', 'Return requests')}
          </ul>
        </Card>

        <Card title="Appearance">
          <SegmentedControl
            label="Theme"
            value={store.theme}
            onChange={(nextTheme) =>
              runViewTransition(
                document.querySelector<HTMLElement>('.view--settings .seg'),
                () => {
                  setTheme(nextTheme);
                  document.documentElement.dataset.theme = nextTheme;
                }
              )
            }
            options={[
              { id: 'light', label: 'Light' },
              { id: 'dark', label: 'Dark' },
            ]}
          />
        </Card>

        <Card
          title="Offline assets & archive"
          sub="Pre-cache all 34 photos for offline viewing or download the organized folder ZIP"
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                cacheAssetsForOffline(ASSET_LIBRARY).then((st) =>
                  pushToast(`${st.cachedIds.size} assets cached for offline viewing`)
                );
              }}
            >
              <Icon name="offline" size={16} />
              Cache all offline
            </button>
            <button
              type="button"
              className="btn btn--ink"
              onClick={() => {
                pushToast('Packaging complete asset library ZIP…');
                downloadOrganizedAssetsZip(ASSET_LIBRARY, 'all').then(() =>
                  pushToast('Downloaded shifatdevs-complete-assets-offline.zip')
                );
              }}
            >
              <Icon name="download" size={16} />
              Download all (.zip)
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => navigate('assets')}
            >
              <Icon name="folder" size={16} />
              Open asset manager
            </button>
          </div>
        </Card>

        <Card
          title="Demo data"
          sub="Statuses, stock, prices, codes and notes are saved in this browser"
        >
          <button
            type="button"
            className="btn btn--danger"
            onClick={() => {
              resetDemoData();
              setForm({
                storeName: adminState.settings.storeName,
                email: adminState.settings.email,
                phone: adminState.settings.phone,
              });
              pushToast('Demo data reset');
            }}
          >
            <Icon name="undo" size={16} />
            Reset everything
          </button>
        </Card>
      </div>
    </div>
  );
};
