'use client';

import { Input } from '@nextui-org/react';
import { IoSearch } from 'react-icons/io5';
import DropdownButton from '../DropdownButton/DropdownButton';
import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';

interface IPropsDropdownSearch {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const DropdownSearch: FC<IPropsDropdownSearch> = ({
  isOpen,
  onOpen,
  onClose,
}) => {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState('');

  return (
    <DropdownButton
      icon={<IoSearch size={25} color="#fff" />}
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    >
      <div className="flex items-center bg-gray-800/60 rounded-md p-4 shadow-md">
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
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={({ key }) => {
            if (key === 'Enter') {
              router.push(`/attractions?search=${searchValue}`);
            }
          }}
        />
      </div>
    </DropdownButton>
  );
};

export default DropdownSearch;
