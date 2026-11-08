import React from 'react';
import { Crown, ArrowRight, Zap } from 'lucide-react';

export interface HeroBannerItem {
  id: string;
  category: string;
  circleColor: string;
  accentColor: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  titleLine1Prefix: string;
  highlightYear: string;
  highlightColor: string;
  titleLine1Suffix: string;
  titleLine2: string;
  titleLine3?: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaBg: string;
  primaryCtaText: string;
  subjectImage: string;
  subjectScale?: string;
  featuredProduct: {
    name: string;
    thumbnail: string;
    category: string;
  };
}

export const HERO_BANNERS: HeroBannerItem[] = [
  {
    id: 'fashion-summer',
    category: 'Fashion',
    circleColor: '#FAB005',
    accentColor: '#FAB005',
    badge: 'HAUTE COUTURE',
    badgeBg: '#FFF4D6',
    badgeText: '#D97706',
    titleLine1Prefix: 'Summer ',
    highlightYear: '2026',
    highlightColor: '#FAB005',
    titleLine1Suffix: ' Collection',
    titleLine2: 'French Linen & Atelier',
    titleLine3: 'Dresses',
    subtitle:
      'Indulge in breathable natural fibers, hand-finished Normandy flax overshirts, and flowing minimalist silhouettes.',
    primaryCtaLabel: 'Explore Fashion',
    primaryCtaBg: '#FAB005',
    primaryCtaText: '#0F172A',
    subjectImage: '/assets/images/hero_subject_fashion.jpg',
    featuredProduct: {
      name: 'French Linen & Atelier Dresses',
      thumbnail: '/assets/images/card_thumb_fashion.jpg',
      category: 'Fashion',
    },
  },
  {
    id: 'electronics-audio',
    category: 'Electronics',
    circleColor: '#0284C7',
    accentColor: '#38BDF8',
    badge: 'STUDIO ACOUSTICS',
    badgeBg: '#E0F2FE',
    badgeText: '#0284C7',
    titleLine1Prefix: 'Audio ',
    highlightYear: '2026',
    highlightColor: '#0284C7',
    titleLine1Suffix: ' Collection',
    titleLine2: 'Spatial Acoustics & Studio',
    titleLine3: 'Sound',
    subtitle:
      'Immerse yourself in active noise cancellation, lossless audio drivers, and dynamic acoustic precision.',
    primaryCtaLabel: 'Explore Audio',
    primaryCtaBg: '#0284C7',
    primaryCtaText: '#FFFFFF',
    subjectImage: '/assets/images/hero_subject_electronics.jpg',
    featuredProduct: {
      name: 'Studio Spatial Wireless Pro',
      thumbnail: '/assets/images/card_thumb_audio.jpg',
      category: 'Electronics',
    },
  },
  {
    id: 'room-decor',
    category: 'Room Decor',
    circleColor: '#E0552F',
    accentColor: '#F97316',
    badge: 'NORDIC LIVING',
    badgeBg: '#FFEDD5',
    badgeText: '#EA580C',
    titleLine1Prefix: 'Living ',
    highlightYear: '2026',
    highlightColor: '#EA580C',
    titleLine1Suffix: ' Collection',
    titleLine2: 'Scandinavian Interior &',
    titleLine3: 'Home Decor',
    subtitle:
      'Transform your sanctuary with organic clay ceramics, hand-crafted oak furnishings, and warm ambient lighting.',
    primaryCtaLabel: 'Discover Decor',
    primaryCtaBg: '#EA580C',
    primaryCtaText: '#FFFFFF',
    subjectImage: '/assets/images/hero_subject_decor.jpg',
    featuredProduct: {
      name: 'Nordic Minimalist Oak & Decor',
      thumbnail: '/assets/images/card_thumb_decor.jpg',
      category: 'Room Decor',
    },
  },
  {
    id: 'smart-gadgets',
    category: 'Gadget',
    circleColor: '#10B981',
    accentColor: '#34D399',
    badge: 'SMART HORIZON',
    badgeBg: '#DCFCE7',
    badgeText: '#16A34A',
    titleLine1Prefix: 'Tech ',
    highlightYear: '2026',
    highlightColor: '#16A34A',
    titleLine1Suffix: ' Collection',
    titleLine2: 'Titanium Sensors & Smart',
    titleLine3: 'Gadgets',
    subtitle:
      'Military-grade aerospace titanium, dual-frequency precision GPS, and 14-day ultra battery endurance.',
    primaryCtaLabel: 'Explore Gadgets',
    primaryCtaBg: '#16A34A',
    primaryCtaText: '#FFFFFF',
    subjectImage: '/assets/images/hero_subject_gadgets.jpg',
    featuredProduct: {
      name: 'Titanium Ultra Smartwatch 9',
      thumbnail: '/assets/images/card_thumb_gadget.jpg',
      category: 'Gadget',
    },
  },
  {
    id: 'kids-toys',
    category: 'Toys',
    circleColor: '#8B5CF6',
    accentColor: '#A78BFA',
    badge: 'CREATIVE PLAY',
    badgeBg: '#F3E8FF',
    badgeText: '#9333EA',
    titleLine1Prefix: 'Play ',
    highlightYear: '2026',
    highlightColor: '#9333EA',
    titleLine1Suffix: ' Collection',
    titleLine2: 'Montessori STEM & Creative',
    titleLine3: 'Toys',
    subtitle:
      'Inspire imagination and problem-solving with non-toxic sustainable beechwood blocks, puzzles, and sensory play.',
    primaryCtaLabel: 'Explore Toys',
    primaryCtaBg: '#9333EA',
    primaryCtaText: '#FFFFFF',
    subjectImage: '/assets/images/hero_subject_toys.jpg',
    featuredProduct: {
      name: 'Montessori STEM Wooden Kit',
      thumbnail: '/assets/images/card_thumb_toy.jpg',
      category: 'Toys',
    },
  },
];

interface EmartBannerSlideProps {
  banner: HeroBannerItem;
  isActive: boolean;
  currentBannerIndex: number;
  onSelectSlide: (index: number) => void;
  onCtaClick: (category: string) => void;
  onFlashDealsClick: () => void;
}

export const EmartBannerSlide: React.FC<EmartBannerSlideProps> = ({
  banner,
  isActive,
  currentBannerIndex,
  onSelectSlide,
  onCtaClick,
  onFlashDealsClick,
}) => {
  return (
    <div
      style={{
        backgroundColor: '#F8F6F1',
        opacity: isActive ? 1 : 0,
        zIndex: isActive ? 10 : 0,
        pointerEvents: isActive ? 'auto' : 'none',
        transition: 'opacity 0.4s ease-in-out',
      }}
      className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden select-none"
    >
      {/* 1. Background Dot Matrix Graphic Accents (SVG) */}
      <svg
        className="absolute left-8 bottom-7 w-24 h-16 text-slate-300/40 pointer-events-none select-none z-0"
        fill="currentColor"
        viewBox="0 0 80 50"
      >
        {[0, 1, 2].map((r) =>
          [0, 1, 2, 3, 4].map((c) => (
            <circle
              key={`${r}-${c}`}
              cx={c * 16 + 8}
              cy={r * 16 + 8}
              r="2.2"
            />
          ))
        )}
      </svg>

      <svg
        className="absolute right-10 top-6 w-20 h-16 text-slate-300/30 pointer-events-none select-none z-0 hidden lg:block"
        fill="currentColor"
        viewBox="0 0 80 50"
      >
        {[0, 1, 2].map((r) =>
          [0, 1, 2, 3].map((c) => (
            <circle
              key={`tr-${r}-${c}`}
              cx={c * 16 + 8}
              cy={r * 16 + 8}
              r="2.2"
            />
          ))
        )}
      </svg>

      {/* 2. Coded Circle Backdrop */}
      <div
        style={{ backgroundColor: banner.circleColor }}
        className="absolute right-[5%] sm:right-[7%] lg:right-[9%] top-[10%] w-[340px] sm:w-[380px] lg:w-[440px] h-[340px] sm:h-[380px] lg:h-[440px] rounded-full pointer-events-none transition-colors duration-700 z-0 shadow-inner"
      />

      {/* 3. Coded Sunburst Spark Rays */}
      <div className="absolute right-[33%] sm:right-[35%] lg:right-[38%] top-[10%] flex gap-1.5 items-end pointer-events-none select-none z-10">
        <div
          style={{ backgroundColor: banner.accentColor }}
          className="w-1.5 h-6 rounded-full -rotate-45"
        />
        <div
          style={{ backgroundColor: banner.accentColor }}
          className="w-2 h-9 rounded-full -rotate-20"
        />
        <div
          style={{ backgroundColor: banner.accentColor }}
          className="w-1.5 h-6 rounded-full rotate-15"
        />
      </div>

      {/* 4. Coded Organic Botanical Leaf Accent */}
      <svg
        className="absolute right-0 top-[26%] w-24 sm:w-28 h-52 pointer-events-none select-none z-10 opacity-75 hidden sm:block"
        viewBox="0 0 100 200"
        fill="none"
      >
        <path
          d="M10,180 C30,120 75,80 95,20 C85,65 65,125 10,180 Z"
          fill="#3E5C4E"
        />
        <path
          d="M14,172 C40,120 72,85 90,30"
          stroke="#5A8372"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      {/* 5. Subject Overlapping the Circle (Seamlessly blended with multiply + radial feathering) */}
      <div className="absolute right-2 sm:right-6 lg:right-10 bottom-0 top-0 w-[50%] lg:w-[48%] flex items-end justify-center pointer-events-none select-none z-10 overflow-hidden">
        <img
          src={banner.subjectImage}
          alt={banner.category}
          style={{
            mixBlendMode: 'multiply',
            WebkitMaskImage:
              'radial-gradient(ellipse 90% 90% at 50% 50%, black 70%, transparent 100%)',
            maskImage:
              'radial-gradient(ellipse 90% 90% at 50% 50%, black 70%, transparent 100%)',
          }}
          className="max-h-[500px] w-auto object-contain object-bottom scale-100 transition-transform duration-700"
        />
      </div>

      {/* 6. Left Side Coded Typography & Action Controls */}
      <div className="relative z-20 max-w-[540px] h-full flex flex-col justify-between py-8 lg:py-10 pl-8 lg:pl-12 select-none">
        <div>
          {/* Crown Badge */}
          <div
            style={{ backgroundColor: banner.badgeBg, color: banner.badgeText }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-wider mb-4 shadow-2xs"
          >
            <Crown className="w-3.5 h-3.5" style={{ fill: banner.badgeText }} />
            <span>{banner.badge}</span>
          </div>

          {/* Main Headline with Highlighted Accent Year */}
          <h1 className="text-3xl sm:text-4xl lg:text-[45px] font-black text-[#0f172a] leading-[1.12] tracking-tight mb-4">
            <span>{banner.titleLine1Prefix}</span>
            <span style={{ color: banner.highlightColor }}>
              {banner.highlightYear}
            </span>
            <span>{banner.titleLine1Suffix}</span>
            <br />
            <span>{banner.titleLine2}</span>
            {banner.titleLine3 && (
              <>
                <br />
                <span>{banner.titleLine3}</span>
              </>
            )}
          </h1>

          {/* Subtitle Description */}
          <p className="text-slate-600 text-[14px] lg:text-[15px] leading-relaxed font-medium max-w-[450px] mb-6">
            {banner.subtitle}
          </p>

          {/* CTA Action Buttons with Explicit Inlined Styles */}
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={() => onCtaClick(banner.category)}
              style={{
                backgroundColor: banner.primaryCtaBg,
                color: banner.primaryCtaText,
                padding: '12px 24px',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                border: 'none',
              }}
              className="hover:brightness-105 active:scale-95 transition-all shadow-sm group"
            >
              <span>{banner.primaryCtaLabel}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onFlashDealsClick}
              style={{
                backgroundColor: '#F1F3F5',
                color: '#0F172A',
                padding: '12px 20px',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                border: '1px solid rgba(226, 232, 240, 0.8)',
              }}
              className="hover:bg-slate-200 active:scale-95 transition-all shadow-2xs group"
            >
              <Zap className="w-4 h-4 text-[#FAB005] fill-[#FAB005] group-hover:scale-110 transition-transform" />
              <span>Flash Deals</span>
            </button>
          </div>
        </div>

        {/* 7. Slide Indicator Dots */}
        <div className="flex items-center gap-2 pt-2">
          {HERO_BANNERS.map((b, idx) => {
            const isCurrent = idx === currentBannerIndex;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => onSelectSlide(idx)}
                style={{
                  width: isCurrent ? '28px' : '9px',
                  height: '9px',
                  backgroundColor: isCurrent ? '#FAB005' : '#cbd5e1',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
                className="transition-all duration-300 hover:opacity-80"
                title={`Slide ${idx + 1}: ${b.category}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* 8. Floating Featured Pick Product Card (100% Coded Component) */}
      <div
        onClick={() => onCtaClick(banner.category)}
        className="absolute right-4 sm:right-6 lg:right-10 bottom-6 sm:bottom-8 lg:bottom-10 z-30 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.12)] border border-slate-100 p-3.5 flex items-center gap-3.5 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group max-w-[315px] select-none"
      >
        {/* Product Thumbnail */}
        <div className="w-[74px] h-[92px] rounded-xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center overflow-hidden shrink-0">
          <img
            src={banner.featuredProduct.thumbnail}
            alt={banner.featuredProduct.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <span className="inline-block px-2 py-0.5 rounded-md bg-[#FFF4D6] text-[#D97706] text-[10px] font-black uppercase tracking-wider mb-1">
            FEATURED PICK
          </span>
          <h4 className="text-[13px] font-bold text-slate-900 leading-snug line-clamp-2 mb-2 group-hover:text-[#D97706] transition-colors">
            {banner.featuredProduct.name}
          </h4>
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#059669] text-[10px] font-black uppercase tracking-wider">
              IN STOCK
            </span>
            <div className="w-7 h-7 rounded-full bg-[#0F172A] text-white flex items-center justify-center group-hover:bg-[#D97706] group-hover:scale-110 active:scale-95 transition-all shadow-xs">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
