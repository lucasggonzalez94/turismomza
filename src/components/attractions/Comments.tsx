'use client';

import { FC, useEffect, useState } from 'react';
import { Button } from '@nextui-org/react';
import { InfiniteMovingCards } from './InfiniteMovingCards';
import Sidedrawer from '../ui/Sidedrawer/Sidedrawer';
import { Comment, Like } from '@/interfaces/attraction';
import CommentCard from './CommentCard';

interface IPropsComments {
  comments: Comment[];
}

const Comments: FC<IPropsComments> = ({ comments }) => {
  const [openSidedrawer, setOpenSidedrawer] = useState(true);
  const [formattedComments, setFormattedComments] = useState<
    {
      userName: string;
      dateAdded: string;
      content: string;
      rating: number;
      likes: Like[];
    }[]
  >([]);

  useEffect(() => {
    setFormattedComments(
      comments?.map((comment) => ({
        userName: comment.user.name,
        dateAdded: comment.creation_date.toString(),
        content: comment.content,
        rating: comment.rating,
        likes: comment.likes,
      })),
    );
  }, [comments]);

  return (
    <>
      <div className="w-full flex flex-col gap-2">
        <h3 className="font-bold ml-1">Comentarios</h3>
        {comments?.length ? (
          <div className="w-full flex flex-col gap-3 items-center">
            <InfiniteMovingCards speed="normal" />
            <Button
              color="primary"
              variant="light"
              onClick={() => setOpenSidedrawer(true)}
            >
              Ver todos los comentarios
            </Button>
            <Button color="primary">Agregar comentario</Button>
          </div>
        ) : (
          <div className="w-full min-h-96 flex flex-col gap-4 items-center justify-center">
            <span>Todavía no hay comentarios, sé el primero en opinar.</span>
            <Button color="primary">Agregar comentario</Button>
          </div>
        )}
      </div>
      <Sidedrawer
        isOpen={openSidedrawer}
        setIsOpen={setOpenSidedrawer}
        title="Comentarios"
      >
        {formattedComments?.map((comment, index) => (
          <CommentCard key={index} />
        ))}
      </Sidedrawer>
    </>
  );
};

export default Comments;
