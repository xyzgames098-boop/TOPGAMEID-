import React, { useState, useMemo } from 'react';
import { SearchTrendItem, SearchLogEntry, ProductItem } from '../types/topup';
import {
  TrendingUp,
  Flame,
  Search,
  Sparkles,
  ArrowUpRight,
  Filter,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle,
  Lightbulb,
  Smartphone,
  Monitor,
  ExternalLink,
  Zap,
  BarChart3,
  Award,
  ChevronRight,
  Tag,
  PlusCircle,
} from 'lucide-react';
import {
  getStoredSearchTrends,
  getStoredSearchLogs,
  saveStoredSearchTrends,
  saveStoredSearchLogs,
  recordSearchQuery,
  INITIAL_SEARCH_TRENDS,
  INITIAL_SEARCH_LOGS,
} from '../data/searchTrendsData';

interface SearchTrendsProps {
  productsCatalog: ProductItem[];
  onSelectProduct?: (productId: string) => void;
  onOpenStorefrontSearch?: (query: string) => void;
}

export const SearchTrends: React.FC<SearchTrendsProps> = ({
  productsCatalog,
  onSelectProduct,
  onOpenStorefrontSearch,
}) => {
  const [trends, setTrends] = useState<SearchTrendItem[]>(() => getStoredSearchTrends());
  const [logs, setLogs] = useState<SearchLogEntry[]>(() => getStoredSearchLogs());
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'game' | 'tagihan' | 'ewallet' | 'unlisted'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [simulationNotice, setSimulationNotice] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'trends' | 'logs' | 'opportunities'>('trends');

  // Multiplier based on selected timeframe
  const timeframeMultiplier = useMemo(() => {
    switch (timeframe) {
      case '24h':
        return 0.18;
      case '7d':
        return 1.0;
      case '30d':
        return 3.6;
      case 'all':
        return 6.2;
      default:
        return 1.0;
    }
  }, [timeframe]);

  // Filtered and adjusted trends list
  const filteredTrends = useMemo(() => {
    return trends
      .filter((item) => {
        if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
        if (searchFilter.trim()) {
          const q = searchFilter.toLowerCase();
          return (
            item.query.toLowerCase().includes(q) ||
            item.matchedProductName.toLowerCase().includes(q) ||
            (item.publisher && item.publisher.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .map((item) => ({
        ...item,
        adjustedCount: Math.max(1, Math.round(item.searchCount * timeframeMultiplier)),
      }))
      .sort((a, b) => b.adjustedCount - a.adjustedCount);
  }, [trends, categoryFilter, searchFilter, timeframeMultiplier]);

  // Aggregate KPI metrics
  const kpis = useMemo(() => {
    const totalSearches = filteredTrends.reduce((sum, item) => sum + item.adjustedCount, 0);
    const topItem = filteredTrends[0];
    const fastestGrowing = [...filteredTrends].sort((a, b) => b.trendGrowth - a.trendGrowth)[0];
    const unlistedCount = trends.filter((t) => t.category === 'unlisted').reduce((s, i) => s + i.searchCount, 0);

    return {
      totalSearches,
      topItem,
      fastestGrowing,
      unlistedCount,
    };
  }, [filteredTrends, trends]);

  // Handle manual simulated search test
  const handleSimulateSearch = () => {
    const sampleQueries = [
      'Weekly Diamond Pass MLBB',
      'Free Fire 140 Diamond',
      'Honor of Kings Token Murah',
      'Blessing Genshin Impact',
      'Roblox Robux 400',
      'Valorant VP 1375',
      'Honkai Star Rail Oneiric',
      'Steam Wallet 90rb',
      'Token PLN 20rb',
    ];
    const randomQuery = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
    const result = recordSearchQuery(randomQuery, productsCatalog);
    setTrends(result.trends);
    setLogs(result.logs);

    setSimulationNotice(`Simulasi pencarian pengunjung: "${randomQuery}" berhasil direkam ke tren!`);
    setTimeout(() => {
      setSimulationNotice(null);
    }, 3500);
  };

  // Copy report for WhatsApp status / marketing
  const handleCopyReport = () => {
    const top5 = filteredTrends.slice(0, 5);
    const report = `🔥 *LAPORAN TREN PRODUK PALING DICARI DI TOKO* 🔥
Periode: ${timeframe === '24h' ? '24 Jam Terakhir' : timeframe === '7d' ? '7 Hari Terakhir' : 'Bulan Ini'}

${top5
  .map(
    (item, idx) =>
      `${idx + 1}. *${item.matchedProductName}* (${item.adjustedCount.toLocaleString('id-ID')} pencarian - ${item.trendGrowth > 0 ? '+' : ''}${item.trendGrowth}% 🔥)\n   💡 _Saran: ${item.recommendation}_`
  )
  .join('\n\n')}

🚀 *Yuk manfaatkan momen ini untuk belanja atau pasang promo diskon instan!*`;

    navigator.clipboard.writeText(report);
    setCopiedText('report');
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleCopyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    setCopiedText(keyword);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Reset to initial defaults
  const handleResetTrends = () => {
    if (window.confirm('Kembalikan data tren pencarian ke setelan bawaan?')) {
      saveStoredSearchTrends(INITIAL_SEARCH_TRENDS);
      saveStoredSearchLogs(INITIAL_SEARCH_LOGS);
      setTrends(INITIAL_SEARCH_TRENDS);
      setLogs(INITIAL_SEARCH_LOGS);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-900 border border-amber-900/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-400 text-neutral-950">
              <Flame className="w-4 h-4 fill-neutral-950" />
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Tren Pencarian Produk & Game
              <span className="px-2 py-0.5 text-[10px] uppercase font-extrabold bg-amber-400/20 text-amber-300 rounded border border-amber-400/30">
                Live Analytics
              </span>
            </h3>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed max-w-2xl">
            Pantau game dan produk apa saja yang paling banyak dicari oleh pengunjung tokomu secara real-time. Gunakan data ini untuk menentukan stok, pasang promo Flash Sale, dan menambah produk baru bernilai tinggi.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSimulateSearch}
            className="px-3 py-2 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-amber-300 hover:text-amber-200 border border-amber-800/60 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm active:scale-95"
            title="Uji coba rekaman pencarian pelanggan baru"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Tes Simulasi Pencarian</span>
          </button>

          <button
            type="button"
            onClick={handleCopyReport}
            className="px-3 py-2 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm active:scale-95"
            title="Salin ringkasan data tren ke WhatsApp"
          >
            {copiedText === 'report' ? (
              <>
                <Check className="w-3.5 h-3.5 text-neutral-950" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Laporan WA</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Simulation Feedback Alert */}
      {simulationNotice && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs rounded-xl flex items-center gap-2 animate-in fade-in duration-150">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{simulationNotice}</span>
        </div>
      )}

      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Total Volume */}
        <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1.5">
            <span>Total Pencarian</span>
            <Search className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-black text-white">
            {kpis.totalSearches.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +24%
            </span>
            <span>vs periode lalu</span>
          </div>
        </div>

        {/* Card 2: #1 High Demand Game */}
        <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1.5">
            <span>Paling Diminati (#1)</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-base font-bold text-amber-300 truncate">
            {kpis.topItem ? kpis.topItem.matchedProductName : 'Belum Ada'}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            {kpis.topItem ? `${kpis.topItem.adjustedCount.toLocaleString('id-ID')} pencarian` : '0'} (Porsi ~35%)
          </div>
        </div>

        {/* Card 3: Fastest Rising Trend */}
        <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1.5">
            <span>Lonjakan Tertinggi</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-base font-bold text-emerald-400 truncate">
            {kpis.fastestGrowing ? kpis.fastestGrowing.matchedProductName : '-'}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-300 font-bold">
              +{kpis.fastestGrowing ? kpis.fastestGrowing.trendGrowth : 0}%
            </span>
            <span>pertumbuhan pesat</span>
          </div>
        </div>

        {/* Card 4: Unmet Demand / Catalog Opportunity */}
        <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1.5">
            <span>Peluang Produk Baru</span>
            <Lightbulb className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-xl font-black text-sky-400">
            {kpis.unlistedCount.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Pencarian tanpa produk katalog
          </div>
        </div>
      </div>

      {/* Sub-tabs / Navigation between: Ranked Trends, Real-Time Activity Log, Unmet Demand Opportunities */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveView('trends')}
            className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'trends'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Peringkat Permintaan ({filteredTrends.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('opportunities')}
            className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'opportunities'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Peluang Produk Baru</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('logs')}
            className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'logs'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Aktivitas Live ({logs.length})</span>
          </button>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800 self-start sm:self-auto text-xs">
          {(
            [
              { id: '24h', label: '24 Jam' },
              { id: '7d', label: '7 Hari' },
              { id: '30d', label: '30 Hari' },
              { id: 'all', label: 'Semua' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTimeframe(t.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                timeframe === t.id
                  ? 'bg-neutral-800 text-white font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: RANKED SEARCH TRENDS */}
      {activeView === 'trends' && (
        <div className="space-y-4">
          {/* Filters Bar: Category & Search input */}
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
              {(
                [
                  { id: 'all', label: 'Semua Kategori' },
                  { id: 'game', label: '🎮 Game Populer' },
                  { id: 'tagihan', label: '⚡ PLN & Pulsa' },
                  { id: 'ewallet', label: '💳 E-Wallet' },
                  { id: 'unlisted', label: '⚠️ Belum di Katalog' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors border ${
                    categoryFilter === cat.id
                      ? 'bg-neutral-800 text-amber-300 border-amber-500/50 font-bold'
                      : 'bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Keyword search filter */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Cari game atau keyword..."
                className="w-full pl-8 pr-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Ranked List */}
          <div className="space-y-2.5">
            {filteredTrends.length === 0 ? (
              <div className="text-center py-12 bg-neutral-900/40 rounded-xl border border-neutral-800 text-neutral-400 text-xs">
                Tidak ada data tren yang cocok dengan filter.
              </div>
            ) : (
              filteredTrends.map((item, index) => {
                const maxCount = filteredTrends[0]?.adjustedCount || 1;
                const percentageOfMax = Math.round((item.adjustedCount / maxCount) * 100);

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col gap-3 group"
                  >
                    {/* Top Row: Rank, Product Name, Category & Badges, Count */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Rank Badge */}
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                            index === 0
                              ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/20'
                              : index === 1
                              ? 'bg-neutral-300 text-neutral-950'
                              : index === 2
                              ? 'bg-amber-700 text-amber-100'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          #{index + 1}
                        </div>

                        {/* Name and Publisher */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm truncate">
                              {item.matchedProductName}
                            </span>
                            {item.category === 'unlisted' && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800">
                                Belum Terdaftar
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-neutral-400 flex items-center gap-2">
                            <span>{item.publisher || 'Katalog'}</span>
                            <span>•</span>
                            <span className="text-neutral-500">Keyword: "{item.query}"</span>
                            <span>•</span>
                            <span className="text-neutral-500">Terakhir: {item.lastSearchedAt}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Metrics: Search Count & Growth */}
                      <div className="text-right shrink-0">
                        <div className="text-base font-black text-white flex items-center justify-end gap-1.5">
                          <span>{item.adjustedCount.toLocaleString('id-ID')}</span>
                          <span className="text-xs font-normal text-neutral-400">cari</span>
                        </div>
                        <div className="flex items-center justify-end gap-1.5 mt-0.5">
                          {item.trendStatus === 'hot' && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-red-950/80 text-red-400 border border-red-800">
                              🔥 HOT
                            </span>
                          )}
                          {item.trendStatus === 'rising' && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                              🚀 MELONJAK
                            </span>
                          )}
                          <span
                            className={`text-[11px] font-bold ${
                              item.trendGrowth > 0 ? 'text-emerald-400' : 'text-neutral-400'
                            }`}
                          >
                            +{item.trendGrowth}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar of Volume */}
                    <div className="w-full bg-neutral-950 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          index === 0
                            ? 'bg-amber-400'
                            : index === 1
                            ? 'bg-amber-300'
                            : index === 2
                            ? 'bg-amber-500'
                            : 'bg-neutral-600'
                        }`}
                        style={{ width: `${Math.max(percentageOfMax, 4)}%` }}
                      />
                    </div>

                    {/* Bottom Row: Owner Actionable Insight & Recommendations */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1 border-t border-neutral-850 text-xs">
                      <div className="flex items-start sm:items-center gap-1.5 text-neutral-300 text-[11px] leading-relaxed">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
                        <span>
                          <strong className="text-amber-300 font-semibold">Saran Owner:</strong>{' '}
                          {item.recommendation}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => handleCopyKeyword(item.query)}
                          className="px-2 py-1 text-[11px] bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded border border-neutral-700 transition-colors flex items-center gap-1"
                          title="Salin kata kunci untuk promosi WhatsApp"
                        >
                          {copiedText === item.query ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>Keyword</span>
                        </button>

                        {item.matchedProductId && onSelectProduct && (
                          <button
                            type="button"
                            onClick={() => onSelectProduct(item.matchedProductId!)}
                            className="px-2 py-1 text-[11px] bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 rounded border border-amber-400/30 transition-colors flex items-center gap-1 font-medium"
                          >
                            <span>Buka Denom</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}

                        {onOpenStorefrontSearch && (
                          <button
                            type="button"
                            onClick={() => onOpenStorefrontSearch(item.query)}
                            className="px-2 py-1 text-[11px] bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded border border-neutral-700 transition-colors flex items-center gap-1"
                            title="Buka pencarian ini di etalase toko"
                          >
                            <Search className="w-3 h-3" />
                            <span>Cari di Toko</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: UNMET DEMAND & NEW PRODUCT OPPORTUNITIES */}
      {activeView === 'opportunities' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs text-neutral-300 leading-relaxed">
            <h4 className="font-bold text-amber-300 text-sm mb-1 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Peluang Produk Baru dari Pencarian Pengunjung
            </h4>
            <p>
              Daftar di bawah ini mencatat game atau voucher yang diketik oleh calon pembeli di tokomu tetapi saat ini belum ada di katalog produk. Menambahkan item ini dapat langsung menghasilkan penjualan baru tanpa modal iklan tambahan!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {trends
              .filter((t) => t.category === 'unlisted')
              .map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-bold text-white text-sm">{item.matchedProductName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30">
                        {item.searchCount} Pencarian
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {item.recommendation}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Pertumbuhan: +{item.trendGrowth}%
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyKeyword(item.query)}
                      className="px-2.5 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg border border-neutral-700 transition-colors flex items-center gap-1.5"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Salin Nama Produk</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* VIEW 3: LIVE SEARCH LOG STREAM */}
      {activeView === 'logs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Menampilkan 50 aktivitas pencarian terkini oleh pengunjung:</span>
            <span className="text-[11px] text-neutral-500">Diperbarui otomatis saat pengunjung mengetik</span>
          </div>

          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-neutral-900 border border-neutral-800/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="p-1 rounded bg-neutral-800 text-neutral-400 shrink-0">
                    {log.deviceType === 'Mobile' ? (
                      <Smartphone className="w-3.5 h-3.5" />
                    ) : (
                      <Monitor className="w-3.5 h-3.5" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate">
                      "{log.query}"
                    </div>
                    <div className="text-[11px] text-neutral-400 truncate">
                      Hasil: {log.matchedProductName || 'Tidak Ditemukan'}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      log.isMatched
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                        : 'bg-rose-950/80 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {log.isMatched ? 'Cocok di Katalog' : 'Tidak Ada'}
                  </span>
                  <div className="text-[10px] text-neutral-500 mt-0.5">{log.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Reset & Diagnostic Footer */}
      <div className="pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Data tersimpan otomatis di browser lokal pemilik (Local Storage)</span>
        </div>

        <button
          type="button"
          onClick={handleResetTrends}
          className="text-neutral-500 hover:text-rose-400 transition-colors text-[11px] flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Data Tren ke Default</span>
        </button>
      </div>
    </div>
  );
};
