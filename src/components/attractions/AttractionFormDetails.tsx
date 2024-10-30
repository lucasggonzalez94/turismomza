import { FC, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Autocomplete,
  GoogleMap,
  Marker,
  useLoadScript,
} from '@react-google-maps/api';
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react';
import ImageUploader from '../ui/ImageUploader';
import { CATEGORIES, CURRENCIES, SERVICES } from '@/utils/constants';
import { useStore } from '@/store/store';
import { Address, LatLng } from '@/interfaces/address';

interface IPropsAttractionFormDetails {
  setSaved: (saved: boolean) => void;
  setSelectedTab: (tab: string) => void;
}

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
  })
  .required();

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '400px',
};

const libraries: 'places'[] = ['places'];

const AttractionFormDetails: FC<IPropsAttractionFormDetails> = ({
  setSaved,
  setSelectedTab,
}) => {
  const { attractionFormData, setAttractionFormData } = useStore(
    (state) => state,
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: attractionFormData?.name,
      description: attractionFormData?.description,
      category: attractionFormData?.category,
      services: attractionFormData?.services,
      price:
        attractionFormData?.price && attractionFormData?.price > 0
          ? attractionFormData?.price
          : undefined,
      currency: attractionFormData?.currency || 'ars',
      address: attractionFormData?.address,
    },
  });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const [images, setImages] = useState<File[]>([]);
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>({
    lat: attractionFormData?.address?.lat || 0,
    lng: attractionFormData?.address?.lng || 0,
  });
  const [selectedPosition, setSelectedPosition] = useState<LatLng | null>({
    lat: attractionFormData?.address?.lat || 0,
    lng: attractionFormData?.address?.lng || 0,
  });
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleSaveAndContinue = (data: any) => {
    if (images?.length > 3) {
      setAttractionFormData({
        ...attractionFormData,
        ...data,
        images,
      });
      setSaved(true);
      setSelectedTab('contact');
    }
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

  useEffect(() => {
    if (attractionFormData) {
      reset(attractionFormData);
      setCurrentPosition({
        lat: attractionFormData?.address?.lat || 0,
        lng: attractionFormData?.address?.lng || 0,
      });
      setSelectedPosition({
        lat: attractionFormData?.address?.lat || 0,
        lng: attractionFormData?.address?.lng || 0,
      });
    } else if (navigator.geolocation) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attractionFormData]);

  return (
    <form
      onSubmit={handleSubmit(handleSaveAndContinue)}
      className="flex flex-col gap-4 items-start"
    >
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="flex flex-col gap-4 w-full lg:w-1/2">
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
                defaultSelectedKeys={[attractionFormData?.category || '']}
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
                  (value?.filter((val) => val !== undefined) as string[]) || []
                }
                defaultSelectedKeys={attractionFormData?.services || []}
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
          <div className="flex flex-col gap-1 w-full lg:w-1/2 h-100%">
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
                    isInvalid={!!errors.address?.formatted_address?.message}
                    errorMessage={errors.address?.formatted_address?.message}
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
                selectedPosition ||
                currentPosition || {
                  lat: 0,
                  lng: 0,
                }
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
        defaultImages={attractionFormData?.images}
        onImagesChange={setImages}
      />
      <Button type="submit" color="primary">
        Guardar y continuar
      </Button>
    </form>
  );
};

export default AttractionFormDetails;
