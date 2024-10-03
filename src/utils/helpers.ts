import { redirect } from 'next/navigation';

export const navigation = (path: string) => {
  redirect(path);
};
