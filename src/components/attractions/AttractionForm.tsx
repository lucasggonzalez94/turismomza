'use client';

import { FC, useEffect, useState } from 'react';

import { Tab, Tabs } from '@nextui-org/react';
import { PiNumberCircleOneFill, PiNumberCircleTwoFill } from 'react-icons/pi';
import { FaCircleCheck } from 'react-icons/fa6';
import AttractionFormDetails from './AttractionFormDetails';
import AttractionFormContact from './AttractionFormContact';
import { IAttractionForm } from '@/interfaces/attraction-form';
import { IImage } from '@/interfaces/attraction';
import { useStore } from '@/store/store';
import { fetchImageAsFile } from '@/utils/helpers';

type AttractionFormWithCustomImages = Omit<IAttractionForm, 'images'> & {
  images?: IImage[];
};

interface IPropsAttractionForm {
  isEditing?: boolean;
  dataAttraction?: AttractionFormWithCustomImages;
  attractionId?: string;
}

const AttractionForm: FC<IPropsAttractionForm> = ({
  isEditing,
  dataAttraction,
  attractionId,
}) => {
  const { setAttractionFormData } = useStore((state) => state);

  const [selectedTab, setSelectedTab] = useState<string | number>('details');
  const [saved, setSaved] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    if (isEditing && dataAttraction) {
      const { images, ...restDataAttraction } = dataAttraction;

      const fetchImagesAsFiles = async () => {
        const imagesAsFile = await Promise.all(
          images?.map(
            async (image) => await fetchImageAsFile(image.url, image.public_id),
          ) || [],
        );
        setAttractionFormData({
          ...restDataAttraction,
          address: JSON.parse(dataAttraction?.address?.toString() || ''),
          schedule: JSON.parse(dataAttraction?.schedule?.toString() || ''),
          images: imagesAsFile,
        });
        setIsDataReady(true);
      };

      fetchImagesAsFiles();
    } else {
      setIsDataReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, dataAttraction]);

  if (!isDataReady) return <div>Cargando datos...</div>;

  return (
    <>
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
              <span>Detalles de la ubicación</span>
            </div>
          }
        >
          <AttractionFormDetails
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
              <span>Contacto y horarios</span>
            </div>
          }
          isDisabled={!saved}
        >
          <AttractionFormContact
            isEditing={isEditing}
            attractionId={attractionId}
          />
        </Tab>
      </Tabs>
    </>
  );
};

export default AttractionForm;
