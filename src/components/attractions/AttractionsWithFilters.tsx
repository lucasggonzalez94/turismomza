'use client';

import { useEffect, useState } from 'react';
import useWindowSize from '@/hooks/useWindowSize';
import { Attraction } from '@/interfaces/attraction';
import { getAttractionsService } from '@/services/attractions/get-attractions';
import CardSkeleton from '../skeletons/CardSkeleton';
import AttractionCard from '../ui/AttractionCard';
import { Button, Pagination } from '@nextui-org/react';
import { IoAlertCircle, IoOptionsOutline } from 'react-icons/io5';
import { useStore } from '@/store/store';
import { User } from '@/interfaces/user';
import FiltersForm from './FiltersForm';
import Sidedrawer from '../ui/Sidedrawer';

const AttractionsWithFilters = () => {
  const { setPrices, user, filters } = useStore((state) => state);
  const { width } = useWindowSize();

  const [attractions, setAttractions] = useState<Attraction[]>([]);
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
    const getAttractions = async () => {
      try {
        const { data, totalPages, minPrice, maxPrice } =
          await getAttractionsService(
            {
              filters,
              page: currentPage,
              pageSize: pageSize,
            },
            userData?.id,
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
  }, [currentPage, pageSize, filters, userData]);

  return (
    <>
      <div className="flex flex-col flex-grow gap-4 p-8 md:p-12">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-3xl">Lugares turísticos</h2>
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
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {loading ? (
                  Array.from({ length: pageSize }).map((_, index) => (
                    <CardSkeleton key={index} />
                  ))
                ) : !attractions.length ? (
                  <div className="w-full min-h-20 flex justify-center items-center gap-3 text-xl">
                    <span>Todavía no hay lugares creados.</span>
                  </div>
                ) : (
                  attractions.map((attraction: Attraction) => (
                    <AttractionCard
                      key={attraction?.id}
                      attraction={attraction}
                      user={user}
                    />
                  ))
                )}
              </div>
            )}
            {!errorService && (
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
        <Sidedrawer isOpen={openSidedrawer} setIsOpen={setOpenSidedrawer}>
          <FiltersForm />
        </Sidedrawer>
      )}
    </>
  );
};

export default AttractionsWithFilters;
