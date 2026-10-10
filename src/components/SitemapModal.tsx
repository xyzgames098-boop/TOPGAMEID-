import React, { useState, useMemo } from 'react';
import {
  X,
  FileCode,
  Download,
  Copy,
  Check,
  Globe,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Search,
  CheckCircle2,
  FileText,
  Share2,
  Image as ImageIcon,
  Layers,
  ChevronDown,
  Terminal,
} from 'lucide-react';
import { ProductItem } from '../types/topup';
import {
  generateSitemapXml,
  generateRobotsTxt,
  downloadFile,
  generateGameMetaDescription,
  generateGameCanvasOgImage,
  generateVercelOgImageUrl,
  generateCloudinaryOgImageUrl,
  generateGameOgImageSvg,
  generateGameOgImageUrl,
  generateGameOgImagePng,
  generateDefaultStoreOgImageSvg,
  generateDefaultStoreOgImageUrl,
  generateDefaultStoreCanvasOgImage,
} from '../utils/seoUtils';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  storeName?: string;
}

export const SitemapModal: React.FC<SitemapModalProps> = ({
  isOpen,
  onClose,
  products,
  storeName = 'TOPGAME ID',
}) => {
  const [activeView, setActiveView] = useState<'og-preview' | 'sitemap' | 'robots' | 'guide'>('og-preview');
  const [selectedGameId, setSelectedGameId] = useState<string>(products[0]?.id || 'mlbb');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedVercelUrl, setCopiedVercelUrl] = useState(false);
  const [copiedCloudinaryUrl, setCopiedCloudinaryUrl] = useState(false);
  const [isExportingPng, setIsExportingPng] = useState(false);

  const baseUrl =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://ais-pre-xiqsshz3gdolqtftzuvjii-902424592462.asia-east1.run.app';

  // Selected Product for OG Preview
  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === selectedGameId) || products[0] || null;
  }, [products, selectedGameId]);

  // Dynamic Canvas-based PNG & SVG Open Graph representations
  const currentOgCanvasPng = useMemo(() => {
    if (!selectedProduct) return generateDefaultStoreCanvasOgImage(storeName, products.length);
    return generateGameCanvasOgImage(selectedProduct, storeName);
  }, [selectedProduct, storeName, products.length]);

  const currentOgSvg = useMemo(() => {
    if (!selectedProduct) return generateDefaultStoreOgImageSvg(storeName, products.length);
    return generateGameOgImageSvg(selectedProduct, storeName);
  }, [selectedProduct, storeName, products.length]);

  const vercelOgUrl = useMemo(() => {
    if (!selectedProduct) return `${baseUrl}/api/og?brand=${encodeURIComponent(storeName)}`;
    return generateVercelOgImageUrl(selectedProduct, storeName, baseUrl);
  }, [selectedProduct, storeName, baseUrl]);

  const cloudinaryOgUrl = useMemo(() => {
    if (!selectedProduct) return '';
    return generateCloudinaryOgImageUrl(selectedProduct, storeName);
  }, [selectedProduct, storeName]);

  const currentMetaDescription = useMemo(() => {
    if (!selectedProduct) {
      return `Layanan top up game otomatis 24 jam termurah se-Indonesia. Tersedia Diamond MLBB, FF, Honor of Kings, UC PUBG, Pulsa, E-Wallet, dan Reseller VIP di ${storeName}.`;
    }
    return generateGameMetaDescription(selectedProduct, storeName);
  }, [selectedProduct, storeName]);

  const currentMetaTitle = useMemo(() => {
    if (!selectedProduct) {
      return `${storeName} - Top Up Game, Pulsa, E-Wallet & Tagihan 24 Jam`;
    }
    const lowest = Math.min(...selectedProduct.denominations.map((d) => d.basePrice));
    return `Top Up ${selectedProduct.name} Murah Mulai Rp ${lowest.toLocaleString('id-ID')} - ${storeName}`;
  }, [selectedProduct, storeName]);

  const sitemapXml = useMemo(() => {
    return generateSitemapXml(products, baseUrl);
  }, [products, baseUrl]);

  const robotsTxt = useMemo(() => {
    return generateRobotsTxt(baseUrl);
  }, [baseUrl]);

  if (!isOpen) return null;

  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  const handleCopyUrl = () => {
    try {
      navigator.clipboard.writeText(sitemapUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyDesc = () => {
    try {
      navigator.clipboard.writeText(currentMetaDescription);
      setCopiedDesc(true);
      setTimeout(() => setCopiedDesc(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyVercelUrl = () => {
    try {
      navigator.clipboard.writeText(vercelOgUrl);
      setCopiedVercelUrl(true);
      setTimeout(() => setCopiedVercelUrl(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyCloudinaryUrl = () => {
    try {
      navigator.clipboard.writeText(cloudinaryOgUrl);
      setCopiedCloudinaryUrl(true);
      setTimeout(() => setCopiedCloudinaryUrl(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyContent = () => {
    try {
      let text = '';
      if (activeView === 'sitemap') text = sitemapXml;
      else if (activeView === 'robots') text = robotsTxt;
      else text = currentMetaDescription;

      navigator.clipboard.writeText(text);
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = async () => {
    if (activeView === 'sitemap') {
      downloadFile(sitemapXml, 'sitemap.xml', 'application/xml');
    } else if (activeView === 'robots') {
      downloadFile(robotsTxt, 'robots.txt', 'text/plain');
    } else if (activeView === 'og-preview') {
      // Download SVG
      const filename = `og-card-${selectedProduct?.id || 'store'}.svg`;
      downloadFile(currentOgSvg, filename, 'image/svg+xml');
    }
  };

  const handleDownloadPng = async () => {
    if (!selectedProduct) return;
    setIsExportingPng(true);
    try {
      const pngData = currentOgCanvasPng.startsWith('data:image/png')
        ? currentOgCanvasPng
        : await generateGameOgImagePng(selectedProduct, storeName);
      const filename = `og-card-${selectedProduct.id}.png`;
      downloadFile(pngData, filename, 'image/png');
    } catch (err) {
      console.error('PNG download error:', err);
    } finally {
      setIsExportingPng(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950/90">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <Share2 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>SEO Suite & Open Graph Generator</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                  {products.length} Game Landing Pages
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                Generator dinamis kartu gambar media sosial (Canvas 2D & Vercel/Cloudinary API) dan meta deskripsi katalog.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-neutral-800/80 bg-neutral-950 overflow-x-auto text-xs shrink-0 gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveView('og-preview')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeView === 'og-preview'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Kartu Open Graph Canvas & Meta</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('sitemap')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeView === 'sitemap'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>sitemap.xml ({products.length + 4} URLs)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('robots')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeView === 'robots'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>robots.txt</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('guide')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeView === 'guide'
                  ? 'bg-emerald-500 text-neutral-950 shadow-sm font-bold'
                  : 'text-emerald-400 hover:text-white hover:bg-emerald-950/40 border border-emerald-500/20'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Submit Google Console</span>
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeView === 'og-preview' ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  disabled={isExportingPng}
                  className="px-2.5 py-1.5 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors flex items-center gap-1 border border-neutral-700 disabled:opacity-50"
                  title="Unduh gambar PNG 1200x630 hasil render Canvas dinamis"
                >
                  {isExportingPng ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  <span>Unduh PNG (Canvas)</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-2.5 py-1.5 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                  title="Unduh vektor SVG 1200x630"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh SVG</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyContent}
                  className="px-2.5 py-1.5 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors flex items-center gap-1 border border-neutral-700"
                >
                  {copiedContent ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedContent ? 'Tersalin!' : 'Salin Kode'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-2.5 py-1.5 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh File</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-5 space-y-4">
          {activeView === 'og-preview' && (
            <div className="space-y-4">
              {/* Game Selector Bar */}
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-300 whitespace-nowrap">Pilih Produk Game:</span>
                  <div className="relative">
                    <select
                      value={selectedGameId}
                      onChange={(e) => setSelectedGameId(e.target.value)}
                      className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-amber-400 appearance-none pr-8 cursor-pointer"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.publisher})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Engine: <strong>HTML5 Canvas 2D &amp; Edge OG API</strong></span>
                  </span>
                  <span>·</span>
                  <span>Rasio: <strong>1200 x 630 px</strong></span>
                </div>
              </div>

              {/* Dynamic Open Graph Image Card Live Canvas Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pratinjau Banner Dinamis Canvas (`og:image` &amp; `twitter:image`)</span>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono font-medium">
                    ✓ Dirender dinamis dari katalog produk
                  </span>
                </div>

                <div className="relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-2xl group">
                  <img
                    src={currentOgCanvasPng}
                    alt={`Open Graph Card ${selectedProduct?.name}`}
                    className="w-full h-auto aspect-[1200/630] object-contain block bg-black"
                  />
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/85 backdrop-blur-md rounded-md border border-white/10 text-[10px] font-mono text-neutral-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Dynamic Canvas PNG (1200x630)</span>
                  </div>
                </div>
              </div>

              {/* API Endpoints & Social Crawlers Integration Box */}
              <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Terminal className="w-3.5 h-3.5 text-amber-400" />
                    <span>API Endpoint URL untuk Crawler Eksternal</span>
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">Vercel &amp; Cloudinary Compatible</span>
                </div>

                {/* Vercel OG API Endpoint */}
                <div className="flex items-center justify-between bg-neutral-900 p-2.5 rounded-lg border border-neutral-800 text-xs gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] text-amber-400 font-mono font-bold block">Vercel / Edge OG URL:</span>
                    <span className="font-mono text-neutral-300 text-[11px] truncate block">{vercelOgUrl}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyVercelUrl}
                    className="px-2 py-1 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white rounded transition-colors shrink-0 flex items-center gap-1"
                  >
                    {copiedVercelUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedVercelUrl ? 'Tersalin' : 'Salin URL'}</span>
                  </button>
                </div>

                {/* Cloudinary Dynamic Transform URL */}
                {cloudinaryOgUrl && (
                  <div className="flex items-center justify-between bg-neutral-900 p-2.5 rounded-lg border border-neutral-800 text-xs gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] text-sky-400 font-mono font-bold block">Cloudinary Transform URL:</span>
                      <span className="font-mono text-neutral-300 text-[11px] truncate block">{cloudinaryOgUrl}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyCloudinaryUrl}
                      className="px-2 py-1 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white rounded transition-colors shrink-0 flex items-center gap-1"
                    >
                      {copiedCloudinaryUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCloudinaryUrl ? 'Tersalin' : 'Salin URL'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Social Card Snippet Preview (WhatsApp / Google Snippet Simulation) */}
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Simulasi Snippet Google &amp; Social Share Card</span>
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                        currentMetaDescription.length >= 120 && currentMetaDescription.length <= 160
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {currentMetaDescription.length} / 160 Karakter (Ideal)
                    </span>
                  </div>
                </div>

                {/* Simulated Social Card */}
                <div className="p-3.5 bg-neutral-900/90 border border-neutral-800 rounded-lg space-y-1.5 font-sans">
                  <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                    <span className="text-emerald-400 font-semibold">{baseUrl}</span>
                    <span>&rsaquo;</span>
                    <span className="text-neutral-500">?game={selectedProduct?.id}</span>
                  </div>
                  <h5 className="text-sm font-bold text-sky-400 hover:underline cursor-pointer">
                    {currentMetaTitle}
                  </h5>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {currentMetaDescription}
                  </p>
                </div>

                {/* Actions row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <div className="text-[11px] text-neutral-500 font-mono">
                    Canonical: {baseUrl}/?game={selectedProduct?.id}
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyDesc}
                    className="px-2.5 py-1 text-xs text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-md transition-colors flex items-center gap-1.5"
                  >
                    {copiedDesc ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedDesc ? 'Deskripsi Tersalin!' : 'Salin Meta Description'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeView === 'sitemap' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[11px] text-neutral-400 font-medium">URL Live Sitemap untuk Google Search Console:</span>
                  <p className="text-xs font-mono text-emerald-400 select-all truncate">{sitemapUrl}</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-3 py-1.5 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shrink-0 border border-neutral-700"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? 'Tersalin' : 'Salin URL'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-300 overflow-x-auto max-h-[380px] leading-relaxed selection:bg-amber-400 selection:text-neutral-950">
                  {sitemapXml}
                </pre>
              </div>
            </div>
          )}

          {activeView === 'robots' && (
            <div className="space-y-4">
              <p className="text-xs text-neutral-400 leading-relaxed">
                File <code>robots.txt</code> memberikan izin bot perayap Googlebot &amp; Bingbot untuk mengindeks semua katalog game publik Anda dan melarang perayapan ke dasbor pemilik rahasia.
              </p>
              <pre className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-300 overflow-x-auto leading-relaxed">
                {robotsTxt}
              </pre>
            </div>
          )}

          {activeView === 'guide' && (
            <div className="space-y-4 text-xs text-neutral-300">
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>3 Langkah Cepat Submit ke Google Search Console</span>
                </h4>
                <div className="space-y-2.5">
                  <div className="flex gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                    <p>Buka <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">Google Search Console</a> dan masukkan domain toko Anda.</p>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                    <p>Pilih menu <strong>Sitemaps (Peta Situs)</strong> pada bilah navigasi sebelah kiri.</p>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                    <p>Ketikkan <code>sitemap.xml</code> lalu klik <strong>Submit</strong>. Googlebot akan langsung mengindeks seluruh {products.length} game Anda beserta Open Graph cards!</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Open Graph 1200x630px Canvas &amp; API · Twitter Summary Card · Schema.org Product JSON-LD</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
