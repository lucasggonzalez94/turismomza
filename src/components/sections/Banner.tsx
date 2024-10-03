import React from 'react';

const Banner = () => {
  return (
    <div
      className="h-screen bg-cover bg-center"
      style={{
        backgroundImage: 'url(/images/background.jpg)',
      }}
    >
      <h1 className="text-white text-4xl text-center pt-20">
        ¡Bienvenido a Turismomza!
      </h1>
    </div>
  );
};

export default Banner;
