import axiosInstance from '@/config/axiosInstance';

export const addReviewService = async ({
  attractionId,
  rating,
  review,
}: {
  attractionId: string;
  rating: number;
  review: string;
}): Promise<any> => {
  const response = await axiosInstance.post(`/reviews`, {
    attractionId,
    rating,
    content: review,
  });
  return response?.data;
};
