'use client';

import { useState } from 'react';

import { toast, ToastContainer } from 'react-toastify';
import { Tab, Tabs } from '@nextui-org/react';
import { PiNumberCircleOneFill, PiNumberCircleTwoFill } from 'react-icons/pi';
import { FaCircleCheck } from 'react-icons/fa6';
import FirstStepCreation from './FirstStepCreation';
import SecondStepCreation from './SecondStepCreation';

const CreateStepper = () => {
  const [selectedTab, setSelectedTab] = useState<string | number>('details');
  const [saved, setSaved] = useState(false);

  const notify = (message?: string) =>
    toast.error(message ?? '¡Algo salio mal! Vuelve a intentarlo más tarde', {
      position: 'top-left',
      theme: 'dark',
    });

  return (
    <>
      <Tabs
        aria-label="Pasos para publicar"
        selectedKey={selectedTab}
        onSelectionChange={setSelectedTab}
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
          <FirstStepCreation
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
        >
          <SecondStepCreation />
        </Tab>
      </Tabs>
      <ToastContainer autoClose={10000} />
    </>
  );
};

export default CreateStepper;
