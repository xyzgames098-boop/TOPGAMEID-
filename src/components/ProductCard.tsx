import React from 'react';
import { ProductItem, MembershipTier } from '../types/topup';
import { GameIcon } from './GameIcon';
import { ArrowRight } from 'lucide-react';
import { MEMBERSHIP_TIER_CONFIG } from '../data/topupData';

interface ProductCardProps {
  product: ProductItem;
  currentTier: MembershipTier;
  onSelectProduct: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currentTier,
  onSelectProduct,
}) => {
  const tierConfig = MEMBERSHIP_TIER_CONFIG[currentTier];

  // Calculate lowest price in denominations
  const lowestBasePrice = Math.min(...product.denominations.map((d) => d.basePrice));
  const lowestVipPrice = Math.min(
    ...product.denominations.map((d) => d.vipSellerPrice ?? Math.round(d.basePrice * 0.905))
  );
  const finalLowestPrice = Math.round(lowestBasePrice * (1 - tierConfig.discountRate));

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group relative bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700/80 rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-0.5 shadow-sm"
    >
      <div className="space-y-3">
        {/* Top: Icon + Title & Publisher */}
        <div className="flex items-start gap-3.5">
          <GameIcon type={product.iconType} className="w-12 h-12 shrink-0 rounded-xl" />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
              <span className="truncate">{product.publisher}</span>
              {product.badge && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-400 font-semibold truncate">{product.badge}</span>
                </>
              )}
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors truncate">
              {product.name}
            </h3>
          </div>
        </div>

        {/* Subtypes clean unboxed text metadata */}
        <div className="text-xs text-neutral-400 line-clamp-1">
          {product.subtypes.map((sub, idx) => (
            <React.Fragment key={sub}>
              <span className="text-neutral-300 font-medium">{sub}</span>
              {idx < product.subtypes.length - 1 && (
                <span aria-hidden="true" className="mx-1 text-neutral-600">
                  ·
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Bottom: Price baseline & Action CTA */}
      <div className="pt-3.5 mt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wide">Mulai</span>
            <span className="text-[9px] font-mono font-semibold px-1 py-0.2 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50" title="Harga Modal Asli VIP Seller (H2H)">
              VIP Rp {lowestVipPrice.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="text-sm font-bold text-amber-400 font-mono tabular-nums">
            Rp {finalLowestPrice.toLocaleString('id-ID')}
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectProduct(product);
          }}
          className="px-3 py-1.5 text-xs font-semibold text-neutral-200 bg-neutral-800 group-hover:bg-amber-400 group-hover:text-neutral-950 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
        >
          <span>Top Up</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
