'use client';

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Textarea,
} from '@nextui-org/react';
import { FC, useEffect, useState } from 'react';
import { PiThumbsUp, PiThumbsUpFill } from 'react-icons/pi';
import { IoEllipsisHorizontal, IoPerson, IoStar } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import { formatDate } from '../../utils/helpers';
import { FormattedReview } from '@/interfaces/formattedReview';
import { likeDislikeReviewService } from '@/services/attractions/like-dislike-review';
import { useStore } from '@/store/store';
import { deleteReviewService } from '@/services/attractions/delete-review';
import CustomModal from '../ui/CustomModal';
import { Controller, useForm } from 'react-hook-form';
import StarsRating from '../ui/StarsRating';
import { ReviewFormData } from './Reviews';
import { editReviewService } from '@/services/attractions/edit-review';
import ModalReport from './ModalReport';

interface IPropsReviewCard {
  review: FormattedReview;
  expandReview?: boolean;
  reviews: FormattedReview[];
  setReviews: (reviews: FormattedReview[]) => void;
  attractionId: string;
}

const ReviewCard: FC<IPropsReviewCard> = ({
  review,
  expandReview,
  reviews,
  setReviews,
  attractionId,
}) => {
  const { handleSubmit, control, reset, register } = useForm<ReviewFormData>({
    defaultValues: {
      rating: review?.rating,
      review: review?.content,
    },
  });

  const user = useStore((state) => state.user);

  const [hideOptionsByUser, setHideOptionsByUser] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openEditReview, setOpenEditReview] = useState(false);
  const [openReportReview, setOpenReportReview] = useState(false);
  const [liked, setLiked] = useState(false);

  const notify = (message?: string) =>
    toast.error(message ?? '¡Algo salio mal! Vuelve a intentarlo más tarde', {
      position: 'bottom-right',
      theme: 'dark',
    });

  const handleLike = async (reviewId: string) => {
    try {
      await likeDislikeReviewService(reviewId);
      setLiked((prev) => !prev);
    } catch {
      notify();
    }
  };

  const handleEdit = async (data: ReviewFormData) => {
    const editedReview = await editReviewService(review?.id, {
      ...data,
      attractionId,
    });

    const pushEditedReview = reviews?.map((review) => {
      if (review?.id === editedReview?.id) {
        return {
          id: editedReview?.id,
          user: {
            id: editedReview?.user?.id,
            name: editedReview.user.name,
          },
          dateAdded: editedReview.creation_date.toString(),
          content: editedReview.content,
          rating: editedReview.rating,
          likes: editedReview.likes,
        };
      }
      return review;
    });

    setReviews(pushEditedReview);

    reset();
    setOpenEditReview(false);
  };

  const handleDelete = async (reviewId: string) => {
    try {
      await deleteReviewService(reviewId);
      const newReviews = reviews?.filter((review) => review?.id !== reviewId);
      setReviews(newReviews);
      setOpenConfirmDelete(false);
    } catch {
      notify();
    }
  };

  useEffect(() => {
    setLiked(review.likes.some((like) => like?.user?.id === user?.id));
  }, [review, user?.id]);

  useEffect(() => {
    setHideOptionsByUser(review?.user?.id !== user?.id);
  }, [review?.user?.id, user?.id]);

  return (
    <>
      <div
        className={`${expandReview ? 'border-b border-gray-300' : 'rounded-md bg-white'} p-4 w-96 min-h-60 flex flex-col justify-between gap-4`}
      >
        <div className="flex justify-between items-center">
          <div className="flex gap-1 items-center">
            <Button
              isIconOnly
              variant="light"
              className="rounded-full bg-white hover:bg-gray-400"
            >
              <IoPerson size={25} color="#000" className="mb-[2px]" />
            </Button>
            <div className="flex flex-col gap-1">
              <h4 className="font-bold text-md">{review.user?.name}</h4>
              <span className="text-tiny text-gray-400">
                Escrita el {formatDate(review.dateAdded)}
              </span>
            </div>
          </div>
          <span className="font-bold text-[#E95718] flex justify-end items-center gap-1">
            <IoStar className="mb-[2px]" /> <span>{review.rating}</span>
          </span>
        </div>
        <p className={`text-sm ${expandReview ? '' : 'line-clamp-4'}`}>
          {review.content}
        </p>
        <div className="flex gap-3 justify-end">
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-400">{review.likes.length}</span>
            {liked ? (
              <PiThumbsUpFill
                size={23}
                className="mb-[2px] text-[#E95718] cursor-pointer"
                onClick={() => handleLike(review.id)}
              />
            ) : (
              <PiThumbsUp
                size={23}
                className="mb-[2px] hover:text-[#E95718] cursor-pointer"
                onClick={() => handleLike(review.id)}
              />
            )}
          </div>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="light" isIconOnly>
                <IoEllipsisHorizontal />
              </Button>
            </DropdownTrigger>
            {hideOptionsByUser ? (
              <DropdownMenu aria-label="Actions review">
                <DropdownItem
                  key="report"
                  onClick={() => setOpenReportReview(true)}
                >
                  Reportar
                </DropdownItem>
              </DropdownMenu>
            ) : (
              <DropdownMenu aria-label="Actions review">
                <DropdownItem
                  key="edit"
                  onClick={() => setOpenEditReview(true)}
                >
                  Editar
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  onClick={() => setOpenConfirmDelete(true)}
                >
                  Eliminar
                </DropdownItem>
                <DropdownItem
                  key="report"
                  onClick={() => setOpenReportReview(true)}
                >
                  Reportar
                </DropdownItem>
              </DropdownMenu>
            )}
          </Dropdown>
        </div>
      </div>
      <CustomModal
        title="¿Estás seguro?"
        isOpen={openConfirmDelete}
        onOpenChange={setOpenConfirmDelete}
        textButton="Eliminar"
        onAction={() => handleDelete(review?.id)}
      >
        <p>Esta acción es irreversible.</p>
      </CustomModal>
      <CustomModal
        title="Editar opinión"
        isOpen={openEditReview}
        onOpenChange={setOpenEditReview}
        textButton="Guardar"
        onAction={handleSubmit(handleEdit)}
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
      <ModalReport
        reviewId={review?.id}
        isOpen={openReportReview}
        onOpenChange={setOpenReportReview}
      />
      <ToastContainer autoClose={10000} />
    </>
  );
};

export default ReviewCard;
