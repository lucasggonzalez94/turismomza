'use client';

import { FC, useEffect, useState } from 'react';

import { Tab, Tabs } from '@nextui-org/react';
import { PiNumberCircleOneFill, PiNumberCircleTwoFill } from 'react-icons/pi';
import { FaCircleCheck } from 'react-icons/fa6';
import PlaceFormDetails from './PlaceFormDetails';
import PlaceFormContact from './PlaceFormContact';
import { IPlaceFormContact, IPlaceFormDetails } from '@/interfaces/place-form';
import { IImage } from '@/interfaces/place';
import { useStore } from '@/store/store';
import { fetchImageAsFile } from '@/utils/helpers';
import useWindowSize from '@/hooks/useWindowSize';
import Spinner from '../ui/Spinner/Spinner';
import { usePathname } from 'next/navigation';

type PlaceFormWithCustomImages = Omit<
  IPlaceFormDetails & IPlaceFormContact,
  'images'
> & {
  images?: IImage[];
};

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
    loading,
    setLoading,
  } = useStore((state) => state);
  const { width } = useWindowSize();
  const pathname = usePathname();

  const [selectedTab, setSelectedTab] = useState<string>('details');
  const [hideTextTabs, setHideTextTabs] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isEditing && dataPlace) {
      setLoading(true);
      const { images, ...restDataPlace } = dataPlace;

      const fetchImagesAsFiles = async () => {
        const imagesAsFile = await Promise.all(
          images?.map(
            async (image) => await fetchImageAsFile(image.url, image.publicId),
          ) || [],
        );
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
        setPlaceFormContact({
          website: restDataPlace?.website,
          instagram: restDataPlace?.instagram,
          facebook: restDataPlace?.facebook,
          phonenumber: restDataPlace?.phonenumber,
          email: restDataPlace?.email,
          schedule: restDataPlace?.schedule,
        });
        setLoading(false);
      };

      setSaved(true);
      fetchImagesAsFiles();
    } else {
      setPlaceFormDetails(null);
      setPlaceFormContact(null);
      setLoading(false);
      setSaved(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, dataPlace, pathname]);

  useEffect(() => {
    if (width > 420) {
      setHideTextTabs(false);
    } else {
      setHideTextTabs(true);
    }
  }, [width]);

  if (loading) return <Spinner />;

  return (
    <Tabs
      aria-label="Pasos para publicar"
      selectedKey={selectedTab}
      onSelectionChange={(key) => {
        setSelectedTab(key as string);
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
        className="w-full"
      >
        {selectedTab === 'details' && (
          <PlaceFormDetails
            setSaved={setSaved}
            setSelectedTab={setSelectedTab}
            defaultValues={placeFormDetails}
          />
        )}
      </Tab>
      <Tab
        key="contact"
        title={
          <div className="flex items-center space-x-2">
            <PiNumberCircleTwoFill
              size={25}
              color={selectedTab === 'contact' || saved ? '#E95718' : '#676767'}
            />
            {!hideTextTabs && <span>Contacto y horarios</span>}
          </div>
        }
        isDisabled={!saved}
        className="w-full"
      >
        {selectedTab === 'contact' && (
          <PlaceFormContact
            isEditing={isEditing}
            placeId={placeId}
            defaultValues={placeFormContact}
          />
        )}
      </Tab>
    </Tabs>
  );
};

export default PlaceForm;
