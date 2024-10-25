import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CATEGORIES, CURRENCIES, SERVICES } from '@/utils/constants';
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react';
import MapSearch from './MapSearch';
import { useStore } from '@/store/store';
import { FC, useState } from 'react';
import ImageUploader from '../ui/ImageUploader';

export interface Address {
  lat: number;
  lng: number;
  formatted_address?: string;
}

interface IPropsFirstStepCreation {
  setSaved: (saved: boolean) => void;
  setSelectedTab: (saved: string) => void;
}

const schema = yup
  .object({
    name: yup.string().required('El campo es obligatorio.'),
    description: yup
      .string()
      .min(100, 'La descripción debe tener un mínimo de 100 carectéres.')
      .required('El campo es obligatorio.'),
    category: yup.string().required('El campo es obligatorio.'),
    services: yup
      .array()
      .of(yup.string())
      .min(1, 'Debes seleccionar al menos uno.')
      .required('El campo es obligatorio.'),
    price: yup.number().min(1, 'El precio debe ser mayor a 1.'),
    currency: yup.string(),
    address: yup
      .object({
        lat: yup.number().required('La dirección es obligatoria.'),
        lng: yup.number().required('La dirección es obligatoria.'),
        formatted_address: yup.string(),
      })
      .required('La dirección es obligatoria.'),
  })
  .required();

const FirstStepCreation: FC<IPropsFirstStepCreation> = ({
  setSaved,
  setSelectedTab,
}) => {
  const { createFirstStepData, setCreateFirstStepData } = useStore(
    (state) => state,
  );
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: createFirstStepData?.name || '',
      description: createFirstStepData?.description || '',
      category: createFirstStepData?.category || '',
      services: createFirstStepData?.services || [],
      price: createFirstStepData?.price || 0.0,
      currency: createFirstStepData?.currency || 'ars',
    },
  });

  const [images, setImages] = useState<File[]>([]);

  const handleLocationSelected = (address: Address) => {
    setValue('address', address);
  };

  const handleSaveAndContinue = (data: any) => {
    if (images?.length > 3) {
      setCreateFirstStepData({
        ...data,
        images,
      });
      setSaved(true);
      setSelectedTab('contact');
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleSaveAndContinue)}
        className="flex flex-col gap-4 items-start"
      >
        <div className="flex gap-4 w-full">
          <div className="flex flex-col gap-4 w-1/2">
            <Input
              type="text"
              label="Nombre"
              labelPlacement="outside"
              placeholder="Ingresá el nombre del lugar"
              isInvalid={!!errors.name?.message}
              errorMessage={errors.name?.message}
              {...register('name')}
            />
            <Textarea
              label="Descripción"
              className="w-full"
              labelPlacement="outside"
              placeholder="Descripción del lugar"
              isInvalid={!!errors.description?.message}
              errorMessage={errors.description?.message}
              {...register('description')}
            />
            <Controller
              name="category"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Categoría"
                  labelPlacement="outside"
                  placeholder="¿Qué categoría describe mejor este lugar?"
                  className="w-full"
                  value={value}
                  defaultSelectedKeys={[createFirstStepData?.category || '']}
                  isInvalid={!!errors.category?.message}
                  errorMessage={errors.category?.message}
                  onChange={(e) => {
                    onChange(e.target.value);
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
            <Controller
              name="services"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Servicios"
                  labelPlacement="outside"
                  placeholder="¿Qué servicios ofrece este lugar?"
                  selectionMode="multiple"
                  className="w-full"
                  isInvalid={!!errors.services?.message}
                  errorMessage={errors.services?.message}
                  value={
                    (value?.filter((val) => val !== undefined) as string[]) ||
                    []
                  }
                  defaultSelectedKeys={createFirstStepData?.services || []}
                  onChange={(e) => {
                    onChange(e.target.value.split(','));
                  }}
                >
                  {SERVICES.map((service) => (
                    <SelectItem key={service.key} value={service.key}>
                      {service.label}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
            <Input
              label={
                <label>
                  Precio <span className="text-tiny">(Opcional)</span>
                </label>
              }
              placeholder="0.00"
              labelPlacement="outside"
              isInvalid={!!errors.price?.message}
              errorMessage={errors.price?.message}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">$</span>
                </div>
              }
              endContent={
                <div className="flex items-center">
                  <label className="sr-only" htmlFor="currency">
                    Currency
                  </label>
                  <select
                    className="outline-none border-0 bg-transparent text-default-400 text-small"
                    id="currency"
                    {...register('currency')}
                  >
                    {CURRENCIES.map((currency) => (
                      <option key={currency.key} value={currency.key}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
                </div>
              }
              type="number"
              {...register('price', {
                setValueAs: (value) => (value === '' ? 0.0 : Number(value)),
              })}
            />
          </div>
          <div className="flex flex-col gap-1 w-1/2">
            <MapSearch
              defaultAddress={createFirstStepData?.address}
              onLocationSelected={handleLocationSelected}
              errors={errors}
            />
          </div>
        </div>
        <ImageUploader
          defaultImages={createFirstStepData?.images}
          onImagesChange={setImages}
        />
        <Button type="submit" color="primary">
          Guardar y continuar
        </Button>
      </form>
    </>
  );
};

export default FirstStepCreation;
