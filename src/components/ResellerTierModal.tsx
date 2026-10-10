import React, { useState } from 'react';
import { MembershipTier } from '../types/topup';
import { MEMBERSHIP_TIER_CONFIG } from '../data/topupData';
import { X, Check, Award, Calculator, TrendingUp, Sparkles } from 'lucide-react';

interface ResellerTierModalProps {
  currentTier: MembershipTier;
  onSelectTier: (tier: MembershipTier) => void;
  onClose: () => void;
}

export const ResellerTierModal: React.FC<ResellerTierModalProps> = ({
  currentTier,
  onSelectTier,
  onClose,
}) => {
  const [dailyTransactions, setDailyTransactions] = useState<number>(25);
  const [depositAmount, setDepositAmount] = useState<number>(250000);
  const [depositSuccess, setDepositSuccess] = useState(false);

  const tiers: MembershipTier[] = ['member', 'basic', 'gold', 'platinum'];

  // Profit calculation: average transaction value Rp 45.000
  const avgOrderValue = 45000;
  const currentTierConfig = MEMBERSHIP_TIER_CONFIG[currentTier];
  const monthlyTransactions = dailyTransactions * 30;
  const monthlyRevenue = monthlyTransactions * avgOrderValue;
  const monthlySavingsOrProfit = Math.round(monthlyRevenue * (currentTierConfig.discountRate || 0.06));

  const handleSimulateDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setDepositSuccess(true);
    setTimeout(() => {
      setDepositSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800/80 bg-neutral-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                Sistem Level & Kemitraan
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                Level Keanggotaan & Program Reseller
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl">
            Nikmati harga jauh lebih murah untuk kebutuhan pribadi maupun peluang bisnis jualan top up game & pulsa di lingkungan Anda.
          </p>

          {/* 4 Tier Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {tiers.map((tierKey) => {
              const cfg = MEMBERSHIP_TIER_CONFIG[tierKey];
              const isCurrent = currentTier === tierKey;

              return (
                <div
                  key={tierKey}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    isCurrent
                      ? 'bg-neutral-900 border-amber-400 ring-1 ring-amber-400'
                      : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${cfg.color}`}>
                        {cfg.badgeLabel}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-amber-400">
                          Level Aktif
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white">{cfg.name}</h3>
                      <div className="text-xl font-extrabold font-mono text-amber-400 mt-1 tabular-nums">
                        {cfg.discountRate === 0 ? 'Harga Normal' : `Hemat ${(cfg.discountRate * 100).toFixed(1)}%`}
                      </div>
                    </div>

                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {cfg.description}
                    </p>

                    <div className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-800">
                      Minimal Deposit: <span className="font-mono text-neutral-300">Rp {cfg.minDeposit.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectTier(tierKey)}
                    className={`mt-4 w-full py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                      isCurrent
                        ? 'bg-amber-400 text-neutral-950 font-bold'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                    }`}
                  >
                    {isCurrent ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Sedang Digunakan</span>
                      </>
                    ) : (
                      <span>Pilih Level Ini</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Reseller Profit Margin Calculator */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Kalkulator Estimasi Cuan Reseller
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <label className="text-xs font-medium text-neutral-300 block">
                  Perkiraan Penjualan Anda per Hari:
                  <span className="text-amber-400 font-bold ml-2 font-mono tabular-nums text-sm">
                    {dailyTransactions} Transaksi / Hari
                  </span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="5"
                  value={dailyTransactions}
                  onChange={(e) => setDailyTransactions(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>5 Pesanan</span>
                  <span>75 Pesanan</span>
                  <span>150 Pesanan</span>
                </div>
              </div>

              <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                <div className="text-xs text-neutral-400">
                  Potensi Keuntungan Bersih per Bulan:
                </div>
                <div className="text-2xl font-black font-mono text-emerald-400 tabular-nums">
                  Rp {monthlySavingsOrProfit.toLocaleString('id-ID')}
                </div>
                <div className="text-[11px] text-neutral-500">
                  Dihitung dari {monthlyTransactions} order/bln dengan asumsi margin reseller 6% - 9.5%.
                </div>
              </div>
            </div>
          </div>

          {/* Deposit Saldo Otomatis Simulation */}
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-white">
                Deposit Saldo Otomatis 24 Jam
              </h3>
            </div>

            <p className="text-xs text-neutral-400">
              Isi saldo deposit akun Anda secara instan dengan QRIS atau Virtual Account untuk transaksi tanpa perlu input pembayaran berulang kali.
            </p>

            <form onSubmit={handleSimulateDeposit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="number"
                min="50000"
                step="50000"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono focus:outline-none focus:border-amber-400 flex-1"
                placeholder="Nominal deposit (cth: 250000)"
              />
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap"
              >
                Isi Saldo Otomatis (QRIS)
              </button>
            </form>

            {depositSuccess && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-lg text-xs text-emerald-400 font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Simulasi Deposit Saldo Rp {depositAmount.toLocaleString('id-ID')} Berhasil Ditambahkan ke Akun Anda!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
