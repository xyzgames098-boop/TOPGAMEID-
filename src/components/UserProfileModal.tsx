import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Coins,
  Award,
  LogOut,
  Plus,
  Trash2,
  Gamepad2,
  ShieldCheck,
  Check,
  Copy,
  Sparkles,
  Zap,
} from 'lucide-react';
import { BuyerUser, SavedGameAccount } from '../types/topup';
import { MEMBERSHIP_TIER_CONFIG } from '../data/topupData';

interface UserProfileModalProps {
  isOpen: boolean;
  user: BuyerUser;
  onClose: () => void;
  onLogout: () => void;
  onUpdateUser: (updatedUser: BuyerUser) => void;
  onOpenUpgradeModal: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  user,
  onClose,
  onLogout,
  onUpdateUser,
  onOpenUpgradeModal,
}) => {
  const [activeTab, setActiveTab] = useState<'profil' | 'game-id'>('profil');

  // Form for adding new saved game ID
  const [showAddGame, setShowAddGame] = useState(false);
  const [newGameId, setNewGameId] = useState('mlbb');
  const [newUserId, setNewUserId] = useState('');
  const [newServerId, setNewServerId] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const tierInfo = MEMBERSHIP_TIER_CONFIG[user.tier];

  const handleAddGameAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserId.trim()) return;

    const gameNames: Record<string, string> = {
      mlbb: 'Mobile Legends',
      freefire: 'Free Fire',
      pubgm: 'PUBG Mobile',
      genshin: 'Genshin Impact',
      valorant: 'Valorant',
      hok: 'Honor of Kings',
    };

    const newAcc: SavedGameAccount = {
      gameId: newGameId,
      gameName: gameNames[newGameId] || newGameId.toUpperCase(),
      userId: newUserId.trim(),
      serverId: newServerId.trim() || undefined,
      nickname: newNickname.trim() || undefined,
    };

    const currentSaved = user.savedAccounts || [];
    const updated = {
      ...user,
      savedAccounts: [...currentSaved, newAcc],
    };

    onUpdateUser(updated);
    setNewUserId('');
    setNewServerId('');
    setNewNickname('');
    setShowAddGame(false);
  };

  const handleDeleteGameAccount = (idx: number) => {
    const currentSaved = user.savedAccounts || [];
    const filtered = currentSaved.filter((_, i) => i !== idx);
    onUpdateUser({
      ...user,
      savedAccounts: filtered,
    });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-700 object-cover"
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-amber-400 text-neutral-950 font-black flex items-center justify-center text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              {user.authProvider === 'google' && (
                <span
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow"
                  title="Akun Terhubung dengan Google"
                >
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
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
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-display truncate max-w-[200px]">
                  {user.name}
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {tierInfo.badgeLabel}
                </span>
              </div>
              <p className="text-xs text-neutral-400 truncate max-w-[220px]">{user.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex rounded-xl bg-neutral-900 p-1 border border-neutral-800 my-4">
          <button
            type="button"
            onClick={() => setActiveTab('profil')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'profil'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Info Akun & Poin
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('game-id')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'game-id'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            ID Game Tersimpan ({user.savedAccounts?.length || 0})
          </button>
        </div>

        {/* TAB 1: PROFIL & POIN */}
        {activeTab === 'profil' && (
          <div className="space-y-4">
            {/* Points & Membership Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-neutral-900 to-neutral-900/90 border border-neutral-800 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[11px] text-neutral-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>Saldo Poin Hadiah Anda</span>
                </div>
                <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                  {user.points}{' '}
                  <span className="text-xs text-neutral-400 font-sans font-normal">Poin</span>
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>Dapat digunakan untuk tukar voucher & potongan diskon!</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenUpgradeModal();
                }}
                className="px-3 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs rounded-xl shadow-sm whitespace-nowrap"
              >
                Upgrade Level
              </button>
            </div>

            {/* Profile Detail Fields */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-3.5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-neutral-800/80">
                <span className="text-neutral-400">Metode Masuk:</span>
                <span className="font-semibold text-white capitalize flex items-center gap-1.5">
                  {user.authProvider === 'google' ? 'Google Account' : 'Email & Password'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-neutral-800/80">
                <span className="text-neutral-400">Nomor WhatsApp:</span>
                <span className="font-mono text-neutral-200">
                  {user.phone || 'Belum diatur'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-neutral-800/80">
                <span className="text-neutral-400">Level Member:</span>
                <span className="font-bold text-amber-400">
                  {tierInfo.badgeLabel} (-{(tierInfo.discountRate * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-neutral-400">Terdaftar Sejak:</span>
                <span className="text-neutral-300">{user.joinedAt}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ID GAME TERSIMPAN */}
        {activeTab === 'game-id' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">ID Game Anda</h4>
                <p className="text-[11px] text-neutral-400">
                  ID game ini akan otomatis terisi saat Anda melakukan checkout / top up.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddGame(!showAddGame)}
                className="px-2.5 py-1 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah ID</span>
              </button>
            </div>

            {/* Add New Game ID Form */}
            {showAddGame && (
              <form
                onSubmit={handleAddGameAccount}
                className="p-3.5 bg-neutral-900 border border-amber-500/40 rounded-xl space-y-3 animate-in fade-in text-xs"
              >
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Simpan Akun Game Baru</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-neutral-400 mb-0.5">Pilih Game</label>
                    <select
                      value={newGameId}
                      onChange={(e) => setNewGameId(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    >
                      <option value="mlbb">Mobile Legends</option>
                      <option value="freefire">Free Fire</option>
                      <option value="pubgm">PUBG Mobile</option>
                      <option value="genshin">Genshin Impact</option>
                      <option value="valorant">Valorant</option>
                      <option value="hok">Honor of Kings</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-neutral-400 mb-0.5">
                      Nickname Akun (Opsional)
                    </label>
                    <input
                      type="text"
                      value={newNickname}
                      onChange={(e) => setNewNickname(e.target.value)}
                      placeholder="Contoh: ProPlayer_ID"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-neutral-400 mb-0.5">User ID Game</label>
                    <input
                      type="text"
                      value={newUserId}
                      onChange={(e) => setNewUserId(e.target.value)}
                      placeholder="12345678"
                      required
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-neutral-400 mb-0.5">
                      Server / Zone ID (Jika ada)
                    </label>
                    <input
                      type="text"
                      value={newServerId}
                      onChange={(e) => setNewServerId(e.target.value)}
                      placeholder="Contoh: 2045"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddGame(false)}
                    className="px-2.5 py-1 text-neutral-400 hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-lg"
                  >
                    Simpan ID
                  </button>
                </div>
              </form>
            )}

            {/* List of Saved Accounts */}
            {(!user.savedAccounts || user.savedAccounts.length === 0) ? (
              <div className="text-center py-6 bg-neutral-900/30 border border-neutral-800 rounded-xl text-neutral-400 text-xs">
                <Gamepad2 className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                <p>Belum ada ID game yang tersimpan.</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Tambahkan ID game Anda agar transaksi berikutnya tinggal 1-klik!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {user.savedAccounts.map((acc, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-white flex items-center gap-2 truncate">
                        <span>{acc.gameName}</span>
                        {acc.nickname && (
                          <span className="text-[10px] font-normal text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800/60">
                            {acc.nickname}
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-neutral-400 text-[11px] mt-0.5">
                        ID: {acc.userId} {acc.serverId ? `(${acc.serverId})` : ''}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy(`${acc.userId} ${acc.serverId || ''}`.trim(), `acc-${idx}`)}
                        className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                        title="Salin ID"
                      >
                        {copiedText === `acc-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteGameAccount(idx)}
                        className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition-colors"
                        title="Hapus ID tersimpan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer Logout Button */}
        <div className="mt-5 pt-3 border-t border-neutral-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onLogout}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun Member</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
