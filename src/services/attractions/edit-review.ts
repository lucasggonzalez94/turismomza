import axiosInstance from '@/config/axiosInstance';
import { Review } from '@/interfaces/attraction';

export const editReviewService = async (
  reviewId: string,
  {
    attractionId,
    rating,
    review,
  }: {
    attractionId: string;
    rating: number;
    review: string;
  },
): Promise<Review> => {
  const response = await axiosInstance.put(`/reviews/${reviewId}`, {
    attractionId,
    rating,
    content: review,
  });
  return response?.data;
};
