import React from 'react';

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const PrevButton: React.FC<ButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
  >
    Prev
  </button>
);

export const NextButton: React.FC<ButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
  >
    Next
  </button>
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
