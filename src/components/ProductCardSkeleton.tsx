import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-sm select-none"
    >
      <div className="space-y-3">
        {/* Top: Icon + Title & Publisher Skeletons */}
        <div className="flex items-start gap-3.5">
          {/* Icon Skeleton */}
          <div className="w-12 h-12 rounded-xl bg-neutral-800/80 animate-pulse shrink-0" />

          <div className="min-w-0 flex-1 space-y-2 py-0.5">
            {/* Publisher / Badge Skeleton */}
            <div className="h-2.5 w-24 bg-neutral-800/70 rounded animate-pulse" />

            {/* Title Skeleton */}
            <div className="h-4 w-36 bg-neutral-800 rounded animate-pulse" />
          </div>
        </div>

        {/* Subtypes Skeleton */}
        <div className="h-3 w-4/5 bg-neutral-800/50 rounded animate-pulse" />
      </div>

      {/* Bottom: Price baseline & Action CTA Skeleton */}
      <div className="pt-4 mt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
        <div className="space-y-1.5">
          <div className="h-2 w-12 bg-neutral-800/50 rounded animate-pulse" />
          <div className="h-4 w-20 bg-neutral-800/80 rounded animate-pulse" />
        </div>

        <div className="h-7 w-20 bg-neutral-800 rounded-lg animate-pulse shrink-0" />
      </div>
    </div>
  );
};
