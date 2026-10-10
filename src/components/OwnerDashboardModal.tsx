import React, { useState, useMemo } from 'react';
import { StoreProfile, Transaction, ProductItem, NewsletterSubscriber, VipSellerConfig } from '../types/topup';
import { SearchTrends } from './SearchTrends';
import { VipSellerManager } from './VipSellerManager';
import { SalesAnalytics } from './SalesAnalytics';
import {
  getStoredSubscribers,
  saveStoredSubscribers,
  addSubscriber,
  removeSubscriber,
  exportSubscribersToCsv,
  WELCOME_PROMO_CODE,
} from '../data/newsletterData';
import {
  X,
  Store,
  CreditCard,
  BellRing,
  TrendingUp,
  Package,
  Settings,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Sparkles,
  DollarSign,
  Clock,
  Smartphone,
  Eye,
  RefreshCw,
  Flame,
  Search,
  Mail,
  Copy,
  Check,
  Download,
  Trash2,
  Users,
  Gift,
  Send,
  Link2,
  Share2,
  Lock,
  KeyRound,
  ShieldAlert,
  Rocket,
  Zap,
  Globe,
  HelpCircle,
  ArrowUpRight,
  Wallet,
  ChevronRight,
  BarChart3,
  QrCode,
  Upload,
} from 'lucide-react';

interface OwnerDashboardModalProps {
  storeProfile: StoreProfile;
  transactions: Transaction[];
  productsCatalog: ProductItem[];
  vipSellerConfig?: VipSellerConfig;
  onSaveProfile: (updatedProfile: StoreProfile) => void;
  onSaveVipSellerConfig?: (config: VipSellerConfig) => void;
  onSyncVipSellerCatalog?: (updatedCatalog: ProductItem[], config: VipSellerConfig) => void;
  onUpdateTransactionStatus: (txId: string, status: Transaction['status']) => void;
  onResetToDefault: () => void;
  onClose: () => void;
  onLockDashboard?: () => void;
  onOpenInvoice?: (tx: Transaction) => void;
  onSelectProduct?: (productId: string) => void;
  onOpenStorefrontSearch?: (query: string) => void;
  onOpenSitemap?: () => void;
}

export const OwnerDashboardModal: React.FC<OwnerDashboardModalProps> = ({
  storeProfile,
  transactions,
  productsCatalog,
  vipSellerConfig,
  onSaveProfile,
  onSaveVipSellerConfig,
  onSyncVipSellerCatalog,
  onUpdateTransactionStatus,
  onResetToDefault,
  onClose,
  onLockDashboard,
  onOpenInvoice,
  onSelectProduct,
  onOpenStorefrontSearch,
  onOpenSitemap,
}) => {
  const [formData, setFormData] = useState<StoreProfile>({ ...storeProfile });
  const [activeTab, setActiveTab] = useState<
    'golive' | 'analytics' | 'vipseller' | 'profil' | 'rekening' | 'pengumuman' | 'keuangan' | 'tren' | 'newsletter' | 'pesanan' | 'kontrol'
  >('golive');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [orderFilter, setOrderFilter] = useState<'all' | Transaction['status']>('all');

  // Newsletter mailing list state
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(() => getStoredSubscribers());
  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [newManualEmail, setNewManualEmail] = useState('');
  const [manualAddError, setManualAddError] = useState<string | null>(null);
  const [manualAddSuccess, setManualAddSuccess] = useState<string | null>(null);
  const [copiedEmailsNotice, setCopiedEmailsNotice] = useState(false);
  const [copiedTemplateNotice, setCopiedTemplateNotice] = useState(false);

  const [copiedStoreUrl, setCopiedStoreUrl] = useState(false);
  const [copiedGameId, setCopiedGameId] = useState<string | null>(null);

  const publicStoreUrl = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://ais-pre-xiqsshz3gdolqtftzuvjii-902424592462.asia-east1.run.app';

  const handleCopyStoreUrl = () => {
    try {
      navigator.clipboard.writeText(publicStoreUrl);
      setCopiedStoreUrl(true);
      setTimeout(() => setCopiedStoreUrl(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyGameUrl = (gameId: string) => {
    try {
      const url = `${publicStoreUrl}/?game=${gameId}`;
      navigator.clipboard.writeText(url);
      setCopiedGameId(gameId);
      setTimeout(() => setCopiedGameId(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeMsg(null);
    const clean = newPinInput.trim();
    if (!clean || clean.length < 4) {
      setPinChangeMsg({ type: 'error', text: 'PIN baru minimal harus 4-6 digit angka.' });
      return;
    }
    if (clean !== confirmPinInput.trim()) {
      setPinChangeMsg({ type: 'error', text: 'Konfirmasi PIN tidak cocok dengan PIN baru!' });
      return;
    }
    setFormData((prev) => ({ ...prev, ownerPin: clean }));
    setPinChangeMsg({
      type: 'success',
      text: `PIN Keamanan Pemilik berhasil diubah menjadi "${clean}". Klik tombol "Simpan Pengaturan" di bawah untuk mengaktifkan permanen.`,
    });
    setNewPinInput('');
    setConfirmPinInput('');
  };

  const handleManualAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    setManualAddError(null);
    setManualAddSuccess(null);
    const clean = newManualEmail.trim().toLowerCase();
    if (!clean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setManualAddError('Alamat email tidak valid');
      return;
    }
    const res = addSubscriber(clean, ['Flash Sale & Diskon', 'Promo VIP'], 'Dasbor Pemilik');
    const updated = getStoredSubscribers();
    setSubscribers(updated);
    setNewManualEmail('');
    setManualAddSuccess(res.isDuplicate ? `Email ${clean} sudah ada di daftar.` : `Berhasil menambahkan ${clean}`);
    setTimeout(() => setManualAddSuccess(null), 3000);
  };

  const handleDeleteSubscriber = (id: string) => {
    removeSubscriber(id);
    setSubscribers(getStoredSubscribers());
  };

  const handleCopyAllEmails = () => {
    const emailList = subscribers.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(emailList);
    setCopiedEmailsNotice(true);
    setTimeout(() => setCopiedEmailsNotice(false), 2500);
  };

  const handleExportCsv = () => {
    const csvContent = exportSubscribersToCsv(subscribers);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `mailing_list_topgame_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyBroadcastTemplate = () => {
    const template = `Halo Sahabat Gamers!\n\nAda Flash Sale Spesial dan Promo Kejutan di ${formData.storeName || 'TOPGAME ID'}!\nGunakan kode voucher: ${WELCOME_PROMO_CODE} untuk mendapatkan potongan harga spesial top up game favoritmu.\n\nKunjungi website kami sekarang juga:\nhttps://ais-dev-xiqsshz3gdolqtftzuvjii-902424592462.asia-east1.run.app\n\nSalam hangat,\nAdmin ${formData.ownerName || 'TOPGAME'}`;
    navigator.clipboard.writeText(template);
    setCopiedTemplateNotice(true);
    setTimeout(() => setCopiedTemplateNotice(false), 2500);
  };

  // Financial Analytics Calculations
  const stats = useMemo(() => {
    const totalTransactions = transactions.length;
    const successfulTx = transactions.filter((t) => t.status === 'SUKSES');
    const pendingTx = transactions.filter((t) => t.status === 'MENUNGGU_PEMBAYARAN');
    const processingTx = transactions.filter((t) => t.status === 'MEMPROSES');
    const failedTx = transactions.filter((t) => t.status === 'GAGAL');

    const totalRevenue = successfulTx.reduce((sum, t) => sum + t.totalPrice, 0);
    // Estimated profit margin (approx 4.5% - 7% from turnover)
    const estimatedProfit = Math.round(totalRevenue * 0.055);

    return {
      totalCount: totalTransactions,
      successCount: successfulTx.length,
      pendingCount: pendingTx.length,
      processingCount: processingTx.length,
      failedCount: failedTx.length,
      totalRevenue,
      estimatedProfit,
      successRate: totalTransactions > 0 ? Math.round((successfulTx.length / totalTransactions) * 100) : 100,
    };
  }, [transactions]);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    if (orderFilter === 'all') return transactions;
    return transactions.filter((t) => t.status === orderFilter);
  }, [transactions, orderFilter]);

  const handleSave = () => {
    onSaveProfile(formData);
    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSaveSuccessMsg(false);
    }, 2800);
  };

  const handleApplyPresetEmoji = (emoji: string) => {
    setFormData((prev) => ({
      ...prev,
      logoType: 'emoji',
      logoValue: emoji,
    }));
  };

  const handleApplyColorPreset = (color: StoreProfile['accentColor']) => {
    setFormData((prev) => ({
      ...prev,
      accentColor: color,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 bg-neutral-900/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-neutral-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                  Dasbor Khusus Pemilik Toko
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Owner Area
                </span>
                {formData.storeStatus === 'open' && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-800 hidden sm:inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Toko Online
                  </span>
                )}
                {formData.storeStatus === 'closed' && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-rose-950/70 text-rose-400 border border-rose-800 hidden sm:inline">
                    Toko Tutup
                  </span>
                )}
                {formData.storeStatus === 'maintenance' && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-950/70 text-amber-400 border border-amber-800 hidden sm:inline">
                    Maintenance
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400">
                Atur nama brand, logo, kontak pemilik, rekening pencairan, dan kelola transaksi pesanan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onLockDashboard && (
              <button
                type="button"
                onClick={onLockDashboard}
                className="px-3 py-1.5 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/70 hover:bg-rose-900 border border-rose-800/80 rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                title="Kunci kembali dasbor sehingga memerlukan PIN untuk membukanya"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kunci & Keluar</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              title="Tutup Dasbor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 pb-2 border-b border-neutral-800/80 bg-neutral-950 overflow-x-auto text-xs shrink-0">
          {/* TAB GO-LIVE: PANDUAN JUALAN NYATA */}
          <button
            type="button"
            onClick={() => setActiveTab('golive')}
            className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'golive'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-sm shadow-emerald-500/20'
                : 'text-emerald-400 hover:text-white hover:bg-emerald-950/40 border border-emerald-500/30'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>🚀 Buka Toko Nyata (Go-Live)</span>
            <span className="px-1.5 py-0.5 text-[10px] bg-emerald-400/20 text-emerald-300 font-bold rounded-full">
              PANDUAN
            </span>
          </button>

          {/* TAB SALES ANALYTICS (RECHARTS) */}
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-neutral-950 font-bold shadow-sm shadow-amber-400/20'
                : 'text-amber-400 hover:text-white hover:bg-amber-950/30 border border-amber-500/30'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>📊 Sales Analytics</span>
            <span className="px-1.5 py-0.5 text-[10px] bg-amber-400/20 text-amber-300 font-bold rounded-full">
              RECHARTS
            </span>
          </button>

          {/* TAB VIP SELLER & PROVIDER API */}
          <button
            type="button"
            onClick={() => setActiveTab('vipseller')}
            className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'vipseller'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                : 'text-amber-400 hover:text-white hover:bg-amber-950/30 border border-amber-500/20'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>VIP Seller & Komisi API</span>
            <span className="px-1.5 py-0.5 text-[10px] bg-amber-400/20 text-amber-300 font-bold rounded-full">
              OTOMASI
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profil')}
            className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'profil'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Profil & Logo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rekening')}
            className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'rekening'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Rekening & Pembayaran</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pengumuman')}
            className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pengumuman'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>Pengumuman Banner</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('keuangan')}
            className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'keuangan'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Ringkasan Omzet</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tren')}
            className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'tren'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Tren Pencarian (High Demand)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('newsletter')}
            className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'newsletter'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Mailing List & Promo ({subscribers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pesanan')}
            className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pesanan'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Kelola Pesanan ({transactions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kontrol')}
            className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'kontrol'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Status Toko</span>
          </button>
        </div>

        {/* Modal Main Body (Scrollable) */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* TAB 0A: PANDUAN GO-LIVE / JADIKAN WEBSITE NYATA */}
          {activeTab === 'golive' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Header Hero */}
              <div className="p-6 bg-gradient-to-br from-emerald-950/60 via-neutral-900 to-neutral-900 border border-emerald-500/40 rounded-2xl shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                      <Rocket className="w-3.5 h-3.5" />
                      <span>Panduan Resmi Pemilik Toko</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      Cara Menjadikan Website Ini Toko Nyata & Menghasilkan Uang 💸
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
                      Kabar baik: Website toko Anda <strong className="text-emerald-400">sebenarnya SUDAH ONLINE dan AKTIF</strong> di internet!
                      Siapapun sudah bisa membuka link toko Anda. Ikuti 4 pilar di bawah ini agar Anda bisa langsung menerima pembayaran uang asli dan mengirimkan diamond game otomatis 24 jam.
                    </p>
                  </div>

                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleCopyStoreUrl}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        copiedStoreUrl
                          ? 'bg-emerald-500 text-neutral-950 shadow-lg shadow-emerald-500/30'
                          : 'bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-md shadow-amber-400/20'
                      }`}
                    >
                      {copiedStoreUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedStoreUrl ? 'Link Toko Tersalin!' : 'Salin Link Toko'}</span>
                    </button>
                    <a
                      href={publicStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center justify-center gap-1.5 transition-colors border border-neutral-700"
                    >
                      <span>Buka Tampilan Pembeli</span>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                    </a>
                  </div>
                </div>

                {/* Live Public URL Card */}
                <div className="p-3.5 bg-neutral-950/80 rounded-xl border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                      <Globe className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] text-neutral-400 font-medium">Link Web Publik Saat Ini (Siap Disebarkan ke Pembeli):</p>
                      <p className="text-xs font-mono text-emerald-300 truncate select-all">{publicStoreUrl}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `Halo! Mau top up game murah, cepat, dan 24 jam nonstop? Kunjungi toko resmi kami: ${publicStoreUrl}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <span>Share WA</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Status Kesiapan Toko (Readiness Scorecard) */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Checklist Kesiapan Bisnis Toko Anda</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Item 1: Link Toko */}
                  <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <h5 className="text-xs font-bold text-white">1. Link Website Publik</h5>
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        Website sudah live di server Google Cloud Run 24 jam gratis tanpa perlu sewa hosting lagi.
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 shrink-0">
                      SIAP / AKTIF
                    </span>
                  </div>

                  {/* Item 2: PIN Keamanan */}
                  <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <h5 className="text-xs font-bold text-white">2. Keamanan PIN Pemilik</h5>
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        Dasbor pemilik terkunci dengan PIN rahasia ({formData.ownerPin || '132004'}). Pembeli tidak bisa mengacak-acak pengaturan.
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 shrink-0">
                      TERKUNCI AMAN
                    </span>
                  </div>

                  {/* Item 3: Rekening Penerima Uang */}
                  <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            formData.bankAccountNumber || formData.ewalletNumber ? 'bg-emerald-400' : 'bg-amber-400'
                          }`}
                        />
                        <h5 className="text-xs font-bold text-white">3. Rekening & QRIS Pemilik</h5>
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        {formData.bankAccountNumber
                          ? `Uang pembeli akan masuk ke: ${formData.bankName} (${formData.bankAccountNumber}) a.n ${formData.bankAccountHolder}.`
                          : 'Nomor rekening bank atau e-wallet belum dimasukkan. Masukkan sekarang agar pembeli bisa transfer uang.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('rekening')}
                        className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold underline inline-flex items-center gap-1 pt-1"
                      >
                        <span>Ubah / Lengkapi Rekening Anda</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        formData.bankAccountNumber
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {formData.bankAccountNumber ? 'TERPASANG' : 'PERIKSA'}
                    </span>
                  </div>

                  {/* Item 4: Provider VIP Seller */}
                  <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            formData.vipSellerConfig?.isConnected ? 'bg-emerald-400' : 'bg-amber-400'
                          }`}
                        />
                        <h5 className="text-xs font-bold text-white">4. Otomasi API VIP Seller</h5>
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        {formData.vipSellerConfig?.isConnected
                          ? `H2H terhubung. Saldo modal: Rp ${Number(
                              formData.vipSellerConfig.balance || 0
                            ).toLocaleString('id-ID')}. Pesanan diamond diproses otomatis.`
                          : 'Hubungkan API Key VIP Seller agar diamond dikirim otomatis saat pembeli selesai membayar.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('vipseller')}
                        className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold underline inline-flex items-center gap-1 pt-1"
                      >
                        <span>Atur API & Margin Keuntungan</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        formData.vipSellerConfig?.isConnected
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {formData.vipSellerConfig?.isConnected ? 'OTOMATIS AKTIF' : 'ATUR API'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Diagram Alur Bisnis & Uang Masuk */}
              <div className="p-5 bg-neutral-900/40 border border-neutral-800 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span>Bagaimana Alur Duit Masuk ke Rekening Anda?</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1.5 relative">
                    <span className="w-5 h-5 rounded-full bg-neutral-800 text-amber-400 font-bold text-xs flex items-center justify-center">
                      1
                    </span>
                    <h6 className="text-xs font-bold text-white">Pembeli Checkout</h6>
                    <p className="text-[11px] text-neutral-400 leading-normal">
                      Pembeli memilih diamond game (misal MLBB 86 Diamond seharga Rp 20.000) dan memasukkan User ID game.
                    </p>
                  </div>

                  <div className="p-3.5 bg-neutral-950 rounded-xl border border-emerald-500/30 space-y-1.5 relative">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 font-bold text-xs flex items-center justify-center">
                      2
                    </span>
                    <h6 className="text-xs font-bold text-emerald-300">Uang Masuk ke Anda</h6>
                    <p className="text-[11px] text-neutral-400 leading-normal">
                      Pembeli membayar Rp 20.000 via QRIS / Bank Anda. <strong>Uang 100% langsung masuk ke rekening Anda pribadi!</strong>
                    </p>
                  </div>

                  <div className="p-3.5 bg-neutral-950 rounded-xl border border-sky-500/30 space-y-1.5 relative">
                    <span className="w-5 h-5 rounded-full bg-sky-950 text-sky-400 font-bold text-xs flex items-center justify-center">
                      3
                    </span>
                    <h6 className="text-xs font-bold text-sky-300">Diamond Otomatis Masuk</h6>
                    <p className="text-[11px] text-neutral-400 leading-normal">
                      Sistem H2H VIP Seller memotong modal (misal modal distributor Rp 18.000) dan diamond langsung masuk ke akun pembeli dalam 1-3 detik.
                    </p>
                  </div>

                  <div className="p-3.5 bg-neutral-950 rounded-xl border border-amber-500/40 space-y-1.5 relative bg-gradient-to-br from-amber-950/20 to-neutral-950">
                    <span className="w-5 h-5 rounded-full bg-amber-950 text-amber-400 font-bold text-xs flex items-center justify-center">
                      4
                    </span>
                    <h6 className="text-xs font-bold text-amber-300">Untung Bersih Anda</h6>
                    <p className="text-[11px] text-neutral-400 leading-normal">
                      Selisih Rp 20.000 - Rp 18.000 = <strong>Rp 2.000 adalah laba bersih</strong> yang langsung mengendap di rekening Anda!
                    </p>
                  </div>
                </div>
              </div>

              {/* 4 Langkah Praktis Buka Jualan Nyata */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>4 Langkah Praktis Buka Jualan Nyata Hari Ini</span>
                </h4>

                <div className="space-y-3">
                  {/* Step 1 */}
                  <div className="p-4 bg-neutral-900/70 border border-neutral-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 font-bold text-xs rounded">
                          Langkah 1
                        </span>
                        <h5 className="text-sm font-bold text-white">Masukkan Rekening & QRIS Pribadi Anda</h5>
                      </div>
                      <p className="text-xs text-neutral-400">
                        Pastikan nama pemilik rekening adalah nama Anda agar pembeli tidak ragu dan uang transferan langsung masuk ke kantong Anda.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('rekening')}
                      className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-colors border border-neutral-700"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                      <span>Buka Tab Rekening</span>
                    </button>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 bg-neutral-900/70 border border-neutral-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 font-bold text-xs rounded">
                          Langkah 2
                        </span>
                        <h5 className="text-sm font-bold text-white">Sambungkan VIP Seller & Atur Margin Keuntungan</h5>
                      </div>
                      <p className="text-xs text-neutral-400">
                        Atur berapa persen keuntungan yang ingin Anda ambil (misal 5% - 10% atau flat Rp 1.500/transaksi). Harga jual di website akan otomatis berubah menyesuaikan modal.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('vipseller')}
                      className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-colors border border-neutral-700"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Buka Tab VIP Seller</span>
                    </button>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 bg-neutral-900/70 border border-neutral-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 font-bold text-xs rounded">
                          Langkah 3
                        </span>
                        <h5 className="text-sm font-bold text-white">Sebarkan Link Toko ke Calon Pembeli</h5>
                      </div>
                      <p className="text-xs text-neutral-400">
                        Pasang link di Bio TikTok, Bio Instagram, Status WhatsApp harian, grup mabar Mobile Legends / Free Fire, atau Facebook Gaming.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyStoreUrl}
                      className="px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedStoreUrl ? 'Tersalin!' : 'Salin Link'}</span>
                    </button>
                  </div>

                  {/* Step 4 */}
                  <div className="p-4 bg-neutral-900/70 border border-neutral-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-emerald-400/20 text-emerald-300 font-bold text-xs rounded">
                          Langkah 4 (Opsional)
                        </span>
                        <h5 className="text-sm font-bold text-white">Pasang Domain Keren Pribadi (.com / .id)</h5>
                      </div>
                      <p className="text-xs text-neutral-400">
                        Ingin punya nama website sendiri seperti <code className="text-amber-300 bg-neutral-950 px-1 py-0.5 rounded">topuprahmat.com</code> atau <code className="text-amber-300 bg-neutral-950 px-1 py-0.5 rounded">vortextopup.id</code>?
                        Anda bisa mendeploy ke Vercel atau Netlify secara gratis seumur hidup, lalu pasang domain seharga mulai Rp 15.000/tahun.
                      </p>
                    </div>
                    <a
                      href="https://vercel.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-colors border border-neutral-700"
                    >
                      <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Info Domain Vercel</span>
                    </a>
                  </div>

                  {/* Step 5: SEO Google & Sitemap Generator */}
                  <div className="p-4 bg-gradient-to-r from-emerald-950/30 via-neutral-900 to-neutral-900 border border-emerald-500/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-emerald-400/20 text-emerald-300 font-bold text-xs rounded">
                          SEO Google & Trafik Organik
                        </span>
                        <h5 className="text-sm font-bold text-white">Sitemap Generator & Meta Tag Dinamis</h5>
                      </div>
                      <p className="text-xs text-neutral-400">
                        Setiap produk katalog memiliki meta tag dinamis, Schema.org rating 4.9⭐ dan file <code className="text-emerald-300 bg-neutral-950 px-1 py-0.5 rounded">sitemap.xml</code> yang siap diindeks otomatis oleh Google Search Console.
                      </p>
                    </div>
                    {onOpenSitemap && (
                      <button
                        type="button"
                        onClick={onOpenSitemap}
                        className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold shrink-0 flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-emerald-500/20"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Generator Sitemap XML</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Potensi Penghasilan / Profit Calculator */}
              <div className="p-5 bg-gradient-to-r from-amber-950/30 via-neutral-900 to-emerald-950/30 border border-amber-500/30 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-amber-400" />
                  <h4 className="text-sm font-bold text-white">Simulasi Potensi Keuntungan Bersih Toko Anda</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 bg-neutral-950/80 rounded-xl border border-neutral-800 text-center">
                    <p className="text-[11px] text-neutral-400">20 Transaksi / Hari</p>
                    <p className="text-lg font-black text-amber-400">Rp 1.200.000</p>
                    <p className="text-[10px] text-neutral-500">Estimasi untung bersih / bulan</p>
                  </div>
                  <div className="p-3 bg-neutral-950/80 rounded-xl border border-amber-500/30 text-center">
                    <p className="text-[11px] text-neutral-400">50 Transaksi / Hari</p>
                    <p className="text-lg font-black text-emerald-400">Rp 3.750.000</p>
                    <p className="text-[10px] text-neutral-500">Estimasi untung bersih / bulan</p>
                  </div>
                  <div className="p-3 bg-neutral-950/80 rounded-xl border border-emerald-500/30 text-center">
                    <p className="text-[11px] text-neutral-400">100 Transaksi / Hari</p>
                    <p className="text-lg font-black text-emerald-400">Rp 7.500.000</p>
                    <p className="text-[10px] text-neutral-500">Estimasi untung bersih / bulan</p>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-400 italic text-center">
                  *Kalkulasi berdasarkan rata-rata margin keuntungan Rp 2.000 - Rp 2.500 per transaksi top-up.
                </p>
              </div>
            </div>
          )}

          {/* TAB 0B: SALES ANALYTICS (RECHARTS) */}
          {activeTab === 'analytics' && (
            <SalesAnalytics
              transactions={transactions}
              onSelectProduct={onSelectProduct}
            />
          )}

          {/* TAB 0C: VIP SELLER & OTOMASI H2H API */}
          {activeTab === 'vipseller' && (
            <div className="animate-in fade-in duration-150">
              <VipSellerManager
                config={formData.vipSellerConfig || vipSellerConfig}
                productsCatalog={productsCatalog}
                onSaveConfig={(newConfig) => {
                  const updated = { ...formData, vipSellerConfig: newConfig };
                  setFormData(updated);
                  onSaveProfile(updated);
                  if (onSaveVipSellerConfig) onSaveVipSellerConfig(newConfig);
                }}
                onSyncCatalog={(newCatalog, newConfig) => {
                  const updated = { ...formData, vipSellerConfig: newConfig };
                  setFormData(updated);
                  onSaveProfile(updated);
                  if (onSyncVipSellerCatalog) onSyncVipSellerCatalog(newCatalog, newConfig);
                }}
                onSelectProduct={onSelectProduct}
              />
            </div>
          )}

          {/* TAB 1: PROFIL & LOGO TOKO */}
          {activeTab === 'profil' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Highlight Card: Link Toko Pembeli */}
              <div className="p-4 bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-900 border border-amber-500/30 rounded-xl space-y-3 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 bg-amber-400/10 text-amber-400 rounded-lg border border-amber-400/20 shrink-0">
                      <Link2 className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Link Website Toko Anda (Untuk Pembeli)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                          Online
                        </span>
                      </h4>
                      <p className="text-xs text-neutral-400">
                        Bagikan link ini ke calon pembeli di WhatsApp, Instagram, TikTok, atau Facebook:
                      </p>
                    </div>
                  </div>
                </div>

                {/* URL Display & Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex-1 bg-neutral-950 border border-neutral-700/80 rounded-lg px-3 py-2 text-xs font-mono text-amber-300 truncate select-all flex items-center justify-between">
                    <span className="truncate">{publicStoreUrl}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleCopyStoreUrl}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                        copiedStoreUrl
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/70 shadow-sm'
                          : 'bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold border-amber-400 shadow-sm'
                      }`}
                    >
                      {copiedStoreUrl ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Link Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Link Toko</span>
                        </>
                      )}
                    </button>

                    <a
                      href={publicStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 text-xs font-medium rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors flex items-center justify-center gap-1"
                      title="Buka tampilan pembeli di tab baru"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Buka Web</span>
                    </a>

                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `Halo! Mau top up game murah, cepat & proses otomatis 24 jam? Langsung beli di toko kami: ${publicStoreUrl}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center justify-center gap-1.5"
                      title="Kirim link toko ke WhatsApp calon pembeli"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Share WA</span>
                    </a>
                  </div>
                </div>

                {/* Direct Link Shortcuts per Popular Game */}
                <div className="pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-neutral-300">Link Langsung Game Populer:</span>
                  {[
                    { id: 'mobile-legends', name: 'Mobile Legends' },
                    { id: 'free-fire', name: 'Free Fire' },
                    { id: 'pubg-mobile', name: 'PUBG' },
                    { id: 'genshin-impact', name: 'Genshin' },
                    { id: 'valorant', name: 'Valorant' },
                  ].map((game) => (
                    <button
                      key={game.id}
                      type="button"
                      onClick={() => handleCopyGameUrl(game.id)}
                      className="px-2 py-0.5 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-amber-400 transition-colors font-mono flex items-center gap-1"
                      title={`Klik untuk salin link langsung ${game.name}`}
                    >
                      <span>{game.name}</span>
                      {copiedGameId === game.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-2.5 h-2.5 text-neutral-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="p-4 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pratinjau Tampilan Header Toko Anda</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
                    Realtime Preview
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                  {/* Brand Logo Box Preview */}
                  {formData.logoType === 'emoji' ? (
                    <span className="w-10 h-10 rounded-xl bg-amber-400 text-neutral-950 font-black flex items-center justify-center text-xl shadow-md">
                      {formData.logoValue || '👑'}
                    </span>
                  ) : formData.logoType === 'url' && formData.logoValue.startsWith('http') ? (
                    <img
                      src={formData.logoValue}
                      alt="Logo Toko"
                      className="w-10 h-10 rounded-xl object-cover border border-neutral-700 shadow-md"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-neutral-950 font-black flex items-center justify-center text-sm shadow-md">
                      {formData.logoValue || 'TG'}
                    </span>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="text-base font-bold text-white font-display truncate">
                      {formData.storeName || 'TOPGAME ID'}
                    </div>
                    <div className="text-xs text-neutral-400 truncate">
                      {formData.tagline || 'Solusi Top Up Game Murah & Cepat 24 Jam'}
                    </div>
                  </div>

                  <div className="text-right shrink-0 hidden sm:block">
                    <div className="text-[10px] text-neutral-400">Pemilik Toko</div>
                    <div className="text-xs font-semibold text-amber-400 font-mono">
                      {formData.ownerName || 'Rahmatullah'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields: Identitas Toko */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Identitas & Nama Brand</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-300 font-medium">Nama Toko / Website</label>
                    <input
                      type="text"
                      value={formData.storeName}
                      onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                      placeholder="Contoh: TOPGAME ID, RAHMAT TOPUP"
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700/80 rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-300 font-medium">Slogan / Tagline Toko</label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="Contoh: Solusi Top Up Game Murah & Cepat 24 Jam"
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700/80 rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Logo Editor */}
                <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-3">
                  <div className="text-xs font-medium text-neutral-300">
                    Pilih Gaya & Format Logo Toko
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, logoType: 'initials', logoValue: 'TG' })}
                      className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all ${
                        formData.logoType === 'initials'
                          ? 'border-amber-400 bg-amber-400/10 text-amber-300 font-semibold'
                          : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      Inisial Huruf (TG, RT)
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, logoType: 'emoji', logoValue: '👑' })}
                      className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all ${
                        formData.logoType === 'emoji'
                          ? 'border-amber-400 bg-amber-400/10 text-amber-300 font-semibold'
                          : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      Ikon Emoji Keren
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, logoType: 'url' })}
                      className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all ${
                        formData.logoType === 'url'
                          ? 'border-amber-400 bg-amber-400/10 text-amber-300 font-semibold'
                          : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      URL Gambar Kustom
                    </button>
                  </div>

                  {formData.logoType === 'initials' && (
                    <div className="space-y-1.5 pt-1">
                      <label className="text-xs text-neutral-400">Inisial Huruf (Maksimal 3 Huruf):</label>
                      <input
                        type="text"
                        maxLength={3}
                        value={formData.logoValue}
                        onChange={(e) => setFormData({ ...formData, logoValue: e.target.value.toUpperCase() })}
                        placeholder="TG"
                        className="w-24 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm font-bold font-mono text-center text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  )}

                  {formData.logoType === 'emoji' && (
                    <div className="space-y-2 pt-1">
                      <label className="text-xs text-neutral-400">Pilih Preset Emoji Favorit:</label>
                      <div className="flex flex-wrap items-center gap-2">
                        {['👑', '⚡', '🎮', '💎', '🔥', '🏆', '🚀', '🛡️', '⚔️', '👾', '🌟', '🎯'].map((em) => (
                          <button
                            key={em}
                            type="button"
                            onClick={() => handleApplyPresetEmoji(em)}
                            className={`w-9 h-9 text-lg rounded-lg border flex items-center justify-center transition-transform hover:scale-110 ${
                              formData.logoValue === em
                                ? 'border-amber-400 bg-amber-400/20 shadow-md'
                                : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'
                            }`}
                          >
                            {em}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.logoType === 'url' && (
                    <div className="space-y-1.5 pt-1">
                      <label className="text-xs text-neutral-400">Tautan Gambar Logo (URL HTTPS):</label>
                      <input
                        type="url"
                        value={formData.logoValue}
                        onChange={(e) => setFormData({ ...formData, logoValue: e.target.value })}
                        placeholder="https://example.com/logo-toko.png"
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs font-mono text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  )}
                </div>

                {/* Profil Pemilik Toko */}
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2 pt-2">
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <span>Biodata & Kontak Pemilik</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-300 font-medium">Nama Pemilik Toko</label>
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      placeholder="Rahmatullah"
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-300 font-medium">Email Pemilik / Admin</label>
                    <input
                      type="email"
                      value={formData.ownerEmail}
                      onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                      placeholder="rahmatullah132004@gmail.com"
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-300 font-medium">Nomor WhatsApp CS / Admin</label>
                    <input
                      type="tel"
                      value={formData.ownerWhatsApp}
                      onChange={(e) => setFormData({ ...formData, ownerWhatsApp: e.target.value })}
                      placeholder="081234567890"
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                    <span className="text-[10px] text-neutral-500">
                      Pelanggan akan diarahkan ke nomor ini saat klik "WhatsApp CS" di invoice & footer.
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-300 font-medium">Jam Operasional CS</label>
                    <input
                      type="text"
                      value={formData.csOperatingHours}
                      onChange={(e) => setFormData({ ...formData, csOperatingHours: e.target.value })}
                      placeholder="24 Jam Nonstop (00:00 - 24:00 WIB)"
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REKENING & PEMBAYARAN */}
          {activeTab === 'rekening' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-neutral-300 space-y-1">
                  <div className="font-semibold text-white">Instruksi Pembayaran Invoice Pelanggan</div>
                  <p className="text-neutral-400">
                    Informasi rekening bank dan nomor e-wallet yang Anda atur di bawah ini akan otomatis ditampilkan kepada pelanggan saat mereka menyelesaikan pesanan di Invoice.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>Rekening Bank Utama Toko</span>
                </h3>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span>Rekening Bank Utama Toko</span>
                    </h3>
                    {/* Quick Bank Presets */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-neutral-400">Pilih Cepat:</span>
                      {['SeaBank', 'BCA', 'BRI', 'Mandiri', 'BNI', 'BSI'].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setFormData({ ...formData, bankName: b })}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                            formData.bankName.toLowerCase().includes(b.toLowerCase())
                              ? 'bg-amber-400 text-neutral-950'
                              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-neutral-300">Nama Bank</label>
                      <input
                        type="text"
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        placeholder="SeaBank / BCA / BRI / Mandiri"
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-neutral-300">Nomor Rekening</label>
                      <input
                        type="text"
                        value={formData.bankAccountNumber}
                        onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                        placeholder="Contoh: 901672345379"
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-neutral-300">Atas Nama (Pemilik Rekening)</label>
                      <input
                        type="text"
                        value={formData.bankAccountHolder}
                        onChange={(e) => setFormData({ ...formData, bankAccountHolder: e.target.value })}
                        placeholder="RAHMATULLAH"
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white uppercase focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-amber-400" />
                      <span>E-Wallet & Saldo Digital Toko</span>
                    </h3>
                    {/* Quick E-Wallet Presets */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-neutral-400">Pilih Cepat:</span>
                      {['DANA / QRIS Terpadu', 'GoPay', 'OVO', 'ShopeePay'].map((ew) => (
                        <button
                          key={ew}
                          type="button"
                          onClick={() => setFormData({ ...formData, ewalletName: ew })}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                            formData.ewalletName.toLowerCase().includes(ew.toLowerCase().split(' ')[0])
                              ? 'bg-amber-400 text-neutral-950'
                              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                          }`}
                        >
                          {ew}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-neutral-300">Nama E-Wallet / Saldo</label>
                      <input
                        type="text"
                        value={formData.ewalletName}
                        onChange={(e) => setFormData({ ...formData, ewalletName: e.target.value })}
                        placeholder="DANA / QRIS Terpadu"
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-neutral-300">Nomor Telepon Akun E-Wallet</label>
                      <input
                        type="text"
                        value={formData.ewalletNumber}
                        onChange={(e) => setFormData({ ...formData, ewalletNumber: e.target.value })}
                        placeholder="Contoh: 088214059953"
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-neutral-300">Atas Nama E-Wallet</label>
                      <input
                        type="text"
                        value={formData.ewalletHolder}
                        onChange={(e) => setFormData({ ...formData, ewalletHolder: e.target.value })}
                        placeholder="RAHMATULLAH"
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white uppercase focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* QRIS Otomatis Switch & Upload Barcode Asli */}
                  <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-xs font-semibold text-white flex items-center gap-2">
                          <QrCode className="w-4 h-4 text-amber-400" />
                          <span>Integrasi QRIS Pembayaran Toko</span>
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          Aktifkan pembuatan barcode QRIS instan di layar invoice pelanggan.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, qrisEnabled: !formData.qrisEnabled })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          formData.qrisEnabled ? 'bg-amber-400' : 'bg-neutral-800'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-neutral-950 transition-transform ${
                            formData.qrisEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {formData.qrisEnabled && (
                      <div className="pt-3 border-t border-neutral-800 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs text-neutral-300 font-medium">
                              NMID Toko (National Merchant ID)
                            </label>
                            <input
                              type="text"
                              value={formData.qrisNmid || 'ID10202684920492'}
                              onChange={(e) => setFormData({ ...formData, qrisNmid: e.target.value })}
                              placeholder="ID10202684920492"
                              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white font-mono"
                            />
                            <span className="text-[10px] text-neutral-500">
                              Kode merchant yang tercantum di bawah barcode QRIS Anda.
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs text-neutral-300 font-medium">
                              Upload Gambar Barcode QRIS DANA Asli (Opsional)
                            </label>
                            <div className="flex items-center gap-2">
                              <label className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer transition-colors shrink-0">
                                <Upload className="w-3.5 h-3.5 text-amber-400" />
                                <span>Pilih Foto QRIS</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = () => {
                                        setFormData({ ...formData, qrisImageUrl: reader.result as string });
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>
                              {formData.qrisImageUrl && (
                                <button
                                  type="button"
                                  onClick={() => setFormData({ ...formData, qrisImageUrl: undefined })}
                                  className="text-[11px] text-rose-400 hover:underline"
                                >
                                  Hapus Foto
                                </button>
                              )}
                            </div>
                            <span className="text-[10px] text-neutral-500">
                              {formData.qrisImageUrl ? '✅ Barcode QRIS foto aktif!' : 'Jika belum diupload, barcode QRIS standar otomatis ditampilkan.'}
                            </span>
                          </div>
                        </div>

                        {formData.qrisImageUrl && (
                          <div className="p-2.5 bg-neutral-950 border border-emerald-500/40 rounded-lg flex items-center gap-3">
                            <img
                              src={formData.qrisImageUrl}
                              alt="Preview Barcode QRIS"
                              className="w-16 h-16 object-contain rounded bg-white p-1"
                            />
                            <div className="text-xs text-emerald-400 font-medium">
                              Barcode QRIS DANA/SeaBank Anda siap ditampilkan langsung di invoice pembeli!
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PENGUMUMAN BANNER */}
          {activeTab === 'pengumuman' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-white">
                    Tampilkan Banner Pengumuman Berjalan (Marquee)
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Banner pengumuman akan muncul di paling atas website tepat di atas menu navigasi.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      isAnnouncementActive: !formData.isAnnouncementActive,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.isAnnouncementActive ? 'bg-amber-400' : 'bg-neutral-800'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-neutral-950 transition-transform ${
                      formData.isAnnouncementActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-neutral-300 font-medium">Isi Teks Pengumuman</label>
                <textarea
                  rows={3}
                  value={formData.announcementText}
                  onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
                  placeholder="Ketik teks pengumuman penting untuk pelanggan Anda..."
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700/80 rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Template Pengumuman Cepat */}
              <div className="space-y-2 pt-2">
                <div className="text-xs text-neutral-400">Gunakan Template Pengumuman Cepat:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        isAnnouncementActive: true,
                        announcementText:
                          '⚡ Server VIP Seller H2H Aktif & Otomatis 24 Jam! Proses kilat 1-5 detik, legal 100% dan terpercaya.',
                      })
                    }
                    className="p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-left text-xs text-neutral-300 hover:text-white transition-colors"
                  >
                    <div className="font-semibold text-amber-400">Server Normal 24 Jam</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5 truncate">
                      Server VIP H2H aktif & proses 1-5 detik
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        isAnnouncementActive: true,
                        announcementText:
                          '🔥 FLASH SALE AKBAR HARI INI! Dapatkan diskon hingga 15% untuk Diamond MLBB, FF & UC PUBG!',
                      })
                    }
                    className="p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-left text-xs text-neutral-300 hover:text-white transition-colors"
                  >
                    <div className="font-semibold text-rose-400">Promo Flash Sale</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5 truncate">
                      Diskon promo s.d 15% untuk game populer
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        isAnnouncementActive: true,
                        announcementText:
                          '📢 Info Pemeliharaan Bank BCA & Mandiri: Pembayaran via QRIS & E-Wallet tetap diproses otomatis tanpa kendala.',
                      })
                    }
                    className="p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-left text-xs text-neutral-300 hover:text-white transition-colors"
                  >
                    <div className="font-semibold text-sky-400">Info Pembayaran</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5 truncate">
                      Info perbankan & alternatif QRIS
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: KEUANGAN & OMZET */}
          {activeTab === 'keuangan' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Promo Banner: Open Sales Analytics */}
              <div className="p-4 bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-900 border border-amber-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                    <span>Visualisasi Grafik Recharts Interaktif</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Buka tab Sales Analytics untuk melihat grafik volume transaksi harian, mingguan, dan bulanan dengan Recharts.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('analytics')}
                  className="px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold shrink-0 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Buka Sales Analytics</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Financial Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-1">
                  <div className="text-xs text-neutral-400">Total Omzet Penjualan</div>
                  <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400">
                    Rp {stats.totalRevenue.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] text-neutral-500">Dari pesanan sukses</div>
                </div>

                <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-1">
                  <div className="text-xs text-neutral-400">Estimasi Keuntungan Bersih</div>
                  <div className="text-lg sm:text-xl font-bold font-mono text-amber-400">
                    Rp {stats.estimatedProfit.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] text-neutral-500">Margin laba ~5.5%</div>
                </div>

                <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-1">
                  <div className="text-xs text-neutral-400">Total Transaksi</div>
                  <div className="text-lg sm:text-xl font-bold font-mono text-white">
                    {stats.totalCount} <span className="text-xs text-neutral-400 font-sans">order</span>
                  </div>
                  <div className="text-[10px] text-neutral-500">Seluruh riwayat</div>
                </div>

                <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-1">
                  <div className="text-xs text-neutral-400">Tingkat Keberhasilan</div>
                  <div className="text-lg sm:text-xl font-bold font-mono text-sky-400">
                    {stats.successRate}%
                  </div>
                  <div className="text-[10px] text-neutral-500">{stats.successCount} sukses</div>
                </div>
              </div>

              {/* Breakdown by Status */}
              <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl space-y-3">
                <div className="text-xs font-semibold text-white uppercase tracking-wider">
                  Distribusi Status Pesanan
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
                    <span className="text-emerald-400 font-medium">Sukses</span>
                    <span className="font-mono font-bold text-white">{stats.successCount}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
                    <span className="text-amber-400 font-medium">Pending Bayar</span>
                    <span className="font-mono font-bold text-white">{stats.pendingCount}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
                    <span className="text-sky-400 font-medium">Sedang Proses</span>
                    <span className="font-mono font-bold text-white">{stats.processingCount}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
                    <span className="text-rose-400 font-medium">Gagal / Batal</span>
                    <span className="font-mono font-bold text-white">{stats.failedCount}</span>
                  </div>
                </div>
              </div>

              {/* Highlight Tren Pencarian Produk High Demand */}
              <div className="p-4 bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-900 border border-amber-900/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>Mau Dongkrak Omzet Toko? Cek Game Paling Dicari!</span>
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Ketahui produk dan denominasi dengan volume pencarian tertinggi dari calon pembeli untuk optimalkan promosi dan stok.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('tren')}
                  className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                >
                  <span>Buka Tren Pencarian</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB: TREN PENCARIAN (SEARCH TRENDS) */}
          {activeTab === 'tren' && (
            <SearchTrends
              productsCatalog={productsCatalog}
              onSelectProduct={onSelectProduct}
              onOpenStorefrontSearch={onOpenStorefrontSearch}
            />
          )}

          {/* TAB: MAILING LIST & PROMO NEWSLETTER */}
          {activeTab === 'newsletter' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Header Banner */}
              <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-900 border border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 text-[11px] font-semibold border border-amber-400/20">
                    <Mail className="w-3 h-3 text-amber-400" />
                    <span>Basis Pelanggan & Email Marketing</span>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Mailing List Pelanggan Terdaftar
                  </h3>
                  <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
                    Data email ini otomatis terkumpul dari form <strong>NewsletterSubscribe</strong> di footer website toko. Gunakan untuk broadcast update flash sale, kode voucher, dan penawaran game baru.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyAllEmails}
                    className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-neutral-700 transition-colors"
                  >
                    {copiedEmailsNotice ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Tersalin ke Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Semua Email</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-amber-400/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Stat Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-neutral-900/70 border border-neutral-800 rounded-xl space-y-1">
                  <div className="text-[11px] text-neutral-400">Total Subscribers</div>
                  <div className="text-xl font-bold font-mono text-white flex items-center gap-1.5">
                    <span>{subscribers.length}</span>
                    <span className="text-[11px] font-normal font-sans text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
                      Aktif
                    </span>
                  </div>
                  <div className="text-[10px] text-neutral-500">Terdaftar di sistem</div>
                </div>

                <div className="p-3.5 bg-neutral-900/70 border border-neutral-800 rounded-xl space-y-1">
                  <div className="text-[11px] text-neutral-400">Voucher Selamat Datang</div>
                  <div className="text-sm font-bold font-mono text-amber-400 truncate">
                    {WELCOME_PROMO_CODE}
                  </div>
                  <div className="text-[10px] text-neutral-500">Diskon 10% untuk subscriber</div>
                </div>

                <div className="p-3.5 bg-neutral-900/70 border border-neutral-800 rounded-xl space-y-1">
                  <div className="text-[11px] text-neutral-400">Topik Terpopuler</div>
                  <div className="text-xs font-bold text-sky-400 truncate">
                    Flash Sale & Diskon
                  </div>
                  <div className="text-[10px] text-neutral-500">92% subscriber memilih ini</div>
                </div>

                <div className="p-3.5 bg-neutral-900/70 border border-neutral-800 rounded-xl space-y-1">
                  <div className="text-[11px] text-neutral-400">Status Widget Footer</div>
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live & Terintegrasi</span>
                  </div>
                  <div className="text-[10px] text-neutral-500">Menangkap email pengunjung</div>
                </div>
              </div>

              {/* Manual Add Email & Quick Broadcast Helper */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Manual Add Subscriber Form */}
                <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Tambah Email Manual
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Masukkan email pembeli yang memesan secara langsung via WhatsApp atau toko fisik:
                  </p>
                  <form onSubmit={handleManualAddSubscriber} className="space-y-2">
                    <input
                      type="email"
                      value={newManualEmail}
                      onChange={(e) => {
                        setNewManualEmail(e.target.value);
                        if (manualAddError) setManualAddError(null);
                      }}
                      placeholder="contoh: pelanggan@gmail.com"
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-lg text-xs transition-colors"
                    >
                      + Tambahkan ke Mailing List
                    </button>
                    {manualAddError && (
                      <div className="text-[11px] text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{manualAddError}</span>
                      </div>
                    )}
                    {manualAddSuccess && (
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                        <span>{manualAddSuccess}</span>
                      </div>
                    )}
                  </form>
                </div>

                {/* Broadcast Campaign Template Helper */}
                <div className="lg:col-span-2 p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Template Siap Kirim (Email / WhatsApp Blast)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyBroadcastTemplate}
                      className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                    >
                      {copiedTemplateNotice ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Template Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin Template</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800/80 text-[11px] text-neutral-300 font-mono leading-relaxed whitespace-pre-line">
                    {`Halo Sahabat Gamers!\nAda Flash Sale Spesial di ${formData.storeName || 'TOPGAME ID'}! Gunakan voucher: ${WELCOME_PROMO_CODE} untuk diskon top-up hari ini.`}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Kirim template ini ke email atau grup WhatsApp pelanggan untuk menarik pembelian ulang instan.</span>
                  </div>
                </div>
              </div>

              {/* Filter and Table of Subscribers */}
              <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs font-semibold text-white">
                    Daftar Subscriber ({subscribers.filter((s) => s.email.toLowerCase().includes(subscriberSearch.toLowerCase())).length})
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      value={subscriberSearch}
                      onChange={(e) => setSubscriberSearch(e.target.value)}
                      placeholder="Cari email subscriber..."
                      className="w-full pl-8 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-400">
                        <th className="py-2.5 px-3 font-semibold">Email Pelanggan</th>
                        <th className="py-2.5 px-3 font-semibold">Preferensi Minat</th>
                        <th className="py-2.5 px-3 font-semibold">Sumber</th>
                        <th className="py-2.5 px-3 font-semibold">Tanggal Daftar</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {subscribers
                        .filter((s) => s.email.toLowerCase().includes(subscriberSearch.toLowerCase()))
                        .map((sub) => (
                          <tr key={sub.id} className="hover:bg-neutral-800/40 transition-colors">
                            <td className="py-2.5 px-3 font-mono text-white flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] text-amber-300 font-bold shrink-0">
                                {sub.email.charAt(0).toUpperCase()}
                              </span>
                              <span>{sub.email}</span>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex flex-wrap gap-1">
                                {(sub.preferences || ['Flash Sale & Diskon']).map((pref, i) => (
                                  <span
                                    key={i}
                                    className="px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-300 text-[10px] border border-neutral-800"
                                  >
                                    {pref}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-neutral-400 text-[11px]">
                              {sub.source || 'Footer Bar'}
                            </td>
                            <td className="py-2.5 px-3 text-neutral-400 text-[11px] font-mono whitespace-nowrap">
                              {sub.subscribedAt}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleDeleteSubscriber(sub.id)}
                                className="p-1 text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 rounded transition-colors"
                                title="Hapus dari mailing list"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}

                      {subscribers.filter((s) => s.email.toLowerCase().includes(subscriberSearch.toLowerCase())).length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-neutral-500">
                            Tidak ditemukan email dengan kata kunci pencarian tersebut.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: KELOLA PESANAN PELANGGAN */}
          {activeTab === 'pesanan' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-neutral-400">
                  Total <span className="text-white font-mono font-bold">{filteredOrders.length}</span> pesanan ditampilkan
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                  {[
                    { id: 'all', label: 'Semua' },
                    { id: 'MENUNGGU_PEMBAYARAN', label: 'Pending' },
                    { id: 'MEMPROSES', label: 'Proses' },
                    { id: 'SUKSES', label: 'Sukses' },
                    { id: 'GAGAL', label: 'Gagal' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setOrderFilter(f.id as any)}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        orderFilter === f.id
                          ? 'bg-amber-400 text-neutral-950 font-bold'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="py-12 text-center text-xs text-neutral-500 bg-neutral-900/30 rounded-xl border border-neutral-800">
                  Tidak ada pesanan dengan status "{orderFilter}".
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredOrders.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3.5 bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white text-xs">{tx.invoiceNumber}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                              tx.status === 'SUKSES'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : tx.status === 'MEMPROSES'
                                ? 'bg-sky-950 text-sky-400 border border-sky-800'
                                : tx.status === 'MENUNGGU_PEMBAYARAN'
                                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                : 'bg-rose-950 text-rose-400 border border-rose-800'
                            }`}
                          >
                            {tx.status}
                          </span>
                          <span className="text-neutral-500 text-[10px]">{tx.createdAt}</span>
                        </div>

                        <div className="text-neutral-300">
                          <span className="font-medium text-white">{tx.productName}</span> — {tx.denomName}
                        </div>

                        <div className="flex items-center gap-3 text-neutral-400 text-[11px] font-mono">
                          <span>User ID: {tx.targetUserId}</span>
                          <span>·</span>
                          <span className="text-emerald-400 font-semibold">
                            Rp {tx.totalPrice.toLocaleString('id-ID')}
                          </span>
                          <span>·</span>
                          <span>{tx.paymentMethodName}</span>
                        </div>
                      </div>

                      {/* Quick Status Modifiers */}
                      <div className="flex items-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                        {tx.status !== 'SUKSES' && (
                          <button
                            type="button"
                            onClick={() => onUpdateTransactionStatus(tx.id, 'SUKSES')}
                            className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded font-medium text-[11px] transition-colors"
                            title="Setujui dan selesaikan pesanan"
                          >
                            Set Sukses
                          </button>
                        )}

                        {tx.status !== 'MEMPROSES' && tx.status !== 'SUKSES' && (
                          <button
                            type="button"
                            onClick={() => onUpdateTransactionStatus(tx.id, 'MEMPROSES')}
                            className="px-2.5 py-1 bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800 rounded font-medium text-[11px] transition-colors"
                          >
                            Proses
                          </button>
                        )}

                        {tx.status !== 'GAGAL' && (
                          <button
                            type="button"
                            onClick={() => onUpdateTransactionStatus(tx.id, 'GAGAL')}
                            className="px-2 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/80 rounded font-medium text-[11px] transition-colors"
                          >
                            Batal
                          </button>
                        )}

                        {onOpenInvoice && (
                          <button
                            type="button"
                            onClick={() => onOpenInvoice(tx)}
                            className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[11px] transition-colors"
                            title="Buka Invoice"
                          >
                            Lihat
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: STATUS & KONTROL TOKO */}
          {activeTab === 'kontrol' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="space-y-3">
                <div className="text-xs font-semibold text-white uppercase tracking-wider">
                  Status Operasional Toko
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, storeStatus: 'open' })}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      formData.storeStatus === 'open'
                        ? 'border-emerald-500 bg-emerald-950/40 shadow-lg shadow-emerald-950/30'
                        : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Toko Buka (Aktif 24 Jam)</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Pelanggan dapat melakukan transaksi dan top up game normal seperti biasa.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, storeStatus: 'closed' })}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      formData.storeStatus === 'closed'
                        ? 'border-rose-500 bg-rose-950/40 shadow-lg shadow-rose-950/30'
                        : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-rose-400 text-sm">
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      <span>Tutup Sementara</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Muncul pemberitahuan bahwa toko sedang istirahat sejenak.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, storeStatus: 'maintenance' })}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      formData.storeStatus === 'maintenance'
                        ? 'border-amber-500 bg-amber-950/40 shadow-lg shadow-amber-950/30'
                        : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>Mode Pemeliharaan</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Pemberitahuan pembaruan server atau sinkronisasi stok distributor.
                    </p>
                  </button>
                </div>
              </div>

              {/* Security & Access Protection Section */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/30 via-neutral-900 to-neutral-900 border border-amber-500/30 rounded-xl space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Keamanan & Proteksi PIN Pemilik Toko</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                        Aktif Terlindungi
                      </span>
                    </h4>
                    <p className="text-xs text-neutral-400">
                      Mencegah pembeli atau pihak lain mengakses dasbor, mengubah nomor rekening, atau melihat data transaksi Anda.
                    </p>
                  </div>
                </div>

                {/* Option: Hide button from Navbar for regular buyers */}
                <div className="p-3 bg-neutral-950/80 border border-neutral-800 rounded-xl space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!formData.hideOwnerButtonFromPublic}
                      onChange={(e) =>
                        setFormData({ ...formData, hideOwnerButtonFromPublic: e.target.checked })
                      }
                      className="mt-0.5 w-4 h-4 rounded border-neutral-700 text-amber-500 focus:ring-amber-400 bg-neutral-900"
                    />
                    <div className="text-xs">
                      <div className="font-semibold text-white">
                        Sembunyikan tombol "👑 Dasbor Saya" dari Navbar untuk Pembeli
                      </div>
                      <div className="text-neutral-400 mt-0.5 leading-relaxed">
                        Jika diaktifkan, pembeli biasa tidak akan melihat tombol Dasbor sama sekali. Anda sebagai pemilik dapat membukanya dengan{' '}
                        <strong className="text-amber-400">klik 3x logo toko di kiri atas</strong> atau menambahkan{' '}
                        <code className="text-amber-300 font-mono bg-neutral-900 px-1 py-0.5 rounded">?owner=1</code> di akhir link web Anda.
                      </div>
                    </div>
                  </label>
                </div>

                {/* Change PIN Form */}
                <form onSubmit={handleUpdatePin} className="space-y-3 pt-2 border-t border-neutral-800">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ganti PIN Keamanan Pemilik</span>
                    </div>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      PIN Saat Ini: <strong className="text-amber-400">{formData.ownerPin || '132004'}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">
                        PIN Baru (4-6 digit angka)
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={10}
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value)}
                        placeholder="Contoh: 829104"
                        className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">
                        Ulangi PIN Baru
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={10}
                        value={confirmPinInput}
                        onChange={(e) => setConfirmPinInput(e.target.value)}
                        placeholder="Ulangi PIN yang sama"
                        className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-400 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {pinChangeMsg && (
                    <div
                      className={`text-xs p-2.5 rounded-lg flex items-center gap-1.5 ${
                        pinChangeMsg.type === 'success'
                          ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-300'
                          : 'bg-rose-950/70 border border-rose-800 text-rose-300'
                      }`}
                    >
                      <span>{pinChangeMsg.text}</span>
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={!newPinInput}
                      className="px-3.5 py-1.5 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                      <span>Perbarui PIN</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Reset Default Configuration */}
              <div className="p-4 bg-neutral-900/40 border border-neutral-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-white">Kembalikan Pengaturan Awal</div>
                  <div className="text-[11px] text-neutral-400">
                    Reset nama toko, logo, dan rekening ke data standar pabrik.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Yakin ingin mereset profil toko ke pengaturan awal?')) {
                      onResetToDefault();
                    }
                  }}
                  className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Action Bar */}
        <div className="p-4 sm:p-5 border-t border-neutral-800 bg-neutral-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {saveSuccessMsg ? (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Pengaturan berhasil disimpan dan langsung diterapkan ke seluruh website!</span>
              </span>
            ) : (
              <span className="text-xs text-neutral-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Data profil toko tersimpan aman di browser Anda.</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors"
            >
              Tutup
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Pengaturan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
