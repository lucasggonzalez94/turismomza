'use client';

import { FC, useState } from 'react';
import { IoStar } from 'react-icons/io5';

interface IPropsStarsRating {
  onRatingChange?: (rating: number) => void;
  ratingValue?: number; // Este valor será controlado por react-hook-form
}

const StarsRating: FC<IPropsStarsRating> = ({
  onRatingChange,
  ratingValue = 0,
}) => {
  const [hover, setHover] = useState(0);

  const handleRatingChange = (newRating: number) => {
    if (onRatingChange) {
      onRatingChange(newRating); // Actualizar el rating en react-hook-form
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className="focus:outline-none transition-colors duration-200"
          onClick={() => handleRatingChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          <IoStar
            className={`w-8 h-8 sm:w-10 sm:h-10 ${
              star <= (hover || ratingValue)
                ? 'text-trinidad-600'
                : 'text-gray-400'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarsRating;
