import AttractionCard from '@/components/ui/AttractionCard/AttractionCard';
import { Attraction } from '@/interfaces/attraction';
import { getAttractions } from '@/services/attractions/get-attractions';

const AttractionsHome = async () => {
  const { data: attractions } = await getAttractions();
  return (
    <div className="flex flex-col gap-4 h-screen p-12">
      <h2 className="font-bold text-3xl">Atractivos</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 grid-rows-2 gap-4">
        <>
          {attractions?.map((attraction: Attraction) => (
            <AttractionCard key={attraction?.id} attraction={attraction} />
          ))}
        </>
      </div>
    </div>
  );
};

export default AttractionsHome;
