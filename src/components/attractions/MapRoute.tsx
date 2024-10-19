'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  GoogleMap,
  DirectionsRenderer,
  Marker,
  useJsApiLoader,
} from '@react-google-maps/api';

type LatLng = {
  lat: number;
  lng: number;
};

const containerStyle = {
  width: '100%',
  height: '100%',
};

const destination = { lat: -32.88930366016088, lng: -68.87073591419724 };

const MapRoute = () => {
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null);
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
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
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      });
      setDirectionsResponse(results);
    } catch (error) {
      console.error('Error al calcular la ruta:', error);
    }
  }, [currentPosition]);

  useEffect(() => {
    if (currentPosition && mapsApiLoaded) {
      calculateRoute();
    }
  }, [currentPosition, mapsApiLoaded, calculateRoute]);

  if (loadError) return <div>Error al cargar el mapa</div>;
  if (!mapsApiLoaded) return <div>Cargando...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={destination || currentPosition || undefined}
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
      {destination && <Marker position={destination} />}
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
