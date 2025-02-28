import React, { FC, useState } from 'react';
import { toast } from 'sonner';
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
  const [loading, setLoading] = useState(false);

  const handleReport = async (data: ReportFormData) => {
    try {
      setLoading(true);
      await reportReviewService(reviewId, data?.reason);
      reset();
      onOpenChange(false);
    } catch {
      toast.error('¡Algo salio mal! Vuelve a intentarlo más tarde');
    } finally {
      setLoading(false);
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
        loadingAction={loading}
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
    </>
  );
};

export default ModalReport;
