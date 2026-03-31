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

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

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
    const spaceLeft = triggerRect.left - SAFE_MARGIN;
    const spaceRight = viewportWidth - triggerRect.right - SAFE_MARGIN;

    const centeredLeft =
      triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
    const centeredRightEdge = centeredLeft + tooltipRect.width;

    const canCenterHorizontally =
      centeredLeft >= SAFE_MARGIN &&
      centeredRightEdge <= viewportWidth - SAFE_MARGIN;

    const fitsAbove = spaceAbove >= tooltipRect.height + offset;
    const fitsBelow = spaceBelow >= tooltipRect.height + offset;
    const fitsLeft = spaceLeft >= tooltipRect.width + offset;
    const fitsRight = spaceRight >= tooltipRect.width + offset;

    let nextPlacement: TooltipPlacement = 'top';

    if (fitsAbove && canCenterHorizontally) {
      nextPlacement = 'top';
    } else if (fitsBelow && canCenterHorizontally) {
      nextPlacement = 'bottom';
    } else if (fitsLeft || fitsRight) {
      if (fitsLeft && fitsRight) {
        nextPlacement = spaceRight >= spaceLeft ? 'right' : 'left';
      } else {
        nextPlacement = fitsRight ? 'right' : 'left';
      }
    } else if (fitsAbove || fitsBelow) {
      nextPlacement = fitsAbove ? 'top' : 'bottom';
    } else {
      nextPlacement = spaceRight >= spaceLeft ? 'right' : 'left';
    }

    const clamp = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max);

    const maxTop = viewportHeight - tooltipRect.height - SAFE_MARGIN;
    const maxLeft = viewportWidth - tooltipRect.width - SAFE_MARGIN;

    let top = 0;
    let left = 0;

    if (nextPlacement === 'top' || nextPlacement === 'bottom') {
      top =
        nextPlacement === 'top'
          ? Math.max(SAFE_MARGIN, triggerRect.top - tooltipRect.height - offset)
          : Math.min(maxTop, triggerRect.bottom + offset);
      left = canCenterHorizontally
        ? centeredLeft
        : clamp(centeredLeft, SAFE_MARGIN, maxLeft);
    } else {
      const verticalCenter =
        triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
      top = clamp(verticalCenter, SAFE_MARGIN, maxTop);

      if (nextPlacement === 'left') {
        left = Math.max(
          SAFE_MARGIN,
          triggerRect.left - tooltipRect.width - offset,
        );
      } else {
        left = Math.min(maxLeft, triggerRect.right + offset);
      }
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
                  'animate-in fade-in-0 zoom-in-95',
                  className,
                )}
              >
                {text}
                <span
                  className={cn(
                    'absolute h-2 w-2 bg-black rotate-45',
                    placement === 'top' &&
                      'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
                    placement === 'bottom' &&
                      'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
                    placement === 'left' &&
                      'top-1/2 right-0 translate-x-[35%] -translate-y-1/2',
                    placement === 'right' &&
                      'top-1/2 left-0 -translate-x-[35%] -translate-y-1/2',
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
