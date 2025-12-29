'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type TextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: React.ReactNode;
    errorMessage?: string;
    requiredMark?: boolean;
    containerClassName?: string;
  };

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      errorMessage,
      requiredMark,
      containerClassName,
      ...props
    },
    ref,
  ) => {
    const hasError = Boolean(errorMessage);

    return (
      <div className={cn('flex flex-col gap-1', containerClassName)}>
        {label ? (
          <label className="text-sm font-medium">
            {label}{' '}
            {requiredMark ? <span className="text-red-500">*</span> : null}
          </label>
        ) : null}
        <textarea
          className={cn(
            'flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            hasError && 'border-red-500 focus-visible:ring-red-500',
            className,
          )}
          ref={ref}
          {...props}
        />
        {errorMessage ? (
          <p className="text-xs text-red-500">{errorMessage}</p>
        ) : null}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
