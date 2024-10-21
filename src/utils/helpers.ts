import { redirect } from 'next/navigation';
import { Review } from '@/interfaces/attraction';

export const navigation = (path: string) => {
  redirect(path);
};

export const calculateAverageRating = (reviews: Review[]) => {
  if (!reviews || reviews.length === 0) return 0;

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  return averageRating;
};

export const formatPrice = (price: number, currency: 'ars' | 'usd'): string => {
  const formatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: currency === 'ars' ? 'ARS' : 'USD',
  });
  return formatter.format(price);
};
