'use client';

import { FC, ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { IoClose } from 'react-icons/io5';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface IPropsCustomModal {
  title: string;
  children?: ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  textButton: string;
  onAction?: () => void;
  disableAction?: boolean;
  loadingAction?: boolean;
  idForm?: string;
  size?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | 'full';
}

const CustomModal: FC<IPropsCustomModal> = ({
  title,
  children,
  isOpen,
  onOpenChange,
  textButton,
  onAction,
  disableAction,
  loadingAction,
  idForm,
  size = 'md',
}) => {
  const sizeClasses: Record<NonNullable<IPropsCustomModal['size']>, string> = {
    xs: 'sm:max-w-[18rem]',
    sm: 'sm:max-w-[22rem]',
    md: 'sm:max-w-[28rem]',
    lg: 'sm:max-w-[32rem]',
    xl: 'sm:max-w-[36rem]',
    '2xl': 'sm:max-w-[42rem]',
    '3xl': 'sm:max-w-[48rem]',
    '4xl': 'sm:max-w-[56rem]',
    '5xl': 'sm:max-w-[64rem]',
    full: 'sm:max-w-[90vw]',
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background p-6 shadow-xl focus:outline-none data-[state=open]:animate-scale-in',
            sizeClasses[size],
          )}
        >
          <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
          {children ? <div className="mt-4">{children}</div> : null}
          {onAction ? (
            <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close asChild>
                <Button variant="ghost">Cancelar</Button>
              </Dialog.Close>
              <Button
                onClick={onAction}
                disabled={disableAction || loadingAction}
                form={idForm}
                type={idForm ? 'submit' : 'button'}
              >
                {loadingAction ? 'Procesando...' : textButton}
              </Button>
            </div>
          ) : textButton ? (
            <Dialog.Close asChild>
              <Button className="mt-6 self-end">{textButton}</Button>
            </Dialog.Close>
          ) : null}
          <Dialog.Close
            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Cerrar"
          >
            <IoClose />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CustomModal;
