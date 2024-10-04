import { Button } from '@nextui-org/react';
import Image from 'next/image';

import { IoStar } from 'react-icons/io5';
const AttractionCard = () => {
  return (
    <div className="flex flex-col rounded-md w-80 bg-white overflow-hidden border border-gray-300">
      <Image
        src="https://images.unsplash.com/photo-1668573432550-3844a6dc9be8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="imagen"
        width={300}
        height={200}
        className="object-cover w-full h-44"
      />
      <div className="flex flex-col gap-2 p-3">
        <div className="flex flex-col">
          <h3 className="font-bold line-clamp-1">Parque Gral. San Martin</h3>
          <span className="text-tiny text-gray-400">Aire libre</span>
        </div>
        <hr />
        <div className="flex justify-between items-center">
          <Button color="primary">Ver más</Button>
          <div className="flex flex-col text-end">
            <span className="font-bold text-[#E95718] flex justify-end items-center gap-1">
              <IoStar className="mb-[2px]" /> 4.8
            </span>
            <span className="text-tiny text-gray-400">
              {'(1.234 opiniones)'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttractionCard;
