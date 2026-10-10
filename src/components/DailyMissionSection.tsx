import React, { useState, useEffect } from 'react';
import { 
  DailyMission, TierUpgradeReward, TemporaryUpgradeState, 
  MembershipTier 
} from '../types/topup';
import { MEMBERSHIP_TIER_CONFIG } from '../data/topupData';
import { 
  Coins, CheckCircle2, Award, Zap, Clock, 
  Sparkles, ArrowRight, Check, AlertCircle 
} from 'lucide-react';

interface DailyMissionSectionProps {
  userPoints: number;
  temporaryUpgrade: TemporaryUpgradeState | null;
  hasCompletedTransactionToday: boolean;
  onClaimPoints: (amount: number, missionId: string) => void;
  onRedeemUpgrade: (reward: TierUpgradeReward) => void;
  onScrollToCatalog: () => void;
  onOpenComparison: () => void;
}

export const DailyMissionSection: React.FC<DailyMissionSectionProps> = ({
  userPoints,
  temporaryUpgrade,
  hasCompletedTransactionToday,
  onClaimPoints,
  onRedeemUpgrade,
  onScrollToCatalog,
  onOpenComparison,
}) => {
  // Claim states for missions (can be saved in local storage or session)
  const [claimedMissions, setClaimedMissions] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('topgame_claimed_missions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  // Track if check-in was claimed
  const [checkInDone, setCheckInDone] = useState<boolean>(() => {
    return Boolean(claimedMissions['mission-checkin']);
  });

  // Countdown timer for active temporary upgrade
  const [remainingTimeStr, setRemainingTimeStr] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('topgame_claimed_missions', JSON.stringify(claimedMissions));
  }, [claimedMissions]);

  // Expiration timer effect
  useEffect(() => {
    if (!temporaryUpgrade?.isActive || !temporaryUpgrade.expiresAt) {
      setRemainingTimeStr('');
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const diff = temporaryUpgrade.expiresAt - now;
      if (diff <= 0) {
        setRemainingTimeStr('Kadaluarsa');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setRemainingTimeStr(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [temporaryUpgrade]);

  // Reward tier options
  const upgradeRewards: TierUpgradeReward[] = [
    {
      id: 'reward-basic',
      tier: 'basic',
      title: 'Trial Basic VIP (24 Jam)',
      durationHours: 24,
      pointsCost: 100,
      discountBenefit: 'Diskon 3% Semua Item',
      badgeLabel: 'BASIC',
    },
    {
      id: 'reward-gold',
      tier: 'gold',
      title: 'Trial Gold Reseller (24 Jam)',
      durationHours: 24,
      pointsCost: 200,
      discountBenefit: 'Diskon 6% + Antrian Cepat',
      badgeLabel: 'GOLD',
    },
    {
      id: 'reward-platinum',
      tier: 'platinum',
      title: 'Trial Platinum Agen (24 Jam)',
      durationHours: 24,
      pointsCost: 350,
      discountBenefit: 'Diskon 9.5% Harga Distributor',
      badgeLabel: 'PLATINUM',
    },
  ];

  const handleClaim = (missionId: string, pts: number) => {
    if (claimedMissions[missionId]) return;
    setClaimedMissions((prev) => ({ ...prev, [missionId]: true }));
    if (missionId === 'mission-checkin') {
      setCheckInDone(true);
    }
    onClaimPoints(pts, missionId);
  };

  const activeTierConfig = temporaryUpgrade?.isActive
    ? MEMBERSHIP_TIER_CONFIG[temporaryUpgrade.tier]
    : null;

  return (
    <section id="misi-harian" className="py-10 border-b border-neutral-800/80 bg-neutral-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Program Loyalitas & Gamifikasi
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
              Misi Harian & Hadiah Poin VIP
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
              Selesaikan transaksi pertama hari ini untuk mengumpulkan poin, lalu tukarkan poin dengan upgrade level membership sementara tanpa biaya deposit.
            </p>
          </div>

          {/* Points Display Counter */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-3.5 sm:px-5 flex items-center gap-3 self-start sm:self-auto shadow-md">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
              <Coins className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                Saldo Poin Reward
              </div>
              <div className="text-xl font-black font-mono text-amber-400 tabular-nums">
                {userPoints.toLocaleString('id-ID')} Poin
              </div>
            </div>
          </div>
        </div>

        {/* Active Temporary Upgrade Banner (If active) */}
        {temporaryUpgrade?.isActive && activeTierConfig && (
          <div className="p-4 bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-neutral-900 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-neutral-950 font-black flex items-center justify-center text-sm shadow-md">
                VIP
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    Upgrade Level Sementara Aktif: {activeTierConfig.name}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                    -{(activeTierConfig.discountRate * 100).toFixed(1)}% OFF
                  </span>
                </div>
                <div className="text-xs text-neutral-300">
                  Semua harga di katalog otomatis terpotong diskon level {activeTierConfig.badgeLabel}.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto bg-neutral-950/80 px-3 py-1.5 rounded-xl border border-neutral-800">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-neutral-400">Sisa Durasi:</span>
              <span className="text-xs font-mono font-bold text-amber-400 tabular-nums">
                {remainingTimeStr || '23:59:59'}
              </span>
            </div>
          </div>
        )}

        {/* 2 Columns: Daily Missions on Left, Redeem Upgrade on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Daily Missions Column (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Daftar Misi Harian
            </div>

            {/* Mission 1: Transaksi Pertama Hari Ini (KEY MISSION) */}
            <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-neutral-700 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center text-xs font-bold">
                    🔥
                  </span>
                  <h3 className="text-sm font-bold text-white">
                    Transaksi Pertama Hari Ini
                  </h3>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                    +100 Poin
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Lakukan top up game, isi pulsa, e-wallet, atau token PLN hari ini.
                </p>
              </div>

              <div className="self-start sm:self-auto shrink-0">
                {claimedMissions['mission-first-tx'] ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold px-3 py-1.5 bg-emerald-950/40 rounded-lg border border-emerald-800/60">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sudah Diklaim</span>
                  </div>
                ) : hasCompletedTransactionToday ? (
                  <button
                    type="button"
                    onClick={() => handleClaim('mission-first-tx', 100)}
                    className="px-3.5 py-1.5 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1 shadow-md shadow-amber-400/20"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Klaim +100 Poin</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onScrollToCatalog}
                    className="px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>Top Up Sekarang</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Mission 2: Check-in Harian */}
            <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-neutral-700 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-sky-400/10 text-sky-400 flex items-center justify-center text-xs font-bold">
                    📅
                  </span>
                  <h3 className="text-sm font-bold text-white">
                    Check-in Login Harian
                  </h3>
                  <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800">
                    +25 Poin
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Klaim poin gratis kamu cukup dengan mengunjungi website TOPGAME ID setiap hari.
                </p>
              </div>

              <div className="self-start sm:self-auto shrink-0">
                {checkInDone ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold px-3 py-1.5 bg-emerald-950/40 rounded-lg border border-emerald-800/60">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sudah Check-in</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleClaim('mission-checkin', 25)}
                    className="px-3.5 py-1.5 text-xs font-bold text-neutral-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Check-in Sekarang</span>
                  </button>
                )}
              </div>
            </div>

            {/* Mission 3: Coba Fitur Komparasi Harga */}
            <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-neutral-700 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-purple-400/10 text-purple-400 flex items-center justify-center text-xs font-bold">
                    ⚖️
                  </span>
                  <h3 className="text-sm font-bold text-white">
                    Bandingkan 2 Produk Game
                  </h3>
                  <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
                    +35 Poin
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Gunakan fitur Bandingkan Harga untuk melihat perbedaan harga 3 denom terlaris.
                </p>
              </div>

              <div className="self-start sm:self-auto shrink-0">
                {claimedMissions['mission-comparison'] ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold px-3 py-1.5 bg-emerald-950/40 rounded-lg border border-emerald-800/60">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Selesai (+35)</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenComparison();
                      handleClaim('mission-comparison', 35);
                    }}
                    className="px-3.5 py-1.5 text-xs font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>Coba Komparasi</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Redeem Rewards Column (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Tukar Poin Jadi Level VIP
            </div>

            <div className="space-y-3">
              {upgradeRewards.map((reward) => {
                const canAfford = userPoints >= reward.pointsCost;
                const isCurrentActive =
                  temporaryUpgrade?.isActive && temporaryUpgrade.tier === reward.tier;

                return (
                  <div
                    key={reward.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isCurrentActive
                        ? 'bg-amber-950/30 border-amber-400/80 shadow-md ring-1 ring-amber-400/60'
                        : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{reward.title}</h4>
                          <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800">
                            {reward.badgeLabel}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-400 font-medium">
                          {reward.discountBenefit}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono font-bold text-amber-400 tabular-nums">
                          {reward.pointsCost} Poin
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          Aktif 24 Jam
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-neutral-800 flex items-center justify-between">
                      <span className="text-[11px] text-neutral-400">
                        {canAfford ? 'Poin mencukupi' : `Kurang ${(reward.pointsCost - userPoints)} poin`}
                      </span>

                      <button
                        type="button"
                        onClick={() => onRedeemUpgrade(reward)}
                        disabled={!canAfford || isCurrentActive}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                          isCurrentActive
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-500/30 cursor-default'
                            : canAfford
                            ? 'bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold'
                            : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                        }`}
                      >
                        {isCurrentActive ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Sedang Aktif</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Tukar Sekarang</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
