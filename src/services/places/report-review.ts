import axiosInstance from '@/config/axiosInstance';

export const reportReviewService = async (
  reviewId: string,
  reason: string,
): Promise<any> => {
  const response = await axiosInstance.post('/reviews/report', {
    reviewId,
    reason,
  });
  return response?.data;
};
