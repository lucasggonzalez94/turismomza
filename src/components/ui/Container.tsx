import React from 'react';

const Container = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`mx-auto px-4 sm:px-6 lg:px-8 w-full py-4 sm:py-6 lg:py-8 ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
