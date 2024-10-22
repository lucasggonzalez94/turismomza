'use client';

import { Button } from '@nextui-org/react';
import { FC, useEffect, useState } from 'react';
import { IoHeart, IoHeartOutline, IoShareSocialOutline } from 'react-icons/io5';

interface IPropsButtonsHeaderAttraction {
  isFavoriteFromService: boolean;
}

const ButtonsHeaderAttraction: FC<IPropsButtonsHeaderAttraction> = ({
  isFavoriteFromService,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(isFavoriteFromService);
  }, [isFavoriteFromService]);

  return (
    <div className="flex items-center gap-2">
      <Button color="default" variant="ghost" isIconOnly onClick={() => {}}>
        {isFavorite ? (
          <IoHeart className="text-red-600" size={25} />
        ) : (
          <IoHeartOutline size={25} />
        )}
      </Button>
      <Button color="default" variant="ghost" isIconOnly onClick={() => {}}>
        <IoShareSocialOutline size={25} />
      </Button>
      <Button color="primary" onClick={() => {}}>
        Consultar
      </Button>
    </div>
  );
};

export default ButtonsHeaderAttraction;
