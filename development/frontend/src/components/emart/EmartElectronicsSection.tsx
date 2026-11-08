import React, { useState } from 'react';
import { EMART_PRODUCTS } from '../../data/emartCatalog';
import { EmartProductCard } from './EmartProductCard';
import { mutateEmart, setActiveView } from '../../store/emartStore';
import { Zap, ArrowRight } from 'lucide-react';

const SUB_CATS = ['All', 'Monitors', 'Laptops', 'Audio', 'Smartphones'];

export const EmartElectronicsSection: React.FC = () => {
  const [selectedSubCat, setSelectedSubCat] = useState('All');

  const electronicsProducts = EMART_PRODUCTS.filter(
    (p) => p.category === 'Electronics' || p.category === 'Gadgets'
  );

  const filtered =
    selectedSubCat === 'All'
      ? electronicsProducts
      : electronicsProducts.filter((p) => p.subCategory === selectedSubCat);

  return (
    <section className="py-16 relative overflow-hidden bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#FAB005]">
              <Zap className="w-5 h-5 fill-current" />
              <span className="font-bold uppercase tracking-[0.25em] text-xs">
                Premium Tech
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#023047] tracking-tight">
              Electronics & <span className="text-[#FAB005]">Gadgets</span>
            </h2>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Filter Pills */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              {SUB_CATS.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubCat(sub)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedSubCat === sub
                      ? 'bg-white text-[#023047] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveView('shop', selectedSubCat !== 'All' ? selectedSubCat : 'Electronics');
              }}
              style={{ backgroundColor: '#023047', color: '#ffffff' }}
              className="group flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:bg-[#FAB005] hover:text-slate-950 active:scale-95 cursor-pointer shadow-md"
            >
              <span style={{ color: '#ffffff' }}>Browse Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: '#ffffff' }} />
            </button>
          </div>
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.slice(0, 8).map((product) => (
            <EmartProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
