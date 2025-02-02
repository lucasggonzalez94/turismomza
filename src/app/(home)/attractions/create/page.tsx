import AttractionForm from '@/components/attractions/AttractionForm';
import Chevron from '@/components/ui/Chevron';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Publicar',
};

export default function CreateAttractionPage() {
  return (
    <>
      <Chevron />
      <div className="flex flex-col flex-grow gap-6 pb-4 px-4 lg:px-[20%] xl:px-[30%]">
        <h2 className="font-bold text-xl">Publicá tu lugar</h2>
        <AttractionForm />
      </div>
    </>
  );
}
