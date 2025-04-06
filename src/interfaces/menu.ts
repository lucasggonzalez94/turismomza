import { ReactElement } from 'react';

export interface IPropsMenuOption {
  id: string;
  text: string;
  icon?: ReactElement | null;
  onClick?: () => void | Promise<void>;
  divider?: boolean;
}
