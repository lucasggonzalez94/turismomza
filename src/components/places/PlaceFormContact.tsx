import { FC, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Input } from '@nextui-org/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Schedule from '../ui/Schedule';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store/store';
import { useForm } from 'react-hook-form';
import { createPlaceService } from '@/services/places/create-place';
import { DayConfig } from '@/interfaces/schedule';
import { editPlaceService } from '@/services/places/edit-place';
import { ErrorFeedback } from '@/interfaces/errorFeedback';
import useNavigation from '@/hooks/useNavigation';
import { IPlaceFormContact } from '@/interfaces/place-form';

interface IPropsPlaceFormContact {
  isEditing?: boolean;
  placeId?: string;
  defaultValues?: IPlaceFormContact | null;
}

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
    schedule: yup
      .array()
      .of(
        yup.object({
          day: yup.string().required(),
          open24hours: yup.boolean().required(),
          times: yup
            .array()
            .of(
              yup.object({
                from: yup.string().required(),
                to: yup.string().required(),
              }),
            )
            .required(),
        }),
      )
      .optional()
      .default(undefined),
  })
  .required();

const PlaceFormContact: FC<IPropsPlaceFormContact> = ({
  isEditing,
  placeId,
  defaultValues,
}) => {
  const { handleNavigation } = useNavigation();
  const {
    placeFormDetails,
    setPlaceFormContact,
    setErrorFeedback,
    loading,
    setLoading,
  } = useStore((state) => state);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      website: '',
      instagram: '',
      facebook: '',
      phonenumber: '',
      email: '',
      schedule: [],
    },
  });
  const pathname = usePathname();

  const notify = (message?: string) =>
    toast.error(message ?? '¡Algo salio mal! Vuelve a intentarlo más tarde', {
      position: 'top-left',
      theme: 'dark',
    });

  const handleFinish = async (data: any) => {
    const formData = new FormData();

    formData.append('title', placeFormDetails?.name || '');
    formData.append('description', placeFormDetails?.description || '');
    formData.append('category', placeFormDetails?.category || '');
    formData.append('services', JSON.stringify(placeFormDetails?.services));
    formData.append('location', placeFormDetails?.address || '');
    if (placeFormDetails?.price) {
      formData.append('price', placeFormDetails?.price.toString());
      formData.append('currencyPrice', placeFormDetails?.currency || 'ars');
    }
    if (placeFormDetails?.images) {
      placeFormDetails?.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    formData.append(
      'contactNumber',
      data.phonenumber ? `+54${data.phonenumber}` : '',
    );
    formData.append('email', data.email);
    formData.append('website', data.website);
    formData.append('instagram', data.instagram);
    formData.append('facebook', data.facebook);
    formData.append(
      'schedule',
      JSON.stringify(
        (data.schedule as DayConfig[])?.filter(
          ({ open24hours, times }) =>
            open24hours ||
            times.some(({ from, to }) => from !== '' && to !== ''),
        ),
      ),
    );

    try {
      setLoading(true);
      if (isEditing && placeId) {
        const place = await editPlaceService(formData, placeId);
        reset();
        setPlaceFormContact(null);
        handleNavigation(`/places/${place?.slug}`);
      } else {
        const place = await createPlaceService(formData);
        reset();
        setPlaceFormContact(null);
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

  const setSchedule = (schedule: DayConfig[]) => {
    setValue('schedule', schedule);
  };

  useEffect(() => {
    if (defaultValues) {
      reset({
        website: defaultValues?.website || '',
        instagram: defaultValues?.instagram || '',
        facebook: defaultValues?.facebook || '',
        phonenumber: defaultValues?.phonenumber || '',
        email: defaultValues?.email || '',
        schedule: defaultValues?.schedule || [],
      });
    } else {
      reset({
        website: '',
        instagram: '',
        facebook: '',
        phonenumber: '',
        email: '',
        schedule: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  useEffect(() => {
    return () => {
      setPlaceFormContact({
        ...defaultValues,
        ...getValues(),
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <form
        onSubmit={handleSubmit(handleFinish)}
        className="flex flex-col gap-4 items-start"
      >
        <div className="flex gap-4 w-full">
          <div className="flex flex-col gap-4">
            <Schedule onSaveSchedule={setSchedule} />
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
        <Button isDisabled={loading} type="submit" color="primary">
          Guardar y finalizar
        </Button>
      </form>
      <ToastContainer autoClose={10000} />
    </>
  );
};

export default PlaceFormContact;
