import { FC, useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react';

import ImageUploader from '../ui/ImageUploader';
import { CATEGORIES, CURRENCIES, SERVICES } from '@/utils/constants';
import { usePlaceStore } from '@/store/placeStore';
import { IPlaceFormDetails } from '@/interfaces/place-form';

interface IPropsPlaceFormDetails {
  setSaved: (saved: boolean) => void;
  setSelectedTab: (tab: string) => void;
  defaultValues?: IPlaceFormDetails | null;
}

const schema = yup
  .object({
    name: yup.string().required('El campo es obligatorio.'),
    description: yup
      .string()
      .min(100, 'La descripción debe tener un mínimo de 100 caractéres.')
      .required('El campo es obligatorio.'),
    category: yup.string().required('El campo es obligatorio.'),
    otherCategory: yup.string().when('category', {
      is: 'Otra',
      then: (schema) => schema.required('Debes especificar la categoría.'),
      otherwise: (schema) => schema.optional(),
    }),
    services: yup
      .array()
      .of(yup.string().required())
      .min(1, 'Debes seleccionar al menos uno.')
      .required('El campo es obligatorio.'),
    otherServices: yup.string().when('services', {
      is: (services: string[]) => services?.includes('other'),
      then: (schema) => schema.required('Debes especificar el servicio.'),
      otherwise: (schema) => schema.optional(),
    }),
    price: yup.number().optional(),
    currency: yup.string(),
    address: yup.string().required('La dirección es obligatoria.'),
    images: yup
      .array()
      .min(4, 'Debes subir al menos 4 imágenes.')
      .max(10, 'No puedes subir más de 10 imágenes.')
      .test('fileSize', 'El tamaño máximo por imagen es 5MB.', (files) =>
        files?.every((file) => file.size <= 5 * 1024 * 1024),
      )
      .test(
        'fileType',
        'Solo se permiten archivos .jpg, .jpeg, .png y .webp.',
        (files) =>
          files?.every((file) =>
            ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(
              file.type,
            ),
          ),
      ),
  })
  .required();

const PlaceFormDetails: FC<IPropsPlaceFormDetails> = ({
  setSaved,
  setSelectedTab,
  defaultValues,
}) => {
  const { setPlaceFormDetails } = usePlaceStore((state) => state);

  const initialValues = useMemo(
    () => ({
      name: '',
      description: '',
      category: '',
      services: [],
      price: undefined,
      currency: 'ars',
      address: '',
      images: [],
    }),
    [],
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    setValue,
    reset,
    watch,
  } = useForm<IPlaceFormDetails>({
    mode: 'onTouched',
    resolver: yupResolver<IPlaceFormDetails>(schema),
    defaultValues: initialValues,
  });

  // Observar los campos para mostrar campos condicionales
  const watchedFields = watch();
  const showOtherCategory = watchedFields.category === 'Otra';
  const showOtherServices = watchedFields.services?.includes('other');

  // Manejar cambios en las imágenes
  const handleImagesChange = useCallback(
    (newImages: File[]) => {
      setValue('images', newImages, { shouldValidate: true });
    },
    [setValue],
  );

  // Guardar datos y continuar al siguiente paso
  const handleSaveAndContinue = useCallback(
    (data: IPlaceFormDetails) => {
      setPlaceFormDetails({
        ...defaultValues,
        ...data,
      });
      setSaved(true);
      setSelectedTab('contact');
    },
    [defaultValues, setPlaceFormDetails, setSaved, setSelectedTab],
  );

  // Actualizar el formulario cuando cambian los valores por defecto
  useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues?.name || '',
        description: defaultValues?.description || '',
        category: defaultValues?.category || '',
        services: defaultValues?.services || [],
        price: defaultValues?.price || undefined,
        currency: defaultValues?.currency || 'ars',
        address: defaultValues?.address || '',
        images: defaultValues?.images || [],
      });
    } else {
      reset(initialValues);
    }
  }, [defaultValues, initialValues, reset]);

  // Guardar los datos al desmontar el componente
  useEffect(() => {
    return () => {
      const currentValues = getValues();
      const hasChanges =
        JSON.stringify(currentValues) !== JSON.stringify(defaultValues);

      if (hasChanges) {
        setPlaceFormDetails({ ...defaultValues, ...currentValues });
      }
    };
  }, [defaultValues, getValues, setPlaceFormDetails]);

  return (
    <form
      onSubmit={handleSubmit(handleSaveAndContinue)}
      className="flex flex-col gap-4 items-start w-full"
    >
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="flex flex-col gap-4 w-full">
          <Input
            isRequired
            type="text"
            label="Nombre"
            labelPlacement="outside"
            placeholder="Ingresá el nombre del lugar"
            variant="faded"
            isInvalid={!!errors.name?.message}
            errorMessage={errors.name?.message}
            {...register('name')}
          />

          <Textarea
            isRequired
            label="Descripción"
            className="w-full"
            labelPlacement="outside"
            placeholder="Descripción del lugar"
            variant="faded"
            isInvalid={!!errors.description?.message}
            errorMessage={errors.description?.message}
            {...register('description')}
          />

          <Controller
            name="category"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                isRequired
                label="Categoría"
                labelPlacement="outside"
                placeholder="¿Qué categoría describe mejor este lugar?"
                className="w-full"
                value={value}
                defaultSelectedKeys={[defaultValues?.category || '']}
                isInvalid={!!errors.category?.message}
                errorMessage={errors.category?.message}
                onChange={(e) => {
                  onChange(e.target.value);
                }}
                variant="faded"
              >
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.key} value={category.key}>
                    {category.label}
                  </SelectItem>
                ))}
              </Select>
            )}
          />

          {showOtherCategory && (
            <Input
              isRequired
              type="text"
              label="Otra categoría"
              labelPlacement="outside"
              placeholder="Ingresa tu propia categoría"
              variant="faded"
              isInvalid={!!errors.otherCategory?.message}
              errorMessage={errors.otherCategory?.message}
              {...register('otherCategory')}
            />
          )}

          <Controller
            name="services"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                isRequired
                label="Servicios"
                labelPlacement="outside"
                placeholder="¿Qué servicios ofrece este lugar?"
                selectionMode="multiple"
                className="w-full"
                isInvalid={!!errors.services?.message}
                errorMessage={errors.services?.message}
                value={
                  (value?.filter((val) => val !== undefined) as string[]) || []
                }
                defaultSelectedKeys={defaultValues?.services || []}
                onChange={(e) => {
                  onChange(e.target.value.split(','));
                }}
                variant="faded"
              >
                {SERVICES.map((service) => (
                  <SelectItem key={service.key} value={service.key}>
                    {service.label}
                  </SelectItem>
                ))}
              </Select>
            )}
          />

          {showOtherServices && (
            <Input
              isRequired
              type="text"
              label="Otros servicios"
              labelPlacement="outside"
              placeholder="Ingresa tus propios servicios"
              variant="faded"
              isInvalid={!!errors.otherServices?.message}
              errorMessage={errors.otherServices?.message}
              description="Agrega servicios separados por comas y sin espacios."
              className="w-full"
              {...register('otherServices')}
            />
          )}

          <Input
            isRequired
            type="text"
            label="Dirección"
            labelPlacement="outside"
            placeholder="Ingresa la dirección del lugar"
            variant="faded"
            isInvalid={!!errors.address?.message}
            errorMessage={errors.address?.message}
            {...register('address')}
          />

          <Input
            label={
              <label>
                Precio <span className="text-tiny">(Opcional)</span>
              </label>
            }
            placeholder="0.00"
            labelPlacement="outside"
            variant="faded"
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
      </div>

      <ImageUploader
        defaultImages={defaultValues?.images}
        onImagesChange={handleImagesChange}
        isInvalid={!!errors.images?.message}
        errorMessage={errors.images?.message}
      />

      <Button type="submit" color="primary">
        Guardar y continuar
      </Button>
    </form>
  );
};

export default PlaceFormDetails;
