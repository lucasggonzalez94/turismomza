export interface IAttractionForm {
  name?: string;
  description?: string;
  category?: string;
  services?: string[];
  price?: number;
  currency?: string;
  address?: {
    lat: number;
    lng: number;
    formatted_address: string;
  };
  images?: File[];
  website?: string;
  instagram?: string;
  facebook?: string;
  phonenumber?: string;
  email?: string;
  schedule?: {
    [x: string]: {
      open24hours?: boolean;
      times?: { from?: string; to?: string }[];
    };
    [x: number]: {
      open24hours?: boolean;
      times?: { from?: string; to?: string }[];
    };
  };
}
