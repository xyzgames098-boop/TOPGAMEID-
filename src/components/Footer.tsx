import React from 'react';
import { ShieldCheck, MessageCircle, Clock, Zap } from 'lucide-react';
import { StoreProfile, NewsletterSubscriber } from '../types/topup';
import { NewsletterSubscribe } from './NewsletterSubscribe';

interface FooterProps {
  onScrollTo: (sectionId: string) => void;
  onOpenReseller: () => void;
  onOpenTracker: () => void;
  onOpenComparison?: () => void;
  onOpenOwnerDashboard?: () => void;
  onOpenAuthModal?: () => void;
  onOpenSitemap?: () => void;
  onOpenPromptAi?: () => void;
  storeProfile?: StoreProfile;
  onSubscribedNewsletter?: (sub: NewsletterSubscriber) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onScrollTo,
  onOpenReseller,
  onOpenTracker,
  onOpenComparison,
  onOpenOwnerDashboard,
  onOpenAuthModal,
  onOpenSitemap,
  onOpenPromptAi,
  storeProfile,
  onSubscribedNewsletter,
}) => {
  const storeName = storeProfile?.storeName || 'TOPGAME ID';
  const waNumber = storeProfile?.ownerWhatsApp?.replace(/\D/g, '') || '6281234567890';
  const cleanWa = waNumber.startsWith('0') ? '62' + waNumber.slice(1) : waNumber;

  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 text-neutral-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Newsletter Subscribe Component */}
        <NewsletterSubscribe onSubscribed={onSubscribedNewsletter} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              {storeProfile?.logoType === 'emoji' ? (
                <span className="w-7 h-7 rounded-lg bg-amber-400 text-neutral-950 font-black flex items-center justify-center text-sm shadow-md">
                  {storeProfile.logoValue || '👑'}
                </span>
              ) : storeProfile?.logoType === 'url' && storeProfile.logoValue?.startsWith('http') ? (
                <img
                  src={storeProfile.logoValue}
                  alt="Logo"
                  className="w-7 h-7 rounded-lg object-cover border border-neutral-700 shadow-md"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="w-7 h-7 rounded-lg bg-amber-400 text-neutral-950 font-black flex items-center justify-center text-xs">
                  {storeProfile?.logoValue || 'TG'}
                </span>
              )}
              <span className="text-base font-bold font-display text-white">
                {storeName}
              </span>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed">
              {storeProfile?.tagline || 'Platform top up game otomatis 24 jam tercepat dan termurah se-Indonesia. Melayani pengisian Diamond MLBB, FF, UC PUBG, Pulsa, Saldo E-Wallet, dan Token PLN bergaransi 100% legal.'}
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Garansi 100% Legal & Terpercaya</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
              Layanan Utama
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onScrollTo('katalog')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Top Up Game Populer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('katalog')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Pulsa & Paket Data
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('katalog')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Top Up Saldo E-Wallet
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('katalog')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Token & Tagihan PLN
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTracker}
                  className="hover:text-amber-400 transition-colors"
                >
                  Lacak Pesanan / Cek Transaksi
                </button>
              </li>
              {onOpenComparison && (
                <li>
                  <button
                    onClick={onOpenComparison}
                    className="hover:text-amber-400 transition-colors"
                  >
                    Bandingkan Harga 2 Game
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Program Kemitraan */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
              Kemitraan & Akses Khusus
            </h4>
            <ul className="space-y-2">
              {onOpenAuthModal && (
                <li>
                  <button
                    onClick={onOpenAuthModal}
                    className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <span>✨ Masuk / Daftar Akun Member</span>
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={onOpenReseller}
                  className="hover:text-amber-400 transition-colors"
                >
                  Peluang Reseller Top Up
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenReseller}
                  className="hover:text-amber-400 transition-colors"
                >
                  Level: Basic, Gold, Platinum
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('fitur')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Fitur Sistem 24 Jam
                </button>
              </li>
              {onOpenPromptAi && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenPromptAi}
                    className="hover:text-cyan-400 text-cyan-400/90 font-medium transition-colors flex items-center gap-1.5"
                  >
                    <span>✨ Prompt AI Pembuat Website (VIPSELLER)</span>
                  </button>
                </li>
              )}
              <li>
                {onOpenSitemap ? (
                  <button
                    type="button"
                    onClick={onOpenSitemap}
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-neutral-400 hover:text-white"
                  >
                    <span>🗺️ Sitemap & SEO Google</span>
                  </button>
                ) : (
                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    🗺️ Sitemap XML
                  </a>
                )}
              </li>
              {onOpenOwnerDashboard && (
                <li className="pt-1">
                  <button
                    onClick={onOpenOwnerDashboard}
                    className="text-neutral-500 hover:text-amber-400 font-medium text-[11px] flex items-center gap-1.5 transition-colors"
                    title="Akses Portal Pemilik (Memerlukan PIN Keamanan)"
                  >
                    <span>🔒 Area Pemilik Toko (PIN)</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Bantuan & CS */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
              Bantuan & CS {storeProfile?.csOperatingHours ? '' : '24 Jam'}
            </h4>
            <p className="text-neutral-400 leading-relaxed text-xs mb-3">
              Mengalami kendala saat transaksi? Customer Service siap melayani Anda ({storeProfile?.csOperatingHours || '24 Jam Nonstop'}).
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onScrollTo('bantuan')}
                className="w-full text-left hover:text-amber-400 transition-colors block text-xs"
              >
                Pertanyaan Umum & FAQ
              </button>
              <a
                href={`https://wa.me/${cleanWa}?text=Halo%20Admin%20${encodeURIComponent(storeName)},%20saya%20butuh%20bantuan%20terkait%20pesanan`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 font-semibold rounded-lg transition-colors text-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp CS ({storeProfile?.ownerName || 'Admin'})</span>
              </a>
            </div>
          </div>
        </div>

        {/* Payment Methods Partner Bar */}
        <div className="pt-6 border-t border-neutral-900 space-y-3">
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider text-center sm:text-left">
            Didukung Beragam Metode Pembayaran Resmi
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] font-mono text-neutral-400">
            <span className="px-2 py-1 bg-neutral-900 rounded border border-neutral-800">QRIS</span>
            <span className="px-2 py-1 bg-neutral-900 rounded border border-neutral-800">BCA Virtual Account</span>
            <span className="px-2 py-1 bg-neutral-900 rounded border border-neutral-800">Mandiri VA</span>
            <span className="px-2 py-1 bg-neutral-900 rounded border border-neutral-800">BRI BRIVA</span>
            <span className="px-2 py-1 bg-neutral-900 rounded border border-neutral-800">BNI VA</span>
            <span className="px-2 py-1 bg-neutral-900 rounded border border-neutral-800">DANA</span>
            <span className="px-2 py-1 bg-neutral-900 rounded border border-neutral-800">OVO</span>
            <span className="px-2 py-1 bg-neutral-900 rounded border border-neutral-800">GoPay</span>
            <span className="px-2 py-1 bg-neutral-900 rounded border border-neutral-800">ShopeePay</span>
            <span className="px-2 py-1 bg-neutral-900 rounded border border-neutral-800">Alfamart</span>
            <span className="px-2 py-1 bg-neutral-900 rounded border border-neutral-800">Indomaret</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
          <div>
            &copy; {new Date().getFullYear()} {storeName} ({storeProfile?.ownerName || 'Rahmatullah'}). Seluruh hak cipta dilindungi undang-undang.
          </div>
          <div className="flex items-center gap-3">
            <span>Server Aman SSL 256-Bit</span>
            <span aria-hidden="true">·</span>
            <span>H2H VIP Seller Gateway Connected</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
