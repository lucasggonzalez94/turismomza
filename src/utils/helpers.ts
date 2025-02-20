import { Review } from '@/interfaces/place';
import { DayConfig } from '@/interfaces/schedule';
import { LANGUAGES, SERVICES } from './constants';

export const calculateAverageRating = (reviews: Review[]): string => {
  if (!reviews || reviews.length === 0) return '0';

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  return averageRating.toFixed(1);
};

export const formatPrice = (price: number, currency: 'ars' | 'usd'): string => {
  const formatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: currency === 'ars' ? 'ARS' : 'USD',
  });
  return formatter.format(price);
};

export const formatDate = (isoDate?: string): string => {
  if (isoDate) {
    const date = new Date(isoDate);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  return '';
};

export const validateSchedule = (schedule: DayConfig[]): boolean => {
  if (schedule) {
    return schedule?.some((day) => {
      if (day.open24hours) {
        return true;
      }
      return day.times.some((time) => time.from !== '' && time.to !== '');
    });
  }

  return false;
};

export const mapServices = (services: string[]) => {
  const servicesObject = SERVICES.reduce((acc: any, service: any) => {
    acc[service.key] = service.label;
    return acc;
  }, {});

  return services.map((service) => {
    return servicesObject[service];
  });
};

export const mapLanguages = (languages: string[]) => {
  const languagesObject = LANGUAGES.reduce((acc: any, language: any) => {
    acc[language.key] = language.label;
    return acc;
  }, {});

  return languages.map((language) => {
    return languagesObject[language];
  });
};

export const fetchImageAsFile = async (url: string, filename: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
};
