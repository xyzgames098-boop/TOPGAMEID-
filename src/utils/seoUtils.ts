import { ProductItem } from '../types/topup';

/**
 * Escapes characters for safe XML/SVG embedding
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * In-memory cache for dynamically generated Canvas Open Graph PNG images
 * avoids redundant rasterization on repeated accesses.
 */
const canvasOgCache = new Map<string, string>();

/**
 * Bulletproof cross-browser rounded rectangle drawing helper for Canvas 2D
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (typeof (ctx as any).roundRect === 'function') {
    (ctx as any).roundRect(x, y, w, h, r);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Resolves distinctive brand and accent colors for games and product categories
 */
export function getGameThemeColors(product: ProductItem | null): {
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  gradientStart: string;
  gradientEnd: string;
} {
  if (!product) {
    return {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#f59e0b',
      glow: 'rgba(14, 165, 233, 0.25)',
      gradientStart: '#0c4a6e',
      gradientEnd: '#0369a1',
    };
  }

  const id = product.id.toLowerCase();
  const name = product.name.toLowerCase();

  if (id.includes('mlbb') || name.includes('mobile legends')) {
    return {
      primary: '#f59e0b', // Amber/Gold
      secondary: '#d97706',
      accent: '#38bdf8', // Cyan MLBB mana
      glow: 'rgba(245, 158, 11, 0.3)',
      gradientStart: '#78350f',
      gradientEnd: '#b45309',
    };
  }

  if (id.includes('freefire') || id === 'ff' || name.includes('free fire')) {
    return {
      primary: '#f97316', // Orange
      secondary: '#ea580c',
      accent: '#ef4444', // Red
      glow: 'rgba(249, 115, 22, 0.3)',
      gradientStart: '#7c2d12',
      gradientEnd: '#c2410c',
    };
  }

  if (id.includes('hok') || name.includes('honor of kings')) {
    return {
      primary: '#fbbf24', // Gold crown
      secondary: '#ea580c',
      accent: '#f59e0b',
      glow: 'rgba(251, 191, 36, 0.35)',
      gradientStart: '#78350f',
      gradientEnd: '#d97706',
    };
  }

  if (id.includes('pubg') || name.includes('pubg')) {
    return {
      primary: '#eab308', // Military Yellow
      secondary: '#ca8a04',
      accent: '#f97316',
      glow: 'rgba(234, 179, 8, 0.28)',
      gradientStart: '#713f12',
      gradientEnd: '#a16207',
    };
  }

  if (id.includes('val') || name.includes('valorant')) {
    return {
      primary: '#f43f5e', // Rose/Radianite
      secondary: '#e11d48',
      accent: '#fda4af',
      glow: 'rgba(244, 63, 94, 0.32)',
      gradientStart: '#881337',
      gradientEnd: '#be123c',
    };
  }

  if (id.includes('genshin') || name.includes('genshin')) {
    return {
      primary: '#14b8a6', // Teal/Anemo
      secondary: '#0d9488',
      accent: '#38bdf8', // Sky
      glow: 'rgba(20, 184, 166, 0.3)',
      gradientStart: '#134e4a',
      gradientEnd: '#0f766e',
    };
  }

  if (id.includes('hsr') || name.includes('star rail')) {
    return {
      primary: '#818cf8', // Astral Indigo
      secondary: '#6366f1',
      accent: '#fbbf24', // Golden ticket
      glow: 'rgba(99, 102, 241, 0.3)',
      gradientStart: '#312e81',
      gradientEnd: '#4338ca',
    };
  }

  if (id.includes('roblox') || name.includes('roblox')) {
    return {
      primary: '#ef4444', // Red
      secondary: '#dc2626',
      accent: '#ffffff',
      glow: 'rgba(239, 68, 68, 0.3)',
      gradientStart: '#7f1d1d',
      gradientEnd: '#991b1b',
    };
  }

  if (id.includes('delta') || name.includes('delta force')) {
    return {
      primary: '#10b981', // Tactical Emerald
      secondary: '#059669',
      accent: '#34d399',
      glow: 'rgba(16, 185, 129, 0.3)',
      gradientStart: '#064e3b',
      gradientEnd: '#047857',
    };
  }

  if (id.includes('blood') || name.includes('blood strike')) {
    return {
      primary: '#ef4444', // Crimson
      secondary: '#b91c1c',
      accent: '#fca5a5',
      glow: 'rgba(239, 68, 68, 0.3)',
      gradientStart: '#7f1d1d',
      gradientEnd: '#991b1b',
    };
  }

  if (product.category === 'pulsa') {
    return {
      primary: '#38bdf8', // Sky Pulsa
      secondary: '#0284c7',
      accent: '#f59e0b',
      glow: 'rgba(56, 189, 248, 0.3)',
      gradientStart: '#075985',
      gradientEnd: '#0369a1',
    };
  }

  if (product.category === 'ewallet') {
    return {
      primary: '#0ea5e9', // Blue/Cyan E-Wallet
      secondary: '#2563eb',
      accent: '#10b981',
      glow: 'rgba(14, 165, 233, 0.3)',
      gradientStart: '#1e40af',
      gradientEnd: '#1d4ed8',
    };
  }

  if (product.category === 'tagihan' || id.includes('pln')) {
    return {
      primary: '#eab308', // PLN Yellow
      secondary: '#f59e0b',
      accent: '#06b6d4',
      glow: 'rgba(234, 179, 8, 0.3)',
      gradientStart: '#713f12',
      gradientEnd: '#a16207',
    };
  }

  // Default theme
  return {
    primary: '#06b6d4', // Cyan
    secondary: '#0284c7',
    accent: '#f59e0b', // Gold
    glow: 'rgba(6, 182, 212, 0.28)',
    gradientStart: '#164e63',
    gradientEnd: '#0891b2',
  };
}

/**
 * Generates an SEO-optimized, CTR-focused meta description tailored for individual game landing pages.
 * Carefully calibrated between 130 and 158 characters to avoid search snippet truncation.
 */
export function generateGameMetaDescription(
  product: ProductItem,
  storeName: string = 'TOPGAME ID'
): string {
  const lowestPrice = Math.min(...product.denominations.map((d) => d.basePrice));
  const formattedLowest = `Rp ${lowestPrice.toLocaleString('id-ID')}`;

  // Find popular items or passes
  const hasWeeklyPass = product.denominations.some(
    (d) => d.name.toLowerCase().includes('pass') || d.name.toLowerCase().includes('card')
  );
  const flashSaleItem = product.denominations.find((d) => d.isFlashSale && d.flashSalePrice);

  // VIP Reseller discount check
  const lowestVip = Math.min(
    ...product.denominations
      .filter((d) => d.vipSellerPrice && d.vipSellerPrice > 0)
      .map((d) => d.vipSellerPrice!)
  );
  const formattedVip = lowestVip < lowestPrice ? `Rp ${lowestVip.toLocaleString('id-ID')}` : null;

  if (product.category === 'game') {
    if (formattedVip) {
      const candidate = `Top up ${product.name} resmi & legal mulai ${formattedLowest} (VIP ${formattedVip}). Proses kilat 1-3 dtk 24 jam via QRIS & E-Wallet di ${storeName}.`;
      if (candidate.length <= 158) return candidate;
    }

    if (flashSaleItem && flashSaleItem.flashSalePrice) {
      const formattedFlash = `Rp ${flashSaleItem.flashSalePrice.toLocaleString('id-ID')}`;
      const candidate = `Flash sale top up ${product.name} resmi mulai ${formattedFlash}. Proses otomatis 1-3 detik, pembayaran QRIS & E-Wallet 24 jam di ${storeName}.`;
      if (candidate.length <= 158) return candidate;
    }

    if (hasWeeklyPass) {
      const candidate = `Top up ${product.name} & Pass termurah mulai ${formattedLowest}. Proses kilat 1-3 dtk resmi 24 jam via QRIS, DANA, GoPay & VA di ${storeName}.`;
      if (candidate.length <= 158) return candidate;
    }

    // Default game description
    const candidate = `Top up ${product.name} resmi & legal termurah mulai ${formattedLowest}. Proses kilat 1-3 dtk 24 jam via QRIS, DANA, GoPay & VA di ${storeName}.`;
    return candidate.length > 160 ? candidate.slice(0, 157) + '...' : candidate;
  }

  if (product.category === 'pulsa') {
    const candidate = `Isi pulsa & paket data ${product.name} murah mulai ${formattedLowest}. Transaksi otomatis 24 jam via QRIS & E-Wallet resmi di ${storeName}.`;
    return candidate.length > 160 ? candidate.slice(0, 157) + '...' : candidate;
  }

  if (product.category === 'ewallet') {
    const candidate = `Top up saldo ${product.name} otomatis 24 jam biaya admin termurah mulai ${formattedLowest}. Proses kilat via QRIS & VA Bank di ${storeName}.`;
    return candidate.length > 160 ? candidate.slice(0, 157) + '...' : candidate;
  }

  // Token PLN & bills
  const candidate = `Beli token ${product.name} resmi PLN 24 jam mulai ${formattedLowest}. Kode stroom langsung terbit detikan, bayar QRIS & E-Wallet di ${storeName}.`;
  return candidate.length > 160 ? candidate.slice(0, 157) + '...' : candidate;
}

/**
 * Generates dynamic Open Graph Image URL using Vercel OG / Edge API URL format
 * (e.g. /api/og?game=mlbb&title=Mobile+Legends&price=1500&brand=TOPGAME+ID)
 */
export function generateVercelOgImageUrl(
  product: ProductItem,
  storeName: string = 'TOPGAME ID',
  baseUrl?: string
): string {
  const cleanBase = (
    baseUrl ||
    (typeof window !== 'undefined' ? window.location.origin : '') ||
    'https://ais-pre-xiqsshz3gdolqtftzuvjii-902424592462.asia-east1.run.app'
  ).replace(/\/+$/, '');

  const lowestPrice = Math.min(...product.denominations.map((d) => d.basePrice));
  const formattedLowest = `Rp ${lowestPrice.toLocaleString('id-ID')}`;

  const params = new URLSearchParams({
    game: product.id,
    title: product.name,
    publisher: product.publisher || 'Official',
    price: formattedLowest,
    brand: storeName,
    category: product.category,
  });

  return `${cleanBase}/api/og?${params.toString()}`;
}

/**
 * Generates dynamic Open Graph Image URL using Cloudinary URL Transformation API
 * dynamically overlaying text, price badge, and store branding over a cyber background
 */
export function generateCloudinaryOgImageUrl(
  product: ProductItem,
  storeName: string = 'TOPGAME ID'
): string {
  const lowestPrice = Math.min(...product.denominations.map((d) => d.basePrice));
  const formattedLowest = `Rp ${lowestPrice.toLocaleString('id-ID')}`;
  const colors = getGameThemeColors(product);
  const colorHex = colors.primary.replace('#', '');

  // Cloudinary dynamic text overlay transformation path
  const titleEncoded = encodeURIComponent(`Top Up ${product.name}`);
  const priceEncoded = encodeURIComponent(`Mulai ${formattedLowest}`);
  const storeEncoded = encodeURIComponent(`${storeName} • 24 Jam`);

  return `https://res.cloudinary.com/topgame-id/image/upload/w_1200,h_630,c_fill,b_rgb:070a12/co_rgb:ffffff,l_text:Outfit_54_bold:${titleEncoded},g_north_west,x_80,y_180/co_rgb:${colorHex},l_text:JetBrains%20Mono_40_bold:${priceEncoded},g_north_west,x_80,y_280/co_rgb:94a3b8,l_text:Plus%20Jakarta%20Sans_24:${storeEncoded},g_south_west,x_80,y_60/og-template-card.png`;
}

export interface CanvasOgOptions {
  customPrice?: number;
  customTitle?: string;
  badgeText?: string;
  publisher?: string;
  storeName?: string;
  includeVip?: boolean;
  highlightDenom?: string;
  isFlashSale?: boolean;
  flashSalePrice?: number;
}

/**
 * Draws iconic game-specific vector graphics and emblems directly onto the Canvas 2D context
 */
function drawGameCanvasIcon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  product: ProductItem,
  colors: ReturnType<typeof getGameThemeColors>
) {
  const icon = (product.iconType || product.id || '').toLowerCase();
  const name = product.name.toLowerCase();

  ctx.save();
  ctx.translate(cx, cy);

  if (icon.includes('mlbb') || name.includes('mobile legends')) {
    // 1. Mobile Legends: Glowing Diamond Crystal with Crown
    // Crown spikes
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(-28, -26);
    ctx.lineTo(-20, -14);
    ctx.lineTo(0, -32);
    ctx.lineTo(20, -14);
    ctx.lineTo(28, -26);
    ctx.lineTo(22, -6);
    ctx.lineTo(-22, -6);
    ctx.closePath();
    ctx.fill();

    // Crown jewel
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(0, -18, 4, 0, Math.PI * 2);
    ctx.fill();

    // Diamond Facets
    // Top table facet
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(18, 0);
    ctx.lineTo(32, 14);
    ctx.lineTo(-32, 14);
    ctx.closePath();
    ctx.fill();

    // Center bright facets
    ctx.fillStyle = '#7dd3fc';
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(18, 0);
    ctx.lineTo(0, 36);
    ctx.closePath();
    ctx.fill();

    // Left lower facet
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(-32, 14);
    ctx.lineTo(-18, 0);
    ctx.lineTo(0, 36);
    ctx.closePath();
    ctx.fill();

    // Right lower facet
    ctx.fillStyle = '#0369a1';
    ctx.beginPath();
    ctx.moveTo(32, 14);
    ctx.lineTo(18, 0);
    ctx.lineTo(0, 36);
    ctx.closePath();
    ctx.fill();

    // Bottom tip highlight
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 34, 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (icon.includes('freefire') || icon === 'ff' || name.includes('free fire')) {
    // 2. Free Fire: Blazing Phoenix Flames & Shield
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(0, 34);
    ctx.bezierCurveTo(-26, 20, -32, -4, -14, -28);
    ctx.bezierCurveTo(-10, -14, -4, -12, -2, -20);
    ctx.bezierCurveTo(0, -34, 14, -30, 22, -18);
    ctx.bezierCurveTo(28, -6, 26, 18, 0, 34);
    ctx.closePath();
    ctx.fill();

    // Inner bright yellow flame
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(0, 26);
    ctx.bezierCurveTo(-16, 14, -18, -2, -8, -16);
    ctx.bezierCurveTo(-4, -6, 0, -6, 2, -12);
    ctx.bezierCurveTo(6, -20, 14, -16, 14, -8);
    ctx.bezierCurveTo(18, 2, 14, 16, 0, 26);
    ctx.closePath();
    ctx.fill();

    // Core white spark
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, 10, 5, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (icon.includes('pubg') || name.includes('pubg')) {
    // 3. PUBG Mobile: Military Level 3 Helmet with Golden Visor
    ctx.fillStyle = '#292524';
    ctx.beginPath();
    ctx.arc(0, -6, 30, Math.PI, 0, false);
    ctx.lineTo(30, 12);
    ctx.bezierCurveTo(24, 26, -24, 26, -30, 12);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Visor Shield Plate
    ctx.fillStyle = '#1c1917';
    drawRoundedRect(ctx, -24, -2, 48, 16, 4);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Visor slit glass
    ctx.fillStyle = '#38bdf8';
    ctx.globalAlpha = 0.85;
    drawRoundedRect(ctx, -18, 2, 36, 8, 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Rivets
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.arc(-16, 20, 2, 0, Math.PI * 2);
    ctx.arc(16, 20, 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (icon.includes('val') || name.includes('valorant')) {
    // 4. Valorant: Iconic V-Slash
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.moveTo(-28, -26);
    ctx.lineTo(-8, -26);
    ctx.lineTo(8, 28);
    ctx.lineTo(-12, 28);
    ctx.closePath();
    ctx.fill();

    // Right floating triangle
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(28, -26);
    ctx.lineTo(14, -26);
    ctx.lineTo(18, -4);
    ctx.lineTo(28, -14);
    ctx.closePath();
    ctx.fill();
  } else if (icon.includes('hok') || name.includes('honor of kings')) {
    // 5. Honor of Kings: Golden Royal Crest
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(-32, -18);
    ctx.lineTo(-18, -8);
    ctx.lineTo(0, -28);
    ctx.lineTo(18, -8);
    ctx.lineTo(32, -18);
    ctx.lineTo(26, 12);
    ctx.lineTo(0, 28);
    ctx.lineTo(-26, 12);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(12, 0);
    ctx.lineTo(0, 18);
    ctx.lineTo(-12, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (icon.includes('genshin') || name.includes('genshin')) {
    // 6. Genshin Impact: Primogem Star
    ctx.fillStyle = '#14b8a6';
    ctx.beginPath();
    ctx.moveTo(0, -32);
    ctx.lineTo(10, -10);
    ctx.lineTo(32, 0);
    ctx.lineTo(10, 10);
    ctx.lineTo(0, 32);
    ctx.lineTo(-10, 10);
    ctx.lineTo(-32, 0);
    ctx.lineTo(-10, -10);
    ctx.closePath();
    ctx.fill();

    // Inner bright diamond
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(7, 0);
    ctx.lineTo(0, 18);
    ctx.lineTo(-7, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (icon.includes('hsr') || name.includes('star rail')) {
    // 7. Honkai Star Rail: Astral Express Star & Compass
    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.lineTo(6, -6);
    ctx.lineTo(28, 0);
    ctx.lineTo(6, 6);
    ctx.lineTo(0, 28);
    ctx.lineTo(-6, 6);
    ctx.lineTo(-28, 0);
    ctx.lineTo(-6, -6);
    ctx.closePath();
    ctx.fill();
  } else if (icon.includes('roblox') || name.includes('roblox')) {
    // 8. Roblox: Angled 3D Red Cube
    ctx.rotate(-0.25);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    drawRoundedRect(ctx, -26, -26, 52, 52, 8);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    drawRoundedRect(ctx, -10, -10, 20, 20, 3);
    ctx.fill();
  } else if (product.category === 'pulsa') {
    // 9. Cellular Waves & Signal
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 8, 24, Math.PI * 1.2, Math.PI * 1.8);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 8, 16, Math.PI * 1.2, Math.PI * 1.8);
    ctx.stroke();
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(0, 8, 5, 0, Math.PI * 2);
    ctx.fill();
  } else if (product.category === 'ewallet') {
    // 10. E-Wallet Digital Card
    ctx.fillStyle = '#0ea5e9';
    drawRoundedRect(ctx, -26, -18, 52, 36, 6);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.rect(-26, -8, 52, 8);
    ctx.fill();
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(14, 6, 4, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Universal Stylized Monogram
    const initials = product.name
      .split(/[\s:-]+/)
      .slice(0, 3)
      .map((w) => w.charAt(0))
      .join('')
      .toUpperCase();

    ctx.fillStyle = colors.primary;
    ctx.font = '900 38px "Outfit", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, 0, 0);
  }

  ctx.restore();
}

/**
 * CANVAS-BASED DYNAMIC OPEN GRAPH GENERATOR (1200x630 px)
 *
 * Dynamically paints game-specific banners directly in the browser via Canvas 2D API:
 * - Ambient gradient background matching the game's colors
 * - Cyber grid line mesh & radial glows
 * - Store branding header & verified trust badges
 * - Publisher tag & prominent game title
 * - Price showcase badge with live lowest price, VIP reseller rate, or flash sale
 * - Stylized game-specific icon/emblem
 * - Instant processing & security trust pillars
 *
 * Returns a high-res PNG Data URL (`data:image/png;base64,...`) for social media cards
 */
export function generateGameCanvasOgImage(
  product: ProductItem,
  storeName: string = 'TOPGAME ID',
  options?: CanvasOgOptions
): string {
  const actualStoreName = options?.storeName || storeName || 'TOPGAME ID';

  if (typeof document === 'undefined') {
    // Fallback in SSR/non-DOM environment to dynamic API URL
    return generateVercelOgImageUrl(product, actualStoreName);
  }

  const customPrice = options?.customPrice;
  const customTitle = options?.customTitle;
  const highlightDenom = options?.highlightDenom;
  const isFlashSale = options?.isFlashSale ?? product.denominations.some((d) => d.isFlashSale);
  const cacheKey = `${product.id}-${actualStoreName}-${customPrice || 'default'}-${highlightDenom || ''}-${isFlashSale ? 'fs' : 'reg'}`;

  if (canvasOgCache.has(cacheKey)) {
    return canvasOgCache.get(cacheKey)!;
  }

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return generateVercelOgImageUrl(product, actualStoreName);
    }

    const colors = getGameThemeColors(product);

    // Calculate displayed price
    const lowestBase = Math.min(...product.denominations.map((d) => d.basePrice));
    const effectivePrice = customPrice !== undefined && customPrice > 0 ? customPrice : lowestBase;
    const formattedPrice = `Rp ${effectivePrice.toLocaleString('id-ID')}`;

    // Calculate VIP price
    const lowestVip = Math.min(
      ...product.denominations
        .filter((d) => d.vipSellerPrice && d.vipSellerPrice > 0)
        .map((d) => d.vipSellerPrice!)
    );
    const hasVipPrice =
      options?.includeVip !== false &&
      lowestVip > 0 &&
      lowestVip < (customPrice ? customPrice : lowestBase);
    const formattedVip = hasVipPrice ? `Rp ${lowestVip.toLocaleString('id-ID')}` : null;

    // 1. Deep Space Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
    bgGrad.addColorStop(0, '#090d16');
    bgGrad.addColorStop(0.5, '#04060a');
    bgGrad.addColorStop(1, '#020305');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 630);

    // 2. Cyber Mesh Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 1200; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 630);
      ctx.stroke();
    }
    for (let y = 0; y < 630; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1200, y);
      ctx.stroke();
    }

    // 3. Radial Ambient Glow Spots (Game themed colors)
    const radialTop = ctx.createRadialGradient(1000, 120, 10, 1000, 120, 500);
    radialTop.addColorStop(0, colors.glow);
    radialTop.addColorStop(0.6, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radialTop;
    ctx.fillRect(0, 0, 1200, 630);

    const radialBottom = ctx.createRadialGradient(150, 550, 10, 150, 550, 400);
    radialBottom.addColorStop(0, colors.glow);
    radialBottom.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radialBottom;
    ctx.fillRect(0, 0, 1200, 630);

    // 4. Outer Cyber Border Frame
    ctx.save();
    drawRoundedRect(ctx, 24, 24, 1152, 582, 20);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.strokeStyle = colors.primary;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // 5. Header Bar: Store Brand Pill (Top Left)
    ctx.save();
    const brandText = actualStoreName;
    ctx.font = 'bold 15px "Plus Jakarta Sans", system-ui, sans-serif';
    const brandWidth = Math.max(280, ctx.measureText(brandText).width + 170);

    drawRoundedRect(ctx, 60, 50, brandWidth, 42, 10);
    ctx.fillStyle = '#111726';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.stroke();

    // Colored glowing dot
    ctx.beginPath();
    ctx.arc(80, 71, 7, 0, Math.PI * 2);
    ctx.fillStyle = colors.primary;
    ctx.fill();

    // Store Name
    ctx.fillStyle = '#ffffff';
    ctx.fillText(brandText, 98, 76);

    // Live Badge
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 11px "JetBrains Mono", monospace';
    ctx.fillText('· RESMI 24 JAM', 98 + ctx.measureText(brandText).width + 8, 76);
    ctx.restore();

    // Top Right Verified Trust Pill
    ctx.save();
    drawRoundedRect(ctx, 920, 50, 220, 42, 10);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.stroke();

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 12px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✓ 100% LEGAL & RESMI', 1030, 76);
    ctx.restore();

    // 6. Publisher Pill
    const publisherText = (options?.publisher || product.publisher || 'OFFICIAL GAME').toUpperCase();
    ctx.save();
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    const pubWidth = Math.max(160, ctx.measureText(publisherText).width + 28);
    drawRoundedRect(ctx, 60, 130, pubWidth, 26, 6);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fill();
    ctx.strokeStyle = colors.primary;
    ctx.globalAlpha = 0.5;
    ctx.stroke();

    ctx.globalAlpha = 1;
    ctx.fillStyle = colors.primary;
    ctx.fillText(publisherText, 74, 147);
    ctx.restore();

    // 7. Large Game Title
    const displayTitle = customTitle || `Top Up ${product.name}`;
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = '#ffffff';
    const titleSize = displayTitle.length > 24 ? 38 : displayTitle.length > 18 ? 44 : 50;
    ctx.font = `900 ${titleSize}px "Outfit", system-ui, sans-serif`;
    ctx.fillText(displayTitle, 60, 205);
    ctx.restore();

    // 8. Subtitle / Value Proposition
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 16px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(
      highlightDenom
        ? `Paket pilihan ${highlightDenom} resmi proses otomatis 1-3 detik via QRIS & E-Wallet`
        : 'Layanan isi ulang instan 1-3 detik otomatis 24 jam nonstop garansi termurah se-Indonesia',
      60,
      242
    );

    // 9. Price Showcase Card (Left - 680x140)
    ctx.save();
    drawRoundedRect(ctx, 60, 275, 680, 140, 16);
    const cardGrad = ctx.createLinearGradient(60, 275, 740, 415);
    cardGrad.addColorStop(0, '#162035');
    cardGrad.addColorStop(1, '#0c1424');
    ctx.fillStyle = cardGrad;
    ctx.fill();
    ctx.strokeStyle = colors.primary;
    ctx.globalAlpha = 0.45;
    ctx.stroke();
    ctx.restore();

    // Price Card Label
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(
      highlightDenom
        ? `HARGA KHUSUS ${highlightDenom.toUpperCase()}`
        : 'HARGA TERMURAH MULAI DARI',
      88,
      312
    );

    // Big Price in Gold Gradient
    const goldGrad = ctx.createLinearGradient(88, 320, 320, 370);
    goldGrad.addColorStop(0, '#fde047');
    goldGrad.addColorStop(0.5, '#f59e0b');
    goldGrad.addColorStop(1, '#fbbf24');
    ctx.fillStyle = goldGrad;
    ctx.font = '900 46px "Outfit", system-ui, sans-serif';
    ctx.fillText(formattedPrice, 88, 368);

    // Sub-box inside Price Card (VIP Reseller or Flash Sale / Robotik Kilat)
    ctx.save();
    if (isFlashSale) {
      drawRoundedRect(ctx, 420, 298, 295, 92, 12);
      ctx.fillStyle = '#0b1120';
      ctx.fill();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText('⚡ FLASH SALE AKTIF', 438, 326);

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 22px "Outfit", system-ui, sans-serif';
      ctx.fillText('DISKON SPESIAL HARI INI', 438, 358);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('STOK TERBATAS 24 JAM', 438, 380);
    } else if (formattedVip) {
      drawRoundedRect(ctx, 420, 298, 295, 92, 12);
      ctx.fillStyle = '#0b1120';
      ctx.fill();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText('👑 VIP RESELLER LEVEL', 438, 326);

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 24px "Outfit", system-ui, sans-serif';
      ctx.fillText(`Mulai ${formattedVip}`, 438, 360);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('HEMAT S/D 9.5%', 438, 380);
    } else {
      drawRoundedRect(ctx, 430, 308, 280, 75, 12);
      ctx.fillStyle = '#0b1120';
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('⚡ PROSES ROBOTIK KILAT', 450, 336);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Langsung Masuk ke Akun Game', 450, 360);
    }
    ctx.restore();

    // 10. Notable Denominations Chips Row
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText('NOMINAL POPULER:', 60, 452);

    const denomsToShow = product.denominations.slice(0, 4);
    let chipX = 185;
    for (const d of denomsToShow) {
      const cleanName = d.name.replace(/\(.*?\)/g, '').trim();
      const chipLabel = cleanName.length > 15 ? cleanName.slice(0, 14) + '..' : cleanName;
      const isHighlighted = highlightDenom && cleanName.toLowerCase().includes(highlightDenom.toLowerCase());

      ctx.save();
      ctx.font = '600 11px "Plus Jakarta Sans", system-ui, sans-serif';
      const chipW = ctx.measureText(chipLabel).width + 24;

      drawRoundedRect(ctx, chipX, 436, chipW, 26, 6);
      ctx.fillStyle = isHighlighted ? 'rgba(245, 158, 11, 0.2)' : '#131b2e';
      ctx.fill();
      ctx.strokeStyle = isHighlighted ? '#f59e0b' : 'rgba(255, 255, 255, 0.08)';
      ctx.stroke();

      ctx.fillStyle = isHighlighted ? '#fde047' : '#cbd5e1';
      ctx.fillText(chipLabel, chipX + 12, 453);
      ctx.restore();

      chipX += chipW + 10;
    }

    // 11. Right Emblem Hero Card (350x330)
    ctx.save();
    drawRoundedRect(ctx, 790, 130, 350, 330, 22);
    const emblemGrad = ctx.createLinearGradient(790, 130, 1140, 460);
    emblemGrad.addColorStop(0, '#151d30');
    emblemGrad.addColorStop(1, '#0c121e');
    ctx.fillStyle = emblemGrad;
    ctx.fill();
    ctx.strokeStyle = colors.primary;
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Corner decorative brackets
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(790, 160);
    ctx.lineTo(790, 130);
    ctx.lineTo(820, 130);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(1110, 130);
    ctx.lineTo(1140, 130);
    ctx.lineTo(1140, 160);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(790, 430);
    ctx.lineTo(790, 460);
    ctx.lineTo(820, 460);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(1110, 460);
    ctx.lineTo(1140, 460);
    ctx.lineTo(1140, 430);
    ctx.stroke();

    // Emblem Center Container (140x135)
    ctx.save();
    drawRoundedRect(ctx, 895, 175, 140, 135, 24);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw game-specific vector emblem directly into the container
    drawGameCanvasIcon(ctx, 965, 242, 100, product, colors);
    ctx.restore();

    // Rating Badge below emblem
    ctx.save();
    drawRoundedRect(ctx, 865, 335, 200, 34, 8);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 12px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★ 4.9 · Terverifikasi Legal', 965, 357);
    ctx.restore();

    // Server Online Status
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('✓ SERVER 24 JAM ONLINE', 965, 405);

    // 12. Bottom Feature Trust Bar
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 520);
    ctx.lineTo(1140, 520);
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText('⚡ 1-3 Detik', 60, 555);

    ctx.fillStyle = '#64748b';
    ctx.font = '500 12px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText('Proses Otomatis', 140, 555);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText('🛡️ Anti Banned', 300, 555);

    ctx.fillStyle = '#64748b';
    ctx.font = '500 12px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText('Garansi 100% Legal', 400, 555);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText('💳 QRIS & E-Wallet', 590, 555);

    ctx.fillStyle = '#64748b';
    ctx.font = '500 12px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText('DANA · GoPay · OVO · VA', 720, 555);

    ctx.textAlign = 'right';
    ctx.fillStyle = colors.primary;
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText('BEBAS LOGIN · AMAN 100%', 1140, 555);

    // Export Canvas to PNG Data URL
    const pngDataUrl = canvas.toDataURL('image/png');
    canvasOgCache.set(cacheKey, pngDataUrl);
    return pngDataUrl;
  } catch (err) {
    console.warn('Canvas dynamic OG banner generation error:', err);
    return generateVercelOgImageUrl(product, actualStoreName);
  }
}

/**
 * Converts dynamic Canvas Open Graph banner to a Blob for Web Share API or download
 */
export async function generateGameCanvasOgBlob(
  product: ProductItem,
  storeName: string = 'TOPGAME ID',
  options?: CanvasOgOptions
): Promise<Blob | null> {
  if (typeof document === 'undefined') return null;

  try {
    const dataUrl = generateGameCanvasOgImage(product, storeName, options);
    const response = await fetch(dataUrl);
    return await response.blob();
  } catch (err) {
    console.warn('Failed to convert canvas OG to blob:', err);
    return null;
  }
}

/**
 * Converts dynamic Canvas Open Graph banner to a File instance ready for navigator.share({ files: [...] })
 */
export async function generateGameCanvasOgFile(
  product: ProductItem,
  storeName: string = 'TOPGAME ID',
  options?: CanvasOgOptions
): Promise<File | null> {
  const blob = await generateGameCanvasOgBlob(product, storeName, options);
  if (!blob) return null;
  const fileName = `banner-topup-${product.id}.png`;
  return new File([blob], fileName, { type: 'image/png' });
}

/**
 * Shares a game product page with its dynamic Open Graph banner image attached (via Web Share API),
 * falling back gracefully to clipboard copy.
 */
export async function shareGameProductPage(
  product: ProductItem,
  storeName: string = 'TOPGAME ID',
  options?: CanvasOgOptions
): Promise<{ success: boolean; method: 'web-share' | 'clipboard'; message: string }> {
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://ais-pre-xiqsshz3gdolqtftzuvjii-902424592462.asia-east1.run.app';
  const shareUrl = `${origin}/?game=${encodeURIComponent(product.id)}`;
  const title = `Top Up ${product.name} Termurah - ${storeName}`;
  const text = generateGameMetaDescription(product, storeName);

  // 1. Attempt native Web Share API with attached Canvas PNG file
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      const file = await generateGameCanvasOgFile(product, storeName, options);
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title,
          text,
          url: shareUrl,
          files: [file],
        });
        return {
          success: true,
          method: 'web-share',
          message: 'Berhasil membagikan banner dan tautan produk game!',
        };
      }

      // Web share without file attachment
      await navigator.share({
        title,
        text,
        url: shareUrl,
      });
      return {
        success: true,
        method: 'web-share',
        message: 'Berhasil membagikan tautan produk game!',
      };
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return { success: false, method: 'web-share', message: 'Berbagi dibatalkan' };
      }
      // Fall through to clipboard
    }
  }

  // 2. Clipboard fallback
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(shareUrl);
      return {
        success: true,
        method: 'clipboard',
        message: 'Tautan resmi produk game disalin ke papan klip!',
      };
    } catch {
      // Ignored
    }
  }

  return {
    success: false,
    method: 'clipboard',
    message: 'Gagal menyalin tautan produk game',
  };
}

/**
 * CANVAS-BASED DEFAULT STOREFRONT OPEN GRAPH GENERATOR (1200x630 px)
 */
export function generateDefaultStoreCanvasOgImage(
  storeName: string = 'TOPGAME ID',
  totalProducts: number = 25
): string {
  if (typeof document === 'undefined') {
    return generateDefaultStoreOgImageUrl(storeName, totalProducts);
  }

  const cacheKey = `default-store-${storeName}-${totalProducts}`;
  if (canvasOgCache.has(cacheKey)) {
    return canvasOgCache.get(cacheKey)!;
  }

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return generateDefaultStoreOgImageUrl(storeName, totalProducts);
    }

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
    bgGrad.addColorStop(0, '#0b1120');
    bgGrad.addColorStop(0.5, '#030712');
    bgGrad.addColorStop(1, '#020408');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 630);

    // Ambient gold & cyan radial glow
    const glow1 = ctx.createRadialGradient(1000, 150, 10, 1000, 150, 480);
    glow1.addColorStop(0, 'rgba(245, 158, 11, 0.32)');
    glow1.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, 1200, 630);

    const glow2 = ctx.createRadialGradient(200, 500, 10, 200, 500, 420);
    glow2.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
    glow2.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, 1200, 630);

    // Frame
    drawRoundedRect(ctx, 24, 24, 1152, 582, 20);
    ctx.strokeStyle = '#f59e0b';
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Header Pill
    drawRoundedRect(ctx, 60, 55, 330, 40, 10);
    ctx.fillStyle = '#131b2e';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(80, 75, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(storeName, 98, 80);

    ctx.fillStyle = '#f59e0b';
    ctx.font = '600 11px "JetBrains Mono", monospace';
    ctx.fillText('· DISTRIBUTOR RESMI', 98 + ctx.measureText(storeName).width + 8, 80);

    // Big Headline
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 54px "Outfit", sans-serif';
    ctx.fillText('Top Up Game, Pulsa & E-Wallet', 60, 180);

    const goldGrad = ctx.createLinearGradient(60, 200, 600, 250);
    goldGrad.addColorStop(0, '#fde047');
    goldGrad.addColorStop(0.5, '#f59e0b');
    goldGrad.addColorStop(1, '#fbbf24');
    ctx.fillStyle = goldGrad;
    ctx.fillText('Otomatis 24 Jam Termurah', 60, 245);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      'Tersedia Diamond MLBB, FF, Honor of Kings, PUBG Mobile, Valorant & Program Reseller VIP',
      60,
      295
    );

    // Popular Games Grid Showcase Box
    drawRoundedRect(ctx, 60, 350, 1080, 115, 16);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();

    const gamesShowcase = [
      { name: 'Mobile Legends', price: 'Mulai Rp 1.500', color: '#f59e0b' },
      { name: 'Free Fire', price: 'Mulai Rp 1.000', color: '#f97316' },
      { name: 'Honor of Kings', price: 'Mulai Rp 15.000', color: '#fbbf24' },
      { name: 'PUBG Mobile', price: 'Mulai Rp 7.500', color: '#eab308' },
      { name: 'Valorant Points', price: 'Mulai Rp 15.000', color: '#f43f5e' },
    ];

    let startBoxX = 85;
    for (const g of gamesShowcase) {
      drawRoundedRect(ctx, startBoxX, 375, 190, 65, 10);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = g.color;
      ctx.globalAlpha = 0.35;
      ctx.stroke();
      ctx.globalAlpha = 1;

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px "Outfit", sans-serif';
      ctx.fillText(g.name, startBoxX + 16, 402);

      ctx.fillStyle = g.color;
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(g.price, startBoxX + 16, 424);

      startBoxX += 205;
    }

    // Bottom Badges
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('⚡ PROSES 1-3 DETIK', 60, 540);
    ctx.fillText('🛡️ 100% LEGAL & RESMI', 250, 540);
    ctx.fillText('💳 QRIS · DANA · GOPAY · VA', 480, 540);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText(`${totalProducts}+ PRODUK TERSEDIA 24 JAM`, 1140, 540);

    const pngUrl = canvas.toDataURL('image/png');
    canvasOgCache.set(cacheKey, pngUrl);
    return pngUrl;
  } catch (err) {
    return generateDefaultStoreOgImageUrl(storeName, totalProducts);
  }
}

/**
 * Generates dynamic Open Graph Image SVG string (1200x630 px) for individual game landing pages.
 */
export function generateGameOgImageSvg(
  product: ProductItem,
  storeName: string = 'TOPGAME ID'
): string {
  const colors = getGameThemeColors(product);

  const lowestPrice = Math.min(...product.denominations.map((d) => d.basePrice));
  const formattedLowest = `Rp ${lowestPrice.toLocaleString('id-ID')}`;

  const lowestVip = Math.min(
    ...product.denominations
      .filter((d) => d.vipSellerPrice && d.vipSellerPrice > 0)
      .map((d) => d.vipSellerPrice!)
  );
  const formattedVip = lowestVip < lowestPrice ? `Rp ${lowestVip.toLocaleString('id-ID')}` : null;

  const notableDenoms = product.denominations
    .slice(0, 4)
    .map((d) => escapeXml(d.name.replace(/\(.*?\)/g, '').trim()));

  const escapedName = escapeXml(product.name);
  const escapedStore = escapeXml(storeName);
  const escapedPublisher = escapeXml(product.publisher || 'OFFICIAL PUBLISHER');
  const publisherUpper = escapedPublisher.toUpperCase();

  const initials = product.name
    .split(/[\s:-]+/)
    .slice(0, 3)
    .map((w) => w.charAt(0))
    .join('')
    .toUpperCase();

  const isFlashSale = product.denominations.some((d) => d.isFlashSale);

  return `
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16" />
      <stop offset="50%" stop-color="#04060a" />
      <stop offset="100%" stop-color="#020305" />
    </linearGradient>

    <radialGradient id="glowTopRight" cx="90%" cy="15%" r="65%">
      <stop offset="0%" stop-color="${colors.primary}" stop-opacity="0.35" />
      <stop offset="50%" stop-color="${colors.secondary}" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="glowBottomLeft" cx="10%" cy="90%" r="55%">
      <stop offset="0%" stop-color="${colors.accent}" stop-opacity="0.25" />
      <stop offset="60%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#141a29" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#0b101b" stop-opacity="0.95" />
    </linearGradient>

    <linearGradient id="priceCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a2236" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#0d1424" stop-opacity="0.98" />
    </linearGradient>

    <linearGradient id="goldTextGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#fbbf24" />
    </linearGradient>

    <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.035)" stroke-width="1"/>
    </pattern>

    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <rect width="1200" height="630" fill="url(#bgGrad)" />
  <rect width="1200" height="630" fill="url(#gridPattern)" />
  <rect width="1200" height="630" fill="url(#glowTopRight)" />
  <rect width="1200" height="630" fill="url(#glowBottomLeft)" />

  <rect x="24" y="24" width="1152" height="582" rx="20" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1.5" />
  <rect x="24" y="24" width="1152" height="582" rx="20" fill="none" stroke="${colors.primary}" stroke-opacity="0.25" stroke-width="1" />

  <!-- HEADER BAR -->
  <g transform="translate(60, 56)">
    <rect x="0" y="0" width="280" height="42" rx="10" fill="#111726" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />
    <circle cx="20" cy="21" r="7" fill="${colors.primary}" />
    <text x="36" y="26" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="14" font-weight="800" fill="#ffffff" letter-spacing="0.5">
      ${escapedStore}
    </text>
    <text x="145" y="26" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="600" fill="#94a3b8">
      · RESMI 24 JAM
    </text>

    <g transform="translate(860, 0)">
      <rect x="0" y="0" width="220" height="42" rx="10" fill="rgba(16, 185, 129, 0.12)" stroke="rgba(16, 185, 129, 0.4)" stroke-width="1" />
      <text x="110" y="26" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="12" font-weight="700" fill="#34d399" text-anchor="middle" letter-spacing="0.8">
        ✓ 100% LEGAL &amp; AMAN
      </text>
    </g>
  </g>

  <!-- LEFT HERO SECTION -->
  <g transform="translate(60, 140)">
    <rect x="0" y="0" width="${Math.max(160, publisherUpper.length * 9 + 30)}" height="26" rx="6" fill="${colors.primary}" fill-opacity="0.15" stroke="${colors.primary}" stroke-opacity="0.4" stroke-width="1" />
    <text x="12" y="17" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="${colors.primary}" letter-spacing="1.2">
      ${publisherUpper}
    </text>

    <text x="0" y="78" font-family="'Outfit', system-ui, sans-serif" font-size="${escapedName.length > 20 ? '42' : '48'}" font-weight="900" fill="#ffffff" letter-spacing="-0.5" filter="url(#shadow)">
      Top Up ${escapedName}
    </text>

    <text x="0" y="118" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="16" font-weight="500" fill="#94a3b8">
      Layanan isi ulang instan 1-3 detik otomatis 24 jam nonstop garansi termurah se-Indonesia
    </text>

    <!-- Price Showcase Card -->
    <g transform="translate(0, 145)" filter="url(#shadow)">
      <rect x="0" y="0" width="680" height="135" rx="16" fill="url(#priceCardGrad)" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1.2" />
      <rect x="0" y="0" width="680" height="135" rx="16" fill="none" stroke="${colors.primary}" stroke-opacity="0.3" stroke-width="1" />

      <text x="24" y="36" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="12" font-weight="700" fill="#94a3b8" letter-spacing="0.8">
        HARGA TERMURAH MULAI DARI
      </text>
      <text x="24" y="86" font-family="'Outfit', system-ui, sans-serif" font-size="44" font-weight="900" fill="url(#goldTextGrad)" letter-spacing="-0.5">
        ${formattedLowest}
      </text>

      ${
        formattedVip
          ? `
      <g transform="translate(350, 24)">
        <rect x="0" y="0" width="300" height="86" rx="12" fill="#0b1120" stroke="rgba(245, 158, 11, 0.35)" stroke-width="1" />
        <text x="16" y="28" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#f59e0b" letter-spacing="0.5">
          👑 VIP RESELLER LEVEL
        </text>
        <text x="16" y="62" font-family="'Outfit', system-ui, sans-serif" font-size="26" font-weight="800" fill="#ffffff">
          Mulai ${formattedVip}
        </text>
        <text x="190" y="60" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11" font-weight="700" fill="#10b981">
          HEMAT S/D 9.5%
        </text>
      </g>`
          : `
      <g transform="translate(360, 32)">
        <rect x="0" y="0" width="290" height="70" rx="12" fill="#0b1120" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1" />
        <text x="18" y="28" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="12" font-weight="700" fill="#38bdf8">
          ⚡ PROSES ROBOTIK OTOMATIS
        </text>
        <text x="18" y="52" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="13" font-weight="600" fill="#e2e8f0">
          Masuk Langsung ke Akun Game
        </text>
      </g>`
      }
    </g>

    <!-- Top Denominations Pills -->
    <g transform="translate(0, 305)">
      <text x="0" y="16" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#64748b" letter-spacing="0.5">
        NOMINAL POPULER:
      </text>
      ${notableDenoms
        .map(
          (denom, idx) => `
      <g transform="translate(${125 + idx * 140}, 0)">
        <rect x="0" y="0" width="130" height="26" rx="6" fill="#131b2e" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
        <text x="65" y="17" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="10" font-weight="600" fill="#cbd5e1" text-anchor="middle">
          ${denom.length > 15 ? denom.slice(0, 14) + '..' : denom}
        </text>
      </g>`
        )
        .join('')}
    </g>
  </g>

  <!-- RIGHT EMBLEM HERO BADGE (350x340) -->
  <g transform="translate(790, 140)" filter="url(#shadow)">
    <rect x="0" y="0" width="350" height="340" rx="22" fill="url(#cardGrad)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.5" />
    <rect x="0" y="0" width="350" height="340" rx="22" fill="none" stroke="${colors.primary}" stroke-opacity="0.4" stroke-width="1.2" />

    <circle cx="175" cy="145" r="95" fill="${colors.primary}" fill-opacity="0.12" />

    <rect x="105" y="75" width="140" height="140" rx="24" fill="#0f172a" stroke="${colors.primary}" stroke-width="2" />
    <text x="175" y="162" font-family="'Outfit', system-ui, sans-serif" font-size="52" font-weight="900" fill="${colors.primary}" text-anchor="middle" letter-spacing="-1">
      ${initials}
    </text>

    <g transform="translate(75, 235)">
      <rect x="0" y="0" width="200" height="34" rx="8" fill="#1e293b" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1" />
      <text x="100" y="22" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="12" font-weight="700" fill="#fbbf24" text-anchor="middle">
        ★ 4.9 · Terverifikasi Legal
      </text>
    </g>

    <g transform="translate(50, 280)">
      <text x="125" y="22" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#94a3b8" text-anchor="middle" letter-spacing="0.5">
        ${isFlashSale ? '⚡ FLASH SALE AKTIF' : '✓ SERVER 24 JAM ONLINE'}
      </text>
    </g>
  </g>

  <!-- BOTTOM FEATURE / PAYMENT TRUST STRIP -->
  <g transform="translate(60, 532)">
    <line x1="0" y1="0" x2="1080" y2="0" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />

    <g transform="translate(0, 18)">
      <g transform="translate(0, 0)">
        <text x="0" y="20" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="13" font-weight="700" fill="#ffffff">
          ⚡ 1-3 Detik
        </text>
        <text x="78" y="20" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="12" font-weight="500" fill="#64748b">
          Proses Otomatis
        </text>
      </g>

      <g transform="translate(230, 0)">
        <text x="0" y="20" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="13" font-weight="700" fill="#ffffff">
          🛡️ Anti Banned
        </text>
        <text x="100" y="20" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="12" font-weight="500" fill="#64748b">
          Garansi 100% Legal
        </text>
      </g>

      <g transform="translate(480, 0)">
        <text x="0" y="20" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="13" font-weight="700" fill="#ffffff">
          💳 QRIS &amp; E-Wallet
        </text>
        <text x="135" y="20" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="12" font-weight="500" fill="#64748b">
          DANA · GoPay · OVO · VA
        </text>
      </g>

      <g transform="translate(850, 0)">
        <text x="230" y="20" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700" fill="${colors.primary}" text-anchor="end">
          BEBAS LOGIN · AMAN 100%
        </text>
      </g>
    </g>
  </g>
</svg>
`.trim();
}

/**
 * Generates dynamic Open Graph Image SVG string (1200x630 px) for the default storefront home page
 */
export function generateDefaultStoreOgImageSvg(
  storeName: string = 'TOPGAME ID',
  totalProducts: number = 25
): string {
  const escapedStore = escapeXml(storeName);

  return `
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradStore" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1120" />
      <stop offset="50%" stop-color="#030712" />
      <stop offset="100%" stop-color="#020408" />
    </linearGradient>

    <radialGradient id="storeGlow1" cx="85%" cy="20%" r="65%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.32" />
      <stop offset="60%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="storeGlow2" cx="15%" cy="85%" r="60%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.25" />
      <stop offset="60%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <pattern id="storeGrid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.035)" stroke-width="1"/>
    </pattern>

    <linearGradient id="goldHeadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#fbbf24" />
    </linearGradient>

    <filter id="storeShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <rect width="1200" height="630" fill="url(#bgGradStore)" />
  <rect width="1200" height="630" fill="url(#storeGrid)" />
  <rect width="1200" height="630" fill="url(#storeGlow1)" />
  <rect width="1200" height="630" fill="url(#storeGlow2)" />

  <rect x="24" y="24" width="1152" height="582" rx="20" fill="none" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1.5" />
  <rect x="24" y="24" width="1152" height="582" rx="20" fill="none" stroke="#f59e0b" stroke-opacity="0.3" stroke-width="1" />

  <g transform="translate(60, 60)">
    <rect x="0" y="0" width="340" height="40" rx="10" fill="#131b2e" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />
    <circle cx="20" cy="20" r="7" fill="#f59e0b" />
    <text x="36" y="25" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="13" font-weight="800" fill="#ffffff">
      ${escapedStore}
    </text>
    <text x="175" y="25" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="600" fill="#f59e0b">
      · DISTRIBUTOR RESMI
    </text>
  </g>

  <g transform="translate(60, 160)" filter="url(#storeShadow)">
    <text x="0" y="40" font-family="'Outfit', system-ui, sans-serif" font-size="56" font-weight="900" fill="#ffffff" letter-spacing="-1">
      Top Up Game, Pulsa &amp; E-Wallet
    </text>
    <text x="0" y="110" font-family="'Outfit', system-ui, sans-serif" font-size="56" font-weight="900" fill="url(#goldHeadGrad)" letter-spacing="-1">
      Otomatis 24 Jam Termurah
    </text>
    <text x="0" y="165" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="18" font-weight="500" fill="#94a3b8">
      Tersedia Diamond MLBB, FF, Honor of Kings, PUBG Mobile, Valorant &amp; Program Reseller VIP
    </text>
  </g>

  <g transform="translate(60, 375)">
    <rect x="0" y="0" width="1080" height="110" rx="16" fill="#0f172a" fill-opacity="0.8" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1" />

    <g transform="translate(24, 25)">
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="180" height="60" rx="10" fill="#1e293b" stroke="rgba(245, 158, 11, 0.3)" stroke-width="1" />
        <text x="18" y="26" font-family="'Outfit', system-ui, sans-serif" font-size="14" font-weight="800" fill="#ffffff">Mobile Legends</text>
        <text x="18" y="46" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#f59e0b">Mulai Rp 1.500</text>
      </g>

      <g transform="translate(200, 0)">
        <rect x="0" y="0" width="180" height="60" rx="10" fill="#1e293b" stroke="rgba(249, 115, 22, 0.3)" stroke-width="1" />
        <text x="18" y="26" font-family="'Outfit', system-ui, sans-serif" font-size="14" font-weight="800" fill="#ffffff">Free Fire</text>
        <text x="18" y="46" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#f97316">Mulai Rp 1.000</text>
      </g>

      <g transform="translate(400, 0)">
        <rect x="0" y="0" width="180" height="60" rx="10" fill="#1e293b" stroke="rgba(251, 191, 36, 0.3)" stroke-width="1" />
        <text x="18" y="26" font-family="'Outfit', system-ui, sans-serif" font-size="14" font-weight="800" fill="#ffffff">Honor of Kings</text>
        <text x="18" y="46" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#fbbf24">Mulai Rp 15.000</text>
      </g>

      <g transform="translate(600, 0)">
        <rect x="0" y="0" width="180" height="60" rx="10" fill="#1e293b" stroke="rgba(234, 179, 8, 0.3)" stroke-width="1" />
        <text x="18" y="26" font-family="'Outfit', system-ui, sans-serif" font-size="14" font-weight="800" fill="#ffffff">PUBG Mobile</text>
        <text x="18" y="46" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#eab308">Mulai Rp 7.500</text>
      </g>

      <g transform="translate(800, 0)">
        <rect x="0" y="0" width="220" height="60" rx="10" fill="#1e293b" stroke="rgba(244, 63, 94, 0.3)" stroke-width="1" />
        <text x="18" y="26" font-family="'Outfit', system-ui, sans-serif" font-size="14" font-weight="800" fill="#ffffff">Valorant Points</text>
        <text x="18" y="46" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#f43f5e">Mulai Rp 15.000</text>
      </g>
    </g>
  </g>

  <g transform="translate(60, 540)">
    <text x="0" y="20" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="13" font-weight="700" fill="#ffffff">
      ⚡ PROSES 1-3 DETIK
    </text>
    <text x="170" y="20" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="13" font-weight="700" fill="#ffffff">
      🛡️ 100% LEGAL &amp; RESMI
    </text>
    <text x="370" y="20" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="13" font-weight="700" fill="#ffffff">
      💳 QRIS · DANA · GOPAY · OVO · VA
    </text>
    <text x="1080" y="20" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700" fill="#f59e0b" text-anchor="end">
      ${totalProducts}+ PRODUK TERSEDIA 24 JAM
    </text>
  </g>
</svg>
`.trim();
}

/**
 * Safely converts an SVG string into a Base64 Data URI that can be used directly
 * in <meta property="og:image"> and <meta name="twitter:image">.
 */
export function svgToDataUri(svg: string): string {
  try {
    if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
      const base64 = window.btoa(unescape(encodeURIComponent(svg)));
      return `data:image/svg+xml;base64,${base64}`;
    }
  } catch (e) {
    console.warn('Base64 encoding fallback:', e);
  }
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Generates dynamic Open Graph Image Data URL for a specific game product.
 * Prefers the high-resolution canvas PNG approach, falling back to SVG Data URI.
 */
export function generateGameOgImageUrl(
  product: ProductItem,
  storeName: string = 'TOPGAME ID'
): string {
  // Use canvas-based PNG generator for crisp rendering in webviews and social cards
  if (typeof document !== 'undefined') {
    const canvasPng = generateGameCanvasOgImage(product, storeName);
    if (canvasPng && canvasPng.startsWith('data:image/png')) {
      return canvasPng;
    }
  }
  const svg = generateGameOgImageSvg(product, storeName);
  return svgToDataUri(svg);
}

/**
 * Generates dynamic Open Graph Image Data URL for the storefront home page
 */
export function generateDefaultStoreOgImageUrl(
  storeName: string = 'TOPGAME ID',
  totalProducts: number = 25
): string {
  if (typeof document !== 'undefined') {
    const canvasPng = generateDefaultStoreCanvasOgImage(storeName, totalProducts);
    if (canvasPng && canvasPng.startsWith('data:image/png')) {
      return canvasPng;
    }
  }
  const svg = generateDefaultStoreOgImageSvg(storeName, totalProducts);
  return svgToDataUri(svg);
}

/**
 * Converts dynamic SVG to a high-resolution PNG Data URL via client-side Canvas
 */
export function generateGameOgImagePng(
  product: ProductItem,
  storeName: string = 'TOPGAME ID'
): Promise<string> {
  return new Promise((resolve) => {
    // Direct sync canvas generation if available
    if (typeof document !== 'undefined') {
      const directCanvas = generateGameCanvasOgImage(product, storeName);
      if (directCanvas && directCanvas.startsWith('data:image/png')) {
        return resolve(directCanvas);
      }
    }

    try {
      const svg = generateGameOgImageSvg(product, storeName);
      const svgUrl = svgToDataUri(svg);
      const img = new Image();

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 1200;
          canvas.height = 630;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(svgUrl);
          ctx.drawImage(img, 0, 0, 1200, 630);
          resolve(canvas.toDataURL('image/png'));
        } catch (err) {
          resolve(svgUrl);
        }
      };

      img.onerror = () => resolve(svgUrl);
      img.src = svgUrl;
    } catch (err) {
      resolve(generateGameOgImageUrl(product, storeName));
    }
  });
}

/**
 * Generates standard XML sitemap for search engine crawlers (Googlebot, Bingbot, etc.)
 */
export function generateSitemapXml(products: ProductItem[], baseUrl: string): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const currentDate = new Date().toISOString().split('T')[0];

  const staticUrls = [
    { loc: `${cleanBase}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${cleanBase}/?tab=flash-sale`, priority: '0.8', changefreq: 'daily' },
    { loc: `${cleanBase}/?tab=reseller`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${cleanBase}/?tab=faq`, priority: '0.6', changefreq: 'monthly' },
  ];

  const productUrls = products.map((product) => {
    const priority =
      product.popularityScore && product.popularityScore >= 90
        ? '0.9'
        : product.popularityScore && product.popularityScore >= 80
        ? '0.8'
        : '0.7';

    return {
      loc: `${cleanBase}/?game=${encodeURIComponent(product.id)}`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority,
      name: product.name,
      publisher: product.publisher,
    };
  });

  const xmlEntries = [
    ...staticUrls.map(
      (item) => `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
    ),
    ...productUrls.map(
      (item) => `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
    ),
  ].join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${xmlEntries}
</urlset>`.trim();
}

/**
 * Generates standard robots.txt file content
 */
export function generateRobotsTxt(baseUrl: string): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  return `# robots.txt for TOPGAME ID
User-agent: *
Allow: /
Disallow: /?admin=
Disallow: /?dasbor=
Disallow: /?owner=

# Sitemap index
Sitemap: ${cleanBase}/sitemap.xml
`.trim();
}

/**
 * Triggers a client-side download of a generated text/xml/image file
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = 'text/xml'
) {
  try {
    if (content.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = content;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to trigger download:', error);
  }
}

/**
 * Updates dynamic meta tags, OpenGraph cards, Twitter cards, and Schema.org JSON-LD
 * with full support for dynamic game Open Graph images and meta descriptions based
 * on the current product catalog.
 */
export function updateDynamicMetaTags(
  product: ProductItem | null,
  storeName: string = 'TOPGAME ID',
  totalCatalogCount: number = 25
) {
  if (typeof document === 'undefined') return;

  const currentOrigin =
    window.location.origin ||
    'https://ais-pre-xiqsshz3gdolqtftzuvjii-902424592462.asia-east1.run.app';

  if (product) {
    // 1. Calculate live prices from denominations
    const lowestPrice = Math.min(...product.denominations.map((d) => d.basePrice));
    const highestPrice = Math.max(...product.denominations.map((d) => d.basePrice));
    const formattedPrice = `Rp ${lowestPrice.toLocaleString('id-ID')}`;

    // 2. Dynamic Title & Descriptions
    const title = `Top Up ${product.name} Murah Mulai ${formattedPrice} - ${storeName}`;
    const description = generateGameMetaDescription(product, storeName);
    const canonicalUrl = `${currentOrigin}/?game=${encodeURIComponent(product.id)}`;

    // 3. Dynamic Open Graph Image: Canvas-based PNG generator with fallback to Cloudinary/Vercel OG URL
    const dynamicOgImageUrl = generateGameCanvasOgImage(product, storeName);
    const vercelOgUrl = generateVercelOgImageUrl(product, storeName, currentOrigin);

    // Document Title
    document.title = title;

    // Standard Meta Description
    setOrCreateMeta('name', 'description', description);

    // OpenGraph Protocol
    setOrCreateMeta('property', 'og:title', title);
    setOrCreateMeta('property', 'og:description', description);
    setOrCreateMeta('property', 'og:url', canonicalUrl);
    setOrCreateMeta('property', 'og:type', 'product');
    setOrCreateMeta('property', 'og:site_name', storeName);
    setOrCreateMeta('property', 'og:image', dynamicOgImageUrl);
    setOrCreateMeta('property', 'og:image:secure_url', dynamicOgImageUrl);
    setOrCreateMeta('property', 'og:image:type', 'image/png');
    setOrCreateMeta('property', 'og:image:width', '1200');
    setOrCreateMeta('property', 'og:image:height', '630');
    setOrCreateMeta('property', 'og:image:alt', `Banner Top Up Resmi ${product.name} Termurah di ${storeName}`);

    // Twitter / X Large Summary Card
    setOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    setOrCreateMeta('name', 'twitter:title', title);
    setOrCreateMeta('name', 'twitter:description', description);
    setOrCreateMeta('name', 'twitter:image', dynamicOgImageUrl);
    setOrCreateMeta('name', 'twitter:image:alt', `Top Up ${product.name} Mulai ${formattedPrice}`);

    // Canonical URL Link
    setOrCreateLink('canonical', canonicalUrl);

    // Schema.org Product JSON-LD Structured Data
    const jsonLdData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `Top Up ${product.name}`,
      description,
      image: dynamicOgImageUrl,
      url: canonicalUrl,
      brand: {
        '@type': 'Brand',
        name: product.publisher || 'Official Game Publisher',
      },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'IDR',
        lowPrice: lowestPrice,
        highPrice: highestPrice,
        offerCount: product.denominations.length,
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: storeName,
        },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        bestRating: '5',
        worstRating: '1',
        ratingCount: (product.popularityScore * 16).toString(),
      },
    };

    setOrCreateJsonLd('product-jsonld', jsonLdData);
  } else {
    // Default Storefront Homepage Meta
    const defaultTitle = `${storeName} - Top Up Game, Pulsa, E-Wallet & Tagihan 24 Jam`;
    const defaultDescription =
      `Layanan top up game otomatis 24 jam termurah se-Indonesia. Tersedia Diamond MLBB, FF, Honor of Kings, UC PUBG, Pulsa, E-Wallet, dan Reseller VIP.`;
    const defaultUrl = `${currentOrigin}/`;
    const defaultOgImageUrl = generateDefaultStoreCanvasOgImage(storeName, totalCatalogCount);

    document.title = defaultTitle;
    setOrCreateMeta('name', 'description', defaultDescription);

    // OpenGraph
    setOrCreateMeta('property', 'og:title', defaultTitle);
    setOrCreateMeta('property', 'og:description', defaultDescription);
    setOrCreateMeta('property', 'og:url', defaultUrl);
    setOrCreateMeta('property', 'og:type', 'website');
    setOrCreateMeta('property', 'og:site_name', storeName);
    setOrCreateMeta('property', 'og:image', defaultOgImageUrl);
    setOrCreateMeta('property', 'og:image:secure_url', defaultOgImageUrl);
    setOrCreateMeta('property', 'og:image:type', 'image/png');
    setOrCreateMeta('property', 'og:image:width', '1200');
    setOrCreateMeta('property', 'og:image:height', '630');
    setOrCreateMeta('property', 'og:image:alt', `Official Storefront ${storeName}`);

    // Twitter Card
    setOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    setOrCreateMeta('name', 'twitter:title', defaultTitle);
    setOrCreateMeta('name', 'twitter:description', defaultDescription);
    setOrCreateMeta('name', 'twitter:image', defaultOgImageUrl);
    setOrCreateMeta('name', 'twitter:image:alt', `Official Storefront ${storeName}`);

    setOrCreateLink('canonical', defaultUrl);

    // Schema.org OnlineStore JSON-LD
    const storeJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'OnlineStore',
      name: storeName,
      description: defaultDescription,
      url: defaultUrl,
      image: defaultOgImageUrl,
      currenciesAccepted: 'IDR',
      paymentAccepted: 'QRIS, DANA, GoPay, OVO, ShopeePay, Bank Transfer',
      priceRange: 'Rp 1.000 - Rp 3.000.000',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${defaultUrl}?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };

    setOrCreateJsonLd('product-jsonld', storeJsonLd);
  }
}

function setOrCreateMeta(keyAttr: 'name' | 'property', keyValue: string, content: string) {
  let element = document.querySelector(`meta[${keyAttr}="${keyValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(keyAttr, keyValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setOrCreateLink(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute(rel, rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

function setOrCreateJsonLd(id: string, data: object) {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data, null, 2);
}
