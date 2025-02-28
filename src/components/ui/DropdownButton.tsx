'use client';

import {
  FC,
  ReactElement,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { Button } from '@nextui-org/react';
import { IoPerson } from 'react-icons/io5';
import { usePlaceStore } from '@/store/placeStore';
import ProfilePicture from './ProfilePicture';
import { useAuthStore } from '@/store/authStore';

interface IPropsDropdownButton {
  icon?: ReactElement;
  text?: string;
  children: ReactNode;
  position?: 'center' | 'left' | 'right';
  square?: boolean;
  profile?: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const DropdownButton: FC<IPropsDropdownButton> = ({
  icon,
  text,
  children,
  position = 'center',
  square,
  profile,
  isOpen,
  onOpen,
  onClose,
}) => {
  const user = useAuthStore((state) => state.user);
  const [positionValue, setPositionValue] = useState('translate-x-[90%]');
  const [hidden, setHidden] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        searchRef.current &&
        !searchRef.current.contains(target) &&
        !target.closest('[data-dropdown-button]')
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

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

  useLayoutEffect(() => {
    setHidden(false);
  }, []);

  return (
    <div
      className="flex items-center justify-center relative"
      ref={searchRef}
      data-dropdown-button
    >
      {user && profile ? (
        <div className="h-10" onClick={onOpen}>
          <ProfilePicture changePicture={false} openPicture={false} />
        </div>
      ) : (
        <Button
          isIconOnly={!!icon || profile}
          variant="light"
          className={`rounded-${square ? 'md' : 'full'} ${profile && 'bg-white hover:bg-gray-400'}`}
          onPress={onOpen}
        >
          {profile ? (
            <IoPerson size={25} color="#000" className="mb-[2px]" />
          ) : (
            (icon ?? text)
          )}
        </Button>
      )}

      {!hidden && (
        <div
          className={`absolute top-0 left-0 transition-all duration-500 w-96 shadow-md overflow-hidden mt-2 rounded-md ${
            isOpen
              ? `opacity-100 transform translate-y-12 ${positionValue} pointer-events-auto`
              : `opacity-0 -translate-y-0 ${positionValue} pointer-events-none`
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
