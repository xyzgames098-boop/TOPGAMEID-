import React from 'react';
import { Search, ShieldCheck, Zap, CreditCard, MessageSquare, Scale, Sparkles } from 'lucide-react';
import { ProductCategory, StoreProfile } from '../types/topup';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  activeCategory: ProductCategory | 'all';
  onCategorySelect: (cat: ProductCategory | 'all') => void;
  onOpenResellerModal: () => void;
  onOpenTracker: () => void;
  onOpenComparison: () => void;
  onOpenPromptAi?: () => void;
  totalTransactionsToday: number;
  storeProfile?: StoreProfile;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategorySelect,
  onOpenResellerModal,
  onOpenTracker,
  onOpenComparison,
  onOpenPromptAi,
  totalTransactionsToday,
  storeProfile,
}) => {
  const storeName = storeProfile?.storeName || 'TOPGAME ID';
  const tagline = storeProfile?.tagline || 'Layanan pengisian voucher game tercepat dengan harga termurah se-Indonesia. Tersedia Diamond MLBB, FF, UC PUBG, Valorant, Token PLN, dan Program Reseller VIP.';

  return (
    <section id="hero" className="relative pt-8 pb-12 overflow-hidden border-b border-neutral-800/80">
      {/* Subtle backdrop ambient glow (disciplined neutrals with amber accents) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-amber-500/5 blur-[120px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Main Headline & Value Proposition */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
            Official Store {storeName} &middot; Garansi 100% Legal
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display text-balance">
            Top Up Game, Pulsa, E-Wallet & Tagihan Otomatis 24 Jam
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {tagline}
          </p>

          {/* Search Bar Input */}
          <div className="pt-2 max-w-xl mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari game atau produk (cth: Mobile Legends, Free Fire, Token PLN, DANA)..."
                className="w-full pl-12 pr-28 py-3.5 text-sm bg-neutral-900 border border-neutral-700/80 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-xl"
              />
              {searchQuery ? (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs text-neutral-400 hover:text-white bg-neutral-800 rounded-md"
                >
                  Reset
                </button>
              ) : (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-500 hidden sm:block">
                  Instan 24 Jam
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Transaction Counter & Ticker Bar */}
        <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Transkasi Hari Ini:</span>
            <span className="font-mono text-amber-400 font-bold tabular-nums">
              {totalTransactionsToday.toLocaleString('id-ID')} Pesanan Berhasil
            </span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-emerald-400 font-medium">Server API 100% Normal</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenComparison}
              className="text-amber-400 hover:text-amber-300 font-medium hover:underline flex items-center gap-1"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Bandingkan Harga</span>
            </button>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <button
              onClick={onOpenResellerModal}
              className="text-neutral-300 hover:text-white font-medium hover:underline"
            >
              Program Reseller
            </button>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <button
              onClick={onOpenTracker}
              className="text-neutral-300 hover:text-white font-medium hover:underline"
            >
              Lacak Invoice
            </button>
            {onOpenPromptAi && (
              <>
                <span aria-hidden="true" className="text-neutral-600">·</span>
                <button
                  onClick={onOpenPromptAi}
                  className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Prompt AI VIPSELLER</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* 4 Trust Feature Pillars (Spatial Math & Adjacency) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-2">
          <div className="p-4 bg-neutral-900/40 border border-neutral-800 rounded-xl space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-sm font-semibold text-white">Transaksi Otomatis 24 Jam</div>
            <div className="text-xs text-neutral-400">
              Sistem robotik tanpa antri panjang, pesanan langsung masuk detikan ke akun game Anda.
            </div>
          </div>

          <div className="p-4 bg-neutral-900/40 border border-neutral-800 rounded-xl space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-sky-400/10 text-sky-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="text-sm font-semibold text-white">Metode Pembayaran Lengkap</div>
            <div className="text-xs text-neutral-400">
              Scan QRIS semua e-wallet, Virtual Account BCA, BRI, Mandiri, BNI, dan gerai retail.
            </div>
          </div>

          <div className="p-4 bg-neutral-900/40 border border-neutral-800 rounded-xl space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="text-sm font-semibold text-white">Notifikasi WhatsApp Instan</div>
            <div className="text-xs text-neutral-400">
              Bukti pembayaran, rincian nota, dan kode token langsung terkirim otomatis ke WA Anda.
            </div>
          </div>

          <div className="p-4 bg-neutral-900/40 border border-neutral-800 rounded-xl space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-purple-400/10 text-purple-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-sm font-semibold text-white">Garansi Dana Kembali</div>
            <div className="text-xs text-neutral-400">
              100% jaminan saldo kembali utuh jika pengiriman produk mengalami kendala server.
            </div>
          </div>
        </div>

        {/* Category Filter Tabs (Interactive Segmented Control Buttons) */}
        <div className="pt-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => onCategorySelect('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-amber-400 text-neutral-950 font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              Semua Layanan (32+)
            </button>
            <button
              onClick={() => onCategorySelect('game')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === 'game'
                  ? 'bg-amber-400 text-neutral-950 font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              🎮 Top Up Game (17 Game)
            </button>
            <button
              onClick={() => onCategorySelect('pulsa')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === 'pulsa'
                  ? 'bg-amber-400 text-neutral-950 font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              📱 Pulsa & Paket Data
            </button>
            <button
              onClick={() => onCategorySelect('ewallet')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === 'ewallet'
                  ? 'bg-amber-400 text-neutral-950 font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              💳 E-Wallet & Saldo Digital
            </button>
            <button
              onClick={() => onCategorySelect('tagihan')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === 'tagihan'
                  ? 'bg-amber-400 text-neutral-950 font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              ⚡ Tagihan PLN & Voucher
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
