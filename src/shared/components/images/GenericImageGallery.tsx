import { useState, useEffect, useRef } from 'react';
import { GenericImage } from './GenericImage';
import { GenericList } from '@shared/components';

interface GenericImageGalleryProps {
  isGalleryImagesShown?: boolean;
  className?: string;
  isCoverShown?: boolean;
  entity?: { name?: { en?: string } } | null;
  coverImage?: string;
  title?: string;
  subTitle?: string;
  galleryImages?: string[];
  onSetPreviewImage?: (image: string) => void;
  onRemoveImage?: (image: string) => void;
  onReorderImages?: (reorderedImages: string[]) => void;
}

export const GenericImageGallery: React.FC<GenericImageGalleryProps> = ({
  className = '',
  isGalleryImagesShown = false,
  isCoverShown = true,
  entity,
  coverImage,
  galleryImages,
  onSetPreviewImage,
  onRemoveImage,
  onReorderImages,
  title,
  subTitle
}) => {
  const combinedGalleryImages =
    coverImage && !galleryImages?.includes(coverImage) ? [coverImage, ...(galleryImages || [])] : galleryImages || [];

  const [currCoverImage, setCurrCoverImage] = useState<string | undefined>(coverImage);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragImageRef = useRef<HTMLElement | null>(null);

  const handleImageChange = (image: string) => {
    setCurrCoverImage(image);
    if (onSetPreviewImage) onSetPreviewImage(image);
  };

  useEffect(() => {
    setCurrCoverImage(coverImage);
  }, [coverImage, galleryImages]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index.toString());

    // Styled clone so the drag preview matches the tile size/aspect
    const target = e.currentTarget as HTMLElement | null;
    if (target) {
      const rect = target.getBoundingClientRect();
      const clone = target.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.top = '-9999px';
      clone.style.left = '-9999px';
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.pointerEvents = 'none';
      clone.style.opacity = '0.9';
      clone.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.35), 0 0 0 2px rgba(255,255,255,0.08)';
      clone.style.borderRadius = '12px';
      document.body.appendChild(clone);
      dragImageRef.current = clone;
      e.dataTransfer.setDragImage(clone, rect.width / 2, rect.height / 2);
    }
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

    // Check if cover image is included in combinedGalleryImages at index 0
    const hasCoverAtStart = coverImage && !galleryImages?.includes(coverImage) && !isCoverShown;

    // Map indices from combinedGalleryImages to galleryImages
    const getGalleryIndex = (combinedIndex: number): number => {
      if (hasCoverAtStart) {
        return combinedIndex - 1; // Skip cover image at index 0
      }
      return combinedIndex;
    };

    const draggedGalleryIndex = getGalleryIndex(draggedIndex);
    const dropGalleryIndex = getGalleryIndex(dropIndex);

    // Don't allow dragging the cover image (if it's at index 0)
    if (hasCoverAtStart && draggedIndex === 0) {
      setDraggedIndex(null);
      return;
    }

    // Work with the actual gallery images array
    const imagesToReorder = [...(galleryImages || [])];
    const [draggedImage] = imagesToReorder.splice(draggedGalleryIndex, 1);
    imagesToReorder.splice(dropGalleryIndex, 0, draggedImage);

    onReorderImages(imagesToReorder);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    if (dragImageRef.current) {
      dragImageRef.current.remove();
      dragImageRef.current = null;
    }
  };

  const renderItem = (image: string, index: number) => {
    const isDragging = draggedIndex === index;
    const isDragOver = dragOverIndex === index;

    // Check if this is the cover image (shouldn't be draggable)
    const hasCoverAtStart = coverImage && !galleryImages?.includes(coverImage) && !isCoverShown;
    const isCoverImage = hasCoverAtStart && index === 0;
    const isDraggable = !!onReorderImages && !isCoverImage;

    return (
      <div
        className={`gallery-image-wrapper ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
        key={index}
        draggable={isDraggable}
        onDragStart={isDraggable ? (e) => handleDragStart(e, index) : undefined}
        onDragOver={isDraggable ? (e) => handleDragOver(e, index) : undefined}
        onDragLeave={isDraggable ? handleDragLeave : undefined}
        onDrop={isDraggable ? (e) => handleDrop(e, index) : undefined}
        onDragEnd={isDraggable ? handleDragEnd : undefined}
      >
        <GenericImage
          src={image}
          // blurHash={blurHash}
          alt={entity?.name?.en || `Gallery Image ${index + 1}`}
          className="card gallery-image"
          onClick={() => handleImageChange(image)}
          width={800}
        />
        {onRemoveImage && (
          <button
            type="button"
            className="gallery-image-remove"
            aria-label="Remove image"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveImage(image);
            }}
          >
            ×
          </button>
        )}
        {onReorderImages && !isCoverImage && (
          <div className="gallery-image-drag-handle" aria-label="Drag to reorder">
            ⋮⋮
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`file-gallery-container image-gallery-container ${className}`}>
      {isCoverShown && currCoverImage && (
        <GenericImage
          src={currCoverImage}
          blurHash="LEHV6nWB2yk8pyo0adR*.7kCMdnj"
          alt={`${entity?.name?.en} cover image` || `Cover Image `}
          className="cover-image"
          width={800}
          loading="lazy"
          onClick={() => onSetPreviewImage?.(currCoverImage)}
        />
      )}
      <div className="cover-image-overlay"></div>
      <span className="title-container">
        {title && <h1 className="gallery-title">{title}</h1>}
        {subTitle && <h3 className="gallery-title">{subTitle}</h3>}
      </span>
      {isGalleryImagesShown && galleryImages && (
        <GenericList data={combinedGalleryImages} renderItem={renderItem} className="files-list gallery-images-list" />
      )}
    </div>
  );
};
