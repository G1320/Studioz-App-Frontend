import { useState, useEffect } from 'react';
import { GenericImage } from './GenericImage';
import { GenericList } from '@shared/components';
import { useGalleryReorder } from '@shared/hooks/utils/useGalleryReorder';

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
  /** Set to true when cover image is the LCP element (e.g., details page headers) */
  coverPriority?: boolean;
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
  subTitle,
  coverPriority = false
}) => {
  // Use galleryImages[0] as cover if no separate coverImage is provided
  const effectiveCoverImage = coverImage || galleryImages?.[0];
  
  // Only combine if coverImage is explicitly provided AND not already in gallery
  const combinedGalleryImages =
    coverImage && !galleryImages?.includes(coverImage) ? [coverImage, ...(galleryImages || [])] : galleryImages || [];

  const [currCoverImage, setCurrCoverImage] = useState<string | undefined>(effectiveCoverImage);
  const {
    draggedIndex,
    dragOverIndex,
    isCoverImage,
    isDraggable,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd
  } = useGalleryReorder({
    galleryImages,
    coverImage,
    isCoverShown,
    onReorderImages,
    dragPreviewOptions: {
      border: '2px solid rgba(255, 255, 255, 0.35)',
      opacity: '0.9'
    }
  });

  const handleImageChange = (image: string) => {
    setCurrCoverImage(image);
    if (onSetPreviewImage) onSetPreviewImage(image);
  };

  useEffect(() => {
    setCurrCoverImage(coverImage || galleryImages?.[0]);
  }, [coverImage, galleryImages]);

  const renderItem = (image: string, index: number) => {
    const isDragging = draggedIndex === index;
    const isDragOver = dragOverIndex === index;
    const cover = isCoverImage(index);
    const draggable = isDraggable(index);

    return (
      <div
        className={`gallery-image-wrapper ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
        key={index}
        draggable={draggable}
        onDragStart={draggable ? (e) => handleDragStart(e, index) : undefined}
        onDragOver={draggable ? (e) => handleDragOver(e, index) : undefined}
        onDragLeave={draggable ? handleDragLeave : undefined}
        onDrop={draggable ? (e) => handleDrop(e, index) : undefined}
        onDragEnd={draggable ? handleDragEnd : undefined}
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
        {onReorderImages && !cover && (
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
          width={1200}
          loading={coverPriority ? 'eager' : 'lazy'}
          priority={coverPriority}
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
