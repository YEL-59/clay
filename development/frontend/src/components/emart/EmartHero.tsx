import React, { useState, useRef, useEffect } from 'react';
import { EMART_CATEGORIES } from '../../data/emartCatalog';
import {
  mutateEmart,
  setActiveView,
  toggleCategorySidebar,
  useEmart,
} from '../../store/emartStore';
import {
  CATEGORY_FLYOUTS,
  CategoryFlyoutData,
} from '../../data/categoryFlyoutData';
import {
  EmartBannerSlide,
  HERO_BANNERS,
  HeroBannerItem,
} from './EmartBannerSlide';
import {
  Menu,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ArrowRight,
  Crown,
  Zap,
  Headphones,
  Radio,
  Gamepad2,
  Laptop,
  Monitor,
  Smartphone,
  Tablet,
  Watch,
  Shirt,
  Scissors,
  Footprints,
  Briefcase,
  Glasses,
  Gem,
  Lamp,
  Image as ImageIcon,
  Clock,
  Coffee,
  Armchair,
  Leaf,
  Flame,
  Box,
  Home,
  Keyboard,
  Speaker,
  BatteryCharging,
  Camera,
  Cpu,
  Blocks,
  Shield,
  Dices,
  GraduationCap,
  Car,
  Heart,
  Puzzle,
  Trophy,
  Sparkles,
} from 'lucide-react';

// High-definition 3D claymorphic category icons generated via Gemini
const renderSidebarIcon = (catName: string) => {
  const iconMap: Record<string, string> = {
    'Toys': '/assets/images/cat_icon_toys_zoom.jpg',
    'Electronics': '/assets/images/cat_icon_electronics_zoom.jpg',
    'Room Decor': '/assets/images/cat_icon_decor_zoom.jpg',
    'Fashion': '/assets/images/cat_icon_fashion_zoom.jpg',
    'Gadget': '/assets/images/cat_icon_gadget_zoom.jpg',
  };
  const iconSrc = iconMap[catName];
  if (iconSrc) {
    return (
      <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-slate-100/90 shadow-2xs bg-slate-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
        <img
          src={iconSrc}
          alt={catName}
          className="w-full h-full object-cover scale-105"
        />
      </div>
    );
  }
  return (
    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
      <Sparkles className="w-5 h-5" />
    </div>
  );
};

// Subcategory children icons
const renderSubcategoryIcon = (iconName: string) => {
  const iconProps = { className: 'w-4 h-4' };
  switch (iconName) {
    case 'Headphones':
      return <Headphones {...iconProps} />;
    case 'Radio':
      return <Radio {...iconProps} />;
    case 'Gamepad2':
      return <Gamepad2 {...iconProps} />;
    case 'Laptop':
      return <Laptop {...iconProps} />;
    case 'Monitor':
      return <Monitor {...iconProps} />;
    case 'Smartphone':
      return <Smartphone {...iconProps} />;
    case 'Tablet':
      return <Tablet {...iconProps} />;
    case 'Watch':
      return <Watch {...iconProps} />;
    case 'Shirt':
      return <Shirt {...iconProps} />;
    case 'Scissors':
      return <Scissors {...iconProps} />;
    case 'Footprints':
      return <Footprints {...iconProps} />;
    case 'Briefcase':
      return <Briefcase {...iconProps} />;
    case 'Glasses':
      return <Glasses {...iconProps} />;
    case 'Gem':
      return <Gem {...iconProps} />;
    case 'Lamp':
      return <Lamp {...iconProps} />;
    case 'Image':
      return <ImageIcon {...iconProps} />;
    case 'Clock':
      return <Clock {...iconProps} />;
    case 'Coffee':
      return <Coffee {...iconProps} />;
    case 'Armchair':
      return <Armchair {...iconProps} />;
    case 'Leaf':
      return <Leaf {...iconProps} />;
    case 'Flame':
      return <Flame {...iconProps} />;
    case 'Box':
      return <Box {...iconProps} />;
    case 'Home':
      return <Home {...iconProps} />;
    case 'Zap':
      return <Zap {...iconProps} />;
    case 'Keyboard':
      return <Keyboard {...iconProps} />;
    case 'Speaker':
      return <Speaker {...iconProps} />;
    case 'BatteryCharging':
      return <BatteryCharging {...iconProps} />;
    case 'Camera':
      return <Camera {...iconProps} />;
    case 'Cpu':
      return <Cpu {...iconProps} />;
    case 'Blocks':
      return <Blocks {...iconProps} />;
    case 'Shield':
      return <Shield {...iconProps} />;
    case 'Dices':
      return <Dices {...iconProps} />;
    case 'GraduationCap':
      return <GraduationCap {...iconProps} />;
    case 'Car':
      return <Car {...iconProps} />;
    case 'Heart':
      return <Heart {...iconProps} />;
    case 'Puzzle':
      return <Puzzle {...iconProps} />;
    case 'Trophy':
      return <Trophy {...iconProps} />;
    default:
      return <Sparkles {...iconProps} />;
  }
};

export const EmartHero: React.FC = () => {
  const store = useEmart();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const flyoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 5 Banners Carousel State
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isBannerHovered, setIsBannerHovered] = useState(false);

  // Auto-slide every 5 seconds (pauses on hover)
  useEffect(() => {
    if (isBannerHovered) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isBannerHovered]);

  const handlePrevBanner = () => {
    setCurrentBannerIndex((prev) =>
      prev === 0 ? HERO_BANNERS.length - 1 : prev - 1
    );
  };

  const handleNextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % HERO_BANNERS.length);
  };

  const currentBanner = HERO_BANNERS[currentBannerIndex];

  const handleCategoryClick = (catName: string) => {
    setHoveredCategory(null);
    setActiveView('shop', catName);
  };

  const handleSubcategoryClick = (catName: string, subName: string) => {
    setHoveredCategory(null);
    mutateEmart((s) => {
      s.searchQuery = subName;
    });
    setActiveView('shop', catName);
  };

  const handleCategoryMouseEnter = (catName: string) => {
    if (flyoutTimeoutRef.current) {
      clearTimeout(flyoutTimeoutRef.current);
      flyoutTimeoutRef.current = null;
    }
    setHoveredCategory(catName);
  };

  const handleMouseLeaveContainer = () => {
    if (flyoutTimeoutRef.current) clearTimeout(flyoutTimeoutRef.current);
    flyoutTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 250);
  };

  const handleFlyoutMouseEnter = () => {
    if (flyoutTimeoutRef.current) {
      clearTimeout(flyoutTimeoutRef.current);
      flyoutTimeoutRef.current = null;
    }
  };

  const activeFlyout: CategoryFlyoutData | undefined =
    hoveredCategory && CATEGORY_FLYOUTS[hoveredCategory]
      ? CATEGORY_FLYOUTS[hoveredCategory]
      : undefined;

  return (
    <section className="pt-4 pb-3">
      <div className="container mx-auto px-4">
        <div className="flex gap-6 lg:gap-7 items-stretch relative">
          {/* 1. Left Vertical Categories Navigation Menu (Exact Match to User Screenshot) */}
          {store.isCategorySidebarOpen && (
            <div
              className="hidden lg:block w-[280px] shrink-0 relative z-40 transition-all duration-300"
              onMouseLeave={handleMouseLeaveContainer}
            >
              <div className="h-[540px] bg-white border border-slate-200/80 rounded-2xl overflow-hidden flex flex-col shadow-xs transition-colors duration-300">
                {/* Category Header with 3-Bar Toggle (Exact Match: #FAB005 with dark navy text & icons) */}
                <button
                  type="button"
                  onClick={() => toggleCategorySidebar()}
                  style={{
                    backgroundColor: '#FAB005',
                    color: '#0f172a',
                    height: '64px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 20px',
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px',
                    border: 'none',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                  className="shrink-0 font-bold shadow-xs active:scale-[0.98] transition-transform"
                  title="Click to toggle categories"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Modern 3-bar hamburger icon with subtle dark pill background */}
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(0,0,0,0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        flexShrink: 0,
                      }}
                      className="group-hover:bg-black/12 transition-colors"
                    >
                      <span style={{ width: '16px', height: '2.5px', backgroundColor: '#0f172a', borderRadius: '999px', display: 'block' }} />
                      <span style={{ width: '16px', height: '2.5px', backgroundColor: '#0f172a', borderRadius: '999px', display: 'block' }} />
                      <span style={{ width: '16px', height: '2.5px', backgroundColor: '#0f172a', borderRadius: '999px', display: 'block' }} />
                    </div>
                    <span className="text-[16px] font-black tracking-tight text-[#0f172a]">
                      Browse Categories
                    </span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-[#0f172a] stroke-[2.5] opacity-90 transition-transform group-hover:translate-y-0.5" />
                </button>

                {/* Category List Items with 3D Icons & Item Counts (Evenly Distributed to Fill Full Height) */}
                <div
                  style={{
                    flex: '1 1 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    height: '420px',
                    boxSizing: 'border-box',
                  }}
                  className="overflow-hidden"
                >
                  {EMART_CATEGORIES.map((cat) => {
                    const isCurrentHovered = hoveredCategory === cat.name;
                    return (
                      <div
                        key={cat.id}
                        onMouseEnter={() => handleCategoryMouseEnter(cat.name)}
                        style={{
                          flex: '1 1 0%',
                          display: 'flex',
                          margin: '3px 0',
                          minHeight: '66px',
                        }}
                        className="relative"
                      >
                        <button
                          type="button"
                          onClick={() => handleCategoryClick(cat.name)}
                          onMouseEnter={() => handleCategoryMouseEnter(cat.name)}
                          style={{
                            backgroundColor: isCurrentHovered ? '#FFF9EA' : undefined,
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            borderRadius: '16px',
                            textAlign: 'left',
                            boxSizing: 'border-box',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                          className={`group transition-all duration-200 ${
                            isCurrentHovered
                              ? 'shadow-xs'
                              : 'hover:bg-slate-50/80'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            {/* Category Icon */}
                            {renderSidebarIcon(cat.name)}

                            {/* Title & Item Count */}
                            <div className="min-w-0 flex flex-col justify-center">
                              <span
                                style={{
                                  color: isCurrentHovered ? '#D97706' : '#0f172a',
                                }}
                                className="text-[15px] font-black leading-tight tracking-tight truncate transition-colors"
                              >
                                {cat.name}
                              </span>
                              <span className="text-[12px] text-slate-400 font-semibold leading-tight mt-1">
                                {cat.itemCount} Items
                              </span>
                            </div>
                          </div>

                          <ChevronRight
                            style={{
                              color: isCurrentHovered ? '#D97706' : '#cbd5e1',
                            }}
                            className="w-4 h-4 transition-colors shrink-0 group-hover:text-[#FAB005] group-hover:translate-x-0.5"
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* View All Categories Link Footer (Exact Match: Clean minimalist row with text & arrow) */}
                <div
                  style={{
                    flexShrink: 0,
                    padding: '16px 20px',
                    borderTop: '1px solid #f1f5f9',
                    backgroundColor: '#ffffff',
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                    boxSizing: 'border-box',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveView('shop', 'All')}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: '#0f172a',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      userSelect: 'none',
                      padding: 0,
                    }}
                    className="group"
                  >
                    <span className="text-[14.5px] font-black tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
                      View All Categories
                    </span>
                    <ArrowRight className="w-4.5 h-4.5 text-slate-700 stroke-[2.2] group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              </div>

              {/* 2. Floating Children Mega-Menu Flyout ("each also have children") */}
              {activeFlyout && (
                <div
                  onMouseEnter={handleFlyoutMouseEnter}
                  onMouseLeave={handleMouseLeaveContainer}
                  style={{ left: '295px', top: '0px' }}
                  className="absolute z-50 w-[580px] lg:w-[620px] h-[540px] bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.16)] border border-slate-100 p-7 flex flex-col justify-between transition-all duration-200 animate-in fade-in zoom-in-95 select-none"
                >
                  {/* Top: Category Title & Golden Accent Bar */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-[22px] font-black text-slate-900 tracking-tight">
                        {activeFlyout.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleCategoryClick(activeFlyout.categoryName)}
                        className="text-xs font-bold text-slate-400 hover:text-[#FAB005] flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>View All</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {/* Golden accent line matching screenshot */}
                    <div
                      style={{ backgroundColor: '#FAB005' }}
                      className="w-12 h-1 rounded-full mt-1.5 mb-6"
                    />

                    {/* Children Subcategories 2-Column Grid */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3.5">
                      {activeFlyout.children.map((child) => (
                        <button
                          key={child.id}
                          type="button"
                          onClick={() =>
                            handleSubcategoryClick(
                              activeFlyout.categoryName,
                              child.name
                            )
                          }
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 group transition-all text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-[#FFF9EA] group-hover:text-[#FAB005] group-hover:border-[#FAB005]/30 transition-all shrink-0">
                              {renderSubcategoryIcon(child.iconName)}
                            </div>
                            <span className="text-[14px] font-bold text-slate-800 group-hover:text-[#FAB005] transition-colors truncate">
                              {child.name}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#FAB005] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bottom: Exclusive Promo Banner Card */}
                  <div
                    style={{
                      background: 'linear-gradient(90deg, #FFF8EE 0%, #FFF3E0 50%, #FFEEC7 100%)',
                    }}
                    className="rounded-2xl p-5 sm:p-6 relative overflow-hidden flex items-center justify-between border border-amber-100/60 shadow-xs mt-4"
                  >
                    <div className="relative z-10 max-w-[300px]">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#D97706] inline-block mb-1">
                        {activeFlyout.banner.tag}
                      </span>
                      <h4 className="text-[26px] font-extrabold text-slate-900 leading-tight mb-1">
                        {activeFlyout.banner.title}
                      </h4>
                      <p className="text-[13px] text-slate-500 font-medium mb-3.5">
                        {activeFlyout.banner.subtitle}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          handleCategoryClick(activeFlyout.banner.linkCategory)
                        }
                        style={{ backgroundColor: '#FAB005', color: '#ffffff' }}
                        className="inline-flex items-center gap-2 px-6 py-2.5 hover:brightness-105 font-bold text-xs rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer group select-none"
                      >
                        <span style={{ color: '#ffffff' }}>{activeFlyout.banner.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" style={{ color: '#ffffff' }} />
                      </button>
                    </div>

                    <div className="relative w-36 h-36 shrink-0 flex items-end justify-center">
                      <div className="absolute inset-0 bg-amber-300/40 rounded-full blur-xl scale-90" />
                      <div className="w-32 h-32 rounded-2xl overflow-hidden relative shadow-md border-2 border-white/80">
                        <img
                          src={activeFlyout.banner.imageUrl}
                          alt={activeFlyout.banner.title}
                          className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. Right Main Hero Banner (Reusable Coded EmartBannerSlide Component Pattern) */}
          <div className="flex-1 min-w-0 transition-all duration-300 relative">
            <div
              onMouseEnter={() => setIsBannerHovered(true)}
              onMouseLeave={() => setIsBannerHovered(false)}
              className="relative w-full h-[540px] rounded-3xl overflow-hidden border border-slate-200/60 shadow-xs transition-all select-none group"
            >
              {/* Reusable Coded Banner Slides (5 Distinct Banners) */}
              {HERO_BANNERS.map((banner, index) => (
                <EmartBannerSlide
                  key={banner.id}
                  banner={banner}
                  isActive={index === currentBannerIndex}
                  currentBannerIndex={currentBannerIndex}
                  onSelectSlide={(idx) => setCurrentBannerIndex(idx)}
                  onCtaClick={handleCategoryClick}
                  onFlashDealsClick={() => setActiveView('flash-deals')}
                />
              ))}

              {/* Collapsed Sidebar Restore Trigger */}
              {!store.isCategorySidebarOpen && (
                <div className="hidden lg:block absolute top-4 left-4 z-30">
                  <button
                    type="button"
                    onClick={() => toggleCategorySidebar(true)}
                    style={{ backgroundColor: '#FAB005', color: '#0f172a' }}
                    className="flex items-center gap-2 px-4 py-2 font-black text-xs rounded-xl shadow-md cursor-pointer group"
                    title="Open Category Menu"
                  >
                    <Menu className="w-4 h-4" />
                    <span>Browse Categories</span>
                  </button>
                </div>
              )}

              {/* Prev Banner Chevron Button */}
              <button
                type="button"
                onClick={handlePrevBanner}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md backdrop-blur-sm flex items-center justify-center cursor-pointer transition-all opacity-0 group-hover:opacity-100 active:scale-90 border border-slate-200/60"
                title="Previous Banner"
                aria-label="Previous Banner"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next Banner Chevron Button */}
              <button
                type="button"
                onClick={handleNextBanner}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md backdrop-blur-sm flex items-center justify-center cursor-pointer transition-all opacity-0 group-hover:opacity-100 active:scale-90 border border-slate-200/60"
                title="Next Banner"
                aria-label="Next Banner"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
