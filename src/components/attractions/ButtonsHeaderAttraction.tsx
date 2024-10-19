'use client';

import { Button } from '@nextui-org/react';
import { IoHeartOutline, IoShareSocialOutline } from 'react-icons/io5';

const ButtonsHeaderAttraction = () => {
  return (
    <div className="flex items-center gap-2">
      <Button color="default" variant="ghost" isIconOnly onClick={() => {}}>
        <IoHeartOutline size={25} />
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
