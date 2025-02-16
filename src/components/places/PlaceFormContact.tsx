import { FC, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Input } from '@nextui-org/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Schedule from '../ui/Schedule';
import { WEEKDAYS } from '@/utils/constants';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store/store';
import { useForm } from 'react-hook-form';
import { createPlaceService } from '@/services/places/create-place';
import { DayConfig } from '@/interfaces/schedule';
import { editPlaceService } from '@/services/places/edit-place';
import { ErrorFeedback } from '@/interfaces/errorFeedback';
import useNavigation from '@/hooks/useNavigation';

interface IPropsPlaceFormContact {
  isEditing?: boolean;
  placeId?: string;
  slug?: string;
}

const dayConfigSchema = yup.object({
  open24hours: yup.boolean(),
  times: yup.array().of(
    yup.object({
      from: yup.string(),
      to: yup.string(),
    }),
  ),
});

const configSchema = yup
  .object()
  .shape(Object.fromEntries(WEEKDAYS.map((day) => [day, dayConfigSchema])))
  .nullable();

const schema = yup
  .object({
    website: yup.string().optional(),
    instagram: yup.string().optional(),
    facebook: yup.string().optional(),
    phonenumber: yup.string().optional(),
    email: yup
      .string()
      .optional()
      .test(
        'is-valid-email',
        'Debe ingresar un correo electrónico válido.',
        (value) => {
          if (!value) return true;
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
        },
      ),
    schedule: configSchema,
  })
  .required();

const PlaceFormContact: FC<IPropsPlaceFormContact> = ({
  isEditing,
  placeId,
}) => {
  const { handleNavigation } = useNavigation();
  const { placeFormData, setPlaceFormData, setErrorFeedback } =
    useStore((state) => state);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      website: placeFormData?.website || '',
      instagram: placeFormData?.instagram || '',
      facebook: placeFormData?.facebook || '',
      phonenumber: placeFormData?.phonenumber || '',
      email: placeFormData?.email || '',
      schedule: placeFormData?.schedule,
    },
  });
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);

  const notify = (message?: string) =>
    toast.error(message ?? '¡Algo salio mal! Vuelve a intentarlo más tarde', {
      position: 'top-left',
      theme: 'dark',
    });

  const handleFinish = async (data: any) => {
    const formData = new FormData();

    formData.append('title', placeFormData?.name || '');
    formData.append('description', placeFormData?.description || '');
    formData.append('category', placeFormData?.category || '');
    formData.append('services', JSON.stringify(placeFormData?.services));
    formData.append('location', placeFormData?.address || '');
    if (placeFormData?.price) {
      formData.append('price', placeFormData?.price.toString());
      formData.append('currencyPrice', placeFormData?.currency || 'ars');
    }
    if (placeFormData?.images) {
      placeFormData?.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    formData.append(
      'contactNumber',
      data.phonenumber ? `+54${data.phonenumber}` : '',
    );
    formData.append('email', data.email);
    formData.append('webSite', data.website);
    formData.append('instagram', data.instagram);
    formData.append('facebook', data.facebook);
    formData.append('schedule', JSON.stringify(data.schedule));

    try {
      setLoading(true);
      if (isEditing && placeId) {
        const place = await editPlaceService(formData, placeId);
        reset();
        setPlaceFormData(null);
        handleNavigation(`/places/${place?.slug}`);
      } else {
        const place = await createPlaceService(formData);
        reset();
        setPlaceFormData(null);
        handleNavigation(`/places/${place?.slug}`);
      }
    } catch (error) {
      const err = error as ErrorFeedback;
      if (err.status === 406) {
        setErrorFeedback({
          ...err,
          pathname,
        });
        handleNavigation('/error');
      } else {
        notify();
      }
    } finally {
      setLoading(false);
    }
  };

  const setSchedule = (schedule: Record<string, DayConfig>) => {
    setValue('schedule', schedule);
  };

  useEffect(() => {
    return () => {
      const dataForm = getValues();
      setPlaceFormData({
        ...placeFormData,
        ...dataForm,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (placeFormData) {
      reset(placeFormData);
    }
  }, [placeFormData, reset]);

  return (
    <>
      <form
        onSubmit={handleSubmit(handleFinish)}
        className="flex flex-col gap-4 items-start"
      >
        <div className="flex gap-4 w-full">
          <div className="flex flex-col gap-4">
            <Schedule
              onSaveSchedule={setSchedule}
              defaultValue={
                placeFormData?.schedule
                  ? Object.entries(placeFormData.schedule).reduce(
                      (acc, [day, config]) => ({
                        ...acc,
                        [day]: {
                          open24hours: config.open24hours ?? false,
                          times: (config.times ?? [{ from: '', to: '' }]).map(
                            (time) => ({
                              from: time.from || '',
                              to: time.to || '',
                            }),
                          ),
                        },
                      }),
                      {} as Record<string, DayConfig>,
                    )
                  : undefined
              }
            />
            <Input
              type="text"
              label={
                <label>
                  Sitio web <span className="text-tiny">(Opcional)</span>
                </label>
              }
              labelPlacement="outside"
              variant="faded"
              className="w-full md:w-1/2"
              isInvalid={!!errors.website?.message}
              errorMessage={errors.website?.message}
              placeholder="https://..."
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
              variant="faded"
              className="w-full md:w-1/2"
              placeholder="https://..."
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
              variant="faded"
              className="w-full md:w-1/2"
              placeholder="https://..."
              isInvalid={!!errors.facebook?.message}
              errorMessage={errors.facebook?.message}
              {...register('facebook')}
            />
            <Input
              type="text"
              label={
                <label>
                  Email <span className="text-tiny">(Opcional)</span>
                </label>
              }
              labelPlacement="outside"
              variant="faded"
              placeholder="Email de contacto"
              className="w-full md:w-1/2"
              isInvalid={!!errors.email?.message}
              errorMessage={errors.email?.message}
              {...register('email')}
            />
            <Input
              type="text"
              label={
                <label>
                  Teléfono <span className="text-tiny">(Opcional)</span>
                </label>
              }
              labelPlacement="outside"
              variant="faded"
              className="w-full md:w-1/2"
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
        <Button isLoading={loading} type="submit" color="primary">
          Guardar y finalizar
        </Button>
      </form>
      <ToastContainer autoClose={10000} />
    </>
  );
};

export default PlaceFormContact;
