'use client';

import {
  FC,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Button } from '@nextui-org/react';

interface IPropsDropdownButton {
  icon?: ReactElement;
  text?: string;
  children: ReactNode;
  position?: 'center' | 'left' | 'right';
  square?: boolean;
}

const DropdownButton: FC<IPropsDropdownButton> = ({
  icon,
  text,
  children,
  position = 'center',
  square,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [positionValue, setPositionValue] = useState('-45%');
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    switch (position) {
      case 'left':
        setPositionValue('-translate-x-[90%]');
        break;
      case 'right':
        setPositionValue('translate-x-0');
        break;
      default:
        setPositionValue('translate-x-[-45%]');
        break;
    }
  }, [position]);

  return (
    <div className="flex items-center justify-center">
      <div className="relative" ref={searchRef}>
        <Button
          isIconOnly
          variant="light"
          className={`rounded-${square ? 'md' : 'full'} z-50`}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {icon ?? text}
        </Button>

        <div
          className={`absolute top-0 left-0 transition-all duration-500 w-96 z-40 ${
            isOpen
              ? `opacity-100 transform translate-y-12 ${positionValue}`
              : `opacity-0 translate-y-0 ${positionValue}`
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default DropdownButton;
