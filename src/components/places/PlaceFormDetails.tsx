import { FC, useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import ImageUploader from '../ui/ImageUploader';
import { CATEGORIES, CURRENCIES, SERVICES } from '@/utils/constants';
import { usePlaceStore } from '@/store/placeStore';
import { IPlaceFormDetails } from '@/interfaces/place-form';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { SelectField } from '@/components/ui/Select';
import { MultiSelect } from './MultiSelect';
import { cn } from '@/lib/utils';

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
            label="Nombre"
            requiredMark
            type="text"
            placeholder="Ingresá el nombre del lugar"
            aria-invalid={!!errors.name}
            errorMessage={errors.name?.message}
            {...register('name')}
          />

          <Textarea
            label="Descripción"
            requiredMark
            placeholder="Descripción del lugar"
            className="w-full"
            aria-invalid={!!errors.description}
            errorMessage={errors.description?.message}
            {...register('description')}
          />

          <Controller
            name="category"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectField
                label="Categoría"
                requiredMark
                value={value || ''}
                onValueChange={(val) => onChange(val)}
                placeholder="¿Qué categoría describe mejor este lugar?"
                errorMessage={errors.category?.message}
                options={CATEGORIES.map((category) => ({
                  value: category.key,
                  label: category.label,
                }))}
              />
            )}
          />

          {showOtherCategory && (
            <div className="flex flex-col gap-1">
              <Input
                label="Otra categoría"
                requiredMark
                type="text"
                placeholder="Ingresa tu propia categoría"
                className={cn(
                  errors.otherCategory &&
                    'border-red-500 focus-visible:ring-red-500',
                )}
                aria-invalid={!!errors.otherCategory}
                errorMessage={errors.otherCategory?.message}
                {...register('otherCategory')}
              />
            </div>
          )}

          <Controller
            name="services"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="flex flex-col gap-1 w-full">
                <MultiSelect
                  label="Servicios"
                  requiredMark
                  placeholder="Seleccionar servicios"
                  selected={(value as string[]) || []}
                  onChange={onChange}
                  categories={SERVICES}
                />
                {errors.services?.message ? (
                  <p className="text-xs text-red-500">
                    {errors.services.message}
                  </p>
                ) : null}

                {(value as string[] | undefined)?.includes('other') ? (
                  <div className="mt-3 flex flex-col gap-1">
                    <Input
                      type="text"
                      label="Otros servicios"
                      requiredMark
                      placeholder="Ingresa tus propios servicios separados por comas"
                      containerClassName="w-full"
                      className={cn(
                        errors.otherServices &&
                          'border-red-500 focus-visible:ring-red-500',
                      )}
                      aria-invalid={!!errors.otherServices}
                      errorMessage={errors.otherServices?.message}
                      {...register('otherServices')}
                    />
                    <p className="text-xs text-muted-foreground">
                      Agrega servicios separados por comas y sin espacios.
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          />

          <div className="flex flex-col gap-1">
            <Input
              label="Dirección"
              requiredMark
              type="text"
              placeholder="Ingresa la dirección del lugar"
              className={cn(
                errors.address && 'border-red-500 focus-visible:ring-red-500',
              )}
              aria-invalid={!!errors.address}
              errorMessage={errors.address?.message}
              {...register('address')}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Input
              label={
                <>
                  Precio{' '}
                  <span className="text-xs text-muted-foreground">
                    (Opcional)
                  </span>
                </>
              }
              placeholder="0.00"
              type="text"
              inputMode="decimal"
              className={cn(
                errors.price && 'border-red-500 focus-visible:ring-red-500',
              )}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-muted-foreground text-sm">$</span>
                </div>
              }
              endContent={
                <div className="flex items-center">
                  <label className="sr-only" htmlFor="currency">
                    Moneda
                  </label>
                  <select
                    className="outline-none border-0 bg-transparent text-muted-foreground text-sm"
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
              aria-invalid={!!errors.price}
              errorMessage={errors.price?.message}
              {...register('price', {
                setValueAs: (value) => (value === '' ? 0.0 : Number(value)),
              })}
            />
          </div>
        </div>
      </div>

      <ImageUploader
        defaultImages={defaultValues?.images}
        onImagesChange={handleImagesChange}
        isInvalid={!!errors.images?.message}
        errorMessage={errors.images?.message}
      />

      <Button type="submit" className="self-start">
        Guardar y continuar
      </Button>
    </form>
  );
};

export default PlaceFormDetails;
