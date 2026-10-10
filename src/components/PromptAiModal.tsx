import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Terminal, Download, Globe, Rocket, ShieldCheck, Gamepad2, ChevronRight, Layers, FileCode } from 'lucide-react';

interface PromptAiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromptAiModal: React.FC<PromptAiModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'prompt-full' | 'prompt-compact' | 'json' | 'deploy-guide'>('prompt-full');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const fullPromptText = `Buatkan kode lengkap untuk website toko online top up game siap pakai (production-ready) yang modern, responsif untuk layar HP, dan memiliki tampilan serta alur seperti situs VIP Reseller (VIPSELLER).

1. Desain & Antarmuka (UI/UX)
- Tema gelap elegan (Dark Mode) dengan aksen warna cyan modern dan aksen emas (#06b6d4, #0ea5e9, #f59e0b).
- Banner promo di bagian atas (slider/carousel promo dan pengumuman berjalan).
- Grid pilihan game populer dengan kartu interaktif:
  - Mobile Legends: Bang Bang
  - Free Fire
  - PUBG Mobile
  - Genshin Impact
  - Honor of Kings
  - Valorant
  - Pulsa & E-Wallet (DANA, GoPay, OVO, ShopeePay)
- Halaman pemesanan yang terbagi rapi ke dalam 4 langkah:
  - Langkah 1: Masukkan User ID dan Zone ID/Server (lengkap dengan tooltip & panduan gambar cara cek ID di dalam game, serta tombol Verifikasi Akun / Live Nickname Checker).
  - Langkah 2: Pilih Nominal / Item Produk (kategori: Diamond harian, Weekly Diamond Pass, Membership Mingguan/Bulanan, Starlight, Battle Pass) dengan badge harga Reseller VIP dan label Diskon.
  - Langkah 3: Pilih Metode Pembayaran (QRIS Otomatis Real-Time, E-Wallet DANA/GoPay/OVO/ShopeePay, dan Virtual Account Bank BCA/Mandiri/BRI/BNI) lengkap dengan logo dan rincian biaya admin transparan.
  - Langkah 4: Masukkan Nomor WhatsApp untuk pengiriman bukti/nota transaksi, lalu tombol aksi "Beli Sekarang".

2. Struktur Data Produk (Model VIPSELLER)
Sertakan mock data produk JSON lengkap dengan harga Guest vs Harga VIP Reseller:

Mobile Legends:
- 5 Diamonds (Rp 1.500 | VIP: Rp 1.350)
- 12 Diamonds (Rp 3.500 | VIP: Rp 3.150)
- 53 Diamonds (Rp 14.500 | VIP: Rp 13.200)
- 86 Diamonds (Rp 23.000 | VIP: Rp 21.000)
- Weekly Diamond Pass (Rp 27.500 | VIP: Rp 25.300)
- 257 Diamonds (Rp 68.000 | VIP: Rp 62.000)
- 706 Diamonds (Rp 180.000 | VIP: Rp 165.000)

Free Fire:
- 50 Diamonds (Rp 7.000 | VIP: Rp 6.400)
- 70 Diamonds (Rp 9.500 | VIP: Rp 8.800)
- 140 Diamonds (Rp 18.500 | VIP: Rp 17.000)
- 355 Diamonds (Rp 46.000 | VIP: Rp 42.500)
- Membership Mingguan (Rp 29.000 | VIP: Rp 26.500)

Honor of Kings:
- 80 Tokens (Rp 15.000 | VIP: Rp 13.500)
- Weekly Card (Rp 15.000 | VIP: Rp 13.800)
- 240 + 17 Tokens (Rp 46.000 | VIP: Rp 42.000)
- Battle Pass Glory Elite (Rp 78.000 | VIP: Rp 71.500)
- 800 + 95 Tokens (Rp 152.000 | VIP: Rp 139.000)

3. Fitur Transaksi & Fungsionalitas
- Validasi form ketat: Tombol konfirmasi tidak dapat diklik sebelum User ID dan item nominal produk terpilih.
- Pop-up konfirmasi pesanan (modal checkout) yang merinci:
  - Game & Item yang dipilih
  - User ID & Server ID / Zone ID
  - Nickname Pemain yang terverifikasi
  - Metode Pembayaran terpilih & Biaya Layanan
  - Total Harga Akhir
  - Nomor WhatsApp Pembeli
- Halaman Invoice & Instruksi Pembayaran:
  - Kode QRIS dinamis / QR Image
  - Nomor Virtual Account / Rekening tujuan dengan tombol copy
  - Countdown timer batas waktu pembayaran (misal 15 menit)
  - Fitur tombol "Konfirmasi via WhatsApp" otomatis dengan template pesan:
    "Halo admin, saya mau konfirmasi pembayaran order [Nomor Invoice] untuk akun [User ID]"
- Halaman/Fitur "Cek Transaksi" (Lacak Pesanan) berdasarkan Nomor Invoice untuk memantau status pesanan secara real-time (Pending, Diproses, Berhasil).
- Sistem Program Reseller VIP: Level Member, Basic, Gold Reseller, dan Platinum Distributor dengan diskon khusus.

4. Kebutuhan Teknis
- Gunakan React / Next.js dengan TypeScript dan Tailwind CSS.
- Arsitektur state yang bersih dan siap diintegrasikan ke API Provider Produk (seperti Digiflazz / VIP Reseller H2H) dan Payment Gateway (Tripay, Midtrans, atau Tokopay).
- Desain 100% responsif ramah smartphone (Mobile-First) tanpa overflow horizontal.`;

  const compactPromptText = `Buatkan website toko online top up game otomatis (desain ala VIPSELLER) dengan React, TypeScript, dan Tailwind CSS.
Fitur utama:
1. Tema gelap modern dengan aksen cyan/biru & promo banner slider.
2. Grid katalog game: Mobile Legends, Free Fire, Honor of Kings, PUBG Mobile, Genshin Impact, Valorant.
3. Form pemesanan 4 langkah:
   - Langkah 1: Input User ID & Zone ID + cek nickname.
   - Langkah 2: Pilih Nominal Diamond/Pass (MLBB 5 Dm Rp1.500, 12 Dm Rp3.500, 53 Dm Rp14.500, 86 Dm Rp23.000, Weekly Pass Rp27.500, 257 Dm Rp68.000, 706 Dm Rp180.000; FF 50 Dm Rp7.000, 70 Dm Rp9.500, 140 Dm Rp18.500, 355 Dm Rp46.000, Member Mingguan Rp29.000).
   - Langkah 3: Pilih Pembayaran (QRIS, DANA, GoPay, OVO, VA Bank).
   - Langkah 4: Input No. WhatsApp + Tombol Beli.
4. Modal checkout rincian order, halaman invoice QRIS dengan hitung mundur timer, tombol 'Konfirmasi via WhatsApp' (template: 'Halo admin, saya mau konfirmasi pembayaran order [Nomor Invoice] untuk akun [User ID]'), dan fitur Cek Status Pesanan (Lacak Transaksi).`;

  const jsonSample = JSON.stringify({
    products: [
      {
        id: "mlbb",
        name: "Mobile Legends: Bang Bang",
        publisher: "Moonton",
        requiresServerId: true,
        userIdLabel: "User ID",
        serverIdLabel: "Zone ID",
        denominations: [
          { id: "ml-5", name: "5 Diamonds", basePrice: 1500, vipPrice: 1350 },
          { id: "ml-12", name: "12 Diamonds", basePrice: 3500, vipPrice: 3150 },
          { id: "ml-53", name: "53 Diamonds", basePrice: 14500, vipPrice: 13200 },
          { id: "ml-86", name: "86 Diamonds", basePrice: 23000, vipPrice: 21000 },
          { id: "ml-wpass", name: "Weekly Diamond Pass", basePrice: 27500, vipPrice: 25300 },
          { id: "ml-257", name: "257 Diamonds", basePrice: 68000, vipPrice: 62000 },
          { id: "ml-706", name: "706 Diamonds", basePrice: 180000, vipPrice: 165000 }
        ]
      },
      {
        id: "freefire",
        name: "Free Fire",
        publisher: "Garena",
        requiresServerId: false,
        userIdLabel: "Player ID",
        denominations: [
          { id: "ff-50", name: "50 Diamonds", basePrice: 7000, vipPrice: 6400 },
          { id: "ff-70", name: "70 Diamonds", basePrice: 9500, vipPrice: 8800 },
          { id: "ff-140", name: "140 Diamonds", basePrice: 18500, vipPrice: 17000 },
          { id: "ff-355", name: "355 Diamonds", basePrice: 46000, vipPrice: 42500 },
          { id: "ff-member-w", name: "Membership Mingguan", basePrice: 29000, vipPrice: 26500 }
        ]
      },
      {
        id: "hok",
        name: "Honor of Kings",
        publisher: "Level Infinite",
        requiresServerId: false,
        userIdLabel: "Player ID",
        denominations: [
          { id: "hok-80", name: "80 Tokens", basePrice: 15000, vipPrice: 13500 },
          { id: "hok-wcard", name: "Weekly Card", basePrice: 15000, vipPrice: 13800 },
          { id: "hok-240", name: "240 + 17 Tokens", basePrice: 46000, vipPrice: 42000 },
          { id: "hok-bp", name: "Battle Pass Glory Elite", basePrice: 78000, vipPrice: 71500 },
          { id: "hok-800", name: "800 + 95 Tokens", basePrice: 152000, vipPrice: 139000 }
        ]
      }
    ],
    paymentMethods: [
      { id: "qris", name: "QRIS Real-Time", fee: "0.7%", speed: "Instan 5-30 dtk" },
      { id: "dana", name: "DANA", fee: "Rp 500", speed: "Otomatis 24 Jam" },
      { id: "gopay", name: "GoPay", fee: "Rp 500", speed: "Otomatis 24 Jam" },
      { id: "bca_va", name: "BCA Virtual Account", fee: "Rp 2.000", speed: "Otomatis 24 Jam" }
    ]
  }, null, 2);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([fullPromptText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = "PROMPT_WEBSITE_TOPUP_VIPSELLER.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800/80 bg-neutral-900/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">Prompt Generator AI</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">VIPSELLER READY</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                Teks Prompt AI Pembuat Website Top Up
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

        {/* Tab Navigation */}
        <div className="px-4 pt-3 border-b border-neutral-800/80 bg-neutral-900/30 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('prompt-full')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'prompt-full'
                ? 'bg-neutral-950 text-cyan-400 border-t-2 border-cyan-500 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Prompt Lengkap VIPSELLER</span>
          </button>

          <button
            onClick={() => setActiveTab('prompt-compact')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'prompt-compact'
                ? 'bg-neutral-950 text-cyan-400 border-t-2 border-cyan-500 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Prompt Singkat (Ringkas)</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'json'
                ? 'bg-neutral-950 text-cyan-400 border-t-2 border-cyan-500 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Mock Data Produk JSON</span>
          </button>

          <button
            onClick={() => setActiveTab('deploy-guide')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'deploy-guide'
                ? 'bg-neutral-950 text-emerald-400 border-t-2 border-emerald-500 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Cara Deploy Gratis (GitHub & Vercel)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4">
          {activeTab === 'prompt-full' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-cyan-950/30 border border-cyan-800/50 rounded-xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-xs text-neutral-300 leading-relaxed">
                  <strong className="text-white">Siap Kirim ke AI:</strong> Teks prompt ini dirancang spesifik untuk Google AI Studio, Bolt.new, v0.dev, Lovable, atau Cursor AI. Format produk dan harga persis dengan standar VIPSELLER.
                </div>
              </div>

              <div className="relative group">
                <textarea
                  readOnly
                  value={fullPromptText}
                  rows={14}
                  className="w-full bg-neutral-900/90 text-neutral-200 font-mono text-xs rounded-xl p-4 border border-neutral-800 focus:outline-none focus:border-cyan-500/50 selection:bg-cyan-500/30 leading-relaxed resize-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(fullPromptText, 'full')}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 ${
                      copiedType === 'full'
                        ? 'bg-emerald-500 text-neutral-950 font-bold shadow-lg shadow-emerald-500/20'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold shadow-lg shadow-cyan-500/20'
                    }`}
                  >
                    {copiedType === 'full' ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Prompt Berhasil Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Salin Teks Prompt Lengkap</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadTxt}
                    className="px-3.5 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh .txt</span>
                  </button>
                </div>

                <span className="text-[11px] text-neutral-500 font-mono">
                  {fullPromptText.length} karakter · Model VIPSELLER
                </span>
              </div>
            </div>
          )}

          {activeTab === 'prompt-compact' && (
            <div className="space-y-4">
              <p className="text-xs text-neutral-400">
                Gunakan versi ringkas ini jika platform AI kamu memiliki batas panjang input prompt.
              </p>

              <div className="relative group">
                <textarea
                  readOnly
                  value={compactPromptText}
                  rows={10}
                  className="w-full bg-neutral-900/90 text-neutral-200 font-mono text-xs rounded-xl p-4 border border-neutral-800 focus:outline-none focus:border-cyan-500/50 selection:bg-cyan-500/30 leading-relaxed resize-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleCopy(compactPromptText, 'compact')}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 ${
                    copiedType === 'compact'
                      ? 'bg-emerald-500 text-neutral-950 font-bold shadow-lg'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold shadow-lg'
                  }`}
                >
                  {copiedType === 'compact' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Prompt Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin Prompt Ringkas</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-4">
              <p className="text-xs text-neutral-400">
                Struktur JSON data produk VIPSELLER untuk langsung disematkan ke dalam kode backend atau file data frontend.
              </p>

              <pre className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-300 font-mono text-xs overflow-x-auto max-h-80 selection:bg-cyan-500/30">
                {jsonSample}
              </pre>

              <button
                type="button"
                onClick={() => handleCopy(jsonSample, 'json')}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 ${
                  copiedType === 'json'
                    ? 'bg-emerald-500 text-neutral-950 font-bold'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                }`}
              >
                {copiedType === 'json' ? (
                  <>
                    <Check className="w-4 h-4 text-neutral-950" />
                    <span>JSON Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Data JSON</span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === 'deploy-guide' && (
            <div className="space-y-4 text-xs text-neutral-300">
              <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-emerald-400" />
                  <span>Cara Mengubah Kode Jadi Website Online (100% Gratis)</span>
                </h3>
                <p className="text-neutral-400">
                  Setelah kode selesai dibuat di Google AI Studio atau disimpan di GitHub, ikuti langkah berikut:
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 font-bold flex items-center justify-center shrink-0">1</span>
                    <div>
                      <strong className="text-white">Sinkronkan ke GitHub:</strong>
                      <p className="text-neutral-400 mt-0.5">
                        Di menu AI Studio (pojok atas), klik <em>GitHub sync</em> &gt; <em>Create new repository</em> &gt; Beri nama seperti <code>web-topup-game</code> &gt; Pilih Public &gt; Simpan.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 font-bold flex items-center justify-center shrink-0">2</span>
                    <div>
                      <strong className="text-white">Buka Vercel (vercel.com):</strong>
                      <p className="text-neutral-400 mt-0.5">
                        Buka browser di HP/laptop &gt; Login menggunakan akun GitHub kamu &gt; Klik tombol <strong>Add New Project</strong> &gt; Pilih repo <code>web-topup-game</code> tadi.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 font-bold flex items-center justify-center shrink-0">3</span>
                    <div>
                      <strong className="text-white">Klik Tombol Deploy:</strong>
                      <p className="text-neutral-400 mt-0.5">
                        Tunggu 1 menit. Website kamu langsung aktif online dengan link gratis (contoh: <code>web-topup-game.vercel.app</code>) dan siap dibagikan ke pelanggan untuk transaksi!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-800/80 bg-neutral-900/60 flex items-center justify-between shrink-0">
          <div className="text-xs text-neutral-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Format Resmi VIPSELLER & Payment Gateway Otomatis</span>
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
