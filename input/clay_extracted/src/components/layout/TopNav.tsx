import React, { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { NOTIFICATIONS } from '../../data/seed';
import {
  MAIN_TABS,
  markNotificationsRead,
  navigate,
  pushToast,
  resetDemoData,
  useAdminStore,
} from '../../store/adminStore';
import { PageId } from '../../types';
import { prefersReducedMotion } from '../../utils/animations';
import { getInitials } from '../../utils/format';
import { Icon } from '../ui/Icon';
import { DropdownMenu } from '../ui/Primitives';

export const MainTabs: React.FC<{ page: PageId }> = ({ page }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const clipState = useRef({ l: 0, r: 0, on: false });
  const navRef = useRef<HTMLElement>(null);

  const applyClip = () => {
    const s = clipState.current;
    const pill = pillRef.current;
    if (pill) {
      pill.style.clipPath = `inset(4px ${s.r}px 4px ${s.l}px round 999px)`;
    }
  };

  const syncPill = (animate: boolean) => {
    const track = trackRef.current;
    const pill = pillRef.current;
    if (!track || !pill) return;
    const activeLink = track.querySelector<HTMLElement>(`[data-route="${page}"]`);
    if (!activeLink) {
      gsap.to(pill, { opacity: 0, duration: 0.25 });
      clipState.current.on = false;
      return;
    }
    const left = activeLink.offsetLeft;
    const right = track.clientWidth - (activeLink.offsetLeft + activeLink.offsetWidth);
    const wasOn = clipState.current.on;
    clipState.current.on = true;
    gsap.to(pill, { opacity: 1, duration: 0.25 });

    if (!animate || !wasOn || prefersReducedMotion()) {
      gsap.killTweensOf(clipState.current);
      Object.assign(clipState.current, { l: left, r: right });
      applyClip();
      return;
    }

    const movingRight = left > clipState.current.l;
    gsap.to(clipState.current, {
      l: left,
      duration: movingRight ? 0.62 : 0.42,
      ease: movingRight ? 'expo.inOut' : 'expo.out',
      onUpdate: applyClip,
      overwrite: false,
    });
    gsap.to(clipState.current, {
      r: right,
      duration: movingRight ? 0.42 : 0.62,
      ease: movingRight ? 'expo.out' : 'expo.inOut',
      onUpdate: applyClip,
      overwrite: false,
    });
    activeLink.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  };

  useLayoutEffect(() => {
    syncPill(true);
  }, [page]);

  const updateScrollMasks = () => {
    const el = navRef.current;
    if (!el) return;
    el.classList.toggle('is-more-l', el.scrollLeft > 4);
    el.classList.toggle('is-more-r', el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const ro = new ResizeObserver(() => {
      syncPill(false);
      updateScrollMasks();
    });
    if (trackRef.current) ro.observe(trackRef.current);
    if (navRef.current) ro.observe(navRef.current);
    return () => ro.disconnect();
  }, [page]);

  return (
    <nav className="tabs" aria-label="Main" ref={navRef} onScroll={updateScrollMasks}>
      <div className="tabs__track" ref={trackRef}>
        {MAIN_TABS.map((t) => (
          <a
            key={t.id}
            className="tab"
            href={`#/${t.id}`}
            data-route={t.id}
            aria-current={t.id === page ? 'page' : undefined}
          >
            {t.label}
          </a>
        ))}
        <span className="tabs__pill" ref={pillRef} aria-hidden="true">
          {MAIN_TABS.map((t) => (
            <span key={t.id}>{t.label}</span>
          ))}
        </span>
      </div>
    </nav>
  );
};

export const NotificationsMenu: React.FC = () => {
  const store = useAdminStore();
  const unreadCount = NOTIFICATIONS.filter((n) => !store.read.includes(n.id)).length;

  return (
    <DropdownMenu
      label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'}
      className="ibtn ibtn--glass"
      items={[
        ...NOTIFICATIONS.map((n) => ({
          label: `${store.read.includes(n.id) ? '' : '● '}${n.title} — ${n.body}`,
          icon: n.icon,
          onSelect: () => {
            markNotificationsRead([n.id]);
            window.location.hash = n.href;
          },
        })),
        'sep' as const,
        {
          label: 'Mark all as read',
          icon: 'check',
          onSelect: () => markNotificationsRead(NOTIFICATIONS.map((n) => n.id)),
        },
      ]}
    >
      <Icon name="bell" />
      {unreadCount > 0 && <span className="dot-badge" />}
    </DropdownMenu>
  );
};

export const TopNav: React.FC<{ page: PageId }> = ({ page }) => (
  <header className="top">
    <a className="brand" href="#/overview" aria-label="Shifatdevs admin — overview">
      <span className="brand__mark" aria-hidden="true">
        R
      </span>
      <span className="brand__name">
        Shifatdevs
        <small>admin</small>
      </span>
    </a>

    <MainTabs page={page} />

    <div className="top__tools">
      <a className="btn btn--ghost btn--sm top__shop" href="#/assets">
        <Icon name="download" size={16} />
        Offline assets
      </a>
      <NotificationsMenu />
      <DropdownMenu
        label="Account"
        className="me"
        items={[
          {
            label: 'Offline assets & downloads',
            icon: 'download',
            onSelect: () => navigate('assets'),
          },
          {
            label: 'Settings',
            icon: 'gear',
            onSelect: () => navigate('settings'),
          },
          'sep',
          {
            label: 'Reset demo data',
            icon: 'undo',
            danger: true,
            onSelect: () => {
              resetDemoData();
              pushToast('Demo data reset');
            },
          },
        ]}
      >
        <span className="av av--md av--t2" aria-hidden="true">
          {getInitials('Rumana Akter')}
        </span>
      </DropdownMenu>
    </div>
  </header>
);
