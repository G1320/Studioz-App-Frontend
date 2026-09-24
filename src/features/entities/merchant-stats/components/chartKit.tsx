import type { ReactNode } from 'react';

/** Shared Recharts theme tokens for merchant-stats. */
export const chartTheme = {
  grid: 'var(--border-secondary)',
  tick: 'var(--text-muted)',
  tickSize: 11,
  primary: 'var(--ms-chart-primary, var(--color-brand))',
  secondary: 'var(--ms-chart-secondary, var(--text-secondary))',
  tertiary: 'var(--ms-chart-tertiary, #6b8cae)',
  muted: 'var(--ms-chart-muted, var(--text-muted))',
  cursor: 'var(--border-hover)',
  heights: {
    sm: 200,
    md: 240,
    lg: 280
  },
  margins: {
    area: { top: 8, right: 8, left: 8, bottom: 8 },
    bar: { top: 8, right: 8, left: 8, bottom: 8 },
    composed: { top: 8, right: 12, left: 8, bottom: 8 }
  }
} as const;

export function formatMoneyAxis(value: number): string {
  const v = Number(value) || 0;
  if (Math.abs(v) >= 1000) return `₪${(v / 1000).toFixed(0)}k`;
  return `₪${v}`;
}

export function formatMoneyFull(value: number): string {
  return `₪${Number(value || 0).toLocaleString()}`;
}

type TickProps = {
  x?: number;
  y?: number;
  payload?: { value?: string | number };
};

export function MoneyYTick({ x = 0, y = 0, payload }: TickProps) {
  return (
    <text x={x - 8} y={y} dy={4} textAnchor="end" fill={chartTheme.tick} fontSize={chartTheme.tickSize}>
      {formatMoneyAxis(Number(payload?.value ?? 0))}
    </text>
  );
}

export function CountYTick({ x = 0, y = 0, payload }: TickProps) {
  return (
    <text x={x - 8} y={y} dy={4} textAnchor="end" fill={chartTheme.tick} fontSize={chartTheme.tickSize}>
      {payload?.value ?? 0}
    </text>
  );
}

export function MonthXTick({ x = 0, y = 0, payload }: TickProps) {
  return (
    <text
      x={x}
      y={y}
      dy={12}
      textAnchor="end"
      transform={`rotate(-30, ${x}, ${y})`}
      fill={chartTheme.tick}
      fontSize={chartTheme.tickSize}
    >
      {String(payload?.value ?? '')}
    </text>
  );
}

export type MsTooltipRow = {
  label: string;
  value: string;
  color?: string;
};

type MsChartTooltipProps = {
  active?: boolean;
  label?: string;
  rows?: MsTooltipRow[];
  /** Simple single-series fallback */
  value?: string;
  valueLabel?: string;
};

/** Enterprise-style floating tooltip used across merchant-stats charts. */
export function MsChartTooltip({ active, label, rows, value, valueLabel }: MsChartTooltipProps) {
  if (!active) return null;
  const items =
    rows && rows.length > 0
      ? rows
      : value != null
        ? [{ label: valueLabel ?? '', value }]
        : [];
  if (!items.length && !label) return null;

  return (
    <div className="ms-chart-tooltip">
      {label ? <div className="ms-chart-tooltip__label">{label}</div> : null}
      <ul className="ms-chart-tooltip__rows">
        {items.map((row) => (
          <li key={`${row.label}-${row.value}`} className="ms-chart-tooltip__row">
            {row.color ? (
              <span className="ms-chart-tooltip__swatch" style={{ background: row.color }} aria-hidden />
            ) : null}
            <span className="ms-chart-tooltip__name">{row.label}</span>
            <span className="ms-chart-tooltip__value">{row.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Loose Recharts Tooltip content props — payload is readonly in Recharts 3. */
export type MsTooltipContentProps = {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: ReadonlyArray<any>;
  label?: string | number;
};

/** Adapter for Recharts Tooltip `content` with a money formatter. */
export function makeMoneyTooltipContent(
  seriesLabel: string,
  formatCurrency: (n: number) => string = formatMoneyFull,
  color: string = chartTheme.primary
): (props: MsTooltipContentProps) => ReactNode {
  return function MoneyTooltipContent({ active, payload, label }: MsTooltipContentProps) {
    const raw = payload?.[0]?.value;
    if (!active || raw == null) return null;
    return (
      <MsChartTooltip
        active
        label={label != null ? String(label) : undefined}
        rows={[{ label: seriesLabel, value: formatCurrency(Number(raw)), color }]}
      />
    );
  };
}

export function makeMultiSeriesTooltipContent(
  formatCurrency: (n: number) => string,
  nameMap: Record<string, { label: string; color: string }>
): (props: MsTooltipContentProps) => ReactNode {
  return function MultiTooltipContent({ active, payload, label }: MsTooltipContentProps) {
    if (!active || !payload?.length) return null;
    const rows = payload
      .filter((p) => p.value != null && p.value !== 0)
      .map((p) => {
        const key = String(p.dataKey ?? p.name ?? '');
        const meta = nameMap[key];
        return {
          label: meta?.label ?? key,
          value: formatCurrency(Number(p.value)),
          color: meta?.color ?? p.color ?? chartTheme.primary
        };
      });
    if (!rows.length) return null;
    return (
      <MsChartTooltip
        active
        label={label != null ? String(label) : undefined}
        rows={rows}
      />
    );
  };
}

export const axisTickProps = {
  fontSize: chartTheme.tickSize,
  fill: chartTheme.tick
} as const;

export const cartesianGridProps = {
  stroke: chartTheme.grid,
  strokeDasharray: '0' as const,
  vertical: false
};
