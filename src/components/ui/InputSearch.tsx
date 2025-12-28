'use client';

import React, { useState } from 'react';
import { IoClose, IoSearch } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/Input';

const InputSearch = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    router.push(`/places?search=${searchValue}`);
  };

  const clearSearch = () => {
    setSearchValue('');
  };

  return (
    <Input
      className="shadow-xl bg-slate-200 text-black placeholder:text-muted-foreground"
      placeholder="Buscar..."
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      onKeyDown={({ key }) => {
        if (key === 'Enter') {
          handleSearch();
        }
      }}
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
    />
  );
};

export default InputSearch;
