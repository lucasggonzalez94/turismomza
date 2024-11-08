import AttractionForm from '@/components/attractions/AttractionForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Publicar',
};

export default function CreateAttractionPage() {
  return (
    <div className="flex flex-col flex-grow gap-6 py-8 px-[20%]">
      <h2 className="font-bold text-3xl">Publicá tu lugar</h2>
      <AttractionForm />
    </div>
  );
}