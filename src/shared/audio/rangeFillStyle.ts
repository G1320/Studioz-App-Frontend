import type { CSSProperties } from 'react';

/** CSS var used by `.remote-audio-player__range` track fill gradient. */
export function rangeFillStyle(value: number, max: number): CSSProperties {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return { ['--range-fill' as string]: `${pct}%` };
}
