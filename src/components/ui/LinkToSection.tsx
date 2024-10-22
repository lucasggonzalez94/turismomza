'use client';

import { FC, ReactNode } from 'react';
import Link from 'next/link';

interface IPropsLinkToSection {
  children: ReactNode;
  idToScroll: string;
  className?: string;
}

const LinkToSection: FC<IPropsLinkToSection> = ({
  children,
  idToScroll,
  className,
}) => {
  const scrollToAttractions = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(idToScroll);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Link href="#" onClick={scrollToAttractions} className={className}>
      {children}
    </Link>
  );
};

export default LinkToSection;
