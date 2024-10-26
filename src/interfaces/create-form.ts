export interface CreateForm {
  name?: string;
  description?: string;
  category?: string;
  services?: string[];
  price?: number;
  currency?: string;
  address?: {
    lat?: number | undefined;
    lng?: number | undefined;
    formatted_address?: string | undefined;
  };
  images?: File[];
  website?: string;
  instagram?: string;
  facebook?: string;
  phonenumber?: string;
  email?: string;
  schedule?: {
    [x: string]: {
      open24hours?: boolean | undefined;
      times?:
        | { from?: string | undefined; to?: string | undefined }[]
        | undefined;
    };
    [x: number]: {
      open24hours?: boolean | undefined;
      times?:
        | { from?: string | undefined; to?: string | undefined }[]
        | undefined;
    };
  };
}
