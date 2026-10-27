import React from 'react';
import { createPortal } from 'react-dom';

export const TOOLTIP_BUBBLE_CLASS =
  'pointer-events-none whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[11px] font-medium text-white shadow-md dark:bg-slate-100 dark:text-slate-900';

type Placement = 'top' | 'right';

function TooltipPortal({
  visible,
  coords,
  placement,
  label
}: {
  visible: boolean;
  coords: { x: number; y: number };
  placement: Placement;
  label: string;
}) {
  if (!visible || typeof document === 'undefined') return null;
  return createPortal(
    <div
      role="tooltip"
      className={`fixed z-[9999] ${TOOLTIP_BUBBLE_CLASS}`}
      style={{
        left: coords.x,
        top: coords.y,
        transform: placement === 'right' ? 'translateY(-50%)' : 'translate(-50%, -100%)'
      }}
    >
      {label}
    </div>,
    document.body
  );
}

/** Wraps a control; tooltip shows immediately on hover/focus (no native `title` delay). */
export function HoverTooltip({
  label,
  children,
  placement = 'top'
}: {
  label: string;
  children: React.ReactNode;
  placement?: Placement;
}) {
  const anchorRef = React.useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = React.useState(false);
  const [coords, setCoords] = React.useState({ x: 0, y: 0 });

  const show = () => {
    const el = anchorRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (placement === 'right') {
      setCoords({ x: rect.right + 8, y: rect.top + rect.height / 2 });
    } else {
      setCoords({ x: rect.left + rect.width / 2, y: rect.top - 6 });
    }
    setVisible(true);
  };

  return (
    <>
      <span
        ref={anchorRef}
        className="inline-flex"
        onMouseEnter={show}
        onMouseLeave={() => setVisible(false)}
        onFocus={show}
        onBlur={() => setVisible(false)}
      >
        {children}
      </span>
      <TooltipPortal visible={visible} coords={coords} placement={placement} label={label} />
    </>
  );
}

export function TooltipIconButton({
  label,
  ariaLabel,
  onClick,
  className,
  style,
  children
}: {
  label: string;
  ariaLabel: string;
  onClick: () => void;
  className: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = React.useState(false);
  const [coords, setCoords] = React.useState({ x: 0, y: 0 });

  const show = () => {
    const el = anchorRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({ x: rect.left + rect.width / 2, y: rect.top - 6 });
    setVisible(true);
  };

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        onMouseEnter={show}
        onMouseLeave={() => setVisible(false)}
        onFocus={show}
        onBlur={() => setVisible(false)}
        className={className}
        style={style}
      >
        {children}
      </button>
      <TooltipPortal visible={visible} coords={coords} placement="top" label={label} />
    </>
  );
}

export function TooltipButton({
  label,
  ariaLabel,
  className,
  children,
  onClick,
  type = 'button'
}: {
  label: string;
  ariaLabel: string;
  className: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit';
}) {
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = React.useState(false);
  const [coords, setCoords] = React.useState({ x: 0, y: 0 });

  const show = () => {
    const el = anchorRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({ x: rect.left + rect.width / 2, y: rect.top - 6 });
    setVisible(true);
  };

  return (
    <>
      <button
        ref={anchorRef}
        type={type}
        onClick={onClick}
        aria-label={ariaLabel}
        onMouseEnter={show}
        onMouseLeave={() => setVisible(false)}
        onFocus={show}
        onBlur={() => setVisible(false)}
        className={className}
      >
        {children}
      </button>
      <TooltipPortal visible={visible} coords={coords} placement="top" label={label} />
    </>
  );
}
