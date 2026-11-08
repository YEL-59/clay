import React, { useState, useEffect } from 'react';
import { EMART_PRODUCTS } from '../../data/emartCatalog';
import { EmartProductCard } from './EmartProductCard';
import { Flame, Clock } from 'lucide-react';

export const EmartFlashDealsSection: React.FC = () => {
  // Live ticking countdown for Flash Deals
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const deals = EMART_PRODUCTS.filter((p) => p.isFlashDeal || (p.discountPercent ?? 0) >= 10);

  return (
    <section className="py-20 bg-gradient-to-b from-white via-[#FFF8E6]/40 to-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Flash Deals Header with Live Countdown */}
        <div className="bg-white border border-[#FAB005]/30 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-rose-500 font-bold uppercase tracking-widest text-xs">
              <Flame className="w-4 h-4 fill-current animate-bounce" />
              <span>Limited Time Discounts</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#023047] tracking-tight">
              Today's <span className="text-[#FAB005]">Flash Deals</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              Grab premium monitors, high-performance processors, and wellness gear before stocks run out.
            </p>
          </div>

          {/* Live Ticking Countdown Box */}
          <div className="flex items-center gap-2 sm:gap-3 bg-[#023047] text-white p-3 sm:p-4 rounded-2xl shadow-inner">
            <div className="flex items-center gap-1.5 mr-2 text-[#FAB005]">
              <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
                Ends In:
              </span>
            </div>

            {/* Days */}
            <div className="text-center px-2 py-1 bg-white/10 rounded-xl min-w-[50px]">
              <span className="text-xl sm:text-2xl font-black text-[#FAB005] block leading-none">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Days</span>
            </div>

            <span className="text-xl font-bold text-[#FAB005]">:</span>

            {/* Hours */}
            <div className="text-center px-2 py-1 bg-white/10 rounded-xl min-w-[50px]">
              <span className="text-xl sm:text-2xl font-black text-[#FAB005] block leading-none">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Hours</span>
            </div>

            <span className="text-xl font-bold text-[#FAB005]">:</span>

            {/* Minutes */}
            <div className="text-center px-2 py-1 bg-white/10 rounded-xl min-w-[50px]">
              <span className="text-xl sm:text-2xl font-black text-[#FAB005] block leading-none">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Mins</span>
            </div>

            <span className="text-xl font-bold text-[#FAB005]">:</span>

            {/* Seconds */}
            <div className="text-center px-2 py-1 bg-white/10 rounded-xl min-w-[50px]">
              <span className="text-xl sm:text-2xl font-black text-rose-400 block leading-none animate-pulse">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Secs</span>
            </div>
          </div>
        </div>

        {/* Deals Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.slice(0, 4).map((product) => (
            <div key={product.id} className="flex flex-col">
              <EmartProductCard product={product} />

              {/* Deal Stock Progress Bar */}
              <div className="mt-3 bg-white p-3 rounded-xl border border-slate-100 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500">
                    Sold: {product.soldCount || 34}/{product.totalDealStock || 50}
                  </span>
                  <span className="text-rose-500">
                    {Math.round(((product.soldCount || 34) / (product.totalDealStock || 50)) * 100)}% Claimed
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FAB005] to-rose-500 rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.round(
                        ((product.soldCount || 34) / (product.totalDealStock || 50)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
