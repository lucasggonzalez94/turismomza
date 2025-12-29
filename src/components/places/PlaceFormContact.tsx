import { FC, useEffect, useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import Schedule from '../ui/Schedule';
import { usePlaceStore } from '@/store/placeStore';
import { createPlaceService } from '@/services/places/create-place';
import { DayConfig } from '@/interfaces/schedule';
import { editPlaceService } from '@/services/places/edit-place';
import { ErrorFeedback } from '@/interfaces/errorFeedback';
import useNavigation from '@/hooks/useNavigation';
import { IPlaceFormContact } from '@/interfaces/place-form';
import { useFeedbackStore } from '@/store/feedbackStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

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
  const { placeFormDetails, setPlaceFormContact } = usePlaceStore(
    (state) => state,
  );
  const setErrorFeedback = useFeedbackStore((state) => state.setErrorFeedback);

  const initialValues = useMemo(
    () => ({
      website: '',
      instagram: '',
      facebook: '',
      phonenumber: '',
      email: '',
      schedule: [],
    }),
    [],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });

  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  // Función para preparar el FormData para enviar al servidor
  const prepareFormData = useCallback(
    (data: IPlaceFormContact) => {
      const formData = new FormData();

      formData.append('title', placeFormDetails?.name || '');
      formData.append('description', placeFormDetails?.description || '');
      formData.append(
        'category',
        placeFormDetails?.category === 'Otra'
          ? placeFormDetails?.otherCategory || ''
          : placeFormDetails?.category || '',
      );
      let allServices: string[] = [];
      if (
        placeFormDetails?.services?.includes('other') &&
        placeFormDetails?.otherServices
      ) {
        const filteredServices = placeFormDetails?.services?.filter(
          (service) => service !== 'other',
        );

        allServices = [
          ...filteredServices,
          ...placeFormDetails.otherServices
            .replace(/(\r\n|\n|\r)/gm, ',')
            .split(',')
            .map((service) => service.trim())
            .filter((service) => service.length > 0)
            .map(
              (service) =>
                service.charAt(0).toUpperCase() +
                service.slice(1).toLowerCase(),
            ),
        ];
      } else {
        allServices = placeFormDetails?.services || [];
      }

      formData.append('services', JSON.stringify(allServices));
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
      formData.append('email', data.email || '');
      formData.append('website', data.website || '');
      formData.append('instagram', data.instagram || '');
      formData.append('facebook', data.facebook || '');
      formData.append(
        'schedule',
        JSON.stringify(
          (data.schedule as DayConfig[])?.filter(
            ({ open24hours, times }) =>
              open24hours ||
              times.some(({ from, to }) => from !== '' && to !== ''),
          ) || [],
        ),
      );

      return formData;
    },
    [placeFormDetails],
  );

  const handleFinish = useCallback(
    async (data: IPlaceFormContact) => {
      try {
        setLoading(true);
        const formData = prepareFormData(data);

        let place;
        if (isEditing && placeId) {
          place = await editPlaceService(formData, placeId);
        } else {
          place = await createPlaceService(formData);
        }

        reset();
        setPlaceFormContact(null);
        handleNavigation(`/places/${place?.slug}`);
      } catch (error) {
        const err = error as ErrorFeedback;
        if (err.status === 406) {
          setErrorFeedback({
            ...err,
            pathname,
          });
          handleNavigation('/error');
        } else {
          toast.error('¡Algo salió mal! Vuelve a intentarlo más tarde');
        }
      } finally {
        setLoading(false);
      }
    },
    [
      isEditing,
      placeId,
      prepareFormData,
      reset,
      setPlaceFormContact,
      handleNavigation,
      setErrorFeedback,
      pathname,
    ],
  );

  const setSchedule = useCallback(
    (schedule: DayConfig[]) => {
      setValue('schedule', schedule);
    },
    [setValue],
  );

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
      reset(initialValues);
    }
  }, [defaultValues, initialValues, reset]);

  useEffect(() => {
    return () => {
      const currentValues = getValues();
      const hasChanges =
        JSON.stringify(currentValues) !== JSON.stringify(defaultValues);

      if (hasChanges) {
        setPlaceFormContact({ ...defaultValues, ...currentValues });
      }
    };
  }, [defaultValues, getValues, setPlaceFormContact]);

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
              label="Sitio web"
              containerClassName="w-full md:w-1/2"
              errorMessage={errors.website?.message as string | undefined}
              placeholder="https://..."
              {...register('website')}
            />

            <Input
              type="text"
              label="Instagram"
              containerClassName="w-full md:w-1/2"
              placeholder="https://..."
              errorMessage={errors.instagram?.message as string | undefined}
              {...register('instagram')}
            />

            <Input
              type="text"
              label="Facebook"
              containerClassName="w-full md:w-1/2"
              placeholder="https://..."
              errorMessage={errors.facebook?.message as string | undefined}
              {...register('facebook')}
            />

            <Input
              type="text"
              label="Email"
              placeholder="Email de contacto"
              containerClassName="w-full md:w-1/2"
              errorMessage={errors.email?.message as string | undefined}
              {...register('email')}
            />

            <Input
              type="text"
              label="Teléfono"
              containerClassName="w-full md:w-1/2"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-muted-foreground text-sm">+54</span>
                </div>
              }
              errorMessage={errors.phonenumber?.message as string | undefined}
              {...register('phonenumber')}
            />
          </div>
        </div>
        <Button disabled={loading} type="submit">
          {loading ? 'Guardando...' : 'Guardar y finalizar'}
        </Button>
      </form>
    </>
  );
};

export default PlaceFormContact;
