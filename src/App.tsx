import React, { useState, useEffect, useCallback } from 'react';
import { MarketItem, MarketCategory, PaperPosition } from './types';
import { INITIAL_MARKET_DATA } from './data/marketData';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { IndicesSection } from './components/IndicesSection';
import { WorldIndicesTable } from './components/WorldIndicesTable';
import { StocksSection } from './components/StocksSection';
import { OtherCategoriesSection } from './components/OtherCategoriesSection';
import { MarketDetailModal } from './components/MarketDetailModal';
import { SearchModal } from './components/SearchModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { Footer } from './components/Footer';

export default function App() {
  const [marketItems, setMarketItems] = useState<MarketItem[]>(INITIAL_MARKET_DATA);
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory>('Indices');
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(true);

  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('precision_markets_watchlist');
      return saved ? JSON.parse(saved) : ['sp500', 'nvda', 'btcusd'];
    } catch {
      return ['sp500', 'nvda', 'btcusd'];
    }
  });

  const [paperPositions, setPaperPositions] = useState<PaperPosition[]>([]);
  const [updatedItemIds, setUpdatedItemIds] = useState<Set<string>>(new Set());

  // Save watchlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('precision_markets_watchlist', JSON.stringify(watchlistIds));
    } catch {
      // ignore
    }
  }, [watchlistIds]);

  // Keyboard shortcut Ctrl+K / Cmd+K for search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Live Price Tick Simulation
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Randomly pick 2-4 symbols to tick
      const count = Math.floor(Math.random() * 3) + 2;
      const changedIds = new Set<string>();

      setMarketItems((prevItems) =>
        prevItems.map((item) => {
          if (Math.random() < count / prevItems.length) {
            changedIds.add(item.id);
            const deltaPercent = (Math.random() - 0.49) * 0.006;
            const newPrice = Number((item.price * (1 + deltaPercent)).toFixed(item.price < 10 ? 4 : 2));
            const newChange = newPrice - (item.price - item.change);
            const newChangePercent = (newChange / (item.price - item.change)) * 100;

            const newSparkline = [...item.sparkline.slice(1), newPrice];
            const newHistory = [...item.history.slice(1), {
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              price: newPrice
            }];

            return {
              ...item,
              price: newPrice,
              change: newChange,
              changePercent: newChangePercent,
              sparkline: newSparkline,
              history: newHistory
            };
          }
          return item;
        })
      );

      setUpdatedItemIds(changedIds);

      // Clear highlights after 1s
      setTimeout(() => setUpdatedItemIds(new Set()), 1000);
    }, 2500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const toggleWatchlist = useCallback((itemId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWatchlistIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  }, []);

  const handleAddPaperTrade = useCallback((trade: PaperPosition) => {
    setPaperPositions((prev) => [trade, ...prev]);
  }, []);

  const watchlistSet = new Set(watchlistIds);
  const watchlistItems = marketItems.filter((i) => watchlistSet.has(i.id));

  // Filtered lists
  const indicesList = marketItems.filter((i) => i.category === 'Indices');
  const stocksList = marketItems.filter((i) => i.category === 'Stocks');
  const activeCategoryList = marketItems.filter((i) => i.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9] text-[#1a1c1c] pt-14 selection:bg-[#0049db]/20 selection:text-[#0049db]">
      {/* Top Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        watchlistCount={watchlistIds.length}
        isSimulating={isSimulating}
        onToggleSimulation={() => setIsSimulating(!isSimulating)}
      />

      {/* Category Nav Header */}
      <CategoryNav
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 pt-8">
        {selectedCategory === 'Indices' ? (
          <>
            {/* Top Indices Cards (S&P 500, Nasdaq 100, Dow 30) */}
            <IndicesSection
              indices={indicesList}
              onSelectItem={setSelectedItem}
              onSeeMore={() => setSelectedCategory('Indices')}
              updatedItemIds={updatedItemIds}
            />

            {/* World Indices Table */}
            <WorldIndicesTable
              indices={indicesList}
              onSelectItem={setSelectedItem}
              onToggleWatchlist={toggleWatchlist}
              watchlistSet={watchlistSet}
              updatedItemIds={updatedItemIds}
            />

            {/* US Stocks Section */}
            <StocksSection
              stocks={stocksList}
              onSelectItem={setSelectedItem}
              onSeeMore={() => setSelectedCategory('Stocks')}
              updatedItemIds={updatedItemIds}
            />
          </>
        ) : (
          /* Dedicated Category Table/Grid when selecting Stocks, Crypto, Forex, Futures, Bonds */
          <OtherCategoriesSection
            category={selectedCategory}
            items={activeCategoryList}
            onSelectItem={setSelectedItem}
            onToggleWatchlist={toggleWatchlist}
            watchlistSet={watchlistSet}
            updatedItemIds={updatedItemIds}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Detail Modal */}
      <MarketDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        isBookmarked={selectedItem ? watchlistSet.has(selectedItem.id) : false}
        onToggleWatchlist={toggleWatchlist}
        onAddPaperTrade={handleAddPaperTrade}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        items={marketItems}
        onSelectItem={(item) => {
          setSelectedItem(item);
          setIsSearchOpen(false);
        }}
      />

      {/* Watchlist Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistItems={watchlistItems}
        onRemoveFromWatchlist={toggleWatchlist}
        onSelectItem={(item) => {
          setSelectedItem(item);
          setIsWatchlistOpen(false);
        }}
        paperPositions={paperPositions}
      />
    </div>
  );
}
