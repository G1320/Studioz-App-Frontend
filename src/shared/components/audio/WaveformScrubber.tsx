import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FC,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode
} from 'react';
import { formatPlaybackTime } from '@shared/audio/formatPlaybackTime';
import './styles/_waveform-scrubber.scss';

export interface WaveformScrubberProps {
  /** Normalized 0–255 peaks; `null` renders a flat progress line instead. */
  peaks: number[] | null;
  /** 0..1 playback position. */
  progress: number;
  /** Track duration in seconds (for hover labels / keyboard steps / a11y). */
  duration: number;
  /** Called with the target position as a fraction (0..1) when the user commits a seek. */
  onSeek?: (fraction: number) => void;
  /** Peaks are still being generated on the server. */
  loading?: boolean;
  disabled?: boolean;
  /** Pixel height of the drawing surface. */
  height?: number;
  /** Bar geometry (CSS px). */
  barWidth?: number;
  barGap?: number;
  ariaLabel?: string;
  className?: string;
  /** Overlay content positioned over the waveform (e.g. cue markers). */
  children?: ReactNode;
}

interface Palette {
  played: string;
  muted: string;
}

const FALLBACK_PALETTE: Palette = {
  played: '#ffd166',
  muted: 'rgb(160, 160, 160)'
};

/** Alpha applied to the muted colour for unplayed / placeholder bars. */
const UNPLAYED_ALPHA = 0.55;
const PLACEHOLDER_ALPHA = 0.25;

/**
 * Resolve theme colours through probe elements so canvas gets concrete rgb()
 * values (CSS variables / color-mix are not reliably parsed by fillStyle).
 */
function readPalette(root: HTMLElement): Palette {
  const playedProbe = root.querySelector<HTMLElement>('[data-probe="played"]');
  const mutedProbe = root.querySelector<HTMLElement>('[data-probe="muted"]');
  const played = playedProbe ? getComputedStyle(playedProbe).color : '';
  const muted = mutedProbe ? getComputedStyle(mutedProbe).color : '';
  return {
    played: played || FALLBACK_PALETTE.played,
    muted: muted || FALLBACK_PALETTE.muted
  };
}

/** Deterministic placeholder shape so the skeleton doesn't flicker between renders. */
function placeholderPeak(i: number): number {
  const a = Math.sin(i * 0.35) * 0.5 + 0.5;
  const b = Math.sin(i * 1.7 + 2) * 0.5 + 0.5;
  return 40 + Math.round(a * 60 + b * 40);
}

/** Downsample peaks into `count` bars by taking the max within each span. */
function resampleToBars(peaks: number[], count: number): Float32Array {
  const out = new Float32Array(count);
  if (!peaks.length || count <= 0) return out;
  for (let b = 0; b < count; b++) {
    const start = Math.floor((b / count) * peaks.length);
    const end = Math.max(start + 1, Math.floor(((b + 1) / count) * peaks.length));
    let m = 0;
    for (let i = start; i < end && i < peaks.length; i++) if (peaks[i] > m) m = peaks[i];
    out[b] = m / 255;
  }
  return out;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const WaveformScrubber: FC<WaveformScrubberProps> = ({
  peaks,
  progress,
  duration,
  onSeek,
  loading = false,
  disabled = false,
  height = 44,
  barWidth = 2,
  barGap = 1,
  ariaLabel,
  className,
  children
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(0);
  const [hoverFraction, setHoverFraction] = useState<number | null>(null);
  const [scrubFraction, setScrubFraction] = useState<number | null>(null);
  const draggingRef = useRef(false);

  const interactive = !!onSeek && !disabled;
  const displayProgress = scrubFraction ?? clamp01(progress);

  // Observe width so the bar count follows the layout (responsive + RTL safe).
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const barCount = useMemo(() => {
    const step = barWidth + barGap;
    return width > 0 ? Math.max(1, Math.floor((width + barGap) / step)) : 0;
  }, [width, barWidth, barGap]);

  const bars = useMemo(() => {
    if (!barCount) return null;
    if (peaks && peaks.length) return resampleToBars(peaks, barCount);
    return null;
  }, [peaks, barCount]);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root || !width) return;
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const cssHeight = height;
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(cssHeight * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(cssHeight * dpr);
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, cssHeight);

    const palette = readPalette(root);
    const mid = cssHeight / 2;
    const progressX = displayProgress * width;
    const step = barWidth + barGap;
    const minBar = 2;

    if (bars) {
      for (let i = 0; i < barCount; i++) {
        const x = i * step;
        const h = Math.max(minBar, bars[i] * (cssHeight - 2));
        const played = x + barWidth / 2 <= progressX;
        ctx.globalAlpha = played ? 1 : UNPLAYED_ALPHA;
        ctx.fillStyle = played ? palette.played : palette.muted;
        roundedBar(ctx, x, mid - h / 2, barWidth, h);
      }
      ctx.globalAlpha = 1;
      return;
    }

    if (loading) {
      ctx.globalAlpha = PLACEHOLDER_ALPHA;
      ctx.fillStyle = palette.muted;
      for (let i = 0; i < barCount; i++) {
        const x = i * step;
        const h = Math.max(minBar, (placeholderPeak(i) / 255) * (cssHeight - 2) * 0.6);
        roundedBar(ctx, x, mid - h / 2, barWidth, h);
      }
      ctx.globalAlpha = 1;
      return;
    }

    // Flat fallback (no waveform available): thin track with progress fill.
    const trackH = 4;
    ctx.globalAlpha = UNPLAYED_ALPHA;
    ctx.fillStyle = palette.muted;
    roundedBar(ctx, 0, mid - trackH / 2, width, trackH);
    ctx.globalAlpha = 1;
    ctx.fillStyle = palette.played;
    roundedBar(ctx, 0, mid - trackH / 2, Math.max(0, progressX), trackH);
  }, [bars, barCount, width, height, barWidth, barGap, displayProgress, loading]);

  const fractionFromEvent = useCallback((e: PointerEvent | globalThis.PointerEvent) => {
    const el = rootRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return clamp01((e.clientX - rect.left) / Math.max(1, rect.width));
  }, []);

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!interactive || e.button !== 0) return;
    e.preventDefault();
    draggingRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    setScrubFraction(fractionFromEvent(e));
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const f = fractionFromEvent(e);
    if (draggingRef.current) setScrubFraction(f);
    if (e.pointerType !== 'touch') setHoverFraction(f);
  };

  const finishScrub = (e: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    const f = fractionFromEvent(e);
    setScrubFraction(null);
    onSeek?.(f);
  };

  const handlePointerLeave = () => {
    setHoverFraction(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const stepFraction = duration > 0 ? 5 / duration : 0.05;
    let next: number | null = null;
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        next = clamp01(displayProgress - stepFraction);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        next = clamp01(displayProgress + stepFraction);
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    onSeek?.(next);
  };

  const labelFraction = scrubFraction ?? hoverFraction;
  const labelTime = labelFraction != null && duration > 0 ? labelFraction * duration : null;

  const classes = [
    'waveform-scrubber',
    interactive ? 'waveform-scrubber--interactive' : '',
    loading && !bars ? 'waveform-scrubber--loading' : '',
    !bars && !loading ? 'waveform-scrubber--flat' : '',
    className || ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={rootRef}
      className={classes}
      style={{ height }}
      role={interactive ? 'slider' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={ariaLabel}
      aria-valuemin={interactive ? 0 : undefined}
      aria-valuemax={interactive ? Math.max(0, Math.round(duration)) : undefined}
      aria-valuenow={interactive ? Math.round(displayProgress * duration) : undefined}
      aria-valuetext={interactive ? formatPlaybackTime(displayProgress * duration) : undefined}
      aria-disabled={disabled || undefined}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishScrub}
      onPointerCancel={finishScrub}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
    >
      <span className="waveform-scrubber__probe waveform-scrubber__probe--played" data-probe="played" aria-hidden />
      <span className="waveform-scrubber__probe waveform-scrubber__probe--muted" data-probe="muted" aria-hidden />
      <canvas ref={canvasRef} className="waveform-scrubber__canvas" style={{ height }} aria-hidden />
      {interactive && (
        <div
          className="waveform-scrubber__playhead"
          style={{ left: `${displayProgress * 100}%` }}
          aria-hidden
        />
      )}
      {labelTime != null && interactive && (
        <div
          className="waveform-scrubber__hover"
          style={{ left: `${(labelFraction ?? 0) * 100}%` }}
          aria-hidden
        >
          {formatPlaybackTime(labelTime)}
        </div>
      )}
      {children && <div className="waveform-scrubber__overlay">{children}</div>}
    </div>
  );
};

function roundedBar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const r = Math.min(w / 2, 1);
  if (h <= r * 2 || w <= 1) {
    ctx.fillRect(x, y, w, h);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

export default WaveformScrubber;
