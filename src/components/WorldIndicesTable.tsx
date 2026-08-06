import React, { useState } from 'react';
import { MarketItem } from '../types';
import { SparklineChart } from './SparklineChart';
import { Bookmark, ChevronDown, ChevronUp } from 'lucide-react';

interface WorldIndicesTableProps {
  indices: MarketItem[];
  onSelectItem: (item: MarketItem) => void;
  onToggleWatchlist: (itemId: string, e: React.MouseEvent) => void;
  watchlistSet: Set<string>;
  updatedItemIds: Set<string>;
}

export const WorldIndicesTable: React.FC<WorldIndicesTableProps> = ({
  indices,
  onSelectItem,
  onToggleWatchlist,
  watchlistSet,
  updatedItemIds
}) => {
  const [showAll, setShowAll] = useState(false);

  // Exclude badge items if we want, or list all world indices
  const worldIndices = indices.filter((i) => !i.badge || showAll);
  const displayedIndices = showAll ? indices : worldIndices.slice(0, 4);

  return (
    <section className="mb-10">
      <h3 className="text-lg font-semibold text-[#1a1c1c] mb-3">World indices</h3>
      <div className="bg-white border border-[#F0F3FA] rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-[#F0F3FA] bg-[#f3f3f4] h-10">
                <th className="px-4 text-xs font-bold uppercase tracking-wider text-[#6A6D78]">Symbol</th>
                <th className="px-4 text-xs font-bold uppercase tracking-wider text-[#6A6D78]">Name</th>
                <th className="px-4 text-xs font-bold uppercase tracking-wider text-[#6A6D78] text-right">Last</th>
                <th className="px-4 text-xs font-bold uppercase tracking-wider text-[#6A6D78] text-right">Change %</th>
                <th className="px-4 text-xs font-bold uppercase tracking-wider text-[#6A6D78] text-center hidden md:table-cell">Trend</th>
                <th className="px-3 text-xs font-bold uppercase tracking-wider text-[#6A6D78] text-center w-12"></th>
              </tr>
            </thead>
            <tbody className="text-sm text-[#1a1c1c] divide-y divide-[#F0F3FA]">
              {displayedIndices.map((item, idx) => {
                const isPos = item.change >= 0;
                const isBookmarked = watchlistSet.has(item.id);
                const isUpdated = updatedItemIds.has(item.id);
                const isAlt = idx % 2 === 1;

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className={`h-11 transition-colors hover:bg-[#f3f3f4] cursor-pointer ${
                      isAlt ? 'bg-[#f9f9f9]' : 'bg-white'
                    } ${isUpdated ? (isPos ? 'flash-up' : 'flash-down') : ''}`}
                  >
                    <td className="px-4 font-semibold text-[#0049db] whitespace-nowrap">
                      {item.symbol}
                    </td>
                    <td className="px-4 text-[#5a5e6b] truncate max-w-[200px] sm:max-w-xs">
                      {item.name}
                    </td>
                    <td className="px-4 text-right font-medium whitespace-nowrap">
                      {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </td>
                    <td className="px-4 text-right whitespace-nowrap font-semibold">
                      <span className={isPos ? 'text-[#089981]' : 'text-[#F23645]'}>
                        {isPos ? '+' : ''}{item.changePercent.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-4 text-center hidden md:table-cell align-middle">
                      <div className="flex justify-center">
                        <SparklineChart data={item.sparkline} isPositive={isPos} width={70} height={20} />
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

        <div className="p-3 text-center border-t border-[#F0F3FA] bg-white">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-semibold text-[#0049db] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            {showAll ? (
              <>
                Show fewer indices <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                See all major indices <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
