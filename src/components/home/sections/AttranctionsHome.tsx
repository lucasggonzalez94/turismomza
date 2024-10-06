'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@nextui-org/react';

import AttractionCard from '@/components/ui/AttractionCard/AttractionCard';
import { Attraction } from '@/interfaces/attraction';
import { getAttractionsService } from '@/services/attractions/get-attractions';
import useWindowSize from '@/hooks/useWindowSize';

const AttractionsHome = () => {
  const [attractions, setAttractions] = useState([]);
  const [pageSize, setPageSize] = useState(0);

  const { width } = useWindowSize();

  useEffect(() => {
    const getAttractions = async () => {
      const { data } = await getAttractionsService({
        page: 1,
        pageSize: pageSize,
      });
      setAttractions(data);
    };

    if (pageSize > 0) {
      getAttractions();
    }
  }, [pageSize]);

  useEffect(() => {
    if (width > 1280) {
      setPageSize(10);
    } else if (width > 1024) {
      setPageSize(8);
    } else {
      setPageSize(6);
    }
  }, [width]);

  return (
    <div className="flex flex-col gap-4 h-auto p-8 md:p-12">
      <h2 className="font-bold text-3xl">Atractivos</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 grid-rows-2 gap-4">
        <>
          {attractions?.map((attraction: Attraction) => (
            <AttractionCard key={attraction?.id} attraction={attraction} />
          ))}
        </>
      </div>
      <div className="w-full flex justify-center items-center mt-5">
        <Button color="primary" as={Link} href="/attractions">
          Ver todos
        </Button>
      </div>
    </div>
  );
};

export default AttractionsHome;
