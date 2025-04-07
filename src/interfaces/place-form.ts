import { DayConfig } from './schedule';
import { IImage } from './place';

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

// Nueva interfaz unificada para el formulario completo
export interface IPlaceForm extends IPlaceFormDetails, IPlaceFormContact {}

// Tipo para los valores por defecto que vienen del servidor
export type PlaceFormWithCustomImages = Omit<IPlaceForm, 'images'> & {
  images?: IImage[];
};

// Tipo para el estado de progreso del formulario
export type FormProgress = 'details' | 'contact' | 'completed';
