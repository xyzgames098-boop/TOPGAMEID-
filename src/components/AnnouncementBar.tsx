import React from 'react';
import { StoreProfile } from '../types/topup';
import { Sparkles, AlertTriangle, AlertCircle, ShieldAlert } from 'lucide-react';

interface AnnouncementBarProps {
  storeProfile: StoreProfile;
  onOpenOwnerDashboard: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  storeProfile,
  onOpenOwnerDashboard,
}) => {
  // If store status is closed or maintenance, render warning banner
  if (storeProfile.storeStatus === 'closed') {
    return (
      <div className="bg-rose-950/90 border-b border-rose-800 text-rose-200 text-xs py-2 px-4 flex items-center justify-between gap-4 font-medium sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center gap-2 w-full justify-center">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            <strong>Pemberitahuan Toko:</strong> Toko sedang Tutup Sementara untuk istirahat operasional. Transaksi baru akan diproses saat toko buka kembali.
          </span>
          <button
            onClick={onOpenOwnerDashboard}
            className="text-[11px] underline text-rose-300 hover:text-white ml-2"
          >
            Buka Toko
          </button>
        </div>
      </div>
    );
  }

  if (storeProfile.storeStatus === 'maintenance') {
    return (
      <div className="bg-amber-950/90 border-b border-amber-800 text-amber-200 text-xs py-2 px-4 flex items-center justify-between gap-4 font-medium sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center gap-2 w-full justify-center">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Pemeliharaan Sistem:</strong> Sedang dilakukan sinkronisasi gateway server VIP Seller H2H.
          </span>
          <button
            onClick={onOpenOwnerDashboard}
            className="text-[11px] underline text-amber-300 hover:text-white ml-2"
          >
            Ubah Status
          </button>
        </div>
      </div>
    );
  }

  if (!storeProfile.isAnnouncementActive || !storeProfile.announcementText?.trim()) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-neutral-950 via-amber-950/40 to-neutral-950 border-b border-amber-500/20 text-neutral-300 text-xs py-1.5 px-4 overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-hidden w-full">
          <span className="flex items-center gap-1 text-amber-400 font-bold shrink-0 text-[11px] bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>INFO RESMI</span>
          </span>
          <div className="truncate text-xs text-neutral-300 font-medium">
            {storeProfile.announcementText}
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenOwnerDashboard}
          className="shrink-0 text-[11px] text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 font-mono"
        >
          <span>👑 Dasbor Saya</span>
        </button>
      </div>
    </div>
  );
};
