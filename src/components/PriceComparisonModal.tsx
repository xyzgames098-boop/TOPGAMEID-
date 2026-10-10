import React, { useState, useMemo } from 'react';
import { ProductItem, Denomination, MembershipTier } from '../types/topup';
import { PRODUCTS_CATALOG, MEMBERSHIP_TIER_CONFIG } from '../data/topupData';
import { GameIcon } from './GameIcon';
import { 
  X, ArrowLeftRight, Check, ArrowRight, Scale, 
  Sparkles, ShieldCheck 
} from 'lucide-react';

interface PriceComparisonModalProps {
  currentTier: MembershipTier;
  initialProductAId?: string;
  initialProductBId?: string;
  onClose: () => void;
  onSelectDenomToBuy: (product: ProductItem, denom: Denomination) => void;
  onSelectTier: (tier: MembershipTier) => void;
}

export const PriceComparisonModal: React.FC<PriceComparisonModalProps> = ({
  currentTier,
  initialProductAId = 'mlbb',
  initialProductBId = 'freefire',
  onClose,
  onSelectDenomToBuy,
  onSelectTier,
}) => {
  const [productAId, setProductAId] = useState<string>(initialProductAId);
  const [productBId, setProductBId] = useState<string>(initialProductBId);

  const productA = useMemo(
    () => PRODUCTS_CATALOG.find((p) => p.id === productAId) || PRODUCTS_CATALOG[0],
    [productAId]
  );
  const productB = useMemo(
    () => PRODUCTS_CATALOG.find((p) => p.id === productBId) || PRODUCTS_CATALOG[1],
    [productBId]
  );

  const tierConfig = MEMBERSHIP_TIER_CONFIG[currentTier];

  // Helper to get top 3 popular denominations
  const getTop3Denoms = (prod: ProductItem): Denomination[] => {
    const populars = prod.denominations.filter((d) => d.isPopular || d.isFlashSale);
    if (populars.length >= 3) {
      return populars.slice(0, 3);
    }
    const remaining = prod.denominations.filter((d) => !populars.includes(d));
    return [...populars, ...remaining].slice(0, 3);
  };

  const top3A = useMemo(() => getTop3Denoms(productA), [productA]);
  const top3B = useMemo(() => getTop3Denoms(productB), [productB]);

  const handleSwapProducts = () => {
    setProductAId(productB.id);
    setProductBId(productA.id);
  };

  // Quick comparison presets
  const presets = [
    { label: 'MLBB vs Free Fire', a: 'mlbb', b: 'freefire' },
    { label: 'Genshin vs Honkai: Star Rail', a: 'genshin', b: 'hsr' },
    { label: 'Valorant vs PUBG Mobile', a: 'valorant', b: 'pubgm' },
    { label: 'Telkomsel vs XL / Axis', a: 'telkomsel', b: 'xl-axis' },
    { label: 'DANA vs GoPay', a: 'dana-wallet', b: 'gopay-wallet' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800/80 bg-neutral-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                Analisis & Komparasi Harga
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                Bandingkan Harga 2 Produk
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* Preset Buttons */}
          <div className="space-y-2">
            <div className="text-xs text-neutral-400 font-medium">Komparasi Populer:</div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {presets.map((preset) => {
                const isActive = productAId === preset.a && productBId === preset.b;
                return (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setProductAId(preset.a);
                      setProductBId(preset.b);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 border ${
                      isActive
                        ? 'bg-amber-400 text-neutral-950 border-amber-400 font-bold'
                        : 'bg-neutral-900 text-neutral-300 hover:text-white border-neutral-800'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Selectors with Swap */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 items-center">
            {/* Selector A */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                Produk Pertama (A)
              </label>
              <div className="flex items-center gap-3">
                <GameIcon type={productA.iconType} className="w-10 h-10 shrink-0 rounded-lg" />
                <select
                  value={productAId}
                  onChange={(e) => setProductAId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white font-medium focus:outline-none focus:border-amber-400"
                >
                  {PRODUCTS_CATALOG.map((p) => (
                    <option key={`a-${p.id}`} value={p.id} disabled={p.id === productBId}>
                      {p.name} ({p.publisher})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSwapProducts}
                className="p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-neutral-300 hover:text-white transition-colors"
                title="Tukar Posisi Produk A dan B"
              >
                <ArrowLeftRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>

            {/* Selector B */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                Produk Kedua (B)
              </label>
              <div className="flex items-center gap-3">
                <GameIcon type={productB.iconType} className="w-10 h-10 shrink-0 rounded-lg" />
                <select
                  value={productBId}
                  onChange={(e) => setProductBId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white font-medium focus:outline-none focus:border-amber-400"
                >
                  {PRODUCTS_CATALOG.map((p) => (
                    <option key={`b-${p.id}`} value={p.id} disabled={p.id === productAId}>
                      {p.name} ({p.publisher})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Current Tier Notice & Quick Switcher */}
          <div className="p-3.5 bg-neutral-900/80 border border-neutral-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-neutral-300">
                Level Keanggotaan Anda saat ini: <strong className="text-amber-400 font-mono">{tierConfig.name}</strong> (Diskon {(tierConfig.discountRate * 100).toFixed(1)}%).
              </span>
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <span className="text-[11px] text-neutral-400 mr-1">Uji Coba Level:</span>
              {(['member', 'basic', 'gold', 'platinum'] as MembershipTier[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onSelectTier(t)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    currentTier === t
                      ? 'bg-amber-400 text-neutral-950 font-bold'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {MEMBERSHIP_TIER_CONFIG[t].badgeLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Side-by-Side Comparison Table */}
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-950/80 border-b border-neutral-800 text-xs text-neutral-400">
                    <th className="py-3 px-4 w-16 text-center">Rank</th>
                    <th className="py-3 px-4 w-[45%]">
                      <div className="flex items-center gap-2">
                        <GameIcon type={productA.iconType} className="w-7 h-7 rounded" />
                        <div>
                          <span className="font-bold text-white block text-sm">{productA.name}</span>
                          <span className="text-[10px] text-neutral-400">{productA.publisher}</span>
                        </div>
                      </div>
                    </th>
                    <th className="py-3 px-4 w-[45%]">
                      <div className="flex items-center gap-2">
                        <GameIcon type={productB.iconType} className="w-7 h-7 rounded" />
                        <div>
                          <span className="font-bold text-white block text-sm">{productB.name}</span>
                          <span className="text-[10px] text-neutral-400">{productB.publisher}</span>
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-800/80 text-xs">
                  {[0, 1, 2].map((idx) => {
                    const itemA = top3A[idx];
                    const itemB = top3B[idx];

                    if (!itemA && !itemB) return null;

                    // Calculations for A
                    const rawPriceA = itemA?.isFlashSale && itemA.flashSalePrice ? itemA.flashSalePrice : itemA?.basePrice || 0;
                    const tierPriceA = Math.round(rawPriceA * (1 - tierConfig.discountRate));
                    const savingsA = rawPriceA - tierPriceA;

                    // Calculations for B
                    const rawPriceB = itemB?.isFlashSale && itemB.flashSalePrice ? itemB.flashSalePrice : itemB?.basePrice || 0;
                    const tierPriceB = Math.round(rawPriceB * (1 - tierConfig.discountRate));
                    const savingsB = rawPriceB - tierPriceB;

                    // Difference
                    const priceDiff = Math.abs(tierPriceA - tierPriceB);
                    const cheaperProd = tierPriceA < tierPriceB ? 'A' : 'B';

                    return (
                      <tr key={`row-${idx}`} className="hover:bg-neutral-900/50 transition-colors">
                        {/* Rank Badge */}
                        <td className="py-4 px-4 text-center font-mono text-neutral-500 font-bold">
                          #{idx + 1}
                        </td>

                        {/* Product A Denomination Cell */}
                        <td className="py-4 px-4 align-top">
                          {itemA ? (
                            <div className="space-y-2">
                              <div>
                                <div className="font-bold text-white text-sm">
                                  {itemA.name}
                                </div>
                                <div className="text-[11px] text-neutral-400">
                                  {itemA.categorySubtype || 'Denominasi Populer'}
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-sm font-bold font-mono text-amber-400 tabular-nums">
                                    Rp {tierPriceA.toLocaleString('id-ID')}
                                  </span>
                                  {tierConfig.discountRate > 0 && (
                                    <span className="text-[11px] text-neutral-500 line-through font-mono tabular-nums">
                                      Rp {rawPriceA.toLocaleString('id-ID')}
                                    </span>
                                  )}
                                </div>

                                {savingsA > 0 && (
                                  <div className="text-[10px] text-emerald-400 font-medium">
                                    Hemat Rp {savingsA.toLocaleString('id-ID')} ({tierConfig.badgeLabel})
                                  </div>
                                )}

                                {itemA.vipSellerPrice && (
                                  <div className="text-[10px] text-sky-400 font-mono">
                                    Modal VIP: Rp {itemA.vipSellerPrice.toLocaleString('id-ID')}
                                  </div>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => onSelectDenomToBuy(productA, itemA)}
                                className="px-3 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5"
                              >
                                <span>Beli Sekarang</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-neutral-500 italic">-</span>
                          )}
                        </td>

                        {/* Product B Denomination Cell */}
                        <td className="py-4 px-4 align-top border-l border-neutral-800/80">
                          {itemB ? (
                            <div className="space-y-2">
                              <div>
                                <div className="font-bold text-white text-sm">
                                  {itemB.name}
                                </div>
                                <div className="text-[11px] text-neutral-400">
                                  {itemB.categorySubtype || 'Denominasi Populer'}
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-sm font-bold font-mono text-amber-400 tabular-nums">
                                    Rp {tierPriceB.toLocaleString('id-ID')}
                                  </span>
                                  {tierConfig.discountRate > 0 && (
                                    <span className="text-[11px] text-neutral-500 line-through font-mono tabular-nums">
                                      Rp {rawPriceB.toLocaleString('id-ID')}
                                    </span>
                                  )}
                                </div>

                                {savingsB > 0 && (
                                  <div className="text-[10px] text-emerald-400 font-medium">
                                    Hemat Rp {savingsB.toLocaleString('id-ID')} ({tierConfig.badgeLabel})
                                  </div>
                                )}

                                {itemB.vipSellerPrice && (
                                  <div className="text-[10px] text-sky-400 font-mono">
                                    Modal VIP: Rp {itemB.vipSellerPrice.toLocaleString('id-ID')}
                                  </div>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => onSelectDenomToBuy(productB, itemB)}
                                className="px-3 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5"
                              >
                                <span>Beli Sekarang</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-neutral-500 italic">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom summary insight */}
            <div className="p-4 bg-neutral-950/70 border-t border-neutral-800 text-xs text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Harga ditampilkan otomatis memperhitungkan diskon level akun <strong>{tierConfig.name}</strong> Anda.
                </span>
              </div>

              <div className="text-[11px] text-neutral-500">
                Seluruh nominal di atas terdaftar legal 100% dan diproses 24 jam nonstop.
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-800/80 bg-neutral-900/60 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-neutral-400">
            Ingin membandingkan produk lain? Pilih dari menu dropdown di atas.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
