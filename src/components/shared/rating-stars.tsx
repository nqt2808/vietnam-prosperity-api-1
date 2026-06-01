import React from 'react'
import { Star, StarHalf } from 'lucide-react'

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  className?: string;
}

export function RatingStars({ rating, reviewCount, className = "" }: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.4;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className={`flex items-center gap-1.5 text-amber-400 ${className}`}>
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-current" />
        ))}
        {hasHalf && <StarHalf className="w-4 h-4 fill-current" />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-zinc-300 dark:text-zinc-700 fill-none" />
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className="text-xs text-zinc-500 dark:text-zinc-400">({reviewCount})</span>
      )}
    </div>
  );
}
