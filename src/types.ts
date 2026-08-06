export type MarketCategory = 'Indices' | 'Stocks' | 'Crypto' | 'Forex' | 'Futures' | 'Bonds';

export interface PricePoint {
  time: string;
  price: number;
}

export interface MarketItem {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  category: MarketCategory;
  badge?: string; // e.g. "500" for S&P 500, "100" for Nasdaq 100, "30" for Dow 30
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  high24h: number;
  low24h: number;
  volume: string;
  marketCap?: string;
  peRatio?: number;
  sparkline: number[];
  history: PricePoint[];
  description?: string;
  isPopular?: boolean;
  sector?: string;
}

export interface WatchlistItem {
  id: string;
  addedAt: number;
}

export interface PaperPosition {
  symbol: string;
  type: 'BUY' | 'SELL';
  shares: number;
  entryPrice: number;
  timestamp: number;
}
