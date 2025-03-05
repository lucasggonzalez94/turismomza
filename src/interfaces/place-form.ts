import { DayConfig } from './schedule';

export interface IPlaceFormDetails {
  name?: string;
  description?: string;
  category?: string;
  otherCategory?: string;
  services?: string[];
  otherServices?: string;
  price?: number;
  currency?: string;
  address?: string;
  images?: File[];
}

export interface IPlaceFormContact {
  website?: string;
  instagram?: string;
  facebook?: string;
  phonenumber?: string;
  email?: string;
  schedule?: DayConfig[];
}
