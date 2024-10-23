import { Button } from '@nextui-org/react';
import React from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const PrevButton: React.FC<ButtonProps> = ({ onClick }) => (
  <Button
    onClick={onClick}
    color="secondary"
    className="w-12 h-12 absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full"
    isIconOnly
  >
    <IoChevronBack size={20} />
  </Button>
);

export const NextButton: React.FC<ButtonProps> = ({ onClick }) => (
  <Button
    onClick={onClick}
    color="secondary"
    className="w-12 h-12 absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full"
    isIconOnly
  >
    <IoChevronForward size={20} />
  </Button>
);

interface DotButtonProps {
  selected: boolean;
  onClick: () => void;
}

export const DotButton: React.FC<DotButtonProps> = ({ selected, onClick }) => (
  <button
    className={`w-2 h-2 border-1 border-gray-700 rounded-full ${selected ? 'bg-[#E95718]' : 'bg-gray-400'} focus:outline-none`}
    onClick={onClick}
  />
);
