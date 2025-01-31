'use client';

import { FC, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Textarea } from '@nextui-org/react';
import { InfiniteMovingCards } from './InfiniteMovingCards';
import Sidedrawer from '../ui/Sidedrawer';
import { Review } from '@/interfaces/attraction';
import ReviewCard from './ReviewCard';
import CustomModal from '../ui/CustomModal';
import { Controller, useForm } from 'react-hook-form';
import StarsRating from '../ui/StarsRating';
import { addReviewService } from '@/services/attractions/add-review';
import { FormattedReview } from '@/interfaces/formattedReview';
import { useStore } from '@/store/store';

interface IPropsReviews {
  reviews: Review[];
  creatorId?: string;
  attractionId: string;
}

const schema = yup
  .object({
    rating: yup
      .number()
      .min(1, 'La puntuación debe ser igual o mayor a 1')
      .required('La puntuación es obligatoria.'),
    review: yup.string().required('El campo es obligatorio.'),
  })
  .required();

const Reviews: FC<IPropsReviews> = ({ reviews, attractionId, creatorId }) => {
  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      rating: 0,
      review: '',
    },
  });

  const [openSidedrawer, setOpenSidedrawer] = useState(false);
  const [openModalAddReview, setOpenModalAddReview] = useState(false);
  const [formattedReviews, setFormattedReviews] = useState<FormattedReview[]>(
    [],
  );

  const user = useStore((state) => state.user);

  const onSubmit = async (data: any) => {
    const newReview = await addReviewService({
      ...data,
      attractionId,
    });

    setFormattedReviews((prevReviews) => [
      ...prevReviews,
      {
        id: newReview.id,
        user: {
          id: newReview.user.id,
          name: newReview.user.name,
        },
        dateAdded: newReview.creation_date.toString(),
        content: newReview.content,
        rating: newReview.rating,
        likes: newReview.likes,
      },
    ]);

    reset();
    setOpenModalAddReview(false);
  };

  useEffect(() => {
    setFormattedReviews(
      reviews?.map((review) => ({
        id: review?.id,
        user: {
          id: review?.user?.id,
          name: review.user.name,
        },
        dateAdded: review.creation_date.toString(),
        content: review.content,
        rating: review.rating,
        likes: review.likes,
      })),
    );
  }, [reviews]);

  return (
    <>
      <div className="w-full flex flex-col gap-2">
        <h3 className="font-bold ml-1">Opiniones</h3>
        {formattedReviews?.length ? (
          <div className="w-full flex flex-col gap-3 items-center">
            <div className="w-full hidden md:block">
              <InfiniteMovingCards
                reviews={formattedReviews}
                setReviews={setFormattedReviews}
                attractionId={attractionId}
              />
            </div>
            <Button
              color="primary"
              variant="light"
              onPress={() => setOpenSidedrawer(true)}
            >
              Ver todas las opiniones
            </Button>
            {user?.id !== creatorId ? (
              <Button
                color="primary"
                onPress={() => setOpenModalAddReview(true)}
              >
                Agregar opinión
              </Button>
            ) : null}
          </div>
        ) : user?.id !== creatorId ? (
          <div className="w-full min-h-96 flex flex-col gap-4 items-center justify-center">
            <span>Todavía no hay opiniones, sé el primero en agregar una.</span>
            <Button color="primary" onPress={() => setOpenModalAddReview(true)}>
              Agregar opinión
            </Button>
          </div>
        ) : (
          <div className="w-full min-h-96 flex items-center justify-center">
            <span>
              Todavía no hay opiniones, cuando otros usuarios opinen sobre tu
              publicación vas a poder verlas en esta sección.
            </span>
          </div>
        )}
      </div>
      <Sidedrawer
        isOpen={openSidedrawer}
        setIsOpen={setOpenSidedrawer}
        title="Opiniones"
      >
        {formattedReviews?.map((review, index) => (
          <ReviewCard
            key={index}
            review={review}
            expandReview
            reviews={formattedReviews}
            setReviews={setFormattedReviews}
            attractionId={attractionId}
          />
        ))}
      </Sidedrawer>
      <CustomModal
        title="Agregar opinión"
        isOpen={openModalAddReview}
        onOpenChange={setOpenModalAddReview}
        textButton="Opinar"
        onAction={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-7 items-center">
          <div className="flex flex-col gap-1 w-full justify-center items-center">
            <Controller
              name="rating"
              control={control}
              render={({ field: { onChange, value } }) => (
                <StarsRating onRatingChange={onChange} ratingValue={value} />
              )}
            />
            <span className="text-sm text-red-500">
              {errors.rating?.message}
            </span>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <Textarea
              label="Opinión"
              className="w-full"
              labelPlacement="outside"
              placeholder="Ingresá tu opinión"
              {...register('review')}
            />
            <span className="text-sm text-red-500">
              {errors.review?.message}
            </span>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default Reviews;
