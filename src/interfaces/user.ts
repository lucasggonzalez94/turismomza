export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
  twoFactorEnabled?: boolean;
  profilePicture?: IProfilePicture | null;
  createdAt?: string;
  bio?: string;
  location?: string;
  website?: string;
  language?: string[];
  verified?: boolean;
  placesCount?: number;
  reviewCount?: number;
}

interface IProfilePicture {
  id: string;
  public_id: string;
  url: string;
}
