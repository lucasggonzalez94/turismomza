'use client';

import { useEffect } from 'react';
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
import { useStore } from '@/store/store';
import { useRouter, useSearchParams } from 'next/navigation';

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

const FiltersForm = () => {
  const { prices, setFilters } = useStore((state) => state);
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchQuery = searchParams.get('search');

  const { register, handleSubmit, control, setValue, watch, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      priceRange: [prices?.minPrice, prices?.maxPrice],
      rating: [],
    },
  });

  const priceRange = watch('priceRange') ?? [
    prices?.minPrice,
    prices?.maxPrice,
  ];

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
    if (searchQuery) {
      setValue('title', searchQuery);
      setFilters({ title: searchQuery });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  return (
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
                  (value?.filter((val) => val !== undefined) as string[]) || []
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
            variant="ghost"
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
