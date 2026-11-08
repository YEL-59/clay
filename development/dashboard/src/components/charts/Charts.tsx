import React, { useId, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SIZES } from '../../data/catalog';
import { FIT_SESSIONS, recommendSize } from '../../data/seed';
import { SizeCode, ToneName } from '../../types';
import { prefersReducedMotion } from '../../utils/animations';

function buildMonotoneSplinePath(points: Array<[number, number]>): string {
  if (points.length < 2) return '';
  const n = points.length;
  const secants: number[] = [];
  const tangents: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    secants.push((points[i + 1][1] - points[i][1]) / (points[i + 1][0] - points[i][0]));
  }
  tangents.push(secants[0]);
  for (let i = 1; i < n - 1; i++) {
    tangents.push(secants[i - 1] * secants[i] <= 0 ? 0 : (secants[i - 1] + secants[i]) / 2);
  }
  tangents.push(secants[n - 2]);

  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const dx = (x1 - x0) / 3;
    d += ` C${x0 + dx},${y0 + tangents[i] * dx} ${x1 - dx},${y1 - tangents[i + 1] * dx} ${x1},${y1}`;
  }
  return d;
}

export interface ChartSeries {
  label: string;
  values: number[];
  tone: ToneName;
  area?: boolean;
  dashed?: boolean;
}

export const LineAreaChart: React.FC<{
  labels: string[];
  series: ChartSeries[];
  height?: number;
  fmt: (v: number) => string;
  axis: (v: number) => string;
}> = ({ labels, series, height = 240, fmt, axis }) => {
  const uid = useId().replace(/:/g, '');
  const wrapRef = useRef<HTMLDivElement>(null);
  const clipRectRef = useRef<SVGRectElement>(null);
  const [width, setWidth] = useState(640);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(Math.max(260, el.clientWidth)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const seriesKey = labels.join() + series.map((s) => s.values.join()).join('|');
  useLayoutEffect(() => {
    if (!clipRectRef.current || prefersReducedMotion()) return;
    gsap.fromTo(
      clipRectRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.3, ease: 'power3.inOut', svgOrigin: '0 0' }
    );
  }, [seriesKey]);

  const rawMax = Math.max(...series.flatMap((s) => s.values)) * 1.12;
  const magnitude = 10 ** Math.floor(Math.log10(rawMax / 3));
  const step = Math.ceil(rawMax / 3 / magnitude) * magnitude;
  const maxY = step * 3;

  const xAt = (idx: number) => 46 + (idx * (width - 46 - 12)) / Math.max(1, labels.length - 1);
  const yAt = (val: number) => 12 + (1 - val / maxY) * (height - 12 - 26);
  const indexFromX = (px: number) =>
    Math.max(
      0,
      Math.min(labels.length - 1, Math.round(((px - 46) / (width - 46 - 12)) * (labels.length - 1)))
    );

  return (
    <div
      className="chart"
      ref={wrapRef}
      tabIndex={0}
      role="img"
      aria-label={series
        .map((s) => `${s.label}: ${labels.map((l, i) => `${l} ${fmt(s.values[i])}`).join(', ')}`)
        .join('. ')}
      onPointerMove={(e) => {
        if (!wrapRef.current) return;
        setHoverIdx(indexFromX(e.clientX - wrapRef.current.getBoundingClientRect().left));
      }}
      onPointerLeave={() => setHoverIdx(null)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          setHoverIdx((prev) =>
            Math.max(
              0,
              Math.min(
                labels.length - 1,
                (prev ?? labels.length - 1) + (e.key === 'ArrowRight' ? 1 : -1)
              )
            )
          );
        }
      }}
      onBlur={() => setHoverIdx(null)}
    >
      <svg className="chart__svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <clipPath id={`c${uid}`}>
            <rect ref={clipRectRef} x="0" y="0" width={width} height={height} />
          </clipPath>
          {series
            .filter((s) => s.area)
            .map((s) => (
              <linearGradient id={`g${uid}${s.tone}`} x1="0" y1="0" x2="0" y2="1" key={s.label}>
                <stop offset="0" className={`stop stop--${s.tone}`} stopOpacity=".24" />
                <stop offset="1" className={`stop stop--${s.tone}`} stopOpacity="0" />
              </linearGradient>
            ))}
        </defs>

        <g className="chart__grid">
          {[0, 1, 2, 3].map((stepIdx) => (
            <g key={stepIdx}>
              <line
                x1={46}
                x2={width - 12}
                y1={yAt(step * stepIdx)}
                y2={yAt(step * stepIdx)}
              />
              <text x={36} y={yAt(step * stepIdx) + 4} textAnchor="end">
                {axis(step * stepIdx)}
              </text>
            </g>
          ))}
        </g>

        <g className="chart__x">
          {labels.map((lab, idx) => (
            <text x={xAt(idx)} y={height - 6} textAnchor="middle" key={lab + idx}>
              {lab}
            </text>
          ))}
        </g>

        <g clipPath={`url(#c${uid})`}>
          {series.map((s) => {
            const pts = s.values.map((v, idx): [number, number] => [xAt(idx), yAt(v)]);
            const pathD = s.dashed
              ? `M${pts.map((p) => p.join(',')).join(' L')}`
              : buildMonotoneSplinePath(pts);
            return (
              <g key={s.label}>
                {s.area && (
                  <path
                    d={`${pathD} L${xAt(labels.length - 1)},${yAt(0)} L${xAt(0)},${yAt(0)} Z`}
                    fill={`url(#g${uid}${s.tone})`}
                  />
                )}
                <path
                  className={`chart__line chart__line--${s.tone}${s.dashed ? ' is-dashed' : ''}`}
                  d={pathD}
                />
              </g>
            );
          })}
        </g>

        {hoverIdx !== null && (
          <g>
            <line
              className="chart__cross"
              x1={xAt(hoverIdx)}
              x2={xAt(hoverIdx)}
              y1={12}
              y2={height - 26}
            />
            {series
              .filter((s) => !s.dashed)
              .map((s) => (
                <circle
                  key={s.label}
                  className={`chart__dot chart__dot--${s.tone}`}
                  cx={xAt(hoverIdx)}
                  cy={yAt(s.values[hoverIdx])}
                  r="5"
                />
              ))}
          </g>
        )}
      </svg>

      {hoverIdx !== null && (
        <div
          className="chart__tip"
          style={{
            transform: `translate(${Math.min(width - 170, Math.max(0, xAt(hoverIdx) - 80))}px, ${Math.max(
              0,
              yAt(Math.max(...series.map((s) => s.values[hoverIdx]))) - 74
            )}px)`,
          }}
        >
          <b>{labels[hoverIdx]}</b>
          {series.map((s) => (
            <span key={s.label}>
              <i className={`tone--${s.tone}`} />
              {s.label}
              <strong>{fmt(s.values[hoverIdx])}</strong>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export const ProgressRing: React.FC<{
  value: number;
  size?: number;
  tone?: ToneName;
  children: React.ReactNode;
}> = ({ value, size = 168, tone = 'coral', children }) => {
  const arcRef = useRef<SVGCircleElement>(null);
  const circumference = 2 * Math.PI * 42;

  useLayoutEffect(() => {
    const circle = arcRef.current;
    if (!circle) return;
    circle.style.strokeDasharray = `${circumference * value} ${circumference}`;
    const svg = circle.ownerSVGElement;
    if (!svg) return;
    if (prefersReducedMotion()) {
      gsap.set(svg, { rotation: -90 });
    } else {
      gsap.fromTo(
        svg,
        { rotation: -200, opacity: 0 },
        { rotation: -90, opacity: 1, duration: 1.3, ease: 'expo.out' }
      );
    }
  }, [value, circumference]);

  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle className="ring__track" cx="50" cy="50" r={42} />
        <circle ref={arcRef} className={`ring__arc tone-stroke--${tone}`} cx="50" cy="50" r={42} />
      </svg>
      <div className="ring__mid">{children}</div>
    </div>
  );
};

export const BarChart: React.FC<{
  data: Array<{ label: string; value: number; tone?: ToneName }>;
  tone?: ToneName;
  hi?: number;
  fmt: (v: number) => string;
}> = ({ data, tone = 'teal', hi, fmt }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const dataKey = data.map((d) => d.value).join();

  useLayoutEffect(() => {
    if (!wrapRef.current || prefersReducedMotion()) return;
    gsap.fromTo(
      wrapRef.current.querySelectorAll('.bars__bar'),
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.04,
        transformOrigin: '50% 100%',
        clearProps: 'transform',
      }
    );
  }, [dataKey]);

  return (
    <div
      className="bars"
      ref={wrapRef}
      role="img"
      aria-label={data.map((d) => `${d.label} ${fmt(d.value)}`).join(', ')}
    >
      {data.map((item, idx) => (
        <div className={`bars__col${idx === hi ? ' is-hi' : ''}`} key={item.label}>
          <span className="bars__val">{fmt(item.value)}</span>
          <div className="bars__track">
            <span
              className={`bars__bar tone--${item.tone ?? tone}`}
              style={{ height: `${(item.value / maxVal) * 100}%` }}
            />
          </div>
          <span className="bars__lab">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export const SIZE_TONES: Record<SizeCode, ToneName> = {
  XS: 'sky',
  S: 'sea',
  M: 'teal',
  L: 'coral',
  XL: 'navy',
  XXL: 'sand',
};

const HEIGHT_BOUNDS = [148, 198] as const;
const WEIGHT_BOUNDS = [40, 110] as const;

export const FitScatterPlot: React.FC = () => {
  const [heightCm, setHeightCm] = useState(176);
  const [weightKg, setWeightKg] = useState(74);
  const recSize = recommendSize(heightCm, weightKg, 0).size;

  const xPct = (h: number) =>
    ((h - HEIGHT_BOUNDS[0]) / (HEIGHT_BOUNDS[1] - HEIGHT_BOUNDS[0])) * 100;
  const yPct = (w: number) =>
    100 - ((w - WEIGHT_BOUNDS[0]) / (WEIGHT_BOUNDS[1] - WEIGHT_BOUNDS[0])) * 100;

  return (
    <div className="scatter-wrap">
      <div
        className="scatter"
        role="img"
        aria-label={`${FIT_SESSIONS.length} finder sessions plotted by height and weight, coloured by the recommended size`}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {[25, 50, 75].map((pos) => (
            <g className="scatter__grid" key={pos}>
              <line x1={pos} x2={pos} y1="0" y2="100" />
              <line y1={pos} y2={pos} x1="0" x2="100" />
            </g>
          ))}
        </svg>
        {FIT_SESSIONS.map((sess, idx) => (
          <i
            key={idx}
            className={`dot tone--${SIZE_TONES[sess.size]}${sess.size === recSize ? ' is-pick' : ''}`}
            style={{ left: `${xPct(sess.h)}%`, top: `${yPct(sess.w)}%` }}
          />
        ))}
        <span
          className="scatter__you"
          style={{ left: `${xPct(heightCm)}%`, top: `${yPct(weightKg)}%` }}
        >
          <b>{recSize}</b>
        </span>
        <span className="scatter__ax scatter__ax--x">
          Height, cm · {HEIGHT_BOUNDS[0]}–{HEIGHT_BOUNDS[1]}
        </span>
        <span className="scatter__ax scatter__ax--y">
          Weight, kg · {WEIGHT_BOUNDS[0]}–{WEIGHT_BOUNDS[1]}
        </span>
      </div>

      <div className="try">
        <p className="card__sub">Try the estimate the shop uses</p>
        <label className="try__row">
          <span>Height</span>
          <b className="num">{heightCm} cm</b>
          <input
            type="range"
            className="range"
            min={HEIGHT_BOUNDS[0]}
            max={HEIGHT_BOUNDS[1]}
            value={heightCm}
            onChange={(e) => setHeightCm(Number(e.target.value))}
            style={{ '--p': `${xPct(heightCm)}%` } as React.CSSProperties}
          />
        </label>
        <label className="try__row">
          <span>Weight</span>
          <b className="num">{weightKg} kg</b>
          <input
            type="range"
            className="range"
            min={WEIGHT_BOUNDS[0]}
            max={WEIGHT_BOUNDS[1]}
            value={weightKg}
            onChange={(e) => setWeightKg(Number(e.target.value))}
            style={{ '--p': `${100 - yPct(weightKg)}%` } as React.CSSProperties}
          />
        </label>
        <p className="try__out">
          Recommends <b className={`tone-text--${SIZE_TONES[recSize]}`}>{recSize}</b>, like{' '}
          {Math.round(
            (FIT_SESSIONS.filter((s) => s.size === recSize).length / FIT_SESSIONS.length) * 100
          )}
          % of shoppers
        </p>
        <div className="legend">
          {SIZES.map((sz) => (
            <span key={sz}>
              <i className={`tone--${SIZE_TONES[sz]}`} />
              {sz}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
