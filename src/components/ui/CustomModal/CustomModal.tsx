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
  children: ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  textButton: string;
  onAction: () => void;
}

const CustomModal: FC<IPropsCustomModal> = ({
  title,
  children,
  isOpen,
  onOpenChange,
  textButton,
  onAction,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button color="primary" variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" onPress={onAction}>
                {textButton}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
