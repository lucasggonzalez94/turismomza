import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CATEGORIES, CURRENCIES, SERVICES } from '@/utils/constants';
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react';
import MapSearch from './MapSearch';
import { useStore } from '@/store/store';
import { FC } from 'react';
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

const FirstStepCreation: FC<IPropsFirstStepCreation> = ({ setSaved, setSelectedTab }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const setCreateFirstStepData = useStore((state) => state.setCreateFirstStepData);

  const handleLocationSelected = (address: Address) => {
    setValue('address', address);
  };

  const handleSaveAndContinue = (data: any) => {
    setCreateFirstStepData(data);
    setSaved(true);
    setSelectedTab('contact');
  };

  console.log(errors)

  return (
    <>
      <form
        onSubmit={handleSubmit(handleSaveAndContinue)}
        className="flex flex-col gap-4 items-start"
      >
        <div className="flex gap-4 w-full">
          <div className="flex flex-col gap-4 w-1/2">
            <div className="flex flex-col gap-1">
              <Input
                type="text"
                label="Nombre"
                labelPlacement="outside"
                placeholder="Ingresá el nombre del lugar"
                {...register('name')}
              />
              <span className="text-sm text-red-500">
                {errors.name?.message}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <Textarea
                label="Descripción"
                className="w-full"
                labelPlacement="outside"
                placeholder="Descripción del lugar"
                {...register('description')}
              />
              <span className="text-sm text-red-500">
                {errors.description?.message}
              </span>
            </div>
            <div className="flex flex-col gap-1">
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
              <span className="text-sm text-red-500">
                {errors.category?.message}
              </span>
            </div>
            <div className="flex flex-col gap-1">
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
                    value={
                      (value?.filter((val) => val !== undefined) as string[]) ||
                      []
                    }
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
              <span className="text-sm text-red-500">
                {errors.services?.message}
              </span>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <Input
                label={
                  <label>
                    Precio <span className="text-tiny">(Opcional)</span>
                  </label>
                }
                placeholder="0.00"
                labelPlacement="outside"
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
                  setValueAs: (value) =>
                    value === '' ? 0.00 : Number(value),
                })}
              />
              <span className="text-sm text-red-500">
                {errors.price?.message}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1 w-1/2">
            <MapSearch onLocationSelected={handleLocationSelected} errors={errors} />
          </div>
        </div>
        <ImageUploader />
        <Button type="submit" color="primary">
          Guardar y continuar
        </Button>
      </form>
    </>
  );
};

export default FirstStepCreation;
