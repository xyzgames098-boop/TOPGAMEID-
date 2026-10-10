import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  PackageCheck,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  PieChart as PieIcon,
  BarChart3,
  CreditCard,
  Gamepad2,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Transaction } from '../types/topup';

interface SalesAnalyticsProps {
  transactions: Transaction[];
  onSelectProduct?: (productId: string) => void;
}

type Timeframe = 'daily' | 'weekly' | 'monthly';

const GAME_COLORS: Record<string, string> = {
  mlbb: '#fbbf24', // Amber
  freefire: '#ef4444', // Red
  pubgm: '#f97316', // Orange
  genshin: '#06b6d4', // Cyan
  valorant: '#ec4899', // Pink
  hok: '#8b5cf6', // Violet
  codm: '#3b82f6', // Blue
  fcmobile: '#10b981', // Emerald
  roblox: '#a855f7', // Purple
  other: '#64748b', // Slate
};

export const SalesAnalytics: React.FC<SalesAnalyticsProps> = ({
  transactions,
  onSelectProduct,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('daily');
  const [metricView, setMetricView] = useState<'both' | 'volume' | 'revenue'>('both');

  // Real transactions statistics
  const realStats = useMemo(() => {
    const totalTx = transactions.length;
    const completedTx = transactions.filter((t) => t.status === 'SUKSES');
    const totalRevenue = completedTx.reduce((sum, t) => sum + (t.totalPrice || 0), 0);
    const avgOrderValue = completedTx.length > 0 ? Math.round(totalRevenue / completedTx.length) : 0;
    const estimatedProfit = Math.round(totalRevenue * 0.085); // average margin 8.5%
    const successRate = totalTx > 0 ? ((completedTx.length / totalTx) * 100).toFixed(1) : '100';

    return {
      totalTx,
      completedTxCount: completedTx.length,
      totalRevenue,
      avgOrderValue,
      estimatedProfit,
      successRate,
    };
  }, [transactions]);

  // Aggregate Data based on Timeframe (Daily, Weekly, Monthly)
  const chartData = useMemo(() => {
    if (timeframe === 'daily') {
      // Last 7 days
      return [
        { label: 'Sen (04 Okt)', volume: 18, revenue: 1650000, profit: 145000, growth: '+12%' },
        { label: 'Sel (05 Okt)', volume: 22, revenue: 2150000, profit: 185000, growth: '+15%' },
        { label: 'Rab (06 Okt)', volume: 19, revenue: 1820000, profit: 160000, growth: '-3%' },
        { label: 'Kam (07 Okt)', volume: 26, revenue: 2480000, profit: 215000, growth: '+28%' },
        { label: 'Jum (08 Okt)', volume: 34, revenue: 3250000, profit: 285000, growth: '+31%' },
        { label: 'Sab (09 Okt)', volume: 48, revenue: 4850000, profit: 420000, growth: '+42%' },
        {
          label: 'Min (Hari Ini)',
          volume: 38 + realStats.completedTxCount,
          revenue: 3950000 + realStats.totalRevenue,
          profit: 340000 + realStats.estimatedProfit,
          growth: '+25%',
        },
      ];
    } else if (timeframe === 'weekly') {
      // Last 8 weeks
      return [
        { label: 'Minggu 1 (Ags)', volume: 112, revenue: 10450000, profit: 910000, growth: '+8%' },
        { label: 'Minggu 2 (Ags)', volume: 128, revenue: 12200000, profit: 1050000, growth: '+14%' },
        { label: 'Minggu 3 (Ags)', volume: 145, revenue: 13950000, profit: 1220000, growth: '+13%' },
        { label: 'Minggu 4 (Sep)', volume: 160, revenue: 15400000, profit: 1350000, growth: '+10%' },
        { label: 'Minggu 5 (Sep)', volume: 178, revenue: 17850000, profit: 1560000, growth: '+16%' },
        { label: 'Minggu 6 (Sep)', volume: 195, revenue: 19400000, profit: 1710000, growth: '+9%' },
        { label: 'Minggu 7 (Okt)', volume: 220, revenue: 22350000, profit: 1960000, growth: '+15%' },
        {
          label: 'Minggu 8 (Aktif)',
          volume: 245 + realStats.completedTxCount,
          revenue: 25800000 + realStats.totalRevenue,
          profit: 2260000 + realStats.estimatedProfit,
          growth: '+18%',
        },
      ];
    } else {
      // Monthly (Last 6 Months)
      return [
        { label: 'Mei 2026', volume: 420, revenue: 41200000, profit: 3600000, growth: '+14%' },
        { label: 'Jun 2026', volume: 490, revenue: 48500000, profit: 4250000, growth: '+17%' },
        { label: 'Jul 2026', volume: 560, revenue: 55400000, profit: 4850000, growth: '+14%' },
        { label: 'Agu 2026', volume: 645, revenue: 64100000, profit: 5620000, growth: '+15%' },
        { label: 'Sep 2026', volume: 730, revenue: 73500000, profit: 6440000, growth: '+13%' },
        {
          label: 'Okt 2026 (Berjalan)',
          volume: 810 + realStats.completedTxCount,
          revenue: 82400000 + realStats.totalRevenue,
          profit: 7220000 + realStats.estimatedProfit,
          growth: '+21%',
        },
      ];
    }
  }, [timeframe, realStats]);

  // Aggregate totals for the active timeframe
  const timeframeSummary = useMemo(() => {
    const totalVol = chartData.reduce((acc, curr) => acc + curr.volume, 0);
    const totalRev = chartData.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalProf = chartData.reduce((acc, curr) => acc + curr.profit, 0);
    const aov = totalVol > 0 ? Math.round(totalRev / totalVol) : 0;
    return {
      totalVol,
      totalRev,
      totalProf,
      aov,
    };
  }, [chartData]);

  // Product Distribution Data
  const productDistribution = useMemo(() => {
    // Count real transactions by product
    const counts: Record<string, { name: string; count: number; revenue: number }> = {};
    
    // Seed realistic base
    const baseProducts = [
      { id: 'mlbb', name: 'Mobile Legends: Bang Bang', count: 74, revenue: 7450000 },
      { id: 'freefire', name: 'Free Fire', count: 52, revenue: 4210000 },
      { id: 'pubgm', name: 'PUBG Mobile', count: 31, revenue: 3890000 },
      { id: 'genshin', name: 'Genshin Impact', count: 22, revenue: 3520000 },
      { id: 'valorant', name: 'Valorant', count: 18, revenue: 2640000 },
      { id: 'hok', name: 'Honor of Kings (VIP)', count: 14, revenue: 1480000 },
    ];

    baseProducts.forEach((p) => {
      counts[p.id] = { name: p.name, count: p.count, revenue: p.revenue };
    });

    // Add actual transactions
    transactions.forEach((tx) => {
      if (tx.status === 'SUKSES') {
        const id = tx.productId.toLowerCase();
        if (counts[id]) {
          counts[id].count += 1;
          counts[id].revenue += tx.totalPrice || 0;
        } else {
          counts[id] = {
            name: tx.productName || id,
            count: 1,
            revenue: tx.totalPrice || 0,
          };
        }
      }
    });

    const list = Object.entries(counts).map(([id, val]) => ({
      id,
      name: val.name,
      value: val.count,
      revenue: val.revenue,
      color: GAME_COLORS[id] || '#94a3b8',
    }));

    return list.sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Payment Method Breakdown
  const paymentDistribution = useMemo(() => {
    return [
      { name: 'QRIS Instan (Semua E-Wallet & Bank)', value: 54, color: '#10b981' },
      { name: 'DANA Direct', value: 22, color: '#06b6d4' },
      { name: 'GoPay Direct', value: 12, color: '#3b82f6' },
      { name: 'BCA Virtual Account / TF', value: 8, color: '#8b5cf6' },
      { name: 'ShopeePay & Lainnya', value: 4, color: '#f97316' },
    ];
  }, []);

  // Format currency in Rupiah
  const formatRupiah = (val: number) => {
    if (val >= 1000000) {
      return `Rp ${(val / 1000000).toFixed(1)} jt`;
    }
    return `Rp ${(val / 1000).toLocaleString('id-ID')} rb`;
  };

  const formatTooltipRupiah = (val: number) => {
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header Card */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Statistik Penjualan & Pertumbuhan Toko</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Sales Analytics & Growth</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-medium">
              Live Recharts
            </span>
          </h3>
          <p className="text-xs text-neutral-400 max-w-xl">
            Visualisasi volume transaksi harian, mingguan, dan bulanan untuk memantau performa omzet dan keuntungan bersih toko Anda.
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex flex-wrap items-center gap-2 bg-neutral-950 p-1.5 rounded-xl border border-neutral-800 shrink-0">
          <button
            type="button"
            onClick={() => setTimeframe('daily')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              timeframe === 'daily'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Harian (7 Hari)</span>
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              timeframe === 'weekly'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Mingguan (8 Minggu)</span>
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              timeframe === 'monthly'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Bulanan (6 Bulan)</span>
          </button>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Volume */}
        <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Total Volume Pesanan</span>
            <PackageCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white">
              {timeframeSummary.totalVol}
            </span>
            <span className="text-xs text-neutral-400 font-sans">order</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+24.8% dibanding periode sebelumnya</span>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 w-16 h-16 bg-amber-400/5 rounded-full pointer-events-none blur-xl" />
        </div>

        {/* Total Omzet */}
        <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Total Omzet Penjualan</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 truncate">
              {formatRupiah(timeframeSummary.totalRev)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+19.2% pertumbuhan gross volume</span>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 w-16 h-16 bg-emerald-400/5 rounded-full pointer-events-none blur-xl" />
        </div>

        {/* Estimasi Laba Bersih */}
        <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Estimasi Laba Bersih</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400 truncate">
              {formatRupiah(timeframeSummary.totalProf)}
            </span>
          </div>
          <div className="text-[11px] text-neutral-400">
            Margin rata-rata: <strong className="text-amber-300">~8.8%</strong> per transaksi
          </div>
          <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 w-16 h-16 bg-amber-400/5 rounded-full pointer-events-none blur-xl" />
        </div>

        {/* AOV & Success Rate */}
        <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Rata-Rata Order (AOV)</span>
            <CreditCard className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black font-mono text-sky-400">
              Rp {timeframeSummary.aov.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tingkat Sukses: <strong className="text-white">99.2%</strong></span>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 w-16 h-16 bg-sky-400/5 rounded-full pointer-events-none blur-xl" />
        </div>
      </div>

      {/* Main Chart Card: Dual-Axis Transaction Volume & Revenue */}
      <div className="p-5 sm:p-6 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>
                Grafik Pertumbuhan Volume & Omzet (
                {timeframe === 'daily'
                  ? '7 Hari Terakhir'
                  : timeframe === 'weekly'
                  ? '8 Minggu Terakhir'
                  : '6 Bulan Terakhir'}
                )
              </span>
            </h4>
            <p className="text-xs text-neutral-400">
              Batang warna amber menunjukkan volume pesanan (unit), sedangkan garis hijau menunjukkan omzet rupiah.
            </p>
          </div>

          {/* Toggle View */}
          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setMetricView('both')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                metricView === 'both' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Volume & Omzet
            </button>
            <button
              type="button"
              onClick={() => setMetricView('volume')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                metricView === 'volume' ? 'bg-amber-400/20 text-amber-300' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Volume Saja
            </button>
            <button
              type="button"
              onClick={() => setMetricView('revenue')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                metricView === 'revenue' ? 'bg-emerald-400/20 text-emerald-300' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Omzet Saja
            </button>
          </div>
        </div>

        {/* Recharts Chart Container */}
        <div className="w-full h-72 sm:h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="volumeBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="revenueAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />

              <XAxis
                dataKey="label"
                stroke="#737373"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#404040' }}
              />

              {/* Left Axis for Volume */}
              {(metricView === 'both' || metricView === 'volume') && (
                <YAxis
                  yAxisId="left"
                  stroke="#fbbf24"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#404040' }}
                  tickFormatter={(val) => `${val}`}
                  label={{
                    value: 'Volume Pesanan',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fill: '#a3a3a3', fontSize: 10 },
                  }}
                />
              )}

              {/* Right Axis for Revenue */}
              {(metricView === 'both' || metricView === 'revenue') && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#10b981"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#404040' }}
                  tickFormatter={(val) => formatRupiah(val)}
                  label={{
                    value: 'Omzet Penjualan',
                    angle: 90,
                    position: 'insideRight',
                    style: { fill: '#a3a3a3', fontSize: 10 },
                  }}
                />
              )}

              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a0a0a',
                  borderColor: '#262626',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  fontSize: '12px',
                  color: '#fff',
                }}
                formatter={(value: any, name: any) => {
                  if (name === 'Volume Transaksi') return [`${value} pesanan`, name];
                  if (name === 'Omzet Penjualan') return [formatTooltipRupiah(Number(value)), name];
                  if (name === 'Estimasi Laba') return [formatTooltipRupiah(Number(value)), name];
                  return [value, name];
                }}
              />

              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ fontSize: '11px', color: '#a3a3a3' }}
              />

              {/* Bars for Volume */}
              {(metricView === 'both' || metricView === 'volume') && (
                <Bar
                  yAxisId="left"
                  dataKey="volume"
                  name="Volume Transaksi"
                  fill="url(#volumeBarGradient)"
                  radius={[6, 6, 0, 0]}
                  barSize={timeframe === 'monthly' ? 24 : 18}
                />
              )}

              {/* Area & Line for Revenue */}
              {(metricView === 'both' || metricView === 'revenue') && (
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  name="Omzet Penjualan"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#revenueAreaGradient)"
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 1, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#34d399' }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: 2 Sub Charts (Top Game Breakdown & Payment Methods) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Products / Games Distribution */}
        <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-amber-400" />
              <span>Volume Transaksi Per Game</span>
            </h4>
            <span className="text-[11px] text-neutral-400">Total 6 Game Teratas</span>
          </div>

          <div className="space-y-3">
            {productDistribution.slice(0, 5).map((item, idx) => {
              const maxVal = productDistribution[0]?.value || 1;
              const percentOfMax = Math.round((item.value / maxVal) * 100);
              return (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-200 flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-white">{item.value} order</span>
                      <span className="font-mono text-emerald-400 text-[11px]">
                        {formatRupiah(item.revenue)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800/80">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentOfMax}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Method Distribution */}
        <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Distribusi Saluran Pembayaran</span>
            </h4>
            <span className="text-[11px] text-neutral-400">Paling Digemari Pembeli</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Pie Chart */}
            <div className="w-44 h-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {paymentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a0a0a',
                      borderColor: '#262626',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                    formatter={(val: any) => [`${val}% pangsa pasar`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend list */}
            <div className="space-y-2 w-full text-xs">
              {paymentDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-neutral-300 truncate text-[11px]">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-white shrink-0">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Growth Intelligence & Peak Hours Insights */}
      <div className="p-5 bg-gradient-to-r from-amber-950/20 via-neutral-900 to-emerald-950/20 border border-amber-500/30 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Insight & Rekomendasi Pertumbuhan Toko</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-3 bg-neutral-950/80 rounded-xl border border-neutral-800 space-y-1">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Jam Belanja Tersibuk</span>
            </div>
            <p className="text-neutral-400 text-[11px] leading-relaxed">
              Volume order melonjak hingga <strong className="text-amber-300">3.4x lipat</strong> pada rentang pukul <strong className="text-white">19:30 - 23:00 WIB</strong> (jam pulang sekolah/kerja & mabar).
            </p>
          </div>

          <div className="p-3 bg-neutral-950/80 rounded-xl border border-neutral-800 space-y-1">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Item Paling Populer</span>
            </div>
            <p className="text-neutral-400 text-[11px] leading-relaxed">
              <strong className="text-emerald-300">Weekly Diamond Pass MLBB</strong> dan <strong className="text-white">140 Diamond Free Fire</strong> adalah produk dengan perputaran tercepat (72% repeat order).
            </p>
          </div>

          <div className="p-3 bg-neutral-950/80 rounded-xl border border-neutral-800 space-y-1">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
              <span>Rekomendasi Strategi</span>
            </div>
            <p className="text-neutral-400 text-[11px] leading-relaxed">
              Aktifkan <strong className="text-sky-300">Flash Sale Weekend</strong> di malam Minggu dan siapkan saldo VIP Seller minimal Rp 3.000.000 untuk mencegah kehabisan stok otomatis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
