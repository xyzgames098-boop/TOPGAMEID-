import React, { useState, useEffect } from 'react';
import { ProductItem, Denomination, MembershipTier } from '../types/topup';
import { Flame, Clock, ArrowRight } from 'lucide-react';
import { GameIcon } from './GameIcon';
import { MEMBERSHIP_TIER_CONFIG } from '../data/topupData';

interface FlashSaleItemEntry {
  product: ProductItem;
  denom: Denomination;
}

interface FlashSaleSectionProps {
  products: ProductItem[];
  currentTier: MembershipTier;
  onSelectDeal: (product: ProductItem, denom: Denomination) => void;
}

export const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({
  products,
  currentTier,
  onSelectDeal,
}) => {
  // Collect all flash sale denoms
  const flashSaleItems: FlashSaleItemEntry[] = [];
  products.forEach((prod) => {
    prod.denominations.forEach((d) => {
      if (d.isFlashSale && d.flashSalePrice) {
        flashSaleItems.push({ product: prod, denom: d });
      }
    });
  });

  // Countdown timer to midnight / next flash sale round
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 5,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const tierConfig = MEMBERSHIP_TIER_CONFIG[currentTier];

  return (
    <section className="py-8 border-b border-neutral-800/80 bg-gradient-to-b from-neutral-900/40 to-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        {/* Header & Countdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-red-500 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                  Flash Sale Hari Ini
                </h2>
                <span className="text-[11px] font-mono text-red-400 font-bold px-2 py-0.5 rounded bg-red-950/60 border border-red-800">
                  DISKON SPESIAL
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Harga promo terbatas diperbarui setiap hari. Kuota terbatas!
              </p>
            </div>
          </div>

          {/* Countdown Clock Display */}
          <div className="flex items-center gap-2 text-xs text-neutral-400 self-start sm:self-auto bg-neutral-900 border border-neutral-800 px-3.5 py-1.5 rounded-xl">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Berakhir dalam:</span>
            <span className="font-mono font-bold text-amber-400 tabular-nums">
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Flash Sale Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {flashSaleItems.map(({ product, denom }) => {
            const rawFlashPrice = denom.flashSalePrice || denom.basePrice;
            const finalPrice = Math.round(rawFlashPrice * (1 - tierConfig.discountRate));
            const discountPercent = Math.round(((denom.basePrice - finalPrice) / denom.basePrice) * 100);

            return (
              <div
                key={`${product.id}-${denom.id}`}
                onClick={() => onSelectDeal(product, denom)}
                className="bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 rounded-xl p-3.5 transition-all cursor-pointer flex flex-col justify-between space-y-3 group shadow-md"
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <GameIcon type={product.iconType} className="w-10 h-10 shrink-0 rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] text-neutral-400 truncate">{product.name}</div>
                      <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                        {denom.name}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-base font-bold font-mono text-amber-400 tabular-nums">
                      Rp {finalPrice.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs text-neutral-500 line-through tabular-nums font-mono">
                      Rp {denom.basePrice.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] font-bold text-red-400 bg-red-950/60 px-1 rounded ml-auto">
                      -{discountPercent}%
                    </span>
                  </div>

                  {/* Stock left progress */}
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-[10px] text-neutral-400">
                      <span>Tersisa {denom.stockLeft || 24} slot</span>
                      <span className="text-amber-400 font-medium">Cepat habis</span>
                    </div>
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, ((denom.stockLeft || 24) / 75) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 group-hover:bg-amber-300 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <span>Beli Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
