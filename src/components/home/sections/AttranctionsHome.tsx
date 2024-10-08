'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IoChevronForwardSharp } from 'react-icons/io5';

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
    <div id="attractions" className="flex flex-col gap-4 h-auto p-8 md:p-12">
      <div className="flex gap-7 items-center">
        <Link href="/attractions" className="font-bold text-3xl">
          Atractivos
        </Link>
        <Link
          href="/attractions"
          className="font-bold flex gap-1 items-center text-[#E95718]"
        >
          <span className="hover:underline">Ver todos</span>
          <IoChevronForwardSharp />
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 grid-rows-2 gap-4">
        <>
          {attractions?.map((attraction: Attraction) => (
            <AttractionCard key={attraction?.id} attraction={attraction} />
          ))}
        </>
      </div>
      {/* <div className="w-full flex justify-center items-center mt-5">
        <Button color="primary" as={Link} href="/attractions">
          Ver todos
        </Button>
      </div> */}
    </div>
  );
};

export default AttractionsHome;
