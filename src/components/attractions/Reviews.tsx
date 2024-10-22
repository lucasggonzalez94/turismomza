'use client';

import { FC, useEffect, useState } from 'react';
import { Button, Textarea } from '@nextui-org/react';
import { InfiniteMovingCards } from './InfiniteMovingCards';
import Sidedrawer from '../ui/Sidedrawer/Sidedrawer';
import { Review, Like } from '@/interfaces/attraction';
import ReviewCard from './ReviewCard';
import CustomModal from '../ui/CustomModal/CustomModal';
import { Controller, useForm } from 'react-hook-form';
import StarsRating from '../ui/StarsRating/StarsRating';
import { addReviewService } from '@/services/attractions/add-review';
import { FormattedReview } from '@/interfaces/formattedReview';

interface IPropsReviews {
  reviews: Review[];
  attractionId: string;
}

interface ReviewFormData {
  rating: number;
  review: string;
}

const Reviews: FC<IPropsReviews> = ({ reviews, attractionId }) => {
  const { handleSubmit, control, reset, register } = useForm<ReviewFormData>({
    defaultValues: {
      rating: 0,
      review: '',
    },
  });

  const [openSidedrawer, setOpenSidedrawer] = useState(false);
  const [openModalAddReview, setOpenModalAddReview] = useState(false);
  const [formattedReview, setFormattedReview] = useState<FormattedReview[]>([]);

  const onSubmit = async (data: ReviewFormData) => {
    await addReviewService({
      ...data,
      attractionId,
    });
    reset();
    setOpenModalAddReview(false);
  };

  useEffect(() => {
    setFormattedReview(
      reviews?.map((review) => ({
        id: review.id,
        user: {
          id: review.user.id,
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
            <InfiniteMovingCards reviews={formattedReview} />
            <Button
              color="primary"
              variant="light"
              onClick={() => setOpenSidedrawer(true)}
            >
              Ver todas los opiniones
            </Button>
            <Button color="primary" onClick={() => setOpenModalAddReview(true)}>
              Agregar opinión
            </Button>
          </div>
        ) : (
          <div className="w-full min-h-96 flex flex-col gap-4 items-center justify-center">
            <span>Todavía no hay opiniones, sé el primero en agregar una.</span>
            <Button color="primary" onClick={() => setOpenModalAddReview(true)}>
              Agregar opinión
            </Button>
          </div>
        )}
      </div>
      <Sidedrawer
        isOpen={openSidedrawer}
        setIsOpen={setOpenSidedrawer}
        title="Opiniones"
      >
        {formattedReview?.map((review, index) => (
          <ReviewCard key={index} review={review} expandReview />
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
