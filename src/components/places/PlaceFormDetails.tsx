import { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// import {
//   Autocomplete,
//   GoogleMap,
//   Marker,
//   useLoadScript,
// } from '@react-google-maps/api';
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react';
import ImageUploader from '../ui/ImageUploader';
import { CATEGORIES, CURRENCIES, SERVICES } from '@/utils/constants';
import { useStore } from '@/store/store';
import { IPlaceForm } from '@/interfaces/place-form';
// import { Address, LatLng } from '@/interfaces/address';

interface IPropsPlaceFormDetails {
  setSaved: (saved: boolean) => void;
  setSelectedTab: (tab: string) => void;
  defaultValues?: IPlaceForm | null;
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
      .of(yup.string().required())
      .min(1, 'Debes seleccionar al menos uno.')
      .required('El campo es obligatorio.'),
    price: yup.number().optional(),
    currency: yup.string(),
    address: yup.string().required('La dirección es obligatoria.'),
  })
  .required();

// const containerStyle = {
//   width: '100%',
//   height: '100%',
//   minHeight: '300px',
// };

// const libraries: 'places'[] = ['places'];

const PlaceFormDetails: FC<IPropsPlaceFormDetails> = ({
  setSaved,
  setSelectedTab,
  defaultValues,
}) => {
  const { setPlaceFormData } = useStore((state) => state);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      services: [],
      price: undefined,
      currency: 'ars',
      address: '',
    },
  });

  // const { isLoaded, loadError } = useLoadScript({
  //   googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  //   libraries,
  // });

  const [images, setImages] = useState<File[]>([]);
  // const [currentPosition, setCurrentPosition] = useState<LatLng | null>({
  //   lat: placeFormData?.address?.lat || 0,
  //   lng: placeFormData?.address?.lng || 0,
  // });
  // const [selectedPosition, setSelectedPosition] = useState<LatLng | null>({
  //   lat: placeFormData?.address?.lat || 0,
  //   lng: placeFormData?.address?.lng || 0,
  // });
  // const [autocomplete, setAutocomplete] =
  //   useState<google.maps.places.Autocomplete | null>(null);
  // const mapRef = useRef<google.maps.Map | null>(null);

  const handleSaveAndContinue = (data: any) => {
    if (images?.length > 3) {
      setPlaceFormData({
        ...defaultValues,
        ...data,
        images,
      });
      setSaved(true);
      setSelectedTab('contact');
    }
  };

  // const onAutocompleteLoad = (
  //   autocompleteInstance: google.maps.places.Autocomplete,
  // ) => {
  //   setAutocomplete(autocompleteInstance);
  // };

  // const handlePlaceChanged = () => {
  //   if (autocomplete !== null) {
  //     const place = autocomplete.getPlace();
  //     if (place.geometry) {
  //       const newLocation = {
  //         lat: place.geometry.location?.lat() as number,
  //         lng: place.geometry.location?.lng() as number,
  //         formatted_address: place.formatted_address,
  //       };
  //       setSelectedPosition(newLocation);
  //       setValue('address', newLocation as Address, {
  //         shouldValidate: true,
  //         shouldDirty: true,
  //       });
  //       mapRef.current?.panTo(newLocation);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (placeFormData) {
  //     reset(placeFormData);
  //     setCurrentPosition({
  //       lat: placeFormData?.address?.lat || 0,
  //       lng: placeFormData?.address?.lng || 0,
  //     });
  //     setSelectedPosition({
  //       lat: placeFormData?.address?.lat || 0,
  //       lng: placeFormData?.address?.lng || 0,
  //     });
  //   } else if (navigator.geolocation && isLoaded) {
  //     navigator.geolocation.watchPosition(
  //       function () {},
  //       function () {},
  //       {},
  //     );
  //     navigator.geolocation.watchPosition(
  //       async (position) => {
  //         const { latitude, longitude } = position.coords;
  //         const userLocation = {
  //           lat: latitude,
  //           lng: longitude,
  //         };
  //         setCurrentPosition(userLocation);
  //         setSelectedPosition(userLocation);
  //       },
  //       () => {},
  //       {
  //         enableHighAccuracy: true,
  //         timeout: 10000,
  //         maximumAge: 30000,
  //       },
  //     );
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [placeFormData, isLoaded]);

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
      });
      setImages(defaultValues?.images || []);
    } else {
      reset({
        name: '',
        description: '',
        category: '',
        services: [],
        price: undefined,
        currency: 'ars',
        address: '',
      });
      setImages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  useEffect(() => {
    return () => {
      setPlaceFormData({
        ...defaultValues,
        ...getValues(),
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form
      onSubmit={handleSubmit(handleSaveAndContinue)}
      className="flex flex-col gap-4 items-start w-full"
    >
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="flex flex-col gap-4 w-full">
          <Input
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
          <Input
            type="text"
            label="Dirección"
            labelPlacement="outside"
            placeholder="Ingresá la dirección del lugar"
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
        {/* {loadError ? (
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
        )} */}
      </div>
      <ImageUploader
        defaultImages={defaultValues?.images}
        onImagesChange={setImages}
      />
      <Button type="submit" color="primary">
        Guardar y continuar
      </Button>
    </form>
  );
};

export default PlaceFormDetails;
