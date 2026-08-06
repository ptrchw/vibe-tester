import React from 'react';
import { MarketCategory } from '../types';

interface CategoryNavProps {
  selectedCategory: MarketCategory;
  onSelectCategory: (category: MarketCategory) => void;
}

const CATEGORIES: MarketCategory[] = ['Indices', 'Stocks', 'Crypto', 'Forex', 'Futures', 'Bonds'];

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div className="w-full bg-[#f9f9f9] border-b border-[#F0F3FA] pt-8 pb-6 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-center text-[#1a1c1c] mb-6">
          Markets, everywhere
        </h1>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 justify-start sm:justify-center">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0049db] text-white shadow-xs scale-[1.02]'
                    : 'bg-[#e2e2e2] text-[#5a5e6b] hover:bg-[#dfe2f2] hover:text-[#1a1c1c]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
