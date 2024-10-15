import { Filters } from './filters';

export interface ListAttractionsProps {
  filters: Filters | null;
  page?: number;
  pageSize?: number;
}
