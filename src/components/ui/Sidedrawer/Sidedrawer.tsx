'use client';

import { FC, ReactNode, useEffect, useRef } from 'react';
import { IoMdClose } from 'react-icons/io';
import { CSSTransition } from 'react-transition-group';

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
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, setIsOpen]);

  return (
    <CSSTransition in={isOpen} timeout={300} classNames="drawer" unmountOnExit>
      <div
        className={`fixed top-0 ${
          side === 'left' ? 'left-0' : 'right-0'
        } h-full w-full sm:w-96 bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out transform ${
          isOpen
            ? 'translate-x-0'
            : side === 'left'
              ? '-translate-x-full'
              : 'translate-x-full'
        }`}
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="flex flex-col h-full">
          {title ? (
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 id="drawer-title" className="text-xl font-semibold">
                {title}
              </h2>
            </div>
          ) : null}
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1 absolute top-4 right-4"
            aria-label="Close sidedrawer"
          >
            <IoMdClose size={24} />
          </button>
          <div className="flex-grow overflow-y-auto p-4">{children}</div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default Sidedrawer;
