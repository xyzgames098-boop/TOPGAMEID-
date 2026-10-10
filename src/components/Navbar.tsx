import React, { useState } from 'react';
import { MembershipTier, StoreProfile, BuyerUser } from '../types/topup';
import { MEMBERSHIP_TIER_CONFIG } from '../data/topupData';
import { Coins, Share2, Check, User } from 'lucide-react';

interface NavbarProps {
  currentTier: MembershipTier;
  onOpenTierModal: () => void;
  onOpenOrderTracker: () => void;
  onOpenComparison: () => void;
  onOpenAchievementsModal?: () => void;
  onOpenOwnerDashboard?: () => void;
  onOpenPromptAi?: () => void;
  currentUser?: BuyerUser | null;
  onOpenAuthModal?: () => void;
  onOpenUserProfileModal?: () => void;
  storeProfile?: StoreProfile;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onScrollToSection: (sectionId: string) => void;
  userPoints?: number;
  activeBadgeIcon?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTier,
  onOpenTierModal,
  onOpenOrderTracker,
  onOpenComparison,
  onOpenAchievementsModal,
  onOpenOwnerDashboard,
  onOpenPromptAi,
  currentUser,
  onOpenAuthModal,
  onOpenUserProfileModal,
  storeProfile,
  activeCategory,
  onSelectCategory,
  onScrollToSection,
  userPoints,
  activeBadgeIcon,
}) => {
  const [copiedStoreLink, setCopiedStoreLink] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const tierInfo = MEMBERSHIP_TIER_CONFIG[currentTier];

  const handleCopyStoreLink = () => {
    try {
      const origin = window.location.origin || 'https://ais-pre-xiqsshz3gdolqtftzuvjii-902424592462.asia-east1.run.app';
      navigator.clipboard.writeText(origin);
      setCopiedStoreLink(true);
      setTimeout(() => setCopiedStoreLink(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onScrollToSection('hero');
    setLogoClicks((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        if (onOpenOwnerDashboard) {
          onOpenOwnerDashboard();
        }
        return 0;
      }
      setTimeout(() => setLogoClicks(0), 1500);
      return next;
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark with customizable logo */}
          <a
            href="#"
            onClick={handleLogoClick}
            title={storeProfile?.hideOwnerButtonFromPublic ? "Klik 3x untuk membuka Portal Pemilik" : undefined}
            className="text-lg font-bold tracking-tight text-white font-display whitespace-nowrap shrink-0 hover:text-amber-400 transition-colors flex items-center gap-2"
          >
            {storeProfile?.logoType === 'emoji' ? (
              <span className="w-8 h-8 rounded-lg bg-amber-400 text-neutral-950 font-black flex items-center justify-center text-lg shadow-md shadow-amber-500/20">
                {storeProfile.logoValue || '👑'}
              </span>
            ) : storeProfile?.logoType === 'url' && storeProfile.logoValue?.startsWith('http') ? (
              <img
                src={storeProfile.logoValue}
                alt="Logo Toko"
                className="w-8 h-8 rounded-lg object-cover border border-neutral-700 shadow-md"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 text-neutral-950 font-black flex items-center justify-center text-xs shadow-md shadow-amber-500/20">
                {storeProfile?.logoValue || 'TG'}
              </span>
            )}
            <span>{storeProfile?.storeName || 'TOPGAME ID'}</span>
          </a>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300">
            <button
              onClick={() => {
                onSelectCategory('game');
                onScrollToSection('katalog');
              }}
              className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === 'game' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              Top Up Game
            </button>
            <button
              onClick={() => {
                onSelectCategory('pulsa');
                onScrollToSection('katalog');
              }}
              className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === 'pulsa' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              Pulsa & Paket Data
            </button>
            <button
              onClick={() => {
                onSelectCategory('ewallet');
                onScrollToSection('katalog');
              }}
              className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === 'ewallet' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              E-Wallet
            </button>
            <button
              onClick={onOpenComparison}
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-neutral-300 hover:underline"
            >
              Bandingkan Harga
            </button>
            <button
              onClick={onOpenOrderTracker}
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-neutral-400"
            >
              Cek Pesanan
            </button>
            {onOpenPromptAi && (
              <button
                onClick={onOpenPromptAi}
                className="hover:text-cyan-400 text-cyan-400/90 font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-cyan-950/40 border border-cyan-800/50 hover:bg-cyan-900/40"
                title="Teks Prompt AI Pembuat Website Top Up VIPSELLER"
              >
                <span className="text-cyan-300">✨</span>
                <span>Prompt AI</span>
              </button>
            )}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            {onOpenAchievementsModal && (
              <button
                type="button"
                onClick={onOpenAchievementsModal}
                className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 px-2.5 py-1.5 rounded-lg font-medium transition-colors"
                title="Lencana Prestasi Profil (Achievements)"
              >
                <span>{activeBadgeIcon || '🏆'}</span>
                <span>Lencana</span>
              </button>
            )}

            {userPoints !== undefined && (
              <button
                type="button"
                onClick={() => onScrollToSection('misi-harian')}
                className="hidden sm:flex items-center gap-1.5 text-xs text-amber-400 bg-neutral-900 border border-neutral-800 hover:border-amber-400/50 px-2.5 py-1.5 rounded-lg font-mono tabular-nums font-semibold transition-colors"
                title="Misi Harian & Saldo Poin Reward"
              >
                <Coins className="w-3.5 h-3.5" />
                <span>{userPoints} Pts</span>
              </button>
            )}

            <button
              onClick={onOpenComparison}
              className="md:hidden text-xs text-neutral-300 hover:text-white px-2 py-1.5 rounded-md border border-neutral-800"
              title="Bandingkan Harga"
            >
              Bandingkan
            </button>
            <button
              onClick={onOpenOrderTracker}
              className="md:hidden text-xs text-neutral-300 hover:text-white px-2 py-1.5 rounded-md border border-neutral-800"
            >
              Lacak
            </button>
            {onOpenPromptAi && (
              <button
                onClick={onOpenPromptAi}
                className="md:hidden text-xs text-cyan-300 hover:text-white px-2 py-1.5 rounded-md border border-cyan-800/80 bg-cyan-950/40"
                title="Teks Prompt AI VIPSELLER"
              >
                Prompt AI
              </button>
            )}
            <button
              type="button"
              onClick={handleCopyStoreLink}
              className={`hidden sm:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all ${
                copiedStoreLink
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/70 shadow-sm'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border-neutral-800'
              }`}
              title="Salin Link Web Toko untuk dibagikan ke pembeli"
            >
              {copiedStoreLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Link Tersalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Bagikan Toko</span>
                </>
              )}
            </button>

            {/* Buyer Member Account (Login / Profile) */}
            {currentUser ? (
              <button
                type="button"
                onClick={onOpenUserProfileModal}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 hover:border-amber-400/70 text-xs font-semibold text-white transition-all flex items-center gap-2 shrink-0 shadow-sm"
                title="Buka Profil Member, Poin & ID Game Tersimpan"
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-md object-cover bg-neutral-800 shrink-0"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-md bg-amber-400 text-neutral-950 font-black flex items-center justify-center text-[10px] shrink-0">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="max-w-[75px] sm:max-w-[110px] truncate">{currentUser.name}</span>
              </button>
            ) : onOpenAuthModal ? (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-amber-400 text-xs font-semibold text-neutral-200 hover:text-white transition-all flex items-center gap-1.5 shrink-0"
                title="Masuk atau Daftar Akun Member Pembeli"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Masuk / Daftar</span>
              </button>
            ) : null}

            <button
              onClick={onOpenTierModal}
              className="px-3.5 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] rounded-lg transition-all shadow-sm whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <span>Level: {tierInfo.badgeLabel}</span>
              {currentTier !== 'member' && (
                <span className="text-[10px] bg-neutral-950 text-amber-300 font-mono px-1 rounded">
                  -{(tierInfo.discountRate * 100).toFixed(0)}%
                </span>
              )}
            </button>

            {onOpenOwnerDashboard && !storeProfile?.hideOwnerButtonFromPublic && (
              <button
                type="button"
                onClick={onOpenOwnerDashboard}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold text-amber-300 bg-amber-950/70 hover:bg-amber-900/80 border border-amber-600/70 rounded-lg transition-all shadow-sm flex items-center gap-1.5 shrink-0"
                title="Dasbor Khusus Pemilik Toko (Terproteksi PIN)"
              >
                <span>👑</span>
                <span className="hidden sm:inline">Dasbor Saya</span>
                <span className="text-[10px] opacity-80" title="Dilindungi PIN Pemilik">🔒</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
