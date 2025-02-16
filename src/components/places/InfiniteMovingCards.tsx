'use client';

import React, { FC, useEffect, useRef, useState } from 'react';
import ReviewCard from './ReviewCard';
import { FormattedReview } from '@/interfaces/formattedReview';

interface IPropsInfiniteMovingCards {
  reviews: FormattedReview[];
  setReviews: (reviews: FormattedReview[]) => void;
  placeId: string;
}

export const InfiniteMovingCards: FC<IPropsInfiniteMovingCards> = ({
  reviews,
  setReviews,
  placeId,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    let animationId: number;

    const animate = () => {
      if (!isPaused && !isDragging && slider) {
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
  }, [isPaused, isDragging]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const slider = sliderRef.current;
    if (slider) {
      setIsDragging(true);
      setStartX(e.pageX - slider.offsetLeft);
      setScrollLeft(slider.scrollLeft);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();

    const slider = sliderRef.current;
    if (slider) {
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1;
      slider.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  return (
    <div className="w-full py-8 select-none">
      <div
        ref={sliderRef}
        className="flex overflow-hidden space-x-6 cursor-grab"
        style={{ width: 'calc(100% + 1.5rem)', maxWidth: '100%' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {(reviews.length >= 5 ? [...reviews, ...reviews] : reviews).map(
          (review, index) => (
            <div key={`${review.id}-${index}`} className="flex-shrink-0">
              <ReviewCard
                review={review}
                reviews={reviews}
                setReviews={setReviews}
                placeId={placeId}
              />
            </div>
          ),
        )}
      </div>
    </div>
  );
};
