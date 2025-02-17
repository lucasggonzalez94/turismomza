import { DayConfig } from './schedule';

export interface IPlaceForm {
  name?: string;
  description?: string;
  category?: string;
  services?: string[];
  price?: number;
  currency?: string;
  address?: string;
  images?: File[];
  website?: string;
  instagram?: string;
  facebook?: string;
  phonenumber?: string;
  email?: string;
  schedule?: DayConfig[];
}
