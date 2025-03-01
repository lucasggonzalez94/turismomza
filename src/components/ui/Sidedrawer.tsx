'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';

interface IPropSidedrawer {
  title?: string;
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  fullContent?: boolean;
}

const Sidedrawer: FC<IPropSidedrawer> = ({
  title,
  children,
  isOpen,
  setIsOpen,
  fullContent,
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
        className={`fixed top-0 bottom-[70px] md:bottom-0 bg-white shadow-lg z-50 transition-all duration-300 right-0 my-3 rounded-xl min-w-96 ${
          isOpen ? 'translate-x-0 mx-3' : 'translate-x-[101%] mx-0'
        }`}
      >
        <div
          className={`flex ${title ? 'justify-between border-b border-gray-300' : 'justify-end'} items-center p-4`}
        >
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <button onClick={() => setIsOpen(false)} className="text-xl">
            <IoMdClose size={24} />
          </button>
        </div>
        <div
          className={`${!fullContent && 'p-4'} h-[calc(100%-64px)] overflow-y-auto scrollbar-hide`}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default Sidedrawer;
