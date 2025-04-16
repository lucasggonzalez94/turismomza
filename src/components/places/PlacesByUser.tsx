'use client';

import { useEffect, useState } from 'react';
import useWindowSize from '@/hooks/useWindowSize';
import { IPlace } from '@/interfaces/place';
import CardSkeleton from '../skeletons/CardSkeleton';
import PlaceCard from '../ui/PlaceCard';
import { Button, Pagination } from '@nextui-org/react';
import { IoAlertCircle, IoOptionsOutline } from 'react-icons/io5';
import FiltersForm from './FiltersForm';
import Sidedrawer from '../ui/Sidedrawer';
import { useAuthStore } from '@/store/authStore';
import { getPlacesByUserService } from '@/services/places/get-places-by-user';

const PlacesByUser = () => {
  const user = useAuthStore((state) => state.user);
  const { width } = useWindowSize();

  const [places, setPlaces] = useState<IPlace[]>([]);
  const [filters, setFilters] = useState(null);
  const [prices, setPrices] = useState({
    minPrice: 0,
    maxPrice: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [errorService, setErrorService] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hideFilters, setHideFilters] = useState(false);
  const [openSidedrawer, setOpenSidedrawer] = useState(false);

  useEffect(() => {
    if (width > 1024) {
      setPageSize(8);
    } else {
      setPageSize(6);
    }

    if (width < 1536) {
      setHideFilters(true);
    } else {
      setHideFilters(false);
    }
  }, [width]);

  useEffect(() => {
    const getPlaces = async () => {
      try {
        setLoading(true);
        const { data, totalPages, maxPrice } = await getPlacesByUserService({
          userId: user!.id,
          filters,
          page: currentPage,
          pageSize,
        });
        setPlaces(data);
        setTotalPages(totalPages);
        setPrices({
          minPrice: 0,
          maxPrice,
        });
      } catch {
        setErrorService(true);
      } finally {
        setLoading(false);
      }
    };

    if (pageSize > 0) {
      getPlaces();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, filters, user, setPrices]);

  return (
    <>
      <div className="flex flex-col flex-grow gap-4 px-4 pb-8">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-xl">Mis publicaciones</h2>
          {hideFilters && (
            <Button
              color="default"
              variant="ghost"
              isIconOnly
              onClick={() => setOpenSidedrawer((prev) => !prev)}
            >
              <IoOptionsOutline size={25} />
            </Button>
          )}
        </div>
        <hr className="border-gray-300 w-full" />
        <div className="flex gap-7 items-start">
          {!hideFilters && (
            <FiltersForm setFilters={setFilters} prices={prices} />
          )}
          <div className="flex flex-col gap-8 items-center w-full">
            {errorService ? (
              <div className="w-full min-h-20 flex justify-center items-center gap-3 text-xl">
                <IoAlertCircle size={30} className="text-red-600" />
                <span>
                  Tuvimos un error al cargar los lugares, te pedimos disculpas.
                </span>
              </div>
            ) : (
              <div
                className={`${places.length || loading ? 'grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4' : 'flex justify-center items-center h-full p-24'} w-full`}
              >
                {loading ? (
                  Array.from({ length: pageSize }).map((_, index) => (
                    <CardSkeleton key={index} />
                  ))
                ) : !places.length ? (
                  <div className="w-full min-h-20 flex justify-center items-center gap-3 text-xl">
                    <span>No se encontraron lugares.</span>
                  </div>
                ) : (
                  places.map((place: IPlace) => (
                    <PlaceCard key={place.id} place={place} user={user} />
                  ))
                )}
              </div>
            )}
            {!errorService && !!places.length && (
              <Pagination
                total={totalPages || 1}
                initialPage={1}
                page={currentPage}
                onChange={setCurrentPage}
                color="primary"
                showControls
              />
            )}
          </div>
        </div>
      </div>
      {hideFilters && (
        <Sidedrawer
          isOpen={openSidedrawer}
          setIsOpen={setOpenSidedrawer}
          title="Filtros"
        >
          <FiltersForm setFilters={setFilters} prices={prices} />
        </Sidedrawer>
      )}
    </>
  );
};

export default PlacesByUser;
