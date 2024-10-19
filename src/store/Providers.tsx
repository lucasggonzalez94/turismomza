'use client';

import { LoadScript } from '@react-google-maps/api';
import { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Providers: FC<Props> = ({ children }) => {
  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
    >
      {children}
    </LoadScript>
  );
};

export default Providers;
