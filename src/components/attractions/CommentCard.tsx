import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { FiThumbsUp } from 'react-icons/fi';
import { IoEllipsisHorizontal, IoPerson, IoStar } from 'react-icons/io5';

const CommentCard = () => {
  return (
    <div className="rounded-md bg-white p-4 w-96 flex flex-col justify-between gap-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-1 items-center">
          <Button
            isIconOnly
            variant="light"
            className="rounded-full bg-white hover:bg-gray-400"
          >
            <IoPerson size={25} color="#000" className="mb-[2px]" />
          </Button>
          <div className="flex flex-col gap-1">
            <h4 className="font-bold text-md">Lucas Gonzalez</h4>
            <span className="text-tiny text-gray-400">
              Escrito el 09/07/2024
            </span>
          </div>
        </div>
        <span className="font-bold text-[#E95718] flex justify-end items-center gap-1">
          <IoStar className="mb-[2px]" /> 4.5
        </span>
      </div>
      <p className="text-sm line-clamp-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
      <div className="flex gap-3 justify-end">
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-400">2</span>
          <FiThumbsUp
            size={20}
            className="mb-1 hover:text-[#E95718] cursor-pointer"
          />
        </div>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="light" isIconOnly>
              <IoEllipsisHorizontal />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Actions comment">
            <DropdownItem key="report">Reportar</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};

export default CommentCard;
