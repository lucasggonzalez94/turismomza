import PlaceForm from '@/components/places/PlaceForm';
import Chevron from '@/components/ui/Chevron';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Publicar',
};

export default function CreatePlacePage() {
  return (
    <>
      <Chevron />
      <div className="flex flex-col flex-grow gap-6 pb-4 px-4 lg:px-[20%] xl:px-[30%]">
        <h2 className="font-bold text-xl">Publicá tu lugar</h2>
        <PlaceForm />
      </div>
    </>
  );
}
