import { FC, ReactNode } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';

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
  return (
    <Modal isOpen={isOpen} size={size} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            {onAction && (
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  onPress={onAction}
                  isDisabled={disableAction}
                  isLoading={loadingAction}
                  form={idForm}
                  type={idForm ? 'submit' : 'button'}
                >
                  {textButton}
                </Button>
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
