'use client';

import React, { FC, useEffect, useRef, useState } from 'react';
import ReviewCard from './ReviewCard';
import { FormattedReview } from '@/interfaces/formattedReview';

interface IPropsInfiniteMovingCards {
  reviews: FormattedReview[];
}

export const InfiniteMovingCards: FC<IPropsInfiniteMovingCards> = ({
  reviews,
}) => {
  const [likedReviews, setLikedReviews] = useState({});
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    let animationId: number;

    const animate = () => {
      if (!isPaused && slider) {
        slider.scrollLeft += 1;
        if (slider.scrollLeft >= slider.scrollWidth / 2) {
          slider.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPaused]);

  return (
    <div className="w-full py-8">
      <div
        ref={sliderRef}
        className="flex overflow-hidden space-x-6"
        style={{ width: 'calc(100% + 1.5rem)' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {[...reviews, ...reviews].map((review, index) => (
          <div key={`${review.id}-${index}`} className="flex-shrink-0">
            <ReviewCard review={review} />
          </div>
        ))}
      </div>
    </div>
  );
};
