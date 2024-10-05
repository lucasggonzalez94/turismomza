export interface Attraction {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  category: string;
  creatorId: string;
  creation_date: Date | string | string;
  services: string[];
  contactNumber: string | null;
  email: string | null;
  webSite: string | null;
  instagram: string | null;
  facebook: string | null;
  timeOpen: string | null;
  timeClose: string | null;
  price: number | null;
  currencyPrice: string | null;
  advertisements?: Advertisement[];
  isFavorite: boolean;
  images: Image[];
  comments: Comment[];
}

export interface Advertisement {
  id: string;
  attractionId: string;
  userId: string;
  createdAt: Date | string;
  startDate: Date | string;
  endDate: Date | string;
  amountPaid: number;
  isActive: boolean;
  impressions: number;
  clicks: number;
}

export interface Comment {
  content: string;
  rating: number;
  user: User;
  creation_date: Date | string;
  likes: Like[];
  reports: any[];
}

export interface Image {
  public_id: string;
  url: string;
}

export interface Like {
  user: User;
}

export interface User {
  name: string;
}
