'use client';

import { useEffect, useRef, useState } from 'react';

import { Button, Input } from '@nextui-org/react';
import { IoSearch } from 'react-icons/io5';

const DropdownSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div className="relative" ref={searchRef}>
        <Button
          isIconOnly
          variant="light"
          className="rounded-full z-50"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <IoSearch size={25} color="#fff" />
        </Button>

        <div
          className={`absolute top-0 left-0 transition-all duration-500 w-96 ${
            isOpen
              ? 'opacity-100 transform translate-y-12 translate-x-[-45%]'
              : 'opacity-0 translate-y-0 translate-x-[-45%]'
          }`}
        >
          <div className="flex items-center bg-gray-800 rounded-md p-4 shadow-md">
            <Input
              isClearable
              radius="md"
              classNames={{
                input: ['text-black/90', 'placeholder:text-default-700/50'],
                inputWrapper: ['shadow-xl', 'bg-default-200'],
              }}
              placeholder="Buscar..."
              startContent={
                <IoSearch className="text-gray-700 pointer-events-none flex-shrink-0" />
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownSearch;
