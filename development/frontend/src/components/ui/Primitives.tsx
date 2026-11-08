import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ORDER_COLUMNS } from '../../data/seed';
import { useToasts } from '../../store/adminStore';
import { ImageRef, OrderStatus, ToneName } from '../../types';
import { animateNumber, prefersReducedMotion } from '../../utils/animations';
import { getInitials } from '../../utils/format';
import { Icon } from './Icon';

export const AnimatedNumber: React.FC<{
  value: number;
  fmt: (v: number) => string;
  className?: string;
}> = ({ value, fmt, className = '' }) => {
  const ref = useRef<HTMLElement>(null);
  const mounted = useRef(false);

  useLayoutEffect(() => {
    if (ref.current) {
      if (mounted.current) {
        ref.current.textContent = fmt(value);
        return;
      }
      mounted.current = true;
      animateNumber(ref.current, value, fmt);
    }
  }, [value, fmt]);

  return (
    <b ref={ref} className={`num ${className}`}>
      {fmt(0)}
    </b>
  );
};

export const PageHeader: React.FC<{
  title: string[];
  stats?: React.ReactNode;
  actions?: React.ReactNode;
}> = ({ title, stats, actions }) => (
  <header className="head">
    <h1 className="head__title" tabIndex={-1}>
      {title.map((word) => (
        <span className="w" key={word}>
          <span>{word}</span>
        </span>
      ))}
    </h1>
    <div className="head__stats">{stats}</div>
    {actions && <div className="head__actions">{actions}</div>}
  </header>
);

export const StatItem: React.FC<{
  icon: string;
  value: number;
  label: string;
  badge?: React.ReactNode;
  fmt: (v: number) => string;
}> = ({ icon, value, label, badge, fmt }) => (
  <div className="stat">
    <span className="stat__ico">
      <Icon name={icon} />
    </span>
    <span>
      <span className="stat__value">
        <AnimatedNumber value={value} fmt={fmt} />
        {badge}
      </span>
      <span className="stat__label">{label}</span>
    </span>
  </div>
);

export const Card: React.FC<{
  title?: React.ReactNode;
  sub?: React.ReactNode;
  tools?: React.ReactNode;
  className?: string;
  tone?: ToneName;
  children: React.ReactNode;
}> = ({ title, sub, tools, className = '', tone, children }) => (
  <section className={`card${tone ? ` card--${tone}` : ''} ${className}`} data-in>
    {(title || tools) && (
      <div className="card__head">
        <div>
          <h2 className="card__title">{title}</h2>
          {sub && <p className="card__sub">{sub}</p>}
        </div>
        {tools && <div className="card__tools">{tools}</div>}
      </div>
    )}
    {children}
  </section>
);

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: Array<{ id: T; label: string }>;
  onChange: (val: T) => void;
  label: string;
}) {
  const thumbRef = useRef<HTMLSpanElement>(null);
  const idx = Math.max(0, options.findIndex((o) => o.id === value));
  const firstRender = useRef(true);

  useLayoutEffect(() => {
    const el = thumbRef.current;
    if (!el) return;
    const xPos = `${idx * 100}%`;
    if (firstRender.current || prefersReducedMotion()) {
      gsap.set(el, { x: xPos });
      firstRender.current = false;
    } else {
      gsap.to(el, { x: xPos, duration: 0.45, ease: 'expo.out' });
    }
  }, [idx]);

  return (
    <div
      className="seg"
      role="group"
      aria-label={label}
      style={{ '--n': options.length } as React.CSSProperties}
    >
      <span className="seg__thumb" ref={thumbRef} aria-hidden="true" />
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className="seg__btn"
          aria-pressed={opt.id === value}
          onClick={() => onChange(opt.id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function useDialogLifecycle(open: boolean, onClose: () => void) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      const panel = dialog.firstElementChild as HTMLElement | null;
      if (panel && !prefersReducedMotion()) {
        const isMobile = window.matchMedia('(max-width: 720px)').matches;
        const isDrawer = dialog.classList.contains('drawer');
        gsap.fromTo(
          panel,
          isDrawer
            ? isMobile
              ? { yPercent: 100 }
              : { xPercent: 100 }
            : { opacity: 0, y: 18, scale: 0.97 },
          {
            xPercent: 0,
            yPercent: 0,
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            ease: 'expo.out',
            clearProps: 'transform,opacity',
          }
        );
      }
    }
    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    const handleBackdropClick = (e: MouseEvent) => {
      if (e.target === dialog) onClose();
    };
    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('click', handleBackdropClick);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('click', handleBackdropClick);
    };
  }, [onClose]);

  return dialogRef;
}

export const Drawer: React.FC<{
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  sub?: React.ReactNode;
  foot?: React.ReactNode;
  children: React.ReactNode;
}> = ({ open, onClose, title, sub, foot, children }) => {
  const ref = useDialogLifecycle(open, onClose);
  return (
    <dialog
      className="drawer"
      ref={ref}
      aria-label={typeof title === 'string' ? title : undefined}
    >
      <div className="drawer__panel">
        <header className="drawer__head">
          <div>
            <h2 className="drawer__title">{title}</h2>
            {sub && <p className="card__sub">{sub}</p>}
          </div>
          <button type="button" className="ibtn" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </header>
        <div className="drawer__body">{open && children}</div>
        {foot && <footer className="drawer__foot">{foot}</footer>}
      </div>
    </dialog>
  );
};

export const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ open, onClose, title, children }) => {
  const ref = useDialogLifecycle(open, onClose);
  return (
    <dialog className="modal" ref={ref} aria-label={title}>
      <div className="modal__panel">
        <header className="drawer__head">
          <h2 className="modal__title">{title}</h2>
          <button type="button" className="ibtn" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </header>
        {open && children}
      </div>
    </dialog>
  );
};

export type MenuItemEntry =
  | 'sep'
  | {
      label: string;
      icon?: string;
      danger?: boolean;
      onSelect: () => void;
    };

export const DropdownMenu: React.FC<{
  label: string;
  icon?: string;
  items: MenuItemEntry[];
  className?: string;
  align?: 'start' | 'end';
  children?: React.ReactNode;
}> = ({
  label,
  icon = 'dots',
  items,
  className = 'ibtn ibtn--sm',
  align = 'end',
  children,
}) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    if (popRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        popRef.current,
        { opacity: 0, y: -6, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'expo.out', clearProps: 'transform,opacity' }
      );
    }
    popRef.current?.querySelector<HTMLElement>('[role=menuitem]')?.focus();

    const handlePointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        wrapRef.current?.querySelector('button')?.focus();
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const menuItems = Array.from(
          popRef.current?.querySelectorAll<HTMLElement>('[role=menuitem]') ?? []
        );
        const curIdx = menuItems.indexOf(document.activeElement as HTMLElement);
        const nextIdx =
          (curIdx + (e.key === 'ArrowDown' ? 1 : -1) + menuItems.length) % menuItems.length;
        menuItems[nextIdx]?.focus();
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className="menu" ref={wrapRef}>
      <button
        type="button"
        className={className}
        aria-label={label}
        title={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        {children ?? <Icon name={icon} />}
      </button>
      {open && (
        <div
          className={`pop pop--${align}`}
          role="menu"
          ref={popRef}
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item, idx) =>
            item === 'sep' ? (
              <hr key={idx} />
            ) : (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                className={`menu__item${item.danger ? ' is-danger' : ''}`}
                onClick={() => {
                  setOpen(false);
                  item.onSelect();
                }}
              >
                {item.icon && <Icon name={item.icon} size={16} />}
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const list = useToasts();
  const wrapRef = useRef<HTMLDivElement>(null);
  const seenIds = useRef(new Set<number>());

  useLayoutEffect(() => {
    for (const el of wrapRef.current?.querySelectorAll<HTMLElement>('.toast') ?? []) {
      const id = Number(el.dataset.id);
      if (!seenIds.current.has(id)) {
        seenIds.current.add(id);
        if (!prefersReducedMotion()) {
          gsap.fromTo(
            el,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.45, ease: 'expo.out', clearProps: 'transform,opacity' }
          );
        }
      }
    }
  }, [list]);

  return (
    <div className="toasts" ref={wrapRef} role="status" aria-live="polite">
      {list.map((t) => (
        <p className="toast" data-id={t.id} key={t.id}>
          <Icon name="check" size={16} />
          {t.text}
        </p>
      ))}
    </div>
  );
};

export const Avatar: React.FC<{
  name: string;
  tone?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}> = ({ name, tone = 0, size = 'md' }) => (
  <span className={`av av--${size} av--t${tone}`} aria-hidden="true">
    {getInitials(name)}
  </span>
);

export const StatusPill: React.FC<{ s: OrderStatus }> = ({ s }) => {
  const col = ORDER_COLUMNS.find((c) => c.id === s);
  return (
    <span className={`spill spill--${col?.tone ?? 'lost'}`}>
      <i />
      {col?.label ?? 'Returned'}
    </span>
  );
};

export const Switch: React.FC<{
  on: boolean;
  onChange: (val: boolean) => void;
  label: string;
}> = ({ on, onChange, label }) => (
  <button
    type="button"
    role="switch"
    className="switch"
    aria-checked={on}
    aria-label={label}
    onClick={() => onChange(!on)}
  />
);

export const Thumb: React.FC<{ img: ImageRef; size?: number; alt?: string }> = ({
  img,
  size = 44,
  alt = '',
}) => (
  <img
    className="thumb"
    src={img.src}
    width={size}
    height={Math.round(size * 1.25)}
    alt={alt}
    loading="lazy"
    decoding="async"
  />
);

export const EmptyState: React.FC<{ icon: string; title: string; text: string }> = ({
  icon,
  title,
  text,
}) => (
  <div className="empty">
    <Icon name={icon} size={28} />
    <p className="empty__title">{title}</p>
    <p className="empty__text">{text}</p>
  </div>
);
