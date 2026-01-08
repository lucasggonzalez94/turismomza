'use client';

import { ChangeEvent, FC, useEffect, useMemo, useRef, useState } from 'react';
import { IoChevronDown } from 'react-icons/io5';

import { CATEGORIES } from '@/utils/constants';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

type Option = {
  key: string;
  label: string;
};

interface MultiSelectProps {
  label?: string;
  placeholder?: string;
  selected: string[];
  onChange: (values: string[]) => void;
  categories?: Option[];
  className?: string;
}

export const MultiSelect: FC<MultiSelectProps> = ({
  label = 'Categorías',
  placeholder = 'Categorías',
  selected,
  onChange,
  categories,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);

  const options = categories || CATEGORIES;

  const filtered = useMemo(
    () =>
      options.filter((cat) =>
        cat.label.toLowerCase().includes(search.toLowerCase()),
      ),
    [options, search],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabels = options
    .filter((cat) => selected.includes(cat.key))
    .map((cat) => cat.label);
  const summaryText =
    selectedLabels.length === 0
      ? placeholder
      : selectedLabels.length <= 2
        ? selectedLabels.join(', ')
        : `${selectedLabels.slice(0, 2).join(', ')} +${
            selectedLabels.length - 2
          }`;

  return (
    <div
      className={cn('relative flex flex-col gap-2', className)}
      ref={containerRef}
    >
      {label ? <p className="text-sm font-medium">{label}</p> : null}
      <button
        type="button"
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <span className="truncate">{summaryText}</span>
        <IoChevronDown
          className={cn(
            'h-4 w-4 transition-transform',
            isOpen ? 'rotate-180' : '',
          )}
        />
      </button>
      {isOpen ? (
        <div className="absolute left-0 top-full z-30 mt-1 w-full max-w-[360px] sm:max-w-[400px] rounded-md border bg-popover text-popover-foreground shadow-lg overflow-hidden">
          <div className="p-3 flex flex-col gap-2">
            <Input
              type="text"
              placeholder="Buscar categoría"
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              containerClassName="w-full"
            />
            <div className="max-h-48 overflow-y-auto flex flex-col gap-1 pr-1">
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground px-1">
                  Sin resultados
                </p>
              ) : (
                filtered.map((category) => {
                  const checked = selected.includes(category.key);
                  return (
                    <Checkbox
                      key={category.key}
                      label={category.label}
                      checked={checked}
                      onCheckedChange={(checkedState) => {
                        const current = new Set(selected);
                        if (checkedState) {
                          current.add(category.key);
                        } else {
                          current.delete(category.key);
                        }
                        onChange(Array.from(current));
                      }}
                      containerClassName="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted"
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
