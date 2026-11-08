import React, { useEffect, useState } from 'react';
import { Icon } from '../components/ui/Icon';
import {
  Card,
  DropdownMenu,
  Modal,
  PageHeader,
  SegmentedControl,
  StatItem,
  Switch,
} from '../components/ui/Primitives';
import {
  DROP_CLOSES_AT,
  SIZES,
  TOP_BAR_MESSAGES,
  getProductBySlug,
} from '../data/catalog';
import { ACTIVE_DROP } from '../data/seed';
import {
  deletePromo,
  getDropSoldCount,
  getProductStock,
  getPromos,
  getTotalProductStock,
  navigate,
  pushToast,
  savePromo,
  useAdminStore,
  useRoute,
} from '../store/adminStore';
import { PromoItem, ToneName } from '../types';
import { pluralize } from '../utils/format';

const PROMO_TONES: ToneName[] = ['coral', 'teal', 'sky', 'navy'];

const PromoFormModal: React.FC<{
  open: boolean;
  onClose: () => void;
  edit?: PromoItem;
}> = ({ open, onClose, edit }) => {
  const [code, setCode] = useState('');
  const [kind, setKind] = useState<'pct' | 'ship'>('pct');
  const [pctVal, setPctVal] = useState('15');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setCode(edit?.code ?? '');
      setKind(edit?.kind ?? 'pct');
      setPctVal(String(edit?.value || 15));
      setError('');
    }
  }, [open, edit?.code]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={edit ? `Edit ${edit.code}` : 'New discount code'}
    >
      <form
        className="mform"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const cleanCode = code.trim().toUpperCase();
          const numVal = Number(pctVal);
          if (!/^[A-Z0-9]{3,16}$/.test(cleanCode)) {
            return setError('Use 3 to 16 letters or numbers, no spaces.');
          }
          if (!edit && getPromos().some((p) => p.code === cleanCode)) {
            return setError(`${cleanCode} already exists.`);
          }
          if (kind === 'pct' && !(numVal >= 1 && numVal <= 80)) {
            return setError('Pick a discount between 1% and 80%.');
          }
          savePromo(cleanCode, {
            kind,
            value: kind === 'pct' ? numVal : 0,
            label: kind === 'pct' ? `${numVal}% off` : 'Free delivery',
            active: edit?.active ?? true,
          });
          pushToast(edit ? `${cleanCode} updated` : `${cleanCode} is live in the shop`);
          onClose();
        }}
      >
        <label className="field">
          <span className="field__label">Code</span>
          <input
            className="input input--code"
            value={code}
            disabled={!!edit}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError('');
            }}
            placeholder="MONSOON15"
            autoComplete="off"
            aria-invalid={!!error}
            aria-describedby={error ? 'code-err' : undefined}
          />
        </label>

        <div className="field">
          <span className="field__label">What it gives</span>
          <SegmentedControl
            label="Kind"
            value={kind}
            onChange={setKind}
            options={[
              { id: 'pct', label: '% off' },
              { id: 'ship', label: 'Free delivery' },
            ]}
          />
        </div>

        {kind === 'pct' && (
          <label className="field">
            <span className="field__label">Discount</span>
            <span className="input input--prefix">
              <input
                inputMode="numeric"
                value={pctVal}
                onChange={(e) => {
                  setPctVal(e.target.value.replace(/\D/g, ''));
                  setError('');
                }}
              />
              <span>%</span>
            </span>
          </label>
        )}

        {error && (
          <p className="field__err" id="code-err" role="alert">
            {error}
          </p>
        )}

        <div className="mform__foot">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--ink">
            {edit ? 'Save' : 'Create code'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const PromotionsPage: React.FC = () => {
  useAdminStore();
  const route = useRoute();
  const [editingPromo, setEditingPromo] = useState<PromoItem | undefined>();
  const isNewModalOpen = route.query.get('new') === '1';

  const promos = getPromos();
  const dropProduct = getProductBySlug(ACTIVE_DROP.slug);

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remainingMs = Math.max(0, DROP_CLOSES_AT - now);
  const clockParts: Array<[string, number]> = [
    ['days', Math.floor(remainingMs / 864e5)],
    ['hrs', Math.floor((remainingMs / 36e5) % 24)],
    ['min', Math.floor((remainingMs / 6e4) % 60)],
    ['sec', Math.floor((remainingMs / 1e3) % 60)],
  ];

  const soldCount = getDropSoldCount();

  return (
    <div className="view view--promos">
      <PageHeader
        title={['Discount', 'codes']}
        stats={
          <>
            <StatItem
              icon="tag"
              value={promos.filter((p) => p.active).length}
              fmt={(v) => String(Math.round(v))}
              label="Codes the shop accepts"
            />
            <StatItem
              icon="bag"
              value={promos.reduce((s, p) => s + p.uses, 0)}
              fmt={(v) => Math.round(v).toLocaleString('en-IN')}
              label="Times used this year"
            />
          </>
        }
        actions={
          <button
            type="button"
            className="btn btn--ink"
            onClick={() => navigate('promos?new=1')}
          >
            <Icon name="plus" size={16} />
            New code
          </button>
        }
      />

      <div className="codes">
        {promos.map((p, idx) => (
          <article
            key={p.code}
            className={`block block--${PROMO_TONES[idx % PROMO_TONES.length]} code${
              p.active ? '' : ' is-off'
            }`}
            data-in
          >
            <span className="block__meta">
              {p.custom ? 'Your code' : 'Built in'} · {pluralize(p.uses, 'use')}
            </span>

            <DropdownMenu
              label={`Actions for ${p.code}`}
              className="ibtn ibtn--sm ibtn--on-dark code__menu"
              items={[
                {
                  label: 'Edit',
                  icon: 'note',
                  onSelect: () => setEditingPromo(p),
                },
                {
                  label: 'Copy code',
                  icon: 'check',
                  onSelect: () => {
                    navigator.clipboard?.writeText(p.code).catch(() => {});
                    pushToast(`${p.code} copied`);
                  },
                },
                ...(p.custom
                  ? [
                      'sep' as const,
                      {
                        label: 'Delete',
                        icon: 'close',
                        danger: true,
                        onSelect: () => {
                          deletePromo(p.code);
                          pushToast(`${p.code} deleted`);
                        },
                      },
                    ]
                  : []),
              ]}
            />

            <b className="code__code">{p.code}</b>
            <span className="block__sub">{p.label}</span>
            <span className="block__foot">
              <span className="code__state">
                {p.active ? 'Live in the shop' : 'Switched off'}
              </span>
              <Switch
                on={p.active}
                label={`${p.code} accepted in the shop`}
                onChange={(next) => {
                  savePromo(p.code, {
                    kind: p.kind,
                    value: p.value,
                    label: p.label,
                    active: next,
                  });
                  pushToast(next ? `${p.code} is live again` : `${p.code} switched off`);
                }}
              />
            </span>
          </article>
        ))}

        <button
          type="button"
          className="code code--add"
          data-in
          onClick={() => navigate('promos?new=1')}
        >
          <Icon name="plus" size={22} />
          <b>New code</b>
          <small>A % off or free delivery</small>
        </button>
      </div>

      <div className="promo-row">
        <Card
          className="dropc"
          tone="teal"
          title="Drop 03 · Rust Bengal"
          sub={`${getTotalProductStock(dropProduct.slug)} left`}
          tools={
            <a
              className="ibtn ibtn--on-dark"
              href="#/products/rust"
              aria-label="Stock for Rust Bengal"
              title="Stock"
            >
              <Icon name="out" />
            </a>
          }
        >
          <div className="clock" role="timer" aria-label="Time until the drop closes">
            {clockParts.map(([unit, val]) => (
              <span key={unit}>
                <b className="num">{String(val).padStart(2, '0')}</b>
                <small>{unit}</small>
              </span>
            ))}
          </div>

          <p className="dropc__bar">
            <span>
              Sold {soldCount} of {ACTIVE_DROP.batch}
            </span>
            <span className="meter meter--on-dark">
              <span
                className="meter__fill tone--sand"
                style={{ transform: `scaleX(${soldCount / ACTIVE_DROP.batch})` }}
              />
            </span>
          </p>

          <span className="sizes-mini sizes-mini--dark">
            {SIZES.map((sz) => {
              const count = getProductStock(dropProduct.slug)[sz];
              return (
                <i
                  key={sz}
                  className={count === 0 ? 'is-out' : count <= 3 ? 'is-low' : ''}
                >
                  {sz} · {count}
                </i>
              );
            })}
          </span>
        </Card>

        <Card
          className="bannerc"
          title="Top bar messages"
          sub="The shop rotates these every few seconds"
        >
          <ol className="ann">
            {TOP_BAR_MESSAGES.map((msg, idx) => (
              <li key={msg}>
                <span className="num">{idx + 1}</span>
                {msg}
              </li>
            ))}
          </ol>
          <a className="btn btn--ghost btn--sm" href="#/products">
            <Icon name="store" size={15} />
            Browse catalog stock
          </a>
        </Card>
      </div>

      <PromoFormModal
        open={isNewModalOpen || !!editingPromo}
        edit={editingPromo}
        onClose={() => {
          setEditingPromo(undefined);
          if (isNewModalOpen) navigate('promos');
        }}
      />
    </div>
  );
};
