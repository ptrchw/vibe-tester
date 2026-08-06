import React from 'react';
import { MarketItem, MarketCategory } from '../types';
import { SparklineChart } from './SparklineChart';
import { Bookmark, TrendingUp, TrendingDown } from 'lucide-react';

interface OtherCategoriesSectionProps {
  category: MarketCategory;
  items: MarketItem[];
  onSelectItem: (item: MarketItem) => void;
  onToggleWatchlist: (itemId: string, e: React.MouseEvent) => void;
  watchlistSet: Set<string>;
  updatedItemIds: Set<string>;
}

export const OtherCategoriesSection: React.FC<OtherCategoriesSectionProps> = ({
  category,
  items,
  onSelectItem,
  onToggleWatchlist,
  watchlistSet,
  updatedItemIds
}) => {
  if (items.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1a1c1c]">
          {category}
        </h2>
        <span className="text-xs text-[#6A6D78] font-medium">
          {items.length} markets active
        </span>
      </div>

      <div className="bg-white border border-[#F0F3FA] rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[550px]">
            <thead>
              <tr className="border-b border-[#F0F3FA] bg-[#f3f3f4] h-10">
                <th className="px-4 text-xs font-bold uppercase tracking-wider text-[#6A6D78]">Symbol</th>
                <th className="px-4 text-xs font-bold uppercase tracking-wider text-[#6A6D78]">Name</th>
                <th className="px-4 text-xs font-bold uppercase tracking-wider text-[#6A6D78] text-right">Price</th>
                <th className="px-4 text-xs font-bold uppercase tracking-wider text-[#6A6D78] text-right">24h Change</th>
                <th className="px-4 text-xs font-bold uppercase tracking-wider text-[#6A6D78] text-right hidden sm:table-cell">24h High / Low</th>
                <th className="px-4 text-xs font-bold uppercase tracking-wider text-[#6A6D78] text-center hidden md:table-cell">Sparkline</th>
                <th className="px-3 text-xs font-bold uppercase tracking-wider text-[#6A6D78] text-center w-12"></th>
              </tr>
            </thead>
            <tbody className="text-sm text-[#1a1c1c] divide-y divide-[#F0F3FA]">
              {items.map((item, idx) => {
                const isPos = item.change >= 0;
                const isBookmarked = watchlistSet.has(item.id);
                const isUpdated = updatedItemIds.has(item.id);
                const isAlt = idx % 2 === 1;

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className={`h-12 transition-colors hover:bg-[#f3f3f4] cursor-pointer ${
                      isAlt ? 'bg-[#f9f9f9]' : 'bg-white'
                    } ${isUpdated ? (isPos ? 'flash-up' : 'flash-down') : ''}`}
                  >
                    <td className="px-4 font-bold text-[#0049db] whitespace-nowrap">
                      {item.symbol}
                    </td>
                    <td className="px-4 text-[#5a5e6b] font-medium truncate max-w-[220px]">
                      {item.name}
                    </td>
                    <td className="px-4 text-right font-semibold whitespace-nowrap">
                      {item.currency === '$' || item.currency === 'USD' ? '$' : ''}
                      {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                      {item.currency === '%' ? '%' : ''}
                    </td>
                    <td className="px-4 text-right whitespace-nowrap">
                      <span
                        className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded ${
                          isPos ? 'text-[#089981] bg-[#089981]/10' : 'text-[#F23645] bg-[#F23645]/10'
                        }`}
                      >
                        {isPos ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {isPos ? '+' : ''}{item.changePercent.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-4 text-right text-xs text-[#6A6D78] whitespace-nowrap hidden sm:table-cell">
                      <span>{item.high24h.toLocaleString()}</span> / <span className="text-[#6A6D78]">{item.low24h.toLocaleString()}</span>
                    </td>
                    <td className="px-4 text-center hidden md:table-cell align-middle">
                      <div className="flex justify-center">
                        <SparklineChart data={item.sparkline} isPositive={isPos} width={75} height={22} />
                      </div>
                    </td>
                    <td className="px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => onToggleWatchlist(item.id, e)}
                        className={`p-1 rounded hover:bg-[#e8e8e8] transition-colors cursor-pointer ${
                          isBookmarked ? 'text-[#0049db]' : 'text-[#6A6D78] hover:text-[#1a1c1c]'
                        }`}
                        title={isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
