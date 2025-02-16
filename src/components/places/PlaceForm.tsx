'use client';

import { FC, useEffect, useState } from 'react';

import { Tab, Tabs } from '@nextui-org/react';
import { PiNumberCircleOneFill, PiNumberCircleTwoFill } from 'react-icons/pi';
import { FaCircleCheck } from 'react-icons/fa6';
import PlaceFormDetails from './PlaceFormDetails';
import PlaceFormContact from './PlaceFormContact';
import { IPlaceForm } from '@/interfaces/place-form';
import { IImage } from '@/interfaces/place';
import { useStore } from '@/store/store';
import { fetchImageAsFile } from '@/utils/helpers';
import useWindowSize from '@/hooks/useWindowSize';

type PlaceFormWithCustomImages = Omit<IPlaceForm, 'images'> & {
  images?: IImage[];
};

interface IPropsPlaceForm {
  isEditing?: boolean;
  dataPlace?: PlaceFormWithCustomImages;
  placeId?: string;
}

const PlaceForm: FC<IPropsPlaceForm> = ({
  isEditing,
  dataPlace,
  placeId,
}) => {
  const { setPlaceFormData } = useStore((state) => state);
  const { width } = useWindowSize();

  const [selectedTab, setSelectedTab] = useState<string | number>('details');
  const [hideTextTabs, setHideTextTabs] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    if (isEditing && dataPlace) {
      const { images, ...restDataPlace } = dataPlace;

      const fetchImagesAsFiles = async () => {
        const imagesAsFile = await Promise.all(
          images?.map(
            async (image) => await fetchImageAsFile(image.url, image.public_id),
          ) || [],
        );
        setPlaceFormData({
          ...restDataPlace,
          address: dataPlace?.address?.toString() || '',
          // schedule: JSON.parse(dataPlace?.schedule?.toString() || ''),
          images: imagesAsFile,
        });
        setIsDataReady(true);
      };

      fetchImagesAsFiles();
    } else {
      setIsDataReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, dataPlace]);

  useEffect(() => {
    if (width > 420) {
      setHideTextTabs(false);
    } else {
      setHideTextTabs(true);
    }
  }, [width]);

  if (!isDataReady) return <div>Cargando datos...</div>;

  return (
    <Tabs
      aria-label="Pasos para publicar"
      selectedKey={selectedTab}
      onSelectionChange={(key) => {
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
            {!hideTextTabs && <span>Detalles de la ubicación</span>}
          </div>
        }
      >
        <PlaceFormDetails
          setSaved={setSaved}
          setSelectedTab={setSelectedTab}
        />
      </Tab>
      <Tab
        key="contact"
        title={
          <div className="flex items-center space-x-2">
            <PiNumberCircleTwoFill
              size={25}
              color={selectedTab === 'contact' ? '#E95718' : '#676767'}
            />
            {!hideTextTabs && <span>Contacto y horarios</span>}
          </div>
        }
        isDisabled={!saved}
      >
        <PlaceFormContact isEditing={isEditing} placeId={placeId} />
      </Tab>
    </Tabs>
  );
};

export default PlaceForm;
