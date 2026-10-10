import React, { useState } from 'react';
import { Transaction } from '../types/topup';
import { X, Search, CheckCircle2, Clock, AlertTriangle, ArrowRight, Copy } from 'lucide-react';

interface OrderTrackerModalProps {
  transactions: Transaction[];
  onClose: () => void;
  onOpenInvoice: (tx: Transaction) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  transactions,
  onClose,
  onOpenInvoice,
}) => {
  const [searchKey, setSearchKey] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = transactions.filter((tx) => {
    if (!searchKey.trim()) return true;
    const q = searchKey.toLowerCase().trim();
    return (
      tx.invoiceNumber.toLowerCase().includes(q) ||
      tx.whatsapp.toLowerCase().includes(q) ||
      tx.targetUserId.toLowerCase().includes(q) ||
      tx.productName.toLowerCase().includes(q)
    );
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800/80 bg-neutral-900/60 flex items-center justify-between shrink-0">
          <div>
            <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
              Lacak Pesanan Real-Time
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-display text-white">
              Riwayat Transaksi & Cek Pesanan
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="Cari nomor invoice (cth: INV-TG-...) atau nomor WhatsApp..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          {/* List of transactions */}
          {filtered.length === 0 ? (
            <div className="p-8 text-center bg-neutral-900/40 rounded-xl border border-neutral-800 space-y-2">
              <p className="text-sm text-neutral-400">Tidak ada transaksi ditemukan.</p>
              <p className="text-xs text-neutral-500">
                Pastikan nomor invoice atau nomor WhatsApp yang Anda masukkan sesuai.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">
                        {tx.invoiceNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(tx.invoiceNumber, tx.id)}
                        className="text-neutral-500 hover:text-white"
                        title="Salin Invoice"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {copiedId === tx.id && (
                        <span className="text-[10px] text-emerald-400 font-mono">Tersalin</span>
                      )}

                      {/* Status indicator */}
                      {tx.status === 'SUKSES' && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>SUKSES</span>
                        </span>
                      )}
                      {tx.status === 'MENUNGGU_PEMBAYARAN' && (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>BELUM BAYAR</span>
                        </span>
                      )}
                      {tx.status === 'MEMPROSES' && (
                        <span className="text-[10px] font-bold text-sky-400 bg-sky-950/60 border border-sky-800 px-2 py-0.5 rounded">
                          MEMPROSES
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-neutral-300">
                      <span className="font-semibold text-white">{tx.productName}</span> — {tx.denomName}
                    </div>

                    <div className="text-[11px] text-neutral-500 flex flex-wrap items-center gap-2">
                      <span>ID: {tx.targetUserId}</span>
                      <span aria-hidden="true">·</span>
                      <span>{tx.paymentMethodName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{tx.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                    <div className="text-xs font-bold font-mono text-amber-400 tabular-nums">
                      Rp {tx.totalPrice.toLocaleString('id-ID')}
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenInvoice(tx)}
                      className="px-3 py-1.5 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>Lihat Nota</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
