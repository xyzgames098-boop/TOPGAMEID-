export type ProductCategory = 'game' | 'pulsa' | 'ewallet' | 'tagihan';

export type MembershipTier = 'member' | 'basic' | 'gold' | 'platinum';

export interface Denomination {
  id: string;
  name: string;
  amountNumber: number;
  basePrice: number;
  vipSellerPrice?: number; // Harga modal asli distributor VIP Seller / H2H
  categorySubtype?: string;
  isPopular?: boolean;
  isFlashSale?: boolean;
  flashSalePrice?: number;
  stockLeft?: number;
}

export interface ProductItem {
  id: string;
  name: string;
  publisher: string;
  category: ProductCategory;
  subtypes: string[]; // e.g. ["Diamond", "Starlight", "Weekly Pass"]
  iconType: string;
  badge?: string;
  requiresServerId: boolean;
  userIdLabel: string;
  serverIdLabel?: string;
  placeholderUserId: string;
  placeholderServerId?: string;
  instructions: string;
  denominations: Denomination[];
  colorAccent: string;
  popularityScore: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  group: 'qris' | 'va' | 'ewallet' | 'retail' | 'saldo';
  groupName: string;
  feePercentage: number;
  feeFlat: number;
  processingTime: string;
  iconSvg: string;
}

export type TransactionStatus = 'MENUNGGU_PEMBAYARAN' | 'MEMPROSES' | 'SUKSES' | 'GAGAL';

export interface Transaction {
  id: string;
  invoiceNumber: string;
  createdAt: string;
  completedAt?: string;
  productId: string;
  productName: string;
  denomId: string;
  denomName: string;
  targetUserId: string;
  targetServerId?: string;
  targetUsernameVerified?: string;
  whatsapp: string;
  paymentMethodId: string;
  paymentMethodName: string;
  basePrice: number;
  tierDiscount: number;
  promoDiscount: number;
  fee: number;
  totalPrice: number;
  status: TransactionStatus;
  userTier: MembershipTier;
  promoCodeApplied?: string;
  serialNumberOrToken?: string;
}

export interface UserAchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'transactions' | 'points' | 'tier' | 'reviews';
  requirementCount: number;
  unlocked: boolean;
  unlockedAt?: string;
  color: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  avatarLetter: string;
  avatarColor: string;
  gameOrService: string;
  rating: number;
  comment: string;
  date: string;
  isVerifiedPurchase: boolean;
  achievementBadge?: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
}

export interface PromoCode {
  code: string;
  discountPercentage: number;
  maxDiscount: number;
  minSpend: number;
  description: string;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  pointsReward: number;
  isCompleted: boolean;
  isClaimed: boolean;
  iconName: string;
}

export interface TierUpgradeReward {
  id: string;
  tier: MembershipTier;
  title: string;
  durationHours: number;
  pointsCost: number;
  discountBenefit: string;
  badgeLabel: string;
}

export interface TemporaryUpgradeState {
  isActive: boolean;
  tier: MembershipTier;
  expiresAt: number; // epoch ms
}

export interface ProductCommissionRule {
  type: 'percentage' | 'fixed';
  value: number;
}

export interface VipSellerConfig {
  isConnected: boolean;
  memberCode: string;
  apiKey: string;
  apiEndpoint: string;
  balance: number;
  lastSyncedAt?: string;
  commissionType: 'percentage' | 'fixed' | 'hybrid';
  globalCommissionPercent: number;
  globalCommissionFixed: number;
  productCustomCommissions: Record<string, ProductCommissionRule>;
  autoSyncPrices: boolean;
}

export interface StoreProfile {
  storeName: string;
  tagline: string;
  logoType: 'initials' | 'emoji' | 'url';
  logoValue: string;
  accentColor: 'amber' | 'emerald' | 'sky' | 'purple' | 'rose';
  ownerName: string;
  ownerEmail: string;
  ownerWhatsApp: string;
  csOperatingHours: string;
  announcementText: string;
  isAnnouncementActive: boolean;
  storeStatus: 'open' | 'closed' | 'maintenance';
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  ewalletName: string;
  ewalletNumber: string;
  ewalletHolder: string;
  qrisEnabled: boolean;
  qrisImageUrl?: string; // URL gambar atau file barcode QRIS DANA/SeaBank asli pemilik
  qrisNmid?: string; // Nomor National Merchant ID QRIS resmi (misal: ID10202684920492)
  ownerPin?: string; // PIN Rahasia Keamanan Pemilik (Default: 132004)
  hideOwnerButtonFromPublic?: boolean; // Opsi sembunyikan tombol Dasbor dari Navbar pembeli
  vipSellerConfig?: VipSellerConfig; // Pengaturan integrasi H2H VIP Seller & Komisi
}

export interface SearchTrendItem {
  id: string;
  query: string;
  matchedProductId?: string;
  matchedProductName: string;
  publisher?: string;
  category: ProductCategory | 'unlisted';
  searchCount: number;
  lastSearchedAt: string;
  trendGrowth: number; // percentage, e.g. 42
  trendStatus: 'hot' | 'rising' | 'steady' | 'new';
  demandLevel: 'Sangat Tinggi' | 'Tinggi' | 'Sedang';
  recommendation: string;
  suggestedAction: string;
}

export interface SearchLogEntry {
  id: string;
  query: string;
  matchedProductName?: string;
  category?: string;
  timestamp: string;
  deviceType: 'Mobile' | 'Desktop' | 'Tablet';
  isMatched: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  preferences?: string[];
  source?: string;
  welcomeVoucherClaimed?: boolean;
}

export interface SavedGameAccount {
  gameId: string;
  gameName: string;
  userId: string;
  serverId?: string;
  nickname?: string;
}

export interface BuyerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  authProvider: 'google' | 'email' | 'phone';
  tier: MembershipTier;
  points: number;
  joinedAt: string;
  savedAccounts?: SavedGameAccount[];
}
