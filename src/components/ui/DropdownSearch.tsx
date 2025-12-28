'use client';

import { FC, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { IoClose, IoSearch } from 'react-icons/io5';

import DropdownButton from './DropdownButton';
import { Input } from '@/components/ui/Input';
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

  const handleSearch = () => {
    setBackPath(pathname);
    router.push(`/places?search=${searchValue}`);
  };

  const clearSearch = () => {
    setSearchValue('');
    inputRef.current?.focus();
  };

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
        className="shadow-xl bg-slate-200 text-black placeholder:text-muted-foreground"
        placeholder="Buscar..."
        startContent={<IoSearch className="text-gray-700" />}
        endContent={
          searchValue ? (
            <button
              type="button"
              className="text-gray-600 hover:text-gray-800 focus-visible:outline-none"
              onClick={clearSearch}
              aria-label="Limpiar búsqueda"
            >
              <IoClose />
            </button>
          ) : null
        }
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={({ key }) => {
          if (key === 'Enter') {
            handleSearch();
          }
        }}
      />
    </DropdownButton>
  );
};

export default DropdownSearch;
