import { Like } from './place';

export interface FormattedReview {
  id: string;
  user: {
    id: string;
    name: string;
  };
  dateAdded: string;
  content: string;
  rating: number;
  likes: Like[];
}
