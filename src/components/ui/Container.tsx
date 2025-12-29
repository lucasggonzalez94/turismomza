import React from 'react';
import Chevron from './Chevron';

const Container = ({
  children,
  buttonBack,
  pathButtonBack,
  className = '',
}: {
  children: React.ReactNode;
  buttonBack?: boolean;
  pathButtonBack?: string;
  className?: string;
}) => {
  return (
    <div
      className={`mx-auto px-4 sm:px-6 lg:px-8 w-full py-4 sm:py-6 lg:py-8 ${className}`}
    >
      {buttonBack && <Chevron path={pathButtonBack} />}
      {children}
    </div>
  );
};

export default Container;
