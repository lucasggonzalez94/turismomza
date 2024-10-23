'use client';

import { FC, useEffect, useState } from 'react';
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

export interface ReviewFormData {
  rating: number;
  review: string;
}

const Reviews: FC<IPropsReviews> = ({ reviews, attractionId, creatorId }) => {
  const { handleSubmit, control, reset, register } = useForm<ReviewFormData>({
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

  const onSubmit = async (data: ReviewFormData) => {
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
        {reviews?.length ? (
          <div className="w-full flex flex-col gap-3 items-center">
            <InfiniteMovingCards
              reviews={formattedReviews}
              setReviews={setFormattedReviews}
              attractionId={attractionId}
            />
            <Button
              color="primary"
              variant="light"
              onClick={() => setOpenSidedrawer(true)}
            >
              Ver todas las opiniones
            </Button>
            {user?.id !== creatorId && (
              <Button
                color="primary"
                onClick={() => setOpenModalAddReview(true)}
              >
                Agregar opinión
              </Button>
            )}
          </div>
        ) : user?.id !== creatorId ? (
          <div className="w-full min-h-96 flex flex-col gap-4 items-center justify-center">
            <span>Todavía no hay opiniones, sé el primero en agregar una.</span>
            <Button color="primary" onClick={() => setOpenModalAddReview(true)}>
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
          <Controller
            name="rating"
            control={control}
            render={({ field: { onChange, value } }) => (
              <StarsRating onRatingChange={onChange} ratingValue={value} />
            )}
          />
          <Textarea
            label="Opinión"
            className="w-full"
            labelPlacement="outside"
            placeholder="Ingresá tu opinión"
            {...register('review')}
          />
        </div>
      </CustomModal>
    </>
  );
};

export default Reviews;
