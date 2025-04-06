'use client';

import {
  FC,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  memo,
} from 'react';

import { Button } from '@nextui-org/react';
import { IoPerson } from 'react-icons/io5';
import ProfilePicture from './ProfilePicture';
import { useAuthStore } from '@/store/authStore';

type DropdownPosition = 'center' | 'left' | 'right';

const POSITION_MAP: Record<DropdownPosition, string> = {
  left: '-translate-x-[90%]',
  right: 'translate-x-0',
  center: 'translate-x-[-45%]',
};

interface IPropsDropdownButton {
  icon?: ReactElement;
  text?: string;
  children: ReactNode;
  position?: DropdownPosition;
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
  const [positionValue, setPositionValue] = useState(POSITION_MAP.center);
  const [hidden, setHidden] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        !target.closest('[data-dropdown-button]')
      ) {
        onClose();
      }
    },
    [onClose, dropdownRef],
  );

  // Agregar y remover event listener para clics fuera del dropdown
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  // Actualizar posición cuando cambia la prop position
  useEffect(() => {
    setPositionValue(POSITION_MAP[position] || POSITION_MAP.center);
  }, [position]);

  // Mostrar el dropdown después de que el componente se monte
  useLayoutEffect(() => {
    setHidden(false);
  }, []);

  // Renderizar el botón de perfil o el botón estándar
  const renderButton = useCallback(() => {
    if (user?.profilePicture && profile) {
      return (
        <div
          className="h-10"
          onClick={onOpen}
          role="button"
          aria-label="Abrir menú de perfil"
          tabIndex={0}
        >
          <ProfilePicture changePicture={false} openPicture={false} />
        </div>
      );
    }

    return (
      <Button
        isIconOnly={!!icon || profile}
        variant="light"
        className={`rounded-${square ? 'md' : 'full'} ${profile && 'bg-white hover:bg-gray-400'}`}
        onPress={onOpen}
        aria-label={text || (profile ? 'Abrir menú de perfil' : 'Abrir menú')}
      >
        {profile ? (
          <IoPerson size={25} color="#000" className="mb-[2px]" />
        ) : (
          (icon ?? text)
        )}
      </Button>
    );
  }, [user?.profilePicture, profile, icon, text, square, onOpen]);

  return (
    <div
      className="flex items-center justify-center relative"
      ref={dropdownRef}
      data-dropdown-button
    >
      {renderButton()}

      {!hidden && (
        <div
          className={`absolute top-0 left-0 transition-all duration-500 w-96 shadow-md overflow-hidden mt-2 rounded-md ${
            isOpen
              ? `opacity-100 transform translate-y-12 ${positionValue} pointer-events-auto`
              : `opacity-0 -translate-y-0 ${positionValue} pointer-events-none`
          }`}
          aria-hidden={!isOpen}
          role="menu"
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default memo(DropdownButton);
