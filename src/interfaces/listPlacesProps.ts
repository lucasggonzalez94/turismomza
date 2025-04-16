import { Filters } from './filters';

export interface ListPlacesProps {
  filters?: Filters | null;
  page?: number;
  pageSize?: number;
}

export interface ListPlacesByUserProps extends ListPlacesProps {
  userId: string;
}
