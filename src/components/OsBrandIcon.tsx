import React from 'react';

type IconProps = {
  className?: string;
  title?: string;
};

const svgA11y = (title?: string) =>
  title
    ? { role: 'img' as const, 'aria-label': title }
    : { role: 'presentation' as const, 'aria-hidden': true as const };

/** Apple logo mark — optimized for small UI sizes (Simple Icons silhouette). */
export function AppleBrandIcon({ className = 'h-5 w-5 shrink-0', title }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      {...svgA11y(title)}
    >
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.793 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.272 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

type WindowsBrandIconProps = IconProps & {
  /** Full Microsoft four-pane colors, or solid panes in `currentColor`. */
  variant?: 'color' | 'mono';
};

const WINDOWS_PANES: ReadonlyArray<{ x: number; y: number; fill: string }> = [
  { x: 0, y: 0, fill: '#F25022' },
  { x: 12, y: 0, fill: '#7FBA00' },
  { x: 0, y: 12, fill: '#00A4EF' },
  { x: 12, y: 12, fill: '#FFB900' }
];

/** Windows logo — four-pane grid (reads clearly from 14px up). */
export function WindowsBrandIcon({
  className = 'h-5 w-5 shrink-0',
  title,
  variant = 'color'
}: WindowsBrandIconProps) {
  const paneFill = variant === 'mono' ? 'currentColor' : undefined;

  return (
    <svg
      viewBox="0 0 23 23"
      className={className}
      shapeRendering="geometricPrecision"
      {...svgA11y(title)}
    >
      {WINDOWS_PANES.map((pane, i) => (
        <rect
          key={i}
          x={pane.x}
          y={pane.y}
          width={11}
          height={11}
          rx={0.5}
          fill={paneFill ?? pane.fill}
        />
      ))}
    </svg>
  );
}
