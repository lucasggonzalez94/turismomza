import axiosInstance from '@/config/axiosInstance';

export const addReviewService = async ({
  placeId,
  rating,
  content,
}: {
  placeId: string;
  rating: number;
  content: string;
}): Promise<any> => {
  const response = await axiosInstance.post(`/reviews`, {
    placeId,
    rating,
    content,
  });
  return response?.data;
};
