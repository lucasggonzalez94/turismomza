import Link from 'next/link';
import React, { FC, ReactNode } from 'react';

interface IPropsAnimatedLink {
  href: string;
  children: ReactNode;
  className?: string;
}

const AnimatedLink: FC<IPropsAnimatedLink> = ({
  href,
  children,
  className,
}) => {
  return (
    <Link
      href={href}
      className={`text-white relative group transition-all duration-300 hover:font-bold ${className}`}
    >
      {children}
      <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
    </Link>
  );
};

export default AnimatedLink;
