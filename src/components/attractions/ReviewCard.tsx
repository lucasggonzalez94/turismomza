'use client';

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { FC, useEffect, useState } from 'react';
import { PiThumbsUp, PiThumbsUpFill } from 'react-icons/pi';
import { IoEllipsisHorizontal, IoPerson, IoStar } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import { formatDate } from '../../utils/helpers';
import { FormattedReview } from '@/interfaces/formattedReview';
import { likeDislikeReviewService } from '@/services/attractions/like-dislike-review';
import { useStore } from '@/store/store';

interface IPropsReviewCard {
  review: FormattedReview;
  expandReview?: boolean;
}

const ReviewCard: FC<IPropsReviewCard> = ({ review, expandReview }) => {
  const user = useStore((state) => state.user);
  const [hideOptionsByUser, setHideOptionsByUser] = useState(false);

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

  useEffect(() => {
    setLiked(review.likes.some((like) => like?.user?.id === user?.id));
  }, [review, user?.id]);

  useEffect(() => {
    setHideOptionsByUser(review?.user?.id === user?.id);
  }, [review?.user?.id, user?.id]);

  return (
    <>
      <div
        className={`${expandReview ? 'border-b border-gray-300' : 'rounded-md bg-white'} p-4 w-96 h-60 flex flex-col justify-between gap-4`}
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
            {!hideOptionsByUser ? (
              <DropdownMenu aria-label="Actions review">
                <DropdownItem key="report">Reportar</DropdownItem>
              </DropdownMenu>
            ) : (
              <DropdownMenu aria-label="Actions review">
                <DropdownItem key="edit">Editar</DropdownItem>
                <DropdownItem key="delete">Eliminar</DropdownItem>
                <DropdownItem key="report">Reportar</DropdownItem>
              </DropdownMenu>
            )}
          </Dropdown>
        </div>
      </div>
      <ToastContainer autoClose={10000} />
    </>
  );
};

export default ReviewCard;
