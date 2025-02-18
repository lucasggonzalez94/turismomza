'use client';

import { useEffect, useState } from 'react';
import useWindowSize from '@/hooks/useWindowSize';
import { Place } from '@/interfaces/place';
import { getPlacesService } from '@/services/places/get-places';
import CardSkeleton from '../skeletons/CardSkeleton';
import PlaceCard from '../ui/PlaceCard';
import { Button, Pagination } from '@nextui-org/react';
import { IoAlertCircle, IoOptionsOutline } from 'react-icons/io5';
import { useStore } from '@/store/store';
import { User } from '@/interfaces/user';
import FiltersForm from './FiltersForm';
import Sidedrawer from '../ui/Sidedrawer';

const PlacesWithFilters = () => {
  const { setPrices, user, filters } = useStore((state) => state);
  const { width } = useWindowSize();

  const [places, setPlaces] = useState<Place[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [errorService, setErrorService] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);
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
    if (user) {
      setUserData(user);
    }
  }, [user]);

  useEffect(() => {
    const getPlaces = async () => {
      try {
        setLoading(true);
        const { data, totalPages, maxPrice } = await getPlacesService({
          filters,
          page: currentPage,
          pageSize: pageSize,
        });
        setPlaces(data);
        setTotalPages(totalPages);
        setPrices({
          minPrice: 0,
          maxPrice,
        });
        setLoading(false);
      } catch {
        setLoading(false);
        setErrorService(true);
      }
    };

    if (pageSize > 0) {
      getPlaces();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, filters, userData]);

  return (
    <>
      <div className="flex flex-col flex-grow gap-4 px-4 pb-8">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-xl">Lugares turísticos</h2>
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
          {!hideFilters && <FiltersForm />}
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
                className={`${places.length || loading ? 'grid md:grid-cols-2 lg:grid-cols-3' : 'flex justify-center items-center h-full p-24'} gap-4 w-full`}
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
                  places.map((place: Place) => (
                    <PlaceCard key={place?.id} place={place} user={user} />
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
          <FiltersForm />
        </Sidedrawer>
      )}
    </>
  );
};

export default PlacesWithFilters;
