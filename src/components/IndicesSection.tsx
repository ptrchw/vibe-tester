import React from 'react';
import { MarketItem } from '../types';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { SparklineChart } from './SparklineChart';

interface IndicesSectionProps {
  indices: MarketItem[];
  onSelectItem: (item: MarketItem) => void;
  onSeeMore: () => void;
  updatedItemIds: Set<string>;
}

export const IndicesSection: React.FC<IndicesSectionProps> = ({
  indices,
  onSelectItem,
  onSeeMore,
  updatedItemIds
}) => {
  // Top 3 indices
  const topIndices = indices.filter((item) => item.badge).slice(0, 3);

  return (
    <section className="mb-10">
      {/* Section Title */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onSeeMore}
          className="group text-xl sm:text-2xl font-bold text-[#1a1c1c] hover:text-[#0049db] transition-colors flex items-center cursor-pointer"
        >
          Indices
          <ChevronRight className="w-5 h-5 ml-1 text-[#1a1c1c] group-hover:text-[#0049db] group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {topIndices.map((item) => {
          const isPos = item.change >= 0;
          const isUpdated = updatedItemIds.has(item.id);

          // Badge colors matching TradingView screenshot precisely:
          // S&P 500 has red badge `#F23645`, Nasdaq 100 has blue badge `#0049db`, Dow 30 has blue badge `#0049db`
          const badgeBg = item.badge === '500' ? 'bg-[#F23645]' : 'bg-[#0049db]';

          return (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className={`bg-white border border-[#F0F3FA] rounded-xl p-4 flex items-center justify-between hover:bg-[#f3f3f4] transition-all cursor-pointer shadow-2xs group ${
                isUpdated ? (isPos ? 'flash-up' : 'flash-down') : ''
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full ${badgeBg} text-white flex items-center justify-center font-bold text-xs mr-4 shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
                >
                  {item.badge}
                </div>
                <div>
                  <div className="text-base font-semibold text-[#1a1c1c] group-hover:text-[#0049db] transition-colors">
                    {item.symbol}
                  </div>
                  <div className="text-xs text-[#6A6D78] flex items-center gap-1.5 mt-0.5">
                    <span>{item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    <span
                      className={`inline-flex items-center text-[11px] font-semibold px-1.5 py-0.2 rounded ${
                        isPos ? 'text-[#089981] bg-[#089981]/10' : 'text-[#F23645] bg-[#F23645]/10'
                      }`}
                    >
                      {isPos ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                      {isPos ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Sparkline */}
              <div className="hidden sm:block pl-2">
                <SparklineChart data={item.sparkline} isPositive={isPos} width={80} height={28} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
