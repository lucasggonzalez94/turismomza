import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Input } from '@nextui-org/react';
import { useStore } from '@/store/store';
import Schedule from '../ui/Schedule';

const schema = yup
  .object({
    website: yup.string().required('El campo es obligatorio.'),
    instagram: yup.string().required('El campo es obligatorio.'),
    facebook: yup.string().required('El campo es obligatorio.'),
    phonenumber: yup.string().required('El campo es obligatorio.'),
    times: yup.string().required('El campo es obligatorio.'),
  })
  .required();

const SecondStepCreation = () => {
  const { createFirstStepData } = useStore((state) => state);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleFinish = (data: any) => {
    console.log(data);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleFinish)}
        className="flex flex-col gap-4 items-start"
      >
        <div className="flex gap-4 w-full">
          <div className="flex flex-col gap-4">
            <Schedule />
            <Input
              type="text"
              label={
                <label>
                  Sitio web <span className="text-tiny">(Opcional)</span>
                </label>
              }
              labelPlacement="outside"
              className="w-1/2"
              isInvalid={!!errors.website?.message}
              errorMessage={errors.website?.message}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">https://</span>
                </div>
              }
              {...register('website')}
            />
            <Input
              type="text"
              label={
                <label>
                  Instagram <span className="text-tiny">(Opcional)</span>
                </label>
              }
              labelPlacement="outside"
              className="w-1/2"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">https://</span>
                </div>
              }
              isInvalid={!!errors.instagram?.message}
              errorMessage={errors.instagram?.message}
              {...register('instagram')}
            />
            <Input
              type="text"
              label={
                <label>
                  Facebook <span className="text-tiny">(Opcional)</span>
                </label>
              }
              labelPlacement="outside"
              className="w-1/2"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">https://</span>
                </div>
              }
              isInvalid={!!errors.facebook?.message}
              errorMessage={errors.facebook?.message}
              {...register('facebook')}
            />
            <Input
              type="text"
              label={
                <label>
                  Teléfono <span className="text-tiny">(Opcional)</span>
                </label>
              }
              labelPlacement="outside"
              className="w-1/2"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">+54</span>
                </div>
              }
              isInvalid={!!errors.phonenumber?.message}
              errorMessage={errors.phonenumber?.message}
              {...register('phonenumber')}
            />
          </div>
        </div>
        <Button type="submit" color="primary">
          Guardar y finalizar
        </Button>
      </form>
    </>
  );
};

export default SecondStepCreation;
