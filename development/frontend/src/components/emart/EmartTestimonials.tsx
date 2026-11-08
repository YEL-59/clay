import React, { useState } from 'react';
import { Star, CheckCircle, Mail, Send } from 'lucide-react';
import { emartToast } from '../../store/emartStore';

const REVIEWS = [
  {
    name: 'Tanvir Hossain',
    role: 'Full-Stack Developer, Dhaka',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
    product: 'HP Vision Pro S24e 100Hz Monitor',
    rating: 5,
    comment:
      'The 100Hz refresh rate and IPS color fidelity on this HP monitor are mind-blowing for the price! Delivered in under 24 hours in Dhaka with secure bubble packaging.',
  },
  {
    name: 'Nadia Rahman',
    role: 'Creative Director',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200',
    product: 'Hayfa Ellis Summer Resort Maxi',
    rating: 5,
    comment:
      'The 100% Normandy organic linen fabric is so soft, breathable, and structured. Beautiful atelier stitching and fits like a bespoke dream.',
  },
  {
    name: 'Farhan Kabir',
    role: 'Audio Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    product: 'Sony WH-1000XM5 Headphones',
    rating: 5,
    comment:
      'Unbelievable noise cancellation. Completely silences Dhaka city traffic while working in the cafe. The dual processor audio separation is crisp.',
  },
];

export const EmartTestimonials: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      emartToast('Please enter a valid email address', 'warn');
      return;
    }
    emartToast('🎉 Subscribed! Use coupon code EMART10 for 10% off your order.', 'success');
    setEmail('');
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Customer Reviews Header */}
        <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold text-[#FAB005] uppercase tracking-widest bg-[#FFF8E6] px-3.5 py-1 rounded-full border border-[#FAB005]/20">
            Real Customer Voices
          </span>
          <h2 className="text-3xl font-black text-[#023047] tracking-tight">
            Loved by 15,000+ Shoppers
          </h2>
          <p className="text-sm text-slate-500">
            Discover why creators, developers, and fashion connoisseurs trust E-Mart for premium products.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  <span>Verified Purchase</span>
                </div>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed italic">
                "{rev.comment}"
              </p>

              <div className="pt-2 border-t border-slate-200/60 flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-white shadow-xs"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#023047]">{rev.name}</h4>
                  <p className="text-[11px] text-slate-400">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Subscription Box */}
        <div className="bg-[#023047] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-[#FAB005]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto text-center space-y-4 relative z-10">
            <span className="text-xs font-bold text-[#FAB005] uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/10">
              VIP Member Perks
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Get $20 Off Your First Order + Weekly Secret Drops
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Join our members-only dispatch for early access to high-demand electronics, limited atelier apparel, and coupon codes.
            </p>

            <form onSubmit={handleSubscribe} className="pt-2 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FAB005]"
                />
              </div>
              <button
                type="submit"
                className="h-12 px-6 bg-[#FAB005] hover:bg-[#e09d00] text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
