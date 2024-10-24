'use client';

import { Address } from './FirstStepCreation';
import { FieldErrors } from 'react-hook-form';
import { FC, useEffect, useRef, useState } from 'react';
import {
  GoogleMap,
  Autocomplete,
  Marker,
  useLoadScript,
} from '@react-google-maps/api';
import { Input } from '@nextui-org/react';

type LatLng = {
  lat: number;
  lng: number;
};

interface IPropsMapSearch {
  onLocationSelected: (address: Address) => void;
  errors: FieldErrors<{
    price?: number | undefined;
    currency?: string | undefined;
    name: string;
    description: string;
    category: string;
    services: (string | undefined)[];
    address: {
      formatted_address?: string | undefined;
      lat: number;
      lng: number;
    };
  }>;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const libraries: 'places'[] = ['places'];

const MapSearch: FC<IPropsMapSearch> = ({ onLocationSelected, errors }) => {
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<LatLng | null>(null);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
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
          formatted_address: place.formatted_address,
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
      <div className="flex flex-col gap-1 w-full">
        <Autocomplete
          onLoad={onAutocompleteLoad}
          onPlaceChanged={handlePlaceChanged}
        >
          <Input
            type="text"
            label="Buscar lugar"
            labelPlacement="outside"
            placeholder="Escribe la dirección"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
          />
        </Autocomplete>
        <span className="text-sm text-red-500">{errors.address?.lat?.message || errors.address?.lng?.message}</span>
      </div>

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
