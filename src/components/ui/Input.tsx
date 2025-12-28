'use client';

import * as React from 'react';
import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  startContent?: ReactNode;
  endContent?: ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startContent, endContent, ...props }, ref) => {
    const paddingLeft = startContent ? 'pl-10' : 'pl-3';
    const paddingRight = endContent ? 'pr-10' : 'pr-3';

    return (
      <div className="relative w-full">
        {startContent ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {startContent}
          </span>
        ) : null}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background py-2 text-sm ring-offset-background',
            paddingLeft,
            paddingRight,
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...props}
        />
        {endContent ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-muted-foreground pointer-events-auto">
            {endContent}
          </span>
        ) : null}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
