import React, { useState } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  Sparkles,
  Gift,
  Copy,
  Check,
  ShieldCheck,
  BellRing,
  AlertCircle,
  Tag,
  Flame,
} from 'lucide-react';
import { NewsletterSubscriber } from '../types/topup';
import {
  addSubscriber,
  WELCOME_PROMO_CODE,
  getStoredSubscribers,
} from '../data/newsletterData';

interface NewsletterSubscribeProps {
  onSubscribed?: (subscriber: NewsletterSubscriber) => void;
  className?: string;
  variant?: 'footer' | 'standalone';
}

const AVAILABLE_TOPICS = [
  { id: 'flash_sale', label: 'Flash Sale & Diskon', icon: Flame },
  { id: 'kode_redeem', label: 'Kode Redeem & Voucher', icon: Gift },
  { id: 'event_game', label: 'Event MLBB & FF', icon: Sparkles },
  { id: 'ewallet_pulsa', label: 'Promo E-Wallet & Pulsa', icon: Tag },
];

export const NewsletterSubscribe: React.FC<NewsletterSubscribeProps> = ({
  onSubscribed,
  className = '',
  variant = 'footer',
}) => {
  const [email, setEmail] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'Flash Sale & Diskon',
    'Kode Redeem & Voucher',
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    email: string;
    isDuplicate: boolean;
    subscriber: NewsletterSubscriber;
  } | null>(null);
  const [copiedVoucher, setCopiedVoucher] = useState(false);
  const [totalSubscribers, setTotalSubscribers] = useState(() => {
    return getStoredSubscribers().length;
  });

  const toggleTopic = (label: string) => {
    if (selectedTopics.includes(label)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter((t) => t !== label));
      }
    } else {
      setSelectedTopics([...selectedTopics, label]);
    }
  };

  const validateEmail = (val: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const clean = email.trim();
    if (!clean) {
      setErrorMsg('Silakan masukkan alamat email Anda.');
      return;
    }

    if (!validateEmail(clean)) {
      setErrorMsg('Format email tidak valid. Gunakan format seperti nama@domain.com');
      return;
    }

    setIsSubmitting(true);

    // Simulate short network latency for polished feel
    setTimeout(() => {
      try {
        const result = addSubscriber(clean, selectedTopics, 'Footer Bar');
        setIsSubmitting(false);
        setSuccessData({
          email: clean,
          isDuplicate: result.isDuplicate,
          subscriber: result.subscriber,
        });
        setTotalSubscribers(result.totalCount);

        if (onSubscribed) {
          onSubscribed(result.subscriber);
        }
      } catch (err) {
        setIsSubmitting(false);
        setErrorMsg('Terjadi kendala saat mendaftar. Silakan coba beberapa saat lagi.');
      }
    }, 450);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(WELCOME_PROMO_CODE);
    setCopiedVoucher(true);
    setTimeout(() => setCopiedVoucher(false), 2200);
  };

  const handleReset = () => {
    setEmail('');
    setErrorMsg(null);
    setSuccessData(null);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800/80 p-5 sm:p-7 shadow-xl shadow-black/40 ${className}`}
    >
      {/* Decorative ambient background lights */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {successData ? (
        /* SUCCESS STATE */
        <div className="relative z-10 space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
                  <span>{successData.isDuplicate ? 'Email Anda Sudah Terdaftar!' : 'Pendaftaran Berhasil!'}</span>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                    VIP Member
                  </span>
                </h4>
                <p className="text-neutral-400 text-xs">
                  {successData.isDuplicate
                    ? `Email ${successData.email} telah terhubung dengan mailing list promosi.`
                    : `Terima kasih telah bergabung! Info promo dan flash sale akan dikirim ke ${successData.email}.`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="text-[11px] text-neutral-400 hover:text-white underline underline-offset-2 shrink-0 transition-colors"
            >
              Daftar Email Lain
            </button>
          </div>

          {/* Reward Voucher Box */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-950/80 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-400/10 text-amber-400 rounded-lg shrink-0">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  Kupon Promo Eksklusif Subscriber Baru
                </div>
                <div className="text-xs text-neutral-300 font-mono flex items-center gap-1.5 mt-0.5">
                  <span className="font-black text-amber-400 text-sm tracking-wider">
                    {WELCOME_PROMO_CODE}
                  </span>
                  <span className="text-neutral-400 text-[11px]">(Diskon 10% Top-Up Game)</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyCode}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shrink-0 ${
                copiedVoucher
                  ? 'bg-emerald-500 text-neutral-950 font-bold'
                  : 'bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold shadow-md shadow-amber-400/20 active:scale-95'
              }`}
            >
              {copiedVoucher ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Kupon Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Kode Kupon</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Privasi Terjaga · Berhenti Langganan Kapan Saja</span>
            </div>
            <span>{totalSubscribers} gamers terdaftar di mailing list</span>
          </div>
        </div>
      ) : (
        /* DEFAULT FORM STATE */
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-semibold mb-2">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Mailing List & Update Promo Eksklusif</span>
              </div>
              <h3 className="text-white font-bold text-base sm:text-lg tracking-tight">
                Dapatkan Info Flash Sale & Kode Voucher Pertama Kali
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm mt-0.5 max-w-2xl leading-relaxed">
                Daftarkan emailmu untuk menerima notifikasi kilat harga miring, kode redeem diamond, dan promo mingguan. Langsung dapatkan kupon diskon 10%!
              </p>
            </div>

            {/* Subscriber stats counter badge */}
            <div className="sm:self-start shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-[11px] text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                <strong className="text-white font-semibold">{totalSubscribers + 3420}+</strong> Gamers
                Berlangganan
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Masukkan alamat email kamu (contoh: kamu@gmail.com)"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-95 text-neutral-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                    <span>Mendaftarkan...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Langganan & Klaim Voucher</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="flex items-center gap-1.5 text-rose-400 text-xs animate-in fade-in duration-150">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Interest Topics Selection */}
            <div className="pt-1">
              <div className="flex items-center gap-2 text-[11px] text-neutral-400 mb-2">
                <span>Pilihan info yang ingin kamu terima:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_TOPICS.map((topic) => {
                  const Icon = topic.icon;
                  const isSelected = selectedTopics.includes(topic.label);
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => toggleTopic(topic.label)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-amber-400/15 border-amber-400/40 text-amber-300'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                      }`}
                    >
                      <Icon className="w-3 h-3 shrink-0" />
                      <span>{topic.label}</span>
                      {isSelected && <Check className="w-3 h-3 text-amber-400 ml-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Security Guarantee & Anti-Spam */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-neutral-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Email 100% aman & terlindungi · Bebas spam · Unsubscribe kapan saja</span>
              </div>
              <div className="flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-neutral-400">Dapatkan kupon diskon 10% instan</span>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
