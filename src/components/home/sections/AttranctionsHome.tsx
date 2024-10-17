'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IoChevronForwardSharp } from 'react-icons/io5';
import { IoAlertCircle } from 'react-icons/io5';

import AttractionCard from '@/components/ui/AttractionCard/AttractionCard';
import { Attraction } from '@/interfaces/attraction';
import { getAttractionsService } from '@/services/attractions/get-attractions';
import useWindowSize from '@/hooks/useWindowSize';
import CardSkeleton from '@/components/skeletons/CardSkeleton';
import { useStore } from '@/store/store';

const AttractionsHome = () => {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [errorService, setErrorService] = useState(false);
  const [loading, setLoading] = useState(true);

  const { width } = useWindowSize();
  const user = useStore((state) => state.user);

  useEffect(() => {
    if (width > 1280) {
      setPageSize(10);
    } else if (width > 1024) {
      setPageSize(8);
    } else {
      setPageSize(6);
    }
  }, [width]);

  useEffect(() => {
    const getAttractions = async () => {
      try {
        const { data } = await getAttractionsService(
          {
            page: 1,
            pageSize: pageSize,
          },
          user?.id,
        );
        setAttractions(data);
        setLoading(false);
      } catch {
        setLoading(false);
        setErrorService(true);
      }
    };

    if (pageSize > 0) {
      getAttractions();
    }
  }, [pageSize, user]);

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
      {errorService ? (
        <div className="w-full min-h-20 flex justify-center items-center gap-3 text-xl">
          <IoAlertCircle size={30} className="text-red-600" />
          <span>
            Tuvimos un error al cargar los atractivos, te pedimos disculpas.
          </span>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 grid-rows-2 gap-4">
          {loading
            ? Array.from({ length: pageSize }).map((_, index) => (
                <CardSkeleton key={index} className="w-full" />
              ))
            : attractions.map((attraction: Attraction) => (
                <AttractionCard key={attraction?.id} attraction={attraction} />
              ))}
        </div>
      )}
    </div>
  );
};

export default AttractionsHome;
