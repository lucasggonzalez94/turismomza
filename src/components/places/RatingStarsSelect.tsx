'use client';

import { FC, useState } from 'react';
import { IoStar } from 'react-icons/io5';
import { cn } from '@/lib/utils';

interface RatingStarsSelectProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  label?: string;
  className?: string;
}

export const RatingStarsSelect: FC<RatingStarsSelectProps> = ({
  value,
  onChange,
  max = 5,
  label,
  className,
}) => {
  const [hover, setHover] = useState<number | null>(null);
  const activeValue = hover ?? value ?? max;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label ? <h3 className="text-sm mb-1 font-medium">{label}</h3> : null}
      <div className="flex items-center gap-0">
        {Array.from({ length: max }).map((_, idx) => {
          const rating = idx + 1;
          const isActive = activeValue >= rating;
          return (
            <button
              key={rating}
              type="button"
              onMouseEnter={() => setHover(rating)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onChange(rating)}
              className="p-1"
              aria-label={`Calificación ${rating} estrellas`}
            >
              <IoStar
                className={`h-5 w-5 ${
                  isActive ? 'text-trinidad-600' : 'text-gray-400'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
