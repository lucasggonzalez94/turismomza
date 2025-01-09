'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';

interface IPropSidedrawer {
  title?: string;
  children: ReactNode;
  side?: 'right' | 'left';
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}

const Sidedrawer: FC<IPropSidedrawer> = ({
  title,
  children,
  side = 'right',
  isOpen,
  setIsOpen,
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.id === 'backdrop') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300); // Tiempo de la animación
    }
  }, [isOpen]);

  return (
    <>
      {isVisible && (
        <div
          id="backdrop"
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-all duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleOutsideClick}
        />
      )}
      <div
        className={`fixed top-0 h-screen bg-white shadow-lg z-50 transition-all duration-300 p-4 ${
          side === 'right' ? 'right-0' : 'left-0'
        } ${
          isOpen
            ? 'translate-x-0'
            : side === 'right'
              ? 'translate-x-full'
              : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center pb-3 border-b border-gray-300">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <button
            onClick={() => setIsOpen(false)}
            className="text-xl absolute top-4 right-4"
          >
            <IoMdClose size={24} />
          </button>
        </div>
        <div className="p-4 h-[calc(100vh-64px)] overflow-y-auto scrollbar-hide">
          {children}
        </div>
      </div>
    </>
  );
};

export default Sidedrawer;
