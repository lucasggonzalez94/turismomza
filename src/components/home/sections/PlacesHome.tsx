'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IoChevronForwardSharp } from 'react-icons/io5';
import { IoAlertCircle } from 'react-icons/io5';

import PlaceCard from '@/components/ui/PlaceCard';
import { IPlace } from '@/interfaces/place';
import { getPlacesService } from '@/services/places/get-places';
import useWindowSize from '@/hooks/useWindowSize';
import CardSkeleton from '@/components/skeletons/CardSkeleton';
import { useAuthStore } from '@/store/authStore';
import { useLoadingStore } from '@/store/loadingStore';

const PlacesHome = () => {
  const [places, setPlaces] = useState<IPlace[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [errorService, setErrorService] = useState(false);
  const { loading, setLoading } = useLoadingStore((state) => state);

  const { width } = useWindowSize();
  const user = useAuthStore((state) => state.user);

  const getPlaces = async () => {
    try {
      setLoading(true);
      const { data } = await getPlacesService({
        page: 1,
        pageSize: pageSize,
      });
      setPlaces(data);
    } catch {
      setErrorService(true);
    } finally {
      setLoading(false);
    }
  };

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
    if (pageSize > 0) {
      getPlaces();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  useEffect(() => {
    if (user) {
      getPlaces();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div id="places" className="flex flex-col gap-4 h-auto p-8 md:p-12">
      <div className="flex gap-7 items-center">
        <Link href="/places" className="font-bold text-xl">
          Lugares destacados
        </Link>
        <Link
          href="/places"
          className="font-bold flex gap-1 items-center text-siren-900"
        >
          <span className="hover:underline">Ver todos</span>
          <IoChevronForwardSharp />
        </Link>
      </div>
      {errorService ? (
        <div className="w-full min-h-20 flex justify-center items-center gap-3 text-xl">
          <IoAlertCircle size={30} className="text-red-600" />
          <span>
            Tuvimos un error al cargar los lugares, te pedimos disculpas.
          </span>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: pageSize }).map((_, index) => (
              <CardSkeleton key={index} />
            ))
          ) : !places.length ? (
            <div className="w-full min-h-20 flex justify-center items-center gap-3 text-xl">
              <span>Todavía no hay lugares creados.</span>
            </div>
          ) : (
            places.map((place: IPlace) => (
              <PlaceCard key={place?.id} user={user} place={place} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PlacesHome;
