import React from 'react';
import { Truck, Headset, ShieldCheck, Tag } from 'lucide-react';

export const EmartValueProps: React.FC = () => {
  return (
    <section className="py-12 px-4 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-10 lg:gap-x-12">
          {/* Card 1: Return & Refund */}
          <div className="bg-[#FFF8E6] relative rounded-[20px] pl-16 pr-6 py-8 flex items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default group border border-transparent ml-6 lg:ml-8">
            <div className="bg-[#FAB005] absolute -left-8 lg:-left-10 w-[75px] h-[75px] rounded-[22px] flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500 text-white overflow-hidden">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-[18px] font-bold text-[#023047] tracking-tight leading-none transition-colors">
                Return & Refund
              </h4>
              <p className="text-sm mt-3 text-slate-700 font-medium tracking-tight transition-colors leading-tight">
                Free return over $200
              </p>
            </div>
          </div>

          {/* Card 2: Quality Support */}
          <div className="bg-[#E6F9FC] relative rounded-[20px] pl-16 pr-6 py-8 flex items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default group border border-transparent ml-6 lg:ml-8">
            <div className="bg-[#1CC3E8] absolute -left-8 lg:-left-10 w-[75px] h-[75px] rounded-[22px] flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500 text-white overflow-hidden">
              <Headset className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-[18px] font-bold text-[#023047] tracking-tight leading-none transition-colors">
                Quality Support
              </h4>
              <p className="text-sm mt-3 text-slate-700 font-medium tracking-tight transition-colors leading-tight">
                24/7 Online Support
              </p>
            </div>
          </div>

          {/* Card 3: Secure Payment */}
          <div className="bg-[#F1F9EF] relative rounded-[20px] pl-16 pr-6 py-8 flex items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default group border border-transparent ml-6 lg:ml-8">
            <div className="bg-[#74D65C] absolute -left-8 lg:-left-10 w-[75px] h-[75px] rounded-[22px] flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500 text-white overflow-hidden">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-[18px] font-bold text-[#023047] tracking-tight leading-none transition-colors">
                Secure Payment
              </h4>
              <p className="text-sm mt-3 text-slate-700 font-medium tracking-tight transition-colors leading-tight">
                100% Secure Checkout
              </p>
            </div>
          </div>

          {/* Card 4: Daily Offers */}
          <div className="bg-[#E5F9F6] relative rounded-[20px] pl-16 pr-6 py-8 flex items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default group border border-transparent ml-6 lg:ml-8">
            <div className="bg-[#00BFA5] absolute -left-8 lg:-left-10 w-[75px] h-[75px] rounded-[22px] flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500 text-white overflow-hidden">
              <Tag className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-[18px] font-bold text-[#023047] tracking-tight leading-none transition-colors">
                Daily Offers
              </h4>
              <p className="text-sm mt-3 text-slate-700 font-medium tracking-tight transition-colors leading-tight">
                Up to 50% discount
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
