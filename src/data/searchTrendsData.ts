import { SearchTrendItem, SearchLogEntry, ProductItem } from '../types/topup';

export const INITIAL_SEARCH_TRENDS: SearchTrendItem[] = [
  {
    id: 'trend-mlbb',
    query: 'Mobile Legends',
    matchedProductId: 'mlbb',
    matchedProductName: 'Mobile Legends: Bang Bang',
    publisher: 'Moonton',
    category: 'game',
    searchCount: 1420,
    lastSearchedAt: 'Baru saja',
    trendGrowth: 48,
    trendStatus: 'hot',
    demandLevel: 'Sangat Tinggi',
    recommendation: 'Weekly Diamond Pass & 86 Diamond paling banyak dicari. Pasang banner promo di halaman depan.',
    suggestedAction: 'Prioritaskan stok Weekly Pass dan adakan Flash Sale malam hari.',
  },
  {
    id: 'trend-ff',
    query: 'Free Fire',
    matchedProductId: 'freefire',
    matchedProductName: 'Free Fire',
    publisher: 'Garena',
    category: 'game',
    searchCount: 980,
    lastSearchedAt: '2 menit lalu',
    trendGrowth: 32,
    trendStatus: 'hot',
    demandLevel: 'Sangat Tinggi',
    recommendation: 'Denom 140 Diamond & Membership Mingguan sangat dominan dicari pemain turnamen.',
    suggestedAction: 'Buat bundling hemat 140 Diamond + Membership untuk menaikkan nilai pesanan.',
  },
  {
    id: 'trend-hok',
    query: 'Honor of Kings',
    matchedProductId: 'hok',
    matchedProductName: 'Honor of Kings (HOK)',
    publisher: 'Level Infinite',
    category: 'game',
    searchCount: 680,
    lastSearchedAt: '5 menit lalu',
    trendGrowth: 65,
    trendStatus: 'rising',
    demandLevel: 'Tinggi',
    recommendation: 'Pencarian naik drastis +65% seiring hype turnamen nasional dan rilis skin terbaru.',
    suggestedAction: 'Gencarkan postingan medsos bahwa tokomu sedia Token HOK termurah instan 24 jam.',
  },
  {
    id: 'trend-genshin',
    query: 'Genshin Impact',
    matchedProductId: 'genshin',
    matchedProductName: 'Genshin Impact',
    publisher: 'HoYoverse',
    category: 'game',
    searchCount: 540,
    lastSearchedAt: '12 menit lalu',
    trendGrowth: 18,
    trendStatus: 'steady',
    demandLevel: 'Tinggi',
    recommendation: 'Pencarian Blessing of the Welkin Moon melonjak menjelang banner karakter baru.',
    suggestedAction: 'Pastikan server siap untuk lonjakan transaksi saat pergantian banner.',
  },
  {
    id: 'trend-roblox',
    query: 'Roblox',
    matchedProductId: 'roblox',
    matchedProductName: 'Roblox (Robux)',
    publisher: 'Roblox Corp',
    category: 'game',
    searchCount: 490,
    lastSearchedAt: '18 menit lalu',
    trendGrowth: 37,
    trendStatus: 'rising',
    demandLevel: 'Tinggi',
    recommendation: 'Peminat Robux 400 & 800 sangat tinggi pada akhir pekan dari kalangan pelajar.',
    suggestedAction: 'Beri diskon khusus weekend untuk denominasi Robux ramah kantong.',
  },
  {
    id: 'trend-valorant',
    query: 'Valorant',
    matchedProductId: 'valorant',
    matchedProductName: 'Valorant Points (Riot)',
    publisher: 'Riot Games',
    category: 'game',
    searchCount: 430,
    lastSearchedAt: '25 menit lalu',
    trendGrowth: 15,
    trendStatus: 'steady',
    demandLevel: 'Sedang',
    recommendation: 'Pencarian VP melonjak setiap ada rotasi skin Night Market.',
    suggestedAction: 'Sediakan denom 1,375 VP dan 2,400 VP dengan harga bersaing.',
  },
  {
    id: 'trend-pubgm',
    query: 'PUBG Mobile',
    matchedProductId: 'pubgm',
    matchedProductName: 'PUBG Mobile',
    publisher: 'Tencent Games',
    category: 'game',
    searchCount: 390,
    lastSearchedAt: '34 menit lalu',
    trendGrowth: 10,
    trendStatus: 'steady',
    demandLevel: 'Sedang',
    recommendation: 'Denominasi 60 UC dan Royale Pass terus konsisten dicari komunitas mabar.',
    suggestedAction: 'Tampilkan testimoni instan UC masuk detikan di status WhatsApp toko.',
  },
  {
    id: 'trend-pln',
    query: 'Token Listrik PLN',
    matchedProductId: 'pln',
    matchedProductName: 'Token Listrik PLN Prabayar',
    publisher: 'PT PLN (Persero)',
    category: 'tagihan',
    searchCount: 320,
    lastSearchedAt: '40 menit lalu',
    trendGrowth: 8,
    trendStatus: 'steady',
    demandLevel: 'Sedang',
    recommendation: 'Denom 20.000 dan 50.000 banyak dicari pelanggan malam hari saat konter fisik tutup.',
    suggestedAction: 'Tonjolkan keunggulan sistem 24 jam nonstop bebas antre.',
  },
  {
    id: 'trend-dana',
    query: 'Saldo DANA',
    matchedProductId: 'dana',
    matchedProductName: 'Top Up Saldo DANA',
    publisher: 'PT Espay Debit Indonesia',
    category: 'ewallet',
    searchCount: 280,
    lastSearchedAt: '48 menit lalu',
    trendGrowth: 12,
    trendStatus: 'steady',
    demandLevel: 'Sedang',
    recommendation: 'Pencarian meningkat untuk denom 25rb - 100rb.',
    suggestedAction: 'Jadikan opsi konversi uang tunai ke saldo e-wallet konter Anda.',
  },
  {
    id: 'trend-codm',
    query: 'Call of Duty Mobile',
    matchedProductId: 'codm',
    matchedProductName: 'Call of Duty: Mobile (CODM)',
    publisher: 'Garena',
    category: 'game',
    searchCount: 210,
    lastSearchedAt: '1 jam lalu',
    trendGrowth: 6,
    trendStatus: 'steady',
    demandLevel: 'Sedang',
    recommendation: 'Pencarian CP stabil untuk pembeli Battle Pass musiman.',
    suggestedAction: 'Berikan promo cashback koin poin untuk retensi pembeli.',
  },
  // High demand unmet / unlisted products searched by customers
  {
    id: 'trend-hsr',
    query: 'Honkai Star Rail',
    matchedProductName: 'Honkai: Star Rail (Oneiric Shard)',
    publisher: 'HoYoverse',
    category: 'unlisted',
    searchCount: 185,
    lastSearchedAt: '15 menit lalu',
    trendGrowth: 55,
    trendStatus: 'rising',
    demandLevel: 'Tinggi',
    recommendation: '⚠️ Belum ada di katalog utama! Banyak dicari pengunjung toko yang mencari Express Supply Pass.',
    suggestedAction: 'Peluang emas: Tambahkan produk ini ke katalog untuk mengambil omzet baru.',
  },
  {
    id: 'trend-steam',
    query: 'Steam Wallet IDR',
    matchedProductName: 'Steam Wallet Code Indonesia',
    publisher: 'Valve Corp',
    category: 'unlisted',
    searchCount: 160,
    lastSearchedAt: '30 menit lalu',
    trendGrowth: 42,
    trendStatus: 'rising',
    demandLevel: 'Tinggi',
    recommendation: '⚠️ Dicari oleh gamer PC saat ada promo Steam Summer/Winter/Autumn Sale.',
    suggestedAction: 'Sediakan voucher Steam digital untuk memperluas pasar ke gamer PC.',
  },
];

export const INITIAL_SEARCH_LOGS: SearchLogEntry[] = [
  { id: 'log-1', query: 'weekly diamond pass mlbb', matchedProductName: 'Mobile Legends: Bang Bang', category: 'game', timestamp: 'Baru saja', deviceType: 'Mobile', isMatched: true },
  { id: 'log-2', query: 'diamond ff 140', matchedProductName: 'Free Fire', category: 'game', timestamp: '2 menit lalu', deviceType: 'Mobile', isMatched: true },
  { id: 'log-3', query: 'token hok murah', matchedProductName: 'Honor of Kings (HOK)', category: 'game', timestamp: '5 menit lalu', deviceType: 'Mobile', isMatched: true },
  { id: 'log-4', query: 'welkin genshin', matchedProductName: 'Genshin Impact', category: 'game', timestamp: '9 menit lalu', deviceType: 'Desktop', isMatched: true },
  { id: 'log-5', query: 'honkai star rail pass', matchedProductName: 'Honkai: Star Rail', category: 'unlisted', timestamp: '15 menit lalu', deviceType: 'Mobile', isMatched: false },
  { id: 'log-6', query: 'robux 800', matchedProductName: 'Roblox (Robux)', category: 'game', timestamp: '18 menit lalu', deviceType: 'Mobile', isMatched: true },
  { id: 'log-7', query: 'mlbb 86 diamond', matchedProductName: 'Mobile Legends: Bang Bang', category: 'game', timestamp: '22 menit lalu', deviceType: 'Mobile', isMatched: true },
  { id: 'log-8', query: 'vp valorant 1375', matchedProductName: 'Valorant Points (Riot)', category: 'game', timestamp: '26 menit lalu', deviceType: 'Desktop', isMatched: true },
  { id: 'log-9', query: 'steam wallet 60rb', matchedProductName: 'Steam Wallet Code', category: 'unlisted', timestamp: '31 menit lalu', deviceType: 'Desktop', isMatched: false },
  { id: 'log-10', query: 'token pln 50000', matchedProductName: 'Token Listrik PLN', category: 'tagihan', timestamp: '39 menit lalu', deviceType: 'Mobile', isMatched: true },
  { id: 'log-11', query: 'saldo dana 50rb', matchedProductName: 'Top Up Saldo DANA', category: 'ewallet', timestamp: '45 menit lalu', deviceType: 'Mobile', isMatched: true },
  { id: 'log-12', query: 'uc pubg 60', matchedProductName: 'PUBG Mobile', category: 'game', timestamp: '50 menit lalu', deviceType: 'Mobile', isMatched: true },
];

const STORAGE_TRENDS_KEY = 'topgame_search_trends_v1';
const STORAGE_LOGS_KEY = 'topgame_search_logs_v1';

export function getStoredSearchTrends(): SearchTrendItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_TRENDS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading search trends from localStorage:', e);
  }
  return INITIAL_SEARCH_TRENDS;
}

export function saveStoredSearchTrends(trends: SearchTrendItem[]): void {
  try {
    localStorage.setItem(STORAGE_TRENDS_KEY, JSON.stringify(trends));
  } catch (e) {
    console.error('Error saving search trends to localStorage:', e);
  }
}

export function getStoredSearchLogs(): SearchLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_LOGS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading search logs from localStorage:', e);
  }
  return INITIAL_SEARCH_LOGS;
}

export function saveStoredSearchLogs(logs: SearchLogEntry[]): void {
  try {
    localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(logs.slice(0, 50)));
  } catch (e) {
    console.error('Error saving search logs to localStorage:', e);
  }
}

/**
 * Track a search query when typed by visitors
 */
export function recordSearchQuery(
  rawQuery: string,
  catalog: ProductItem[]
): { trends: SearchTrendItem[]; logs: SearchLogEntry[] } {
  const query = rawQuery.trim();
  if (!query || query.length < 2) {
    return { trends: getStoredSearchTrends(), logs: getStoredSearchLogs() };
  }

  const normalizedQuery = query.toLowerCase();
  const currentTrends = getStoredSearchTrends();
  const currentLogs = getStoredSearchLogs();

  // Find matching product in catalog
  const matchedProduct = catalog.find(
    (p) =>
      p.name.toLowerCase().includes(normalizedQuery) ||
      p.id.toLowerCase().includes(normalizedQuery) ||
      normalizedQuery.includes(p.name.toLowerCase()) ||
      p.subtypes.some((s) => s.toLowerCase().includes(normalizedQuery))
  );

  const isMatched = !!matchedProduct;
  const productName = matchedProduct ? matchedProduct.name : query;
  const category = matchedProduct ? matchedProduct.category : 'unlisted';

  // Add to recent logs
  const newLogEntry: SearchLogEntry = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    query,
    matchedProductName: productName,
    category,
    timestamp: 'Baru saja',
    deviceType: typeof window !== 'undefined' && window.innerWidth < 768 ? 'Mobile' : 'Desktop',
    isMatched,
  };

  const updatedLogs = [newLogEntry, ...currentLogs].slice(0, 50);
  saveStoredSearchLogs(updatedLogs);

  // Update or insert into trends
  const trendIndex = currentTrends.findIndex(
    (t) =>
      (matchedProduct && t.matchedProductId === matchedProduct.id) ||
      t.query.toLowerCase() === normalizedQuery ||
      t.matchedProductName.toLowerCase() === productName.toLowerCase()
  );

  let updatedTrends = [...currentTrends];

  if (trendIndex >= 0) {
    const existing = updatedTrends[trendIndex];
    updatedTrends[trendIndex] = {
      ...existing,
      searchCount: existing.searchCount + 1,
      lastSearchedAt: 'Baru saja',
      trendGrowth: Math.min(existing.trendGrowth + 1, 99),
      trendStatus: existing.searchCount > 1000 ? 'hot' : 'rising',
    };
  } else {
    // New trend entry
    const newTrend: SearchTrendItem = {
      id: `trend-${Date.now()}`,
      query,
      matchedProductId: matchedProduct?.id,
      matchedProductName: productName,
      publisher: matchedProduct?.publisher || 'Komunitas Gamers',
      category: category as any,
      searchCount: 1,
      lastSearchedAt: 'Baru saja',
      trendGrowth: 100,
      trendStatus: 'new',
      demandLevel: isMatched ? 'Sedang' : 'Tinggi',
      recommendation: isMatched
        ? `Kata kunci "${query}" mulai dicari pelanggan.`
        : `⚠️ Produk "${query}" belum tersedia di katalog. Pertimbangkan untuk menambahkan stok baru.`,
      suggestedAction: isMatched
        ? 'Periksa kesiapan denominasi populer produk ini.'
        : 'Cari supplier distributor H2H untuk produk ini.',
    };
    updatedTrends = [newTrend, ...updatedTrends];
  }

  // Sort by searchCount descending
  updatedTrends.sort((a, b) => b.searchCount - a.searchCount);
  saveStoredSearchTrends(updatedTrends);

  return { trends: updatedTrends, logs: updatedLogs };
}
