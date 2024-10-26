'use client';

import { FC, useEffect, useRef, useState } from 'react';
import {
  GoogleMap,
  Autocomplete,
  Marker,
  useLoadScript,
} from '@react-google-maps/api';
import { Input } from '@nextui-org/react';
import { Address } from '@/interfaces/address';

type LatLng = {
  lat: number;
  lng: number;
};

interface IPropsMapSearch {
  defaultAddress?: {
    formatted_address?: string | undefined;
    lat?: number;
    lng?: number;
  };
  onLocationSelected: (address: Address) => void;
  errors: any;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const libraries: 'places'[] = ['places'];

const MapSearch: FC<IPropsMapSearch> = ({
  defaultAddress,
  onLocationSelected,
  errors,
}) => {
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<LatLng | null>(null);
  const [inputValue, setInputValue] = useState<string>(
    defaultAddress?.formatted_address || '',
  );
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const handlePlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const newLocation = {
          lat: place.geometry.location?.lat() as number,
          lng: place.geometry.location?.lng() as number,
        };
        setSelectedPosition(newLocation);
        onLocationSelected({
          ...newLocation,
          formatted_address: place.formatted_address || '',
        });
        setInputValue(place.formatted_address as string);
        mapRef.current?.panTo(newLocation);
      }
    }
  };

  const onAutocompleteLoad = (
    autocompleteInstance: google.maps.places.Autocomplete,
  ) => {
    setAutocomplete(autocompleteInstance);
  };

  useEffect(() => {
    if (navigator.geolocation && !defaultAddress) {
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
  }, [defaultAddress]);

  useEffect(() => {
    if (defaultAddress) {
      setCurrentPosition({
        lat: defaultAddress?.lat || 0,
        lng: defaultAddress?.lng || 0,
      });
      setSelectedPosition({
        lat: defaultAddress?.lat || 0,
        lng: defaultAddress?.lng || 0,
      });

      onLocationSelected(defaultAddress as Address);
    }
  }, [defaultAddress, onLocationSelected]);

  if (loadError)
    return (
      <div className="w-full h-full flex justify-center items-center">
        Error al cargar el mapa
      </div>
    );
  if (!isLoaded)
    return (
      <div className="w-full h-full flex justify-center items-center">
        Cargando...
      </div>
    );

  return (
    <>
      <Autocomplete
        onLoad={onAutocompleteLoad}
        onPlaceChanged={handlePlaceChanged}
      >
        <Input
          type="text"
          label="Buscar lugar"
          labelPlacement="outside"
          value={inputValue}
          placeholder="Escribe la dirección"
          isInvalid={!!errors.address?.formatted_address?.message}
          errorMessage={errors.address?.formatted_address?.message}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={selectedPosition || currentPosition || { lat: 0, lng: 0 }}
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
    </>
  );
};

export default MapSearch;
