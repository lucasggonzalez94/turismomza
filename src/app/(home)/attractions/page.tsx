import AttractionsWithFilters from '@/components/attractions/AttractionsWithFilters';

export default function AttractionsPage() {
  return (
    <div className="flex flex-col flex-grow gap-4 p-8 md:p-12">
      <h2 className="font-bold text-3xl">Atractivos turísticos</h2>
      <hr className="border-gray-300 w-full" />
      <AttractionsWithFilters />
    </div>
  );
}
