'use client';

import { Accordion, AccordionItem } from '@nextui-org/react';
import { FC } from 'react';

interface IPropsAccordion {
  items: {
    title: string;
    content: string;
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
