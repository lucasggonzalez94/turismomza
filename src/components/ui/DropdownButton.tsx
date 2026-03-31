'use client';

import {
  ReactElement,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  memo,
} from 'react';

import { IoPerson } from 'react-icons/io5';
import ProfilePicture from './ProfilePicture';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type DropdownPosition = 'center' | 'left' | 'right';

const POSITION_MAP: Record<DropdownPosition, string> = {
  left: '-translate-x-[90%]',
  right: 'translate-x-0',
  center: 'translate-x-[-45%]',
};

interface IPropsDropdownButton extends React.HTMLAttributes<HTMLDivElement> {
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

const DropdownButtonComponent = (
  {
    icon,
    text,
    children,
    position = 'center',
    square,
    profile,
    isOpen,
    onOpen,
    onClose,
    className,
    ...rest
  }: IPropsDropdownButton,
  forwardedRef: React.Ref<HTMLDivElement | null>,
) => {
  const user = useAuthStore((state) => state.user);
  const [positionValue, setPositionValue] = useState(POSITION_MAP.center);
  const [hidden, setHidden] = useState(true);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(forwardedRef, () => dropdownRef.current, []);

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
        size={!!icon || profile ? 'icon' : 'default'}
        variant="ghost"
        className={cn(
          'text-white',
          square ? 'rounded-md' : 'rounded-full',
          profile && 'bg-white text-black hover:bg-gray-200',
        )}
        onClick={onOpen}
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
      className={cn('flex items-center justify-center relative', className)}
      ref={dropdownRef}
      data-dropdown-button
      {...rest}
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

DropdownButtonComponent.displayName = 'DropdownButton';

export default memo(forwardRef(DropdownButtonComponent));
