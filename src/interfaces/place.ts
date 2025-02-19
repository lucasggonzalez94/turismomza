export interface Place {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  category: string;
  creatorId: string;
  creation_date: Date | string | string;
  services: string[];
  contactNumber?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  schedule?: string;
  price?: number;
  currencyPrice?: 'ars' | 'usd';
  advertisements?: Advertisement[];
  isFavorite: boolean;
  images: IImage[];
  reviews: Review[];
}

export interface Advertisement {
  id: string;
  placeId: string;
  userId: string;
  createdAt: Date | string;
  startDate: Date | string;
  endDate: Date | string;
  amountPaid: number;
  isActive: boolean;
  impressions: number;
  clicks: number;
}

export interface Review {
  id: string;
  content: string;
  rating: number;
  user: User;
  creationDate: Date | string;
  likes: Like[];
  reports: any[];
}

export interface IImage {
  publicId: string;
  url: string;
}

export interface Like {
  id: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
}
