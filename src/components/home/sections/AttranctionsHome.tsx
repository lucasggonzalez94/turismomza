import AttractionCard from '@/components/ui/AttractionCard/AttractionCard';

const AttractionsHome = () => {
  return (
    <div className="flex flex-col gap-4 h-screen p-12">
      <h2 className="font-bold text-3xl">Atractivos</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 grid-rows-2 gap-4">
        <AttractionCard />
        <AttractionCard />
        <AttractionCard />
        <AttractionCard />
        <AttractionCard />
        <AttractionCard />
        <AttractionCard />
        <AttractionCard />
        <AttractionCard />
        <AttractionCard />
      </div>
    </div>
  );
};

export default AttractionsHome;
