import React, { useState, useEffect, useRef } from 'react';
import { MarketItem } from '../types';
import { Search, X, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MarketItem[];
  onSelectItem: (item: MarketItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  items,
  onSelectItem
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredItems = items.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.symbol.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.exchange.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        onSelectItem(filteredItems[selectedIndex]);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-black/50 backdrop-blur-xs p-3">
      <div
        className="bg-white border border-[#F0F3FA] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200"
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="p-3.5 border-b border-[#F0F3FA] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#6A6D78] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search symbol, index, stock, crypto, forex... (e.g. NVDA, S&P 500, BTC)"
            className="w-full text-sm font-medium bg-transparent border-none outline-none text-[#1a1c1c] placeholder:text-[#6A6D78]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#6A6D78] hover:text-[#1a1c1c] p-1 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold text-[#5a5e6b] hover:text-[#1a1c1c] px-2 py-1 rounded bg-[#f3f3f4] cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-[#F0F3FA]">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#6A6D78]">
              No markets found matching &quot;{query}&quot;
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const isPos = item.change >= 0;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectItem(item);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 sm:px-4 flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#0049db]/5 border-l-4 border-l-[#0049db]' : 'hover:bg-[#f9f9f9]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold text-[#0049db] bg-[#0049db]/10 px-2 py-0.5 rounded w-16 text-center shrink-0">
                      {item.symbol}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-[#1a1c1c]">{item.name}</div>
                      <div className="text-[11px] text-[#6A6D78]">
                        {item.exchange} • {item.category}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-[#1a1c1c]">
                      ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </div>
                    <div
                      className={`text-[11px] font-semibold inline-flex items-center justify-end ${
                        isPos ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isPos ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                      {isPos ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Keyboard hint footer */}
        <div className="p-2.5 bg-[#f3f3f4] border-t border-[#F0F3FA] flex items-center justify-between text-[11px] text-[#6A6D78]">
          <span>Use <kbd className="bg-white px-1 rounded border border-[#c3c5d8]">↑</kbd> <kbd className="bg-white px-1 rounded border border-[#c3c5d8]">↓</kbd> to navigate</span>
          <span>Press <kbd className="bg-white px-1 rounded border border-[#c3c5d8]">Enter</kbd> to select</span>
        </div>
      </div>
    </div>
  );
};
