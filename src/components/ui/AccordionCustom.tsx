'use client';

import { Accordion, AccordionItem } from '@nextui-org/react';
import { FC, ReactNode } from 'react';

interface IPropsAccordion {
  items: {
    title: string;
    content: string | ReactNode;
  }[];
  bold?: boolean;
  expanded?: boolean;
}

const AccordionCustom: FC<IPropsAccordion> = ({ items, bold, expanded }) => {
  return (
    <Accordion
      itemClasses={{
        title: bold && 'font-bold text-base',
      }}
      defaultExpandedKeys={expanded ? ['0'] : []}
    >
      {items.map((item, i) => (
        <AccordionItem
          key={i?.toString()}
          aria-label={item?.title}
          title={item?.title}
        >
          {item?.content}
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AccordionCustom;
