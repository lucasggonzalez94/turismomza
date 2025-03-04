'use client';

import { Input } from '@nextui-org/react';
import { IoSearch } from 'react-icons/io5';
import DropdownButton from './DropdownButton';
import { FC, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useNavigationStore } from '@/store/navigationStore';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const { setBackPath } = useNavigationStore((state) => state);

  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <DropdownButton
      icon={<IoSearch size={25} color="#fff" />}
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    >
      <Input
        ref={inputRef}
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
            setBackPath(pathname);
            router.push(`/places?search=${searchValue}`);
          }
        }}
      />
    </DropdownButton>
  );
};

export default DropdownSearch;
