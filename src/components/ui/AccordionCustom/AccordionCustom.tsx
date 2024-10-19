'use client';

import { Accordion, AccordionItem } from '@nextui-org/react';
import { FC, ReactNode } from 'react';

interface IPropsAccordion {
  items: {
    title: string;
    content: string | ReactNode;
  }[];
}

const AccordionCustom: FC<IPropsAccordion> = ({ items }) => {
  return (
    <Accordion>
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
