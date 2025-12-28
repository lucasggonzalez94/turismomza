'use client';

import { useNavigationStore } from '@/store/navigationStore';
import Link from 'next/link';
import React, { FC } from 'react';
import { IoChevronBack } from 'react-icons/io5';

interface IChevron {
  path?: string;
}

const Chevron: FC<IChevron> = ({ path }) => {
  const { backPath } = useNavigationStore((state) => state);

  return (
    <Link
      href={path || backPath}
      className="flex items-center gap-1 w-fit font-bold text-primary hover:transform hover:scale-110 transition-all"
    >
      <IoChevronBack />
      <span>Volver</span>
    </Link>
  );
};

export default Chevron;
