import { useState } from 'react';
import { DragPreviewOptions, useStyledDragImage } from './useStyledDragImage';

interface UseGalleryReorderOptions {
  galleryImages?: string[];
  coverImage?: string;
  isCoverShown?: boolean;
  onReorderImages?: (reorderedImages: string[]) => void;
  dragPreviewOptions?: DragPreviewOptions;
}

export const useGalleryReorder = ({
  galleryImages,
  coverImage,
  isCoverShown,
  onReorderImages,
  dragPreviewOptions
}: UseGalleryReorderOptions) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const { setStyledDragImage, cleanupDragImage } = useStyledDragImage(dragPreviewOptions);

  const hasCoverAtStart = coverImage && !galleryImages?.includes(coverImage) && !isCoverShown;

  const isCoverImage = (index: number) => Boolean(hasCoverAtStart && index === 0);
  const isDraggable = (index: number) => Boolean(onReorderImages) && !isCoverImage(index);

  const getGalleryIndex = (combinedIndex: number): number => {
    if (hasCoverAtStart) return combinedIndex - 1;
    return combinedIndex;
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index.toString());
    setStyledDragImage(e);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (draggedIndex === null || draggedIndex === dropIndex || !onReorderImages) {
      setDraggedIndex(null);
      return;
    }

    // Prevent dragging the cover image
    if (isCoverImage(draggedIndex)) {
      setDraggedIndex(null);
      return;
    }

    const imagesToReorder = [...(galleryImages || [])];
    const draggedGalleryIndex = getGalleryIndex(draggedIndex);
    const dropGalleryIndex = getGalleryIndex(dropIndex);

    const [draggedImage] = imagesToReorder.splice(draggedGalleryIndex, 1);
    imagesToReorder.splice(dropGalleryIndex, 0, draggedImage);

    onReorderImages(imagesToReorder);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    cleanupDragImage();
  };

  return {
    draggedIndex,
    dragOverIndex,
    isCoverImage,
    isDraggable,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd
  };
};

