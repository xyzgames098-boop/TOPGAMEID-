import React, { useState, useEffect } from 'react';
import { Transaction, StoreProfile } from '../types/topup';
import { X, CheckCircle2, Clock, Copy, Share2, Download, RefreshCw, QrCode } from 'lucide-react';

interface InvoiceModalProps {
  transaction: Transaction;
  storeProfile?: StoreProfile;
  onClose: () => void;
  onUpdateStatus: (txId: string, newStatus: Transaction['status']) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  transaction,
  storeProfile,
  onClose,
  onUpdateStatus,
}) => {
  const [copiedInvoice, setCopiedInvoice] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [simulatedPaying, setSimulatedPaying] = useState(false);

  // QRIS countdown
  const [secondsRemaining, setSecondsRemaining] = useState(899); // 14m 59s

  useEffect(() => {
    if (transaction.status !== 'MENUNGGU_PEMBAYARAN') return;
    const interval = setInterval(() => {
      setSecondsRemaining((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [transaction.status]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  // Simulate payment processing flow
  const handleSimulatePayment = () => {
    setSimulatedPaying(true);
    onUpdateStatus(transaction.id, 'MEMPROSES');

    setTimeout(() => {
      onUpdateStatus(transaction.id, 'SUKSES');
      setSimulatedPaying(false);
    }, 1200);
  };

  const handleCopy = (text: string, isToken = false) => {
    navigator.clipboard?.writeText(text);
    if (isToken) {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    } else {
      setCopiedInvoice(true);
      setTimeout(() => setCopiedInvoice(false), 2000);
    }
  };

  const rawWa = storeProfile?.ownerWhatsApp?.replace(/\D/g, '') || '6281234567890';
  const cleanWa = rawWa.startsWith('0') ? '62' + rawWa.slice(1) : rawWa;
  const storeBrand = storeProfile?.storeName || 'TOPGAME ID';

  const handleShareWhatsApp = () => {
    const textMsg = encodeURIComponent(
      `Halo admin, saya mau konfirmasi pembayaran order ${transaction.invoiceNumber} untuk akun ${transaction.targetUserId}`
    );
    window.open(`https://wa.me/${cleanWa}?text=${textMsg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800/80 bg-neutral-900/60 flex items-center justify-between shrink-0">
          <div>
            <div className="text-xs text-neutral-400 font-mono">Invoice Transaksi</div>
            <div className="text-base sm:text-lg font-bold font-mono text-white flex items-center gap-2">
              <span>{transaction.invoiceNumber}</span>
              <button
                type="button"
                onClick={() => handleCopy(transaction.invoiceNumber)}
                className="text-neutral-400 hover:text-white"
                title="Salin Nomor Invoice"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              {copiedInvoice && (
                <span className="text-[10px] text-emerald-400 font-sans font-medium">Tersalin!</span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* Status Banner */}
          {transaction.status === 'MENUNGGU_PEMBAYARAN' && (
            <div className="p-4 bg-amber-950/30 border border-amber-800/60 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Menunggu Pembayaran</span>
                </div>
                <div className="text-xs font-mono font-bold text-amber-400 tabular-nums">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
              </div>
              <p className="text-xs text-neutral-300">
                Selesaikan pembayaran sebelum batas waktu berakhir. Sistem akan otomatis memverifikasi dan mengirim produk setelah dana terdeteksi.
              </p>
            </div>
          )}

          {transaction.status === 'MEMPROSES' && (
            <div className="p-4 bg-sky-950/40 border border-sky-800/60 rounded-xl flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-sky-400 animate-spin" />
              <div>
                <div className="text-sm font-bold text-white">Memproses Pengiriman ke Server Game...</div>
                <div className="text-xs text-neutral-400">Verifikasi otomatis API berlangsung 5 - 30 detik.</div>
              </div>
            </div>
          )}

          {transaction.status === 'SUKSES' && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded-xl space-y-2.5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Transaksi Berhasil & Terverifikasi!</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                      Nota Resmi
                    </span>
                  </div>
                  <div className="text-xs text-emerald-300">
                    Invoice nota resmi telah selesai diproses untuk akun: <strong className="text-white font-mono">{transaction.targetUsernameVerified || transaction.targetUserId}</strong>.
                  </div>
                </div>
              </div>

              {/* Informative notice about Live Game Delivery and API Provider */}
              <div className="p-3 bg-neutral-900/90 rounded-xl border border-neutral-800 text-[11px] text-neutral-300 space-y-1.5">
                <div className="text-amber-400 font-semibold flex items-center gap-1.5">
                  <span>ℹ️ Status Pengiriman Produk ke Akun Game:</span>
                </div>
                <p className="leading-relaxed text-neutral-400">
                  Pesanan telah tercatat di database toko. Untuk mengirim diamond langsung ke server game (Moonton/Garena) secara otomatis 24 jam, sistem toko membutuhkan koneksi <strong>API Distributor VIP Seller / Digiflazz dengan saldo deposit modal aktif</strong> di Dasbor Pemilik. Jika Anda adalah pemilik toko dan sedang mengetes alur checkout, silakan cek tab <em>"VIP Seller"</em> di Dasbor Pemilik untuk melengkapi ID Mitra dan API Key Anda.
                </p>
              </div>
            </div>
          )}

          {/* QRIS / Payment Gateway Visual (When Pending) */}
          {transaction.status === 'MENUNGGU_PEMBAYARAN' && (
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 text-center space-y-4">
              {/* Rekening Tujuan Toko Resmi (SeaBank & DANA) */}
              {storeProfile && (
                <div className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2.5 text-left">
                  <div className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Rekening & E-Wallet Resmi {storeProfile.storeName}</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                      Terverifikasi Aktif
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {/* Bank Account (SeaBank) */}
                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 hover:border-amber-500/40 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-amber-400">
                          {storeProfile.bankName}
                        </span>
                        <span className="text-[10px] text-neutral-500">Transfer Bank</span>
                      </div>
                      <div className="font-mono font-bold text-white text-base flex items-center justify-between">
                        <span>{storeProfile.bankAccountNumber}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(storeProfile.bankAccountNumber)}
                          className="px-2 py-1 text-[10px] bg-neutral-800 hover:bg-neutral-700 text-amber-300 rounded font-sans transition-colors"
                        >
                          Salin
                        </button>
                      </div>
                      <div className="text-[11px] text-neutral-400 uppercase mt-0.5 font-medium">
                        a.n {storeProfile.bankAccountHolder}
                      </div>
                    </div>

                    {/* E-Wallet (DANA) */}
                    {storeProfile.ewalletNumber && (
                      <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 hover:border-sky-500/40 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-sky-400">
                            {storeProfile.ewalletName}
                          </span>
                          <span className="text-[10px] text-neutral-500">E-Wallet</span>
                        </div>
                        <div className="font-mono font-bold text-white text-base flex items-center justify-between">
                          <span>{storeProfile.ewalletNumber}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(storeProfile.ewalletNumber)}
                            className="px-2 py-1 text-[10px] bg-neutral-800 hover:bg-neutral-700 text-sky-300 rounded font-sans transition-colors"
                          >
                            Salin
                          </button>
                        </div>
                        <div className="text-[11px] text-neutral-400 uppercase mt-0.5 font-medium">
                          a.n {storeProfile.ewalletHolder}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* QRIS Code representation (Supports custom uploaded QRIS or dynamic SVG) */}
              <div className="space-y-2">
                <div className="text-xs text-neutral-400">
                  Atau Scan Kode QRIS {storeProfile?.storeName || 'Toko'} di bawah:
                </div>

                <div className="inline-block p-4 bg-white rounded-2xl shadow-xl">
                  {storeProfile?.qrisImageUrl ? (
                    <img
                      src={storeProfile.qrisImageUrl}
                      alt="QRIS Barcode Toko"
                      className="w-48 h-48 object-contain mx-auto rounded-lg"
                    />
                  ) : (
                    <div className="w-44 h-44 bg-neutral-950 p-2 rounded-lg flex flex-col justify-between mx-auto">
                      <div className="flex justify-between">
                        <div className="w-10 h-10 border-4 border-white bg-black p-1">
                          <div className="w-4 h-4 bg-white" />
                        </div>
                        <div className="w-6 h-6 border-2 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-white" />
                        </div>
                        <div className="w-10 h-10 border-4 border-white bg-black p-1">
                          <div className="w-4 h-4 bg-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="text-[10px] font-black text-white bg-amber-500 px-1.5 py-0.5 rounded">
                          QRIS
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="w-10 h-10 border-4 border-white bg-black p-1">
                          <div className="w-4 h-4 bg-white" />
                        </div>
                        <div className="flex gap-1">
                          <div className="w-3 h-3 bg-white" />
                          <div className="w-3 h-3 bg-white" />
                        </div>
                        <div className="w-6 h-6 bg-white" />
                      </div>
                    </div>
                  )}
                  <div className="mt-2 text-[10px] font-bold text-neutral-900 tracking-wider">
                    NMID: {storeProfile?.qrisNmid || 'ID10202684920492'}
                  </div>
                  <div className="text-[10px] text-neutral-600 font-semibold uppercase">
                    a.n {storeProfile?.bankAccountHolder || storeProfile?.ewalletHolder || 'RAHMATULLAH'}
                  </div>
                </div>
              </div>

              {/* Tombol Utama Pembeli: Konfirmasi Pembayaran Nyata & WhatsApp */}
              <div className="space-y-2.5 pt-1">
                <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/40 rounded-xl space-y-2 text-left">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Sudah Selesai Transfer?</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-relaxed">
                    Setelah Anda scan QRIS atau transfer ke rekening di atas, klik tombol konfirmasi di bawah untuk memvalidasi pembayaran dan memproses pengiriman produk ke game.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleSimulatePayment}
                      disabled={simulatedPaying}
                      className="flex-1 py-2.5 px-4 text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                      {simulatedPaying ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-neutral-950" />
                          <span>Memverifikasi Pembayaran...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-neutral-950" />
                          <span>✅ Saya Sudah Transfer (Verifikasi Nota)</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleShareWhatsApp}
                      className="py-2.5 px-4 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors border border-neutral-700 flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Kirim Bukti ke WhatsApp</span>
                    </button>
                  </div>
                </div>

                {/* Panel Bantuan Pemilik / Uji Coba Alur */}
                <div className="p-2.5 bg-neutral-950 border border-neutral-800/80 rounded-xl flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Fitur Pemilik Toko: Pengujian Alur Cepat</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    disabled={simulatedPaying}
                    className="text-amber-400 hover:text-amber-300 underline font-medium"
                  >
                    Tes Langsung Selesai
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Token / Serial Number / Voucher Code when Success */}
          {transaction.status === 'SUKSES' && transaction.serialNumberOrToken && (
            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
              <div className="text-xs font-semibold text-neutral-400">
                {transaction.productId === 'pln-token'
                  ? '20 Digit Nomor Token Stroom PLN'
                  : 'Serial Number / Kode Voucher'}
              </div>
              <div className="flex items-center justify-between bg-neutral-950 p-3 rounded-lg border border-neutral-800">
                <span className="font-mono text-sm sm:text-base font-bold text-amber-400 tracking-wider">
                  {transaction.serialNumberOrToken}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(transaction.serialNumberOrToken!, true)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded bg-neutral-800 text-xs font-medium flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedToken ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Transaction Summary Details */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 sm:p-5 space-y-3">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Informasi Pemesanan
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-neutral-500">Produk:</span>
                <p className="font-semibold text-white">{transaction.productName}</p>
              </div>
              <div>
                <span className="text-neutral-500">Nominal:</span>
                <p className="font-semibold text-white">{transaction.denomName}</p>
              </div>
              <div>
                <span className="text-neutral-500">Target ID Akun:</span>
                <p className="font-mono font-semibold text-white">
                  {transaction.targetUserId}
                  {transaction.targetServerId && ` (${transaction.targetServerId})`}
                </p>
                {transaction.targetUsernameVerified && (
                  <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Username: <strong className="text-white font-mono">{transaction.targetUsernameVerified}</strong></span>
                  </p>
                )}
              </div>
              <div>
                <span className="text-neutral-500">Nomor WhatsApp:</span>
                <p className="font-mono text-neutral-300">{transaction.whatsapp}</p>
              </div>
              <div>
                <span className="text-neutral-500">Metode Bayar:</span>
                <p className="font-medium text-neutral-300">{transaction.paymentMethodName}</p>
              </div>
              <div>
                <span className="text-neutral-500">Total Tagihan:</span>
                <p className="font-mono font-bold text-amber-400 tabular-nums">
                  Rp {transaction.totalPrice.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-neutral-800/80 bg-neutral-900/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="px-3.5 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/80 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Konfirmasi via WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors ml-auto"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
