import AttractionsWithFilters from '@/components/attractions/AttractionsWithFilters';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Turismomza | Lugares',
  description: '...',
};

export default function AttractionsPage() {
  return <AttractionsWithFilters />;
}
