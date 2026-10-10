import React from 'react';
import { 
  Zap, CreditCard, Wallet, MessageSquare, History, BarChart3, 
  Crown, Percent, Users, Tag, Flame, Star, ShieldCheck 
} from 'lucide-react';

interface SystemFeaturesBannerProps {
  onOpenReseller: () => void;
  onOpenTracker: () => void;
}

export const SystemFeaturesBanner: React.FC<SystemFeaturesBannerProps> = ({
  onOpenReseller,
  onOpenTracker,
}) => {
  const features = [
    {
      icon: Zap,
      title: 'Transaksi Otomatis 24 Jam',
      desc: 'Server robotik API memproses pesanan langsung dalam 5-30 detik tanpa hari libur.',
      accent: 'text-amber-400',
    },
    {
      icon: CreditCard,
      title: 'Pembayaran Otomatis — Beragam Metode',
      desc: 'QRIS All Payment, Virtual Account BCA, BRI, Mandiri, BNI, E-Wallet & Gerai Alfamart/Indomaret.',
      accent: 'text-sky-400',
    },
    {
      icon: Wallet,
      title: 'Deposit Saldo Otomatis',
      desc: 'Isi saldo akun praktis kapan saja untuk checkout kilat 1-klik tanpa perlu scan ulang.',
      accent: 'text-emerald-400',
    },
    {
      icon: MessageSquare,
      title: 'Notifikasi WhatsApp Otomatis',
      desc: 'Pengiriman rincian transaksi, kode SN, dan token PLN langsung ke nomor WhatsApp Anda.',
      accent: 'text-green-400',
    },
    {
      icon: History,
      title: 'Riwayat Transaksi Lengkap',
      desc: 'Lacak riwayat pembelian, cetak ulang struk nota, dan pantau status pengiriman berkala.',
      accent: 'text-indigo-400',
      action: onOpenTracker,
    },
    {
      icon: BarChart3,
      title: 'Laporan Penjualan Real-Time',
      desc: 'Transparansi volume pesanan dan statistik uptime server secara langsung setiap detik.',
      accent: 'text-purple-400',
    },
    {
      icon: Crown,
      title: 'Level: Member, Basic, Gold, Platinum',
      desc: 'Jenjang membership eksklusif dengan privilege khusus bagi pembeli aktif & konter.',
      accent: 'text-yellow-400',
      action: onOpenReseller,
    },
    {
      icon: Percent,
      title: 'Harga Lebih Murah Sesuai Level',
      desc: 'Makin tinggi level akun Anda, makin hemat potongan harga hingga 9.5% per item.',
      accent: 'text-rose-400',
    },
    {
      icon: Users,
      title: 'Program Reseller & Mitra',
      desc: 'Peluang bisnis top up game modal minim untuk warkop, warnet, dan toko online.',
      accent: 'text-blue-400',
      action: onOpenReseller,
    },
    {
      icon: Tag,
      title: 'Kode Diskon & Promo',
      desc: 'Kupon potongan ekstra mingguan dan promo event gajian untuk seluruh pengguna.',
      accent: 'text-teal-400',
    },
    {
      icon: Flame,
      title: 'Flash Sale Setiap Hari',
      desc: 'Diskon kilat produk game pilihan dengan harga termurah berbatas waktu.',
      accent: 'text-orange-400',
    },
    {
      icon: Star,
      title: 'Ulasan & Rating Pelanggan',
      desc: 'Ribuan testimoni nyata dan transparansi rating dari komunitas gamer seluruh Indonesia.',
      accent: 'text-amber-300',
    },
    {
      icon: ShieldCheck,
      title: 'Garansi Dana Kembali Jika Gagal',
      desc: '100% uang kembali otomatis bila terjadi gangguan pengiriman server game.',
      accent: 'text-emerald-300',
    },
  ];

  return (
    <section id="fitur" className="py-14 border-b border-neutral-800/80 bg-neutral-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
            Keunggulan Infrastruktur Sistem
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Fitur Sistem Canggih & Otomatis
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Dirancang khusus untuk kenyamanan para gamer dan kemudahan bisnis para agen reseller di seluruh nusantara.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                onClick={feat.action}
                className={`p-4 bg-neutral-950/70 border border-neutral-800/80 rounded-xl space-y-2.5 transition-all ${
                  feat.action ? 'cursor-pointer hover:border-amber-400/50 hover:bg-neutral-900' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${feat.accent}`} />
                </div>
                <div className="text-sm font-bold text-white leading-tight">
                  {feat.title}
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
