'use client';

import { useState, useEffect, useRef, useCallback, FC } from 'react';
import {
  GoogleMap,
  DirectionsRenderer,
  Marker,
  useJsApiLoader,
} from '@react-google-maps/api';
import { LatLng } from '@/interfaces/address';

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
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded: mapsApiLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ['places'],
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error obteniendo la ubicación: ', error);
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
    } catch (error) {
      console.error('Error al calcular la ruta:', error);
    }
  }, [currentPosition, location]);

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
  );
};

export default MapRoute;
