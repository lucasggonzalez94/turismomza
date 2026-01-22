'use client';

import { FC, ReactElement, useCallback, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

import DropdownButton from './DropdownButton';
import { useNavigationStore } from '@/store/navigationStore';
import { IPropsMenuOption } from '@/interfaces/menu';
import { cn } from '@/lib/utils';

interface IPropsDropdownProfile {
  titleMenu: string;
  icon: ReactElement;
  options: IPropsMenuOption[];
}

const DropdownMenu: FC<IPropsDropdownProfile> = ({
  titleMenu,
  icon,
  options,
}) => {
  const pathname = usePathname();
  const setBackPath = useNavigationStore((state) => state.setBackPath);

  const [isOpen, setisOpen] = useState(false);

  const createNavigationOption = useCallback(
    (
      id: string,
      text: string,
      action?: () => void | Promise<void>,
      hasDivider?: boolean,
      icon?: ReactElement | null,
      danger?: boolean,
    ) => ({
      id,
      text,
      onClick: action,
      divider: hasDivider,
      icon,
      danger,
    }),
    [],
  );

  const menuOptions = useMemo(() => {
    return options.map((option) =>
      createNavigationOption(
        option.id,
        option.text,
        option.onClick,
        option.divider,
        option.icon,
        option.danger,
      ),
    );
  }, [createNavigationOption, options]);

  const handleOptionClick = useCallback(
    (option: IPropsMenuOption) => {
      if (option?.onClick) {
        option.onClick();
        setisOpen(!isOpen);
        setBackPath(pathname);
      }
    },
    [isOpen, setisOpen, setBackPath, pathname],
  );

  return (
    <>
      <DropdownButton
        position="left"
        icon={icon}
        isOpen={isOpen}
        onOpen={() => setisOpen(true)}
        onClose={() => setisOpen(false)}
      >
        <div className="mt-2 bg-gray-100 rounded-md shadow-ms overflow-hidden">
          <div className="p-4 bg-gray-100 border-b border-gray-200 flex items-center">
            <h3 className="text-md font-semibold text-gray-800">
              {titleMenu || 'Menú'}
            </h3>
          </div>
          <div>
            {menuOptions.map((option) => (
              <div
                key={option.id}
                className={`cursor-pointer p-4 hover:bg-gray-200 transition duration-150 ease-in-out ${option.divider ? 'border-b border-gray-200' : ''}`}
                onClick={() => handleOptionClick(option)}
              >
                <div className="flex items-center cursor-pointer">
                  <div>
                    <p
                      className={cn(
                        'text-sm font-medium flex gap-3 items-center',
                        option.danger ? 'text-red-600' : 'text-gray-900',
                      )}
                    >
                      <span>{option.text}</span>
                      {option?.icon && option?.icon}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DropdownButton>
    </>
  );
};

export default DropdownMenu;
