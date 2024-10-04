'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { DotButton, PrevButton, NextButton } from './CarouselButtons';
import Image from 'next/image';

interface CarouselProps {
  images: string[];
  showPrevNextButtons?: boolean;
  showDots?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
}

const Carousel: React.FC<CarouselProps> = ({
  images,
  showPrevNextButtons = false,
  showDots = false,
  autoplay = false,
  autoplayDelay = 3000,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
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
  }, [emblaApi, setSelectedIndex]);

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
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((src, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] flex justify-center items-center"
            >
              <Image
                src={src}
                alt={`Carousel image ${index + 1}`}
                width={500}
                height={600}
                className="object-contain rounded-lg"
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

export default Carousel;
