'use client';

import Link from 'next/link';
import { FC } from 'react';
import {
  IoArrowDownCircleOutline,
  IoArrowForwardCircleOutline,
} from 'react-icons/io5';

interface IPropsLinkToSection {
  text: string;
  idToScroll: string;
}

const LinkToSection: FC<IPropsLinkToSection> = ({ text, idToScroll }) => {
  const scrollToAttractions = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(idToScroll);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Link
      href="#"
      onClick={scrollToAttractions}
      className="text-lg text-white flex flex-col md:flex-row items-center justify-between w-[240px] transition-transform duration-300 transform hover:scale-110"
    >
      {text}
      <IoArrowForwardCircleOutline
        size={25}
        className="hidden md:inline-block"
      />
      <IoArrowDownCircleOutline size={25} className="inline-block md:hidden" />
    </Link>
  );
};

export default LinkToSection;
