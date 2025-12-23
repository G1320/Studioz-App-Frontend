import { useRef } from 'react';

export interface DragPreviewOptions {
  opacity?: string;
  border?: string;
  boxShadow?: string;
  borderRadius?: string;
}

/**
 * Reusable helper to create a styled drag preview (clone of the dragged element).
 * Usage:
 * const { setStyledDragImage, cleanupDragImage } = useStyledDragImage();
 * onDragStart={(e) => setStyledDragImage(e)}
 * onDragEnd={cleanupDragImage}
 */
export const useStyledDragImage = (defaults: DragPreviewOptions = {}) => {
  const dragImageRef = useRef<HTMLElement | null>(null);

  const setStyledDragImage = (e: React.DragEvent, target?: HTMLElement | null) => {
    const node = target ?? (e.currentTarget as HTMLElement | null);
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const clone = node.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.top = '-9999px';
    clone.style.left = '-9999px';
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.pointerEvents = 'none';
    clone.style.opacity = defaults.opacity ?? '0.9';
    if (defaults.border) clone.style.border = defaults.border;
    clone.style.boxShadow = defaults.boxShadow ?? '0 8px 24px rgba(0, 0, 0, 0.35), 0 0 0 2px rgba(255,255,255,0.08)';
    clone.style.borderRadius = defaults.borderRadius ?? '12px';

    document.body.appendChild(clone);
    dragImageRef.current = clone;
    e.dataTransfer.setDragImage(clone, rect.width / 2, rect.height / 2);
  };

  const cleanupDragImage = () => {
    if (dragImageRef.current) {
      dragImageRef.current.remove();
      dragImageRef.current = null;
    }
  };

  return { setStyledDragImage, cleanupDragImage };
};

