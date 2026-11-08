import React from 'react';
import {
  BarChart,
  FitScatterPlot,
  LineAreaChart,
  SIZE_TONES,
} from '../components/charts/Charts';
import {
  AnimatedNumber,
  Card,
  PageHeader,
  StatItem,
} from '../components/ui/Primitives';
import { PRODUCTS, SIZES } from '../data/catalog';
import {
  FIT_SESSIONS,
  RETURN_RATES,
  RETURN_REASONS,
  WEEKLY_FINDER_SESSIONS,
} from '../data/seed';
import { getProductStock, useAdminStore } from '../store/adminStore';
import { pluralize } from '../utils/format';

export const FitInsightsPage: React.FC = () => {
  useAdminStore();
  const totalSessions12W = WEEKLY_FINDER_SESSIONS.reduce((a, b) => a + b, 0);
  const addedToBagRate =
    FIT_SESSIONS.filter((s) => s.added).length / FIT_SESSIONS.length;

  const recShares = SIZES.map(
    (sz) => FIT_SESSIONS.filter((s) => s.size === sz).length / FIT_SESSIONS.length
  );
  const shelfTotals = SIZES.map((sz) =>
    PRODUCTS.reduce((sum, p) => sum + getProductStock(p.slug)[sz], 0)
  );
  const totalShelfUnits = shelfTotals.reduce((a, b) => a + b, 0) || 1;
  const maxRecIdx = recShares.indexOf(Math.max(...recShares));

  const biggestGap = SIZES.map((sz, idx) => ({
    s: sz,
    d: recShares[idx],
    k: shelfTotals[idx] / totalShelfUnits,
  })).sort((a, b) => b.d - b.k - (a.d - a.k))[0];

  return (
    <div className="view view--fit">
      <PageHeader
        title={['Fit', 'insights']}
        stats={
          <>
            <StatItem
              icon="ruler"
              value={totalSessions12W}
              fmt={(v) => Math.round(v).toLocaleString('en-IN')}
              label="Size finder uses, 12 weeks"
            />
            <StatItem
              icon="bag"
              value={addedToBagRate * 100}
              fmt={(v) => `${Math.round(v)}%`}
              label="Added to bag after"
            />
            <StatItem
              icon="return"
              value={RETURN_RATES.with * 100}
              fmt={(v) => `${v.toFixed(1)}%`}
              label={`Returns with the finder, ${(RETURN_RATES.without * 100).toFixed(1)}% without`}
            />
          </>
        }
      />

      <div className="fitgrid">
        <Card
          className="fit__map"
          title="Who uses the finder"
          sub={`${pluralize(FIT_SESSIONS.length, 'session')} this month, by height and weight`}
        >
          <FitScatterPlot />
        </Card>

        <Card className="fit__weeks" title="Finder use" sub="Sessions a week">
          <p className="big">
            <AnimatedNumber
              value={WEEKLY_FINDER_SESSIONS[WEEKLY_FINDER_SESSIONS.length - 1]}
              fmt={(v) => Math.round(v).toLocaleString('en-IN')}
            />
            <span>
              last week · up{' '}
              {Math.round(
                (WEEKLY_FINDER_SESSIONS[11] / WEEKLY_FINDER_SESSIONS[0] - 1) * 100
              )}
              % in 12 weeks
            </span>
          </p>
          <LineAreaChart
            labels={WEEKLY_FINDER_SESSIONS.map((_, idx) => `W${idx + 1}`)}
            height={190}
            fmt={(v) => `${Math.round(v)} sessions`}
            axis={(v) => String(Math.round(v))}
            series={[
              {
                label: 'Sessions',
                values: WEEKLY_FINDER_SESSIONS,
                tone: 'teal',
                area: true,
              },
            ]}
          />
        </Card>

        <Card
          className="fit__sizes"
          title="Sizes it recommends"
          sub="Share of sessions"
        >
          <BarChart
            data={SIZES.map((sz, idx) => ({
              label: sz,
              value: Math.round(recShares[idx] * 100),
              tone: SIZE_TONES[sz],
            }))}
            hi={maxRecIdx}
            fmt={(v) => `${v}%`}
          />
        </Card>

        <Card
          className="fit__shelf"
          title="Demand against the shelf"
          sub="Recommended share vs share of stock, by size"
        >
          <ul className="vs">
            {SIZES.map((sz, idx) => (
              <li key={sz}>
                <b>{sz}</b>
                <span className="vs__bars">
                  <span className="meter">
                    <span
                      className={`meter__fill tone--${SIZE_TONES[sz]}`}
                      style={{ transform: `scaleX(${recShares[idx] / 0.4})` }}
                    />
                  </span>
                  <span className="meter meter--ghost">
                    <span
                      className="meter__fill tone--ink"
                      style={{
                        transform: `scaleX(${shelfTotals[idx] / totalShelfUnits / 0.4})`,
                      }}
                    />
                  </span>
                </span>
                <span className="num vs__fig">
                  {Math.round(recShares[idx] * 100)}% ·{' '}
                  {Math.round((shelfTotals[idx] / totalShelfUnits) * 100)}%
                </span>
              </li>
            ))}
          </ul>
          <p className="vs__tip">
            <b>{biggestGap.s}</b> is {Math.round(biggestGap.d * 100)}% of what the
            finder recommends but {Math.round(biggestGap.k * 100)}% of the shelf.
            Reorder {biggestGap.s} first.
          </p>
          <div className="legend">
            <span>
              <i className="tone--teal" />
              Recommended
            </span>
            <span>
              <i className="tone--ink" />
              On the shelf
            </span>
          </div>
        </Card>

        <Card
          className="fit__returns"
          tone="navy"
          title="Returns, last 90 days"
        >
          <div className="ret">
            <div>
              <b className="ret__fig num">
                {(RETURN_RATES.with * 100).toFixed(1)}%
              </b>
              <span>with the finder</span>
              <span className="meter meter--on-dark">
                <span
                  className="meter__fill tone--sand"
                  style={{
                    transform: `scaleX(${RETURN_RATES.with / RETURN_RATES.without})`,
                  }}
                />
              </span>
            </div>
            <div>
              <b className="ret__fig num">
                {(RETURN_RATES.without * 100).toFixed(1)}%
              </b>
              <span>without it</span>
              <span className="meter meter--on-dark">
                <span
                  className="meter__fill tone--coral"
                  style={{ transform: 'scaleX(1)' }}
                />
              </span>
            </div>
          </div>

          <ul className="why">
            {RETURN_REASONS.map(([reason, share]) => (
              <li key={reason}>
                <span>{reason}</span>
                <span className="meter meter--on-dark">
                  <span
                    className="meter__fill tone--sky"
                    style={{
                      transform: `scaleX(${share / RETURN_REASONS[0][1]})`,
                    }}
                  />
                </span>
                <b className="num">{Math.round(share * 100)}%</b>
              </li>
            ))}
          </ul>

          <p className="ret__note">
            Shoppers who used the finder sent back{' '}
            {Math.round((1 - RETURN_RATES.with / RETURN_RATES.without) * 100)}%
            fewer shirts for size.
          </p>
        </Card>
      </div>
    </div>
  );
};
