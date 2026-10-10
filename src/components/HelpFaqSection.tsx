import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, ChevronDown, Search, Zap, CreditCard, 
  Crown, ShieldCheck, MessageCircle, ArrowRight 
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'order' | 'payment' | 'tier' | 'security';
  categoryLabel: string;
  question: string;
  answer: string;
}

interface HelpFaqSectionProps {
  onOpenTracker: () => void;
  onOpenTierModal: () => void;
}

export const HelpFaqSection: React.FC<HelpFaqSectionProps> = ({
  onOpenTracker,
  onOpenTierModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  const faqs: FaqItem[] = [
    // ORDER PROCESSING
    {
      id: 'faq-1',
      category: 'order',
      categoryLabel: 'Proses Pesanan',
      question: 'Berapa lama waktu proses pengiriman produk setelah pembayaran?',
      answer:
        'Seluruh pesanan diproses secara otomatis oleh sistem robotik API 24 jam nonstop. Waktu pengiriman rata-rata adalah 5 hingga 30 detik setelah pembayaran terverifikasi. Untuk item seperti token PLN, kode 20-digit stroom langsung ditampilkan seketika di layar nota transaksi dan dikirimkan ke WhatsApp Anda.',
    },
    {
      id: 'faq-2',
      category: 'order',
      categoryLabel: 'Proses Pesanan',
      question: 'Bagaimana jika saya salah memasukkan User ID atau Zone ID game?',
      answer:
        'Sistem kami dilengkapi fitur validasi otomatis yang memeriksa keberadaan ID di server game sebelum pembayaran dilakukan. Namun jika Anda memasukkan ID akun milik orang lain yang valid dan transaksi telah terkirim sukses oleh server game, produk tidak dapat ditarik kembali. Pastikan selalu mengecek nama akun (nickname) yang terverifikasi sebelum menekan tombol bayar.',
    },
    {
      id: 'faq-3',
      category: 'order',
      categoryLabel: 'Proses Pesanan',
      question: 'Bagaimana cara memeriksa status dan melacak pesanan saya?',
      answer:
        'Anda dapat membuka menu "Cek Pesanan" di bilah navigasi atas, lalu masukkan nomor invoice (contoh: INV-TG-...) atau nomor WhatsApp yang Anda gunakan saat pemesanan. Halaman tersebut akan menampilkan status real-time: Menunggu Pembayaran, Memproses, atau Sukses.',
    },

    // PAYMENT METHODS
    {
      id: 'faq-4',
      category: 'payment',
      categoryLabel: 'Metode Pembayaran',
      question: 'Metode pembayaran apa saja yang didukung oleh TOPGAME ID?',
      answer:
        'Kami mendukung beragam metode pembayaran otomatis 24 jam: QRIS All Payment (bisa di-scan dari DANA, GoPay, OVO, ShopeePay, BCA Mobile, Livin by Mandiri, BRImo, dll), Virtual Account Bank (BCA, Mandiri, BRI BRIVA, BNI), Dompet Digital Direct, serta pembayaran tunai melalui gerai Alfamart dan Indomaret di seluruh Indonesia.',
    },
    {
      id: 'faq-5',
      category: 'payment',
      categoryLabel: 'Metode Pembayaran',
      question: 'Berapa lama batas waktu pembayaran untuk kode QRIS dan Virtual Account?',
      answer:
        'Batas waktu pembayaran adalah 15 menit sejak invoice dibuat. Jika dalam 15 menit pembayaran belum diselesaikan, invoice akan otomatis kedaluwarsa demi keamanan sistem dan Anda dapat membuat pesanan baru.',
    },
    {
      id: 'faq-6',
      category: 'payment',
      categoryLabel: 'Metode Pembayaran',
      question: 'Apakah pembayaran menggunakan QRIS dikenakan biaya admin?',
      answer:
        'Metode QRIS di platform kami menggunakan tarif MDR resmi Bank Indonesia yang sangat terjangkau (0.7%), sehingga total tagihan Anda tetap hemat dan transparan tanpa ada biaya tersembunyi yang ditutup-tutupi.',
    },

    // MEMBERSHIP TIERS & RESELLER
    {
      id: 'faq-7',
      category: 'tier',
      categoryLabel: 'Level & Reseller',
      question: 'Apa perbedaan keuntungan antara level Member, Basic, Gold, dan Platinum?',
      answer:
        'Level Member adalah akun reguler gratis dengan harga normal. Level Basic VIP memberikan potongan diskon 3%. Level Gold Reseller memberikan diskon 6% + prioritas server instan (cocok untuk jualan di sekolah/warkop). Level Platinum Distributor memberikan potongan maksimal hingga 9.5% untuk konter, toko online, dan agen pulsa besar.',
    },
    {
      id: 'faq-8',
      category: 'tier',
      categoryLabel: 'Level & Reseller',
      question: 'Apakah pengguna biasa bisa menikmati harga murah reseller tanpa deposit besar?',
      answer:
        'Bisa! Melalui fitur Misi Harian (Daily Mission), Anda dapat mengumpulkan Poin Reward dari check-in dan transaksi pertama hari ini, lalu menukarkan poin tersebut dengan Trial Upgrade Basic VIP, Gold Reseller, atau Platinum selama 24 jam secara 100% gratis.',
    },
    {
      id: 'faq-9',
      category: 'tier',
      categoryLabel: 'Level & Reseller',
      question: 'Apakah saldo deposit reseller memiliki masa kedaluwarsa?',
      answer:
        'Tidak ada kedaluwarsa. Saldo deposit reseller Anda tersimpan aman dan berlaku selamanya tanpa potongan biaya bulanan atau admin pasif. Saldo dapat dipakai bertransaksi kapan saja 24 jam nonstop.',
    },

    // SECURITY & GUARANTEE
    {
      id: 'faq-10',
      category: 'security',
      categoryLabel: 'Garansi & Keamanan',
      question: 'Apakah produk game di sini 100% legal dan aman dari banned atau diamond minus?',
      answer:
        'Ya, 100% legal dan resmi! Seluruh pasokan diamond, UC, dan mata uang game kami bersumber langsung dari distributor resmi dan gateway mitra publisher resmi (Moonton, Garena, Riot Games, Level Infinite, HoYoverse, dll). Akun Anda dijamin aman, anti-minus, dan bebas dari risiko banned.',
    },
    {
      id: 'faq-11',
      category: 'security',
      categoryLabel: 'Garansi & Keamanan',
      question: 'Bagaimana mekanisme Garansi Dana Kembali 100% jika transaksi gagal?',
      answer:
        'Jika terjadi kendala pemeliharaan server game mendadak yang mengakibatkan pesanan gagal diproses dalam waktu 10 menit, sistem kami memberikan jaminan pengembalian dana 100% ke saldo akun Anda atau ditransfer balik tanpa potongan sepeser pun.',
    },
  ];

  // Filtering based on category and search query
  const filteredFaqs = useMemo(() => {
    return faqs.filter((item) => {
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchQ = item.question.toLowerCase().includes(q);
        const matchA = item.answer.toLowerCase().includes(q);
        const matchCat = item.categoryLabel.toLowerCase().includes(q);
        return matchQ || matchA || matchCat;
      }
      return true;
    });
  }, [faqs, activeCategory, searchQuery]);

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="bantuan" className="py-14 border-b border-neutral-800/80 bg-neutral-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
            Pusat Bantuan & Tanya Jawab
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Temukan jawaban cepat seputar pemrosesan pesanan otomatis, metode pembayaran, level membership, dan garansi dana kembali.
          </p>
        </div>

        {/* Search Bar within FAQ */}
        <div className="relative max-w-xl mx-auto">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pertanyaan (cth: berapa lama, salah ID, QRIS, reseller, garansi)..."
            className="w-full pl-10 pr-24 py-2.5 text-xs bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-neutral-400 hover:text-white bg-neutral-800 px-2 py-0.5 rounded"
            >
              Reset
            </button>
          )}
        </div>

        {/* Category Segmented Tabs */}
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'Semua Topik' },
            { id: 'order', label: '⚡ Proses Pesanan' },
            { id: 'payment', label: '💳 Metode Bayar' },
            { id: 'tier', label: '👑 Level & Reseller' },
            { id: 'security', label: '🛡️ Garansi & Legal' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === tab.id
                  ? 'bg-amber-400 text-neutral-950 font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center bg-neutral-900/40 rounded-xl border border-neutral-800 space-y-2">
              <p className="text-sm text-neutral-300 font-medium">
                Tidak ada pertanyaan yang sesuai dengan kata kunci "{searchQuery}".
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="px-4 py-2 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
              >
                Tampilkan Semua Pertanyaan
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;

              return (
                <div
                  key={faq.id}
                  className={`border rounded-xl transition-all overflow-hidden ${
                    isExpanded
                      ? 'bg-neutral-900/90 border-amber-400/60 shadow-md ring-1 ring-amber-400/30'
                      : 'bg-neutral-900/40 hover:bg-neutral-900/70 border-neutral-800'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    aria-expanded={isExpanded}
                    className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-3 transition-colors"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-amber-400/90 uppercase tracking-wider block">
                        {faq.categoryLabel}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                        {faq.question}
                      </h3>
                    </div>

                    <div
                      className={`p-1 rounded-md bg-neutral-800 text-neutral-300 transition-transform duration-200 shrink-0 ${
                        isExpanded ? 'rotate-180 text-amber-400' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-neutral-800/80 pt-3 animate-in fade-in duration-150">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Quick Resolution & CS Support Escalation Banner */}
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-neutral-950 border border-neutral-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                Masih Memiliki Pertanyaan Lain?
              </h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Tim Customer Support kami siap membantu kendala transaksi, verifikasi manual, dan kemitraan reseller 24 jam nonstop setiap hari.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenTracker}
              className="px-3.5 py-2 text-xs font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Lacak Pesanan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin%20TOPGAME%20ID,%20saya%20membutuhkan%20bantuan%20terkait%20pesanan%20saya"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-400/20"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp CS 24 Jam</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
