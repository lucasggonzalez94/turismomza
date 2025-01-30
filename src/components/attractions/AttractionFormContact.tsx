import { FC, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Input } from '@nextui-org/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Schedule from '../ui/Schedule';
import { WEEKDAYS } from '@/utils/constants';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store/store';
import { useForm } from 'react-hook-form';
import { createAttractionService } from '@/services/attractions/create-attraction';
import { DayConfig } from '@/interfaces/schedule';
import { editAttractionService } from '@/services/attractions/edit-attraction';
import { ErrorFeedback } from '@/interfaces/errorFeedback';

interface IPropsAttractionFormContact {
  isEditing?: boolean;
  attractionId?: string;
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
  .shape(Object.fromEntries(WEEKDAYS.map((day) => [day, dayConfigSchema])));

const schema = yup
  .object({
    website: yup.string(),
    instagram: yup.string(),
    facebook: yup.string(),
    phonenumber: yup.string(),
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

const AttractionFormContact: FC<IPropsAttractionFormContact> = ({
  isEditing,
  attractionId,
}) => {
  const router = useRouter();
  const { attractionFormData, setAttractionFormData, setErrorFeedback } =
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
      website: attractionFormData?.website,
      instagram: attractionFormData?.instagram,
      facebook: attractionFormData?.facebook,
      phonenumber: attractionFormData?.phonenumber,
      email: attractionFormData?.email,
      schedule:
        attractionFormData?.schedule ||
        Object.fromEntries(
          WEEKDAYS.map((day) => [
            day,
            {
              open24hours: false,
              times: [],
            },
          ]),
        ),
    },
  });
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const notify = (message?: string) =>
    toast.error(message ?? '¡Algo salio mal! Vuelve a intentarlo más tarde', {
      position: 'top-left',
      theme: 'dark',
    });

  const handleFinish = async (data: any) => {
    const formData = new FormData();

    formData.append('title', attractionFormData?.name || '');
    formData.append('description', attractionFormData?.description || '');
    formData.append('category', attractionFormData?.category || '');
    formData.append('services', JSON.stringify(attractionFormData?.services));
    formData.append('location', attractionFormData?.address || '');
    if (attractionFormData?.price) {
      formData.append('price', attractionFormData?.price.toString());
      formData.append('currencyPrice', attractionFormData?.currency || 'ars');
    }
    if (attractionFormData?.images) {
      attractionFormData?.images.forEach((image) => {
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
      if (isEditing && attractionId) {
        const attraction = await editAttractionService(formData, attractionId);
        reset();
        handleNavigation(`/attractions/${attraction?.slug}`);
      } else {
        const attraction = await createAttractionService(formData);
        reset();
        handleNavigation(`/attractions/${attraction?.slug}`);
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
      setAttractionFormData({
        ...attractionFormData,
        ...dataForm,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (attractionFormData) {
      reset(attractionFormData);
    }
  }, [attractionFormData, reset]);

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
                attractionFormData?.schedule
                  ? Object.entries(attractionFormData.schedule).reduce(
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

export default AttractionFormContact;
