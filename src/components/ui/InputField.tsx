'use client';

import React, { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { Input } from './Input';

type InputFieldProps = React.ComponentProps<typeof Input> & {
  label?: ReactNode;
  error?: ReactNode;
  description?: ReactNode;
  renderInput?: (id?: string) => ReactNode;
};

const InputField = ({
  label,
  error,
  description,
  className,
  id,
  name,
  renderInput,
  ...props
}: InputFieldProps) => {
  const inputId = id || name || undefined;
  const inputNode = renderInput ? (
    renderInput(inputId)
  ) : (
    <Input id={inputId} className={cn(className)} {...props} />
  );

  return (
    <div className="flex flex-col gap-1">
      {label ? (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-foreground"
        >
          {label}
        </label>
      ) : null}
      {inputNode}
      {description ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}
      {error ? <span className="text-sm text-red-500">{error}</span> : null}
    </div>
  );
};

export default InputField;
