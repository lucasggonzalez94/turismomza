import axiosInstance from '@/config/axiosInstance';
import { Review } from '@/interfaces/place';

export const editReviewService = async (
  reviewId: string,
  {
    placeId,
    rating,
    review,
  }: {
    placeId: string;
    rating: number;
    review: string;
  },
): Promise<Review> => {
  const response = await axiosInstance.put(`/reviews/${reviewId}`, {
    placeId,
    rating,
    content: review,
  });
  return response?.data;
};
