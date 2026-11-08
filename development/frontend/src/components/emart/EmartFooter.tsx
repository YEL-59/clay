import React from 'react';
import { setActiveView, setActiveUserTab } from '../../store/emartStore';
import { Shield, MapPin, Phone, Mail, Heart } from 'lucide-react';

export const EmartFooter: React.FC = () => {
  return (
    <footer className="bg-[#0b1f45] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="container mx-auto px-4">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#FAB005] flex items-center justify-center text-slate-950 font-black text-xl shadow-md">
                E
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                E-Mart<span className="text-[#FAB005]">.</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Modern Multi-Category E-commerce connecting discerning shoppers with high-performance electronics, luxury linen apparel, and ambient home gear.
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#FAB005]" />
                <span>Gulshan-2 & Banani Atelier Studio, Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FAB005]" />
                <span>+880 1711-234567 / 24/7 Priority Support</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FAB005]" />
                <span>concierge@e-mart-global.com</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('shop', 'Electronics')}
                  className="hover:text-[#FAB005] transition-colors cursor-pointer text-left"
                >
                  Electronics & Displays
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('shop', 'Gadgets')}
                  className="hover:text-[#FAB005] transition-colors cursor-pointer text-left"
                >
                  Gadgets & Audio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('shop', 'Fashion')}
                  className="hover:text-[#FAB005] transition-colors cursor-pointer text-left"
                >
                  Summer Fashion & Linen
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('shop', 'Room Decor')}
                  className="hover:text-[#FAB005] transition-colors cursor-pointer text-left"
                >
                  Smart Room Decor
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('shop', 'Toys')}
                  className="hover:text-[#FAB005] transition-colors cursor-pointer text-left"
                >
                  Collector Toys & Robots
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Customer Portal
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveUserTab('orders')}
                  className="hover:text-[#FAB005] transition-colors cursor-pointer text-left"
                >
                  My Orders & Live Tracking
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveUserTab('addresses')}
                  className="hover:text-[#FAB005] transition-colors cursor-pointer text-left"
                >
                  Delivery Addresses
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('flash-deals')}
                  className="hover:text-[#FAB005] transition-colors cursor-pointer text-left"
                >
                  Active Flash Sales
                </button>
              </li>
              <li>
                <span className="text-slate-500">Return & Exchange Policy (30 Days)</span>
              </li>
              <li>
                <span className="text-slate-500">Warranty Registration</span>
              </li>
            </ul>
          </div>

          {/* Store Operations & Admin Dashboard Direct Link */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#FAB005] uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              <span>Staff & Operations</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Store Managers, Sales Representatives, and Factory Supply Managers can access the central operations portal:
            </p>
            <div className="pt-1">
              <a
                href="http://localhost:3006/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAB005] hover:bg-[#e09d00] text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin & HR Dashboard</span>
              </a>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Includes Orders Kanban, Manufacturer POs, and HR Interview / CV checker.
            </p>
          </div>
        </div>

        {/* Payment Badges & Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 E-Mart Global Commerce Ltd. All rights reserved.</p>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-1 bg-white/5 rounded border border-white/10 font-bold text-slate-400 text-[10px]">
              bKash
            </span>
            <span className="px-2 py-1 bg-white/5 rounded border border-white/10 font-bold text-slate-400 text-[10px]">
              Nagad
            </span>
            <span className="px-2 py-1 bg-white/5 rounded border border-white/10 font-bold text-slate-400 text-[10px]">
              Visa
            </span>
            <span className="px-2 py-1 bg-white/5 rounded border border-white/10 font-bold text-slate-400 text-[10px]">
              Mastercard
            </span>
            <span className="px-2 py-1 bg-white/5 rounded border border-white/10 font-bold text-slate-400 text-[10px]">
              Cash on Delivery (COD)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
