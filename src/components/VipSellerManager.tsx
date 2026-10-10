import React, { useState } from 'react';
import {
  Zap,
  Server,
  RefreshCw,
  Sliders,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Plus,
  Trash2,
  Search,
  ArrowRight,
  ShieldCheck,
  Package,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { ProductItem, VipSellerConfig, ProductCommissionRule } from '../types/topup';
import {
  testVipSellerConnection,
  syncCatalogWithVipSeller,
  calculateSellingPrice,
} from '../data/vipSellerData';

interface VipSellerManagerProps {
  config?: VipSellerConfig;
  productsCatalog: ProductItem[];
  onSaveConfig: (updatedConfig: VipSellerConfig) => void;
  onSyncCatalog: (updatedCatalog: ProductItem[], updatedConfig: VipSellerConfig) => void;
  onSelectProduct?: (productId: string) => void;
}

export const VipSellerManager: React.FC<VipSellerManagerProps> = ({
  config,
  productsCatalog,
  onSaveConfig,
  onSyncCatalog,
  onSelectProduct,
}) => {
  // Config state
  const [memberCode, setMemberCode] = useState(config?.memberCode || 'VIP-TG-89210');
  const [apiKey, setApiKey] = useState(config?.apiKey || 'vipseller_live_sec_89324892348');
  const [apiEndpoint, setApiEndpoint] = useState(
    config?.apiEndpoint || 'https://api.vipseller.id/v1/h2h'
  );
  const [balance, setBalance] = useState(config?.balance ?? 4250000);
  const [commissionType, setCommissionType] = useState<'percentage' | 'fixed' | 'hybrid'>(
    config?.commissionType || 'percentage'
  );
  const [globalCommissionPercent, setGlobalCommissionPercent] = useState(
    config?.globalCommissionPercent ?? 7
  );
  const [globalCommissionFixed, setGlobalCommissionFixed] = useState(
    config?.globalCommissionFixed ?? 1000
  );
  const [autoSyncPrices, setAutoSyncPrices] = useState(config?.autoSyncPrices ?? true);
  const [customCommissions, setCustomCommissions] = useState<Record<string, ProductCommissionRule>>(
    config?.productCustomCommissions || {
      mlbb: { type: 'percentage', value: 5 },
      freefire: { type: 'percentage', value: 6 },
    }
  );

  // Testing & Sync states
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    balance: number;
    partnerLevel: string;
    latencyMs: number;
    serverTime: string;
  } | null>(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<{
    addedCount: number;
    updatedCount: number;
    totalCount: number;
    timestamp: string;
  } | null>(null);

  // Custom commission adder state
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [targetProductId, setTargetProductId] = useState(productsCatalog[0]?.id || 'mlbb');
  const [targetRuleType, setTargetRuleType] = useState<'percentage' | 'fixed'>('percentage');
  const [targetRuleValue, setTargetRuleValue] = useState(5);

  // Table preview search
  const [previewSearch, setPreviewSearch] = useState('');
  const [showIdMitraGuide, setShowIdMitraGuide] = useState(false);

  // Build current config snapshot
  const getCurrentConfig = (): VipSellerConfig => ({
    isConnected: true,
    memberCode,
    apiKey,
    apiEndpoint,
    balance,
    lastSyncedAt: config?.lastSyncedAt || 'Belum pernah',
    commissionType,
    globalCommissionPercent,
    globalCommissionFixed,
    productCustomCommissions: customCommissions,
    autoSyncPrices,
  });

  // Handle Testing Connection to VIP Seller
  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    const res = await testVipSellerConnection(memberCode, apiKey, apiEndpoint);
    setIsTesting(false);
    setTestResult(res);
    if (res.success) {
      setBalance(res.balance);
    }
  };

  // Handle Synchronizing Products and Adjusting Prices
  const handleExecuteSync = () => {
    setIsSyncing(true);
    setSyncNotice(null);

    const activeConfig = getCurrentConfig();

    setTimeout(() => {
      const syncReport = syncCatalogWithVipSeller(productsCatalog, activeConfig);

      const updatedConfigWithTime: VipSellerConfig = {
        ...activeConfig,
        lastSyncedAt: `Hari ini, ${new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        })} WIB`,
      };

      setIsSyncing(false);
      setSyncNotice({
        addedCount: syncReport.addedProductsCount,
        updatedCount: syncReport.updatedPricesCount,
        totalCount: syncReport.totalProductsCount,
        timestamp: updatedConfigWithTime.lastSyncedAt || '',
      });

      // Update parent catalog and store config
      onSyncCatalog(syncReport.updatedCatalog, updatedConfigWithTime);
      onSaveConfig(updatedConfigWithTime);
    }, 700);
  };

  // Handle adding custom commission per game
  const handleAddCustomRule = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...customCommissions,
      [targetProductId]: {
        type: targetRuleType,
        value: Number(targetRuleValue) || 5,
      },
    };
    setCustomCommissions(updated);
    setShowAddCustom(false);
    const updatedCfg = { ...getCurrentConfig(), productCustomCommissions: updated };
    onSaveConfig(updatedCfg);
  };

  const handleRemoveCustomRule = (prodId: string) => {
    const updated = { ...customCommissions };
    delete updated[prodId];
    setCustomCommissions(updated);
    const updatedCfg = { ...getCurrentConfig(), productCustomCommissions: updated };
    onSaveConfig(updatedCfg);
  };

  // Filter denominations for table preview
  const previewItems = productsCatalog.flatMap((prod) =>
    prod.denominations.map((denom) => {
      const modal = denom.vipSellerPrice ?? Math.round(denom.basePrice * 0.905);
      const computedSellPrice = calculateSellingPrice(modal, getCurrentConfig(), prod.id);
      const profitRupiah = computedSellPrice - modal;
      const profitPercent = ((profitRupiah / modal) * 100).toFixed(1);
      const hasCustomRule = !!customCommissions[prod.id];

      return {
        productId: prod.id,
        productName: prod.name,
        denomId: denom.id,
        denomName: denom.name,
        modalPrice: modal,
        sellPrice: computedSellPrice,
        profitRupiah,
        profitPercent,
        hasCustomRule,
        customRule: customCommissions[prod.id],
      };
    })
  ).filter((item) => {
    if (!previewSearch.trim()) return true;
    const q = previewSearch.toLowerCase();
    return (
      item.productName.toLowerCase().includes(q) ||
      item.denomName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner & Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-900 border border-amber-500/30 rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 shadow-md">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Integrasi Distributor VIP Seller & Otomatisasi Harga</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  H2H Live
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                Hubungkan API VIP Seller untuk memperbanyak produk game otomatis dan atur komisi keuntungan Anda secara fleksibel.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExecuteSync}
              disabled={isSyncing}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 ${
                isSyncing
                  ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-300 text-neutral-950 active:scale-[0.98]'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Produk & Harga'}</span>
            </button>
          </div>
        </div>

        {/* Sync Success Feedback Notice */}
        {syncNotice && (
          <div className="p-3 bg-emerald-950/70 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Sinkronisasi Berhasil!</strong> Menambahkan{' '}
              <span className="text-white font-bold">{syncNotice.addedCount} produk baru</span>, memperbarui{' '}
              <span className="text-white font-bold">{syncNotice.updatedCount} harga denominasi</span> sesuai margin komisi Anda. Total produk aktif saat ini: {syncNotice.totalCount} produk.
              <span className="text-emerald-400/80 block text-[11px] mt-0.5 font-mono">
                Waktu pembaruan: {syncNotice.timestamp}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Grid: Saldo & Status Server VIP Seller */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Card 1: Saldo Modal H2H */}
        <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-1 relative overflow-hidden">
          <div className="text-[11px] text-neutral-400 flex items-center justify-between">
            <span>Saldo Modal VIP Seller (H2H)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            Rp {balance.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-neutral-500 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>Terhubung otomatis saat transaksi pembeli masuk</span>
          </div>
        </div>

        {/* Card 2: Status Kemitraan */}
        <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-1">
          <div className="text-[11px] text-neutral-400">Level Mitra VIP Seller</div>
          <div className="text-base font-bold text-amber-300 flex items-center gap-1.5 truncate">
            <span>Distributor Platinum H2H</span>
          </div>
          <div className="text-[10px] text-neutral-400">
            Mendapatkan harga modal dasar terendah (H2H tier 1).
          </div>
        </div>

        {/* Card 3: Waktu Sinkronisasi Terakhir */}
        <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-1">
          <div className="text-[11px] text-neutral-400">Pembaruan Katalog Terakhir</div>
          <div className="text-sm font-semibold font-mono text-white truncate">
            {config?.lastSyncedAt || '10 Oktober 2026, 10:45 WIB'}
          </div>
          <div className="text-[10px] text-neutral-500">
            Total {productsCatalog.length} Game & Layanan Terkoneksi
          </div>
        </div>
      </div>

      {/* Bagian 1: Pengaturan Komisi & Margin Keuntungan Toko */}
      <div className="p-4 sm:p-5 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <Sliders className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-white">
                Pilihan Pengaturan Komisi & Margin Keuntungan Anda
              </h4>
              <p className="text-xs text-neutral-400">
                Harga jual ke pembeli = <strong>Harga Modal VIP Seller + Komisi Anda</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Mode Komisi Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => {
              setCommissionType('percentage');
              onSaveConfig({ ...getCurrentConfig(), commissionType: 'percentage' });
            }}
            className={`p-3 rounded-xl border text-left transition-all ${
              commissionType === 'percentage'
                ? 'border-amber-400 bg-amber-950/40 shadow-sm'
                : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-amber-400" />
                <span>Persentase (%)</span>
              </span>
              {commissionType === 'percentage' && (
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              )}
            </div>
            <p className="text-[11px] text-neutral-400">
              Mengambil keuntungan % tetap dari harga modal (Contoh: +7%).
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setCommissionType('fixed');
              onSaveConfig({ ...getCurrentConfig(), commissionType: 'fixed' });
            }}
            className={`p-3 rounded-xl border text-left transition-all ${
              commissionType === 'fixed'
                ? 'border-amber-400 bg-amber-950/40 shadow-sm'
                : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span>Nominal Tetap (Rp)</span>
              </span>
              {commissionType === 'fixed' && (
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              )}
            </div>
            <p className="text-[11px] text-neutral-400">
              Mengambil untung Rp pasti di setiap item (Contoh: +Rp 1.000).
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setCommissionType('hybrid');
              onSaveConfig({ ...getCurrentConfig(), commissionType: 'hybrid' });
            }}
            className={`p-3 rounded-xl border text-left transition-all ${
              commissionType === 'hybrid'
                ? 'border-amber-400 bg-amber-950/40 shadow-sm'
                : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                <span>Kombinasi (Hybrid)</span>
              </span>
              {commissionType === 'hybrid' && (
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              )}
            </div>
            <p className="text-[11px] text-neutral-400">
              Kombinasi persentase margin ditambah biaya flat Rp.
            </p>
          </button>
        </div>

        {/* Global Commission Sliders / Inputs */}
        <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-4">
          {(commissionType === 'percentage' || commissionType === 'hybrid') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-white">
                  Komisi Persentase Standar Toko:
                </label>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  +{globalCommissionPercent}%
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="25"
                step="0.5"
                value={globalCommissionPercent}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setGlobalCommissionPercent(val);
                  onSaveConfig({ ...getCurrentConfig(), globalCommissionPercent: val });
                }}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-500">
                <span>Minimalis (+2%)</span>
                <span>Standar (+7%)</span>
                <span>Maksimal (+25%)</span>
              </div>
            </div>
          )}

          {(commissionType === 'fixed' || commissionType === 'hybrid') && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-white">
                Komisi Rupiah Tetap (Per Transaksi):
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">Rp</span>
                <input
                  type="number"
                  step="200"
                  value={globalCommissionFixed}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 0;
                    setGlobalCommissionFixed(val);
                    onSaveConfig({ ...getCurrentConfig(), globalCommissionFixed: val });
                  }}
                  className="w-full sm:w-48 bg-neutral-900 border border-neutral-700 focus:border-amber-400 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none"
                />
                <span className="text-xs text-neutral-400">/ denomination</span>
              </div>
            </div>
          )}

          {/* Auto Sync Toggle */}
          <div className="pt-2 border-t border-neutral-800/80">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSyncPrices}
                onChange={(e) => {
                  setAutoSyncPrices(e.target.checked);
                  onSaveConfig({ ...getCurrentConfig(), autoSyncPrices: e.target.checked });
                }}
                className="w-4 h-4 rounded border-neutral-700 text-amber-500 focus:ring-amber-400 bg-neutral-900"
              />
              <span className="text-xs text-neutral-300">
                Otomatis sesuaikan harga jual ketika VIP Seller menaikkan atau menurunkan harga modal H2H.
              </span>
            </label>
          </div>
        </div>

        {/* Bagian Komisi Khusus Per Game (Custom per Game) */}
        <div className="space-y-3 pt-2 border-t border-neutral-800">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Pilihan Komisi Khusus Per-Produk (Lebih Fleksibel)</span>
              </h5>
              <p className="text-[11px] text-neutral-400">
                Atur margin lebih kecil untuk game populer (seperti MLBB agar bersaing), dan margin lebih tinggi untuk produk lain.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddCustom(!showAddCustom)}
              className="px-2.5 py-1 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700 rounded-lg flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Atur Game Khusus</span>
            </button>
          </div>

          {/* Form Add Custom Rule */}
          {showAddCustom && (
            <form
              onSubmit={handleAddCustomRule}
              className="p-3 bg-neutral-950 border border-amber-500/30 rounded-xl space-y-3 animate-in fade-in text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Pilih Produk Game</label>
                  <select
                    value={targetProductId}
                    onChange={(e) => setTargetProductId(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    {productsCatalog.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.publisher})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Tipe Komisi</label>
                  <select
                    value={targetRuleType}
                    onChange={(e) => setTargetRuleType(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="percentage">Persentase (%)</option>
                    <option value="fixed">Nominal Flat (Rp)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">
                    Nilai Komisi ({targetRuleType === 'percentage' ? '%' : 'Rp'})
                  </label>
                  <input
                    type="number"
                    step={targetRuleType === 'percentage' ? '0.5' : '500'}
                    value={targetRuleValue}
                    onChange={(e) => setTargetRuleValue(parseFloat(e.target.value) || 0)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddCustom(false)}
                  className="px-2.5 py-1 text-neutral-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-lg"
                >
                  Terapkan Komisi
                </button>
              </div>
            </form>
          )}

          {/* Active Custom Rules Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {Object.entries(customCommissions).length === 0 ? (
              <span className="text-[11px] text-neutral-500 italic">
                Semua produk saat ini memakai komisi global ({globalCommissionPercent}%).
              </span>
            ) : (
              Object.entries(customCommissions).map(([prodId, rule]) => {
                const prodObj = productsCatalog.find((p) => p.id === prodId);
                return (
                  <div
                    key={prodId}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-200"
                  >
                    <span className="font-semibold text-amber-300">
                      {prodObj?.name || prodId.toUpperCase()}:
                    </span>
                    <span className="font-mono text-emerald-400">
                      {rule.type === 'percentage' ? `+${rule.value}%` : `+Rp ${rule.value.toLocaleString('id-ID')}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomRule(prodId)}
                      className="text-neutral-500 hover:text-rose-400 ml-1"
                      title="Hapus aturan khusus"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bagian 2: Konfigurasi API VIP Seller */}
      <div className="p-4 sm:p-5 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-400/10 text-sky-400 border border-sky-400/20">
              <Server className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Kredensial API H2H Distributor VIP Seller</span>
              </h4>
              <p className="text-xs text-neutral-400">
                Hubungkan akun distributor Anda agar pengiriman diamond ke game pembeli berjalan otomatis 24 jam.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowIdMitraGuide(!showIdMitraGuide)}
              className="px-3 py-1.5 text-xs font-semibold bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 rounded-lg border border-amber-400/30 transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>{showIdMitraGuide ? 'Tutup Panduan' : 'Apa itu ID Mitra?'}</span>
            </button>

            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-3 py-1.5 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg border border-neutral-700 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Menguji...' : 'Uji Koneksi & Saldo'}</span>
            </button>
          </div>
        </div>

        {/* Kotak Penjelasan Lengkap: Apa itu Kode Member / ID Mitra */}
        {showIdMitraGuide && (
          <div className="p-4 bg-gradient-to-r from-sky-950/40 via-neutral-950 to-neutral-950 border border-sky-500/40 rounded-xl space-y-3 text-xs animate-in fade-in">
            <div className="flex items-center gap-2 text-sky-300 font-bold">
              <HelpCircle className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Penjelasan: Apa Itu "Kode Member / ID Mitra" & Fungsinya?</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-neutral-300">
              <div className="p-3 bg-neutral-900/80 rounded-lg border border-neutral-800 space-y-1">
                <strong className="text-white block font-medium">1. Apa Itu ID Mitra?</strong>
                <p className="text-neutral-400 leading-relaxed">
                  ID Mitra / Kode Member adalah <strong>username atau nomor ID akun Anda</strong> di situs distributor/supplier top up (seperti VIP Reseller di <code className="text-amber-300">vip-reseller.co.id</code> atau Digiflazz di <code className="text-amber-300">digiflazz.com</code>).
                </p>
              </div>

              <div className="p-3 bg-neutral-900/80 rounded-lg border border-neutral-800 space-y-1">
                <strong className="text-white block font-medium">2. Kenapa Ini Dibutuhkan?</strong>
                <p className="text-neutral-400 leading-relaxed">
                  Website ini adalah <em>kasir toko online</em> Anda. Agar diamond bisa otomatis masuk ke akun game pembeli (Moonton/Garena), website Anda mengambil stok diamond dari distributor menggunakan ID Mitra & API Key Anda.
                </p>
              </div>

              <div className="p-3 bg-neutral-900/80 rounded-lg border border-neutral-800 space-y-1">
                <strong className="text-white block font-medium">3. Cara Dapatnya (Gratis):</strong>
                <p className="text-neutral-400 leading-relaxed">
                  1) Buka situs distributor (misal VIP Reseller).<br />
                  2) Daftar akun baru gratis.<br />
                  3) Buka menu Profil / API Integration, salin ID Mitra & API Key ke form ini.<br />
                  4) Isi saldo deposit modal perdana (mulai Rp 20.000).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Test Result Feedback */}
        {testResult && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 animate-in fade-in ${
              testResult.success
                ? 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
                : 'bg-rose-950/70 border-rose-800 text-rose-300'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5">
              <div className="font-semibold text-white">{testResult.message}</div>
              {testResult.success && (
                <div className="text-[11px] text-emerald-400/90 font-mono">
                  Saldo: Rp {testResult.balance.toLocaleString('id-ID')} · Level: {testResult.partnerLevel} · Latensi: {testResult.latencyMs}ms
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">
              Kode Member / ID Mitra
            </label>
            <input
              type="text"
              value={memberCode}
              onChange={(e) => {
                setMemberCode(e.target.value);
                onSaveConfig({ ...getCurrentConfig(), memberCode: e.target.value });
              }}
              placeholder="Contoh: VIP-TG-89210"
              className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">
              API Secret Key (H2H Live)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                onSaveConfig({ ...getCurrentConfig(), apiKey: e.target.value });
              }}
              placeholder="vipseller_live_sec_..."
              className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] text-neutral-400 mb-1">
              URL Endpoint API Server VIP Seller
            </label>
            <input
              type="text"
              value={apiEndpoint}
              onChange={(e) => {
                setApiEndpoint(e.target.value);
                onSaveConfig({ ...getCurrentConfig(), apiEndpoint: e.target.value });
              }}
              placeholder="https://api.vipseller.id/v1/h2h"
              className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Bagian 3: Tabel Pratinjau Harga Modal vs Harga Jual & Keuntungan */}
      <div className="p-4 sm:p-5 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Pratinjau Keuntungan Real-Time (Modal vs Jual)</span>
            </h4>
            <p className="text-xs text-neutral-400">
              Berikut simulasi harga jual ke pembeli dan laba bersih yang Anda dapatkan di setiap denominasi.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={previewSearch}
              onChange={(e) => setPreviewSearch(e.target.value)}
              placeholder="Cari game atau nominal..."
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto border border-neutral-800 rounded-xl bg-neutral-950 max-h-80 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900/90 text-neutral-400 border-b border-neutral-800 sticky top-0 z-10 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Produk & Denominasi</th>
                <th className="py-2.5 px-3">Modal VIP Seller</th>
                <th className="py-2.5 px-3">Komisi Anda (Untung)</th>
                <th className="py-2.5 px-3">Harga Jual Pembeli</th>
                <th className="py-2.5 px-3 text-right">Aturan Komisi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {previewItems.slice(0, 30).map((row, idx) => (
                <tr key={`${row.productId}-${row.denomId}-${idx}`} className="hover:bg-neutral-900/40 transition-colors">
                  <td className="py-2 px-3">
                    <div className="font-semibold text-white">{row.productName}</div>
                    <div className="text-[11px] text-neutral-400 font-mono truncate max-w-[200px]">
                      {row.denomName}
                    </div>
                  </td>
                  <td className="py-2 px-3 font-mono text-neutral-300">
                    Rp {row.modalPrice.toLocaleString('id-ID')}
                  </td>
                  <td className="py-2 px-3 font-mono">
                    <span className="text-emerald-400 font-semibold">
                      +Rp {row.profitRupiah.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-neutral-500 ml-1">
                      ({row.profitPercent}%)
                    </span>
                  </td>
                  <td className="py-2 px-3 font-mono font-bold text-amber-400">
                    Rp {row.sellPrice.toLocaleString('id-ID')}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {row.hasCustomRule ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                        Khusus Produk ({row.customRule?.type === 'percentage' ? `${row.customRule.value}%` : `Rp ${row.customRule?.value}`})
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-400">
                        Standar Toko ({globalCommissionPercent}%)
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
