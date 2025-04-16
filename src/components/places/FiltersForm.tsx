'use client';

import { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Select,
  SelectItem,
  Slider,
} from '@nextui-org/react';
import { IoLogoUsd } from 'react-icons/io5';
import { IoStar } from 'react-icons/io5';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { CATEGORIES } from '@/utils/constants';

interface FiltersFormProps {
  prices: { minPrice: number; maxPrice: number };
  setFilters: (filters: any) => void;
}

// Componente para renderizar estrellas de calificación
const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <IoStar
          key={index}
          className={index < rating ? 'text-trinidad-600' : 'text-gray-400'}
        />
      ))}
    </div>
  );
};

const schema = yup
  .object({
    searchTerm: yup.string(),
    categories: yup.array(yup.string()),
    priceRange: yup.array(yup.number()),
    rating: yup.array(yup.string()),
  })
  .required();

const FiltersForm: FC<FiltersFormProps> = ({ setFilters, prices }) => {
  const [priceRangeValue, setPriceRangeValue] = useState([0, 0]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const searchQuery = searchParams.get('search');

  const { register, handleSubmit, control, setValue, reset } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      priceRange: [prices?.minPrice, prices?.maxPrice],
      rating: [],
    },
  });

  const [maxPrice, setMaxPrice] = useState(prices?.maxPrice);

  const handleFilter = (data: any) => {
    const { priceRange, ...restData } = data;
    const filteredData = {
      ...restData,
      categories: data.categories || [],
      rating: data.rating || [],
      priceMin: priceRange[0],
      priceMax: priceRange[1],
    };
    setFilters(filteredData);

    const params = new URLSearchParams();
    if (filteredData.searchTerm) {
      params.set('search', filteredData.searchTerm);
    }
    if (filteredData.categories.length > 0) {
      params.set('categories', filteredData.categories.join(','));
    }
    if (filteredData.rating.length > 0) {
      params.set('rating', filteredData.rating.join(','));
    }
    if (filteredData.priceMin !== prices?.minPrice) {
      params.set('priceMin', filteredData.priceMin.toString());
    }
    if (filteredData.priceMax !== prices?.maxPrice) {
      params.set('priceMax', filteredData.priceMax.toString());
    }
    const queryString = params.toString();
    if (queryString) {
      router.push(`${pathname}?${queryString}`);
    } else {
      router.push(pathname);
    }
  };

  const readFiltersFromURL = () => {
    const search = searchParams.get('search');
    const categories = searchParams.get('categories');
    const rating = searchParams.get('rating');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    if (search) setValue('searchTerm', search);
    if (categories) {
      const categoriesArray = categories.split(',');
      setValue('categories', categoriesArray);
    }
    if (rating) {
      const ratingArray = rating.split(',');
      setValue('rating', ratingArray);
    }
    const minPrice = priceMin ? Number(priceMin) : prices?.minPrice;
    const maxPrice = priceMax ? Number(priceMax) : prices?.maxPrice;
    setPriceRangeValue([minPrice, maxPrice]);
    setValue('priceRange', [minPrice, maxPrice]);
    setFilters({
      searchTerm: search || '',
      categories: categories ? categories.split(',') : [],
      rating: rating ? rating.split(',') : [],
      priceMin: minPrice,
      priceMax: maxPrice,
    });
  };

  useEffect(() => {
    setValue('priceRange', [prices?.minPrice, prices?.maxPrice]);
    setMaxPrice(prices?.maxPrice);
    setPriceRangeValue([0, prices?.maxPrice]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prices?.minPrice, prices?.maxPrice]);

  useEffect(() => {
    if (searchParams.toString()) {
      readFiltersFromURL();
    } else if (searchQuery) {
      setValue('searchTerm', searchQuery);
      setFilters({ searchTerm: searchQuery });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, searchQuery]);

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex flex-col gap-3 max-w-80"
    >
      <div className="flex flex-col gap-8">
        <Input
          type="text"
          label="Buscar"
          placeholder="Buscar por título o descripción"
          variant="faded"
          labelPlacement="outside"
          {...register('searchTerm')}
        />
        <Controller
          name="categories"
          control={control}
          render={({ field: { onChange, value } }) => {
            const selectedKeys =
              value && Array.isArray(value)
                ? new Set(value.filter(Boolean))
                : new Set();

            return (
              <Select
                label="Categorías"
                labelPlacement="outside"
                placeholder="Seleccioná las categorías"
                selectionMode="multiple"
                variant="faded"
                className="w-full"
                selectedKeys={selectedKeys as Set<string>}
                onSelectionChange={(keys) => {
                  const newSelectedKeys = Array.from(keys) as string[];
                  onChange(newSelectedKeys);
                }}
              >
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.key} value={category.key}>
                    {category.label}
                  </SelectItem>
                ))}
              </Select>
            );
          }}
        />
        <div>
          <h3 className="text-sm mb-3">Precio</h3>
          <div className="flex gap-2 justify-between items-center">
            <Input
              type="number"
              label="Desde"
              placeholder="0"
              labelPlacement="outside"
              variant="faded"
              startContent={<IoLogoUsd />}
              value={priceRangeValue[0]?.toString()}
              onChange={(e) => {
                const minPrice = Number(e.target.value);
                setPriceRangeValue([minPrice, priceRangeValue[1]]);
                setValue('priceRange', [minPrice, priceRangeValue[1]]);
              }}
            />
            <Input
              type="number"
              label="Hasta"
              placeholder="0"
              labelPlacement="outside"
              variant="faded"
              startContent={<IoLogoUsd />}
              value={priceRangeValue[1]?.toString()}
              onChange={(e) => {
                const maxPrice = Number(e.target.value);
                setPriceRangeValue([priceRangeValue[0], maxPrice]);
                setValue('priceRange', [priceRangeValue[0], maxPrice]);
              }}
            />
          </div>
          <Controller
            name="priceRange"
            control={control}
            render={({ field: { onChange } }) => (
              <Slider
                step={10}
                size="sm"
                minValue={0}
                maxValue={maxPrice}
                defaultValue={[0, maxPrice]}
                value={priceRangeValue}
                onChange={(newValue) => {
                  onChange(newValue);
                  setValue('priceRange', newValue as number[]);
                  setPriceRangeValue(newValue as number[]);
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
                  (value?.filter((val) => val !== undefined) as string[]) || []
                }
                onValueChange={onChange}
                size="sm"
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <Checkbox key={rating} value={rating.toString()}>
                    <RatingStars rating={rating} />
                  </Checkbox>
                ))}
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
            variant="ghost"
            onPress={() => {
              reset();
              setFilters(null);
            }}
          >
            Limpiar
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FiltersForm;
