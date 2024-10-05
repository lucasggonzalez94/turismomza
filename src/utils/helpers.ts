import { redirect } from 'next/navigation';
import { Comment } from '@/interfaces/attraction';

export const navigation = (path: string) => {
  redirect(path);
};

export const calculateAverageRating = (comments: Comment[]) => {
  if (!comments || comments.length === 0) return 0;

  const totalRating = comments.reduce(
    (sum, comment) => sum + comment.rating,
    0,
  );
  const averageRating = totalRating / comments.length;

  return averageRating;
};
