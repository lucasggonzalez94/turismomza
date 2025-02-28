import React, { FC } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import CustomModal from '../ui/CustomModal';
import { Textarea } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import { reportReviewService } from '@/services/places/report-review';

interface ReportFormData {
  reason: string;
}

interface IPropsModalReport {
  reviewId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ModalReport: FC<IPropsModalReport> = ({
  reviewId,
  isOpen,
  onOpenChange,
}) => {
  const { handleSubmit, reset, register } = useForm<ReportFormData>({
    mode: 'onChange',
    defaultValues: {
      reason: '',
    },
  });

  const notify = (message?: string) =>
    toast.error(message ?? '¡Algo salio mal! Vuelve a intentarlo más tarde', {
      position: 'bottom-right',
      theme: 'dark',
    });

  const handleReport = async (data: ReportFormData) => {
    try {
      await reportReviewService(reviewId, data?.reason);
      reset();
      onOpenChange(false);
    } catch {
      notify();
    }
  };

  return (
    <>
      <CustomModal
        title="Reportar opinión"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        textButton="Enviar"
        onAction={handleSubmit(handleReport)}
      >
        <div className="flex flex-col gap-7 items-center">
          <Textarea
            label="Razón del reporte"
            className="w-full"
            labelPlacement="outside"
            placeholder="Ingresá la razón"
            {...register('reason')}
          />
        </div>
      </CustomModal>
      <ToastContainer autoClose={10000} />
    </>
  );
};

export default ModalReport;
