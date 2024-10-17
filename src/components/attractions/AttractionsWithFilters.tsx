'use client';

import { useEffect, useState } from 'react';
import useWindowSize from '@/hooks/useWindowSize';
import { Attraction } from '@/interfaces/attraction';
import { getAttractionsService } from '@/services/attractions/get-attractions';
import CardSkeleton from '../skeletons/CardSkeleton';
import AttractionCard from '../ui/AttractionCard/AttractionCard';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Pagination,
  Select,
  SelectItem,
  Slider,
} from '@nextui-org/react';
import { IoAlertCircle, IoLogoUsd } from 'react-icons/io5';
import { IoStar } from 'react-icons/io5';
import { useStore } from '@/store/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { User } from '@/interfaces/user';
import { Filters } from '@/interfaces/filters';

const schema = yup
  .object({
    title: yup.string(),
    categories: yup.array(yup.string()),
    priceRange: yup.array(yup.number()),
    rating: yup.array(yup.string()),
  })
  .required();

const CATEGORIES = [
  {
    key: 'Naturaleza',
    label: 'Naturaleza',
  },
  {
    key: 'Enoturismo',
    label: 'Enoturismo',
  },
  {
    key: 'Aventura',
    label: 'Aventura',
  },
  {
    key: 'Historia',
    label: 'Historia',
  },
  {
    key: 'Relajación',
    label: 'Relajación',
  },
  {
    key: 'Cultura',
    label: 'Cultura',
  },
  {
    key: 'Gastronomía',
    label: 'Gastronomía',
  },
  {
    key: 'Deportes',
    label: 'Deportes',
  },
  {
    key: 'Familia',
    label: 'Familia',
  },
  {
    key: 'Turismo Rural',
    label: 'Turismo Rural',
  },
];

const AttractionsWithFilters = () => {
  const { prices, setPrices, user } = useStore((state) => state);
  const { register, handleSubmit, control, setValue, watch, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      priceRange: [prices?.minPrice, prices?.maxPrice],
      rating: [],
    },
  });
  const { width } = useWindowSize();
  const router = useRouter();
  const searchParams = useSearchParams();

  const priceRange = watch('priceRange') ?? [
    prices?.minPrice,
    prices?.maxPrice,
  ];
  const searchQuery = searchParams.get('search');

  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [errorService, setErrorService] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters | null>(null);
  const [userData, setUserData] = useState<User | null>(null);

  const handleFilter = async (data: any) => {
    const { priceRange, ...restData } = data;
    const filteredData = {
      ...restData,
      categories: data.categories || [],
      rating: data.rating || [],
      priceMin: priceRange[0],
      priceMax: priceRange[1],
    };
    setFilters(filteredData);

    if (filteredData.title) {
      router.push(`/attractions?search=${filteredData.title}`);
    } else {
      router.push('/attractions');
    }
  };

  useEffect(() => {
    setValue('priceRange', [prices?.minPrice, prices?.maxPrice]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prices]);

  useEffect(() => {
    if (width > 1024) {
      setPageSize(8);
    } else {
      setPageSize(6);
    }
  }, [width]);

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  useEffect(() => {
    if (searchQuery) {
      setValue('title', searchQuery);
      setFilters({ title: searchQuery });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

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
    <div className="flex gap-7 items-start">
      <form
        onSubmit={handleSubmit(handleFilter)}
        className="flex flex-col gap-3 max-w-80"
      >
        <h3 className="font-bold mb-4 text-lg">Filtros</h3>
        <div className="flex flex-col gap-8">
          <Input
            type="text"
            label="Título"
            placeholder="Buscar por título"
            labelPlacement="outside"
            {...register('title')}
          />
          <Controller
            name="categories"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                label="Categorías"
                labelPlacement="outside"
                placeholder="Seleccioná las categorías"
                selectionMode="multiple"
                className="w-full"
                value={
                  (value?.filter((val) => val !== undefined) as string[]) || []
                }
                onChange={(e) => {
                  onChange(e.target.value.split(','));
                }}
              >
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.key} value={category.key}>
                    {category.label}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
          <div>
            <h3 className="text-sm mb-3">Precio</h3>
            <div className="flex gap-2 justify-between items-center">
              <Input
                type="number"
                label="Desde"
                placeholder="0"
                labelPlacement="outside"
                startContent={<IoLogoUsd />}
                value={String(priceRange[0])}
                onChange={(e) => {
                  const minPrice = Number(e.target.value);
                  setValue('priceRange', [minPrice, priceRange[1]]);
                }}
              />
              <Input
                type="number"
                label="Hasta"
                placeholder="0"
                labelPlacement="outside"
                startContent={<IoLogoUsd />}
                value={String(priceRange[1])}
                onChange={(e) => {
                  const maxPrice = Number(e.target.value);
                  setValue('priceRange', [priceRange[0], maxPrice]);
                }}
              />
            </div>
            <Controller
              name="priceRange"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Slider
                  step={10}
                  size="sm"
                  minValue={prices?.minPrice}
                  maxValue={prices?.maxPrice}
                  value={value as number[]}
                  onChange={(newValue) => {
                    onChange(newValue);
                    setValue('priceRange', newValue as number[]);
                  }}
                  formatOptions={{
                    style: 'currency',
                    currency: 'ARS',
                  }}
                  className="mt-4"
                />
              )}
            />
          </div>
          <div>
            <h3 className="text-sm mb-3">Calificación</h3>
            <Controller
              name="rating"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CheckboxGroup
                  value={
                    (value?.filter((val) => val !== undefined) as string[]) ||
                    []
                  }
                  onValueChange={onChange}
                  size="sm"
                >
                  <Checkbox value="5">
                    <div className="flex items-center gap-1">
                      <IoStar className="text-[#E95718]" />
                      <IoStar className="text-[#E95718]" />
                      <IoStar className="text-[#E95718]" />
                      <IoStar className="text-[#E95718]" />
                      <IoStar className="text-[#E95718]" />
                    </div>
                  </Checkbox>
                  <Checkbox value="4">
                    <div className="flex items-center gap-1">
                      <IoStar className="text-[#E95718]" />
                      <IoStar className="text-[#E95718]" />
                      <IoStar className="text-[#E95718]" />
                      <IoStar className="text-[#E95718]" />
                      <IoStar className="text-gray-400" />
                    </div>
                  </Checkbox>
                  <Checkbox value="3">
                    <div className="flex items-center gap-1">
                      <IoStar className="text-[#E95718]" />
                      <IoStar className="text-[#E95718]" />
                      <IoStar className="text-[#E95718]" />
                      <IoStar className="text-gray-400" />
                      <IoStar className="text-gray-400" />
                    </div>
                  </Checkbox>
                  <Checkbox value="2">
                    <div className="flex items-center gap-1">
                      <IoStar className="text-[#E95718]" />
                      <IoStar className="text-[#E95718]" />
                      <IoStar className="text-gray-400" />
                      <IoStar className="text-gray-400" />
                      <IoStar className="text-gray-400" />
                    </div>
                  </Checkbox>
                  <Checkbox value="1">
                    <div className="flex items-center gap-1">
                      <IoStar className="text-[#E95718]" />
                      <IoStar className="text-gray-400" />
                      <IoStar className="text-gray-400" />
                      <IoStar className="text-gray-400" />
                      <IoStar className="text-gray-400" />
                    </div>
                  </Checkbox>
                </CheckboxGroup>
              )}
            />
          </div>
          <div className="mt-4 flex flex-col w-full gap-4">
            <Button type="submit" color="primary">
              Aplicar
            </Button>
            <Button
              color="primary"
              variant="bordered"
              onClick={() => {
                reset();
                setFilters(null);
              }}
            >
              Limpiar
            </Button>
          </div>
        </div>
      </form>
      <div className="flex flex-col gap-8 items-center w-full">
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
                  <AttractionCard
                    key={attraction?.id}
                    attraction={attraction}
                  />
                ))}
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
  );
};

export default AttractionsWithFilters;
