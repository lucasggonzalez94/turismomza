'use client';

import React, { useState } from 'react';
import { Input } from '@nextui-org/react';
import { IoSearch } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

const InputSearch = () => {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState('');

  return (
    <Input
      isClearable
      radius="md"
      classNames={{
        input: ['text-black', 'placeholder:text-default-900/50'],
        inputWrapper: ['shadow-xl', 'bg-slate-50/100'],
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
  );
};

export default InputSearch;
