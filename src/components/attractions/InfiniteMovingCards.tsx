'use client';

import React, { FC, useEffect, useRef, useState } from 'react';
import ReviewCard from './ReviewCard';

interface IPropsInfiniteMovingCards {
  // reviews: {
  //   userName: string;
  //   dateAdded: string;
  //   content: string;
  //   rating: number;
  //   likes: any[];
  // }[];
  direction?: 'left' | 'right';
  speed?: 'fast' | 'normal' | 'slow';
  pauseOnHover?: boolean;
  className?: string;
}

export const InfiniteMovingCards: FC<IPropsInfiniteMovingCards> = () => {
  const [likedReviews, setLikedReviews] = useState({});
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleLike = (id: string) => {
    console.log(id);
  };

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
        {/* {[...comments, ...comments].map((comment, index) => (
          <div key={`${comment.id}-${index}`} className="flex-shrink-0">
            <ReviewCard
              review={{
                ...comment,
                likes: likedComments[comment.id]
                  ? comment.likes + 1
                  : comment.likes,
              }}
              onLike={handleLike}
            />
          </div>
        ))} */}
        <div className="flex-shrink-0">
          <ReviewCard />
        </div>
        <div className="flex-shrink-0">
          <ReviewCard />
        </div>
        <div className="flex-shrink-0">
          <ReviewCard />
        </div>
        <div className="flex-shrink-0">
          <ReviewCard />
        </div>
        <div className="flex-shrink-0">
          <ReviewCard />
        </div>
        <div className="flex-shrink-0">
          <ReviewCard />
        </div>
        <div className="flex-shrink-0">
          <ReviewCard />
        </div>
        <div className="flex-shrink-0">
          <ReviewCard />
        </div>
        <div className="flex-shrink-0">
          <ReviewCard />
        </div>
        <div className="flex-shrink-0">
          <ReviewCard />
        </div>
      </div>
    </div>
  );
};
