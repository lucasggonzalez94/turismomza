'use client';

import { useState, useEffect, useRef, useCallback, FC } from 'react';
import {
  GoogleMap,
  DirectionsRenderer,
  Marker,
  useJsApiLoader,
} from '@react-google-maps/api';
import { LatLng } from '@/interfaces/address';
import { IoAlertCircle } from 'react-icons/io5';

interface IPropsMapRoute {
  location: string;
}

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '350px',
};

const MapRoute: FC<IPropsMapRoute> = ({ location }) => {
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null);
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [locationParsed, setLocationParsed] = useState<LatLng>({
    lat: 0,
    lng: 0,
  });
  const [alertLocation, setAlertLocation] = useState<{
    message: string;
    type: 'warn' | 'error';
  } | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded: mapsApiLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ['places'],
  });

  // const fetchPreciseLocation = async () => {
  //   try {
  //     const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  //     const geolocationURL = `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`;

  //     const response = await fetch(geolocationURL, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ considerIp: true }),
  //     });

  //     const data = await response.json();
  //     const { lat, lng } = data.location;
  //     setCurrentPosition({ lat, lng });
  //   } catch (error) {
  //     console.error('Error obteniendo ubicación con Geolocation API:', error);
  //   }
  // };

  useEffect(() => {
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        if (accuracy > 50) {
          setAlertLocation({
            message:
              'Tu ubicación es imprecisa. Intentá activar el Wi-Fi o usar un dispositivo con GPS.',
            type: 'warn',
          });
        } else {
          setAlertLocation(null);
        }
        setCurrentPosition({
          lat: latitude,
          lng: longitude,
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setAlertLocation({
            message:
              'Por favor, permití el acceso a la ubicación para continuar.',
            type: 'error',
          });
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setAlertLocation({
            message:
              'No se pudo acceder a tu ubicación. Verificá que el GPS o el Wi-Fi estén habilitados.',
            type: 'error',
          });
        } else if (error.code === error.TIMEOUT) {
          setAlertLocation({
            message:
              'El dispositivo tardó demasiado en determinar tu ubicación.',
            type: 'error',
          });
        } else {
          setAlertLocation({
            message:
              'No se pudo determinar tu ubicación. Intentá con otro dispositivo.',
            type: 'error',
          });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      },
    );
  }, []);

  const calculateRoute = useCallback(async () => {
    if (!currentPosition) return;

    const directionsService = new google.maps.DirectionsService();
    try {
      const results = await directionsService.route({
        origin: currentPosition,
        destination: locationParsed,
        travelMode: google.maps.TravelMode.DRIVING,
      });
      setDirectionsResponse(results);
    } catch {
      setAlertLocation({
        message: 'Error al calcular la ruta.',
        type: 'error',
      });
    }
  }, [currentPosition, locationParsed]);

  useEffect(() => {
    if (currentPosition && locationParsed && mapsApiLoaded) {
      calculateRoute();
    }
  }, [currentPosition, mapsApiLoaded, calculateRoute, locationParsed]);

  useEffect(() => {
    if (location) {
      const locationParsed = JSON.parse(JSON.parse(location));
      setLocationParsed(locationParsed);
    }
  }, [location]);

  if (loadError) return <div>Error al cargar el mapa</div>;
  if (!mapsApiLoaded) return <div>Cargando...</div>;

  return (
    <>
      {alertLocation && (
        <div
          className={`p-2 border-2 ${alertLocation?.type === 'error' ? 'border-red-600 text-red-600 bg-red-200' : 'border-yellow-600 text-yellow-600 bg-yellow-200'} rounded mb-2 flex gap-2 items-center`}
        >
          <IoAlertCircle size={30} />
          {alertLocation?.message}
        </div>
      )}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={locationParsed || currentPosition || undefined}
        zoom={10}
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
        {locationParsed && <Marker position={locationParsed} />}
        {currentPosition && <Marker position={currentPosition} />}
        {directionsResponse && (
          <DirectionsRenderer
            options={{
              directions: directionsResponse,
              suppressMarkers: true,
            }}
          />
        )}
      </GoogleMap>
    </>
  );
};

export default MapRoute;
