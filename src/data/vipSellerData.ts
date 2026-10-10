import { ProductItem, VipSellerConfig } from '../types/topup';

// New products provided by VIP Seller Distributor (imported upon connection)
export const VIPSELLER_ADDITIONAL_PRODUCTS: ProductItem[] = [
  {
    id: 'hok',
    name: 'Honor of Kings',
    publisher: 'Level Infinite',
    category: 'game',
    subtypes: ['Tokens', 'Weekly Card'],
    iconType: 'hok',
    badge: '👑 VIP SELLER RESMI',
    requiresServerId: false,
    userIdLabel: 'Player ID Honor of Kings',
    placeholderUserId: 'Contoh: 184920194',
    instructions: 'Buka profil game Honor of Kings dan salin UID Pemain yang tertera di menu profil utama.',
    colorAccent: 'amber',
    popularityScore: 91,
    denominations: [
      { id: 'hok-16', name: '16 Tokens (+1 Bonus)', amountNumber: 16, basePrice: 3800, vipSellerPrice: 3300, categorySubtype: 'Tokens' },
      { id: 'hok-80', name: '80 Tokens (+8 Bonus)', amountNumber: 80, basePrice: 17500, vipSellerPrice: 15600, categorySubtype: 'Tokens', isPopular: true },
      { id: 'hok-240', name: '240 Tokens (+24 Bonus)', amountNumber: 240, basePrice: 51000, vipSellerPrice: 46200, categorySubtype: 'Tokens', isPopular: true },
      { id: 'hok-wcard', name: 'Weekly Card Plus VIP', amountNumber: 1, basePrice: 16500, vipSellerPrice: 14800, categorySubtype: 'Weekly Card', isPopular: true, isFlashSale: true, flashSalePrice: 15200 },
      { id: 'hok-400', name: '400 Tokens (+40 Bonus)', amountNumber: 400, basePrice: 85000, vipSellerPrice: 77500, categorySubtype: 'Tokens' },
      { id: 'hok-800', name: '800 Tokens (+85 Bonus)', amountNumber: 800, basePrice: 169000, vipSellerPrice: 154000, categorySubtype: 'Tokens' },
      { id: 'hok-1200', name: '1200 Tokens (+130 Bonus)', amountNumber: 1200, basePrice: 254000, vipSellerPrice: 232000, categorySubtype: 'Tokens' },
    ],
  },
  {
    id: 'codm',
    name: 'Call of Duty: Mobile',
    publisher: 'Garena',
    category: 'game',
    subtypes: ['CP', 'Battle Pass'],
    iconType: 'codm',
    badge: '⚡ H2H GARENA',
    requiresServerId: false,
    userIdLabel: 'OpenID Akun CODM',
    placeholderUserId: 'Contoh: 284910294819',
    instructions: 'Buka menu Pengaturan CODM > Tab Lainnya/Kebijakan Privasi > Salin OpenID akun Anda.',
    colorAccent: 'sky',
    popularityScore: 88,
    denominations: [
      { id: 'codm-31', name: '31 CP (Call of Duty Points)', amountNumber: 31, basePrice: 5500, vipSellerPrice: 4800, categorySubtype: 'CP' },
      { id: 'codm-63', name: '63 CP (60 + 3 Bonus)', amountNumber: 63, basePrice: 11000, vipSellerPrice: 9700, categorySubtype: 'CP' },
      { id: 'codm-128', name: '128 CP (120 + 8 Bonus)', amountNumber: 128, basePrice: 22000, vipSellerPrice: 19500, categorySubtype: 'CP', isPopular: true },
      { id: 'codm-321', name: '321 CP (Battle Pass Ready)', amountNumber: 321, basePrice: 54000, vipSellerPrice: 48200, categorySubtype: 'CP', isPopular: true },
      { id: 'codm-800', name: '800 CP (Premium CP)', amountNumber: 800, basePrice: 135000, vipSellerPrice: 122000, categorySubtype: 'CP' },
      { id: 'codm-bp', name: 'Battle Pass Activation Pass', amountNumber: 1, basePrice: 56000, vipSellerPrice: 50500, categorySubtype: 'Battle Pass' },
    ],
  },
  {
    id: 'fcmobile',
    name: 'EA Sports FC Mobile',
    publisher: 'Electronic Arts',
    category: 'game',
    subtypes: ['FC Points', 'Silver'],
    iconType: 'fcmobile',
    badge: '⚽ EA OFFICIAL',
    requiresServerId: false,
    userIdLabel: 'UID Akun FC Mobile',
    placeholderUserId: 'Contoh: 94819204',
    instructions: 'Buka profil game EA Sports FC Mobile kamu lalu salin deretan angka UID akun.',
    colorAccent: 'emerald',
    popularityScore: 89,
    denominations: [
      { id: 'fc-40', name: '40 FC Points', amountNumber: 40, basePrice: 6500, vipSellerPrice: 5700, categorySubtype: 'FC Points' },
      { id: 'fc-100', name: '100 FC Points', amountNumber: 100, basePrice: 16000, vipSellerPrice: 14200, categorySubtype: 'FC Points' },
      { id: 'fc-520', name: '520 FC Points (Star Pass)', amountNumber: 520, basePrice: 79000, vipSellerPrice: 71500, categorySubtype: 'FC Points', isPopular: true },
      { id: 'fc-1070', name: '1070 FC Points Package', amountNumber: 1070, basePrice: 159000, vipSellerPrice: 144000, categorySubtype: 'FC Points', isPopular: true },
      { id: 'fc-2200', name: '2200 FC Points Sultan', amountNumber: 2200, basePrice: 319000, vipSellerPrice: 289000, categorySubtype: 'FC Points' },
    ],
  },
  {
    id: 'roblox',
    name: 'Roblox (Robux Voucher)',
    publisher: 'Roblox Corporation',
    category: 'game',
    subtypes: ['Robux Gift Card', 'Premium'],
    iconType: 'roblox',
    badge: 'GLOBAL CODE',
    requiresServerId: false,
    userIdLabel: 'Username / Email Roblox',
    placeholderUserId: 'Contoh: GamerBlox99',
    instructions: 'Kode digital voucher resmi akan dikirim otomatis ke WhatsApp kamu dalam 1 detik setelah bayar.',
    colorAccent: 'rose',
    popularityScore: 93,
    denominations: [
      { id: 'rbx-80', name: '80 Robux Gift Code', amountNumber: 80, basePrice: 16500, vipSellerPrice: 14900, categorySubtype: 'Robux Gift Card' },
      { id: 'rbx-400', name: '400 Robux Digital Voucher', amountNumber: 400, basePrice: 79000, vipSellerPrice: 71000, categorySubtype: 'Robux Gift Card', isPopular: true },
      { id: 'rbx-800', name: '800 Robux Digital Voucher', amountNumber: 800, basePrice: 155000, vipSellerPrice: 139500, categorySubtype: 'Robux Gift Card', isPopular: true },
      { id: 'rbx-1700', name: '1700 Robux Sultan Voucher', amountNumber: 1700, basePrice: 315000, vipSellerPrice: 285000, categorySubtype: 'Robux Gift Card' },
    ],
  },
  {
    id: 'steamwallet',
    name: 'Steam Wallet Code IDR',
    publisher: 'Valve',
    category: 'game',
    subtypes: ['Voucher IDR'],
    iconType: 'steam',
    badge: 'AUTO SEND KODE',
    requiresServerId: false,
    userIdLabel: 'Nomor WhatsApp Penerima Kode',
    placeholderUserId: 'Contoh: 0812xxxxxxxx',
    instructions: 'Kode voucher Steam Wallet asli Indonesia akan langsung terkirim dan bisa di-redeem di store.steampowered.com.',
    colorAccent: 'sky',
    popularityScore: 86,
    denominations: [
      { id: 'steam-12k', name: 'Steam Wallet IDR 12.000', amountNumber: 12000, basePrice: 14500, vipSellerPrice: 13200, categorySubtype: 'Voucher IDR' },
      { id: 'steam-45k', name: 'Steam Wallet IDR 45.000', amountNumber: 45000, basePrice: 52000, vipSellerPrice: 47800, categorySubtype: 'Voucher IDR', isPopular: true },
      { id: 'steam-90k', name: 'Steam Wallet IDR 90.000', amountNumber: 90000, basePrice: 104000, vipSellerPrice: 95500, categorySubtype: 'Voucher IDR', isPopular: true },
      { id: 'steam-250k', name: 'Steam Wallet IDR 250.000', amountNumber: 250000, basePrice: 285000, vipSellerPrice: 264000, categorySubtype: 'Voucher IDR' },
    ],
  },
  {
    id: 'pointblank',
    name: 'Point Blank (PB Zepetto)',
    publisher: 'Zepetto',
    category: 'game',
    subtypes: ['PB Cash'],
    iconType: 'pointblank',
    badge: 'ZEPETTO RESMI',
    requiresServerId: false,
    userIdLabel: 'ID Login PB Zepetto',
    placeholderUserId: 'Contoh: TrooperMajor99',
    instructions: 'Masukkan User ID Zepetto kamu yang terdaftar untuk proses injeksi PB Cash langsung.',
    colorAccent: 'amber',
    popularityScore: 82,
    denominations: [
      { id: 'pb-1200', name: '1.200 PB Cash', amountNumber: 1200, basePrice: 12000, vipSellerPrice: 10800, categorySubtype: 'PB Cash' },
      { id: 'pb-2400', name: '2.400 PB Cash', amountNumber: 2400, basePrice: 23500, vipSellerPrice: 21300, categorySubtype: 'PB Cash' },
      { id: 'pb-6000', name: '6.000 PB Cash', amountNumber: 6000, basePrice: 58000, vipSellerPrice: 52500, categorySubtype: 'PB Cash', isPopular: true },
      { id: 'pb-12000', name: '12.000 PB Cash', amountNumber: 12000, basePrice: 114000, vipSellerPrice: 104000, categorySubtype: 'PB Cash', isPopular: true },
    ],
  },
];

/**
 * Menghitung harga jual ke pembeli berdasarkan harga modal VIP Seller
 * ditambah komisi / margin keuntungan yang dipilih oleh pemilik toko.
 */
export function calculateSellingPrice(
  vipSellerPrice: number,
  config: VipSellerConfig,
  productId?: string
): number {
  if (!vipSellerPrice || vipSellerPrice <= 0) return 10000;

  const customRule = productId && config.productCustomCommissions
    ? config.productCustomCommissions[productId]
    : undefined;

  let markup = 0;
  if (customRule) {
    if (customRule.type === 'percentage') {
      markup = (vipSellerPrice * customRule.value) / 100;
    } else {
      markup = customRule.value;
    }
  } else {
    if (config.commissionType === 'percentage') {
      markup = (vipSellerPrice * (config.globalCommissionPercent || 7)) / 100;
    } else if (config.commissionType === 'fixed') {
      markup = config.globalCommissionFixed || 1000;
    } else {
      // hybrid (persen + flat)
      markup = (vipSellerPrice * (config.globalCommissionPercent || 7)) / 100 + (config.globalCommissionFixed || 500);
    }
  }

  const rawFinal = vipSellerPrice + markup;
  // Dibulatkan ke kelipatan 100 terdekat agar harga cantik khas e-commerce Indonesia (misal 14.500)
  return Math.ceil(rawFinal / 100) * 100;
}

/**
 * Menyinkronkan seluruh katalog produk dan harga berdasarkan VIP Seller API
 * dan pengaturan komisi pemilik toko.
 */
export function syncCatalogWithVipSeller(
  currentCatalog: ProductItem[],
  config: VipSellerConfig
): {
  updatedCatalog: ProductItem[];
  addedProductsCount: number;
  updatedPricesCount: number;
  totalProductsCount: number;
} {
  let updatedPricesCount = 0;
  let addedProductsCount = 0;

  // 1. Perbarui harga seluruh produk yang sudah ada sesuai komisi
  const updatedExisting = currentCatalog.map((prod) => {
    const updatedDenoms = prod.denominations.map((denom) => {
      const modal = denom.vipSellerPrice ?? Math.round(denom.basePrice * 0.905);
      const newBasePrice = calculateSellingPrice(modal, config, prod.id);

      let newFlashSalePrice = denom.flashSalePrice;
      if (denom.isFlashSale && denom.flashSalePrice) {
        // Flash sale price dibuat modal + 40% dari margin normal
        newFlashSalePrice = Math.ceil((modal + (newBasePrice - modal) * 0.4) / 100) * 100;
      }

      updatedPricesCount++;
      return {
        ...denom,
        vipSellerPrice: modal,
        basePrice: newBasePrice,
        flashSalePrice: newFlashSalePrice,
      };
    });

    return {
      ...prod,
      denominations: updatedDenoms,
    };
  });

  // 2. Tambahkan produk-produk baru dari VIP Seller yang belum ada
  const existingIds = new Set(updatedExisting.map((p) => p.id));
  const newProductsToAdd: ProductItem[] = [];

  for (const addProd of VIPSELLER_ADDITIONAL_PRODUCTS) {
    if (!existingIds.has(addProd.id)) {
      const adjustedDenoms = addProd.denominations.map((denom) => {
        const modal = denom.vipSellerPrice ?? Math.round(denom.basePrice * 0.9);
        const computedBase = calculateSellingPrice(modal, config, addProd.id);
        updatedPricesCount++;
        return {
          ...denom,
          vipSellerPrice: modal,
          basePrice: computedBase,
        };
      });

      newProductsToAdd.push({
        ...addProd,
        denominations: adjustedDenoms,
      });
      addedProductsCount++;
    }
  }

  const finalCatalog = [...updatedExisting, ...newProductsToAdd];

  return {
    updatedCatalog: finalCatalog,
    addedProductsCount,
    updatedPricesCount,
    totalProductsCount: finalCatalog.length,
  };
}

/**
 * Simulasi Pengujian Koneksi API VIP Seller
 */
export async function testVipSellerConnection(
  memberCode: string,
  apiKey: string,
  endpoint: string
): Promise<{
  success: boolean;
  message: string;
  balance: number;
  partnerLevel: string;
  latencyMs: number;
  serverTime: string;
}> {
  // Simulasi network request delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (!memberCode.trim() || !apiKey.trim()) {
    return {
      success: false,
      message: 'Kode Member dan API Key VIP Seller tidak boleh kosong.',
      balance: 0,
      partnerLevel: 'Unknown',
      latencyMs: 0,
      serverTime: new Date().toISOString(),
    };
  }

  return {
    success: true,
    message: 'Koneksi ke Server H2H VIP Seller Berhasil Terhubung!',
    balance: 4250000,
    partnerLevel: 'Distributor VIP Platinum H2H (Diskon Terbesar)',
    latencyMs: 38,
    serverTime: new Date().toLocaleTimeString('id-ID'),
  };
}
