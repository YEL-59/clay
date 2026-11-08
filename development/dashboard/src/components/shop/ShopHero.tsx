import React, { useEffect, useState } from 'react';
import { ACTIVE_DROP } from '../../data/seed';
import { getDropSoldCount } from '../../store/adminStore';
import { addToCart, openProductDetail } from '../../store/shopStore';
import { formatBDT } from '../../utils/format';
import { Icon } from '../ui/Icon';

export const ShopHero: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // 2026-11-21T18:00:00+06:00 from REQ-F-008
    const target = new Date('2026-11-21T18:00:00+06:00').getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const soldCount = getDropSoldCount();
  const batchTotal = ACTIVE_DROP.batch;
  const leftCount = Math.max(0, batchTotal - soldCount);
  const soldPct = Math.round((soldCount / batchTotal) * 100);

  return (
    <section className="shop-hero">
      <div className="shop-hero__content">
        <div className="shop-hero__badge">
          <span className="shop-hero__badge-dot" />
          <span>Small-Batch Linen Atelier · Dhaka</span>
        </div>

        <h1 className="shop-hero__title">
          Striped shirts for <br />
          <em>slow, sunny days.</em>
        </h1>

        <p className="shop-hero__lead">
          Woven on slow shuttle looms with yarn-dyed French linen and Aegean
          organic cotton. Tailored with a relaxed +14cm chest ease to catch
          warm river breezes and monsoon afternoons.
        </p>

        <div className="shop-hero__actions">
          <a href="#collection" className="btn btn--primary btn--lg">
            <span>Explore 12 Shirts</span>
            <Icon name="arrow" size={16} />
          </a>
          <a href="#size-finder" className="btn btn--secondary btn--lg">
            <Icon name="trend" size={16} />
            <span>Interactive Size Finder</span>
          </a>
        </div>

        <div className="shop-hero__trust">
          <div className="trust-item">
            <strong>100%</strong>
            <span>Yarn-Dyed Fibers</span>
          </div>
          <div className="trust-sep" />
          <div className="trust-item">
            <strong>4.7%</strong>
            <span>Return Rate (vs 11.8%)</span>
          </div>
          <div className="trust-sep" />
          <div className="trust-item">
            <strong>64 Districts</strong>
            <span>Cash on Delivery</span>
          </div>
        </div>
      </div>

      {/* Limited Drop 03 Spotlight Card */}
      <div className="shop-hero__drop-card" id="drop03">
        <div className="drop-card-glow" />
        <div className="drop-card-inner">
          <div className="drop-card-header">
            <span className="badge badge--pill badge--teal">
              Limited Edition · Drop 03
            </span>
            <span className="drop-price">{formatBDT(3690)}</span>
          </div>

          <div className="drop-card-media">
            <img
              src="/raye/photos/220-raye/shirt-rust.jpg"
              alt="Drop 03 · Rust Bengal"
              className="drop-card-img"
              loading="eager"
            />
            <div className="drop-card-overlay">
              <span className="drop-card-name">Rust Bengal</span>
              <span className="drop-card-sub">60-Piece Limited Run</span>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="drop-timer">
            <div className="timer-block">
              <span className="timer-val">{timeLeft.days}</span>
              <span className="timer-unit">days</span>
            </div>
            <span className="timer-colon">:</span>
            <div className="timer-block">
              <span className="timer-val">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="timer-unit">hrs</span>
            </div>
            <span className="timer-colon">:</span>
            <div className="timer-block">
              <span className="timer-val">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="timer-unit">min</span>
            </div>
            <span className="timer-colon">:</span>
            <div className="timer-block">
              <span className="timer-val">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="timer-unit">sec</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="drop-progress-wrap">
            <div className="drop-progress-labels">
              <span>
                Sold: <strong>{soldCount}</strong> of {batchTotal}
              </span>
              <span className="drop-left">
                Only <strong>{leftCount}</strong> left
              </span>
            </div>
            <div className="drop-progress-bar">
              <div
                className="drop-progress-fill"
                style={{ width: `${soldPct}%` }}
              />
            </div>
          </div>

          <div className="drop-card-actions">
            <button
              type="button"
              className="btn btn--primary btn--full"
              onClick={() => addToCart('shirt-rust', 'M', 1)}
            >
              <Icon name="tag" size={16} />
              <span>Quick Add Size M · {formatBDT(3690)}</span>
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--full"
              onClick={() => openProductDetail('shirt-rust')}
            >
              <span>View Lookbook & Fabric Details</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
