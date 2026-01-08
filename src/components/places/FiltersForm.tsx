'use client';

import { ChangeEvent, FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { IoLogoUsd } from 'react-icons/io5';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Slider } from '@/components/ui/Slider';
import { MultiSelect } from './MultiSelect';
import { RatingStarsSelect } from './RatingStarsSelect';

interface FiltersFormProps {
  prices: { minPrice: number; maxPrice: number };
  setFilters: (filters: any) => void;
}

const schema = yup
  .object({
    searchTerm: yup.string(),
    categories: yup.array(yup.string()),
    priceRange: yup.array(yup.number()),
    rating: yup.number(),
  })
  .required();

const FiltersForm: FC<FiltersFormProps> = ({ setFilters, prices }) => {
  const [priceRangeValue, setPriceRangeValue] = useState<number[]>([
    prices?.minPrice ?? 0,
    prices?.maxPrice ?? 0,
  ]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const searchQuery = searchParams.get('search');

  const { register, handleSubmit, control, setValue, reset } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      priceRange: [prices?.minPrice ?? 0, prices?.maxPrice ?? 0],
      rating: 5,
    },
  });

  const handleFilter = (data: any) => {
    const { priceRange, ...restData } = data;
    const filteredData = {
      ...restData,
      categories: data.categories || [],
      rating: typeof data.rating === 'number' ? data.rating : 5,
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
    if (filteredData.rating !== undefined && filteredData.rating !== null) {
      params.set('rating', filteredData.rating.toString());
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
    setValue('rating', rating ? Number(rating) : 5);
    const minPrice = priceMin ? Number(priceMin) : prices?.minPrice;
    const maxPrice = priceMax ? Number(priceMax) : prices?.maxPrice;
    setPriceRangeValue([minPrice, maxPrice]);
    setValue('priceRange', [minPrice, maxPrice]);
    setFilters({
      searchTerm: search || '',
      categories: categories ? categories.split(',') : [],
      rating: rating ? Number(rating) : 5,
      priceMin: minPrice,
      priceMax: maxPrice,
    });
  };

  useEffect(() => {
    const min = prices?.minPrice ?? 0;
    const max = prices?.maxPrice ?? 0;
    setValue('priceRange', [min, max]);
    setPriceRangeValue([min, max]);
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

  const minPriceLimit = prices?.minPrice ?? 0;
  const maxPriceLimit = prices?.maxPrice ?? 0;

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
          {...register('searchTerm')}
        />
        <Controller
          name="categories"
          control={control}
          render={({ field: { onChange, value } }) => (
            <MultiSelect
              selected={(value as string[]) || []}
              onChange={onChange}
            />
          )}
        />
        <div>
          <h3 className="text-sm mb-3">Precio</h3>
          <Controller
            name="priceRange"
            control={control}
            render={({ field: { onChange } }) => (
              <div className="flex flex-col gap-3">
                <Slider
                  value={priceRangeValue}
                  min={minPriceLimit}
                  max={maxPriceLimit}
                  step={1}
                  minStepsBetweenThumbs={1}
                  onValueChange={(values) => {
                    if (maxPriceLimit <= minPriceLimit) {
                      const single: [number, number] = [
                        minPriceLimit,
                        minPriceLimit,
                      ];
                      setPriceRangeValue(single);
                      onChange(single);
                      return;
                    }
                    const gap = 1;
                    const [rawLow, rawHigh] = values as [number, number];

                    let low = Math.max(
                      minPriceLimit,
                      Math.min(rawLow, maxPriceLimit),
                    );
                    let high = Math.max(
                      minPriceLimit,
                      Math.min(rawHigh, maxPriceLimit),
                    );

                    if (high < low) {
                      [low, high] = [high, low];
                    }

                    if (high - low < gap) {
                      const mid = (low + high) / 2;
                      low = Math.max(minPriceLimit, mid - gap / 2);
                      high = Math.min(maxPriceLimit, low + gap);
                    }

                    const nextRange: [number, number] = [low, high];
                    setPriceRangeValue(nextRange);
                    onChange(nextRange);
                  }}
                />
                <div className="flex gap-2 justify-between items-center">
                  <Input
                    type="number"
                    label="Desde"
                    placeholder="0"
                    startContent={<IoLogoUsd />}
                    value={priceRangeValue[0]?.toString()}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const minPrice = Number(e.target.value);
                      const clamped = Math.min(
                        Math.max(minPriceLimit, minPrice),
                        priceRangeValue[1],
                      );
                      const newRange: number[] = [clamped, priceRangeValue[1]];
                      setPriceRangeValue(newRange);
                      onChange(newRange);
                    }}
                  />
                  <Input
                    type="number"
                    label="Hasta"
                    placeholder="0"
                    startContent={<IoLogoUsd />}
                    value={priceRangeValue[1]?.toString()}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const maxPrice = Number(e.target.value);
                      const clamped = Math.max(
                        priceRangeValue[0],
                        Math.min(maxPriceLimit, maxPrice),
                      );
                      const newRange: number[] = [priceRangeValue[0], clamped];
                      setPriceRangeValue(newRange);
                      onChange(newRange);
                    }}
                  />
                </div>
              </div>
            )}
          />
        </div>
        <Controller
          name="rating"
          control={control}
          render={({ field: { onChange, value } }) => (
            <RatingStarsSelect
              value={(value as number | undefined) ?? 5}
              onChange={onChange}
            />
          )}
        />
        <div className="mt-4 flex flex-col w-full gap-4">
          <Button type="submit">Aplicar</Button>
          <Button
            variant="ghost"
            type="button"
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
  );
};

export default FiltersForm;
