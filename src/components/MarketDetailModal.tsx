import React, { useState } from 'react';
import { MarketItem, PaperPosition } from '../types';
import { X, Bookmark, TrendingUp, TrendingDown, DollarSign, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';

interface MarketDetailModalProps {
  item: MarketItem | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleWatchlist: (itemId: string) => void;
  onAddPaperTrade?: (trade: PaperPosition) => void;
}

type Timeframe = '1D' | '1W' | '1M' | '1Y' | 'ALL';
type ChartType = 'line' | 'candlestick';

export const MarketDetailModal: React.FC<MarketDetailModalProps> = ({
  item,
  onClose,
  isBookmarked,
  onToggleWatchlist,
  onAddPaperTrade
}) => {
  if (!item) return null;

  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [tradeShares, setTradeShares] = useState<number>(10);
  const [tradeMessage, setTradeMessage] = useState<string | null>(null);

  const isPos = item.change >= 0;

  // Filter or scale history based on timeframe
  const rawHistory = item.history;
  const history = rawHistory.length > 0 ? rawHistory : [
    { time: '09:30', price: item.price * 0.99 },
    { time: '11:00', price: item.price * 1.005 },
    { time: '13:00', price: item.price * 0.998 },
    { time: '15:00', price: item.price * 1.01 },
    { time: '16:00', price: item.price }
  ];

  // Chart SVG bounds
  const prices = history.map((h) => h.price);
  const minPrice = Math.min(...prices) * 0.998;
  const maxPrice = Math.max(...prices) * 1.002;
  const priceRange = maxPrice - minPrice || 1;

  const chartWidth = 600;
  const chartHeight = 220;

  const pointsString = history
    .map((h, i) => {
      const x = (i / (history.length - 1)) * chartWidth;
      const y = chartHeight - ((h.price - minPrice) / priceRange) * (chartHeight - 20) - 10;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  // Gradient area
  const areaPoints = `0,${chartHeight} ${pointsString} ${chartWidth},${chartHeight}`;

  const strokeColor = isPos ? '#089981' : '#F23645';

  const handleExecuteTrade = (type: 'BUY' | 'SELL') => {
    if (!tradeShares || tradeShares <= 0) return;
    if (onAddPaperTrade) {
      onAddPaperTrade({
        symbol: item.symbol,
        type,
        shares: tradeShares,
        entryPrice: item.price,
        timestamp: Date.now()
      });
    }
    setTradeMessage(`Executed ${type} order for ${tradeShares} shares of ${item.symbol} at $${item.price.toFixed(2)}`);
    setTimeout(() => setTradeMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-[#F0F3FA] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto text-[#1a1c1c] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#F0F3FA] flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            {item.badge && (
              <div
                className={`w-9 h-9 rounded-full ${
                  item.badge === '500' ? 'bg-[#F23645]' : 'bg-[#0049db]'
                } text-white font-bold text-xs flex items-center justify-center shrink-0`}
              >
                {item.badge}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1a1c1c]">{item.symbol}</h2>
                <span className="text-xs font-semibold bg-[#f3f3f4] text-[#5a5e6b] px-2 py-0.5 rounded">
                  {item.exchange}
                </span>
              </div>
              <p className="text-xs text-[#6A6D78] font-medium">{item.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWatchlist(item.id)}
              className={`p-2 rounded-full border border-[#e2e2e2] hover:bg-[#f3f3f4] transition-colors cursor-pointer ${
                isBookmarked ? 'text-[#0049db] bg-[#0049db]/5 border-[#0049db]' : 'text-[#6A6D78]'
              }`}
              title={isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-[#6A6D78] hover:text-[#1a1c1c] hover:bg-[#f3f3f4] rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Price Overview */}
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#1a1c1c]">
              {item.currency === '$' || item.currency === 'USD' ? '$' : ''}
              {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              {item.currency === '%' ? '%' : ''}
            </span>

            <div
              className={`inline-flex items-center text-sm font-bold px-2.5 py-1 rounded-md ${
                isPos ? 'text-[#089981] bg-[#089981]/10' : 'text-[#F23645] bg-[#F23645]/10'
              }`}
            >
              {isPos ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {isPos ? '+' : ''}{item.change.toFixed(2)} ({isPos ? '+' : ''}{item.changePercent.toFixed(2)}%)
            </div>
          </div>

          {/* Chart Controls */}
          <div className="bg-[#f9f9f9] border border-[#F0F3FA] rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-1 bg-[#e8e8e8] p-1 rounded-lg">
                {(['1D', '1W', '1M', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      timeframe === tf ? 'bg-white text-[#0049db] shadow-2xs' : 'text-[#5a5e6b] hover:text-[#1a1c1c]'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 bg-[#e8e8e8] p-1 rounded-lg">
                <button
                  onClick={() => setChartType('line')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    chartType === 'line' ? 'bg-white text-[#0049db] shadow-2xs' : 'text-[#5a5e6b]'
                  }`}
                >
                  Line
                </button>
                <button
                  onClick={() => setChartType('candlestick')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    chartType === 'candlestick' ? 'bg-white text-[#0049db] shadow-2xs' : 'text-[#5a5e6b]'
                  }`}
                >
                  Candle
                </button>
              </div>
            </div>

            {/* Interactive SVG Chart */}
            <div className="w-full h-60 relative bg-white rounded-lg border border-[#F0F3FA] p-2 flex items-center justify-center overflow-hidden">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Gridlines */}
                <line x1="0" y1="40" x2={chartWidth} y2="40" stroke="#f0f0f0" strokeDasharray="3 3" />
                <line x1="0" y1="110" x2={chartWidth} y2="110" stroke="#f0f0f0" strokeDasharray="3 3" />
                <line x1="0" y1="180" x2={chartWidth} y2="180" stroke="#f0f0f0" strokeDasharray="3 3" />

                {chartType === 'line' ? (
                  <>
                    <polygon fill="url(#chartGrad)" points={areaPoints} />
                    <polyline
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={pointsString}
                    />
                  </>
                ) : (
                  // Simplified Candlestick chart simulation
                  history.map((h, idx) => {
                    const x = (idx / (history.length - 1)) * (chartWidth - 40) + 20;
                    const prevPrice = idx > 0 ? history[idx - 1].price : h.price * 0.998;
                    const candleIsUp = h.price >= prevPrice;
                    const candleColor = candleIsUp ? '#089981' : '#F23645';

                    const highY = chartHeight - ((Math.max(h.price, prevPrice) * 1.001 - minPrice) / priceRange) * (chartHeight - 30) - 15;
                    const lowY = chartHeight - ((Math.min(h.price, prevPrice) * 0.999 - minPrice) / priceRange) * (chartHeight - 30) - 15;
                    const openY = chartHeight - ((prevPrice - minPrice) / priceRange) * (chartHeight - 30) - 15;
                    const closeY = chartHeight - ((h.price - minPrice) / priceRange) * (chartHeight - 30) - 15;

                    const bodyTop = Math.min(openY, closeY);
                    const bodyHeight = Math.max(Math.abs(closeY - openY), 4);

                    return (
                      <g key={idx}>
                        <line x1={x} y1={highY} x2={x} y2={lowY} stroke={candleColor} strokeWidth="1.5" />
                        <rect
                          x={x - 4}
                          y={bodyTop}
                          width={8}
                          height={bodyHeight}
                          fill={candleColor}
                          rx={1}
                        />
                      </g>
                    );
                  })
                )}
              </svg>
            </div>
          </div>

          {/* Key Financial Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#f3f3f4] p-3 rounded-lg">
              <span className="text-[11px] font-bold text-[#6A6D78] uppercase">24h High</span>
              <p className="text-sm font-bold text-[#1a1c1c] mt-0.5">${item.high24h.toLocaleString()}</p>
            </div>

            <div className="bg-[#f3f3f4] p-3 rounded-lg">
              <span className="text-[11px] font-bold text-[#6A6D78] uppercase">24h Low</span>
              <p className="text-sm font-bold text-[#1a1c1c] mt-0.5">${item.low24h.toLocaleString()}</p>
            </div>

            <div className="bg-[#f3f3f4] p-3 rounded-lg">
              <span className="text-[11px] font-bold text-[#6A6D78] uppercase">Volume</span>
              <p className="text-sm font-bold text-[#1a1c1c] mt-0.5">{item.volume}</p>
            </div>

            <div className="bg-[#f3f3f4] p-3 rounded-lg">
              <span className="text-[11px] font-bold text-[#6A6D78] uppercase">Market Cap</span>
              <p className="text-sm font-bold text-[#1a1c1c] mt-0.5">{item.marketCap || 'N/A'}</p>
            </div>
          </div>

          {/* Technical Analysis Gauge & Paper Trading Simulator */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Technical Technical Gauge */}
            <div className="bg-white border border-[#F0F3FA] rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase text-[#6A6D78] flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#0049db]" /> Technical Outlook
                </span>
                <span className="text-xs font-semibold text-[#089981] bg-[#089981]/10 px-2 py-0.5 rounded">
                  BUY
                </span>
              </div>
              <p className="text-xs text-[#5a5e6b] mb-3">
                Based on 26 technical indicators moving averages & oscillators.
              </p>
              {/* Gauge Meter bar */}
              <div className="space-y-1.5">
                <div className="h-2.5 w-full bg-[#e8e8e8] rounded-full overflow-hidden flex">
                  <div className="w-[15%] bg-[#F23645]" title="Strong Sell" />
                  <div className="w-[15%] bg-[#F23645]/60" title="Sell" />
                  <div className="w-[20%] bg-[#5a5e6b]" title="Neutral" />
                  <div className="w-[30%] bg-[#089981]/70" title="Buy" />
                  <div className="w-[20%] bg-[#089981]" title="Strong Buy" />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-[#6A6D78]">
                  <span>Sell</span>
                  <span>Neutral</span>
                  <span className="text-[#089981]">Strong Buy</span>
                </div>
              </div>
            </div>

            {/* Paper Trading Execution Simulator */}
            <div className="bg-white border border-[#F0F3FA] rounded-xl p-4 shadow-2xs">
              <span className="text-xs font-bold uppercase text-[#6A6D78] flex items-center gap-1.5 mb-2">
                <DollarSign className="w-4 h-4 text-[#0049db]" /> Paper Trade Simulator
              </span>

              {tradeMessage && (
                <div className="mb-2 p-2 bg-[#089981]/10 border border-[#089981]/30 text-[#089981] text-xs font-semibold rounded flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{tradeMessage}</span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-3">
                <label className="text-xs font-medium text-[#5a5e6b]">Qty:</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={tradeShares}
                  onChange={(e) => setTradeShares(Number(e.target.value))}
                  className="w-24 px-2.5 py-1 text-xs border border-[#c3c5d8] rounded-md focus:border-[#0049db] focus:outline-none"
                />
                <span className="text-xs text-[#6A6D78]">
                  Est. Total: <strong>${(tradeShares * item.price).toFixed(2)}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleExecuteTrade('BUY')}
                  className="bg-[#089981] hover:bg-[#07826d] text-white text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer"
                >
                  BUY {item.symbol}
                </button>
                <button
                  onClick={() => handleExecuteTrade('SELL')}
                  className="bg-[#F23645] hover:bg-[#d92c3a] text-white text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer"
                >
                  SELL {item.symbol}
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <div className="border-t border-[#F0F3FA] pt-4">
              <h4 className="text-xs font-bold uppercase text-[#6A6D78] mb-1">About {item.name}</h4>
              <p className="text-xs text-[#5a5e6b] leading-relaxed">{item.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
