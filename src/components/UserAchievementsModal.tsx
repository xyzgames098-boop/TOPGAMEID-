import React from 'react';
import { UserAchievementBadge, MembershipTier } from '../types/topup';
import { MEMBERSHIP_TIER_CONFIG } from '../data/topupData';
import { 
  X, Trophy, CheckCircle2, Lock, Sparkles, 
  Coins, ShoppingBag, ShieldCheck, Star 
} from 'lucide-react';

interface UserAchievementsModalProps {
  currentTier: MembershipTier;
  totalTransactions: number;
  userPoints: number;
  hasReviewed: boolean;
  selectedBadgeId: string;
  onSelectPrimaryBadge: (badgeId: string) => void;
  onClose: () => void;
}

export const UserAchievementsModal: React.FC<UserAchievementsModalProps> = ({
  currentTier,
  totalTransactions,
  userPoints,
  hasReviewed,
  selectedBadgeId,
  onSelectPrimaryBadge,
  onClose,
}) => {
  const tierConfig = MEMBERSHIP_TIER_CONFIG[currentTier];

  // Define badges with live progress calculations
  const badges: (UserAchievementBadge & { progressCurrent: number; progressMax: number })[] = [
    {
      id: 'first-order',
      name: 'Gamer Pemula',
      description: 'Menyelesaikan 1 transaksi pertama di TOPGAME ID',
      icon: '🎮',
      type: 'transactions',
      requirementCount: 1,
      progressCurrent: Math.min(1, totalTransactions),
      progressMax: 1,
      unlocked: totalTransactions >= 1,
      color: 'text-sky-400 bg-sky-950/60 border-sky-800',
    },
    {
      id: 'frequent-shopper',
      name: 'Pro Top-Upper',
      description: 'Menyelesaikan 3 atau lebih transaksi game & pulsa',
      icon: '⚡',
      type: 'transactions',
      requirementCount: 3,
      progressCurrent: Math.min(3, totalTransactions),
      progressMax: 3,
      unlocked: totalTransactions >= 3,
      color: 'text-amber-400 bg-amber-950/60 border-amber-800',
    },
    {
      id: 'sultan-gamer',
      name: 'Sultan Gaming',
      description: 'Menyelesaikan 5 atau lebih transaksi sukses',
      icon: '👑',
      type: 'transactions',
      requirementCount: 5,
      progressCurrent: Math.min(5, totalTransactions),
      progressMax: 5,
      unlocked: totalTransactions >= 5,
      color: 'text-purple-400 bg-purple-950/60 border-purple-800',
    },
    {
      id: 'point-collector',
      name: 'Point Hunter',
      description: 'Mengumpulkan 150 atau lebih Poin Reward Loyalitas',
      icon: '🪙',
      type: 'points',
      requirementCount: 150,
      progressCurrent: Math.min(150, userPoints),
      progressMax: 150,
      unlocked: userPoints >= 150,
      color: 'text-yellow-400 bg-yellow-950/60 border-yellow-800',
    },
    {
      id: 'vip-master',
      name: 'Master Reseller',
      description: 'Mencapai keanggotaan level Basic, Gold, atau Platinum',
      icon: '🏆',
      type: 'tier',
      requirementCount: 1,
      progressCurrent: currentTier !== 'member' ? 1 : 0,
      progressMax: 1,
      unlocked: currentTier !== 'member',
      color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800',
    },
    {
      id: 'community-voice',
      name: 'Kritikus Komunitas',
      description: 'Memberikan ulasan dan rating terverifikasi untuk layanan',
      icon: '⭐',
      type: 'reviews',
      requirementCount: 1,
      progressCurrent: hasReviewed ? 1 : 0,
      progressMax: 1,
      unlocked: hasReviewed,
      color: 'text-rose-400 bg-rose-950/60 border-rose-800',
    },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800/80 bg-neutral-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                Profil & Prestasi Pengguna
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                Sistem Lencana Prestasi (Achievements)
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

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* User Profile Summary Card */}
          <div className="bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-neutral-950 border border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-neutral-950 font-black text-lg flex items-center justify-center shadow-lg">
                TG
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base">Akun Gamer Anda</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${tierConfig.color}`}>
                    {tierConfig.badgeLabel}
                  </span>
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  Lencana Aktif: {unlockedCount} dari {badges.length} Terbuka
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto text-xs font-mono">
              <div className="p-2 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center gap-1.5 text-neutral-300">
                <ShoppingBag className="w-3.5 h-3.5 text-sky-400" />
                <span>{totalTransactions} Transaksi</span>
              </div>
              <div className="p-2 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center gap-1.5 text-amber-400">
                <Coins className="w-3.5 h-3.5" />
                <span>{userPoints} Poin</span>
              </div>
            </div>
          </div>

          {/* Explanation Banner */}
          <div className="p-3.5 bg-neutral-900/60 border border-neutral-800 rounded-xl flex items-center gap-2.5 text-xs text-neutral-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Lencana prestasi yang Anda pilih akan muncul di samping nama saat menulis ulasan pelanggan untuk membangun reputasi dan kepercayaan komunitas.
            </span>
          </div>

          {/* Badges Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-wider">
              <span>Daftar Lencana Prestasi</span>
              <span className="font-mono text-amber-400">{unlockedCount} / {badges.length} Diraih</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {badges.map((badge) => {
                const isSelected = selectedBadgeId === badge.id;

                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                      badge.unlocked
                        ? isSelected
                          ? 'bg-amber-950/20 border-amber-400 shadow-md ring-1 ring-amber-400/50'
                          : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                        : 'bg-neutral-950/40 border-neutral-900 opacity-60'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl" role="img" aria-label={badge.name}>
                            {badge.icon}
                          </span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-bold text-white">{badge.name}</h4>
                              {badge.unlocked ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Lock className="w-3.5 h-3.5 text-neutral-500" />
                              )}
                            </div>
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border inline-block mt-0.5 ${badge.color}`}>
                              {badge.type.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {isSelected && badge.unlocked && (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                            Dipilih
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-neutral-400 leading-relaxed">
                        {badge.description}
                      </p>

                      {/* Progress bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                          <span>Progress</span>
                          <span>
                            {badge.progressCurrent} / {badge.progressMax}
                          </span>
                        </div>
                        <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              badge.unlocked
                                ? 'bg-amber-400'
                                : 'bg-neutral-600'
                            }`}
                            style={{
                              width: `${Math.min(100, (badge.progressCurrent / badge.progressMax) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-neutral-500">
                        {badge.unlocked ? 'Telah Diraih' : 'Belum Terbuka'}
                      </span>

                      {badge.unlocked ? (
                        <button
                          type="button"
                          onClick={() => onSelectPrimaryBadge(badge.id)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                            isSelected
                              ? 'bg-amber-400 text-neutral-950 font-bold'
                              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Sparkles className="w-3 h-3" />
                              <span>Lencana Utama</span>
                            </>
                          ) : (
                            <span>Pilih Tampil</span>
                          )}
                        </button>
                      ) : (
                        <span className="text-[11px] text-neutral-500 italic">Kunci</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-800/80 bg-neutral-900/60 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-neutral-400">
            Lencana otomatis diperbarui setiap kali Anda menyelesaikan transaksi atau mengumpulkan poin.
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
