'use client';

import { useEffect, useRef, useState } from 'react';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  Input,
  Select,
  SelectItem,
  Tab,
  Tabs,
  Textarea,
} from '@nextui-org/react';
import { PiNumberCircleOneFill, PiNumberCircleTwoFill } from 'react-icons/pi';
import { FaCircleCheck } from 'react-icons/fa6';
import { Controller, useForm } from 'react-hook-form';
import { CATEGORIES, CURRENCIES, SERVICES, WEEKDAYS } from '@/utils/constants';
import ImageUploader from '../ui/ImageUploader';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useStore } from '@/store/store';
import { DayConfig } from '@/interfaces/schedule';
import Schedule from '../ui/Schedule';
import { createAttractionService } from '@/services/attractions/create-attraction';
import { useRouter } from 'next/navigation';
import { Address } from '@/interfaces/address';
import {
  Autocomplete,
  GoogleMap,
  Marker,
  useLoadScript,
} from '@react-google-maps/api';

type LatLng = {
  lat: number;
  lng: number;
};

const dayConfigSchema = yup.object({
  open24hours: yup.boolean(),
  times: yup.array().of(
    yup.object({
      from: yup.string(),
      to: yup.string(),
    }),
  ),
});

const configSchema = yup
  .object()
  .shape(Object.fromEntries(WEEKDAYS.map((day) => [day, dayConfigSchema])));

const schema = yup
  .object({
    name: yup.string().required('El campo es obligatorio.'),
    description: yup
      .string()
      .min(100, 'La descripción debe tener un mínimo de 100 caractéres.')
      .required('El campo es obligatorio.'),
    category: yup.string().required('El campo es obligatorio.'),
    services: yup
      .array()
      .of(yup.string())
      .min(1, 'Debes seleccionar al menos uno.')
      .required('El campo es obligatorio.'),
    price: yup.number().optional(),
    currency: yup.string(),
    address: yup
      .object({
        lat: yup.number().required('La dirección es obligatoria.'),
        lng: yup.number().required('La dirección es obligatoria.'),
        formatted_address: yup
          .string()
          .required('La dirección es obligatoria.'),
      })
      .required('La dirección es obligatoria.'),
    website: yup.string(),
    instagram: yup.string(),
    facebook: yup.string(),
    phonenumber: yup.string(),
    email: yup
      .string()
      .optional()
      .test(
        'is-valid-email',
        'Debe ingresar un correo electrónico válido.',
        (value) => {
          if (!value) return true;
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
        },
      ),
    schedule: configSchema,
  })
  .required();

const containerStyle = {
  width: '100%',
  height: '100%',
};

const libraries: 'places'[] = ['places'];

const CreateAttractionForm = () => {
  const router = useRouter();
  const { createData, setCreateData } = useStore((state) => state);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: createData?.name,
      description: createData?.description,
      category: createData?.category,
      services: createData?.services,
      price:
        createData?.price && createData?.price > 0
          ? createData?.price
          : undefined,
      currency: createData?.currency || 'ars',
      website: createData?.website,
      instagram: createData?.instagram,
      facebook: createData?.facebook,
      phonenumber: createData?.phonenumber,
      email: createData?.email,
      schedule:
        createData?.schedule ||
        Object.fromEntries(
          WEEKDAYS.map((day) => [
            day,
            {
              open24hours: false,
              times: [],
            },
          ]),
        ),
    },
  });

  const [selectedTab, setSelectedTab] = useState<string | number>('details');
  const [saved, setSaved] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<LatLng | null>(null);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const notify = (message?: string) =>
    toast.error(message ?? '¡Algo salio mal! Vuelve a intentarlo más tarde', {
      position: 'top-left',
      theme: 'dark',
    });

  const handleSaveAndContinue = (data: any) => {
    if (images?.length > 3) {
      setCreateData({
        ...data,
        images,
      });
      setSaved(true);
      setSelectedTab('contact');
    }
  };

  const handleFinish = async (data: any) => {
    const formData = new FormData();

    formData.append('title', data.name);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('contactNumber', data.phonenumber || '');
    formData.append('email', data.email || '');
    formData.append('webSite', data.website || '');
    formData.append('instagram', data.instagram || '');
    formData.append('facebook', data.facebook || '');
    formData.append('services', JSON.stringify(data.services));

    formData.append('location', JSON.stringify(data.address));

    formData.append('schedule', JSON.stringify(data.schedule));

    if (data.price) {
      formData.append('price', data.price.toString());
      formData.append('currencyPrice', data.currency || 'ars');
    }

    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      setLoading(true);
      const attraction = await createAttractionService(formData);
      reset();
      handleNavigation(`/attractions/${attraction?.slug}`);
    } catch {
      notify();
    } finally {
      setLoading(false);
    }
  };

  const setSchedule = (schedule: Record<string, DayConfig>) => {
    setValue('schedule', schedule);
  };

  const onAutocompleteLoad = (
    autocompleteInstance: google.maps.places.Autocomplete,
  ) => {
    setAutocomplete(autocompleteInstance);
  };

  const handlePlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const newLocation = {
          lat: place.geometry.location?.lat() as number,
          lng: place.geometry.location?.lng() as number,
          formatted_address: place.formatted_address,
        };
        setSelectedPosition(newLocation);
        setValue('address', newLocation as Address, {
          shouldValidate: true,
          shouldDirty: true,
        });
        mapRef.current?.panTo(newLocation);
      }
    }
  };

  console.log(watch('address'));

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentPosition(userLocation);
          setSelectedPosition(userLocation);
        },
        (error) => {
          console.error('Error getting the location: ', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    }
  }, []);

  return (
    <>
      <Tabs
        aria-label="Pasos para publicar"
        selectedKey={selectedTab}
        onSelectionChange={(key) => {
          const dataForm = getValues();
          const newCreateData = {
            ...dataForm,
            price:
              dataForm?.price && dataForm?.price > 0
                ? dataForm?.price
                : undefined,
            services: (dataForm?.services as string[]) || [],
            images,
          };
          setCreateData(newCreateData);
          setSelectedTab(key);
        }}
      >
        <Tab
          key="details"
          title={
            <div className="flex items-center space-x-2">
              {saved ? (
                <FaCircleCheck size={21} color="#E95718" />
              ) : (
                <PiNumberCircleOneFill
                  size={25}
                  color={selectedTab === 'details' ? '#E95718' : '#676767'}
                />
              )}
              <span>Detalles de la ubicación</span>
            </div>
          }
        >
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
                      defaultSelectedKeys={[createData?.category || '']}
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
                        (value?.filter(
                          (val) => val !== undefined,
                        ) as string[]) || []
                      }
                      defaultSelectedKeys={createData?.services || []}
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
              {loadError ? (
                <div className="w-full h-full flex justify-center items-center">
                  Error al cargar el mapa
                </div>
              ) : !isLoaded ? (
                <div className="w-full h-full flex justify-center items-center">
                  Cargando...
                </div>
              ) : (
                <div className="flex flex-col gap-1 w-1/2">
                  <Controller
                    name="address.formatted_address"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        onLoad={onAutocompleteLoad}
                        onPlaceChanged={handlePlaceChanged}
                      >
                        <Input
                          type="text"
                          label="Buscar lugar"
                          labelPlacement="outside"
                          placeholder="Escribe la dirección"
                          isInvalid={
                            !!errors.address?.formatted_address?.message
                          }
                          errorMessage={
                            errors.address?.formatted_address?.message
                          }
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                            }
                          }}
                          {...field}
                        />
                      </Autocomplete>
                    )}
                  />

                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={
                      selectedPosition || currentPosition || { lat: 0, lng: 0 }
                    }
                    zoom={currentPosition ? 15 : 2}
                    onLoad={(map) => {
                      mapRef.current = map;
                    }}
                    options={{
                      gestureHandling: 'cooperative',
                      zoomControl: true,
                      scrollwheel: true,
                      disableDoubleClickZoom: false,
                      fullscreenControl: true,
                      streetViewControl: true,
                      mapTypeControl: true,
                    }}
                  >
                    {selectedPosition && <Marker position={selectedPosition} />}
                  </GoogleMap>
                </div>
              )}
            </div>
            <ImageUploader
              defaultImages={createData?.images}
              onImagesChange={setImages}
            />
            <Button type="submit" color="primary">
              Guardar y continuar
            </Button>
          </form>
        </Tab>
        <Tab
          key="contact"
          title={
            <div className="flex items-center space-x-2">
              <PiNumberCircleTwoFill
                size={25}
                color={selectedTab === 'contact' ? '#E95718' : '#676767'}
              />
              <span>Contacto y horarios</span>
            </div>
          }
          isDisabled={!saved}
        >
          <form
            onSubmit={handleSubmit(handleFinish)}
            className="flex flex-col gap-4 items-start"
          >
            <div className="flex gap-4 w-full">
              <div className="flex flex-col gap-4">
                <Schedule onSaveSchedule={setSchedule} />
                <Input
                  type="text"
                  label={
                    <label>
                      Sitio web <span className="text-tiny">(Opcional)</span>
                    </label>
                  }
                  labelPlacement="outside"
                  className="w-1/2"
                  isInvalid={!!errors.website?.message}
                  errorMessage={errors.website?.message}
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">
                        https://
                      </span>
                    </div>
                  }
                  {...register('website')}
                />
                <Input
                  type="text"
                  label={
                    <label>
                      Instagram <span className="text-tiny">(Opcional)</span>
                    </label>
                  }
                  labelPlacement="outside"
                  className="w-1/2"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">
                        https://
                      </span>
                    </div>
                  }
                  isInvalid={!!errors.instagram?.message}
                  errorMessage={errors.instagram?.message}
                  {...register('instagram')}
                />
                <Input
                  type="text"
                  label={
                    <label>
                      Facebook <span className="text-tiny">(Opcional)</span>
                    </label>
                  }
                  labelPlacement="outside"
                  className="w-1/2"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">
                        https://
                      </span>
                    </div>
                  }
                  isInvalid={!!errors.facebook?.message}
                  errorMessage={errors.facebook?.message}
                  {...register('facebook')}
                />
                <Input
                  type="text"
                  label={
                    <label>
                      Email <span className="text-tiny">(Opcional)</span>
                    </label>
                  }
                  labelPlacement="outside"
                  placeholder="Email de contacto"
                  className="w-1/2"
                  isInvalid={!!errors.email?.message}
                  errorMessage={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  type="text"
                  label={
                    <label>
                      Teléfono <span className="text-tiny">(Opcional)</span>
                    </label>
                  }
                  labelPlacement="outside"
                  className="w-1/2"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">+54</span>
                    </div>
                  }
                  isInvalid={!!errors.phonenumber?.message}
                  errorMessage={errors.phonenumber?.message}
                  {...register('phonenumber')}
                />
              </div>
            </div>
            <Button isLoading={loading} type="submit" color="primary">
              Guardar y finalizar
            </Button>
          </form>
        </Tab>
      </Tabs>
      <ToastContainer autoClose={10000} />
    </>
  );
};

export default CreateAttractionForm;
