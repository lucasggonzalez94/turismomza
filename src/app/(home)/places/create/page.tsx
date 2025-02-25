import PlaceForm from '@/components/places/PlaceForm';
import Chevron from '@/components/ui/Chevron';
import { getUserSession } from '@/utils/auth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Publicar',
};

export default async function CreatePlacePage() {
  const response = await getUserSession();

  if (!response) {
    redirect('/auth/login');
  }

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
