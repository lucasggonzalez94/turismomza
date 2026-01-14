import { Button } from '@/components/ui/Button';
import React from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const PrevButton: React.FC<ButtonProps> = ({ onClick, disabled }) => (
  <Button
    type="button"
    variant="secondary"
    size="icon"
    className="absolute left-4 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-white/90 text-black shadow hover:bg-white"
    onClick={onClick}
    disabled={disabled}
    aria-label="Imagen anterior"
  >
    <IoChevronBack size={20} />
  </Button>
);

export const NextButton: React.FC<ButtonProps> = ({ onClick, disabled }) => (
  <Button
    type="button"
    variant="secondary"
    size="icon"
    className="absolute right-4 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-white/90 text-black shadow hover:bg-white"
    onClick={onClick}
    disabled={disabled}
    aria-label="Imagen siguiente"
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
    type="button"
    className={`h-2 w-2 rounded-full border border-gray-700 ${selected ? 'bg-trinidad-600' : 'bg-gray-400'} focus:outline-none`}
    onClick={onClick}
    aria-label={selected ? 'Slide actual' : 'Ir al slide'}
  />
);
