'use client';

import React from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';

type TooltipProps = {
  text: string;
  children: React.ReactElement;
  /**
   * Distancia en píxeles entre el trigger y el tooltip.
   */
  offset?: number;
  /**
   * Permite extender los estilos base del contenedor del tooltip.
   */
  className?: string;
};

type TooltipPlacement = 'top' | 'bottom';

const SAFE_MARGIN = 8;

export const Tooltip = ({
  text,
  children,
  offset = 12,
  className,
}: TooltipProps) => {
  const [visible, setVisible] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [coords, setCoords] = React.useState({ top: 0, left: 0 });
  const [placement, setPlacement] = React.useState<TooltipPlacement>('top');
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const tooltipId = React.useId();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const spaceAbove = triggerRect.top - SAFE_MARGIN;
    const spaceBelow = viewportHeight - triggerRect.bottom - SAFE_MARGIN;

    let nextPlacement: TooltipPlacement = 'top';
    let top = triggerRect.top - tooltipRect.height - offset;

    const fitsAbove = spaceAbove >= tooltipRect.height + offset;
    const fitsBelow = spaceBelow >= tooltipRect.height + offset;

    if (!fitsAbove && fitsBelow) {
      nextPlacement = 'bottom';
      top = triggerRect.bottom + offset;
    } else if (!fitsAbove && !fitsBelow) {
      nextPlacement = spaceAbove > spaceBelow ? 'top' : 'bottom';
      top =
        nextPlacement === 'top'
          ? Math.max(SAFE_MARGIN, triggerRect.top - tooltipRect.height - offset)
          : Math.min(
              viewportHeight - tooltipRect.height - SAFE_MARGIN,
              triggerRect.bottom + offset,
            );
    } else {
      top = Math.max(SAFE_MARGIN, top);
    }

    if (
      nextPlacement === 'bottom' &&
      top + tooltipRect.height > viewportHeight - SAFE_MARGIN
    ) {
      top = viewportHeight - tooltipRect.height - SAFE_MARGIN;
    }

    let left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;

    if (left < SAFE_MARGIN) {
      left = SAFE_MARGIN;
    } else if (left + tooltipRect.width > viewportWidth - SAFE_MARGIN) {
      left = viewportWidth - tooltipRect.width - SAFE_MARGIN;
    }

    setPlacement(nextPlacement);
    setCoords({ top, left });
  }, [offset]);

  React.useLayoutEffect(() => {
    if (!visible) return;

    const handleUpdate = () => updatePosition();
    handleUpdate();

    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);

    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [visible, updatePosition, text]);

  const handleShow = () => setVisible(true);
  const handleHide = () => setVisible(false);

  const child = React.Children.only(children);
  type ChildWithRef = React.ReactElement & { ref?: React.Ref<HTMLElement> };
  const { ref: childRef } = child as ChildWithRef;

  const assignChildRef = (node: HTMLElement | null) => {
    triggerRef.current = node;
    if (!childRef) return;
    if (typeof childRef === 'function') {
      childRef(node);
    } else if (typeof childRef === 'object') {
      (childRef as React.MutableRefObject<HTMLElement | null>).current = node;
    }
  };

  const enhancedChild = React.cloneElement(child, {
    ...child.props,
    ref: assignChildRef,
    onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
      child.props.onMouseEnter?.(event);
      handleShow();
    },
    onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
      child.props.onMouseLeave?.(event);
      handleHide();
    },
    onFocus: (event: React.FocusEvent<HTMLElement>) => {
      child.props.onFocus?.(event);
      handleShow();
    },
    onBlur: (event: React.FocusEvent<HTMLElement>) => {
      child.props.onBlur?.(event);
      handleHide();
    },
    'aria-describedby': visible
      ? cn(child.props['aria-describedby'], tooltipId).trim() || tooltipId
      : child.props['aria-describedby'],
  });

  return (
    <>
      {enhancedChild}
      {mounted && visible
        ? createPortal(
            <div
              ref={tooltipRef}
              role="tooltip"
              id={tooltipId}
              aria-hidden={!visible}
              className="pointer-events-none"
              style={{
                position: 'fixed',
                top: coords.top,
                left: coords.left,
                zIndex: 1000,
              }}
            >
              <div
                className={cn(
                  'relative rounded-full bg-black px-3 py-1 text-xs font-medium text-white shadow-xl transition-transform duration-150 will-change-transform',
                  placement === 'top'
                    ? 'animate-in fade-in-0 zoom-in-95'
                    : 'animate-in fade-in-0 zoom-in-95',
                  className,
                )}
              >
                {text}
                <span
                  className={cn(
                    'absolute left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-black',
                    placement === 'top'
                      ? 'bottom-0 translate-y-1/2'
                      : 'top-0 -translate-y-1/2',
                  )}
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
};
