'use client';

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
    key: 'nature',
    label: 'Naturaleza',
  },
  {
    key: 'enotourism',
    label: 'Enoturismo',
  },
  {
    key: 'adventure',
    label: 'Aventura',
  },
  {
    key: 'history',
    label: 'Historia',
  },
  {
    key: 'relaxation',
    label: 'Relajación',
  },
  {
    key: 'culture',
    label: 'Cultura',
  },
  {
    key: 'gastronomy',
    label: 'Gastronomía',
  },
  {
    key: 'sports',
    label: 'Deportes',
  },
  {
    key: 'family',
    label: 'Familia',
  },
  {
    key: 'rural_tourism',
    label: 'Turismo Rural',
  },
];

const FiltersForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      priceRange: [100, 500],
      rating: [],
    },
  });

  const priceRange = watch('priceRange') ?? [100, 500];

  const handleFilter = async (data: any) => {
    debugger;
    console.log(errors);
    console.log(data);
  };

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
        <Select
          label="Categorías"
          labelPlacement="outside"
          placeholder="Seleccioná las categorías"
          selectionMode="multiple"
          className="w-full"
          {...register('categories')}
        >
          {CATEGORIES.map((category) => (
            <SelectItem key={category.key} value={category.key}>
              {category.label}
            </SelectItem>
          ))}
        </Select>
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
                minValue={0}
                maxValue={1000}
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
        <Button type="submit" color="primary" className="mt-4">
          Aplicar
        </Button>
      </div>
    </form>
  );
};

export default FiltersForm;
