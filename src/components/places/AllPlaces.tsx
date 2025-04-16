'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import useWindowSize from '@/hooks/useWindowSize';
import { IPlace } from '@/interfaces/place';
import { getPlacesService } from '@/services/places/get-places';
import CardSkeleton from '../skeletons/CardSkeleton';
import PlaceCard from '../ui/PlaceCard';
import { Button } from '@nextui-org/react';
import { IoAlertCircle, IoOptionsOutline } from 'react-icons/io5';
import FiltersForm from './FiltersForm';
import Sidedrawer from '../ui/Sidedrawer';
import { useAuthStore } from '@/store/authStore';

const AllPlaces = () => {
  const user = useAuthStore((state: any) => state.user);
  const { width } = useWindowSize();

  const [places, setPlaces] = useState<IPlace[]>([]);
  const [filters, setFilters] = useState(null);
  const [prices, setPrices] = useState({
    minPrice: 0,
    maxPrice: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [hasMore, setHasMore] = useState(true);
  const [errorService, setErrorService] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hideFilters, setHideFilters] = useState(false);
  const [openSidedrawer, setOpenSidedrawer] = useState(false);

  // Referencia para el elemento observador del scroll infinito
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Memoizar la función de carga de lugares para evitar recreaciones innecesarias
  const getPlaces = useCallback(
    async (page: number, append: boolean = false) => {
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const { data, totalPages, maxPrice } = await getPlacesService({
          filters,
          page,
          pageSize,
        });

        if (append) {
          setPlaces((prevPlaces) => [...prevPlaces, ...data]);
        } else {
          setPlaces(data);
        }

        setHasMore(page < totalPages);

        if (page === 1) {
          setPrices({
            minPrice: 0,
            maxPrice,
          });
        }
      } catch {
        setErrorService(true);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filters, pageSize],
  );

  // Configurar el tamaño de página y visibilidad de filtros según el ancho de la ventana
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

  // Cargar lugares iniciales cuando cambian los filtros o el tamaño de página
  useEffect(() => {
    if (pageSize > 0) {
      setCurrentPage(1);
      getPlaces(1, false);
    }
  }, [pageSize, filters, user, getPlaces]);

  // Configurar el observer para el scroll infinito
  useEffect(() => {
    // Desconectar el observer anterior si existe
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Función para manejar la intersección
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loadingMore && !loading) {
        setCurrentPage((prevPage) => {
          const nextPage = prevPage + 1;
          getPlaces(nextPage, true);
          return nextPage;
        });
      }
    };

    // Crear un nuevo observer
    observerRef.current = new IntersectionObserver(handleObserver, {
      rootMargin: '0px 0px 400px 0px', // Cargar más elementos antes de llegar al final
      threshold: 0.1,
    });

    // Observar el elemento de carga si existe
    if (loadMoreRef.current && hasMore) {
      observerRef.current.observe(loadMoreRef.current);
    }

    // Limpiar el observer al desmontar
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, loading, getPlaces]);

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
              <>
                <div
                  className={`${
                    places.length || loading
                      ? 'grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4'
                      : 'flex justify-center items-center h-full p-24'
                  } w-full`}
                >
                  {loading && currentPage === 1 ? (
                    Array.from({ length: pageSize }).map((_, index) => (
                      <CardSkeleton key={`skeleton-${index}`} />
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

                {/* Elemento observado para el scroll infinito */}
                {!errorService && places.length > 0 && (
                  <div
                    ref={loadMoreRef}
                    className="w-full py-4 flex justify-center"
                  >
                    {loadingMore && (
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4 w-full">
                        {Array.from({ length: Math.min(pageSize, 4) }).map(
                          (_, index) => (
                            <CardSkeleton key={`load-more-skeleton-${index}`} />
                          ),
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
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

export default AllPlaces;
