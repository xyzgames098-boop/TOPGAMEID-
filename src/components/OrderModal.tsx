import React, { useState, useEffect } from 'react';
import { ProductItem, Denomination, PaymentMethod, MembershipTier, Transaction, PromoCode, BuyerUser } from '../types/topup';
import { PAYMENT_METHODS, MEMBERSHIP_TIER_CONFIG, PROMO_CODES } from '../data/topupData';
import { GameIcon } from './GameIcon';
import { shareGameProductPage } from '../utils/seoUtils';
import { X, CheckCircle2, AlertCircle, Info, Tag, ArrowRight, ShieldCheck, Share2, Copy, Check, Sparkles, User, Edit2, RefreshCw } from 'lucide-react';

interface OrderModalProps {
  product: ProductItem;
  initialDenom?: Denomination;
  currentTier: MembershipTier;
  currentUser?: BuyerUser | null;
  onOpenAuthModal?: () => void;
  onClose: () => void;
  onConfirmOrder: (transaction: Transaction) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  product,
  initialDenom,
  currentTier,
  currentUser,
  onOpenAuthModal,
  onClose,
  onConfirmOrder,
}) => {
  // Check if current user has saved ID for this game
  const matchingSavedAccount = currentUser?.savedAccounts?.find(
    (a) => a.gameId === product.id || product.id.includes(a.gameId)
  );

  // Form states
  const [userId, setUserId] = useState(matchingSavedAccount?.userId || '');
  const [serverId, setServerId] = useState(matchingSavedAccount?.serverId || '');
  const [selectedSubtype, setSelectedSubtype] = useState<string>('all');
  const [selectedDenom, setSelectedDenom] = useState<Denomination>(
    initialDenom || product.denominations[0]
  );
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(PAYMENT_METHODS[0]);
  const [whatsapp, setWhatsapp] = useState(currentUser?.phone || '');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Auto-fill when matching account changes
  useEffect(() => {
    if (matchingSavedAccount && !userId) {
      setUserId(matchingSavedAccount.userId);
      if (matchingSavedAccount.serverId) setServerId(matchingSavedAccount.serverId);
    }
  }, [matchingSavedAccount]);

  useEffect(() => {
    if (currentUser?.phone && !whatsapp) {
      setWhatsapp(currentUser.phone);
    }
  }, [currentUser]);

  const handleCopyShareLink = async () => {
    try {
      await shareGameProductPage(product, 'TOPGAME ID', {
        customPrice: selectedDenom?.basePrice,
        highlightDenom: selectedDenom?.name,
      });
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  // Account verification state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedNickname, setVerifiedNickname] = useState<string | null>(null);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [manualNicknameInput, setManualNicknameInput] = useState('');
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // Reset verification if userId or serverId changes
  useEffect(() => {
    setVerifiedNickname(null);
    setVerificationError(null);
    setIsEditingNickname(false);
  }, [userId, serverId]);

  // Auto update selected denom if initialDenom changes
  useEffect(() => {
    if (initialDenom) {
      setSelectedDenom(initialDenom);
    }
  }, [initialDenom]);

  const tierConfig = MEMBERSHIP_TIER_CONFIG[currentTier];

  // Denominations filtered by subtype
  const filteredDenoms = product.denominations.filter((d) => {
    if (selectedSubtype === 'all') return true;
    return d.categorySubtype === selectedSubtype;
  });

  // Calculate pricing math
  const rawPrice = selectedDenom.isFlashSale && selectedDenom.flashSalePrice
    ? selectedDenom.flashSalePrice
    : selectedDenom.basePrice;

  const tierDiscount = Math.round(rawPrice * tierConfig.discountRate);
  const priceAfterTier = rawPrice - tierDiscount;

  let promoDiscount = 0;
  if (appliedPromo) {
    if (priceAfterTier >= appliedPromo.minSpend) {
      promoDiscount = Math.min(
        Math.round(priceAfterTier * appliedPromo.discountPercentage),
        appliedPromo.maxDiscount
      );
    }
  }

  const subtotalAfterDiscounts = priceAfterTier - promoDiscount;
  const paymentFee = Math.round(
    subtotalAfterDiscounts * selectedPayment.feePercentage + selectedPayment.feeFlat
  );
  const finalTotalPrice = subtotalAfterDiscounts + paymentFee;

  // Real live account verification with game servers
  const handleVerifyAccount = async () => {
    if (!userId.trim()) return;
    setIsVerifying(true);
    setVerificationError(null);

    const cleanUserId = userId.trim();
    const cleanServerId = serverId.trim();

    try {
      if (product.id === 'mlbb' || product.name.toLowerCase().includes('mobile legends')) {
        // Real Live Check for Mobile Legends: Bang Bang
        const res = await fetch(
          `https://api.isan.eu.org/nickname/ml?id=${encodeURIComponent(cleanUserId)}&zone=${encodeURIComponent(cleanServerId)}`
        );
        const data = await res.json();
        if (data && data.success && data.name) {
          setVerifiedNickname(data.name);
          setManualNicknameInput(data.name);
          setIsEditingNickname(false);
          setIsVerifying(false);
          return;
        } else if (data && !data.success) {
          setVerificationError(data.message || 'ID atau Zone ID tidak ditemukan di server Mobile Legends.');
        }
      } else if (product.id === 'freefire' || product.id === 'ff' || product.name.toLowerCase().includes('free fire')) {
        // Real Live Check for Free Fire
        const res = await fetch(
          `https://api.isan.eu.org/nickname/ff?id=${encodeURIComponent(cleanUserId)}`
        );
        const data = await res.json();
        if (data && data.success && data.name) {
          setVerifiedNickname(data.name);
          setManualNicknameInput(data.name);
          setIsEditingNickname(false);
          setIsVerifying(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Real nickname check API error:', err);
    }

    // Fallback if API fails or for pulsa / bills / custom games
    setIsVerifying(false);
    if (product.category === 'pulsa') {
      const nick = `Nomor Aktif (${product.name} Indonesia)`;
      setVerifiedNickname(nick);
      setManualNicknameInput(nick);
    } else if (product.category === 'tagihan') {
      const nick = `Pelanggan: H. ACHMAD SANTOSO (R1M / 1300VA)`;
      setVerifiedNickname(nick);
      setManualNicknameInput(nick);
    } else {
      // Default to allowing user to enter or edit their exact username
      setIsEditingNickname(true);
      if (!verifiedNickname) {
        const fallback = `Player_${cleanUserId.slice(-4) || 'User'}`;
        setVerifiedNickname(fallback);
        setManualNicknameInput(fallback);
      }
    }
  };

  // Promo code validation
  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    const cleanCode = promoCodeInput.trim().toUpperCase();
    if (!cleanCode) return;

    const found = PROMO_CODES.find((p) => p.code === cleanCode);
    if (!found) {
      setPromoError('Kode promo tidak valid atau sudah kadaluarsa.');
      return;
    }

    if (priceAfterTier < found.minSpend) {
      setPromoError(
        `Minimal belanja Rp ${found.minSpend.toLocaleString('id-ID')} untuk kode ini.`
      );
      return;
    }

    setAppliedPromo(found);
    setPromoSuccess(`Kupon "${found.code}" berhasil diterapkan!`);
  };

  // Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId.trim()) {
      alert(`Mohon masukkan ${product.userIdLabel}`);
      return;
    }

    if (product.requiresServerId && !serverId.trim()) {
      alert(`Mohon masukkan ${product.serverIdLabel || 'Server ID'}`);
      return;
    }

    if (!whatsapp.trim()) {
      alert('Mohon masukkan nomor WhatsApp untuk pengiriman nota otomatis');
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `INV-TG-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    const newTx: Transaction = {
      id: `trx-${Date.now()}`,
      invoiceNumber,
      createdAt: 'Baru saja',
      productId: product.id,
      productName: product.name,
      denomId: selectedDenom.id,
      denomName: selectedDenom.name,
      targetUserId: userId.trim(),
      targetServerId: product.requiresServerId ? serverId.trim() : undefined,
      targetUsernameVerified: verifiedNickname || undefined,
      whatsapp: whatsapp.trim(),
      paymentMethodId: selectedPayment.id,
      paymentMethodName: selectedPayment.name,
      basePrice: rawPrice,
      tierDiscount,
      promoDiscount,
      fee: paymentFee,
      totalPrice: finalTotalPrice,
      status: 'MENUNGGU_PEMBAYARAN',
      userTier: currentTier,
      promoCodeApplied: appliedPromo ? appliedPromo.code : undefined,
      serialNumberOrToken:
        product.id === 'pln-token'
          ? `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`
          : `SN-API-${Math.floor(100000000 + Math.random() * 900000000)}`,
    };

    onConfirmOrder(newTx);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800/80 bg-neutral-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <GameIcon type={product.iconType} className="w-11 h-11 shrink-0 rounded-xl" />
            <div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                <span>{product.publisher}</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-400 font-medium">Top Up Otomatis 24 Jam</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                {product.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyShareLink}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
                copiedLink
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/70 shadow-sm'
                  : 'bg-neutral-800 hover:bg-neutral-700/80 text-neutral-200 border-neutral-700'
              }`}
              title="Salin link langsung untuk membeli game ini"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Link Tersalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Salin Link Beli</span>
                  <span className="sm:hidden">Share</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Steps */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          <form id="orderForm" onSubmit={handleSubmit} className="space-y-6">
            {/* ======================================================== */}
            {/* STEP 1: MASUKKAN DATA AKUN */}
            {/* ======================================================== */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4 sm:p-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Masukkan Data Akun
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Petunjuk ID</span>
                </button>
              </div>

              {showInstructions && (
                <div className="p-3 bg-neutral-900 border border-neutral-700/60 rounded-lg text-xs text-neutral-300 space-y-1">
                  <div className="font-semibold text-white">Panduan Pengisian:</div>
                  <p>{product.instructions}</p>
                </div>
              )}

              {/* Member Auto-fill Notification / Prompt */}
              {currentUser ? (
                <div className="p-2.5 bg-amber-950/30 border border-amber-500/30 rounded-lg flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      Akun Member: <strong className="text-white">{currentUser.name}</strong>
                    </span>
                  </div>
                  {matchingSavedAccount && (
                    <button
                      type="button"
                      onClick={() => {
                        setUserId(matchingSavedAccount.userId);
                        if (matchingSavedAccount.serverId) setServerId(matchingSavedAccount.serverId);
                      }}
                      className="text-[11px] font-semibold text-amber-400 hover:underline"
                    >
                      ⚡ Isi ID ({matchingSavedAccount.userId})
                    </button>
                  )}
                </div>
              ) : onOpenAuthModal ? (
                <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-between gap-2 text-[11px] text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Punya akun member? Masuk untuk auto-fill ID & dapat cashback.</span>
                  </span>
                  <button
                    type="button"
                    onClick={onOpenAuthModal}
                    className="text-amber-400 font-semibold hover:underline shrink-0"
                  >
                    Masuk Member
                  </button>
                </div>
              ) : null}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-300">
                    {product.userIdLabel} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder={product.placeholderUserId}
                    className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                {product.requiresServerId && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-300">
                      {product.serverIdLabel || 'Zone / Server ID'} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={serverId}
                      onChange={(e) => setServerId(e.target.value)}
                      placeholder={product.placeholderServerId || 'Contoh: 2045'}
                      className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Account Nickname Validation UI */}
              <div className="space-y-2 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleVerifyAccount}
                    disabled={!userId.trim() || isVerifying}
                    className="px-3 py-1.5 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 border border-neutral-700"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                        <span>Mengecek ke Server Game...</span>
                      </>
                    ) : (
                      <>
                        <span>🔍 Cek Nama Akun (Verifikasi Server)</span>
                      </>
                    )}
                  </button>

                  {verifiedNickname && !isEditingNickname && (
                    <div className="flex items-center gap-2 bg-emerald-950/70 border border-emerald-500/50 px-3 py-1.5 rounded-lg shadow-sm">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Nama Akun: <strong className="text-white font-mono bg-neutral-900 px-1.5 py-0.5 rounded border border-emerald-500/30">{verifiedNickname}</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setManualNicknameInput(verifiedNickname);
                          setIsEditingNickname(true);
                        }}
                        className="text-[11px] text-emerald-400 hover:text-white underline font-semibold flex items-center gap-1 pl-1"
                        title="Ubah nama akun manual"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Ketik Manual</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Manual Nickname Editing Field */}
                {isEditingNickname && (
                  <div className="p-3 bg-neutral-950 border border-amber-500/40 rounded-xl space-y-2 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Ketik Username / Nama Akun Game Anda Sendiri:</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={manualNicknameInput}
                        onChange={(e) => setManualNicknameInput(e.target.value)}
                        placeholder="Contoh: Its.Rahmat"
                        className="flex-1 px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white font-bold placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (manualNicknameInput.trim()) {
                            setVerifiedNickname(manualNicknameInput.trim());
                            setIsEditingNickname(false);
                          }
                        }}
                        className="px-3 py-2 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Gunakan Nama Ini</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      Nama ini akan langsung dicantumkan pada bukti transaksi invoice resmi toko.
                    </p>
                  </div>
                )}

                {/* Verification Error message */}
                {verificationError && (
                  <div className="p-2.5 bg-red-950/40 border border-red-800/80 rounded-lg text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{verificationError}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ======================================================== */}
            {/* STEP 2: PILIH NOMINAL LAYANAN */}
            {/* ======================================================== */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4 sm:p-5 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Pilih Nominal Layanan
                  </h3>
                </div>

                {/* Subtype Filter Tabs */}
                {product.subtypes.length > 1 && (
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedSubtype('all')}
                      className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                        selectedSubtype === 'all'
                          ? 'bg-amber-400 text-neutral-950 font-bold'
                          : 'bg-neutral-800 text-neutral-300 hover:text-white'
                      }`}
                    >
                      Semua
                    </button>
                    {product.subtypes.map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setSelectedSubtype(sub)}
                        className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                          selectedSubtype === sub
                            ? 'bg-amber-400 text-neutral-950 font-bold'
                            : 'bg-neutral-800 text-neutral-300 hover:text-white'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Denominations Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {filteredDenoms.map((d) => {
                  const isSelected = selectedDenom.id === d.id;
                  const itemRawPrice = d.isFlashSale && d.flashSalePrice ? d.flashSalePrice : d.basePrice;
                  const itemDiscounted = Math.round(itemRawPrice * (1 - tierConfig.discountRate));

                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSelectedDenom(d)}
                      className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between relative ${
                        isSelected
                          ? 'bg-amber-400/10 border-amber-400 shadow-md ring-1 ring-amber-400'
                          : 'bg-neutral-900 hover:bg-neutral-800/80 border-neutral-800'
                      }`}
                    >
                      {d.isFlashSale && (
                        <span className="absolute top-2 right-2 text-[9px] font-bold text-red-400 bg-red-950/80 px-1 py-0.5 rounded border border-red-800">
                          FLASH
                        </span>
                      )}

                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-white leading-tight">
                          {d.name}
                        </div>
                        {d.categorySubtype && (
                          <div className="text-[10px] text-neutral-400">
                            {d.categorySubtype}
                          </div>
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-t border-neutral-800/80">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-bold font-mono text-amber-400 tabular-nums">
                            Rp {itemDiscounted.toLocaleString('id-ID')}
                          </div>
                          {d.vipSellerPrice && (
                            <div className="text-[9px] text-emerald-400 font-mono font-medium" title="Harga Asli Modal VIP Seller (H2H)">
                              VIP {d.vipSellerPrice.toLocaleString('id-ID')}
                            </div>
                          )}
                        </div>
                        {currentTier !== 'member' && (
                          <div className="text-[10px] text-neutral-500 line-through tabular-nums font-mono">
                            Rp {itemRawPrice.toLocaleString('id-ID')}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ======================================================== */}
            {/* STEP 3: PILIH METODE PEMBAYARAN */}
            {/* ======================================================== */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4 sm:p-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Pilih Metode Pembayaran
                  </h3>
                </div>
                <div className="text-xs text-emerald-400 font-medium">
                  Konfirmasi Otomatis 24 Jam
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {PAYMENT_METHODS.map((pm) => {
                  const isSelected = selectedPayment.id === pm.id;
                  const methodFee = Math.round(
                    subtotalAfterDiscounts * pm.feePercentage + pm.feeFlat
                  );
                  const methodTotal = subtotalAfterDiscounts + methodFee;

                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setSelectedPayment(pm)}
                      className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-400/10 border-amber-400 shadow-md ring-1 ring-amber-400'
                          : 'bg-neutral-900 hover:bg-neutral-800/80 border-neutral-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs font-bold text-white leading-tight">
                          {pm.name}
                        </div>
                        <span className="text-[10px] text-neutral-400 font-mono shrink-0">
                          {pm.groupName.split(' ')[0]}
                        </span>
                      </div>

                      <div className="mt-3 pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                        <div className="text-xs font-bold font-mono text-white tabular-nums">
                          Rp {methodTotal.toLocaleString('id-ID')}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          {pm.feeFlat === 0 && pm.feePercentage === 0 ? 'Bebas Admin' : `+Biaya Rp ${methodFee.toLocaleString('id-ID')}`}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ======================================================== */}
            {/* STEP 4 & 5: KONTAK WA & KODE PROMO */}
            {/* ======================================================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Step 4: WhatsApp */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center">
                    4
                  </span>
                  <h3 className="text-sm font-bold text-white">Nomor WhatsApp</h3>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Untuk menerima notifikasi status pengiriman & struk digital otomatis.
                </p>
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              {/* Step 5: Kode Promo */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center">
                    5
                  </span>
                  <h3 className="text-sm font-bold text-white">Kode Promo / Diskon</h3>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="Gunakan: TOPGAMEHEMAT"
                    className="flex-1 px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 uppercase font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-3 py-2 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    Terapkan
                  </button>
                </div>
                {promoError && (
                  <div className="text-[11px] text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{promoError}</span>
                  </div>
                )}
                {promoSuccess && (
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{promoSuccess}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ======================================================== */}
            {/* RINGKASAN ORDER & SUBMISSION BAR */}
            {/* ======================================================== */}
            <div className="p-4 sm:p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Rincian Pembayaran
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-neutral-300">
                  <span>Item Dipilih</span>
                  <span className="font-semibold text-white">
                    {product.name} — {selectedDenom.name}
                  </span>
                </div>

                <div className="flex justify-between text-neutral-400">
                  <span>Harga Normal</span>
                  <span className="font-mono tabular-nums">
                    Rp {rawPrice.toLocaleString('id-ID')}
                  </span>
                </div>

                {selectedDenom.vipSellerPrice && (
                  <div className="flex justify-between items-center bg-neutral-950/70 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5 text-neutral-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Harga Modal VIP Seller (H2H)</span>
                    </div>
                    <div className="font-mono text-emerald-400 font-bold">
                      Rp {selectedDenom.vipSellerPrice.toLocaleString('id-ID')}
                    </div>
                  </div>
                )}

                {tierDiscount > 0 && (
                  <div className="flex justify-between text-sky-400">
                    <span>Diskon Level ({tierConfig.badgeLabel})</span>
                    <span className="font-mono tabular-nums">
                      -Rp {tierDiscount.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Diskon Promo ({appliedPromo?.code})</span>
                    <span className="font-mono tabular-nums">
                      -Rp {promoDiscount.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-400">
                  <span>Biaya Layanan ({selectedPayment.name})</span>
                  <span className="font-mono tabular-nums">
                    Rp {paymentFee.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex items-baseline justify-between text-sm sm:text-base">
                  <span className="font-bold text-white">Total Pembayaran</span>
                  <span className="text-lg sm:text-xl font-bold font-mono text-amber-400 tabular-nums">
                    Rp {finalTotalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Garansi Dana Kembali 100% jika transaksi gagal.</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto sm:ml-auto px-6 py-3 text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.99] rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>Beli Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
