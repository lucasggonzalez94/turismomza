import { ReactElement } from 'react';

export interface IPropsMenuOption {
  id: string;
  text: string;
  icon?: ReactElement;
  onClick?: () => void;
  divider?: boolean;
}
