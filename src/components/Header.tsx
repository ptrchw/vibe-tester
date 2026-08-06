import React from 'react';
import { Search, Globe, User, Bookmark, Radio, Play, Pause } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenWatchlist: () => void;
  watchlistCount: number;
  isSimulating: boolean;
  onToggleSimulation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenWatchlist,
  watchlistCount,
  isSimulating,
  onToggleSimulation
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-40 flex items-center justify-between px-4 sm:px-6 h-14 bg-white border-b border-[#F0F3FA] shadow-xs">
      <div className="flex items-center gap-6">
        <a href="#" className="text-xl font-bold tracking-tight text-[#1a1c1c] flex items-center gap-1 hover:opacity-90 transition-opacity">
          <span>TradingView</span>
        </a>

        {/* Quick Search trigger */}
        <button
          onClick={onOpenSearch}
          className="hidden md:flex items-center bg-[#f3f3f4] hover:bg-[#e8e8e8] rounded-full px-3.5 py-1.5 border border-transparent transition-all cursor-pointer text-left"
        >
          <Search className="w-4 h-4 text-[#6A6D78] mr-2" />
          <span className="text-xs text-[#6A6D78] w-40 truncate">Search (Ctrl+K)</span>
          <kbd className="hidden lg:inline-block text-[10px] bg-white text-[#6A6D78] px-1.5 py-0.5 rounded border border-[#e2e2e2] ml-2 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Main Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <a href="#" className="text-[#5a5e6b] hover:text-[#0049db] transition-colors py-1">
            Products
          </a>
          <a href="#" className="text-[#5a5e6b] hover:text-[#0049db] transition-colors py-1">
            Community
          </a>
          <a href="#" className="text-[#0049db] border-b-2 border-[#0049db] font-semibold py-3.5 mt-0.5">
            Markets
          </a>
          <a href="#" className="text-[#5a5e6b] hover:text-[#0049db] transition-colors py-1">
            Brokers
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {/* Live Simulation Play/Pause */}
        <button
          onClick={onToggleSimulation}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
            isSimulating
              ? 'bg-[#089981]/10 text-[#089981] border border-[#089981]/30 hover:bg-[#089981]/20'
              : 'bg-[#5a5e6b]/10 text-[#5a5e6b] hover:bg-[#5a5e6b]/20'
          }`}
          title={isSimulating ? 'Pause live price updates' : 'Start live price updates'}
        >
          <Radio className={`w-3.5 h-3.5 ${isSimulating ? 'animate-pulse text-[#089981]' : ''}`} />
          <span className="hidden sm:inline">{isSimulating ? 'LIVE TICK' : 'PAUSED'}</span>
          {isSimulating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </button>

        {/* Watchlist button */}
        <button
          onClick={onOpenWatchlist}
          className="relative flex items-center justify-center p-2 text-[#5a5e6b] hover:text-[#1a1c1c] hover:bg-[#f3f3f4] rounded-full transition-colors cursor-pointer"
          title="Open Watchlist"
        >
          <Bookmark className="w-4 h-4" />
          {watchlistCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#0049db] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {watchlistCount}
            </span>
          )}
        </button>

        {/* Language */}
        <div className="hidden sm:flex items-center gap-1 text-[#5a5e6b] hover:text-[#1a1c1c] cursor-pointer text-xs font-medium px-2 py-1 rounded hover:bg-[#f3f3f4] transition-colors">
          <Globe className="w-4 h-4" />
          <span>EN</span>
        </div>

        {/* User Profile */}
        <button className="text-[#5a5e6b] hover:text-[#1a1c1c] p-1.5 rounded-full hover:bg-[#f3f3f4] transition-colors cursor-pointer">
          <User className="w-4 h-4" />
        </button>

        {/* CTA */}
        <button className="bg-[#0049db] hover:bg-[#003ab3] text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors cursor-pointer">
          Get started
        </button>
      </div>
    </header>
  );
};
