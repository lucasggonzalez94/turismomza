import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Input } from '@nextui-org/react';
import { useStore } from '@/store/store';

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
  const { createFirstStepData } = useStore(
    (state) => state,
  );
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
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(handleFinish)}
        className="flex flex-col gap-4 items-start"
      >
        <div className="flex gap-4 w-full">
          <div className="flex flex-col gap-4 w-1/2">
            <Input
              type="text"
              label="Nombre"
              labelPlacement="outside"
              placeholder="Ingresá el nombre del lugar"
              className="w-1/2"
              isInvalid={!!errors.website?.message}
              errorMessage={errors.website?.message}
              {...register('website')}
            />
            <Input
              type="text"
              label="Nombre"
              labelPlacement="outside"
              placeholder="Ingresá el nombre del lugar"
              className="w-1/2"
              isInvalid={!!errors.instagram?.message}
              errorMessage={errors.instagram?.message}
              {...register('instagram')}
            />
            <Input
              type="text"
              label="Nombre"
              labelPlacement="outside"
              placeholder="Ingresá el nombre del lugar"
              className="w-1/2"
              isInvalid={!!errors.facebook?.message}
              errorMessage={errors.facebook?.message}
              {...register('facebook')}
            />
            <Input
              type="text"
              label="Nombre"
              labelPlacement="outside"
              placeholder="Ingresá el nombre del lugar"
              className="w-1/2"
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
