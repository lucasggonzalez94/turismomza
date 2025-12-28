'use client';

import { FC, useEffect, useState, useCallback } from 'react';
import { PiNumberCircleOneFill, PiNumberCircleTwoFill } from 'react-icons/pi';
import { FaCircleCheck } from 'react-icons/fa6';
import { usePathname } from 'next/navigation';

import PlaceFormDetails from './PlaceFormDetails';
import PlaceFormContact from './PlaceFormContact';
import {
  FormProgress,
  PlaceFormWithCustomImages,
} from '@/interfaces/place-form';
import { usePlaceStore } from '@/store/placeStore';
import { fetchImageAsFile } from '@/utils/helpers';
import useWindowSize from '@/hooks/useWindowSize';
import { useLoadingStore } from '@/store/loadingStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

interface IPropsPlaceForm {
  isEditing?: boolean;
  dataPlace?: PlaceFormWithCustomImages;
  placeId?: string;
}

const PlaceForm: FC<IPropsPlaceForm> = ({ isEditing, dataPlace, placeId }) => {
  const {
    placeFormDetails,
    placeFormContact,
    setPlaceFormDetails,
    setPlaceFormContact,
  } = usePlaceStore((state) => state);
  const { setLoading } = useLoadingStore((state) => state);
  const { width } = useWindowSize();
  const pathname = usePathname();

  const [selectedTab, setSelectedTab] = useState<FormProgress>('details');
  const [hideTextTabs, setHideTextTabs] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Función para cargar los datos iniciales cuando se está editando
  const loadInitialData = useCallback(async () => {
    if (!isEditing || !dataPlace) return;

    try {
      setLoading(true);
      const { images, ...restDataPlace } = dataPlace;

      // Convertir las imágenes a objetos File
      const imagesAsFile = await Promise.all(
        images?.map(
          async (image) => await fetchImageAsFile(image.url, image.publicId),
        ) || [],
      );

      // Actualizar el estado de detalles
      setPlaceFormDetails({
        name: restDataPlace?.name,
        description: restDataPlace?.description,
        category: restDataPlace?.category,
        services: restDataPlace?.services,
        price: restDataPlace?.price,
        currency: restDataPlace?.currency,
        address: restDataPlace?.address,
        images: imagesAsFile,
      });

      // Actualizar el estado de contacto
      setPlaceFormContact({
        website: restDataPlace?.website,
        instagram: restDataPlace?.instagram,
        facebook: restDataPlace?.facebook,
        phonenumber: restDataPlace?.phonenumber,
        email: restDataPlace?.email,
        schedule: restDataPlace?.schedule,
      });

      setSaved(true);
      setDataLoaded(true);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error al cargar datos iniciales:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [
    isEditing,
    dataPlace,
    setLoading,
    setPlaceFormDetails,
    setPlaceFormContact,
  ]);

  // Resetear el formulario cuando cambia la ruta o cuando se inicia un nuevo formulario
  const resetForm = useCallback(() => {
    if (!isEditing) {
      setPlaceFormDetails(null);
      setPlaceFormContact(null);
      setSaved(false);
    }
    setLoading(false);
  }, [isEditing, setPlaceFormDetails, setPlaceFormContact, setLoading]);

  // Efecto para cargar datos iniciales o resetear el formulario
  useEffect(() => {
    if (isEditing && dataPlace) {
      loadInitialData();
    } else {
      resetForm();
    }
  }, [isEditing, dataPlace, pathname, loadInitialData, resetForm]);

  // Efecto para verificar si los datos están cargados correctamente
  useEffect(() => {
    // Si estamos en modo edición pero los datos no están cargados en el estado,
    // intentamos cargarlos de nuevo
    if (
      isEditing &&
      dataPlace &&
      (!placeFormDetails || !placeFormContact) &&
      !dataLoaded
    ) {
      loadInitialData();
    }
  }, [
    isEditing,
    dataPlace,
    placeFormDetails,
    placeFormContact,
    dataLoaded,
    loadInitialData,
  ]);

  // Efecto para ajustar la UI en dispositivos móviles
  useEffect(() => {
    setHideTextTabs(width <= 420);
  }, [width]);

  return (
    <Tabs
      aria-label="Pasos para publicar"
      value={selectedTab}
      onValueChange={(val) => setSelectedTab(val as FormProgress)}
      className="w-full"
    >
      <TabsList className="w-full justify-start gap-2 mb-2 overflow-x-auto">
        <TabsTrigger value="details" className="flex items-center gap-2">
          {saved ? (
            <FaCircleCheck size={21} color="#E95718" />
          ) : (
            <PiNumberCircleOneFill
              size={25}
              color={selectedTab === 'details' ? '#E95718' : '#676767'}
            />
          )}
          {!hideTextTabs && <span>Detalles generales</span>}
        </TabsTrigger>
        <TabsTrigger
          value="contact"
          disabled={!saved}
          className="flex items-center gap-2"
        >
          <PiNumberCircleTwoFill
            size={25}
            color={selectedTab === 'contact' || saved ? '#E95718' : '#676767'}
          />
          {!hideTextTabs && <span>Contacto y horarios</span>}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="details" className="w-full">
        {selectedTab === 'details' && (
          <PlaceFormDetails
            setSaved={setSaved}
            setSelectedTab={(tab: string) =>
              setSelectedTab(tab as FormProgress)
            }
            defaultValues={
              placeFormDetails ||
              (dataPlace
                ? {
                    name: dataPlace.name,
                    description: dataPlace.description,
                    category: dataPlace.category,
                    services: dataPlace.services,
                    price: dataPlace.price,
                    currency: dataPlace.currency,
                    address: dataPlace.address,
                  }
                : undefined)
            }
          />
        )}
      </TabsContent>

      <TabsContent value="contact" className="w-full">
        {selectedTab === 'contact' && (
          <PlaceFormContact
            isEditing={isEditing}
            placeId={placeId}
            defaultValues={
              placeFormContact ||
              (dataPlace
                ? {
                    website: dataPlace.website,
                    instagram: dataPlace.instagram,
                    facebook: dataPlace.facebook,
                    phonenumber: dataPlace.phonenumber,
                    email: dataPlace.email,
                    schedule: dataPlace.schedule,
                  }
                : undefined)
            }
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default PlaceForm;
