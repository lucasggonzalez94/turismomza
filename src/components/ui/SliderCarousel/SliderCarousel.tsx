'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { DotButton, PrevButton, NextButton } from './CarouselButtons';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';

interface IPropsSliderCarousel {
  images: string[];
  initialIndex?: number;
  showPrevNextButtons?: boolean;
  showDots?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  fullscreen?: boolean;
  profilePicture?: boolean;
  onClose?: () => void;
}

const SliderCarousel: React.FC<IPropsSliderCarousel> = ({
  images,
  initialIndex = 0,
  showPrevNextButtons = false,
  showDots = false,
  autoplay = false,
  autoplayDelay = 3000,
  fullscreen = false,
  profilePicture,
  onClose,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex: initialIndex,
  });
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || !autoplay) return;

    const autoplayInterval = setInterval(() => {
      emblaApi.scrollNext();
    }, autoplayDelay);

    return () => clearInterval(autoplayInterval);
  }, [emblaApi, autoplay, autoplayDelay]);

  return (
    <div
      className={`${
        fullscreen || profilePicture
          ? 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm'
          : 'relative w-full h-full overflow-hidden rounded-lg'
      }`}
    >
      {(fullscreen || profilePicture) && (
        <button
          className="absolute top-4 right-4 z-50 text-white text-3xl"
          onClick={onClose}
        >
          <IoClose />
        </button>
      )}

      <div ref={emblaRef} className="w-full h-full">
        <div className="flex w-full h-full">
          {images?.map((src, index) => (
            <div
              key={src}
              className="flex-[0_0_100%] flex justify-center items-center w-full h-full"
            >
              <Image
                src={src}
                alt={`Carousel image ${index + 1}`}
                width={600}
                height={600}
                className={`${fullscreen ? 'h-full w-fit' : profilePicture ? 'w-96 object-cover object-center' : 'object-cover object-center w-full h-full'}`}
              />
            </div>
          ))}
        </div>
      </div>

      {showPrevNextButtons && (
        <>
          <PrevButton onClick={() => emblaApi && emblaApi.scrollPrev()} />
          <NextButton onClick={() => emblaApi && emblaApi.scrollNext()} />
        </>
      )}

      {showDots && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              selected={index === selectedIndex}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SliderCarousel;
