import axiosInstance from '@/config/axiosInstance';

export const likeDislikeReviewService = async (
  reviewId: string,
): Promise<any> => {
  const response = await axiosInstance.post(`/reviews/like`, {
    reviewId,
  });
  return response?.data;
};
