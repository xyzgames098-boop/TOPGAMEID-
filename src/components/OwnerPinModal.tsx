import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Lock, KeyRound, Eye, EyeOff, CheckCircle2, X, AlertTriangle } from 'lucide-react';

interface OwnerPinModalProps {
  isOpen: boolean;
  ownerPin: string;
  storeName: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const OwnerPinModal: React.FC<OwnerPinModalProps> = ({
  isOpen,
  ownerPin,
  storeName,
  onSuccess,
  onClose,
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setErrorMsg('');
      setIsSuccess(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const effectivePin = ownerPin || '132004';

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin.trim()) {
      setErrorMsg('Mohon masukkan PIN Pemilik.');
      return;
    }

    if (pin.trim() === effectivePin) {
      setErrorMsg('');
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 400);
    } else {
      setErrorMsg('PIN Pemilik salah! Akses ditolak demi keamanan toko.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className={`bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative transition-transform ${
          isShaking ? 'translate-x-[-8px] ring-2 ring-rose-500' : ''
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            {isSuccess ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-400 animate-bounce" />
            ) : (
              <Lock className="w-7 h-7" />
            )}
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/70 text-amber-300 border border-amber-800/80 text-[11px] font-semibold mb-2">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Verifikasi Keamanan Owner</span>
            </div>
            <h3 className="text-xl font-bold text-white font-display">
              Area Khusus Pemilik Toko
            </h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
              Halaman pengaturan, rekening, omzet, dan kontrol {storeName} dilindungi PIN keamanan rahasia.
            </p>
          </div>
        </div>

        {/* Security Guarantee Notice */}
        <div className="mt-4 p-3 bg-neutral-900/80 border border-neutral-800 rounded-xl flex items-start gap-2.5 text-xs text-neutral-300">
          <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-white">Aman dari Pembeli:</strong> Pengaturan toko, nama rekening, dan saldo Anda tidak dapat diutak-atik tanpa memasukkan PIN ini.
          </p>
        </div>

        {/* PIN Input Form */}
        <form onSubmit={handleVerify} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Masukkan PIN Rahasia Anda
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                maxLength={10}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="••••••"
                className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-400 rounded-xl px-4 py-3 text-center text-xl font-mono tracking-widest text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
                title={showPin ? 'Sembunyikan' : 'Tampilkan PIN'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-2 animate-in fade-in">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Quick PIN Hint for Owner */}
          <div className="p-2.5 bg-neutral-900/50 border border-neutral-800/80 rounded-lg text-center">
            <p className="text-[11px] text-neutral-400">
              💡 <span className="text-neutral-300">PIN Bawaan Toko:</span>{' '}
              <button
                type="button"
                onClick={() => setPin(effectivePin)}
                className="text-amber-400 font-mono font-bold hover:underline"
                title="Klik untuk mengisi PIN default"
              >
                {effectivePin}
              </button>{' '}
              <span className="text-neutral-500">(Bisa Anda ubah di Dasbor)</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-semibold text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition-colors"
            >
              Kembali ke Toko
            </button>
            <button
              type="submit"
              disabled={isSuccess}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 ${
                isSuccess
                  ? 'bg-emerald-500 text-neutral-950'
                  : 'bg-amber-400 hover:bg-amber-300 text-neutral-950 active:scale-[0.98]'
              }`}
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Akses Terbuka</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Buka Dasbor</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
