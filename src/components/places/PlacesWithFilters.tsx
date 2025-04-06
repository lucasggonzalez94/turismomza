'use client';

import { useEffect, useState } from 'react';
import useWindowSize from '@/hooks/useWindowSize';
import { IPlace } from '@/interfaces/place';
import { getPlacesService } from '@/services/places/get-places';
import CardSkeleton from '../skeletons/CardSkeleton';
import PlaceCard from '../ui/PlaceCard';
import { Button, Pagination, Switch } from '@nextui-org/react';
import {
  IoAlertCircle,
  IoOptionsOutline,
  IoGridOutline,
  IoListOutline,
} from 'react-icons/io5';
import { usePlaceStore } from '@/store/placeStore';
import { IUser } from '@/interfaces/user';
import FiltersForm from './FiltersForm';
import Sidedrawer from '../ui/Sidedrawer';
import { useAuthStore } from '@/store/authStore';

const PlacesWithFilters = () => {
  const user = useAuthStore((state) => state.user);
  const { setPrices, filters } = usePlaceStore((state) => state);
  const { width } = useWindowSize();

  const [places, setPlaces] = useState<IPlace[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [errorService, setErrorService] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<IUser | null>(null);
  const [hideFilters, setHideFilters] = useState(false);
  const [openSidedrawer, setOpenSidedrawer] = useState(false);
  const [forceListView, setForceListView] = useState(false);

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
  }, [currentPage, pageSize, filters, userData, setPrices]);

  const getGridColumns = () => {
    if (forceListView || width < 640) {
      return 'grid-cols-1 gap-2';
    } else if (width < 1024) {
      return 'md:grid-cols-2 gap-4';
    } else {
      return 'md:grid-cols-2 lg:grid-cols-3 gap-4';
    }
  };

  return (
    <>
      <div className="flex flex-col flex-grow gap-4 px-4 pb-8">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-xl">Lugares turísticos</h2>
          <div className="flex items-center gap-2">
            {width >= 640 && (
              <div className="flex items-center gap-1">
                <IoGridOutline
                  size={18}
                  className={!forceListView ? 'text-primary' : 'text-gray-400'}
                />
                <Switch
                  size="sm"
                  color="primary"
                  isSelected={forceListView}
                  onValueChange={setForceListView}
                  aria-label="Cambiar vista"
                />
                <IoListOutline
                  size={18}
                  className={forceListView ? 'text-primary' : 'text-gray-400'}
                />
              </div>
            )}
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
                className={`${places.length || loading ? `grid ${getGridColumns()}` : 'flex justify-center items-center h-full p-24'} w-full`}
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
                    <PlaceCard
                      key={place.id}
                      place={place}
                      user={user}
                      forceListView={forceListView}
                    />
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
