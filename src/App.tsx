import React, { useState, useEffect, useMemo } from 'react';
import { 
  ProductItem, ProductCategory, Denomination, 
  MembershipTier, Transaction, CustomerReview,
  TierUpgradeReward, TemporaryUpgradeState, StoreProfile,
  NewsletterSubscriber, BuyerUser, VipSellerConfig 
} from './types/topup';
import { 
  PRODUCTS_CATALOG, CUSTOMER_REVIEWS, 
  INITIAL_TRANSACTION_HISTORY, MEMBERSHIP_TIER_CONFIG,
  INITIAL_STORE_PROFILE 
} from './data/topupData';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCard } from './components/ProductCard';
import { ProductCardSkeleton } from './components/ProductCardSkeleton';
import { FlashSaleSection } from './components/FlashSaleSection';
import { DailyMissionSection } from './components/DailyMissionSection';
import { OrderModal } from './components/OrderModal';
import { InvoiceModal } from './components/InvoiceModal';
import { ResellerTierModal } from './components/ResellerTierModal';
import { PriceComparisonModal } from './components/PriceComparisonModal';
import { UserAchievementsModal } from './components/UserAchievementsModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { ReviewsSection } from './components/ReviewsSection';
import { HelpFaqSection } from './components/HelpFaqSection';
import { SystemFeaturesBanner } from './components/SystemFeaturesBanner';
import { Footer } from './components/Footer';
import { OwnerDashboardModal } from './components/OwnerDashboardModal';
import { OwnerPinModal } from './components/OwnerPinModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { SitemapModal } from './components/SitemapModal';
import { PromptAiModal } from './components/PromptAiModal';
import { updateDynamicMetaTags } from './utils/seoUtils';
import { recordSearchQuery } from './data/searchTrendsData';

export default function App() {
  // Membership Tier State (persisted in localStorage)
  const [currentTier, setCurrentTier] = useState<MembershipTier>(() => {
    try {
      const saved = localStorage.getItem('topgame_user_tier');
      if (saved && (saved === 'member' || saved === 'basic' || saved === 'gold' || saved === 'platinum')) {
        return saved as MembershipTier;
      }
    } catch (e) {
      console.error(e);
    }
    return 'member';
  });

  // Transactions State (persisted in localStorage)
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('topgame_transactions');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TRANSACTION_HISTORY as Transaction[];
  });

  // Reviews State (persisted in localStorage)
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem('topgame_reviews');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return CUSTOMER_REVIEWS;
  });

  // Dynamic Catalog State (supports sync from VIP Seller API and custom prices)
  const [catalog, setCatalog] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem('topgame_catalog');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return PRODUCTS_CATALOG;
  });

  // Active filters & search
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);

  // Trigger smooth skeleton loader on category filter or search change
  useEffect(() => {
    setIsCatalogLoading(true);
    const timer = setTimeout(() => {
      setIsCatalogLoading(false);
    }, 260);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery]);

  // Track search queries for Owner Dashboard Search Trends
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const searchTimer = setTimeout(() => {
        recordSearchQuery(searchQuery.trim(), catalog);
      }, 700);
      return () => clearTimeout(searchTimer);
    }
  }, [searchQuery, catalog]);

  // Modals state
  const [selectedProductForOrder, setSelectedProductForOrder] = useState<ProductItem | null>(null);
  const [preselectedDenom, setPreselectedDenom] = useState<Denomination | undefined>(undefined);
  const [activeInvoice, setActiveInvoice] = useState<Transaction | null>(null);
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const [isOwnerDashboardOpen, setIsOwnerDashboardOpen] = useState(false);
  const [isSitemapModalOpen, setIsSitemapModalOpen] = useState(false);
  const [isPromptAiModalOpen, setIsPromptAiModalOpen] = useState(false);

  // Buyer Member Account State (persisted in localStorage)
  const [currentUser, setCurrentUser] = useState<BuyerUser | null>(() => {
    try {
      const saved = localStorage.getItem('topgame_member_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleLoginSuccess = (user: BuyerUser) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    localStorage.setItem('topgame_member_user', JSON.stringify(user));
    if (user.tier && user.tier !== 'member') {
      setCurrentTier(user.tier);
    }
    if (user.points) {
      setUserPoints(user.points);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsProfileModalOpen(false);
    localStorage.removeItem('topgame_member_user');
  };

  const handleUpdateUser = (updated: BuyerUser) => {
    setCurrentUser(updated);
    localStorage.setItem('topgame_member_user', JSON.stringify(updated));
  };

  // Owner Security Authentication State (Stored in session to prevent buyer tampering)
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('topgame_owner_auth') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [isOwnerPinModalOpen, setIsOwnerPinModalOpen] = useState(false);

  const handleOpenOwnerPortal = () => {
    if (isOwnerAuthenticated) {
      setIsOwnerDashboardOpen(true);
    } else {
      setIsOwnerPinModalOpen(true);
    }
  };

  const handleOwnerPinSuccess = () => {
    try {
      sessionStorage.setItem('topgame_owner_auth', 'true');
    } catch (e) {
      console.error(e);
    }
    setIsOwnerAuthenticated(true);
    setIsOwnerPinModalOpen(false);
    setIsOwnerDashboardOpen(true);
  };

  const handleLockOwnerDashboard = () => {
    try {
      sessionStorage.removeItem('topgame_owner_auth');
    } catch (e) {
      console.error(e);
    }
    setIsOwnerAuthenticated(false);
    setIsOwnerDashboardOpen(false);
  };

  const handleSyncVipSellerCatalog = (updatedCatalog: ProductItem[], updatedConfig: VipSellerConfig) => {
    setCatalog(updatedCatalog);
    try {
      localStorage.setItem('topgame_catalog', JSON.stringify(updatedCatalog));
    } catch (e) {
      console.error(e);
    }
    const updatedProfile: StoreProfile = {
      ...storeProfile,
      vipSellerConfig: updatedConfig,
    };
    setStoreProfile(updatedProfile);
    try {
      localStorage.setItem('topgame_store_profile', JSON.stringify(updatedProfile));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveVipSellerConfig = (updatedConfig: VipSellerConfig) => {
    const updatedProfile: StoreProfile = {
      ...storeProfile,
      vipSellerConfig: updatedConfig,
    };
    setStoreProfile(updatedProfile);
    try {
      localStorage.setItem('topgame_store_profile', JSON.stringify(updatedProfile));
    } catch (e) {
      console.error(e);
    }
  };

  // Deep Link & URL Query Param Handler (Direct link for buyers e.g., ?game=mobile-legends)
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const gameParam = searchParams.get('game') || searchParams.get('order') || searchParams.get('beli') || searchParams.get('id');
      const searchParam = searchParams.get('search') || searchParams.get('q');
      const trackParam = searchParams.get('lacak') || searchParams.get('invoice');
      const ownerParam = searchParams.get('owner') || searchParams.get('dasbor') || searchParams.get('admin');

      if (gameParam) {
        const queryLower = gameParam.toLowerCase().replace(/-/g, ' ');
        const found = catalog.find(
          (p) =>
            p.id.toLowerCase() === gameParam.toLowerCase() ||
            p.name.toLowerCase() === queryLower ||
            p.name.toLowerCase().includes(queryLower)
        );
        if (found) {
          setSelectedProductForOrder(found);
          const denomParam = searchParams.get('denom');
          if (denomParam) {
            const foundDenom = found.denominations.find(
              (d) => d.id === denomParam || d.name.toLowerCase().includes(denomParam.toLowerCase())
            );
            if (foundDenom) {
              setPreselectedDenom(foundDenom);
            }
          }
        }
      }

      if (searchParam) {
        setSearchQuery(searchParam);
        setTimeout(() => {
          const el = document.getElementById('katalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }

      if (trackParam) {
        setIsTrackerModalOpen(true);
      }

      if (ownerParam === '1' || ownerParam === 'true' || ownerParam === 'admin') {
        handleOpenOwnerPortal();
      }
    } catch (e) {
      console.error('Error parsing URL query params:', e);
    }
  }, []);

  // Sync current order modal with browser URL address bar
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (selectedProductForOrder) {
        url.searchParams.set('game', selectedProductForOrder.id);
        window.history.replaceState({}, '', url.toString());
      } else if (url.searchParams.has('game') || url.searchParams.has('order') || url.searchParams.has('beli')) {
        url.searchParams.delete('game');
        url.searchParams.delete('order');
        url.searchParams.delete('beli');
        url.searchParams.delete('id');
        window.history.replaceState({}, '', url.toString());
      }
    } catch (e) {
      // ignore
    }
  }, [selectedProductForOrder]);

  // Store Profile & Owner Branding Configuration (persisted in localStorage)
  const [storeProfile, setStoreProfile] = useState<StoreProfile>(() => {
    try {
      const saved = localStorage.getItem('topgame_store_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Otomatis sinkronisasi data rekening nyata pemilik jika masih tersimpan placeholder lama
        if (parsed.bankAccountNumber === '8291038491' || !parsed.bankAccountNumber) {
          parsed.bankName = 'SeaBank';
          parsed.bankAccountNumber = '901672345379';
          parsed.bankAccountHolder = 'RAHMATULLAH';
        }
        if (parsed.ewalletNumber === '081234567890' || !parsed.ewalletNumber) {
          parsed.ewalletName = 'DANA / QRIS Terpadu';
          parsed.ewalletNumber = '088214059953';
          parsed.ewalletHolder = 'RAHMATULLAH';
        }
        if (parsed.ownerWhatsApp === '081234567890' || !parsed.ownerWhatsApp) {
          parsed.ownerWhatsApp = '088214059953';
        }
        return { ...INITIAL_STORE_PROFILE, ...parsed };
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_STORE_PROFILE;
  });

  // Dynamic Meta Tags & Schema.org JSON-LD SEO updater for organic Google traffic
  useEffect(() => {
    updateDynamicMetaTags(
      selectedProductForOrder,
      storeProfile.storeName || 'TOPGAME ID',
      catalog.length
    );
  }, [selectedProductForOrder, storeProfile.storeName, catalog.length]);

  // User Achievements & Profile Badges State
  const [selectedBadgeId, setSelectedBadgeId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('topgame_selected_badge');
      if (saved) return saved;
    } catch (e) {
      console.error(e);
    }
    return 'first-order';
  });

  const [hasReviewed, setHasReviewed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('topgame_has_reviewed');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return false;
  });

  // Daily Mission Points & Temporary Upgrade State
  const [userPoints, setUserPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('topgame_user_points');
      if (saved) return Number(saved);
    } catch (e) {
      console.error(e);
    }
    return 150; // Starter points balance for testing
  });

  const [temporaryUpgrade, setTemporaryUpgrade] = useState<TemporaryUpgradeState | null>(() => {
    try {
      const saved = localStorage.getItem('topgame_temp_upgrade');
      if (saved) {
        const parsed: TemporaryUpgradeState = JSON.parse(saved);
        if (parsed.isActive && parsed.expiresAt > Date.now()) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [hasCompletedTransactionToday, setHasCompletedTransactionToday] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('topgame_first_tx_done');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return false;
  });

  // Check temporary upgrade expiration
  useEffect(() => {
    if (temporaryUpgrade?.isActive) {
      if (temporaryUpgrade.expiresAt <= Date.now()) {
        // Expired
        setTemporaryUpgrade(null);
        setCurrentTier('member');
        localStorage.removeItem('topgame_temp_upgrade');
      } else {
        // Ensure currentTier matches active upgrade
        if (currentTier !== temporaryUpgrade.tier) {
          setCurrentTier(temporaryUpgrade.tier);
        }
      }
    }
  }, [temporaryUpgrade]);

  // Today's total completed transaction counter
  const [todayCompletedCount, setTodayCompletedCount] = useState(14839);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('topgame_user_tier', currentTier);
  }, [currentTier]);

  useEffect(() => {
    localStorage.setItem('topgame_user_points', String(userPoints));
  }, [userPoints]);

  useEffect(() => {
    if (temporaryUpgrade) {
      localStorage.setItem('topgame_temp_upgrade', JSON.stringify(temporaryUpgrade));
    } else {
      localStorage.removeItem('topgame_temp_upgrade');
    }
  }, [temporaryUpgrade]);

  useEffect(() => {
    localStorage.setItem('topgame_first_tx_done', JSON.stringify(hasCompletedTransactionToday));
  }, [hasCompletedTransactionToday]);

  useEffect(() => {
    localStorage.setItem('topgame_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('topgame_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('topgame_selected_badge', selectedBadgeId);
  }, [selectedBadgeId]);

  useEffect(() => {
    localStorage.setItem('topgame_has_reviewed', JSON.stringify(hasReviewed));
  }, [hasReviewed]);

  useEffect(() => {
    localStorage.setItem('topgame_store_profile', JSON.stringify(storeProfile));
  }, [storeProfile]);

  // Badge metadata definitions
  const ALL_BADGE_DEFINITIONS: Record<string, { id: string; name: string; icon: string; color: string }> = {
    'first-order': { id: 'first-order', name: 'Gamer Pemula', icon: '🎮', color: 'text-sky-400 bg-sky-950/60 border-sky-800' },
    'frequent-shopper': { id: 'frequent-shopper', name: 'Pro Top-Upper', icon: '⚡', color: 'text-amber-400 bg-amber-950/60 border-amber-800' },
    'sultan-gamer': { id: 'sultan-gamer', name: 'Sultan Gaming', icon: '👑', color: 'text-purple-400 bg-purple-950/60 border-purple-800' },
    'point-collector': { id: 'point-collector', name: 'Point Hunter', icon: '🪙', color: 'text-yellow-400 bg-yellow-950/60 border-yellow-800' },
    'vip-master': { id: 'vip-master', name: 'Master Reseller', icon: '🏆', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' },
    'community-voice': { id: 'community-voice', name: 'Kritikus Komunitas', icon: '⭐', color: 'text-rose-400 bg-rose-950/60 border-rose-800' },
  };

  const currentUserBadge = ALL_BADGE_DEFINITIONS[selectedBadgeId] || ALL_BADGE_DEFINITIONS['first-order'];

  // Periodic transaction counter increment simulation (life in Indonesian store)
  useEffect(() => {
    const timer = setInterval(() => {
      setTodayCompletedCount((c) => c + 1);
    }, 18000);
    return () => clearInterval(timer);
  }, []);

  // Filtered products catalog
  const filteredProducts = useMemo(() => {
    return catalog.filter((item) => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      // Search matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchPub = item.publisher.toLowerCase().includes(q);
        const matchSubtypes = item.subtypes.some((s) => s.toLowerCase().includes(q));
        const matchDenom = item.denominations.some((d) => d.name.toLowerCase().includes(q));
        if (!matchName && !matchPub && !matchSubtypes && !matchDenom) return false;
      }

      return true;
    }).sort((a, b) => b.popularityScore - a.popularityScore);
  }, [activeCategory, searchQuery, catalog]);

  // Order Handlers
  const handleOpenOrder = (product: ProductItem, denom?: Denomination) => {
    setSelectedProductForOrder(product);
    setPreselectedDenom(denom);
  };

  const handleConfirmOrder = (newTransaction: Transaction) => {
    setTransactions((prev) => [newTransaction, ...prev]);
    setSelectedProductForOrder(null);
    setPreselectedDenom(undefined);
    setActiveInvoice(newTransaction);
    setHasCompletedTransactionToday(true);
  };

  const handleClaimPoints = (amount: number, _missionId: string) => {
    setUserPoints((p) => p + amount);
  };

  const handleRedeemUpgrade = (reward: TierUpgradeReward) => {
    if (userPoints < reward.pointsCost) return;
    setUserPoints((p) => p - reward.pointsCost);
    setCurrentTier(reward.tier);
    setTemporaryUpgrade({
      isActive: true,
      tier: reward.tier,
      expiresAt: Date.now() + reward.durationHours * 3600 * 1000,
    });
  };

  const handleUpdateTransactionStatus = (txId: string, newStatus: Transaction['status']) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: newStatus } : t))
    );
    setActiveInvoice((prev) => (prev && prev.id === txId ? { ...prev, status: newStatus } : prev));
  };

  const handleAddReview = (newReview: CustomerReview) => {
    setReviews((prev) => [newReview, ...prev]);
    setHasReviewed(true);
  };

  const handleSaveStoreProfile = (updatedProfile: StoreProfile) => {
    setStoreProfile(updatedProfile);
  };

  const handleResetStoreProfile = () => {
    setStoreProfile(INITIAL_STORE_PROFILE);
    localStorage.removeItem('topgame_store_profile');
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentTierConfig = MEMBERSHIP_TIER_CONFIG[currentTier];

  const handleNewsletterSubscribed = (sub: NewsletterSubscriber) => {
    // Reward bonus points for subscribing to newsletter
    setUserPoints((prev) => {
      const updated = prev + 35;
      localStorage.setItem('topgame_user_points', updated.toString());
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-400 selection:text-neutral-950">
      {/* Official Top Announcement Bar / Marquee */}
      <AnnouncementBar
        storeProfile={storeProfile}
        onOpenOwnerDashboard={handleOpenOwnerPortal}
      />

      {/* Top Bar Navigation (Strict 3-zone contract) */}
      <Navbar
        currentTier={currentTier}
        onOpenTierModal={() => setIsTierModalOpen(true)}
        onOpenOrderTracker={() => setIsTrackerModalOpen(true)}
        onOpenComparison={() => setIsComparisonModalOpen(true)}
        onOpenAchievementsModal={() => setIsAchievementsModalOpen(true)}
        onOpenOwnerDashboard={handleOpenOwnerPortal}
        onOpenPromptAi={() => setIsPromptAiModalOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenUserProfileModal={() => setIsProfileModalOpen(true)}
        storeProfile={storeProfile}
        activeBadgeIcon={currentUserBadge.icon}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat as any);
          handleScrollToSection('katalog');
        }}
        onScrollToSection={handleScrollToSection}
        userPoints={userPoints}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeCategory={activeCategory}
          onCategorySelect={(cat) => {
            setActiveCategory(cat);
            handleScrollToSection('katalog');
          }}
          onOpenResellerModal={() => setIsTierModalOpen(true)}
          onOpenTracker={() => setIsTrackerModalOpen(true)}
          onOpenComparison={() => setIsComparisonModalOpen(true)}
          onOpenPromptAi={() => setIsPromptAiModalOpen(true)}
          totalTransactionsToday={todayCompletedCount}
          storeProfile={storeProfile}
        />

        {/* Flash Sale Section */}
        <FlashSaleSection
          products={catalog}
          currentTier={currentTier}
          onSelectDeal={(product, denom) => handleOpenOrder(product, denom)}
        />

        {/* Daily Mission & Loyalty Points Rewards Section */}
        <DailyMissionSection
          userPoints={userPoints}
          temporaryUpgrade={temporaryUpgrade}
          hasCompletedTransactionToday={hasCompletedTransactionToday}
          onClaimPoints={handleClaimPoints}
          onRedeemUpgrade={handleRedeemUpgrade}
          onScrollToCatalog={() => handleScrollToSection('katalog')}
          onOpenComparison={() => setIsComparisonModalOpen(true)}
        />

        {/* Main Product Catalog Section */}
        <section id="katalog" className="py-14 border-b border-neutral-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Daftar Produk & Layanan Lengkap
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
                  Pilih Game & Layanan Digital
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
                  {currentTierConfig.discountRate > 0 ? (
                    <span className="text-amber-400 font-semibold">
                      Harga Anda otomatis dipotong diskon {currentTierConfig.badgeLabel} ({(currentTierConfig.discountRate * 100).toFixed(1)}%).
                    </span>
                  ) : (
                    'Klik salah satu produk untuk melihat nominal, mulai dari receh hingga paket sultan.'
                  )}
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded ml-2">
                    ⚡ Terkoneksi Harga Modal Asli VIP Seller H2H
                  </span>
                </p>
              </div>

              {/* Category Segmented Selector & Comparison Tool Trigger */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <div className="flex items-center gap-1.5 shrink-0">
                  {[
                    { id: 'all', label: 'Semua (32+)' },
                    { id: 'game', label: '🎮 Top Up Game (17 Game)' },
                    { id: 'pulsa', label: '📱 Pulsa & Paket' },
                    { id: 'ewallet', label: '💳 E-Wallet & Saldo' },
                    { id: 'tagihan', label: '⚡ Tagihan Listrik PLN' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCategory(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                        activeCategory === tab.id
                          ? 'bg-amber-400 text-neutral-950 font-bold'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="h-4 w-[1px] bg-neutral-800 shrink-0 hidden sm:block" />

                <button
                  type="button"
                  onClick={() => setIsComparisonModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg font-semibold text-amber-400 hover:text-amber-300 bg-amber-950/40 hover:bg-amber-950/60 border border-amber-800/80 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
                >
                  <span>⚖️ Bandingkan Harga</span>
                </button>
              </div>
            </div>

            {/* Results Count & Search Notice */}
            <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
              <div>
                {isCatalogLoading ? (
                  <span className="text-neutral-400 animate-pulse flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400/80 inline-block animate-ping" />
                    <span>Memperbarui daftar produk...</span>
                  </span>
                ) : (
                  <span>
                    Menampilkan <span className="text-white font-mono font-bold tabular-nums">{filteredProducts.length}</span> layanan
                  </span>
                )}
              </div>
              {searchQuery && (
                <div className="text-amber-400 font-medium">
                  Hasil filter untuk: "{searchQuery}"
                </div>
              )}
            </div>

            {/* Catalog Grid */}
            {isCatalogLoading ? (
              <div
                role="status"
                aria-label="Memuat katalog produk"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {[...Array(8)].map((_, i) => (
                  <ProductCardSkeleton key={`skeleton-${i}`} />
                ))}
                <span className="sr-only">Sedang memuat data produk...</span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-16 text-center space-y-3 bg-neutral-900/40 rounded-2xl border border-neutral-800">
                <p className="text-sm text-neutral-300 font-medium">
                  Produk tidak ditemukan untuk pencarian "{searchQuery}".
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                >
                  Reset Semua Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currentTier={currentTier}
                    onSelectProduct={(p) => handleOpenOrder(p)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* System Features Section */}
        <SystemFeaturesBanner
          onOpenReseller={() => setIsTierModalOpen(true)}
          onOpenTracker={() => setIsTrackerModalOpen(true)}
        />

        {/* Customer Reviews Section */}
        <ReviewsSection
          reviews={reviews}
          onAddReview={handleAddReview}
          currentUserBadge={currentUserBadge}
          onOpenAchievementsModal={() => setIsAchievementsModalOpen(true)}
        />

        {/* Help & Frequently Asked Questions (FAQ) Section */}
        <HelpFaqSection
          onOpenTracker={() => setIsTrackerModalOpen(true)}
          onOpenTierModal={() => setIsTierModalOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        onScrollTo={handleScrollToSection}
        onOpenReseller={() => setIsTierModalOpen(true)}
        onOpenTracker={() => setIsTrackerModalOpen(true)}
        onOpenComparison={() => setIsComparisonModalOpen(true)}
        onOpenOwnerDashboard={handleOpenOwnerPortal}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenSitemap={() => setIsSitemapModalOpen(true)}
        onOpenPromptAi={() => setIsPromptAiModalOpen(true)}
        storeProfile={storeProfile}
        onSubscribedNewsletter={handleNewsletterSubscribed}
      />

      {/* ======================================================== */}
      {/* MODALS */}
      {/* ======================================================== */}

      {/* User Achievements & Profile Badges Modal */}
      {isAchievementsModalOpen && (
        <UserAchievementsModal
          currentTier={currentTier}
          totalTransactions={transactions.length}
          userPoints={userPoints}
          hasReviewed={hasReviewed}
          selectedBadgeId={selectedBadgeId}
          onSelectPrimaryBadge={(badgeId) => setSelectedBadgeId(badgeId)}
          onClose={() => setIsAchievementsModalOpen(false)}
        />
      )}

      {/* Price Comparison Modal */}
      {isComparisonModalOpen && (
        <PriceComparisonModal
          currentTier={currentTier}
          onClose={() => setIsComparisonModalOpen(false)}
          onSelectDenomToBuy={(product, denom) => {
            setIsComparisonModalOpen(false);
            handleOpenOrder(product, denom);
          }}
          onSelectTier={(tier) => setCurrentTier(tier)}
        />
      )}

      {/* Top-Up Order Modal */}
      {selectedProductForOrder && (
        <OrderModal
          product={selectedProductForOrder}
          initialDenom={preselectedDenom}
          currentTier={currentTier}
          currentUser={currentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onClose={() => {
            setSelectedProductForOrder(null);
            setPreselectedDenom(undefined);
          }}
          onConfirmOrder={handleConfirmOrder}
        />
      )}

      {/* Transaction Invoice Modal */}
      {activeInvoice && (
        <InvoiceModal
          transaction={activeInvoice}
          storeProfile={storeProfile}
          onClose={() => setActiveInvoice(null)}
          onUpdateStatus={handleUpdateTransactionStatus}
        />
      )}

      {/* Reseller & Membership Tier Modal */}
      {isTierModalOpen && (
        <ResellerTierModal
          currentTier={currentTier}
          onSelectTier={(tier) => setCurrentTier(tier)}
          onClose={() => setIsTierModalOpen(false)}
        />
      )}

      {/* Order Tracker / History Modal */}
      {isTrackerModalOpen && (
        <OrderTrackerModal
          transactions={transactions}
          onClose={() => setIsTrackerModalOpen(false)}
          onOpenInvoice={(tx) => {
            setIsTrackerModalOpen(false);
            setActiveInvoice(tx);
          }}
        />
      )}

      {/* Owner Security PIN Authentication Modal */}
      <OwnerPinModal
        isOpen={isOwnerPinModalOpen}
        ownerPin={storeProfile.ownerPin || '132004'}
        storeName={storeProfile.storeName || 'TOPGAME ID'}
        onSuccess={handleOwnerPinSuccess}
        onClose={() => setIsOwnerPinModalOpen(false)}
      />

      {/* Buyer Member Authentication Modal (Login / Register with Google & Email) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Buyer Member Profile & Saved Game Accounts Modal */}
      {currentUser && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          user={currentUser}
          onClose={() => setIsProfileModalOpen(false)}
          onLogout={handleLogout}
          onUpdateUser={handleUpdateUser}
          onOpenUpgradeModal={() => setIsTierModalOpen(true)}
        />
      )}

      {/* Owner / Admin Custom Dashboard Modal */}
      {isOwnerDashboardOpen && (
        <OwnerDashboardModal
          storeProfile={storeProfile}
          transactions={transactions}
          productsCatalog={catalog}
          vipSellerConfig={storeProfile.vipSellerConfig}
          onSaveProfile={handleSaveStoreProfile}
          onSaveVipSellerConfig={handleSaveVipSellerConfig}
          onSyncVipSellerCatalog={handleSyncVipSellerCatalog}
          onUpdateTransactionStatus={handleUpdateTransactionStatus}
          onResetToDefault={handleResetStoreProfile}
          onClose={() => setIsOwnerDashboardOpen(false)}
          onLockDashboard={handleLockOwnerDashboard}
          onOpenInvoice={(tx) => {
            setIsOwnerDashboardOpen(false);
            setActiveInvoice(tx);
          }}
          onSelectProduct={(productId) => {
            setIsOwnerDashboardOpen(false);
            const foundProduct = catalog.find((p) => p.id === productId);
            if (foundProduct) {
              setSelectedProductForOrder(foundProduct);
            }
          }}
          onOpenStorefrontSearch={(query) => {
            setIsOwnerDashboardOpen(false);
            setSearchQuery(query);
            const catalogElem = document.getElementById('katalog');
            if (catalogElem) {
              catalogElem.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          onOpenSitemap={() => {
            setIsOwnerDashboardOpen(false);
            setIsSitemapModalOpen(true);
          }}
        />
      )}

      {/* SEO & Sitemap Generator Modal */}
      <SitemapModal
        isOpen={isSitemapModalOpen}
        onClose={() => setIsSitemapModalOpen(false)}
        products={catalog}
        storeName={storeProfile.storeName}
      />

      {/* AI Prompt Generator & Blueprint Modal */}
      <PromptAiModal
        isOpen={isPromptAiModalOpen}
        onClose={() => setIsPromptAiModalOpen(false)}
      />
    </div>
  );
}
