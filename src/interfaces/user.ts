export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
  two_factor_enabled?: boolean;
  profilePicture?: IProfilePicture | null;
  createdAt?: string;
  bio?: string;
  location?: string;
  website?: string;
  language?: string[];
  verified?: boolean;
  places_count?: number;
  review_count?: number;
}

interface IProfilePicture {
  id: string;
  public_id: string;
  url: string;
}
