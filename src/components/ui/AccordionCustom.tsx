'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { FC, ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface IPropsAccordion {
  items: {
    title: string;
    content: string | ReactNode;
  }[];
  bold?: boolean;
  expanded?: boolean;
}

const AccordionCustom: FC<IPropsAccordion> = ({ items, bold, expanded }) => {
  const defaultExpanded = expanded ? ['item-0'] : [];

  return (
    <AccordionPrimitive.Root
      type="multiple"
      defaultValue={defaultExpanded}
      className="w-full"
    >
      {items.map((item, index) => {
        const value = `item-${index}`;

        return (
          <AccordionPrimitive.Item
            key={value}
            value={value}
            className="border-b border-gray-400"
          >
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger
                className={cn(
                  'flex flex-1 items-center justify-between py-4 text-left text-sm font-medium transition-all cursor-pointer',
                  bold && 'font-bold text-base',
                )}
              >
                {item?.title}
                <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Content className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className="pb-4 px-6">{item?.content}</div>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        );
      })}
    </AccordionPrimitive.Root>
  );
};

export default AccordionCustom;
