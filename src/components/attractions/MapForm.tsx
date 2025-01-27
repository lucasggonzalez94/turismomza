'use client';

import React, { FC, useRef, useState } from 'react';
import { Input } from '@nextui-org/react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

interface LatLng {
  lat: number;
  lng: number;
}

const DEFAULT_CENTER = { lat: -32.889458, lng: -68.845839 }; // Mendoza, Argentina
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

const defaultIcon = L.icon({
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

const MapForm: FC = () => {
  const [position, setPosition] = useState<LatLng>(DEFAULT_CENTER);
  const [address, setAddress] = useState<string>('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const markerRef = useRef<L.Marker>(null);

  // Fetch suggestions from Nominatim
  const fetchSuggestions = async (query: string) => {
    try {
      const res = await fetch(
        `${NOMINATIM_URL}?q=${query}&format=json&addressdetails=1&limit=5`,
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions: ', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);

    if (value.length > 2) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (
    lat: number,
    lng: number,
    displayName: string,
  ) => {
    setAddress(displayName);
    setPosition({ lat, lng });
    setSuggestions([]);
    if (markerRef.current) {
      markerRef.current.setLatLng({ lat, lng });
    }
  };

  return (
    <div className="relative w-full h-[500px]">
      {/* Input de autocompletado */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-[90%] md:w-1/2">
        <Input
          type="text"
          label="Buscar ubicación"
          placeholder="Escribe una dirección"
          value={address}
          onChange={handleInputChange}
        />
        {/* Mostrar sugerencias */}
        {suggestions.length > 0 && (
          <ul className="absolute bg-white border rounded-md shadow-md max-h-60 overflow-y-auto w-full mt-2 z-50">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() =>
                  handleSuggestionSelect(
                    parseFloat(suggestion.lat),
                    parseFloat(suggestion.lon),
                    suggestion.display_name,
                  )
                }
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mapa */}
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />

        {/* Marcador */}
        <Marker
          position={position}
          ref={markerRef}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const newLatLng = (e.target as L.Marker).getLatLng();
              console.log((e.target as L.Marker).getPane());
              setPosition({ lat: newLatLng.lat, lng: newLatLng.lng });
              setAddress(`Lat: ${newLatLng.lat}, Lng: ${newLatLng.lng}`);
            },
          }}
        >
          <Popup>¡Estas aquí!</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapForm;
