import { Like } from './attraction';

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
