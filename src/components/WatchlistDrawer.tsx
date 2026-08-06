import React, { useState } from 'react';
import { MarketItem, PaperPosition } from '../types';
import { X, Trash2, Bookmark, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistItems: MarketItem[];
  onRemoveFromWatchlist: (itemId: string) => void;
  onSelectItem: (item: MarketItem) => void;
  paperPositions: PaperPosition[];
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlistItems,
  onRemoveFromWatchlist,
  onSelectItem,
  paperPositions
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'watchlist' | 'portfolio'>('watchlist');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#F0F3FA] shadow-2xl flex flex-col text-[#1a1c1c] animate-in slide-in-from-right duration-200">
          {/* Drawer Header */}
          <div className="p-4 border-b border-[#F0F3FA] flex items-center justify-between">
            <div className="flex items-center gap-1 bg-[#f3f3f4] p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('watchlist')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  activeTab === 'watchlist' ? 'bg-white text-[#0049db] shadow-2xs' : 'text-[#5a5e6b]'
                }`}
              >
                Watchlist ({watchlistItems.length})
              </button>
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  activeTab === 'portfolio' ? 'bg-white text-[#0049db] shadow-2xs' : 'text-[#5a5e6b]'
                }`}
              >
                Paper Trades ({paperPositions.length})
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#6A6D78] hover:text-[#1a1c1c] hover:bg-[#f3f3f4] rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeTab === 'watchlist' ? (
              watchlistItems.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-3">
                  <Bookmark className="w-10 h-10 text-[#c3c5d8] mx-auto" />
                  <p className="text-sm font-semibold text-[#1a1c1c]">Your Watchlist is empty</p>
                  <p className="text-xs text-[#6A6D78]">
                    Click the bookmark icon on any symbol card or row to pin it here for quick tracking.
                  </p>
                </div>
              ) : (
                watchlistItems.map((item) => {
                  const isPos = item.change >= 0;

                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectItem(item)}
                      className="p-3 bg-[#f9f9f9] border border-[#F0F3FA] rounded-xl flex items-center justify-between hover:bg-[#f3f3f4] transition-colors cursor-pointer group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#1a1c1c] group-hover:text-[#0049db] transition-colors">
                            {item.symbol}
                          </span>
                          <span className="text-[10px] text-[#6A6D78] font-semibold bg-[#e8e8e8] px-1.5 py-0.2 rounded">
                            {item.exchange}
                          </span>
                        </div>
                        <span className="text-xs text-[#5a5e6b] truncate max-w-[180px] block">
                          {item.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-bold text-[#1a1c1c]">
                            ${item.price.toFixed(2)}
                          </div>
                          <div className={`text-[11px] font-semibold ${isPos ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                            {isPos ? '+' : ''}{item.changePercent.toFixed(2)}%
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFromWatchlist(item.id);
                          }}
                          className="text-[#6A6D78] hover:text-[#F23645] p-1.5 rounded hover:bg-white transition-colors cursor-pointer"
                          title="Remove from Watchlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )
            ) : paperPositions.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-3">
                <DollarSign className="w-10 h-10 text-[#c3c5d8] mx-auto" />
                <p className="text-sm font-semibold text-[#1a1c1c]">No Open Paper Positions</p>
                <p className="text-xs text-[#6A6D78]">
                  Select any stock or index to simulate buying or selling shares without real money risk.
                </p>
              </div>
            ) : (
              paperPositions.map((pos, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#f9f9f9] border border-[#F0F3FA] rounded-xl flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded text-white ${
                          pos.type === 'BUY' ? 'bg-[#089981]' : 'bg-[#F23645]'
                        }`}
                      >
                        {pos.type}
                      </span>
                      <span className="text-sm font-bold text-[#1a1c1c]">{pos.symbol}</span>
                    </div>
                    <span className="text-xs text-[#6A6D78]">
                      {pos.shares} shares @ ${pos.entryPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-[#1a1c1c]">
                      ${(pos.shares * pos.entryPrice).toFixed(2)}
                    </span>
                    <span className="block text-[10px] text-[#6A6D78]">
                      {new Date(pos.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
