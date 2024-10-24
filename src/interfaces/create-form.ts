export interface CreateFormFirstStep {
  name: string;
  description: string;
  category: string;
  services: string[];
  price: number;
  currency: string;
  address: {
    lat: number;
    lng: number;
    formatted_address?: string;
  };
}
