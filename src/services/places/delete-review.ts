import axiosInstance from '@/config/axiosInstance';

export const deleteReviewService = async (reviewId: string): Promise<any> => {
  const response = await axiosInstance.delete(`/reviews/${reviewId}`);
  return response?.data;
};
