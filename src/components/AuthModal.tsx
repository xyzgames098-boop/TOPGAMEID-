import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Gift,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { BuyerUser } from '../types/topup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: BuyerUser) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI status
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Handle One-Click Google Authentication
  const handleGoogleLogin = () => {
    setErrorMsg('');
    setLoadingGoogle(true);

    setTimeout(() => {
      setLoadingGoogle(false);
      const googleUser: BuyerUser = {
        id: `usr-g-${Date.now()}`,
        name: name.trim() || 'Gamers ID',
        email: email.trim().includes('@') ? email.trim() : 'rahmatullah132004@gmail.com',
        phone: phone.trim() || '081234567890',
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`,
        authProvider: 'google',
        tier: 'member',
        points: 150, // 100 starter + 50 Google bonus
        joinedAt: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        savedAccounts: [
          {
            gameId: 'mlbb',
            gameName: 'Mobile Legends',
            userId: '84920194',
            serverId: '2045',
            nickname: 'VORTEX_CHAMP',
          },
        ],
      };

      setSuccessMsg(`Berhasil masuk sebagai ${googleUser.email}!`);
      setTimeout(() => {
        onLoginSuccess(googleUser);
      }, 500);
    }, 750);
  };

  // Handle Standard Email/Password Login or Register
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Mohon masukkan alamat email yang valid.');
      return;
    }

    if (!password.trim() || password.length < 6) {
      setErrorMsg('Password minimal 6 karakter.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMsg('Mohon masukkan nama lengkap Anda.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Konfirmasi password tidak cocok.');
        return;
      }
    }

    setLoadingSubmit(true);
    setTimeout(() => {
      setLoadingSubmit(false);
      const buyer: BuyerUser = {
        id: `usr-${Date.now()}`,
        name: mode === 'register' ? name.trim() : email.split('@')[0],
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
        authProvider: 'email',
        tier: 'member',
        points: mode === 'register' ? 100 : 80,
        joinedAt: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      };

      setSuccessMsg(
        mode === 'register'
          ? 'Pendaftaran berhasil! Selamat datang di TOPGAME ID.'
          : 'Berhasil masuk ke akun Anda.'
      );
      setTimeout(() => {
        onLoginSuccess(buyer);
      }, 500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-amber-500/20 blur-2xl pointer-events-none rounded-full" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors z-10"
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="text-center space-y-1 mb-5">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[11px] font-semibold">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Akun Member Pelanggan</span>
          </div>
          <h3 className="text-xl font-bold text-white font-display">
            {mode === 'login' ? 'Masuk ke Akun Anda' : 'Daftar Akun Member Baru'}
          </h3>
          <p className="text-xs text-neutral-400">
            {mode === 'login'
              ? 'Nikmati potongan diskon otomatis, poin cashback, dan auto-fill checkout.'
              : 'Daftar sekarang dan dapatkan bonus 100 Poin Hadiah Selamat Datang!'}
          </p>
        </div>

        {/* Tab Switcher (Masuk vs Daftar) */}
        <div className="flex rounded-xl bg-neutral-900 p-1 border border-neutral-800 mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Masuk Member
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Daftar Baru (+100 Poin)
          </button>
        </div>

        {/* GOOGLE SIGN IN BUTTON */}
        <div className="space-y-3 mb-5">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loadingGoogle || loadingSubmit}
            className="w-full py-2.5 px-4 bg-white hover:bg-neutral-100 active:scale-[0.99] text-neutral-900 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-3 shadow-md border border-neutral-200"
          >
            {loadingGoogle ? (
              <div className="w-4 h-4 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>
              {loadingGoogle ? 'Menghubungkan ke Google...' : 'Lanjutkan dengan Google'}
            </span>
          </button>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-neutral-800" />
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium">
              atau via email
            </span>
            <div className="flex-1 h-px bg-neutral-800" />
          </div>
        </div>

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-medium text-neutral-300 mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium text-neutral-300 mb-1">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
                className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-medium text-neutral-300 mb-1">
                Nomor WhatsApp <span className="text-neutral-500">(Opsional untuk kirim nota)</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812xxxxxxxx"
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-medium text-neutral-300">Password</label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => alert('Fitur reset password: Silakan hubungi CS via WhatsApp untuk verifikasi akun.')}
                  className="text-[10px] text-amber-400 hover:underline"
                >
                  Lupa password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                required
                className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-400 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-medium text-neutral-300 mb-1">
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password di atas"
                  required
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Submit CTA Button */}
          <button
            type="submit"
            disabled={loadingSubmit || loadingGoogle}
            className="w-full mt-2 py-2.5 px-4 bg-amber-400 hover:bg-amber-300 active:scale-[0.99] text-neutral-950 font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
          >
            {loadingSubmit ? (
              <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun Member'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Benefits Footnote */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Garansi 100% Aman</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400 font-medium">
            <Gift className="w-3.5 h-3.5" />
            <span>Bonus Poin & Diskon</span>
          </div>
        </div>
      </div>
    </div>
  );
};
