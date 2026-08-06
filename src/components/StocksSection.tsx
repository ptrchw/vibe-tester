import React from 'react';
import { MarketItem } from '../types';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';

interface StocksSectionProps {
  stocks: MarketItem[];
  onSelectItem: (item: MarketItem) => void;
  onSeeMore: () => void;
  updatedItemIds: Set<string>;
}

export const StocksSection: React.FC<StocksSectionProps> = ({
  stocks,
  onSelectItem,
  onSeeMore,
  updatedItemIds
}) => {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onSeeMore}
          className="group text-xl sm:text-2xl font-bold text-[#1a1c1c] hover:text-[#0049db] transition-colors flex items-center cursor-pointer"
        >
          US stocks
          <ChevronRight className="w-5 h-5 ml-1 text-[#1a1c1c] group-hover:text-[#0049db] group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {stocks.slice(0, 6).map((item) => {
          const isPos = item.change >= 0;
          const isUpdated = updatedItemIds.has(item.id);

          return (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className={`bg-white border border-[#F0F3FA] rounded-lg p-3 text-center hover:bg-[#f3f3f4] transition-all cursor-pointer shadow-2xs group ${
                isUpdated ? (isPos ? 'flash-up' : 'flash-down') : ''
              }`}
            >
              <div className="text-[11px] font-bold text-[#6A6D78] uppercase mb-0.5 tracking-wider">
                {item.exchange}
              </div>
              <div className="text-base font-bold text-[#1a1c1c] group-hover:text-[#0049db] transition-colors">
                {item.symbol}
              </div>
              <div className="text-xs font-semibold text-[#1a1c1c] mt-1">
                ${item.price.toFixed(2)}
              </div>
              <div
                className={`text-[11px] font-semibold mt-0.5 inline-flex items-center ${
                  isPos ? 'text-[#089981]' : 'text-[#F23645]'
                }`}
              >
                {isPos ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                {isPos ? '+' : ''}{item.changePercent.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
