'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type TextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: React.ReactNode;
    errorMessage?: string;
    requiredMark?: boolean;
    containerClassName?: string;
    minCharacters?: number;
    maxCharacters?: number;
  };

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      errorMessage,
      requiredMark,
      containerClassName,
      minCharacters,
      maxCharacters,
      minLength,
      maxLength,
      onChange,
      value,
      defaultValue,
      ...props
    },
    ref,
  ) => {
    const hasError = Boolean(errorMessage);
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    const handleRefs = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        textareaRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    const getInitialLength = React.useCallback(() => {
      if (typeof value === 'string' || typeof value === 'number') {
        return value.toString().length;
      }

      if (
        typeof defaultValue === 'string' ||
        typeof defaultValue === 'number'
      ) {
        return defaultValue.toString().length;
      }

      return 0;
    }, [value, defaultValue]);

    const [charCount, setCharCount] = React.useState<number>(getInitialLength);

    React.useEffect(() => {
      const currentLength = textareaRef.current?.value.length ?? 0;
      if (currentLength !== charCount) {
        setCharCount(currentLength);
      }
    }, [value, defaultValue, charCount]);

    const resolvedMinLength = minCharacters ?? minLength;
    const resolvedMaxLength = maxCharacters ?? maxLength;

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(event.target.value.length);
      onChange?.(event);
    };

    const counterTextParts = [
      resolvedMaxLength ? `${charCount}/${resolvedMaxLength}` : `${charCount}`,
      'caracteres',
    ];

    if (resolvedMinLength) {
      counterTextParts.push(`(mín. ${resolvedMinLength})`);
    }

    const counterHasError =
      (resolvedMinLength !== undefined && charCount < resolvedMinLength) ||
      (resolvedMaxLength !== undefined && charCount > resolvedMaxLength);

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
            'flex min-h-[120px] w-full rounded-md border border-zinc-400 bg-input px-3 py-2 text-sm ring-offset-background',
            'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            hasError && 'border-red-500 focus-visible:ring-red-500',
            className,
          )}
          ref={handleRefs}
          onChange={handleChange}
          value={value}
          defaultValue={defaultValue}
          minLength={resolvedMinLength}
          maxLength={resolvedMaxLength}
          {...props}
        />
        <div
          className={cn(
            'flex',
            errorMessage ? 'justify-between' : 'justify-end',
          )}
        >
          {errorMessage ? (
            <p className="text-xs text-red-500">{errorMessage}</p>
          ) : null}
          <p
            className={cn(
              'text-xs text-muted-foreground text-right',
              counterHasError && 'text-red-500',
            )}
          >
            {counterTextParts.join(' ')}
          </p>
        </div>
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
