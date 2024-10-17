'use client';

import { useEffect, useState } from 'react';
import useWindowSize from '@/hooks/useWindowSize';
import { Attraction } from '@/interfaces/attraction';
import { getAttractionsService } from '@/services/attractions/get-attractions';
import CardSkeleton from '../skeletons/CardSkeleton';
import AttractionCard from '../ui/AttractionCard/AttractionCard';
import { IoAlertCircle } from 'react-icons/io5';
import { Pagination } from '@nextui-org/react';
import { useStore } from '@/store/store';

const AttractionsGrid = () => {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [errorService, setErrorService] = useState(false);
  const [loading, setLoading] = useState(true);

  const { filters, setPrices, user } = useStore((state) => state);
  const { width } = useWindowSize();

  useEffect(() => {
    if (width > 1024) {
      setPageSize(8);
    } else {
      setPageSize(6);
    }
  }, [width]);

  useEffect(() => {
    const getAttractions = async () => {
      try {
        const { data, totalPages, minPrice, maxPrice } =
          await getAttractionsService(
            {
              filters,
              page: currentPage,
              pageSize: pageSize,
            },
            user?.id,
          );
        setAttractions(data);
        setTotalPages(totalPages);
        setPrices({
          minPrice,
          maxPrice,
        });
        setLoading(false);
      } catch {
        setLoading(false);
        setErrorService(true);
      }
    };

    if (pageSize > 0) {
      getAttractions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, filters, user]);

  return (
    <div className="flex flex-col gap-8 items-center">
      {errorService ? (
        <div className="w-full min-h-20 flex justify-center items-center gap-3 text-xl">
          <IoAlertCircle size={30} className="text-red-600" />
          <span>
            Tuvimos un error al cargar los atractivos, te pedimos disculpas.
          </span>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: pageSize }).map((_, index) => (
                <CardSkeleton key={index} className="w-full" />
              ))
            : attractions.map((attraction: Attraction) => (
                <AttractionCard key={attraction?.id} attraction={attraction} />
              ))}
        </div>
      )}
      <Pagination
        total={totalPages}
        initialPage={1}
        page={currentPage}
        onChange={setCurrentPage}
        showControls
      />
    </div>
  );
};

export default AttractionsGrid;
